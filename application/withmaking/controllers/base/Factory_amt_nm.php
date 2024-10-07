<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 공장 등급 단가 명칭 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/06/03
 */
class Factory_amt_nm extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
	}

    /**
     * @description 공장 단가 명칭 관리 등록,수정 - update
     * @param 공장코드, 등급단가명칭
     * @return result code
     */
    public function u()
    {
        // 공장 등급단가 등록 데이터가 있을경우 업데이트로 진행(최초만 등록)
        $data['unique'] = array(
            'local_cd'      => $this->session->userdata['local_cd']
        );
        $data['amt'] = array(
            'amt1'  => '판매단가',
            'amt2'  => $this->input->post('amt2', true),
            'amt3'  => $this->input->post('amt3', true),
            'amt4'  => $this->input->post('amt4', true),
            'amt5'  => $this->input->post('amt5', true)
        );
        $data['reg'] = array(
            'reg_ikey'  => $this->session->userdata['ikey'],
            'reg_ip'    => $this->input->ip_address()
        );
        $data['mod'] = array(
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address()
        );

        if($this->Common_m->get_column_count('factory_amt_nm', $data['unique']) == 0)
        {
            // insert data
            $reg = array_merge($data['unique'], $data['amt'], $data['reg']); 
            $result = $this->Common_m->insert('factory_amt_nm', $reg);
        } 
        else 
        {
            // modify data
            $mod = array_merge($data['amt'], $data['mod']); 
            $result = $this->Common_m->update2('factory_amt_nm', $mod, $data['unique']);
        }
        $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
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
                array('field'=>'amt2',      'label'=>'단가명칭1은',         'rules'=>'trim|required'),
                array('field'=>'amt3',      'label'=>'단가명칭2는',         'rules'=>'trim|required'),
                array('field'=>'amt4',      'label'=>'단가명칭3은',         'rules'=>'trim|required'),
                array('field'=>'amt5',      'label'=>'단가명칭4는',         'rules'=>'trim|required')
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
