<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 창고(Warehouse) 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/05/11
 */
class W_house extends CI_Controller {

    protected $table  = 'warehouse';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('base/W_house_m');
        $this->encrypt_key = $this->config->item('encrypt_key');
	}

	public function index()
	{
        // 창고유형
        $data['gb'] = array(
            'code_gb'       =>  'BA',
            'code_main'     =>  '110',
            'code_sub >'    =>  '000',
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['wh_gb'] = $this->Common_m->get_result2('z_plan.common_code', $data['gb'], 'code_sub ASC');

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '창고 등록';
        $data['site_url'] = '/base/w_house';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('base/w_house', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 창고 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 창고유형, 가용여부
     * @return warehouse list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'keyword'   => $this->input->post('keyword', TRUE),
            'content'   => $this->input->post('content', TRUE),
            'wh_gb'     => $this->input->post('wh_gb', TRUE),
            'useyn'     => $this->input->post('useyn', TRUE)
        );
        $data['list'] = $this->W_house_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 창고 상세페이지
     * @param 창고ikey
     */
    public function detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->W_house_m->get_detail($data['var']);
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
        
        // 수정 정보
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
     * @description 창고 등록 - insert
     * @return result code [json] 
     */
    public function i()
    {
        // 기본 변수 - 공장코드, 창고 메인코드, 창고 순번, 창고 고유 코드
        $local_cd = $this->session->userdata['local_cd'];
        $main_cd = "WH";
        $wh_seq = sprintf('%02d',$this->Common_m->get_max2($this->table, 'wh_seq', array('local_cd'=>$local_cd))+1);
        $wh_uc = $local_cd."-".$main_cd."-".$wh_seq;
        $wh_nm = $this->input->post('wh_nm', TRUE);

        // 창고 코드 - 공장별로 부여된 창고 코드 MAX+10 생성
        $code = $this->W_house_m->get_code(array('local_cd'=>$local_cd));

        // 유일키 검증
        $data['unique'] = array(
            'local_cd'  => $local_cd,
            'main_cd'   => $main_cd,
            'wh_seq'    => $wh_seq
        );
        
        // 창고명 중복 확인
        if ($this->Common_m->get_column_count('warehouse', array('local_cd'=>$local_cd, 'wh_nm'=>$wh_nm)) > 0)
        {
            exit(json_encode(['code'=>400]));
        }

        // 암호화 변수
        $person      = $this->input->post('person', TRUE);
        $tel         = $this->input->post('tel', TRUE);
        $post_code   = $this->input->post('post_code', TRUE);
        $addr        = $this->input->post('addr', TRUE);
        $addr_detail = $this->input->post('addr_detail', TRUE);

        // 등록 정보
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'main_cd'       => $main_cd,
            'wh_seq'        => $wh_seq,
            'wh_uc'         => $wh_uc,
            'wh_cd'         => !empty($code->wh_cd) ? $code->wh_cd : "WH10",
            'wh_gb'         => $this->input->post('wh_gb', TRUE),
            'wh_no'         => sprintf('%01d',$this->Common_m->get_max2($this->table, 'wh_no', array('local_cd'=>$local_cd))+1),
            'wh_nm'         => $wh_nm,
            'person'        => !empty($person)      ? $this->common->custom_encrypt($person, $this->encrypt_key, 'AES-128-ECB') : '',
            'tel'           => !empty($tel)         ? $this->common->custom_encrypt($tel, $this->encrypt_key, 'AES-128-ECB') : '',
            'post_code'     => !empty($post_code)   ? $this->common->custom_encrypt($post_code, $this->encrypt_key, 'AES-128-ECB') : '',
            'addr'          => !empty($addr)        ? $this->common->custom_encrypt($addr, $this->encrypt_key, 'AES-128-ECB') : '',
            'addr_detail'   => !empty($addr_detail) ? $this->common->custom_encrypt($addr_detail, $this->encrypt_key, 'AES-128-ECB') : '',
            'memo'          => $this->input->post('memo', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );
        if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0)
        {
            $result = $this->Common_m->insert($this->table, $data['reg']); // insert data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else
        {
            exit(json_encode(['code'=>401]));
        }
    }


    /**
     * @description 창고 수정 - update
     * @return result code [json] 
     */
    public function u()
    {
        // 수정 조건
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['var2'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey!='    => $this->input->post('ikey', TRUE),
            'wh_nm'     => $this->input->post('wh_nm', TRUE)
        );
        
        // 창고명 중복 확인
        if ($this->Common_m->get_column_count('warehouse', $data['var2']) > 0)
        {
            exit(json_encode(['code'=>400]));
        }

        // 암호화 변수
        $person      = $this->input->post('person', TRUE);
        $tel         = $this->input->post('tel', TRUE);
        $post_code   = $this->input->post('post_code', TRUE);
        $addr        = $this->input->post('addr', TRUE);
        $addr_detail = $this->input->post('addr_detail', TRUE);

        // 수정 정보
        $data['mod'] = array(
            'wh_gb'         => $this->input->post('wh_gb', TRUE),
            'wh_nm'         => $this->input->post('wh_nm', TRUE),
            'person'        => !empty($person)      ? $this->common->custom_encrypt($person, $this->encrypt_key, 'AES-128-ECB') : '',
            'tel'           => !empty($tel)         ? $this->common->custom_encrypt($tel, $this->encrypt_key, 'AES-128-ECB') : '',
            'post_code'     => !empty($post_code)   ? $this->common->custom_encrypt($post_code, $this->encrypt_key, 'AES-128-ECB') : '',
            'addr'          => !empty($addr)        ? $this->common->custom_encrypt($addr, $this->encrypt_key, 'AES-128-ECB') : '',
            'addr_detail'   => !empty($addr_detail) ? $this->common->custom_encrypt($addr_detail, $this->encrypt_key, 'AES-128-ECB') : '',
            'memo'          => $this->input->post('memo', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0)
        {
            $result = $this->Common_m->update2($this->table, $data['mod'], $data['var']); // update data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else
        {
            exit(json_encode(['code'=>401]));
        }
    }

    /**
     * @description 창고 삭제 - delete
     * @return result code [json] 
     */
    public function d()
    {
        // 삭제 조건    
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE),
            'sysyn'     => 'N'
        );
        
        // 창고 삭제
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0) // DB에 조건 값 있을경우 삭제 진행
        {
            $result = $this->Common_m->real_del($this->table, $data['var']);
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        } 
        else 
        {
            exit(json_encode(['code'=>401])); 
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
                array('field'=>'wh_gb',        'label'=>'창고유형',          'rules'=>'trim|required'),
                array('field'=>'wh_nm',        'label'=>'창고명',            'rules'=>'trim|required')
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


}
