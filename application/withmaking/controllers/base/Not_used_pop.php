<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 비가동 유형 관리 컨트롤러
 * @author 안성준, @version 1.0, @last date 2022/09/08
 */
class Not_used_pop extends CI_Controller {

    protected $table    = 'prod_proc';
    protected $nu_table = 'not_used';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('base/Prod_proc_m');
	}

    /**
     * @description 비가동 유형 리스트
     * @param 공장코드
     * @return not_used list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['list'] = $this->Prod_proc_m->get_nu_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 비가동 상세페이지
     * @param 비가동 유형 ikey
     */
    public function detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Prod_proc_m->get_nu_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 비가동 유형 등록- insert
     * @return result code [json] 
     */
    public function i()
    {
        // 기본 변수 - 공장코드, 비가동 메인코드, 비가동 순번, 비가동 고유 코드, 비가동명
        $local_cd = $this->session->userdata['local_cd'];
        $main_cd  = "NU";
        $nu_seq   = sprintf('%02d',$this->Common_m->get_max2($this->nu_table, 'nu_seq', array('local_cd'=>$local_cd))+1);
        $nu_uc    = $local_cd."-".$main_cd."-".$nu_seq;
        $nu_nm    = $this->input->post('nu_nm',TRUE);

        // 유일키 검증
        $data['unique'] = array(
            'local_cd'  => $local_cd,
            'main_cd'   => $main_cd,
            'nu_seq'    => $nu_seq
        );

        // 유일키 검증
        $data['unique1'] = array(
            'local_cd'  => $local_cd,
            'nu_nm'     => $nu_nm
        );

        // 등록 정보
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'main_cd'       => $main_cd,
            'nu_seq'        => $nu_seq,
            'nu_uc'         => $nu_uc,
            'nu_nm'         => $this->input->post('nu_nm', TRUE),
            'useyn'         => $this->input->post('nu_useyn', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );
        if ($this->Common_m->get_column_count($this->nu_table, $data['unique']) == 0)
        {
            if ($this->Common_m->get_column_count($this->nu_table, $data['unique1']) == 0)
            {
                $result = $this->Common_m->insert($this->nu_table, $data['reg']); // insert data
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
    * @description 비가동 유형 수정 - update
    * @return result code [json] 
    */
    public function u()
    {
        // 수정 조건
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('nu_ikey', TRUE)
        );

        // 수정 정보
        $data['mod'] = array(
            'nu_nm'         => $this->input->post('nu_nm', TRUE),
            'useyn'         => $this->input->post('nu_useyn', TRUE),
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );


        if ($this->Common_m->get_column_count($this->nu_table, $data['var']) > 0)
        {
            $result = $this->Common_m->update2($this->nu_table, $data['mod'], $data['var']); // update data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999])); 
        }
        else
        {
            exit(json_encode(['code'=>400]));
        }
    }

    /**
     * @description 비가동 유형 삭제 - delete
     * @return result code [json] 
     */
    public function d()
    {
        // 삭제 조건    
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'   => $this->input->post('nu_ikey', TRUE),
            'sysyn'     => 'N'
        );
        
        // 비가동 유형 삭제
        if ($this->Common_m->get_column_count($this->nu_table, $data['var']) > 0) // DB에 조건 값 있을경우 삭제 진행
        {
            $result = $this->Common_m->real_del($this->nu_table, $data['var']);
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
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
        if (isset($_POST['nu_p'])) 
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
                array('field'=>'nu_useyn',     'label'=>'가용여부',          'rules'=>'trim|required'),
                array('field'=>'nu_nm',        'label'=>'유형명',            'rules'=>'trim|required')
            );
            
            $param = $this->input->post('nu_p', TRUE);

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
