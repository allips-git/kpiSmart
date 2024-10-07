<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 구매 입고 관리 컨트롤러
 * @author , @version 1.0, @last date
 */
class Ord_put extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
	}

	public function index()
	{
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '구매 입고 관리';
        $data['site_url'] = '/ord/ord_buy';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('ord/ord_put', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

}
