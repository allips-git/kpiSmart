<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @description alert helper
 * @author 김민주, @version 1.0
 */

/**
 * @description output msg, location replace
 * @param  $msg, $url
 */
function alert($msg='', $url='') 
{
	echo "
		<script type='text/javascript'>
			alert('".$msg."');
			location.replace('".$url."');
		</script>
	";
}


/**
 * @description alert only
 * @param  $msg
 */
function alert_only($msg='') 
{
	echo "<script type='text/javascript'> alert('".$msg."'); </script> ";
	//die();
}


/**
 * @description window close
 * @param  $msg
 */
function alert_close($msg) 
{
	echo "<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">";
	echo "<script type='text/javascript'> alert('".$msg."'); window.close(); </script>";
	exit;
}
