<?php // 기초재고 등록 팝업창 ?>
<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/biz_li_pop.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">

<script>
	$(function () {
        $(".datepicker").datepicker({
        	dateFormat: 'yy-mm-dd',
        	showOn: 'button',
			buttonImage: '/public/img/calender_img.png', // 달력 아이콘 이미지 경로
            buttonImageOnly: true, //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false, // 월선택 select box 표시 (기본은 false)
            changeYear: false, // 년선택 selectbox 표시 (기본은 false)
        });
    });
</script>
<div class="popup base_pop">
    <div class="title">기초 재고 관리
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <p class="txt">
            ※기초 재고량이 변경됩니다. 입고시점과 입고가격을 등록해 주세요.
        </p>
        <dl>
            <dt class="impt">창고 선택</dt>
            <dd>
                <div class="input_line w50">
                    <select id="" name="">
                        <option value="">창고1</option>
                    </select>
                </div>
            </dd>
        </dl>
        <dl>
            <dt class="impt">입고일자</dt>
            <dd>
                <input type="text" class="datepicker w30" name="" autocomplete="off">
            </dd>
        </dl>
        <dl>
            <dt class="impt">입고단가</dt>
            <dd>
                <div class="input_line w40">
                    <input type="text" autocomplete="off">
                </div>
            </dd>
        </dl>
        <dl>
            <dt class="impt">조정수량</dt>
            <dd>
                <div class="input_line w30">
                    <input type="text" autocomplete="off">
                </div>
            </dd>
        </dl>
        <dl>
            <dt>조정사유</dt>
            <dd>
                <div class="input_line">
                    <input type="text" autocomplete="off">
                </div>
            </dd>
        </dl>
        <p class='imptp'><span>*</span> 은 필수 입력 항목입니다.</p>
    </div>
    <div class="btn_wrap">
        <button type="button" class="gray">목록</button>
        <button type="button" class="blue">등록</button>
    </div>
</div>
<script>
    $('.base_st').click (function(){
        $('.base_pop').bPopup({
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