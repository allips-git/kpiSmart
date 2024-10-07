<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 카드매입 내역 컨트롤러
 * @author 김원명, @version 1.0
 */
class Card_purchase extends CI_Controller {

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
        
        $total_data = json_encode(array(
            'API_KEY'   =>   $info->acc_api,
            'API_ID'    =>   '2320',
            'ORG_NO'    =>   'SERP2OLI',
            'BIZ_NO'    =>   str_replace('-', '', $this->common->custom_decrypt($info->biz_cd, $encrypt_key, 'AES-128-ECB')),
            'REQ_DATA'  =>   array(
                'INQ_STR_DT'     =>     str_replace('-', '', $this->input->get('startdt', TRUE)),
                'INQ_END_DT'     =>     str_replace('-', '', $this->input->get('enddt', TRUE)),
                'PAGE_CNT'       =>     '',
                'INQ_PAGE_NO'    =>     ''
            )
        ), true);
        $total_json = json_decode($this->common->curl($total_data), true);
        $total_rows = isset($total_json['RESP_DATA']['CARD_APV_REC']) ? count($total_json['RESP_DATA']['CARD_APV_REC']) : 0;        
        //$total_rows = count($total_json['RESP_DATA']['CARD_APV_REC']);        

        $page = ($this->uri->segment(3)) ? $this->uri->segment(3)/100 : 0;

        $arg1 = array(
            'uri_segment'   =>  3,
            'site_url'      =>  '/acc/card_purchase',
            's'             => $this->input->get('s', TRUE),
            'per_page'      =>  100,
            'num_links'     =>  4,
            'total_rows'    =>  $total_rows
        );

        /*전송 데이터 가공*/
        $JSONData = json_encode(array(
            'API_KEY'   =>   $info->acc_api,
            'API_ID'    =>   '2320',
            'ORG_NO'    =>   'SERP2OLI',
            'BIZ_NO'    =>   str_replace('-', '', $this->common->custom_decrypt($info->biz_cd, $encrypt_key, 'AES-128-ECB')),
            'REQ_DATA'  =>   array(
                'INQ_STR_DT'     =>     str_replace('-', '', $this->input->get('startdt', TRUE)),
                'INQ_END_DT'     =>     str_replace('-', '', $this->input->get('enddt', TRUE)),
                'PAGE_CNT'       =>     '100',
                'INQ_PAGE_NO'    =>     (string)$page
            )
        ), true);
        
        $json = json_decode($this->common->curl($JSONData), true);
        //$data['list'] = $json['RESP_DATA']['CARD_APV_REC'];
        $data['list'] = isset($json['RESP_DATA']['CARD_APV_REC']) ? $json['RESP_DATA']['CARD_APV_REC'] : '';        
        $data['params'] = array(
            'startdt'     => $this->input->get('startdt', TRUE),
            'enddt'       => $this->input->get('enddt', TRUE)
        );        
        $data['links'] = $this->common->my_pagination4($arg1);       
         
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '카드 매입 관리';
        $data['site_url'] = '/acc/card_purchase';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('acc/card_purchase', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail'); 
    }
}
