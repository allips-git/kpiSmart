<?php // 출고 현황 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/stock.css?<?=time()?>">
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
<div class="content item_st">
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
							<option value="i.item_cd">제품코드</option>
							<option value="s.memo">비고</option>
						</select>
					</div>
					<div class="input_line w20">
						<input type="text" id="content" name="content" placeholder="검색어를 입력하세요." autocomplete="off">
					</div>
					<div class="input_line w80p">
                        <select id="" name="">
                            <option value="">출고일</option>
                        </select>
                    </div>
                    <div class="date_line w120p">
                        <input type="text" id="start_dt" class="datepick readonly w80" name="start_dt" onclick="javascript:call_date(this);" auto>
                    </div>
                    &nbsp;~&nbsp;
                    <div class="date_line w120p">
                        <input type="text" id="end_dt" class="datepick readonly w80" name="end_dt" onclick="javascript:call_date(this);" auto>
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;
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
					<div class="input_line w8">
						<select id="state" name="state">
							<option value="">납품상태_전체</option>
							<option value="005" selected>납품대기</option>
							<option value="006">납품완료</option>
						</select>
					</div>
				</dd>
			</dl>
		</div>
    </form>
	
	<div class="bottom">
		<div class="list_zone section">
			<h4>출고 현황 리스트</h4>
			<div class="btns">
				<select class="ul_uc" name="ul_uc">
					<?php if(count($worker) > 0) { ?>
						<?php foreach($worker as $row) :?>
							<option value="<?= $row->ul_uc ?>"><?= $row->ul_nm.'('.$row->id.')' ?></option>
						<?php endforeach ?>
							<option value="" style="color:red; font-weight: bold;">배송사원 제거</option>
					<?php } else { ?>
						<option value="" disabled>배송직 사원 등록 필요</option>
					<?php } ?>
				</select>
				<button type="button" id="btn_worker" class="w">배송사원 적용</button>&nbsp;
				<button type="button" id="btn_out" class="blue">납품 완료</button>
				<button type="button" id="btn_print" class="blue">출고 요청서</button>
			</div>
			<div class="h-scroll">
				<table id="tb_list" class="hovering at ac">
					<thead>
						<tr>
							<th class="fixedHeader w4 sorter-false">
                                <input type="checkbox" id="chk_all" name="chk_all">
                                <label for="chk_all"></label>
                            </th>
							<th class="w4">순번</th>
                            <th class="w5">출고일자</th>
                            <th class="w7">창고위치</th>
                            <th class="w7">제품코드</th>
                            <th class="w8">바코드번호</th>
                            <th>제품명</th>
                            <th class="w7">규격(단위)</th>
                            <!-- <th class="w5">유통기한</th> -->
                            <th class="w6">출고단가(원)</th>
                            <th class="w5">주문수량</th>
                            <th class="w5">출고수량</th>
                            <th class="w7">배송사원</th>
                            <th class="w9">납기 완료일시</th>
                            <th class="w5">납품현황</th>
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
    <form id="frm" name="frm" method="post">
        <input type="hidden" id="p_gb" name="p_gb">
        <input type="hidden" id="p_local_cd" name="p_local_cd" value="<?= $this->session->userdata['local_cd']?>">
        <input type="hidden" id="p_start_dt" name="p_start_dt">
        <input type="hidden" id="p_end_dt" name="p_end_dt">
    </form>
    <?php // 바코드 스캔값 ?>
    <form id="frm_barcode" name="frm_barcode" method="post" accept-charset="utf-8" onsubmit="return false;">
    	<input type="hidden" id="bar_scan" name="barcode" value="">
    </form>
</div>
<!-- <script src="/public/js/lib/scan.js"></script> -->
<script src="/public/js/food/common_print.js?<?=time();?>"></script>
<script src="/public/js/food/out_list2.js?<?=time();?>"></script>
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