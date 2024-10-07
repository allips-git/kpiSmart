<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 3d스페이스 database config 시스템 클래스
 * @author 김민주, @version 1.0, @last date 2022/10/18
 */
class CI_Space_db {

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
     * MYSQL db config information (git공유 제외)
     * @return object string
     */
    public static function mysql_conn() {

        $obj = array();
        $obj['domain']   = '';
        $obj['dbname']   = '';
        $obj['host']     = '49.247.20.86';
        $obj['username'] = 'withmaking';
        $obj['password'] = 'allips20@#';
        $obj['port']     = '3306';

        return $obj;

    }
}
