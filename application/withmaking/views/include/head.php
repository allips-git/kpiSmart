<?php
	$mobilechk = '/(iPod|iPhone|Android|BlackBerry|SymbianOS|SCH-M\d+|Opera Mini|Windows CE|Nokia|SonyEricsson|webOS|PalmOS)/i'; 
?>
<?php
	$u_agent = $_SERVER['HTTP_USER_AGENT'];
	if (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') == !FALSE || strpos($_SERVER['HTTP_USER_AGENT'], 'Trident') == !FALSE) 
	{ 
		//echo "익스";
	}
	else {
		//echo "기타";
	}
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>3d erp</title>

	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	
	<meta property="og:type" content="article" />
	<meta property="og:title" content=" Allips" />
	<meta property="og:url" content="" />
	<meta property="og:description" content="반갑습니다. Allips입니다." />
	<meta property="og:image" content="/public/img/orimage.png" />
	<meta property="og:image:width" content="800" />
	<meta property="og:image:height" content="400" />

	<meta name="title" content=" Allips" />
	<meta name="description" content="반갑습니다. Allips입니다." />
	<!-- Chrome, Firefox OS and Opera -->
	<meta name="theme-color" content="#0f182d">
	<!-- Windows Phone -->
	<meta name="msapplication-navbutton-color" content="#0f182d">
	<!-- iOS Safari -->
	<!-- <meta name="apple-mobile-web-app-status-bar-style" content=""> -->
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
	<meta name="apple-mobile-web-app-status-bar-style" content="">

	<!-- facivon -->
	<link rel="shortcut icon" href="/public/img/favicon.ico">

	<!-- viewport -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<!-- css -->
	<link rel="stylesheet" href="/public/css/lib/fontawesome.css">
	<link rel="stylesheet" href="/public/css/lib/font-awesome.min.css">
	<link rel="stylesheet" href="/public/css/font.css">
	<link rel="stylesheet" href="/public/css/lib/jquery-custom-content-scroller.css">
	<!-- <link rel="stylesheet" href="/public/css/common.css?<?=time()?>"> -->
	<link rel="stylesheet" href="/public/css/food/new_common.css?<?=time()?>">
	<link rel="stylesheet" href="/public/css/style.css">
	<link rel="stylesheet" href="/public/css/bms/style.css">

	<!-- js -->
	<script src="/public/js/lib/jquery-1.12.0.min.js"></script>
	<script src="/public/js/browser.js"></script>
	<script src="/public/js/lib/jquery-custom-content-scroller.min.js"></script>

	<!-- toast css, js -->
	<link rel="stylesheet" href="/public/css/lib/jquery.toast.css" />
	<script src="/public/js/lib/jquery.toast.js"></script>
	
	<!-- <script src="/public/js/jquery-migrate-1.2.1.min.js"></script> -->
	
	<script src="/public/js/lib/jquery.bpopup.min.js"></script>
	<script src="/public/js/common.js?<?=time()?>"></script>

	<!-- 개발팀 공통 css -->
	<link rel="stylesheet" href="/public/css/dev/common.css?<?=time()?>">
	<link rel="stylesheet" media="(min-width:2400px)" href="/public/css/large.css?<?=time()?>">
	<link rel="stylesheet" media="(max-width:1600px)" href="/public/css/small.css?<?=time()?>">

	<!-- 개발팀 공통 js -->
	<script src="/public/js/dev/function.js?<?=time()?>"></script>
	<script src="/public/js/dev/common.js?<?=time()?>"></script>
	<script src="/public/js/dev/reg_exp.js?<?=time()?>"></script>

	<!-- 공통 아이콘 js -->
	<script src="/public/js/bms/icon.js?<?=time()?>"></script>
	
	<!-- 주소 API JS -->
	<script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
	<script src="/public/js/lib/duam_addr.js?<?=time()?>"></script>

	<!-- 테이블 SORT js 플러그인 -->
	<link rel="stylesheet" href="/public/css/lib/theme.default.min.css?<?=time()?>">
	<script src="/public/js/lib/jquery.tablesorter.js?<?=time()?>"></script>
	<script src="/public/js/lib/jquery.tablesorter.widgets.js?<?=time()?>"></script>

	<!-- select문 select2 플러그인 -->
	<link rel="stylesheet" href="/public/css/lib/select2.min.css?<?=time()?>">
	<script src="/public/js/lib/select2.min.js?<?=time()?>"></script>

	<!-- 페이지네이션 JS 플러그인 -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/paginationjs/2.1.4/pagination.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paginationjs/2.1.4/pagination.css"/>
	<script src="/public/js/lib/pagination.min.js"></script>

	<!-- 테스트 -->
	<script src="/public/js/lib/sweetalert.js"></script>

	<!-- IE8이하 웹브라우저 처리 -->
	<script type="text/javascript">
		/** 2021-10-12 김원명 미지원 브라우저 이동 */
		let browser_stat = false;
		let agent 		 = navigator.userAgent.toLowerCase();
		
		/** 브라우저 체크 (chrome / edge) 만 허용 */
		if (agent.indexOf("whale") != -1) //네이버 웨일 제외 
		{ 
			browser_stat = false;
		}
		else
		{
			if (agent.indexOf("chrome") != -1 || agent.indexOf("edge") != -1)
			{
				browser_stat = true;
			}
		}
		if (!browser_stat)
		{
			location.href="/browser";
		}
	</script>
</head>
<body style="visivility:hidden; opacity: 0;">
