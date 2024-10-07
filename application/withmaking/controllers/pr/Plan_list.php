<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 생산 계획(job plan) 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date
 */
class Plan_list extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
	}

    public function index()
    {
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '생산 계획 관리';
        $data['site_url'] = '/pr/plan_list';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('pr/plan_list', $data);
        $this->load->view('include/pr/plan_reg_pop', $data);
        $this->load->view('include/pr/plan_mod_pop', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    public function in()
    {
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '생산 계획 등록';
        $data['site_url'] = '/pr/plan_list';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('pr/plan_reg', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    public function up()
    {
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '생산 계획 수정';
        $data['site_url'] = '/pr/plan_list';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('pr/plan_mod', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

}