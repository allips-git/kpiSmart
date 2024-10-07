<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 온라인 주문 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/18
 */
class Ord_list_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
        $this->load->model('acc/Ord_pay_m');
        $this->encrypt_key = $this->config->item('encrypt_key');
    }

    /**
     * @description 온라인 주문 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 날짜
     * @return buy list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT m.ikey, m.local_cd, m.cust_cd, m.cust_nm, m.biz_nm
                    , m.ord_no, m.ord_dt
                    , (SELECT COUNT(DISTINCT mall_nm) FROM ord_detail WHERE ord_no = d.ord_no AND NOT mall_nm IS NULL AND mall_nm != "") AS mall_cnt
                    , (SELECT mall_nm FROM ord_detail WHERE ord_no = d.ord_no ORDER BY ord_seq ASC LIMIT 1) AS mall_nm
                    , (SELECT item_nm FROM ord_detail WHERE ord_no = d.ord_no ORDER BY ord_seq ASC LIMIT 1) AS item_nm
                    , (SELECT COUNT(*) FROM ord_detail WHERE ord_no = d.ord_no) AS ord_cnt
                    , MAX(d.ord_seq) AS ord_seq, IFNULL(SUM(d.ord_qty), 0) AS ord_qty
                    , IFNULL(SUM(d.ord_amt), 0) AS ord_amt, IFNULL(SUM(d.tax_amt), 0) AS tax_amt, m.state, m.finyn
                    FROM ord_master AS m
                    INNER JOIN (SELECT @rownum := 0) r
                    INNER JOIN ord_detail AS d ON (m.local_cd = d.local_cd AND m.ord_no = d.ord_no)
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
     * @description 온라인 주문 상세 조회
     * @param 공장코드, 주문번호
     * @return ord detail
     */
    public function get_detail($data)
    {
        $sql   = 'SET @encrypt_key := ?';
        $query = $this->db->query($sql, array((string)$this->encrypt_key));

                # 주문 마스터 정보
        $sql = 'SELECT m.ikey, m.local_cd, m.cust_cd, m.cust_nm, m.biz_nm 
                , CONVERT(AES_DECRYPT(UNHEX(b.tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS tel
                , CONVERT(AES_DECRYPT(UNHEX(b.ceo_nm), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS ceo_nm
                , CONVERT(AES_DECRYPT(UNHEX(b.ceo_tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS ceo_tel
                , m.ord_no, m.ord_dt, m.vat, m.memo, m.state, m.finyn, b.cust_gb

                # 주문 상세 정보
                , d.mall_nm, IFNULL(CONVERT(AES_DECRYPT(UNHEX(d.client_nm), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8), "") AS client_nm
                , IFNULL(CONVERT(AES_DECRYPT(UNHEX(d.client_tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8), "") AS client_tel
                , IFNULL(CONVERT(AES_DECRYPT(UNHEX(d.dlv_zip), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8), "") AS dlv_zip
                , IFNULL(CONVERT(AES_DECRYPT(UNHEX(d.address), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8), "") AS address
                , IFNULL(CONVERT(AES_DECRYPT(UNHEX(d.addr_detail), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8), "") AS addr_detail
                , d.dlv_gb, dlv.code_nm AS dlv_nm, d.addr_text, d.ord_seq, d.ord_bseq, m.ord_dt, MIN(d.item_nm) AS item_nm, MAX(d.ord_seq) AS ord_seq
                , d.lot, d.item_cd, d.item_nm
                , JSON_UNQUOTE(JSON_EXTRACT(d.ord_spec, "$.size")) AS size
                , JSON_UNQUOTE(JSON_EXTRACT(d.ord_spec, "$.unit")) AS unit, c.code_nm
                , IFNULL(d.ord_qty, 0) AS ord_qty, IFNULL(d.sale_amt, 0) AS sale_amt
                , IFNULL(SUM(d.ord_amt), 0) AS ord_amt, IFNULL(SUM(d.tax_amt), 0) AS tax_amt, d.memo AS ord_memo
                FROM ord_master AS m
                    INNER JOIN ord_detail AS d ON (m.local_cd = d.local_cd AND m.ord_no = d.ord_no)
                    INNER JOIN biz_list AS b ON (m.local_cd = b.local_cd AND m.cust_cd = b.cust_cd)
                    INNER JOIN z_plan.common_code AS c 
                    ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(d.ord_spec, "$.unit")) = c.code_sub) # 공통코드 - 단위
                    INNER JOIN z_plan.common_code AS dlv ON (dlv.code_gb ="DI" AND dlv.code_main = "010" AND d.dlv_gb = dlv.code_sub) # 배송구분
                WHERE m.local_cd = ? AND m.ord_no = ?
                GROUP BY d.ord_no, d.ord_seq, d.ord_bseq';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ord_no']));
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
                # 미수금액 장부
                , IFNULL((SELECT SUM(amt+tax) FROM ord_acc_list 
                          WHERE cust_cd = a.cust_cd AND `work` = "IN" AND useyn = "Y" AND delyn = "N"), 0)  AS in_amt
                , IFNULL((SELECT SUM(amt+tax) FROM ord_acc_list 
                          WHERE cust_cd = a.cust_cd AND `work` = "OUT" AND useyn = "Y" AND delyn = "N"), 0) AS out_amt
                FROM ord_acc_list AS a
                WHERE a.local_cd = @local_cd AND a.cust_cd = @cust_cd
                GROUP BY a.cust_cd';
        $query = $this->db->query($sql);
        return $query->row();
    }

    /**
     * @description 온라인 주문 등록
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
                    'mall_nm'       => !empty($data['mall_nm'][$i])     ? $data['mall_nm'][$i] : '',
                    'client_nm'     => !empty($data['client_nm'][$i])   ? $this->encryption($data['client_nm'][$i]) : '',
                    'client_tel'    => !empty($data['client_tel'][$i])  ? $this->encryption($data['client_tel'][$i]) : '',
                    'dlv_gb'        => trim($data['dlv_gb'][$i]),
                    'dlv_zip'       => !empty($data['dlv_zip'][$i])     ? $this->encryption($data['dlv_zip'][$i]) : '',
                    'address'       => !empty($data['address'][$i])     ? $this->encryption($data['address'][$i]) : '',
                    'addr_detail'   => !empty($data['addr_detail'][$i]) ? $this->encryption($data['addr_detail'][$i]) : '',
                    'addr_text'     => trim($data['addr_text'][$i]),
                    'ord_no'        => $data['ord_no'],
                    'ord_seq'       => $i+1,
                    'ord_bseq'      => $data['ord_bseq'],
                    'lot'           => $data['ord_no'].sprintf('%04d',$i+1),
                    'item_cd'       => trim($data['item_cd'][$i]),
                    'item_nm'       => trim($data['item_nm'][$i]),
                    'ord_spec'      => trim(json_encode($spec[$i])),
                    'ord_qty'       => trim($data['ord_qty'][$i]),
                    'sale_amt'      => trim($data['sale_amt'][$i]),
                    'ord_amt'       => trim($data['ord_amt'][$i]),
                    'tax_amt'       => trim($data['tax_amt'][$i]),
                    'memo'          => trim($data['ord_memo'][$i]),
                    'reg_ikey'      => $this->session->userdata['ikey'],
                    'reg_ip'        => $this->input->ip_address()
                );
            }
        }
        $this->db->trans_begin();
        $this->db->insert('ord_master', $reg);
        $this->db->insert_batch('ord_detail', $detail);
        $this->Ord_pay_m->acc_insert($reg['ord_dt'], array_merge($reg, $data, $detail)); // 주문 회계 등록
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
     * @description 주문 수정
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
                    'mall_nm'       => !empty($data['mall_nm'][$i])     ? $data['mall_nm'][$i] : '',
                    'client_nm'     => !empty($data['client_nm'][$i])   ? $this->encryption($data['client_nm'][$i]) : '',
                    'client_tel'    => !empty($data['client_tel'][$i])  ? $this->encryption($data['client_tel'][$i]) : '',
                    'dlv_gb'        => trim($data['dlv_gb'][$i]),
                    'dlv_zip'       => !empty($data['dlv_zip'][$i])     ? $this->encryption($data['dlv_zip'][$i]) : '',
                    'address'       => !empty($data['address'][$i])     ? $this->encryption($data['address'][$i]) : '',
                    'addr_detail'   => !empty($data['addr_detail'][$i]) ? $this->encryption($data['addr_detail'][$i]) : '',
                    'addr_text'     => trim($data['addr_text'][$i]),
                    'ord_no'        => $data['ord_no'],
                    'ord_seq'       => $i+1,
                    'ord_bseq'      => $data['ord_bseq'],
                    'lot'           => $data['ord_no'].sprintf('%04d',$i+1),
                    'item_cd'       => trim($data['item_cd'][$i]),
                    'item_nm'       => trim($data['item_nm'][$i]),
                    'ord_spec'      => trim(json_encode($spec[$i])),
                    'ord_qty'       => trim($data['ord_qty'][$i]),
                    'sale_amt'      => trim($data['sale_amt'][$i]),
                    'ord_amt'       => trim($data['ord_amt'][$i]),
                    'tax_amt'       => trim($data['tax_amt'][$i]),
                    'memo'          => trim($data['ord_memo'][$i]),
                    'reg_ikey'      => $this->session->userdata['ikey'],
                    'reg_ip'        => $this->input->ip_address()
                );
            }
        }

        // 주문 마스터 업데이트 - 주문 상세는 삭제 후 재등록. 
        $this->db->trans_begin();
        $this->db->update('ord_master', $mod, $where);
        $this->db->delete('ord_detail', $where);
        $this->db->insert_batch('ord_detail', $detail);

        // 주문 거래처코드가 동일할 경우 [회계 반영]
        if($data['cust_cd'] == $data['ori_cust_cd'])
        {
            $this->Ord_pay_m->acc_update(array_merge($mod, $data)); // 회계 수정
        }
        else
        {
            $this->Common_m->real_del('ord_acc_list', array('ord_no'=>$data['ord_no']));    // 회계 삭제 후 신규등록
            $this->Ord_pay_m->acc_insert($mod['ord_dt'], array_merge($mod, $data, $detail));
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
     * @description 주문 확정 - update
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
        $this->db->update_batch('ord_master', $modify, 'ikey');
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
     * @description 주문 일괄 등록(엑셀)
     */
    public function insert_excel($reg, $data)
    {
        $total_amt = 0;
        $total_tax = 0;
        for ($i=0; $i < count($data); $i++)
        {
            // 제품 값이 있을경우만 등록
            if (!empty(trim($data[$i]['item_cd']))) 
            {
                // 유효한 제품코드인지 검사
                if ($this->Common_m->get_column_count('item_list', array('item_cd' => $data[$i]['item_cd'])) > 0)
                {
                    // 거래처 상세 정보
                    $biz = $this->Common_m->get_row('biz_list', array('cust_cd' => $reg['cust_cd']));

                    // 제품 상세 정보
                    $item = $this->Common_m->get_row('item_list', array('item_cd' => $data[$i]['item_cd']));
                    $spec = array('size' => $item->size, 'unit' => $item->unit);

                    // 주문 상세
                    $base_amt = str_replace(',', '', $this->base_amt("amt1", $item));
                    $sale_amt = str_replace(',', '', $this->base_amt($biz->cust_grade, $item));
                    // 등급 단가가 0원 이상일 경우만 등급단가 적용. 아닐경우 기본 판매단가로 단가 책정
                    $sale_amt = ($sale_amt > 0) ? $sale_amt : $base_amt;
                    $ord_qty = !empty($data[$i]['ord_qty']) ? $data[$i]['ord_qty'] : 1;
                    $tax_amt = ($biz->vat == "N") ? $sale_amt * 0.1 : 0;
                    $detail[] = array(
                        'local_cd'      => $reg['local_cd'],
                        'cust_cd'       => $reg['cust_cd'],
                        'mall_nm'       => !empty($data[$i]['mall_nm'])     ? $data[$i]['mall_nm'] : '',
                        'client_nm'     => !empty($data[$i]['client_nm'])   ? $this->encryption($data[$i]['client_nm']) : '',
                        'client_tel'    => !empty($data[$i]['client_tel'])  ? $this->encryption($data[$i]['client_tel']) : '',
                        'dlv_gb'        => "002",
                        'dlv_zip'       => !empty($data[$i]['dlv_zip'])     ? $this->encryption($data[$i]['dlv_zip']) : '',
                        'address'       => !empty($data[$i]['address'])     ? $this->encryption($data[$i]['address']) : '',
                        'addr_detail'   => !empty($data[$i]['addr_detail']) ? $this->encryption($data[$i]['addr_detail']) : '',
                        'addr_text'     => trim($data[$i]['addr_text']),
                        'ord_no'        => $reg['ord_no'],
                        'ord_seq'       => $i+1,
                        'ord_bseq'      => 1,
                        'lot'           => $reg['ord_no'].sprintf('%04d',$i+1),
                        'item_cd'       => trim($data[$i]['item_cd']),
                        'item_nm'       => $item->item_nm,
                        'ord_spec'      => json_encode($spec),
                        'ord_qty'       => trim($data[$i]['ord_qty']),
                        'sale_amt'      => $base_amt,
                        'ord_amt'       => trim($data[$i]['ord_amt']),
                        'tax_amt'       => '0', // 부가세 설정은 면세 고정값이므로 세액은 0으로 고정값 지정(협의사항 2022/10/12)
                        'reg_ikey'      => $this->session->userdata['ikey'],
                        'reg_ip'        => $this->input->ip_address()
                    );
                    $total_amt += $data[$i]['ord_amt'];
                    $total_tax += 0;
                }
                else
                {
                    log_message('debug', 'excel upload fail item_cd:'.$data[$i]['item_cd']);
                }
            }
        }
        // 총 회계 데이터 추가
        $amt = array(
            'total_amt' => $total_amt,
            'total_tax' => $total_tax
        );
        $this->db->trans_begin();
        $this->db->insert('ord_master', $reg);
        $this->db->insert_batch('ord_detail', $detail);
        $this->Ord_pay_m->acc_insert($reg['ord_dt'], array_merge($reg, $data, $detail, $amt)); // 주문 회계 등록
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
     * @description 암호화 간소화 함수
     */
    public function encryption($param)
    {
        return $this->common->custom_encrypt($param, $this->encrypt_key, 'AES-128-ECB');
    }

    /**
     * @description 제품별 단가 확인 함수
     */
    public function base_amt($grade, $item)
    {
        $amt = 0;
        if ($grade == "amt1")
        {
            $amt = $item->sale_amt;
        }
        else if ($grade == "amt2")
        {
            $amt = $item->unit_amt_1;
        }
        else if ($grade == "amt3")
        {
            $amt = $item->unit_amt_2;
        }
        else if ($grade == "amt4")
        {
            $amt = $item->unit_amt_3;
        }
        else if ($grade == "amt5")
        {
            $amt = $item->unit_amt_4;
        }
        else
        {
            $amt = $item->sale_amt;
        }
        return $amt;
    }
    
}
