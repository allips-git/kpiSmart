<!-- 기초 재고 관리 페이지 -->
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/loading.css">
<link rel="stylesheet" href="/public/css/food/prod_put.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">
<script>
    $(function() {
       var date = new Date();
       $(".datepicker").datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          // inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
        });
        $(".put_dt").datepicker("setDate", new Date());     // 입고일자 오늘날짜 지정
        $("#start_dt").datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',
            buttonImageOnly: true,
            changeMonth: false,
            changeYear: false,
        }).datepicker("setDate", get_date("시작일"));        // start date setting
        $("#end_dt").datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',
            buttonImageOnly: true,
            changeMonth: false,
            changeYear: false,
        }).datepicker("setDate", get_date("말일"));          // end date setting
    });
</script>
<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write;    // 등록 권한
    $m = Authori::get_list()['data']->modify;   // 수정 권한
    $d = Authori::get_list()['data']->delete;   // 삭제 권한
?>
<div class="stock content prod_put base_stock">
    <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
        <div class="search_zone section01 section">
            <dl>
                <dt>검색</dt>
                <dd>
                    <div class="input_line w10">
                        <select id="keyword" name="keyword">
                            <option value="i.item_nm">품목명</option>
                            <option value="s.item_cd">품목코드</option>
                            <option value="s.memo">비고</option>
                        </select>
                    </div>
                    <div class="input_line w20">
                        <input type="text" id="content" name="content" Auto placeholder="검색어를 입력하세요.">
                    </div>
                    <div class="input_line w80p">
                        <select id="" name="">
                            <option value="">입고일</option>
                        </select>
                    </div>
                    <div class="date_line w120p">
                        <input type="text" id="start_dt" class="datepick readonly w80" name="start_dt" onclick="javascript:call_date(this);">
                    </div>
                    &nbsp;~&nbsp;
                    <div class="date_line w120p">
                        <input type="text" id="end_dt" class="datepick readonly w80" name="end_dt" onclick="javascript:call_date(this);">
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <div class="input_line w11">
                        <select id="wh_uc" name="wh_uc">
                            <option value="">창고_전체</option>
                            <?php if(count($wh_uc) > 0) { ?>
                                <?php foreach($wh_uc as $row) :?>
                                    <option value="<?= $row->wh_uc ?>"><?= $row->wh_nm ?></option>
                                <?php endforeach ?>
                            <?php } ?>
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
        <input type="hidden" id="page" value="">
        <input type="hidden" id="ikey" name="ikey" value="">
        <input type="hidden" id="st_sq" name="st_sq" value="">
        <input type="hidden" id="base_qty" value="">
        <input type="hidden" id="safe_qty" value="">
        <input type="hidden" id="total_qty" value="">
        <div class="input_zone section">
            <div class="input_wrap">
                <h4>재고 입력
                    <button type="button" id="btn_reset" class="F-right"><i class="btn_re_icon" aria-hidden="true"></i></button>
                </h4>
                <dl>
                    <dt class="impt">입고일자</dt>
                    <dd>
                        <div class="date_line w55">
                            <input type="text" class="put_dt datepicker readonly w80" name="put_dt" Auto 
                            onclick="javascript:call_date(this);" required>
                        </div>
                    </dd>
                </dl>
                <dl class="">
                    <dt class="impt">품목명</dt>
                    <dd>
                        <div class="input_line div_reg">
                            <select id="item_list" name="item_cd" onchange="change_item(this.id);">
                                <?php // js ?>
                            </select>
                        </div>
                        <div class="input_line div_mod" style="display:none;">
                            <input type="text" class="item_list gray readonly" value="" Auto>
                        </div>
                    </dd>
                </dl>
                <dl class="">
                    <dt class="">규격(단위)</dt>
                    <dd>
                        <div class="input_line w70">
                            <input type="text" id="unit" class="unit gray readonly" name="unit" value="" Auto>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">창고선택</dt>
                    <dd>
                        <div class="input_line div_reg w70">
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
                        <div class="input_line div_mod w70" style="display:none;">
                            <input type="text" class="wh_nm gray readonly" value="" Auto>
                        </div>
                    </dd>
                </dl>
                <!-- <dl class="">
                    <dt class="impt">유통기한</dt>
                    <dd style="justify-content:space-between">
                        <div class="date_line div_reg w55">
                            <input type="text" class="max_dt datepicker w80 readonly" name="max_dt" Auto 
                            onclick="javascript:call_date(this);" required>
                        </div>
                        <div class="input_line div_mod w60" style="display:none;">
                            <input type="text" class="max_dt gray readonly" value="" Auto>
                        </div>
                    </dd>
                </dl> -->
                <dl class="">
                    <dt class="impt">입고단가</dt>
                    <dd>
                        <div class="input_line div_reg w45">
                            <input type="hidden" class="max_dt gray readonly" value="2022-12-31" Auto>
                            <input type="text" class="amt T-right" name="amt" Auto numberOnly>
                        </div>
                        <div class="input_line div_mod w45" style="display:none;">
                            <input type="text" class="T-right amt gray readonly" value="" Auto>
                        </div>
                        <div class="input_line div_reg w35" style="margin-left:10px">
                            <select class="vat" name="vat">
                                <option value="N">과세</option>
                                <option value="Y" selected>면세</option>
                                <option value="S">영세</option>
                            </select>
                        </div>
                        <div class="input_line div_mod w35" style="margin-left:10px; display:none;">
                            <input type="text" id="vat" class="gray readonly" value="" Auto>
                        </div>
                    </dd>
                </dl>
                <dl class="">
                    <dt class="impt">입고 수량</dt>
                    <dd>
                        <div class="input_line w45">
                            <input type="text" class="qty T-right" name="qty" Auto numberOnly>
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
                <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
            </div>
            <div class="btn_wrap div_reg">
                <?php if($w == "Y") { ?>
                    <button type="button" id="btn_reg" class="btn_reg">등록</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">등록</button>
                <?php } ?>
            </div>
            <div class="btn_wrap div_mod" style="display: none;">
                <?php if($d == "Y") { ?>
                    <button type="button" id="btn_del" class="btn_del gray">삭제</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable gray" onclick="alert('권한이 없습니다.');">삭제</button>
                <?php } ?>
                <?php if($m == "Y") { ?>
                    <button type="button" id="btn_mod" class="btn_mod">수정</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">수정</button>
                <?php } ?>
            </div>
        </div>
        <?php echo form_close(); ?>

        <div class="list_zone section">
            <h2>기초 재고 리스트</h2>
            <div class="btns">
                <button type="button" id="btn_barcode" class="blue">바코드 출력</button>
            </div>
            <div class="list_wrap">
                <table id="myTable" class="tablesorter hovering ac">
                    <thead>
                        <tr>
                            <th class="fixedHeader sorter-false w5">
                                <input type="checkbox" id="chk_all" name="chk_all">
                                <label for="chk_all"></label>
                            </th>
                            <th class="fixedHeader w5">순번</th>
                            <th class="fixedHeader w8">입고일자</th>
                            <th class="fixedHeader sorter-false w12">창고위치</th>
                            <th class="fixedHeader sorter-false w9">품목코드</th>
                            <th class="fixedHeader sorter-false">품목명</th>
                            <th class="fixedHeader sorter-false w10">규격(단위)</th>
                            <th class="fixedHeader w8">입고단가</th>
                            <th class="fixedHeader sorter-false w7">입고수량</th>
                            <th class="fixedHeader sorter-false w7">바코드</th>
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
    <?php // 바코드 출력용 FORM ?>
    <form name="frm" id="frm" method="post">
        <input type="hidden" id="p_gb" name="p_gb">
        <input type="hidden" id="p_work" name="p_work" value="base">
        <input type="hidden" id="p_ikey" name="p_ikey">
    </form>
</div>

<script src="/public/js/food/common_print.js?<?=time();?>"></script>
<script src="/public/js/food/common_select2.js?<?=time();?>"></script>
<script src="/public/js/food/base_stock.js?<?=time();?>"></script>
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
<script>
/** 전체 checkbox on/off */
$('#chk_all').off().click(function() {
    if ($('input:checkbox[id="chk_all"]').is(':checked') == true)
    {
        $("input[type=checkbox]").prop("checked", true);
        $("input[type=checkbox]").parents('tr').addClass('active');
        $("input[type=checkbox]").parents('tr').next().addClass('active');
    }
    else
    {
        $("input[type=checkbox]").prop("checked", false); 
        $("input[type=checkbox]").parents('tr').removeClass('active');
        $("input[type=checkbox]").parents('tr').next().removeClass('active');
    }
});
$('input[type=checkbox]').click(function() {
    if ($(this).is(':checked') == true)
    {
        $(this).parents('tr').addClass('active');
    }
    else
    {
        $(this).prop("checked",false);
        $(this).parents('tr').removeClass('active');
    }
});
</script>