/*================================================================================
 * @name: 황호진 - ord_reg_popup.js	제품추가 팝업 공통부분
 * @version: 1.0.0, @date: 2021-11-24
 ================================================================================*/
//전역변수 선언
var g_bunhal_flag = true;	// 분할상세보기 플래그 값
var g_color_flag = true;	// 색상상세보기 플래그 값

$(function () {

	/**
	 * @description 제품팝업 열기 위한 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022/03/04
	 */
	$('.new_add').click(function () {
		var rec_gb = $('#rec_gb').val();
		if(rec_gb === 'F'){
			open_ord_popup();	//주문팝업 열기
		}
	});

	/**
	 * @description 제품검색하는 input 태그 키보드 이벤트 걸기
	 * @author 황호진  @version 1.0, @last update 2022/03/11
	 */
	$("#item_sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			var search_data = {
				s 		: 't',
				item_sc : $("#item_sc").val(),		//검색어
				cust_cd : $("#cust_cd").val(),		//부모창에서 선택된 거래처코드
			};
			get_item_list(search_data);				//리스트 호출
		}
	});

	/**
	 * @description 숫자 입력 제한 걸기 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/03/10
	 */
	$('.division_w_class , .division_h_class , ' +					//분할가로 , 분할세로
		'#blind_left_qty , #blind_right_qty , #blind_qty ,' +		//블라인드 좌 우 , 블라인드 분할 수량
		'#curtain_acn , #curtain_qty , #curtain_inside_acn ,' +		//커튼 단위자동계산 , 수량 , 안쪽 수치
		'#ea_qty ,' +												//EA 수량
		'input[name=update_amt]').on('input' ,function () {			//금액조정
		$(this).val($(this).val().replace(/[^0-9.]/gi,""));
	});

	/**
	 * @description 금액조정 단위 변경 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/03/15
	 */
	$('select[name=update_unit]').on('change' , function () {
		var v = $(this).val();
		if(v === '%'){	//금액조정 단위가 % 일 경우에는 수치를 다시 입력받도록 금액란 초기화
			$('input[name=update_amt]').val('');
		}
		//단위
		var unit = $('.common_unit').val();
		//검사 - 정리 - 계산 - 설정
		manage_data(unit);
	});

	/**
	 * @description ord_width , ord_height 부분이 입력되면 같은 name에 그값 설정
	 * @author 황호진  @version 1.0, @last update 2022/03/04
	 */
	$(".ord_width , .ord_height").on('input , focusout' , function () {
		var unit = $('.common_unit').val();
		var name = $(this).attr('name');
		var v = $(this).val().replace(/[^0-9.]/gi,"");

		if(v > 0){	//v가 0보다 큰 값일때
			$('input[name='+name+']').val(v).prev().addClass('active');
			if(unit === '001' || unit === '002') {	//선택된 주문의 폼 단위가 회베 , m2 일경우!
				if (name === 'ord_height') {
					$('.division_h_class').val(v).prev().addClass('active');
					//분할
					var division = $('#blind_division').val();
					if(division > 1){	//분할이 있을 경우
						for(var i = 1; i <= division; i++){
							//분할에 따른 회베 계산
							$('#div_hebe'+i).val(hebe_clac(i));
						}
					}
				}
			}else if(unit === '006'){	//선택된 주문의 폼 단위가 야드 일 경우!
				if (name === 'ord_width') {
					//자동 계산 => 야드
					$("#curtain_acn").val(indi_yard({
						width 	: v,							//가로길이
						usage	: $("#curtain_usage").val(),	//원단사용량
						size	: $(".common_size").val(),		//판매규격(통합제품등록에서 등록된 기본 사이즈)
						los		: $("#curtain_los").val()		//추가길이 60으로 설정
					})).prev().addClass('active');
				}
			}else if(unit === '007'){	//선택된 주문의 폼 단위가 폭 일 경우!
				if (name === 'ord_width') {
					//자동 계산 => 폭
					$("#curtain_acn").val(indi_pok({
						width 		: v,							//가로길이
						usage		: $("#curtain_usage").val(),	//원단사용량
						size		: $(".common_size").val(),		//판매규격(통합제품등록에서 등록된 가본 사이즈)
						los			: $("#curtain_los").val(),		//추가길이 60으로 설정
						width_len	: $("#curtain_width_len").val()	//폭 규격(통합제품등록에서 등록된 폭 규격)
					})).prev().addClass('active');
				}
			}
		}else{		//v가 0일때
			$('input[name='+name+']').val('').prev().removeClass('active');
			if(unit === '001' || unit === '002') {	//선택된 주문의 폼 단위가 회베 , m2 일경우!
				if (name === 'ord_height') {
					$('.division_h_class').val('').prev().removeClass('active');
				}
			}else if(unit === '006' || unit === '007'){	//선택된 주문의 폼 단위가 야드 일 경우!
				if (name === 'ord_width') {
					//빈값 설정
					$("#curtain_acn").val('').prev().removeClass('active');
				}
			}
		}

		//검사 - 정리 - 계산 - 설정
		manage_data(unit);
	});

	/**
	 * @description 분할 select box 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022/03/04
	 */
	$("#blind_division").on('change' , function () {
		$('.bu_num').hide();
		var division = $(this).val();
		if(division > 1){	//division값이 2이상인 경우 분할이라는 의미!
			//입력된 세로길이 값 구하기
			var ord_height = $('input[name=ord_height]').val();
			for(var i = 0; i < division; i++){
				$('.bu_num').eq(i).show();
				if(ord_height > 0){	//입력된 세로길이 값이 0보다 클시 분할 세로에 설정(가로는 설정할 필요 없음)
					$('#div_height'+(i+1)).val(ord_height).prev().addClass('active');
				}
				$('#div_hebe'+(i+1)).val(hebe_clac((i+1)));
			}

			//수량 1 자동 설정
			$('#blind_qty').val(1).prev().addClass('active');

			$('#pre_division').hide();		//분할X UI 가림처리
			$('#post_division').show();		//분할O UI 보임처리
		}else{	//division값이 1이면은 분할이 아니라는 의미
			$('#pre_division').show();		//분할X UI 보임처리
			$('#post_division').hide();		//분할O UI 가림처리
		}

		var unit = $('.common_unit').val();
		//검사 - 정리 - 계산 - 설정
		manage_data(unit);
	});

	/**
	 * @description 분할 가로길이에 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022/03/04
	 */
	$(".division_w_class").on('input , focusout' , function () {
		var division = $('#blind_division').val();
		if(division > 1){
			var sum = 0;
			for(var i = 0; i < division; i++){
				sum += Number($(".division_w_class").eq(i).val());
			}
			if(sum > 0){	//sum값이 0보다 클때!
				$('.ord_width').val((Math.round(sum * 10) / 10)).prev().addClass('active');
			}else{	//sum값이 0일때! 아에 입력이 안된경우
				$('.ord_width').val('').prev().removeClass('active');
			}
		}
		//변경된 분할칸이 어디있는지 구분하기 위한 data_num
		var num = $(this).attr('data-num');
		var hebe = hebe_clac(num);
		$('#div_hebe'+num).val(hebe);

		var unit = $('.common_unit').val();
		//검사 - 정리 - 계산 - 설정
		manage_data(unit);
	});

	/**
	 * @description 분할 세로길이에 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022/03/04
	 */
	$(".division_h_class").on('input , focusout' , function () {
		var v = $(this).val();
		if(v > 0){	//v값이 0보다 큰 값일때!
			$('.ord_height').val(v).prev().addClass('active');
			$('.division_h_class').val(v).prev().addClass('active');
		}else{	//v값이 0일때! 아에 입력이 안된경우
			$('.ord_height').val('').prev().removeClass('active');
			$('.division_h_class').val('').prev().removeClass('active');
		}
		//세로길이가 변경되면 모든 세로길이의 회배값을 재계산
		var division = $("#blind_division").val();
		for(var i = 1; i <= division; i++){
			$('#div_hebe'+i).val(hebe_clac(i));
		}

		var unit = $('.common_unit').val();
		//검사 - 정리 - 계산 - 설정
		manage_data(unit);
	});

	/**
	 * @description #blind_left_qty , #blind_right_qty , #blind_qty	블라인드용 분할(X) 좌우 / 분할(O) 수량 이벤트 걸기
	 *              #curtain_acn , #curtain_qty 					커튼용 자동계산 단위 , 수량 이벤트 걸기
	 *              input[name=update_amt] 							모든 주문폼의 금액조정 이벤트 걸기
	 * @author 황호진  @version 1.0, @last update 2022/03/11
	 */
	$('#blind_left_qty , #blind_right_qty , #blind_qty , #curtain_acn , #curtain_qty , input[name=update_amt]').on('input , focusout' , function () {
		var unit = $('.common_unit').val();
		//검사 - 정리 - 계산 - 설정
		manage_data(unit);
	});

	/**
	 * @description 주문폼 완료버튼 이벤트 걸기
	 * @author 황호진  @version 1.0, @last update 2022/03/11
	 */
	$("#btn_add_ord").on('click' , function () {
		var unit = $('.common_unit').val();
		if(unit !== ""){	//단위가 있어야 완료 가능!
			//주문폼 입력값 검증로직
			if(ord_reg_insp(unit)){
				var con = confirm('제품 등록하시겠습니까?');		//확인창
				if(con){
					ord_reg_comp(unit , 'A');		//완료 함수
				}
			}
		}
	});

	/**
	 * @description 제품추가 팝업 옵션 이벤트 연동! 선택된 옵션명을 금액란에 설정
	 * @author 황호진  @version 1.0, @last update 2022/03/14
	 */
	$("select[name='option1'] , select[name='option2']").on('change' , function () {
		var n = $(this).attr('name');	//this name 속성
		var v = $(this).val();			//this val 값
		if(v !== ''){
			var t = $(this).find('option:selected').text();	//선택된 옵션명
			if(n === 'option1'){		//option1
				$("#priz_op1_nm").html(t+' 옵션');
			}else{						//option2
				$("#priz_op2_nm").html(t+' 옵션');
			}
		}else{
			if(n === 'option1'){		//option1
				$("#priz_op1_nm").html('');
			}else{						//option2
				$("#priz_op2_nm").html('');
			}
		}

		//단위 값 가져오기
		var unit = $('.common_unit').val();
		//검사 - 정리 - 계산 - 설정
		manage_data(unit);
	});

	/**
	 * @description 커튼 주문폼 형상선택 select box 이벤트 걸기
	 * @author 황호진  @version 1.0, @last update 2022/03/15
	 */
	$("#curtain_base_st").on('change' , function () {
		//단위 값 가져오기
		var unit = $('.common_unit').val();
		//검사 - 정리 - 계산 - 설정
		manage_data(unit);
	});

	/**
	 * @description 커튼 주문폼 색상추가 이벤트 걸기!
	 * @author 황호진  @version 1.0, @last update 2022/03/15
	 */
	$("#curtain_color").on('change' , function () {
		var v = $(this).val();
		var inside_str = '<option value="">색상_없음</option>';
		if(v === 'two'){
			var url = '/ord/ord_reg_pop/curtain_color_two_tone';
			var type = 'GET';
			var data = {
				color_nm	: $('#curtain_outside_color').val(),
				item_cd		: $('.common_item_cd').val()
			};
			fnc_ajax(url , type , data)
				.done(function (res) {
					//기둥 단위 초기화
					$('#curtain_outside_acn').val('');

					$.each(res.data , function (i , list) {
						inside_str += '<option value="'+ list.color +'">'+ list.color +'</option>';
					});
					//안쪽 색상 설정
					$('#curtain_inside_color').html(inside_str);
					//안쪽 단위 초기화
					$('#curtain_inside_acn').val('');

					$('.two_tone').show();
				}).fail(fnc_ajax_fail);
		}else{

			//기둥 단위 초기화
			$('#curtain_outside_acn').val('');
			//안쪽 색상 초기화
			$('#curtain_inside_color').html(inside_str);
			//안쪽 단위 초기화
			$('#curtain_inside_acn').val('');
			$('.two_tone').hide();
		}
	});

	/**
	 * @description 커튼 주문폼 안쪽(모이는 방향) 단위 수치 입력시 포커스 아웃 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/03/16
	 */
	$("#curtain_inside_acn").on('focusout' , function () {
		var v = $(this).val();
		//자동계산!
		var curtain_acn = Number($("#curtain_acn").val());

		if(v > curtain_acn){
			//기둥 단위 수치 설정
			$('#curtain_outside_acn').val(0).prev().addClass('active');
			//안쪽 단위 수치 설정
			$('#curtain_inside_acn').val(curtain_acn);
		}else{
			//기둥 단위 수치 설정
			var outside_acn = Math.round(Math.abs(v - curtain_acn) * 10) / 10;
			$('#curtain_outside_acn').val(outside_acn).prev().addClass('active');
			//안쪽 단위 수치 설정
			$('#curtain_inside_acn').val(v);
		}
	});

	/**
	 * @description 커튼 주문폼 원단 사용량 변경 이벤트 걸기
	 * @author 황호진  @version 1.0, @last update 2022/03/16
	 */
	$("#curtain_usage").on('change' , function () {
		var width = Number($('.ord_width').val());
		//단위 값 가져오기
		var unit = $('.common_unit').val();
		if(width > 0){
			if(unit === '006'){			//야드
				//자동 계산 => 야드
				$("#curtain_acn").val(indi_yard({
					width 	: width,					//가로길이
					usage	: $(this).val(),			//원단사용량
					size	: $(".common_size").val(),	//판매규격
					los		: $("#curtain_los").val()	//추가길이 60으로 설정
				})).prev().addClass('active');
			}else if(unit === '007'){	//폭
				//자동 계산 => 폭
				$("#curtain_acn").val(indi_pok({
					width 		: width,						//가로길이
					usage		: $("#curtain_usage").val(),	//원단사용량
					size		: $(".common_size").val(),		//판매규격
					los			: $("#curtain_los").val(),		//추가길이 60으로 설정
					width_len	: $("#curtain_width_len").val()	//폭 규격
				})).prev().addClass('active');
			}
		}else{
			//빈값 설정
			$("#curtain_acn").val('').prev().removeClass('active');
		}
		//검사 - 정리 - 계산 - 설정
		manage_data(unit);
	});

	/**
	 * @description 주문폼 수정버튼
	 * @author 황호진  @version 1.0, @last update 2022/03/22
	 */
	$("#btn_upd_ord").on('click' , function () {
		var unit = $('.common_unit').val();
		if(unit !== ""){
			//주문폼 입력값 검증로직
			if(ord_reg_insp(unit)){
				var con = confirm('제품 수정하시겠습니까?');
				if(con){
					ord_reg_mod(unit , 'A');	//수정완료
				}
			}
		}
	});

	/**
	 * @description 동일제품 재주문 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/03/22
	 */
	$("#btn_re_ord").on('click' , function () {
		var unit = $('.common_unit').val();
		if(unit !== ""){
			//주문폼 입력값 검증로직
			if(ord_reg_insp(unit)){
				var gb = $('.common_ord_seq').val();
				var con;
				if(gb === ''){
					con = confirm('제품 등록하시겠습니까?');
					if(con){
						//button_type이 A , B로 나뉘며 A 는 팝업 닫기 주문완료! B는 동일제품 재주문!
						ord_reg_comp(unit , 'B');
					}
				}else {
					con = confirm('제품 수정하시겠습니까?');
					if(con){
						//button_type이 A , B로 나뉘며 A 는 팝업 닫기 주문완료! B는 동일제품 재주문!
						ord_reg_mod(unit , 'B');
					}
				}
			}
		}
	});

	/**
	 * @description 위치는 폼마다 동일값 유지하기
	 * @author 황호진  @version 1.0, @last update 2022/03/25
	 */
	$("#ea_qty").on('input , focusout' , function () {
		var unit = $('.common_unit').val();
		//검사 - 정리 - 계산 - 설정
		manage_data(unit);
	});

	/**
	 * @description 위치는 폼마다 동일값 유지하기
	 * @author 황호진  @version 1.0, @last update 2022/03/25
	 */
	$(".common_place").on('input , focusout' , function () {
		var v = $(this).val();
		if(v !== ''){
			$(".common_place").val(v).prev().addClass('active');
		}else{
			$(".common_place").val(v).prev().removeClass('active');
		}
	});
});

