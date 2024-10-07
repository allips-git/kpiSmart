<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 입출금내역 컨트롤러
 * @author 김원명, @version 1.0
 */
class Acc_detail extends CI_Controller {

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
        
        $date = new DateTime(date('Y-m-d'));
        if ($this->input->get('s', TRUE) == "t")
        {
            $data['ds'] = $this->input->get('startdt', TRUE);
            $data['de'] = $this->input->get('enddt', TRUE);            
        }
        else
        {
            $data['ds'] = date("Y-m-01",strtotime("-3 month"));
            $data['de'] = $date->format('Y-m-d');
        }

        $total_data = json_encode(array(
            'API_KEY'   =>   $info->acc_api,
            'API_ID'    =>   '2420',
            'ORG_NO'    =>   'SERP2OLI',
            'BIZ_NO'    =>   str_replace('-', '', $this->common->custom_decrypt($info->biz_cd, $encrypt_key, 'AES-128-ECB')),
            'REQ_DATA'  =>   array(
                'INQ_STR_DT'     =>     str_replace('-', '', $data['ds']),
                'INQ_END_DT'     =>     str_replace('-', '', $data['de']),
                'ACCT_NO'        =>     '',
                'PAGE_CNT'       =>     '',
                'INQ_PAGE_NO'    =>     ''
            )
        ), true);
        $total_json = json_decode($this->common->curl($total_data), true);
        $total_rows = isset($total_json['RESP_DATA']['ACCT_REC']) ? count($total_json['RESP_DATA']['ACCT_REC']) : 0;
        //$total_rows = count($total_json['RESP_DATA']['ACCT_REC']);

        $arg1 = array(
            'uri_segment'   =>  3,
            'site_url'      =>  '/acc/acc_detail',
            's'             =>  $this->input->get('s', TRUE),            
            'per_page'      =>  100,
            'num_links'     =>  4,
            'total_rows'    =>  $total_rows
        );

        $page = ($this->uri->segment(3)) ? $this->uri->segment(3)/100 : 0;

        /*전송 데이터 가공*/
        $JSONData = json_encode(array(
            'API_KEY'   =>   $info->acc_api,
            'API_ID'    =>   '2420',
            'ORG_NO'    =>   'SERP2OLI',
            'BIZ_NO'    =>   str_replace('-', '', $this->common->custom_decrypt($info->biz_cd, $encrypt_key, 'AES-128-ECB')),
            'REQ_DATA'  =>   array(
                'INQ_STR_DT'     =>     str_replace('-', '', $data['ds']),
                'INQ_END_DT'     =>     str_replace('-', '', $data['de']),
                'ACCT_NO'        =>     '',
                'PAGE_CNT'       =>     '100',
                'INQ_PAGE_NO'    =>     (string)$page
            )
        ), true);
        
        $json = json_decode($this->common->curl($JSONData), true);
        $list = isset($json['RESP_DATA']['ACCT_REC']) ? $json['RESP_DATA']['ACCT_REC'] : '';
        $data['list'] = $list;
        //$data['list'] = $json['RESP_DATA']['ACCT_REC'];
        if ($this->input->get('s', TRUE) == "t")
        {
            $data['params'] = array(
                'startdt'     => $this->input->get('startdt', TRUE),
                'enddt'       => $this->input->get('enddt', TRUE)
            );
        }
        else
        {
            $data['params'] = array(
                'startdt'     => date("Y-m-01",strtotime("-3 month")),
                'enddt'       => $date->format('Y-m-d')
            );
        }

        $data['links'] = $this->common->my_pagination4($arg1);

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '입출금 내역 관리';
        $data['site_url'] = '/acc/acc_detail';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('acc/acc_detail', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }
}
