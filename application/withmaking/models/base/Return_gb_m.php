<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 반품 유형(Return gubun) 관리 컨트롤러
 * @author 김민주, @version 1.0, @last date
 */
class Return_gb_m extends CI_Model {

    protected $table = 'return_type';
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 반품 유형 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return return gb list
     */
    public function get_list($data)
    {
        $sql = 'SELECT r.ikey, r.re_nm, r.useyn
                FROM return_type AS r
                WHERE r.local_cd = ? AND r.re_nm LIKE CONCAT("%", ? ,"%") AND r.delyn = "N"
                ORDER BY r.re_nm ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 반품 유형 상세 조회
     * @param 공장코드, ikey
     * @return return gb detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT r.ikey, r.re_nm, r.useyn
                FROM return_type AS r
                WHERE r.local_cd = ? AND r.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

}
