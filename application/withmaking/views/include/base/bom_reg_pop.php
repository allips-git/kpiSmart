<?php // 제조 BOM 등록 팝업 페이지 ?>
<style>
    .bom_reg_pop tr th.impt::after {
        content: '*';
        color: #dc0000;
        margin-left: 0.5rem;
    }
    .select2-container,
    .select2-container--default,
    .select2-container--open {
    z-index: 99999 !important;
    color: #111 !important;
    background-color: #fafafa !important;
}
</style>
<div class="popup bom_pop bom_reg_pop">
    <div class="title">BOM 등록
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
        <?php echo form_open($site_url."/v", $attributes); ?>
        <input type="hidden" id="p" class="p" name="p" value="in">
        <input type="hidden" id="item_cd" class="item_cd" name="item_cd" value="">
        <input type="hidden" id="pc_uc" class="pc_uc" name="pc_uc" value="">
        <div class="top">
            <h4>기준정보</h4>
            <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
            <dl class="w30">
                <dt class="impt">제품명</dt>
                <dd class="">
                    <div class="input_line">
                        <select id="item_list" onchange="change_sale_item(this.id);">
                            <?php // js ?>
                        </select>
                    </div>
                </dd>
            </dl>
            <dl class="w30">
                <dt class="impt">라우팅명</dt>
                <dd class="">
                    <div class="input_line">
                        <select id="routing_list" onchange="change_routing(this.id);">
                            <?php // js ?>
                        </select>
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
            <dl class="w80" style="margin-top:8px">
                <dt>비고</dt>
                <dd>
                    <div class="input_line">
                        <input type="text" id="memo" name="memo" autocomplete="off">
                    </div>
                </dd>
            </dl>
        </div>
        <div class="bottom">
            <h4>BOM 리스트</h4>
            <div class="btns">
                <button type="button" id="btn_add" class="blue">BOM 추가</button>
            </div>
            <div class="h-scroll">
                <table id="tb_list">
                    <thead>
                        <tr>
                            <th class="impt w15">공정명</th>
                            <th class="impt">품목명</th>
                            <th class="w8">품목 코드</th>
                            <th class="w10">품목 유형</th>
                            <th class="w10">규격(단위)</th>
                            <th class="w8">단가(원)</th>
                            <th class="impt w6">소요량</th>
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
                    <li id="hint" class="hint"><span>*</span> BOM 소요량 계산 기준 단위는 EA입니다.</li>
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

<script src="/public/js/food/common_select2.js?<?=time();?>"></script>
<script src="/public/js/food/common_bom.js?<?=time();?>"></script>
<script src="/public/js/food/bom_reg.js?<?=time();?>"></script>
<script>
    $('.bom_btn').click (function() {
        form_reset();
        $('.bom_reg_pop').bPopup({
            modalClose: true
          , opacity: 0.8
          , positionStyle: 'absolute' 
          , speed: 300
          , transition: 'fadeIn'
          , transitionClose: 'fadeOut'
          , zIndex : 9997
            //, modalColor:'transparent' 
        }); 
    });  
</script>