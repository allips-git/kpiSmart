<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 매입/지급 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/10
 */
class Buy_pay extends CI_Controller {

    protected $table  = 'buy_acc_list';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('acc/Buy_pay_m');
        $this->encrypt_key = $this->config->item('encrypt_key');
	}

	public function index()
	{
        // 결제 방식
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'code_gb'       =>  'AC',
            'code_main'     =>  '020',
            'code_sub >'    =>  '000',
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['acc_type'] = $this->Common_m->get_pick_category('z_plan.common_code', $data['var']);

        // 은행 계좌
        $data['var2'] = array(
            'code_gb'       =>  'AC',
            'code_main'     =>  '030',
            'code_sub >'    =>  '000',
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['bank'] = $this->Common_m->get_pick_category('z_plan.common_code', $data['var2']);

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '매입/지급 관리';
        $data['site_url'] = '/acc/buy_pay';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('acc/buy_pay', $data);
        $this->load->view('include/acc/buy_pay_reg', $data);
        // $this->load->view('include/acc/buy_pay_mod', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 매입/지급 전체 조회/검색 조회
     * @param 공장코드, 거래처코드, 검색 날짜
     * @return buy acc list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'cust_cd'   => $this->input->post('cust_cd', TRUE),
            'start_dt'  => $this->input->post('start_dt', TRUE),
            'end_dt'    => $this->input->post('end_dt', TRUE),
        );
        $data['list'] = $this->Buy_pay_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 매입/지급 등록 - insert
     * @return result code [json] 
     */
    public function i()
    {
        // variable list
        $local_cd   = $this->session->userdata['local_cd'];
        $acc_no     = str_replace("-","",$this->input->post('acc_dt', TRUE)).date("his",time());
        $amt        = (float) str_replace( ",", "", $this->input->post('amt', TRUE));
        $vat        = $this->input->post('vat', TRUE);
        $acc_nm     = $this->input->post('acc_nm', TRUE);
        $bl_num     = $this->input->post('bl_num', TRUE);

        // 중복 검증
        $data['unique'] = array(
            'acc_no' => $acc_no
        );

        // 등록정보
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'cust_cd'       => $this->input->post('cust_cd', TRUE),
            'acc_no'        => $acc_no,
            'work'          => 'OUT',
            'detail'        => $this->input->post('detail', TRUE),
            'acc_dt'        => $this->input->post('acc_dt', TRUE),
            'acc_type'      => $this->input->post('acc_type', TRUE),
            'bl_cd'         => $this->input->post('bl_cd', TRUE),
            'acc_nm'        => !empty($acc_nm) ? $this->common->custom_encrypt($acc_nm, $this->encrypt_key, 'AES-128-ECB') : '',
            'bl_num'        => !empty($bl_num) ? $this->common->custom_encrypt($bl_num, $this->encrypt_key, 'AES-128-ECB') : '',
            'amt'           => $amt,
            'tax'           => ($vat == "N") ? $amt * 0.1 : 0,
            'vat'           => $vat,
            'memo'          => $this->input->post('memo', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );

        if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0)
        {
            $result = $this->Common_m->insert($this->table, $data['reg']); // insert data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else // fail
        {
            exit(json_encode(['code'=>401]));
        }

    }

    /**
     * @description 등록/수정 폼 검증 - validation
     * @return result code [json] 
     */
    public function v() 
    {
        if (isset($_POST['p'])) 
        {

            $param = $this->input->post('p', TRUE);

            // 에러문구 관련 정의
            //$this->form_validation->set_error_delimiters('<font color=red>', '</font><br/>');
            $this->form_validation->set_message('required',         '%s 필수 입력 항목입니다.');
            $this->form_validation->set_message('numeric',          '%s 숫자만 입력해 주세요.');
            $this->form_validation->set_message('valid_email',      '%s 이메일 형식이 올바르지 않습니다.');
            $this->form_validation->set_message('integer',          '%s 정수만 입력 가능합니다.');
            $this->form_validation->set_message('alpha_dash',       '%s 알파벳,숫자,_,- 만 사용 가능합니다.');
            $this->form_validation->set_message('min_length',       '%s 길이는 %d 자리 이내만 가능합니다.');
            $this->form_validation->set_message('max_length',       '%s 길이는 %d 자리 이내만 가능합니다.');
            $this->form_validation->set_message('greater_than',     '%s 1개(원) 이상 입력 가능합니다.');
            $this->form_validation->set_message('less_than',        '%s 이하 입력 가능합니다.');
            $this->form_validation->set_message('alpha',            '%s 알파벳만 입력 가능합니다.');
            $this->form_validation->set_message('alpha_numeric',    '%s 알파벳, 숫자만 입력 가능합니다.');
            $this->form_validation->set_message('valid_url',        '%s URL 형식이 올바르지 않습니다.');
            $this->form_validation->set_message('valid_ip',         '%s IP 형식이 올바르지 않습니다.');

            $config = array(
                array('field'=>'acc_dt',        'label'=>'거래일자는',         'rules'=>'trim|required'),
                array('field'=>'cust_cd',       'label'=>'거래처는',           'rules'=>'trim|required'),
                array('field'=>'acc_type',      'label'=>'결제방식은',         'rules'=>'trim|required'),
                array('field'=>'amt',           'label'=>'금액은',             'rules'=>'trim|required'),
                array('field'=>'vat',           'label'=>'부가세는',           'rules'=>'trim|required')
            );
            
            $this->form_validation->set_rules($config);
            if ($this->form_validation->run() == TRUE) // success 
            {
                switch ($param) 
                {
                    case 'in':
                        exit(json_encode(['code'=>100]));
                    break;
                }
            } 
            else // validation fail 
            {   
                exit(json_encode(['code'=>999, 'err_msg'=>validation_errors()]));
            }

        } 
        else // params fail 
        {
            exit(json_encode(['code'=>999, 'err_msg'=>validation_errors()]));
        }

    }

}

