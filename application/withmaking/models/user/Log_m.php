<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 접속기록 관리 모델
 * @author 황호진, @version 1.0, @last date 2022/01/20
 */
class Log_m extends CI_Model {

	public function __construct()
	{
		parent::__construct();
		$this->result = (object)[];
		$this->result->data = [];
		$this->result->param = [];
		$this->result->msg = '';
		$this->result->result = false;
	}

	/*
	 * @description response 규율
	 * @author 황호진, @version 1.0 @last_update 2022-01-20
     * @param  X
     * @return 프로토콜 규정
	 * */
	public function get_response_data_form(){
		return $this->result;
	}

	/*
	 * @description get_list
	 * @author 황호진, @version 1.0 @last_update 2022-01-20
     * @param  $lc = 공장코드 , $p = 검색폼
     * @return 접속기록 리스트
	 * */
	public function get_list($lc , $p)
	{
		$sql = 'SELECT @rownum:=@rownum+1 AS row_no , t.*
				FROM (
					SELECT ul.reg_dt ,
							(
								CASE ul.acc_gb
									WHEN "P" THEN "PC"
									WHEN "A" THEN "APP"
								END
							) AS acc_gb ,
							ul.ul_id , ul.ul_nm , ul.reg_ip ,
							(
								CASE ul.crud
									WHEN "L" THEN "로그인"
									WHEN "O" THEN "로그아웃"
									WHEN "C" THEN "등록"
									WHEN "R" THEN "조회"
									WHEN "U" THEN "수정"
									WHEN "D" THEN "삭제"
								END
							) AS crud ,
							"성공" AS result
					FROM user_log ul
						INNER JOIN (SELECT @rownum:=0) r
					WHERE ul.rec_gb = "F" AND ul.uc_cd = ?
						AND DATE_FORMAT(ul.reg_dt , "%Y-%m-%d") BETWEEN ? AND ? AND ul.reg_ip NOT IN ("::1")
					ORDER BY ul.ikey ASC
				) t
				ORDER BY row_no DESC;';
		$query = $this->db->query($sql , array($lc , $p['st_dt'] , $p['ed_dt']));
		return $query->result();
	}

	/*
	 * @description get_search_list
	 * @author 황호진, @version 1.0 @last_update 2022-01-20
     * @param  $lc = 공장코드 , $p = 검색폼
     * @return 접속기록 리스트
	 * */
	public function get_search_list($lc , $p)
	{
		$sql = 'SELECT @rownum:=@rownum+1 AS row_no , t.*
				FROM (
					SELECT ul.reg_dt ,
							(
								CASE ul.acc_gb
									WHEN "P" THEN "PC"
									WHEN "A" THEN "APP"
								END
							) AS acc_gb ,
							ul.ul_id , ul.ul_nm , ul.reg_ip ,
							(
								CASE ul.crud
									WHEN "L" THEN "로그인"
									WHEN "O" THEN "로그아웃"
									WHEN "C" THEN "등록"
									WHEN "R" THEN "조회"
									WHEN "U" THEN "수정"
									WHEN "D" THEN "삭제"
								END
							) AS crud ,
							"성공" AS result
					FROM user_log ul
						INNER JOIN (SELECT @rownum:=0) r
					WHERE ul.rec_gb = "F" AND ul.uc_cd = ?
						AND DATE_FORMAT(ul.reg_dt , "%Y-%m-%d") BETWEEN ? AND ?
						AND ul.' . $p['op_1'] . ' LIKE CONCAT("%" , ? , "%") AND ul.reg_ip NOT IN ("::1")
					ORDER BY ul.ikey ASC
				) AS t
				ORDER BY row_no DESC;';
		$query = $this->db->query($sql , array($lc , $p['st_dt'] , $p['ed_dt'] , $p['sc']));
		return $query->result();
	}

}
