<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 안드로이드 API 컨트롤러
 * @author 안성준, @version 1.0, @last date 2022/09/05
 */
class Api extends CI_Controller {

    protected $result_success  = 1;
    protected $result_fail     = 0;

    public function __construct() 
    { 
        parent::__construct();
        $this->load->model('Login_m');
        $this->load->model('api/Api_m');
    }
     
    /**
     * @description 로그인시 동작하는 API 함수
     */
    public function login()
    {
        $ul_cd = $this->input->post('ul_cd', TRUE);
        $id = $this->input->post('id', TRUE);
        $pass = strtoupper(hash('sha256', $this->input->post('pass', TRUE)));

        $data['users'] = array(
            'ul_cd'     => $ul_cd,
            'id'        => $id,
            'pass'      => $pass,
            'useyn'     => 'Y'
        );

        // login success 
        $data['result'] = $this->Api_m->select_user($id, $pass, $ul_cd);
        $row = $this->Login_m->select_users_all($data['users']['id'], $data['users']['ul_cd']);
        if ($this->Login_m->check_users($data['users']) > 0) 
        {
            $this->session->set_userdata(
                array(
                    'ikey'      => $row->ikey,
                    'local_cd'  => $row->local_cd,
                    'ul_nm'     => $row->ul_nm,
                    'id'        => $row->id,
                    'is_login'  => TRUE,
                    'ul_uc'     => $row->ul_uc,
                    'dp_uc'     => $row->dp_uc,
                    'fa_nm'     => $row->fa_nm
                )
            );
            echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'로그인 되었습니다.']); 
        }
        else
        {  
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result']
                ,'ResultMessage'=>'입력하신 정보와 일치하는 사용자가 없습니다.']); 
        }         
    }

    /**
     * @description 작업 시작 API 함수
     */
    public function start_work()
    {
        //job_master 수정 조건
        $data['var_m'] = array(
            'job_no'    => $this->input->post('job_no', TRUE)
        );

        //job_detail 수정 조건
        $data['var_d'] = array(
            'job_no'    => $this->input->post('job_no', TRUE),
            'lot'       => $this->input->post('lot', TRUE)
        );

        $data['mod_m'] = array(
            'state'     => '003'
        );

        $data['mod_d'] = array(
            'job_st'    => $this->input->post('job_st', TRUE)
        );

        if ($this->Common_m->get_column_count("job_master", $data['var_m']) != 0 
            && $this->Common_m->get_column_count("job_detail", $data['var_d']) != 0)
        {
            $result = $this->Api_m->start_work_state($data['var_m'],$data['var_d'],$data['mod_m'],$data['mod_d']);

            if ($result) 
            {    
                echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'작업이 시작되었습니다.']); 
            }
            else
            {  
                echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result']
                    ,'ResultMessage'=>'작업시작에 실패하였습니다. 잠시 후 다시 시도해주세요.']); 
            } 
        }
        else
        {

        }
    }

    /**
     * @description 작업 완료 API 함수
     */
    public function update_work_state()
    {
        // 수정될 상태값
        $job_st = $this->input->post('job_st', TRUE);

        $msg_success = '오류 ERROR';
        $msg_fail    = '오류 ERROR';

        if($job_st == 'P')
        {
            $msg_success = '작업이 시작되었습니다.';
            $msg_fail    = '작업시작에 실패하였습니다. 잠시 후 다시 시도해주세요';
        }
        else if($job_st == 'S')
        {
            $msg_success = '작업이 중지되었습니다.';
            $msg_fail    = '작업중지에 실패하였습니다. 잠시 후 다시 시도해주세요.';
        }
        else if($job_st == 'F')
        {
            $msg_success = '작업이 완료되었습니다.';
            $msg_fail    = '작업완료에 실패하였습니다. 잠시 후 다시 시도해주세요.';
        }

        //job_detail 수정 조건
        $data['var'] = array(
            'job_no'    => $this->input->post('job_no', TRUE),
            'lot'       => $this->input->post('lot', TRUE)
        );

        //job_detail 수정 내용
        $data['mod'] = array(
            'job_st'    => $this->input->post('job_st', TRUE)
        );

        if ($this->Common_m->get_column_count("job_detail", $data['var']) > 0)
        {
            $result = $this->Api_m->change_work_state($data['var'], $data['mod']);
            if ($result) 
            {    
                echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'], 'ResultMessage'=> $msg_success]); 
            }
            else
            {  
                echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result'], 'ResultMessage'=> $msg_fail]); 
            } 
        }
        else
        {
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result']
                    ,'ResultMessage'=> '선택하신 작업이 현재 존재하지 않습니다. 다시 확인 해주세요.']); 
        }
    }

    /**
     * @description 비가동 사유 가지고 오는 API 함수
     */
    public function get_unused_list()
    {

        $data['var'] = array(
            'local_cd'     => $this->input->post('local_cd', TRUE)
        );
        $data['result'] = $this->Api_m->select_unused_list($data['var']);

        if (!empty($data['result'])) 
        {    
            echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'데이터를 불러왔습니다.']); 
        }
        else
        {  
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result']
                ,'ResultMessage'=>'비가동 사유 리스트가 존재하지 않습니다.']); 
        } 
    }
    
    /**
     * @description 작업장 가지고 오는 API 함수
     */
    public function get_work_place()
    {
        $data['var'] = array(
            'local_cd'     => $this->input->post('local_cd', TRUE)
        );
        $data['result'] = $this->Api_m->select_work_place($data['var']);

        if (!empty($data['result'])) 
        {    
            echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'데이터를 불러왔습니다.']); 
        }
        else
        {  
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result']
                ,'ResultMessage'=>'작업장 데이터가 존재하지 않습니다.']); 
        } 
    }

    /**
     * @description 작업자 가지고 오는 API 함수
     */
    public function get_worker()
    {
        $data['var'] = array(
            'local_cd'     => $this->input->post('local_cd', TRUE)
        );
        $data['result'] = $this->Api_m->select_worker($data['var']);

        if (!empty($data['result'])) 
        {    
            echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'데이터를 불러왔습니다.']); 
        }
        else
        {  
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result']
                ,'ResultMessage'=>'작업장 데이터가 존재하지 않습니다.']); 
        } 
    }

    /**
     * @description 창고 가지고 오는 API 함수
     */
    public function get_warehouse()
    {
        $data['var'] = array(
            'local_cd'     => $this->input->post('local_cd', TRUE)
        );
        $data['result'] = $this->Api_m->select_warehouse($data['var']);

        if (!empty($data['result'])) 
        {    
            echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'데이터를 불러왔습니다.']); 
        }
        else
        {  
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result']
                ,'ResultMessage'=>'창고 데이터가 존재하지 않습니다.']); 
        } 
    }

    /**
     * @description 작업관리 리스트 가지고오는 API 함수
     */
    public function get_job_management_list()
    {
        $job_st = $this->input->post('job_st', TRUE);
        $data['var'] = array(
            'local_cd'  => $this->input->post('local_cd', TRUE),
            'wp_uc'     => $this->input->post('wp_uc', TRUE),
            'ul_uc'     => $this->input->post('ul_uc', TRUE),
            'job_st'    => $job_st
        );

        if(empty($job_st))
        {
            $data['result'] = $this->Api_m->select_job_management_list($data['var']);
        }
        else
        {
            $data['result'] = $this->Api_m->select_job_st_management_list($data['var']);
        }

        if (!empty($data['result'])) 
        {    
            echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'데이터를 불러왔습니다.']); 
        }
        else
        {  
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result']
                ,'ResultMessage'=>'작업관리 리스트 데이터가 존재하지 않습니다.']); 
        } 
    }

    /**
     * @description 실적등록 선택항목의 상세정보 가져오는 API 함수
     */
    public function get_work_detail()
    {
        $data['var'] = array(
            'local_cd'  => $this->input->post('local_cd', TRUE),
            'lot'   => $this->input->post('lot',TRUE)
        );

        $data['result'] = $this->Api_m->select_job_master_row($data['var']);
        if (!empty($data['result'])) 
        {    
            echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'상세 데이터를 불러왔습니다.']); 
        }
        else
        {  
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result']
                ,'ResultMessage'=>'작업 데이터가 존재하지 않습니다.']); 
        } 
    }

    /**
     * @description 실적등록 실적 등록이 된 List 가져오는 API 함수
     */
    public function get_work_result_list()
    {
        $data['var'] = array(
            'local_cd'  => $this->input->post('local_cd', TRUE),
            'lot'   => $this->input->post('lot',TRUE)
        );

        $data['result'] = $this->Api_m->select_work_history_list($data['var']);
        if (!empty($data['result'])) 
        {    
            echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'리스트를 불러왔습니다.']); 
        }
        else
        {  
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result']
                ,'ResultMessage'=>'작업 데이터가 존재하지 않습니다.']); 
        } 
    }

    /**
     * @description 생산입고 생산입고에서 등록이 된 List 가져오는 API 함수
     */
    public function get_stock_list()
    {
        $data['var'] = array(
            'local_cd'  => $this->input->post('local_cd', TRUE),
            'ord_no'    => $this->input->post('ord_no',TRUE),
            'details'   => "003"
        );

        $data['result'] = $this->Api_m->select_stock_list($data['var']);
        if (!empty($data['result'])) 
        {    
            echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'리스트를 불러왔습니다.']); 
        }
        else
        {  
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result']
                ,'ResultMessage'=>'작업 데이터가 존재하지 않습니다.']); 
        } 
    }

    /**
     * @description 자재투입 BOM List 가져오는 API 함수
     */
    public function get_bom_list()
    {
        $data['var'] = array(
            'local_cd'  => $this->input->post('local_cd', TRUE),
            'item_cd'   => $this->input->post('item_cd',TRUE),
            'pp_uc'     => $this->input->post('pp_uc',TRUE),
            'lot'       => $this->input->post('lot',TRUE)
        );

        $data['result'] = $this->Api_m->select_bom_list($data['var']);
        if (!empty($data['result'])) 
        {    
            echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'리스트를 불러왔습니다.']); 
        }
        else
        {  
            echo json_encode(['ResultCode'=>$this->result_fail, 'ResultParam'=>$data['result'],'ResultMessage'=>'데이터가 존재하지 않습니다.']); 
        } 
    }

    /**
     * @description 자재투입 가능한 재고 목록 가져오는 API 함수
     */
    public function get_raw_list()
    {
        $data['var'] = array(
            'local_cd'  => $this->input->post('local_cd', TRUE),
            'item_cd'   => $this->input->post('item_cd',TRUE)
        );
        $data['result'] = $this->Api_m->select_raw_list($data['var']);
        if (!empty($data['result'])) 
        {    
            echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'리스트를 불러왔습니다.']); 
        }
        else
        {  
            echo json_encode(['ResultCode'=>$this->result_fail, 'ResultParam'=>$data['result'],'ResultMessage'=>'데이터가 존재하지 않습니다.']); 
        }
    }

    /**
     * @description 자재투입(생산출고) 등록하는 API 함수
     */
    public function set_raw_save()
    {
        // variable list
        $put_dt     = date('Y-m-d'); // today
        $job_sq     = str_replace("-","",$put_dt).date("his",time());
        $item_cd    = $this->input->post('item_cd', TRUE);
        $qty        = $this->input->post('qty', TRUE);

        // 재고 생성 확인
        $data['var'] = array(
            'local_cd'  => $this->input->post('local_cd', TRUE),
            'st_sq'     => $this->input->post('st_sq', TRUE)
        );

        // 생성된 재고가 있을경우 재고 변경 작업 진행
        if ($this->Common_m->get_column_count('stock', $data['var']) > 0)
        {
            // 재고 상세
            $stock = $this->Common_m->get_row('stock', $data['var']);

            // 품목 상세 정보 확인
            $item = $this->Common_m->get_row('item_list', array('item_cd'=>$item_cd));
            $spec = array(
                'size'  => $item->size,
                'unit'  => $item->unit
            );

            // 재고 상세
            $data['stock'] = array(
                'wh_uc'       => $stock->wh_uc,
                'item_cd'     => $stock->item_cd
            );

            // 생산출고 등록정보
            $data['reg'] = array(
                'local_cd'      => $this->input->post('local_cd', TRUE),
                'job_sq'        => $job_sq,
                'put_dt'        => $put_dt,
                'st_sq'         => $this->input->post('st_sq', TRUE),
                'work'          => "OUT",
                'details'       => "004",
                'ord_no'        => $this->input->post('job_no', TRUE),
                'lot'           => $this->input->post('lot', TRUE),
                'item_cd'       => $item_cd,
                'qty'           => $qty,
                'amt'           => $stock->stock_amt,
                'tax'           => $stock->tax_amt,
                'vat'           => $stock->vat,
                'spec'          => json_encode($spec),
                'state'         => "004",
                'fin_dt'        => date("Y-m-d H:i:s"),
                'barcode'       => $stock->barcode,
                'reg_ikey'      => $this->session->userdata['ikey'],
                'reg_ip'        => $this->input->ip_address()
            );
            $result = $this->Api_m->raw_insert($data['stock'], $data['reg']); // insert data
            if($result)
            {
                echo json_encode(['ResultCode'=>$this->result_success,'ResultMessage'=>'자재 투입(생산 출고) 되었습니다.']); 
            }
            else 
            {
                echo json_encode(['ResultCode'=>$this->result_fail, 'ResultMessage'=>'실패. 확인 후 다시 이용 바랍니다.']); 
            }
        }
        else
        {
            echo json_encode(['ResultCode'=>$this->result_fail, 'ResultMessage'=>'재고 확인불가. 확인 후 다시 이용 바랍니다.']); 
        }
    }

    /**
     * @description 생산입고 등록하는 API 함수
     */
    public function set_stock_save()
    {
        $size  = $this->input->post('size', TRUE);
        $unit  = $this->input->post('unit', TRUE);
        $grade = $this->input->post('grade', TRUE);
        $car   = $this->input->post('car', TRUE);
        $state = $this->input->post('state', TRUE);
        $err   = $this->input->post('err', TRUE);
        $spec  = json_encode(['size'=>$size,'unit'=>$unit,'grade'=>$grade, 'car'=>$car, 'state'=>$state, 'err'=>$err ],JSON_UNESCAPED_UNICODE);

        // variable list
        $put_dt    = $this->input->post('put_dt', TRUE);
        $job_sq    = str_replace("-","",$put_dt).date("his",time());
        $wh_uc     = $this->input->post('wh_uc', TRUE);
        $item_cd   = $this->input->post('item_cd', TRUE);
        $max_dt    = $this->input->post('max_dt', TRUE);
        $amt       = (float) str_replace(",", "", $this->input->post('amt', TRUE));
        $vat       = $this->input->post('vat', TRUE);
        $tax       = ($vat == "N") ? $amt * 0.1 : 0;
        $qty       = (float) str_replace(",", "", $this->input->post('qty', TRUE));

        // 재고 생성 여부 확인
        $data['var'] = array(
            'wh_uc'     => $wh_uc,
            'item_cd'   => $item_cd,
            'max_dt'    => $max_dt,
            'stock_amt' => $amt,
            'vat'       => $vat
        );

        // 이미 생성된 재고 데이터가 있을경우 기 재고번호(st_sq) 가져오기. 없을경우 신규 재고번호 생성
        $count  = $this->Common_m->get_column_count('stock', $data['var']);
        if($count > 0)
        {
            // 상세 확인
            $stock = $this->Common_m->get_row('stock', $data['var']);
            $st_sq = $stock->st_sq;
            $barcode = $stock->barcode;
        }
        else
        {
            $st_sq = date("ymdhis",time());
            $barcode = date("Ymd").rand(10000, 99999);
        }

        //stock 등록정보
        $data['stock'] = array(
            'local_cd'      => $this->input->post('local_cd', TRUE),
            'st_sq'         => $st_sq,
            'wh_uc'         => $wh_uc,
            'item_cd'       => $item_cd,
            'max_dt'        => $max_dt,
            'stock_amt'     => $amt,
            'tax_amt'       => $tax,
            'vat'           => $vat,
            'pr_in_qty'     => $qty,
            'qty'           => $qty,
            'barcode'       => $barcode,
            'memo'          => $this->input->post('memo', TRUE),
            'reg_ikey'      => $this->input->post('reg_ikey', TRUE),
            'reg_ip'        => $this->input->post('reg_ip', TRUE)
        );

        //stock_history 등록정보
        $data['reg'] = array(
            'local_cd'      => $this->input->post('local_cd', TRUE),
            'job_sq'        => $job_sq,
            'put_dt'        => $put_dt,
            'st_sq'         => $st_sq,
            'details'       => "003",
            'state'         => "002",
            'item_cd'       => $item_cd,
            'ord_no'        => $this->input->post('ord_no', TRUE),
            'lot'           => $this->input->post('lot', TRUE),
            'qty'           => $qty,
            'amt'           => $amt,
            'tax'           => $tax,
            'vat'           => $vat,
            'spec'          => $spec,
            'memo'          => $this->input->post('memo', TRUE),
            'barcode'       => $barcode,
            'reg_ikey'      => $this->input->post('reg_ikey', TRUE),
            'reg_ip'        => $this->input->post('reg_ip', TRUE)
        );
        
        $result = false;
        if ($this->Common_m->get_column_count("stock", $data['var']) == 0) //insert
        {
            $result = $this->Api_m->insert_stock($data['stock'], $data['reg']); // insert data
        }
        else //update
        {
            $result = $this->Api_m->update_stock($data['stock'], $data['reg']);
        }
        
        if($result)
        {
            echo json_encode(['ResultCode'=>$this->result_success,'ResultMessage'=>'입고 되었습니다.']); 
        }
        else 
        {
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'입고등록에 실패하였습니다. 다시 시도해주세요.']); 
        }
    }


    /**
     * @description 생산입고삭제 생산입고를 삭제하는 API 함수
     */
    public function delete_stock()
    {

        // $st_sq          = $this->input->post('st_sq', TRUE);
        $qty            = $this->input->post('qty', TRUE);

        /*$data['st_sq']  = array(
            'st_sq'     => $st_sq
        );

        $row_stock      = $this->Common_m->get_row('stock', $data['st_sq']); // stock 테이블의 qty 갯수 확인
        
        if($qty > $row_stock->qty){
            // echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'현재 수량보다 삭제될 수량이 많습니다.']);
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>$row_stock->qty." , ".$qty]);
            return;
        }*/

        // 삭제 조건    
        $data['unique'] = array(
            'ikey'      => $this->input->post('ikey', TRUE),
            'job_sq'    => $this->input->post('job_sq', TRUE),
            'reg_ikey'  => $this->input->post('mod_ikey', TRUE)
        );

        $data['update'] = array(
            'job_sq'    => $this->input->post('job_sq', TRUE),
            'qty'       => $this->input->post('qty', TRUE),
            'st_sq'     => $this->input->post('st_sq', TRUE),
            'mod_ikey'  => $this->input->post('mod_ikey', TRUE),
            'mod_ip'    => $this->input->post('mod_ip', TRUE)
        );

        log_message('debug',$this->input->post('ikey', TRUE));
        log_message('debug',$this->input->post('job_sq', TRUE));
        log_message('debug',$this->input->post('mod_ikey', TRUE));
        
        if ($this->Common_m->get_column_count("stock_history", $data['unique']) > 0) // DB에 조건 값 있을경우 삭제 진행
        {
            $result = $this->Api_m->delete_stock($data['update']);
            if($result)
            {
                echo json_encode(['ResultCode'=>$this->result_success,'ResultMessage'=>'리스트가 삭제되었습니다.']); 
            }
            else 
            {
                echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'삭제가 되지 않았습니다. 다시 시도해주세요.']); 
            }  
        } 
        else 
        {
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'데이터가 없거나 삭제가 불가능한 데이터 입니다.']);
        }  
    }

    /**
     * @description 실적등록 API 함수
     */
    public function set_work_result_save()
    {
        $data['unique'] = array(
            'wh_no' => $this->input->post('wh_no', TRUE)
        );

        //등록정보
        $data['reg'] = array(
            'local_cd'      => $this->input->post('local_cd', TRUE),
            'wh_no'         => $this->input->post('wh_no', TRUE),
            'job_no'        => $this->input->post('job_no', TRUE),
            'lot'           => $this->input->post('lot', TRUE),
            'pp_uc'         => $this->input->post('pp_uc', TRUE),
            'qty'           => $this->input->post('qty', TRUE),
            'reg_ikey'      => $this->input->post('reg_ikey', TRUE)
        );

        if ($this->Common_m->get_column_count("work_history", $data['unique']) == 0)
        {
            $result = $this->Common_m->insert("work_history", $data['reg']); // insert data
            if($result)
            {
                echo json_encode(['ResultCode'=>$this->result_success,'ResultMessage'=>'실적이 등록되었습니다.']); 
            }
            else 
            {
                echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'등록에 실패하였습니다. 다시 시도해주세요.']); 
            }  
        }
        else
        {
             echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'등록에 실패하였습니다. 다시 시도해주세요.']); 
        }
    }

    /**
     * @description 비가동 등록 비가동을 히스토리에 등록하는 API 함수
     */
    public function set_unused_history()
    {
        $date_time  = date('Y-m-d H:i:s');
        $lot        = $this->input->post('lot', TRUE);   
        $local_cd   = $this->input->post('local_cd', TRUE);
        $job_no     = $this->input->post('job_no', TRUE);

        $data['unique'] = array(
            'local_cd'      => $local_cd,
            'lot'           => $lot,
            'job_no'        => $job_no
        );

        //등록정보 (used_history)
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'job_no'        => $job_no,
            'lot'           => $lot,
            'nu_uc'         => $this->input->post('nu_uc', TRUE),
            'start_dt'      => $date_time,
            'use_no'        => date('YmdHis'),
            'reg_ikey'      => $this->input->post('reg_ikey', TRUE),
            'reg_ip'        => $this->input->post('reg_ip', TRUE)
        );

        //수정정보 (job_detail)
        $data['mod'] = array(
            'job_st'      => 'S'
        );

        if ($this->Api_m->get_used_history_column_count($data['unique']) == 0)
        {
            $result = $this->Api_m->insert_unused($data['unique'],$data['reg'],$data['mod']); // insert data

            if($result)
            {
                echo json_encode(['ResultCode'=>$this->result_success,'ResultMessage'=>'작업상태가 비가동으로 변경되었습니다.']); 
            }
            else 
            {
                echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'작업 상태변경에 실패하였습니다. 다시 시도해주세요.']); 
            }  
        }
        else
        {
            $result = $this->Api_m->update_unused($data['unique']); // update data
            if($result)
            {
                echo json_encode(['ResultCode'=>$this->result_success,'ResultMessage'=>'작업상태가 가동으로 변경되었습니다.']); 
            }
            else 
            {
                echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'작업 상태변경에 실패하였습니다. 다시 시도해주세요.']); 
            }  
        }


        /*if ($this->Common_m->get_column_count("used_history", $data['unique']) == 0)
        {
            $result = $this->Common_m->insert("used_history", $data['reg']); // insert data
            if($result)
            {
                echo json_encode(['ResultCode'=>$this->result_success,'ResultMessage'=>'작업상태가 비가동으로 변경되었습니다.']); 
            }
            else 
            {
                echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'작업 상태변경에 실패하였습니다. 다시 시도해주세요.']); 
            }  
        }
        else
        {
             echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'업 상태변경에 실패하였습니다. 다시 시도해주세요.']); 
        }*/

    }

    /**
     * @description 비가동 등록 비가동을 히스토리에 등록하는 API 함수
     */
    public function update_unused_history()
    {
        $date_time  = new DateTime();
        $lot        = $this->input->post('lot', TRUE);   
        $local_cd   = $this->input->post('local_cd', TRUE);
        $job_no     = $this->input->post('job_no', TRUE);

        $data['unique'] = array(
            'local_cd'      => $local_cd,
            'lot'           => $lot,
            'job_no'        => $job_no
        );

        //등록정보 (used_history)
        $data['reg'] = array(
            'local_cd'      => $local_cd,
            'job_no'        => $job_no,
            'lot'           => $lot,
            'nu_uc'         => $this->input->post('nu_uc', TRUE),
            'use_no'        => date('YmdHis'),
            'reg_ikey'      => $this->input->post('reg_ikey', TRUE),
            'reg_ip'        => $this->input->post('reg_ip', TRUE)
        );

        //수정정보 (job_detail)
        $data['mod'] = array(
            'job_st'      => 'S'
        );

        if ($this->Api_m->get_used_history_column_count($data['unique']) == 0)
        {
            $result = $this->Api_m->insert_unused($data['unique'],$data['reg'],$data['mod']); // insert data

            if($result)
            {
                echo json_encode(['ResultCode'=>$this->result_success,'ResultMessage'=>'작업상태가 비가동으로 변경되었습니다.']); 
            }
            else 
            {
                echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'작업 상태변경에 실패하였습니다. 다시 시도해주세요.']); 
            }  
        }
        else
        {
            // $result = $this->Api_m->update_unused($data['unique'],$data['reg'],$data['mod']); // update data

            echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'작업 상태변경에 실패하였습니다. 다시 시도해주세요.']); 
        }
    }

    /**
     * @description 실적삭제 실적을 삭제하는 API 함수
     */
    public function delete_work_result()
    {
        $data['comparison'] = array(
            'job_no'    => $this->input->post('job_no', TRUE)
        );

        $job_master = $this->Common_m->get_row('job_master', $data['comparison']);
        
        // 삭제 조건    
        $data['var'] = array(
            'ikey'      => $this->input->post('ikey', TRUE),
            'reg_ikey'  => $this->input->post('reg_ikey', TRUE),
        );
        
        // 실적 삭제
        // if($job_master->state == "004")
        // {
        //     echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'삭제할 수 없는 실적입니다.']);
        // }
        // else
        // {
        if ($this->Common_m->get_column_count("work_history", $data['var']) > 0) // DB에 조건 값 있을경우 삭제 진행
        {
            $result = $this->Common_m->real_del("work_history", $data['var']);
            if($result)
            {
                echo json_encode(['ResultCode'=>$this->result_success,'ResultMessage'=>'실적이 삭제되었습니다.']); 
            }
            else 
            {
                echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'삭제가 되지 않았습니다. 다시 시도해주세요.']); 
            }  
        } 
        else 
        {
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultMessage'=>'선택된 실적이 존재하지 않습니다.']);
        }  
        // } 
    }

    /**
     * @description 마이페이지 진입시 개인 정보 가지고오는 API 함수
     */
    public function get_my_data()
    {
        $ikey = $this->input->post('ikey', TRUE);
        $id = $this->input->post('id', TRUE);

        $data['users'] = array(
            'ikey'     => $ikey,
            'id'       => $id
        );

        $data['result'] = $this->Api_m->mypage($data['users']);
        $var = $this->db->last_query();

        if ($this->Api_m->check_users($data['users']) > 0) 
        {    
            // echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>$var]); 
            echo json_encode(['ResultCode'=>$this->result_success, 'ResultParam'=>$data['result'],'ResultMessage'=>'마이페이지 데이터를 불러왔습니다.']); 
        }
        else
        {  
            echo json_encode(['ResultCode'=>$this->result_fail,'ResultParam'=>$data['result']
                ,'ResultMessage'=>'입력하신 정보와 일치하는 사용자가 없습니다.']); 
        } 
    }

    /**
     * @description 마이페이지 개인 정보(비밀번호)수정시 호출되는 API 함수
     */
    public function put_my_data()
    {
        $ikey = $this->input->post('ikey', TRUE);
        $id = $this->input->post('id', TRUE);
        $pass = strtoupper(hash('sha256', $this->input->post('pw', TRUE)));

        $data['users'] = array(
            'ikey'     => $ikey,
            'id'       => $id
        );

        $data['pw'] = array(
            'pass'     => $pass
        );

        $data['result'] = $this->Common_m->update2("z_plan.user_list",$data['pw'],$data['users']);
        if($data['result'])
        {
            echo json_encode(['ResultCode'=>$this->result_success ,'ResultMessage'=>'변경된 비밀번호를 저장하였습니다.']);
        }
        else
        {
            echo json_encode(['ResultCode'=>$this->result_fail ,'ResultMessage'=>'비밀번호 변경에 실패하였습니다. 잠시 후 다시 시도해 주세요.']); 
        }
    }

 
}
