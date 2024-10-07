<?php // 불량 등록 팝업 페이지 ?>
<link rel="stylesheet" href="/public/css/food/prod_put.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/popup2.css?<?=time()?>">
<script>
    $(function() {
        // 주문일, 출고일 기본날짜 세팅
        $(".datepicker").datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
        }).datepicker("setDate", new Date());               // today setting
    });
</script>
<?php
    /** 권한 변수 */
    $w = Authori::get_list()['data']->write;    // 등록 권한
    $m = Authori::get_list()['data']->modify;   // 수정 권한
    $d = Authori::get_list()['data']->delete;   // 삭제 권한
?>
<div class="popup prod_qa_pop">
    <div class="title">불량 등록
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
        <?php echo form_open($site_url."/v", $attributes); ?>
        <input type="hidden" class="p" name="p" value="in">
        <input type="hidden" class="ikey" name="ikey" value="">
        <input type="hidden" class="key_parent" name="key_parent" value="">
        <div class="left">
            <div class="bottom">
                <h4>불량 정보 입력
                    <button type="button" class="F-right btn_reset"><i class="btn_re_icon" aria-hidden="true"></i></button>
                </h4>
                <dl>
                    <dt class="impt">등록일</dt>
                    <dd>
                        <div class="date_line w110p">
                            <input type="text" class="put_dt datepicker readonly w80 input" name="put_dt" value="" onclick="javascript:call_date(this);" auto>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">불량 유형</dt>
                    <dd>
                        <div class="input_line w70">
                            <select class="flaw select" name="re_gb">
                                <?php if(count($flaw) > 0) { ?>
                                    <?php foreach($flaw as $row) :?>
                                        <option value="<?= $row->fl_uc ?>"><?= $row->fl_nm ?></option>
                                    <?php endforeach ?>
                                <?php } else { ?>
                                    <option value="" disabled>유형 등록 후 사용가능</option>
                                <?php } ?>
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">수량</dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="qty input" name="qty" value="" auto>
                        </div>개
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">불량 사유</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="re_memo input" name="re_memo" value="" auto>
                        </div>
                    </dd>
                </dl>
                <dl class="bgo">
                    <dt>비고</dt>
                    <dd>
                        <div class="input_line">
                            <textarea class="memo textarea" name="memo"></textarea>
                        </div>
                    </dd>
                </dl>
            </div>
            <div class="btn_wrap div_reg">
                <?php if($w == "Y") { ?>
                    <button type="button" class="btn_reg blue">불량 등록</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">불량 등록</button>
                <?php } ?>
            </div>
            <div class="btn_wrap div_mod" style="display: none;">
                <?php if($d == "Y") { ?>
                    <button type="button" class="btn_del gray">삭제</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable gray" onclick="alert('권한이 없습니다.');">삭제</button>
                <?php } ?>
                <?php if($m == "Y") { ?>
                    <button type="button" class="btn_mod blue">수정</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">수정</button>
                <?php } ?>
            </div>
        </div>
        <?php echo form_close(); ?>
        <div class="right">
            <h4>불량 등록 리스트</h4>
            <div class="h-scroll">
                <table class="tablesorter hovering ac2">
                    <thead>
                        <tr>
                            <th class="w6">순번</th>
                            <th class="w10">등록일</th>
                            <th class="w17">불량 유형</th>
                            <th class="w10">수량</th>
                            <th>불량 사유</th>
                            <th class="w12">등록자명(ID)</th>
                        </tr>
                    </thead>
                    <tbody class="data-container">
                        <?php // js ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="total">
        <ul>
            <li class="T-right">총 검색 : <strong class="list_cnt">0</strong><span>건</span></li>
        </ul>
    </div>
</div>
<script src="/public/js/food/prod_qa_pop.js?<?=time();?>"></script>