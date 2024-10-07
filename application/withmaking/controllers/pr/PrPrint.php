
<?php
defined('BASEPATH') or exit('No direct script access allowed');

/**
 * @description 생산 작업 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/12
 */

class PrPrint extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->allow = array(''); // check login hook

    }

    public function index()
    {
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '생산 작업 관리';
        $data['site_url'] = '/pr/PrPrint';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('pr/print', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    

}
