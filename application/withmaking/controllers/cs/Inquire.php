<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 문의하기 화면
 * @author 김원명, @version 1.0, @last date 2022-10-19
 */
class Inquire extends CI_Controller {
    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
	}

	public function index()
	{
        // header, asize 디자인 유지용 파라미터
        $arg1 = array(
            'title'         => '문의하기',
            'site_url'      => '/cs/inquire',
            's'             => $this->input->get('s', TRUE),
            'delyn'         => 'N',
            'per_page'      => 10,
            'uri_segment'   => 4,
            'num_links'     => 4,
            'model_path'    => '/cs/Inquire_m',
            'model_name'    => 'Inquire_m'
        );

        // search argument - op:option
        $op     = $this->input->get('op', TRUE);
        $arg2   = array(
            'op'    => $op,
            'val'   => $this->input->get('n', TRUE)
        );

        $data       = $this->common->my_pagination($arg1, $arg2);
        $data['op'] = $op;

        // print_r($data);

        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('cs/inquire', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 문의하기 확인
     */
    public function v()
    {
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '문의하기';
        $data['site_url'] = '/cs/inquire';

        $ci =& get_instance();
        $data['ikey'] = $ci->uri->segment(4);
        $data['row']  = $ci->Common_m->get_row('homepage.3d_space_online', array('ikey' => $data['ikey']));

        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('cs/inquire_v', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    /**
     * @description 게시글 삭제
     */
    public function d()
    {
        $ci     =& get_instance();        
        $ikey   = $ci->uri->segment(4);

        $data['list'] = array(
            'ikey'     => $ikey,
            'mod_ikey' => $this->session->userdata['ikey'],
            'mod_ip'   => $this->input->ip_address()
        );
        
        $result = $this->Common_m->delete('homepage.3d_space_online', $data['list']);

        if($result)
        {
            alert_only('해당 게시글이 삭제되었습니다.');
            redirect('cs/inquire','refresh');
        }
        else
        {
            alert_only('삭제 실패되었습니다. 문제가 지속될 경우 관리자에게 문의 바랍니다.');
            redirect('cs/inquire','refresh');
        }
    }

    /**
     * @description 게시글 확인
     */
    public function c()
    {
        $data['list'] = array(
            'confirm'   => 'Y',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address()
        );

        $ikey   = $this->input->post('i', TRUE);
        $con    = $this->Common_m->update('homepage.3d_space_online', $ikey, $data['list']);

        if($con)
        {
            alert_only('게시글 확인이 완료되었습니다.');
            redirect('cs/inquire','refresh');
        }
        else
        {
            alert_only('게시글 확인이 적용되지않았습니다. 잠시 후 이용해주세요.');
            redirect('cs/inquire','refresh');
        }
    }

}
