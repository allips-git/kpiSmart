<?php // 공정라우팅 등록 관리 팝업 페이지 ?>
<style>
    .router_reg_pop tr th.impt::after{
        content: '*';
        color: #dc0000;
        margin-left: 0.5rem;
    }
    .select2-container,
    .select2-container--default,
    .select2-container--open{
    z-index: 99999 !important;
    background-color: #fafafa !important;
}
</style>
<div class="popup router_reg_pop">
<!-- <div class=""> -->
    <div class="title">공정 라우팅 등록
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
        <?php echo form_open($site_url."/v", $attributes); ?>
        <input type="hidden" id="p" name="p" value="in">
        <div class="top">
            <h4>기준정보</h4>
            <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
            <dl class="w30">
                <dt class="impt">라우팅명</dt>
                <dd class="">
                    <div class="input_line">
                        <input type="text" id="pc_nm" name="pc_nm" autocomplete="off" value="" required>
                    </div>
                </dd>
            </dl>
            <dl class="w20">
                <dt class="impt">가용여부</dt>
                <dd>
                    <div class="input_line">
                        <select id="useyn" name="useyn">
                            <option value="Y">사용가능</option>
                            <option value="N">사용불가</option>
                        </select>
                    </div>
                </dd>
            </dl>
            <dl class="w70" style="margin-top:8px">
                <dt>비고</dt>
                <dd>
                    <div class="input_line">
                        <input type="text" id="memo" name="memo" autocomplete="off">
                    </div>
                </dd>
            </dl>
        </div>
        <div class="bottom">
            <h4>공정 리스트</h4>
            <div class="btns">
                <button type="button" id="btn_add" class="blue">공정 추가</button>
            </div>
            <div class="h-scroll">
                <table id="tb_list">
                    <thead>
                        <tr>
                            <th class="impt">공정명</th>
                            <th class="impt w7">작업 순서</th>
                            <th class="w12">공정 코드</th>
                            <th class="w12">공정 유형</th>
                            <th class="w12">실적 등록</th>
                            <th>비고</th>
                            <th class="w7">삭제</th>
                        </tr>
                    </thead>
                    <tbody id="list-container">
                        <?php // js ?>
                    </tbody>
                </table>
            </div>
            <div class="total">
                <ul>
                    <li class='T-right'>총 공정수 : <strong id="list_count">1</strong><span>개</span></li>
                </ul>
            </div>
        </div>
        <div class="btn_wrap">
            <button type="button" id="btn_close" class="gray">확인</button>
            <button type="button" id="btn_reg" class="blue">등록하기</button>
        </div>
        <?php echo form_close(); ?>
    </div>
</div>

<script src="/public/js/food/common_routing.js?<?=time();?>"></script>
<script src="/public/js/food/routing_reg.js?<?=time();?>"></script>
<script>
    $('.add_router').click (function() {
        form_reset();
        $('.router_reg_pop').bPopup({
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