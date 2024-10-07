<?php
defined('BASEPATH') or exit('No direct script access allowed');

/**
 * @description 제조 오더(job order) 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/19
 */
class Job_ord extends CI_Controller
{

    protected $table = 'job_master';

    public function __construct()
    {
        parent::__construct();
        $this->allow = array(''); // check login hook
        $this->load->model('base/Select2_m');
        $this->load->model('pr/Job_ord_m');
        $this->load->model('base/Prod_bom_m');
    }

    public function index()
    {
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '제조 오더 등록';
        $data['site_url'] = '/pr/job_ord';
        
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('pr/job_ord', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    public function in()
    {
        // 작업장 리스트
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd' => $local_cd,
            'useyn' => 'Y',
            'delyn' => 'N',
        );
        $data['wp_uc'] = $this->Common_m->get_result2('work_place', $data['var'], 'wp_nm ASC');
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '제조 오더 등록';
        $data['site_url'] = '/pr/job_ord';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('pr/job_reg', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    public function up()
    {
        // 작업장 리스트
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd' => $local_cd,
            'useyn' => 'Y',
            'delyn' => 'N',
        );
        $data['wp_uc'] = $this->Common_m->get_result2('work_place', $data['var'], 'wp_nm ASC');

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '제조 오더 수정';
        $data['site_url'] = '/pr/job_ord';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('pr/job_mod', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    /**
     * @description 제조 오더 리스트 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 진행 상태
     * @return buy list [json]
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'keyword' => $this->input->post('keyword', true),
            'content' => $this->input->post('content', true),
            'start_dt' => $this->input->post('start_dt', true),
            'end_dt' => $this->input->post('end_dt', true),
            'state' => $this->input->post('state', true),
        );
        $data['list'] = $this->Job_ord_m->get_list($data['var']);
        exit(json_encode(['result' => $data])); // return result list
    }

    /**
     * @description 제조 오더 상세 조회
     * @param 공장코드, 제조 오더 번호
     * @return buy detail [json]
     */
    public function detail()
    {
        // variable list
        $var1 = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'job_no' => $this->input->post('job_no', true),
        );
        $data['detail'] = $this->Job_ord_m->get_detail($var1);

        // BOM 확인
        $job = $this->Common_m->get_row('job_master', $var1);

        // 배열에 BOM 제품코드 추가
        $var2 = array("item_cd" => $job->item_cd);
        $data['var'] = array_merge($var1, $var2);
        $data['bom'] = $this->Prod_bom_m->get_detail($data['var']);
        $data['user'] = $this->Job_ord_m->get_user_list($data['var']);
        exit(json_encode(['result' => $data])); // return result list
    }

    /**
     * @description 생산직 직원 전체 조회/검색 조회
     * @param 공장코드
     * @return list [json]
     */
    public function user_list()
    {
        // variable list
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
        );
        $data['user'] = $this->Job_ord_m->get_user_list($data['var']);
        exit(json_encode(['result' => $data])); // return result list
    }

    /**
     * @description 제품별 BOM 공정 등록, 작업 담당자, BOM 리스트
     * @param 공장코드, ikeyw
     * @return list [json]
     */
    public function sub_list()
    {
        // variable list
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'item_cd' => $this->input->post('item_cd', true),
        );
        $data['item'] = $this->Select2_m->get_item_detail($data['var']);
        $data['list'] = $this->Job_ord_m->get_proc_list($data['var']);
        $data['user'] = $this->Job_ord_m->get_user_list($data['var']);
        $data['bom'] = $this->Prod_bom_m->get_detail($data['var']);
        exit(json_encode(['result' => $data])); // return result list
    }

    /**
     * @description 제조 오더 등록 - insert
     * @return result code [json]
     */
    public function i()
    {
        // variable list
        $local_cd = $this->session->userdata['local_cd'];
        $job_no = $this->input->post('job_no');
        $item_cd = $this->input->post('item_cd', true);

        // 제조 오더 번호(중복 확인)
        $data['unique'] = array(
            'job_no' => $job_no,
        );

        // 상세 확인
        $item = $this->Common_m->get_row('item_list', array('item_cd' => $item_cd));
        $bom_m = $this->Common_m->get_row('bom_master', array('item_cd' => $item_cd, 'useyn' => 'Y', 'delyn' => 'N'));
        $proc_d = $this->Common_m->get_row('proc_detail', array('pc_uc' => $bom_m->pc_uc, 'useyn' => 'Y', 'delyn' => 'N'));

        // 제품 상세 스펙(규격/단위)
        $spec = array(
            'size' => $item->size,
            'unit' => $item->unit,
        );

        // 마스터 등록정보
        $data['reg'] = array(
            'local_cd' => $local_cd,
            'job_no' => $job_no,
            'job_dt' => $this->input->post('job_dt', true),
            'item_cd' => $item_cd,
            'item_nm' => $item->item_nm,
            'spec' => json_encode($spec),
            'wp_uc' => $this->input->post('wp_uc', true),
            'job_id' => $this->input->post('id', true),
            'job_pw' => $this->input->post('pw', true),
            'con_nm' => $this->input->post('con_nm', true),
            'job_qty' => $this->input->post('job_qty', true),
            'unit_amt' => $this->input->post('unit_amt', true),
            'fac_text' => $this->input->post('fac_text', true),
            'memo' => $this->input->post('memo', true),
            'state' => $this->input->post('state', true),
        );

        // 상세 등록정보
        $data['sub'] = array(
            'local_cd' => $local_cd,
            'job_no' => $job_no,
            'pc_uc' => $bom_m->pc_uc,
            'pp_uc' => $this->input->post('pp_uc', true),
            'pp_nm' => $this->input->post('pp_nm', true),
            'job_id' => $this->input->post('id', true),
            'job_pw' => $this->input->post('pw', true),
            'con_nm' => $this->input->post('con_nm', true),
            'pp_seq' => $this->input->post('pp_seq', true),
            'pp_hisyn' => $this->input->post('pp_hisyn', true),
            'plan_cnt' => $this->input->post('plan_cnt', true),
            'plan_time' => $this->input->post('plan_time', true),
            'plan_num' => $this->input->post('plan_num', true),
            'ul_uc' => $this->input->post('ul_uc', true),
            'ul_nm' => $this->input->post('ul_nm', true),
            'sub_memo' => $this->input->post('sub_memo', true),
        );

        if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0) {
            $result = $this->Job_ord_m->insert_batch($data['reg'], $data['sub']); // insert data
            $result ? exit(json_encode(['code' => 100])) : exit(json_encode(['code' => 999]));
        } else // fail
        {
            exit(json_encode(['code' => 401]));
        }

    }

