<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 공정 등록(Prod_proc) 관리 모델
 * @author 안성준, @version 1.0, @last date 2022/05/24
 */ 
class Prod_proc_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
        $this->encrypt_key = $this->config->item('encrypt_key');
    }

    /**
     * @description 공정 등록 코드 생성
     * @param 공장코드
     * @return wp_cd
     */
    public function get_code($data)
    {
        $sql = 'SELECT CONCAT("PP", SUBSTRING_INDEX(p.pp_cd, "PP", -1)+10) AS pp_cd
                FROM prod_proc AS p
                WHERE p.local_cd = ? 
                ORDER BY length(p.pp_cd) DESC, p.pp_cd DESC LIMIT 1';
        $query = $this->db->query($sql, array((string)$data['local_cd']));
        return $query->row();
    }

    /**
     * @description 공정 등록 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 작업장유형, 가용여부
     * @return Prod_proc list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT p.ikey, p.local_cd, p.pp_cd, p.pp_nm, p.pp_gb, p.memo, c.code_nm
                        ,CASE p.pp_hisyn
                            WHEN "Y" THEN "사용" ELSE "미사용" 
                            END AS "pp_hisyn"
                        ,CASE p.pp_qa
                            WHEN "Y" THEN "사용" ELSE "미사용" 
                            END AS "pp_qa"    
                        , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, p.reg_dt
                        , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, p.mod_dt
                        , p.useyn
                        FROM prod_proc AS p
                            INNER JOIN (SELECT @rownum := 0) r
                            INNER JOIN z_plan.common_code AS c ON (c.code_gb = "PR" AND c.code_main = "040" AND c.code_sub = p.pp_gb) 
                            INNER JOIN z_plan.user_list u1 ON (u1.ikey = p.reg_ikey)
                            LEFT JOIN z_plan.user_list u2 ON (u2.ikey = p.mod_ikey)
                        WHERE p.local_cd = ? AND p.delyn = "N"
                            AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") 
                            AND p.useyn LIKE CONCAT("%", ? ,"%")
                            AND p.pp_gb LIKE CONCAT("%", ? ,"%")
                        ORDER BY p.reg_dt ASC) AS sub
                    ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data["content"], (string)$data["useyn"], (string)$data['pp_gb']));
        return $query->result();
    }

    /**
     * @description 공정 등록 상세 조회
     * @param 공장코드, 작업장ikey
     * @return Prod_proc detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT p.ikey, p.local_cd, p.useyn, p.pp_nm, p.memo, p.pp_hisyn, p.pp_qa, p.pp_gb
                FROM prod_proc AS p
                WHERE p.local_cd = ? AND p.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

    /**
     * @description 비가동 유형 등록 리스트
     * @param 공장코드
     * @return Not_used list
     */
    public function get_nu_list($data)
    {
        $sql = 'SELECT * 
                FROM not_used 
                WHERE local_cd = ?
                ORDER BY nu_nm ASC';
        $query = $this->db->query($sql, array((string)$data["local_cd"]));
        return $query->result();
    }

    /**
     * @description 비가동 유형 등록 상세 조회
     * @param 공장코드, 작업장ikey
     * @return Prod_proc detail
     */
    public function get_nu_detail($data)
    {
        $sql = 'SELECT n.ikey, n.local_cd, n.useyn, n.nu_nm
                FROM not_used AS n
                WHERE n.local_cd = ? AND n.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

    /**
     * @description 불량 유형 등록 리스트
     * @param 공장코드
     * @return Not_used list
     */
    public function get_fl_list($data)
    {
        $sql = 'SELECT * 
                FROM flaw 
                WHERE local_cd = ?
                ORDER BY fl_nm ASC';
        $query = $this->db->query($sql, array((string)$data["local_cd"]));
        return $query->result();
    }

    /**
     * @description 불량 유형 등록 상세 조회
     * @param 공장코드, 작업장ikey
     * @return Prod_proc detail
     */
    public function get_fl_detail($data)
    {
        $sql = 'SELECT f.ikey, f.local_cd, f.useyn, f.fl_nm
                FROM flaw AS f
                WHERE f.local_cd = ? AND f.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

}
