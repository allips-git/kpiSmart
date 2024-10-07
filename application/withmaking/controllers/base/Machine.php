<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 설비(Machine) 등록 컨트롤러
 * @author 안성준, @version 1.0, @last date 2022/05/13
 */
class Machine extends CI_Controller {

    protected $table  = 'machine';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('base/Machine_m');
        $this->load->library('My_file');
        $this->encrypt_key = $this->config->item('encrypt_key');
	}

	public function index()
	{
        // 설비유형
        $data['gb'] = array(
            'code_gb'       =>  'BA',
            'code_main'     =>  '120',
            'code_sub >'    =>  '000',
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['mc_gb'] = $this->Common_m->get_result2('z_plan.common_code', $data['gb'], 'code_sub ASC');

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '설비 등록';
        $data['site_url'] = '/base/machine';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('base/machine', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 설비 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 설비유형, 가용여부
     * @return warehouse list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'keyword'   => $this->input->post('keyword', TRUE),
            'content'   => $this->input->post('content', TRUE),
            'mc_gb'     => $this->input->post('mc_gb', TRUE),
            'useyn'     => $this->input->post('useyn', TRUE)
        );
        $data['list'] = $this->Machine_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 설비 상세페이지
     * @param 설비ikey
     */
    public function detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Machine_m->get_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 파일 업데이트
     */
    public function file_upload($name, $info) 
    {
        $result = false;
        if ($_FILES[$name]['size'] > 0) // null check
        { 
            $cnt = $this->Common_m->get_column_count('factory_file', $info);
            if ($cnt > 0) // success
            {
                $data = (object) $this->Common_m->get_row('factory_file', $info);

                // 파일 삭제
                My_file::file_delete('.'.$data->file_path.'/'.$data->file_nm);
                $this->Common_m->real_del('factory_file', $info);

            } 
            // 파일 등록
            $files = My_file::file_insert($info, $name, $_FILES); 
            if ($files['result']) 
            {
                $result = $this->Common_m->file_insert($info, $files['data']); // file insert data
            } 
        }
        return $result;
    }  

    /**
     * @description 설비 등록 - insert
     * @return result code [json] 
     */
    public function i()
    {
        // 기본 변수 - 공장코드, 설비 메인코드, 설비 순번, 설비 고유 코드
        $local_cd = $this->session->userdata['local_cd'];
        $main_cd  = "MC";
        $mc_seq   = sprintf('%02d',$this->Common_m->get_max2($this->table, 'mc_seq', array('local_cd'=>$local_cd))+1);
        $mc_uc    = $local_cd."-".$main_cd."-".$mc_seq;
        $mc_nm    = $this->input->post('mc_nm', TRUE);

        $amt    = $this->input->post('amt', TRUE);

        // 설비 코드 - 공장별로 부여된 설비 코드 MAX+10 생성
        $code = $this->Machine_m->get_code(array('local_cd'=>$local_cd));

        // 설비ikey MAX+1값 확인
        $ikey = $this->Common_m->get_max2($this->table, 'ikey', array('local_cd'=>$local_cd))+1;

        // 유일키 검증
        $data['unique'] = array(
            'local_cd'  => $local_cd,
            'main_cd'   => $main_cd,
            'mc_seq'    => $mc_seq
        );

        // 유일키 검증
        $data['unique1'] = array(
            'local_cd'  => $local_cd,
            'mc_nm'    => $mc_nm
        );

        $buy_dt      = $this->input->post('buy_dt', TRUE);

        // 등록 정보
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'main_cd'       => $main_cd,
            'mc_seq'        => $mc_seq,
            'mc_uc'         => $mc_uc,
            'mc_cd'         => !empty($code->mc_cd) ? $code->mc_cd : "MC10",
            'mc_gb'         => $this->input->post('mc_gb', TRUE),
            'mc_no'         => sprintf('%01d',$this->Common_m->get_max2($this->table, 'mc_no', array('local_cd'=>$local_cd))+1),
            'mc_nm'         => $mc_nm,
            'maker'         => $this->input->post('maker', TRUE),
            'model_nm'      => $this->input->post('model_nm', TRUE),
            'serial_no'     => $this->input->post('serial_no', TRUE),
            'spec'          => $this->input->post('spec', TRUE),
            'buy_corp'      => $this->input->post('buy_corp', TRUE),
            'buy_dt'        => !empty($buy_dt) ? $buy_dt : NULL,
            'amt'           => !empty($amt) ? str_replace( ",", "", $amt) : 0,
            'memo'          => $this->input->post('memo', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );

        // 파일 업로드
        // $info = array(
        //     'file_path' => '/public/file/food/machine',     // 파일경로
        //     'file_seq'  => '03',                            // 파일 순번
        //     'file_dseq' => $ikey                            // 상세 순번 (또는 부모ikey) 
        // );
        if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0)
        {
            if ($this->Common_m->get_column_count($this->table, $data['unique1']) == 0)
            {
                $result = $this->Common_m->insert($this->table, $data['reg']); // insert data
                if($result)
                {
                    // $_FILES['file1']['size'] > 0 ? $this->file_upload('file1', $info) :'';
                    exit(json_encode(['code'=>100]));
                }
                else
                {
                    exit(json_encode(['code'=>999]));
                }
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
    * @description 설비 수정 - update
    * @return result code [json] 
    */
    public function u()
    {
        $buy_dt = $this->input->post('buy_dt', TRUE);
        $amt    = $this->input->post('amt', TRUE);
        // 수정 조건
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );

        // 유일키 검증
        $data['unique'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'mc_nm'     => $this->input->post('mc_nm', TRUE),
            'ikey !='   => $this->input->post('ikey', TRUE)
        );

        // 수정 정보
        $data['mod'] = array(
            'mc_gb'         => $this->input->post('mc_gb', TRUE),
            'mc_nm'         => $this->input->post('mc_nm', TRUE),
            'maker'         => $this->input->post('maker', TRUE),
            'model_nm'      => $this->input->post('model_nm', TRUE),
            'serial_no'     => $this->input->post('serial_no', TRUE),
            'spec'          => $this->input->post('spec', TRUE),
            'buy_corp'      => $this->input->post('buy_corp', TRUE),
            'buy_dt'        => !empty($buy_dt) ? $buy_dt : NULL,
            // 'amt'           => $this->input->post('amt', TRUE),
            'amt'           => !empty($amt) ? str_replace( ",", "", $amt) : 0,
            'memo'          => $this->input->post('memo', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
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
                exit(json_encode(['code'=>600]));
            }
            
        }
        else
        {
            exit(json_encode(['code'=>400]));
        }
    }

    /**
     * @description 설비 삭제 - delete
     * @return result code [json] 
     */
    public function d()
    {
        // 삭제 조건    
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE),
            'sysyn'     => 'N'
        );
        
        // 설비 삭제
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0) // DB에 조건 값 있을경우 삭제 진행
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
     * @description 가용여부 변경 - update
     * @return result code [json] 
     */
    public function useyn()
    {
        // 데이터 검증
        $data['unique'] = array(
            'ikey' => $this->input->post('ikey', TRUE)
        );
        
        // sysyn="N" 일때 수정 가능한 값
        $useyn = $this->input->post('useyn', TRUE);
        $data['mod'] = array(
            'useyn'     => $useyn == "N" ? "Y" : "N",
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        if ($this->Common_m->get_column_count($this->table, $data['unique']) > 0)
        {
            // modify data
            $result = $this->Common_m->update2($this->table, $data['mod'], $data['unique']);
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
                array('field'=>'useyn',        'label'=>'가용여부',          'rules'=>'trim|required'),
                array('field'=>'mc_gb',        'label'=>'설비유형',          'rules'=>'trim|required'),
                array('field'=>'mc_nm',        'label'=>'설비명',            'rules'=>'trim|required')
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
