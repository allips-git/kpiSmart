<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 구매 입고(Product put) 관리 컨트롤러
 * @author 안성준, @version 1.0, @last date 2022/09/06
 */
class Prod_put extends CI_Controller {

    protected $table = 'stock';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('stock/Prod_put_m');
	}

	public function index()
	{
        $local_cd = $this->session->userdata['local_cd'];
        // 창고 리스트
        $data['var'] = array(
            'local_cd'      =>  $local_cd,
            'main_cd'       =>  'WH'
        );
        $data['wh_uc'] = $this->Common_m->get_result2('warehouse', $data['var'], 'wh_seq ASC');
        $data['re_gb'] = $this->Common_m->get_result2('return_type', array('local_cd'=>$local_cd, 'main_cd'=>'RE', 'useyn'=>'Y'), 're_seq ASC'); // 반품 유형

        // header, asize 디자인 유지용 파라미터
        $data['title'] = '입고 관리';
        $data['site_url'] = '/stock/prod_put';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('stock/prod_put', $data);
        $this->load->view('include/ord/buy_li_pop', $data);
        $this->load->view('include/base/return_gb_pop', $data);
        $this->load->view('include/stock/return_pop', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
	}

    /**
     * @description 입고 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 시작일, 검색 종료일
     * @return warehouse list [json] 
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
        $data['list'] = $this->Prod_put_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    /**
     * @description 입고 상세페이지
     * @param 입고ikey
     */
    public function detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Prod_put_m->get_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }  

    /**
     * @description 구매 입고 등록 - insert
     * @return result code [json] 
     */
    public function i()
    {
        // variable list
        $put_dt     = $this->input->post('put_dt', TRUE);
        $job_sq     = str_replace("-","",$put_dt).date("his",time());
        $wh_uc      = $this->input->post('wh_uc', TRUE);
        $item_cd    = $this->input->post('item_cd', TRUE);
        $max_dt     = $this->input->post('max_dt', TRUE);
        $barcode    = date("Ymd").rand(10000, 99999);
        $amt        = (float) str_replace(",", "", $this->input->post('amt', TRUE));
        $vat        = $this->input->post('vat', TRUE);
        $tax        = ($vat == "N") ? $amt * 0.1 : 0;
        $qty        = (float) str_replace(",", "", $this->input->post('qty', TRUE));

        // 재고 생성 여부 확인
        $data['var'] = array(
            'wh_uc'     => $wh_uc,
            'item_cd'   => $item_cd,
            'max_dt'    => $max_dt,
            'stock_amt' => $amt,
            'vat'       => $vat
        );
        $count  = $this->Common_m->get_column_count('stock', $data['var']);

        // 이미 생성된 재고 데이터가 있을경우 기 재고번호(st_sq) 가져오기. 없을경우 신규 재고번호 생성
        if($count > 0)
        {
            $stock = $this->Common_m->get_row('stock', $data['var']);
            $st_sq = $stock->st_sq;
        }
        else
        {
            $st_sq = date("ymdhis",time());
        }

        // 품목 상세 정보 확인
        $item = $this->Common_m->get_row('item_list', array('item_cd'=>$item_cd));
        $spec = array(
            'size'  => $item->size,
            'unit'  => $item->unit
        );

        // 재고 생성
        $data['stock'] = array(
            'local_cd'      => $this->session->userdata['local_cd'],
            'st_sq'         => $st_sq,
            'wh_uc'         => $wh_uc,
            'item_cd'       => $item_cd,
            'max_dt'        => $max_dt,
            'stock_amt'     => $amt,
            'tax_amt'       => $tax,
            'vat'           => $vat,
            'in_qty'        => $qty,
            'qty'           => $qty,
            'barcode'       => $barcode,
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );

        // 입고 이력 등록정보
        $data['reg'] = array(
            'local_cd'      => $this->session->userdata['local_cd'],
            'job_sq'        => $job_sq,
            'put_dt'        => $put_dt,
            'st_sq'         => $st_sq,
            'work'          => "IN",
            'details'       => "001",
            'ord_no'        => $this->input->post('ord_no', TRUE),
            'lot'           => $this->input->post('lot', TRUE),
            'item_cd'       => $item_cd,
            'qty'           => $qty,
            'amt'           => $amt,
            'tax'           => $tax,
            'vat'           => $vat,
            'spec'          => json_encode($spec),
            'memo'          => $this->input->post('memo', TRUE),
            'state'         => "002",
            'barcode'       => $barcode,
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );

        // 신규(창고, 품목, 유통기한, 재고단가)일 경우 INSERT, 이미 존재할 경우 재고 수량만 UPDATE 
        if ($count == 0)
        {
            $result = $this->Prod_put_m->insert('insert', $data['stock'], $data['reg']); // insert data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else
        {
            $result = $this->Prod_put_m->insert('update', $data['stock'], $data['reg']); // update data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
    }

    /**
    * @description 구매 입고 수정 - update
    * @return result code [json] 
    */
    public function u()
    {
        // variable list
        $amt  = (float) str_replace( ",", "", $this->input->post('amt', TRUE));
        $vat  = $this->input->post('vat', TRUE);
        $ikey = $this->input->post('ikey', TRUE);
        $qty = (float) str_replace(",", "", $this->input->post('qty', TRUE));
            
        // 재고 생성 확인
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'st_sq'     => $this->input->post('st_sq', TRUE)
        );

        // 생성된 재고가 있을경우 재고 변경 작업 진행
        if ($this->Common_m->get_column_count('stock', $data['var']) > 0)
        {
            // 재고 상세
            $stock = $this->Common_m->get_row('stock', $data['var']);

            // 수정 전 기초 구매입고량 확인용
            $history = $this->Common_m->get_row('stock_history', array('ikey'=>$ikey));

            // 구매입고 업데이트
            $data['stock'] = array(
                'local_cd'      => $this->session->userdata['local_cd'],
                'st_sq'         => $this->input->post('st_sq', TRUE),
                'wh_uc'         => $stock->wh_uc,
                'item_cd'       => $stock->item_cd,
                'in_qty'        => $history->qty,
                'qty'           => $qty,
                'mod_ikey'      => $this->session->userdata['ikey'],
                'mod_ip'        => $this->input->ip_address(),
                'mod_dt'        => date("Y-m-d H:i:s")
            );

            // 구매 이력 수정정보
            $data['mod'] = array(
                'ikey'          => $ikey,
                'local_cd'      => $this->session->userdata['local_cd'],
                'put_dt'        => $this->input->post('put_dt', TRUE),
                'qty'           => $qty,
                'amt'           => $amt,
                'tax'           => ($vat == "N") ? $amt * 0.1 : 0,
                'vat'           => $vat,
                'memo'          => $this->input->post('memo', TRUE),
                'mod_ikey'      => $this->session->userdata['ikey'],
                'mod_ip'        => $this->input->ip_address(),
                'mod_dt'        => date("Y-m-d H:i:s")
            );
            $result = $this->Prod_put_m->update($data['stock'], $data['mod']); // update data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else
        {
            exit(json_encode(['code'=>401]));
        }
    }

    /**
     * @description 구매 입고 삭제 - delete
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
        if ($this->Common_m->get_column_count("stock_history", $data['var']) > 0)
        {
            $result = $this->Prod_put_m->delete($data['del']);
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
                array('field'=>'put_dt',        'label'=>'입고일자를',          'rules'=>'trim|required'),
                array('field'=>'lot',           'label'=>'발주정보를',          'rules'=>'trim|required'),
                array('field'=>'wh_uc',         'label'=>'창고를',              'rules'=>'trim|required'),
                array('field'=>'qty',           'label'=>'입고수량을',          'rules'=>'trim|required|callback_zero_check')
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
