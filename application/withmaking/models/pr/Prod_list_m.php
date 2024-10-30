<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 생산 작업 현황 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/08/12
 */
class Prod_list_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 생산 작업 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return prod list
     */
    public function get_list($data)
    {
        $sql = 'SET @start_dt := ?, @end_dt := ?';
        $this->db->query($sql, array((string)$data['start_dt'], (string)$data['end_dt']));
    
        $allowedKeywords = ['item_nm', 'job_dt', 'state']; // 예상 가능한 열 이름 목록
        $searchCondition = '';
        if (!empty($data['keyword']) && in_array($data['keyword'], $allowedKeywords) && !empty($data['content'])) {
            $searchCondition = "AND m." . $this->db->escape_str($data['keyword']) . " LIKE CONCAT('%', ?, '%') ";
        }
    
        $sql = 'SELECT @rownum := @rownum+1 AS rownum, sub.* FROM (
                SELECT m.ikey, m.local_cd, m.job_dt, m.item_cd, m.item_nm, m.state, gb.code_nm AS pp_gb_nm, d.pp_nm, m.job_qty
                , d.pp_hisyn, d.plan_cnt, d.plan_time, d.plan_num, d.ul_nm, d.job_st, d.start_dt, d.end_dt
                , IFNULL((SELECT SUM(qty) FROM work_history WHERE local_cd = d.local_cd AND job_no = d.job_no AND lot = d.lot), 0) AS work_cnt
                FROM job_master AS m
                INNER JOIN (SELECT @rownum := 0) r
                INNER JOIN job_detail AS d ON (m.local_cd = d.local_cd AND m.job_no = d.job_no)
                INNER JOIN prod_proc AS p ON (d.local_cd = p.local_cd AND d.pp_uc = p.pp_uc)
                INNER JOIN z_plan.common_code AS gb ON (gb.code_gb ="PR" AND gb.code_main = "040" AND p.pp_gb = gb.code_sub)
                WHERE m.local_cd = ? AND m.useyn = "Y" AND m.delyn = "N" AND m.job_dt BETWEEN @start_dt AND @end_dt ' . $searchCondition . '
                ORDER BY m.job_dt ASC, d.ikey ASC, d.reg_dt ASC
            ) AS sub 
            ORDER BY rownum DESC';
    
        $queryParameters = [(string)$data['local_cd']];
        if (!empty($data['content'])) {
            $queryParameters[] = (string)$data['content'];
        }
    
        $query = $this->db->query($sql, $queryParameters);
        return $query->result();
    }

    public function get_print_list($data)
    {
        $sql = 'SET @start_dt := ?, @end_dt := ?';
        $this->db->query($sql, array((string)$data['start_dt'], (string)$data['end_dt']));
    
        $allowedKeywords = ['item_nm', 'job_dt', 'state']; // 예상 가능한 열 이름 목록
        $searchCondition = '';
        if (!empty($data['keyword']) && in_array($data['keyword'], $allowedKeywords) && !empty($data['content'])) {
            $searchCondition = "AND m." . $this->db->escape_str($data['keyword']) . " LIKE CONCAT('%', ?, '%') ";
        }
    
        $sql = 'SELECT @rownum := @rownum+1 AS rownum, sub.* FROM (
                SELECT m.ikey, m.local_cd, m.job_dt, m.item_cd, m.item_nm, m.state, m.job_no
                , d.pp_nm, d.pp_hisyn, d.plan_cnt, d.plan_time, d.plan_num, d.ul_nm, d.job_st
                , d.start_dt, d.end_dt, d.lot, d.pp_uc, m.job_qty, m.workTime, pm.pc_nm
                , IFNULL((SELECT SUM(qty) FROM work_history WHERE local_cd = d.local_cd AND job_no = d.job_no AND lot = d.lot), 0) AS work_cnt
                , IFNULL((SELECT SUM(flaw_qty) FROM work_history WHERE local_cd = d.local_cd AND job_no = d.job_no AND lot = d.lot), 0) AS flaw_cnt
                FROM job_master AS m
                INNER JOIN (SELECT @rownum := 0) r
                INNER JOIN job_detail AS d ON (m.local_cd = d.local_cd AND m.job_no = d.job_no)
                INNER JOIN prod_proc AS p ON (d.local_cd = p.local_cd AND d.pp_uc = p.pp_uc)
                INNER JOIN proc_master AS pm ON (p.local_cd = pm.local_cd AND d.pc_uc = pm.pc_uc)
                WHERE m.local_cd = ? AND m.useyn = "Y" AND m.delyn = "N" AND m.state != "001" AND m.job_dt BETWEEN @start_dt AND @end_dt ' . $searchCondition . '
                ORDER BY m.job_dt ASC, d.ikey ASC, d.reg_dt ASC
            ) AS sub 
            ORDER BY rownum DESC';
    
        $queryParameters = [(string)$data['local_cd']];
        if (!empty($data['content'])) {
            $queryParameters[] = (string)$data['content'];
        }
    
        $query = $this->db->query($sql, $queryParameters);
        return $query->result();
    }

}