/**
 * @description 검사 - 정리 - 계산 - 설정
 * @author 황호진  @version 1.0, @last update 2022/03/15
 */
function manage_data(unit) {
	//계산식 태우기 전 검사작업
	var calc_f = calc_flag(unit);
	if(calc_f){
		let sale_data = calc_process(unit , 'sale');
		let buy_data = calc_process(unit , 'buy');
		console.log(buy_data);
		if(unit === '001' || unit === '002'){	//선택된 주문의 폼이 회배나 m2 일 경우!
			apply_amt(m2_calculation(sale_data),unit);
			buy_amt_set(m2_calculation(buy_data));
		}else if(unit === '005'){				//선택된 주문의 폼이 EA일 경우!
			apply_amt(ex_calculation(sale_data),unit);
			buy_amt_set(ex_calculation(buy_data));
		}else if(unit === '006'){				//선택된 주문의 폼이 야드일 경우!
			apply_amt(yard_calculation(sale_data),unit);
			buy_amt_set(yard_calculation(buy_data));
		}else if(unit === '007'){				//선택된 주문의 폼이 폭일 경우!
			apply_amt(pok_calculation(sale_data),unit);
			buy_amt_set(pok_calculation(buy_data));
		}
	}else{
		if(unit === '001' || unit === '002'){
			$('#priz_unit_hebe').html('0').parent().parent().show();	//회배 초기화
			$('#priz_unit_yard').html('0').parent().parent().hide();	//야드 초기화 및 숨김처리
			$('#priz_unit_pok').html('0').parent().parent().hide();		//폭 초기화 및 숨김처리
			$('#priz_unit_ea').html('0').parent().parent().hide();		//EA 초기화 및 숨김처리
		}else if(unit === '005'){
			$('#priz_unit_hebe').html('0').parent().parent().hide();	//회배 초기화 및 숨김처리
			$('#priz_unit_yard').html('0').parent().parent().hide();	//야드 초기화 및 숨김처리
			$('#priz_unit_pok').html('0').parent().parent().hide();		//폭 초기화 및 숨김처리
			$('#priz_unit_ea').html('0').parent().parent().show();		//EA 초기화
		}else if(unit === '006'){
			$('#priz_unit_hebe').html('0').parent().parent().hide();	//회배 초기화 및 숨김처리
			$('#priz_unit_yard').html('0').parent().parent().show();	//야드 초기화
			$('#priz_unit_pok').html('0').parent().parent().hide();		//폭 초기화 및 숨김처리
			$('#priz_unit_ea').html('0').parent().parent().hide();		//EA 초기화 및 숨김처리
		}else if(unit === '007'){
			$('#priz_unit_hebe').html('0').parent().parent().hide();	//회배 초기화 및 숨김처리
			$('#priz_unit_yard').html('0').parent().parent().hide();	//야드 초기화
			$('#priz_unit_pok').html('0').parent().parent().show();		//폭 초기화
			$('#priz_unit_ea').html('0').parent().parent().hide();		//EA 초기화 및 숨김처리
		}
		
		
		//공통부분
		$("#priz_prd_amt").html('0');			//제품 금액(세액 포함) 초기화
		$('#priz_base_amt').html('0').parent().parent().hide();		//형상금액 초기화 및 숨김처리
		$('#priz_height_amt').html('0').parent().parent().hide();	//세로길이 추가금액 초기화 및 숨김처리
		$("#priz_op1_amt").html('0').parent().parent().hide();		//옵션1 금액 초기화 및 숨김처리
		$("#priz_op2_amt").html('0').parent().parent().hide();		//옵션2 금액 초기화 및 숨김처리
		$("#priz_upd_unit").html('0').parent().parent().hide();		//금액조정 초기화 및 숨김처리
		$("#priz_ord_amt").html('0');			//총 금액 초기화(세액 미포함)
		$("#priz_tax_amt").html('0').parent().parent().hide();		//세액

		$("#ord_amt").val('');					//금액(hidden) 초기화
		$("#tax_amt").val('');					//세액(hidden) 초기화
	}
}

/**
 * @description 제품추가 팝업 열기
 * @author 황호진  @version 1.0, @last update 2022/03/14
 */
function open_ord_popup() {
	var cust_cd = $("#cust_cd").val();
	$(".common_cust_cd").val(cust_cd);
	$(".common_cust_nm").val($("#cust_nm").val());
	$("#btn_add_ord").show();
	$("#btn_upd_ord").hide();

	//제품 검색어 초기화
	$("#item_sc").val('');
	//제품선택 불러오기
	get_item_list({s : null , cust_cd : cust_cd});

	//제품정보 리셋
	$('#ref_item_nm').html('');		//제품명
	$('#ref_size_unit').html('');	//판매규격
	$('#ref_amt').html('');			//판매단가

	//폼 리셋
	$('#ord_blind_frm')[0].reset();		//블라인드
	$('#ord_curtain_frm')[0].reset();	//커튼
	$('#ord_ea_frm')[0].reset();		//EA

	//리셋이 안된 hidden 타입의 input 초기화
	$('.hidden_reset').val('');

	//active 제거(폼 체계가 바뀌더라도 이부분은 필수★★★★★)
	$('.new_ord input').prev().removeClass('active');

	//폼 조정
	$("#select_counter").show();	//단위가 선택되어 있지 않은 초기 화면
	$("#prd_space").hide();			//제품정보
	$("#blind_counter").hide();		//블라인드주문폼
	$("#curtain_counter").hide();	//커튼주문폼
	$("#ea_counter").hide();		//EA주문폼
	$("#price_zone_space").hide();	//금액란

	//폼 리셋에 따른 이벤트 호출
	$("#blind_division").trigger('change');

	$('.new_ord').bPopup({
		modalClose: true,
		opacity: 0.8,
		positionStyle: 'absolute',
		speed: 300,
		transition: 'fadeIn',
		transitionClose: 'fadeOut',
		zIndex: 99997
		//, modalColor:'transparent'
	});
}

/**
 * @description 제품리스트 조회
 * @author 황호진  @version 1.0, @last update 2022/03/04
 */
function get_item_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/ord/ord_reg_pop/get_item_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: false,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: false,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data의 데이터를 가지고 callback에서 작동
					var len = res.length;

					var str = '';
					if(len > 0){
						$.each(res, function (i , list) {
							str += '<tr class="tr selected_item" onclick=unfold_color("' + list.item_cd + '") id="' + list.item_cd + '" style="cursor: pointer;">';
							str += '<td>' + list.proc_gb + '</td>';
							str += '<td>' + list.item_lv + '</td>';
							str += '<td class="blue click_item">' + list.item_nm + '</td>';
							str += '<td>' + Number(list.size)+list.unit_nm + '</td>';
							str += '<td>' + commas(Number(list.amt)) + '</td>';
							str += '</tr>';
							str += '<tr class="hidden">';
							str += '<td colspan="5">';
							str += '<ul>';
							str += '</ul>';
							str += '</td>';
							str += '</tr>';
						});
						$("#item_list").html(str); // ajax data output
					}else{
						str = '<tr><td colspan="5">등록된 제품이 없습니다.</td></tr>';
						$("#item_list").html(str); // ajax data output
					}
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description 제품 클릭시 컬러 조회
 * @author 황호진  @version 1.0, @last update 2022/03/04
 */
function unfold_color(item_cd) {
	if($('#'+item_cd).next().css('display') === "none") {
		var url = '/ord/ord_reg_pop/unfold_color';
		var type = 'GET';
		var data = {
			item_cd: item_cd
		};
		fnc_ajax(url, type, data)
			.done(function (res) {
				var str = '';
				$.each(res.data, function (i, list) {
					//컬러 선택시 우측에 뿌리기 위한 인자값 설정
					var arg = encodeURIComponent(JSON.stringify({ ikey : list.ikey , item_cd : list.item_cd}));
					str += '<li>';
					str += '<input type="radio" id="chk'+list.ikey+'" name="chk" onclick=get_item_info("'+ arg +'")>';
					str += '<label for="chk'+list.ikey+'" class="chk'+list.ikey+'">'+ list.sub_nm_01 +'</label>';
					str += '</li>';
				});
				//컬러창 닫기
				$(".selected_item").removeClass('active').next().hide();
				
				//선택된 제품한해서 컬러창 열기
				$("#" + item_cd).next().find('ul').html(str);
				$("#" + item_cd).addClass('active').next().show();
			}).fail(fnc_ajax_fail);
	}else{
		//열려있는 제품을 눌렀을때 닫기처리
		$("#" + item_cd).removeClass('active').next().hide();
	}
}

/**
 * @description 컬러 클릭시 제품 상세정보 불러오기
 * @author 황호진  @version 1.0, @last update 2022/03/04
 */
