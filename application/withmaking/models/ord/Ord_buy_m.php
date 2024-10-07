<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 구매 발주 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/04
 */
class Ord_buy_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
        $this->load->model('acc/Buy_pay_m');
        $this->encrypt_key = $this->config->item('encrypt_key');
    }

    /**
     * @description 구매 발주 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 날짜
     * @return buy list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT m.ikey, m.local_cd, m.cust_cd, m.cust_nm, m.biz_nm
                    , m.ord_no, m.ord_dt, MIN(d.item_nm) AS item_nm, MAX(d.ord_seq) AS ord_seq, IFNULL(SUM(d.ord_qty), 0) AS ord_qty
                    , (SELECT COUNT(*) FROM buy_detail WHERE ord_no = d.ord_no) AS buy_cnt
                    , IFNULL(SUM(d.ord_amt), 0) AS ord_amt, IFNULL(SUM(d.tax_amt), 0) AS tax_amt, m.state, m.finyn
                    FROM buy_master AS m
                    INNER JOIN (SELECT @rownum := 0) r
                    INNER JOIN buy_detail AS d ON (m.local_cd = d.local_cd AND m.ord_no = d.ord_no)
                    INNER JOIN item_list AS i ON (d.local_cd = i.local_cd AND d.item_cd = i.item_cd)
                    WHERE m.local_cd = ? AND m.useyn = "Y" AND m.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") 
                        AND (m.ord_dt >= "'.$data['start_dt'].'" AND m.ord_dt <= "'.$data['end_dt'].'") AND m.finyn LIKE CONCAT("%", ? ,"%")
                    GROUP BY m.ord_no
                    ORDER BY m.ord_dt ASC, m.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content'], (string)$data['finyn']));
        return $query->result();
    }

    /**
     * @description 구매 발주 상세 조회
     * @param 공장코드, 발주번호
     * @return buy detail
     */
    public function get_detail($data)
    {
        $sql   = 'SET @encrypt_key := ?';
        $query = $this->db->query($sql, array((string)$this->encrypt_key));

                # 발주 마스터 정보
        $sql = 'SELECT m.ikey, m.local_cd, m.cust_cd, m.cust_nm, m.biz_nm 
                , CONVERT(AES_DECRYPT(UNHEX(b.tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS tel
                , CONVERT(AES_DECRYPT(UNHEX(b.ceo_nm), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS ceo_nm
                , CONVERT(AES_DECRYPT(UNHEX(b.ceo_tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS ceo_tel
                , m.vat, m.memo, m.state, m.finyn
                # 발주 상세 정보
                , m.ord_no, d.ord_seq, d.ord_bseq, m.ord_dt, MIN(d.item_nm) AS item_nm, MAX(d.ord_seq) AS ord_seq
                , d.lot, d.item_cd, d.item_nm
                , JSON_UNQUOTE(JSON_EXTRACT(d.ord_spec, "$.size")) AS size
                , JSON_UNQUOTE(JSON_EXTRACT(d.ord_spec, "$.unit")) AS unit, c.code_nm
                , IFNULL(d.ord_qty, 0) AS ord_qty, IFNULL(d.unit_amt, 0) AS unit_amt
                , IFNULL(SUM(d.ord_amt), 0) AS ord_amt, IFNULL(SUM(d.tax_amt), 0) AS tax_amt, d.memo AS ord_memo
                FROM buy_master AS m
                    INNER JOIN buy_detail AS d ON (m.local_cd = d.local_cd AND m.ord_no = d.ord_no)
                    INNER JOIN biz_list AS b ON (m.local_cd = b.local_cd AND m.cust_cd = b.cust_cd)
                    INNER JOIN z_plan.common_code AS c 
                    ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(d.ord_spec, "$.unit")) = c.code_sub) # 공통코드 - 단위
                    -- INNER JOIN item_code AS c ON c.ikey = i.item_lv
                WHERE m.local_cd = ? AND m.ord_no = ?
                GROUP BY d.ord_no, d.ord_seq, d.ord_bseq';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ord_no']));
        return $query->result();
    }

    /**
     * @description 매입거래처 전체 리스트
     * @param 공장코드, 검색 텍스트
     * @return Client list
     */
    public function get_biz_list($data)
    {
        $sql = 'SELECT b.ikey AS id, b.cust_nm AS `text`
                FROM biz_list AS b
                WHERE b.local_cd = ? AND b.cust_gb IN ("002", "003") AND b.cust_nm LIKE CONCAT("%", ? ,"%")
                AND b.useyn = "Y" AND b.delyn = "N"
                ORDER BY b.cust_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 매입제품 전체 리스트
     * @param 공장코드, 검색 텍스트
     * @return item list
     */
    public function get_buy_item($data)
    {
        $sql = 'SELECT i.ikey AS id, i.item_nm AS `text`
                FROM item_list AS i
                WHERE i.local_cd = ? AND i.item_gb IN ("002", "004", "005", "006") AND i.item_nm LIKE CONCAT("%", ? ,"%")
                AND i.useyn = "Y" AND i.delyn = "N"
                ORDER BY i.item_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 거래처별 회계정보
     * @param 공장코드, 거래처코드
     * @return acc info
     */
    public function get_acc_info($data)
    {
        $sql   = 'SET @local_cd := ?, @cust_cd := ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['cust_cd']));
        $sql = 'SELECT a.cust_cd
                # 미지급액 장부
                , IFNULL((SELECT SUM(amt+tax) FROM buy_acc_list 
                          WHERE cust_cd = a.cust_cd AND `work` = "IN" AND useyn = "Y" AND delyn = "N"), 0)  AS in_amt
                , IFNULL((SELECT SUM(amt+tax) FROM buy_acc_list 
                          WHERE cust_cd = a.cust_cd AND `work` = "OUT" AND useyn = "Y" AND delyn = "N"), 0) AS out_amt
                FROM buy_acc_list AS a
                WHERE a.local_cd = @local_cd AND a.cust_cd = @cust_cd
                GROUP BY a.cust_cd';
        $query = $this->db->query($sql);
        return $query->row();
    }

    /**
     * @description 구매 발주 등록
     */
    public function insert_batch($reg, $data)
    {
        for ($i=0; $i < count($data['item_cd']); $i++) 
        {
            // 품목 값이 있을경우만 등록
            if (!empty(trim($data['item_cd'][$i]))) 
            { 
                $spec[] = array(
                    'size' => $data['size'][$i],
                    'unit' => $data['unit'][$i]
                );
                $detail[] = array(
                    'local_cd'      => $data['local_cd'],
                    'cust_cd'       => $data['cust_cd'],
                    'ord_no'        => $data['ord_no'],
                    'ord_seq'       => $i+1,
                    'ord_bseq'      => $data['ord_bseq'],
                    'lot'           => $data['ord_no'].sprintf('%03d',$i+1),
                    'item_cd'       => trim($data['item_cd'][$i]),
                    'item_nm'       => trim($data['item_nm'][$i]),
                    'ord_spec'      => trim(json_encode($spec[$i])),
                    'ord_qty'       => trim($data['ord_qty'][$i]),
                    'unit_amt'      => trim($data['unit_amt'][$i]),
                    'ord_amt'       => trim($data['ord_amt'][$i]),
                    'tax_amt'       => trim($data['tax_amt'][$i]),
                    'memo'          => trim($data['ord_memo'][$i]),
                    'reg_ikey'      => $this->session->userdata['ikey'],
                    'reg_ip'        => $this->input->ip_address()
                );
            }
        }
        $this->db->trans_begin();
        $this->db->insert('buy_master', $reg);
        $this->db->insert_batch('buy_detail', $detail);
        $this->Buy_pay_m->acc_insert($reg['ord_dt'], array_merge($reg, $data, $detail)); // 발주 회계 등록
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
     * @description 구매 발주 수정
     */
    public function update_batch($mod, $data, $where)
    {
        for ($i=0; $i < count($data['item_cd']); $i++) 
        {
            // 품목 값이 있을경우만 등록
            if (!empty(trim($data['item_cd'][$i]))) 
            { 
                $spec[] = array(
                    'size' => $data['size'][$i],
                    'unit' => $data['unit'][$i]
                );
                $detail[] = array(
                    'local_cd'      => $data['local_cd'],
                    'cust_cd'       => $data['cust_cd'],
                    'ord_no'        => $data['ord_no'],
                    'ord_seq'       => $i+1,
                    'ord_bseq'      => $data['ord_bseq'],
                    'lot'           => $data['ord_no'].sprintf('%03d',$i+1),
                    'item_cd'       => trim($data['item_cd'][$i]),
                    'item_nm'       => trim($data['item_nm'][$i]),
                    'ord_spec'      => trim(json_encode($spec[$i])),
                    'ord_qty'       => trim($data['ord_qty'][$i]),
                    'unit_amt'      => trim($data['unit_amt'][$i]),
                    'ord_amt'       => trim($data['ord_amt'][$i]),
                    'tax_amt'       => trim($data['tax_amt'][$i]),
                    'memo'          => trim($data['ord_memo'][$i]),
                    'reg_ikey'      => $this->session->userdata['ikey'],
                    'reg_ip'        => $this->input->ip_address()
                ); 
            }
        }

        // 발주 마스터 업데이트 - 발주 상세는 삭제 후 재등록. 
        $this->db->trans_begin();
        $this->db->update('buy_master', $mod, $where);
        $this->db->delete('buy_detail', $where);
        $this->db->insert_batch('buy_detail', $detail);

        // 발주 거래처코드가 동일할 경우 [회계 반영]
        if($data['cust_cd'] == $data['ori_cust_cd'])
        {
            $this->Buy_pay_m->acc_update(array_merge($mod, $data)); // 발주 회계 수정
        }
        else
        {
            $this->Common_m->real_del('buy_acc_list', array('ord_no'=>$data['ord_no']));    // 회계 삭제 후 신규등록
            $this->Buy_pay_m->acc_insert($mod['ord_dt'], array_merge($mod, $data, $detail));
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
     * @description 구매 확정 - update
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
                    'sysyn'     => $data['sysyn'],
                    'mod_ikey'  => $data['mod_ikey'],
                    'mod_ip'    => $data['mod_ip'],
                    'mod_dt'    => $data['today']
                ); 
            }
        }
        $this->db->trans_begin();
        $this->db->update_batch('buy_master', $modify, 'ikey');
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
