<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 공통 파일 업로드 클래스
 * @author 김민주, @version 1.0, @last date 2022/09/16
 */
class My_file {

    /**
     * @description 이미지 업로드 기본옵션 세팅
     */
    public static function set_img_options($dir, $idx='3')
    {   
        $config = array();
        $config['upload_path'] = $_SERVER['DOCUMENT_ROOT'].$dir;
        $config['allowed_types'] = 'png|jpg|jpge|gif';
        $config['max_size'] = '0';                  // 허용파일의 최대 사이즈, 0 = 무제한
        $config['max_width']  = '0';                // 이미지 허용 최대 폭, 0 = 무제한
        $config['max_height']  = '0';               // 이미지 허용 최대 높이, 0 = 무제한
        $config['overwrite'] = FALSE;               // true = 동일 파일명 덮어쓰기
        $config['file_name'] = time().$idx;         // 파일명 현재시간으로 변경
        $config['file_ext_tolower'] = TRUE;         // 파일 확장자 소문자 설정
        $config['file_permissions'] = 0777;         // 파일 권한 설정

        return $config;
    }
    
    /**
     * @description 이미지 퀄리티, 리사이즈 옵션 세팅
     */
    public static function set_img_quality($dir, $file_name)
    {
        $config = array();
        $config['image_library'] = 'gd2';   
        $config['source_image'] = $_SERVER['DOCUMENT_ROOT'].$dir.'/'.$file_name;
        //$config['new_image'] = $_SERVER['DOCUMENT_ROOT'].$dir.'/resize';
        $config['create_thumb'] = FALSE;    // 썸네일 생성
        $config['maintain_ratio'] = TRUE;   // 원본 이미지 가로X세로 비율 최대한 유지 설정
        $config['width']    = 500;          // 이미지 너비 설정
        $config['height']   = 500;          // 이미지 높이 설정
        $config['quality'] = 90;            // 이미지 퀄리티 설정

        return $config;
    }

    /**
     * @description 이미지 퀄리티, 리사이즈 후 파일 업로드
     */
    public static function img_resize($dir, $file_name)
    {
        $ci =& get_instance();
        $ci->load->library('image_lib');
        $ci->image_lib->initialize(My_file::set_img_quality($dir, $file_name));
        $result = array();
        if (!$ci->image_lib->resize())
        {
            $result = $ci->image_lib->display_errors();
        }
        $ci->image_lib->clear();
        return $result;
    }

    /**
     * @description 단일 이미지 파일 업로드(등록)
     */
    public static function img_insert($data, $name)
    {
        $result = array();
        $ci =& get_instance();
        $ci->load->library('upload');
        $files = $_FILES;
        $_FILES['userfile']['name'] = $files[$name]['name'];
        $_FILES['userfile']['type'] = $files[$name]['type'];
        $_FILES['userfile']['tmp_name'] = $files[$name]['tmp_name'];
        $_FILES['userfile']['error'] = $files[$name]['error'];
        $_FILES['userfile']['size']= $files[$name]['size']; 
    
        $ci->upload->initialize(My_file::set_img_options($data['file_path'], $data['file_seq']));
        if ($ci->upload->do_upload())
        {
            $result = array('result'=>true, 'data'=>$ci->upload->data()); 
            My_file::img_resize($data['file_path'], $result['data']['file_name']); // 원본 파일 수정 처리
        }
        else
        {
            $result = array('result'=>false, 'data'=>$ci->upload->display_errors());
        }
        return $result;
    }

    /**
     * @description 파일 업로드 기본옵션 세팅
     */
    public static function set_file_options($dir, $idx='3')
    {   
        $config = array();
        $config['upload_path'] = $_SERVER['DOCUMENT_ROOT'].$dir;
        $config['allowed_types'] = 'png|jpg|jpge|gif|pdf|txt|pptx';
        $config['max_size'] = '0';                  // 허용파일의 최대 사이즈, 0 = 무제한
        $config['max_width']  = '0';                // 이미지 허용 최대 폭, 0 = 무제한
        $config['max_height']  = '0';               // 이미지 허용 최대 높이, 0 = 무제한
        $config['overwrite'] = FALSE;               // true = 동일 파일명 덮어쓰기
        $config['file_name'] = time().$idx;         // 파일명 현재시간으로 변경
        $config['file_ext_tolower'] = TRUE;         // 파일 확장자 소문자 설정
        $config['file_permissions'] = 0777;         // 파일 권한 설정

        return $config;
    }

