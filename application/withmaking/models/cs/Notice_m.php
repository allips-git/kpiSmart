<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 공지사항(Notice) 관리 모델
 * @author 안성준, @version 1.0, @last date 2022/05/13
 */ 
class Notice_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
        $this->encrypt_key = $this->config->item('encrypt_key');
    }


    /**
     * @description 공지사항 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트, 작업장유형, 가용여부
     * @return 공지사항 list
     */
    public function get_list($data)
    {
        $sql = 'SELECT  @rownum := @rownum+1 AS rownum, sub.*
                FROM (
                    SELECT 
                        CASE w.category 
                            WHEN "N" THEN "일반" ELSE "중요" 
                            END AS "category"
                    ,w.ikey, w.local_cd, w.title
                    , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, w.reg_dt
                    , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, w.mod_dt
                    , w.useyn
                    FROM notice AS w
                        INNER JOIN (SELECT @rownum := 0) r                       
                        INNER JOIN z_plan.user_list u1 ON (u1.ikey = w.reg_ikey)
                        LEFT JOIN z_plan.user_list u2 ON (u2.ikey = w.mod_ikey)
                    WHERE w.local_cd = ? AND w.delyn = "N"
                        AND '.$data['keyword'].' LIKE CONCAT("%", ? ,"%") 
                        AND w.useyn LIKE CONCAT("%", ? ,"%")
                        AND w.category LIKE CONCAT("%", ? ,"%")
                    ORDER BY FIELD(w.category, "S") ASC,w.reg_dt ASC) AS sub
                ORDER BY rownum DESC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data["content"], (string)$data["useyn"], (string)$data["category"]));
        return $query->result();
    }

    /**
     * @description 공지사항 상세 조회
     * @param 공장코드, 작업장ikey
     * @return Warehouse detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT  /*REGEXP_REPLACE(n.content, "<[^>]+>" ,"") AS content
                ,*/ CASE n.category 
                    WHEN "N" THEN "일반" 
                    ELSE "중요" 
                  END AS "category"
                , n.ikey, n.local_cd, n.useyn, n.title, n.reg_dt, n.mod_dt, n.content
                , CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm, n.reg_dt
                , CONCAT(u2.ul_nm, "(", u2.id, ")") AS mod_nm, n.mod_dt
                FROM notice AS n
                    INNER JOIN (SELECT @rownum := 0) r                       
                    INNER JOIN z_plan.user_list u1 ON (u1.ikey = n.reg_ikey)
                    LEFT JOIN z_plan.user_list u2 ON (u2.ikey = n.mod_ikey)
                WHERE n.local_cd = ? AND n.ikey = ?';

        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));

        return $query->row();
    }

    /**
     * @description 공지사항 수정 상세 조회
     * @param 공장코드, 작업장ikey
     * @return Warehouse detail
     */
    public function get_u_detail($data)
    {
        $sql = 'SELECT n.category , n.ikey, n.local_cd, n.useyn, n.title, n.content
                FROM notice AS n
                WHERE n.local_cd = ? AND n.ikey = ?';

        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

    /**
     * @description 공지사항 조회수 +1
     */
    public function set_count($data){
        $this->db->set('cnt','cnt+1',FALSE);
        $this->db->where('ikey', $data['ikey']);
        $this->db->update('notice');
    }

}
