<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 공통 라이브러리 시스템 클래스
 * @author 김민주, @version 1.0, @last date 2021/05/27
 */
class CI_Common {

    /**
     * Reference to the CodeIgniter instance
     *
     * @var object
     */
    /*
    private $CI;

    function __construct()
    {
        // Assign the CodeIgniter super-object
        $this->CI =& get_instance();
    }
    */
   
   /**
     * MYSQL 호환 가능한 커스텀 암호화 함수
     * @author 김민주, @version 1.0, @date 2021/11/10
     * @return string
     */
    public static function custom_encrypt($val, $encrypt_key, $type) {

        $str = bin2hex(base64_decode(openssl_encrypt($val, $type, substr(hex2bin(openssl_digest($encrypt_key, 'sha512')), 0, 16))));
        return strtoupper($str);

    }

    /**
     * MYSQL 호환 가능한 복호화 함수
     * @author 김민주, @version 1.0, @date 2021/11/10
     * @return string
     */
    public static function custom_decrypt($val, $encrypt_key, $type) {

        $str = @openssl_decrypt(base64_encode(hex2bin($val)), $type, substr(hex2bin(openssl_digest($encrypt_key, 'sha512')), 0, 16));
        if(!$str){ /** 값 없을 시 false 값 넘어와 공백으로 처리 2021/11/11 김원명 */
            $str = '';
        }
        return $str;

    }
    
    /**
     * 전화번호, 생년월일, 사업자번호 하이픈(-) 정규식
     * @return string
     */
    public static function format_number($number, $type) {
    $number = preg_replace("/[^0-9]/", "", $number);
    $length = strlen($number);
    $num = substr($number, 0, 2);

    switch($type) {

        case 1: // 일반 전화번호 또는 휴대폰번호
            if($length == 9 && $num == "02") { // 서울 지역번호
                return preg_replace("/([0-9]{2})([0-9]{3})([0-9]{4})/", "$1-$2-$3", $number);
                break;
            } else if($length == 10 && $num == "02") {
                return preg_replace("/([0-9]{2})([0-9]{4})([0-9]{4})/", "$1-$2-$3", $number);
                break;
            } else if($length == 11) { // 그외 지역번호
                return preg_replace("/([0-9]{3})([0-9]{4})([0-9]{4})/", "$1-$2-$3", $number);
                break;
            } else if($length == 10) {
                return preg_replace("/([0-9]{3})([0-9]{3})([0-9]{4})/", "$1-$2-$3", $number);
                break;
            } else if($length == 8) { // 고객센터 번호
                return preg_replace("/([0-9]{4})([0-9]{4})/", "$1-$2", $number);
                break;
            }

      case 2: // 생년월일
            return preg_replace("/([0-9]{4})([0-9]{2})([0-9]{2})/", "$1-$2-$3", $number);
            break;

      case 3: // 사업자번호
            if($length == 10) {
                return preg_replace("/([0-9]{3})([0-9]{2})([0-9]{4})([0-9]{1})/", "$1-$2-$3-$4", $number);
                break;
            } else if($length == 13) {
                return preg_replace("/([0-9]{4})([0-9]{2})([0-9]{6})([0-9]{1})/", "$1-$2-$3-$4", $number);
                break;
            } 
      case 4:
            return substr($number,0,4)."-".substr($number,4,2)."-".substr($number,6,2);
            break;

      default :
            return $number;
            break;
        }

    }

    /*
     * @description 랜덤 문자열 생성
     * @author 황호진, @version 1.0 @last_update 2022/01/20
     * @param 문자열 자리수 
     * @return 난수 값 리턴
     * */
    public static function random_string($n)
    {
        //난수 생성
        $str = '0123456789ABCDEFGHJKLMNOPQRSTUVWXYZ';
        $max = strlen($str) - 1;
        $code = '';
        $len = abs($n); // 자릿수 지정
        for($i=0; $i<$len; $i++) {
            $code .= $str[random_int(0, $max)];
        }
        return $code;
    }

    /**
     * @description
     * @author 김원명, @version 1.0
     */
    public static function tax_bill_type(string $type){
        switch($type){
            case '0101':
                return '일반 세금계산서';
            break;
            case '0102':
                return '영세율 세금계산서';
            break;                
            case '0103':
                return '위수탁 세금계산서';
            break;
            case '0104':
                return '수입 세금계산서';   
            break;             
            case '0105':
                return '영세율 위수탁 세금계산서';     
            break;           
            case '0201':
                return '수정 일반 세금계산서';       
            break;         
            case '0202':
                return '수정 영세율 세금계산서';   
            break;             
            case '0203':
                return '수정 위수탁 세금계산서';     
            break;           
            case '0204':
                return '수정 수입 세금계산서';    
            break;            
            case '0205':
                return '수정 영세율 위수탁 세금계산서';
            break;
            case '0301':
                return '일반 계산서';
            break;
            case '0303':
                return '위수탁 계산서';
            break;
            case '0304':
                return '수입 계싼서';
            break;
            case '0401':
                return '수정 일반 계산서';
            break;
            case '0403':
                return '수정 위수탁 계산서';
            break;
            case '0404':
                return '수정 수입 계산서';
            break;
            case '0501':
                return '종이 세금계산서';
            break;
            case '0502':
                return '종이 영세율 세금계산서'; 
            break;               
            case '0601':
                return '종이계산서';
            break;
        }
    }

    /**
     * @description
     * @author 김원명, @version 1.0
     */
    public static function faq_kind(string $type){
        switch($type){
            case '01':
                return '사용';
            break;
            case '02':
                return '오류';
            break;
            case '03':
                return '기타';
            break;
        }
    }

