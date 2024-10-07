<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 사용자등록 모델
 * @author 김원명, @version 1.0
 */
class User_m extends CI_Model {

	/**
	 * @return row count
	 */
	public function get_count($data, $arg1)
	{
		try {
			$sql = "SELECT COUNT(*) AS cnt 
                        FROM z_plan.user_list u LEFT JOIN z_plan.departments d ON u.dp_uc = d.dp_uc
                    WHERE u.delyn = 'N' AND u.local_cd = :local_cd";

			$stmt = DB::$pdo->prepare($sql);
			$stmt->bindParam(':local_cd',      $arg1['local_cd'],        PDO::PARAM_STR);
			$stmt->execute();
			return $stmt->fetchColumn();

		} catch (PDOException $pe) {
			die("Error occurred:" . $pe->getMessage());
		}
	}

	/**
	 * @return search row count
	 */
	public function get_search_count($arg1, $data)
	{
		$sc = "%".$data['sc']."%";

		try {
			$sql = "SELECT COUNT(*) AS cnt 
                        FROM z_plan.user_list u LEFT JOIN z_plan.departments d ON u.dp_uc = d.dp_uc
                    WHERE u.delyn = 'N' AND u.local_cd = :local_cd";
			if ($data['op'] != "tel")
			{
				$sql .= " AND u.".$data['op']." LIKE :sc";
			}
			else
			{
				$sql .= " AND IFNULL(AES_DECRYPT(UNHEX(u.".$data['op']."), SUBSTR(UNHEX(SHA2('".$arg1['key']."', 512)), 1, 16) ), '') LIKE :sc";
			}
			$stmt = DB::$pdo->prepare($sql);
			$stmt->bindParam(':local_cd',   $data['local_cd'],                 PDO::PARAM_STR);
			$stmt->bindParam(':sc',         $sc,                               PDO::PARAM_STR);
			$stmt->execute();
			$results = $stmt->fetchColumn();
			return $results;

		} catch (PDOException $pe) {
			die("Error occurred:" . $pe->getMessage());
		}
	}

	/**
	 * @param  row list
	 */
	public function get_list($limit, $start, $data, $arg1)
	{
		try {

			$sql = "SELECT  @rownum := @rownum+1 AS rownum, sub.*
                	FROM (SELECT u.ul_seq, u.ul_uc, u.ul_cd, u.ul_gb, c1.code_nm AS gb_name, u.dp_uc, d.dp_name, u.ul_job,
                           c2.code_nm AS job_name, u.ul_nm, u.id, u.pass, u.useyn, u.tel, u.memo, u.reg_ikey, u.reg_dt,
                           u.mod_ikey, u.mod_dt, u.sysyn
                        FROM z_plan.user_list u 
                        INNER JOIN (SELECT @rownum := 0) r
                        LEFT JOIN z_plan.departments AS d ON u.dp_uc = d.dp_uc
                        INNER JOIN z_plan.common_code AS c1 ON c1.code_sub = u.ul_job
                        INNER JOIN z_plan.common_code AS c2 ON c2.code_sub = u.ul_gb
                    WHERE u.delyn = 'N' AND u.local_cd = :local_cd
                    AND c1.code_gb = 'HR' AND c1.code_main = '010'
                    AND c2.code_gb = 'HR' AND c2.code_main = '030'
                    ORDER BY u.ul_seq ASC LIMIT :start, :limit) AS sub
                ORDER BY rownum ASC";

			$stmt = DB::$pdo->prepare($sql);
			$stmt->bindParam(':local_cd',       $arg1['local_cd'],              PDO::PARAM_STR);
			$stmt->bindParam(':start',          $start,                         PDO::PARAM_INT);
			$stmt->bindParam(':limit',          $limit,                         PDO::PARAM_INT);
			$stmt->execute();
			$results = $stmt->fetchAll(PDO::FETCH_CLASS);
			return $results;

		} catch (PDOException $pe) {
			die("Error occurred:" . $pe->getMessage());
		}
	}

