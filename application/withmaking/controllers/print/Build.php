<?php
defined('BASEPATH') or exit('No direct script access allowed');

/**
 * @description 테스트 컨트롤러
 */
class Build extends CI_Controller
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
        $data['site_url'] = '/build';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        //$this->load->view('include/bms_side');
        $this->load->view('print/build', $data);
        //$this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }


}
