<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 권한 조회 클래스
 * @author 김원명, @version 1.0, @last date 2021/05/26
 * @author 김민주, @version 2.0, @last date 2022/04/28 - 라인 정리
 */
class Authori {

    /**
     * @ 권한을 session값으로 조회하여 값 return
     */
    public static function give_auth($kind) 
    { 
        $ci =& get_instance();
        $ci->load->model('/base/User_m');
        $ci->load->model('/cs/Question_m');

        switch ($kind)
        {
            case 'menu':
                $auth = $ci->User_m->get_user_auth_tmp($ci->session->userdata['dp_uc'], $ci->session->userdata['ul_uc'], $ci->session->userdata['local_cd']);
            break;
            case 'head':
                $auth = $ci->User_m->get_head_menu_auth($ci->session->userdata['dp_uc'], $ci->session->userdata['ul_uc'], $ci->session->userdata['local_cd']);
            break;
            case 'check':
                $auth = $ci->Question_m->get_count('question', 'DATE_FORMAT(reg_dt, "%Y-%m-%d") = CURDATE() AND answer = "N" AND delyn = "N"');
            break;
        }
        return $auth;
    }

    public static function get_list() 
    {
        $ci =& get_instance();
        $ci->load->model('/base/User_m');
        $url = "/".$ci->uri->segment(1)."/".$ci->uri->segment(2);

        // 메뉴 처리 안되어있는 팝업창 url 변환
        switch ($url)
        { 
            case '/ord/sales_li':
                $purl = '/ord/ord_list';
                break;
            case '/ord/out_in':
                $purl = '/ord/ord_sheet';
                break;
            case '/base/all_price':
                $purl = '/base/item_list';
                break;
            case '/ord/buy_in': case '/ord/pay':
                $purl = '/ord/buy';
                break;
            case '/ord/ord_reg':
                $purl = '/ord/ord_list';
                break;
            default:
                $purl = $url;
        }
        $id = $ci->User_m->get_auth($ci->session->userdata['dp_uc'], $ci->session->userdata['ul_uc'], $purl, $ci->session->userdata['local_cd']);
        $list = $ci->Common_m->get_result2('z_plan.factory_menu', array('head_id' => $id[0]->head_id, 'local_cd' => $ci->session->userdata['local_cd']), 'cm_seq ASC');

        $data['list'] = array(
            'data' => $id[0],
            'list' => $list
        );
        return $data['list'];
    }

    /**
     * 화면 url 조회 권한 true/false
     * @메인페이지 작업 => 2021/05/26 김원명 추가
     */
    public static function get_url_auth()
    {
        $ci =& get_instance();
        $ci->load->model('/base/User_m');
        $url = "/".$ci->uri->segment(1)."/".$ci->uri->segment(2);

        // 메뉴 처리 안되어있는 팝업창 url 변환
        switch ($url)
        {
            case '/ord/out_in':
                $purl = '/ord/ord_sheet';
                break;
            case '/base/all_price':
                $purl = '/base/item_list';
                break;
            case '/ord/buy_in': case '/ord/pay':
                $purl = '/ord/buy';
                break;
            case '/ord/ord_reg':
                $purl = '/ord/ord_list';
                break;
            default:
                $purl = $url;
        }

        $auth = $ci->User_m->get_auth($ci->session->userdata['dp_uc'], $ci->session->userdata['ul_uc'], $purl, $ci->session->userdata['local_cd']);
        if (isset($auth))
        {
            if ($auth[0]->read == "Y")
            {
                $result = true;
            }
            else
            {
                $result = false;
            }
        }
        else
        {
            $result = false;
        }
        return $result;
    }
}
