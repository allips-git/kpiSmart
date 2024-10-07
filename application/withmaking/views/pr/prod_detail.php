<?php // 생산 작업 상세 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/pr.css?<?=time()?>">

<script>
    $(function() {
        // 주문일, 출고일 기본날짜 세팅
        $(".datepicker").datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
        }).datepicker("setDate", new Date());               // today setting
    });
</script>
<div class="content job_ord prod_detail">
	<div class="section search_zone">
        <!-- <button type="button" class="cancle">강제 취소</button> -->
        <h4 class="w100">생산 작업 상세 페이지</h4>
        <!-- <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p> -->
        <dl class="w27">
            <dt class="">지시 일자</dt>
            <dd>
                <span>2022-06-29</span>
                <!-- <input type="text" class=" datepicker w30 gray readonly" name=""> -->
            </dd>
        </dl>
        <dl class="w27">
            <dt>제조 오더 번호</dt>
            <dd>
                <span>2022062959784</span>
                <!-- <div class="input_line w60">
                    <input type="text" class="gray" name="">
                </div> -->
            </dd>
        </dl>
        <dl class="w27">
            <dt>상태</dt>
            <dd>
                <span>대기</span>
                <!-- <div class="input_line w30">
                    
                    <select name="" id="">
                        <option value="">대기</option>
                        <option value="">전송</option>
                    </select>
                </div> -->
            </dd>
        </dl>
        <dl class="w27">
            <dt class="">라우팅명</dt>
            <dd>
                <span>멍게젓갈 생산공정</span>
                <!-- <div class="input_line w60">
                    <input type="text" class="gray readonly" name="" value="멍게젓갈 생산공정" placeholder="" autocomplete="off">
                </div>
                <button type="button">검색</button> -->
            </dd>
        </dl>
        <dl class="w27">
            <dt class="">제품명</dt>
            <dd>
                <span>멍게젓갈 500g</span>
                <!-- <div class="input_line w60">
                    <select id="">
                        <option>1번 작업장</option>
                        <option>2번 작업장</option>
                        <option>3번 작업장</option>
                        <option>4번 작업장</option>
                    </select>
                </div> -->
            </dd>
        </dl>
        <dl class="w27">
            <dt class="">규격/단위</dt>
            <dd>
                <span>1 EA</span>
                <!-- <div class="input_line w30">
                    <input type="text" class="" name="" value="8" autocomplete="off">
                </div> -->
            </dd>
        </dl>
        <dl class="w27">
            <dt>작업장</dt>
            <dd>
                <span>작업 1반</span>
                <!-- <div class="input_line w60">
                    <input type="text" class="gray readonly" name="" placeholder="" autocomplete="off">
                </div> -->
            </dd>
        </dl>
        <dl class="w27">
            <dt class="">지시 수량</dt>
            <dd>
                <span>1,000</span>
                <!-- <div class="input_line w60">
                    <input type="text" class="" name="" placeholder="" value="1000" autocomplete="off">
                </div> -->
            </dd>
        </dl>
        <dl class="w74">
            <dt>비고</dt>
            <dd>
                <!-- <div class="input_line">
                    <input type="text" class="" name="" placeholder="" autocomplete="off">
                </div> -->
            </dd>
        </dl>
	</div>
	
	<div class="bottom">
		<div class="list_zone section">
            <input type="radio" id="tab01" name="tab" checked>
            <label for="tab01" class="tab01">공정리스트</label>
            <input type="radio" id="tab02" name="tab">
            <label for="tab02" class="tab02">BOM리스트</label>
            <div class="tabbox01 tabbox">
                <!-- <div class="btns">
                    <button type="button" id="btn_add" class="blue btn_add">품목 추가</button>
                </div> -->
                <div class="n-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th class="w4">순번</th>
                                <th class="w4">공정#</th>
                                <th class="w6">공정 코드</th>
                                <th class="w6">공정 유형</th>
                                <th class="w16">공정명</th>
                                <th class="w8">담당자</th>
                                <th class="w6">실적 등록</th>
                                <th class="w6">목표 실적</th>
                                <th class="w25">비고</th>
                                <th></th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="h-scroll">
                    <table class="">
                        <tbody>
                            <tr>
                                <td class="w4">1</td>
                                <td class="w4">1</td>
                                <td class="w6">PP10</td>
                                <td class="w6">생산</td>
                                <td class="Elli w16">양념배합</td>
                                <td class="w8">장동건</td>
                                <td class="w6"><span style="color:gray;">미사용</span></td>
                                <td class="w6">0</td>
                                <td class="w25 T-left Elli"></td>
                                <td class=""></td>
                            </tr>
                            <tr>
                                <td class="w4">2</td>
                                <td class="w4">2</td>
                                <td class="w6">PP20</td>
                                <td class="w6">포장</td>
                                <td class="Elli w16">포장</td>
                                <td class="w8">현빈</td>
                                <td class="w6"><span style="font-weight:bold">사용</span></td>
                                <td class="w6">1,000</td>
                                <td class="w25 T-left Elli"></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="tabbox02 tabbox">
                <!-- <div class="btns">
                    <button type="button" id="btn_add" class="blue btn_add">품목 추가</button>
                </div> -->
                <div class="n-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th class="w4"></th>
                                <th class="w4">공정#</th>
                                <th class="w15">투입공정명</th>
                                <th class="w10">품목코드</th>
                                <th>품목명</th>
                                <th class="w8">품목 유형</th>
                                <th class="w8">규격(단위)</th>
                                <th class="w7">기본 소요량</th>
                                <th class="w7">소요량 예측</th>
                                <th class="w10">기본 창고</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="h-scroll">
                    <table id="" class="">
                        <tbody>
                        <tr>
                            <td class="w4">1</td>
                            <td class="w4">1</td>
                            <td class="w15">양념배합</td>
                            <td class="w10">KR05B00001</td>
                            <td>멍게</td>
                            <td class="w8">원자재</td>
                            <td class="w8">500 g</td>
                            <td class="w7">1</td>
                            <td class="w7">1,000</td>
                            <td class="w10">원자재 창고</td>
                        </tr>
                        <tr>
                            <td class="w4">2</td>
                            <td class="w4">1</td>
                            <td class="w15">양념배합</td>
                            <td class="w10">KR05B00002</td>
                            <td>고추장</td>
                            <td class="w8">원자재</td>
                            <td class="w8">100 g</td>
                            <td class="w7">0.35</td>
                            <td class="w7">350</td>
                            <td class="w10">원자재 창고</td>
                        </tr>
                        <tr>
                            <td class="w4">3</td>
                            <td class="w4">1</td>
                            <td class="w15">양념배합</td>
                            <td class="w10">KR05B00002</td>
                            <td>소금</td>
                            <td class="w8">부자재</td>
                            <td class="w8">30 g</td>
                            <td class="w7">0.06</td>
                            <td class="w7">60</td>
                            <td class="w10">부자재 창고</td>
                        </tr>
                        <tr>
                            <td class="w4">4</td>
                            <td class="w4">2</td>
                            <td class="w15">포장</td>
                            <td class="w10">KR05B00004</td>
                            <td>500g 포장용기</td>
                            <td class="w8">저장품(부속)</td>
                            <td class="w8">1 EA</td>
                            <td class="w7">1</td>
                            <td class="w7">1,000</td>
                            <td class="w10">저장품 창고</td>
                        </tr>
                        <tr>
                            <td class="w4">5</td>
                            <td class="w4">2</td>
                            <td class="w15">포장</td>
                            <td class="w10">KR05B00005</td>
                            <td>라벨 프린터</td>
                            <td class="w8">저장품(부속)</td>
                            <td class="w8">5cm * 1 EA</td>
                            <td class="w7">1</td>
                            <td class="w7">1,000</td>
                            <td class="w10">저장품 창고</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
		</div>
	</div>
    <div class="total">
        <ul>
            <li class="T-right">총 공정 : <strong id="list_count">2</strong><span>라인</span></li>
        </ul>
    </div>
    <div class="btn_wrap">
        <button type="button" class="gray" onclick="location.href='/pr/prod_list'">목록</button>
    </div>
</div>

<script>
	$(function() {
		$(".custom-scroll").mCustomScrollbar({});
        $("#item_list").select2();
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
