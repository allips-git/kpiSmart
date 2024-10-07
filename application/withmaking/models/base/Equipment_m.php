<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 장비 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/10/18
 */ 
class Equipment_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 장비 코드 생성
     * @param 공장코드
     * @return eq_cd
     */
    public function get_code($data)
    {
        $sql = 'SELECT CONCAT("EQ", SUBSTRING_INDEX(e.eq_cd, "EQ", -1)+10) AS eq_cd
                FROM equipment AS e
                WHERE e.local_cd = ? 
                ORDER BY length(e.eq_cd) DESC, e.eq_cd DESC LIMIT 1';
        $query = $this->db->query($sql, array((string)$data['local_cd']));
        return $query->row();
    }

    /**
     * @description 장비리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 장비유형, 가용여부
     * @return list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT e.ikey, e.local_cd, e.eq_nm, e.buy_corp, e.buy_tel, e.useyn, e.print_yn
                    , IFNULL(e.buy_dt, "") AS buy_dt
                    FROM equipment AS e
                        INNER JOIN (SELECT @rownum := 0) r
                    WHERE e.local_cd = ? AND e.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") AND e.useyn LIKE CONCAT("%", ? ,"%")
                    ORDER BY e.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data["content"], (string)$data["useyn"]));
        return $query->result();
    }

    /**
     * @description 장비 상세 조회
     * @param 공장코드, 장비ikey
     * @return detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT e.ikey, e.local_cd, e.eq_nm, e.buy_corp, e.buy_tel
                , IFNULL(e.buy_dt, "") AS buy_dt, e.memo
                FROM equipment AS e
                WHERE e.local_cd = ? AND e.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

    /**
     * @description 바코드 출력 후 업데이트 - update
     */
    public function barcode_update($data)
    {
        $this->db->trans_begin();
        for ($i=0; $i < count($data['ikey']); $i++) 
        {
            // ikey 값이 있을경우만 수정
            if (!empty(trim($data['ikey'][$i]))) 
            {
                // update info
                $array[] = array(
                    'ikey'   => trim($data['ikey'][$i]),
                    'print_yn'  => 'Y',
                    'mod_ikey'  => $this->session->userdata['ikey'],
                    'mod_ip'    => $this->input->ip_address(),
                    'mod_dt'    => date("Y-m-d H:i:s")
                );
            }
        }
        $this->db->update_batch('equipment', $array, 'ikey');
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
