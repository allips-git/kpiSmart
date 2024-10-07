<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 원자재(매입제품) 관리 컨트롤러
 * @author , @version 1.0, @last date 2022/06/27
 */
class Buy_item extends CI_Controller {

    protected $table  = 'item_list';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('base/Buy_item_m');
	}

	public function index()
	{

        // 기본창고
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd'      => $local_cd,
            'useyn'         => 'Y',
            'delyn'         => 'N'
        );
        $data['wh_uc'] = $this->Common_m->get_result2('warehouse', $data['var'], 'wh_nm ASC');

        // 대표매입처
        $data['var2'] = array(
            'local_cd'      => $local_cd,
            'cust_gb !='    => "001",
            'useyn'         => 'Y',
            'delyn'         => 'N'
        );
        $data['buy_cd'] = $this->Common_m->get_result2('biz_list', $data['var2'], 'biz_nm ASC');
        


        // header, asize 디자인 유지용 파라미터
        $data['title'] = '원자재 관리';
        $data['site_url'] = '/base/buy_item';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('base/buy_item', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 원자재 리스트 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return factory item list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'keyword'   => $this->input->post('keyword', TRUE),
            'content'   => $this->input->post('content', TRUE),
            'item_lv'   => $this->input->post('item_lv', TRUE),
            'wh_uc'     => $this->input->post('wh_uc', TRUE),
            'useyn'     => $this->input->post('useyn', TRUE),
        );
        $data['list'] = $this->Buy_item_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 원자재 상세페이지
     * @param 공장코드, 제품ikey
     */
    public function detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Buy_item_m->get_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 품목분류 조회
     * @return item lv list [json] 
     */
    public function lv()
    {
        // 데이터 검증
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd'      =>  $local_cd,
            'key_level'     =>  '01',
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['item_lv'] = $this->Common_m->get_result2('item_code', $data['var'], 'key_name ASC');
        exit(json_encode(['result'=>$data])); // return result list
    } 

    /**
     * @description 품목분류 조회
     * @return item gb list [json] 
     */
    public function gb()
    {
        // 데이터 검증
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'code_gb'       =>  'BA',
            'code_main'     =>  '080',
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['item_gb'] = $this->Common_m->get_pick_category('z_plan.common_code', $data['var']);

        exit(json_encode(['result'=>$data])); // return result list
    } 


    /**
     * @description 원자재 리스트 등록 - insert
     * @return result code [json] 
     */
    public function i()
    {
        // 기본 변수 - 공장코드, 창고 메인코드, 창고 순번, 창고 고유 코드
        $local_cd = $this->session->userdata['local_cd'];
        $row = $this->Common_m->get_row('z_plan.factory', array('local_cd'=>$local_cd));
        $pm_cd = $row->platform;
        $pd_cd = $pm_cd."01";
        
        $main_cd = "B"; //원자재
        $item_seq = sprintf('%05d',$this->Common_m->get_max2($this->table, 'item_seq', array('local_cd'=>$local_cd, 'main_cd'=>$main_cd))+1);
        $item_cd = $local_cd.$main_cd.$item_seq;

        // 유일키 검증
        $data['unique'] = array(
            'local_cd'  => $local_cd,
            'main_cd'   => $main_cd,
            'item_seq'  => $item_seq
        );

        // 제품명 중복 검증
        $data['unique2'] = array(
            'local_cd'  => $local_cd,
            'item_nm'   => $this->input->post('item_nm', TRUE)
        );

        // 제품유형 - 상품(완제품)일 경우에만 매입단가 등록
        $item_gb    = $this->input->post('item_gb', TRUE);
        $unit_amt   = $this->input->post('unit_amt', TRUE);

        // 금액정보
        $safe_qty   = $this->input->post('safe_qty', TRUE);

        //spec
        $maker      = $this->input->post('maker', TRUE);
        $origin     = $this->input->post('origin', TRUE);
        $spec       = json_encode(['maker'=>$maker,'origin'=>$origin],JSON_UNESCAPED_UNICODE);

        //규격
        $size      = $this->input->post('size', TRUE);

        // 등록 정보
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'pm_cd'         => $pm_cd,
            'pd_cd'         => $pd_cd,
            'main_cd'       => $main_cd,
            'item_seq'      => $item_seq,
            'item_cd'       => $item_cd,
            'item_gb'       => $item_gb,
            'spec'          => $spec,
            'buy_cd'        => $this->input->post('buy_cd', TRUE),
            'item_lv'       => $this->input->post('item_lv', TRUE),
            'item_nm'       => $this->input->post('item_nm', TRUE),
            'size'          => !empty($size) ? str_replace( ",", "", $size) : 0,
            'unit'          => $this->input->post('unit', TRUE),
            'unit_amt'      => !empty($unit_amt) ? str_replace( ",", "", $unit_amt) : 0,
            'wh_uc'         => !empty($this->input->post('wh_uc', TRUE)) ? $this->input->post('wh_uc', TRUE) : '',
            'safe_qty'      => !empty($safe_qty) ? str_replace( ",", "", $safe_qty) : 0,
            'memo'          => $this->input->post('memo', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );

        // 연계 사용 테이블 업데이트
        $data['link'] = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0)
        {
            if ($this->Common_m->get_column_count($this->table, $data['unique2']) == 0)
            {
                $result = $this->Buy_item_m->insert($data['reg'], $data['link']); // insert data
                $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
            }
            else 
            {
                exit(json_encode(['code'=>401]));
            }
        }
        else
        {
            exit(json_encode(['code'=>402]));
        }

    }

    /**
     * @description 원자재 리스트 수정 - update
     * @return result code [json] 
     */
    public function u()
    {
        // 수정 조건
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );

        // 제품명 중복 검증
        $data['unique2'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey !='   => $this->input->post('ikey', TRUE),
            'item_nm'   => $this->input->post('item_nm', TRUE)
        );

        // 제품유형 - 상품(완제품)일 경우에만 매입단가 수정
        $item_gb    = $this->input->post('item_gb', TRUE);
        $unit_amt   = $this->input->post('unit_amt', TRUE);

        //spec
        $maker      = $this->input->post('maker', TRUE);
        $origin     = $this->input->post('origin', TRUE);
        $spec       = json_encode(['maker'=>$maker,'origin'=>$origin],JSON_UNESCAPED_UNICODE);

        // 금액정보
        $safe_qty   = $this->input->post('safe_qty', TRUE);

        // 수정 정보
        $data['mod'] = array(
            'item_gb'       => $item_gb,
            'item_lv'       => $this->input->post('item_lv', TRUE),
            'item_nm'       => $this->input->post('item_nm', TRUE),
            'size'          => $this->input->post('size', TRUE),
            'unit'          => $this->input->post('unit', TRUE),
            'spec'          => $spec,
            'buy_cd'        => $this->input->post('buy_cd', TRUE),
            'unit_amt'      => !empty($unit_amt) ? str_replace( ",", "", $unit_amt) : 0,
            'wh_uc'         => !empty($this->input->post('wh_uc', TRUE)) ? $this->input->post('wh_uc', TRUE) : '',
            'safe_qty'      => !empty($safe_qty) ? str_replace( ",", "", $safe_qty) : 0,
            'memo'          => $this->input->post('memo', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );

        // 연계 사용 테이블 업데이트
        $data['link'] = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );
        
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0)
        {
            if ($this->Common_m->get_column_count($this->table, $data['unique2']) == 0)
            {
                $result = $this->Buy_item_m->update($data['mod'], $data['var'], $data['link']); // update data
                $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
            }
            else 
            {
                exit(json_encode(['code'=>401]));
            }
        }
        else
        {
            exit(json_encode(['code'=>402]));
        }

    }

    /**
     * @description 원자재 리스트 삭제 - delete
     * @return result code [json] 
     */
    public function d()
    {
        // 삭제 조건 - 시스템 미사용 상태만 삭제가능(sysyn="N")
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE),
            'sysyn'     => "N"
        );
        
        // 삭제
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0) // DB에 조건 값 일치할 경우 삭제 진행
        {
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

            $param      = $this->input->post('p', TRUE);
            // $item_gb    = $this->input->post('item_gb', TRUE);
            // $unit_amt   = $this->input->post('unit_amt', TRUE);

            // 에러문구 관련 정의
            //$this->form_validation->set_error_delimiters('<font color=red>', '</font><br/>');
            $this->form_validation->set_message('required',         '%s 필수 입력 항목입니다.');
            $this->form_validation->set_message('numeric',          '%s 숫자만 입력해 주세요.');
            $this->form_validation->set_message('valid_email',      '%s 이메일 형식이 올바르지 않습니다.');
            $this->form_validation->set_message('integer',          '%s 정수만 입력 가능합니다.');
            $this->form_validation->set_message('alpha_dash',       '%s 알파벳,숫자,_,- 만 사용 가능합니다.');
            $this->form_validation->set_message('min_length',       '%s 길이는 %d 자리 이내만 가능합니다.');
            $this->form_validation->set_message('max_length',       '%s 길이는 %d 자리 이내만 가능합니다.');
            $this->form_validation->set_message('greater_than',     '%s 1개(원) 이상 입력 가능합니다.');
            $this->form_validation->set_message('less_than',        '%s 이하 입력 가능합니다.');
            $this->form_validation->set_message('alpha',            '%s 알파벳만 입력 가능합니다.');
            $this->form_validation->set_message('alpha_numeric',    '%s 알파벳, 숫자만 입력 가능합니다.');
            $this->form_validation->set_message('valid_url',        '%s URL 형식이 올바르지 않습니다.');
            $this->form_validation->set_message('valid_ip',         '%s IP 형식이 올바르지 않습니다.');

            $config = array(
                array('field'=>'useyn',        'label'=>'가용 여부는',       'rules'=>'trim|required'),
                array('field'=>'item_gb',      'label'=>'품목 유형은',       'rules'=>'trim|required'),
                array('field'=>'item_lv',      'label'=>'품목분류는',        'rules'=>'trim|required'),
                array('field'=>'item_nm',      'label'=>'품목명은',          'rules'=>'trim|required'),
                array('field'=>'size',         'label'=>'규격은',            'rules'=>'trim|required'),
                array('field'=>'unit_amt',     'label'=>'매입단가는',        'rules'=>'trim|required|callback_num_check|callback_zero_check'),
                array('field'=>'wh_uc',        'label'=>'기본 창고는',       'rules'=>'trim'),
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
     * @description 금액 입력폼 검증 (숫자, 콤마만 허용)
     * @return result code [bool] 
     */
    public function num_check($param)
    {
        if (!preg_match('/[0-9,]/', strval($param)) && !empty($param))
        {
            $this->form_validation->set_message('num_check', '%s 숫자,콤마 만 사용 가능합니다.');
            return FALSE;
        }
        else
        {
            return TRUE;
        }
    }

    /**
     * @description 금액 입력폼 검증 (숫자, 콤마만 허용)
     * @return result code [bool] 
     */
    public function zero_check($param)
    {
        if (!floatval(str_replace( ",", "", $param)) > 0)
        {
            $this->form_validation->set_message('zero_check', '%s 1개(원) 이상 입력 가능합니다.');
            return FALSE;
        }
        else
        {
            return TRUE;
        }
    }  

}
