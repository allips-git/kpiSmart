<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| Hooks
| -------------------------------------------------------------------------
| This file lets you define "hooks" to extend CI without hacking the core
| files.  Please see the user guide for info:
|
|	https://codeigniter.com/user_guide/general/hooks.html
|
*/

/**
 * @description config hooks
 */
$hook['post_controller_constructor'][] = array(
    'class'     => 'Hook_post_controller',
    'function'  => 'load_config',
    'filename'  => 'Hook_post_controller.php',
    'filepath'  => 'hooks'
);
/**
 * @description check user session hooks 
 */
$hook['post_controller'][] = array(
    'class'     => 'Auth',
    'function'  => 'check_login',
    'filename'  => 'Auth.php',
    'filepath'  => 'hooks'
);