    /**
     * @description 제조 오더 수정 - update
     * @return result code [json]
     */
    public function u()
    {
        // variable list
        $local_cd = $this->session->userdata['local_cd'];
        $job_no = $this->input->post('job_no', true);
        $item_cd = $this->input->post('item_cd', true);

        // 상세 확인
        $item = $this->Common_m->get_row('item_list', array('item_cd' => $item_cd));
        $bom_m = $this->Common_m->get_row('bom_master', array('item_cd' => $item_cd, 'useyn' => 'Y', 'delyn' => 'N'));
        $proc_d = $this->Common_m->get_row('proc_detail', array('pc_uc' => $bom_m->pc_uc, 'useyn' => 'Y', 'delyn' => 'N'));

        // 진행 상태값이 접수 이상이면 sysyn="Y"로 변경
        $state = $this->input->post('state', true);
        $sysyn = ($state == "001") ? "N" : "Y";

        $data['unique'] = array(
            'local_cd' => $local_cd,
            'job_no' => $job_no,
        );

        // 제품 상세 스펙(규격/단위)
        $spec = array(
            'size' => $item->size,
            'unit' => $item->unit,
        );

        // 마스터 수정정보
        $data['mod'] = array(
            'local_cd' => $local_cd,
            'job_no' => $job_no,
            'job_dt' => $this->input->post('job_dt', true),
            'item_cd' => $item_cd,
            'item_nm' => $item->item_nm,
            'job_id' => $this->input->post('id', true),
            'job_pw' => $this->input->post('pw', true),
            'con_nm' => $this->input->post('con_nm', true),
            'spec' => json_encode($spec),
            'wp_uc' => $this->input->post('wp_uc', true),
            'job_qty' => $this->input->post('job_qty', true),
            'unit_amt' => $this->input->post('unit_amt', true),
            'fac_text' => $this->input->post('fac_text', true),
            'memo' => $this->input->post('memo', true),
            'state' => $this->input->post('state', true),
        );

        // 상세 수정정보
        $data['sub'] = array(
            'local_cd' => $local_cd,
            'job_no' => $job_no,
            'pc_uc' => $bom_m->pc_uc,
            'pp_uc' => $this->input->post('pp_uc', true),
            'pp_nm' => $this->input->post('pp_nm', true),
            'pp_seq' => $this->input->post('pp_seq', true),
            'job_id' => $this->input->post('id', true),
            'job_pw' => $this->input->post('pw', true),
            'con_nm' => $this->input->post('con_nm', true),
            'pp_hisyn' => $this->input->post('pp_hisyn', true),
            'plan_cnt' => $this->input->post('plan_cnt', true),
            'plan_time' => $this->input->post('plan_time', true),
            'plan_num' => $this->input->post('plan_num', true),
            'ul_uc' => $this->input->post('ul_uc', true),
            'ul_nm' => $this->input->post('ul_nm', true),
            'sub_memo' => $this->input->post('sub_memo', true),
        );

        if ($this->Common_m->get_column_count($this->table, $data['unique']) > 0) {
            $result = $this->Job_ord_m->update_batch($data['mod'], $data['sub'], $data['unique']); // update data
            $result ? exit(json_encode(['code' => 100])) : exit(json_encode(['code' => 999]));
        } else // fail
        {
            exit(json_encode(['code' => 401]));
        }

    }

