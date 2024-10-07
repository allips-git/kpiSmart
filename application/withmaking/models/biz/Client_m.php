<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 거래처 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/05/17
 */ 
class Client_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
        $this->encrypt_key = $this->config->item('encrypt_key');
    }

    /**
     * @description 거래처 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 업체구분, 등급, 영업담당자, 가용여부
     * @return Client list
     */
    public function get_list($data)
    {
        $sql   = 'SET @local_cd := ?, @content := ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data["content"]));
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT b.ikey, b.local_cd, b.cust_cd, b.cust_gb, b.cust_nm, c.code_nm
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, b.reg_dt
                    , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, b.mod_dt
                    , b.useyn
                    FROM biz_list AS b
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN z_plan.common_code AS c ON (c.code_gb = "BU" AND c.code_main = "160" AND c.code_sub = b.cust_gb) # 거래처 구분
                        INNER JOIN z_plan.user_list u1 ON (u1.ikey = b.reg_ikey)
                        LEFT JOIN z_plan.user_list u2 ON (u2.ikey = b.mod_ikey)
                    WHERE b.local_cd = @local_cd AND b.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", @content ,"%") AND b.cust_gb LIKE CONCAT("%", ? ,"%") 
                        AND b.sales_person LIKE CONCAT("%", ? ,"%") 
                        AND b.useyn LIKE CONCAT("%", ? ,"%")
                    ORDER BY b.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data["cust_gb"], (string)$data["sales_person"], (string)$data["useyn"]));
        // print_r($this->db->last_query());
        return $query->result();
    }

    /**
     * @description 거래처 상세 조회
     * @param 공장코드, 거래처ikey
     * @return Client detail
     */
    public function get_detail($data)
    {
        $sql   = 'SET @encrypt_key := ?';
        $query = $this->db->query($sql, array((string)$this->encrypt_key));
        $sql = 'SELECT b.ikey, b.local_cd, b.cust_cd, b.cust_nm, b.biz_nm, b.cust_gb
                , CONVERT(AES_DECRYPT(UNHEX(b.biz_num), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS biz_num
                , CONVERT(AES_DECRYPT(UNHEX(b.cust_num), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS cust_num
                , CONVERT(AES_DECRYPT(UNHEX(b.ceo_nm), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS ceo_nm
                , CONVERT(AES_DECRYPT(UNHEX(b.ceo_tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS ceo_tel
                , CONVERT(AES_DECRYPT(UNHEX(b.tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS tel
                , CONVERT(AES_DECRYPT(UNHEX(b.fax), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS fax
                , CONVERT(AES_DECRYPT(UNHEX(b.email), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS email
                , CONVERT(AES_DECRYPT(UNHEX(b.biz_zip), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS biz_zip
                , CONVERT(AES_DECRYPT(UNHEX(b.address), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS address
                , CONVERT(AES_DECRYPT(UNHEX(b.addr_detail), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS addr_detail
                , CONVERT(AES_DECRYPT(UNHEX(b.person), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS person
                , CONVERT(AES_DECRYPT(UNHEX(b.person_tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS person_tel
                , CONVERT(AES_DECRYPT(UNHEX(b.holder_nm), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS holder_nm
                , CONVERT(AES_DECRYPT(UNHEX(b.bl_num), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS bl_num
                , CONVERT(AES_DECRYPT(UNHEX(b.dlv_zip), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS dlv_zip
                , CONVERT(AES_DECRYPT(UNHEX(b.dlv_addr), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS dlv_addr
                , CONVERT(AES_DECRYPT(UNHEX(b.dlv_detail), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS dlv_detail
                , b.cust_grade, b.dlv_gb, b.biz_class, b.biz_type, b.bl_nm, b.sales_person, b.vat
                , b.memo, b.useyn

                # 미수잔액 장부
                , IFNULL((SELECT SUM(amt+tax) FROM ord_acc_list WHERE cust_cd = b.cust_cd AND `work` = "IN"), 0)
                - IFNULL((SELECT SUM(amt+tax) FROM ord_acc_list WHERE cust_cd = b.cust_cd AND `work` = "OUT"), 0) AS total_amt

                # 미지급액 장부
                , IFNULL((SELECT SUM(amt+tax) FROM buy_acc_list WHERE cust_cd = b.cust_cd AND `work` = "IN"), 0)
                - IFNULL((SELECT SUM(amt+tax) FROM buy_acc_list WHERE cust_cd = b.cust_cd AND `work` = "OUT"), 0) AS buy_amt

                FROM biz_list AS b
                WHERE b.local_cd = ? AND b.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

}
