<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Class Database
 */
class Database extends PDO {

    private $dbname ='';

    private $options = array(
        PDO::MYSQL_ATTR_FOUND_ROWS => true, // pdo insert, update rowcount return 
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    );
    
    function __construct($database = 'DefaultDatabase') 
    {

        $common_db = new CI_Space_db();  
        $db_conn = (object) $common_db->mysql_conn();
        $domain = $_SERVER['HTTP_HOST'];

        switch ($domain) 
        {
            case '3d-erp.allips.kr':
            case 'erp.3d-space.co.kr':
                $this->dbname = '3d_erp';
                break;
            case '3d_erp.localhost':
                $this->dbname = '3d_test';
                break;
        }
        parent::__construct("mysql:host=$db_conn->host; dbname=$this->dbname; charset=utf8", $db_conn->username, $db_conn->password, $this->options);
        
    }

}

class DB extends Database {

    /**
     * @var Database
     */
    public static $pdo = null;
    public static $allow_error_log = true;
    
    public static function conn() 
    {
        if (self::$pdo == null) self::$pdo = new Database();
    }

}

try {
    DB::conn();
} catch( PDOException $e ) {
    die($e->getMessage());
}
