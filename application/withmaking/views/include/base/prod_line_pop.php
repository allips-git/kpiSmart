<?php // 생산라인 관리 팝업 페이지 ?>
<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/biz_li_pop.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">

<div class="popup prod_line_pop">
    <div class="title">생산라인 관리
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <div class="left">
            <h4>입력</h4>
            <div class="input_zone">
                <div class="input_line w30">
                    <select id="" name="">
                        <option value="">1번작업장</option>
                        <option value="">2번작업장</option>
                    </select>
                </div>
                <div class="input_line w65"style="margin-right:0">
                    <input type="text" id="" name="" autocomplete="off" placeholder="생산라인 입력">
                </div>
            </div>
            <div class="btn_wrap">
                <button type="button" class="blue">추가 등록</button>
                <div style="display:none">
                    <button type="button" class="gray">삭제</button>
                    <button type="button" class="blue">수정</button>
                </div>
            </div>
        </div>

        <div class="right">
            <h4>리스트</h4>
            <div class="h-scroll">
                <ul>
                    <li class="top_menu">1번작업장</li>
                    <ul class="ac hovering">
                        <li class="sub_menu">생산라인1</li>
                        <li class="sub_menu">생산라인2</li>
                    </ul>
                    <li class="top_menu">2번작업장</li>
                    <ul class="ac hovering">
                        <li class="sub_menu">생산라인1</li>
                        <li class="sub_menu">생산라인2</li>
                        <li class="sub_menu">생산라인3</li>
                        <li class="sub_menu">생산라인4</li>
                    </ul>
                    <li class="top_menu">3번작업장</li>
                    <ul class="ac hovering">
                        <li class="sub_menu">생산라인1</li>
                    </ul>
                </ul>
            </div>
        </div>
    </div>
</div>
<script>
    $('.btn_line').click (function(){
        $('.prod_line_pop').bPopup({
          modalClose: true
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
<script>
    /*input 클릭 이벤트 추가 22-02-24 성시은*/ 
	$(".input_line input").focus(function(){
		$(this).parent().addClass("active");
	});
	$(".input_line input").blur(function(){
		$(this).parent().removeClass("active");
	});
	$(".input_line select").focus(function(){
		$(this).parent().addClass("active");
	});
	$(".input_line select").blur(function(){
		$(this).parent().removeClass("active");
	});
</script>
<script>
    // tr td row css
    $('.ac li').click(function(){
        $('.ac li').removeClass('active');
        $(this).addClass('active');
    });

    $('.ac td').click(function(){
        $('.ac td').removeClass('active');
        $(this).addClass('active');
    });
</script>