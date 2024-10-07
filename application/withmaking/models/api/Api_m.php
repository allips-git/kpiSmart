<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 안드로이드 API 모델
 * @author 안성준, @version 1.0, @last date 2022/09/05
 */ 
class Api_m extends CI_Model {

     protected $table = 'z_plan.user_list';
     
     public function __construct()
     {
          parent::__construct();
          $this->encrypt_key = $this->config->item('encrypt_key');
     }

     /**
     * @description users validation
     * @param  $id, $password
     * @return result count
     */
     public function check_users($users)
     {
          $this->db->where($users);

          return $this->db->count_all_results("z_plan.user_list");
     }

     /**
     * @description user info all
     * @param  $id
     * @return result user row
     */
     public function select_user($id, $pass, $ul_cd)
     {
          $sql = 'SELECT u.local_cd, u.id, u.ikey,u.ul_uc, u.ul_nm, u.tel, u.email, u.biz_code, u.address, u.addr_detail 
                    FROM z_plan.user_list AS u
                    WHERE u.id = ? AND u.pass = ? AND u.ul_cd = ?';
          $query = $this->db->query($sql, array((string)$id, (string)$pass, (string)$ul_cd));
          return $query->row();
     }

     /**
     * @description user info all
     * @param  $id
     * @return result user row
     */
     public function select_users_all($id, $ul_cd)
     {
          $sql = '  SELECT u.ikey, u.local_cd, u.ul_nm, u.id, u.ul_uc
                    , u.dp_uc, u.useyn, f.fa_nm , f.item
                    FROM z_plan.user_list AS u
                         INNER JOIN z_plan.factory AS f ON u.local_cd = f.local_cd
                    WHERE u.id = ? AND u.ul_cd = ? AND u.useyn = "Y"';
          $query = $this->db->query($sql, array((string)$id, (string)$ul_cd));
          return $query->row();
     }

     /**
     * @description 최종 로그인 날짜 갱신
     * @param  $ikey
     */
     /*public function update_login_dt($ikey)
     {
          $this->db->where('ikey', $ikey);
          
          $this->db->set('last_dt', 'now()', false);
          $this->db->set('login_cnt', 'login_cnt + 1', false);
          $this->db->update($this->table);
     }*/


