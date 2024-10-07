<?php // 생산 계획 수정 팝업 페이지 ?>
<div class="plan_mod_pop popup">
    <div class="title">생산 계획 수정
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <dl class="half">
            <dt>가용여부</dt>
            <dd>
                <input type="radio" id="use03" name="use02" checked>
                <label for="use03">사용</label>
                <input type="radio" id="use04" name="use02">
                <label for="use04">사용불가</label>
            </dd>
        </dl>
        <dl>
            <dt class="impt">워크센터명</dt>
            <dd>
                <div class="input_line w70">
                    <input type="text" autocomplete="off">
                </div>
            </dd>
        </dl>
        <dl class="select_day">
            <dt class="impt">근무요일지정</dt>
            <dd>
                <input type="checkbox" id="day01" name="day" checked>
                <label for="day01">월</label>
                <input type="checkbox" id="day02" name="day" checked>
                <label for="day02">화</label>
                <input type="checkbox" id="day03" name="day" checked>
                <label for="day03">수</label>
                <input type="checkbox" id="day04" name="day" checked>
                <label for="day04">목</label>
                <input type="checkbox" id="day05" name="day" checked>
                <label for="day05">금</label>
                <input type="checkbox" id="day06" name="day">
                <label for="day06">토</label>
                <input type="checkbox" id="day07" name="day">
                <label for="day07">일</label>
                <span>주 <strong>5</strong> 일 근무</span>
            </dd>
        </dl>
        <dl class="">
            <dt class="impt">일작업시간</dt>
            <dd>
                <div class="input_line w40">
                    <input type="text" autocomplete="off">
                </div>
            </dd>
        </dl>
        <dl>
            <dt class="impt">자재출고창고</dt>
            <dd>
                <div class="input_line w40">
                    <select name="" id="">
                        <option value="">자재창고</option>
                    </select>
                </div>
            </dd>
        </dl>
        <dl>
            <dt class="impt">생산입고창고</dt>
            <dd>
                <div class="input_line w40">
                    <select name="" id="">
                        <option value="">생산창고</option>
                    </select>
                </div>
            </dd>
        </dl>
        <dl>
            <dt class="impt">생산물량창고</dt>
            <dd>
                <div class="input_line w40">
                    <select name="" id="">
                        <option value="">생산창고</option>
                    </select>
                </div>
            </dd>
        </dl>
        <dl class=" bgo">
            <dt>비고</dt>
            <dd>
                <div class="input_line">
                    <textarea name="" id="" cols="30" rows="10"></textarea>
                </div>
            </dd>
        </dl>
        <p class='imptp'><span>*</span> 은 필수 입력 항목입니다.</p>
    </div>
    <div class="btn_wrap">
        <button class="gray">취소</button>
        <button class="blue">수정</button>
    </div>
</div>
<script>
    $('.planmod_btn').click (function(){
        $('.plan_mod_pop').bPopup({
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
	$(".input_line textarea").focus(function(){
		$(this).parent().addClass("active");
	});
	$(".input_line textarea").blur(function(){
		$(this).parent().removeClass("active");
	});
</script>
