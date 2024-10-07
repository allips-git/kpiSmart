<?php // 생산 입고 검사 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/pr.css?<?=time()?>">

<script>
	$(function() {
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
<div class="content prod_list prod_qa">
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
							<option value="i.item_nm">제품명</option>
							<option value="s.item_cd">제품코드</option>
	                        <option value="t.barcode">바코드번호</option>
							<option value="s.ord_no">제조오더번호</option>
							<option value="s.memo">비고</option>
						</select>
					</div>
					<div class="input_line w20">
						<input type="text" id="content" name="content" placeholder="검색어를 입력하세요." autocomplete="off">
					</div>
					<div class="input_line w80p">
	                    <select id="" name="">
	                        <option value="">입고일</option>
	                    </select>
	                </div>
                    <div class="date_line w120p">
                        <input type="text" id="start_dt" class="w80 datepick readonly" name="start_dt" onclick="javascript:call_date(this);">
                    </div>&nbsp;~&nbsp;
                    <div class="date_line w120p">
                        <input type="text" id="end_dt" class="w80 datepick readonly" name="end_dt" onclick="javascript:call_date(this);">
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;
					<div class="input_line w8">
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
		<div class="list_zone section">
			<h4>생산 불량 관리</h4>
			<div class="btns">
                <button type="button" id=""  class="btn_flaw blue">불량수량 등록</button>
			</div>
			<div class="h-scroll">
				<table id="myTable" class="tablesorter hovering ac">
					<thead>
						<tr>
							<th class="fixedHeader w4 sorter-false">
                                <input type="checkbox" id="chk_all" name="chk_all">
                                <label for="chk_all"></label>
                            </th>
                            <th class="w10">지시일자</th>
                            <th class="w10">제품명</th>
                            <th class="w10">공정명</th>
                            <th class="w10">투입공정명</th>
                            <th class="w12">담당자</th>
                            <th class="w10">생산수량</th>
                            <!-- <th class="w6">목표 실적</th> -->
                            <th class="w10">불량 수량</th>
                            <th class="w10">일 작업시간</th>
                            <th class="w10">투입인원</th>
                            <th class="w10">진행상태</th>
                          
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
        <input type="hidden" id="p_work" name="p_work" value="pr_in">
        <input type="hidden" id="p_ikey" name="p_ikey">
    </form>
</div>

<script src="/public/js/food/common_print.js?<?=time();?>"></script>
<script src="/public/js/food/prod_qa.js?<?=time();?>"></script>
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