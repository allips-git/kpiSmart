<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 로그인 모델
 */ 
class Login_m extends CI_Model {

	protected $table = 'z_plan.user_list';
 
     public function __construct()
     {
          parent::__construct();
     }

     /**
     * @description users validation
     * @param  $id, $password
     * @return result count
     */
     public function check_users($users)
     {
          $this->db->where($users);

          return $this->db->count_all_results($this->table);
     }

     /**
     * @description user info all
     * @param  $id
     * @return result user row
     */
     public function select_users_all($id, $ul_cd)
     {
          $sql = '  SELECT u.ikey, u.local_cd, u.ul_nm, u.id, u.ul_uc
                    , u.dp_uc, u.useyn, f.fa_nm , f.item
                    FROM z_plan.user_list AS u
                         INNER JOIN z_plan.factory AS f ON u.local_cd = f.local_cd
                    WHERE u.id = ? AND u.ul_cd = ? AND u.useyn = "Y"';
          $query = $this->db->query($sql, array((string)$id, (string)$ul_cd));
          return $query->row();
     }

     public function update_login_dt($ikey)
     {
          $this->db->where('ikey', $ikey);
          
          $this->db->set('last_dt', 'now()', false);
          $this->db->set('login_cnt', 'login_cnt + 1', false);
          $this->db->update($this->table);
     }
}