    /**
     * @description 제조 오더 삭제 - delete
     * @return result code [json]
     */
    public function d()
    {
        // 삭제 조건 - 시스템 미사용 상태만 삭제가능(sysyn="N")
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'ikey' => $this->input->post('ikey', true),
            'sysyn' => "N",
        );

        // 삭제
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0) // DB에 조건 값 일치할 경우 삭제 진행
        {
            $result = $this->Common_m->real_del($this->table, $data['var']);
            $result ? exit(json_encode(['code' => 100])) : exit(json_encode(['code' => 999]));
        } else {
            exit(json_encode(['code' => 401]));
        }

    }

    /**
     * @description 제품 조회
     * @return result code [json]
     */

     public function item_list() {
        $var = array(
            'item_cd' => $this->input->post('itemCd', TRUE),
            'local_cd' => $this->session->userdata['local_cd'],
        );
    
        $result = $this->Common_m->get_row('item_list', $var);
    
        exit(json_encode($result));
    }
    
    private function generate_qr_code_url($itemCd) {
        // QR 코드 생성 로직 구현
        $dataString = urlencode($itemCd);
        return "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl={$dataString}&choe=UTF-8";
    }

    /**
     * @description 제조 오더 확정 - update
     * @return result code [json]
     */
    public function su()
    {
        // 수정 조건
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd' => $local_cd,
            'ikey' => $this->input->post('ikey', true),
        );

        // 수정 정보
        $data['mod'] = array(
            'local_cd' => $local_cd,
            'ikey' => $this->input->post('ikey', true),
            'state' => '002',
            'sysyn' => 'Y',
            'mod_ikey' => $this->session->userdata['ikey'],
            'mod_ip' => $this->input->ip_address(),
            'today' => date("Y-m-d H:i:s"),
        );
        $result = $this->Job_ord_m->update_batch_state($data['mod'], $data['var']); // update data
        $result ? exit(json_encode(['code' => 100])) : exit(json_encode(['code' => 999]));
    }

    /**
     * @description 등록/수정 폼 검증 - validation
     * @return result code [json]
     */
    public function v()
    {
        if (isset($_POST['p'])) {
            $param = $this->input->post('p', true);

            // 에러문구 관련 정의
            //$this->form_validation->set_error_delimiters('<font color=red>', '</font><br/>');
            $this->form_validation->set_message('required', '%s 필수 입력 항목입니다.');
            $this->form_validation->set_message('numeric', '%s 숫자만 입력해 주세요.');
            $this->form_validation->set_message('valid_email', '%s 이메일 형식이 올바르지 않습니다.');
            $this->form_validation->set_message('integer', '%s 정수만 입력 가능합니다.');
            $this->form_validation->set_message('alpha_dash', '%s 알파벳,숫자,_,- 만 사용 가능합니다.');
            $this->form_validation->set_message('min_length', '%s 길이는 %d 자리 이내만 가능합니다.');
            $this->form_validation->set_message('max_length', '%s 길이는 %d 자리 이내만 가능합니다.');
            $this->form_validation->set_message('greater_than', '%s 1개(원) 이상 입력 가능합니다.');
            $this->form_validation->set_message('less_than', '%s 이하 입력 가능합니다.');
            $this->form_validation->set_message('alpha', '%s 알파벳만 입력 가능합니다.');
            $this->form_validation->set_message('alpha_numeric', '%s 알파벳, 숫자만 입력 가능합니다.');
            $this->form_validation->set_message('valid_url', '%s URL 형식이 올바르지 않습니다.');
            $this->form_validation->set_message('valid_ip', '%s IP 형식이 올바르지 않습니다.');

            $config = array(
                array('field' => 'job_dt', 'label' => '지시일자는', 'rules' => 'trim|required'),
                array('field' => 'state', 'label' => '진행상태는', 'rules' => 'trim|required'),
                array('field' => 'item_cd', 'label' => '제품은', 'rules' => 'trim|required'),
                array('field' => 'wp_uc', 'label' => '작업장은', 'rules' => 'trim|required'),
                array('field' => 'job_qty', 'label' => '지시수량은', 'rules' => 'trim|required'),
                array('field' => 'unit_amt', 'label' => '기준단가는', 'rules' => 'trim|required'),
                array('field' => 'pp_uc[]', 'label' => '공정은', 'rules' => 'trim|required'),
                array('field' => 'plan_cnt[]', 'label' => '목표실적은', 'rules' => 'trim|required|numeric'),
                array('field' => 'ul_uc[]', 'label' => '담당자는', 'rules' => 'trim|required'),
                array('field' => 'plan_time[]', 'label' => '일 작업시간은', 'rules' => 'trim|required|numeric'),
            );

            $this->form_validation->set_rules($config);
            if ($this->form_validation->run() == true) // success
            {
                switch ($param) {
                    case 'in':
                        exit(json_encode(['code' => 100, 'list' => $_POST]));
                        break;
                    case 'up':
                        exit(json_encode(['code' => 200, 'list' => $_POST]));
                        break;
                    case 'del':
                        exit(json_encode(['code' => 300]));
                        break;
                }
            } else // validation fail
            {
                exit(json_encode(['code' => 999, 'list' => $_POST, 'err_msg' => validation_errors()]));
            }

        } else // params fail
        {
            exit(json_encode(['code' => 999, 'list' => $_POST, 'err_msg' => validation_errors()]));
        }

    }


    public function Pop() 
    {
        $this->load->view('pr/pop');
    }

}
