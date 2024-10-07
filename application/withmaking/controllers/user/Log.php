<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 접속기록 관리 컨트롤러
 * @author 황호진, @version 1.0, @last date 2022/01/20
 * @author 김민주, @version 2.0, @last date 2022/05/03 - 로컬IP 접속 기록 표기 제외, 코드 정리 작업
 */
class Log extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->allow=array(''); // check login hook
        $this->load->model('user/Log_m');
	}

	public function index()
	{

		$data['st_dt'] = date('Y-m-01');
		$data['ed_dt'] = date('Y-m-t');
		$data['title'] = '접속 기록 관리';
		$data['site_url'] = '/user/log';
		$this->load->view('include/head');
		$this->load->view('include/bms_head');
		$this->load->view('include/bms_side');
		$this->load->view('user/log', $data);
		$this->load->view('include/bms_tail');
		$this->load->view('include/tail');
	}

	/**
	 * @description 접속기록관리 리스트 호출
	 * @return result code [json]
	 */
	public function get_list()
	{
		//공장코드
		$local_cd = $this->session->userdata['local_cd'];
		//돌려줄 프로토콜 규칙
		$result = $this->Log_m->get_response_data_form();
		//parameter
		$param = $this->input->get(null , true);
		if($param['s'] === 't') //검색일 경우
		{	
			$result->data = $this->Log_m->get_search_list($local_cd , $param);
		}
		else //화면 맨처음에 들어왔을 경우
		{	
			$result->data = $this->Log_m->get_list($local_cd , $param);
		}
		exit(json_encode($result));
	}
}