     public function start_work_state($where_m, $where_d, $data_m, $data_d)
     {
          $this->db->trans_begin();
          $this->db->update('job_master', $data_m, $where_m);

          $this->db->set('start_dt', 'NOW()', false);
          $this->db->update('job_detail', $data_d, $where_d);
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
     * @description 작업 완료 API 함수
     */ 
    public function change_work_state($where, $data)
    {
        $this->db->trans_begin();

        // job_detail 작업완료일 경우
        $this->db->set('end_dt', 'NOW()', false);
        $this->db->update('job_detail', $data, $where);

        // job_master 업데이트 변수
        $var = array(
            'state'     => '004',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        // job_detail 전체 작업 완료시 job_master도 작업완료.
        if ($this->Common_m->get_column_count('job_detail', array('job_no' => $where['job_no'], 'job_st !=' => 'F')) == 0)
        {
            $this->db->update('job_master', $var, array('job_no' => $where['job_no']));
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
        // return $this->db->affected_rows();
    }

     /**
     * @description 업체 작업장 리스트
     * @param  $local_cd
     * @return result 작업장 정보들
     */
     public function select_work_place($data)
     {
          $sql = 'SELECT w.ikey, w.local_cd, w.wp_uc, w.wp_cd, w.wp_gb, w.wp_nm, w.wp_seq
                    FROM work_place AS w
                    WHERE w.local_cd = ?';
          $query = $this->db->query($sql, array((string)$data['local_cd']));
          return $query->result();
     }

     /**
     * @description 업체 작업 리스트
     * @param  $local_cd
     * @return result 작업자 정보들
     */
     public function select_worker($data)
     {
          $sql = 'SELECT u.ikey, u.ul_nm, u.ul_uc, u.id
                    FROM z_plan.user_list AS u
                    WHERE u.local_cd = ? AND u.ul_gb= "002"';
          $query = $this->db->query($sql, array((string)$data['local_cd']));
          return $query->result();
     }

     /**
     * @description 창고 리스트
     * @param  $local_cd
     * @return result 창고 정보들
     */
     public function select_warehouse($data)
     {
          $sql = 'SELECT w.ikey, w.wh_nm, w.wh_uc
                    FROM warehouse AS w
                    WHERE w.local_cd = ?';
          $query = $this->db->query($sql, array((string)$data['local_cd']));
          return $query->result();
     }

     /**
     * @description 비가동 사유 리스트
     * @param  $local_cd
     * @return result 작업장 정보들
     */
     public function select_unused_list($data)
     {
          $sql = 'SELECT u.nu_uc, u.nu_nm
                    FROM not_used AS u
                    WHERE u.local_cd = ? AND u.useyn = "Y"';
          $query = $this->db->query($sql, array((string)$data['local_cd']));
          return $query->result();
     }

     /**
     * @description 비가동중인 리스트 여부 확인
     */
     public function get_used_history_column_count($data)
     {
          $sql = 'SELECT * 
                    FROM used_history AS u
                    WHERE u.local_cd = ? AND u.job_no = ? AND u.lot = ? AND end_dt IS NULL
                    ORDER BY ikey DESC LIMIT 1';
          $query = $this->db->query($sql, array((string)$data['local_cd'],(string)$data['job_no'],(string)$data['lot']));
          return $query->row();
     }

     /**
     * @description 작업 관리 리스트
     * @param  $local_cd
     * @return result 작업 관련 정보들
     */    
    public function select_job_management_list($data)
     {
          $sql = 'SELECT m.ikey AS no, d.local_cd, d.ikey, d.job_no, d.job_st, d.lot, d.pp_uc, d.pp_nm, d.pp_seq
               , d.pp_hisyn, d.plan_cnt, d.plan_time, d.plan_num, d.ul_uc, d.ul_nm, d.job_st, d.memo
               , m.job_dt, m.item_cd, m.item_nm, m.job_qty, m.state, m.unit_amt, m.fac_text, m.memo AS fac_memo, c.code_nm, u.id
               , (SELECT SUM(qty) FROM work_history WHERE lot = d.lot) AS work_qty
               , IFNULL((
                    SELECT SUM(qty) 
                    FROM stock_history 
                    WHERE ord_no = d.job_no AND lot = d.lot AND `work` = "IN" AND details = "003"
                    AND useyn = "Y" AND delyn = "N"), 0) AS stock_qty
               , (SELECT wh_uc FROM item_list WHERE item_cd = m.item_cd) AS wh_uc
               , (
                    CASE d.job_st
                         WHEN "N" THEN "대기"
                         WHEN "P" THEN "진행"
                         WHEN "F" THEN "완료"
                         WHEN "S" THEN "비가동"
                    END) AS job_st
               , JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.size")) AS size
               , JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.unit")) AS unit
               FROM job_master AS m
               INNER JOIN job_detail AS d ON (m.local_cd = d.local_cd AND m.job_no = d.job_no)
               INNER JOIN z_plan.user_list AS u ON (d.ul_uc = u.ul_uc)
               INNER JOIN z_plan.common_code AS c 
                    ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.unit")) = c.code_sub)
               WHERE m.useyn = "Y" AND m.delyn = "N" AND d.job_st IN ("N", "P", "S") 
                    AND m.job_dt <= CURDATE() 
                    AND d.local_cd = ? AND m.wp_uc LIKE CONCAT("%",?,"%") AND d.ul_uc LIKE CONCAT("%",?,"%")
                    AND m.state IN ("002", "003")
                    AND d.pp_seq IN (SELECT MIN(pp_seq) FROM job_detail WHERE job_no = d.job_no AND job_st != "F") 
                #    AND d.pp_seq IN (SELECT MIN(pp_seq) FROM job_detail WHERE job_st != "F" GROUP BY job_no)
                #GROUP BY job_no
                ORDER BY no ASC';
                #ORDER BY d.job_no ASC, d.pp_seq ASC, d.ikey ASC';
          $query = $this->db->query($sql, array((string)$data['local_cd'],(string)$data['wp_uc'],(string)$data['ul_uc']));
          return $query->result();
     }

     /**
     * @description 작업 관리 상태 검색 리스트
     * @param  $local_cd
     * @return result 작업 관련 상태 검색 정보들
     */  
     public function select_job_st_management_list($data)
     {
          $sql = 'SELECT m.ikey AS no, d.local_cd, d.ikey, d.job_no, d.job_st, d.lot, d.pp_uc, d.pp_nm, d.pp_seq
               , d.pp_hisyn, d.plan_cnt, d.plan_time, d.plan_num, d.ul_uc, d.ul_nm, d.job_st, d.memo
               , m.job_dt, m.item_cd, m.item_nm, m.job_qty, m.unit_amt, m.state, m.fac_text, m.memo AS fac_memo, c.code_nm, u.id
               , (SELECT SUM(qty) FROM work_history WHERE lot = d.lot) AS work_qty
               , IFNULL((
                    SELECT SUM(qty) 
                    FROM stock_history 
                    WHERE ord_no = d.job_no AND lot = d.lot AND `work` = "IN" AND details = "003"
                    AND useyn = "Y" AND delyn = "N"), 0) AS stock_qty
               , (SELECT wh_uc FROM item_list WHERE item_cd = m.item_cd) AS wh_uc
               , (
                    CASE d.job_st
                         WHEN "N" THEN "대기"
                         WHEN "P" THEN "진행"
                         WHEN "C" THEN "완료"
                    END) AS job_st
               , JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.size")) AS size
               , JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.unit")) AS unit
               FROM job_master AS m
               INNER JOIN job_detail AS d ON (m.local_cd = d.local_cd AND m.job_no = d.job_no)
               INNER JOIN z_plan.user_list AS u ON (d.ul_uc = u.ul_uc)
               INNER JOIN z_plan.common_code AS c 
                    ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.unit")) = c.code_sub)
               WHERE m.state = "002" OR m.state = "003" AND m.useyn = "Y" AND m.delyn = "N"
                    AND m.job_dt <= CURDATE() 
                    AND d.local_cd = ? AND m.wp_uc LIKE CONCAT("%",?,"%") AND d.ul_uc LIKE CONCAT("%",?,"%")
                    AND m.job_dt BETWEEN DATE_ADD(NOW(), INTERVAL -3 MONTH) AND NOW()
                    AND d.job_st = ?
               ORDER BY no ASC';
          $query = $this->db->query($sql, array((string)$data['local_cd'],(string)$data['wp_uc'],(string)$data['ul_uc'],(string)$data['job_st']));
          return $query->result();
     }

     /**
     * @description 실적등록 리스트
     */  
     public function select_work_history_list($data){
          $sql = 'SELECT h.ikey, h.local_cd, h.job_no, h.lot, h.wh_no, h.pp_uc, h.qty, h.reg_dt, h.reg_ikey, u.ul_nm, c.code_nm
               , JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.size")) AS size
               , JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.unit")) AS unit
               FROM work_history AS h
                    INNER JOIN job_master AS m ON(m.job_no = h.job_no)
                    INNER JOIN z_plan.user_list AS u ON(u.ikey = h.reg_ikey)
                    INNER JOIN z_plan.common_code AS c 
                         ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.unit")) = c.code_sub)               
               WHERE h.local_cd = ? AND h.lot = ?
               ORDER BY h.ikey DESC';

          $query = $this->db->query($sql, array((string)$data['local_cd'],(string)$data['lot']));

          return $query->result();
     }

     /**
     * @description 생산입고 리스트
     */  
     public function select_stock_list($data)
     {
          $sql = 'SELECT h.ikey, h.local_cd, h.job_sq, h.qty, h.put_dt , h.amt, h.vat, h.reg_dt, h.memo, h.reg_ikey, u.ul_nm, u.ul_uc
                    , c.code_nm, m.item_nm, s.wh_uc, s.max_dt, s.st_sq, i.safe_qty
                    , (SELECT SUM(qty) FROM stock WHERE item_cd = s.item_cd) AS total_qty
                    , JSON_UNQUOTE(JSON_EXTRACT(h.spec, "$.grade")) AS grade
                    , JSON_UNQUOTE(JSON_EXTRACT(h.spec, "$.car")) AS car
                    , JSON_UNQUOTE(JSON_EXTRACT(h.spec, "$.state")) AS state
                    , JSON_UNQUOTE(JSON_EXTRACT(h.spec, "$.err")) AS err
                    , JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.size")) AS size
                    , JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.unit")) AS unit
               
               FROM stock_history AS h                   
                    INNER JOIN job_master AS m ON(h.ord_no = m.job_no)
                    INNER JOIN item_list AS i ON(h.item_cd = i.item_cd)  
                    LEFT JOIN stock AS s ON(s.st_sq = h.st_sq)
                    INNER JOIN z_plan.user_list AS u ON(u.ikey = h.reg_ikey)
                    INNER JOIN z_plan.common_code AS c 
                         ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(m.spec, "$.unit")) = c.code_sub)            
               WHERE h.local_cd = ? AND h.ord_no = ? AND h.details = ? AND h.useyn = "Y" AND h.delyn = "N"';

          $query = $this->db->query($sql, array((string)$data['local_cd'],(string)$data['ord_no'],(string)$data['details']));
          return $query->result();
     }

    /**
     * @description BOM 리스트
     */  
    public function select_bom_list($data)
    {
        $sql = ' SELECT bd.bom_uc, bd.pp_uc, bd.item_cd, bd.usage, i.size, i.unit, c.code_nm, pp.pp_nm, i.item_nm
                , (SELECT SUM(qty) 
                   FROM stock_history 
                   WHERE work = "OUT" AND details = "004" AND lot = ? AND item_cd = bd.item_cd
                   AND useyn = "Y" AND delyn = "N") AS raw_qty
                FROM bom_detail AS bd                   
                INNER JOIN bom_master AS bm ON(bm.item_cd = ?)
                INNER JOIN item_list AS i ON(i.item_cd = bd.item_cd)
                INNER JOIN prod_proc AS pp ON(bd.pp_uc = pp.pp_uc)
                INNER JOIN z_plan.common_code AS c ON (c.code_gb ="BA" AND c.code_main = "060" AND i.unit = c.code_sub)         
            WHERE bd.local_cd = ? AND bd.bom_uc = bm.bom_uc  AND bd.pp_uc = ?';

          $query = $this->db->query($sql, array((string)$data['lot'], (string)$data['item_cd'],(string)$data['local_cd'],(string)$data['pp_uc']));
          return $query->result();
    }

    /**
     * @description 재고 목록 리스트
     */  
    public function select_raw_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT s.ikey, s.local_cd, s.st_sq, s.item_cd, i.item_nm, s.barcode, i.size, i.unit, c.code_nm AS unit_nm, s.max_dt
                    , IFNULL(s.stock_amt+s.tax_amt, 0) AS total_amt, s.vat
                    , s.base_qty, i.safe_qty, s.in_qty, s.out_qty, s.re_in_qty, s.re_out_qty, s.qty
                    , w.wh_uc, w.wh_nm
                    FROM stock AS s
                    INNER JOIN (SELECT @rownum := 0) r
                    INNER JOIN item_list AS i ON (s.local_cd = i.local_cd AND s.item_cd = i.item_cd)
                    INNER JOIN warehouse AS w ON (s.local_cd = w.local_cd AND s.wh_uc = w.wh_uc)
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb ="BA" AND c.code_main = "060" AND i.unit = c.code_sub) # 공통코드 - 단위
                    WHERE s.local_cd = ? AND s.item_cd  = ? AND (s.qty > 0 OR s.qty < 0)
                    ORDER BY s.max_dt ASC) AS sub
                ORDER BY rownum ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['item_cd']));
        return $query->result();
    }

    /**
     * @description 자재투입(생산출고) 등록
     */
    public function raw_insert($stock, $data)
    {
        $this->db->trans_begin();

        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $this->session->userdata['ikey'],
            'mod_ip'    => $this->input->ip_address(),
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        // 재고 수정, 재고 히스토리 등록
        $this->db->set('pr_out_qty', 'pr_out_qty+'.$data['qty'], FALSE);
        $this->db->set('qty', 'qty-'.$data['qty'], FALSE);
        $this->db->set($array);
        $this->db->update('stock', NULL, array('st_sq' => $data['st_sq']));
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
     * @description 생산입고 등록
     */
    public function insert_stock($stock, $data)
    {
        $this->db->trans_begin();

        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $stock['reg_ikey'],
            'mod_ip'    => $stock['reg_ip'],
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        $this->db->insert("stock", $stock);
        $this->db->insert("stock_history", $data);

        // 제품 업데이트
        $this->db->update('item_list', $array, array('item_cd' => $data['item_cd']));

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
     * @description 비가동 히스토리 저장 및 작업 상태 비가동으로 변경
     */
    public function insert_unused($data_where, $data_insert, $data_update)
    {
          $this->db->trans_begin();
          $this->db->insert("used_history", $data_insert);
          $this->db->where($data_where);
          $this->db->update("job_detail", $data_update);

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
     * @description 비가동 히스토리 업데이트 및 작업 상태 가동으로 변경
     */
    public function update_unused($data_where)
    {
          $this->db->trans_begin();
          $this->db->set('end_dt', 'NOW()', false);
          $this->db->where($data_where);
          $this->db->update("used_history");
          
          $this->db->set('job_st', 'P');
          $this->db->where($data_where);
          $this->db->update("job_detail");

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
     * @description 생산입고 수정
     */
    public function update_stock($stock, $data)
    {
        $this->db->trans_begin();

        // update info
        $array = array(
            'sysyn'     => 'Y',
            'mod_ikey'  => $stock['reg_ikey'],
            'mod_ip'    => $stock['reg_ip'],
            'mod_dt'    => date("Y-m-d H:i:s")
        );

        // 생산입고 증감 반영
        $this->db->set('pr_in_qty', 'pr_in_qty+'.$stock['qty'], FALSE);
        $this->db->set('qty', 'qty+'.$stock['qty'], FALSE);
        $this->db->update('stock', NULL, array('st_sq' => $stock['st_sq']));

        // 재고 히스토리 등록
        $this->db->insert("stock_history", $data);

        // 제품 업데이트
        $this->db->update('item_list', $array, array('item_cd' => $data['item_cd']));

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
          // $this->db->trans_begin();
          // $sql = 'UPDATE stock 
          //      SET pr_in_qty = pr_in_qty+?, qty = qty+?
          //      WHERE wh_uc = ? AND item_cd = ? AND max_dt = ?';
          // $query = $this->db->query($sql, array((string)$data_update['qty'],(string)$data_update['qty'],(string)$data_unique['wh_uc'],
          //      (string)$data_unique['item_cd'],(string)$data_unique['max_dt']));

          
          // $this->db->insert("stock_history", $data_insert);
          // if ($this->db->trans_status() === FALSE)
          // {
          //    $this->db->trans_rollback();
          //    return false;
          // }
          // else
          // {
          //   $this->db->trans_commit();
          //   return true;
          // }

    }


     /**
     * @description 작업 상세 리스트(실적등록 페이지에서 사용)
     * @param  $ikey
     * @return result 작업 detail row
     */
    public function select_job_master_row($data)
     {
          $sql = 'SELECT d.ikey, j.local_cd, j.job_no, j.job_dt, j.item_cd, j.item_nm, j.job_qty, c.code_nm
                         , (SELECT sum(qty) AS all_qty FROM work_history WHERE lot = ?) AS all_qty
                         , d.pp_nm, d.pp_uc, d.pp_seq, d.ul_uc, d.ul_nm, d.lot, d.memo, d.plan_cnt, d.pp_hisyn
                         , JSON_UNQUOTE(JSON_EXTRACT(j.spec, " $.size")) AS size
                         , JSON_UNQUOTE(JSON_EXTRACT(j.spec, "$.unit")) AS unit
                    FROM job_master AS j
                         INNER JOIN z_plan.common_code AS c 
                         ON (c.code_gb ="BA" AND c.code_main = "060" AND JSON_UNQUOTE(JSON_EXTRACT(j.spec, "$.unit")) = c.code_sub)
                         INNER JOIN job_detail AS d ON(j.job_no = d.job_no)
                    WHERE d.local_cd = ? AND d.useyn = "Y" AND d.delyn = "N" AND d.lot = ?';
          $query = $this->db->query($sql, array((string)$data['lot'], (string)$data['local_cd'], (string)$data['lot']));
          return $query->row();
     }

     /**
     * @description common row delete
     */
    public function delete_stock($data)
    {
          $this->db->trans_begin();
          // $this->db->where($where);
          // $this->db->delete($table);

          /*$sql = 'UPDATE stock_history 
               SET state = "010" , useyn = "N" , delyn = "Y"
               WHERE st_sq = ? AND job_sq = ?';*/

          $sql = 'UPDATE stock_history 
               SET state = "010" , useyn = "N" , delyn = "Y" , mod_ikey = ? , mod_dt = NOW() , mod_ip = ?
               WHERE st_sq = ? AND job_sq = ?';

          $query = $this->db->query($sql, array((string)$data['mod_ikey'], (string)$data['mod_ip'], (string)$data['st_sq'], (string)$data['job_sq']));


          $sql = 'UPDATE stock 
               SET qty = qty-? , pr_in_qty = pr_in_qty-? , mod_ikey = ? , mod_ip = ?
               WHERE st_sq = ?';

          $query = $this->db->query($sql, array((string)$data['qty'], (string)$data['qty'], (string)$data['mod_ikey']
                    , (string)$data['mod_ip'], (string)$data['st_sq']));

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
    /*public function delete_stock($table, $where, $data)
    {
          $this->db->trans_begin();
          $this->db->where($where);
          $this->db->delete($table);

          $sql = 'UPDATE stock 
               SET qty = qty-? , pr_in_qty = pr_in_qty-? , mod_ikey = ?
               WHERE st_sq = ? AND job_sq = ?';
          $query = $this->db->query($sql, array((string)$data['qty']), (string)$data['qty']), (string)$data['mod_ikey'])
                    , (string)$data['st_sq'], (string)$data['job_sq']));

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
     }*/


     /**
     * @description 마이페이지 정보 세팅
     * @param  $id ,$ikey
     * @return MyPage 유저 데이터
     */
     public function mypage($data)
     {
          $sql   = 'SET @encrypt_key := ?';
          $query = $this->db->query($sql, array((string)$this->encrypt_key));
          
          $sql = 'SELECT u.id, u.ul_nm, c.code_nm ,d.dp_name
                    , CONVERT(AES_DECRYPT(UNHEX(u.tel), SUBSTR(UNHEX(SHA2(@encrypt_key, 512)), 1, 16)) USING UTF8) AS tel
                    FROM z_plan.user_list AS u
                    INNER JOIN z_plan.common_code AS c ON (c.code_gb = "HR" AND c.code_main = "010" AND c.code_sub = u.ul_gb) #직급
                    INNER JOIN z_plan.departments AS d ON (u.dp_uc = d.dp_uc) #부서
                    WHERE u.id = ? AND u.ikey = ?';
          $query = $this->db->query($sql, array((string)$data['id'], (string)$data['ikey']));
          return $query->row();
     }
}
