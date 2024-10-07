<?php // 장비 등록 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/loading.css">
<link rel="stylesheet" href="/public/css/food/whouse.css?<?=time()?>">

<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write; // 쓰기 권한
    $m = Authori::get_list()['data']->modify; // 수정 권한
    $d = Authori::get_list()['data']->delete; // 삭제 권한
?>

<script>
	$(function () {
        $(".datepicker")
        .datepicker({
        	dateFormat: 'yy-mm-dd',
        	showOn: 'button',
			buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
        });
    });
</script>
    
<div class="whouse machine content equip">
    <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
        <div class="search_zone section01 section">
            <dl>
                <dt>검색</dt>
                <dd>
                    <div class="input_line w10">
                        <select id="keyword" name="keyword">
                            <option value="e.eq_nm">기계명</option>
                            <option value="e.buy_corp">구매처 업체명</option>
                            <option value="e.buy_tel">구매처 전화번호</option>
                        </select>
                    </div>
                    <div class="input_line w20">
                        <input type="text" id="content" name="content" Auto placeholder="검색어를 입력하세요.">
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
        <?php $attributes = array("id" => "frm_reg", "method" => "post", "enctype" => "multipart/form-data", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
        <?php echo form_open_multipart($site_url.'/v', $attributes); ?>
        <input type="hidden" id="p" class="p" name="p" value="in">
        <input type="hidden" id="ikey" class="ikey" name="ikey" value="">
        <input type="hidden" id="page" name="page" value="">
        <div class="input_zone section">
            <div class="input_wrap">
            <h4>장비 정보 입력
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
                <dl>
                    <dt class="impt">기계명</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="eq_nm input" name="eq_nm" Auto required>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>구매처 업체명</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="buy_corp input" name="buy_corp" Auto>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>구매처 전화번호</dt>
                    <dd>
                        <div class="input_line ">
                            <input type="text" class="buy_tel input" name="buy_tel" Auto>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>장비 구매일</dt>
                    <dd>
                        <div class="date_line w50">
                            <input type="text" class="datepicker readonly w80 buy_dt" name="buy_dt" onclick="call_date(this)" Auto>
                        </div>
                    </dd>
                </dl>
                <dl class="bgo">
                    <dt>특이사항</dt>
                    <dd>
                        <div class="input_line">
                            <textarea class="memo input" name="memo" cols="30" rows="10"></textarea>
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
            <?php echo form_close(); ?>
        </div>
        <div class="list_zone section">
            <h2>장비 리스트</h2>
            <div class="btns">
                <button type="button" id="btn_barcode" class="blue">바코드 출력</button>
            </div>
            <div class="list_wrap">
                <div class="n-scroll">
                    <table id="" class="hovering at ac">
                        <thead>
                            <tr>
                                <th class="fixedHeader sorter-false w5">
                                    <input type="checkbox" id="chk_all" class="chk_all" name="chk_all">
                                    <label for="chk_all"></label>
                                </th>
                                <th class="w6">순번</th>
                                <th class="w12">장비구매일</th>
                                <th>기계명</th>
                                <th class="w17">구매처 업체명</th>
                                <th class="w15">구매처 전화번호</th>
                                <th class="w8">가용여부</th>
                                <th class="w8">바코드</th>
                            </tr>
                        </thead>
                        <tbody id="data-container" class="">
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
                    <option value="50" selected>페이지 보기 50</option>
                    <option value="100">페이지 보기 100</option>
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
        <input type="hidden" id="p_work" name="p_work" value="equipment">
        <input type="hidden" id="p_ikey" name="p_ikey">
    </form>
</div>

<script src="/public/js/food/common_print.js?<?=time();?>"></script>
<script src="/public/js/food/equipment.js?<?=time();?>"></script>
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
        $("input[class=chk_all]").prop("checked", false); 
        $("input[class=chk_all]").parents('tr').removeClass('active');
        $("input[class=chk_all]").parents('tr').next().removeClass('active');
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