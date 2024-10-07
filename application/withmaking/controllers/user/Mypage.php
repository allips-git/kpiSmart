<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 공장 사원 별 마이페이지 관리 컨트롤러
 * @author 김민주, @version 2.0, @last date 2022/04/28
 */
class Mypage extends CI_Controller {

    protected $table  = 'z_plan.user_list';

    public function __construct() 
    { 
        parent::__construct();
        $this->allow=array('');
        $this->load->model('user/Mypage_m'); 
    }

    public function index()
    {
        // 공장 별 로그인 사용자 확인용 KEY
        $encrypt_key = $this->config->item('encrypt_key');
        $data['login'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'ul_uc' => $this->session->userdata['ul_uc']
        );

        // 사용자 INFO
        $result = $this->Mypage_m->get_row($data['login']);
        $data['user'] = (object) array(
            'ikey'      => $result->ikey,
            'ul_uc'     => $result->ul_uc,
            'dp_name'   => $result->dp_name,
            'job_nm'    => $result->job_nm,
            'ul_nm'     => $result->ul_nm,
            'id'        => $result->id,
            'pass'      => $result->pass,
            'tel'       => $this->common->custom_decrypt($result->tel, $encrypt_key, 'AES-128-ECB'),
            'email'     => $this->common->custom_decrypt($result->email, $encrypt_key, 'AES-128-ECB')
        );

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '마이페이지';
        $data['site_url'] = '/user/mypage';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('user/mypage', $data);
        $this->load->view('include/user/pass_edit_pop', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    /**
     * @description 마이페이지 수정 - update
     * @return result code [json] 
     */
    public function u()
    {
        // 수정 조건
        $encrypt_key = $this->config->item('encrypt_key');
        $data['user'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ul_uc'     => $this->session->userdata['ul_uc'],
            'useyn'     => 'Y'
        );

        // null 아닐때만 정보 업데이트
        $tel = $this->input->post('tel', TRUE);
        $tel = !empty($tel) ? $this->common->custom_encrypt($tel, $encrypt_key, 'AES-128-ECB') : '';
        
        $email = $this->input->post('email', TRUE);
        $email = !empty($email) ? $this->common->custom_encrypt($email, $encrypt_key, 'AES-128-ECB') : '';
        
        // 수정 값
        $data['mod'] = array(
            'pass'      => strtoupper($this->input->post('pass', TRUE)),
            'tel'       => $tel,
            'email'     => $email,
            'mod_ikey'  => $this->session->userdata['ikey']
        );

        // modify data
        $result = $this->Common_m->update2($this->table, $data['mod'], $data['user']);
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
            // $this->form_validation->set_error_delimiters('<font color=red>', '</font><br/>');
            $this->form_validation->set_message('required',     '%s 입력 해주세요.');
            $this->form_validation->set_message('alpha_dash',   '%s 알파벳,숫자,_,- 만 사용 가능합니다.');
            $this->form_validation->set_message('min_length',   '%s 길이는 4~12자리 이내만 가능합니다.');
            $this->form_validation->set_message('max_length',   '%s 길이는 4~12자리 이내만 가능합니다.');
            $this->form_validation->set_message('greater_than', '%s (cm) 이상 주문 가능합니다.');
            $this->form_validation->set_message('less_than',    '%s (cm) 이하 주문 가능합니다.');
            $this->form_validation->set_message('numeric',      '%s 숫자만 입력 해주세요.');
            $this->form_validation->set_message('valid_email',  '%s 형식이 올바르지 않습니다.');

            // 폼체크
            $config = array(

                // 필수입력 체크
                array('field'=>'pass',    'label'=>'비밀번호',      'rules'=>'trim|required'),
                array('field'=>'tel',     'label'=>'전화번호',      'rules'=>'trim'),
                array('field'=>'email',   'label'=>'이메일주소',    'rules'=>'trim|valid_email')

            ); 
            $this->form_validation->set_rules($config);

            if ($this->form_validation->run() == TRUE) 
            {
                // success
                switch ($param) 
                {
                    case 'in':
                        exit(json_encode(['code'=>100]));
                        break;
                    case 'up':
                        exit(json_encode(['code'=>200]));
                        break;
                    
                    default:
                        # code...
                    break;
                }
            } 
            else 
            {
                // validation fail
                exit(json_encode(['code'=>999, 'err_msg'=>validation_errors()]));
            }
        } 
        else 
        {
            // params fail
            exit(json_encode(['code'=>999, 'err_msg'=>validation_errors()]));
        }

    }        

}
