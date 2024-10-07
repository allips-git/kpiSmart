<?php // 반품 유형 관리 팝업 페이지 ?>
<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">
<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write; // 쓰기 권한
    $m = Authori::get_list()['data']->modify; // 수정 권한
    $d = Authori::get_list()['data']->delete; // 삭제 권한
?>
<div class="popup return_gb_pop">
    <div class="title">반품 유형 등록
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
                <dt class="impt">반품 유형</dt>
                <dd class="input_zone">
                    <div class="nu_input_line input_line" style="margin-right:0">
                        <input type="text" id="re_nm" name="re_nm" autocomplete="off" placeholder="반품 유형 입력" required>
                    </div>
                </dd>
            </dl>
            <p class='imptp'><span>*</span> 은 필수 입력 항목입니다.</p>
            <div class="btn_wrap div_gb_reg">
                <?php if($w == "Y") { ?>
                    <button type="button" class="blue btn_gb_reg">추가 등록</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">추가 등록</button>
                <?php } ?>
            </div>
            <div class="btn_wrap div_gb_mod" style="display: none;">
                <?php if($d == "Y") { ?>
                    <button type="button" class="btn_gb_del gray">삭제</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable gray" onclick="alert('권한이 없습니다.');">삭제</button>
                <?php } ?>
                <?php if($m == "Y") { ?>
                    <button type="button" class="btn_gb_mod blue">수정</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">수정</button>
                <?php } ?>
            </div>
            <?php echo form_close(); ?>
        </div>

        <div class="right">
            <h4>리스트</h4>
            <div class="h-scroll">
                <ul>
                    <li class="top_menu">공통</li>
                    <ul id="gb-container" class="ac3 hovering nlist ac">
                        <?php // js ?>
                    </ul>
                </div>
            </div>
        </div>
    </div>

<script src="/public/js/food/return_gb.js?<?=time();?>"></script>
<script>
    $('.re_add_btn').click (function() {
        frm_pop_reset();
        get_return_gb_list();
        $('.return_gb_pop').bPopup({
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
    $(".nu_input_line input").focus(function() {
        $(this).parent().addClass("active");
    });
    $(".nu_input_line input").blur(function() {
        $(this).parent().removeClass("active");
    });
    $(".nu_input_line select").focus(function() {
        $(this).parent().addClass("active");
    });
    $(".nu_input_line select").blur(function() {
        $(this).parent().removeClass("active");
    });
    
	$('.ac li').click(function(){
		$('.ac li').removeClass('active');
		$(this).addClass('active')
	});

</script>