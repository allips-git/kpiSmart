<?php // 제품 출고 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/loading.css">
<link rel="stylesheet" href="/public/css/food/prod_put.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">
<style>
    .padding_right {
        padding-right: 15px !important;
    }
    .ip_info {
        color: #5D5D5D !important;
    }
    .input_zone .second_h4{
        padding:0 0 0.625rem !important;
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
        .input_zone h4{
            padding:1.25rem 0.75rem 0.625rem !important;
        }
        .prod_out .input_zone .div_ord{padding: 0 0.75rem 0 !important}
    }
</style>
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
    /** 권한 변수 */
    $w = Authori::get_list()['data']->write;    // 등록 권한
    $m = Authori::get_list()['data']->modify;   // 수정 권한
    $d = Authori::get_list()['data']->delete;   // 삭제 권한
?>
<div class="stock content prod_put prod_out">
    <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
        <div class="search_zone section01 section">
            <dl>
                <dt>검색</dt>
                <dd>
                    <div class="input_line w10">
                        <select id="keyword" name="keyword">
                            <option value="i.item_nm">제품명</option>
                            <option value="s.item_cd">제품코드</option>
                            <option value="s.memo">비고</option>
                        </select>
                    </div>
                    <div class="input_line w20">
                        <input type="text" id="content" name="content" autocomplete="off" placeholder="검색어를 입력하세요.">
                    </div>
                    <div class="input_line" style="width:80px;">
                        <select id="" name="">
                            <option value="">출고일</option>
                        </select>
                    </div>
                    <div class="date_line w120p">
                        <input type="text" id="start_dt" class="w80 datepick readonly" name="start_dt" onclick="javascript:call_date(this);">
                    </div>
                    &nbsp;~&nbsp;
                    <div class="date_line w120p">
                        <input type="text" id="end_dt" class="w80 datepick readonly" name="end_dt" onclick="javascript:call_date(this);">
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
        <input type="hidden" id="p" name="p" value="in">
        <input type="hidden" id="page" value="">
        <input type="hidden" id="ikey" name="ikey" value="">
        <input type="hidden" class="item_cd" value="">
        <input type="hidden" class="ord_no" name="ord_no" value="">
        <input type="hidden" class="st_sq" name="st_sq" value="">
        <input type="hidden" class="vat" name="vat" value="">
        <div class="input_zone section">
            <div class="input_wrap">
                <h4>주문 정보
                    <button type="button" id="btn_reset" class="F-right"><i class="btn_re_icon" aria-hidden="true"></i></button>
                </h4>
                <div class="div_ord">
                    <dl>
                        <dt class="impt">출고일자</dt>
                        <dd>
                            <div class="date_line w65">
                                <input type="text" class="put_dt datepicker readonly w80" name="put_dt" autocomplete="off" 
                                onclick="javascript:call_date(this);" required>
                            </div>
                        </dd>
                    </dl>
                    <dl class="">
                        <dt class="impt">주문선택</dt>
                        <dd>
                            <div class="input_line w70">
                                <input type="text" class="lot gray readonly" name="lot" value="">
                            </div>
                            <div class="div_reg">
                                <button type="button" class="btn_ord_li">선택</button>
                            </div>
                        </dd>
                    </dl>
                    <dl class="">
                        <dt class="">출고단가</dt>
                        <dd>
                            <div class="input_line w35">
                                <input type="text" class="ord_amt T-right gray readonly" name="ord_amt" autocomplete="off">
                            </div>
                            &nbsp;&nbsp;
                            <div class="input_line w35">
                                <input type="text" class="tax_amt T-right gray readonly" name="tax_amt" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                </div>
                <p class='imptp' style="padding-right:1.25rem"><span>*</span> 주문 선택 후 출고 등록 가능합니다.</p>
                <div class="div_out" style="display:none;">
                    <h4 style="margin-top:22px;" class="second_h4">출고 정보</h4>
                    <dl class="">
                        <dt class="impt">제품명</dt>
                        <dd>
                            <div class="input_line w70">
                                <input type="text" class="item_nm gray readonly" autocomplete="off">
                            </div>
                            <div class="div_reg">
                                <button type="button" class="btn_prod_st">선택</button>
                            </div>
                        </dd>
                    </dl>
                    <dl class="">
                        <dt class="">규격(단위)</dt>
                        <dd>
                            <div class="input_line w70">
                                <input type="text" class="unit gray readonly" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                    <dl>
                        <dt class="">창고위치</dt>
                        <dd>
                            <div class="input_line w70">
                                <input type="text" class="wh_nm gray readonly" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                    <!-- <dl class="">
                        <dt class="">유통기한</dt>
                        <dd>
                            <div class="input_line w50">
                                <input type="text" class="max_dt gray readonly" value="">
                            </div>
                        </dd>
                    </dl> -->
                    <dl class="">
                        <dt class="impt">출고 수량</dt>
                        <dd>
                            <div class="input_line w50">
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
                    <div class="div_reg_info" style="display: none; margin-bottom:50px">
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
                    <p class='imptp' style="padding-right:1.25rem"><span>*</span> 은 필수 입력 항목입니다.</p>
                    <div class="btn_wrap div_reg">
                        <?php if($w == "Y") { ?>
                            <button type="button" id="btn_reg">등록</button>
                        <?php } else{ ?>
                            <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">등록</button>
                        <?php } ?>
                    </div>
                    <div class="btn_wrap div_mod" style="display: none;">
                        <?php if($d == "Y") { ?>
                            <button type="button" id="btn_del" class="delete_btn">삭제</button>
                        <?php } else{ ?>
                            <button type="button" id="d_enroll" class="disable btn_del" onclick="alert('권한이 없습니다.');">삭제</button>
                        <?php } ?>
                        <?php if($m == "Y") { ?>
                            <button type="button" id="btn_mod">수정</button>
                        <?php } else{ ?>
                            <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">수정</button>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
        <?php echo form_close(); ?>

        <div class="list_zone section">
            <h2>출고 리스트</h2>
            <div class="list_wrap">
                <div class="h-scroll">
                    <table id="myTable" class="tablesorter ac hovering at">
                        <thead>
                            <tr>
                                <th class="fixedHeader sorter-false w5">순번</th>
                                <th class="fixedHeader w8">출고일자</th>
                                <th class="fixedHeader sorter-false w10">창고위치</th>
                                <th class="fixedHeader sorter-false w10">제품코드</th>
                                <th class="fixedHeader title_name">제품명</th>
                                <th class="fixedHeader sorter-false w10">규격(단위)</th>
                                <th class="fixedHeader sorter-false w9">출고단가</th>
                                <th class="fixedHeader sorter-false w6">출고수량</th>
                                <th class="fixedHeader sorter-false w7 no_tablet">반품입고량</th>
                                <th class="fixedHeader sorter-false w7 no_tablet">반품입고</th> 
                            </tr>
                        </thead>
                        <tbody id="data-container">
                            <?php // js ?>
                        </tbody>
                    </table>
                </div>
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
<script src="/public/js/food/prod_out.js?<?=time();?>"></script>
<script>
// order return value
function ord_close(arg)
{
    arg = JSON.parse(decodeURIComponent(arg));
    var ord_qty = Number(arg.ord_qty);
    var re_qty = Number(arg.re_qty);
    var out_qty = Number(arg.out_qty);
    var total_qty = (ord_qty-re_qty)-out_qty;
    if (total_qty > 0) // 출고 가능한 잔여 수량이 있을 경우
    {
        $(".ord_no").val(arg.ord_no);
        $(".lot").val(arg.lot);
        $(".ord_amt").val(commas(arg.ord_amt));
        $(".tax_amt").val(commas(arg.tax_amt));
        $(".vat").val(arg.vat);
        $(".item_cd").val(arg.item_cd);
        $(".qty").val(commas(total_qty));
        // pop close
        $('.ord_li_pop').bPopup().close();
        $(".div_out").css('display', 'block');
    }
    else
    {
        alert('출고 가능한 잔여 수량이 없습니다.');
    }
}

// stock return value
function stock_close(arg)
{
    arg = JSON.parse(decodeURIComponent(arg));
    $(".item_nm").val(arg.item_nm);
    $(".st_sq").val(arg.st_sq);
    $(".unit").val(arg.size+' '+arg.unit_nm);
    $(".wh_nm").val(arg.wh_nm);
    $(".max_dt").val(arg.max_dt);

    // pop close
    $('.prod_st_pop').bPopup().close();
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
$(function() {
	$(".custom-scroll").mCustomScrollbar({
	});
});
</script>