    /**
     * @description 사용자 유형 (M:마스터 / A:관리자 / P:현장작업자 / U:일반 사용자 / S:대리점 / ....)
     */
    public static function parse_type(string $type):string {

        switch( $type ) {
            case "M":
                return "마스터";
            case "A":
                return "관리자";
            case "P":
                return "현장작업자";
            case "U":
                return "일반사용자";
            case "S":
                return "대리점";
            default:
                return $type;
        }

    }

    /**
     * 사용자 유형 코드
     * @return string
     */
    public static function get_type_code(string $typeName):string {

        switch( $typeName ) {
            case "마스터":
                return "M";
            case "관리자":
                return "A";
            case "현장작업자":
                return "P";
            case "일반사용자":
                return "U";
            case "대리점":
                return "S";
            default:
                return $typeName;
        }

    }

    /**
     * @description 거래 구분
     */
    public static function item_gubun(string $gubun):string {

        switch( $gubun ) {
            case "1":
                return "일반판매";
            case "2":
                return "특수주문";
            case "3":
                return "샘플주문";
            default:
                return $gubun;
        }

    }

    /**
     * @description 제작 구분
     */
    public static function item_prod(string $gubun):string {

        switch( $gubun ) {
            case "1":
                return "생산제품";
            case "2":
                return "외주제품";
            default:
                return $gubun;
        }

    }

    /**
     * @description 제품 구분
     */
    public static function item_gb(string $gubun):string {

        switch( $gubun ) {
            case "1":
                return "매출";
            case "2":
                return "매입";
            case "3":
                return "매입/매출";
            default:
                return $gubun;
        }

    }

    /**
     * @description 거래처 구분
     */
    public static function biz_gb(string $gubun):string {

        switch( $gubun ) {
            case "1":
                return "매입처";
            case "2":
                return "매출처";
            case "3":
                return "매입/매출";
            default:
                return $gubun;
        }

    }   

    /**
     * @description 사용유무 (Y:사용 / N:사용안함)
     */
    public static function parse_useyn(string $gubun):string {

        switch( $gubun ) {
            case "Y":
                return "사용";
            case "N":
                return "사용불가";
            default:
                return $gubun;
        }

    }

    /**
     * @description 주문유무 (Y:주문가능 / N:주문불가)
     */
    public static function item_useyn(string $gubun):string {

        switch( $gubun ) {
            case "Y":
                return "주문가능";
            case "N":
                return "주문불가";
            default:
                return $gubun;
        }

    }

    /**
     * @description 거래유무 (Y:정상 / N:거래불가)
     */
    public static function ord_useyn(string $gubun):string {

        switch( $gubun ) {
            case "Y":
                return "정상";
            case "N":
                return "거래불가";
            default:
                return $gubun;
        }

    }

    /**
     *  @description매출/수금 구분 (S:주문접수(매출) / A: AS처리(매출) / R:반품(매출) / B:수금)
     */
    public static function acc_gubun(string $type):string {

        if(isset($type)) {

            switch( $type ) {
                case "S":
                    return "매출";
                case "A":
                    return "A/S";
                case "R":
                    return "반품";
                case "B":
                    return "수금";
                default:
                    return $type;
            }

        } else {
            return '해당없음';
        }

    }

    /**
     *  @description 서비스 상태관리 (H : 대기 / R : 진행 / Y : 완료 / N : 미반입 / I : 보유 / O : 출고)
     */
    public static function service_st(string $type):string {

        if(isset($type)) {

            switch( $type ) {
                case "H":
                    return "대기";
                case "R":
                    return "진행";
                case "Y":
                    return "완료";
                case "N":
                    return "미반입";
                case "I":
                    return "보유";
                case "O":
                    return "출고";
                default:
                    return $type;
            }

        } else {
            return '해당없음';
        }

    }

    /**
     *  @description 서비스 다음 상태로 상태변경 (H : 대기 / R : 진행 / Y : 완료 / N : 미반입 / I : 보유 / O : 출고)
     */
    public static function st_change(string $type):string {

        if(isset($type)) {

            switch( $type ) {
                case "H":
                    return "R";
                case "R":
                    return "Y";
                case "Y":
                    return "Y";
                case "N":
                    return "I";
                case "I":
                    return "O";
                case "O":
                    return "O";
                default:
                    return $type;
            }

        } else {
            return '해당없음';
        }

    }

    /**
     * @description 수금유무 (Y:수금완료 / N:수금전)
     */
    public static function sales_useyn(string $gubun):string {

        switch( $gubun ) {
            case "Y":
                return "완료";
            case "N":
                return "수금전";
            default:
                return $gubun;
        }

    }

    /**
     *  @description 다음 상태로 상태변경
     */
    public static function biz_change(string $type):string {

        if(isset($type)) {

            switch( $type ) {
                case "Y":
                    return "N";
                case "N":
                    return "Y";
                default:
                    return $type;
            }

        } else {
            return '해당없음';
        }

    }

    /**
     * @description 처리구분
     */
    public static function finyn(string $gubun):string {

        switch( $gubun ) {
            case "A":
                return "접수";
            case "N":
                return "대기";
            case "Y":
                return "진행";
            case "F":
                return "완료";
            case "C":
                return "취소";
            default:
                return $gubun;
        }

    }

    /**
     * @description 은행 코드별 은행명 확인 
     * code_pgmid : AC, code_main : 500
     */
    public static function get_bank_name(string $name):string {

        $ci =& get_instance();
        $ci->load->model('Common_m'); 

        if(isset($name)) {

            $result = $ci->Common_m->get_code_name('AC', '500', $name);
            return $result->code_name;

        } else {

            return '';

        }

    }

