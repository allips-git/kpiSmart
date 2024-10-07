<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 제품 분류(Item gubun) 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/06/03
 */
class Item_gb_m extends CI_Model {

    protected $table = 'item_code';
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @description 제품분류 리스트
     * @param 공장코드, 검색 키워드, 검색 텍스트
     * @return item gb list
     */
    public function get_list($data)
    {
        $sql = 'SELECT c.ikey, c.key_name, c.useyn
                FROM item_code AS c
                WHERE c.local_cd = ? AND c.key_name LIKE CONCAT("%", ? ,"%") AND c.delyn = "N"
                ORDER BY c.key_name ASC';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['content']));
        return $query->result();
    }

    /**
     * @description 제품분류 상세 조회
     * @param 공장코드, ikey
     * @return item gb detail
     */
    public function get_detail($data)
    {
        $sql = 'SELECT c.ikey, c.key_name, c.useyn
                FROM item_code AS c
                WHERE c.local_cd = ? AND c.ikey = ?';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ikey']));
        return $query->row();
    }

}
