<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 공통 관리 모델
 * @author 김민주, @version 1.0, @last date 2022/04/28
 */ 
class Common_m extends CI_Model {

    protected $table = 'code_master';
 
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @return row count all
     */
    public function get_count($table, $where) 
    {
        $this->db->where($where);

        return $this->db->count_all_results($table);
    }

    /**
     * @return search row count
     */
    public function get_search_count($table, $data, $where) 
    {
        $this->db->like($data, 'match');
        $this->db->where($where);

        return $this->db->count_all_results($table);
    }

    /**
     * @param  limit, offset
     * @return table search all
     */
    public function get_list($table, $limit, $start, $where, $sort='')
    {
        //$this->db->order_by('reg_dt', 'DESC');
        //$this->db->order_by('ikey', 'DESC');
        $this->db->where($where);
        $this->db->order_by($sort);
        $this->db->limit($limit, $start);

        $query = $this->db->get($table);
        return $query->result();
    }


    /**
     * @param  limit, offset, search parameter
     * @return table search
     */
    public function get_search_list($table, $limit, $start, $data, $where, $sort='')
    {
        //$this->db->order_by('reg_dt', 'DESC');
        //$this->db->order_by('ikey', 'DESC');
        $this->db->like($data);
        $this->db->where($where);
        $this->db->order_by($sort);
        $this->db->limit($limit, $start);

        $query = $this->db->get($table);
        return $query->result();
    }

    /**
     * @param  limit, offset
     * @return table search all
     */
    public function get_list2($table, $where, $sort, $limit, $start)
    {
        $this->db->where($where);
        $this->db->order_by($sort);
        $this->db->limit($limit, $start);

        $query = $this->db->get($table);
        return $query->result();
    }

    /**
     * @return table data all
     */
    public function get_all_list($table)
    {
        $query = $this->db->get($table);
        return $query->result();
    }

    /**
     * @param like, after
     * @return table data all
     */
    public function get_after_list($table, $col, $data)
    {
        $this->db->like($col, $data, 'after');
        $query = $this->db->get($table);
        return $query->result();
    }    

    /**
     * @param  limit, offset, search parameter
     * @return table search
     */
    public function get_search_list2($table, $data, $where, $sort, $limit, $start)
    {
        $this->db->where($where);
        $this->db->like($data, 'match');
        $this->db->order_by($sort);
        $this->db->limit($limit, $start);

        $query = $this->db->get($table);
        return $query->result();
    }

