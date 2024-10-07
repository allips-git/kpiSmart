<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 반품 출고 관리 모델
 * @author 안성준, @version 1.0, @last date 2022/09/06
 */ 
class Return_pop_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 반품 출고 리스트
     * @param 공장코드, 부모ikey
     * @return stock history list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT s.ikey, s.local_cd, s.put_dt, s.st_sq
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_gb")) AS re_gb, r.re_nm
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_memo")) AS re_memo, s.qty, s.memo
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm
                    FROM stock_history AS s
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN return_type AS r ON (JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_gb")) = r.re_uc) # 반품 유형
                        LEFT JOIN z_plan.user_list AS u1 ON(u1.ikey = s.reg_ikey)
                    WHERE s.local_cd = ? AND s.key_parent = ? AND s.useyn = "Y" AND s.delyn = "N"
                    ORDER BY s.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['key_parent']));
        return $query->result();
    }

    /**
     * @description 반품 출고 상세 조회
     * @param 공장코드, ikey
     * @return detail
     */
    public function get_return_detail($data)
    {
        $sql = 'SELECT s.ikey, s.local_cd, s.qty, s.put_dt, s.memo
                , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_gb")) AS re_gb
                , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_memo")) AS re_memo, s.memo
                FROM stock_history AS s        
                WHERE s.local_cd = ? AND s.ikey = ? AND s.useyn = "Y" AND s.delyn = "N" AND s.`work` = "OUT" ORDER BY s.reg_dt ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

    /**
     * @description 반품 기본정보
     * @param 공장코드, ikey
     * @return detail
     */
    public function get_info($data)
    {
        $sql = 'SELECT h.ikey, s.barcode, h.local_cd, h.item_cd, h.`work`, h.lot, h.amt, h.qty, h.put_dt, l.item_nm, b.ord_no
                ,c.code_nm, s.wh_uc, m.ord_no, m.cust_nm
                , JSON_UNQUOTE(JSON_EXTRACT(b.ord_spec, "$.size")) AS size
                , JSON_UNQUOTE(JSON_EXTRACT(b.ord_spec, "$.unit")) AS unit
                FROM stock_history AS h
                    INNER JOIN stock AS s ON (s.st_sq = h.st_sq)
                    INNER JOIN item_list AS l ON (l.item_cd = h.item_cd)
                    INNER JOIN buy_detail AS b ON (h.local_cd = b.local_cd AND b.lot = h.lot)
                    INNER JOIN buy_master AS m ON (m.local_cd = b.local_cd AND m.ord_no = b.ord_no)
                    INNER JOIN z_plan.common_code AS c 
                        ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(b.ord_spec, "$.unit")) = c.code_sub) # 공통코드 - 단위
                WHERE h.local_cd = ? AND h.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }


    /**
     * @description 반품 등록, 반품 히스토리 등록
     */
    public function re_insert($data)
    {
        $this->db->trans_begin();

        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        // 반품수량 반영
        $this->db->set('re_out_qty', 're_out_qty+'.$data['qty'], FALSE);
        $this->db->set('qty', 'qty-'.$data['qty'], FALSE);
        $this->db->set($array);
        $this->db->update('stock', NULL, array('st_sq' => $data['st_sq']));

        $this->db->set($array);
        $this->db->update('stock_history', NULL, array('ikey' => $data['key_parent']));

        // 반품 히스토리 등록
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
     * @description 반품 재고 수정, 반품 히스토리 수정
     */
    public function re_update($stock, $data)
    {
        $this->db->trans_begin();

        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        // 기 등록된 반품수량 차감
        $this->db->set('re_out_qty', 're_out_qty-'.$stock['re_out_qty'], FALSE);
        $this->db->set('qty', 'qty+'.$stock['re_out_qty'], FALSE);
        $this->db->set($array);
        $this->db->update('stock', NULL, array('st_sq' => $stock['st_sq']));

        // 신규 반품수량 증감 반영
        $this->db->set('re_out_qty', 're_out_qty+'.$data['qty'], FALSE);
        $this->db->set('qty', 'qty-'.$data['qty'], FALSE);
        $this->db->update('stock', NULL, array('st_sq' => $stock['st_sq']));

        // 반품 히스토리 업데이트
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
     * @description 반품 취소, 반품 히스토리 비활성화
     */
    public function delete($data)
    {
        $this->db->trans_begin();

        // 삭제 수량 만큼 반품 차감
        $array1 = array(
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );
        $this->db->set('re_out_qty', 're_out_qty-'.$data['qty'], FALSE);
        $this->db->set('qty', 'qty+'.$data['qty'], FALSE);
        $this->db->set($array1);
        $this->db->update('stock', NULL, array('st_sq' => $data['st_sq']));

        // 반품 히스토리 비활성화(데이터 확인용) - 추후 스케줄러를 통해 30일 이상 지난 데이터는 삭제 예정
        $array2 = array(
            'state'     => '002',
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
