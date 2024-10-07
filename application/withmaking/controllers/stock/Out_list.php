<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 제품 출고 현황 관리(Product out list) 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/07/25
 */
class Out_list extends CI_Controller {

    protected $table  = 'stock_history';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('stock/Out_list_m');
	}

	public function index()
	{
        // 창고 리스트
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd'    => $local_cd,
            'useyn'       => 'Y',
            'delyn'       => 'N'
        );
        $data['wh_uc'] = $this->Common_m->get_result2('warehouse', $data['var'], 'wh_nm ASC');

        // 배송 담당자 리스트
        $data['var'] = array(
            'local_cd'    => $local_cd,
            'ul_gb'       => '005',
            'useyn'       => 'Y',
            'delyn'       => 'N'
        );
        $data['worker'] = $this->Common_m->get_result2('z_plan.user_list', $data['var'], 'ul_nm ASC');

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '제품 출고 현황 관리';
        $data['site_url'] = '/stock/out_list';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('stock/out_list', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 출고 현황 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 창고, 배송담당자, 진행 상태
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
            'state'     => $this->input->post('state', TRUE)
        );
        $data['list'] = $this->Out_list_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 배송사원 적용 - update
     * @return result code [json] 
     */
    public function wu()
    {
        // 수정 조건
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd' => $local_cd,
            'ikey'     => $this->input->post('ikey', TRUE)
        );

        // 수정 정보
        $data['mod'] = array(
            'local_cd'      => $local_cd,
            'ikey'          => $this->input->post('ikey', TRUE),
            'ul_uc'         => $this->input->post('ul_uc', TRUE),
            'sysyn'         => 'Y',
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );
        $result = $this->Out_list_m->update_batch_worker($data['mod'], $data['var']); // update data
        $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
    }

    /**
     * @description 출고 완료 적용 - update
     * @return result code [json] 
     */
    public function su()
    {
        // 수정 조건
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd' => $local_cd,
            'ikey'     => $this->input->post('ikey', TRUE)
        );

        // 수정 정보
        $data['mod'] = array(
            'local_cd'      => $local_cd,
            'ikey'          => $this->input->post('ikey', TRUE),
            'state'         => '006',
            'sysyn'         => 'Y',
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'today'         => date("Y-m-d H:i:s")
        );
        $result = $this->Out_list_m->update_batch_state($data['mod'], $data['var']); // update data
        $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
    }

    /**
     * @description 바코드 스캔용 출고 완료 - update
     * @return result code [json] 
     */
    public function bu()
    {
        // 수정 정보
        $data['mod'] = array(
            'local_cd'      => $this->session->userdata['local_cd'],
            'barcode'       => $this->input->post('barcode', TRUE),
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address()
        );
        $result = $this->Out_list_m->update_state($data['mod']); // update data
        $result ? exit(json_encode(['code'=>100, 'result'=> $result])) : exit(json_encode(['code'=>999]));
    }

}