<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 수도 계량(Water gauge) 관리 모델
 * @author 안성준, @version 1.0, @last date 2022/07/31
 */ 
class Water_gauge_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
        $this->encrypt_key = $this->config->item('encrypt_key');
    }


    /**
     * @description 수도계량 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 단위
     * @return Water_gauge list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT w.ikey, w.local_cd, w.base_dt, w.memo, w.volume, c.code_nm
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, w.reg_dt
                    , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, w.mod_dt
                    , w.useyn
                    FROM water_gauge AS w
                        INNER JOIN (SELECT @rownum := 0) r   
                        INNER JOIN z_plan.common_code AS c ON (c.code_gb = "BA" AND c.code_main = "060" AND c.code_sub = w.unit)  #창고유형               
                        INNER JOIN z_plan.user_list u1 ON (u1.ikey = w.reg_ikey)
                        LEFT JOIN z_plan.user_list u2 ON (u2.ikey = w.mod_ikey)
                    WHERE w.local_cd = ? AND w.delyn = "N" AND w.useyn = "Y"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%")
                        AND w.unit LIKE CONCAT("%", ? ,"%")
                    ORDER BY w.base_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data["content"],(string)$data["unit"]));
        return $query->result();
    }

    /**
     * @description 수도계량 상세
     * @param 공장코드, 수도 계량 ikey
     * @return Water_gauge detail
     */
    public function get_detail($data)
    {

        $sql = 'SELECT w.ikey, w.local_cd, w.base_dt, w.volume, w.unit, w.memo
                FROM water_gauge AS w
                WHERE w.local_cd = ? AND w.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }


    /**
     * @description 수도계량 상세 조회
     * @param 공장코드, 수도계량ikey ,수도계량 base_dt
     * @return base_dt 중복 count
     */
    public function get_verify_column_count($data){
        $sql = 'SELECT COUNT(*) AS cnt
                FROM water_gauge
                WHERE ikey != ? AND base_dt = ? AND local_cd = ?';
        $query = $this->db->query($sql,array((string)$data['ikey'], (string)$data['base_dt'],(string)$data['local_cd']));
        return $query->row();
    }

}
