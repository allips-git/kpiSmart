<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 생산 입고 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/08/29
 */
class Prod_qa_m extends CI_Model {

    protected $table = 'stock_history';
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 생산 입고 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return stock history list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT s.ikey, s.local_cd, s.put_dt, s.st_sq, s.ord_no, s.item_cd, i.item_nm
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.size")) AS size
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) AS unit, c.code_nm AS unit_nm
                    , IFNULL(s.amt+s.tax, 0) AS total_amt, s.qty
                    , IFNULL((SELECT SUM((amt+tax)*qty) FROM stock_history WHERE ord_no = s.ord_no AND details = "004"), 0) AS real_amt
                    , IFNULL((SELECT job_qty FROM job_master WHERE job_no = s.ord_no), "") AS job_qty
                    , IFNULL((SELECT SUM(qty) FROM stock_history WHERE key_parent = s.ikey AND useyn = "Y" AND delyn = "N"), 0) AS out_qty
                    , s.print_yn, s.memo, t.wh_uc, t.max_dt, t.barcode, w.wh_nm
                    , IFNULL((SELECT ikey FROM job_master WHERE job_no = s.ord_no LIMIT 1), "") AS m_ikey
                    FROM stock_history AS s
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN stock AS t ON (s.local_cd = t.local_cd AND s.st_sq = t.st_sq)
                        INNER JOIN warehouse AS w ON (t.local_cd = w.local_cd AND t.wh_uc = w.wh_uc)
                        INNER JOIN item_list AS i ON (s.local_cd = i.local_cd AND s.item_cd = i.item_cd)
                        INNER JOIN z_plan.common_code AS c 
                            ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) = c.code_sub) # 공통코드 - 단위
                    WHERE s.local_cd = ? AND s.`work` = "IN" AND s.details IN ("003") AND s.useyn = "Y" AND s.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%")
                        AND s.put_dt BETWEEN "'.$data['start_dt'].'" AND "'.$data['end_dt'].'" 
                        AND t.wh_uc LIKE CONCAT("%", ? ,"%")
                    ORDER BY s.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content'], (string)$data['wh_uc']));
        return $query->result();
    }

    /**
     * @description 생산 입고 상세 조회
     * @param 공장코드, ikey
     * @return stock history detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT s.ikey, s.local_cd, s.st_sq, s.put_dt, t.wh_uc, w.wh_nm, t.barcode, s.item_cd, i.item_nm, t.max_dt
                , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.size")) AS size
                , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) AS unit, c.code_nm AS unit_nm
                , s.amt, s.tax, s.vat, s.qty
                , (SELECT SUM(qty) FROM stock WHERE local_cd = s.local_cd AND item_cd = s.item_cd) AS total_qty
                , i.safe_qty, s.print_yn
                FROM stock_history AS s
                    INNER JOIN stock AS t ON (s.local_cd = t.local_cd AND s.st_sq = t.st_sq)
                    INNER JOIN warehouse AS w ON (t.local_cd = w.local_cd AND t.wh_uc = w.wh_uc)
                    INNER JOIN item_list AS i ON (s.local_cd = i.local_cd AND s.item_cd = i.item_cd)
                    INNER JOIN z_plan.common_code AS c 
                        ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) = c.code_sub) # 공통코드 - 단위
                WHERE s.local_cd = ? AND s.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

    /**
     * @description 불량 리스트
     * @param 공장코드, 부모ikey
     * @return stock history list
     */
    public function get_flaw_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT s.ikey, s.local_cd, s.put_dt, s.st_sq
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_gb")) AS re_gb, f.fl_nm
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_memo")) AS re_memo, s.qty, s.memo
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm
                    FROM stock_history AS s
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN flaw AS f ON (JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_gb")) = f.fl_uc) # 불량 유형
                        LEFT JOIN z_plan.user_list AS u1 ON(u1.ikey = s.reg_ikey)
                    WHERE s.local_cd = ? AND s.key_parent = ? AND s.useyn = "Y" AND s.delyn = "N"
                    ORDER BY s.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['key_parent']));
        return $query->result();
    }

    /**
     * @description 불량 상세 조회
     * @param 공장코드, ikey
     * @return stock history detail
     */
    public function get_flaw_detail($data)
    {
        $sql = 'SELECT s.ikey, s.local_cd, s.put_dt, s.st_sq
                , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_gb")) AS re_gb, f.fl_nm
                , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_memo")) AS re_memo, s.qty, s.memo
                FROM stock_history AS s
                    INNER JOIN flaw AS f ON (JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_gb")) = f.fl_uc) # 불량 유형
                WHERE s.local_cd = ? AND s.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

    /**
     * @description 재고 수정, 재고 히스토리 등록
     */
    public function insert($data)
    {
        $this->db->trans_begin();

        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        // 불량수량 반영
        $this->db->set('flaw_qty', 'flaw_qty+'.$data['qty'], FALSE);
        $this->db->set('qty', 'qty-'.$data['qty'], FALSE);
        $this->db->set($array);
        $this->db->update('stock', NULL, array('st_sq' => $data['st_sq']));

        // 재고 히스토리 등록
        $this->db->insert('stock_history', $data);
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
     * @description 재고 수정, 재고 히스토리 등록
     */
    public function update($stock, $data)
    {
        $this->db->trans_begin();

        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        // 기 등록된 불량수량 차감
        $this->db->set('flaw_qty', 'flaw_qty-'.$stock['flaw_qty'], FALSE);
        $this->db->set('qty', 'qty+'.$stock['flaw_qty'], FALSE);
        $this->db->set($array);
        $this->db->update('stock', NULL, array('st_sq' => $stock['st_sq']));

        // 신규 불량수량 증감 반영
        $this->db->set('flaw_qty', 'flaw_qty+'.$data['qty'], FALSE);
        $this->db->set('qty', 'qty-'.$data['qty'], FALSE);
        $this->db->update('stock', NULL, array('st_sq' => $stock['st_sq']));

        // 재고 히스토리 업데이트
        $this->db->update('stock_history', $data, array('ikey'=>$data['ikey']));
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
     * @description 재고 차감, 재고 히스토리 비활성화
     */
    public function delete($data)
    {
        $this->db->trans_begin();

        // 삭제 수량 만큼 재고 차감
        $array1 = array(
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );
        $this->db->set('flaw_qty', 'flaw_qty-'.$data['qty'], FALSE);
        $this->db->set('qty', 'qty+'.$data['qty'], FALSE);
        $this->db->set($array1);
        $this->db->update('stock', NULL, array('st_sq' => $data['st_sq']));

        // 재고 히스토리 비활성화(데이터 확인용) - 추후 스케줄러를 통해 30일 이상 지난 데이터는 삭제 예정
        $array2 = array(
            'state'     => '010',
            'useyn'     => 'N',
            'delyn'     => 'Y'
        );
        $this->db->set(array_merge($array1, $array2));
        $this->db->update('stock_history', NULL, array('ikey' => $data['ikey']));
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
