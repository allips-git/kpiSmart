<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 부서 관리 컨트롤러
 * @author 김원명, @version 1.0
 * @author 김민주, @version 2.0, @last date 2022/04/28 - 라인 정리
 */
class Auth extends CI_Controller {

    public function __construct() 
	{ 
		parent::__construct();
        $this->allow=array(''); // check login hook  
        $this->load->model('/base/Auth_m');
        $this->load->helper('cookie');
	}

	public function index()
	{   
        $local_cd = $this->session->userdata['local_cd'];
        $cd = $this->input->get('dp_uc', TRUE);
        $set_value = "";

        // base argument
        $arg1 = array(
            'title'         => '부서 등록',
            'site_url'      => '/base/auth',
            's'             => $this->input->get('s', TRUE),
            'delyn'         => 'N',
            'per_page'      => 20,
            'uri_segment'   => 3,
            'num_links'     => 10,
            'model_path'    => '/base/Auth_m',
            'model_name'    => 'Auth_m'
        );  

        // search argument
        $arg2 = array(
            'local_cd'     => $this->session->userdata['local_cd'],
            'op'           => $this->input->get('op', TRUE),
            'sc'           => $this->input->get('sc', TRUE)
        );

        if (isset($cd))
        {
            $set_value = $this->Common_m->get_row('z_plan.departments', array('dp_uc' => $cd));
        }

        $data = $this->common->my_pagination($arg1, $arg2);
        $data['head'] = $this->Common_m->get_result2('z_plan.factory_menu', array('local_cd' => $local_cd, 'useyn' => 'Y', 'platform_gb' => 'B', 'cm_gb' => 'H'), 'cm_seq ASC');
        $data['pgm_id'] = $this->Common_m->get_result2('z_plan.factory_menu', array('local_cd' => $local_cd, 'useyn' => 'Y', 'platform_gb' => 'B', 'cm_gb' => 'N'), 'cm_seq ASC');
        $data['page'] = $this->uri->segment(3);
        $data['msg'] = get_cookie('k');
        $data['set_value'] = $set_value;

        // header, asize 디자인 유지용 파라미터
        $data['site_url'] = '/base/auth';
        $this->load->view('include/head');
        $this->load->view('include/bms_head');
        $this->load->view('include/bms_side');
        $this->load->view('base/auth', $data);
        $this->load->view('include/bms_tail');
        $this->load->view('include/tail');

        delete_cookie('k');
    }

    /**
     * @description 데이터 입력
     */
    public function i()
    {
        $local_cd = $this->session->userdata['local_cd'];

        $data['info'] = array(
            'local_cd'  =>  $local_cd
        );

        $num = $this->Common_m->get_max2('z_plan.departments', 'dp_seq', $data['info']);
        $seq = $num+1;

        $dp_seq = strlen($seq) == 1 ? '0'.$seq : $seq;
        $dp_uc = $local_cd."-"."DP-".$dp_seq;
        $dp_cd = "DP".$seq."0";

        $data['list'] = array(
            'local_cd'      => $local_cd,
            'main_cd'       => 'DP',
            'dp_seq'        => $dp_seq,
            'dp_uc'         => $dp_uc,
            'dp_cd'         => $dp_cd,
            'dp_name'       => $this->input->post('dpt_new', true),
            'memo'          => $this->input->post('memo_new', true),
            'reg_ikey'      => $this->session->userdata['ikey'],
            'reg_ip'        => $this->input->ip_address()
        );

        // 부서명 중복 검사 없으면 go
        if ($this->Common_m->get_column_count('z_plan.departments', array('dp_name' => $this->input->post('dpt_new', true), 'delyn' => 'N', 'local_cd' => $local_cd)) == 0)
        {
            $result = $this->Common_m->insert('z_plan.departments', $data['list']);
            if (!$result)
            {
                set_cookie('k', 'e', 500);
                redirect('/base/auth', 'location', 301);
            }
            else
            {
                $data['auth_list'] = $this->Common_m->get_result2('z_plan.factory_menu', array('local_cd' => $local_cd, 'useyn' => 'Y', 'platform_gb' => 'B'), 'cm_seq ASC');
                foreach ($data['auth_list'] as $row) :
                    if ($row->parent_gb == 'N')
                    {
                        $data['info'] = array(
                            'local_cd'          =>  $this->session->userdata['local_cd'],
                            'dp_uc'             =>  $dp_uc,
                            'pgm_id'            =>  $row->pgm_id,
                            'read'              =>  $this->input->post('sel['.$row->pgm_id.']', TRUE) == 'read' ? 'Y' : 'N',
                            'write'             =>  $this->input->post('input['.$row->pgm_id.']', TRUE) == 'write' ? 'Y' : 'N',
                            'modify'            =>  $this->input->post('edit['.$row->pgm_id.']', TRUE) == 'modify' ? 'Y' : 'N',
                            'delete'            =>  $this->input->post('del['.$row->pgm_id.']', TRUE) == 'delete' ? 'Y' : 'N',
                            'admin'             =>  $this->input->post('admin['.$row->pgm_id.']', TRUE) == 'admin' ? 'Y' : 'N',
                            'sysyn'             =>  'N',
                            'useyn'             =>  'Y',
                            'reg_idx'           =>  $this->session->userdata['ikey'],
                            'reg_ip'            =>  $this->input->ip_address()
                        );
                        $per = $this->Common_m->insert('z_plan.permission', $data['info']);
                    }
                endforeach;
                set_cookie('k', 'i', 500);
                redirect('/base/auth', 'location', 301);
            }
        }
        else
        {
            // 중복 시 back
            set_cookie('k', 'o', 500);
            redirect('/base/auth', 'location', 301);
        }
    }