	/**
	 * @param limit, offset, search parameter
	 * @return table search
	 */
	public function get_search_list($limit, $start, $arg1, $data)
	{
		$sc = "%".$data['sc']."%";

		try {
			$sql = "SELECT  @rownum := @rownum+1 AS rownum, sub.*
                	FROM (SELECT u.ul_seq, u.ul_uc, u.ul_cd, u.ul_gb, c1.code_nm AS gb_name, u.dp_uc, d.dp_name, u.ul_job,
                           c2.code_nm AS job_name, u.ul_nm, u.id, u.pass, u.useyn, u.tel, u.memo, u.reg_ikey, u.reg_dt,
                           u.mod_ikey, u.mod_dt, u.sysyn
                        FROM z_plan.user_list u 
                        INNER JOIN (SELECT @rownum := 0) r
                        LEFT JOIN z_plan.departments AS d ON u.dp_uc = d.dp_uc
                        INNER JOIN z_plan.common_code AS c1 ON c1.code_sub = u.ul_job
                        INNER JOIN z_plan.common_code AS c2 ON c2.code_sub = u.ul_gb
                    WHERE u.delyn = 'N' AND u.local_cd = :local_cd
                    AND c1.code_gb = 'HR' AND c1.code_main = '010'
                    AND c2.code_gb = 'HR' AND c2.code_main = '030'";
			if ($data['op'] != "tel")
			{
				$sql .= " AND u.".$data['op']." LIKE :sc";
			}
			else
			{
				$sql .= " AND IFNULL(AES_DECRYPT(UNHEX(u.".$data['op']."), SUBSTR(UNHEX(SHA2('".$arg1['key']."', 512)), 1, 16) ),'') LIKE :sc";
			}
			$sql .= " ORDER BY u.ul_seq ASC LIMIT :start, :limit) AS sub
                ORDER BY rownum ASC";

			$stmt = DB::$pdo->prepare($sql);
			$stmt->bindParam(':local_cd',       $data['local_cd'],              PDO::PARAM_STR);
			$stmt->bindParam(':sc',             $sc,                            PDO::PARAM_STR);
			$stmt->bindParam(':start',          $start,                         PDO::PARAM_INT);
			$stmt->bindParam(':limit',          $limit,                         PDO::PARAM_INT);
			$stmt->execute();
			$results = $stmt->fetchAll(PDO::FETCH_CLASS);
			return $results;

		} catch (PDOException $pe) {
			die("Error occurred:" . $pe->getMessage());
		}
	}

	/**
	 * 사용자 목록에서 클릭 시 사용자별 권한 get (임시) - 2021-09-29 김원명
	 */
	public function get_user_auth_tmp($dp_uc, $ul_uc, $local_cd)
	{
		try {

			$sql = "SELECT f.cm_seq, m.ikey, f.cm_gb, f.pop_gb, f.useyn, f.parent_id, f.head_id
					, m.pgm_id, f.cm_nm, m.dp_uc, m.ul_uc, m.`read`, m.`write`
					, m.`modify`,m.`delete`, m.admin, f.cm_url, f.platform_gb AS ft, f.mobile_gb, m.delyn
					, m.reg_idx, m.reg_ip, m.reg_dt, m.mod_idx, m.mod_ip, m.mod_dt
                    FROM z_plan.factory_menu AS f
                        INNER JOIN z_plan.permission AS m ON f.pgm_id = m.pgm_id
                    WHERE f.parent_gb = 'N' AND f.platform_gb = 'B' AND m.dp_uc = :dp_uc AND m.ul_uc = '' AND f.local_cd = :local_cd1 
                    	AND m.pgm_id NOT IN ( SELECT pgm_id FROM z_plan.permission WHERE ul_uc = :ul_uc)
                    UNION 
					SELECT f.cm_seq, m.ikey, f.cm_gb, f.pop_gb, f.useyn, f.parent_id, f.head_id, m.pgm_id
					, f.cm_nm, m.dp_uc, m.ul_uc, m.`read`, m.`write`
					, m.`modify`,m.`delete`, m.admin, f.cm_url, f.platform_gb AS ft, f.mobile_gb, m.delyn, m.reg_idx
					, m.reg_ip, m.reg_dt, m.mod_idx, m.mod_ip, m.mod_dt
					FROM z_plan.factory_menu AS f
						INNER JOIN z_plan.permission AS m ON f.pgm_id = m.pgm_id
					WHERE f.parent_gb = 'N' AND f.platform_gb = 'B' AND m.ul_uc = :ul_uc2 AND f.local_cd = :local_cd2
						ORDER BY cm_seq ASC";

			$stmt = DB::$pdo->prepare($sql);
			$stmt->bindParam(':dp_uc',      $dp_uc,        PDO::PARAM_STR);
			$stmt->bindParam(':ul_uc',      $ul_uc,        PDO::PARAM_STR);
			$stmt->bindParam(':ul_uc2',     $ul_uc,        PDO::PARAM_STR);
			$stmt->bindParam(':local_cd1',  $local_cd,     PDO::PARAM_STR);
			$stmt->bindParam(':local_cd2',  $local_cd,     PDO::PARAM_STR);
			$stmt->execute();
			$results = $stmt->fetchAll(PDO::FETCH_CLASS);
			return $results;

		} catch (PDOException $pe) {
			die("Error occurred:" . $pe->getMessage());
		}
	}

	/**
	 * /include/bms_head.php => 메뉴 리스트 불러오는 데이터
	 */
	public function get_head_menu_auth($dp_uc, $ul_uc, $local_cd)
	{
		try {
			$sql = "SELECT a.*, b.cm_url
                        FROM (
                                SELECT f.local_cd, f.cm_seq, f.cm_gb, f.parent_id, f.head_id, f.cm_nm, f.pgm_id
                                    FROM z_plan.factory_menu AS f
                                WHERE cm_gb = 'H' AND f.platform_gb = 'B' AND f.local_cd = :local_cd1
                                ORDER BY cm_seq ASC
                              ) a
                        LEFT OUTER JOIN 
                        (
                            SELECT MIN(f.cm_seq), f.head_id, f.cm_url
                                FROM (
                                        SELECT f.cm_seq, f.head_id, f.cm_url, m.read
                                            FROM z_plan.factory_menu AS f
                                                    INNER JOIN z_plan.permission AS m ON f.pgm_id = m.pgm_id
                                        WHERE f.parent_gb = 'N' AND f.platform_gb = 'B' AND f.useyn = 'Y' AND m.dp_uc = :dp_uc AND m.ul_uc = '' 
                                            AND m.pgm_id NOT IN ( SELECT pgm_id FROM z_plan.permission WHERE ul_uc = :ul_uc) AND f.local_cd = :local_cd2
                                        UNION 
                                        SELECT f.cm_seq, f.head_id, f.cm_url, m.read
                                            FROM z_plan.factory_menu AS f
                                                    INNER JOIN z_plan.permission AS m ON f.pgm_id = m.pgm_id
                                        WHERE f.parent_gb = 'N' AND f.platform_gb = 'B' AND f.useyn = 'Y' AND m.ul_uc = :ul_uc2 AND f.local_cd = :local_cd3
                                        ORDER BY cm_seq ASC
                                     ) f
                            WHERE f.read = 'Y'
                            GROUP BY f.head_id
                        ) b ON a.parent_id = b.head_id
                        ORDER BY cm_seq ASC";

				error_log("Executing Query: " . $sql);
				error_log("Parameters: " . json_encode([$dp_uc, $ul_uc, $local_cd]));


			$stmt = DB::$pdo->prepare($sql);
			$stmt->bindParam(':dp_uc',      $dp_uc,       PDO::PARAM_STR);
			$stmt->bindParam(':ul_uc',      $ul_uc,       PDO::PARAM_STR);
			$stmt->bindParam(':ul_uc2',     $ul_uc,       PDO::PARAM_STR);
			$stmt->bindParam(':local_cd1',  $local_cd,    PDO::PARAM_STR);
			$stmt->bindParam(':local_cd2',  $local_cd,    PDO::PARAM_STR);
			$stmt->bindParam(':local_cd3',  $local_cd,    PDO::PARAM_STR);
			$stmt->execute();
			$results = $stmt->fetchAll(PDO::FETCH_CLASS);
			return $results;

		} catch (PDOException $pe) {
			die("Error occurred:" . $pe->getMessage());
		}
	}

	/**
	 * url에 맞춰 권한 get
	 */
	public function get_auth($dp_uc, $ul_uc, $url, $local_cd)
	{
		try {

			$sql = "SELECT * FROM 
            (
                SELECT f.local_cd, f.cm_seq, f.cm_gb, f.parent_gb, f.pop_gb, f.head_id, f.parent_id, f.pgm_id, f.cm_nm, f.cm_url
                , p.dp_uc, p.ul_uc, p.`read`, p.`write`, p.`modify`, p.`delete`
                FROM z_plan.factory_menu AS f INNER JOIN z_plan.permission AS p ON f.pgm_id = p.pgm_id 
                WHERE p.dp_uc = :dp_uc AND p.ul_uc = '' AND f.platform_gb = 'B' 
                    AND p.pgm_id NOT IN ( SELECT pgm_id FROM z_plan.permission WHERE ul_uc = :ul_uc ) AND f.local_cd = :local_cd1
                UNION
                SELECT f.local_cd, f.cm_seq, f.cm_gb, f.parent_gb, f.pop_gb, f.head_id, f.parent_id, f.pgm_id, f.cm_nm, f.cm_url,
                    p.dp_uc, p.ul_uc, p.`read`, p.`write`, p.`modify`, p.`delete` 
                FROM z_plan.factory_menu AS f INNER JOIN z_plan.permission AS p ON f.pgm_id = p.pgm_id 
                WHERE p.ul_uc = :ul_uc2 AND f.platform_gb = 'B' AND f.local_cd = :local_cd2
            ) AS p 
            WHERE cm_url = :url";

			$stmt = DB::$pdo->prepare($sql);
			$stmt->bindParam(':dp_uc',      $dp_uc,       PDO::PARAM_STR);
			$stmt->bindParam(':ul_uc',      $ul_uc,       PDO::PARAM_STR);
			$stmt->bindParam(':ul_uc2',     $ul_uc,       PDO::PARAM_STR);
			$stmt->bindParam(':url',        $url,         PDO::PARAM_STR);
			$stmt->bindParam(':local_cd1',  $local_cd,    PDO::PARAM_STR);
			$stmt->bindParam(':local_cd2',  $local_cd,    PDO::PARAM_STR);
			$stmt->execute();
			$results = $stmt->fetchAll(PDO::FETCH_CLASS);
			return $results;

		} catch (PDOException $pe) {
			die("Error occurred:" . $pe->getMessage());
		}
	}
}
