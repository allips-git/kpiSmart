<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 라우팅 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/07/13
 */
class Routing_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 라우팅 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 가용여부
     * @return routing list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT m.ikey, m.local_cd, m.pc_cd, m.pc_nm, m.memo, m.useyn
                    , IFNULL((SELECT COUNT(*) FROM proc_detail WHERE local_cd = m.local_cd AND pc_uc = m.pc_uc), 0) AS proc_cnt #라우팅 공정카운터
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, m.reg_dt
                    , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, m.mod_dt
                    FROM proc_master AS m
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN proc_detail AS d ON (m.local_cd = d.local_cd AND m.pc_uc = d.pc_uc)
                        LEFT JOIN z_plan.user_list AS u1 ON(u1.ikey = m.reg_ikey)
                        LEFT JOIN z_plan.user_list AS u2 ON(u2.ikey = m.mod_ikey)
                    WHERE m.local_cd = ? AND m.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") AND m.useyn LIKE CONCAT("%", ? ,"%")
                    GROUP BY m.local_cd, m.pc_uc
                    ORDER BY m.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content'], (string)$data['useyn']));
        return $query->result();
    }

    /**
     * @description 라우팅 상세 조회
     * @param 공장코드, ikey
     * @return routing detail
     */
    public function get_detail($data)
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
                ORDER BY d.ikey ASC) AS sub
            ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->result();
    }

    /**
     * @description 공정 리스트
     * @param 공장코드, 검색 텍스트
     * @return proc list
     */
    public function get_proc_list($data)
    {
        $sql = 'SELECT p.ikey AS id, p.pp_nm AS `text`
                FROM prod_proc AS p
                WHERE p.local_cd = ? AND p.pp_nm LIKE CONCAT("%", ? ,"%")
                AND p.useyn = "Y" AND p.delyn = "N"
                ORDER BY p.pp_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
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
     * @description 라우팅 등록
     */
    public function insert_batch($reg, $data)
    {
        for ($i=0; $i < count($data['pp_uc']); $i++) 
        {
            // 공정코드 값이 있을경우만 등록
            if (!empty(trim($data['pp_uc'][$i]))) 
            {
                $detail[] = array(
                    'local_cd'      => $data['local_cd'],
                    'pc_uc'         => $data['pc_uc'],
                    'pp_uc'         => trim($data['pp_uc'][$i]),
                    'pr_seq'        => trim($data['pr_seq'][$i]),
                    'memo'          => trim($data['memo'][$i]),
                    'reg_ikey'      => $this->session->userdata['ikey'],
                    'reg_ip'        => $this->input->ip_address()
                );
                // 사용된 공정 sysyn="Y"로 업데이트
                $proc[] = array(
                    'pp_uc'     => trim($data['pp_uc'][$i]),
                    'sysyn'     => 'Y',
                    'mod_ikey'  => $this->session->userdata['ikey'],
                    'mod_ip'    => $this->input->ip_address(),
                    'mod_dt'    => date("Y-m-d H:i:s")
                );
            }
        }
        $this->db->trans_begin();
        $this->db->insert('proc_master', $reg);
        $this->db->insert_batch('proc_detail', $detail);
        $this->db->update_batch('prod_proc', $proc, 'pp_uc');
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
     * @description 라우팅 수정
     */
    public function update_batch($mod, $data, $where)
    {
        for ($i=0; $i < count($data['pp_uc']); $i++) 
        {
            // 공정코드 값이 있을경우만 등록
            if (!empty(trim($data['pp_uc'][$i]))) 
            {
                $detail[] = array(
                    'local_cd'  => $data['local_cd'],
                    'pc_uc'     => $data['pc_uc'],
                    'pp_uc'     => trim($data['pp_uc'][$i]),
                    'pr_seq'    => trim($data['pr_seq'][$i]),
                    'memo'      => trim($data['sub_memo'][$i]),
                    'reg_ikey'  => $this->session->userdata['ikey'],
                    'reg_ip'    => $this->input->ip_address(),
                    'mod_ikey'  => $this->session->userdata['ikey'],
                    'mod_ip'    => $this->input->ip_address(),
                    'mod_dt'    => date("Y-m-d H:i:s")
                ); 
                // 사용된 공정 sysyn="Y"로 업데이트
                $proc[] = array(
                    'pp_uc'     => trim($data['pp_uc'][$i]),
                    'sysyn'     => 'Y',
                    'mod_ikey'  => $this->session->userdata['ikey'],
                    'mod_ip'    => $this->input->ip_address(),
                    'mod_dt'    => date("Y-m-d H:i:s")
                );
            }
        }
        $this->db->trans_begin();
        $this->db->update('proc_master', $mod, $where);
        $this->db->delete('proc_detail', $where);
        $this->db->insert_batch('proc_detail', $detail);
        $this->db->update_batch('prod_proc', $proc, 'pp_uc');
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