    /**
     * @description 데이터 수정
     */
    public function u()
    {
        $local_cd = $this->session->userdata['local_cd'];
        $p = $this->input->post();
        $cnt = $this->Auth_m->get_overlap_count(array('dp_name' => $p['dpt_new'], 'delyn' => 'N', 'local_cd' => $local_cd), $p['dp_uc']);
        if ($cnt > 0)
        {
            /** 중복 시 back */
            set_cookie('k', 'o', 500);
            redirect('/base/auth', 'location', 301);
        }
        else
        {
            $dpt = $this->Common_m->update2('z_plan.departments', array('dp_name' => $p['dpt_new'], 'memo' => $p['memo_new']), array('dp_uc' => $p['dp_uc']));
            if ($dpt)
            {
                /** departments success */
                $data['auth_list'] = $this->Common_m->get_result2('z_plan.factory_menu', array('local_cd' => $local_cd, 'useyn' => 'Y', 'platform_gb' => 'B'), 'cm_seq ASC');
    
                foreach ($data['auth_list'] as $row) :
                    if ($row->parent_gb == 'N')
                    {
                        $per_cnt = $this->Common_m->get_count('z_plan.permission', array('dp_uc' => $p['dp_uc'], 'pgm_id' => $row->pgm_id));
                        if ($per_cnt > 0)
                        {
                            $data['info'] = array(
                                'pgm_id'    =>      $row->pgm_id,
                                'dp_uc'     =>      $p['dp_uc']
                            );
                            $data['list'] = array(
                                'read'         =>      $this->input->post('sel['.$row->pgm_id.']', TRUE) == 'read' ? 'Y' : 'N',
                                'write'        =>      $this->input->post('input['.$row->pgm_id.']', TRUE) == 'write' ? 'Y' : 'N',
                                'modify'       =>      $this->input->post('edit['.$row->pgm_id.']', TRUE) == 'modify' ? 'Y' : 'N',
                                'delete'       =>      $this->input->post('del['.$row->pgm_id.']', TRUE) == 'delete' ? 'Y' : 'N',
                                'admin'        =>      $this->input->post('admin['.$row->pgm_id.']', TRUE) == 'admin' ? 'Y' : 'N',
                                'mod_idx'      =>      $this->session->userdata['ikey'],
                                'mod_ip'       =>      $this->input->ip_address()
                            );
                            $result = $this->Common_m->update2('z_plan.permission', $data['list'], $data['info']);
                        }
                        else
                        {
                            $data['list'] = array(
                                'local_cd'          =>  $this->session->userdata['local_cd'],
                                'dp_uc'             =>  $p['dp_uc'],
                                'pgm_id'            =>  $row->pgm_id,
                                'read'              =>  $this->input->post('sel['.$row->pgm_id.']', TRUE) == 'read' ? 'Y' : 'N',
                                'write'             =>  $this->input->post('input['.$row->pgm_id.']', TRUE) == 'write' ? 'Y' : 'N',
                                'modify'            =>  $this->input->post('edit['.$row->pgm_id.']', TRUE) == 'modify' ? 'Y' : 'N',
                                'delete'            =>  $this->input->post('del['.$row->pgm_id.']', TRUE) == 'delete' ? 'Y' : 'N',
                                'admin'             =>  $this->input->post('admin['.$row->pgm_id.']', TRUE) == 'admin' ? 'Y' : 'N',
                                'sysyn'             =>  'N',
                                'useyn'             =>  'Y',
                                'reg_idx'           =>  $this->session->userdata['ikey'],
                                'reg_ip'            =>  $this->input->ip_address(),
                                'mod_idx'           =>  $this->session->userdata['ikey'],
                                'mod_ip'            =>  $this->input->ip_address()
                            );
                            $result = $this->Common_m->insert('z_plan.permission', $data['list']);
                        }
                    }
                endforeach;
    
                if ($result)
                {
                    /** permission update success */
                    set_cookie('k', 'u', 500);
                    redirect('/base/auth?s=t&op='.$p['op_new'].'&sc='.$p['sc_new'].'&dp_uc='.$p['dp_uc'], 'location', 301);
                }
                else
                {
                    /** permission update fail */
                    set_cookie('k', 'e', 500);
                    redirect('/base/auth?s=t&op='.$p['op_new'].'&sc='.$p['sc_new'], 'location', 301);
                }
            }
            else
            {
                /** departments update fail */
                set_cookie('k', 'e', 500);
                redirect('/base/auth?s=t&op='.$p['op_new'].'&sc='.$p['sc_new'], 'location', 301);
            }
        }
    }

