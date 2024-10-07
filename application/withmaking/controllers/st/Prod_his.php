<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 제품 생산 현황 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/29
 */
class Prod_his extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('st/Prod_his_m');
	}

	public function index()
	{
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '제품 생산 현황';
        $data['site_url'] = '/st/prod_his';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('st/prod_his', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 제품 생산 현황 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 기간
     * @return work list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'keyword'   => $this->input->post('keyword', TRUE),
            'content'   => $this->input->post('content', TRUE),
            'start_dt'  => $this->input->post('start_dt', TRUE),
            'end_dt'    => $this->input->post('end_dt', TRUE)
        );
        $data['list'] = $this->Prod_his_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

}
