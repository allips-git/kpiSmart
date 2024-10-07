<?php // 제품분류 관리 팝업 페이지 ?>
<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/biz_li_pop.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">

<div class="popup category_pop">
    <div class="title">제품분류 관리
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <div class="left">
            <?php $attributes = array("class" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
            <?php echo form_open($site_url."/v", $attributes); ?>
                <input type="hidden" class="p" name="p" value="in">
                <input type="hidden" class="ikey" name="ikey" value="">
                <h4>입력
                    <button type="button" class="F-right btn_gb_reset"><i class="btn_re_icon" aria-hidden="true"></i></button>
                </h4>
                <dl>
                    <dt class="impt">가용여부</dt>
                    <dd class="radio_box">
                        <input type="radio" id="gb_chk01" class="gb_useyn" name="gb_useyn" value="Y" checked="checked">
                        <label for="gb_chk01">사용가능</label>
                        <input type="radio" id="gb_chk02" class="gb_useyn" name="gb_useyn" value="N">
                        <label for="gb_chk02">사용불가</label>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">제품분류</dt>
                    <dd style="display: flex; justify-content:space-between">
                        <div class="input_line w30">
                            <select id="pm_cd" name="pm_cd">
                                <option value="AD">일반</option>
                            </select>
                        </div>
                        <div class="input_line w65">
                            <input type="text" id="key_name" name="key_name" autocomplete="off" placeholder="제품 분류 입력" required>
                        </div>
                    </dd>
                </dl>
                <p class='imptp'><span>*</span> 은 필수 입력 항목입니다.</p>
                <div class="btn_wrap div_gb_reg">
                    <button type="button" class="blue btn_gb_reg">추가 등록</button>
                </div>
                <div class="btn_wrap div_gb_mod" style="display:none">
                    <button type="button" class="gray btn_gb_del">삭제</button>
                    <button type="button" class="blue btn_gb_mod">수정</button>
                </div>
            <?php echo form_close(); ?>
        </div>

        <div class="right">
            <h4>리스트</h4>
            <div class="h-scroll">
                <ul>
                    <li class="top_menu">일반</li>
                    <ul id="gb-container" class="ac hovering nlist">
                        <?php // js ?>
                    </ul>
                </ul>
            </div>
        </div>
    </div>
</div>

<script src="/public/js/food/item_gb.js?<?=time();?>"></script>
<script>
    $('.btn_keyword').click (function() {
        get_item_gb_list();
        $('.category_pop').bPopup({
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