    /**
     * @description 부서 on / off
     * @result_code 결과값 코드
     *  100 => 하나 이상의 창고는 on 상태 유지 되어야함. (모든 상태를 off 시도할 시 100 에러)
     *  110 => update error
     *  200 => OK
     */
    public function stat_change()
    {
        $useyn = $this->input->get('useyn', TRUE);
        $dp_uc = $this->input->get('dp_uc', TRUE);

        $data['list'] = array(
            'local_cd'  =>  $this->session->userdata['local_cd'],
            'useyn'     =>  'Y'
        );

        $data['st_cnt'] = array(
            'local_cd'  =>  $this->session->userdata['local_cd'],
            'dp_uc'     =>  $dp_uc,
            'sysyn'     =>  'Y'
        );
        
        $cnt = $this->Auth_m->get_where_count($data['list']);
        $st_cnt = $this->Auth_m->get_where_count($data['st_cnt']);

        if ($useyn == "Y" && $cnt == 1)
        {
            $result_code = 100;
        }
        else
        {
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
                };
                $result = $this->Common_m->update2('z_plan.departments', array('useyn' => $useyn), array('dp_uc' => $dp_uc));
    
                if ($result)
                {
                    $result_code = 200;
                }
                else
                {
                    $result_code = 110;
                }
            }
        }
        echo json_encode(['result_code'=>$result_code]);
    }

    /**
     * @description 데이터 삭제
     */
    public function d()
    {
        $p = $this->input->post();

        $del_1 = $this->Common_m->real_del('z_plan.permission', array('dp_uc' => $p['dp_uc']));
        $del_2 = $this->Common_m->real_del('z_plan.departments', array('dp_uc' => $p['dp_uc']));

        if ($del_1 && $del_2)
        {
            set_cookie('k', 'd', 500);
            redirect('/base/auth?s=t&op='.$p['op_new'].'&sc='.$p['sc_new'], 'location', 301);
        }
        else
        {
            set_cookie('k', 'o', 500);
            redirect('/base/auth?s=t&op='.$p['op_new'].'&sc='.$p['sc_new'], 'location', 301);
        }
    }
    
    /**
     * @description 폼 검증
     */
    public function v()
    {
        if (isset($_POST['p'])) 
        {
            $param = $this->input->post('p', true);
            $dpt = $this->input->post('dpt_new', true);
    
            $this->form_validation->set_message('required',     '<b>!</b> %s 입력 해주세요.');
    
            // 폼체크
            $config = array(
                // 필수입력 체크
                array('field'=>'dpt_new',             'label'=>'부서명을',            'rules'=>'trim|required')
            );
            
            $this->form_validation->set_rules($config);
            if($this->form_validation->run() == TRUE)
            {
                // 폼 검증 success
                switch ($param)
                {
                    case 'in': // 입력
                        $this->i();
                        break;
                    case 'up': // 수정
                        $this->u();
                        break;
                    case 'de': // 삭제
                        $this->d();
                        break;
                }
            }
            else
            {
                // 폼 검증 fail
                $this->index();
            }            
        }
        else
        {
            $this->index();
        }        
    }

    /**
     * @description 부서 목록 선택 시 js ajax로 해당 정보 return
     */
    public function get_auth()
    {
        $dp_uc = $this->input->get('dp_uc', true);

        $data['list'] = array(
            'dp_uc'    =>  $dp_uc,
            'ul_uc'   =>  ''
        );

        $data['auth'] = $this->Common_m->get_result('z_plan.permission', $data['list']);
        echo json_encode(['code'=>100, 'auth'=>$data['auth']]);
    }
}