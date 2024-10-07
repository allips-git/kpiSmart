<?php // 입고 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/loading.css">
<link rel="stylesheet" href="/public/css/food/prod_put.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">
<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write; // 쓰기 권한
    $m = Authori::get_list()['data']->modify; // 수정 권한
    $d = Authori::get_list()['data']->delete; // 삭제 권한
?>

<style>
    .padding_right {
        padding-right: 15px !important;
    }
    .ip_info {
        color: #5D5D5D !important;
    }
    @media (max-width:1600px){
        .header{display:none}
        .aside{display:none}
        .container{
            padding-top:0;
            margin:0;
        }
        .content{padding:1rem !important;}
        .total{left:0 !important;}
        table th{font-size:0.781rem}
        .input_zone .input_wrap{padding: 1.25rem 0.75rem  !important}
        .buy_li_pop{margin-top:0 !important;
    }
</style>
<script>
	$(function () {
        // 입고일자
        $(".datepicker").datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
        }).datepicker().val("");
        $(".put_dt").datepicker("setDate", new Date());

        var date = new Date();
        $(".start_dt")
        .datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',
            buttonImageOnly: true,
            changeMonth: false,
            changeYear: false,
        }).datepicker("setDate", get_date("시작일"));
        $(".end_dt")
        .datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',
            buttonImageOnly: true,
            changeMonth: false,
            changeYear: false,
        }).datepicker("setDate", get_date("말일"));
    });