function get_item_info(arg) {
	arg = JSON.parse(decodeURIComponent(arg));
	var url = '/ord/ord_reg_pop/get_item_info';
	var type = 'GET';
	var data = {
		ikey		: arg['ikey'],		//color ikey
		item_cd 	: arg['item_cd'],	//item_cd
		cust_cd		: $(".common_cust_cd").val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var info = res.data.info;		//제품->컬러에 대한 정보
			var option = res.data.option;	//키워드에 따른 옵션 정보

			//제품명 설정
			$("#ref_item_nm").html(info.item_nm);
			//단위 설정
			if(info.unit === '001' || info.unit === '002'){
				$("#ref_size_unit").html(Number(info.size).toFixed(1)+info.unit_nm);
			}else{
				$("#ref_size_unit").html(Number(info.size)+info.unit_nm);
			}
			//판매단가 설정
			$("#ref_amt").html(commas(Number(info.amt))+'원');
			

			$("#select_counter").hide();	//제품선택 안내창 비활성화
			$("#prd_space").show();			//제품정보 활성화
			$("#price_zone_space").show();	//금액 활성화

			$('.more_hidden').hide();	//더보기 닫기

			//공통변수 설정
			var common_field = {
				'common_item_cd' : info.item_cd, 'common_item_nm' : info.item_nm , 'common_buy_cd' : info.buy_cd ,
				'common_size' : info.size , 'common_unit' : info.unit , 'common_amt' : Number(info.amt) ,
				'common_proc_gb' : info.proc_gb , 'common_pd_cd' : info.pd_cd , 'common_item_lv' : info.item_lv ,
				'common_item_lv_nm' : info.item_lv_nm , 'common_item_gb' : info.item_gb , 'common_work_gb' : info.work_gb ,
				'common_sub_local_cd' : info.sub_local_cd , 'common_unit_amt' : info.unit_amt
			};
			// /public/js/dev/common.js의 process 함수
			process(common_field , 'cval');

			//옵션 설정
			option_setting('옵션 선택','option1',option);
			option_setting('옵션 선택','option2',option);

			//초기화 부분 - input 편! class로 묶어서 한번에 처리
			$(".input_reset").val('').prev().removeClass('active');

			//금액조정 초기화
			$("select[name=update_unit] option:eq(1)").prop("selected", true);

			//초기화 부분 - select box 편! id를 모아서 처리하기
			var select_reset_list = ['blind_handle' , 'blind_len'];
			for(var i = 0 ; i < select_reset_list.length; i++){
				$("#"+select_reset_list[i]+" option:eq(0)").prop("selected", true).trigger('change');
			}

			var spec = JSON.parse(info.spec);
			
			if(info.unit === '001' || info.unit === '002'){ //회베 or ㎡ 일 경우
				//블라인드에서 사용중인 제한수치
				$("#blind_min_width").val(spec['min_width']);	//최소 가로
				$("#blind_min_height").val(spec['min_height']);	//최소 세로
				$("#blind_max_width").val(spec['max_width']);	//최대 가로
				$("#blind_max_height").val(spec['max_height']);	//최대 세로

				$('#blind_division').trigger('change');

				//폼 보여주기
				$("#blind_counter").show();		//블라인드폼 활성화
				$("#curtain_counter").hide();	//커튼폼 비활성화
				$("#ea_counter").hide();		//EA폼 비활성화
			}else if(info.unit === '006' || info.unit === '007'){	//야드 or 폭 일 경우
				//색상 설정
				$("#curtain_outside_color").val(info.color_nm);

				//기본설정
				$("#curtain_work_way").val(spec['work_way']);	//가공방법(평주름 , 나비주름)
				$("#curtain_usage").val(spec['usage']);		//추천원단사용량(1.0 ~ 3.0)
				$("#curtain_base_st").val(spec['base_st']);	//기본형상(Y,N)
				$("#curtain_div_gb").val(spec['div_gb']);	//분할방법(양개,편개)

				//야드 , 폭 공통부분
				$("#curtain_max_width").val(spec['max_width']);		//한계 가로치수
				$("#curtain_max_height").val(spec['max_height']);	//한계 세로치수
				$("#curtain_base_amt").val(spec['base_amt']);		//형상금액
				$("#curtain_purc_base_amt").val(spec['purc_base_amt']);

				if(info.unit === '006'){
					$('.curtain_unit_nm').html('야드');	//단위명 설정
				}else if(info.unit === '007'){
					$('.curtain_unit_nm').html('폭');	//단위명 설정

					$("#curtain_width_len").val(spec['width_len']);		//원단 폭 규격
					$("#curtain_height_len").val(spec['height_len']);	//세로길이 제한
					$("#curtain_height_unit").val(spec['height_unit']);	//세로길이 제한단위
					$("#curtain_height_op1").val(spec['height_op1']);	//세로길이 cm당
					$("#curtain_height_op2").val(spec['height_op2']);	//세로길이 %
				}
				//수량 1로 자동 설정 - 사장님 요청 2022-03-23
				$('#curtain_qty').val(1).prev().addClass('active');

				//트리거 - 가로 수치가 입력되어 있을때 폭,야드 계산하여 보여주기
				$(".ord_width").trigger('input');
				//트리거 - 원톤 선택으로 바꾼 후 이벤트 발생
				$("#curtain_color").val('one').trigger('change');

				//폼 보여주기
				$("#blind_counter").hide();		//블라인드 비활성화
				$("#curtain_counter").show();	//커튼 활성화
				$("#ea_counter").hide();		//EA 비활성화
			}else if(info.unit === '005' || info.unit === '011'){	//EA or Box 일 경우
				//폼 보여주기
				$("#blind_counter").hide();		//블라인드 비활성화
				$("#curtain_counter").hide();	//커튼 비활성화
				$("#ea_counter").show();		//EA 활성화

				$("#ea_min_qty").val(spec['min_qty']);	//최소 주문 수량

				//수량 1로 자동 설정 - 사장님 요청 2022-03-23
				$('#ea_qty').val(1).trigger('input').prev().addClass('active');
			}

		}).fail(fnc_ajax_fail);
}

/**
 * @description option setting
 * @author 황호진  @version 1.0, @last update 2022-03-04
 */
function option_setting(initial_val , name , data) {
	var str = '<option value="">'+initial_val+'</option>';	//초기 설정 값
	$.each(data, function (i, list) {	//data에 들어있는 값을 반복문으로 돌려서 설정
		str += '<option value="'+list.key_name+'" data-amt="'+Number(list.unit_amt)+'" data-unit="'+list.unit+'" data-unitnm="'+list.unit_nm+'">'+list.op_name+'</option>';
	});
	$("select[name='"+name+"']").html(str);	//name이라는 타겟에 html 설정
}

/**
 * @description 회배 계산
 * @author 황호진  @version 1.0, @last update 2022-03-10
 */
function hebe_clac(num) {
	var size = $('.common_size').val();
	var width , height;
	if(num === '0'){	//0은 분할X
		width = Number($('input[name=ord_width]').val());
		height = Number($('input[name=ord_height]').val());
	}else{				//1 ~ 10 해당 분할의 번호
		width = Number($('#div_width'+num).val());
		height = Number($('#div_height'+num).val());
	}

	var min_width = $("#blind_min_width").val();	//최소 가로 길이
	var min_height = $("#blind_min_height").val();	//최소 세로 길이

	//최소금액치수의 가로 길이값 비교 작업
	if(min_width !== ""){
		// 가로 < 최소가로 ? 최소가로 : 가로
		width = width < min_width ? min_width : width;
	}

	//최소금액치수의 세로 길이값 비교 작업
	if(min_height !== ""){
		// 세로 < 최소세로 ? 최소세로 : 세로
		height = height < min_height ? min_height : height;
	}

	if(width === 0 || height ===0){	// 설정된 가로 , 세로 중 하나라도 0일 경우 회배는 0
		return 0;
	}else{
		var data = {
			size 	: size,		//판매규격
			width 	: width,	//가로
			height 	: height	//세로
		};
		return indi_hebe(data);
	}
}

/**
 * @description 주문금액 계산전에 선택된 폼이 무엇인지 판별한 후 필수 입력창에 값이 입력되어 있는지 확인하는 flag 함수
 * @author 황호진  @version 1.0, @last update 2022/03/10
 */
function calc_flag(unit) {
	var flag = false;
	if(unit === '001' || unit === '002'){	//회배 , m2
		if(Number($('input[name=ord_width]').val()) === 0){			//가로 검사
			flag = false;
		}else if(Number($('input[name=ord_height]').val()) === 0){	//세로 검사
			flag = false;
		}else{
			var division = Number($('#blind_division').val());
			if(division === 1){	//분할X
				//좌 , 우 수량이 둘다 0일때
				if(Number($("#blind_left_qty").val()) === 0 && Number($("#blind_right_qty").val()) === 0){
					flag = false;
				}else{
					flag = true;
				}
			}else{				//분할O
				for(let i = 1; i <= division; i++){		//분할만큼 반복문
					if(Number($("#div_width"+i).val()) === 0){
						flag = false;
						break;
					}else if(Number($("#div_height"+i).val()) === 0){
						flag = false;
						break;
					}else{
						flag = true;
					}
				}
				if(Number($("#blind_qty").val()) === 0){
					flag = false;
				}
			}
		}
	}else if(unit === '006' || unit === '007'){	//Yard , 폭
		if(Number($("#curtain_acn").val()) === 0){			//자동계산부분의 값이 없을 경우 false 리턴
			flag = false;
		}else if(Number($("#curtain_qty").val()) === 0){	//수량부분의 값이 없을 경우 false 리턴
			flag = false;
		}else{
			if(Number($('input[name=ord_height]').val()) === 0){
				flag = false;
			}else{
				flag = true;
			}
		}
	}else{	//EA , Box
		//EA 경우 수량검사만 할 것
		if(Number($("#ea_qty").val()) === 0){
			flag = false;
		}else{
			flag = true;
		}
	}
	return flag;
}

/**
 * @description 계산 하기 위한 데이터 정리
 * @author 황호진  @version 1.0, @last update 2022/03/10
 */
function calc_process(unit , type) {
	var data = {};

	if(type === 'sale')
	{
		//판매 단가
		data['amt']	= $(".common_amt").val();
	}
	else if(type === 'buy')
	{
		//매입 단가
		data['amt']	= $(".common_unit_amt").val();
	}

	if(unit === '001' || unit === '002'){		//회베 , m2
		var division = Number($('#blind_division').val());
		//분할여부 (2이상일 경우 분할이라는 의미)
		data['division'] = division;
		//분할회배
		data['hebe'] = [];
		if(division === 1){
			//분할 아닐때의 수량 합계(좌 + 우)
			data['qty'] = Number($('#blind_left_qty').val()) + Number($('#blind_right_qty').val());
			//분할 아닐때의 회배 값
			data['hebe'][0] = hebe_clac('0');
		}else{
			//분할시 수량
			data['qty'] = Number($('#blind_qty').val());

			//분할시 회배
			for(var i = 1; i <= division; i++){
				data['hebe'][i - 1] = hebe_clac(String(i));
			}
		}
		//옵션1의 설정 값
		data['option1'] = option_for_calc('blind_option1');
		//옵션2의 설정 값
		data['option2'] = option_for_calc('blind_option2');
		//금액조정 단위
		data['update_unit'] = $('#blind_update_unit').val();
		//금액조정 단가
		data['update_amt'] = $('#blind_update_amt').val();
		//부가세 값 가져오기
		data['vat'] = $('input[name=vat]:checked').val();
	}else if(unit === '006' || unit === '007'){		//야드 , 폭
		//형상금액
		if(type === 'sale'){		//형상금액
			data['base_amt'] = $("#curtain_base_amt").val();
		}else if(type === 'buy'){	//매입형상금액
			data['base_amt'] = $("#curtain_purc_base_amt").val();
		}

		data['base_st'] = $("#curtain_base_st").val();
		//수량
		data['qty'] = $("#curtain_qty").val();
		//옵션1의 설정 값
		data['option1'] = option_for_calc('curtain_option1');
		//옵션2의 설정 값
		data['option2'] = option_for_calc('curtain_option2');
		//금액조정 단위
		data['update_unit'] = $('#curtain_update_unit').val();
		//금액조정 단가
		data['update_amt'] = $('#curtain_update_amt').val();
		//부가세 값 가져오기
		data['vat'] = $('input[name=vat]:checked').val();

		if(unit === '006'){			//야드 일때
			//단위 야드
			data['yard'] = $("#curtain_acn").val();
		}else if(unit === '007'){	//폭 일때
			//단위 폭
			data['pok'] = $("#curtain_acn").val();
			//세로길이
			data['height'] = $(".ord_height").val();
			//원단 폭 규격
			data['width_len'] = $("#curtain_width_len").val();
			//세로길이 제한
			data['height_len'] = $("#curtain_height_len").val();
			//세로길이 제한단위
			data['height_unit'] = $("#curtain_height_unit").val();
			//세로길이 cm당
			data['height_op1'] = $("#curtain_height_op1").val();
			//세로길이 %
			data['height_op2'] = $("#curtain_height_op2").val();
		}
	}else if(unit === '005' || unit === '011'){	//EA , BOX
		//수량
		data['qty'] = $("#ea_qty").val();

		//옵션1 선택값
		data['option1'] = option_for_calc('ea_option1');
		//옵션2 선택값
		data['option2'] = option_for_calc('ea_option2');

		//금액조정 단위
		data['update_unit'] = $('#ea_update_unit').val();
		//금액조정 단가
		data['update_amt'] = $('#ea_update_amt').val();
		//부가세 값 가져오기
		data['vat'] = $('input[name=vat]:checked').val();
	}
	return data;
}

/**
 * @description 계산하기 위한 옵션값 설정
 * @author 황호진  @version 1.0, @last update 2022/03/10
 */
function option_for_calc(id) {
	var v = $('#'+id).val();
	if(v === ''){	//옵션선택이 안되어 있을 경우!
		return '';
	}else{			//옵션선택이 되어 있는 경우!
		return {
			'amt' : $('#'+id+' option:selected').attr('data-amt'),		//단가
			'unit' : $('#'+id+' option:selected').attr('data-unitnm'),	//단위
		}
	}
}

/**
 * @description 금액 설정
 * @author 황호진  @version 1.0, @last update 2022/03/11
 */
