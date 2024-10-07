<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 계좌목록 컨트롤러
 * @author 김원명, @version 1.0
 */
class Account_list extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook  
        $this->load->library('curl'); // curl 라이브러리 생성
	}

	public function index()
	{
        $encrypt_key    = $this->config->item('encrypt_key');        
        $info           = $this->Common_m->get_row('z_plan.factory', array('local_cd' => $this->session->userdata['local_cd']));
        
        if (empty($info->acc_api))
        {
            echo '<script>
                    alert("해당 화면에 대한 권한이 없습니다.");
                    history.back();
                </script>';
        }
        
        /*전송 데이터 가공*/
        $JSONData = json_encode(array(
            'API_KEY'   =>   $info->acc_api,
            'API_ID'    =>   '2410',
            'ORG_NO'    =>   'SERP2OLI',
            'BIZ_NO'    =>   str_replace('-', '', $this->common->custom_decrypt($info->biz_cd, $encrypt_key, 'AES-128-ECB')),
            'REQ_DATA'  =>   array(
                'ACCT_NO'   =>   $this->input->get('search', TRUE)
            )
        ), true);
        
        $json = json_decode($this->common->curl($JSONData), true);
        $data['list'] = isset($json['RESP_DATA']['ACCT_REC']) ? $json['RESP_DATA']['ACCT_REC'] : '';        
        //$data['list'] = $json['RESP_DATA']['ACCT_REC'];
        $data['params'] = array(
            'search'     => $this->input->get('search', TRUE),
        );

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '계좌 목록 관리';
        $data['site_url'] = '/acc/account_list';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('acc/account_list', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }
}
