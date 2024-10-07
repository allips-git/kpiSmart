<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 사용자등록 관리 컨트롤러
 * @author 김원명, @version 1.0
 * @author 김민주, @version 2.0, @last date 2022/04/28 - 라인정리 및 기타 수정(정렬변경, 패스워드검증, 폼 구도변경, 관리자권한 삭제)
 */
class User extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook
        $this->load->model('/base/User_m');
        $this->load->helper('cookie');
	}

	public function index()
	{
        $encrypt_key    = $this->config->item('encrypt_key');
        $local_cd       = $this->session->userdata['local_cd'];
        $cd             = $this->input->get('ul_uc', TRUE);
        $set_value      = "";

        $arg1 = array(
            'title'         => '사원 등록',
            'site_url'      => '/base/user',
            's'             => $this->input->get('s', TRUE),
            'key'           => $encrypt_key,
            'delyn'         => 'N',
            'per_page'      => 20,
            'uri_segment'   => 3,
            'num_links'     => 10,
            'model_path'    => '/base/User_m',
            'model_name'    => 'User_m'
        );

        // search argument
        $arg2 = array(
            'local_cd'    => $local_cd,  
            'op'          => $this->input->get('op', TRUE),
            'sc'          => $this->input->get('sc', TRUE)
        );

        if (isset($cd))
        {
            $set = $this->Common_m->get_row('z_plan.user_list', array('ul_uc' => $cd));
            $set_value = array(
                'dp_uc'         =>  $set->dp_uc,
                'ul_uc'         =>  $set->ul_uc,
                'ul_job'        =>  $set->ul_job,
                'ul_gb'         =>  $set->ul_gb,
                'id'            =>  $set->id,
                'ul_nm'         =>  $set->ul_nm,
                'tel'           =>  $this->common->custom_decrypt($set->tel, $encrypt_key, 'AES-128-ECB'),
                'email'         =>  $this->common->custom_decrypt($set->email, $encrypt_key, 'AES-128-ECB'),
                'biz_code'      =>  $this->common->custom_decrypt($set->biz_code, $encrypt_key, 'AES-128-ECB'),
                'address'       =>  $this->common->custom_decrypt($set->address, $encrypt_key, 'AES-128-ECB'),
                'addr_detail'   =>  $this->common->custom_decrypt($set->addr_detail, $encrypt_key, 'AES-128-ECB'),
                'memo'          =>  $set->memo,
                'in_dt'         =>  (string)$set->in_dt,
                'out_dt'        =>  (string)$set->out_dt,
                'bank_cd'       =>  $set->bank_cd,
                'bank_no'       =>  $this->common->custom_decrypt($set->bank_no, $encrypt_key, 'AES-128-ECB'),
                'useyn'         =>  $set->useyn,
                'sysyn'         =>  $set->sysyn
            );
        }

        $data = $this->common->my_pagination($arg1, $arg2);
        $data['key']    = $this->config->item('encrypt_key');
        $data['page']   = $this->uri->segment(3);
        $data['msg']    = get_cookie('k');

        $data['set_value'] = $set_value;

        // 대분류 메뉴
        $data['head'] = $this->Common_m->get_result2('z_plan.factory_menu', array('local_cd' => $local_cd, 'useyn' => 'Y', 'platform_gb' => 'B', 'cm_gb' => 'H'), 'cm_seq ASC');

        // 소분류 메뉴
        $data['pgm_id'] = $this->Common_m->get_result2('z_plan.factory_menu', array('local_cd' => $local_cd, 'useyn' => 'Y', 'platform_gb' => 'B', 'cm_gb' => 'N'), 'cm_seq ASC');

        // 부서
        $data['dpt']    = $this->Common_m->get_result2('z_plan.departments', array('delyn' => 'N', 'local_cd' => $local_cd), 'dp_name ASC');

        // 직급
        $data['ul_job'] = $this->Common_m->get_result2('z_plan.common_code', array('code_gb' => 'HR', 'code_main' => '010', 'useyn' => 'Y'), 'code_sub ASC');

        // 사원유형
        $data['ul_gb']  = $this->Common_m->get_result2('z_plan.common_code', array('code_gb' => 'HR', 'code_main' => '030', 'useyn' => 'Y'), 'code_sub ASC'); 
          
        // 은행
        $data['bank']   = $this->Common_m->get_result2('z_plan.common_code', array('code_gb' => 'AC', 'code_main' => '030', 'useyn' => 'Y'), 'code_sub ASC');   
        

        // header, asize 디자인 유지용 파라미터
        $data['site_url'] = '/base/user';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('base/user', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');

        delete_cookie('k');
	}
 
    /**
     * @description js ajax에서 가공 데이터 return 함수
     */
    public function get_info()
    {
        $encrypt_key    = $this->config->item('encrypt_key');
        $local_cd       = $this->session->userdata['local_cd'];
        $kind           = $this->input->get('kind', true);
        $dp_uc          = $this->input->get('dp_uc', true);

        switch ($kind)
        {
            /** 부서 선택 시 */
            case 'dpt':
                $data['list'] = array(
                    'dp_uc'  =>  $dp_uc,
                    'ul_uc'  =>  ''
                );
                $data['info'] = $this->Common_m->get_result('z_plan.permission', $data['list']);
                echo json_encode(['code'=>100, 'info'=>$data['info']]);
                break;

            /** 사용자 선택 시 */
            case 'user':
                $dp_uc = $this->input->get('dp_uc', TRUE);
                $ul_uc = $this->input->get('ul_uc', true);
                $data['list'] = array(
                    'ul_uc'  =>  $ul_uc
                );
                $info = $this->Common_m->get_row('z_plan.user_list', $data['list']);
                /** base64 디코딩해서 재가공 */
                $data['info'] = array(
                    'dp_uc'         =>  $info->dp_uc,
                    'ul_uc'         =>  $info->ul_uc,
                    'ul_job'        =>  $info->ul_job,
                    'ul_gb'         =>  $info->ul_gb,
                    'id'            =>  $info->id,
                    'ul_nm'         =>  $info->ul_nm,
                    'tel'           =>  $this->common->custom_decrypt($info->tel, $encrypt_key, 'AES-128-ECB'),
                    'email'         =>  $this->common->custom_decrypt($info->email, $encrypt_key, 'AES-128-ECB'),
                    'biz_code'      =>  $this->common->custom_decrypt($info->biz_code, $encrypt_key, 'AES-128-ECB'),
                    'address'       =>  $this->common->custom_decrypt($info->address, $encrypt_key, 'AES-128-ECB'),
                    'addr_detail'   =>  $this->common->custom_decrypt($info->addr_detail, $encrypt_key, 'AES-128-ECB'),
                    'memo'          =>  $info->memo,
                    'in_dt'         =>  (string)$info->in_dt,
                    'out_dt'        =>  (string)$info->out_dt,
                    'bank_cd'       =>  $info->bank_cd,
                    'bank_no'       =>  $this->common->custom_decrypt($info->bank_no, $encrypt_key, 'AES-128-ECB'),
                    'useyn'         =>  $info->useyn,
                    'admin_gb'      =>  $info->admin_gb
                );
                $data['auth'] = $this->User_m->get_user_auth_tmp($dp_uc, $ul_uc, $local_cd);
                echo json_encode(['code'=>100, 'info'=>$data['info'], 'auth'=>$data['auth']]);
                break;
        };
    }

    /**
     * @description 사용자 on / off
     * @result_code 결과값 코드
     *  110 => update error
     *  120 => 삭제불가능 유저
     *  200 => OK
     */
    public function stat_change()
    {
        $useyn = $this->input->get('useyn', TRUE);
        $ul_uc = $this->input->get('ul_uc', TRUE);

        $data['list'] = array(
            'local_cd'  =>  $this->session->userdata['local_cd'],
            'ul_uc'     =>  $ul_uc,
            'sysyn'     =>  'Y'
        );
        
        $st_cnt = $this->Common_m->get_count('z_plan.user_list', $data['list']);
        if ($st_cnt > 0)
        {
            $result_code = 120;
        }
        else
        {
            if ($useyn == "Y")
            {
                $useyn = "N";
            }
            else
            {
                $useyn = "Y";
            }
            $result = $this->Common_m->update2('z_plan.user_list', array('useyn' => $useyn), array('ul_uc' => $ul_uc));
            if ($result)
            {
                $result_code = 200;
            }
            else
            {
                $result_code = 110;
            }
        }
        echo json_encode(['result_code'=>$result_code]);
    }

    /**
     * @description 데이터 입력
     */
    public function i()
    {
        $encrypt_key    = $this->config->item('encrypt_key');
        $p              = $this->input->post();
        $local_cd       = $this->session->userdata['local_cd'];
        $data['info']   = array(
            'local_cd'  =>  $local_cd
        );
        $num            = $this->Common_m->get_max2('z_plan.user_list', 'ul_seq', $data['info']);
        $seq = $num+1;
        $ul_seq = strlen($seq) == 1 ? '0'.$seq : $seq;
        $ul_uc = $local_cd."-"."UL-".$ul_seq;
        $ul_cd = $local_cd."-".$seq."0";

        $data['auth_list'] = $this->Common_m->get_result2('z_plan.factory_menu', array('local_cd' => $local_cd, 'useyn' => 'Y', 'platform_gb' => 'B'), 'cm_seq ASC');
        $data['list'] = array(
            'local_cd'      =>  $local_cd,
            'main_cd'       =>  'UL',
            'ul_seq'        =>  $ul_seq,
            'ul_uc'         =>  $ul_uc,
            'ul_cd'         =>  $ul_cd,
            'ul_gb'         =>  $p['p_ul_gb'],
            'dp_uc'         =>  $p['p_dp_uc'],
            'ul_job'        =>  $p['p_ul_job'],
            'admin_gb'      =>  $p['p_admin_gb'],
            'ul_nm'         =>  $p['p_ul_nm'],
            'id'            =>  $p['p_id'],
            'pass'          =>  strtoupper(hash('sha256', $p['p_pass'])),
            'tel'           =>  $p['p_tel'] != '' ? $this->common->custom_encrypt($p['p_tel'], $encrypt_key, 'AES-128-ECB') : '',
            'email'         =>  $p['p_email'] != '' ? $this->common->custom_encrypt($p['p_email'], $encrypt_key, 'AES-128-ECB') : '',
            'biz_code'      =>  $p['p_biz_code'] != '' ? $this->common->custom_encrypt($p['p_biz_code'], $encrypt_key, 'AES-128-ECB') : '',
            'address'       =>  $p['p_address'] != '' ? $this->common->custom_encrypt($p['p_address'], $encrypt_key, 'AES-128-ECB') : '',
            'addr_detail'   =>  $p['p_addr_detail'] != '' ? $this->common->custom_encrypt($p['p_addr_detail'], $encrypt_key, 'AES-128-ECB') : '',
            'in_dt'         =>  $p['p_in_dt'],
            'out_dt'        =>  $p['p_out_dt'],
            'bank_cd'       =>  $p['p_bank_cd'],
            'bank_no'       =>  $p['p_bank_no'] != '' ? $this->common->custom_encrypt($p['p_bank_no'], $encrypt_key, 'AES-128-ECB') : '',
            'memo'          =>  $p['p_memo'],
            'useyn'         =>  $p['p_useyn'],
            'reg_ikey'      =>  $this->session->userdata['ikey'],
            'reg_ip'        =>  $this->input->ip_address()
        );

        if ($this->Common_m->get_column_count('z_plan.user_list', array('local_cd' => $local_cd, 'id' => $p['p_id'], 'delyn' => 'N')) == 0)
        {
            $result = $this->Common_m->insert('z_plan.user_list', $data['list']);
            $sys_up = $this->Common_m->update2('z_plan.departments', array('sysyn' => 'Y'), array('dp_uc' => $p['p_dp_uc'])); // 사용된 부서 sysyn 처리

            foreach($data['auth_list'] as $row) :
                if ($row->cm_gb == 'N')
                {
                    //값 비교, 부여된 부서 권한과 권한 값이 동일 한지 비교
                    $data['info'] = array(
                        'dp_uc'        =>      $p['p_dp_uc'],
                        'ul_uc'        =>      '',
                        'pgm_id'       =>      $row->pgm_id,
                        'read'         =>      $this->input->post('sel['.$row->pgm_id.']', TRUE) == 'read' ? 'Y' : 'N',
                        'write'        =>      $this->input->post('input['.$row->pgm_id.']', TRUE) == 'write' ? 'Y' : 'N',
                        'modify'       =>      $this->input->post('edit['.$row->pgm_id.']', TRUE) == 'modify' ? 'Y' : 'N',
                        'delete'       =>      $this->input->post('del['.$row->pgm_id.']', TRUE) == 'delete' ? 'Y' : 'N',
                        'admin'        =>      $this->input->post('admin['.$row->pgm_id.']', TRUE) == 'admin' ? 'Y' : 'N'
                    );
                    $comp = $this->Common_m->get_column_count('z_plan.permission', $data['info']);

                    //동일 하지 않을 때 값을 ul_uc값을 추가하여 insert
                    if ($comp == 0)
                    {
                        $data['info_2'] = array(
                            'local_cd'     =>      $local_cd,
                            'dp_uc'        =>      $p['p_dp_uc'],
                            'ul_uc'        =>      $ul_uc,
                            'pgm_id'       =>      $row->pgm_id,
                            'read'         =>      $this->input->post('sel['.$row->pgm_id.']', TRUE) == 'read' ? 'Y' : 'N',
                            'write'        =>      $this->input->post('input['.$row->pgm_id.']', TRUE) == 'write' ? 'Y' : 'N',
                            'modify'       =>      $this->input->post('edit['.$row->pgm_id.']', TRUE) == 'modify' ? 'Y' : 'N',
                            'delete'       =>      $this->input->post('del['.$row->pgm_id.']', TRUE) == 'delete' ? 'Y' : 'N',
                            'admin'        =>      $this->input->post('admin['.$row->pgm_id.']', TRUE) == 'admin' ? 'Y' : 'N',
                            'reg_idx'      =>      $this->session->userdata['ikey'],
                            'reg_ip'       =>      $this->input->ip_address()
                        );
                        $result2 = $this->Common_m->insert('z_plan.permission', $data['info_2']);
                    }
                }
            endforeach;
        }
        else
        {
            set_cookie('k', 'o', 500);
            redirect('/base/user', 'location', 301);
            return;
        }
        set_cookie('k', 's', 500);
        redirect('/base/user', 'location', 301);
    }

    /**
     * @description 데이터 수정
     */
    public function u()
    {
        $encrypt_key    = $this->config->item('encrypt_key');
        $local_cd       = $this->session->userdata['local_cd'];
        $p              = $this->input->post();
        
        if ($p['p_pass'] == "")
        {
            $data['list'] = array(
                'ul_gb'         =>  $p['p_ul_gb'],
                'dp_uc'         =>  $p['p_dp_uc'],
                'ul_job'        =>  $p['p_ul_job'],
                'admin_gb'      =>  $p['p_admin_gb'],
                'ul_nm'         =>  $p['p_ul_nm'],
                'tel'           =>  $p['p_tel'] != '' ? $this->common->custom_encrypt($p['p_tel'], $encrypt_key, 'AES-128-ECB') : '',
                'email'         =>  $p['p_email'] != '' ? $this->common->custom_encrypt($p['p_email'], $encrypt_key, 'AES-128-ECB') : '',
                'biz_code'      =>  $p['p_biz_code'] != '' ? $this->common->custom_encrypt($p['p_biz_code'], $encrypt_key, 'AES-128-ECB') : '',
                'address'       =>  $p['p_address'] != '' ? $this->common->custom_encrypt($p['p_address'], $encrypt_key, 'AES-128-ECB') : '',
                'addr_detail'   =>  $p['p_addr_detail'] != '' ? $this->common->custom_encrypt($p['p_addr_detail'], $encrypt_key, 'AES-128-ECB') : '',
                'in_dt'         =>  $p['p_in_dt'],
                'out_dt'        =>  $p['p_out_dt'],
                'bank_cd'       =>  $p['p_bank_cd'],
                'bank_no'       =>  $p['p_bank_no'] != '' ? $this->common->custom_encrypt($p['p_bank_no'], $encrypt_key, 'AES-128-ECB') : '',
                'memo'          =>  $p['p_memo'],
                'useyn'         =>  $p['p_useyn'],
                'mod_ikey'      => $this->session->userdata['ikey'],
                'mod_ip'        => $this->input->ip_address()
            );
        }
        else
        {
            $data['list'] = array(
                'ul_gb'         =>  $p['p_ul_gb'],
                'dp_uc'         =>  $p['p_dp_uc'],
                'ul_job'        =>  $p['p_ul_job'],
                'admin_gb'      =>  $p['p_admin_gb'],
                'ul_nm'         =>  $p['p_ul_nm'],
                'pass'          =>  strtoupper(hash('sha256', $p['p_pass'])),
                'tel'           =>  $p['p_tel'] != '' ? $this->common->custom_encrypt($p['p_tel'], $encrypt_key, 'AES-128-ECB') : '',
                'email'         =>  $p['p_email'] != '' ? $this->common->custom_encrypt($p['p_email'], $encrypt_key, 'AES-128-ECB') : '',
                'biz_code'      =>  $p['p_biz_code'] != '' ? $this->common->custom_encrypt($p['p_biz_code'], $encrypt_key, 'AES-128-ECB') : '',
                'address'       =>  $p['p_address'] != '' ? $this->common->custom_encrypt($p['p_address'], $encrypt_key, 'AES-128-ECB') : '',
                'addr_detail'   =>  $p['p_addr_detail'] != '' ? $this->common->custom_encrypt($p['p_addr_detail'], $encrypt_key, 'AES-128-ECB') : '',
                'in_dt'         =>  $p['p_in_dt'],
                'out_dt'        =>  $p['p_out_dt'],
                'bank_cd'       =>  $p['p_bank_cd'],
                'bank_no'       =>  $p['p_bank_no'] != '' ? $this->common->custom_encrypt($p['p_bank_no'], $encrypt_key, 'AES-128-ECB') : '',
                'memo'          =>  $p['p_memo'],
                'useyn'         =>  $p['p_useyn'],
                'mod_ikey'      => $this->session->userdata['ikey'],
                'mod_ip'        => $this->input->ip_address()
            );
        };

        $result = $this->Common_m->update2('z_plan.user_list', $data['list'], array('ul_uc' => $p['p_ul_uc']));
        $sys_up = $this->Common_m->update2('z_plan.departments', array('sysyn' => 'Y'), array('dp_uc' => $p['p_dp_uc'])); // 사용된 부서 sysyn 처리
        if ($result)
        {         
            $data['auth'] = $this->User_m->get_user_auth_tmp($p['p_dp_uc'], $p['p_ul_uc'], $local_cd);
            foreach($data['auth'] as $row) :
                //값 비교, 부여된 부서 권한과 권한 값이 동일 한지 비교
                    //값 비교, 부여된 부서 권한과 권한 값이 동일 한지 비교
                $data['info'] = array(
                    'dp_uc'        =>      $p['p_dp_uc'],
                    'ul_uc'        =>      '',
                    'pgm_id'       =>      $row->pgm_id,
                    'read'         =>      $this->input->post('sel['.$row->pgm_id.']', TRUE) == 'read' ? 'Y' : 'N',
                    'write'        =>      $this->input->post('input['.$row->pgm_id.']', TRUE) == 'write' ? 'Y' : 'N',
                    'modify'       =>      $this->input->post('edit['.$row->pgm_id.']', TRUE) == 'modify' ? 'Y' : 'N',
                    'delete'       =>      $this->input->post('del['.$row->pgm_id.']', TRUE) == 'delete' ? 'Y' : 'N',
                    'admin'        =>      $this->input->post('admin['.$row->pgm_id.']', TRUE) == 'admin' ? 'Y' : 'N'
                );
                $comp = $this->Common_m->get_column_count('z_plan.permission', $data['info']);

                //동일 하지 않을 때 ul_uc 재검색
                if ($comp == 0)
                {
                    $data['info_2'] = array(
                        'pgm_id'       =>      $row->pgm_id,
                        'dp_uc'        =>      $p['p_dp_uc'],
                        'ul_uc'        =>      $p['p_ul_uc']
                    );

                    $comp2 = $this->Common_m->get_column_count('z_plan.permission', $data['info_2']);
                    if ($comp2 == 0) // ul_uc 재검색 했을 때 값이 없을 시 insert
                    { 
                        $data['i_info'] = array(
                            'local_cd'     =>      $local_cd,
                            'dp_uc'        =>      $p['p_dp_uc'],
                            'ul_uc'        =>      $p['p_ul_uc'],
                            'pgm_id'       =>      $row->pgm_id,
                            'read'         =>      $this->input->post('sel['.$row->pgm_id.']', TRUE) == 'read' ? 'Y' : 'N',
                            'write'        =>      $this->input->post('input['.$row->pgm_id.']', TRUE) == 'write' ? 'Y' : 'N',
                            'modify'       =>      $this->input->post('edit['.$row->pgm_id.']', TRUE) == 'modify' ? 'Y' : 'N',
                            'delete'       =>      $this->input->post('del['.$row->pgm_id.']', TRUE) == 'delete' ? 'Y' : 'N',
                            'admin'        =>      $this->input->post('admin['.$row->pgm_id.']', TRUE) == 'admin' ? 'Y' : 'N',
                            'reg_idx'      =>      $this->session->userdata['ikey'],
                            'reg_ip'       =>      $this->input->ip_address()
                        );
                        $i_result = $this->Common_m->insert('z_plan.permission', $data['i_info']);

                    }
                    else // ul_uc 재검색 했을 때 값이 있을 시 update
                    {
                        $data['u_info'] = array(
                            'read'         =>      $this->input->post('sel['.$row->pgm_id.']', TRUE) == 'read' ? 'Y' : 'N',
                            'write'        =>      $this->input->post('input['.$row->pgm_id.']', TRUE) == 'write' ? 'Y' : 'N',
                            'modify'       =>      $this->input->post('edit['.$row->pgm_id.']', TRUE) == 'modify' ? 'Y' : 'N',
                            'delete'       =>      $this->input->post('del['.$row->pgm_id.']', TRUE) == 'delete' ? 'Y' : 'N',
                            'admin'        =>      $this->input->post('admin['.$row->pgm_id.']', TRUE) == 'admin' ? 'Y' : 'N',
                            'mod_idx'      =>      $this->session->userdata['ikey'],
                            'mod_ip'       =>      $this->input->ip_address()
                        );
                        $data['u_where'] = array(
                            'pgm_id'    =>      $row->pgm_id,
                            'dp_uc'     =>      $p['p_dp_uc'],
                            'ul_uc'     =>      $p['p_ul_uc']
                        );
                        
                        $u_result = $this->Common_m->update2('z_plan.permission', $data['u_info'], $data['u_where']);
                    }
                }
                else // 원래 부서 권한과 동일 시 ul_uc 값으로 들어간 데이터를 모두 delete
                {
                    if ($row->useyn == 'Y')
                    {
                        $data['u_where'] = array(
                            'pgm_id'    =>      $row->pgm_id,
                            'dp_uc'     =>      $p['p_dp_uc'],
                            'ul_uc'     =>      $p['p_ul_uc']
                        );
                        $u_result = $this->Common_m->real_del('z_plan.permission', $data['u_where']);
                    }
                }
            endforeach;
            set_cookie('k', 'u', 500);
            redirect('/base/user?s=t&op='.$p['p_op'].'&sc='.$p['p_sc'].'&ul_uc='.$p['p_ul_uc'].'', 'location', 301);
        }
        else
        {
            set_cookie('k', 'o', 500);
            redirect('/base/user?s=t&op='.$p['p_op'].'&sc='.$p['p_sc'].'', 'location', 301);
        }
    }

    /**
     * @description 데이터 삭제
     */
    public function d()
    {
        $p = $this->input->post();
        $ikey = $this->Common_m->get_column2('z_plan.user_list', 'ikey', array('ul_uc' => $p['p_ul_uc']));

        if ($ikey == $this->session->userdata['ikey'])
        {
            set_cookie('k', 'de', 500);
            redirect('/base/user?s=t&op='.$p['p_op'].'&sc='.$p['p_sc'], 'location', 301);
        }
        else
        {
            $auth_del = $this->Common_m->real_del('z_plan.permission', array('ul_uc' => $p['p_ul_uc']));
            $user_del = $this->Common_m->real_del('z_plan.user_list', array('ul_uc' => $p['p_ul_uc']));

            if ($auth_del && $user_del)
            {
                set_cookie('k', 'd', 500);
                redirect('/base/user?s=t&op='.$p['p_op'].'&sc='.$p['p_sc'], 'location', 301);
            }
            else
            {
                set_cookie('k', 'e', 500);
                redirect('/base/user?s=t&op='.$p['p_op'].'&sc='.$p['p_sc'], 'location', 301);
            }
        }
    }

    /**
     * @description 구분별 함수 이동 (입력/수정/삭제)
     */
    public function v()
    {
        $param = $this->input->post('p', true);
        if (isset($param)) 
        {
            switch ($param) 
            {
                case 'in':
                    $this->i(); // 입력
                    break;
                case 'up':
                    $this->u(); // 수정
                    break;
                case 'de':
                    $this->d(); // 삭제
                break;
            }
        }
        else
        {
            $this->index();
        }
    }
}
