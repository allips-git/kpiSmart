<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 온라인 주문(팝업) 컨트롤러
 * @author 김민주, @version 1.0, @last date
 */
class Ord_li_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 온라인 주문 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 날짜
     * @return ord list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT d.ikey, m.local_cd, m.cust_cd, m.cust_nm, m.biz_nm
                    , m.ord_no, m.ord_dt, m.vat
                    , (
                        CASE m.vat
                            WHEN "N" THEN "과세"
                            WHEN "Y" THEN "면세"
                            WHEN "S" THEN "영세"
                    END) AS vat_text
                    , m.memo, d.ord_seq, d.ord_bseq, d.lot, d.item_cd, d.item_nm
                    , JSON_UNQUOTE(JSON_EXTRACT(d.ord_spec, "$.size")) AS size
                    , JSON_UNQUOTE(JSON_EXTRACT(d.ord_spec, "$.unit")) AS unit
                    , c.code_nm AS unit_nm, d.ord_qty, d.sale_amt, d.ord_amt, d.tax_amt
                    , d.reg_dt, i.wh_uc
                    , IFNULL((SELECT SUM(qty) FROM stock_history 
                              WHERE ord_no = d.ord_no AND lot = d.lot AND details = "002"
                              AND useyn = "Y" AND delyn = "N"), 0) AS out_qty
                    , IFNULL((SELECT SUM(qty) FROM stock_history 
                              WHERE ord_no = d.ord_no AND lot = d.lot AND details = "005"
                              AND useyn = "Y" AND delyn = "N"), 0) AS re_qty
                    FROM ord_master AS m
                    INNER JOIN (SELECT @rownum := 0) r
                    INNER JOIN ord_detail AS d ON (m.local_cd = d.local_cd AND m.ord_no = d.ord_no)
                    INNER JOIN item_list AS i ON (d.local_cd = i.local_cd AND d.item_cd = i.item_cd)
                    INNER JOIN z_plan.common_code AS c 
                        ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(d.ord_spec, "$.unit")) = c.code_sub) # 공통코드 - 단위
                    WHERE m.local_cd = ? AND m.state >= "002" AND m.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") 
                        AND (m.ord_dt >= "'.$data['start_dt'].'" AND m.ord_dt <= "'.$data['end_dt'].'")
                    GROUP BY m.ord_no, d.ord_seq, d.ord_bseq
                    ORDER BY m.ord_dt ASC, d.ord_seq ASC, d.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

}
