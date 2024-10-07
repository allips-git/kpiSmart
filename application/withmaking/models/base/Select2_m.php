<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description Select2 lib 전용 조회/상세조회 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/08/05
 */
class Select2_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 제품/품목 리스트
     * @param 공장코드, 검색 텍스트
     * @return item list
     */
    public function get_item_list($data)
    {
        $sql = 'SELECT i.item_cd AS id, i.item_nm AS `text`
                FROM item_list AS i
                WHERE i.local_cd = ? AND i.item_nm LIKE CONCAT("%", ? ,"%")
                AND i.useyn = "Y" AND i.delyn = "N"
                ORDER BY i.item_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 제품/품목 상세 조회
     * @param 공장코드, 제품코드
     * @return item detail
     */
    public function get_item_detail($data)
    {
        $sql = 'SELECT i.ikey, i.local_cd, i.main_cd, i.pd_cd, i.item_cd, i.proc_gb, i.item_gb, c.code_nm AS item_gb_nm
                , i.item_lv, i.item_nm, i.size, i.unit, cc.code_nm AS unit_nm
                , i.min_size, i.unit_amt, i.sale_amt, i.unit_amt_1, i.unit_amt_2, i.unit_amt_3, i.unit_amt_4, i.unit_amt_5
                , i.wh_uc, i.safe_qty, i.memo, i.useyn, i.delyn
                FROM item_list AS i
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb = "BA" AND c.code_main = "080" AND c.code_sub = i.item_gb) # 제품유형
                    INNER JOIN z_plan.common_code AS cc ON (cc.code_gb ="BA" AND cc.code_main = "060" AND i.unit = cc.code_sub) # 공통코드 - 단위
                WHERE i.local_cd = ? AND i.item_cd = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['item_cd']));
        return $query->row();
    }

    /**
     * @description 거래처별 제품 상세 조회
     * @param 공장코드, 거래처코드, 제품코드
     * @return item detail
     */
    public function get_client_item($data)
    {
        $sql = 'SELECT i.ikey, i.local_cd, i.pd_cd, i.item_cd, i.proc_gb, i.item_gb, c.code_nm AS item_gb_nm
                , i.item_lv, i.item_nm, i.size, i.unit, cc.code_nm AS unit_nm
                , i.min_size, i.unit_amt, i.sale_amt, i.unit_amt_1, i.unit_amt_2, i.unit_amt_3, i.unit_amt_4, i.unit_amt_5
                , (SELECT CASE
                        WHEN cust_grade = "amt1"  AND i.sale_amt > 0  THEN i.sale_amt
                        WHEN cust_grade = "amt2"  AND i.unit_amt_1 > 0  THEN i.unit_amt_1
                        WHEN cust_grade = "amt3"  AND i.unit_amt_2 > 0  THEN i.unit_amt_2
                        WHEN cust_grade = "amt4"  AND i.unit_amt_3 > 0  THEN i.unit_amt_3
                        WHEN cust_grade = "amt5"  AND i.unit_amt_4 > 0  THEN i.unit_amt_4
                        ELSE i.sale_amt
                        END
                    FROM biz_list WHERE local_cd = i.local_cd AND cust_cd = ?) AS base_amt
                , i.wh_uc, i.safe_qty, i.memo, i.useyn, i.delyn
                FROM item_list AS i
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb = "BA" AND c.code_main = "080" AND c.code_sub = i.item_gb) # 제품유형
                    INNER JOIN z_plan.common_code AS cc ON (cc.code_gb ="BA" AND cc.code_main = "060" AND i.unit = cc.code_sub) # 공통코드 - 단위
                WHERE i.local_cd = ? AND i.item_cd = ?';
        $query = $this->db->query($sql, array((string)$data['cust_cd'], (string)$data['local_cd'], (string)$data['item_cd']));
        return $query->row();
    }

    /**
     * @description 매출제품 리스트(상품 제외)
     * @param 공장코드, 검색 텍스트
     * @return item list
     */
    public function get_sale_list($data)
    {
        $sql = 'SELECT i.item_cd AS id, i.item_nm AS `text`
                FROM item_list AS i
                WHERE i.local_cd = ? AND i.item_gb IN ("001", "003") AND i.item_nm LIKE CONCAT("%", ? ,"%")
                AND i.useyn = "Y" AND i.delyn = "N"
                ORDER BY i.item_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 매출제품 리스트(상품 포함)
     * @param 공장코드, 검색 텍스트
     * @return item list
     */
    public function get_all_sale_list($data)
    {
        $sql = 'SELECT i.item_cd AS id, i.item_nm AS `text`
                FROM item_list AS i
                WHERE i.local_cd = ? AND i.item_gb IN ("001", "002", "003") AND i.item_nm LIKE CONCAT("%", ? ,"%")
                AND i.useyn = "Y" AND i.delyn = "N"
                ORDER BY i.item_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 매출거래처 전체 리스트
     * @param 공장코드, 검색 텍스트
     * @return Client list
     */
    public function get_biz_list($data)
    {
        $sql = 'SELECT b.ikey AS id, b.cust_nm AS `text`
                FROM biz_list AS b
                WHERE b.local_cd = ? AND b.cust_gb IN ("001", "003") AND b.cust_nm LIKE CONCAT("%", ? ,"%")
                AND b.useyn = "Y" AND b.delyn = "N"
                ORDER BY b.cust_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 매입거래처 전체 리스트
     * @param 공장코드, 검색 텍스트
     * @return Client list
     */
    public function get_buyer($data)
    {
        $sql = 'SELECT b.ikey AS id, b.cust_nm AS `text`
                FROM biz_list AS b
                WHERE b.local_cd = ? AND b.cust_gb IN ("002", "003") AND b.cust_nm LIKE CONCAT("%", ? ,"%")
                AND b.useyn = "Y" AND b.delyn = "N"
                ORDER BY b.cust_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 라우팅 리스트
     * @param 공장코드, 검색 텍스트
     * @return routing list
     */
    public function get_routing_list($data)
    {
        $sql = 'SELECT m.ikey AS id, m.pc_nm AS `text`
                FROM proc_master AS m
                WHERE m.local_cd = ? AND m.pc_nm LIKE CONCAT("%", ? ,"%")
                AND m.useyn = "Y" AND m.delyn = "N"
                ORDER BY m.pc_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 라우팅 상세 조회
     * @param 공장코드, ikey
     * @return routing detail
     */
    public function get_routing_detail($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT m.ikey, d.ikey AS sub_ikey, m.local_cd, m.pc_uc, m.pc_nm, p.pp_cd, p.pp_nm, d.pp_uc, d.pr_seq, p.pp_gb, c.code_nm
                    , (
                        CASE p.pp_hisyn 
                            WHEN "Y" THEN "사용"
                            WHEN "N" THEN "사용안함"
                        END) AS pp_hisyn
                    , m.memo, d.memo AS sub_memo, m.sysyn, m.useyn, d.useyn AS sub_useyn
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, m.reg_dt
                    , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, m.mod_dt
                    FROM proc_master AS m
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN proc_detail AS d ON (m.local_cd = d.local_cd AND m.pc_uc = d.pc_uc)
                        LEFT JOIN prod_proc AS p ON (m.local_cd = d.local_cd AND d.pp_uc = p.pp_uc)
                        INNER JOIN z_plan.common_code AS c ON (c.code_gb ="PR" AND c.code_main = "040" AND p.pp_gb = c.code_sub) # 공정유형
                        LEFT JOIN z_plan.user_list AS u1 ON(u1.ikey = m.reg_ikey)
                        LEFT JOIN z_plan.user_list AS u2 ON(u2.ikey = m.mod_ikey)
                WHERE m.local_cd = ? AND m.ikey = ?
                ORDER BY d.pr_seq ASC, p.pp_nm ASC) AS sub
            ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->result();
    }

    /**
     * @description 공정 리스트
     * @param 공장코드, 라우팅 코드, 검색 텍스트
     * @return proc list
     */
    public function get_proc_list($data)
    {
        $sql = 'SELECT p.ikey AS id, p.pp_nm AS `text`
                FROM proc_detail AS d
                INNER JOIN prod_proc AS p ON (d.local_cd = p.local_cd AND d.pp_uc = p.pp_uc)
                WHERE d.local_cd = ? AND d.pc_uc = ? AND p.pp_nm LIKE CONCAT("%", ? ,"%")
                AND d.useyn = "Y" AND d.delyn = "N"
                GROUP BY p.ikey
                ORDER BY p.pp_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['pc_uc'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 공정 상세 조회
     * @param 공장코드, ikey
     * @return proc detail
     */
    public function get_proc_detail($data)
    {
        $sql = 'SELECT p.ikey, p.pp_uc, p.pp_cd, p.pp_nm, p.pp_hisyn
                , (
                    CASE p.pp_hisyn 
                        WHEN "Y" THEN "사용"
                        WHEN "N" THEN "사용안함"
                    END) AS pp_hisnm
                , p.pp_gb, c.code_nm
                FROM prod_proc AS p
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb ="PR" AND c.code_main = "040" AND p.pp_gb = c.code_sub) # 공정유형
                WHERE p.local_cd = ?  AND p.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

    /**
     * @description 원/부자재 리스트 - 개발 일정상 반제품은 제외
     * @param 공장코드, 검색 텍스트
     * @return item list
     */
    public function get_buy_list($data)
    {
        $sql = 'SELECT i.ikey AS id, i.item_nm AS `text`
                FROM item_list AS i
                WHERE i.local_cd = ? AND i.item_gb IN ("004", "005", "006") AND i.item_nm LIKE CONCAT("%", ? ,"%")
                AND i.useyn = "Y" AND i.delyn = "N"
                ORDER BY i.item_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 원/부자재 상세 조회
     * @param 공장코드, ikey
     * @return item detail
     */
    public function get_buy_detail($data)
    {
        $sql = 'SELECT i.ikey, i.local_cd, i.pd_cd, i.item_cd, i.proc_gb, i.item_gb, c.code_nm AS item_gb_nm
                , i.item_lv, i.item_nm, i.size, i.unit, cc.code_nm AS unit_nm
                , i.min_size, i.unit_amt, i.sale_amt, i.unit_amt_1, i.unit_amt_2, i.unit_amt_3, i.unit_amt_4, i.unit_amt_5
                , i.wh_uc, i.safe_qty, i.memo, i.useyn, i.delyn
                FROM item_list AS i
                    INNER JOIN item_code AS c ON (c.ikey = i.item_lv)
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb = "BA" AND c.code_main = "080" AND c.code_sub = i.item_gb) # 제품유형
                    INNER JOIN z_plan.common_code AS cc ON (cc.code_gb ="BA" AND cc.code_main = "060" AND i.unit = cc.code_sub) # 공통코드 - 단위
                WHERE i.local_cd = ? AND i.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

}
