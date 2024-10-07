<?php // 매출 제품 관리 페이지 ?>
<input type="hidden" id="site_url" value="<?=$site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/loading.css">
<link rel="stylesheet" href="/public/css/food/item_list.css?<?=time()?>">
<style>
    .padding_right {
        padding-right: 5px !important;
    }
</style>
<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write;    // 등록 권한
    $m = Authori::get_list()['data']->modify;   // 수정 권한
    $d = Authori::get_list()['data']->delete;   // 삭제 권한
?>
<div class="item_list content">
    <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
        <div class="search_zone section01 section">
            <dl>
                <dt>검색</dt>
                <dd>
                    <div class="input_line w10">
                        <select id="keyword" name="keyword">
                            <option value="item_nm">제품명</option>
                            <option value="item_cd">제품코드</option>
                            <option value="memo">비고</option>
                        </select>
                    </div>
                    <div class="input_line w20">
                        <input type="text" id="content" name="content" Auto placeholder="검색어를 입력하세요.">
                    </div>
                    <div class="input_line w10">
                        <select id="item_lv" name="item_lv">
                            <?php // js ?>
                        </select>
                    </div>
                    <div class="input_line w10">
                        <select id="wh_uc" name="wh_uc">
                            <option value="">창고_전체</option>
                            <?php if(count($wh_uc) > 0) { ?>
                                <?php foreach($wh_uc as $row) :?>
                                        <option value="<?= $row->wh_uc ?>"><?= $row->wh_nm ?></option>
                                <?php endforeach ?>
                            <?php } ?>
                        </select>
                    </div>
                    <div class="input_line w10">
                        <select id="useyn" name="useyn">
                            <option value="">가용여부_전체</option>
                            <option value="Y" selected>사용가능</option>
                            <option value="N">사용불가</option>
                        </select>
                    </div>
                </dd>
            </dl>
        </div>
    </form>

    <div class="bottom">
        <?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
        <?php echo form_open($site_url."/v", $attributes); ?>
        <input type="hidden" id="p" name="p" value="in">
        <input type="hidden" id="ikey" name="ikey" value="">
        <input type="hidden" id="page" name="page" value="">
        <div class="input_zone section">
            <div class="input_wrap">
                <h4>품목 입력
                    <div class="btns F-right">
                        <button type="button" class="btn_reset"><i class="btn_re_icon" aria-hidden="true"></i></button>&nbsp;
                    </div>
                </h4>
                <dl>
                    <dt class="impt">가용여부</dt>
                    <dd>
                        <input type="radio" id="chk01" class="useyn" name="useyn" value="Y" checked="checked">
                        <label for="chk01">사용가능</label>
                        <input type="radio" id="chk02" class="useyn" name="useyn" value="N">
                        <label for="chk02">사용불가</label>
                    </dd>
                </dl>
                <input type ="hidden" name ="proc_gb" value ="1">
                <input type ="hidden" name ="item_gb" value ="002">
               
                 <dl class="half">
                <dt class="impt">제품유형</dt>
                    <dd>
                        <div class="input_line">
                            <select class="item_gb" name="item_gb">
                                <option value="001">제품</option>
                                <!-- <option value="002">상품(완제품)</option> -->
                                <!-- <option value="003">반제품</option> -->
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">제품분류</dt>
                    <dd>
                        <div class="input_line w60">
                            <select class="item_lv" name="item_lv">
                                <?php // js ?>
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">제품명</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="item_nm input" name="item_nm" Auto>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">규격(단위)</dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="T-right size input" name="size" placeholder="예: 250g*1" Auto>
                        </div>
                        <div class="input_line w30" style="margin-left:10px">
                            <select class="unit" name="unit">
                                <option value="005">EA</option>
                                <option value="011">BOX</option>
                                <option value="012">개</option>
                                <option value="013">박스</option>
                                <option value="014">통</option>
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">최소주문수량</dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="T-right min_size num_type" name="min_size" value="1" numberOnly Auto>
                        </div> &nbsp;개
                    </dd>
                </dl>
                <dl class="dl_amt" style="display:none;">
                    <dt class="impt">매입단가</dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="T-right unit_amt input" value = "10000" name="unit_amt" numberOnly Auto title="제품유형이 상품(완제품)일 경우 매입단가 입력 가능합니다.">
                        </div>&nbsp;원
                    </dd>
                </dl>
                <dl style = "display:none;">
                    <dt class="impt"style="" >판매단가</dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="T-right sale_amt input"  value = "10000" name="sale_amt" numberOnly Auto required>
                        </div>&nbsp;원
                    </dd>
                </dl>
                <!-- <dl>
                    <dt><?=$amt_nm->amt2 ?></dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="T-right unit_amt_1 input" name="unit_amt_1" numberOnly Auto>
                        </div> &nbsp;원
                    </dd>
                </dl>
                <dl>
                    <dt><?=$amt_nm->amt3 ?></dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="T-right unit_amt_2 input" name="unit_amt_2" numberOnly Auto>
                        </div>&nbsp;원
                    </dd>
                </dl>
                <dl>
                    <dt><?=$amt_nm->amt4 ?></dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="T-right unit_amt_3 input" name="unit_amt_3" numberOnly Auto>
                        </div> &nbsp;원
                    </dd>
                </dl>
                <dl>
                    <dt><?=$amt_nm->amt5 ?></dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="T-right unit_amt_4 input" name="unit_amt_4" numberOnly Auto>
                        </div> &nbsp;원
                    </dd>
                </dl> -->

                <dl>
                    <dt>제조사</dt>
                        <dd>
                            <div class = "input_line">
                                <input type="text" class = "mfr input" name = "mfr" Auto>
                                <!-- <input type="text" class="item_nm input" name="item_nm" Auto> -->
                            </div>
                        </dd>
                    </dt>
                </dl>

                <!-- <dl>
                    <dt>이륙 증량</dt>
                        <dd>
                            <div class = "input_line">
                                <input type="text"  class = "taking_weight input" name = "taking_weight" Auto>
                                
                            </div>
                        </dd>
                    </dt>
                </dl>

                <dl>
                    <dt>자체 증량</dt>
                        <dd>
                            <div class = "input_line">
                                <input type="text" name = "self_weight" class = "self_weight input" Auto>
                            </div>
                        </dd>
                    </dt>
                </dl>

                <dl>
                    <dt>최대 비행 시간 </dt>
                        <dd>
                            <div class = "input_line">
                                <input type="text" name = "maximum_filght" class = "maximum_filght input" Auto>
                            </div>
                        </dd>
                    </dt>
                </dl>

                <dl>
                    <dt>최대 속도 </dt>
                        <dd>
                            <div class = "input_line">
                                <input type="text" name = "maximum_speed" class = "maximum_speed input" Auto>
                            </div>
                        </dd>
                    </dt>
                </dl>

                <dl>
                    <dt>배터리 </dt>
                        <dd>
                            <div class = "input_line">
                                <input type="text" name = "Battery" class = "Battery input" Auto>
                            </div>
                        </dd>
                    </dt>
                </dl> -->

                
                <dl class="">
                    <dt class="">기본창고</dt>
                    <dd>
                        <div class="input_line w50">
                            <select class="wh_uc" name="wh_uc">
                                <?php if(count($wh_uc) > 0) { ?>
                                    <?php foreach($wh_uc as $row) :?>
                                        <option value="<?= $row->wh_uc ?>"><?= $row->wh_nm ?></option>
                                    <?php endforeach ?>
                                <?php } else { ?>
                                    <option value="" disabled>창고 등록 후 사용가능</option>
                                <?php } ?>
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl class="">
                    <dt class="">안전재고</dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="T-right safe_qty input" name="safe_qty" numberOnly Auto>
                        </div>
                    </dd>
                </dl>
                <dl class="bgo">
                    <dt>비고</dt>
                    <dd>
                        <div class="input_line">
                            <textarea class="memo" name="memo" cols="30" rows="10"></textarea>
                        </div>
                    </dd>
                </dl>
                <p class='imptp'><span>*</span> 은 필수 입력 항목입니다.</p>
            </div>
            <div class="btn_wrap div_reg">
                <?php if($w == "Y") { ?>
                    <button type="button" class="btn_reg">등록</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">등록</button>
                <?php } ?>
            </div>
            <div class="btn_wrap div_mod" style="display: none;">
                <?php if($d == "Y") { ?>
                    <button type="button" class="btn_del gray">삭제</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable gray" onclick="alert('권한이 없습니다.');">삭제</button>
                <?php } ?>
                <?php if($m == "Y") { ?>
                    <button type="button" class="btn_mod">수정</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">수정</button>
                <?php } ?>
            </div>
        </div>
        <?php echo form_close(); ?>

        <?php // 리스트 ?>
        <div class="list_zone section">
            <h2>품목 리스트</h2>
            <div class="btns">
                <button type="button" class="btn_keyword blue">제품분류 등록</button>
                <button type="button" class="btn_amt blue">단가명칭 관리</button>
            </div>
            <div class="list_wrap">
                <table id="myTable" class="hovering ac">
                    <thead>
                        <tr>
                            <th class="fixedHeader w5">순번</th>
                            <th class="fixedHeader sorter-false w7">제품코드</th>
                            <th class="fixedHeader sorter-false w8">제품유형</th>
                            <th class="fixedHeader">제품명</th>
                            <th class="fixedHeader sorter-false w8">현재고</th>
                            <th class="fixedHeader sorter-false w11">등록자명(ID)</th>
                            <th class="fixedHeader sorter-false w11">등록일시</th>
                            <th class="fixedHeader sorter-false w11">수정자명(ID)</th>
                            <th class="fixedHeader sorter-false w11">수정일시</th>
                            <th class="fixedHeader sorter-false w6">가용여부</th>
                        </tr>
                    </thead>
                    <tbody id="data-container">
                        <?php // js ?>
                    </tbody>
                </table>
            </div>
            <?php // pagination ?>
            <div id="pagination" class="pagination"></div>
            <div class="view_count">
                <select id="page_size">
                    <option value="15">페이지 보기 15</option>
                    <option value="30">페이지 보기 30</option>
                    <option value="50">페이지 보기 50</option>
                    <option value="100" selected>페이지 보기 100</option>
                </select>
            </div>
        </div>
    </div>
    <div class="total">
        <ul>
            <li class='T-right'>총 검색 : <strong id="page_count"></strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/food/item_list.js?<?=time();?>"></script>
<script>
    // sort plugin
    $(function() {
        $("#myTable").tablesorter({
            theme : 'blue',
            headers: {
                // disable sorting of the first & second column - before we would have to had made two entries
                // note that "first-name" is a class on the span INSIDE the first column th cell
                '.sorter-false' : {
                    // disable it by setting the property sorter to false
                    sorter: false
                }
            }
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
    $(".input_line textarea").focus(function(){
        $(this).parent().addClass("active");
    });
    $(".input_line textarea").blur(function(){
        $(this).parent().removeClass("active");
    });
</script>