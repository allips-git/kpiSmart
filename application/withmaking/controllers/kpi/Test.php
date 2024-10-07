<?php
defined('BASEPATH') or exit('No direct script access allowed');

/**
 * @description 테스트 컨트롤러
 */
class Test extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->allow = array('index'); // check login hook
        $this->load->model('pr/Prod_list_m');
    }

    public function index()     // 드론월드
    {

        // header, asize 디자인 유지용 파라미터
        $data['site_url'] = '/test';
        $data['title'] = 'kpi 관리';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('kpi/test', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');


        $data['list'] = $this->Prod_list_m->get_print_list($data['var']);

    }

    public function get_list()
    {
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'keyword' => '',
            'content' => '',
            'start_dt' => '2020-01-01',
            'end_dt' => '2024-12-31',
        );

        $data['list'] = $this->Prod_list_m->get_print_list($data['var']);
        exit(json_encode(['result' => $data]));
    }
}
