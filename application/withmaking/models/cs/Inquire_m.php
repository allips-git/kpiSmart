<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 문의하기 모델
 * @author 김원명, @version 1.0
 */
class Inquire_m extends CI_Model {

	/**
	 * @return row count
	 */
	public function get_count($arg1, $arg2)
	{
        $sql   = "SELECT 
                    COUNT(1) AS total_cnt
                FROM homepage.3d_space_online 
                WHERE delyn = 'N'";
        $query = $this->db->query($sql);
        return $query->row('total_cnt');
	}

	/**
	 * @return search row count
	 */
	public function get_search_count($arg1, $arg2)
	{
        $sql   = "SELECT 
                    COUNT(1) AS total_cnt
                FROM homepage.3d_space_online 
                WHERE delyn = 'N' AND ".$arg2['op']." LIKE CONCAT('%', ?, '%')";
        $query = $this->db->query($sql, array($arg2['val']));
        // print_r($this->db->last_query());
        return $query->row('total_cnt');
	}

	/**
	 * @param  row list
	 */
	public function get_list($limit, $start, $arg1, $arg2)
	{
        $sql   = "SELECT 
                    o.ikey
                    , o.kind
                    , o.title
                    , o.contents
                    , o.confirm
                    , o.name
                    , o.reg_dt
                FROM homepage.3d_space_online AS o 
                WHERE delyn = 'N' 
                ORDER BY o.reg_dt DESC LIMIT ?, ?";
        $query = $this->db->query($sql, array((int)$start, (int)$limit));
        return $query->result();
	}

	/**
	 * @param limit, offset, search parameter
	 * @return table search
	 */
	public function get_search_list($limit, $start, $arg1, $arg2)
	{
        $sql   = "SELECT 
                    o.ikey
                    , o.kind
                    , o.title
                    , o.contents
                    , o.confirm
                    , o.name
                    , o.reg_dt
                FROM homepage.3d_space_online AS o 
                WHERE delyn = 'N' 
                AND ".$arg2['op']." LIKE CONCAT('%', ?, '%')
                ORDER BY o.reg_dt DESC LIMIT ?, ?";
        //print_r($this->db->last_query());
        $query = $this->db->query($sql, array($arg2['val'], (int)$start, (int)$limit));
        return $query->result();
	}
}
