<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 거래처 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/05/17
 */
class Client extends CI_Controller {

    protected $table  = 'biz_list';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('biz/Client_m');
        $this->encrypt_key = $this->config->item('encrypt_key');
	}

	public function index()
	{
        $local_cd = $this->session->userdata['local_cd'];

        // 거래처 구분
        $data['gb'] = array(
            'code_gb'       =>  'BU',
            'code_main'     =>  '160',
            'code_sub >'    =>  '000',
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['cust_gb'] = $this->Common_m->get_result2('z_plan.common_code', $data['gb'], 'code_sub ASC');

        // 거래처 등급
        $amt_cnt = $this->Common_m->get_count('factory_amt_nm', array('local_cd' => $local_cd));
        if ($amt_cnt > 0)
        {
            $data['cust_grade'] = $this->Common_m->get_row('factory_amt_nm', array('local_cd' => $local_cd));
        }
        else
        {
            $data['cust_grade'] = $this->Common_m->get_row('factory_amt_nm', array('ikey' => 1));
        }

        // 은행코드
        $data['gb2'] = array(
            'code_gb'       =>  'AC',
            'code_main'     =>  '030',
            'code_sub >'    =>  '000',
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['bl_nm'] = $this->Common_m->get_result2('z_plan.common_code', $data['gb2'], 'code_sub ASC');

        // 영업사원
        $data['person'] = array(
            'local_cd'      =>  $local_cd,
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['sales'] = $this->Common_m->get_result2('z_plan.user_list', $data['person'], 'ul_nm ASC');

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '고객 관리';
        $data['site_url'] = '/biz/client';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('biz/client', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 거래처 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 업체구분, 등급, 영업담당자, 가용여부
     * @return client list [json] 
     */
    public function list()
    {
        // variable list
        $content = $this->input->post('content', TRUE);
        $data['var'] = array(
            'local_cd'      => $this->session->userdata['local_cd'],
            'keyword'       => $this->input->post('keyword', TRUE),
            'content'       => $this->input->post('content', TRUE),
            'cust_gb'       => $this->input->post('cust_gb', TRUE),
            'cust_grade'    => $this->input->post('cust_grade', TRUE),
            'sales_person'  => $this->input->post('sales_person', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE)
        );
        $data['list'] = $this->Client_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 거래처 상세페이지
     * @param 거래처ikey
     */
    public function detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Client_m->get_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }  

    /**
     * @description 가용여부 변경 - update
     * @return result code [json] 
     */
    public function useyn()
    {

        // 데이터 검증
        $data['unique'] = array(
            'ikey' => $this->input->post('ikey', TRUE)
        );
        
        // sysyn="N" 일때 수정 가능한 값
        $useyn = $this->input->post('useyn', TRUE);
        $data['mod'] = array(
            'useyn'     => $useyn == "N" ? "Y" : "N",
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        if ($this->Common_m->get_column_count($this->table, $data['unique']) > 0)
        {
            // modify data
            $result = $this->Common_m->update2($this->table, $data['mod'], $data['unique']);
        } 
        $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));

    }

    /**
     * @description 거래처 등록 - insert
     * @return result code [json] 
     */
    public function i()
    {
        // 기본 변수 - 공장코드, 거래처 메인코드, 거래처 순번, 거래처 고유 코드
        $local_cd = $this->session->userdata['local_cd'];
        $main_cd = "C";
        $biz_seq = sprintf('%05d',$this->Common_m->get_max2($this->table, 'biz_seq', array('local_cd'=>$local_cd))+1);
        $cust_cd = $local_cd.$main_cd.$biz_seq;

        // 유일키 검증
        $data['unique'] = array(
            'local_cd'  => $local_cd,
            'main_cd'   => $main_cd,
            'biz_seq'   => $biz_seq
        );

        // 사업자번호 중복검증
        $biz_num = $this->input->post('biz_num', TRUE);
        $data['unique_num'] = array(
            'local_cd'  => $local_cd,
            'biz_num'   => $this->common->custom_encrypt($biz_num, $this->encrypt_key, 'AES-128-ECB')
        );
        $unique_num = !empty($biz_num) ? $this->Common_m->get_column_count($this->table, $data['unique_num']) : 0;

        // 암호화 변수
        $biz_num        = $this->input->post('biz_num', TRUE);
        $cust_num       = $this->input->post('cust_num', TRUE);
        $ceo_nm         = $this->input->post('ceo_nm', TRUE);
        $ceo_tel        = $this->input->post('ceo_tel', TRUE);
        $tel            = $this->input->post('tel', TRUE);
        $fax            = $this->input->post('fax', TRUE);
        $email          = $this->input->post('email', TRUE);
        $biz_zip        = $this->input->post('biz_zip', TRUE);
        $address        = $this->input->post('address', TRUE);
        $addr_detail    = $this->input->post('addr_detail', TRUE);
        $person         = $this->input->post('person', TRUE);
        $person_tel     = $this->input->post('person_tel', TRUE);
        $holder_nm      = $this->input->post('holder_nm', TRUE);
        $bl_num         = $this->input->post('bl_num', TRUE);
        $dlv_zip        = $this->input->post('dlv_zip', TRUE);
        $dlv_addr       = $this->input->post('dlv_addr', TRUE);
        $dlv_detail     = $this->input->post('dlv_detail', TRUE);

        // 등록 정보
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'main_cd'       => $main_cd,
            'biz_seq'       => $biz_seq,
            'cust_cd'       => $cust_cd,
            'cust_nm'       => $this->input->post('cust_nm', TRUE),
            'biz_nm'        => $this->input->post('biz_nm', TRUE),
            'cust_gb'       => $this->input->post('cust_gb', TRUE),
            'biz_num'       => !empty($biz_num)     ? $this->common->custom_encrypt($biz_num, $this->encrypt_key, 'AES-128-ECB') : '',
            'cust_num'      => !empty($cust_num)    ? $this->common->custom_encrypt($cust_num, $this->encrypt_key, 'AES-128-ECB') : '',
            'ceo_nm'        => !empty($ceo_nm)      ? $this->common->custom_encrypt($ceo_nm, $this->encrypt_key, 'AES-128-ECB') : '',
            'ceo_tel'       => !empty($ceo_tel)     ? $this->common->custom_encrypt($ceo_tel, $this->encrypt_key, 'AES-128-ECB') : '',
            'cust_grade'    => $this->input->post('cust_grade', TRUE),
            'dlv_gb'        => $this->input->post('dlv_gb', TRUE),
            'biz_class '    => $this->input->post('biz_class', TRUE),
            'biz_type'      => $this->input->post('biz_type', TRUE),
            'tel'           => !empty($tel)         ? $this->common->custom_encrypt($tel, $this->encrypt_key, 'AES-128-ECB') : '',
            'fax'           => !empty($fax)         ? $this->common->custom_encrypt($fax, $this->encrypt_key, 'AES-128-ECB') : '',
            'email'         => !empty($email)       ? $this->common->custom_encrypt($email, $this->encrypt_key, 'AES-128-ECB') : '',
            'biz_zip'       => !empty($biz_zip)     ? $this->common->custom_encrypt($biz_zip, $this->encrypt_key, 'AES-128-ECB') : '',
            'address'       => !empty($address)     ? $this->common->custom_encrypt($address, $this->encrypt_key, 'AES-128-ECB') : '',
            'addr_detail'   => !empty($addr_detail) ? $this->common->custom_encrypt($addr_detail, $this->encrypt_key, 'AES-128-ECB') : '',
            'person'        => !empty($person)      ? $this->common->custom_encrypt($person, $this->encrypt_key, 'AES-128-ECB') : '',
            'person_tel'    => !empty($person_tel)  ? $this->common->custom_encrypt($person_tel, $this->encrypt_key, 'AES-128-ECB') : '',
            'holder_nm'     => !empty($holder_nm)   ? $this->common->custom_encrypt($holder_nm, $this->encrypt_key, 'AES-128-ECB') : '',
            'bl_nm'         => $this->input->post('bl_nm', TRUE),
            'bl_num'        => !empty($bl_num)      ? $this->common->custom_encrypt($bl_num, $this->encrypt_key, 'AES-128-ECB') : '',
            'sales_person'  => $this->input->post('sales_person', TRUE),
            'vat'           => $this->input->post('vat', TRUE),
            'dlv_zip'       => !empty($dlv_zip)     ? $this->common->custom_encrypt($dlv_zip, $this->encrypt_key, 'AES-128-ECB') : '',
            'dlv_addr'      => !empty($dlv_addr)    ? $this->common->custom_encrypt($dlv_addr, $this->encrypt_key, 'AES-128-ECB') : '',
            'dlv_detail'    => !empty($dlv_detail)  ? $this->common->custom_encrypt($dlv_detail, $this->encrypt_key, 'AES-128-ECB') : '',
            'memo'          => $this->input->post('memo', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );
        if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0)
        {
            if ($unique_num == 0) // 사업자 등록번호 중복 검증. NULL일때는 검증 제외
            {
                $result = $this->Common_m->insert($this->table, $data['reg']); // insert data
                $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
            }
            else
            {
                exit(json_encode(['code'=>401]));
            }
        }
        else
        {
            exit(json_encode(['code'=>400]));
        }
    }

    /**
     * @description 거래처 수정 - update
     * @return result code [json] 
     */
    public function u()
    {
        // 수정 조건
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );

        // 사업자번호 중복검증
        $biz_num = $this->input->post('biz_num', TRUE);
        $data['unique_num'] = array(
            'local_cd'  => $data['var']['local_cd'],
            'ikey !='   => $data['var']['ikey'],
            'biz_num'   => $this->common->custom_encrypt($biz_num, $this->encrypt_key, 'AES-128-ECB')
        );
        $unique_num = !empty($biz_num) ? $this->Common_m->get_column_count($this->table, $data['unique_num']) : 0;

        // 암호화 변수
        $biz_num        = $biz_num;
        $cust_num       = $this->input->post('cust_num', TRUE);
        $ceo_nm         = $this->input->post('ceo_nm', TRUE);
        $ceo_tel        = $this->input->post('ceo_tel', TRUE);
        $tel            = $this->input->post('tel', TRUE);
        $fax            = $this->input->post('fax', TRUE);
        $email          = $this->input->post('email', TRUE);
        $biz_zip        = $this->input->post('biz_zip', TRUE);
        $address        = $this->input->post('address', TRUE);
        $addr_detail    = $this->input->post('addr_detail', TRUE);
        $person         = $this->input->post('person', TRUE);
        $person_tel     = $this->input->post('person_tel', TRUE);
        $holder_nm      = $this->input->post('holder_nm', TRUE);
        $bl_num         = $this->input->post('bl_num', TRUE);
        $dlv_zip        = $this->input->post('dlv_zip', TRUE);
        $dlv_addr       = $this->input->post('dlv_addr', TRUE);
        $dlv_detail     = $this->input->post('dlv_detail', TRUE);

        // 수정 정보
        $data['mod'] = array(
            'cust_nm'       => $this->input->post('cust_nm', TRUE),
            'biz_nm'        => $this->input->post('biz_nm', TRUE),
            'cust_gb'       => $this->input->post('cust_gb', TRUE),
            'biz_num'       => !empty($biz_num)     ? $this->common->custom_encrypt($biz_num, $this->encrypt_key, 'AES-128-ECB') : '',
            'cust_num'      => !empty($cust_num)    ? $this->common->custom_encrypt($cust_num, $this->encrypt_key, 'AES-128-ECB') : '',
            'ceo_nm'        => !empty($ceo_nm)      ? $this->common->custom_encrypt($ceo_nm, $this->encrypt_key, 'AES-128-ECB') : '',
            'ceo_tel'       => !empty($ceo_tel)     ? $this->common->custom_encrypt($ceo_tel, $this->encrypt_key, 'AES-128-ECB') : '',
            'cust_grade'    => $this->input->post('cust_grade', TRUE),
            'dlv_gb'        => $this->input->post('dlv_gb', TRUE),
            'biz_class '    => $this->input->post('biz_class', TRUE),
            'biz_type'      => $this->input->post('biz_type', TRUE),
            'tel'           => !empty($tel)         ? $this->common->custom_encrypt($tel, $this->encrypt_key, 'AES-128-ECB') : '',
            'fax'           => !empty($fax)         ? $this->common->custom_encrypt($fax, $this->encrypt_key, 'AES-128-ECB') : '',
            'email'         => !empty($email)       ? $this->common->custom_encrypt($email, $this->encrypt_key, 'AES-128-ECB') : '',
            'biz_zip'       => !empty($biz_zip)     ? $this->common->custom_encrypt($biz_zip, $this->encrypt_key, 'AES-128-ECB') : '',
            'address'       => !empty($address)     ? $this->common->custom_encrypt($address, $this->encrypt_key, 'AES-128-ECB') : '',
            'addr_detail'   => !empty($addr_detail) ? $this->common->custom_encrypt($addr_detail, $this->encrypt_key, 'AES-128-ECB') : '',
            'person'        => !empty($person)      ? $this->common->custom_encrypt($person, $this->encrypt_key, 'AES-128-ECB') : '',
            'person_tel'    => !empty($person_tel)  ? $this->common->custom_encrypt($person_tel, $this->encrypt_key, 'AES-128-ECB') : '',
            'holder_nm'     => !empty($holder_nm)   ? $this->common->custom_encrypt($holder_nm, $this->encrypt_key, 'AES-128-ECB') : '',
            'bl_nm'         => $this->input->post('bl_nm', TRUE),
            'bl_num'        => !empty($bl_num)      ? $this->common->custom_encrypt($bl_num, $this->encrypt_key, 'AES-128-ECB') : '',
            'sales_person'  => $this->input->post('sales_person', TRUE),
            'vat'           => $this->input->post('vat', TRUE),
            'dlv_zip'       => !empty($dlv_zip)     ? $this->common->custom_encrypt($dlv_zip, $this->encrypt_key, 'AES-128-ECB') : '',
            'dlv_addr'      => !empty($dlv_addr)    ? $this->common->custom_encrypt($dlv_addr, $this->encrypt_key, 'AES-128-ECB') : '',
            'dlv_detail'    => !empty($dlv_detail)  ? $this->common->custom_encrypt($dlv_detail, $this->encrypt_key, 'AES-128-ECB') : '',
            'memo'          => $this->input->post('memo', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s", time())
        );
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0)
        {
            if ($unique_num == 0) // 사업자 등록번호 중복 검증. NULL일때는 검증 제외
            {
                $result = $this->Common_m->update2($this->table, $data['mod'], $data['var']); // update data
                $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
            }
            else
            {
                exit(json_encode(['code'=>401]));
            }
        }
        else
        {
            exit(json_encode(['code'=>400]));
        }
    }

    /**
     * @description 거래처 삭제 - delete
     * @return result code [json] 
     */
    public function d()
    {
        // 삭제 조건    
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE),
            'sysyn'     => "N"
        );
        
        // 거래처 삭제
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0) // DB에 조건 값 있을경우 삭제 진행
        {
            // 사용 내역 있을경우 비활성화. 없을경우 DB삭제(기능 미구현. 사용처 확정되면 리뉴얼 예정)
            /*if ($this->Common_m->get_column_count('factory_ord_detail', $data['var']) > 0) 
            {
                $result = $this->Common_m->update2($this->table, array('useyn'=>'N', 'delyn'=>'Y'), $data['var']);
            } 
            else 
            {
                $result = $this->Common_m->real_del($this->table, $data['var']);
            }*/
            $result = $this->Common_m->real_del($this->table, $data['var']);
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        } 
        else 
        {
            exit(json_encode(['code'=>400])); 
        }

    }

    /**
     * @description 등록/수정 폼 검증 - validation
     * @return result code [json] 
     */
    public function v() 
    {
        if (isset($_POST['p'])) 
        {
            $param = $this->input->post('p', TRUE);

            // 에러문구 관련 정의
            // $this->form_validation->set_error_delimiters('<font color=red>', '</font><br/>');
            $this->form_validation->set_message('required',     '%s 입력 해주세요.');
            $this->form_validation->set_message('alpha_dash',   '%s 알파벳,숫자,_,- 만 사용 가능합니다.');
            $this->form_validation->set_message('min_length',   '%s 길이는 4~12자리 이내만 가능합니다.');
            $this->form_validation->set_message('max_length',   '%s 길이는 4~12자리 이내만 가능합니다.');
            $this->form_validation->set_message('greater_than', '%s (cm) 이상 주문 가능합니다.');
            $this->form_validation->set_message('less_than',    '%s (cm) 이하 주문 가능합니다.');
            $this->form_validation->set_message('numeric',      '%s 숫자만 입력 해주세요.');
            $this->form_validation->set_message('valid_email',  '%s 이메일 형식이 올바르지 않습니다.');

            $config = array(
                array('field'=>'useyn',        'label'=>'가용여부',          'rules'=>'trim|required'),
                array('field'=>'cust_nm',      'label'=>'거래처명',          'rules'=>'trim|required'),
                array('field'=>'biz_nm',       'label'=>'사업장(고객)명',     'rules'=>'trim|required'),
                array('field'=>'cust_gb',      'label'=>'업체구분',           'rules'=>'trim|required'),
                array('field'=>'biz_num',      'label'=>'사업자등록번호',     'rules'=>'trim|callback_num_check'),
                array('field'=>'cust_num',     'label'=>'주민번호',           'rules'=>'trim|callback_num_check'),
                array('field'=>'ceo_tel',      'label'=>'대표자연락처',       'rules'=>'trim|callback_num_check'),
                array('field'=>'tel',          'label'=>'전화번호',           'rules'=>'trim|callback_num_check'),
                array('field'=>'fax',          'label'=>'팩스번호',           'rules'=>'trim|callback_num_check'),
                array('field'=>'person_tel',   'label'=>'담당자연락처',        'rules'=>'trim|callback_num_check'),
                array('field'=>'bl_num',       'label'=>'계좌번호',           'rules'=>'trim|callback_num_check'),
                array('field'=>'email',        'label'=>'이메일주소',         'rules'=>'trim|valid_email')
            );
            
            $this->form_validation->set_rules($config);
            if ($this->form_validation->run() == TRUE) // success 
            {
                switch ($param) 
                {
                    case 'in':
                        exit(json_encode(['code'=>100]));
                    break;
                    case 'up':
                        exit(json_encode(['code'=>200]));
                    break;
                    case 'del':
                        exit(json_encode(['code'=>300]));
                    break;
                }
            } 
            else // validation fail 
            {   
                exit(json_encode(['code'=>999, 'err_msg'=>validation_errors()]));
            }
        } 
        else // params fail 
        {
            exit(json_encode(['code'=>999, 'err_msg'=>validation_errors()]));
       }
   }

    /**
     * @description 숫자, 하이픈만 허용토록 입력값 추가 검증
     * @return result code [bool] 
     */
    public function num_check($param)
    {
        if (!preg_match('/^[\-+]?[0-9-]*\.?[0-9-]+$/', strval($param)) && !empty($param))
        {
            $this->form_validation->set_message('num_check', '%s 숫자,- 만 사용 가능합니다.');
            return FALSE;
        }
        else
        {
            return TRUE;
        }
    } 

}
