<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 작업장(WorkPlace) 관리 모델
 * @author 안성준, @version 1.0, @last date 2022/05/13
 */ 
class W_place_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
        $this->encrypt_key = $this->config->item('encrypt_key');
    }

    /**
     * @description 작업장 코드 생성
     * @param 공장코드
     * @return wp_cd
     */
    public function get_code($data)
    {
        $sql = 'SELECT CONCAT("WP", SUBSTRING_INDEX(w.wp_cd, "WP", -1)+10) AS wp_cd
                FROM work_place AS w
                WHERE w.local_cd = ? 
                ORDER BY length(w.wp_cd) DESC, w.wp_cd DESC LIMIT 1';
        $query = $this->db->query($sql, array((string)$data['local_cd']));
        return $query->row();
    }

    /**
     * @description 작업장리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 작업장유형, 가용여부
     * @return Workplace list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT w.ikey, w.local_cd, w.wp_cd, w.wp_nm
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, w.reg_dt
                    , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, w.mod_dt
                    , w.useyn
                    FROM work_place AS w
                        INNER JOIN (SELECT @rownum := 0) r                       
                        INNER JOIN z_plan.user_list u1 ON (u1.ikey = w.reg_ikey)
                        LEFT JOIN z_plan.user_list u2 ON (u2.ikey = w.mod_ikey)
                    WHERE w.local_cd = ? AND w.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") 
                        AND w.useyn LIKE CONCAT("%", ? ,"%")
                    ORDER BY w.reg_dt ASC) AS sub
                ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data["content"], (string)$data["useyn"]));
        return $query->result();
    }

    /**
     * @description 작업장 상세 조회
     * @param 공장코드, 작업장ikey
     * @return Warehouse detail
     */
    public function get_detail($data)
    {
        $sql   = 'SET @encrypt_key := ?';
        $query = $this->db->query($sql, array((string)$this->encrypt_key));
        $sql = 'SELECT w.ikey, w.local_cd, w.useyn, w.wp_nm
                , CONVERT(AES_DECRYPT(UNHEX(w.person), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS person
                , CONVERT(AES_DECRYPT(UNHEX(w.tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS tel
                , CONVERT(AES_DECRYPT(UNHEX(w.post_code), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS post_code
                , CONVERT(AES_DECRYPT(UNHEX(w.addr), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS addr
                , CONVERT(AES_DECRYPT(UNHEX(w.addr_detail), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS addr_detail
                , w.memo
                FROM work_place AS w
                WHERE w.local_cd = ? AND w.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

}
