<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 시스템 문의 모델
 */ 
class Question_m extends CI_Model {
    /**
     * @return row count all
     */
    public function get_count($arg1, $arg2) 
    {
        $sql = 'SELECT COUNT(1) AS cnt FROM z_plan.qna AS q
                    LEFT JOIN (
                                SELECT cust_cd, IFNULL(file_nm,"") AS file_nm, file_dseq
                                    FROM z_plan.qna_file
                                WHERE file_seq = "01") AS f ON q.cust_cd = f.cust_cd AND q.ikey = f.file_dseq
                    LEFT JOIN z_plan.user_list AS u1 ON q.reg_ikey = u1.ikey
                    LEFT JOIN z_plan.user_list AS u2 ON q.ans_ikey = u2.ikey
                WHERE q.cust_cd = ?';
        $query = $this->db->query($sql, array($arg1['local_cd']));
        return $query->row('cnt');
    }

    /**
     * @return list all
     */
    public function get_list($limit, $start, $arg1, $arg2)
    {
        $sql = 'SELECT q.ikey, q.qn_title, IF(f.file_nm <> "", "있음", "없음") AS file_nm, 
                       u1.ul_nm AS reg_nm, u1.id AS reg_id, q.reg_dt, 
                       q.answer, IFNULL(u2.ul_nm,"") ans_nm, IFNULL(u2.id,"") AS ans_id, q.ans_dt, q.sysyn
                FROM z_plan.qna AS q
                    LEFT JOIN (
                                SELECT cust_cd, IFNULL(file_nm,"") AS file_nm, file_dseq
                                    FROM z_plan.qna_file
                                WHERE file_seq = "01") AS f ON q.cust_cd = f.cust_cd AND q.ikey = f.file_dseq
                    LEFT JOIN z_plan.user_list AS u1 ON q.reg_ikey = u1.ikey
                    LEFT JOIN z_plan.user_list AS u2 ON q.ans_ikey = u2.ikey 
                WHERE q.cust_cd = ?
                ORDER BY q.reg_dt DESC LIMIT '.$start.', '.$limit.'';
        $query = $this->db->query($sql, array($arg1['local_cd']));
        return $query->result();
    }

    /**
     * @param search list
     */
    public function get_search_count($arg1, $arg2)
    {
        $sql = 'SELECT COUNT(1) AS cnt FROM z_plan.qna AS q
                    LEFT JOIN (
                                SELECT cust_cd, IFNULL(file_nm,"") AS file_nm, file_dseq
                                    FROM z_plan.qna_file
                                WHERE file_seq = "01") AS f ON q.cust_cd = f.cust_cd AND q.ikey = f.file_dseq
                    LEFT JOIN z_plan.user_list AS u1 ON q.reg_ikey = u1.ikey
                    LEFT JOIN z_plan.user_list AS u2 ON q.ans_ikey = u2.ikey
                WHERE q.cust_cd = ? AND (q.qn_title LIKE CONCAT("%", ? ,"%") OR q.qn_content LIKE CONCAT("%", ? ,"%")) AND q.answer LIKE CONCAT("%", ? ,"%")';
        $query = $this->db->query($sql, array($arg1['local_cd'], $arg2['sc'], $arg2['sc'], $arg2['an']));
        return $query->row('cnt');
    }    

    /**
     * @param search count
     */
    public function get_search_list($limit, $start, $arg1, $arg2)
    {
        $sql = 'SELECT q.ikey, q.qn_title, IF(f.file_nm <> "", "있음", "없음") AS file_nm, 
                       u1.ul_nm AS reg_nm, u1.id AS reg_id, q.reg_dt, 
                       q.answer, IFNULL(u2.ul_nm,"") ans_nm, IFNULL(u2.id, "") AS ans_id, q.ans_dt, q.sysyn
                FROM z_plan.qna AS q
                    LEFT JOIN (
                                SELECT cust_cd, IFNULL(file_nm,"") AS file_nm, file_dseq
                                    FROM z_plan.qna_file
                                WHERE file_seq = "01") AS f ON q.cust_cd = f.cust_cd AND q.ikey = f.file_dseq
                    LEFT JOIN z_plan.user_list AS u1 ON q.reg_ikey = u1.ikey
                    LEFT JOIN z_plan.user_list AS u2 ON q.ans_ikey = u2.ikey
                WHERE q.cust_cd = ? AND (q.qn_title LIKE CONCAT("%", ? ,"%") OR q.qn_content LIKE CONCAT("%", ? ,"%")) AND q.answer LIKE CONCAT("%", ? ,"%")
                ORDER BY q.reg_dt DESC LIMIT '.$start.', '.$limit.'';
        $query = $this->db->query($sql, array($arg1['local_cd'], $arg2['sc'], $arg2['sc'], $arg2['an']));
        return $query->result();
    }
}