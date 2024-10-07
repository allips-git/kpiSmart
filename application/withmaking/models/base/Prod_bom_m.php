<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description BOM 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/05
 */
class Prod_bom_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description BOM 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 가용여부
     * @return bom list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT m.ikey, m.local_cd, m.item_cd, i.item_gb, i.item_nm
                    , i.size, i.unit, c.code_nm AS unit_nm, gb.code_nm AS item_gb_nm, m.memo, m.useyn
                    , IFNULL((SELECT COUNT(*) FROM bom_detail WHERE local_cd = m.local_cd AND bom_uc = m.bom_uc), 0) AS bom_cnt     # BOM카운터
                    , IFNULL((SELECT COUNT(DISTINCT pp_uc) FROM bom_detail WHERE local_cd = m.local_cd AND bom_uc = m.bom_uc), 0) AS pc_cnt  # 공정카운터
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, m.reg_dt
                    , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, m.mod_dt
                    FROM bom_master AS m
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN bom_detail AS d ON (m.local_cd = d.local_cd AND m.bom_uc = d.bom_uc)
                        INNER JOIN item_list AS i ON (m.local_cd = i.local_cd AND m.item_cd = i.item_cd)
                        INNER JOIN z_plan.common_code AS c ON (c.code_gb ="BA" AND c.code_main = "060" AND i.unit = c.code_sub)         # 공통코드 - 단위
                        INNER JOIN z_plan.common_code AS gb ON (gb.code_gb ="BA" AND gb.code_main = "080" AND i.item_gb = gb.code_sub)  # 품목유형
                        LEFT JOIN z_plan.user_list AS u1 ON(u1.ikey = m.reg_ikey)
                        LEFT JOIN z_plan.user_list AS u2 ON(u2.ikey = m.mod_ikey)
                    WHERE m.local_cd = ? AND m.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") AND m.useyn LIKE CONCAT("%", ? ,"%")
                    GROUP BY m.local_cd, m.bom_uc
                    ORDER BY m.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content'], (string)$data['useyn']));
        return $query->result();
    }

    /**
     * @description BOM 상세 조회
     * @param 공장코드, ikey
     * @return bom detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT m.ikey, d.ikey AS sub_ikey, m.local_cd, m.bom_uc, m.pc_uc, m.item_cd, m.memo, pc.pc_nm, d.pp_nm, pd.pr_seq
                    , d.pp_uc, d.item_cd AS sub_item_cd, i.item_nm, bi.item_nm AS sub_item_nm, bi.size, bi.unit, bi.unit_amt
                    , c.code_nm AS unit_nm, gb.code_nm AS item_gb_nm, d.usage
                    , d.memo AS sub_memo, m.sysyn, d.useyn, w.wh_nm, dw.wh_nm AS detail_wh_nm
                    , IFNULL(d.usage * replace(bi.unit_amt, "," , ""), 0) AS amt # 소요원가 계산
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, m.reg_dt
                    , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, m.mod_dt
                    FROM bom_master AS m
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN bom_detail AS d ON (m.local_cd = d.local_cd AND m.bom_uc = d.bom_uc)
                        INNER JOIN item_list AS i ON (m.local_cd = i.local_cd AND m.item_cd = i.item_cd)
                        INNER JOIN item_list AS bi ON (m.local_cd = bi.local_cd AND d.item_cd = bi.item_cd)
                        INNER JOIN prod_proc AS p ON (m.local_cd = p.local_cd AND d.pp_uc = p.pp_uc)
                        INNER JOIN proc_master AS pc ON (m.local_cd = pc.local_cd AND m.pc_uc = pc.pc_uc)
                        INNER JOIN proc_detail AS pd ON (m.local_cd = pd.local_cd AND m.pc_uc = pd.pc_uc AND p.pp_uc = pd.pp_uc)
                        LEFT JOIN warehouse AS w ON (m.local_cd = w.local_cd AND i.wh_uc = w.wh_uc)
                        LEFT JOIN warehouse AS dw ON (m.local_cd = dw.local_cd AND bi.wh_uc = dw.wh_uc)
                        INNER JOIN z_plan.common_code AS c ON (c.code_gb ="BA" AND c.code_main = "060" AND bi.unit = c.code_sub)           # 공통코드 - 단위
                        INNER JOIN z_plan.common_code AS gb ON (gb.code_gb ="BA" AND gb.code_main = "080" AND bi.item_gb = gb.code_sub)    # 품목유형
                        LEFT JOIN z_plan.user_list AS u1 ON(u1.ikey = m.reg_ikey)
                        LEFT JOIN z_plan.user_list AS u2 ON(u2.ikey = m.mod_ikey)
                WHERE m.local_cd = ? AND m.item_cd = ?
                GROUP BY d.bom_uc, d.ikey
                ORDER BY pd.pr_seq ASC, d.pp_nm ASC) AS sub
            ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['item_cd']));
        return $query->result();
    }

    /**
     * @description 공정 리스트
     * @param 공장코드, 라우팅 코드, 검색 텍스트
     * @return proc list
     */
    public function get_proc_list($data)
    {
        $sql = 'SELECT p.ikey AS id, p.pp_nm AS `text`
                FROM proc_detail AS d
                INNER JOIN prod_proc AS p ON (d.local_cd = p.local_cd AND d.pp_uc = p.pp_uc)
                WHERE d.local_cd = ? AND d.pc_uc = ? AND p.pp_nm LIKE CONCAT("%", ? ,"%")
                AND d.useyn = "Y" AND d.delyn = "N"
                GROUP BY p.ikey
                ORDER BY p.pp_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['pc_uc'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 원/부자재 상세 조회
     * @param 공장코드, ikey
     * @return item detail
     */
    public function get_item_detail($data)
    {
        $sql = 'SELECT i.ikey, i.local_cd, i.pd_cd, i.item_cd, i.proc_gb, i.item_gb, c.code_nm AS item_gb_nm
                , i.item_lv, i.item_nm, i.size, i.unit, cc.code_nm AS unit_nm
                , i.min_size, i.unit_amt, i.sale_amt, i.unit_amt_1, i.unit_amt_2, i.unit_amt_3, i.unit_amt_4, i.unit_amt_5
                , i.wh_uc, i.safe_qty, i.memo, i.useyn, i.delyn
                FROM item_list AS i
                    INNER JOIN item_code AS c ON (c.ikey = i.item_lv)
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb = "BA" AND c.code_main = "080" AND c.code_sub = i.item_gb) # 제품유형
                    INNER JOIN z_plan.common_code AS cc ON (cc.code_gb ="BA" AND cc.code_main = "060" AND i.unit = cc.code_sub) # 공통코드 - 단위
                WHERE i.local_cd = ? AND i.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

    /**
     * @description BOM 등록
     */
    public function insert_batch($reg, $data)
    {
        for ($i=0; $i < count($data['pp_uc']); $i++) 
        {
            // 공정코드 값이 있을경우만 등록
            if (!empty(trim($data['pp_uc'][$i]))) 
            {
                $detail[] = array(
                    'local_cd'      => $data['local_cd'],
                    'bom_uc'        => $data['bom_uc'],
                    'pp_uc'         => trim($data['pp_uc'][$i]),
                    'pp_nm'         => trim($data['pp_nm'][$i]),
                    'item_cd'       => trim($data['item_cd'][$i]),
                    'usage'         => trim($data['usage'][$i]),
                    'memo'          => trim($data['memo'][$i]),
                    'reg_ikey'      => $this->session->userdata['ikey'],
                    'reg_ip'        => $this->input->ip_address()
                );
                // 사용된 원/부자재 sysyn="Y"로 업데이트
                $item[] = array(
                    'item_cd'   => trim($data['item_cd'][$i]),
                    'sysyn'     => 'Y',
                    'mod_ikey'  => $this->session->userdata['ikey'],
                    'mod_ip'    => $this->input->ip_address(),
                    'mod_dt'    => date("Y-m-d H:i:s")
                );
            }
        }
        $this->db->trans_begin();
        $this->db->insert('bom_master', $reg);
        $this->db->insert_batch('bom_detail', $detail);
        $this->db->update_batch('item_list', $item, 'item_cd');
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
     * @description BOM 수정
     */
    public function update_batch($mod, $data, $where)
    {
        for ($i=0; $i < count($data['pp_uc']); $i++) 
        {
            // 공정코드 값이 있을경우만 등록
            if (!empty(trim($data['pp_uc'][$i]))) 
            {
                $detail[] = array(
                    'local_cd'  => $data['local_cd'],
                    'bom_uc'    => $data['bom_uc'],
                    'pp_uc'     => trim($data['pp_uc'][$i]),
                    'pp_nm'     => trim($data['pp_nm'][$i]),
                    'item_cd'   => trim($data['item_cd'][$i]),
                    'usage'     => trim($data['usage'][$i]),
                    'memo'      => trim($data['sub_memo'][$i]),
                    'reg_ikey'  => $this->session->userdata['ikey'],
                    'reg_ip'    => $this->input->ip_address(),
                    'mod_ikey'  => $this->session->userdata['ikey'],
                    'mod_ip'    => $this->input->ip_address(),
                    'mod_dt'    => date("Y-m-d H:i:s")
                );
                // 사용된 원/부자재 sysyn="Y"로 업데이트
                $item[] = array(
                    'item_cd'   => trim($data['item_cd'][$i]),
                    'sysyn'     => 'Y',
                    'mod_ikey'  => $this->session->userdata['ikey'],
                    'mod_ip'    => $this->input->ip_address(),
                    'mod_dt'    => date("Y-m-d H:i:s")
                );
            }
        }
        $this->db->trans_begin();
        $this->db->update('bom_master', $mod, $where);
        $this->db->delete('bom_detail', $where);
        $this->db->insert_batch('bom_detail', $detail);
        $this->db->update_batch('item_list', $item, 'item_cd');
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