function apply_amt(result , unit) {
	if(unit === '001' || unit === '002'){		//회베 , m2
		//숨김처리 목록
		$('#priz_unit_yard').html('0').parent().parent().hide();
		$('#priz_unit_pok').html('0').parent().parent().hide();
		$('#priz_unit_ea').html('0').parent().parent().hide();
		$('#priz_base_amt').html('0').parent().parent().hide();
		$('#priz_height_amt').html('0').parent().parent().hide();

		$('#priz_unit_hebe').html(result['ord_hebe'].toFixed(1)).parent().parent().show();
		//총 회배 설정
		$('#blind_ord_hebe').val(result['ord_hebe']);
	}else if(unit === '006' || unit === '007'){	//야드 , 폭
		//숨김처리 목록
		$('#priz_unit_hebe').html('0').parent().parent().hide();
		$('#priz_unit_ea').html('0').parent().parent().hide();

		if(unit === '006'){
			//폭 초기화
			$("#curtain_ord_pok").val('');
			$('#priz_unit_pok').html('0').parent().parent().hide();
			$('#priz_height_amt').html('0').parent().parent().hide();

			//야드 설정
			$('#priz_unit_yard').html(result['ord_yard']).parent().parent().show();
			$('#curtain_ord_yard').val(result['ord_yard']);
		}else if(unit === '007'){
			//야드 초기화
			$('#priz_unit_yard').html('0').parent().parent().hide();
			$('#curtain_ord_yard').val('');
			
			//폭 설정
			$("#curtain_ord_pok").val(result['ord_pok']);
			$('#priz_unit_pok').html(result['ord_pok']).parent().parent().show();

			//세로길이 추가금액 적용
			amt_setting('A' , 'priz_height_amt' , result['height_amt']);
		}

		//형상 금액 적용
		if(result['base_amt'] > 0){
			$("#priz_base_amt").html(commas(result['base_amt'])).parent().parent().show();
		}else{
			$("#priz_base_amt").html('0').parent().parent().hide();
		}

	}else if(unit === '005' || unit === '011'){	//EA , BOX
		//회베 , 야드 , 형상금액 숨김처리
		$('#priz_unit_hebe').html('0').parent().parent().hide();
		$('#priz_unit_yard').html('0').parent().parent().hide();
		$('#priz_unit_pok').html('0').parent().parent().hide();
		$('#priz_base_amt').html('0').parent().parent().hide();
		$('#priz_height_amt').html('0').parent().parent().hide();

		//총수량 설정
		$('#priz_unit_ea').html(result['qty']).parent().parent().show();
	}
	//개별금액
	$("#indi_prd_amt").val(result['indi_prd_amt']);
	$("#indi_prd_tax").val(result['indi_prd_tax']);
	$("#indi_base_amt").val(result['indi_base_amt']);
	$("#indi_base_tax").val(result['indi_base_tax']);
	$("#indi_height_amt").val(result['indi_height_amt']);
	$("#indi_height_tax").val(result['indi_height_tax']);
	$("#indi_op1_amt").val(result['indi_op1_amt']);
	$("#indi_op1_tax").val(result['indi_op1_tax']);
	$("#indi_op2_amt").val(result['indi_op2_amt']);
	$("#indi_op2_tax").val(result['indi_op2_tax']);

	//히든값으로 금액 가지고 있기
	$("#ord_amt").val(result['ord_amt']);
	$("#tax_amt").val(result['tax_amt']);

	//제품 금액 적용
	$("#priz_prd_amt").html(commas(result['prd_amt']));

	//옵션1 금액 적용
	amt_setting('A' , 'priz_op1_amt' , result['op1_amt']);
	//옵션2 금액 적용
	amt_setting('A' , 'priz_op2_amt' , result['op2_amt']);

	//금액조정 적용
	if(result['update_unit'] === '' || result['update_amt'] === 0){
		$("#priz_upd_unit").html('');
		$("#priz_upd_amt").html('0').parent().parent().hide();
	}else{
		$("#priz_upd_unit").html(result['update_unit']);
		$("#priz_upd_amt").html(commas(result['update_amt'])).parent().parent().show();
	}

	//총 금액 적용
	$("#priz_ord_amt").html(commas(result['ord_amt']));
	//세액 적용
	amt_setting('A' , 'priz_tax_amt' , result['tax_amt']);
}

/**
 * @description 금액설정해주는 곳 소스 중복을 하나로 합치기!
 * @author 황호진  @version 1.0, @last update 2022/06/23
 */
function amt_setting(type , target , amt) {
	switch (type) {
		case 'A':
			if(amt > 0){
				$("#"+target).html(commas(amt)).parent().parent().show();
			}else{
				$("#"+target).html('0').parent().parent().hide();
			}
			break;
		case 'B':
			break;
		default:
			break;
	}
}

/**
 * @description 매입 금액 설정
 * @author 황호진  @version 1.0, @last update 2022/08/11
 */
function buy_amt_set(result) {
	//매입 개별금액
	$("#bi_prd_amt").val(result['indi_prd_amt']);
	$("#bi_prd_tax").val(result['indi_prd_tax']);
	$("#bi_base_amt").val(result['indi_base_amt']);
	$("#bi_base_tax").val(result['indi_base_tax']);
	$("#bi_height_amt").val(result['indi_height_amt']);
	$("#bi_height_tax").val(result['indi_height_tax']);
	$("#bi_op1_amt").val(result['indi_op1_amt']);
	$("#bi_op1_tax").val(result['indi_op1_tax']);
	$("#bi_op2_amt").val(result['indi_op2_amt']);
	$("#bi_op2_tax").val(result['indi_op2_tax']);

	//매입 금액(주문금액 , 주문세액)
	$("#buy_ord_amt").val(result['ord_amt']);
	$("#buy_tax_amt").val(result['tax_amt']);
}

/**
 * @description 신규제품추가 팝업의 완료버튼 함수
 * @author 황호진  @version 1.0, @last update 2022/03/11
 */
