<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 로그인 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/07/18
 */
class Login extends CI_Controller {

    public function __construct() 
    { 
        parent::__construct();
        $this->load->model('Login_m');
        $this->allow=array('index', 'login', 'v'); // check login hook  
        $this->load->helper('cookie');
    }

    public function index()
    {
        /** 저장된 쿠키 값 */
        $data['ck'] = array(
            'ul_cd' =>  get_cookie('ul_cd'),
            'id'    =>  get_cookie('id'),
            'check' =>  get_cookie('check')
        );

        $data['title'] = '로그인';
        $this->load->view('include/head');
        $this->load->view('login', $data);
        $this->load->view('include/tail');
    }
     
    /**
     * @description login
     */
    public function login()
    {

        if (date('j') == 1) {
            // API 호출 함수 실행
            $this->call_api_for_monthly_check();
        }
        
        /** 사번 / 아이디 저장 시 쿠키 값 저장 2021/10/05  김원명 */
        if ($this->input->post('check', TRUE) == "Y")
        {
            $expire = 60*60*24*365; // 365일(1년) 동안 유지

            delete_cookie('ul_cd');
            delete_cookie('id');
            delete_cookie('check');
            set_cookie('ul_cd', $this->input->post('ul_cd', TRUE), $expire);
            set_cookie('id', $this->input->post('id', TRUE), $expire);
            set_cookie('check', $this->input->post('check', TRUE), $expire);
        }
        else
        {
            delete_cookie('ul_cd');
            delete_cookie('id');
            delete_cookie('check');
        }

        $data['users'] = array(
            'ul_cd'     => $this->input->post('ul_cd', TRUE),
            'id'        => $this->input->post('id', TRUE),
            'pass'      => strtoupper(hash('sha256', $this->input->post('password', TRUE))),
            'useyn'     => 'Y'
        );

        if ($this->Login_m->check_users($data['users']) > 0) 
        {
            // login success 
            $row = $this->Login_m->select_users_all($data['users']['id'], $data['users']['ul_cd']);
            /** 해당 소속 공장 가용여부가 off일 경우 2021/10/26 김원명 */
            if ($this->Common_m->get_count('z_plan.factory', array('local_cd' => $row->local_cd, 'platform' => 'AD', 'useyn' => 'Y')) == 0)
            {
                alert_only('로그인 정보가 바르지 않습니다.\n지속될 경우 시스템 관리자에게 문의하시기 바랍니다.\n\n(mail@allips.kr, 051-711-3468)');
                $data['title'] = "로그인";
                $this->load->view('include/head');
                $this->load->view('login', $data);
                $this->load->view('include/tail'); 
            }
            else
            {
                $this->session->set_userdata(
                    array(
                    	'ikey'		=> $row->ikey,
						'local_cd'	=> $row->local_cd,
						'ul_nm'		=> $row->ul_nm,
						'id'		=> $row->id,
						'is_login'	=> TRUE,
                    	'ul_uc' 	=> $row->ul_uc,
						'dp_uc' 	=> $row->dp_uc,
						'fa_nm' 	=> $row->fa_nm
					)
                );
                $row = $this->Login_m->update_login_dt($row->ikey);
				$info = $this->Login_m->select_users_all($data['users']['id'], $data['users']['ul_cd']);
                $log_data = array(
                	'rec_gb'	=> 'F',
					'uc_cd'		=> $info->local_cd,
					'uc_nm'		=> $info->fa_nm,
					'ul_uc'		=> $info->ul_uc,
					'ul_id'		=> $info->id,
					'ul_nm'		=> $info->ul_nm,
					'ul_gb'		=> '001',
					'crud'		=> 'L',
					'acc_gb'	=> 'P',
					'reg_ikey'	=> $info->ikey,
					'reg_ip'    => $this->input->ip_address()
				);
				$this->Common_m->insert('user_log', $log_data);	//insert

				$month_where = array(
					'rec_gb'	=> 'F',
					'uc_cd'		=> $info->local_cd,
					'ul_gb'		=> '001',
					'crud'		=> 'L',
					'acc_gb'	=> 'P',
					'base_dt'	=> date('Y-m')
				);
				$cnt = $this->Common_m->get_count('month_log' , $month_where);
				if ($cnt > 0) //update
                {
					$this->db->where($month_where);
					$this->db->set('count', 'count + 1', false);
					$this->db->update('month_log');
				}
                else //insert
                {		
					$month_data = array(
						'rec_gb'	=> 'F',
						'uc_cd'		=> $info->local_cd,
						'ul_gb'		=> '001',
						'crud'		=> 'L',
						'acc_gb'	=> 'P',
						'base_dt'	=> date('Y-m'),
						'count'		=> 1,
						'reg_ikey'	=> $info->ikey,
						'reg_ip'    => $this->input->ip_address()
					);
					$this->Common_m->insert('month_log', $month_data);	//insert
				}

               alert_only($this->session->userdata['ul_nm'].'님 로그인'); 
               redirect('main','refresh');
            }
        } 
        else 
        {
            // login fail
            alert_only('로그인 정보가 바르지 않습니다.\n지속될 경우 시스템 관리자에게 문의하시기 바랍니다.\n\n(mail@allips.kr, 051-515-3468)');
            $data['title'] = "로그인";
            $this->load->view('include/head');
            $this->load->view('login', $data);
            $this->load->view('include/tail'); 
        }

    }

