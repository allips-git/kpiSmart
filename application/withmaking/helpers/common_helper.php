<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @description common helper
 * @author 김민주, @version 1.0
 */

/**
 * @description call toast 
 */
function toast($msg='', $sticky='', $type='')
{
	echo '<script src="/public/js/lib/jquery-1.12.0.min.js"></script>';
	echo '<link rel="stylesheet" href="/public/css/lib/jquery.toast.css" />';
	echo '<script src="/public/js/lib/jquery.toast.js"></script>';
	echo "
		<script type='text/javascript'>
			$(function(){
				$.toast.config.align = 'right';
				$.toast.config.width = 400;
				$.toast('".$msg."', {sticky: Boolean('".$sticky."'), type: '".$type."'});
			});
		</script>
	";
}

/**
 * @description call bpopup 
 */
function bpopup($class='')
{
	echo '<script src="/public/js/lib/jquery.bpopup.min.js"></script>';
	echo '<script src="/public/js/common.js?<?=time()?>"></script>';
	echo "
		<script type='text/javascript'>
			$(function(){
				$('".$class."').bPopup({
					  modalClose: false
					, opacity: 0.8
					, positionStyle: 'absolute' 
					, speed: 300
					, transition: 'fadeIn'
					, transitionClose: 'fadeOut'
					, zIndex : 99997
					//, modalColor:'transparent' 
				});
			});
		</script>
	";
}

/**
 * @description call new popup 
 */
function wpopup($page, $title, $width, $height)
{
	echo "
		<script type='text/javascript'>
			var setting = width='".$width."', height='".$height."';
			window.open('".$page."', '".$title."', setting);
		</script>
	";	
}


/**
 * @description 자기 자신 팝업창 닫기
 */
function close()
{
	echo "
		<script type='text/javascript'>
			window.open('about:blank','_self').close();
		</script>
	";
}

/**
 * @description 자기 자신 팝업창 닫기, 부모페이지 새로고침
 */
function self_close()
{
	echo "
		<script type='text/javascript'>
			window.open('about:blank','_self').close();
			opener.location.reload();
		</script>
	";
}

/**
 * @description 자기 자신 팝업창 닫기, 부모페이지 이동
 */
function self_url($url)
{
	echo "
		<script type='text/javascript'>
			window.open('about:blank','_self').close();
			opener.location.replace('".$url."');
		</script>
	";
}

/**
 * @description 부모 팝업창 닫기
 */
function opener_close()
{
	echo "
		<script type='text/javascript'>
			opener.open('about:blank','_self').close();
		</script>
	";
}

/**
 * @description 부모창 새로고침
 */
function opener_reload()
{
	echo "
		<script type='text/javascript'>
			opener.location.reload();
		</script>
	";
}

/**
 * @description call base_code
 */
function base_code($idx='', $ikey='', $table='', $tclass='', $key_level='')
{
	echo '<script src="/public/js/lib/jquery-1.12.0.min.js"></script>';
	echo '<script src="/public/js/bms/base.js?'.time().'"></script>';
	echo "
		<script type='text/javascript'>
			base_code('".$idx."','".$ikey."','".$table."','".$tclass."','".$key_level."');
		</script>
	";
}

/**
 * @description form input, select, checkbox reset
 */
function frm_reset()
{
	echo "
		<script type='text/javascript'>
			$(function(){
				$('#frm_reset').find('input').not('#zzzz').val('');
				$('#frm_reset').find('checkbox').not('#zzzz').attr('checked','');
				$('#frm_reset').find('select').not('#zzzz').find('option:first').attr('selected', 'selected');
			});
		</script>
	";
}


/**
 * @description location replace
 * @param  $url
 */
function replace($url='/') {
	echo "<script type='text/javascript'>";
    if ($url)
        echo "window.location.replace('".$url."');";
	echo "</script>";
}
