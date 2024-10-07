<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 설비(Machine) 관리 모델
 * @author 안성준, @version 1.0, @last date 2022/09/07
 */ 
class Machine_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 설비 코드 생성
     * @param 공장코드
     * @return mc_cd
     */
    public function get_code($data)
    {
        $sql = 'SELECT CONCAT("MC", SUBSTRING_INDEX(w.mc_cd, "MC", -1)+10) AS mc_cd
                FROM machine AS w
                WHERE w.local_cd = ? 
                ORDER BY length(w.mc_cd) DESC, w.mc_cd DESC LIMIT 1';
        $query = $this->db->query($sql, array((string)$data['local_cd']));
        return $query->row();
    }

    /**
     * @description 설비리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 설비유형, 가용여부
     * @return Machine list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT w.ikey, w.local_cd, w.mc_cd, w.mc_nm, c.code_nm
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, w.reg_dt
                    , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, w.mod_dt
                    , w.useyn
                    FROM machine AS w
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN z_plan.common_code AS c ON (c.code_gb = "BA" AND c.code_main = "120" AND c.code_sub = w.mc_gb)
                        INNER JOIN z_plan.user_list u1 ON (u1.ikey = w.reg_ikey)
                        LEFT JOIN z_plan.user_list u2 ON (u2.ikey = w.mod_ikey)
                    WHERE w.local_cd = ? AND w.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") 
                        AND w.mc_gb LIKE CONCAT("%", ? ,"%") AND w.useyn LIKE CONCAT("%", ? ,"%")
                    ORDER BY w.reg_dt ASC) AS sub
                ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data["content"], (string)$data["mc_gb"], (string)$data["useyn"]));
        return $query->result();
    }

    /**
     * @description 설비 상세 조회
     * @param 공장코드, 설비ikey
     * @return Machine detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT w.ikey, w.local_cd, w.useyn, w.mc_gb, w.mc_nm, w.maker, w.model_nm, w.serial_no, w.spec, w.buy_corp, w.buy_dt, w.amt, w.memo
                , IFNULL((SELECT file_orig FROM factory_file WHERE local_cd = w.local_cd AND file_seq = "03" AND file_dseq = w.ikey), "") AS file_orig1
                , IFNULL((SELECT file_nm FROM factory_file WHERE local_cd = w.local_cd AND file_seq = "03" AND file_dseq = w.ikey), "") AS file_nm1
                FROM machine AS w
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb = "BA" AND c.code_main = "120" AND c.code_sub = w.mc_gb) #설비유형
                WHERE w.local_cd = ? AND w.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

}
