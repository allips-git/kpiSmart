<?php // 제조 오더 등록 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
<link rel="stylesheet" href="/public/css/food/pr.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">

<script>
	$(function() {
        // 기본날짜 세팅
        $(".datepicker").datepicker({
        	dateFormat: "yy-mm-dd",
        	showOn: "button",
			buttonImage: "/public/img/calender_img.png",    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
        }).datepicker("setDate", get_date("시작일"));        // start date setting
        $(".datepicker2").datepicker({
            dateFormat: "yy-mm-dd",
            showOn: "button",
            buttonImage: "/public/img/calender_img.png",    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
         }).datepicker("setDate", get_date("말일"));        // end date setting
    });
</script>
<div class="content job_ord">
	<?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
    <form>
		<div class="section search_zone">
			<dl>
				<dt>
					<span>검색</span>
				</dt>
				<dd>
					<div class="input_line w8">
						<select id="keyword" name="keyword">
							<option value="i.item_nm">제품명</option>
							<option value="m.item_cd">제품코드</option>
							<option value="m.job_no">제조오더번호</option>
							<option value="m.memo">비고</option>
						</select>
					</div>
					<div class="input_line w20">
						<input type="text" id="content" name="content" placeholder="검색어를 입력하세요." autocomplete="off">
					</div>
					<div class="input_line" style="width:80px;">
						<select id="job_dt" name="job_dt">
							<option value="">지시일자</option>
						</select>
					</div>
                    <div class="date_line w120p">
					    <input type="text" id="start_dt" class="datepicker w80 readonly" name="start_dt" value="" onclick="javascript:call_date(this);">
                    </div>&nbsp;&nbsp;~&nbsp;&nbsp;
                    <div class="date_line w120p">
					    <input type="text" id="end_dt" class="datepicker2 datepick w80 readonly" name="end_dt" value="" onclick="javascript:call_date(this);">
                    </div>
                        &nbsp;&nbsp;&nbsp;
					<div class="input_line w8">
						<select id="state" name="state">
							<option value="" selected>진행상태_전체</option>
							<option value="001">접수</option>
							<option value="002">대기</option>
							<option value="003">진행</option>
							<option value="004">완료</option>
						</select>
					</div>
				</dd>
			</dl>
		</div>
	</form>

	<div class="bottom">
		<div class="list_zone section">
			<h4>제조 오더 리스트</h4>
			<div class="btns">
				<button type="button" id="btn_barcodes" class="w">바코드 출력</button>
				<button type="button" id="btn_confirm" class="w">제조 오더 확정</button>
				<button type="button" class="blue" onclick="location.href='/pr/job_ord/in'">제조 오더 등록</button>
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
                            <th class="w5">작업번호</th>
                            <th class="w8">제조 오더 번호</th>
                            <th class="w10">제품코드</th>
                            <th>제품명</th>
                            <th class="w8">제품 유형</th>
                            <th class="w12">규격(단위)</th>
							<th class="w7">지시 일자</th>
                            <th class="w7">지시 수량</th>
                            <th class="w10">작업장</th>
                            <th class="w5">진행상태</th>
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
            <li class="T-right">총 검색 : <strong id="list_cnt">0</strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/food/job_ord.js?<?=time();?>"></script>
<script>
	$(function() {
		$(".custom-scroll").mCustomScrollbar({ });
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
