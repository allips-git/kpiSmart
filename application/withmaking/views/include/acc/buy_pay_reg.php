<?php // 지급등록 팝업 페이지 ?>
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">
<div class="popup pay_pop buy_pay_reg">
    <?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
    <?php echo form_open($site_url."/v", $attributes); ?>
    <input type="hidden" id="p" name="p" value="in">
    <input type="hidden" class="cust_cd" name="cust_cd" value="in">
    <div class="title">지급 등록
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <p class="comment">지급 등록 및 금액 차감 후에는 <span class="sp_title">수정/삭제</span>가 불가하니 신중한 사용 바랍니다.</p>
        <div class="input_zone">
            <div class="input_wrap">
                <h4>매입/지급 입력
                    <div class="btns F-right">
                        <button type="button" class="btn_reset"><i class="btn_re_icon" aria-hidden="true"></i></button>&nbsp;
                    </div>
                </h4>
                <dl>
                    <dt class="impt">거래구분</dt>
                    <dd>
                        <input type="radio" id="chk01" class="chk" name="detail" value="002" checked="checked">
                        <label for="chk01">지급</label>
                        <input type="radio" id="chk02" class="chk" name="detail" value="003">
                        <label for="chk02">금액 차감</label>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">거래일자</dt>
                    <dd>
                        <input type="text" class="acc_dt datepicker gray w25" name="acc_dt" value="" onclick="javascript:call_date(this);" autocomplete="off">
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">거래처명</dt>
                    <dd>
                        <div class="input_line w70">
                            <input type="text" class="cust_nm" name="cust_nm" value="" autocomplete="off" disabled>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">결제방식</dt>
                    <dd>
                        <div class="input_line w40">
                            <select class="acc_type" name="acc_type">
                                <?php if(count($acc_type) > 0) { ?>
                                    <?php foreach($acc_type as $row) :?>
                                        <option value="<?= $row->code_sub ?>"><?= $row->code_nm ?></option>
                                    <?php endforeach ?>
                                <?php } ?>
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl class="div_bank" style="display:none;">
                    <dt class="">은행 계좌</dt>
                    <dd>
                        <div class="input_line w40">
                            <select class="bank" name="bl_cd">
                                <option value="">은행계좌_선택</option>
                                <?php if(count($bank) > 0) { ?>
                                    <?php foreach($bank as $row) :?>
                                        <option value="<?= $row->code_sub ?>"><?= $row->code_nm ?></option>
                                    <?php endforeach ?>
                                <?php } ?>
                            </select>
                        </div>
                        <div class="input_line w50" style="margin-left:10px">
                            <input type="text" class="bl_num T-left" name="bl_num" autocomplete="off" value="">
                        </div>
                    </dd>
                </dl>
                <dl class="div_bank" style="display:none;">
                    <dt class="">입금자</dt>
                    <dd>
                        <div class="input_line w40">
                            <input type="text" class="acc_nm T-left" name="acc_nm" autocomplete="off" value="">
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">금액</dt>
                    <dd>
                        <div class="input_line w40">
                            <input type="text" class="amt T-right" name="amt" autocomplete="off" numberOnly>
                        </div> &nbsp;&nbsp;원
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">부가세</dt>
                    <dd>
                        <input type="radio" id="chk03" class="chkbox" name="vat" value="N" checked="checked">
                        <label for="chk03">과세</label>
                        <input type="radio" id="chk04" class="chkbox" name="vat" value="Y">
                        <label for="chk04">면세</label>
                        <input type="radio" id="chk05" class="chkbox" name="vat" value="S">
                        <label for="chk05">영세</label>
                    </dd>
                </dl>
                <dl class="">
                    <dt>비고</dt>
                    <dd>
                        <div class="input_line">
                            <textarea class="memo" name="memo" cols="30" rows="10"></textarea>
                        </div>
                    </dd>
                </dl>
                <!-- 개발 기간 축소로 기능 비활성화. 김민주 2022/08/10
                <h4 style="margin-top:30px">현재 미수잔액</h4>
                <dl>
                    <dt>미수잔액</dt>
                    <dd>
                        <div class="input_line w40">
                            <input type="text" class="T-right" name="" autocomplete="off">
                        </div> &nbsp;&nbsp;원
                    </dd>
                </dl> -->
            </div>
            <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
        </div>
        <p class="comment hint">등록 처리하시겠습니까?</p>
        
    </div>
    <div class="btn_wrap">
        <button type="button" class="btn_del">취소</button>
        <button type="button" id="btn_reg" class="blue">등록</button>
    </div>
    <?php echo form_close(); ?>
</div>

<script src="/public/js/food/buy_pay_reg.js?<?=time();?>"></script>
<script>
    $('.add_buy_pay').click (function(){
        $('.buy_pay_reg').bPopup({
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