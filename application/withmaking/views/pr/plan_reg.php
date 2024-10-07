<?php // 생산 계획 등록 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/plan.css?<?=time()?>">

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
<div class="content plan_list plan_reg">
	<div class="section search_zone">
        <h4 class="w100">생산 계획 등록</h4>
        <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
        <dl class="w27">
            <dt class="impt">착수예정일</dt>
            <dd>
                <input type="text" class=" datepicker w30 gray readonly" name="">
            </dd>
        </dl>
        <dl class="w27">
            <dt>제조오더번호</dt>
            <dd>
                <div class="input_line w60">
                    <input type="text" class="gray" name="">
                </div>
            </dd>
        </dl>
        <dl class="w27">
            <dt>상태</dt>
            <dd>
                <div class="input_line w30">
                    <select name="" id="">
                        <option value="">상태_전체</option>
                    </select>
                </div>
            </dd>
        </dl>
        <dl class="w27">
            <dt>라우팅명</dt>
            <dd>
                <div class="input_line w60">
                    <input type="text" class="gray readonly" name="" placeholder="" autocomplete="off">
                </div>
                <button type="button">검색</button>
            </dd>
        </dl>
        <dl class="w27">
            <dt class="impt">품목코드/명</dt>
            <dd>
                <div class="input_line w60">
                    <input type="text" class="gray readonly" name="" placeholder="" autocomplete="off">
                </div>
                <button type="button">검색</button>
            </dd>
        </dl>
        <dl class="w27">
            <dt>규격/단위</dt>
            <dd>
                <div class="input_line w60">
                    <input type="text" class="gray readonly" name="" placeholder="" autocomplete="off">
                </div>
            </dd>
        </dl>
        <dl class="w27">
            <dt class="impt">지시수량</dt>
            <dd>
                <div class="input_line w60">
                    <input type="text" class="" name="" placeholder="" autocomplete="off">
                </div>
            </dd>
        </dl>
        <dl class="w65">
            <dt>비고</dt>
            <dd>
                <div class="input_line w67">
                    <input type="text" class="" name="" placeholder="" autocomplete="off">
                </div>
            </dd>
        </dl>
	</div>
	
	<div class="bottom">
		<div class="list_zone section">
            <input type="radio" id="tab01" name="tab" checked>
            <label for="tab01" class="tab01">제조오더리스트</label>
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
                                <th class="w5">순번</th>
                                <th class="w5">공정#</th>
                                <th>공정</th>
                                <th class="w5">후공정#</th>
                                <th class="w5">C/T(분)</th>
                                <th class="w5">소요(분)</th>
                                <th class="w6">지시일자</th>
                                <th>워크센터</th>
                                <th class="w6">자체/외주</th>
                                <th>거래처</th>
                                <th>설비명</th>
                                <th class="w8">작업자</th>
                                <th class="w5">실적여부</th>
                                <th class="w5">최종여부</th>
                                
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="h-scroll">
                    <table class="hovering at">
                        <tbody>
                            <tr>
                                <td class="w5">1</td>
                                <td class="w5">1</td>
                                <td>생산</td>
                                <td class="w5">1</td>
                                <td class="w5 T-right">0</td>
                                <td class="w5 T-right">1,000</td>
                                <td class="w6">2022-05-05</td>
                                <td>생산</td>
                                <td class="w6">자체</td>
                                <td></td>
                                <td>3호기</td>
                                <td class="w8">
                                    <select name="" id="">
                                        <option value="">홍길동</option>
                                    </select>
                                </td>
                                <td class="w5">Y</td>
                                <td class="w5">Y</td>
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
                                <th class="w5">순번</th>
                                <th class="w5">공정#</th>
                                <th>투입공정</th>
                                <th class="w8">품목코드</th>
                                <th>품목명</th>
                                <th class="w9">규격</th>
                                <th class="w5">투입단위</th>
                                <th class="w6">소요량</th>
                                <th class="w6">예약수량</th>
                                <th class="w5">기준단위</th>
                                <th class="w6">기준수량</th>
                                <th class="w8">출고창고</th>
                                <th class="w5">자동출고</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="h-scroll">
                    <table id="" class="">
                        <tbody>
                            <tr>
                                <td class="w5">1</td>
                                <td class="w5">1</td>
                                <td>생산</td>
                                <td class="w8">SVGA123456</td>
                                <td></td>
                                <td class="w9"></td>
                                <td class="w5">GR</td>
                                <td class="w6">0</td>
                                <td class="w6 T-right">1,000</td>
                                <td class="w5 T-right">KG</td>
                                <td class="w6 T-right">1</td>
                                <td class="w8">창고1</td>
                                <td class="w5">N</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
		</div>
	</div>
    <div class="total">
        <ul>
            <li class="T-right">총 품목수 : <strong id="list_count">2</strong><span>개</span></li>
        </ul>
    </div>
    <div class="btn_wrap">
        <button type="button" class="gray" onclick="location.href='/pr/plan_list'">목록</button>
        <button type="button" class="blue">등록하기</button>
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
