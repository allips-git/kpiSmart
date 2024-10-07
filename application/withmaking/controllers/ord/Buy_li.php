<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 구매 발주 내역(팝업) 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date
 */
class Buy_li extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('ord/Buy_li_m');
	}

    /**
     * @description 구매 발주 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 날짜
     * @return buy list [json] 
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
        $data['list'] = $this->Buy_li_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

}