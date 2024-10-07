<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 마이페이지 관리 모델
 * @author 김민주, @version 1.0, @last date 2021/11/29
 */
class Mypage_m extends CI_Model {

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @param  search parameter
     * @return table detail row
     */
    public function get_row($data)
    {

        $sql = 'SELECT u.ikey, u.ul_uc, u.dp_uc, d.dp_name, u.ul_job
                    , c.code_nm AS job_nm, u.ul_nm, u.pass, u.tel, u.email, u.id
                FROM z_plan.user_list AS u
                    INNER JOIN z_plan.departments AS d ON u.dp_uc = d.dp_uc
                    INNER JOIN z_plan.common_code AS c ON c.code_sub = u.ul_job
                WHERE u.local_cd = ? AND u.ul_uc = ?
                    AND c.code_gb = "HR" AND c.code_main = "010"';
        $query = $this->db->query($sql, array((string)$data['local_cd'], (string)$data['ul_uc']));
        return $query->row();

    }

}
