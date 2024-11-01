<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ApiSend extends CI_Controller 
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
                $cnt     = rand(38, 51);
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

        $this->call_api_for_check2($apiKey, $percent);
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