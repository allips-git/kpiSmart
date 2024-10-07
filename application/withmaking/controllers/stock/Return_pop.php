<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 반품 출고 팝업 관리 컨트롤러
 * @author 안성준, @version 1.0, @last date
 * @author 김민주, @version 2.0, @last date 2022/07/04 - 이슈 수정
 * @author 안성준, @version 3.0, @last date 2022/08/31 - DB 구조변경 이슈 수정
 */
class Return_pop extends CI_Controller {

    protected $table = 'stock';

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('stock/Return_pop_m');
	}

    /**
     * @description 반품 기본정보
     * @param 공장코드, 반품ikey
     */
    public function info()
    {   
        // variable list
        $local_cd = $this->session->userdata['local_cd'];
        $data['var'] = array(
            'local_cd'  => $local_cd,
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Return_pop_m->get_info($data['var']);
        $data['re_gb'] = $this->Common_m->get_result2('return_type', array('local_cd'=>$local_cd, 'main_cd'=>'RE', 'useyn'=>'Y'), 're_seq ASC'); // 반품 유형
        exit(json_encode(['result'=>$data])); // return result list
    } 

    /**
     * @description 반품 리스트
     * @param 공장코드, 바코드 번호
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'   => $this->session->userdata['local_cd'],
            'key_parent' => $this->input->post('key_parent', TRUE)
        );
        $data['list'] = $this->Return_pop_m->get_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list     
    } 


    /**
     * @description 반품 상세
     * @param 반품ikey
     */
    public function detail()
    {   
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );
        $data['detail'] = $this->Return_pop_m->get_return_detail($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }  

    /**
     * @description 반품 등록- insert
     * @return result code [json] 
     */

    public function i()
    {
        // variable list
        $put_dt     = $this->input->post('re_put_dt', TRUE);
        $job_sq     = str_replace("-","",$put_dt).date("his",time());

        // 부모키 생산이력 확인
        $key_parent = $this->input->post('key_parent', TRUE);
        $parent     = $this->Common_m->get_row('stock_history', array('ikey'=>$key_parent));

        // 재고 생성 확인
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'st_sq'     => $parent->st_sq
        );

        // 생성된 재고가 있을경우 재고 변경 작업 진행
        if ($this->Common_m->get_column_count('stock', $data['var']) > 0)
        {
            // 재고 상세
            $stock = $this->Common_m->get_row('stock', $data['var']);

            // 품목 상세 정보 확인
            $item = $this->Common_m->get_row('item_list', array('item_cd'=>$parent->item_cd));
            $spec = array(
                'size'      => $item->size,
                'unit'      => $item->unit,
                're_gb'     => $this->input->post('re_gb', TRUE),
                're_memo'   => $this->input->post('re_memo', TRUE)
            );

            // 반품 이력 등록정보
            $data['reg'] = array(
                'local_cd'      => $this->session->userdata['local_cd'],
                'job_sq'        => $job_sq,
                'key_parent'    => $key_parent,
                'put_dt'        => $put_dt,
                'st_sq'         => $parent->st_sq,
                'work'          => "OUT",
                'details'       => "006",
                'ord_no'        => $parent->ord_no,
                'lot'           => $parent->lot,
                'lot'           => $parent->lot,
                'item_cd'       => $parent->item_cd,
                'qty'           => $this->input->post('qty', TRUE),
                'amt'           => $parent->amt,
                'tax'           => $parent->tax,
                'vat'           => $parent->vat,
                'spec'          => json_encode($spec),
                'state'         => "002",
                'barcode'       => $stock->barcode,
                'memo'          => $this->input->post('memo', TRUE),
                'reg_ikey'      => $this->session->userdata['ikey'],
                'reg_ip'        => $this->input->ip_address()
            );
            $result = $this->Return_pop_m->re_insert($data['reg']); // insert data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else
        {
            exit(json_encode(['code'=>401]));
        }
    }
    

    /**
    * @description 반품 수정 - update
    * @return result code [json] 
    */
    public function u()
    {
        // variable list
        $ikey     = $this->input->post('ikey', TRUE);
        $history  = $this->Common_m->get_row('stock_history', array('ikey'=>$ikey));
        
        // 수정 조건
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $ikey
        );

        // 수정 조건 확인
        if ($this->Common_m->get_column_count('stock_history', $data['var']) > 0)
        {
            // 품목 상세 정보 확인
            $item = $this->Common_m->get_row('item_list', array('item_cd'=>$history->item_cd));
            $spec = array(
                'size'      => $item->size,
                'unit'      => $item->unit,
                're_gb'     => $this->input->post('re_gb', TRUE),
                're_memo'   => $this->input->post('re_memo', TRUE)
            );

            // 기존 재고 업데이트
            $data['stock'] = array(
                'st_sq'      => $history->st_sq,
                're_out_qty' => $history->qty,
            );

            // 반품 이력 수정정보
            $data['mod'] = array(
                'ikey'       => $ikey,
                'put_dt'     => $this->input->post('re_put_dt', TRUE),
                'qty'        => $this->input->post('qty', TRUE),
                'spec'       => json_encode($spec),
                'memo'       => $this->input->post('re_memo', TRUE)
            );
            $result = $this->Return_pop_m->re_update($data['stock'], $data['mod']); // update data
            $result ? exit(json_encode(['code'=>100])) : exit(json_encode(['code'=>999]));
        }
        else
        {
            exit(json_encode(['code'=>401]));
        }

    }

    
    /**
     * @description 반품 비활성화 - delete
     * @return result code [json] 
     */
    public function d()
    {
        // 삭제 조건1 - 삭제 조건값 DB에 있을 경우
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'ikey'      => $this->input->post('ikey', TRUE)
        );

        // 불량 상세 확인
        $detail = $this->Common_m->get_row('stock_history', $data['var']);

        // 비활성화 정보
        $data['del'] = array(
            'local_cd' => $this->session->userdata['local_cd'],
            'ikey'     => $this->input->post('ikey', TRUE),
            'st_sq'    => $detail->st_sq,
            'qty'      => $detail->qty
        );
        
        // 삭제
        if ($this->Common_m->get_column_count("stock_history", $data['var']) > 0)
        {
            $result = $this->Return_pop_m->delete($data['del']);
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
        if (isset($_POST['re_p'])) 
        {
            $param = $this->input->post('re_p', TRUE);
                  
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
                array('field'=>'re_put_dt',     'label'=>'출고일',            'rules'=>'trim|required'),
                array('field'=>'re_gb',         'label'=>'반품유형',          'rules'=>'trim|required'),
                array('field'=>'qty',           'label'=>'반품수량',          'rules'=>'trim|required|callback_zero_check'),
                array('field'=>'re_memo',       'label'=>'반품사유',          'rules'=>'trim|required')
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
