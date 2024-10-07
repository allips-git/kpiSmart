<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 매출 제품 관리 컨트롤러
 * @author 김민주, @version 2.0, @last date 2022/06/03
 */
class Item_list_m extends CI_Model {

    protected $table = 'item_list';
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 매출 제품 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return item list
     */
    public function get_list($data)
    {
        $sql    = 'SET @content := ?, @useyn := ?';
        $query  = $this->db->query($sql, array((string)$data['content'], (string)$data['useyn']));
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT i.ikey
                    , (
                        CASE i.proc_gb 
                            WHEN "1" THEN "생산제품"
                            WHEN "2" THEN "외주제품"
                            WHEN "3" THEN "기타제품"
                        END) AS proc_gb
                    , i.item_gb, c.code_nm AS item_gb_nm, i.item_cd, i.item_nm, i.size, i.unit
                    , IFNULL((SELECT SUM(qty) FROM stock WHERE local_cd = i.local_cd AND item_cd = i.item_cd), 0) AS total_qty
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, i.reg_dt
                    , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, i.mod_dt
                    , i.useyn
                    FROM item_list AS i
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN z_plan.common_code AS c ON (c.code_gb = "BA" AND c.code_main = "080" AND c.code_sub = i.item_gb) # 제품유형
                        LEFT JOIN z_plan.user_list AS u1 ON(u1.ikey = i.reg_ikey)
                        LEFT JOIN z_plan.user_list AS u2 ON(u2.ikey = i.mod_ikey)
                    WHERE i.local_cd = ? AND i.item_gb IN ("001", "002", "003") AND i.delyn = "N"
                        AND i.'.$data['keyword'].' LIKE CONCAT("%", @content ,"%") AND i.item_lv LIKE CONCAT("%", ? ,"%") 
                        AND i.wh_uc LIKE CONCAT("%", ? ,"%") AND i.useyn LIKE CONCAT("%", @useyn ,"%")
                    ORDER BY i.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data["item_lv"], (string)$data["wh_uc"]));
        return $query->result();
    }

    /**
     * @description 매출 제품 상세 조회
     * @param 공장코드, ikey
     * @return item detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT i.ikey, i.local_cd, i.pd_cd, i.item_cd, i.proc_gb, i.item_gb, c.code_nm AS item_gb_nm
                , i.item_lv, i.item_nm, i.size, i.unit, cc.code_nm AS unit_nm
                , i.min_size, i.unit_amt, i.sale_amt, i.unit_amt_1, i.unit_amt_2, i.unit_amt_3, i.unit_amt_4, i.unit_amt_5
                , i.wh_uc, i.safe_qty, i.memo, i.useyn, i.delyn, i.mfr, i.taking_weight, i.self_weight, i.maximum_filght, i.maximum_speed , i.Battery
                FROM item_list AS i
                    INNER JOIN item_code AS c ON (c.ikey = i.item_lv)
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb = "BA" AND c.code_main = "080" AND c.code_sub = i.item_gb) # 제품유형
                    INNER JOIN z_plan.common_code AS cc ON (cc.code_gb ="BA" AND cc.code_main = "060" AND i.unit = cc.code_sub) # 공통코드 - 단위
                WHERE i.local_cd = ? AND i.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

    /**
     * @description 제품 등록
     * @hint 제품 등록시 제품 분류, 기본 창고 지정 있을경우 창고 사용(sysyn) 업데이트
     */
    public function insert($reg, $link)
    {

        $this->db->trans_begin();
        $this->db->insert('item_list', $reg);

        
        if ($reg['item_lv'] != '') // 제품 분류
        {
            $this->db->update('item_code', $link, array('ikey'=>$reg['item_lv']));
        }
        if ($reg['wh_uc'] != '') // 기본 창고
        {
            $this->db->update('warehouse', $link, array('wh_uc'=>$reg['wh_uc']));
        }
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
     * @description 제품 수정
     * @hint 제품 수정시 제품 분류, 기본 창고 지정 있을경우 창고 사용(sysyn) 업데이트
     */
    public function update($mod, $data, $link)
    {
        $this->db->trans_begin();
        $this->db->update('item_list', $mod, $data);
        if ($mod['item_lv'] != '') // 제품 분류
        {
            $this->db->update('item_code', $link, array('ikey'=>$mod['item_lv']));
        }
        if ($mod['wh_uc'] != '') // 기본 창고
        {
            $this->db->update('warehouse', $link, array('wh_uc'=>$mod['wh_uc']));
        }
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
