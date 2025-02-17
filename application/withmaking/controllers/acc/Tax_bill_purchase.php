<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 세금계산서 내역 컨트롤러
 * @author 김원명, @version 1.0
 */
class Tax_bill_purchase extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook  
        $this->load->library('curl'); // curl 라이브러리 생성    
	}

	public function index()
	{
        //$pops = $this->input->get('pops', true);
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
            'API_ID'    =>   '2100',
            'ORG_NO'    =>   'SERP2OLI',
            'BIZ_NO'    =>   str_replace('-', '', $this->common->custom_decrypt($info->biz_cd, $encrypt_key, 'AES-128-ECB')),
            'REQ_DATA'  =>   array(
                'INQ_STR_DT'    =>  str_replace('-', '', $this->input->get('startdt', TRUE)),
                'INQ_END_DT'    =>  str_replace('-', '', $this->input->get('enddt', TRUE)),
                'PAGE_CNT'      =>  '',
                'INQ_PAGE_NO'   =>  '',
                'EVDC_DV'       =>  '10'
            )
        ), true);
        $total_json = json_decode($this->common->curl($total_data), true);
        $total_rows = isset($total_json['RESP_DATA']['TAX_INFO_REC']) ? count($total_json['RESP_DATA']['TAX_INFO_REC']) : 0;

        /*$result_data = array();
        
        for($i=0; $i<$total_rows; $i++){
            if($total_json['RESP_DATA']['TAX_INFO_REC'][$i]['POPS_CODE'] == $pops){
                array_push($result_data, $total_json['RESP_DATA']['TAX_INFO_REC'][$i]);
            }else if($pops == '00'){
                array_push($result_data, $total_json['RESP_DATA']['TAX_INFO_REC'][$i]);                
            }
        }

        $result_rows = count($result_data);*/

        $arg1 = array(
            'uri_segment'   =>  3,
            'site_url'      =>  '/acc/tax_bill_purchase',
            's'             => $this->input->get('s', TRUE),
            'per_page'      =>  100,
            'num_links'     =>  4,
            'total_rows'    =>  $total_rows
        );

        $page = ($this->uri->segment(3)) ? $this->uri->segment(3)/100 : 0;

        /*전송 데이터 가공*/
        $JSONData = json_encode(array(
            'API_KEY'   =>   $info->acc_api,
            'API_ID'    =>   '2100',
            'ORG_NO'    =>   'SERP2OLI',
            'BIZ_NO'    =>   str_replace('-', '', $this->common->custom_decrypt($info->biz_cd, $encrypt_key, 'AES-128-ECB')),
            'REQ_DATA'  =>   array(
                'INQ_STR_DT'    =>  str_replace('-', '', $this->input->get('startdt', TRUE)),
                'INQ_END_DT'    =>  str_replace('-', '', $this->input->get('enddt', TRUE)),
                'PAGE_CNT'      =>  '100',
                'INQ_PAGE_NO'   =>  (string)$page,
                'EVDC_DV'       =>  '10'
            )
        ), true);
        $json = json_decode($this->common->curl($JSONData), true);
        $data['list'] = isset($json['RESP_DATA']['TAX_INFO_REC']) ? $json['RESP_DATA']['TAX_INFO_REC'] : '';

        $data['params'] = array(
            'startdt'     => $this->input->get('startdt', TRUE),
            'enddt'       => $this->input->get('enddt', TRUE)
        );
        $data['links'] = $this->common->my_pagination4($arg1);
        //print_r($data['list']);

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '매입 세금계산서';
        $data['site_url'] = '/acc/tax_bill_purchase';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('acc/tax_bill_purchase', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }
}
