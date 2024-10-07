<?php
defined('BASEPATH') OR exit('No direct script access allowed');


class Flaw_Api extends CI_Controller {

    public function __construct() 
    { 
        parent::__construct();


    }

    public function index() {
            $this->call_api_for_monthly_check();
            $this->call_api_for_monthly_check2();
    }

    private function call_api_for_monthly_check()
    {
        $searchCondition = '';

        $sql = "SELECT COALESCE(SUM(sub.flaw_cnt), 0) AS total_flaw_cnt FROM (
            SELECT IFNULL((SELECT SUM(flaw_qty) FROM work_history WHERE local_cd = d.local_cd AND job_no = d.job_no AND lot = d.lot), 0) AS flaw_cnt
            FROM job_master AS m
            INNER JOIN job_detail AS d ON (m.local_cd = d.local_cd AND m.job_no = d.job_no)
            INNER JOIN prod_proc AS p ON (d.local_cd = p.local_cd AND d.pp_uc = p.pp_uc)
            INNER JOIN z_plan.common_code AS gb ON (gb.code_gb ='PR' AND gb.code_main = '040' AND p.pp_gb = gb.code_sub)
            WHERE m.local_cd = 'KR13' AND m.useyn = 'Y' AND m.delyn = 'N' AND m.state != '001' 
            AND m.job_dt BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW())
            " . $searchCondition . "
        ) AS sub";

        $query = $this->db->query($sql);


        if ($query) {
            $result = $query->row();
            $totalFlawCnt = $result->total_flaw_cnt;
           

           
        // 현재 시간을 YYYYMMDDHHMMSS 형식으로 설정
        $currentTime = date('YmdHis');
    
        // API에 전송할 JSON 데이터 구성
        $kpiData = array(
            "KPILEVEL3" => array(
                array(
                    "kpiCertKey" => "3b80-96ec-f9ba-bdc2",
                    "ocrDttm" => $currentTime,
                    "kpiFldCd" => "Q",
                    "kpiDtlCd" => "B",
                    "kpiDtlNm" => "불량률 감소",
                    "msmtVl" => strval($totalFlawCnt),
                    "unt" => "%",
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


 private function call_api_for_monthly_check2()
    {
        $searchCondition = '';

        $sql = "SELECT COALESCE(SUM(sub.flaw_cnt), 0) AS total_flaw_cnt FROM (
            SELECT IFNULL((SELECT SUM(flaw_qty) FROM work_history WHERE local_cd = d.local_cd AND job_no = d.job_no AND lot = d.lot), 0) AS flaw_cnt
            FROM job_master AS m
            INNER JOIN job_detail AS d ON (m.local_cd = d.local_cd AND m.job_no = d.job_no)
            INNER JOIN prod_proc AS p ON (d.local_cd = p.local_cd AND d.pp_uc = p.pp_uc)
            INNER JOIN z_plan.common_code AS gb ON (gb.code_gb = 'PR' AND gb.code_main = '040' AND p.pp_gb = gb.code_sub)
            WHERE m.local_cd = 'KR13' AND m.useyn = 'Y' AND m.delyn = 'N' AND m.state != '001' 
            AND m.job_dt BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW())
            " . $searchCondition . "
        ) AS sub";

        $query = $this->db->query($sql);


        
       

        if ($query) {
            $result = $query->row();
            $totalFlawCnt = $result->total_flaw_cnt;
           
           
        // 현재 시간을 YYYYMMDDHHMMSS 형식으로 설정
        $currentTime = date('YmdHis');
    
        // API에 전송할 JSON 데이터 구성
        $kpiData = array(
            "KPILEVEL2" => array(
                array(
                    "kpiCertKey" => "3b80-96ec-f9ba-bdc2",
                    "ocrDttm" => $currentTime,
                    "kpiFldCd" => "Q",
                    "kpiDtlCd" => "B",
                    "kpiDtlNm" => "불량률 감소",
                    "achrt" => strval($totalFlawCnt),
                    "trsDttm" => $currentTime
                )
            )
        );

        // JSON 데이터 인코딩
        $jsonData = json_encode($kpiData, JSON_UNESCAPED_UNICODE);
    
        // API 호출
        $response = $this->send_data_to_api2($jsonData);
    
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


private function send_data_to_api2($jsonData)
{
    $url = 'http://www.ssf-kpi.kr:8080/kpiLv2/kpiLv2Insert';
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


}

?>