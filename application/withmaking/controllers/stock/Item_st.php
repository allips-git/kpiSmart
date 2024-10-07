<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 원자재 재고(Item Stock) 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/10/17
 */
class Item_st extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('stock/Item_st_m');
	}

	public function index()
	{
        // 전체 창고
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd'    => $local_cd,
            'useyn'       => 'Y',
            'delyn'       => 'N'
        );
        $data['wh_uc'] = $this->Common_m->get_result2('warehouse', $data['var'], 'wh_nm ASC');

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '원자재 재고 관리';
        $data['site_url'] = '/stock/item_st';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('stock/item_st', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 원자재 재고 리스트 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 기간, 창고, 자재 유형
     * @return stock list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'keyword'   => $this->input->post('keyword', TRUE),
            'content'   => $this->input->post('content', TRUE),
            'wh_uc'     => $this->input->post('wh_uc', TRUE),
            'item_gb'   => $this->input->post('item_gb', TRUE),
            'safe_gb'   => $this->input->post('safe_gb', TRUE)
        );
        $data['list'] = $this->Item_st_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

}
