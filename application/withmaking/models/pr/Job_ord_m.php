<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 제조 오더 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date 2022/08/19
 */
class Job_ord_m extends CI_Model {
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 제조 오더 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 검색 날짜
     * @return job ord list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT m.ikey, m.local_cd, m.job_no, m.job_dt, m.item_cd, i.item_nm, i.item_gb, gb.code_nm
                    , m.job_qty, m.state, w.wp_nm, i.size, i.unit, c.code_nm AS unit_nm
                    , IFNULL((SELECT SUM(qty) FROM work_history WHERE local_cd = d.local_cd AND job_no = d.job_no AND lot = d.lot), 0) AS work_cnt
                    FROM job_master AS m
                    INNER JOIN (SELECT @rownum := 0) r
                    INNER JOIN job_detail AS d ON (m.local_cd = d.local_cd AND m.job_no = d.job_no)
                    INNER JOIN work_place AS w ON (m.local_cd = w.local_cd AND m.wp_uc = w.wp_uc)
                    INNER JOIN item_list AS i ON (m.local_cd = i.local_cd AND m.item_cd = i.item_cd)
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb ="BA" AND c.code_main = "060" AND i.unit = c.code_sub)         # 공통코드 - 단위
                    INNER JOIN z_plan.common_code AS gb ON (gb.code_gb ="BA" AND gb.code_main = "080" AND i.item_gb = gb.code_sub)  # 제품유형
                    WHERE m.local_cd = ? AND m.useyn = "Y" AND m.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") 
                        AND (m.job_dt >= "'.$data['start_dt'].'" AND m.job_dt <= "'.$data['end_dt'].'") 
                        AND m.state LIKE CONCAT("%", ? ,"%")
                    GROUP BY m.job_no
                    ORDER BY m.job_dt ASC, m.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content'], (string)$data['state']));
        return $query->result();
    }

    /**
     * @description 제조 오더 상세 조회
     * @param 공장코드, 제조오더번호
     * @return job ord detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT m.ikey, m.local_cd, m.job_no, m.job_dt, m.item_cd, m.item_nm, m.job_id, m.job_pw, m.con_nm
                    , JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.size")) AS size
                    , JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.unit")) AS unit, c.code_nm AS unit_nm, m.wp_uc, m.job_qty
                    , m.fac_text, m.memo, m.state
                    , d.pp_uc, p.pp_cd, p.pp_gb, gb.code_nm AS pp_gb_nm, d.pp_nm, d.pp_seq, d.pp_hisyn
                    , (
                        CASE d.pp_hisyn
                            WHEN "Y" THEN "사용"
                            WHEN "N" THEN "미사용"
                        END) AS hisyn_nm
                    , d.plan_cnt, d.ul_uc, d.plan_time, d.plan_num, d.memo AS sub_memo
                    FROM job_master AS m
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN job_detail AS d ON (m.local_cd = d.local_cd AND m.job_no = d.job_no)
                        INNER JOIN prod_proc AS p ON (d.local_cd = p.local_cd AND d.pp_uc = p.pp_uc)
                        INNER JOIN z_plan.common_code AS c 
                        ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.unit")) = c.code_sub)      # 공통코드 - 단위
                        INNER JOIN z_plan.common_code AS gb ON (gb.code_gb ="PR" AND gb.code_main = "040" AND p.pp_gb = gb.code_sub)    # 공정유형
                    WHERE m.local_cd = ? AND m.job_no = ?
                    ORDER BY d.ikey ASC) AS sub
                ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['job_no']));
        return $query->result();
    }

    /**
     * @description 제품별 BOM 공정 등록 리스트
     * @param 공장코드, 제품코드
     * @return list
     */
    public function get_proc_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT m.ikey, d.ikey AS sub_ikey, m.local_cd, m.bom_uc, m.pc_uc, m.item_cd
                    , d.pp_uc, p.pp_cd, p.pp_gb, p.pp_nm, c.code_nm, pd.pr_seq, p.pp_hisyn
                    , (
                        CASE p.pp_hisyn
                            WHEN "Y" THEN "사용"
                            WHEN "N" THEN "미사용"
                        END) AS hisyn_nm
                    FROM bom_master AS m
                        INNER JOIN (SELECT @rownum := 0) r
                        INNER JOIN bom_detail AS d ON (m.local_cd = d.local_cd AND m.bom_uc = d.bom_uc)
                        INNER JOIN proc_detail AS pd ON (m.local_cd = pd.local_cd AND m.pc_uc = pd.pc_uc AND d.pp_uc = pd.pp_uc)
                        INNER JOIN prod_proc AS p ON (m.local_cd = p.local_cd AND d.pp_uc = p.pp_uc)
                        INNER JOIN z_plan.common_code AS c ON (c.code_gb ="PR" AND c.code_main = "040" AND p.pp_gb = c.code_sub) # 공정유형
                WHERE m.local_cd = ? AND m.item_cd = ?
                AND m.useyn = "Y" AND m.delyn = "N"
                GROUP BY pp_uc
                ORDER BY pd.pr_seq ASC, p.pp_nm ASC) AS sub
            ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['item_cd']));
        return $query->result();
    }

    /**
     * @description 작업 담당자 리스트
     * @param 공장코드
     * @return list
     */
    public function get_item_list($data) {
        $sql = 'SELECT * FROM item_list WHERE local_cd = ? AND item_cd = ?';
        $query = $this->db->query($sql, array($data['local_cd'], $data['itemCd']));
        return $query->result();
    }

    public function get_user_list($data)
    {
        $sql = 'SELECT u.ikey, u.ul_uc, u.id, u.ul_nm
                FROM z_plan.user_list AS u
                WHERE u.local_cd = ? AND u.ul_gb = "002" # 사원유형 - 생산직
                AND u.useyn = "Y" AND u.delyn = "N"
                ORDER BY u.ul_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd']));
        return $query->result();
    }


    /**
     * @description 제조 오더 등록
     */
    public function insert_batch($reg, $data)
    {
        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        for ($i=0; $i < count($data['pp_uc']); $i++) 
        {
            // 공정 코드 있을경우만 등록
            if (!empty(trim($data['pp_uc'][$i]))) 
            { 
                $user = $this->Common_m->get_row('z_plan.user_list', array('ul_uc' => $data['ul_uc'][$i]));
                $detail[] = array(
                    'local_cd'      => $data['local_cd'],
                    'job_no'        => $data['job_no'],
                    'lot'           => $data['job_no'].sprintf('%03d',$i+1),
                    'pc_uc'         => $data['pc_uc'],
                    'job_id'        => $data['job_id'],
                    'job_pw'        => $data['job_pw'],
                    'con_nm'        => $data['con_nm'],
                    'pp_uc'         => trim($data['pp_uc'][$i]),
                    'pp_nm'         => trim($data['pp_nm'][$i]),
                    'pp_seq'        => trim($data['pp_seq'][$i]),
                    'pp_hisyn'      => trim($data['pp_hisyn'][$i]),
                    'plan_cnt'      => trim($data['plan_cnt'][$i]),
                    'plan_time'     => trim($data['plan_time'][$i]),
                    'plan_num'      => trim($data['plan_num'][$i]),
                    'ul_uc'         => trim($data['ul_uc'][$i]),
                    'ul_nm'         => trim($user->ul_nm),
                    'memo'          => trim($data['sub_memo'][$i]),
                    'reg_ikey'      => $this->session->userdata['ikey'],
                    'reg_ip'        => $this->input->ip_address()
                );
            }
        }
        $this->db->trans_begin();
        try {
            $this->db->insert('job_master', $reg);
            $this->db->insert_batch('job_detail', $detail);
    
            // BOM 업데이트
            $this->db->update('bom_master', $array, array('item_cd' => $reg['item_cd']));
    
            if ($this->db->trans_status() === FALSE) {
                throw new Exception('Transaction failed');
            }
    
            $this->db->trans_commit();
            return true;
        } catch (Exception $e) {
            $this->db->trans_rollback();
    
            // 데이터베이스 오류 정보 캡처 및 반환
            $db_error = $this->db->error();
            return ['error' => $db_error, 'message' => $e->getMessage()];
        }
    }

    /**
     * @description 제조 오더 수정
     */
    public function update_batch($mod, $data, $where)
    {
        for ($i=0; $i < count($data['pp_uc']); $i++) 
        {
            // 공정 코드 있을경우만 수정
            if (!empty(trim($data['pp_uc'][$i]))) 
            {
                $user = $this->Common_m->get_row('z_plan.user_list', array('ul_uc' => $data['ul_uc'][$i]));
                $detail[] = array(
                    'local_cd'      => $data['local_cd'],
                    'job_no'        => $data['job_no'],
                    'lot'           => $data['job_no'].sprintf('%03d',$i+1),
                    'pc_uc'         => $data['pc_uc'],
                    'job_id'        => $data['job_id'],
                    'job_pw'        => $data['job_pw'],
                    'con_nm'        => $data['con_nm'],
                    'pp_uc'         => trim($data['pp_uc'][$i]),
                    'pp_nm'         => trim($data['pp_nm'][$i]),
                    'pp_seq'        => trim($data['pp_seq'][$i]),
                    'pp_hisyn'      => trim($data['pp_hisyn'][$i]),
                    'plan_cnt'      => trim($data['plan_cnt'][$i]),
                    'plan_time'     => trim($data['plan_time'][$i]),
                    'plan_num'      => trim($data['plan_num'][$i]),
                    'ul_uc'         => trim($data['ul_uc'][$i]),
                    'ul_nm'         => trim($user->ul_nm),
                    'memo'          => trim($data['sub_memo'][$i]),
                    'reg_ikey'      => $this->session->userdata['ikey'],
                    'reg_ip'        => $this->input->ip_address(),
                    'mod_ikey'      => $this->session->userdata['ikey'],
                    'mod_ip'        => $this->input->ip_address(),
                    'mod_dt'        => date("Y-m-d H:i:s")
                );
            }
        }

        // 마스터 업데이트 - 상세는 삭제 후 재등록. 
        $this->db->trans_begin();
        $this->db->update('job_master', $mod, $where);
        $this->db->delete('job_detail', $where);
        $this->db->insert_batch('job_detail', $detail);
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
     * @description 제조 오더 확정 - update
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
        $this->db->update_batch('job_master', $modify, 'ikey');
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
