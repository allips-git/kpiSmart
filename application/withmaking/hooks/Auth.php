<?php
/**
 * @description auto login
 * @author 김민주, @version 1.0
 */
class Auth {

    private $CI;

    public function __construct() 
    {
        $this->CI = & get_instance();
    }

    /**
     * @description auto login, check login session
     */
    public function check_login()
    {
        /**
         * @description check login status(login page check only) -> login : true -> main page auto login
         */
        if ($this->CI->session->userdata('ikey') && strtolower($this->CI->uri->segment(1)) == 'login') 
        {
            redirect('/main');
        }
        else // login status : false
        {
            /**
             * isset : 변수 설정 확인
             * is_array : 배열 여부 확인
             * in_array : 배열 안에 해당 값이 있는지 확인
             * 각 controllers에 allow() 배열에 해당 메서드에 대한 값이 없을경우 아래 로직이 실행된다.
             */
            if (isset($this->CI->allow) && (is_array($this->CI->allow) === false OR in_array($this->CI->router->method, $this->CI->allow) === false))
            {
                /**
                 * @description check user idx(page all) -> idx : null  -> login page redirect
                 */
                if(!$this->CI->session->userdata('ikey'))
                {
                    redirect('/login');
                }
                
            }

        }

    }

}
?>
