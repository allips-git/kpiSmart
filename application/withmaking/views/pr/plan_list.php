<?php // 생산 계획 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/plan.css?<?=time()?>">
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
<div class="content plan_list">
    <form>
		<div class="section search_zone">
			<dl>
				<dt>
					<span>검색</span>
				</dt>
				<dd>
					<div class="input_line w8">
						<select id="" name="">
							<option value="">거래처(별칭)명</option>
						</select>
					</div>
					<div class="input_line w20">
						<input type="text" id="" name="" placeholder="검색어를 입력하세요." autocomplete="off">
					</div>
					<div class="input_line" style="width:80px;">
						<select id="" name="">
							<option value="">주문일</option>
						</select>
					</div>
					<input type="text" id="" class="datepicker w6 gray readonly" name="" value="" onclick="">
					&nbsp;&nbsp;~&nbsp;&nbsp;
					<input type="text" id="" class="datepicker w6 gray readonly" name="" value="" onclick=";">
					&nbsp;&nbsp;&nbsp;
					<div class="input_line w10">
						<select id="" name="">
							<option value="">전표마감_전체</option>
							<option value="">대기</option>
							<option value="">완료</option>
						</select>
					</div>
				</dd>
			</dl>
		</div>
	</form>
	
	<div class="bottom">
		<div class="list_zone section">
			<h4>생산 계획 리스트</h4>
			<div class="btns">
				<!-- <button type="button" class="w">주문 일괄 등록</button>&nbsp; -->
				<button type="button" class="blue" onclick="location.href='/pr/plan_list/in'">생산 계획 등록</button>
				<button type="button" class="blue planadd_btn">생산 계획 등록2</button>
			</div>
			<div class="h-scroll custom-scroll">
				<table class="hovering at">
					<thead>
						<tr>
							<th class="w5">순번</th>
                            <th class="w6">주문일</th>
                            <th class="w8">주문번호</th>
                            <th class="w12">거래처(별칭)명</th>
                            <th>제품명</th>
                            <th class="w6">총 주문수량</th>
                            <th class="w8">금액</th>
                            <th class="w8">세액</th>
                            <!-- <th class="w6">입고 작업</th> -->
                            <th class="w6">출고완료일</th>
                            <th class="w5">전표 마감</th>
                            <th class="w7">출력</th>
						</tr>
					</thead>
					<tbody id="">
                        <tr>
                            <td class="w5">2</td>
                            <td class="w6">2022-05-19</td>
                            <td class="w8">20220519123789</td>
                            <td class="w12">(주)올립스</td>
                            <td class="Elli tb_click planmod_btn">멍게젓갈 외 1개</td>
                            <td class="w6">3</td>
                            <td class="w8 T-right">65,000 원</td>
                            <td class="w8 T-right">6,500 원</td>
                            <!-- <td class="w6"><button type="button" class="addput_btn">등록</button></td> -->
                            <td class="w6">2022-05-23</td>
                            <td class="w5"><button type="button" class="online_magam">등록</button></td>
                            <td class="w7"><button type="button">거래명세서</button></td>
                        </tr>
                        <tr>
                            <td class="w5">1</td>
                            <td class="w6">2022-05-16</td>
                            <td class="w8">20220516123789</td>
                            <td class="w12">FMS</td>
                            <td class="Elli tb_click planmod_btn">멍게젓갈 외 1개</td>
                            <td class="w8">3</td>
                            <td class="w8 T-right">55,000 원</td>
                            <td class="w8 T-right">5,500 원</td>
                            <td class="w6">2022-05-23</td>
                            <!-- <td class="w6"><button type="button" class="addput_btn">등록</button></td> -->
                            <td class="w5"><span class="red">마감</span></td>
                            <td class="w7"><button type="button">거래명세서</button></td>
                        </tr>
					</tbody>
				</table>
			</div>
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
                <select id="page_size">
                    <option value="15">페이지 보기 15</option>
                    <option value="30">페이지 보기 30</option>
                    <option value="50">페이지 보기 50</option>
                    <option value="100">페이지 보기 100</option>
                </select>
            </div>
		</div>
	</div>
    <div class="total">
        <ul>
            <li class='T-right'>총 검색 : <strong id="list_cnt">2</strong><span>건</span></li>
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
