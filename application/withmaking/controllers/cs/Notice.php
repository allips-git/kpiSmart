<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 공지사항 관리 컨트롤러
 * @author , @version 1.0, @last date
 */
class Notice extends CI_Controller {

    protected $table = 'notice';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('cs/Notice_m');
	}

	public function index()
	{
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '공지사항 관리';
        $data['site_url'] = '/cs/notice';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('cs/notice', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 공지사항 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 카테고리(중요도)유형, 가용여부
     * @return warehouse list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'keyword'   => $this->input->post('keyword', TRUE),
            'content'   => $this->input->post('content', TRUE),
            'category'  => $this->input->post('category', TRUE),
            'useyn'     => $this->input->post('useyn', TRUE)
        );
        $data['list'] = $this->Notice_m->get_list($data['var']);
        exit(json_encode(['result'=>$data , 'sql'=>$this->db->last_query()])); // return result list
    }

    /**
     * @description 공지사항 상세
     */
    public function detail()
    {
        $data['ikey']       = $this->input->get('ikey',TRUE);
        // header, asize 디자인 유지용 파라미터
        $data['title']      = '공지사항';
        $data['site_url']   = '/cs/notice';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('cs/notice_v', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    /**
     * @description 공지사항 상세 데이터 세팅
     * @param 공지사항ikey
     */
    public function n_detail()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );

        $this->Notice_m->set_count($data['var']);
        $data['detail'] = $this->Notice_m->get_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    } 

    

    /**
     * @description 공지사항 등록
     */
    public function i()
    {
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '공지사항';
        $data['site_url'] = '/cs/notice';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('cs/notice_i', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    /**
     * @description 공지사항 등록 작업
     */
    public function n_i()
    {

        // 기본 변수 - 공장코드
        $local_cd = $this->session->userdata['local_cd'];

        // 등록 정보
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'category'      => $this->input->post('category', TRUE),
            'title'         => $this->input->post('title', TRUE),
            'content'       => $this->input->post('content', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );
        
        $result = $this->Common_m->insert($this->table, $data['reg']); // insert data
        $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
    }

    /**
     * @description 공지사항 수정
     */
    public function u()
    {
        $data['ikey']       = $this->input->get('ikey',TRUE);
        // header, asize 디자인 유지용 파라미터
        $data['title']      = '공지사항';
        $data['site_url']   = '/cs/notice';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('cs/notice_u', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    /**
     * @description 공지사항 수정 - update
     * @return result code [json] 
     */
    public function n_u()
    {
        // 수정 조건
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );

        // 수정 정보
        $data['mod'] = array(
            'category'      => $this->input->post('category', TRUE),
            'title'         => $this->input->post('title', TRUE),
            'content'       => $this->input->post('content', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );
        
        $result = $this->Common_m->update2($this->table, $data['mod'], $data['var']); // update data
        $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
    }

    /**
     * @description 공지사항 삭제 - delete
     * @return result code [json] 
     */
    public function d()
    {
        // 삭제 조건    
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'   => $this->input->post('ikey', TRUE),
            'sysyn'     => 'N'
        );
        
        // 공지사항 삭제
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0) // DB에 조건 값 있을경우 삭제 진행
        {
            $result = $this->Common_m->real_del($this->table, $data['var']);
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        } 
        else 
        {
            exit(json_encode(['code'=>400 , 'sql'=>$this->db->last_query()])); 
        }

    }

    /**
     * @description 공지사항 수정 데이터 세팅
     * @param 공지사항ikey
     */
    public function u_detail()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Notice_m->get_u_detail($data['var']);
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
                array('field'=>'title',        'label'=>'제목',          'rules'=>'trim|required'),
                array('field'=>'content',      'label'=>'내용',          'rules'=>'trim|required')
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
