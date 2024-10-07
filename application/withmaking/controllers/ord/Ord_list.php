<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 온라인 주문관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/18
 */
class Ord_list extends CI_Controller {

    protected $table  = 'ord_master';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('ord/Ord_list_m');
        $this->encrypt_key = $this->config->item('encrypt_key');
	}

	public function index()
	{
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '수주 관리';
        $data['site_url'] = '/ord/ord_list';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('ord/ord_list', $data);
        $this->load->view('include/acc/ord_close', $data);
        $this->load->view('include/ord/ord_excel_pop', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 온라인 주문 등록 페이지
     */
    public function in()
    {
        // 배송 구분
        $data['gb'] = array(
            'code_gb'       =>  'DI',
            'code_main'     =>  '010',
            'code_sub >'    =>  '000',
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['dlv_gb'] = $this->Common_m->get_result2('z_plan.common_code', $data['gb'], 'code_sub ASC');

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '수주 관리';
        $data['site_url'] = '/ord/ord_list';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('ord/ord_reg', $data);
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
        $data['ord'] = $this->Common_m->get_row('ord_master', $data['var']);
        
        // 거래처별 회계정보 확인
        $data['ac'] = $this->Ord_list_m->get_acc_info((array)$data['ord']);

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '수주 관리';
        $data['site_url'] = '/ord/ord_list';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('ord/ord_mod', $data);
        // $this->load->view('include/wk/put_pop', $data);
        // $this->load->view('include/wk/out_pop', $data);
        $this->load->view('include/acc/ord_close', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    /**
     * @description 온라인 주문 전체 조회/검색 조회
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
        $data['list'] = $this->Ord_list_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 온라인 주문 상세 조회
     * @param 공장코드, 주문번호
     * @return ord detail [json] 
     */
    public function detail()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ord_no'    => $this->input->post('ord_no', TRUE)
        );
        $data['detail'] = $this->Ord_list_m->get_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 배송 구분 리스트
     */
    public function dlv_list()
    {
        // 배송 구분
        $data['gb'] = array(
            'code_gb'       =>  'DI',
            'code_main'     =>  '010',
            'code_sub >'    =>  '000',
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['dlv_gb'] = $this->Common_m->get_result2('z_plan.common_code', $data['gb'], 'code_sub ASC');
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 온라인 주문 등록 - insert
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
            'mall_nm'       => $this->input->post('mall_nm', TRUE),
            'client_nm'     => $this->input->post('client_nm', TRUE),
            'client_tel'    => $this->input->post('client_tel', TRUE),
            'dlv_gb'        => $this->input->post('dlv_gb', TRUE),
            'dlv_zip'       => $this->input->post('dlv_zip', TRUE),
            'address'       => $this->input->post('address', TRUE),
            'addr_detail'   => $this->input->post('addr_detail', TRUE),
            'addr_text'     => $this->input->post('addr_text', TRUE),
            'ord_no'        => $ord_no,
            'ord_seq'       => $this->input->post('ord_seq', TRUE),
            'ord_bseq'      => 1,
            'item_cd'       => $this->input->post('item_cd', TRUE),
            'item_nm'       => $this->input->post('item_nm', TRUE),
            'size'          => $this->input->post('size', TRUE),
            'unit'          => $this->input->post('unit', TRUE),
            'ord_qty'       => $this->input->post('ord_qty', TRUE),
            'sale_amt'      => $this->input->post('sale_amt', TRUE),
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
            $result = $this->Ord_list_m->insert_batch($data['reg'], $data['sub']); // insert data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else // fail
        {
            exit(json_encode(['code'=>401]));
        }

    }

    /**
     * @description 주문 수정 - update
     * @return result code [json] 
     */
    public function u()
    {
        // variable list
        $local_cd  = $this->session->userdata['local_cd'];
        $ord_no    = $this->input->post('ord_no', TRUE);
        $cust_cd   = $this->input->post('cust_cd', TRUE);
        $biz       = $this->Common_m->get_row('biz_list', array('cust_cd' => $cust_cd));

        // 기 주문확인
        $order = $this->Common_m->get_row('ord_master', array('ord_no'=>$ord_no));

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
            'mall_nm'       => $this->input->post('mall_nm', TRUE),
            'client_nm'     => $this->input->post('client_nm', TRUE),
            'client_tel'    => $this->input->post('client_tel', TRUE),
            'dlv_gb'        => $this->input->post('dlv_gb', TRUE),
            'dlv_zip'       => $this->input->post('dlv_zip', TRUE),
            'address'       => $this->input->post('address', TRUE),
            'addr_detail'   => $this->input->post('addr_detail', TRUE),
            'addr_text'     => $this->input->post('addr_text', TRUE),
            'ord_no'        => $ord_no,
            'ord_seq'       => $this->input->post('ord_seq', TRUE),
            'ord_bseq'      => 1,
            'item_cd'       => $this->input->post('item_cd', TRUE),
            'item_nm'       => $this->input->post('item_nm', TRUE),
            'size'          => $this->input->post('size', TRUE),
            'unit'          => $this->input->post('unit', TRUE),
            'ord_qty'       => $this->input->post('ord_qty', TRUE),
            'sale_amt'      => $this->input->post('sale_amt', TRUE),
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
            $result = $this->Ord_list_m->update_batch($data['mod'], $data['sub'], $data['unique']); // update data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else // fail
        {
            exit(json_encode(['code'=>401]));
        }

    }

    /**
     * @description 주문 삭제 - delete
     * @return result code [json] 
     */
    public function d()
    {
        // 주문 삭제 조건 - 시스템 미사용 상태만 삭제가능(sysyn="N")
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
        $case2 = $this->Common_m->get_column_count('ord_acc_list', $data['case2']);
        
        // 삭제
        if ($case1 > 0 && $case2 > 0) // DB에 조건 값 일치할 경우 삭제 진행
        {
            $result1 = $this->Common_m->real_del($this->table, $data['case1']);
            $result2 = $this->Common_m->real_del('ord_acc_list', $data['case2']);
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
     * @description 주문 확정 - update
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
        $result = $this->Ord_list_m->update_batch_state($data['mod'], $data['var']); // update data
        $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
    }

    /**
     * @description 주문 일괄 등록(엑셀 업로드)
     * @return result code [json] 
     */
    public function excel()
    {
        try {

            $this->load->library("PHPExcel");
            $objPHPExcel = new PHPExcel();
            $file_name = iconv("UTF-8", "EUC-KR", $_FILES['excel_file']['tmp_name']);

            // 업로드 된 엑셀 형식에 맞는 Reader객체 생성
            $obj_reader = PHPExcel_IOFactory::createReaderForFile($file_name);

            // 읽기전용으로 설정
            $obj_reader->setReadDataOnly(true);

            // 엑셀파일 읽기
            $obj_excel = $obj_reader->load($file_name);
            $sheets_count = $obj_excel->getSheetCount();

            // variable list
            $local_cd = $this->session->userdata['local_cd'];
            $cust_cd = $local_cd.'C00001'; // 마스터 거래처는 고정값 지정(협의사항 2022/10/12)
            $ord_no = date("Ymd").rand(10000, 99999);
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
                'ord_dt'        => date("Y-m-d"),
                'vat'           => 'Y', // 마스터 부가세 설정은 면세로 고정값 지정(협의사항 2022/10/12)
                'state'         => "001",
                'reg_ikey'      => $this->session->userdata['ikey'],
                'reg_ip'        => $this->input->ip_address()
            );

            for($i = 0; $i < $sheets_count; $i++) 
            {
                $obj_excel->setActiveSheetIndex($i);
                $sheet = $obj_excel->getActiveSheet();
                $highest_row = $sheet->getHighestRow();          // 마지막 행
                $max_column = $sheet->getHighestColumn();        // 마지막 칼럼
                for ($row = 10; $row <= $highest_row; $row++) 
                {
                    // 제품이 있는경우만 등록
                    if (!empty(trim($sheet->getCell('A' . $row)->getValue()))) 
                    {
                        $data['sub'][] = array(
                            'item_cd'       => $sheet->getCell('A' . $row)->getValue(),
                            'ord_amt'       => $sheet->getCell('B' . $row)->getValue(),
                            'ord_qty'       => $sheet->getCell('C' . $row)->getValue(),
                            'mall_nm'       => $sheet->getCell('D' . $row)->getValue(),
                            'client_nm'     => $sheet->getCell('E' . $row)->getValue(),
                            'client_tel'    => $sheet->getCell('F' . $row)->getValue(),
                            'dlv_zip'       => $sheet->getCell('G' . $row)->getValue(),
                            'address'       => $sheet->getCell('H' . $row)->getValue(),
                            'addr_detail'   => $sheet->getCell('I' . $row)->getValue(),
                            'addr_text'     => $sheet->getCell('J' . $row)->getValue()
                        );
                    }
                }
            }
            if ($this->Common_m->get_column_count($this->table, $data['unique']) == 0)
            {
                $result = $this->Ord_list_m->insert_excel($data['reg'], $data['sub']); // insert excel
                $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
                log_message('debug', $result);
            }
            else // fail
            {
                exit(json_encode(['code'=>401]));
            }

        } catch (exception $e) {
            echo $e;
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
                array('field'=>'ord_dt',       'label'=>'주문일은',            'rules'=>'trim|required'),
                array('field'=>'state',        'label'=>'처리상태는',          'rules'=>'trim|required'),
                array('field'=>'cust_cd',      'label'=>'거래처는',            'rules'=>'trim|required'),
                array('field'=>'vat',          'label'=>'부가세는',            'rules'=>'trim|required'),
                array('field'=>'item_cd[]',    'label'=>'제품은',              'rules'=>'trim|required'),
                array('field'=>'ord_qty[]',    'label'=>'수량은',              'rules'=>'trim|required|numeric|callback_zero_check'),
                array('field'=>'sale_amt[]',   'label'=>'판매단가는',          'rules'=>'trim|required|numeric|callback_zero_check'),
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

    /**
     * @description 엑셀업로드 등록폼 검증 - validation
     * @return result code [json] 
     */
    public function file_v() 
    {
        if (is_uploaded_file($_FILES['excel_file']['tmp_name'])) 
        {
            exit(json_encode(['code'=>100, 'resulr'=> $_POST]));
        } 
        else 
        {
            exit(json_encode(['code'=>999, 'err_msg'=>'필수 입력항목 확인 후 다시 이용 바랍니다.']));
        }
    }

}
