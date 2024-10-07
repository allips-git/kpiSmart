<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 매출/수금 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/08/17
 */
class Ord_pay_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
        $this->encrypt_key = $this->config->item('encrypt_key');
    }

    /**
     * @description 매출/수금 리스트
     * @param 공장코드, 거래처코드, 검색 날짜
     * @return ord acc list
     */
    public function get_list($data)
    {
        $sql    = 'SET @cust_cd := ?, @encrypt_key := ?';
        $query  = $this->db->query($sql, array((string)$data['cust_cd'], (string)$this->encrypt_key));
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT a.ikey, a.acc_dt, a.detail, ac.code_nm AS detail_nm, a.acc_type
                    , a.acc_no, m.cust_nm, a.bl_cd, ba.code_nm AS bank_nm
                    , IFNULL(CONVERT(AES_DECRYPT(UNHEX(a.acc_nm), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8), "") AS acc_nm
                    , IFNULL(CONVERT(AES_DECRYPT(UNHEX(a.bl_num), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8), "") AS bl_num
                    , a.amt, a.tax, a.memo, c.code_nm
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, a.reg_dt
                    , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, a.mod_dt
                    , IFNULL((SELECT SUM(amt+tax) FROM ord_acc_list 
                              WHERE cust_cd = @cust_cd AND acc_no <= a.acc_no AND `work` = "IN"
                              AND useyn = "Y" AND delyn = "N"), 0)
                    - IFNULL((SELECT SUM(amt+tax) FROM ord_acc_list 
                              WHERE cust_cd = @cust_cd AND acc_no <= a.acc_no AND `work` = "OUT"
                              AND useyn = "Y" AND delyn = "N"), 0) AS total_amt
                    FROM ord_acc_list AS a
                    INNER JOIN (SELECT @rownum := 0) r
                    INNER JOIN z_plan.common_code AS ac ON (ac.code_gb ="AC" AND ac.code_main = "120" AND a.detail = ac.code_sub)   # 거래 상세
                    LEFT JOIN ord_master AS m ON (a.local_cd = m.local_cd AND a.ord_no = m.ord_no)
                    LEFT JOIN z_plan.common_code AS c ON (c.code_gb ="AC" AND c.code_main = "020" AND a.acc_type = c.code_sub)      # 결제방식
                    LEFT JOIN z_plan.common_code AS ba ON (ba.code_gb ="AC" AND ba.code_main = "030" AND a.bl_cd = ba.code_sub)     # 은행 계좌
                    LEFT JOIN z_plan.user_list AS u1 ON(u1.ikey = a.reg_ikey)
                    LEFT JOIN z_plan.user_list AS u2 ON(u2.ikey = a.mod_ikey)
                    WHERE a.local_cd = ? AND a.cust_cd = @cust_cd
                    AND a.acc_dt BETWEEN "'.$data['start_dt'].'" AND "'.$data['end_dt'].'"
                    AND a.useyn = "Y" AND a.delyn = "N"
                    ORDER BY a.acc_no ASC, a.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd']));
        return $query->result();
    }

    /**
     * @description 주문 회계 등록 (매출/수금)
     * @param 거래 일자, 등록 데이터
     */
    public function acc_insert($date, $data)
    {
        $this->db->trans_begin();
        $result['reg'] = array(
            'local_cd'      => $data['local_cd'],
            'cust_cd'       => $data['cust_cd'],
            'acc_no'        => str_replace("-","",$date).date("his",time()),
            'ord_no'        => $data['ord_no'],
            'work'          => 'IN',
            'detail'        => '001',
            'acc_dt'        => $date,
            'amt'           => $data['total_amt'],
            'tax'           => $data['total_tax'],
            'vat'           => $data['vat'],
            'memo'          => !empty($data['memo']) ? $data['memo'] : '',
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );
        $this->db->insert('ord_acc_list', $result['reg']);

        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );
        // 거래처 업데이트
        $this->db->update('biz_list', $array, array('cust_cd' => $data['cust_cd']));
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
     * @description 주문 회계 수정
     * @param 수정 데이터, 수정 조건
     */
    public function acc_update($data)
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
            'amt'           => $data['total_amt'],
            'tax'           => $data['total_tax'],
            'vat'           => $data['vat'],
            'memo'          => !empty($data['memo']) ? $data['memo'] : '',
            'mod_ikey'      => $this->session->userdata['ikey'],
            'mod_ip'        => $this->input->ip_address(),
            'mod_dt'        => date("Y-m-d H:i:s")
        );
        $this->db->update('ord_acc_list', $result['mod'], $result['var']);
        
        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );
        // 거래처 업데이트
        $this->db->update('biz_list', $array, array('cust_cd' => $data['cust_cd']));
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