function ord_reg_comp(unit , button_type) {
	var url = "/ord/ord_reg_pop/ord_reg_comp";
	var type = "POST";
	var data = {
		'master_frm'	: {
			'cust_cd'		: $(".common_cust_cd").val(),	//거래처코드
			'cust_nm'		: $(".common_cust_nm").val(),	//거래처명
			'ord_no'		: $("#ord_no").val(),
			'rec_gb'		: $("#rec_gb").val(),
			'ord_dt'		: $("#ord_dt").val(),
			'dlv_gb'		: $("#dlv_gb").val(),
			'ord_prop'		: $("#ord_prop").val(),
			'memo'			: $("#memo").val(),			//시공장소 또는 고객이름(변경 여지 있음)
			'dlv_dt'		: $("#dlv_dt").val(),
			'vat'			: $("input[name=vat]:checked").val(),
			'ord_gb'		: $("input[name=ord_gb]:checked").val(),
			'ord_zip'		: $("#ord_zip").val(),
			'address'		: $("#address").val(),
			'addr_detail'	: $("#addr_detail").val(),
			'addr_text'		: $("#addr_text").val()
		},
		'gb'	: {
			'unit'			: unit,
			'site_name'		: $("#site_name").val(),
		},
		'detail_frm'	: {
			'sub_local_cd'		: $(".common_sub_local_cd").val(),	//소속공장코드
			'item_cd'			: $(".common_item_cd").val(),		//아이템코드
			'item_nm'			: $(".common_item_nm").val(),		//아이템명
			'proc_gb'			: $(".common_proc_gb").val(),		//제작구분
			'work_gb'			: $(".common_work_gb").val(),		//작업구분
			'pd_cd'				: $(".common_pd_cd").val(),			//소속제품군
			'item_lv'			: $(".common_item_lv").val(),		//대분류
			'item_lv_nm'		: $(".common_item_lv_nm").val(),	//대분류명칭
			'buy_cd'			: $(".common_buy_cd").val(),		//매입처코드
			'unit_amt'			: $(".common_amt").val(),			//판매단가
			'ord_amt'			: $('#ord_amt').val(),				//금액
			'tax_amt'			: $('#tax_amt').val(),				//세액
			'buy_unit_amt'		: $(".common_unit_amt").val(),		//매입단가
			'buy_ord_amt'		: $('#buy_ord_amt').val(),			//매입금액
			'buy_tax_amt'		: $('#buy_tax_amt').val()			//매입세액
		}
	};
	//JSON 형태 정리할 목록들
	var item_gb = {} , option = {}, ord_spec = {} , ord_qty = {} , div_info = {} , amt_spec = {} , buy_amt_spec = {};
	if(unit === '001' || unit === '002'){
		//블라인드 추가분류 설정???
		item_gb['item_gb'] = $('.common_item_gb').val();
		//옵션 , 금액조정 설정
		option	= organize_option('blind_option1' , option , 'op1_nm' , 'op1_unit' , 'op1_amt');
		option	= organize_option('blind_option2' , option , 'op2_nm' , 'op2_unit' , 'op2_amt');
		
		option['update_unit'] 	= $("#blind_update_unit").val();
		if($("#blind_update_unit").val() === ''){	//할인_없음이 선택되어 있을 때!
			option['update_amt'] 	= '';
		}else{
			option['update_amt'] 	= $("#blind_update_amt").val() === '' ? '' : $("#blind_update_amt").val();
		}

		//분할수량 값 가져오기
		var division = Number($("#blind_division").val());
		//규격 설정
		ord_spec['size'] 		= Number($(".common_size").val());	//판매규격
		ord_spec['unit'] 		= unit;								//단위
		ord_spec['division'] 	= division;							//분할
		ord_spec['ord_width'] 	= Number($(".ord_width").val());	//가로길이
		ord_spec['ord_height'] 	= Number($(".ord_height").val());	//세로길이
		ord_spec['ord_hebe']	= $("#blind_ord_hebe").val();		//총회베
		ord_spec['place'] 		= $("#blind_place").val() === "" ? "기타" : $("#blind_place").val();//위치
		ord_spec['handle']		= $("#blind_handle").val();			//손잡이
		ord_spec['len']			= $("#blind_len").val();			//줄길이
		//분할있을때...
		if(division > 1){
			var div_left_qty = 0;
			var div_right_qty = 0;
			var blind_qty = Number($("#blind_qty").val());
			for(let i = 1, j = 1; i <= division * blind_qty; i++ , j++){
				//분할 가로 세로 설정
				div_info['div_width'+i] 	= Number($("#div_width"+j).val());
				div_info['div_height'+i] 	= Number($("#div_height"+j).val());
				//회배 설정
				div_info['div_hebe'+i] 	= Number($("#div_hebe"+j).val());
				//위치 및 수량 설정
				if($("#handle_pos"+j).val() === 'right'){
					div_info['handle_pos'+i] = 'R';
					div_right_qty++;
				}else{
					div_info['handle_pos'+i] = 'L';
					div_left_qty++;
				}
				//초기화
				if(division === j){
					j = 0;
				}
			}

			//수량 설정
			ord_qty['left_qty'] = div_left_qty;
			ord_qty['right_qty'] = div_right_qty;
			ord_qty['qty'] = blind_qty;
		}else{

			//수량 설정
			ord_qty['left_qty'] = Number($("#blind_left_qty").val());	//좌
			ord_qty['right_qty'] = Number($("#blind_right_qty").val());	//우
		}

		//공장지시사항 및 분할정보 담기
		data['detail_frm']['fac_text'] = $('#blind_fac_text').val();	//공장지시사항
		data['detail_frm']['div_info'] = JSON.stringify(div_info);		//JSON[분할 정보]

	}else if(unit === '006' || unit === '007'){
		//커튼 추가분류 설정???
		item_gb['item_gb'] = $('.common_item_gb').val();;
		//옵션 , 금액조정 설정
		option	= organize_option('curtain_option1' , option , 'op1_nm' , 'op1_unit' , 'op1_amt');
		option	= organize_option('curtain_option2' , option , 'op2_nm' , 'op2_unit' , 'op2_amt');
		option['update_unit'] 	= $("#curtain_update_unit").val();
		if($("#curtain_update_unit").val() === ''){	//할인_없음이 선택되어 있을 때!
			option['update_amt'] 	= '';
		}else{
			option['update_amt'] 	= $("#curtain_update_amt").val() === '' ? '' : $("#curtain_update_amt").val();
		}
		//규격 설정
		ord_spec['size'] 		= Number($(".common_size").val());				//판매규격
		ord_spec['unit'] 		= unit;											//단위
		ord_spec['ord_width'] 	= Number($(".ord_width").val());				//가로길이
		ord_spec['ord_height'] 	= Number($(".ord_height").val());				//세로길이
		ord_spec['place'] 		= $("#curtain_place").val() === "" ? "기타" : $("#curtain_place").val();//위치
		ord_spec['work_way'] 	= $("#curtain_work_way").val();					//가공방법
		ord_spec['usage'] 		= $("#curtain_usage").val();					//원단사용량
		ord_spec['color'] 		= $("#curtain_color").val();					//색상
		ord_spec['base_st'] 	= $("#curtain_base_st").val();					//형상선택
		ord_spec['base_amt'] 	= Number($("#curtain_base_amt").val());			//형상금액
		ord_spec['purc_base_amt']	= Number($("#curtain_purc_base_amt").val());	//매입형상금액
		ord_spec['div_gb'] 		= $("#curtain_div_gb").val();					//분할

		if(unit === '006'){
			// 개별 야드
			ord_spec['yard']		= Number($("#curtain_acn").val());
			// 총 야드
			ord_spec['ord_yard']	= Number($("#curtain_ord_yard").val());
		}else if(unit === '007'){
			// 개별 폭
			ord_spec['pok']			= Number($("#curtain_acn").val());
			// 총 폭
			ord_spec['ord_pok']		= Number($("#curtain_ord_pok").val());

			ord_spec['width_len']	= Number($("#curtain_width_len").val());	//원단 폭 규격
			ord_spec['height_len']	= Number($("#curtain_height_len").val());	//세로길이 제한
			ord_spec['height_unit']	= $("#curtain_height_unit").val();			//세로길이 제한단위
			ord_spec['height_op1']	= Number($("#curtain_height_op1").val());	//세로길이 cm당
			ord_spec['height_op2']	= Number($("#curtain_height_op2").val());	//세로길이 cm당 %수치
		}

		if(ord_spec['color'] === 'two'){
			// 기둥 색상
			ord_spec['outside_color']	= $("#curtain_outside_color").val();
			// 기둥 수치
			ord_spec['outside_num']		= Number($("#curtain_outside_acn").val());
			// 안쪽 색상
			ord_spec['inside_color']	= $("#curtain_inside_color").val();
			// 안쪽 수치
			ord_spec['inside_num']		= Number($("#curtain_inside_acn").val());
		}

		// 수량 설정
		ord_qty['qty'] = Number($("#curtain_qty").val());

		//공장지시사항 담기
		data['detail_frm']['fac_text'] = $('#curtain_fac_text').val();	//공장지시사항

	}else if(unit === '005' || unit === '011'){
		//커튼 추가분류 설정???
		item_gb['item_gb'] = $('.common_item_gb').val();;

		option	= organize_option('ea_option1' , option , 'op1_nm' , 'op1_unit' , 'op1_amt');
		option	= organize_option('ea_option2' , option , 'op2_nm' , 'op2_unit' , 'op2_amt');

		if($("#ea_update_unit").val() === ''){	//할인_없음이 선택되어 있을 때!
			option['update_amt'] 	= '';
		}else{
			option['update_amt'] 	= $("#ea_update_amt").val() === '' ? '' : $("#ea_update_amt").val();
		}

		//규격 설정
		ord_spec['size'] 		= Number($(".common_size").val());	//판매규격
		ord_spec['place']		= $("#ea_place").val() === "" ? "기타" : $("#ea_place").val();//위치
		ord_spec['unit'] 		= unit;								//단위

		//수량
		ord_qty['qty'] = $('#ea_qty').val();

		//공장지시사항 담기
		data['detail_frm']['fac_text'] = $('#ea_fac_text').val();

	}

	//금액 설정
	amt_spec['prd_amt'] = $('#indi_prd_amt').val();
	amt_spec['prd_tax'] = $('#indi_prd_tax').val();
	amt_spec['base_amt'] = $('#indi_base_amt').val();
	amt_spec['base_tax'] = $('#indi_base_tax').val();
	amt_spec['height_amt'] = $('#indi_height_amt').val();
	amt_spec['height_tax'] = $('#indi_height_tax').val();
	amt_spec['op1_amt'] = $('#indi_op1_amt').val();
	amt_spec['op1_tax'] = $('#indi_op1_tax').val();
	amt_spec['op2_amt'] = $('#indi_op2_amt').val();
	amt_spec['op2_tax'] = $('#indi_op2_tax').val();

	//매입 금액 설정
	buy_amt_spec['prd_amt'] = $('#bi_prd_amt').val();
	buy_amt_spec['prd_tax'] = $('#bi_prd_tax').val();
	buy_amt_spec['base_amt'] = $('#bi_base_amt').val();
	buy_amt_spec['base_tax'] = $('#bi_base_tax').val();
	buy_amt_spec['height_amt'] = $('#bi_height_amt').val();
	buy_amt_spec['height_tax'] = $('#bi_height_tax').val();
	buy_amt_spec['op1_amt'] = $('#bi_op1_amt').val();
	buy_amt_spec['op1_tax'] = $('#bi_op1_tax').val();
	buy_amt_spec['op2_amt'] = $('#bi_op2_amt').val();
	buy_amt_spec['op2_tax'] = $('#bi_op2_tax').val();

	//추가 분류 , 옵션/할인리스트 , 주문상세스펙 , 수량 담기
	data['detail_frm']['item_gb'] = JSON.stringify(item_gb);		//JSON[추가 분류
	data['detail_frm']['option'] = JSON.stringify(option);			//JSON[옵션/할인 리스트]
	data['detail_frm']['ord_spec'] = JSON.stringify(ord_spec);		//JSON[주문 상세 스펙]
	data['detail_frm']['ord_qty'] = JSON.stringify(ord_qty);		//JSON[수량]
	data['detail_frm']['amt_spec'] = JSON.stringify(amt_spec);		//JSON[금액]
	data['detail_frm']['buy_amt_spec'] = JSON.stringify(buy_amt_spec);	//JSON[매입금액]


	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');

				//ord_reg , ord_detail
				var site_name = $("#site_name").val();

				if(site_name === 'ord_reg'){	//ord_reg
					//주문번호
					$("#ord_no").val(res.ord_no);
					$("#view_ord_no").html(res.ord_no);

					//거래명세번호 발행 전 UI
					$("#pre_publish").hide();
					//거래명세번호 발행 후 UI
					$("#post_publish").show();

				}else{							//ord_detail

				}

				//리스트 호출
				get_ord_prd_list(res.ord_no);

				if(button_type === 'A'){		// A : 팝업 닫기
					ord_pop_close();
				}else if(button_type === 'B'){	// B : 동일제품 재주문
					re_ord_prd();
				}

			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 주문팝업 닫기
 * @author 황호진  @version 1.0, @last update 2022/03/14
 */
function ord_pop_close() {
	$('.new_ord').bPopup().close();
}

/**
 * @description 등록 혹은 수정시 입력값 검사하는 함수
 * @author 황호진  @version 1.0, @last update 2022/03/14
 */
function ord_reg_insp(unit) {
	if(unit === '001' || unit === '002'){			//단위가 회베 , m2 일 경우
		var max_width = Number($("#blind_max_width").val());	//최대 가로 길이
		var max_height = Number($("#blind_max_height").val());	//최대 세로 길이

		//가로길이 입력 검증
		if(Number($(".ord_width").val()) === 0){
			toast('가로길이을 입력해주세요.', true, 'danger');
			$('.ord_width').focus();
			return false;
		}
		//세로길이 입력 검증
		if(Number($(".ord_height").val()) === 0){
			toast('세로길이을 입력해주세요.', true, 'danger');
			$('.ord_height').focus();
			return false;
		}

		//선택된 분할 값
		var division = Number($("#blind_division").val());
		if(division === 1){
			//좌 , 우 수량 입력 검증
			if(Number($("#blind_left_qty").val()) === 0 && Number($("#blind_right_qty").val()) === 0){
				if(Number($("#blind_left_qty").val()) === 0){
					toast('수량을 입력해주세요.', true, 'danger');
					$('#blind_left_qty').focus();
					return false;
				}else{
					toast('수량을 입력해주세요.', true, 'danger');
					$('#blind_right_qty').focus();
					return false;
				}
			}
		}else{
			var sum_div_width = 0;
			//분할수량만큼 반복문
			for(let i = 1; i <= division; i++){
				if(Number($("#div_width"+i).val()) === 0){
					toast('분할 가로길이을 입력해주세요.', true, 'danger');
					$("#div_width"+i).focus();
					return false;
				}else if(Number($("#div_height"+i).val()) === 0){
					toast('분할 세로길이를 입력해주세요.', true, 'danger');
					$("#div_height"+i).focus();
					return false;
				}

				//분할별 한계치수 검사(가로 , 세로)
				if(max_width !== 0){
					if(Number($("#div_width"+i).val()) > max_width){
						toast(i+'번 분할 가로치수가 한계 가로치수 '+max_width+'cm를 넘었습니다. 확인 후 다시 시도해주세요!', true, 'danger');
						return false;
					}
				}
				if(max_height !== 0){
					if(Number($("#div_height"+i).val()) > max_height){
						toast(i+'번 분할 세로치수가 한계 세로치수 '+max_height+'cm를 넘었습니다. 확인 후 다시 시도해주세요!', true, 'danger');
						return false;
					}
				}

				//입력된 가로길이와 값이 맞는지 검증하기 위한 합계
				sum_div_width += Number($("#div_width"+i).val());
			}
			//분할시 묶음 수량
			if(Number($("#blind_qty").val()) === 0){
				toast('수량을 입력해주세요.', true, 'danger');
				$('#blind_qty').focus();
				return false;
			}
			
			//분할 가로 합계와 가로길이의 숫자가 같은지 확인
			if(Number($(".ord_width").val()) !== (Math.round(sum_div_width * 10) / 10)){
				toast('가로 길이와 분할 가로 합계가 맞지 않습니다. 확인 후 다시 시도해주세요.', true, 'danger');
				return false;
			}
		}

		if(division === 1)
		{	//분할이 아닌 경우에만 검사
			//한계치수 검사(가로 , 세로)
			if(max_width !== 0){
				if(Number($(".ord_width").val()) > max_width){
					toast('한계 가로치수가 '+max_width+'cm 입니다. 확인 후 다시 시도해주세요!', true, 'danger');
					return false;
				}
			}
			if(max_height !== 0){
				if(Number($(".ord_height").val()) > max_height){
					toast('한계 세로치수가 '+max_height+'cm 입니다. 확인 후 다시 시도해주세요!', true, 'danger');
					return false;
				}
			}
		}

	}else if(unit === '006' || unit === '007'){		//단위가 Yard,폭 일 경우
		var max_width = Number($("#curtain_max_width").val());	//최대 가로 길이
		var max_height = Number($("#curtain_max_height").val());	//최대 세로 길이

		//가로길이 입력 검증
		if(Number($(".ord_width").val()) === 0){
			toast('가로길이을 입력해주세요.', true, 'danger');
			$('.ord_width').focus();
			return false;
		}
		//세로길이 입력 검증
		if(Number($(".ord_height").val()) === 0){
			toast('세로길이을 입력해주세요.', true, 'danger');
			$('.ord_height').focus();
			return false;
		}
		var acn = Number($("#curtain_acn").val());
		//자동 계산 검사
		if(acn === 0){
			toast('계산된 단위 수치가 없습니다. 입력 후 다시 시도해주세요!', true, 'danger');
			$('#curtain_acn').focus();
			return false;
		}

		//커튼폼 수량
		if(Number($("#curtain_qty").val()) === 0){
			toast('수량을 입력해주세요!', true, 'danger');
			$('#curtain_qty').focus();
			return false;
		}

		if($('#curtain_color').val() === 'two'){
			//안쪽 색상
			if($("#curtain_inside_color").val() === ''){
				toast('안쪽 색상을 선택해주세요!', true, 'danger');
				return false;
			}
			//안쪽 단위수치
			var inside_acn = Number($("#curtain_inside_acn").val());
			var outside_acn = Number($("#curtain_outside_acn").val());
			if(inside_acn === 0){
				toast('안쪽 수치를 입력해주세요!', true, 'danger');
				$('#curtain_inside_acn').focus();
				return false;
			}
			
			//기둥 + 안쪽 수치가 계산된 수치와 같은지 비교 필요
			if((inside_acn + outside_acn) !== acn){
				toast('기둥 수치 + 안쪽 수치의 값이 계산된 단위의 수치와 같지 않습니다. 확인 후 다시 시도해주세요!', true, 'danger');
				$('#curtain_inside_acn').focus();
				return false;
			}
		}

		//한계치수 검사(가로 , 세로)
		if(max_width !== 0){
			if(Number($(".ord_width").val()) > max_width){
				toast('한계 가로치수가 '+max_width+'cm 입니다. 확인 후 다시 시도해주세요!', true, 'danger');
				return false;
			}
		}
		if(max_height !== 0){
			if(Number($(".ord_height").val()) > max_height){
				toast('한계 세로치수가 '+max_height+'cm 입니다. 확인 후 다시 시도해주세요!', true, 'danger');
				return false;
			}
		}

	}else if(unit === '005' || unit === '011'){		//단위가 EA , Box일 경우
		var ea_min_qty = Number($("#ea_min_qty").val());
		//최소주문수량 조건 걸기
		if(Number($("#ea_qty").val()) < ea_min_qty){
			toast('해당 제품의 최소주문수량은 '+ea_min_qty+'EA 입니다. 확인 후 다시 시도해주세요!', true, 'danger');
			return false;
		}
	}
	//판매단가 - 공통적으로 확인해야하는 부분
	if(Number($(".common_amt").val()) < 1){
		toast('판매단가가 0원입니다. 설정 후 진행해주세요!', true, 'danger');
		return false;
	}
	//총 금액 - 공통적으로 확인해야하는 부분
	if(Number($("#ord_amt").val()) < 1){
		toast('총 금액이 0이하입니다. 확인 후 다시 시도해주세요!.', true, 'danger');
		return false;
	}
	return true;
}

/**
 * @description 주문리스트 조회 함수
 * @author 황호진  @version 1.0, @last update 2022/03/14
 */
function get_ord_prd_list(ord_no) {
	var url = '/ord/ord_reg_pop/get_ord_prd_list';
	var type = 'GET';
	var data = {
		ord_no : ord_no
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			//site_name -> ord_reg , ord_detail
			var site_name = $("#site_name").val();

			var len = res.data.length;

			if(len > 0){
				var set_view = {
					'yard'		: 0,	//총 야드
					'pok'		: 0,	//총 폭
					'qty'		: 0,	//총 개수
					'hebe'		: 0,	//총 회베
					'tax_amt'	: 0,	//세액
					'ord_amt'	: 0		//총 금액
				};

				var str = '';
				$.each(res.data , function (i , list) {
					//데이터 설정
					var item_gb = JSON.parse(list.item_gb);		//item_nm 추가 설정용
					var ord_spec = JSON.parse(list.ord_spec);	//형상옵션 , 가공방법을 item_nm에 추가 설정용
					var ord_qty = JSON.parse(list.ord_qty);
					var option = JSON.parse(list.option);		//item_nm 추가 설정용
					//해당 수정 팝업을 열때 필요한 값들!
					var arg = encodeURIComponent(JSON.stringify(
						{
							'ord_no' 	: list.ord_no,
							'cust_cd' 	: list.cust_cd,
							'ord_seq' 	: list.ord_seq
						}
					));
					if(list.rec_gb === 'F' && list.finyn === '002' && (list.ord_gb === 'N' || list.ord_gb === 'O')){
						str += '<tr onclick=mod_item_info("'+ arg +'")>';
					}else{
						str += '<tr>';
					}
					str += '<td class="w6">';
					if(list.make_gb === '001'){
						str += '<span>'+ list.make_gb_nm +'</span>';
					}else if(list.make_gb === '005'){
						str += '<span class="green">'+ list.make_gb_nm +'</span>';
					}else if(list.make_gb === '009'){
						str += '<span class="pp">'+ list.make_gb_nm +'</span>';
					}else{
						str += '<span class="red">'+ list.make_gb_nm +'</span>';
					}
					str += '</td>';
					str += '<td>'+ list.item_nm +'</td>';

					var ord_width = ord_spec['ord_width'] === undefined ? '' : ord_spec['ord_width'];
					var ord_height = ord_spec['ord_height'] === undefined ? '' : ord_spec['ord_height'];

					str += '<td class="w6">'+ ord_width +'</td>';
					str += '<td class="w6">'+ ord_height +'</td>';
					str += '<td class="w8">';
					if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
						//좌측 수량이 없을때!
						if(ord_qty['left_qty'] === 0){
							str += '<span></span>';
						}else{
							str += '<span>좌:'+ ord_qty['left_qty'] +'</span>';
						}
						//우측 수량이 없을때!
						if(ord_qty['right_qty'] === 0){
							str += '<span></span>';
						}else{
							str += '<span>우:'+ ord_qty['right_qty'] +'</span>';
						}
					}else if(ord_spec['unit'] === '005'){	//EA
						str += ord_qty['qty']+'EA';
					}else if(ord_spec['unit'] === '006' || ord_spec['unit'] === '007'){	//Yard , 폭
						//커튼 분할 div_gb 가 001 : 양개 , 002 : 편개
						if(ord_spec['div_gb'] === '001'){
							str += '양개:'+ord_qty['qty'];
						}else if(ord_spec['div_gb'] === '002'){
							str += '편개:'+ord_qty['qty'];
						}
					}
					str += '</td>';
					if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
						if(ord_spec['division'] > 1){
							str += '<td class="w8 bunhal bhl" id="bunhal_'+list.lot+'" data-text1="'+list.ord_no+'" data-text2="'+list.ord_seq+'">'+ ord_spec['division'] +'분할(상세보기)</td>';
						}else{
							str += '<td class="w8"></td>';
						}
					}else if(ord_spec['unit'] === '006' || ord_spec['unit'] === '007'){
						//색상 원톤 , 투톤
						if(ord_spec['color'] === 'two'){
							str += '<td class="w8 twoton tdl" id="twoton_'+list.lot+'" data-text1="'+list.ord_no+'" data-text2="'+list.ord_seq+'">투톤(상세보기)</td>';
						}else{
							str += '<td class="w8"></td>';
						}
					}else{
						str += '<td class="w8"></td>';
					}
					str += '<td class="w8">';
					if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
						str += Math.floor(ord_spec['ord_hebe'] * 10) / 10+'회베';
					}else if(ord_spec['unit'] === '006') {
						str += ord_spec['ord_yard']+'야드';
					}else if(ord_spec['unit'] === '007'){
						str += ord_spec['ord_pok']+'폭';
					}else{
						str += ord_qty['qty']+'EA';
					}
					str += '</td>';
					str += '<td class="w8">'+ commas(Number(list.unit_amt)) +'원</td>';
					str += '<td class="w8">'+ commas(Number(list.ord_amt) + Number(list.tax_amt)) +'원</td>';
					str += '<td class="w10">'+ list.reg_ikey +'</td>';
					str += '<td class="w8">'+ list.finyn_nm +'</td>';
					str += '<td class="w7" onclick="event.stopPropagation()">';
					if(list.make_gb === '001' || list.make_gb === '005' || list.make_gb === '009'){
						if(list.finyn === '002' && list.rec_gb === 'F'){
							str += '<button type="button" class="dele" onclick=ord_prd_one_del("'+ arg +'")>삭제</button>';
						}else if(list.finyn !== '002' && list.rec_gb === 'F'){
							str += '<button type="button" class="dele" onclick="msg_cannot_del()">삭제</button>';
						}
					}else{
						str += '<button type="button" class="dele" onclick=return_cancel("'+ arg +'")>반품취소</button>';
					}
					str += '</td>';
					str += '</tr>';

					//합계 설정
					if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){	//회베 , m2
						set_view['hebe'] += Number(ord_spec['ord_hebe']);
					}else if(ord_spec['unit'] === '006'){	//야드
						set_view['yard'] += Number(ord_spec['ord_yard']);
					}else if(ord_spec['unit'] === '007'){	//폭
						set_view['pok'] += Number(ord_spec['ord_pok']);
					}else if(ord_spec['unit'] === '005' || ord_spec['unit'] === '011'){	//EA , BOX
						set_view['qty'] += Number(ord_qty['qty']);
					}
					//합계 금액 설정
					set_view['tax_amt'] += Number(list.tax_amt);
					set_view['ord_amt'] += Number(list.ord_amt) + Number(list.tax_amt);
				});
				$("#ord_list").html(str);


				deduplication(set_view , 'yard' , 'total_yard' , 'num');
				deduplication(set_view , 'pok' , 'total_pok' , 'num');
				deduplication(set_view , 'qty' , 'total_qty' , 'num');
				deduplication(set_view , 'hebe' , 'total_hebe' , 'num');
				deduplication(set_view , 'tax_amt' , 'total_tax_amt' , 'amt');
				deduplication(set_view , 'ord_amt' , 'total_ord_amt' , 'amt');

			}else{
				if(site_name === 'ord_reg'){
					//리스트 부분 텍스트 설정
					$("#ord_list").html('<tr><td colspan="12">제품 추가를 클릭해주세요!</td></tr>');
					//조회했을때 없다는 것은 삭제 후의 리스트 호출이라는 의미이며 ord_no를 제거처리
					$("#ord_no").val('');
					$("#view_ord_no").html('');

					//거래명세번호 발행 전 UI
					$("#pre_publish").show();
					//거래명세번호 발행 후 UI
					$("#post_publish").hide();

				}else if(site_name === 'ord_detail'){
					// /public/js/bms/ord_detail.js => new_ord 함수를 통해 /ord/ord_reg로 이동처리
					new_ord($('#cust_cd').val());
				}
			}


			if(site_name === 'ord_detail') {
				//checkbox 이벤트 걸기
				$('input[name=ord_chk]').click(function () {
					if ($(this).is(':checked') == true) {
						$(this).parents('tr').addClass('active');
						// $(this).parents('tr').next().addClass('active');
					} else {
						$(this).prop("checked", false);
						$(this).parents('tr').removeClass('active');
						// $(this).parents('tr').next().removeClass('active');
					}
				});
			}

			//분할 상세보기 이벤트 걸기
			$(".bhl").hover(function(){
				g_bunhal_flag = true;
				var id = $(this).attr('id');
				var ord_no = $(this).attr('data-text1');
				var ord_seq = $(this).attr('data-text2');
				bunhal_detail(id , ord_no , ord_seq);
			},function(){
				g_bunhal_flag = false;
				$('.bunhal_detail').hide();
			});

			//색상 상세보기 이벤트 걸기
			$(".tdl").hover(function(){
				g_color_flag = true;
				var id = $(this).attr('id');
				var ord_no = $(this).attr('data-text1');
				var ord_seq = $(this).attr('data-text2');
				color_detail(id , ord_no , ord_seq);
			},function(){
				g_color_flag = false;
				$('.color_detail').hide();
			});

		}).fail(fnc_ajax_fail);
}

