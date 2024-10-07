<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 출고 실적 현황 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/08/04
 */
class Out_his_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 출고 실적 현황 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return history list
     */
    public function get_list($data)
    {
        $sql   = 'SET @start_dt := ?, @end_dt := ?';
        $query = $this->db->query($sql, array((string)$data['start_dt'], (string)$data['end_dt']));
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT s.ikey, s.local_cd, s.put_dt, s.item_cd, i.item_nm, i.item_gb, gb.code_nm AS item_gb_nm
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.size")) AS size
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) AS unit, c.code_nm AS unit_nm                   
                    , IFNULL((
                        SELECT SUM(qty) 
                        FROM stock_history 
                        WHERE item_cd = s.item_cd AND `work` = "OUT" AND details = "002" 
                        AND useyn = "Y" AND delyn = "N" AND put_dt BETWEEN @start_dt AND @end_dt
                    ), 0) AS work_qty                   
                    , IFNULL((
                        SELECT SUM(qty) 
                        FROM stock_history 
                        WHERE item_cd = s.item_cd AND `work` = "IN" AND details = "005" 
                        AND useyn = "Y" AND delyn = "N" AND put_dt BETWEEN @start_dt AND @end_dt
                    ), 0) AS re_qty
                    FROM stock_history AS s
                    INNER JOIN (SELECT @rownum := 0) r
                    INNER JOIN item_list AS i ON (s.local_cd = i.local_cd AND s.item_cd = i.item_cd)
                    INNER JOIN z_plan.common_code AS c 
                        ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) = c.code_sub) # 공통코드 - 단위
                    INNER JOIN z_plan.common_code AS gb ON (gb.code_gb ="BA" AND gb.code_main = "080" AND i.item_gb = gb.code_sub) # 제품 유형
                    WHERE s.local_cd = ? AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") AND s.`work` = "OUT" AND s.details = "002"
                    AND s.put_dt BETWEEN @start_dt AND @end_dt
                    GROUP BY s.item_cd
                ORDER BY i.item_nm ASC) AS sub
            ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

}