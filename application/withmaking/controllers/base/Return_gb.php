<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 반품 유형 관리(return gubun) 컨트롤러
 * @author 김민주, @version 1.0, @last date
 */
class Return_gb extends CI_Controller {

    protected $table  = 'return_type';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('base/Return_gb_m');
	}

    /**
     * @description 반품 유형 리스트 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'content'   => $this->input->post('content', TRUE)
        );
        $data['list'] = $this->Return_gb_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 반품 유형 상세페이지
     * @param ikey
     * @return detail [json] 
     */
    public function detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Return_gb_m->get_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 반품 유형 등록 - insert
     * @return result code [json] 
     */
    public function i()
    {   
        // 기본값
        $local_cd = $this->session->userdata['local_cd'];
        $main_cd = 'RE';
        $re_seq = sprintf('%02d',$this->Common_m->get_max2($this->table, 're_seq', array('local_cd'=>$local_cd, 'main_cd'=>$main_cd))+1);
        $re_uc = $local_cd.'-'.$main_cd.'-'.$re_seq;

        // 유일키 검증
        $data['unique'] = array(
            'local_cd'  => $local_cd,
            're_nm'     => $this->input->post('re_nm', TRUE)
        );

        // 등록 정보
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'main_cd'       => $main_cd,
            're_seq'        => $re_seq,
            're_uc'         => $re_uc,
            're_gb'         => 'OUT',
            're_nm'         => $this->input->post('re_nm', TRUE),
            'useyn'         => $this->input->post('gb_useyn', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );
        if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0)
        {
            $result = $this->Common_m->insert($this->table, $data['reg']); // insert data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else
        {
            exit(json_encode(['code'=>401]));
        }
    }

    /**
     * @description 반품 유형 수정 - update
     * @return result code [json] 
     */
    public function u()
    {
        // 수정 조건
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );

        // 제품명 중복 검증
        $data['unique'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey !='   => $this->input->post('ikey', TRUE),
            're_nm'     => $this->input->post('re_nm', TRUE)
        );

        // 수정 정보
        $data['mod'] = array(
            're_nm'         => $this->input->post('re_nm', TRUE),
            'useyn'         => $this->input->post('gb_useyn', TRUE),
            'mod_ikey'      => $this->session->userdata['ikey'],
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
                exit(json_encode(['code'=>401]));
            }
        }
        else
        {
            exit(json_encode(['code'=>402]));
        }

    }

    /**
     * @description 반품 유형 삭제 - delete
     * @return result code [json] 
     */
    public function d()
    {
        // 삭제 조건 - 시스템 미사용 상태만 삭제가능(sysyn="N")
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE),
            'sysyn'     => "N"
        );
        
        // 삭제
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0) // DB에 조건 값 일치할 경우 삭제 진행
        {
            $result = $this->Common_m->real_del($this->table, $data['var']);
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
        if (isset($_POST['p'])) 
        {

            $param = $this->input->post('p', TRUE);

            // 에러문구 관련 정의
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
                array('field'=>'gb_useyn',     'label'=>'가용 여부는',          'rules'=>'trim|required'),
                array('field'=>'re_nm',        'label'=>'반품 유형은',          'rules'=>'trim|required')
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
