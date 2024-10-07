<?php // 입고 반품 등록 팝업 페이지 ?>
<link rel="stylesheet" href="/public/css/food/prod_put.css?<?=time()?>">
<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write; // 쓰기 권한
    $m = Authori::get_list()['data']->modify; // 수정 권한
    $d = Authori::get_list()['data']->delete; // 삭제 권한
?>
<div class="popup re_pop">
    <div class="title">구매 반품 목록
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <?php $attributes = array("id" => "frm_re_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
        <?php echo form_open("/stock/return_pop/v", $attributes); ?>
        <input type="hidden" class="p" name="p" value="in">
        <input type="hidden" class="re_p" name="re_p" value="in">
        <input type="hidden" class="ikey" name="ikey" value="">
        <input type="hidden" class="key_parent" name="key_parent" value="">
            <div class="left">
                <div class="bottom">
                    <h4>반품 정보 입력
                        <button type="button" class="F-right btn_re_reset"><i class="btn_re_icon" aria-hidden="true"></i></button>
                    </h4>
                    <dl>
                        <dt class="impt">출고일</dt>
                        <dd>
                            <div class="date_line w120p">
                                <input type="text" class="re_put_dt datepicker readonly input" name="re_put_dt" onfocus="this.blur()" 
                                onclick="javascript:call_date(this);" Auto>
                            </div>
                        </dd>
                    </dl>
                    <dl>
                        <dt class="impt">반품유형</dt>
                        <dd>
                            <div class="input_line w70">
                                <select class="re_gb select" name="re_gb">
                                    <?php if(count($re_gb) > 0) { ?>
                                        <?php foreach($re_gb as $row) :?>
                                            <option value="<?= $row->re_uc ?>"><?= $row->re_nm ?></option>
                                        <?php endforeach ?>
                                        <?php } else { ?>
                                            <option value="" disabled>유형 등록 후 사용가능</option>
                                        <?php } ?>
                                    <!-- <?php // js ?> -->
                                </select>
                            </div>
                        </dd>
                    </dl>
                    <dl>
                        <dt class="impt">수량</dt>
                        <dd>
                            <div class="input_line w50">
                                <input type="number" class="re_qty input" name="qty" Auto numberOnly>
                            </div>개
                        </dd>
                    </dl>
                    <dl>
                        <dt class="impt">반품사유</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="re_memo input" name="re_memo" value="" Auto>
                            </div>
                        </dd>
                    </dl>
                    <dl class="bgo">
                        <dt>비고</dt>
                        <dd>
                            <div class="input_line">
                                <textarea id="memo" name="memo" cols="30" rows="10"></textarea>
                            </div>
                        </dd>
                    </dl>
                </div>
                
                <div class="btn_wrap div_re_reg">
                    <?php if($w == "Y") { ?>
                        <button type="button" class="blue btn_re_reg">반품 등록</button>
                    <?php } else{ ?>
                        <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">반품 등록</button>
                    <?php } ?>
                </div>
                <div class="btn_wrap div_re_mod" style="display: none;">
                    <?php if($d == "Y") { ?>
                        <button type="button" class="btn_re_del gray">삭제</button>
                    <?php } else{ ?>
                        <button type="button" id="d_enroll" class="disable gray" onclick="alert('권한이 없습니다.');">삭제</button>
                    <?php } ?>
                    <?php if($m == "Y") { ?>
                        <button type="button" class="btn_re_mod blue">수정</button>
                    <?php } else{ ?>
                        <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">수정</button>
                    <?php } ?>
                </div>
            </div>
        <?php echo form_close(); ?>

        <div class="right">
            <h4>반품 목록</h4>
            <div class="h-scroll custom-scroll">
                <table class="ac2">
                    <thead>
                        <tr>
                            <th class="w6">순번</th>
                            <th class="w12">반품 출고일</th>
                            <th class="w17">반품 유형</th>
                            <th class="w10">수량</th>
                            <th>반품사유</th>
                            <th class="w15">등록자명(ID)</th>
                        </tr>
                    </thead>
                    <tbody id="re-data-container" class="re-data-container">
                        <?php // js ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="total">
        <ul>
            <li class="T-right">총 검색 : <strong id="re_page_count" class="list_cnt"></strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/food/return_pop.js?<?=time();?>"></script>
<script>
	$(function() {
		$(".custom-scroll").mCustomScrollbar({});
	});
</script>
