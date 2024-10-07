
<?php
defined('BASEPATH') or exit('No direct script access allowed');

/**
 * @description 생산 작업 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/12
 */

class Pop_print extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->allow = array(''); // check login hook

    }

    public function index()
    {
    
        $this->load->view('pr/pop_print');

    }

    

}
