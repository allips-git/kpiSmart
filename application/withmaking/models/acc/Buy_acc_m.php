<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 구매 발주 회계 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date
 */
class Buy_acc_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 발주 회계 등록
     * @param 작업 구분, 거래 일자, 등록 데이터
     * @hint 발주 등록시에는 acc_type, bl_uc, acc_nm 사용 안함.
     */
    public function acc_insert($gb, $date, $data)
    {
        $this->db->trans_begin();
        $result['reg'] = array(
            'local_cd'      => $data['local_cd'],
            'cust_cd'       => $data['cust_cd'],
            'acc_no'        => $this->common->acc_no(date("Y-m-d")),
            'ord_no'        => $data['ord_no'],
            'acc_gb'        => $gb,
            'acc_dt'        => $date,
            'acc_type'      => ($gb != 'S') ? $data['acc_type'] : '',
            'bl_uc'         => ($gb != 'S') ? $data['bl_uc'] : '',
            'acc_nm'        => ($gb != 'S') ? $data['acc_nm'] : '',
            'amt'           => $data['total_amt'],
            'tax'           => $data['total_tax'],
            'vat'           => $data['vat'],
            'memo'          => $data['memo'],
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );

        $this->db->insert('buy_acc_list', $result['reg']);
        if ($this->db->trans_status() === FALSE)
        {
            $this->db->trans_rollback();
            return false;
        }
        else
        {
            $this->db->trans_commit();
            return true;
        }

    }

    /**
     * @description 발주 회계 수정
     * @param 수정 데이터, 수정 조건
     * @hint 발주 수정시에는 acc_type, bl_uc, acc_nm 사용 안함.
     */
    public function acc_update($gb, $data)
    {
        $this->db->trans_begin();

        // variable list
        $result['var'] = array(
            'local_cd'      => $data['local_cd'],
            'cust_cd'       => $data['cust_cd'],
            'ord_no'        => $data['ord_no']
        );

        // 수정정보
        $result['mod'] = array(
            'acc_type'      => ($gb != 'S') ? $data['acc_type'] : '',
            'bl_uc'         => ($gb != 'S') ? $data['bl_uc'] : '',
            'acc_nm'        => ($gb != 'S') ? $data['acc_nm'] : '',
            'amt'           => $data['total_amt'],
            'tax'           => $data['total_tax'],
            'vat'           => $data['vat'],
            'memo'          => $data['memo'],
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );

        $this->db->update('buy_acc_list', $result['mod'], $result['var']);
        if ($this->db->trans_status() === FALSE)
        {
            $this->db->trans_rollback();
            return false;
        }
        else
        {
            $this->db->trans_commit();
            return true;
        }

    }

}