    /**
     * @description 단위 코드별 규격명 확인 
     * code_pgmid : $pgmid, code_main : $code, code_name : $name
     */
    public static function get_code_name($pgmid, $code, $name, $gb='') {

        $ci =& get_instance();
        $ci->load->model('Common_m'); 

        if(isset($pgmid) && isset($code) && isset($name)) {

            $result = $ci->Common_m->get_code_name($pgmid, $code, $name, $gb);
            if(empty($gb)) {
                return $result->code_name;
            } else {
                return $result->descrip;
            }

        } else {

            return '';

        }

    }

    /**
     * 2021-09-14 김원명 추가
     * @description 단위 코드별 규격명 확인 (z_plan.common_code)
     * code_pgmid : $pgmid, code_main : $code, code_name : $name
     */
    public static function get_code_name2($pgmid, $code, $name, $gb='') {

        $ci =& get_instance();
        $ci->load->model('Common_m'); 

        if(isset($pgmid) && isset($code) && isset($name)) {

            $result = $ci->Common_m->get_code_name2($pgmid, $code, $name, $gb);
            if(empty($gb)) {
                return $result->code_name;
            } else {
                return $result->descrip;
            }

        } else {

            return '';

        }

    }

    /**
     * @description 조건별 칼럼 카운터 구하기
     */
    public static function get_column_count($table, $where):string {

        $ci =& get_instance();
        $ci->load->model('Common_m'); 

        if(isset($table) && isset($where)) {

            $result = $ci->Common_m->get_column_count($table, $where);
            return $result;

        } else {

            return '';

        }

    }    

    /**
     * @description ikey row
     */
    public static function get_column($table, $ikey, $column) {

        $ci =& get_instance();
        $ci->load->model('Common_m'); 

        if(isset($table) && isset($ikey) && isset($column)) {

            $result = $ci->Common_m->get_column($table, $ikey, $column);
            return $result;

        } else {

            return '';

        }

    }

    /**
     * @description name row
     */
    public static function get_column2($table, $column, $where) {

        $ci =& get_instance();
        $ci->load->model('Common_m'); 

        if(isset($table) && isset($column) && isset($where)) {

            $result = $ci->Common_m->get_column2($table, $column, $where);
            return $result;

        } else {

            return '';

        }

    }

    /**
     * @description ikey result
     */
    public static function get_result($table, $data) {

        $ci =& get_instance();
        $ci->load->model('Common_m'); 

        if(isset($table) && isset($data)) {

            $result = $ci->Common_m->get_result($table, $data);
            return $result;

        } else {

            return '';

        }

    }
    

    /**
     * @description insert history
     */
    public static function set_history($pgm_ikey, $gubun, $content, $reg_ikey) {

        $ci =& get_instance();
        $ci->load->model('Common_m'); 

        if(isset($pgm_ikey) && isset($gubun) && isset($content) && isset($reg_ikey)) {

            $data['history'] = array(
                'pgm_ikey'  => $pgm_ikey,
                'gubun'     => $gubun,
                'content'   => $content,
                'reg_ikey'  => $reg_ikey
            );

            $result = $ci->Common_m->insert('history', $data['history']);
            return $result;

        } else {

            return '';

        }

    }

    /**
     * @description ikey row
     */
    public static function get_sum($table, $column, $name, $where) {

        $ci =& get_instance();
        $ci->load->model('Common_m'); 

        if(isset($table) && isset($column) && isset($name)) {

            $result = $ci->Common_m->get_sum($table, $column, $name, $where);
            return $result;

        } else {

            return '';

        }

    }

    /**
     * @description select max value
     */
    public static function get_max($table, $wcolumn, $wvalue, $column) {

        $ci =& get_instance();
        $ci->load->model('Common_m'); 

        if(isset($table) && isset($wcolumn) && isset($wvalue) && isset($column)) {

            $result = $ci->Common_m->get_sum($table, $wcolumn, $wvalue, $column);
            return $result;

        } else {

            return '';

        }

    }

    /**
     * @description date customize
     */
    public static function my_date($date, $type=1) {

        if(!empty($date)) {
            switch ($type) {
                case '1':
                    $date = date('Y-m-d', strtotime($date));
                    break;
                case '2':
                    $date = date('Y/m/d', strtotime($date));
                    break;
                case '3':
                    $date = date('Y-m-d H:i', strtotime($date));
                    break;
            }
            
        } else {
            $date = '';
        }
        return $date;
      
    }

    /**
     * @description number replace
     */
    public static function num_replace($number) {

        if(!empty($number)) {

            $num = preg_replace("/[^0-9]*/s","", $number);

        } else {
            $num = 0;
        }

        return $num;

    }

    /**
     * @description 하이픈 제거
     */
    public static function hyphen_replace($text) {

        if(!empty($text)) {

            $txt = str_replace("-", "", $text);

        } else {
            $txt = '';
        }

        return $txt;

    }

    /**
     * @description 기준 시작일, 기준 종료일 세팅
     */
    public static function base_date($gubun = '', $date) {

        if(empty($date)) {

            if($gubun == 's') {
                $date = '20200101';
            } else if($gubun == 'e') {
                $date = '20501231';
            }

        } else {
            $date = $date;
        }

        return $date;

    }

    /**
     * @description 센티미터를 미터로 변환
     */
    public static function centi_to_meter($centimeter) {

         return $centimeter * 0.01;
    }
    
