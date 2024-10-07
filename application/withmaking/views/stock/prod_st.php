<?php // 완제품 재고 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/stock.css?<?=time()?>">
<style>
	.container,
	.container > .content {
		height: 100%;
	}
</style>
<script>
	$(function() {
        // 주문일, 출고일 기본날짜 세팅
        $(".datepicker").datepicker({
        	dateFormat: 'yy-mm-dd',
        	showOn: 'button',
            buttonImage: '/public/img/calender_img.png', // 달력 아이콘 이미지 경로
            buttonImageOnly: true, //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false, // 월선택 select box 표시 (기본은 false)
            changeYear: false // 년선택 selectbox 표시 (기본은 false)
        }).datepicker(); // today setting
    });
</script>
<div class="content item_st prod_st">
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
							<option value="i.memo">비고</option>
						</select>
					</div>
					<div class="input_line w20">
						<input type="text" id="content" name="content" placeholder="검색어를 입력하세요." autocomplete="off">
					</div>
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
						<select id="item_gb" name="item_gb">
							<option value="">제품유형_전체</option>
							<option value="001">제품</option>
							<option value="002">상품(완제품)</option>
							<option value="003">반제품</option>
						</select>
					</div>
					<div class="input_line w8">
                        <select id="safe_gb" name="safe_gb">
                            <option value="">안전재고_전체</option>
                            <option value="up">안전재고_이상</option>
                            <option value="down">안전재고_이하</option>
                        </select>
                    </div>
				</dd>
			</dl>
		</div>
	</form>
	
	<div class="bottom">
		<div class="list_zone section">
			<h4>완제품 재고 리스트</h4>
			<div class="list_wrap">
				<table class="hovering ac">
					<thead>
						<tr>
							<th class="w5">순번</th>
                            <th class="w6">제품코드</th>
                            <th class="w6">제품유형</th>
                            <th>제품명</th>
                            <th class="w8">규격(단위)</th>
                            <th class="w10">창고위치</th>
                            <!-- <th class="w6">유통기한</th> -->
                            <th class="w5">입고단가</th>
                            <th class="w5">안전재고</th>
                            <th class="w5">기초재고</th>
                            <th class="w5">생산입고</th>
                            <th class="w5">제품출고</th>
                            <th class="w5">반품입고</th>
                            <th class="w5">불량수량</th>
                            <th class="w5">현재고</th>
                            <th class="w5">통합 현재고</th>
                            <!-- <th class="w5">실사재고</th> -->
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
</div>

<script src="/public/js/food/prod_st.js?<?=time();?>"></script>
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

