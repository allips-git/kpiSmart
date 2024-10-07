<?php // 온라인 주문 전표 마감 팝업 페이지 ?>
<div class="popup online_magam_pop">
    <div class="title">전표 마감
        <span class="b-close">&times;</span>
    </div>
    <form id="frm_pay" name="frm_pay" method="post" accept-charset="utf-8" onsubmit="return false;">
        <input type="hidden" class="pay_ord_no" name="ord_no" value="">
        <div class="inner" style="margin-bottom: -10px;">
            <p class="txt" style="text-align: center;">
                ※전표의 마감기능을 이용하여 거래내역의 <span style="color:red; font-weight:bold;">수정 및 삭제</span>를 제한.<br/>
                귀사의 소중한 자료를 보호할 수 있습니다.
            </p>
            <p class="txt" style="color: blue; font-weight: bold; font-size: 15px; text-align: center; height: 60px;">
                선택하신 온라인 주문 전표를 마감처리 하시겠습니까?
            </p>
        </div>
        <div class="btn_wrap">
            <button type="button" class="gray btn_list">목록</button>
            <button type="button" class="red btn_finish">전표마감</button>
        </div>
    </form>
</div>

<script src="/public/js/food/ord_close.js?<?=time();?>"></script>
<script>
    $('.online_magam').click (function(){
        $('.online_magam_pop').bPopup({
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