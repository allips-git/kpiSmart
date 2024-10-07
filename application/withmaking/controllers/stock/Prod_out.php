<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 제품 출고 관리(Product out) 관리 컨트롤러
 * @author , @version 1.0, @last date 2022/08/30
 */
class Prod_out extends CI_Controller {

    protected $table  = 'stock_history';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('stock/Prod_out_m');
	}

	public function index()
	{
        // 창고 리스트
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd'      =>  $local_cd,
            'useyn'         =>  'Y',
            'delyn'         =>  'N'
        );
        $data['wh_uc'] = $this->Common_m->get_result2('warehouse', $data['var'], 'wh_nm ASC');

        // 반품 유형 리스트
        $data['var'] = array(
            'local_cd'  =>  $this->session->userdata['local_cd'],
            'useyn'     =>  'Y',
            'delyn'     =>  'N',
        );
        $data['return'] = $this->Common_m->get_result2('return_type', $data['var'], 're_seq ASC');

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '제품 출고 관리';
        $data['site_url'] = '/stock/prod_out';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('stock/prod_out', $data);
        $this->load->view('include/ord/ord_li_pop', $data);
        $this->load->view('include/stock/prod_st_pop', $data);
        $this->load->view('include/stock/ord_re_pop', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 제품 출고 리스트 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 날짜, 창고 
     * @return factory item list [json] 
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
            'wh_uc'     => $this->input->post('wh_uc', TRUE)
        );
        $data['list'] = $this->Prod_out_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 제품 출고 상세
     * @param 공장코드, 제품ikey
     */
    public function detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Prod_out_m->get_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 제품 출고 등록 - insert
     * @return result code [json] 
     */
    public function i()
    {
        // variable list
        $put_dt    = $this->input->post('put_dt', TRUE);
        $job_sq    = str_replace("-","", $put_dt).date("his",time());
        $st_sq     = $this->input->post('st_sq', TRUE);
        $ord_amt   = (float) str_replace( ",", "", $this->input->post('ord_amt', TRUE));
        $vat       = $this->input->post('vat', TRUE);
        $qty       = (float) str_replace(",", "", $this->input->post('qty', TRUE));

        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'st_sq'     => $st_sq
        );

        // 재고 생성 있을 경우만 출고 등록
        if ($this->Common_m->get_column_count('stock', $data['var']) > 0)
        {
            // 재고 상세 확인
            $stock = $this->Common_m->get_row('stock', $data['var']);

            // 품목 상세 정보 확인
            $item = $this->Common_m->get_row('item_list', array('item_cd'=>$stock->item_cd));
            $spec = array(
                'size'  => $item->size,
                'unit'  => $item->unit
            );

            // 재고 업데이트
            $data['stock'] = array(
                'local_cd'      => $this->session->userdata['local_cd'],
                'st_sq'         => $st_sq,
                'qty'           => $qty,
                'wh_uc'         => $stock->wh_uc,
                'item_cd'       => $stock->item_cd
            );

            // 출고 이력 등록정보
            $data['reg'] = array(
                'local_cd'      => $this->session->userdata['local_cd'],
                'job_sq'        => $job_sq,
                'put_dt'        => $put_dt,
                'st_sq'         => $st_sq,
                'work'          => "OUT",
                'details'       => "002",
                'ord_no'        => $this->input->post('ord_no', TRUE),
                'lot'           => $this->input->post('lot', TRUE),
                'item_cd'       => $stock->item_cd,
                'qty'           => $qty,
                'amt'           => $ord_amt,
                'tax'           => ($vat == "N") ? $ord_amt * 0.1 : 0,
                'vat'           => $vat,
                'spec'          => json_encode($spec),
                'memo'          => $this->input->post('memo', TRUE),
                'state'         => "005",
                'barcode'       => $stock->barcode,
                'reg_ikey'      => $this->session->userdata['ikey'],
                'reg_ip'        => $this->input->ip_address(),
                'reg_dt'        => date("Y-m-d H:i:s")
            );
            $result = $this->Prod_out_m->insert($data['stock'], $data['reg']); // insert data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else
        {
            exit(json_encode(['code'=>400]));
        }

    }

    /**
     * @description 제품 출고 수정 - insert
     * @return result code [json] 
     */
    public function u()
    {
        // variable list
        $ikey = $this->input->post('ikey', TRUE);
        $qty  = (float) str_replace(",", "", $this->input->post('qty', TRUE));
        
        // 재고 생성 확인
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'st_sq'     => $this->input->post('st_sq', TRUE)
        );

        // 생성된 재고가 있을경우 재고 변경 작업 진행
        if ($this->Common_m->get_column_count('stock', $data['var']) > 0)
        {
            // 수정 전 출고 수량 확인용
            $history = $this->Common_m->get_row('stock_history', array('ikey'=>$ikey));

            // 재고 업데이트
            $data['stock'] = array(
                'local_cd'      => $this->session->userdata['local_cd'],
                'st_sq'         => $this->input->post('st_sq', TRUE),
                'out_qty'       => $history->qty
            );

            // 출고 이력 수정정보
            $data['mod'] = array(
                'ikey'          => $ikey,
                'local_cd'      => $this->session->userdata['local_cd'],
                'put_dt'        => $this->input->post('put_dt', TRUE),
                'qty'           => $qty,
                'memo'          => $this->input->post('memo', TRUE),
                'mod_ikey'      => $this->session->userdata['ikey'],
                'mod_ip'        => $this->input->ip_address(),
                'mod_dt'        => date("Y-m-d H:i:s")
            );
            $result = $this->Prod_out_m->update($data['stock'], $data['mod']); // update data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else
        {
            exit(json_encode(['code'=>401]));
        }
    }


    /**
     * @description 제품 출고 비활성화 - delete
     * @return result code [json] 
     */
    public function d()
    {
        // 삭제 조건1 - 삭제 조건값 DB에 있을 경우
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );

        // 비활성화 정보
        $data['del'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'ikey'     => $this->input->post('ikey', TRUE),
            'st_sq'    => $this->input->post('st_sq', TRUE),
            'qty'      => $this->input->post('qty', TRUE),
            'mod_ikey' => $this->session->userdata['ikey'],
            'mod_ip'   => $this->input->ip_address(),
            'mod_dt'   => date("Y-m-d H:i:s")
        );
        
        // 삭제
        if ($this->Common_m->get_column_count($this->table, $data['var']) > 0)
        {
            $result = $this->Prod_out_m->delete($data['del']);
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        } 
        else 
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
                array('field'=>'put_dt',        'label'=>'출고일자는',         'rules'=>'trim|required'),
                array('field'=>'lot',           'label'=>'주문선택은',         'rules'=>'trim|required'),
                array('field'=>'st_sq',         'label'=>'제품은',             'rules'=>'trim|required'),
                array('field'=>'ord_amt',       'label'=>'출고단가는',         'rules'=>'trim|required'),
                array('field'=>'tax_amt',       'label'=>'출고단가는',         'rules'=>'trim|required'),
                array('field'=>'qty',           'label'=>'출고수량은',         'rules'=>'trim|required|callback_zero_check')
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
                exit(json_encode(['code'=>999, 'result'=>$_POST, 'err_msg'=>validation_errors()]));
            }

        } 
        else // params fail 
        {
            exit(json_encode(['code'=>999, 'result'=>$_POST, 'err_msg'=>validation_errors()]));
       }
    }

    /**
     * @description 최소 입력값 검증 (숫자, 콤마만 허용)
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
