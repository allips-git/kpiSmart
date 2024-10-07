<!-- 접속기록 관리 페이지 -->
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">
<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/user.css?<?=time()?>">

<script>
	$(function() {
        $("#start_dt")
        .datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
        }).datepicker("setDate", get_date("시작일"));        // start date setting
        $("#end_dt")
        .datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
        }).datepicker("setDate", get_date("말일"));         // end date setting
    });
</script>
<input type="hidden" name="site_name" id="site_name" value="bms_log">
<div class="content log">
	<div class="section search_zone">
		<form id="frm" name="frm" accept-charset="utf-8" onsubmit="return false">
		<input type="hidden" name="s" value="t">
		<dl>
			<dt>
				<span>검색</span>
			</dt>
				<input type="hidden" name="s" value="t">
			<dd>
				<div class="input_line w8">
					<select name="op_1" id="op_1">
						<option value="ul_id">아이디</option>
						<option value="ul_nm">사원명</option>
					</select>
				</div>
				<div class="input_line w20">
					<input type="text" id="sc" name="sc" class="" placeholder="검색어를 입력하세요." autocomplete="off">
				</div>
				<div class="input_line w10">
					<select name="" id="">
						<option value="">접속일</option>
					</select>
				</div>
                <div class="date_line w120p">
				    <input type="text" id="start_dt" class="w80 datepicker readonly" name="st_dt" value="<?= $st_dt ?>" onclick="javascript:call_date(this);">
				</div>
				    &nbsp;~&nbsp;
                <div class="date_line w120p">
				    <input type="text" id="end_dt" class="w80 datepicker readonly" name="ed_dt" value="<?= $ed_dt ?>" onclick="javascript:call_date(this);">
				</div>
				<button type="button" id="btn_search" style="margin-left:10px">검색</button>
			</dd>
		</dl>
		</form>
	</div>
	
	<div class="bottom">
		<div class="list_zone section">
			<h4>접속 기록 리스트</h4>
			<div class="n-scroll">
				<table>
					<thead>
						<tr>
							<th class="w5">순번</th>
							<th class="w12">최근접속일시</th>
							<th class="w6">접속유형</th>
							<th class="w8">아이디</th>
							<th class="w10">사원명</th>
							<th class="w9">접속IP</th>
							<th class="w8">활동구분</th>
							<th class="w10">결과</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="h-scroll mCustomScrollbar">
				<table id="" class="hovering at">
					<tbody id="data-container">
					</tbody>
				</table>
			</div>
			<!-- pagination -->
			<div id="pagination" class="pagination"></div>
		</div>
	</div>
    <div class="total">
        <ul>
            <li class='T-right'>총 검색 : <strong id="list_cnt"></strong><span>건</span></li>
        </ul>
    </div>
</div>


<script src="/public/js/dev/log.js?<?=time()?>"></script>
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

