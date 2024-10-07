<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 창고(Warehouse) 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/05/11
 */ 
class W_house_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
        $this->encrypt_key = $this->config->item('encrypt_key');
    }

    /**
     * @description 창고 코드 생성
     * @param 공장코드
     * @return wh_cd
     */
    public function get_code($data)
    {
        $sql = 'SELECT CONCAT("WH", SUBSTRING_INDEX(w.wh_cd, "WH", -1)+10) AS wh_cd
                FROM warehouse AS w
                WHERE w.local_cd = ? 
                ORDER BY length(w.wh_cd) DESC, w.wh_cd DESC LIMIT 1';
        $query = $this->db->query($sql, array((string)$data['local_cd']));
        return $query->row();
    }

    /**
     * @description 창고리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 창고유형, 가용여부
     * @return Warehouse list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT w.ikey, w.local_cd, w.wh_cd, w.wh_nm, c.code_nm
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, w.reg_dt
                    , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, w.mod_dt
                    , w.useyn
                    FROM warehouse AS w
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN z_plan.common_code AS c ON (c.code_gb = "BA" AND c.code_main = "110" AND c.code_sub = w.wh_gb) # 창고유형
                        INNER JOIN z_plan.user_list u1 ON (u1.ikey = w.reg_ikey)
                        LEFT JOIN z_plan.user_list u2 ON (u2.ikey = w.mod_ikey)
                    WHERE w.local_cd = ? AND w.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") 
                        AND w.wh_gb LIKE CONCAT("%", ? ,"%") AND w.useyn LIKE CONCAT("%", ? ,"%")
                    ORDER BY w.reg_dt ASC) AS sub
                ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data["content"], (string)$data["wh_gb"], (string)$data["useyn"]));
        return $query->result();
    }

    /**
     * @description 창고 상세 조회
     * @param 공장코드, 창고ikey
     * @return Warehouse detail
     */
    public function get_detail($data)
    {
        $sql   = 'SET @encrypt_key := ?';
        $query = $this->db->query($sql, array((string)$this->encrypt_key));
        $sql = 'SELECT w.ikey, w.local_cd, w.useyn, w.wh_gb, w.wh_nm
                , CONVERT(AES_DECRYPT(UNHEX(w.person), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS person
                , CONVERT(AES_DECRYPT(UNHEX(w.tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS tel
                , CONVERT(AES_DECRYPT(UNHEX(w.post_code), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS post_code
                , CONVERT(AES_DECRYPT(UNHEX(w.addr), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS addr
                , CONVERT(AES_DECRYPT(UNHEX(w.addr_detail), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS addr_detail
                , w.memo
                FROM warehouse AS w
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb = "BA" AND c.code_main = "110" AND c.code_sub = w.wh_gb) # 창고유형
                WHERE w.local_cd = ? AND w.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

}
