<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 제품 출고 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/09/01
 */ 
class Prod_out_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 제품 출고 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 시작일, 검색 종료일
     * @return out list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT s.ikey, s.local_cd, s.put_dt, t.wh_uc, w.wh_nm, t.barcode, s.item_cd, i.item_nm
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.size")) AS size
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) AS unit, c.code_nm AS unit_nm
                    , s.amt, s.tax, s.print_yn, s.qty
                    , IFNULL((SELECT SUM(qty) FROM stock_history WHERE key_parent = s.ikey AND useyn = "Y" AND delyn = "N"), 0) AS re_qty
                    FROM stock_history AS s
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN stock AS t ON (s.local_cd = t.local_cd AND s.st_sq = t.st_sq)
                        INNER JOIN warehouse AS w ON (t.local_cd = w.local_cd AND t.wh_uc = w.wh_uc)
                        INNER JOIN item_list AS i ON (s.local_cd = i.local_cd AND s.item_cd = i.item_cd)
                        INNER JOIN z_plan.common_code AS c 
                            ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) = c.code_sub) # 공통코드 - 단위
                        LEFT JOIN z_plan.user_list AS u1 ON(u1.ikey = i.reg_ikey)
                        LEFT JOIN z_plan.user_list AS u2 ON(u2.ikey = i.mod_ikey)
                    WHERE s.local_cd = ? AND s.`work` = "OUT" AND s.details IN ("002") AND s.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") 
                        AND s.put_dt BETWEEN "'.$data['start_dt'].'" AND "'.$data['end_dt'].'"
                        AND t.wh_uc LIKE CONCAT("%", ? ,"%")
                    ORDER BY s.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content'], (string)$data['wh_uc']));
        return $query->result();
    }

    /**
     * @description 제품 출고 상세 조회
     * @param 공장코드, ikey
     * @return stock history detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT s.ikey, s.local_cd, s.st_sq, s.put_dt, s.ord_no, s.lot, t.wh_uc, w.wh_nm, t.barcode, s.item_cd, i.item_nm, t.max_dt
                , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.size")) AS size
                , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) AS unit, c.code_nm AS unit_nm
                , s.amt, s.tax, s.vat, s.qty
                , (SELECT SUM(qty) FROM stock WHERE local_cd = s.local_cd AND item_cd = s.item_cd AND useyn = "Y" AND delyn = "N") AS total_qty
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
     * @description 출고 등록(재고 반영)
     */
    public function insert($stock, $data)
    {
        $this->db->trans_begin();

        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        // 재고 수정
        $this->db->set('out_qty', 'out_qty+'.$stock['qty'], FALSE);
        $this->db->set('qty', 'qty-'.$stock['qty'], FALSE);
        $this->db->set($array);
        $this->db->update('stock', NULL, array('st_sq' => $data['st_sq']));

        // 출고 등록
        $this->db->insert('stock_history', $data);

        // 창고 업데이트
        $this->db->update('warehouse', $array, array('wh_uc' => $stock['wh_uc']));

        // 품목 업데이트
        $this->db->update('item_list', $array, array('item_cd' => $stock['item_cd']));
        
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
     * @description 출고 수정(재고 반영)
     */
    public function update($stock, $data)
    {
        $this->db->trans_begin();

        // 출고 수량 업데이트
        $array = array(
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        // 기 등록된 출고수량 차감
        $this->db->set('out_qty', 'out_qty-'.$stock['out_qty'], FALSE);
        $this->db->set('qty', 'qty+'.$stock['out_qty'], FALSE);
        $this->db->set($array);
        $this->db->update('stock', NULL, array('st_sq' => $stock['st_sq']));

        // 신규 출고수량 반영
        $this->db->set('out_qty', 'out_qty+'.$data['qty'], FALSE);
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
     * @description 출고 삭제(재고 차감), 재고 히스토리 비활성화
     */
    public function delete($data)
    {
        $this->db->trans_begin();

        // 삭제 수량 만큼 재고 차감
        $array = array(
            'mod_ikey'  => $data['mod_ikey'],
            'mod_ip'    => $data['mod_ip'],
            'mod_dt'    => $data['mod_dt']
        );
        $this->db->set('out_qty', 'out_qty-'.$data['qty'], FALSE);
        $this->db->set('qty', 'qty+'.$data['qty'], FALSE);
        $this->db->set($array);
        $this->db->update('stock', NULL, array('st_sq' => $data['st_sq']));

        // 재고 히스토리 비활성화(데이터 확인용) - 추후 스케줄러를 통해 30일 이상 지난 데이터는 삭제 예정
        $array2 = array(
            'state'     => '010',
            'useyn'     => 'N',
            'delyn'     => 'Y',
            'mod_ikey'  => $data['mod_ikey'],
            'mod_ip'    => $data['mod_ip'],
            'mod_dt'    => $data['mod_dt']
        );
        $this->db->set($array2);
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
