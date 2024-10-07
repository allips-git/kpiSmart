<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 제조 BOM(Product bom) 등록 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/05
 */
class Prod_bom extends CI_Controller {

    protected $table  = 'bom_master';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('base/Prod_bom_m');
	}

	public function index()
	{
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '제조 BOM 등록';
        $data['site_url'] = '/base/prod_bom';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('base/prod_bom', $data);
        $this->load->view('include/base/bom_reg_pop', $data);
        $this->load->view('include/base/bom_mod_pop', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description BOM 전체 조회/검색 조회
     * @param 공장코드, 검색키워드, 검색텍스트, 가용여부
     * @return list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'keyword'   => $this->input->post('keyword', TRUE),
            'content'   => $this->input->post('content', TRUE),
            'useyn'     => $this->input->post('useyn', TRUE)
        );
        $data['list'] = $this->Prod_bom_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description BOM 상세 조회
     * @param 공장코드, ikey
     * @return detail [json] 
     */
    public function detail()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'item_cd'   => $this->input->post('item_cd', TRUE)
        );
        $data['detail'] = $this->Prod_bom_m->get_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 공정리스트 전체 조회
     * @param 공장코드, 검색 텍스트
     * @return list [json] 
     */
    public function proc_list()
    {
        // variable list
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'pc_uc'    => $this->input->post('pc_uc', TRUE),
            'content'  => $this->input->post('content', TRUE)
        );
        $data['list'] = $this->Prod_bom_m->get_proc_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 원부자재 상세조회
     * @param 공장코드, 제품ikey
     */
    public function item_detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Prod_bom_m->get_item_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 가용여부 변경 - update
     * @return result code [json] 
     */
    public function useyn()
    {
        // 구분자 A=마스터 업데이트, B=상세 테이블 업데이트
        $gb = $this->input->post('gb', TRUE);
        $table = ($gb == "A") ? $this->table : 'bom_detail';

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

        if ($this->Common_m->get_column_count($table, $data['unique']) > 0)
        {
            // modify data
            $result = $this->Common_m->update2($table, $data['mod'], $data['unique']);
        } 
        $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
    }

    /**
     * @description BOM 등록 - insert
     * @return result code [json] 
     */
    public function i()
    {
        // variable list
        $local_cd   = $this->session->userdata['local_cd'];
        $main_cd    = "BOM";
        $seq        = $this->Common_m->get_max2($this->table, 'bom_seq', array('local_cd'=>$local_cd))+1;
        $bom_seq    = sprintf('%02d', $seq);
        $bom_uc     = $local_cd.'-'.$main_cd.'-'.$bom_seq;

        $data['case1'] = array(
            'local_cd'  => $local_cd,
            'main_cd'   => $main_cd,
            'bom_uc'    => $bom_uc
        );

        $data['case2'] = array(
            'local_cd'  => $local_cd,
            'item_cd'   => $this->input->post('item_cd', TRUE)
        );

        // 마스터 등록정보
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'main_cd'       => $main_cd,
            'bom_seq'       => $bom_seq,
            'bom_uc'        => $bom_uc,
            'pc_uc'         => $this->input->post('pc_uc', TRUE),
            'item_cd'       => $this->input->post('item_cd', TRUE),
            'memo'          => $this->input->post('memo', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );

        // 상세 등록정보
        $data['sub'] = array(
            'local_cd'      => $local_cd,
            'bom_uc'        => $bom_uc,
            'pp_uc'         => $this->input->post('pp_uc', TRUE),
            'pp_nm'         => $this->input->post('pp_nm', TRUE),
            'item_cd'       => $this->input->post('buy_cd', TRUE),
            'usage'         => $this->input->post('usage', TRUE),
            'memo'          => $this->input->post('sub_memo', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );
        
        if ($this->Common_m->get_column_count($this->table, $data['case1']) == 0) // 고유코드 중복확인
        {
            if ($this->Common_m->get_column_count($this->table, $data['case2']) == 0) // 제품 중복 확인
            {
                $result = $this->Prod_bom_m->insert_batch($data['reg'], $data['sub']); // insert data
                $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
            }
            else
            {
                exit(json_encode(['code'=>400]));
            }
        }
        else // fail
        {
            exit(json_encode(['code'=>401]));
        }

    }

    /**
     * @description BOM 수정 - update
     * @return result code [json] 
     */
    public function u()
    {
        // 마스터 수정 조건
        $ikey = $this->input->post('ikey', TRUE);
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd'  => $local_cd,
            'bom_uc'    => $this->input->post('bom_uc', TRUE)
        );

        $data['unique'] = array(
            'local_cd'  => $local_cd,
            'item_cd'   => $this->input->post('item_cd', TRUE),
            'bom_uc !=' => $this->input->post('bom_uc', TRUE)
        );

        // 마스터 수정정보
        $data['mod'] = array(
            'memo'          => $this->input->post('memo', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );

        // 상세 수정정보
        $data['sub'] = array(
            'local_cd'      => $local_cd,
            'bom_uc'        => $this->input->post('bom_uc', TRUE),
            'pp_uc'         => $this->input->post('pp_uc', TRUE),
            'pp_nm'         => $this->input->post('pp_nm', TRUE),
            'item_cd'       => $this->input->post('buy_cd', TRUE),
            'usage'         => $this->input->post('usage', TRUE),
            'sub_memo'      => $this->input->post('sub_memo', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address(),
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );
        
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0) // 수정 가능한 대상 탐색  
        {
            if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0) // 제품 중복 확인
            {
                $result = $this->Prod_bom_m->update_batch($data['mod'], $data['sub'], $data['var']); // update data
                $result ? exit(json_encode(['code'=>100, 'result'=>$_POST])) : exit(json_encode(['code'=>999]));
            }
            else
            {
                exit(json_encode(['code'=>400]));
            }
        }
        else // fail
        {
            exit(json_encode(['code'=>401]));
        }

    }

    /**
     * @description BOM 삭제 - delete
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
        
        // DB에 조건 값 데이터 있을 경우 삭제
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0) 
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
                array('field'=>'item_cd',     'label'=>'제품은',              'rules'=>'trim|required'),
                array('field'=>'pc_uc',       'label'=>'라우팅은',            'rules'=>'trim|required'),
                array('field'=>'useyn',       'label'=>'가용여부는',          'rules'=>'trim|required'),
                array('field'=>'pp_uc[]',     'label'=>'공정은',              'rules'=>'trim|required'),
                array('field'=>'buy_cd[]',    'label'=>'품목은',              'rules'=>'trim|required'),
                array('field'=>'usage[]',     'label'=>'소요량은',            'rules'=>'trim|required|numeric')
            );
            
            $this->form_validation->set_rules($config);
            if ($this->form_validation->run() == TRUE) // success 
            {
                switch ($param) 
                {
                    case 'in':
                        exit(json_encode(['code'=>100, 'list'=>$_POST]));
                    break;
                    case 'up':
                        exit(json_encode(['code'=>200, 'list'=>$_POST]));
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
