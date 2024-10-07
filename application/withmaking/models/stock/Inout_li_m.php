<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 입/출고 이력 조회 모델
 * @author 김민주, @version 1.0, @last date 2022/06/10
 * @author 김민주, @version 1.1, @last date 2022/07/22 - 재고DB 리뉴얼
 */
class Inout_li_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 입/출고 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return stock history list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT s.ikey, s.local_cd, s.job_sq, s.put_dt
                    , (
                        CASE s.`work`
                            WHEN "IN" THEN "입고"
                            WHEN "OUT" THEN "출고"
                        END
                    ) AS `work`, c1.code_nm AS details_nm
                    , (
                        CASE s.details
                            WHEN "001" THEN bm.cust_nm
                            WHEN "002" THEN om.cust_nm
                            WHEN "003" THEN "생산입고"
                            WHEN "004" THEN "생산출고"
                            WHEN "005" THEN om.cust_nm
                            WHEN "006" THEN bm.cust_nm
                            WHEN "007" THEN "기초재고"
                            WHEN "008" THEN "불량수량"
                        END
                    ) AS cust_nm
                    , s.details, s.item_cd, i.item_nm, t.barcode
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.size")) AS size
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) AS unit, c2.code_nm AS unit_nm
                    , s.qty, s.amt, s.tax, t.wh_uc, w.wh_nm
                    , (SELECT CONCAT(ul_nm, "(", id, ")") FROM z_plan.user_list WHERE local_cd = s.local_cd AND ikey = s.reg_ikey) AS reg_nm, s.reg_dt
                    FROM stock_history AS s
                    INNER JOIN (SELECT @rownum := 0) r
                    INNER JOIN stock AS t ON (s.local_cd = t.local_cd AND s.st_sq = t.st_sq)
                    INNER JOIN item_list AS i ON (s.local_cd = i.local_cd AND s.item_cd = i.item_cd)
                    INNER JOIN warehouse AS w ON (t.local_cd = w.local_cd AND t.wh_uc = w.wh_uc)
                    INNER JOIN z_plan.common_code AS c1 ON (c1.code_gb ="WK" AND c1.code_main = "030" AND s.details = c1.code_sub)
                    LEFT JOIN z_plan.common_code AS c2 ON (c2.code_gb ="BA" AND c2.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) = c2.code_sub)
                    LEFT JOIN buy_master AS bm ON (s.local_cd = bm.local_cd AND s.ord_no = bm.ord_no)
                    LEFT JOIN ord_master AS om ON (s.local_cd = om.local_cd AND s.ord_no = om.ord_no)
                    WHERE s.local_cd = ? AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") AND s.useyn = "Y" AND s.delyn = "N"
                    AND s.put_dt BETWEEN "'.$data['start_dt'].'" AND "'.$data['end_dt'].'"
                    AND t.wh_uc LIKE CONCAT("%", ? ,"%") AND s.details LIKE CONCAT("%", ? ,"%")
                GROUP BY s.local_cd, s.job_sq
                ORDER BY s.put_dt ASC, s.ikey ASC) AS sub
            ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content'], (string)$data['wh_uc'], (string)$data['details']));
        return $query->result();
    }
}