<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 공정(Production process) 관리 컨트롤러
 * @author 안성준, @version 1.0, @last date 2022/08/03
 */
class Prod_proc extends CI_Controller {

    protected $table    = 'prod_proc';
    protected $nu_table = 'not_used';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('base/Prod_proc_m');
	}

	public function index()
	{
        // 공정유형
        $data['gb'] = array(
            'code_gb'       =>  'PR',
            'code_main'     =>  '040',
            'code_sub >'    =>  '000',
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['pp_gb'] = $this->Common_m->get_result2('z_plan.common_code', $data['gb'], 'code_sub ASC');
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '공정 등록';
        $data['site_url'] = '/base/prod_proc';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('base/prod_proc', $data);
        $this->load->view('include/base/not_used_pop', $data);
        $this->load->view('include/base/flaw_pop', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 공정 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 공정유형, 가용여부
     * @return warehouse list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'keyword'   => $this->input->post('keyword', TRUE),
            'content'   => $this->input->post('content', TRUE),
            'pp_gb'     => $this->input->post('pp_gb', TRUE),
            'useyn'     => $this->input->post('useyn', TRUE)
        );
        $data['list'] = $this->Prod_proc_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 공정 상세페이지
     * @param 공정ikey
     */
    public function detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Prod_proc_m->get_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }  

    /**
     * @description 공정 등록 - insert
     * @return result code [json] 
     */
    public function i()
    {
        // 기본 변수 - 공장코드, 공정 메인코드, 공정 순번, 공정 고유 코드
        $local_cd = $this->session->userdata['local_cd'];
        $main_cd  = "PP";
        $pp_seq   = sprintf('%02d',$this->Common_m->get_max2($this->table, 'pp_seq', array('local_cd'=>$local_cd))+1);
        $pp_uc    = $local_cd."-".$main_cd."-".$pp_seq;
        $pp_nm    = $this->input->post('pp_nm',TRUE);

        // 공정 코드 - 공장별로 부여된 공정 코드 MAX+10 생성
        $code = $this->Prod_proc_m->get_code(array('local_cd'=>$local_cd));

        // 유일키 검증
        $data['unique'] = array(
            'local_cd'  => $local_cd,
            'main_cd'   => $main_cd,
            'pp_seq'    => $pp_seq
        );

        // 중복명칭 검증
        $data['unique1'] = array(
            'local_cd'  => $local_cd,
            'pp_nm'     => $pp_nm
        );

        // 등록 정보
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'main_cd'       => $main_cd,
            'pp_seq'        => $pp_seq,
            'pp_uc'         => $pp_uc,
            'pp_cd'         => !empty($code->pp_cd) ? $code->pp_cd : "PP10",
            'pp_gb'         => $this->input->post('pp_gb', TRUE),
            'pp_no'         => sprintf('%01d',$this->Common_m->get_max2($this->table, 'pp_no', array('local_cd'=>$local_cd))+1),
            'pp_nm'         => $this->input->post('pp_nm', TRUE),
            'pp_hisyn'      => $this->input->post('pp_hisyn', TRUE),
            'memo'          => $this->input->post('memo', TRUE),
            'useyn'         => $this->input->post('useyn', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );
        if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0)
        {
            if ($this->Common_m->get_column_count($this->table, $data['unique1']) == 0)
            {
                $result = $this->Common_m->insert($this->table, $data['reg']); // insert data
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
    * @description 공정 수정 - update
    * @return result code [json] 
    */
    public function u()
    {
        // 수정 조건
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );

        // 중복명칭 검증
        $data['unique'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey !='   => $this->input->post('ikey', TRUE),
            'pp_nm'     => $this->input->post('pp_nm', TRUE)
        );

        // 수정 정보
        $data['mod'] = array(
            'pp_hisyn'      => $this->input->post('pp_hisyn', TRUE),
            'pp_nm'         => $this->input->post('pp_nm', TRUE),
            'pp_gb'         => $this->input->post('pp_gb', TRUE),
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
     * @description 공정 삭제 - delete
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
        
        // 공정 삭제
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0) // DB에 조건 값 있을경우 삭제 진행
        {
            $result = $this->Common_m->real_del($this->table, $data['var']);
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        } 
        else 
        {
            exit(json_encode(['code'=>401])); 
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
            
            //팝업이 아닌 일반 화면일 경우
            $config = array(        
                array('field'=>'useyn',        'label'=>'가용여부',          'rules'=>'trim|required'),
                array('field'=>'pp_nm',        'label'=>'공정명',            'rules'=>'trim|required'),
                array('field'=>'pp_gb',        'label'=>'공정유형',          'rules'=>'trim|required'),
                array('field'=>'pp_hisyn',     'label'=>'실적등록',          'rules'=>'trim|required')
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
