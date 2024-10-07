<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 입/출고 이력 조회 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/07/23
 */
class Inout_li extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('stock/Inout_li_m');
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

        // 작업 상세
        $data['var'] = array(
            'code_gb'     => 'WK',
            'code_main'   => '030',
            'code_sub >'  => '000',
            'useyn'       => 'Y',
            'delyn'       => 'N'
        );
        $data['details'] = $this->Common_m->get_result2('z_plan.common_code', $data['var'], 'code_sub ASC');

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '입출고 이력 조회';
        $data['site_url'] = '/stock/inout_li';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('stock/inout_li', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');

	}

    /**
     * @description 입/출고 리스트 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 기간, 창고, 작업 상세
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
            'end_dt'    => $this->input->post('end_dt', TRUE),
            'wh_uc'     => $this->input->post('wh_uc', TRUE),
            'details'   => $this->input->post('details', TRUE)
        );
        $data['list'] = $this->Inout_li_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

}
