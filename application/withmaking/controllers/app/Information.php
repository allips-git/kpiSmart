<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 장비 정보 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/10/18
 */
class Information extends CI_Controller {

    protected $table  = 'equipment';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array('index'); // check login hook
	}

	public function index()
	{
        // 바코드 이력정보
        $barcode = $this->input->get('code', TRUE);
        $data['info'] = $this->Common_m->get_row('equipment', array('barcode'=>$barcode));
        if (!empty($data['info'] )) 
        {
            // header, asize 디자인 유지용 파라미터
            $data['title'] = '장비 정보 관리';
            $data['site_url'] = '/app/information';
            $this->load->view('include/head');
            $this->load->view('app/information', $data);
            $this->load->view('include/tail');
        }
        else
        {
            $this->load->view('errors/index.html');
        }
	}

    /**
    * @description 장비 수정 - update
    * @return result code [json] 
    */
    public function u()
    {
        // 수정 조건
        $data['var'] = array(
            'barcode'   => $this->input->post('barcode', TRUE)
        );

        // 유일키 검증
        $data['unique'] = array(
            'eq_nm'         => $this->input->post('eq_nm', TRUE),
            'barcode !='    => $this->input->post('barcode', TRUE)
        );

        // 수정 정보
        $data['mod'] = array(
            'eq_nm'         => $this->input->post('eq_nm', TRUE),
            'buy_corp'      => $this->input->post('buy_corp', TRUE),
            'buy_tel'       => $this->input->post('buy_tel', TRUE),
            'memo'          => $this->input->post('memo', TRUE),
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );

        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0)
        {
            if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0)
            {
                $result = $this->Common_m->update2($this->table, $data['mod'], $data['var']); // update data
                $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999])); 
            }
            else
            {
                exit(json_encode(['code'=>600]));
            }
        }
        else
        {
            exit(json_encode(['code'=>400]));
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
                array('field'=>'eq_nm',      'label'=>'기계명',        'rules'=>'trim|required')
            );
            $this->form_validation->set_rules($config);
            if ($this->form_validation->run() == TRUE) // success 
            {
                switch ($param) 
                {
                    case 'in':
                        exit(json_encode(['code'=>100]));
                    break;
                    case 'up':
                        exit(json_encode(['code'=>200]));
                    break;
                    case 'del':
                        exit(json_encode(['code'=>300]));
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
