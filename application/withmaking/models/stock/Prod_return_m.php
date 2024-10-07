<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 반품 입고(제품) 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/08/30
 */
class Prod_return_m extends CI_Model {

    protected $table = 'stock_history';
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 반품 입고 리스트
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
     * @description 반품 입고 상세 조회
     * @param 공장코드, ikey
     * @return stock history detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT s.ikey, s.local_cd, s.put_dt, s.st_sq
                , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_gb")) AS re_gb, r.re_nm
                , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_memo")) AS re_memo, s.qty, s.memo
                FROM stock_history AS s
                    INNER JOIN return_type AS r ON (JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.re_gb")) = r.re_uc) # 반품 유형
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

        // 반품입고 반영
        $this->db->set('re_in_qty', 're_in_qty+'.$data['qty'], FALSE);
        $this->db->set('qty', 'qty+'.$data['qty'], FALSE);
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
     * @description 재고 수정, 재고 히스토리 수정
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

        // 기 등록된 반품수량 차감
        $this->db->set('re_in_qty', 're_in_qty-'.$stock['re_in_qty'], FALSE);
        $this->db->set('qty', 'qty-'.$stock['re_in_qty'], FALSE);
        $this->db->set($array);
        $this->db->update('stock', NULL, array('st_sq' => $stock['st_sq']));

        // 신규 반품수량 증감 반영
        $this->db->set('re_in_qty', 're_in_qty+'.$data['qty'], FALSE);
        $this->db->set('qty', 'qty+'.$data['qty'], FALSE);
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
        $this->db->set('re_in_qty', 're_in_qty-'.$data['qty'], FALSE);
        $this->db->set('qty', 'qty-'.$data['qty'], FALSE);
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
