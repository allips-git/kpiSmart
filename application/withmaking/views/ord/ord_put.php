<?php // 구매 입고 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/ord.css?<?=time()?>">

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
<div class="content ord_put">
	<div class="section search_zone">
		<dl>
			<dt>
				<span>검색</span>
			</dt>
			<dd>
				<div class="input_line w8">
					<select id="" name="">
						<option value=""></option>
					</select>
				</div>
				<div class="input_line w20">
					<input type="text" id="" name="" placeholder="검색어를 입력하세요." autocomplete="off">
				</div>
				<div class="input_line w10">
					<select id="" name="">
						<option value=""></option>
					</select>
				</div>
				<input type="text" id="" class="datepicker w6 gray readonly" name="">
				&nbsp;~&nbsp;
				<input type="text" id="" class="datepicker w6 gray readonly" name="">
				<!-- <button type="button" id="" style="margin-left:10px">검색</button> -->
				<div class="input_line w10" style="margin-left:10px">
					<select id="" name="">
						<option value=""></option>
					</select>
				</div>
				<div class="input_line w10">
					<select id="" name="">
						<option value=""></option>
					</select>
				</div>
			</dd>
		</dl>
	</div>
	
	<div class="bottom">
		<div class="list_zone section">
			<h4>구매 입고 리스트</h4>
			<div class="n-scroll">
				<table>
					<thead>
						<tr>
							<th class="w5">순번</th>
                            <th class="w8">제품코드</th>
                            <th class="w8">제품유형</th>
                            <th>제품명</th>
                            <th class="w8">규격(단위)</th>
                            <th class="w7">기본창고</th>
                            <th class="w5">기초재고</th>
                            <th class="w5">안전재고</th>
                            <th class="w5">입고수량</th>
                            <th class="w5">출고수량</th>
                            <th class="w5">생산입고</th>
                            <th class="w5">생산출고</th>
                            <th class="w5">현재고</th>
                            <th class="w5">장부재고</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="h-scroll mCustomScrollbar">
				<table id="" class="hovering at at">
					<tbody>
                        <tr>
                            <td class="w5">1</td>
                            <td class="w8">KR05B00001</td>
                            <td class="w8">원자재</td>
                            <td class="Elli">멍게젓갈</td>
                            <td class="w8">250*1 EA</td>
                            <td class="w7">창고1구역</td>
                            <td class="w5 T-right">0</td>
                            <td class="w5 T-right">0</td>
                            <td class="w5 T-right">0</td>
                            <td class="w5 T-right">0</td>
                            <td class="w5 T-right">0</td>
                            <td class="w5 T-right">0</td>
                            <td class="w5 T-right">0</td>
                            <td class="w5 T-right">0</td>
                        </tr>
					</tbody>
				</table>
			</div>
			<!-- pagination -->
            <div id="pagination" class="pagination">
                <div class="paginationjs paginationjs-theme-blue paginationjs-small">
                    <div class="paginationjs-pages">
                        <ul>
                            <li class="paginationjs-prev disabled "><a>«</a></li>
                            <li class="paginationjs-page J-paginationjs-page active" data-num="1"><a>1</a></li>
                            <li class="paginationjs-page J-paginationjs-page " data-num="2"><a>2</a></li>
                            <li class="paginationjs-page J-paginationjs-page " data-num="3"><a>3</a></li>
                            <li class="paginationjs-next"><a>»</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="view_count">
                <select id="">
                    <option value="15">페이지 보기 15</option>
                    <option value="50">페이지 보기 50</option>
                    <option value="100">페이지 보기 100</option>
                </select>
            </div>
		</div>
	</div>
    <div class="total">
        <ul>
            <li class='T-right'>총 검색 : <strong id="list_cnt"></strong><span>건</span></li>
        </ul>
    </div>
</div>


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