    /**
     * @description common row update
     */
    public function insert($table, $data)
    {
        $this->db->trans_begin();
        $this->db->insert($table, $data);
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
     * @description common row insert
     */
    /*
    public function insert2($table, $data)
    {
        if ($this->db->insert($table, $data)) {
            return true;
        } else {
            return false;
        }
    }*/

    /**
     * @description common row update
     */
    public function update($table, $ikey, $data)
    {
        $this->db->where('ikey', $ikey);
        if ($this->db->update($table, $data)) {
            return true;
        } 
        else 
        {
            return false;
        }
    }

    
     public function printUpdate($table, $conditions, $data)
    {
        $this->db->where($conditions);
        if ($this->db->update($table, $data)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @description common row update
     */
    public function update2($table, $data, $where)
    {
        $this->db->trans_begin();
        $this->db->where($where);
        $this->db->update($table, $data);
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
     * @description common row delete
     */
    public function delete($table, $data, $gb='')
    {
        if (!empty($data['ikey'])) 
        {
            $this->db->trans_begin();
            if (!empty($gb) && $gb == 'use') 
            {
                $this->db->set('useyn', 'N');
            } 
            else 
            {
                $this->db->set('delyn', 'Y');
            }
            $this->db->set('mod_ikey', $data['mod_ikey']);
            $this->db->set('mod_ip', NULL);
            $this->db->set('mod_dt', 'NOW()', false);
            $this->db->where('ikey', $data['ikey']);
            $this->db->update($table);
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
        else 
        {
            return false;
        }

    }

    /**
     * @description common row delete
     */
    public function real_del($table, $where)
    {
        $this->db->trans_begin();
        $this->db->where($where);
        $this->db->delete($table);
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
     * @description 조건별 마스터코드 확인
     */
    public function get_code($code_pgmid, $code_main, $gb='') 
    {
        // A/S, 반품
        if (!empty($gb) && $gb == 'DISTINCT') 
        {
            $this->db->select('DISTINCT(code_name) AS code_name');
        }

        // base 
        $this->db->where('useyn', 'Y');
        $this->db->where('code_sub >', '000');

        // customize
        $this->db->where('code_main', $code_main);
        $this->db->where('code_pgmid', $code_pgmid);

        // A/S, 반품 유형
        if (!empty($gb) && $gb == 'CASE') 
        {
            $this->db->order_by('code_name', 'ASC');
        }
        $this->db->order_by('code_sub', 'ASC');
        
        $query = $this->db->get($this->table);
        return $query->result();
    }

    /**
     * @description 조건별 공통 코드(z_plan.common_code)
     */
    public function get_common_code($code_gb, $code_main)
    {
        $sql = 'SELECT code_sub, code_nm AS code_name, descrip, memo FROM z_plan.common_code WHERE code_sub <> "000"';
        $sql .= ' AND code_gb = ? AND code_main = ? AND useyn = "Y" ORDER BY code_sub ASC';
        $query = $this->db->query($sql, array($code_gb, $code_main));
        return $query->result();
    }

    /**
     * @description 조건별 code name 확인(z_plan.common_code)
     */
    public function get_code_name2($code_gb, $code_main, $code_sub, $gb='') 
    {
        
        $sql = 'SELECT code_sub, code_nm AS code_name, descrip, memo FROM z_plan.common_code WHERE code_sub <> "000"';
        $sql .= ' AND code_gb = ? AND code_main = ? AND code_sub = ?';
        $query = $this->db->query($sql, array($code_gb, $code_main, $code_sub));
        return $query->row();
    }

    /**
     * @description 조건별 code name 확인
     */
    public function get_code_name($code_pgmid, $code_main, $code_sub, $gb='') 
    {
        // customize
        if ($gb == 'descrip') 
        {
            $this->db->select('descrip');
        } 
        else 
        {
            $this->db->select('code_name');
        }
        $this->db->where('code_pgmid', $code_pgmid);
        $this->db->where('code_main', $code_main);
        $this->db->where('code_sub', $code_sub);
        $query = $this->db->get($this->table);
        return $query->row();    
    }

    /**
     * @description 조건별 column 검색
     */
    public function get_column($table, $ikey, $column) 
    {
        $this->db->select($column);
        $this->db->where('ikey', $ikey);
        $query = $this->db->get($table);
        return $query->row($column);
    }

    /**
     * @description 조건별 column 검색
     */
    public function get_column2($table, $column, $where) 
    {
        $this->db->select($column);
        $this->db->where($where);
        $query = $this->db->get($table);
        return $query->row($column);
    }

    /**
     * @description 조건별(like) column 검색
     */
    public function get_like($table, $sql, $column, $where) 
    {
        $this->db->select($sql);
        $this->db->like($where);
        $query = $this->db->get($table);
        return $query->row($column);
    }    

    /**
     * @description 조건별 칼럼 카운터 구하기
     */
    public function get_column_count($table, $where) 
    {
        $this->db->where($where);
        return $this->db->count_all_results($table);
    }

    /**
     * @description 조건별 like칼럼 카운터 구하기
     */
    public function get_like_count($table, $where, $gubun) 
    {
        $this->db->like($where, $gubun);
        return $this->db->count_all_results($table);
    }

    /**
     * @return 조건별 row value
     */
    public function get_row($table, $data)
    {
        $this->db->where($data);
        $query = $this->db->get($table);
        return $query->row();
    }

    /**
     * @return 조건별 result value
     */
    public function get_result($table, $data)
    {
        // base 
        $this->db->order_by('reg_dt', 'DESC');
        $this->db->order_by('ikey', 'DESC');
        $this->db->where($data);
        $query = $this->db->get($table);
        return $query->result();
    }

    /**
     * @return 조건별 result value
     */
    public function get_result2($table, $data, $sort)
    {
        // base 
        $this->db->order_by($sort);
        $this->db->where($data);
        $query = $this->db->get($table);
        return $query->result();
    }

    /**
     * @return 조건별 like result value
     */
    public function get_like_result($table, $data, $gubun)
    {
        // base 
        $this->db->order_by('reg_dt', 'DESC');
        $this->db->order_by('ikey', 'DESC');
        $this->db->like($data, $gubun);
        $query = $this->db->get($table);
        return $query->result();
    }
    
    /**
     * @description 조건별 맥스값 구하기
     */
    public function get_max($table, $wcolumn, $wvalue, $column) 
    {
        $this->db->select_max($column);
        $this->db->where($wcolumn, $wvalue);
        $query = $this->db->get($table);
        return $query->row($column);
    }

    /**
     * @description 조건별 맥스값 구하기
     */
    public function get_max2($table, $column, $where) 
    {
        $this->db->select_max($column);
        $this->db->where($where);
        $query = $this->db->get($table);
        return $query->row($column);
    }

    /**
     * @description 조건별 min값 구하기
     */
    public function get_min($table, $column, $where) 
    {
        $this->db->select_min($column);
        $this->db->where($where);
        $query = $this->db->get($table);
        return $query->row($column);
    }    

    /**
     * @description 테이블 AUTO_INCREMENT 값 구하기
     */
    public function get_auto_increment($table) 
    {
        $query = $this->db->query('SHOW TABLE STATUS LIKE "'.$table.'";');
        return $query->row('Auto_increment');
    }

    /**
     * @description 조건별 합계 구하기
     */
    public function get_sum($table, $field, $name, $where)
    {
        $this->db->select_sum($field, $name);
        $this->db->where($where);
        $query = $this->db->get($table);
        return $query->row($field);
    }

    /**
     * @description 조건별 코드 확인
     * 대분류 : 제품, 중분류 : 원단, 소분류 : 색상
     */
    public function get_category($table, $where, $sort, $key_level) 
    {
        // base 
        $this->db->order_by($sort);
        $this->db->where($where);
        // customize
        $this->db->where('key_level', $key_level);
        
        $query = $this->db->get($table);
        return $query->result();
    }

    /**
     * @description 선택별 하위 카테고리 확인
     */
    public function get_pick_category($table, $where) 
    {
        // base 
        $this->db->order_by('ikey', 'ASC');
        $this->db->where($where);
        
        $query = $this->db->get($table);
        return $query->result();
    }

    /**
     * @description 메인 페이지 신규주문, 주문완료, A/S신청, 반품신청 건수 get
     */
    public function order_list($dt)
    {
        try {
            // execute the stored procedure
            $sql = "CALL sp_dataCount(:ord_dt);";
            $stmt = DB::$pdo->prepare($sql);
            $stmt->bindParam(':ord_dt',   $dt,  PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_CLASS);
            return $results;
            $stmt->closeCursor();
            
        } catch (PDOException $pe) {
            die("Error occurred:" . $pe->getMessage());
        }
    }    

    /**
     * @description 영업담당자 리스트 조회
     */
    public function get_sales() 
    {
        $sql = 'SELECT DISTINCT(sale_name) AS sale_name FROM salesperson ORDER BY sale_name ASC';
        $query = $this->db->query($sql);
        return $query->result();
    }

    /**
     * @description 센터 고객 등급명칭 확인
     * @author 김민주, @version 1.0, @date 2021/05/14
     */
    public function get_grade($data) 
    {
		$local_cd = $this->session->userdata['local_cd'];

        $sql = 'SELECT a.amt1, a.amt2, a.amt3, a.amt4, a.amt5
                FROM amt_name AS a
                WHERE a.local_cd = ? AND a.cust_cd = ?';
        $query = $this->db->query($sql, array($local_cd, (string)$data['cust_cd']));
        return $query->row();
    }    

    /**
     * @description 센터 고객 등급명칭 기본값 세팅
     */
    public function set_grade($data) 
    {
        $this->db->trans_begin();
        $data = array(
            'local_cd'  => $data['local_cd'],
            'cust_cd'   => $data['cust_cd'],
            'amt1'      => '판매단가',
            'amt2'      => '소비자단가1',
            'amt3'      => '소비자단가2',
            'amt4'      => '소비자단가3',
            'amt5'      => '소비자단가4',
            'amt6'      => '소비자단가5',
            'amt7'      => '소비자단가6',
            'amt8'      => '소비자단가7',
            'amt9'      => '소비자단가8',
            'amt10'     => '소비자단가9'
        );
        $this->db->insert('amt_name', $data);
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
     * @description => jquery select2 리스트 셋팅
     */
    public function get_select2($table, $data, $where)
    {
        $sql = 'SELECT '.$data['id'].' AS id, '.$data['text'].' AS text FROM '.$table.' WHERE cust_name LIKE "%'.$data['sc'].'%" '.$where.'';
        if ($data['allyn'] == "Y")
        {
            $sql .= ' UNION SELECT "0" AS id, "'.$data['all_name'].'" AS text';
        }
        $sql .= ' ORDER BY id ASC';
                
        $query = $this->db->query($sql);
        return $query->result();
    }

	/**
	 * @description => amt_nm 가져오기
	 */
    public function get_amt_nm($table , $col_nm , $local_cd)
	{
		$amt_cnt = $this->get_count($table, array('local_cd' => $local_cd));
		if ($col_nm !== 'amt0')
        {
			if ($amt_cnt > 0)
            {
				$amt_nm = $this->get_column2($table, $col_nm ,array('local_cd' => $local_cd));
			}
            else
            {
				$amt_nm = $this->get_column2($table, $col_nm ,array('ikey' => 1));
			}
		}
        else
        {
			$amt_nm = '';
		}
		return $amt_nm;
	}

    /**
     * @description 공장 단일파일 업로드 INSERT
     */
    public function file_insert($data, $files)
    {
        $this->db->trans_begin();
        $result = array(
            'local_cd'   => $this->session->userdata['local_cd'],
            'file_seq'   => $data['file_seq'],         
            'file_dseq'  => $data['file_dseq'], 
            'file_orig'  => $files['client_name'],
            'file_nm'    => $files['orig_name'],
            'file_path'  => $data['file_path'],
            'reg_ikey'   => $this->session->userdata['ikey'],
            'reg_ip'     => $this->input->ip_address()
        );
        $this->db->insert('factory_file', $result);
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

}
