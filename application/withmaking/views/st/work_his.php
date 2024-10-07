<?php // 작업 현황 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/prod_his.css?<?=time()?>">
<script>
	$(function() {
       var date = new Date();
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
<div class="content ord_put work_his">
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
                            <option value="p.pp_nm">공정명</option>
                            <option value="p.pp_cd">공정코드</option>
                            <option value="m.memo">비고</option>
                        </select>
    				</div>
    				<div class="input_line w20">
                        <input type="text" id="content" name="content" placeholder="검색어를 입력하세요." autocomplete="off">
    				</div>
    				<div class="input_line w6">
    					<select id="" name="">
    						<option value="">지시일</option>
    					</select>
    				</div>
                    <div class="date_line w120p">
                        <input type="text" id="start_dt" class="datepicker w80 readonly" name="start_dt" value="" onclick="javascript:call_date(this);" autocomplete="off">
    				</div>&nbsp;~&nbsp;
                    <div class="date_line w120p">
                        <input type="text" id="end_dt" class="datepicker2 datepick w80 readonly" name="end_dt" value="" onclick="javascript:call_date(this);" autocomplete="off">
    				</div>
                    <button type="button" id="btn_search" style="margin-left:10px">검색</button>
    			</dd>
    		</dl>
    	</div>
    </form>
	
	<div class="bottom">
		<div class="list_zone section">
			<h4>공정별 작업 현황</h4>
			<div class="h-scroll">
				<table id="" class="hovering at at">
					<thead>
						<tr>
                            <th class="w5">순번</th>
                            <th class="w12">공정코드</th>
                            <th>공정명</th>
                            <th class="w12">공정 유형</th>
                            <th class="w12">총 투입인원</th>
                            <th class="w12">목표 실적량</th>
                            <th class="w12">총 실적수량</th>
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
            <li class="T-right">총 검색 : <strong id="list_cnt">0</strong><span>건</span></li>
        </ul>
    </div>
</div>

<!-- 날짜 계산 CDN 라이브러리 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.7/dayjs.min.js"></script>
<script src="/public/js/food/work_his.js?<?=time();?>"></script>
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