    private function call_api_for_monthly_check()
    {

        $sql = "SELECT @rownum := @rownum+1 AS rownum, sub.* FROM (
            SELECT m.ikey, m.local_cd, m.job_dt, m.item_cd, m.item_nm, m.state, gb.code_nm AS pp_gb_nm, d.pp_nm
            , d.pp_hisyn, d.plan_cnt, d.plan_time, d.plan_num, d.ul_nm, d.job_st, d.start_dt, d.end_dt
            , IFNULL((SELECT SUM(qty) FROM work_history WHERE local_cd = d.local_cd AND job_no = d.job_no AND lot = d.lot), 0) AS work_cnt
            FROM job_master AS m
            INNER JOIN (SELECT @rownum := 0) r
            INNER JOIN job_detail AS d ON (m.local_cd = d.local_cd AND m.job_no = d.job_no)
            INNER JOIN prod_proc AS p ON (d.local_cd = p.local_cd AND d.pp_uc = p.pp_uc)
            INNER JOIN z_plan.common_code AS gb ON (gb.code_gb ='PR' AND gb.code_main = '040' AND p.pp_gb = gb.code_sub)
            WHERE m.local_cd = 'KR13' AND m.useyn = 'Y' AND m.delyn = 'N'  AND m.state != '001' 
              AND m.job_dt BETWEEN DATE_FORMAT(NOW() - INTERVAL 1 MONTH, '%Y-%m-01') AND LAST_DAY(NOW() - INTERVAL 1 MONTH)
            ORDER BY m.job_dt ASC, d.ikey ASC, d.reg_dt ASC
        ) AS sub 
        ORDER BY rownum DESC";

        $query = $this->db->query($sql);
        if ($query) {
            $result = $query->row();
            $totalWorkCnt = $result->work_cnt;

        // 현재 시간을 YYYYMMDDHHMMSS 형식으로 설정
        $currentTime = date('YmdHis');
    
        // API에 전송할 JSON 데이터 구성
        $kpiData = array(
            "KPILEVEL3" => array(
                array(
                    "kpiCertKey" => "3b80-96ec-f9ba-bdc2",
                    "ocrDttm" => $currentTime,
                    "kpiFldCd" => "P",
                    "kpiDtlCd" => "B",
                    "kpiDtlNm" => "생산량 증가",
                    "msmtVl" => strval($totalWorkCnt),
                    "unt" => "수량",
                    "trsDttm" => $currentTime
                )
            )
        );

        // JSON 데이터 인코딩
        $jsonData = json_encode($kpiData, JSON_UNESCAPED_UNICODE);
    
        // API 호출
        $response = $this->send_data_to_api($jsonData);
    
        // 응답 처리와 로깅
        echo "API 응답: " . $response;
    } else {
        echo "쿼리 실행에 실패했습니다.";
    }
 }


private function send_data_to_api($jsonData)
{
    $url = 'http://www.ssf-kpi.kr:8080/kpiLv3/kpiLv3Insert';
    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8'));
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);

    $response = curl_exec($ch);
    $httpStatusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        curl_close($ch);
        return "API 호출 실패: " . $error_msg;
    } else {
        curl_close($ch);
        return "API 호출 성공: HTTP 상태 코드 " . $httpStatusCode . " - 응답: " . $response;
    }
}

    /**
     * @description log out
     */
    public function log_out()
    {
        $this->session->sess_destroy(); // delect session
        alert_only('안녕히가세요.'); 
        redirect('login','refresh');
    }

    /**
     * @description login form validation
     */
    public function v() 
    {
        $this->form_validation->set_rules('id', '아이디', 'trim|required', array('required' => ''));
        $this->form_validation->set_rules('password', '비밀번호', 'trim|required', array('required' => ''));

        if ($this->form_validation->run() == TRUE) 
        {
            // success
            $this->login();
        } 
        else 
        {
            // fail
            alert_only('아이디와 패스워드를 정확히 입력 후 다시 이용바랍니다.');
            $this->load->view('include/head');
            $this->load->view('login');
            $this->load->view('include/tail');
        }
    }
 
}
