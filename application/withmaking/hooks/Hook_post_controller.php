<?php
/**
 * @description autoload config
 * @author 김민주, @version 1.0, @last date 2021/12/06
 */
class Hook_post_controller {

    private $CI;

    function __construct() 
    {
        $this->CI = & get_instance();
    }
    
    function load_config()
    {

        $this->CI->load->database();
        $this->CI->load->helper(array('form', 'url', 'alert', 'common'));
        $this->CI->load->library(array('Common', 'Order', 'pagination', 'session', 'form_validation', 'Authori'));
        $this->CI->load->model(array('Common_m'));

        /* 미개발 접속 예외처리. 개발중 대분류 메뉴 생성으로 비활성화. 김민주 2021/12/30 */
/*        $open_url = array(
            '/work/cter_st', // 생산
            '/cen/ord_wait', // 센터 주문승인
            '/cen/ord_com',  // 센터 승인내역
            '/work/work_st', // 모니터링
            '/ord/buy',      // 재고관리 - 구매발주
            '/st/sales_st',  // 통계
        );

        // 로그인 상태일 경우만 로직 연동
        if($this->CI->session->userdata('ikey')) { 

            // 개발자 테스트 계정 외 URL접근 제한
            $local_cd = $this->CI->session->userdata['local_cd'];
            $request_url = $_SERVER['REQUEST_URI'];

            // KR04 공장만 에러 페이지 허용
            if($this->CI->session->userdata['local_cd'] != "KR04") {

                if(in_array($request_url, $open_url)) { 
                    alert('서비스 오픈 예정이니 잠시만 기다려 주세요. 곧 찾아뵐께요!', '/main'); 
                } // end array check

            } // end factory check
        
        } // end login check*/


    } // end function

} // end class
?>
