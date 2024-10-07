<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 수도계량(Water gauge) 관리 컨트롤러
 * @author 안성준, @version 1.0, @last date 2022/07/31
 */
class Water_gauge extends CI_Controller {

    protected $table  = 'water_gauge';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('wk/Water_gauge_m');
	}

	public function index()
	{
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '수도계량 등록';
        $data['site_url'] = '/wk/water_gauge';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('wk/water_gauge', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 수도계량 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 계량단위
     * @return warehouse list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'keyword'   => $this->input->post('keyword', TRUE),
            'content'   => $this->input->post('content', TRUE),
            'unit'      => $this->input->post('wg_gb', TRUE)
        );
        $data['list'] = $this->Water_gauge_m->get_list($data['var']);
        exit(json_encode(['result'=>$data , 'sql'=>$this->db->last_query()])); // return result list
    }

    /**
     * @description 수도계량 상세페이지
     * @param 수도계량 공장코드, ikey
     */
    public function detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Water_gauge_m->get_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    } 

    /**
     * @description 수도 계량 정보 등록 - insert
     * @return result code [json] 
     */
    public function i()
    {

        // 기본 변수 - 공장코드
        $local_cd = $this->session->userdata['local_cd'];
        $base_dt  = $this->input->post('base_dt', TRUE);

        // 유일키 검증
        $data['unique'] = array(
            'local_cd'  => $local_cd,
            'base_dt'   => $base_dt,
        );

        // 등록 정보
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'base_dt'       => $base_dt,
            'volume'        => $this->input->post('volume', TRUE),
            'unit'          => $this->input->post('unit', TRUE),
            'memo'          => $this->input->post('memo', TRUE),
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
            exit(json_encode(['code'=>400]));
        }
    }

    /**
     * @description 수도 계량 수정 - update
     * @return result code [json] 
     */
    public function u()
    {
        // 수정 조건
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );

        // 수정 정보 검증
        $data['unique'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'base_dt'   => $this->input->post('base_dt', TRUE),
            'ikey !='   => $this->input->post('ikey', TRUE)
        );

        // 수정 정보
        $data['mod'] = array(
            'base_dt'       => $this->input->post('base_dt', TRUE),
            'volume'        => $this->input->post('volume', TRUE),
            'unit'          => $this->input->post('unit', TRUE),
            'memo'          => $this->input->post('memo', TRUE),
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0)
        {
            if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0)
            {
                $result = $this->Common_m->update2($this->table, $data['mod'], $data['var']); // update data
                $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
            }
            else
            {
                exit(json_encode(['code'=>600]));
            }
            
        }
        else
        {
            exit(json_encode(['code'=>400]));
        }
    }

    /**
     * @description 수도 계량 삭제 - delete
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
        
        // 수도 계량 정보 삭제
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0) // DB에 조건 값 있을경우 삭제 진행
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
                array('field'=>'volume',       'label'=>'사용량',            'rules'=>'trim|required'),
                array('field'=>'base_dt',      'label'=>'기분일',            'rules'=>'trim|required'),
                array('field'=>'unit',         'label'=>'사용량',            'rules'=>'trim|required')
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
