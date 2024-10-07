<?php // 지급수정 팝업 페이지 ?>

<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">
<div class="popup pay_pop buy_pay_mod">
    <div class="title">지급수정
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <p class="comment">입고완료 처리 시 해당 발주 수량이 상품 재고에 자동으로 입고됩니다.</p>
        <div class="input_zone">
            <div class="input_wrap">
                <h4>매출/수금 입력
                    <div class="btns F-right">
                        <button type="button" class="btn_reset"><i class="btn_re_icon" aria-hidden="true"></i></button>&nbsp;
                    </div>
                </h4>
                <dl>
                    <dt class="impt">거래구분</dt>
                    <dd>
                        <input type="radio" id="chk01" class="chk" name="chk" value="Y" checked="checked">
                        <label for="chk01">수금</label>
                        <input type="radio" id="chk02" class="chk" name="chk" value="N">
                        <label for="chk02">금액 차감</label>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">거래일자</dt>
                    <dd>
                        <input type="text" class="datepicker gray w25">
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">거래처명</dt>
                    <dd>
                        <div class="input_line w70">
                            <select name="" id=""></select>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">결제방식</dt>
                    <dd>
                        <div class="input_line w40">
                            <select class="" name="">
                                <option value="">현금</option>
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">금액</dt>
                    <dd>
                        <div class="input_line w40">
                            <input type="text" class="T-right" name="" autocomplete="off">
                        </div> &nbsp;&nbsp;원
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">부가세</dt>
                    <dd>
                        <input type="radio" id="chk03" class="chkbox" name="chkbox" value="Y" checked="checked">
                        <label for="chk03">포함</label>
                        <input type="radio" id="chk04" class="chkbox" name="chkbox" value="N">
                        <label for="chk04">별도</label>
                    </dd>
                </dl>
                <dl class="">
                    <dt>비고</dt>
                    <dd>
                        <div class="input_line">
                            <textarea class="" name="" cols="30" rows="10"></textarea>
                        </div>
                    </dd>
                </dl>
                <h4 style="margin-top:30px">현재 미수잔액</h4>
                <dl>
                    <dt>미수잔액</dt>
                    <dd>
                        <div class="input_line w40">
                            <input type="text" class="T-right" name="" autocomplete="off">
                        </div> &nbsp;&nbsp;원
                    </dd>
                </dl>
            </div>
            <p class='imptp'><span>*</span> 은 필수 입력 항목입니다.</p>
        </div>
        <p class="comment">입고완료 처리하시겠습니까?</p>
        
    </div>
    <div class="btn_wrap">
        <button type="button" class="btn_del">취소</button>
        <button type="button" class="blue">수정</button>
    </div>
</div>
<script>
    $('.mod_buy_pay').click (function(){
        $('.buy_pay_mod').bPopup({
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
    $(".input_line textarea").focus(function(){
        $(this).parent().addClass("active");
    });
    $(".input_line textarea").blur(function(){
        $(this).parent().removeClass("active");
    });
</script>