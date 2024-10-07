<?php // 구매 발주 반품 관리 페이지 ?>
<?php // 기획 및 사용처 확인불가로 temp파일 처리. 김민주 2022/06/21 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/ord.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">
<style>
    .btn_add {
        font-size: 15px !important;
    }
    .inp_gray {
        background-color: #f5f5f8 !important;
    }
</style>
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
<div class="content ord_put ord_reg ord_mod ord_re">
    <div class="top">
        <div class="section search_zone w100">
            <h4 class="w100">구매 발주 기본 정보</h4>
            <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
                <!-- <div class="btn_wrp">
                    <button type="button" class="magam_btn">전표 마감</button>
                </div> -->
            <dl class="w27">
                <dt class="impt">발주일</dt>
                <dd>
                    <input type="text" id="" class="datepicker w30 gray readonly" name="">
                </dd>
            </dl>
            <dl class="w27">
                <dt>발주번호</dt>
                <dd>
                    <div class="input_line w60">
                        <input type="text" id="" class="gray readonly" name="" placeholder="" value="20220519123789" autocomplete="off">
                    </div>
                </dd>
            </dl>
            <dl class="w27">
                <dt>처리상태</dt>
                <dd>
                    <div class="input_line w30">
                        <select id="" class="readonly" name="">
                            <option value="" selected>접수</option>
                            <option value="">마감</option>
                        </select>
                    </div>
                </dd>
            </dl>
            <dl class="w27">
                <dt class="impt">거래처</dt>
                <dd>
                    <div class="input_line w60">
                        <!-- <input type="text" id="biz_list" name="" placeholder="" autocomplete="off"> -->
                        <select id="biz_list" style="width: 200px"> 
                            <option value="">거래처_선택</option> 
                            <option value="allips">올립스</option> 
                            <option value="this">디스모먼트</option> 
                            <option value="naver">네이버</option> 
                        </select>
                    </div>
                    <!-- <button type="button">검색</button> -->
                </dd>
            </dl>
            <dl class="w27">
                <dt>전화번호</dt>
                <dd>
                    <div class="input_line w60">
                        <input type="text" id="" class="gray readonly" name="" value="051-123-4567" autocomplete="off">
                    </div>
                </dd>
            </dl>
            <dl class="w27">
                <dt>업체구분</dt>
                <dd>
                    <div class="input_line w60">
                        <select id="" class="readonly" name="">
                            <option value="">매입처</option>
                        </select>
                    </div>
                </dd>
            </dl>
            <dl class="w27">
                <dt>대표자명</dt>
                <dd>
                    <div class="input_line w60">
                        <input type="text" id="" class="gray readonly" name="" value="홍길동" autocomplete="off">
                    </div>
                </dd>
            </dl>
            <dl class="w27">
                <dt>대표자 연락처</dt>
                <dd>
                    <div class="input_line w60">
                        <input type="text" id="" class="gray readonly" name="" value="010-1234-5678" autocomplete="off">
                    </div>
                </dd>
            </dl>
            <dl class="w27">
                <dt>부가세</dt>
                <dd>
                    <div class="input_line w60">
                        <select id="" name="">
                            <option value="N">별도</option>
                            <option value="Y">포함</option>
                        </select>
                    </div>
                </dd>
            </dl>
            <dl class="w100">
                <dt>비고</dt>
                <dd>
                    <div class="input_line w50">
                        <input type="text" id="" name="" placeholder="" autocomplete="off">
                    </div>
                </dd>
            </dl>
        </div>
    </div>
	
	<div class="bottom">
		<div class="list_zone section">
			<h4>구매 발주 리스트</h4>
			<!-- <div class="btns">
				<button type="button" class="blue btn_add">제품 추가</button>
			</div> -->
			<div class="n-scroll">
				<table>
					<thead>
						<tr>
                            <th class="w5">
                                <input type="checkbox" id="chk_all" name="chk_all">
                                <label for="chk_all"></label>
                            </th>
                            <th>품목명</th>
                            <th class="w8">품목코드</th>
                            <th class="w8">규격(단위)</th>
                            <th class="w8">매입단가(원)</th>
                            <th class="w7">발주수량</th>
                            <th class="w8">금액(원)</th>
                            <th class="w8">세액(원)</th>
                            <th>비고</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="h-scroll mCustomScrollbar">
				<table id="" class="">
					<tbody>
                        <tr>
                            <td class="w5">
                                <input type="checkbox" id="check01" name="chk01">
                                <label for="check01"></label>
                            </td>
                            <td>
                                <select class="item_list"> 
                                    <option value="">제품_선택</option> 
                                    <option value="">멍게젓갈</option> 
                                    <option value="">양념젓갈</option> 
                                    <option value="">고추가루</option> 
                                </select>
                                <!-- <input type="text" class="w70" autocomplete="off">
                                <button type="button"style="margin-left:10px">선택</button> -->
                            </td>
                            <td class="w8">
                                KR05B00001
                            </td>
                            <td class="w8">
                                100 kg
                            </td>
                            <td class="w8">
                                5,500
                            </td>
                            <td class="w7 spindd">
                                <div class="spin">
                                    <span class="spinner">
                                        <input type="number" min="0" max="100" id="" name="" value="0" maxlength="2" autocomplete="off">
                                    </span>
                                </div>
                            </td>
                            <td class="w8">
                                <input type="text" class="T-right gray readonly" value="5,500">
                            </td>
                            <td class="w8">
                                <input type="text" class="T-right gray readonly" value="550">
                            </td>
                            <td>
                                <input type="text" class="w100 T-left" autocomplete="off">
                            </td>
                        </tr>
                        <tr>
                            <td class="w5">
                                <input type="checkbox" id="check02" name="chk02">
                                <label for="check02"></label>
                            </td>
                            <td>
                                <select class="item_list"> 
                                    <option value="">제품_선택</option> 
                                    <option value="">멍게젓갈</option> 
                                    <option value="">양념젓갈</option> 
                                    <option value="">고추가루</option> 
                                </select>
                                <!-- <input type="text" class="w70" autocomplete="off">
                                <button type="button"style="margin-left:10px">선택</button> -->
                            </td>
                            <td class="w8">
                                KR05B00001
                            </td>
                            <td class="w7">
                                100 kg
                            </td>
                            <td class="w6">
                                5,500
                            </td>
                            <td class="w7 spindd">
                                <div class="spin">
                                    <span class="spinner">
                                        <input type="number" min="0" max="100" id="" name="" value="0" maxlength="2" autocomplete="off">
                                    </span>
                                </div>
                            </td>
                            <td class="w7">
                                <input type="text" class="T-right gray readonly" value="5,500">
                            </td>
                            <td class="w7">
                                <input type="text" class="T-right gray readonly" value="550">
                            </td>
                            <td>
                                <input type="text" class="w100 T-left" autocomplete="off">
                            </td>
                        </tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
    <div class="total">
        <ul>
            <li class="T-right blue">합 계 : <strong>0</strong><span>원</span></li>
            <li class="T-right">총 제품수: <strong id="list_cnt">2</strong><span>개</span></li>
        </ul>
    </div>
    <div class="btn_wrap">
        <button type="button" class="gray" onclick="location.href='/ord/ord_buy'">목록</button>
        <button type="button" class="blue">반품접수</button>
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

