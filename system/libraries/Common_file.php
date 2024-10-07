<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 공통 파일 라이브러리 시스템 클래스
 * @author , @version 1.0, @last date 
 */
class CI_Common_file {
    /**
     * Reference to the CodeIgniter instance
     *
     * @var object
     */
    /*
    private $CI;

    function __construct()
    {
        // Assign the CodeIgniter super-object
        $this->CI =& get_instance();
    }*/
    /**
     * @description 파일 insert (dir => 경로 / name => input file name)
     */
    public static function file_insert($dir, $name) {
        $result = array();
        $ci =& get_instance();
        $ci->load->library('upload');

        $files = $_FILES;
        $_FILES['userfile']['name'] = $files[$name]['name'];
        $_FILES['userfile']['type'] = $files[$name]['type'];
        $_FILES['userfile']['tmp_name'] = $files[$name]['tmp_name'];
        $_FILES['userfile']['error'] = $files[$name]['error'];
        $_FILES['userfile']['size']= $files[$name]['size'];

        $config = array();
        $config['upload_path'] = $_SERVER['DOCUMENT_ROOT'].$dir;
        $config['allowed_types'] = 'png|jpg|jpeg|gif';
        $config['max_size'] = 0;                  // 허용파일의 최대 사이즈, 0 = 무제한
        $config['max_width']  = 0;                // 이미지 허용 최대 폭, 0 = 무제한
        $config['max_height']  = 0;               // 이미지 허용 최대 높이, 0 = 무제한
        $config['overwrite'] = FALSE;               // true = 동일 파일명 덮어쓰기
        $config['file_name'] = time();              // 파일명 현재시간으로 변경
        $config['file_ext_tolower'] = TRUE;         // 파일 확장자 소문자 설정
        $config['file_permissions'] = 0777;         // 파일 권한 설정

        $ci->upload->initialize($config);

        if ($ci->upload->do_upload()){
            $result = array('result'=>true, 'data'=>$ci->upload->data());

            /** 이미지 퀄리티 90% 처리*/
            $file = $_SERVER["DOCUMENT_ROOT"].$dir.'/'.$result['data']['file_name'];
            $exec_result = shell_exec("mogrify -quality 80% ".$file."");
        }else{
            $result = array('result'=>false, 'data'=>$ci->upload->display_errors());
        }

        return $result;
    }
}
