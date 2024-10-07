<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 제품 출고 현황 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/07/25
 */
class Out_list_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 제품 출고 현황 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return stock history list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT s.ikey, s.local_cd, s.job_sq, s.put_dt
                    , s.details, s.item_cd, i.item_nm, t.barcode
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.size")) AS size
                    , JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) AS unit, c.code_nm AS unit_nm
                    , t.max_dt, s.lot
                    , IFNULL((SELECT ord_qty FROM ord_detail WHERE lot = s.lot AND useyn = "Y" AND delyn = "N"), 0) AS ord_qty
                    , s.qty, s.amt, s.tax, t.wh_uc, w.wh_nm
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, s.reg_dt, s.fin_dt
                    , CONCAT(worker.ul_nm, "(", worker.id, ")") AS worker_nm, s.state, s.memo
                    FROM stock_history AS s
                    INNER JOIN (SELECT @rownum := 0) r
                    INNER JOIN stock AS t ON (s.local_cd = t.local_cd AND s.st_sq = t.st_sq)
                    INNER JOIN item_list AS i ON (s.local_cd = i.local_cd AND s.item_cd = i.item_cd)
                    INNER JOIN warehouse AS w ON (t.local_cd = w.local_cd AND t.wh_uc = w.wh_uc)
                    INNER JOIN z_plan.user_list AS u1 ON(s.local_cd = u1.local_cd AND s.reg_ikey AND u1.ikey)
                    LEFT JOIN z_plan.user_list AS worker ON(s.local_cd = worker.local_cd AND s.ul_uc = worker.ul_uc)
                    LEFT JOIN z_plan.common_code AS c ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(s.spec, "$.unit")) = c.code_sub)
                    WHERE s.local_cd = ? AND s.work = "OUT" AND s.details IN ("002") AND s.useyn = "Y" AND s.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%")
                        AND s.put_dt BETWEEN "'.$data['start_dt'].'" AND "'.$data['end_dt'].'" 
                        AND t.wh_uc LIKE CONCAT("%", ? ,"%") AND s.state LIKE CONCAT("%", ? ,"%")
                    GROUP BY s.local_cd, s.job_sq
                ORDER BY s.put_dt ASC, s.job_sq ASC) AS sub
            ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data["content"], (string)$data["wh_uc"], (string)$data["state"]));
        return $query->result();
    }

    /**
     * @description 배송사원 적용
     */
    public function update_batch_worker($data, $where)
    {
        for ($i=0; $i < count($data['ikey']); $i++) 
        {
            // ikey값이 있을경우만 등록
            if (!empty(trim($data['ikey'][$i]))) 
            {
                $modify[] = array(
                    'ikey'      => trim($data['ikey'][$i]),
                    'ul_uc'     => $data['ul_uc'],
                    'sysyn'     => $data['sysyn'],
                    'mod_ikey'  => $data['mod_ikey'],
                    'mod_ip'    => $data['mod_ip'],
                    'mod_dt'    => $data['mod_dt']
                ); 
            }
        }
        $this->db->trans_begin();
        $this->db->update_batch('stock_history', $modify, 'ikey');
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
     * @description 출고완료 적용
     */
    public function update_batch_state($data, $where)
    {
        for ($i=0; $i < count($data['ikey']); $i++) 
        {
            // ikey값이 있을경우만 등록
            if (!empty(trim($data['ikey'][$i]))) 
            {
                $modify[] = array(
                    'ikey'      => trim($data['ikey'][$i]),
                    'state'     => $data['state'],
                    'fin_dt'    => $data['today'],
                    'sysyn'     => $data['sysyn'],
                    'mod_ikey'  => $data['mod_ikey'],
                    'mod_ip'    => $data['mod_ip'],
                    'mod_dt'    => $data['today']
                ); 
            }
        }
        $this->db->trans_begin();
        $this->db->update_batch('stock_history', $modify, 'ikey');
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
     * @description 바코드 스캔 - 출고완료
     */
    public function update_state($data)
    {
        $sql   = 'SET @barcode := ?';
        $query = $this->db->query($sql, array((string)$data['barcode']));
        $sql = 'UPDATE stock_history
                SET state = "006", sysyn = "Y", mod_ikey = ?, mod_ip = ?, mod_dt = now(), fin_dt = now()
                WHERE local_cd = ? AND barcode = @barcode
                AND put_dt = (SELECT Max(put_dt) From stock_history WHERE barcode = @barcode) 
                AND state = "005" LIMIT 1';
        $query = $this->db->query($sql, array((string)$data['mod_ikey'], (string)$data['mod_ip'], (string)$data['local_cd']));
        return $this->db->affected_rows();
    }


}