<script>
(function($) {
	$.fn.spinner = function() {
		this.each(function(i) {
            var i = i+1;
			var el = $(this);

			// add elements
			el.wrap('<span class="spinner"></span>');     
			el.before('<span class="sub" id="sub_"+i+"" data-ikey=""+i+"">-</span>');
			el.after('<span class="add" id="add_"+i+"" data-ikey=""+i+"">+</span>');

			// substract
			el.parent().on("click", ".sub", function () {
				if (el.val() > parseInt(el.attr("min")))
					el.val( function(i, oldval) { return --oldval; });
			});

			// increment
			el.parent().on("click", ".add", function () {
				if (el.val() < parseInt(el.attr("max")))
					el.val( function(i, oldval) { return ++oldval; });
			});
	    });
	};
})(jQuery);
$(".spin input[type=number]").spinner();
</script>
<script>
/** 전체 checkbox on/off */
 $('#chk_all').off().click(function(){
        if($('input:checkbox[id="chk_all"]').is(':checked') == true){
            $("input[type=checkbox]").prop("checked", true);
            $("input[type=checkbox]").parents('tr').addClass('active');
            $("input[type=checkbox]").parents('tr').next().addClass('active');
        }else{
            $("input[type=checkbox]").prop("checked", false); 
            $("input[type=checkbox]").parents('tr').removeClass('active');
            $("input[type=checkbox]").parents('tr').next().removeClass('active');
        }
    });
    $('input[type=checkbox]').click(function(){
        if($(this).is(':checked') == true){
            $(this).parents('tr').addClass('active');
        }else{
            $(this).prop("checked",false);
            $(this).parents('tr').removeClass('active');
        }
    });
</script>