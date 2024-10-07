<?php // 원자재 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/loading.css">
<link rel="stylesheet" href="/public/css/food/item_list.css?<?=time()?>">
<style>
    .padding_right {
        padding-right: 5px !important;
    }
    table td.gray{
        background-color:#f8f8fa;
        border-color:#d9d9d9;
        border-top:0
    }
</style>
<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write;    // 등록 권한
    $m = Authori::get_list()['data']->modify;   // 수정 권한
    $d = Authori::get_list()['data']->delete;   // 삭제 권한
?>
<div class="item_list content buy_item">
     <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
    <div class="search_zone section01 section">
        <dl>
            <dt>검색</dt>
            <dd>
                <div class="input_line w10">
                    <select id="keyword" name="keyword">
                        <option value="item_nm">품목명</option>
                        <option value="item_cd">품목코드</option>
                        <option value="memo">비고</option>
                    </select>
                </div>
                <div class="input_line w20">
                    <input type="text" id="content" name="content" autocomplete="off" placeholder="검색어를 입력하세요.">
                </div>
                <div class="input_line w10">
                    <select id="item_lv" name="item_lv">
                        <?php // js ?>
                    </select>
                </div>
                <div class="input_line w10">
                    <select id="wh_uc" name="wh_uc">
                        <option value="">기본창고_전체</option>
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
            <h4>원자재 입력
                <button type="button" class="F-right btn_reset"><i class="btn_re_icon" aria-hidden="true"></i></button>
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
                <dl class="half">
                    <dt class="impt">품목유형</dt>
                    <dd>
                        <div class="input_line">
                            <select class="item_gb" name="item_gb">
                                <option value="004">원자재</option>
                                <option value="005">부자재</option>
                                <option value="006">저장품(부속)</option>
                            </select>
                        </div>
                    </dd>
                    <dt class="impt">품목분류</dt>
                    <dd>
                        <div class="input_line">
                            <select class="item_lv" name="item_lv">
                                <?php // js ?>
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">품목명</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="item_nm" name="item_nm" autocomplete="off">
                        </div>
                    </dd>
                </dl>
                <dl class="half">
                    <dt class="">제조사</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="maker" name="maker" autocomplete="off">
                        </div>
                    </dd>
                    <dt class="">원산지</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="origin" name="origin" autocomplete="off">
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">규격(단위)</dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="T-right size" name="size" placeholder="예: 100" autocomplete="off" numberOnly>
                        </div>
                        <div class="input_line w30" style="margin-left:10px">
                            <select class="unit" name="unit">
                                <option value="018">g</option>
                                <option value="019">kg</option>
                                <option value="005">EA</option>
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">매입단가</dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="T-right unit_amt" name="unit_amt" autocomplete="off" numberOnly>
                        </div>&nbsp;원
                    </dd>
                </dl>
                <dl>
                    <dt class="">대표매입처</dt>
                    <dd>
                        <div class="input_line w80">
                            <!-- <input type="text" class="gray" name="" autocomplete="off"> -->
                            <select id="buy_cd" class="buy_cd" name="buy_cd">
                                <option value="">매입거래처_선택</option>
                                <?php if(count($buy_cd) > 0) { ?>
                                    <?php foreach($buy_cd as $row) :?>
                                        <option value="<?= $row->cust_cd ?>"><?= $row->cust_nm ?></option>
                                    <?php endforeach ?>
                                <?php } else { ?>
                                    <option value="" disabled>매입거래처 등록 후 사용가능</option>
                                <?php } ?>    
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl class="">
                    <dt class="impt">기본창고</dt>
                    <dd>
                        <div class="input_line w50">
                            <select class="wh_uc" name="wh_uc">
                                    <?php if(count($wh_uc) > 0) { ?>
                                        <?php foreach($wh_uc as $row) :?>
                                                <option value="<?= $row->wh_uc ?>"><?= $row->wh_nm ?></option>
                                        <?php endforeach ?>
                                    <?php } ?>
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl class="">
                    <dt class="">안전재고</dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="T-right safe_qty" name="safe_qty" autocomplete="off" numberOnly>
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
        <div class="list_zone section">
            <h2>원자재 리스트</h2>
            <div class="list_wrap">
                <table id="myTable" class="hovering at ac">
                    <thead>
                        <tr>
                            <th class="fixedHeader sorter-false w5">순번</th>
                            <th class="fixedHeader sorter-false w8">품목코드</th>
                            <th class="fixedHeader sorter-false w8">품목유형</th>
                            <th class="fixedHeader">품목명</th>
                            <th class="fixedHeader w6">현재고</th>
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
            <li class='T-right'>총 검색 : <strong id="list_cnt">0</strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/food/buy_item.js?<?=time();?>"></script>
<script>
    // sort plugin
    $(function() {
        $("#buy_cd").select2(); 
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