</script>
<div class="stock content prod_put">
        <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
        <div class="search_zone section01 section">
            <dl>
                <dt>검색</dt>
                <dd>
                    <div class="input_line w10">
                        <select id="keyword" class="keyword" name="keyword">
                            <option value="i.item_nm">품목명</option>
                            <option value="t.item_cd">품목코드</option>
                            <option value="s.ord_no">발주번호</option>
                            <option value="s.lot">발주지시번호</option>
                            <option value="s.memo">비고</option>
                        </select>
                    </div>
                    <div class="input_line w20">
                        <input type="text" id="content" name="content" autocomplete="off" placeholder="검색어를 입력하세요.">
                    </div>
                    <div class="input_line" style="width:80px;">
                        <select id="" name="">
                            <option value="">입고일</option>
                        </select>
                    </div>
                    <div class="date_line w120p">
                        <input type="text" id="start_dt" class="start_dt readonly datepick" name="start_dt" value="" onfocus="this.blur()" onclick="javascript:call_date(this);">
                    </div>
                    &nbsp;~&nbsp;
                    <div class="date_line w120p">
                        <input type="text" id="end_dt" class="end_dt readonly datepick" name="end_dt" value="" onfocus="this.blur()" onclick="javascript:call_date(this);">
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
                    <button type="button" id="btn_search">검색</button>
                </dd>
            </dl>
        </div>
    </form>
    <div class="bottom">
        <?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
        <?php echo form_open($site_url."/v", $attributes); ?>
        <input type="hidden" id="p" class="p" name="p" value="in">
        <input type="hidden" id="ikey" class="ikey" name="ikey" value="">
        <input type="hidden" id="st_sq" class="st_sq" name="st_sq" value="">
        <input type="hidden" id="item_cd" class="item_cd" name="item_cd" value="">
        <input type="hidden" id="ord_no" class="ord_no" name="ord_no" value="">
        <input type="hidden" id="barcode" class="barcode" name="barcode" value="">
        <input type="hidden" id="vat" name="vat" value="">
        <input type="hidden" id="page" name="page" value="">
        <div class="input_zone section">
            <div class="input_wrap">
                <h4>입고 입력
                    <button type="button" class="F-right btn_reset"><i class="btn_re_icon" aria-hidden="true"></i></button>
                </h4>
                <dl>
                    <dt class="impt">입고일자</dt>
                    <dd>
                        <div class="w100">
                            <div class="date_line w120p">
                                <input type="text" class="put_dt readonly datepicker" name="put_dt" onfocus="this.blur()" autocomplete="off" value="" onclick="javascript:call_date(this);">
                            </div>
                        </div>
                    </dd>
                </dl>
                <dl class="">
                    <dt class="impt">발주선택</dt>
                    <dd>
                        <div class="div_reg input_line w70">
                            <input type="text" class="lot readonly buy_li_btn" name="lot" value="" onfocus="this.blur()" >                   
                        </div>
                        <button type="button" class="div_reg buy_li_btn bl_btn">선택</button>
                        <div class="div_mod input_line w70" style="display:none;">
                            <input type="text" class="lot gray readonly" name="lot" value="" onfocus="this.blur()">
                        </div>
                    </dd>
                </dl>
                <dl class="">
                    <dt class="">품목명</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="item_nm gray readonly" name="">
                        </div>
                    </dd>
                </dl>
                <dl class="">
                    <dt class="">규격(단위)</dt>
                    <dd>
                        <div class="input_line w70">
                            <input type="text" class="gray readonly unit_nm" name="unit_nm">
                        </div>
                    </dd>
                </dl>
                <dl class="impt">
                    <dt class="">입고단가</dt>
                    <dd>
                        <div class="input_line w45">
                            <input type="text" class="unit_amt T-right gray readonly amt" name="amt" numberOnly>
                        </div>
                        &nbsp;
                        <div class="input_line w35" style="margin-left:10px">
                            <select id="vat" class="vat gray" name="vat">
                                <?php // js ?>
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">창고선택</dt>
                    <dd>
                        <div class="input_line w70 div_reg">
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
                        <div class="input_line div_mod w60" style="display:none;">
                            <input type="text" class="gray readonly wh_nm"  value="" autocomplete="off">
                        </div>
                    </dd>
                </dl>
                <!-- <dl class="">
                    <dt class="">유통기한</dt>
                    <dd>
                        <div class="date_line div_reg2 w120p">
                            <input type="text" class="datepicker readonly max_dt" name="max_dt" autocomplete="off" value="" onfocus="this.blur()" onclick="javascript:call_date(this);">
                        </div>
                        <div class="input_line div_mod w120p" style="display:none;">
                            <input type="text" class="gray readonly max_dt"  value="" autocomplete="off">
                        </div>
                    </dd>
                </dl> -->
                <dl class="">
                    <dt class="impt">입고 수량</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="qty" name="qty" autocomplete="off" numberOnly>
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
                <div class="div_reg_info" style="display: none;">
                    <dl class="">
                        <dt class="">등록자명(일시)</dt>
                        <dd>
                            <div class="input_line w50">
                                <input type="text" class="ip_info gray readonly" id="" name="" value="관리자(admin)" autocomplete="off">
                            </div>
                            <div class="input_line w50" style="margin-left:10px">
                                <input type="text" class="ip_info gray readonly" id="" name="" value="2022-05-30 16:01:00" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                    <dl class="">
                        <dt class="">수정자명(일시)</dt>
                        <dd>
                            <div class="input_line w50">
                                <input type="text" class="ip_info gray readonly" id="" name="" value="관리자(admin)" autocomplete="off">
                            </div>
                            <div class="input_line w50" style="margin-left:10px">
                                <input type="text" class="ip_info gray readonly" id="" name="" value="2022-05-30 16:01:00" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                </div>
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
            <?php echo form_close(); ?>
        </div>
        <div class="list_zone section">
            <h2>입고 리스트</h2>
            <div class="btns">
                <?php if($w == "Y") { ?>
                    <button type="button" class="blue re_add_btn no_tablet tablet">반품 유형 등록</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable tablet" onclick="alert('권한이 없습니다.');">반품 유형 등록</button>
                <?php } ?>
                <button type="button" id="btn_barcode" class="blue no_tablet tablet">바코드 출력</button>
            </div>
            <div class="list_wrap">
                <div class="h-scroll">
                    <table id="myTable" class="tablesorter ac hovering">
                        <thead>
                            <tr>
                                <th class="fixedHeader sorter-false w4 no_tablet tablet">
                                    <input type="checkbox" id="chk_all" name="chk_all">
                                    <label for="chk_all"></label>
                                </th>
                                <th class="fixedHeader w6">순번</th>
                                <th class="fixedHeader w7">입고일자</th>
                                <th class="fixedHeader sorter-false w10">창고위치</th>
                                <th class="fixedHeader sorter-false title_name">품목명</th>
                                <th class="fixedHeader sorter-false w10">규격(단위)</th>
                                <th class="fixedHeader w8">입고단가</th>
                                <th class="fixedHeader sorter-false w6">입고수량</th>
                                <th class="fixedHeader sorter-false w5 no_tablet tablet">반품수량</th>
                                <th class="fixedHeader sorter-false w6 no_tablet tablet">반품출고</th>
                                <th class="fixedHeader sorter-false w5 no_tablet tablet">바코드</th>
                            </tr>
                        </thead>
                        <tbody id="data-container">
                            <?php // js ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- pagination -->
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
            <li class='T-right'>총 검색 : <strong id="page_count">0</strong><span>건</span></li>
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
<script src="/public/js/food/prod_put.js?<?=time();?>"></script>
<script>
    function pop_close(arg)
    {
        arg = JSON.parse(decodeURIComponent(arg));
        $(".ord_no").val(arg.ord_no);
        $(".lot").val(arg.lot);
        $(".item_nm").val(arg.item_nm);
        $(".unit_amt").val(commas(arg.unit_amt));
        $("#vat").val(arg.vat);
        $(".vat").html('<option value="'+arg.vat+'">'+arg.vat_text+'</option>');
        $(".unit_nm").val(arg.size+" "+arg.unit_nm);
        $('.item_cd').val(arg.item_cd);
        $('.wh_uc').val(arg.wh_uc);
        $('.buy_li_pop').bPopup().close();
    }
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
<script>
/** 전체 checkbox on/off */
$(document).ready(function() {
    $("#chk_all").change(function() {
        if($("#chk_all").is(":checked"))
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
});
</script>