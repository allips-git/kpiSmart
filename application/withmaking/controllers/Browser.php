<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 브라우저 체크 컨트롤러
 * @author , @version 1.0
 */
class Browser extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
	}

	public function index()
	{
        //$this->load->view('include/head');
        $this->load->view('browser');
        //$this->load->view('include/tail');
	}
 
}