/**
 * @description 합계 설정시 중복부분을 하나로 합친 함수
 * @author 황호진  @version 1.0, @last update 2022/06/24
 */
function deduplication(data, target , id ,type) {
	switch(type){
		case 'num':
			if(data[target] > 0){
				$('#'+id).html(data[target]).parent().show();
			}else{
				$('#'+id).html('').parent().hide();
			}
			break;
		case 'amt':
			$('#'+id).html(commas(data[target])+'원').parent().show();
			break;
		default:
			break;
	}
}

/**
 * @description 균등분할 이벤트
 * @author 황호진  @version 1.0, @last update 2022-03-16
 */
function equal_division() {
	//가로 값 가져오기!
	var ord_width = Number($(".ord_width").val());
	//분할수
	var division = Number($("#blind_division").val());
	//분할가로 , 나머지 , 마지막 가로길이
	var division_width , nam , last_width;
	if(ord_width !== 0){
		//분할길이 구하기
		division_width = Number(Math.floor((ord_width / division) * 10) / 10);
		//나머지 값 구하기
		nam = (division_width * (division - 1)).toFixed(1);
		//나머지 길이 구하기
		last_width = Number((ord_width - nam).toFixed(1));
	}
	//반복문 돌리기
	for(let i = 1; i <= division; i++){
		if(ord_width !== 0) {
			if (i === division) {
				$("#div_width" + i).val(last_width).prev().addClass('active');
			} else {
				$("#div_width" + i).val(division_width).prev().addClass('active');
			}
		}else{
			$("#div_width" + i).val('').prev().removeClass('active');
		}
		//회배 설정
		$('#div_hebe'+i).val(hebe_clac(i));
	}

	var unit = $('.common_unit').val();
	//검사 - 정리 - 계산 - 설정
	manage_data(unit);
}

/**
 * @description 거래원장의 등록된 제품 건별 삭제
 * @author 황호진  @version 1.0, @last update 2022-03-17
 */
function ord_prd_one_del(arg) {
	var con = confirm('삭제하시겠습니까?');
	if(con){
		arg = JSON.parse(decodeURIComponent(arg)); // 필수
		var url = '/ord/ord_reg_pop/ord_prd_one_del';
		var type = 'POST';
		var data = {
			'ord_no' 	: arg['ord_no'],
			'cust_cd' 	: arg['cust_cd'],
			'ord_seq' 	: arg['ord_seq']
		};
		fnc_ajax(url , type , data)
			.done(function (res) {
				if(res.result){
					toast(res.msg, false, 'info');
					get_ord_prd_list(arg['ord_no']);
				}else{
					toast(res.msg, true, 'danger');
				}
			}).fail(fnc_ajax_fail);
	}
}

/**
 * @description 수정 제품 정보(진행 예정)
 * @author 황호진  @version 1.0, @last update 2022/03/21
 */
