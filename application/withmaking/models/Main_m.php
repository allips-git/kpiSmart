<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 메인페이지 관리 컨트롤러
 * @author , @version 1.0, @last date
 */
class Main_m extends CI_Model {

	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * @description 공지사항 리스트
	 * @return notice list
	 */
	public function get_notice($data)
	{
        $sql   = 'SET @local_cd := ?';
        $query = $this->db->query($sql, array((string)$data['local_cd']));
		$sql = '(SELECT n.ikey , n.category , n.title , DATE_FORMAT(n.reg_dt, "%Y-%m-%d") AS reg_dt
				, CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm
				FROM notice n
                INNER JOIN z_plan.user_list u1 ON (u1.ikey = n.reg_ikey)
				WHERE n.local_cd = @local_cd AND n.category = "S" AND n.useyn = "Y" AND n.delyn = "N"
				ORDER BY n.reg_dt DESC LIMIT 2)
				UNION
					(SELECT n.ikey , n.category , n.title , DATE_FORMAT(n.reg_dt, "%Y-%m-%d") AS reg_dt
					, CONCAT(u1.ul_nm, "(", u1.id, ")") AS reg_nm
					FROM notice n
					INNER JOIN z_plan.user_list u1 ON (u1.ikey = n.reg_ikey)
					WHERE n.local_cd = @local_cd AND n.category = "N" AND n.useyn = "Y" AND n.delyn = "N"
					ORDER BY n.reg_dt DESC LIMIT 10)';
		$query = $this->db->query($sql);
		return $query->result();
	}

	/**
	 * @description 메인 통계 자료
	 * @return stock count
	 */
	public function get_stock($data)
	{
        $sql   = 'SET @local_cd := ?';
        $query = $this->db->query($sql, array((string)$data['local_cd']));
		$sql = 'SELECT
					IFNULL((
						SELECT SUM(d.ord_amt+d.tax_amt)
						FROM ord_master AS m
						INNER JOIN ord_detail AS d ON (m.local_cd = d.local_cd AND m.ord_no = d.ord_no)
						WHERE m.local_cd = @local_cd AND m.ord_dt = DATE_FORMAT(now(), "%Y-%m-%d"))
					, 0) AS ord_amt 
					, IFNULL((
						SELECT SUM(qty) FROM stock_history 
						WHERE local_cd = @local_cd AND `work` = "IN" AND details = "001" AND useyn = "Y" AND delyn = "N"
						AND put_dt = DATE_FORMAT(now(), "%Y-%m-%d")), 0) AS in_qty
					, IFNULL((
						SELECT SUM(qty) FROM stock_history 
						WHERE local_cd = @local_cd AND `work` = "OUT" AND details = "002" AND useyn = "Y" AND delyn = "N"
						AND put_dt = DATE_FORMAT(now(), "%Y-%m-%d")), 0) AS out_qty
					, IFNULL((
						SELECT COUNT(*) FROM buy_master
						WHERE local_cd = @local_cd AND ord_dt = DATE_FORMAT(now(), "%Y-%m-%d"))
					, 0) AS buy_qty';
		$query = $this->db->query($sql);
		return $query->row();
	}
}
