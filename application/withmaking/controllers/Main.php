<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 메인페이지 관리 컨트롤러
 * @author , @version, @last date
 */
class Main extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->allow=array(''); // check login hook
		$this->load->model('/Main_m');
	}

	public function index()
	{
		// variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd']
        );
		$data['notice'] = $this->Main_m->get_notice($data['var']);

		// 통계 카운터
		$data['stock'] = $this->Main_m->get_stock($data['var']);

		// header, asize 디자인 유지용 파라미터
		$data['title'] = '메인페이지';
		$data['site_url'] = '/main';
		$this->load->view('include/head');
		$this->load->view('include/bms_head');
		$this->load->view('include/bms_side');
		$this->load->view('main', $data);
		$this->load->view('include/bms_tail');
		$this->load->view('include/tail');

	}
}