    /**
     * @description 미터를 센티미터로 변환
     */
    public static function meter_to_centi($meter) {

        return $meter * 100;
    }

    /**
     * @description URL 쿼리스트링 값 구하기
     */
    public static function getUrlParameter($sch_tag) {
        $url = $_SERVER['QUERY_STRING'];
        parse_str($url, $str);
        return $str[$sch_tag];
    }

    /**
     * @description 숫자 앞에 0 채우기
     */
    public static function get_num($num) {

        if(isset($num)) {
            $num = sprintf('%03d', $num); 
            return $num; 
        } else {
            return 0;
        }  

    }

    /**
     * @description 전표번호 생성
     */
    public static function acc_no($date)
    {
        
        $ci =& get_instance();
        if(isset($date)) {
            $dt = $ci->common->hyphen_replace($date);
            $time = date("His");
            return $dt.$time;
        } else {
            return '';
        }  
    }

    /**
     * @description 날짜 계산
     */
    public static function get_date($type, $gb='', $param='')
    { 
        $str_dt = '';
        switch ($type) {
            /* 오늘날짜 */
            case 'today':
                $str_dt = date("Ymd"); 
                break;
            /* 이번달 : 202007 */
            case 'month':
                $str_dt = date("Ym"); 
                break;
            /* 오늘 + 10일 */
            case '+10':
                $str_dt = date("Ymd", mktime(0,0,0, intval(date('m')),intval(date('d')) + 10 ,intval(date('Y'))));
                break;
            /* 이번 달 1일 */
            case 'sday':
                $str_dt = date("Ymd", mktime(0, 0, 0, intval(date('m')), 1, intval(date('Y')) ));
                break;
            /* 이번달 말일 */
            case 'eday':
                $str_dt = date("Ymd", mktime(0, 0, 0, intval(date('m'))+1, 0, intval(date('Y')) ));
                break;
            /* 지난 달 last month */
            case 'l_mth':
                $str_dt = date("Ym", mktime(0, 0, 0, intval(date('m'))-1, intval(date('d')), intval(date('Y')) ));
                break;
            /* 지난달 1일 */
            case 'l_s_mth':
                $str_dt = date("Ymd", mktime(0, 0, 0, intval(date('m'))-1, 1, intval(date('Y')) ));
                break;
            /* 지난달 말일 */
            case 'l_e_mth':
                $str_dt = date("Ymd", mktime(0, 0, 0, intval(date('m')), 0, intval(date('Y')) ));
                break;
            /* 3개월 전 1일 */
            case '3_s_mth':
                $str_dt = date("Ymd", mktime(0, 0, 0, intval(date('m'))-2, 1, intval(date('Y')) ));
                break;  
            /* 지정개월 전 1일 */
            case 'base_mth':
                $str_dt = date("Ymd", mktime(0, 0, 0, intval(date('m'))-$param, 1, intval(date('Y')) ));
                break;                
            case 'week_day':
                $str_dt = date("Y-m-d", strtotime('monday this week', strtotime(date("Y-m-d"))))." ~ ".date("Y-m-d", strtotime('sunday this week', strtotime(date("Y-m-d"))));
                break;
        }
        /* 구분자 있을경우 날짜 하이픈 처리 */
        if(!empty($gb)) {
            $str_dt = my_date($str_dt);
        }
        return $str_dt;
    }


    /**
     * @description 배송지 등록
     */
    public static function addr_in($cust_cd, $dlv_name, $dlv_code, $dlv_address, $dlv_detail) 
    {

        $ci =& get_instance();
        $ci->load->model('Common_m');

        if(isset($cust_cd) && isset($dlv_name) && isset($dlv_address)) {

            $dlv_cd = $ci->Common_m->get_max2('dlv_address', 'dlv_cd', array('cust_cd'=>$cust_cd));
            $dlv_cd = $dlv_cd+1;

            $data['unique'] = array(
                'cust_cd'      => $cust_cd,
                'dlv_cd'       => $dlv_cd
            );
            
            $data['list'] = array(
                'cust_cd'      => $cust_cd,
                'dlv_cd'       => $dlv_cd,
                'dlv_name'     => $dlv_name, 
                'dlv_code'     => $dlv_code,
                'dlv_address'  => $dlv_address,
                'dlv_detail'   => $dlv_detail,
                'reg_ikey'     => $ci->session->userdata['ikey'],
                'mod_ikey'     => $ci->session->userdata['ikey']
            );

            if($ci->Common_m->get_column_count('dlv_address', $data['unique']) == 0)
            {
                // success 
                $result = $ci->Common_m->insert('dlv_address', $data['list']);
                if($result) {
                    return true;
                } else {
                    return false;
                }
            }
            else
            {
                // fail
                return false;
            }

        } else {

            return false;

        }

    }

    /**
     * @주문번호 생성
     */
    public static function get_ord_no($table, $type, $num)
    {
        $ci =& get_instance();
        $ci->load->model('Common_m');

        $code = '';
        $dt   = date('Ymd');
        $stat = true;

		while($stat){
            $str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $max = strlen($str) - 1;
            $len = abs($num); // 자릿수 지정
            
            for($i=0; $i<$len; $i++) {
                $code .= $str[random_int(0, $max)];
            }

			$ord_no = $dt.$type.$code;
			$cnt = $ci->Common_m->get_count($table, array('ord_no' => $ord_no));

			if($cnt < 1){
				$stat = false;
			}
		}

        return $ord_no;
    }

