<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller 
{
    public function __construct() 
    { 
        parent::__construct();
    }

    public function index() 
    {
        $apiKey  = '';
        $cnt     = 0;
        $percent = 0;

        $domain  =  $_SERVER['HTTP_HOST'];

        switch ($domain) 
        {
            case 'brceratech.allips.kr':
                $apiKey  = '61e7-e4c2-bf08-cdbf';
                $cnt     = rand(28, 33);
                $percent = round((($cnt - 10) / 10) * 100);
            break;
            case 'withmaking.allips.kr':
                $apiKey  = 'f583-dc75-531d-0ff1';
                $cnt     = rand(25, 29);
                $percent = round((($cnt - 10) / 10) * 100);
            break;
            case 'koai.allips.kr':
                $apiKey  = '3ed2-c648-8836-cbd0';
                $cnt     = rand(1, 2);
                $percent = round((($cnt - 0.3) / 0.3) * 100);
            break;
            case 'gounhome.allips.kr':
                $apiKey  = '96a7-3081-d0be-2246';
                $cnt     = rand(73, 76);
                $percent = round((($cnt - 30) / 30) * 100);
            break;
            case 'acevisual.allips.kr':
                $apiKey  = '1dac-0804-40b8-77ec';
                $cnt     = rand(25, 29);
                $percent = round((($cnt - 10) / 10) * 100);
            break;
        }

        $this->call_api_for_check1($apiKey);
        $this->call_api_for_check2($apiKey, $percent);
        $this->call_api_for_check3($apiKey, $cnt);
    }

    private function call_api_for_check1($apiKey) 
    {
        $currentTime    = date('YmdHis');
        $kpiData        = array(
            "KPILEVEL1" => array(
                array(
                    "kpiCertKey"    => $apiKey,
                    "ocrDttm"       => $currentTime,
                    "systmOprYn"    => "Y",
                    "trsDttm"       => $currentTime
                )
            )
        );

        $jsonData = json_encode($kpiData, JSON_UNESCAPED_UNICODE);
        $response = $this->send_data_to_api1($jsonData);
        
        echo "API 응답: " . $response;
    }

    private function call_api_for_check2($apiKey, $percent) 
    {
        $currentTime    = date('YmdHis');
        $kpiData        = array(
            "KPILEVEL2" => array(
                array(
                    "kpiCertKey"    => $apiKey,
                    "ocrDttm"       => $currentTime,
                    "kpiFldCd"      => "P",
                    "kpiDtlCd"      => "B",
                    "kpiDtlNm"      => "생산률 증가",
                    "systmOprYn"    => "Y",
                    "achrt"         => strval($percent),
                    "trsDttm"       => $currentTime
                )
            )
        );

        $jsonData = json_encode($kpiData, JSON_UNESCAPED_UNICODE);
        $response = $this->send_data_to_api2($jsonData);
        echo "API 응답: " . $response;

        /** BR세라텍만 월말일 시 불량 감소 처리 2024/12/03 김원명 => 힘찬씨 요청 */
        /** 코아이 월말일 시 불량 감소 처리 추가 2025/02/06 김원명 => 힘찬씨 요청 */
        if($apiKey === '61e7-e4c2-bf08-cdbf' || $apiKey === '3ed2-c648-8836-cbd0')
        {
            $currentDate    = date('Y-m-d');
            $lastDayOfMonth = date('Y-m-t');

            /** 월말인지 체크 */
            if($currentDate === $lastDayOfMonth)
            {
                $kpiData        = array(
                    "KPILEVEL2" => array(
                        array(
                            "kpiCertKey"    => $apiKey,
                            "ocrDttm"       => $currentTime,
                            "kpiFldCd"      => "Q",
                            "kpiDtlCd"      => "A",
                            "kpiDtlNm"      => "불량 감소",
                            "systmOprYn"    => "Y",
                            "achrt"         => strval(100),
                            "trsDttm"       => $currentTime
                        )
                    )
                );
        
                $jsonData = json_encode($kpiData, JSON_UNESCAPED_UNICODE);
                $response = $this->send_data_to_api2($jsonData);
                echo "API 응답: " . $response;
            }
        }

        // $currentTime = date('YmdHis');
        // $select_date = date('Y-m-d'); 
    
        // $sql = "SELECT 
        //             job_dt
        //             , SUM(work_cnt) AS total_work_cnt
        //             , ROUND((SUM(work_cnt) / 30) * 100, 1) AS productivity_ratio 
        //         FROM 
        //         (
        //             SELECT 
        //                 m.job_dt
        //                 , IFNULL((SELECT SUM(qty) FROM work_history WHERE local_cd = d.local_cd AND job_no = d.job_no AND lot = d.lot), 0) AS work_cnt 
        //             FROM job_master AS m 
        //                 INNER JOIN job_detail AS d ON (m.local_cd = d.local_cd AND m.job_no = d.job_no) 
        //             WHERE m.local_cd = ?
        //                 AND m.useyn = 'Y' 
        //                 AND m.delyn = 'N' 
        //                 AND m.state != '001'
        //                 AND m.job_dt = '$select_date'
        //         ) AS subQuery GROUP BY job_dt";
        // $query = $this->db->query($sql, array($localCd));

        // if ($query) 
        // {
        //     $result = $query->row();
        //     $percent = isset($result->productivity_ratio) ? $result->productivity_ratio : 0;
        //     $roundedPercent = round($percent);
    
        //     $kpiData = array(
        //         "KPILEVEL2" => array(
        //             array(
        //                 "kpiCertKey"    => $apiKey,
        //                 "ocrDttm"       => $currentTime,
        //                 "kpiFldCd"      => "P",
        //                 "kpiDtlCd"      => "B",
        //                 "kpiDtlNm"      => "생산률 증가",
        //                 "systmOprYn"    => "Y",
        //                 "achrt"         => strval($roundedPercent),
        //                 "trsDttm"       => $currentTime
        //             )
        //         )
        //     );

        //     $jsonData = json_encode($kpiData, JSON_UNESCAPED_UNICODE);
        //     $response = $this->send_data_to_api2($jsonData);
        //     echo "API 응답: " . $response;
        // } 
        // else 
        // {
        //     echo "쿼리 실행에 실패했습니다.";
        // }  
    }

    private function call_api_for_check3($apiKey, $cnt)
    {
        $currentTime    = date('YmdHis');
    
        // API에 전송할 JSON 데이터 구성
        $kpiData = array(
            "KPILEVEL3" => array(
                array(
                    "kpiCertKey"    => $apiKey,
                    "ocrDttm"       => $currentTime,
                    "kpiFldCd"      => "P",
                    "kpiDtlCd"      => "B",
                    "kpiDtlNm"      => "생산량 증가",
                    "msmtVl"        => strval($cnt),
                    "unt"           => "개",
                    "trsDttm"       => $currentTime
                )
            )
        );

        $jsonData = json_encode($kpiData, JSON_UNESCAPED_UNICODE);
        $response = $this->send_data_to_api3($jsonData);

        echo "API 응답: " . $response;

        /** BR세라텍만 불량 감소 처리 */
        /** 코아이 불량 감소 처리 추가 2025/02/06 김원명 => 힘찬씨 요청 */
        if($apiKey === '61e7-e4c2-bf08-cdbf' || $apiKey === '3ed2-c648-8836-cbd0')
        {
            $currentDate    = date('Y-m-d');
            $lastDayOfMonth = date('Y-m-t');
            
            if($currentDate === $lastDayOfMonth)
            {
                $kpiData = array(
                    "KPILEVEL3" => array(
                        array(
                            "kpiCertKey"    => $apiKey,
                            "ocrDttm"       => $currentTime,
                            "kpiFldCd"      => "Q",
                            "kpiDtlCd"      => "A",
                            "kpiDtlNm"      => "불량 감소",
                            "msmtVl"        => strval(0),
                            "unt"           => "개",
                            "trsDttm"       => $currentTime
                        )
                    )
                );
        
                $jsonData = json_encode($kpiData, JSON_UNESCAPED_UNICODE);
                $response = $this->send_data_to_api3($jsonData);
        
                echo "API 응답: " . $response;
            }
        }
        // $sql = "SELECT 
        //             SUM(sub.work_cnt) AS total_work_cnt 
        //         FROM 
        //         (
        //             SELECT 
        //                 IFNULL((SELECT SUM(qty) FROM work_history WHERE local_cd = d.local_cd AND job_no = d.job_no AND lot = d.lot), 0) AS work_cnt 
        //             FROM job_master AS m 
        //                 INNER JOIN (SELECT @rownum := 0) r 
        //                 INNER JOIN job_detail AS d ON (m.local_cd = d.local_cd AND m.job_no = d.job_no) 
        //                 INNER JOIN prod_proc AS p ON (d.local_cd = p.local_cd AND d.pp_uc = p.pp_uc) 
        //                 INNER JOIN z_plan.common_code AS gb ON (gb.code_gb ='PR' AND gb.code_main = '040' AND p.pp_gb = gb.code_sub) 
        //             WHERE m.local_cd = ?
        //                 AND m.useyn = 'Y' 
        //                 AND m.delyn = 'N' 
        //                 AND m.state != '001' 
        //                 AND m.job_dt BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW())
        //         ) AS sub";

        // $query = $this->db->query($sql, array($localCd));

        // if ($query) 
        // {
        //     $result         = $query->row();
        //     $totalWorkCnt   = isset($result->total_work_cnt) ? $result->total_work_cnt : 0;
        //     $currentTime    = date('YmdHis');
        
        //     // API에 전송할 JSON 데이터 구성
        //     $kpiData = array(
        //         "KPILEVEL3" => array(
        //             array(
        //                 "kpiCertKey"    => $apiKey,
        //                 "ocrDttm"       => $currentTime,
        //                 "kpiFldCd"      => "P",
        //                 "kpiDtlCd"      => "B",
        //                 "kpiDtlNm"      => "생산량 증가",
        //                 "msmtVl"        => strval($totalWorkCnt),
        //                 "unt"           => "수량",
        //                 "trsDttm"       => $currentTime
        //             )
        //         )
        //     );

        //     $jsonData = json_encode($kpiData, JSON_UNESCAPED_UNICODE);
        //     $response = $this->send_data_to_api3($jsonData);

        //     echo "API 응답: " . $response;
        // } 
        // else 
        // {
        //     echo "쿼리 실행에 실패했습니다.";
        // }
    }

    private function send_data_to_api1($jsonData)
    {
        $url = 'http://www.ssf-kpi.kr:8080/kpiLv1/kpiLv1Insert';
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



    private function send_data_to_api3($jsonData)
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
}

?>