    /**
     * @description 단일 파일 업로드(등록)
     */
    public static function file_insert($data, $name)
    {
        $result = array();
        $ci =& get_instance();
        $ci->load->library('upload');
        $files = $_FILES;
        $_FILES['userfile']['name'] = $files[$name]['name'];
        $_FILES['userfile']['type'] = $files[$name]['type'];
        $_FILES['userfile']['tmp_name'] = $files[$name]['tmp_name'];
        $_FILES['userfile']['error'] = $files[$name]['error'];
        $_FILES['userfile']['size']= $files[$name]['size']; 
    
        $ci->upload->initialize(My_file::set_file_options($data['file_path'], $data['file_seq']));
        if ($ci->upload->do_upload())
        {
            $result = array('result'=>true, 'data'=>$ci->upload->data()); 
            //My_file::img_resize($data['file_path'], $result['data']['file_name']); // 원본 파일 수정 처리
        }
        else
        {
            $result = array('result'=>false, 'data'=>$ci->upload->display_errors());
        }
        return $result;
    }

    /**
     * @description 단일 파일 삭제
     */
    public static function file_delete($file_path)
    {
        $result = array();
        if (file_exists($file_path)) 
        {
           unlink($file_path);
           $result = array('result'=>true); 
        } 
        else 
        {
            $result = array('result'=>false); 
        }
        return $result;
    }

	/**
	 * @description 멀티 이미지 파일 업로드(등록) - 완성X
	 */
	public static function multi_insert($dir)
    {
        $ci =& get_instance();
        $ci->load->library('upload');
        $files = $_FILES;
        $cnt = count($_FILES['userfile']['name']);
        $result = array();
        $idx = 1;
        for($i=0; $i<$cnt; $i++)
        {           
            $_FILES['userfile']['name'] = $files['userfile']['name'][$i];
            $_FILES['userfile']['type'] = $files['userfile']['type'][$i];
            $_FILES['userfile']['tmp_name'] = $files['userfile']['tmp_name'][$i];
            $_FILES['userfile']['error'] = $files['userfile']['error'][$i];
            $_FILES['userfile']['size']= $files['userfile']['size'][$i];    

            $ci->upload->initialize(My_file::set_img_options($dir, $idx));
            if ( $ci->upload->do_upload() )
            {
                //$result[] = array('upload_data' => $ci->upload->data());
                $result[] = $ci->upload->data();   
                My_file::img_resize($dir, $result[$i]['file_name']); // 원본 파일 수정 처리
            }
            else
            {
                //$result[] = 'err_file_upload';
                //$result[] = $ci->upload->display_errors();
            }
            $idx++;
        }
        return $result;
    }

    /**
     * @description 멀티 이미지 파일 업로드(수정)
     */
    /*
    public static function img_update($dir)
    {
        $ci =& get_instance();
        $ci->load->library('upload');
        $files = $_FILES;
        $result = array();
        //$cnt = count($_FILES['userfile']['name']);
        $_FILES['userfile']['name'] = $files['userfile']['name'];
        $_FILES['userfile']['type'] = $files['userfile']['type'];
        $_FILES['userfile']['tmp_name'] = $files['userfile']['tmp_name'];
        $_FILES['userfile']['error'] = $files['userfile']['error'];
        $_FILES['userfile']['size']= $files['userfile']['size'];    

        $ci->upload->initialize(My_file::set_img_options($dir));
        if ( $ci->upload->do_upload() )
        {
            //$result[] = array('upload_data' => $ci->upload->data());
            $result[] = $ci->upload->data();   
            //My_file::img_resize($dir, $result['file_name']); // 원본 파일 수정 처리
        }
        else
        {
            //$result[] = 'err_file_upload';
            //$result[] = $ci->upload->display_errors();
        }
        return $result;
    }*/

}