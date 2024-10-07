<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 구매 발주 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/04
 */
class Ord_buy extends CI_Controller {

    protected $table  = 'buy_master';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('ord/Ord_buy_m');
	}

	public function index()
	{
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '구매 발주 관리';
        $data['site_url'] = '/ord/ord_buy';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('ord/ord_buy', $data);
        $this->load->view('include/acc/pay_pop', $data);
        // $this->load->view('include/wk/put_pop', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 구매 발주 등록 페이지
     */
    public function in()
    {
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '구매 발주 등록';
        $data['site_url'] = '/ord/ord_buy';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('ord/buy_reg', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    /**
     * @description 구매 발주 수정 페이지
     */
    public function up()
    {
        // 전표 마감 여부 확인
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ord_no'    => $this->input->get('no', TRUE)
        );
        $data['ord'] = $this->Common_m->get_row('buy_master', $data['var']);
        
        // 거래처별 회계정보 확인
        $data['ac'] = $this->Ord_buy_m->get_acc_info((array)$data['ord']);

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '구매 발주 수정';
        $data['site_url'] = '/ord/ord_buy';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('ord/buy_mod', $data);
        $this->load->view('include/wk/put_pop', $data);
        // $this->load->view('include/wk/out_pop', $data);
        $this->load->view('include/acc/pay_pop', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    /**
     * @description 구매 발주 리스트 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 전표 마감 여부
     * @return buy list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'keyword'   => $this->input->post('keyword', TRUE),
            'content'   => $this->input->post('content', TRUE),
            'start_dt'  => $this->input->post('start_dt', TRUE),
            'end_dt'    => $this->input->post('end_dt', TRUE),
            'finyn'     => $this->input->post('finyn', TRUE)
        );
        $data['list'] = $this->Ord_buy_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 구매 발주 상세 조회
     * @param 공장코드, 발주번호
     * @return buy detail [json] 
     */
    public function detail()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ord_no'    => $this->input->post('ord_no', TRUE)
        );
        $data['detail'] = $this->Ord_buy_m->get_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 매입 거래처 전체 조회/검색 조회
     * @param 공장코드, 검색 텍스트
     * @return client list [json] 
     */
    public function biz_list()
    {
        // variable list
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'content'  => $this->input->post('content', TRUE)
        );
        $data['list'] = $this->Ord_buy_m->get_biz_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 매입 제품 전체 조회/검색 조회
     * @param 공장코드, 검색 텍스트
     * @return buy item list [json] 
     */
    public function buy_item()
    {
        // variable list
        $data['var'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'content'  => $this->input->post('content', TRUE)
        );
        $data['list'] = $this->Ord_buy_m->get_buy_item($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 구매 발주 등록 - insert
     * @return result code [json] 
     */
    public function i()
    {
        // variable list
        $local_cd = $this->session->userdata['local_cd'];
        $ord_no = date("Ymd").rand(10000, 99999);
        $cust_cd = $this->input->post('cust_cd', TRUE);
        $biz = $this->Common_m->get_row('biz_list', array('cust_cd' => $cust_cd));

        $data['unique'] = array(
            'ord_no' => $ord_no
        );

        // 마스터 등록정보
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'cust_cd'       => $cust_cd,
            'cust_nm'       => $biz->cust_nm,
            'biz_nm'        => $biz->biz_nm,
            'ord_no'        => $ord_no,
            'ord_dt'        => $this->input->post('ord_dt', TRUE),
            'vat'           => $this->input->post('vat', TRUE),
            'memo'          => $this->input->post('memo', TRUE),
            'state'         => $this->input->post('state', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );

        $spec = array(
            'size'  => $this->input->post('size', TRUE),
            'unit'  => $this->input->post('unit', TRUE)
        );

        // 상세 등록정보
        $data['sub'] = array(
            'local_cd'      => $local_cd,
            'cust_cd'       => $cust_cd,
            'ord_no'        => $ord_no,
            'ord_seq'       => $this->input->post('ord_seq', TRUE),
            'ord_bseq'      => 1,
            'item_cd'       => $this->input->post('item_cd', TRUE),
            'item_nm'       => $this->input->post('item_nm', TRUE),
            'size'          => $this->input->post('size', TRUE),
            'unit'          => $this->input->post('unit', TRUE),
            'ord_qty'       => $this->input->post('ord_qty', TRUE),
            'unit_amt'      => $this->input->post('unit_amt', TRUE),
            'ord_amt'       => $this->input->post('ord_amt', TRUE),
            'tax_amt'       => $this->input->post('tax_amt', TRUE),
            'total_amt'     => $this->input->post('total_amt', TRUE),   // 회계용 합계
            'total_tax'     => $this->input->post('total_tax', TRUE),
            'ord_memo'      => $this->input->post('ord_memo', TRUE),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );

        if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0)
        {
            $result = $this->Ord_buy_m->insert_batch($data['reg'], $data['sub']); // insert data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else // fail
        {
            exit(json_encode(['code'=>401]));
        }

    }

    /**
     * @description 구매 발주 수정 - update
     * @return result code [json] 
     */
    public function u()
    {
        // variable list
        $local_cd  = $this->session->userdata['local_cd'];
        $ord_no    = $this->input->post('ord_no', TRUE);
        $cust_cd   = $this->input->post('cust_cd', TRUE);
        $biz       = $this->Common_m->get_row('biz_list', array('cust_cd' => $cust_cd));

        // 기 발주확인
        $order = $this->Common_m->get_row('buy_master', array('ord_no'=>$ord_no));

        // 진행 상태값이 접수 이상이면 sysyn="Y"로 변경
        $state = $this->input->post('state', TRUE);
        $sysyn = ($state == "001") ? "N" : "Y";

        $data['unique'] = array(
            'local_cd'  => $local_cd,
            'ord_no'    => $ord_no
        );

        // 마스터 수정정보
        $data['mod'] = array(
            'local_cd'      => $local_cd,
            'cust_cd'       => $cust_cd,
            'cust_nm'       => $biz->cust_nm,
            'biz_nm'        => $biz->biz_nm,
            'ord_no'        => $ord_no,
            'ord_dt'        => $this->input->post('ord_dt', TRUE),
            'vat'           => $this->input->post('vat', TRUE),
            'memo'          => $this->input->post('memo', TRUE),
            'state'         => $state,
            'sysyn'         => $sysyn,
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );

        $spec = array(
            'size'  => $this->input->post('size', TRUE),
            'unit'  => $this->input->post('unit', TRUE)
        );

        // 상세 수정정보
        $data['sub'] = array(
            'local_cd'      => $local_cd,
            'ori_cust_cd'   => $order->cust_cd, // 기 거래처코드
            'cust_cd'       => $cust_cd,
            'ord_no'        => $ord_no,
            'ord_seq'       => $this->input->post('ord_seq', TRUE),
            'ord_bseq'      => 1,
            'item_cd'       => $this->input->post('item_cd', TRUE),
            'item_nm'       => $this->input->post('item_nm', TRUE),
            'size'          => $this->input->post('size', TRUE),
            'unit'          => $this->input->post('unit', TRUE),
            'ord_qty'       => $this->input->post('ord_qty', TRUE),
            'unit_amt'      => $this->input->post('unit_amt', TRUE),
            'ord_amt'       => $this->input->post('ord_amt', TRUE),
            'tax_amt'       => $this->input->post('tax_amt', TRUE),
            'total_amt'     => $this->input->post('total_amt', TRUE),   // 회계용 합계
            'total_tax'     => $this->input->post('total_tax', TRUE),
            'ord_memo'      => $this->input->post('ord_memo', TRUE),
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );

        if ($this->Common_m->get_column_count($this->table, $data['unique']) > 0)
        {
            $result = $this->Ord_buy_m->update_batch($data['mod'], $data['sub'], $data['unique']); // update data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else // fail
        {
            exit(json_encode(['code'=>401]));
        }

    }

    /**
     * @description 구매 발주 삭제 - delete
     * @return result code [json] 
     */
    public function d()
    {
        // 발주 삭제 조건 - 시스템 미사용 상태만 삭제가능(sysyn="N")
        $data['case1'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE),
            'sysyn'     => "N"
        );

        // 회계 삭제 조건 - 전표 마감전 상태만 삭제가능(sysyn="N")
        $data['case2'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ord_no'    => $this->input->post('ord_no', TRUE),
            'sysyn'     => "N"
        );

        $case1 = $this->Common_m->get_column_count($this->table, $data['case1']);
        $case2 = $this->Common_m->get_column_count('buy_acc_list', $data['case2']);
        
        // 삭제
        if ($case1 > 0 && $case2 > 0) // DB에 조건 값 일치할 경우 삭제 진행
        {
            $result1 = $this->Common_m->real_del($this->table, $data['case1']);
            $result2 = $this->Common_m->real_del('buy_acc_list', $data['case2']);
            if ($result1 && $result2)
            {
                exit(json_encode(['code'=>100]));
            }
            else
            {
                exit(json_encode(['code'=>999]));
            }
        } 
        else 
        {
            exit(json_encode(['code'=>401])); 
        }
    }

    /**
     * @description 구매 확정 - update
     * @return result code [json] 
     */
    public function su()
    {
        // 수정 조건
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd' => $local_cd,
            'ikey'     => $this->input->post('ikey', TRUE)
        );

        // 수정 정보
        $data['mod'] = array(
            'local_cd'      => $local_cd,
            'ikey'          => $this->input->post('ikey', TRUE),
            'state'         => '002',
            'sysyn'         => 'Y',
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'today'         => date("Y-m-d H:i:s")
        );
        $result = $this->Ord_buy_m->update_batch_state($data['mod'], $data['var']); // update data
        $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
    }

    /**
     * @description 전표 마감 - update
     * @return result code [json] 
     */
    public function pay()
    {
        // variable list
        $local_cd  = $this->session->userdata['local_cd'];
        $ord_no    = $this->input->post('ord_no', TRUE);

        $data['var'] = array(
            'local_cd'  => $local_cd,
            'ord_no'    => $ord_no
        );

        // 전표 마감정보
        $data['mod'] = array(
            'state'       => '004',
            'finyn'       => 'Y',
            'sysyn'       => 'Y',
            'mod_ikey'    => $this->session->userdata['ikey'],
            'mod_ip'      => $this->input->ip_address(),
            'mod_dt'      => date("Y-m-d H:i:s")
        );

        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0)
        {
            $result = $this->Common_m->update2($this->table, $data['mod'], $data['var']); // update data
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
                array('field'=>'ord_dt',       'label'=>'발주일은',            'rules'=>'trim|required'),
                array('field'=>'state',        'label'=>'처리상태는',          'rules'=>'trim|required'),
                array('field'=>'cust_cd',      'label'=>'거래처는',            'rules'=>'trim|required'),
                array('field'=>'vat',          'label'=>'부가세는',            'rules'=>'trim|required'),
                array('field'=>'item_cd[]',    'label'=>'품목정보는',          'rules'=>'trim|required'),
                array('field'=>'item_nm[]',    'label'=>'품목명은',            'rules'=>'trim|required'),
                array('field'=>'ord_qty[]',    'label'=>'수량은',              'rules'=>'trim|required|numeric|callback_zero_check'),
                array('field'=>'unit_amt[]',   'label'=>'매입단가는',          'rules'=>'trim|required|numeric'),
                array('field'=>'ord_amt[]',    'label'=>'주문금액은',          'rules'=>'trim|required|numeric'),
                array('field'=>'tax_amt[]',    'label'=>'세액은',              'rules'=>'trim|required|numeric')
            );
            
            $this->form_validation->set_rules($config);
            if ($this->form_validation->run() == TRUE) // success 
            {
                switch ($param) 
                {
                    case 'in':
                        exit(json_encode(['code'=>100, 'list'=>$_POST]));
                    break;
                    case 'up':
                        exit(json_encode(['code'=>200, 'list'=>$_POST]));
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

    /**
     * @description 최소 입력값 추가 검증
     * @return result code [bool] 
     */
    public function zero_check($param)
    {
        if (!floatval(str_replace( ",", "", $param)) > 0)
        {
            $this->form_validation->set_message('zero_check', '%s 1개(원) 이상 입력 가능합니다.');
            return FALSE;
        }
        else
        {
            return TRUE;
        }
    } 

}
