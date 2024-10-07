<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 완제품 재고 조회 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/07/22
 */
class Prod_st_m extends CI_Model {

    protected $table = 'item_list';
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 완제품 재고 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 창고 구분, 제품 유형
     * @return stock list
     */
    public function get_list($data)
    {
         $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT s.ikey, s.item_cd, i.item_gb, gb.code_nm AS item_gb_nm, i.item_nm
                    , i.size, i.unit, c.code_nm AS unit_nm, s.max_dt
                    , IFNULL(s.stock_amt+s.tax_amt, 0) AS total_amt, s.vat
                    , s.base_qty, i.safe_qty, s.in_qty, s.out_qty, s.pr_in_qty, s.re_in_qty, s.re_out_qty, s.flaw_qty, s.qty
                    , IFNULL((SELECT SUM(qty) FROM stock WHERE local_cd = i.local_cd AND item_cd = i.item_cd), 0) AS total_qty
                    , w.wh_uc, w.wh_nm
                    FROM stock AS s
                    INNER JOIN (SELECT @rownum := 0) r
                    INNER JOIN item_list AS i ON (s.local_cd = i.local_cd AND s.item_cd = i.item_cd)
                    INNER JOIN warehouse AS w ON (s.local_cd = w.local_cd AND s.wh_uc = w.wh_uc)
                    INNER JOIN z_plan.common_code AS gb ON (gb.code_gb ="BA" AND gb.code_main = "080" AND i.item_gb = gb.code_sub)  # 품목 유형
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb ="BA" AND c.code_main = "060" AND i.unit = c.code_sub)         # 공통코드 - 단위
                    WHERE s.local_cd = ?  AND i.item_gb IN ("001", "002", "003") AND (s.qty > 0 OR s.qty < 0)
                    AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") AND s.wh_uc LIKE CONCAT("%", ? ,"%")
                    AND i.item_gb LIKE CONCAT("%", ? ,"%")
                    ORDER BY s.max_dt ASC, total_amt ASC, i.item_nm ASC) AS sub';
                    if($data['safe_gb'] == "up") // 안전재고 조회 조건
                    {
                        $sql .= ' WHERE sub.safe_qty <= sub.qty';
                    } 
                    else if($data['safe_gb'] == "down")
                    {
                        $sql .= ' WHERE sub.safe_qty > sub.qty';
                    }
                    $sql .= ' ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content'], (string)$data['wh_uc'], (string)$data['item_gb']));
        return $query->result();
    }

    /**
     * @description 제품별 재고 리스트
     * @param 공장코드, 제품코드
     * @return stock list
     */
    public function get_stock_list($data)
    {
         $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT s.ikey, s.local_cd, s.st_sq, s.item_cd, i.item_nm, s.barcode, i.size, i.unit, c.code_nm AS unit_nm, s.max_dt
                    , s.base_qty, i.safe_qty, s.in_qty, s.out_qty, s.re_in_qty, s.re_out_qty, s.qty
                    , w.wh_uc, w.wh_nm, IFNULL(s.stock_amt+s.tax_amt, 0) AS total_amt
                    FROM stock AS s
                    INNER JOIN (SELECT @rownum := 0) r
                    INNER JOIN item_list AS i ON (s.local_cd = i.local_cd AND s.item_cd = i.item_cd)
                    INNER JOIN warehouse AS w ON (s.local_cd = w.local_cd AND s.wh_uc = w.wh_uc)
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb ="BA" AND c.code_main = "060" AND i.unit = c.code_sub)         # 공통코드 - 단위
                    WHERE s.local_cd = ?  AND s.item_cd  = ? # AND s.qty > 0
                    ORDER BY s.max_dt ASC) AS sub
                ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['item_cd']));
        return $query->result();
    }
}
