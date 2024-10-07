<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 입고(Prod_put) 관리 모델
 * @author 안성준, @version 1.0, @last date
 */ 
class Prod_put_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
    }

   /**
     * @description 입고 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 시작일, 검색 종료일
     * @return Prod_put list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT s.ikey, t.barcode, s.local_cd, s.details, s.lot, s.item_cd, s.amt, s.qty, t.max_dt
                    , s.put_dt, w.wh_nm, i.item_nm, c.code_nm
                    , IFNULL((SELECT SUM(qty) FROM stock_history WHERE key_parent = s.ikey AND useyn = "Y" AND delyn = "N"), 0) AS out_qty
                    , JSON_UNQUOTE(JSON_EXTRACT(b.ord_spec, "$.size")) AS size
                    , JSON_UNQUOTE(JSON_EXTRACT(b.ord_spec, "$.unit")) AS unit
                    , CASE s.print_yn
                        WHEN "Y" THEN "출력완료" 
                        ELSE "미출력" 
                      END AS printyn
                    FROM stock_history AS s
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN stock AS t ON (s.local_cd = t.local_cd AND s.st_sq = t.st_sq)
                        INNER JOIN buy_detail AS b ON (b.local_cd = t.local_cd and b.lot = s.lot)
                        INNER JOIN warehouse AS w ON (w.wh_uc = t.wh_uc)
                        INNER JOIN item_list AS i ON (i.item_cd = s.item_cd)
                        INNER JOIN z_plan.common_code AS c 
                        ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(b.ord_spec, "$.unit")) = c.code_sub) # 공통코드 - 단위
                    WHERE s.local_cd = ? AND s.useyn = "Y" AND s.delyn = "N" AND s.`work` = "IN" AND s.details = "001"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") AND (s.put_dt >= ? AND s.put_dt <= ?) AND t.wh_uc LIKE CONCAT("%", ? ,"%")
                    ORDER BY s.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data["local_cd"],(string)$data["content"], (string)$data["start_dt"], (string)$data["end_dt"], (string)$data["wh_uc"]));

        return $query->result();
    }


    /**
     * @description 입고 상세 조회
     * @param 공장코드, 입고ikey
     * @return Prod_put detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT h.ikey, h.st_sq, s.barcode, h.local_cd, h.item_cd, h.`work`, h.lot, h.amt, h.qty, s.max_dt, h.put_dt
                , h.memo, l.item_nm, h.ord_no, c.code_nm, s.wh_uc, w.wh_nm
                , JSON_UNQUOTE(JSON_EXTRACT(b.ord_spec, "$.size")) AS size, JSON_UNQUOTE(JSON_EXTRACT(b.ord_spec, "$.unit")) AS unit, h.vat
                , (
                    CASE h.vat
                        WHEN "N" THEN "과세"
                        WHEN "Y" THEN "면세"
                        WHEN "S" THEN "영세"
                END) AS vat_text, h.sysyn
                FROM stock_history AS h
                    INNER JOIN stock AS s ON (s.st_sq = h.st_sq)
                    INNER JOIN item_list AS l ON (l.item_cd = h.item_cd)
                    INNER JOIN warehouse AS w ON (s.local_cd = w.local_cd AND s.wh_uc = w.wh_uc)
                    INNER JOIN buy_detail AS b ON (b.local_cd = ? and b.lot = h.lot)
                    INNER JOIN z_plan.common_code AS c 
                        ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(b.ord_spec, "$.unit")) = c.code_sub) # 공통코드 - 단위
                WHERE h.local_cd = ? AND h.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'],(string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

    /**
     * @description 구매입고 등록
     */
    public function insert($mode, $stock, $data)
    {
        $this->db->trans_begin();

        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $stock['reg_ikey'],
            'mod_ip'    => $stock['reg_ip'],
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        if ($mode == 'insert') // 입고 히스토리 등록  
        {
            $this->db->insert('stock', $stock);
            $this->db->insert('stock_history', $data);
        }
        else if ($mode == 'update') // 입고 수정, 입고 히스토리 등록
        {
            $this->db->set('in_qty', 'in_qty+'.$stock['qty'], FALSE);
            $this->db->set('qty', 'qty+'.$stock['qty'], FALSE);
            $this->db->set($array);
            $this->db->update('stock', NULL, array('st_sq' => $data['st_sq']));
            $this->db->insert('stock_history', $data);
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
     * @description 입고 수정 - 발주 마스터 진행 상태값이(접수, 대기)일 경우만 상태값 업데이트
     */
    public function update($stock, $data)
    {
        $this->db->trans_begin();

        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $stock['mod_ikey'],
            'mod_ip'    => $stock['mod_ip'],
            'mod_dt'    => $stock['mod_dt']
        );

        // 기 등록된 구매입고 차감
        $this->db->set('in_qty', 'in_qty-'.$stock['in_qty'], FALSE);
        $this->db->set('qty', 'qty-'.$stock['in_qty'], FALSE);
        $this->db->set($array);
        $this->db->update('stock', NULL, array('st_sq' => $stock['st_sq']));

        // 수정된 구매입고 증감 반영
        $this->db->set('in_qty', 'in_qty+'.$stock['qty'], FALSE);
        $this->db->set('qty', 'qty+'.$stock['qty'], FALSE);
        $this->db->update('stock', NULL, array('st_sq' => $stock['st_sq']));

        // 구매 히스토리 업데이트
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
     * @description 구매입고 차감, 구매입고 히스토리 비활성화
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
        $this->db->set('in_qty', 'in_qty-'.$data['qty'], FALSE);
        $this->db->set('qty', 'qty-'.$data['qty'], FALSE);
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
