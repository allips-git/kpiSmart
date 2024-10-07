<?php // 온라인 주문관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/online.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">
<script>
	$(function() {
        // 기본날짜 세팅
        $(".datepicker").datepicker({
        	dateFormat: 'yy-mm-dd',
        	showOn: 'button',
			buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
        }).datepicker("setDate", get_date("시작일"));        // start date setting
        $(".datepicker2").datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
         }).datepicker("setDate", get_date("말일"));        // end date setting
    });
</script>
<div class="content online_put online_buy">
	<?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
		<div class="section search_zone">
			<dl>
				<dt>
					<span>검색</span>
				</dt>
				<dd>
					<div class="input_line w8">
						<select id="keyword" name="keyword">
							<option value="m.cust_nm">고객(별칭)명</option>
							<option value="m.biz_nm">사업장(고객)명</option>
							<option value="m.cust_cd">고객 코드</option>
							<option value="d.mall_nm">쇼핑몰명</option>
							<option value="d.client_nm">고객명</option>
							<option value="d.client_tel">고객전화번호</option>
							<option value="m.ord_no">주문번호</option>
							<option value="m.memo">비고</option>
	                    </select>
					</div>
					<div class="input_line w20">
						<input type="text" id="content" name="content" placeholder="검색어를 입력하세요." autocomplete="off">
					</div>
					<div class="input_line" style="width:80px;">
						<select id="" name="">
							<option value="">주문일</option>
						</select>
					</div>
                    <div class="date_line w120p">
					    <input type="text" id="start_dt" class="datepicker w80 readonly" name="start_dt" value="" onclick="javascript:call_date(this);">
					</div>
                    &nbsp;&nbsp;~&nbsp;&nbsp;
                    <div class="date_line w120p">
					    <input type="text" id="end_dt" class="datepicker2 datepick w80 readonly" name="end_dt" value="" onclick="javascript:call_date(this);">
					</div>
                    <!-- <button type="button" id="" style="margin-left:10px">검색</button> -->
					&nbsp;&nbsp;&nbsp;
					<div class="input_line w10">
						<select id="finyn" name="finyn">
							<option value="">전표마감_전체</option>
							<option value="N">대기</option>
							<option value="Y">마감</option>
						</select>
					</div>
				</dd>
			</dl>
		</div>
	</form>
	
	<div class="bottom">
		<div class="list_zone section">
			<h4>수주 리스트
                <button type="button" class="w add_ord_all">수주 일괄 등록</button>&nbsp;
            </h4>
			<div class="btns">
				<button type="button" id="btn_confirm" class="w">수주 확정</button>
				<button type="button" class="blue" onclick="location.href='/ord/ord_list/in'">수주 등록</button>
			</div>
			<div class="h-scroll custom-scroll">
				<table class="hovering at">
					<thead>
						<tr>
							<th class="w4">
                                <input type="checkbox" id="chk_all" name="chk_all">
                                <label for="chk_all"></label>
                            </th>
							<th class="w5">순번</th>
                            <th class="w6">주문일</th>
                            <th class="w8">주문번호</th>
                            <th class="w12">고객(별칭)명</th>
                            <th class="w12">쇼핑몰명</th>
                            <th>제품명</th>
                            <th class="w6">총 주문수량</th>
                            <th class="w7">금액</th>
                            <th class="w7">세액</th>
                            <th class="w5">전표 마감</th>
                            <th class="w5">상태</th>
                            <th class="w7">출력</th>
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
</div>

<?php // 거래명세표 출력용 FORM ?>
<form id="frm" name="frm" method="post">
    <input type="hidden" id="p_gb" name="p_gb">
    <input type="hidden" id="p_ord_no" name="p_ord_no">
</form>

<script src="/public/js/food/common_print.js?<?=time();?>"></script>
<script src="/public/js/food/ord_list.js?<?=time();?>"></script>
<script>
	$(function() {
		$(".custom-scroll").mCustomScrollbar({
		});
	});
</script>
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