    /**경리나라 api 연동 */
    public static function curl($JSONData)
    {
        $url = 'https://serpapi.appplay.co.kr/gw/ErpGateWay'; // api url 입력

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_POSTFIELDS, $JSONData); // post 데이터
        curl_setopt($ch, CURLOPT_POST, true); // true 시 post로 전송
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json')); // 헤더 및 타입 설정
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // 요청 결과를 문자열로 반환
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 원격 서버의 인증서가 유효한지 검사 x

        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
    }

     /**
     * [curl description] 웹 기반 Client Technology - GET형식
     * @param  [type] $url    CURL URL
     * @param  [type] $header CURL Header Info
     * @param  [type] $data   GET 데이터
     * @return [type]         [description]
     */
    public static function get_curl($url, $header, $data)
    {

        //$api_url = $url . "?" . http_build_query($data); // api url
        $api_url = $url; // api url
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);       // 헤더 및 타입 설정
        curl_setopt($ch, CURLOPT_URL, $api_url);
        curl_setopt($ch, CURLOPT_SSLVERSION, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);    // 원격 서버의 인증서가 유효한지 검사 x
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLINFO_HEADER_OUT, 1);

        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
        
    }

    /**
     * [curl description] 웹 기반 Client Technology - POST형식
     * @param  [type] $url    CURL URL
     * @param  [type] $header CURL Header Info
     * @param  [type] $data   POST 데이터
     * @return [type]         [description]
     */
    public static function post_curl($url, $header, $data)
    {

        $api_url = $url; // api url
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);   // 헤더 및 타입 설정
        curl_setopt($ch, CURLOPT_URL, $api_url);
        curl_setopt($ch, CURLOPT_POST, 1);              // true 시 post로 전송
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);    // post 데이터
        curl_setopt($ch, CURLOPT_SSLVERSION, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);    // 원격 서버의 인증서가 유효한지 검사 x
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLINFO_HEADER_OUT, 1);

        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
        
    }

    /**
     * @description 페이지네이션 자체 모델 클래스 사용
     * @author 김민주, @version 1.0
     * @see manual http://www.ciboard.co.kr/user_guide/kr/libraries/pagination.html
     */
    public static function my_pagination($p, $s='') {

        $ci =& get_instance();

        $model = $p['model_name'];
        $ci->load->model($p['model_path']);

        $config = array();
        $config['base_url'] = base_url() . $p['site_url'];

        $search = $p['s'];

        if( $search == 't' ) {

            //$config['total_rows'] = $ci->$model->get_search_count($s);
            $config['total_rows'] = $ci->$model->get_search_count($p, $s);

            // get params config
            $config['reuse_query_string'] = FALSE; 
            $config['suffix'] = '?'.$_SERVER['QUERY_STRING'];
            $config['first_url'] = $config['base_url'].$config['suffix'];

        } else {
            //$config['total_rows'] = $ci->$model->get_count($p);
            $config['total_rows'] = $ci->$model->get_count($p, $s);
        }
        
        $config['per_page'] = $p['per_page'];
        $config['uri_segment'] = $p['uri_segment'];

        $config['full_tag_open'] = '<ul class="pagination">';
        $config['full_tag_close'] = '</ul>';
        $config['first_link'] = '<<';
        $config['first_tag_open'] = '<li>';
        $config['first_tag_close'] = '</li>';
        $config['last_link'] = '>>';
        $config['last_tag_open'] = '<li>';
        $config['last_tag_close'] = '</li>';
        $config['prev_link'] = FALSE;
        $config['prev_tag_open'] = '<li>';
        $config['prev_tag_close'] = '</li>';
        $config['next_link'] = FALSE;
        $config['next_tag_open'] = '<li>';
        $config['next_tag_close'] = '</li>';
        $config['cur_tag_open'] = '<li class="page-item active"><a class="page-link">';
        $config['cur_tag_close'] = '</a></li>';
        $config['num_tag_open'] = '<li>';
        $config['num_tag_close'] = '</li>';
        $config['num_links'] = $p['num_links'];

        $ci->pagination->initialize($config);
        $page = ($ci->uri->segment($p['uri_segment'])) ? $ci->uri->segment($p['uri_segment']) : 0;
        $data['links'] = $ci->pagination->create_links();

        /**
         * @param limit, offset
         */
        if( $search == 't' ) {
            //$data['list'] = $ci->$model->get_search_list($config['per_page'], $page, $s);
            $data['list'] = $ci->$model->get_search_list($config['per_page'], $page, $p, $s);
        } else {
            //$data['list'] = $ci->$model->get_list($config['per_page'], $page, $p);
            $data['list'] = $ci->$model->get_list($config['per_page'], $page, $p, $s);
        }

        // header, asize 디자인 유지용 파라미터
        $data['site_url'] = $p['site_url'];
        $data['title'] = $p['title'];

        $data['total_count'] = $config['total_rows'];

        $data['params'] = $s;

        return $data;

    }

    /**
     * @description 페이지네이션 공통 모델 클래스 사용
     * @author 김민주, @version 1.0
     * @see manual http://www.ciboard.co.kr/user_guide/kr/libraries/pagination.html
     */
    public static function my_pagination2($p, $s='') {

        $ci =& get_instance();
        $ci->load->model('Common_m'); 

        $config = array();
        $config['base_url'] = base_url() . $p['site_url'];

        $search = $p['s'];

        if( $search == 't' ) {

            $config['total_rows'] = $ci->Common_m->get_search_count($p['table'], $s, $p['where']);

            // get params config
            $config['reuse_query_string'] = FALSE; 
            $config['suffix'] = '?'.$_SERVER['QUERY_STRING'];
            $config['first_url'] = $config['base_url'].$config['suffix'];

        } else {
            $config['total_rows'] = $ci->Common_m->get_count($p['table'], $p['where']);
        }
        
        $config['per_page'] = $p['per_page'];
        $config['uri_segment'] = $p['uri_segment'];

        $config['full_tag_open'] = '<ul class="pagination">';
        $config['full_tag_close'] = '</ul>';
        $config['first_link'] = '<<';
        $config['first_tag_open'] = '<li>';
        $config['first_tag_close'] = '</li>';
        $config['last_link'] = '>>';
        $config['last_tag_open'] = '<li>';
        $config['last_tag_close'] = '</li>';
        $config['prev_link'] = FALSE;
        $config['prev_tag_open'] = '<li>';
        $config['prev_tag_close'] = '</li>';
        $config['next_link'] = FALSE;
        $config['next_tag_open'] = '<li>';
        $config['next_tag_close'] = '</li>';
        $config['cur_tag_open'] = '<li class="page-item active"><a class="page-link">';
        $config['cur_tag_close'] = '</a></li>';
        $config['num_tag_open'] = '<li>';
        $config['num_tag_close'] = '</li>';
        $config['num_links'] = $p['num_links'];

        $ci->pagination->initialize($config);
        $page = ($ci->uri->segment($p['uri_segment'])) ? $ci->uri->segment($p['uri_segment']) : 0;
        $data['links'] = $ci->pagination->create_links();

        /**
         * @param limit, offset
         */
        if( $search == 't' ) {
            $data['list'] = $ci->Common_m->get_search_list($p['table'], $config['per_page'], $page, $s, $p['where'], $p['sort']);
        } else {
            $data['list'] = $ci->Common_m->get_list($p['table'], $config['per_page'], $page, $p['where'], $p['sort']);
        }

        // header, asize 디자인 유지용 파라미터
        $data['site_url'] = $p['site_url'];
        $data['title'] = $p['title'];

        $data['total_count'] = $config['total_rows'];

        $data['params'] = $s;

        return $data;

    }

    /**
     * @description 페이지네이션 공통 모델 클래스 사용. my_pagination2에서 sort 조건 추가
     * @author 김민주, @version 1.0
     * @see manual http://www.ciboard.co.kr/user_guide/kr/libraries/pagination.html
     */
    public static function my_pagination3($p, $s='') {

        $ci =& get_instance();
        $ci->load->model('Common_m'); 

        $config = array();
        $config['base_url'] = base_url() . $p['site_url'];

        $search = $p['s'];

        if( $search == 't' ) {

            $config['total_rows'] = $ci->Common_m->get_search_count($p['table'], $s, $p['where']);

            // get params config
            $config['reuse_query_string'] = FALSE; 
            $config['suffix'] = '?'.$_SERVER['QUERY_STRING'];
            $config['first_url'] = $config['base_url'].$config['suffix'];

        } else {
            $config['total_rows'] = $ci->Common_m->get_count($p['table'], $p['where']);
        }
        
        $config['per_page'] = $p['per_page'];
        $config['uri_segment'] = $p['uri_segment'];

        $config['full_tag_open'] = '<ul class="pagination">';
        $config['full_tag_close'] = '</ul>';
        $config['first_link'] = '<<';
        $config['first_tag_open'] = '<li>';
        $config['first_tag_close'] = '</li>';
        $config['last_link'] = '>>';
        $config['last_tag_open'] = '<li>';
        $config['last_tag_close'] = '</li>';
        $config['prev_link'] = FALSE;
        $config['prev_tag_open'] = '<li>';
        $config['prev_tag_close'] = '</li>';
        $config['next_link'] = FALSE;
        $config['next_tag_open'] = '<li>';
        $config['next_tag_close'] = '</li>';
        $config['cur_tag_open'] = '<li class="page-item active"><a class="page-link">';
        $config['cur_tag_close'] = '</a></li>';
        $config['num_tag_open'] = '<li>';
        $config['num_tag_close'] = '</li>';
        $config['num_links'] = $p['num_links'];

        $ci->pagination->initialize($config);
        $page = ($ci->uri->segment($p['uri_segment'])) ? $ci->uri->segment($p['uri_segment']) : 0;
        $data['links'] = $ci->pagination->create_links();

        /**
         * @param limit, offset
         */
        if( $search == 't' ) {
            $data['list'] = $ci->Common_m->get_search_list2($p['table'], $s, $p['where'], $p['sort'], $config['per_page'], $page);
        } else {
            $data['list'] = $ci->Common_m->get_list2($p['table'], $p['where'], $p['sort'], $config['per_page'], $page);
        }

        // header, asize 디자인 유지용 파라미터
        $data['site_url'] = $p['site_url'];
        $data['title'] = $p['title'];
        
        $data['total_count'] = $config['total_rows'];

        $data['params'] = $s;

        return $data;

    }

    /**
     * @description 경리나라 API에 맞게 사용된 페이지네이션(모델 사용X)
     * @author 김원명, @version 1.0
     */
    public static function my_pagination4($arg1)
    {
        $ci =& get_instance();

        $config = array();
        $config['base_url'] = base_url() . $arg1['site_url'];

        $config['per_page'] = $arg1['per_page'];
        $config['uri_segment'] = $arg1['uri_segment'];

        if( $arg1['s'] == 't' ) {
            // get params config
            $config['reuse_query_string'] = FALSE; 
            $config['suffix'] = '?'.$_SERVER['QUERY_STRING'];
            $config['first_url'] = $config['base_url'].$config['suffix'];
        }

        $config['total_rows'] = $arg1['total_rows'];

        $config['full_tag_open'] = '<ul class="pagination">';
        $config['full_tag_close'] = '</ul>';
        $config['first_link'] = '<<';
        $config['first_tag_open'] = '<li>';
        $config['first_tag_close'] = '</li>';
        $config['last_link'] = '>>';
        $config['last_tag_open'] = '<li>';
        $config['last_tag_close'] = '</li>';
        $config['prev_link'] = FALSE;
        $config['prev_tag_open'] = '<li>';
        $config['prev_tag_close'] = '</li>';
        $config['next_link'] = FALSE;
        $config['next_tag_open'] = '<li>';
        $config['next_tag_close'] = '</li>';
        $config['cur_tag_open'] = '<li class="page-item active"><a class="page-link">';
        $config['cur_tag_close'] = '</a></li>';
        $config['num_tag_open'] = '<li>';
        $config['num_tag_close'] = '</li>';
        $config['num_links'] = $arg1['num_links'];

        $ci->pagination->initialize($config);
        $data['links'] = $ci->pagination->create_links();

        return $data['links'];
    }

    /**
     * @description 고객센터 각 메뉴 사용하기 위한 페이지네이션
     * @author 김원명, @version 1.0
     */
    public static function my_pagination5($p, $s='') {

        $ci =& get_instance();
        $ci->load->model('Common_m');
        $ci->load->model('cs/'.$p['table'].'_m');

        $config = array();
        $config['base_url'] = base_url() . $p['site_url'];
        $search = $p['s'];

        if( $search == 't' ) {
            switch($p['table'])
            {
                case 'question':
                    $config['total_rows'] = $ci->Question_m->get_search_count($s['op'], $s['val'], $p['where']);
                break;
                case 'notice':
                    $config['total_rows'] = $ci->Notice_m->get_search_count($s['op'], $s['val']);
                break;
                case 'faq':
                    $config['total_rows'] = $ci->Faq_m->get_search_count($s['op'], $s['val']);
                break;
            }
            // get params config
            $config['reuse_query_string'] = FALSE; 
            $config['suffix'] = '?'.$_SERVER['QUERY_STRING'];
            $config['first_url'] = $config['base_url'].$config['suffix'];

        } else {
            if($p['table'] == "question"){
                $config['total_rows'] = $ci->Question_m->get_count($p['table'], $p['where']);
            }else{
                $config['total_rows'] = $ci->Common_m->get_count($p['table'], $p['where']);
            }
        }
        $data['total_cnt'] = $config['total_rows'];
        $config['per_page'] = $p['per_page'];
        $config['uri_segment'] = $p['uri_segment'];

        $config['full_tag_open'] = '<ul class="pagination">';
        $config['full_tag_close'] = '</ul>';
        $config['first_link'] = '<<';
        $config['first_tag_open'] = '<li>';
        $config['first_tag_close'] = '</li>';
        $config['last_link'] = '>>';
        $config['last_tag_open'] = '<li>';
        $config['last_tag_close'] = '</li>';
        $config['prev_link'] = FALSE;
        $config['prev_tag_open'] = '<li>';
        $config['prev_tag_close'] = '</li>';
        $config['next_link'] = FALSE;
        $config['next_tag_open'] = '<li>';
        $config['next_tag_close'] = '</li>';
        $config['cur_tag_open'] = '<li class="page-item active"><a class="page-link">';
        $config['cur_tag_close'] = '</a></li>';
        $config['num_tag_open'] = '<li>';
        $config['num_tag_close'] = '</li>';
        $config['num_links'] = $p['num_links'];
        
        $ci->pagination->initialize($config);
        $page = ($ci->uri->segment($p['uri_segment'])) ? $ci->uri->segment($p['uri_segment']) : 0;
        $data['links'] = $ci->pagination->create_links();
        if( $search == 't' ) {
            switch($p['table'])
            {
                case 'question':
                    $data['list'] = $ci->Question_m->get_search_list($page, $config['per_page'], $s['op'], $s['val'], $p['where']);
                break;
                case 'notice':
                    $data['list'] = $ci->Notice_m->get_search_list($page, $config['per_page'], $s['op'], $s['val']);                    
                break;
                case 'faq':
                    $data['list'] = $ci->Faq_m->get_search_list($page, $config['per_page'], $s['op'], $s['val']);                    
                break;
            }
        } else {
            if($p['table'] == "question"){
                $data['list'] = $ci->Question_m->get_list($p['table'], $p['where'], $p['sort'], $config['per_page'], $page);
            }else{
                $data['list'] = $ci->Common_m->get_list2($p['table'], $p['where'], $p['sort'], $config['per_page'], $page);
            }
        }

        // header, asize 디자인 유지용 파라미터
        $data['site_url'] = $p['site_url'];
        $data['title'] = $p['title'];
        $data['page'] = $page;

        $data['params'] = $s;

        return $data;
    }

    /**
     * @description 앱에서 사용 중인 금액 계산
     * @author 김원명, @version 1.0
     */
    public static function app_alculation($ord_no) {
        $ci =& get_instance();
        $ci->load->model('Common_m');

        $row = $ci->Common_m->get_row('center_ord_master', array('ord_no' => $ord_no));

        $mas_spec = isset($row->mas_spec) ? json_decode($row->mas_spec) : null;
        $mas_pay  = isset($row->mas_pay) ? json_decode($row->mas_pay) : null;
        $ord_amt  = $ci->Common_m->get_sum('center_ord_detail', 'ord_amt', 'ord_amt', array('ord_no' => $ord_no, 'useyn' => 'Y', 'finyn !=' => '009'));

        $adjust_dis_amt = 0;
        $adjust_add_amt = 0;
        $cut_amt        = 0;
        $adjust_dis_per = 0;

        if(isset($mas_spec)){
            if($mas_spec->adjust_dis_unit == '001'){
                $adjust_dis_amt = (int)$mas_spec->adjust_dis_amt;
            }else{
                $adjust_dis_amt = ( ($ord_amt) / 100 ) * (float)$mas_spec->adjust_dis_amt;
                $adjust_dis_per = $mas_spec->adjust_dis_amt;
            }

            $adjust_add_amt = $mas_spec->adjust_add_amt;
            $cut_amt        = $mas_spec->cut_amt;

            $ord_amt        = $ord_amt - (int)$adjust_dis_amt + (int)$mas_spec->adjust_add_amt - (int)$mas_spec->cut_amt;
        }

        $pay_dis_amt = 0;
        $pay_add_amt = 0;
        $pay_dis_per = 0;

        if(isset($mas_pay)){
            if($mas_pay->dis_unit == '001'){
                $pay_dis_amt = (int)$mas_pay->dis_amt;
            }else{
                $pay_dis_amt = ( $ord_amt / 100 ) * $mas_pay->dis_amt;
                $pay_dis_per = $mas_pay->dis_amt;
            }

            $pay_add_amt = (int)$mas_pay->add_amt;
        }

        $ord_amt  = $ord_amt - $pay_dis_amt + $pay_add_amt;

        $amt = array(
            'adjust_dis_amt'    =>  $adjust_dis_amt,
            'adjust_add_amt'    =>  $adjust_add_amt,
            'adjust_dis_per'    =>  $adjust_dis_per,
            'cut_amt'           =>  $cut_amt,
            'ord_amt'           =>  $ord_amt
        );

        return $amt;
    }

    /**
     * @description 마진율 계산
     * @author 김원명, @version 1.0
     */
    public static function get_margin($sal_amt, $pur_amt)
    {
        $sal_amt = (int)$sal_amt;
        $pur_amt = (int)$pur_amt;

        if($sal_amt === 0){
            $result_amt = 0;
        }else{
            $result_amt = round(($sal_amt - $pur_amt) / $sal_amt * 100, 2);
        }

        return $result_amt;
    }

    /**
     * @description lot 번호 생성
     */
    public function get_lot($i)
    {
        $ci =& get_instance();
        $ci->load->model('Common_m');

        $code = '';
        $dt   = date('Ymd');
        $stat = true;

        while($stat){
            $str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $max = strlen($str) - 1;
            $len = abs(4);
            
            for($j=0; $j<$len; $j++) {
                $code .= $str[random_int(0, $max)];
            }

            $lot = $dt.'-C-1-'.$i.'-'.$code; // lot 번호 생성
            $cnt = $ci->Common_m->get_count('center_ord_detail', array('lot' => $lot));

            if($cnt < 1){
                $stat = false;
            }
        }

        return $lot;
    }

    /**
     * @description 앱 명세표 히스토리 등록
     */
    public static function app_ord_history($ord_no, $finyn, $dt='') 
    {
        $ci =& get_instance();
        $ci->load->model('Common_m');
        $ikey = $ci->session->userdata['ikey'];
        
        
        if($dt == '')
        {
            $data['list'] = array(
                'cen_uc'        => $ci->session->userdata['cen_uc'],
                'ord_no'        => $ord_no,
                'finyn'         => $finyn,
                'reg_nm'        => $ci->Common_m->get_column2('z_plan.center_user_list', 'ul_nm', array('ikey' => $ikey)),
                'reg_ikey'      => $ikey,
                'reg_ip'        => $ci->input->ip_address()
            );
        }
        else
        {
            $data['list'] = array(
                'cen_uc'        => $ci->session->userdata['cen_uc'],
                'ord_no'        => $ord_no,
                'finyn'         => $finyn,
                'reg_nm'        => $ci->Common_m->get_column2('z_plan.center_user_list', 'ul_nm', array('ikey' => $ikey)),
                'reg_ikey'      => $ikey,
                'reg_ip'        => $ci->input->ip_address(),
                'reg_dt'        => $dt
            );
        }

        $result = $ci->Common_m->insert('center_ord_history', $data['list']);
    }

    /**
     * @description 앱 명세표 히스토리 등록
     */
    public static function center_ord_history($data, $dt='') 
    {
        $ci =& get_instance();
        $ci->load->model('Common_m');
        //$ikey = $ci->session->userdata['ikey'];
        
        
        if($dt == '')
        {
            $data['list'] = array(
                'cen_uc'        => $data['cen_uc'],
                'ord_no'        => $data['ord_no'],
                'finyn'         => $data['finyn'],
                'reg_nm'        => $ci->Common_m->get_column2('z_plan.center_user_list', 'ul_nm', array('ikey' => $data['reg_ikey'])),
                'reg_ikey'      => $data['reg_ikey'],
                'reg_ip'        => $ci->input->ip_address()
            );
        }
        else
        {
            $data['list'] = array(
                'cen_uc'        => $data['cen_uc'],
                'ord_no'        => $data['ord_no'],
                'finyn'         => $data['finyn'],
                'reg_nm'        => $ci->Common_m->get_column2('z_plan.center_user_list', 'ul_nm', array('ikey' => $data['reg_ikey'])),
                'reg_ikey'      => $data['reg_ikey'],
                'reg_ip'        => $ci->input->ip_address(),
                'reg_dt'        => $dt
            );
        }

        $result = $ci->Common_m->insert('center_ord_history', $data['list']);
    }
}
