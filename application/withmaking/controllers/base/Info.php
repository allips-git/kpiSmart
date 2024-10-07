<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 자사정보 관리 컨트롤러
 * @author , @version 1.0, @last date 
 */
class Info extends CI_Controller {
    
    protected $table  = 'z_plan.factory';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array('');
        $this->load->model('base/Info_m');
        $this->load->library('Common_file');
        $this->encrypt_key = $this->config->item('encrypt_key');
	}

	public function index()
	{
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '자사 정보';
        $data['site_url'] = '/base/info';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('base/info', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
    * @description 자사정보 수정 - update
    * @return result code [json] 
    */
    public function u()
    {

        $biz_cd     = $this->input->post('biz_cd',TRUE);
        $tel        = $this->input->post('tel',TRUE);
        $fax        = $this->input->post('fax',TRUE);
        $biz_zip    = $this->input->post('biz_zip',TRUE);
        $address    = $this->input->post('address',TRUE);
        $addr_detail= $this->input->post('addr_detail',TRUE);
        $ceo_tel    = $this->input->post('ceo_tel',TRUE);
        $email      = $this->input->post('email',TRUE);

        // 수정 조건
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );

        // 수정 정보
        $data['mod'] = array(
            'biz_nm'        => $this->input->post('biz_nm', TRUE),
            'biz_gb'        => $this->input->post('biz_gb', TRUE),
            'biz_class'     => $this->input->post('biz_class', TRUE),
            'biz_cd'        => !empty($biz_cd)         ? $this->common->custom_encrypt($biz_cd, $this->encrypt_key, 'AES-128-ECB') : '',
            'biz_type'      => $this->input->post('biz_type', TRUE),
            'tel'           => !empty($tel)         ? $this->common->custom_encrypt($tel, $this->encrypt_key, 'AES-128-ECB') : '',
            'fax'           => !empty($fax)         ? $this->common->custom_encrypt($fax, $this->encrypt_key, 'AES-128-ECB') : '',
            'email'         => !empty($email)       ? $this->common->custom_encrypt($email, $this->encrypt_key, 'AES-128-ECB') : '',
            'biz_zip'       => !empty($biz_zip)     ? $this->common->custom_encrypt($biz_zip, $this->encrypt_key, 'AES-128-ECB') : '',
            'address'       => !empty($address)     ? $this->common->custom_encrypt($address, $this->encrypt_key, 'AES-128-ECB') : '',
            'addr_detail'   => !empty($addr_detail) ? $this->common->custom_encrypt($addr_detail, $this->encrypt_key, 'AES-128-ECB') : '',
            'ceo_nm'        => $this->input->post('ceo_nm', TRUE),
            'ceo_tel'       => !empty($ceo_tel)         ? $this->common->custom_encrypt($ceo_tel, $this->encrypt_key, 'AES-128-ECB') : '',
            'memo'          => $this->input->post('memo', TRUE),
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );


        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0)
        {
            $result = $this->Common_m->update2($this->table, $data['mod'], $data['var']); // update data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));          
        }
        else
        {
            exit(json_encode(['code'=>400 ,'sql'=>$this->db->last_query()]));
        }
    }


    /**
     * @description 자사 정보 상세페이지
     */
    public function detail()
    {   
        $local_cd = $this->session->userdata['local_cd'];
        $data['info'] = $this->Info_m->get_factory('z_plan.factory', $local_cd);
        exit(json_encode(['result'=>$data['info'], 'sql'=>$this->db->last_query()])); // return result list
    }  

        /**
     * @description 등록/수정 폼 검증 - validation
     * @return result code [json] 
     */
    public function v() 
    {

        // 에러문구 관련 정의
        // $this->form_validation->set_error_delimiters('<font color=red>', '</font><br/>');
        $this->form_validation->set_message('required',     '%s 입력 해주세요.');
        $this->form_validation->set_message('alpha_dash',   '%s 알파벳,숫자,_,- 만 사용 가능합니다.');
        $this->form_validation->set_message('min_length',   '%s 길이는 4~12자리 이내만 가능합니다.');
        $this->form_validation->set_message('max_length',   '%s 길이는 4~12자리 이내만 가능합니다.');
        $this->form_validation->set_message('greater_than', '%s (cm) 이상 주문 가능합니다.');
        $this->form_validation->set_message('less_than',    '%s (cm) 이하 주문 가능합니다.');
        $this->form_validation->set_message('numeric',      '%s 숫자만 입력 해주세요.');
        $this->form_validation->set_message('valid_email',  '%s 이메일 형식이 올바르지 않습니다.');

        $config = array(
            array('field'=>'biz_nm',    'label'=>'사업자 명',         'rules'=>'trim|required'),
            array('field'=>'biz_gb',    'label'=>'사업자 유형',       'rules'=>'trim|required'),
            array('field'=>'biz_cd',    'label'=>'사업자 등록번호',    'rules'=>'trim|required|callback_num_check'),
            array('field'=>'tel',       'label'=>'전화번호',          'rules'=>'trim|required|callback_num_check'),
            array('field'=>'ceo_nm',    'label'=>'대표자명',          'rules'=>'trim|required'),
            array('field'=>'ceo_tel',   'label'=>'대표자 연락처',      'rules'=>'trim|required|callback_num_check')
        );

        $this->form_validation->set_rules($config);
        if ($this->form_validation->run() == TRUE) // success 
        {
            exit(json_encode(['code'=>100]));
        } 
        else // validation fail 
        {   
            exit(json_encode(['code'=>999]));
        }
    }

   /**
     * @description 숫자, 하이픈만 허용토록 입력값 추가 검증
     * @return result code [bool] 
     */
    public function num_check($param)
    {
        if (!preg_match('/^[\-+]?[0-9-]*\.?[0-9-]+$/', strval($param)) && !empty($param))
        {
            $this->form_validation->set_message('num_check', '%s 숫자,- 만 사용 가능합니다.');
            return FALSE;
        }
        else
        {
            return TRUE;
        }
    } 
}