function mod_item_info(arg) {
	data = JSON.parse(decodeURIComponent(arg)); // 필수
	var url = '/ord/ord_reg_pop/mod_item_info';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			//제품 검색어 초기화
			$("#item_sc").val('');
			//제품선택 불러오기
			get_item_list({s : null , cust_cd : data['cust_cd']});

			//거래처코드 설정
			$(".common_cust_cd").val(data['cust_cd']);

			var info = res.data.info;
			var option1 = res.data.option1;
			var option2 = res.data.option2;

			var info_item_gb 	= JSON.parse(info.item_gb);		//추가 분류[JSON]
			var info_option 	= JSON.parse(info.option);		//옵션/할인 리스트[JSON]
			var info_ord_qty 	= JSON.parse(info.ord_qty);		//수량[JSON]
			var info_ord_spec 	= JSON.parse(info.ord_spec);	//제품 상세 스펙[JSON]

			//제품명 설정
			$("#ref_item_nm").html(info.item_nm);
			//단위 설정
			if(info_ord_spec['unit'] === '001' || info_ord_spec['unit'] === '002'){
				$("#ref_size_unit").html(Number(info_ord_spec['size']).toFixed(1)+info.unit_nm);
			}else{
				$("#ref_size_unit").html(Number(info_ord_spec['size'])+info.unit_nm);
			}
			//판매단가 설정
			$("#ref_amt").html(commas(Number(info.unit_amt))+'원');

			$("#select_counter").hide();	//제품선택 안내창 비활성화
			$("#prd_space").show();			//제품정보 활성화
			$("#price_zone_space").show();	//금액 활성화

			$('.more_hidden').hide();	//더보기 닫기

			//공통변수 설정
			var common_field = {
				'common_cust_nm' : info.cust_nm , 'common_item_cd' : info.item_cd , 'common_item_nm' : info.item_nm ,
				'common_size' : info_ord_spec['size'] , 'common_unit' : info_ord_spec['unit'] , 'common_amt' : Number(info.unit_amt) ,
				'common_proc_gb' : info.proc_gb ,  'common_pd_cd' : info.pd_cd , 'common_item_lv' : info.item_lv ,
				'common_item_lv_nm' : info.item_lv_nm , 'common_item_gb' : info_item_gb['item_gb'] , 'common_work_gb' : info.work_gb ,
				'common_ord_seq' : info.ord_seq , 'common_buy_cd' : info.buy_cd , 'common_sub_local_cd' : info.sub_local_cd ,
				'common_unit_amt' : info.buy_unit_amt
			};
			// /public/js/dev/common.js의 process 함수
			process(common_field , 'cval');

			//옵션 설정
			option_setting('옵션 선택','option1',option1);
			option_setting('옵션 선택','option2',option2);

			if(info_ord_spec['unit'] === '001' || info_ord_spec['unit'] === '002'){ 		//회베 or ㎡ 일 경우
				//블라인드에서 사용중인 제한수치
				$("#blind_min_width").val('');
				$("#blind_min_height").val('');
				$("#blind_max_width").val('');
				$("#blind_max_height").val('');

				//가로 , 세로 설정
				$(".ord_width").val(info_ord_spec['ord_width']).prev().addClass('active');
				$(".ord_height").val(info_ord_spec['ord_height']).prev().addClass('active');

				//위치 설정
				$("#blind_place").val(info_ord_spec['place']).prev().addClass('active');
				//분할 설정
				$("#blind_division").val(info_ord_spec['division']).trigger('change');
				if(info_ord_spec['division'] > 1){
					var division_info = res.data.division_info;
					//분할 설정
					for(var i = 1; i <= info_ord_spec['division']; i++){
						$("#div_width"+i).val(division_info[i-1].div_width).prev().addClass('active');
						$("#div_height"+i).val(division_info[i-1].div_height).prev().addClass('active');
						var handle_pos = division_info[i-1].handle_pos === 'R' ? 'right' : 'left';
						$("#handle_pos"+i).val(handle_pos);
						$("#div_hebe"+i).val(division_info[i-1].div_hebe);
					}
					//수량 설정
					$("#blind_qty").val(info_ord_qty['qty']).prev().addClass('active');
				}else{
					//좌 , 우 설정
					$("#blind_left_qty").val(info_ord_qty['left_qty']).prev().addClass('active');
					$("#blind_right_qty").val(info_ord_qty['right_qty']).prev().addClass('active');
				}

				//옵션1 , 옵션2 설정
				if(info_option['op1_nm'] !== "") $("#blind_option1 option:eq(1)").prop("selected", true);
				if(info_option['op2_nm'] !== "") $("#blind_option2 option:eq(1)").prop("selected", true);

				//손잡이 , 줄길이 설정
				$("#blind_handle").val(info_ord_spec['handle']);
				$("#blind_len").val(info_ord_spec['len']);

				//할인 설정
				$("#blind_update_unit").val(info_option['update_unit']);
				if(info_option['update_amt'] !== ''){
					$("#blind_update_amt").val(info_option['update_amt']).prev().addClass('active');
				}else{
					$("#blind_update_amt").val('').prev().removeClass('active');
				}

				//공장지시사항 설정
				if(info.fac_text !== ''){
					$("#blind_fac_text").val(info.fac_text).prev().addClass('active');
				}else{
					$("#blind_fac_text").val('').prev().removeClass('active');
				}

				//폼 보여주기
				$("#blind_counter").show();
				$("#curtain_counter").hide();
				$("#ea_counter").hide();
			}else if(info_ord_spec['unit'] === '006' || info_ord_spec['unit'] === '007'){	//야드 or 폭 일 경우
				//기본설정
				$("#curtain_work_way").val(info_ord_spec['work_way']);	//가공방법(평주름 , 나비주름)
				$("#curtain_usage").val(info_ord_spec['usage']);		//추천원단사용량(1.0 ~ 3.0)
				$("#curtain_base_st").val(info_ord_spec['base_st']);	//기본형상(Y,N)
				$("#curtain_div_gb").val(info_ord_spec['div_gb']);		//분할방법(양개,편개)

				//야드 , 폭 공통부분
				$("#curtain_max_width").val('');	//한계 가로치수
				$("#curtain_max_height").val('');	//한계 세로치수
				$("#curtain_base_amt").val(info_ord_spec['base_amt']);		//형상금액
				$("#curtain_purc_base_amt").val(info_ord_spec['purc_base_amt']);		//형상금액

				//위치 설정
				$("#curtain_place").val(info_ord_spec['place']).prev().addClass('active');

				//가로 , 세로 설정
				$(".ord_width").val(info_ord_spec['ord_width']).prev().addClass('active');
				$(".ord_height").val(info_ord_spec['ord_height']).prev().addClass('active');

				if(info_ord_spec['unit'] === '006'){
					$('.curtain_unit_nm').html('야드');	//단위명 설정

					$('#curtain_ord_yard').val(info_ord_spec['ord_yard']);

					//자동 계산 => 야드
					$("#curtain_acn").val(info_ord_spec['yard']).prev().addClass('active');

				}else if(info_ord_spec['unit'] === '007'){
					$('.curtain_unit_nm').html('폭');	//단위명 설정

					$("#curtain_width_len").val(info_ord_spec['width_len']);		//원단 폭 규격
					$("#curtain_height_len").val(info_ord_spec['height_len']);	//세로길이 제한
					$("#curtain_height_unit").val(info_ord_spec['height_unit']);	//세로길이 제한단위
					$("#curtain_height_op1").val(info_ord_spec['height_op1']);	//세로길이 cm당
					$("#curtain_height_op2").val(info_ord_spec['height_op2']);	//세로길이 %

					$('#curtain_ord_pok').val(info_ord_spec['ord_pok']);

					//자동 계산 => 폭
					$("#curtain_acn").val(info_ord_spec['pok']).prev().addClass('active');

				}

				//색상
				$("#curtain_color").val(info_ord_spec['color']);
				//기둥 색상 - 2022-05-23 17:58 수정
				var outside_color = info.item_nm.replace(info.base_item_nm+' ' , '');
				$("#curtain_outside_color").val(outside_color).prev().addClass('active');
				if(info_ord_spec['color'] === 'two'){
					//기둥
					$("#curtain_outside_acn").val(info_ord_spec['outside_num']).prev().addClass('active');

					var inside_str = '<option value="">색상_없음</option>';
					inside_str += '<option value="'+ info_ord_spec['inside_color'] +'">'+ info_ord_spec['inside_color'] +'</option>';
					$.each(res.data.color_info , function (i , list) {
						if(list.color !== info_ord_spec['inside_color']){
							inside_str += '<option value="'+ list.color +'">'+ list.color +'</option>';
						}
					});

					//안쪽
					$("#curtain_inside_color").html(inside_str).val(info_ord_spec['inside_color']);
					$("#curtain_inside_acn").val(info_ord_spec['inside_num']).prev().addClass('active');
					//활성화
					$(".two_tone").show();
				}

				//수량
				$("#curtain_qty").val(info_ord_qty['qty']).prev().addClass('active');

				//옵션1 , 옵션2 설정
				if(info_option['op1_nm'] !== "") $("#curtain_option1 option:eq(1)").prop("selected", true);
				if(info_option['op2_nm'] !== "") $("#curtain_option2 option:eq(1)").prop("selected", true);

				//할인 설정
				$("#curtain_update_unit").val(info_option['update_unit']);
				if(info_option['update_amt'] !== ''){
					$("#curtain_update_amt").val(info_option['update_amt']).prev().addClass('active');
				}else{
					$("#curtain_update_amt").val('').prev().removeClass('active');
				}

				//공장지시사항 설정
				if(info.fac_text !== ''){
					$("#curtain_fac_text").val(info.fac_text).prev().addClass('active');
				}else{
					$("#curtain_fac_text").val('').prev().removeClass('active');
				}

				//폼 보여주기
				$("#blind_counter").hide();
				$("#curtain_counter").show();
				$("#ea_counter").hide();
			}else if(info_ord_spec['unit'] === '005' || info_ord_spec['unit'] === '011'){	//EA or Box 일 경우
				//최소주문수량
				$("#ea_min_qty").val('');
				
				//위치 설정
				$("#ea_place").val(info_ord_spec['place']).prev().addClass('active');

				//수량 설정
				$("#ea_qty").val(info_ord_qty['qty']).prev().addClass('active');

				//옵션1 , 옵션2 설정
				if(info_option['op1_nm'] !== "") $("#ea_option1 option:eq(1)").prop("selected", true);
				if(info_option['op2_nm'] !== "") $("#ea_option2 option:eq(1)").prop("selected", true);

				//할인 설정
				$("#ea_update_unit").val(info_option['update_unit']);
				if(info_option['update_amt'] !== ''){
					$("#ea_update_amt").val(info_option['update_amt']).prev().addClass('active');
				}else{
					$("#ea_update_amt").val('').prev().removeClass('active');
				}

				//공장지시사항 설정
				if(info.fac_text !== ''){
					$("#ea_fac_text").val(info.fac_text).prev().addClass('active');
				}else{
					$("#ea_fac_text").val('').prev().removeClass('active');
				}

				//폼 보여주기
				$("#blind_counter").hide();
				$("#curtain_counter").hide();
				$("#ea_counter").show();
			}

			manage_data(info_ord_spec['unit']);

			$("#btn_add_ord").hide();
			$("#btn_upd_ord").show();

			//팝업 열기
			$('.new_ord').bPopup({
				modalClose: true,
				opacity: 0.8,
				positionStyle: 'absolute',
				speed: 300,
				transition: 'fadeIn',
				transitionClose: 'fadeOut',
				zIndex: 99997
				//, modalColor:'transparent'
			});
		}).fail(fnc_ajax_fail);
}

/**
 * @description 제품 수정버튼 함수
 * @author 황호진  @version 1.0, @last update 2022/03/22
 */
