<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 생산 작업 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/12
 */
class Prod_list extends CI_Controller {

    public function __construct() 
    { 
        parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('pr/Prod_list_m');
    }

    public function index()
    {
        // header, asize 디자인 유지용 파라미터
        $data['title'] = '생산 작업 관리';
        $data['site_url'] = '/pr/prod_list';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('pr/prod_list', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');
    }

    /**
     * @description 생산 작업 현황 전체 조회/검색 조회
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 기간
     * @return work list [json] 
     */
    public function list()
    {
        // variable list
        $data['var'] = array(
            'local_cd'  => $this->session->userdata['local_cd'],
            'keyword'   => $this->input->post('keyword', TRUE),
            'content'   => $this->input->post('content', TRUE),
            'start_dt'  => $this->input->post('start_dt', TRUE),
            'end_dt'    => $this->input->post('end_dt', TRUE)
        );
        $data['list'] = $this->Prod_list_m->get_print_list($data['var']);
        exit(json_encode(['result'=>$data])); // return result list
    }

    public function set_work_result_save()
    {
        $successCount = 0;
        $errorCount = 0;
    
        $updatedValues = json_decode($this->input->post('updatedValues'), true);
    
        $local_cd = $this->session->userdata['local_cd'];
        $reg_ikey = $this->session->userdata['ikey'];
    
        $this->db->trans_start();
    
        foreach ($updatedValues as $value) {
            $unique_conditions = array(
                'job_no' => $value['job_no'],
                'lot' => $value['lot'],
                'local_cd' => $local_cd
            );
    
            $data['reg'] = array(
                'local_cd' => $local_cd,
                'job_no' => $value['job_no'],
                'lot' => $value['lot'],
                'pp_uc' => $value['pp_uc'],
                'qty' => $value['workCnt'],
                'reg_ikey' => $reg_ikey,
            );
    
            // 고유한 wh_no를 찾거나 생성합니다.
            $wh_no = $this->Common_m->get_max2('work_history', 'wh_no', array('local_cd' => $local_cd)) + 1;
            $data['reg']['wh_no'] = $wh_no;
    
            // 중복 검사
            while ($this->Common_m->get_column_count("work_history", array('wh_no' => $wh_no, 'local_cd' => $local_cd)) > 0) {
                $wh_no++;
            }
            $data['reg']['wh_no'] = $wh_no;
    
            if ($this->Common_m->get_column_count("work_history", $unique_conditions) == 0) {
                $result = $this->Common_m->insert("work_history", $data['reg']);
            } else {
                $result = $this->Common_m->printUpdate("work_history", $unique_conditions, array('qty' => $value['workCnt']));
            }
    
            if ($result) {
                $successCount++;
                $jobDetailUpdateResult = $this->Common_m->printUpdate(
                    "job_detail", 
                    array('job_no' => $value['job_no']), 
                    array('job_st' => 'P')
                );
    
                // job_master 테이블의 state를 003으로 업데이트
                $jobMasterUpdateResult = $this->Common_m->printUpdate(
                    "job_master", 
                    array('job_no' => $value['job_no']), 
                    array('state' => '003')
                );
    
                if (!$jobDetailUpdateResult || !$jobMasterUpdateResult) {
                    $errorCount++;
                }
    
            } else {
                $errorCount++;
            }
        }
    
        $this->db->trans_complete();
    
        if ($this->db->trans_status() === FALSE) {
            // 트랜잭션이 실패한 경우
            echo json_encode(['ResultCode' => $this->result_fail, 'ResultMessage' => "실패한 작업이 있습니다. 다시 시도해주세요."]);
        } else {
            // 트랜잭션이 성공한 경우
            echo json_encode(['ResultCode' => $this->result_success, 'ResultMessage' => "모든 실적이 성공적으로 등록되었습니다."]);
        }
    }

    public function set_flaw_result_save()
    {
        $successCount = 0;
        $errorCount = 0;
    
        $updatedValues = json_decode($this->input->post('updatedValues'), true);

    
        $local_cd = $this->session->userdata['local_cd'];
        $reg_ikey = $this->session->userdata['ikey'];
    
        foreach ($updatedValues as $value) {
            $unique_conditions = array(
                'job_no' => $value['job_no'],
                'lot' => $value['lot'],
                'local_cd' => $local_cd
            );
    
            $data['reg'] = array(
                'local_cd' => $local_cd,
                'job_no' => $value['job_no'],
                'lot' => $value['lot'],
                'pp_uc' => $value['pp_uc'],
                'flaw_qty' => $value['flaw_cnt'],
                'reg_ikey' => $reg_ikey,
            );
    
            if ($this->Common_m->get_column_count("work_history", $unique_conditions) == 0) {
                $wh_no = sprintf('%01d', $this->Common_m->get_max2('work_history', 'wh_no', array('local_cd' => $local_cd)) + 1);
                $data['reg']['wh_no'] = $wh_no;
                $result = $this->Common_m->insert("work_history", $data['reg']);
            } else {
                $result = $this->Common_m->printUpdate("work_history", $unique_conditions, array('flaw_qty' => $value['flaw_cnt']));
            }
    
            if ($result) {
                $successCount++;

                $jobDetailUpdateResult = $this->Common_m->printUpdate(
                    "job_detail", 
                    array('job_no' => $value['job_no']), 
                    array('job_st' => 'P')
                );
    
                // job_master 테이블의 state를 003으로 업데이트
                $jobMasterUpdateResult = $this->Common_m->printUpdate(
                    "job_master", 
                    array('job_no' => $value['job_no']), 
                    array('state' => '003')
                );

                if (!$jobDetailUpdateResult || !$jobMasterUpdateResult) {
                    $errorCount++;
                }
    
            } else {
                $errorCount++;
            }
        }
    
        if ($errorCount > 0) {
            echo json_encode(['ResultCode' => $this->result_fail, 'ResultMessage' => "실패한 작업이 있습니다. 다시 시도해주세요."]);
        } else {
            echo json_encode(['ResultCode' => $this->result_success, 'ResultMessage' => "모든 실적이 성공적으로 등록되었습니다."]);
        }
    }
}