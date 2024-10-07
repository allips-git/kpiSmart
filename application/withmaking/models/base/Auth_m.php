<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 부서 관리 모델
 * @author 김원명, @version 1.0
 * @author 김민주, @version 2.0, @last date 2022/04/28 - 라인 정리
 */ 
class Auth_m extends CI_Model {

    protected $where = array('delyn'=>'N');

    /**
     * 자신 제외 중복 row count
     */
    public function get_overlap_count($where, $nwhere) 
    {
        $this->db->where($where);
        $this->db->where_not_in('dp_uc', $nwhere);
        return $this->db->count_all_results('z_plan.departments');
    }

    /**
     * @description 검증 count
     */
    public function get_where_count($where)
    {
        $key = array_keys($where);

        $sql = 'SELECT COUNT(*) AS cnt FROM z_plan.departments WHERE delyn = "N"';
        for ($i=0; $i<count($where); $i++)
        {
            $sql .= ' AND '.$key[$i].' = "'.$where[$key[$i]].'"';
        }
        $query = $this->db->query($sql);
        return $query->row('cnt');
    }

    /**
     * @return row count
     */
    public function get_count($data, $arg1) 
    {
        try {

            $sql = "SELECT COUNT(*) AS cnt 
                        FROM z_plan.departments 
                    WHERE delyn = 'N' AND local_cd = :local_cd";

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
                        FROM z_plan.departments 
                    WHERE delyn = 'N' AND local_cd = :local_cd AND ".$data['op']." LIKE :sc";

            $stmt = DB::$pdo->prepare($sql);
            $stmt->bindParam(':local_cd',   $data['local_cd'],     PDO::PARAM_STR);
            $stmt->bindParam(':sc',         $sc,                   PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchColumn();
            
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

            $sql = "SELECT ikey, dp_seq, dp_uc, dp_cd, dp_name, memo, sysyn, useyn, reg_ikey, reg_dt, mod_ikey, mod_dt 
                        FROM z_plan.departments 
                    WHERE delyn = 'N' AND local_cd = :local_cd
                    ORDER BY dp_seq ASC LIMIT :start, :limit";

            $stmt = DB::$pdo->prepare($sql);
            $stmt->bindParam(':local_cd',       $arg1['local_cd'],          PDO::PARAM_STR);
            $stmt->bindParam(':start',          $start,                     PDO::PARAM_INT);
            $stmt->bindParam(':limit',          $limit,                     PDO::PARAM_INT);
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
            
            $sql = "SELECT ikey, dp_seq, dp_uc, dp_cd, dp_name, memo, sysyn, useyn, reg_ikey, reg_dt, mod_ikey, mod_dt 
                        FROM z_plan.departments 
                    WHERE delyn = 'N' AND local_cd = :local_cd AND ".$data['op']." LIKE :sc
                    ORDER BY dp_seq ASC LIMIT :start, :limit";
                    
            $stmt = DB::$pdo->prepare($sql);
            $stmt->bindParam(':local_cd',       $data['local_cd'],          PDO::PARAM_STR);
            $stmt->bindParam(':sc',             $sc,                        PDO::PARAM_STR);
            $stmt->bindParam(':start',          $start,                     PDO::PARAM_INT);
            $stmt->bindParam(':limit',          $limit,                     PDO::PARAM_INT);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_CLASS);
            return $results;
            
        } catch (PDOException $pe) {
            die("Error occurred:" . $pe->getMessage());
        }
    }
}
