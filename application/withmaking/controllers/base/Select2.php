<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description Select2 lib 전용 조회/상세조회 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/05
 */
class Select2 extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('base/Select2_m');
	}

    /**
     * @description 제품/품목 전체 조회/검색 조회
     * @param 공장코드, 검색 텍스트
     * @return item list [json] 
     */
    public function item_list()
    {
        // variable list
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'content'  => $this->input->post('content', TRUE)
        );
        $data['list'] = $this->Select2_m->get_item_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 제품/품목 상세 조회
     * @param 공장코드, 제품코드
     */
    public function item_detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'item_cd'   => $this->input->post('item_cd', TRUE)
        );
        $data['detail'] = $this->Select2_m->get_item_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 거래처별 제품 상세 조회
     * @param 공장코드, 거래처코드, 제품코드
     */
    public function client_item_detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'cust_cd'   => $this->input->post('cust_cd', TRUE),
            'item_cd'   => $this->input->post('item_cd', TRUE)
        );
        $data['detail'] = $this->Select2_m->get_client_item($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 매출 제품(상품 제외) 전체 조회/검색 조회
     * @param 공장코드, 검색 텍스트
     * @return sale item list [json] 
     */
    public function sale_list()
    {
        // variable list
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'content'  => $this->input->post('content', TRUE)
        );
        $data['list'] = $this->Select2_m->get_sale_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 매출 제품(상품 포함) 전체 조회/검색 조회
     * @param 공장코드, 검색 텍스트
     * @return sale item list [json] 
     */
    public function all_sale_list()
    {
        // variable list
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'content'  => $this->input->post('content', TRUE)
        );
        $data['list'] = $this->Select2_m->get_all_sale_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 매출 거래처 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return client list [json] 
     */
    public function biz_list()
    {
        // variable list
        $content = $this->input->post('content', TRUE);
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'content'  => $this->input->post('content', TRUE)
        );
        $data['list'] = $this->Select2_m->get_biz_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 매입 거래처 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return client list [json] 
     */
    public function buyer()
    {
        // variable list
        $content = $this->input->post('content', TRUE);
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'content'  => $this->input->post('content', TRUE)
        );
        $data['list'] = $this->Select2_m->get_buyer($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 라우팅 전체 조회
     * @param 공장코드, 검색 텍스트
     * @return sale item list [json] 
     */
    public function routing_list()
    {
        // variable list
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'content'  => $this->input->post('content', TRUE)
        );
        $data['list'] = $this->Select2_m->get_routing_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 라우팅 상세 조회
     * @param 공장코드, ikey
     * @return detail [json] 
     */
    public function routing_detail()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Select2_m->get_routing_detail($data['var']);
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
        $data['list'] = $this->Select2_m->get_proc_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 공정리스트 상세 조회
     * @param 공장코드, ikey
     * @return detail [json] 
     */
    public function proc_detail()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Select2_m->get_proc_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 원/부자재 조회/검색 조회
     * @param 공장코드, 검색 텍스트
     * @return sale item list [json] 
     */
    public function buy_list()
    {
        // variable list
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'content'  => $this->input->post('content', TRUE)
        );
        $data['list'] = $this->Select2_m->get_buy_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 원/부자재 상세조회
     * @param 공장코드, 제품ikey
     */
    public function buy_detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Select2_m->get_buy_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

}
