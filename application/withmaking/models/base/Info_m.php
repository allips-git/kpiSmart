<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 자사 정보(WorkPlace) 관리 모델
 * @author 안성준, @version 1.0, @last date
 */ 
class Info_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
        $this->encrypt_key = $this->config->item('encrypt_key');
    }

    /**
     * @description 자사 정보
     * @param 공장코드
     */
    public function get_factory($table , $data)
    {
        $sql   = 'SET @encrypt_key := ?';
        $query = $this->db->query($sql, array((string)$this->encrypt_key));

        $sql = 'SELECT f.ikey, f.fa_nm,f.biz_nm, f.biz_class, f.biz_type,f.ceo_nm, f.memo, f.local_cd, f.biz_gb  
                , CONVERT(AES_DECRYPT(UNHEX(f.biz_cd), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS biz_cd
                , CONVERT(AES_DECRYPT(UNHEX(f.tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS tel
                , CONVERT(AES_DECRYPT(UNHEX(f.fax), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS fax
                , CONVERT(AES_DECRYPT(UNHEX(f.biz_zip), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS biz_zip
                , CONVERT(AES_DECRYPT(UNHEX(f.address), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS address
                , CONVERT(AES_DECRYPT(UNHEX(f.addr_detail), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS addr_detail
                , CONVERT(AES_DECRYPT(UNHEX(f.ceo_tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS ceo_tel
                , CONVERT(AES_DECRYPT(UNHEX(f.email), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS email
                FROM z_plan.factory AS f
                WHERE local_cd = ? ';

        $query = $this->db->query($sql, array((string)$data));
        return $query->row();
    }
}