function ord_reg_mod(unit , button_type) {
	var url = "/ord/ord_reg_pop/ord_reg_mod";
	var type = "POST";
	var data = {
		'gb'	: {
			'unit'			: unit,
			'site_name'		: $("#site_name").val(),
			'vat'			: $("input[name=vat]:checked").val(),		//부가세 여부
			'ord_gb'		: $("input[name=ord_gb]:checked").val(),	//주문 , 발주 구분
			'dlv_dt'		: $("#dlv_dt").val(),	//출고일(acc_save에 사용)
			'rec_gb'		: $("#rec_gb").val(),	//접수처
		},
		'detail_frm'	: {
			'sub_local_cd'	: $(".common_sub_local_cd").val(),
			'cust_cd'		: $(".common_cust_cd").val(),
			'cust_nm'		: $(".common_cust_nm").val(),
			'ord_no'		: $("#ord_no").val(),
			'ord_seq'		: $(".common_ord_seq").val(),
			'item_cd'		: $(".common_item_cd").val(),
			'item_nm'		: $(".common_item_nm").val(),
			'proc_gb'		: $(".common_proc_gb").val(),
			'work_gb'		: $(".common_work_gb").val(),	//작업구분
			'pd_cd'			: $(".common_pd_cd").val(),
			'item_lv'		: $(".common_item_lv").val(),
			'item_lv_nm'	: $(".common_item_lv_nm").val(),
			'buy_cd'		: $(".common_buy_cd").val(),
			'unit_amt'		: $(".common_amt").val(),
			'ord_amt'		: $('#ord_amt').val(),			//금액
			'tax_amt'		: $('#tax_amt').val(),			//세액
			'buy_unit_amt'	: $(".common_unit_amt").val(),	//매입단가
			'buy_ord_amt'	: $('#buy_ord_amt').val(),		//매입금액
			'buy_tax_amt'	: $('#buy_tax_amt').val(),		//매입세액
		}
	};
	//JSON 형태 정리할 목록들
	var item_gb = {} , option = {}, ord_spec = {} , ord_qty = {} , div_info = {} , amt_spec = {} , buy_amt_spec = {};
	if(unit === '001' || unit === '002'){
		//블라인드 추가분류 설정???
		item_gb['item_gb'] = $('.common_item_gb').val();;
		//옵션 , 금액조정 설정
		option	= organize_option('blind_option1' , option , 'op1_nm' , 'op1_unit' , 'op1_amt');
		option	= organize_option('blind_option2' , option , 'op2_nm' , 'op2_unit' , 'op2_amt');
		option['update_unit'] 	= $("#blind_update_unit").val();
		if($("#blind_update_unit").val() === ''){	//할인_없음이 선택되어 있을 때!
			option['update_amt'] 	= '';
		}else{
			option['update_amt'] 	= $("#blind_update_amt").val() === '' ? '' : $("#blind_update_amt").val();
		}
		//분할수량 값 가져오기
		var division = Number($("#blind_division").val());
		//규격 설정
		ord_spec['size'] 		= Number($(".common_size").val());	//판매규격
		ord_spec['unit'] 		= unit;								//단위
		ord_spec['division'] 	= division;							//분할
		ord_spec['ord_width'] 	= Number($(".ord_width").val());	//가로길이
		ord_spec['ord_height'] 	= Number($(".ord_height").val());	//세로길이
		ord_spec['ord_hebe']	= $("#blind_ord_hebe").val();		//총회베
		ord_spec['place'] 		= $("#blind_place").val() === "" ? "기타" : $("#blind_place").val();//위치
		ord_spec['handle']		= $("#blind_handle").val();			//손잡이
		ord_spec['len']			= $("#blind_len").val();			//줄길이
		//분할있을때...
		if(division > 1){
			var div_left_qty = 0;
			var div_right_qty = 0;
			var blind_qty = Number($("#blind_qty").val());
			for(let i = 1, j = 1; i <= division * blind_qty; i++ , j++){
				//분할 가로 세로 설정
				div_info['div_width'+i] 	= Number($("#div_width"+j).val());
				div_info['div_height'+i] 	= Number($("#div_height"+j).val());
				//회배 설정
				div_info['div_hebe'+i] 	= Number($("#div_hebe"+j).val());
				//위치 및 수량 설정
				if($("#handle_pos"+j).val() === 'right'){
					div_info['handle_pos'+i] = 'R';
					div_right_qty++;
				}else{
					div_info['handle_pos'+i] = 'L';
					div_left_qty++;
				}
				//초기화
				if(division === j){
					j = 0;
				}
			}

			//수량 설정
			ord_qty['left_qty'] = div_left_qty;
			ord_qty['right_qty'] = div_right_qty;
			ord_qty['qty'] = blind_qty;
		}else{

			//수량 설정
			ord_qty['left_qty'] = Number($("#blind_left_qty").val());	//좌
			ord_qty['right_qty'] = Number($("#blind_right_qty").val());	//우
		}
		//JSON 설정
		data['detail_frm']['fac_text'] 	= $('#blind_fac_text').val();	//공장지시사항
		data['detail_frm']['div_info'] 	= JSON.stringify(div_info);		//JSON[분할 정보]

	}else if(unit === '006' || unit === '007'){
		//커튼 추가분류 설정???
		item_gb['item_gb'] = $('.common_item_gb').val();
		//옵션 , 금액조정 설정
		option	= organize_option('curtain_option1' , option , 'op1_nm' , 'op1_unit' , 'op1_amt');
		option	= organize_option('curtain_option2' , option , 'op2_nm' , 'op2_unit' , 'op2_amt');
		option['update_unit'] 	= $("#curtain_update_unit").val();
		if($("#curtain_update_unit").val() === ''){	//할인_없음이 선택되어 있을 때!
			option['update_amt'] 	= '';
		}else{
			option['update_amt'] 	= $("#curtain_update_amt").val() === '' ? '' : $("#curtain_update_amt").val();
		}
		//규격 설정
		ord_spec['size'] 		= Number($(".common_size").val());					//판매규격
		ord_spec['unit'] 		= unit;												//단위
		ord_spec['ord_width'] 	= Number($(".ord_width").val());					//가로길이
		ord_spec['ord_height'] 	= Number($(".ord_height").val());					//세로길이
		ord_spec['place'] 		= $("#curtain_place").val() === "" ? "기타" : $("#curtain_place").val();//위치
		ord_spec['work_way'] 	= $("#curtain_work_way").val();						//가공방법
		ord_spec['usage'] 		= $("#curtain_usage").val();						//원단사용량
		ord_spec['color'] 		= $("#curtain_color").val();						//색상
		ord_spec['base_st'] 	= $("#curtain_base_st").val();						//형상선택
		ord_spec['base_amt'] 	= Number($("#curtain_base_amt").val());				//형상금액
		ord_spec['purc_base_amt'] 	= Number($("#curtain_purc_base_amt").val());	//매입형상금액
		ord_spec['div_gb'] 		= $("#curtain_div_gb").val();						//분할

		if(unit === '006'){
			// 개별 야드
			ord_spec['yard']		= Number($("#curtain_acn").val());
			// 총 야드
			ord_spec['ord_yard']	= Number($("#curtain_ord_yard").val());
		}else if(unit === '007'){
			// 개별 폭
			ord_spec['pok']			= Number($("#curtain_acn").val());
			// 총 폭
			ord_spec['ord_pok']		= Number($("#curtain_ord_pok").val());

			ord_spec['width_len']	= Number($("#curtain_width_len").val());	//원단 폭 규격
			ord_spec['height_len']	= Number($("#curtain_height_len").val());	//세로길이 제한
			ord_spec['height_unit']	= $("#curtain_height_unit").val();			//세로길이 제한단위
			ord_spec['height_op1']	= Number($("#curtain_height_op1").val());	//세로길이 cm당
			ord_spec['height_op2']	= Number($("#curtain_height_op2").val());	//세로길이 cm당 %수치
		}

		if(ord_spec['color'] === 'two'){
			ord_spec['outside_color']	= $("#curtain_outside_color").val();
			ord_spec['outside_num']		= Number($("#curtain_outside_acn").val());
			ord_spec['inside_color']	= $("#curtain_inside_color").val();
			ord_spec['inside_num']		= Number($("#curtain_inside_acn").val());
		}

		//수량 설정
		ord_qty['qty'] = Number($("#curtain_qty").val());
		//JSON 설정
		data['detail_frm']['fac_text'] 	= $('#curtain_fac_text').val();	//공장지시사항
	}else if(unit === '005' || unit === '011'){
		//커튼 추가분류 설정???
		item_gb['item_gb'] = $('.common_item_gb').val();;

		option	= organize_option('ea_option1' , option , 'op1_nm' , 'op1_unit' , 'op1_amt');
		option	= organize_option('ea_option2' , option , 'op2_nm' , 'op2_unit' , 'op2_amt');

		if($("#ea_update_unit").val() === ''){	//할인_없음이 선택되어 있을 때!
			option['update_amt'] 	= '';
		}else{
			option['update_amt'] 	= $("#ea_update_amt").val() === '' ? '' : $("#ea_update_amt").val();
		}

		//규격 설정
		ord_spec['size'] 		= Number($(".common_size").val());	//판매규격
		ord_spec['place']		= $("#ea_place").val() === "" ? "기타" : $("#ea_place").val();//위치
		ord_spec['unit'] 		= unit;								//단위

		//수량
		ord_qty['qty'] = $('#ea_qty').val();
		//JSON 설정
		data['detail_frm']['fac_text'] 	= $('#ea_fac_text').val();	//공장지시사항
	}

	//금액 설정
	amt_spec['prd_amt'] = $('#indi_prd_amt').val();
	amt_spec['prd_tax'] = $('#indi_prd_tax').val();
	amt_spec['base_amt'] = $('#indi_base_amt').val();
	amt_spec['base_tax'] = $('#indi_base_tax').val();
	amt_spec['height_amt'] = $('#indi_height_amt').val();
	amt_spec['height_tax'] = $('#indi_height_tax').val();
	amt_spec['op1_amt'] = $('#indi_op1_amt').val();
	amt_spec['op1_tax'] = $('#indi_op1_tax').val();
	amt_spec['op2_amt'] = $('#indi_op2_amt').val();
	amt_spec['op2_tax'] = $('#indi_op2_tax').val();

	//매입 금액 설정
	buy_amt_spec['prd_amt'] = $('#bi_prd_amt').val();
	buy_amt_spec['prd_tax'] = $('#bi_prd_tax').val();
	buy_amt_spec['base_amt'] = $('#bi_base_amt').val();
	buy_amt_spec['base_tax'] = $('#bi_base_tax').val();
	buy_amt_spec['height_amt'] = $('#bi_height_amt').val();
	buy_amt_spec['height_tax'] = $('#bi_height_tax').val();
	buy_amt_spec['op1_amt'] = $('#bi_op1_amt').val();
	buy_amt_spec['op1_tax'] = $('#bi_op1_tax').val();
	buy_amt_spec['op2_amt'] = $('#bi_op2_amt').val();
	buy_amt_spec['op2_tax'] = $('#bi_op2_tax').val();

	data['detail_frm']['item_gb'] 	= JSON.stringify(item_gb);		//JSON[추가 분류]
	data['detail_frm']['option'] 	= JSON.stringify(option);		//JSON[옵션/할인 리스트]
	data['detail_frm']['ord_spec'] 	= JSON.stringify(ord_spec);		//JSON[주문 상세 스펙]
	data['detail_frm']['ord_qty'] 	= JSON.stringify(ord_qty);		//JSON[수량]
	data['detail_frm']['amt_spec'] = JSON.stringify(amt_spec);		//JSON[금액]
	data['detail_frm']['buy_amt_spec'] = JSON.stringify(buy_amt_spec);	//JSON[매입금액]

	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');

				get_ord_prd_list(res.ord_no);

				if(button_type === 'A'){
					ord_pop_close();
				}else if(button_type === 'B'){
					re_ord_prd();
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 동일제품재주문일때 실행하는 함수
 * @author 황호진  @version 1.0, @last update 2022/03/22
 */
function re_ord_prd() {
	//폼 리셋
	$('#ord_blind_frm')[0].reset();
	$('#ord_curtain_frm')[0].reset();
	$('#ord_ea_frm')[0].reset();
	//active 제거
	$('.new_ord input').prev().removeClass('active');
	//폼 리셋에 따른 이벤트 호출
	$("#blind_division").trigger('change');

	//구분값이 되는 ord_seq 초기화
	$(".common_ord_seq").val('');

	//야드 , 폭 , EA 경우에는 수량 1로 유지 작업!
	var unit = $(".common_unit").val();
	if(unit === '006' || unit === '007'){	//yard , 폭
		$('#curtain_qty').val(1);
	}else if(unit === '005' || unit === '011'){	//EA , BOX
		$('#ea_qty').val(1);
	}

	//버튼 구분 변경
	$("#btn_add_ord").show();
	$("#btn_upd_ord").hide();
}

/**
 * @description 분할 상세보기
 * @author 황호진  @version 1.0, @last update 2021/11/30
 */
function bunhal_detail(id , ord_no , ord_seq) {
	var url = '/ord/ord_reg_pop/bunhal_detail';
	var type = 'GET';
	var data = {
		'ord_no'	: ord_no,
		'ord_seq'	: ord_seq,
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(g_bunhal_flag){
				var str = '';
				$.each(res.data, function (i, list) {
					var pos;
					if(list.handle_pos === 'R'){
						pos = '우';
					}else{
						pos = '좌';
					}
					str += '<div>'+Number(i+1)+'. 가로 : '+list.div_width+'cm 세로 : '+list.div_height+'cm 위치 : '+pos+' ('+ list.div_hebe +'회배)</div>';
				});

				$('.bunhal_detail').html(str).show();

				var id_info = document.getElementById(id); // 요소의 id 값이 target이라 가정
				var id_rect = id_info.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
				var target_info = document.getElementById('bunhal_detail');
				var target_rect = target_info.getBoundingClientRect();
				var top = id_rect.top - (target_rect.height - 15);
				var left = id_rect.right;

				$('.bunhal_detail').css({"top": top+"px", "left": left+"px"});
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 분할 상세보기
 * @author 황호진  @version 1.0, @last update 2021/11/30
 */
function color_detail(id , ord_no , ord_seq) {
	var url = '/ord/ord_reg_pop/color_detail';
	var type = 'GET';
	var data = {
		'ord_no'	: ord_no,
		'ord_seq'	: ord_seq,
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(g_color_flag){
				var unit_nm;
				if(res.data.unit === '006'){
					unit_nm = '야드'
				}else if(res.data.unit === '007'){
					unit_nm = '폭'
				}
				var str = '<div>기둥 : '+ res.data.outside_color +' , '+ unit_nm +' : '+ res.data.outside_num +'</div>';
				str += '<div>안쪽 : '+ res.data.inside_color +' , '+ unit_nm +' : '+ res.data.inside_num +'</div>';

				$('.color_detail').html(str).show();

				var id_info = document.getElementById(id); // 요소의 id 값이 target이라 가정
				var id_rect = id_info.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
				var target_info = document.getElementById('color_detail');
				var target_rect = target_info.getBoundingClientRect();
				var top = id_rect.top - (target_rect.height - 15);
				var left = id_rect.right;

				$('.color_detail').css({"top": top+"px", "left": left+"px"});
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 저장할 옵션 데이터 저장방식
 * @author 황호진  @version 1.0, @last update 2022/04/01
 */
function organize_option(target , result , nm , unit , amt) {
	result[nm] = $("#"+target).val();
	if(result[nm] !== ""){
		var data = $("#"+target+" option:selected").data();
		result[unit] = data['unit'];
		result[amt] = data['amt'];
	}else{
		result[unit] = '';
		result[amt] = '';
	}
	return result;
}

/**
 * @description 사장님 요청사항 2022-05-04 제작 상태가 전송 이상인 건에 한해서 삭제시 메세지 보여주기!
 * @author 황호진  @version 1.0, @last update 2022/05/04
 */
function msg_cannot_del() {
	toast('중앙현황에서 강제취소 후 삭제해주시길 바랍니다.', true, 'danger');
}

/**
 * @description 반품취소
 * @author 황호진  @version 1.0, @last update 2022-07-01
 */
function return_cancel(arg) {
	var con = custom_fire('확인창' , '반품취소 하시겠습니까?' , '취소' , '확인');
	con.then((result) => {
		if (result.isConfirmed) {
			arg = JSON.parse(decodeURIComponent(arg)); // 필수
			var url = '/ord/ord_reg_pop/return_cancel';
			var type = 'POST';
			var data = {
				'ord_no'	: arg['ord_no'],
				'ord_seq'	: arg['ord_seq']
			};
			fnc_ajax(url , type , data)
				.done(function (res) {
					console.log(res);
					if(res.result){
						toast(res.msg, false, 'info');
						get_ord_prd_list(arg['ord_no']);
					}else{
						toast(res.msg, true, 'danger');
					}
				}).fail(fnc_ajax_fail);
		}
	});
}
