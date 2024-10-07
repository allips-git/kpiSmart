<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 작업 현황 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/08/12
 */
class Work_his_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 생산 작업 현황 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return work history list
     */
    public function get_list($data)
    {
        $sql   = 'SET @start_dt := ?, @end_dt := ?';
        $query = $this->db->query($sql, array((string)$data['start_dt'], (string)$data['end_dt']));
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT m.ikey, m.local_cd, m.item_cd, m.item_nm, i.size, i.unit
                    , p.pp_cd, gb.code_nm AS pp_gb_nm, p.pp_nm, d.ul_nm
                    , SUM(d.plan_time) AS total_time, SUM(d.plan_num) AS total_num, d.job_st, d.start_dt, d.end_dt, SUM(d.plan_cnt) AS total_cnt
                    , IFNULL((SELECT SUM(qty) FROM work_history WHERE local_cd = d.local_cd AND pp_uc = d.pp_uc), 0) AS work_cnt
                    FROM job_master AS m
                    INNER JOIN (SELECT @rownum := 0) r
                    INNER JOIN job_detail AS d ON (m.local_cd = d.local_cd AND m.job_no = d.job_no)
                    INNER JOIN prod_proc AS p ON (d.local_cd = p.local_cd AND d.pp_uc = p.pp_uc)
                    INNER JOIN item_list AS i ON (m.local_cd = i.local_cd AND m.item_cd = i.item_cd)
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb ="BA" AND c.code_main = "060" AND i.unit = c.code_sub)        # 공통코드 - 단위
                    INNER JOIN z_plan.common_code AS gb ON (gb.code_gb ="PR" AND gb.code_main = "040" AND p.pp_gb = gb.code_sub)   # 공정 유형
                    WHERE m.local_cd = ? AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%")
                    AND m.useyn = "Y" AND m.delyn = "N" AND m.job_dt BETWEEN @start_dt AND @end_dt AND d.pp_hisyn = "Y"
                    GROUP BY d.pp_uc
                ORDER BY m.job_dt ASC, d.ikey ASC, d.reg_dt ASC) AS sub
            ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

}