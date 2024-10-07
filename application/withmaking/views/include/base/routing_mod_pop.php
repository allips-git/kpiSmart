<?php // 라우터 수정 관리 팝업 페이지 ?>
<style>
    .router_mod_pop tr th.impt::after{
        content: '*';
        color: #dc0000;
        margin-left: 0.5rem;
    }
}
</style>
<div class="popup router_mod_pop">
    <div class="title">공정 라우팅 수정
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <?php $attributes = array("id" => "frm_mod", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
        <?php echo form_open($site_url."/v", $attributes); ?>
        <input type="hidden" class="p" name="p" value="up">
        <input type="hidden" class="ikey" name="ikey" value="">
        <input type="hidden" class="pc_uc" name="pc_uc" value="">
        <div class="top">
            <h4>기준정보</h4>
            <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
            <dl class="w30">
                <dt class="impt">라우팅명</dt>
                <dd class="">
                    <div class="input_line">
                        <input type="text" class="pc_nm" name="pc_nm" autocomplete="off" value="" required>
                    </div>
                </dd>
            </dl>
            <dl class="w20">
                <dt class="impt">가용여부</dt>
                <dd>
                    <div class="input_line">
                        <select class="useyn" name="useyn">
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
                        <input type="text" class="memo" name="memo" autocomplete="off">
                    </div>
                </dd>
            </dl>
        </div>
        <div class="bottom">
            <h4>공정 리스트</h4>
            <div class="btns">
                <button type="button" class="blue btn_add">공정 추가</button>
            </div>
            <div class="n-scroll">
                <table>
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
                </table>
            </div>
            <div class="h-scroll">
                <table id="tb_mod_list">
                    <tbody class="list-container">
                        <?php // js ?>
                    </tbody>
                </table>
            </div>
            <div class="total">
                <ul>
                    <li class='T-right'>총 공정수 : <strong class="list_count">1</strong><span>개</span></li>
                </ul>
            </div>
        </div>
        <div class="btn_wrap">
            <button type="button" class="gray btn_close">확인</button>
            <button type="button" class="blue btn_mod">수정하기</button>
        </div>
        <?php echo form_close(); ?>
    </div>
</div>

<script src="/public/js/food/routing_mod.js?<?=time();?>"></script>
<script>
    $('.mod_router').click (function() {
        mod_reset();
        get_mod_detail({'ikey':$(".ikey").val()});
        $('.router_mod_pop').bPopup({
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