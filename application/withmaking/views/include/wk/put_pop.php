<?php // 입고 등록 팝업 페이지 ?>
<style>
    .inp_gray {
        background-color: #f5f5f8 !important;
    }
    input.datepicker{background-color:#f5f5f8}
</style>
<div class="popup put_pop">
    <div class="title">입고 작업 관리
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <div class="top">
            <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
            <h4>입고 기본 정보</h4>
            <dl>
                <dt class="impt">입고일</dt>
                <dd class="w23">
                    <input type="text" class="datepicker w33">
                </dd>
                <dt class="">입고번호</dt>
                <dd class="w15">
                    <div class="input_line w80">
                        <input type="text" class="gray">
                    </div>
                </dd>
            </dl>
            <dl style="margin-top:10px">
                <dt class="">거래처</dt>
                <dd class="w23">
                    <div class="input_line w80">
                        <input type="text" class="gray">
                    </div>
                </dd>
                <dt class="">담당자</dt>
                <dd class="w15">
                    <div class="input_line w60">
                        <input type="text" class="gray">
                    </div>
                </dd>
                <dt class="">전화번호</dt>
                <dd class="w15">
                    <div class="input_line w80">
                        <input type="text" class="gray">
                    </div>
                </dd>
            </dl>
        </div>
        <div class="bottom">
            <h4>리스트</h4>
            <div class="n-scroll">
                <table>
                    <thead>
                        <tr>
                            <th class="w4">
                                <input type="checkbox" id="chk_all" name="chk">
                                <label for="chk_all"></label>
                            </th>
                            <th class="">제품명</th>
                            <th class="w8">규격(단위)</th>
                            <th class="w8">발주수량</th>
                            <th class="w8">누적입고량</th>
                            <th class="w10">입고창고</th>
                            <th class="w10">유통기한</th>
                            <th class="w8">입고수량</th>
                            <th>비고</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="h-scroll custom-scroll">
                <table>
                    <tbody>
                        <tr>
                            <td class="w4">
                                <input type="checkbox" id="chk01" name="chk01">
                                <label for="chk01"></label>
                            </td>
                            <td>
                                고추장 100g
                            </td>
                            <td class="w8">
                                1 EA
                            </td>
                            <td class="w8">
                                50
                            </td>
                            <td class="w8">
                                20
                            </td>
                            <td class="w10">
                                <select>
                                    <option>창고1구역</option>
                                    <option>창고2구역</option>
                                    <option>창고3구역</option>
                                </select>
                            </td>
                            <td class="w10">
                                <input type="text" class="datepicker T-left w70">
                            </td>
                            <td class="w8 spindd">
                                <div class="spin">
                                    <span class="spinner">
                                        <input type="number" min="0" max="100" id="" name="" value="30" maxlength="2" autocomplete="off"
                                        title="발주량만큼 입고 가능하니 참고 바랍니다.">
                                    </span>
                                </div>
                            </td>
                            <td>
                                <input type="text" class="w100 T-left" autocomplete="off">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="btn_wrap">
            <button class="gray">목록</button>
            <button class="blue" id="btn_test">입고 완료</button>
        </div>
    </div>
</div>
<script>
    $('.addput_btn').click (function(){
        $('.put_pop').bPopup({
          modalClose: true
          , opacity: 0.8
          , positionStyle: 'absolute' 
          , speed: 300
          , transition: 'fadeIn'
          , transitionClose: 'fadeOut'
          , zIndex : 99997
            //, modalColor:'transparent' 
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
    $(function () {

        // 테스트 버튼
        $("#btn_test").off().click(function () { 
            var con = confirm('입고 등록 하시겠습니까?');
            if (con) 
            {
                alert('입고 등록 완료되었습니다');
                location.href='/pr/inout_li';
            }
        });
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
$(".put_pop .spin input[type=number]").spinner();
</script>
<script>
	$(function() {
		$(".custom-scroll").mCustomScrollbar({
		});
	});
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