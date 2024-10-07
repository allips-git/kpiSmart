/*================================================================================
 * @name: 황호진 - ord_mod_pop.js	주문 수정 팝업
 * @version: 1.0.0, @date: 2021-12-01
 ================================================================================*/
var is_loading = 1;
$(function () {
	/**
	 * @description 수정팝업용 제품추가 팝업의 옵션 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$("select[name='mod_option1'] , select[name='mod_option2'] , select[name='mod_option3']").on('change' , function () {
		var v = $(this).val();
		if(v !== ''){
			var amt = $(this).find('option:selected').attr('data-amt');
			var unit = $(this).find('option:selected').attr('data-unit');
			$(this).next().html(unit+amt+'원');
		}else{
			$(this).next().html('');
		}
		var amt_flag = mod_calc_yn();
		if(amt_flag){
			mod_total_amt_calc();
		}
	});

	/**
	 * @description 수정팝업용 selectbox 쿠폰 선택값이 바뀌었을때 발생
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$('select[name="mod_coupon"]').on('change' , function () {
		var amt_flag = mod_calc_yn();
		if(amt_flag){
			mod_total_amt_calc();
		}
	});

	/**
	 * @description 수정팝업용 제품추가 팝업의 분할방식 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$("#mod_division").on('change' , function () {
		var num = $(this).val();
		if(num > 1){
			var division_str = '';
			for(let i = 1; i <= num; i++){
				division_str += '<p>';
				division_str += '<input type="hidden" id="mod_div_hebe'+i+'" name="mod_div_hebe'+i+'">';
				division_str += i+'.'+'<span>가로 : <input type="text" id="mod_div_width'+i+'" name="mod_div_width'+i+'" class="w10 mod_division_w_class" autocomplete="off"> cm</span>';
				division_str += '<span>세로 : <input type="text" id="mod_div_height'+i+'" name="mod_div_height'+i+'" class="w10 mod_division_h_class" autocomplete="off" readonly> cm</span>';
				division_str += '<span>위치 : ';
				division_str += '<select name="mod_position_'+i+'" id="mod_position_'+i+'">';
				if(i % 2 === 0){
					division_str += '<option value="right">우</option>';
					division_str += '<option value="left" selected>좌</option>';
				}else{
					division_str += '<option value="right" selected>우</option>';
					division_str += '<option value="left">좌</option>';
				}
				division_str += '</select>';
				division_str += '</span>';
				division_str += '</p>';
			}
			$("#mod_division_btn").show();	//균등분할 , 초기화 버튼 활성화
			$("#mod_division_list").html(division_str).parent().show();	//분할 html 설정후 활성화
			$("#mod_division_pre").hide();	//수량(좌) , 수량(우) 숨기기
			$("#mod_division_post").show();	//수량 보이기
			$("#mod_blind_qty").val(1);
			mod_division_setting();
			//분할 설정 후 필요 입력값이 다 입력되어 있다면 금액 계산
			var amt_flag = mod_calc_yn();
			if(amt_flag){
				mod_total_amt_calc();
			}
		}else{
			$("#mod_division_btn").hide();	//균등분할 , 초기화 비활성화
			$("#mod_division_list").html("").parent().hide();			//분할 html 초기화후 비활성화
			$("#mod_division_pre").show();	//수량(좌) , 수량(우) 보이기
			$("#mod_division_post").hide();	//수량 숨기기
			$("#mod_left_qty").val('');
			$("#mod_right_qty").val('');

			mod_amt_frm_reset('hebe');
		}
	});

	/**
	 * @description 수정팝업용 세로길이가 변경되었을때 분할된 입력폼에 다 입력
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$("#mod_ord_height").on('input' , function () {
		var v = $(this).val();
		$('.mod_division_h_class').val(v);
	});

	/**
	 * @description 수정팝업용 재분할
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$("#mod_re_division").on('click' , function () {
		mod_division_setting();
	});

	/**
	 * @description 수정팝업용 가로길이 입력후 포커스 벗어날경우 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$('#mod_ord_width').focusout(function() {
		$("#mod_re_division").click();
	});

	/**
	 * @description 수정팝업용 분할 입력폼에 가로길이 입력시 가로길이 총합 다시 계산
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$(document).on('input' , '.mod_division_w_class' , function () {
		var num = $("#mod_division").val();
		var sum = 0;
		for(let i = 1 ; i <= num; i++){
			var v = Number(document.getElementById('mod_div_width'+i).value);
			sum = sum + v;
		}
		$("#mod_ord_width").val(Number(sum.toFixed(1)));
	});

	/**
	 * @description 수정팝업용 분할 초기화
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$("#mod_reset_division").on('click' , function () {
		var con = confirm('초기화 하시겠습니까?');
		if(con){
			$("#mod_division option:eq(0)").prop("selected", true).trigger('change');
		}
	});

	/**
	 * @description 수정팝업용 EA , BOX 일때 포커스아웃될때 계산
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$('#mod_ea_qty').on('input , focusout',function() {
		if(Number($("#mod_ea_qty").val()) !== 0){
			mod_total_amt_calc();
		}else{
			mod_amt_frm_reset('ea');
		}
	});

	/**
	 * @description ord_pop 닫기
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$("#ord_mod_pop_close").on('click' , function () {
		$('.ord_mod_pop').bPopup().close();
	});

	/**
	 * @description 수정팝업용 숫자 및 소수점 입력
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$(document).on('input' , '#mod_ord_width , #mod_ord_height , .mod_division_w_class , .mod_division_h_class' ,function () {
		$(this).val($(this).val().replace(/[^0-9.]/gi,""));
	});

	/**
	 * @description 수정팝업용 숫자 입력
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$(document).on('input' , '#mod_ea_qty , #mod_left_qty , #mod_right_qty , #mod_blind_qty' ,function () {
		$(this).val($(this).val().replace(/[^0-9]/gi,""));
	});

	/**
	 * @description 수정팝업용 회배 , m2일때 입력값 검증 및 계산식
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$(document).on('input , focusout','#mod_left_qty , #mod_right_qty , #mod_blind_qty , #mod_ord_width , #mod_ord_height , .mod_division_w_class , .mod_division_h_class',function () {
		var amt_flag = mod_calc_yn();
		if(amt_flag){
			mod_total_amt_calc();
		}else{
			mod_amt_frm_reset('hebe');
		}
	});

	/**
	 * @description 수정팝업용 줄길이 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/12/02
	 */
	$("#mod_len").on('change' , function () {
		var len = $(this).val();
		if(len === '0'){
			$("#mod_len_self").show().focus();
		}else{
			$("#mod_len_self").val('').hide();
		}
	});

	$("#one_ord_mod_btn").on('click' , function () {
		var mod_form = $('.mod_form').val();
		var amt_flag = mod_ord_popup_input_check(mod_form);
		if(amt_flag){
			var con = confirm('수정하시겠습니까?');
			if(con){
				one_ord_mod();
			}
		}
	});

	/**
	 * @description 옵션 추가 버튼
	 * @author 황호진  @version 1.0, @last update 2021/11/30
	 */
	$(".mod_option_add_btn").on('click' , function () {
		$(this).parent().parent().next().show();
	});

	/**
	 * @description 옵션 삭제 버튼
	 * @author 황호진  @version 1.0, @last update 2021/11/30
	 */
	$(".mod_option_remove_btn").on('click' , function () {
		var target = $(this).attr('data-text');

		var flag = false;
		var n = 0;
		if(target === 'option2'){
			var len = $('.mod_option3').length;
			for(var i = 0 ; i < len; i++){
				if($('.mod_option3').eq(i).parent().parent().css('display') === 'block'){
					flag = true;
					n = i;
					break;
				}
			}
			target = 'option3';
		}

		$(".mod_"+target).html('');
		$("select[name='mod_"+target+"']").val('');
		if(flag){
			$('.mod_option3').eq(n).parent().parent().hide();
		}else{
			$(this).parent().parent().hide();
		}
		var amt_flag = mod_calc_yn();
		if(amt_flag){
			mod_total_amt_calc();
		}
	});

	/**
	 * @description 금액조정단위 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/12/07
	 */
	$('select[name="mod_update_unit"]').on('change' , function () {
		var amt_flag = mod_calc_yn();
		if(amt_flag){
			mod_total_amt_calc();
		}
	});

	/**
	 * @description 금액조정 포커스아웃 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/12/07
	 */
	$('input[name="mod_update_amt"]').focusout(function() {
		var amt_flag = mod_calc_yn();
		if(amt_flag){
			mod_total_amt_calc();
		}
	});
});
/**
 * @description 제품수정 팝업 열기
 * @author 황호진  @version 1.0, @last update 2021/12/02
 */
function ord_mod_pop(arg) {
	arg = JSON.parse(decodeURIComponent(arg)); // 필수

	var url = '/ord/ord_list/get_one_ord_for_mod';
	var type = 'GET';
	var data = {
		cust_cd		: arg['cust_cd'],
		ord_no		: arg['ord_no'],
		ord_seq		: arg['ord_seq']
	};

	fnc_ajax(url , type , data)
		.done(function (res) {

			//분할로 일어난 이벤트 제거
			$("#mod_division option:eq(0)").prop("selected", true).trigger('change');
			$("#mod_len option:eq(0)").prop("selected", true).trigger('change');

			//회배 , EA폼 리셋
			$('#ord_blind_mod_frm')[0].reset();
			$('#ord_ea_mod_frm')[0].reset();

			var ord_info 	= res.data.ord_info;
			var option 		= res.data.option;

			var get_item_gb 	= JSON.parse(ord_info.item_gb);
			var get_option 		= JSON.parse(ord_info.option);
			var get_ord_qty 	= JSON.parse(ord_info.ord_qty);
			var get_ord_spec 	= JSON.parse(ord_info.ord_spec);

			if(ord_info.item_unit !== get_ord_spec.unit){
				toast('주문 등록된 단위와 해당 제품의 단위가 달라서 수정이 불가능합니다. 삭제 후 다시 등록하시길 바랍니다.', true, 'danger');
				return false;
			}

			$(".mod_cust_cd").val(arg['cust_cd']);
			$(".mod_ord_no").val(arg['ord_no']);
			$(".mod_ord_seq").val(arg['ord_seq']);
			$(".mod_rec_gb").val(ord_info.rec_gb);
			$(".mod_item_cd").val(ord_info.item_cd);
			$(".mod_form").val(get_ord_spec.unit);
			$(".mod_proc_gb").val(ord_info.proc_gb);
			$(".mod_pd_cd").val(ord_info.pd_cd);
			$(".mod_finyn").val(ord_info.finyn);
			$(".mod_unit_amt").val(ord_info.amt);
			$(".mod_size").val(ord_info.size);

			//제품정보 설정
			var sell_price = Number(ord_info.amt).toLocaleString('ko-KR');
			var ord_str = '<strong>'+ord_info.item_nm+' ('+ord_info.item_cd+')</strong>';
			ord_str += '<span>판매 단가: '+sell_price+' 원</span><span>기본 단위: '+Number(ord_info.size)+' '+ord_info.unit_nm+'</span>';
			$(".mod_ord_info").html(ord_str);

			//샷시
			$("select[name='mod_item_gb']").val(get_item_gb.item_gb);

			//option_setting 함수 경로 : /public/js/dev/ord_reg_popup.js
			option_setting('옵션1_선택' , 'mod_option1' , option);
			option_setting('옵션2_선택' , 'mod_option2' , option);
			option_setting('옵션3_선택' , 'mod_option3' , option);
			$("select[name='mod_option1']").val(get_option.option1).trigger('change');
			$("select[name='mod_option2']").val(get_option.option2).trigger('change').parent().parent().hide();
			$("select[name='mod_option3']").val(get_option.option3).trigger('change').parent().parent().hide();

			if(get_option.option3 !== ''){
				$("select[name='mod_option2']").parent().parent().show();
				$("select[name='mod_option3']").parent().parent().show();
			}else if(get_option.option2 !== ''){
				$("select[name='mod_option2']").parent().parent().show();
			}

			//쿠폰
			$("select[name='mod_coupon']").val(get_option.coupon).trigger('change');
			//금액조정
			$("select[name='mod_update_unit']").val(get_option.update_unit);
			$("input[name='mod_update_amt']").val(get_option.update_amt);
			//메모
			$("input[name='mod_memo']").val(ord_info.memo);

			if(get_ord_spec.unit === '001' || get_ord_spec.unit === '002'){
				//회배 폼
				//가로
				$("#mod_ord_width").val(get_ord_spec.ord_width);
				//세로
				$("#mod_ord_height").val(get_ord_spec.ord_height);

				//분할
				$("#mod_division").val(get_ord_spec.division);

				if(get_ord_spec.division === 1){	//분할X
					//가로수량
					$("#mod_left_qty").val(get_ord_qty.left_qty);
					//세로수량
					$("#mod_right_qty").val(get_ord_qty.right_qty);


					$("#mod_division_btn").hide();	//균등분할 , 초기화 비활성화
					$("#mod_division_pre").show();	//수량(좌) , 수량(우) 보이기
					$("#mod_division_post").hide();	//수량 숨기기
				}else{							//분할O
					//수량
					$("#mod_blind_qty").val(get_ord_qty.qty);
					//console.log(res.data.division_info , get_ord_spec.division);
					var division_str = '';
					for(let i = 1; i <= get_ord_spec.division; i++){
						division_str += '<p>';
						division_str += '<input type="hidden" id="mod_div_hebe'+i+'" name="mod_div_hebe'+i+'" value="'+res.data.division_info[i-1].div_hebe+'">';
						division_str += i+'.'+'<span>가로 : <input type="text" id="mod_div_width'+i+'" name="mod_div_width'+i+'" class="w10 mod_division_w_class" autocomplete="off" value="'+res.data.division_info[i-1].div_width+'"> cm</span>';
						division_str += '<span>세로 : <input type="text" id="mod_div_height'+i+'" name="mod_div_height'+i+'" class="w10 mod_division_h_class" autocomplete="off" value="'+res.data.division_info[i-1].div_height+'" readonly> cm</span>';
						division_str += '<span>위치 : ';
						division_str += '<select name="mod_position_'+i+'" id="mod_position_'+i+'">';
						if(res.data.division_info[i-1].handle_pos === 'L'){
							division_str += '<option value="right">우</option>';
							division_str += '<option value="left" selected>좌</option>';
						}else{
							division_str += '<option value="right" selected>우</option>';
							division_str += '<option value="left">좌</option>';
						}
						division_str += '</select>';
						division_str += '</span>';
						division_str += '</p>';

					}
					$("#mod_division_list").html(division_str).parent().show();	//분할 html 설정후 활성화

					$("#mod_division_btn").show();	//균등분할 , 초기화 버튼 활성화
					$("#mod_division_pre").hide();	//수량(좌) , 수량(우) 숨기기
					$("#mod_division_post").show();	//수량 보이기

				}

				//손잡이
				$("#mod_handle").val(get_ord_spec.handle);
				//타입
				$("#mod_type").val(get_ord_spec.type);
				//위치
				$("#mod_place").val(get_ord_spec.place);

				//줄길이-------------------------------------------------
				var mod_len_exists = true;
				$('#mod_len').each(function(){
					if (this.value == get_ord_spec.len) {
						mod_len_exists = false;
						return false;
					}
				});
				if(mod_len_exists){
					$("#mod_len").val(0);
					$("#mod_len_self").val(get_ord_spec.len).show();
				}else{
					$("#mod_len").val(get_ord_spec.len);
				}
				//-------------------------------------------------------

				$("#mod_blind_frm").show();
				$("#mod_ea_frm").hide();
			}else{
				//EA 폼
				$("#mod_ea_qty").val(get_ord_qty.qty);
				$("#mod_blind_frm").hide();
				$("#mod_ea_frm").show();
			}

			mod_total_amt_calc();

			$('.ord_mod_pop').bPopup({
				modalClose: false
				, opacity: 0.8
				, positionStyle: 'absolute'
				, speed: 300
				, transition: 'fadeIn'
				, transitionClose: 'fadeOut'
				, zIndex : 99997
				//, modalColor:'transparent'
			});
		}).fail(fnc_ajax_fail);
}

/**
 * @description 수정팝업용_분할 설정
 * @author 황호진  @version 1.0, @last update 2021/12/02
 */
function mod_division_setting() {
	//가로 값 가져오기!
	var ord_width = Number($("#mod_ord_width").val()) === '' ? 0 : Number($("#mod_ord_width").val());
	//세로 값 가져오기!
	var ord_height = $("#mod_ord_height").val();
	//분할수량
	var num = Number($("#mod_division").val());
	//분할가로 , 나머지 , 마지막 가로길이
	var division_width = '', nam , last_width = '';
	if(ord_width !== 0){
		//분할길이 구하기
		division_width = Number((ord_width / num).toFixed(1));
		//나머지 값 구하기
		nam = (division_width * (num - 1)).toFixed(1);
		//나머지 길이 구하기
		last_width = Number((ord_width - nam).toFixed(1));
	}
	for(let i = 1; i <= num; i++){
		if(i === num){
			$("#mod_div_width"+i).val(last_width);
		}else{
			$("#mod_div_width"+i).val(division_width);
		}
		$("#mod_div_height"+i).val(ord_height);
	}
}

/**
 * @description 수정팝업용_주문금액 계산
 * @author 황호진  @version 1.0, @last update 2021/12/02
 */
function mod_total_amt_calc() {
	$("#one_ord_mod_btn").attr('disabled', true);

	var mod_form = $('.mod_form').val();
	var url = '/ord/ord_reg/total_amt_calc';
	var type = 'GET';
	var data = {
		'select_cust_cd' 	: $('.mod_cust_cd').val(),
		'select_item_cd' 	: $('.mod_item_cd').val(),
		'select_form' 		: mod_form,
		'vat' 				: $("input[name=vat]:checked").val(),
	};
	if(mod_form === '001' || mod_form === '002'){
		var division = $('#mod_division').val();
		data['option1'] = $('#mod_blind_option1').val();
		data['option2'] = $('#mod_blind_option2').val();
		data['option3'] = $('#mod_blind_option3').val();
		data['coupon'] = $('#mod_blind_coupon').val();
		data['ord_width'] = $('#mod_ord_width').val();
		data['ord_height'] = $('#mod_ord_height').val();
		data['left_qty'] = $('#mod_left_qty').val();
		data['right_qty'] = $('#mod_right_qty').val();
		data['blind_qty'] = $('#mod_blind_qty').val();
		data['division'] = division;
		if(division != 1){
			for(let i = 1; i <= division; i++){
				data['div_width'+i] = $('#mod_div_width'+i).val();
				data['div_height'+i] = $('#mod_div_height'+i).val();
			}
		}
		data['update_unit'] = $('#mod_blind_update_unit').val();
		data['update_amt'] = $('#mod_blind_update_amt').val();
	}else{
		data['option1'] = $('#mod_ea_option1').val();
		data['option2'] = $('#mod_ea_option2').val();
		data['option3'] = $('#mod_ea_option3').val();
		data['coupon'] = $('#mod_ea_coupon').val();
		data['ea_qty'] = $('#mod_ea_qty').val();
		data['update_unit'] = $('#mod_ea_update_unit').val();
		data['update_amt'] = $('#mod_ea_update_amt').val();
	}
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				var check = mod_calc_yn();
				if(check){
					if(mod_form === '001' || mod_form === '002'){
						let op_amt = res.data.op_amt > 0 ? '+'+commas(res.data.op_amt) : res.data.op_amt;
						let discount = res.data.discount > 0 ? '-'+commas(res.data.discount) : res.data.discount;
						$("#mod_prd_amt").html('+'+commas(res.data.prd_amt)+'원');
						$("#mod_op_amt").html(op_amt+'원');
						$("#mod_discount").html(discount+'원');
						$("#mod_ord_amt").html(commas(res.data.ord_amt)+'원');
						$("#mod_tax_amt").html(commas(res.data.tax_amt)+'원');
						$("#mod_unit_num").html(res.data.unit_num+"회배");
						if(division != 1){
							for(let i = 1; i <= division; i++){
								$("#mod_div_hebe"+i).val(res.data.div_hebe[i-1]);
							}
						}
					}else{
						let op_amt = res.data.op_amt > 0 ? '+'+commas(res.data.op_amt) : res.data.op_amt;
						let discount = res.data.discount > 0 ? '-'+commas(res.data.discount) : res.data.discount;
						$("#mod_prd_amt").html('+'+commas(res.data.prd_amt)+'원');
						$("#mod_op_amt").html(op_amt+'원');
						$("#mod_discount").html(discount+'원');
						$("#mod_ord_amt").html(commas(res.data.ord_amt)+'원');
						$("#mod_tax_amt").html(commas(res.data.tax_amt)+'원');
					}
					$("#one_ord_mod_btn").attr('disabled', false);
				}else{
					if(mod_form === '001' || mod_form === '002'){
						mod_amt_frm_reset('hebe');
					}else{
						mod_amt_frm_reset('ea');
					}
				}
			}else{
				if(mod_form === '001' || mod_form === '002'){
					mod_amt_frm_reset('hebe');
					//회배 , m2 폼 경우에는 한계치수
					$("#mod_ord_width").val('');
					$("#mod_ord_height").val('');
					$("#mod_division").trigger('change');
				}else{
					mod_amt_frm_reset('ea');
					//EA , BOX 경우에는 최소주문수량
					$('#mod_ea_qty').val('');
				}
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);

}

/**
 * @description 수정팝업용_주문금액 계산 전 입력값 검사
 * @author 황호진  @version 1.0, @last update 2021/12/02
 */
function mod_calc_yn() {
	var mod_form = $(".mod_form").val();
	var amt_flag;
	if(mod_form === '001' || mod_form === '002'){
		if(Number($("#mod_ord_width").val()) === 0){
			amt_flag = false;
		}else if(Number($("#mod_ord_height").val()) === 0){
			amt_flag = false;
		}else{
			var division = Number($("#mod_division").val());
			if(division === 1){	//분할X
				//좌 , 우 수량이 둘다 0일때
				if(Number($("#mod_left_qty").val()) === 0 && Number($("#mod_right_qty").val()) === 0){
					amt_flag = false;
				}else{
					amt_flag = true;
				}
			}else{				//분할O
				for(let i = 1; i <= division; i++){
					if(Number($("#mod_div_width"+i).val()) === 0){
						amt_flag = false;
						break;
					}else if(Number($("#mod_div_height"+i).val()) === 0){
						amt_flag = false;
						break;
					}else{
						amt_flag = true;
					}
				}
				if(Number($("#mod_blind_qty").val()) === 0){
					amt_flag = false;
				}
			}
		}
	}else{
		if(Number($("#mod_ea_qty").val()) === 0){
			amt_flag = false;
		}else{
			amt_flag = true;
		}
	}
	return amt_flag;
}

/**
 * @description 수정팝업용_주문금액 초기화
 * @author 황호진  @version 1.0, @last update 2021/12/02
 */
function mod_amt_frm_reset(type) {
	$("#mod_prd_amt").html("0원");
	$("#mod_op_amt").html("0원");
	$("#mod_discount").html("0원");
	$("#mod_ord_amt").html("0원");
	$("#mod_tax_amt").html("0원");
	if(type === 'hebe'){
		$("#mod_unit_nm").html("총 회배");
		$("#mod_unit_num").html("0회배");
	}
}

/**
 * @description 수정팝업용_주문저장
 * @author 황호진  @version 1.0, @last update 2021/12/02
 */
function one_ord_mod() {
	var mod_form = $(".mod_form").val();

	var url = '/ord/ord_reg/one_ord_mod';
	var type = 'POST';
	var data = {
		cust_cd		: $(".mod_cust_cd").val(),	//거래처
		ord_no		: $(".mod_ord_no").val(),	//주문번호
		ord_seq		: $(".mod_ord_seq").val(),	//주문순서
		rec_gb		: $(".mod_rec_gb").val(),	//접수처
		item_cd		: $(".mod_item_cd").val(),	//아이템코드
		proc_gb		: $(".mod_proc_gb").val(),	//제작구분
		pd_cd		: $(".mod_pd_cd").val(),	//소속제품군
		finyn		: $(".mod_finyn").val(),	//상태
		unit		: mod_form,					//회배 , EA 등
		vat			: $("input[name=vat]:checked").val(),		//부가세여부
		unit_amt	: $(".mod_unit_amt").val(),					//기준금액
		ord_amt		: $("#mod_ord_amt").text().replace('원' , '').replaceAll(',' , ''),	//주문금액
		ord_gb		: $("input[name=ord_gb]:checked").val(),	//주문구분
		dlv_dt		: $("#dlv_dt").val(),						//출고일(acc_save에 사용함)
	};

	var item_gb = {} , option = {} , ord_spec = {} , ord_qty = {} , div_whp = {};
	if(mod_form === '001' || mod_form === '002'){
		//추가분류 설정
		item_gb['item_gb'] = $("#mod_blind_item_gb").val() === '' ? '' : Number($("#mod_blind_item_gb").val());
		//옵션 , 할인 설정
		option['option1'] = Number($("#mod_blind_option1").val()) === 0 ? '' : Number($("#mod_blind_option1").val());
		option['option2'] = Number($("#mod_blind_option2").val()) === 0 ? '' : Number($("#mod_blind_option2").val());
		option['option3'] = Number($("#mod_blind_option3").val()) === 0 ? '' : Number($("#mod_blind_option3").val());
		option['coupon'] = $("#mod_blind_coupon").val() === '' ? '' : $("#mod_blind_coupon").val();
		option['update_unit'] = $("#mod_blind_update_unit").val();
		option['update_amt'] = $("#mod_blind_update_amt").val() === '' ? '' : $("#mod_blind_update_amt").val();

		//분할수량 값 가져오기
		var division = Number($("#mod_division").val());
		//규격 설정
		ord_spec['size'] 		= Number($(".mod_size").val());
		ord_spec['unit'] 		= mod_form;
		ord_spec['division'] 	= division;
		ord_spec['ord_width'] 	= Number($("#mod_ord_width").val());
		ord_spec['ord_height'] 	= Number($("#mod_ord_height").val());
		ord_spec['ord_hebe']	= $("#mod_unit_num").text().replace('회배','');
		ord_spec['handle'] 		= $("#mod_handle").val();
		ord_spec['type'] 		= $("#mod_type").val();
		ord_spec['place'] 		= $("#mod_place").val();
		ord_spec['len'] 		= Number($("#mod_len").val()) === 0 ? Number($("#mod_len_self").val()) : Number($("#mod_len").val());

		//분할 있을때
		if(division > 1){
			var div_left_qty = 0;
			var div_right_qty = 0;
			var blind_qty = Number($("#mod_blind_qty").val());
			for(let i = 1, j = 1; i <= division * blind_qty; i++ , j++){
				div_whp['div_width'+i] = Number($("#mod_div_width"+j).val());
				div_whp['div_height'+i] = Number($("#mod_div_height"+j).val());
				//회배 설정
				div_whp['div_hebe'+i] = Number($("#mod_div_hebe"+j).val());

				//수량 설정
				if($("#mod_position_"+j).val() === 'right'){
					div_whp['handle_pos'+i] = 'R';
					div_right_qty++;
				}else{
					div_whp['handle_pos'+i] = 'L';
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
			ord_qty['left_qty'] = Number($("#mod_left_qty").val());
			ord_qty['right_qty'] = Number($("#mod_right_qty").val());
		}

		data['ord_unit_frm'] = {
			'item_gb'			: JSON.stringify(item_gb),
			'option'			: JSON.stringify(option),
			'ord_spec'			: JSON.stringify(ord_spec),
			'div_whp'			: JSON.stringify(div_whp),
			'ord_qty'			: JSON.stringify(ord_qty),
			'memo'				: $("#mod_blind_memo").val(),
		};
	}else{
		//추가분류 설정
		item_gb['item_gb'] = $("#mod_ea_item_gb").val() === '' ? '' : Number($("#mod_ea_item_gb").val());
		//옵션 , 할인 설정
		option['option1'] = Number($("#mod_ea_option1").val()) === 0 ? '' : Number($("#mod_ea_option1").val());
		option['option2'] = Number($("#mod_ea_option2").val()) === 0 ? '' : Number($("#mod_ea_option2").val());
		option['option3'] = Number($("#mod_ea_option3").val()) === 0 ? '' : Number($("#mod_ea_option3").val());
		option['coupon'] = $("#mod_ea_coupon").val() === '' ? '' : $("#mod_ea_coupon").val();
		option['update_unit'] = $("#mod_ea_update_unit").val();
		option['update_amt'] = $("#mod_ea_update_amt").val() === '' ? '' : $("#mod_ea_update_amt").val();
		//주문상세스펙 설정
		ord_spec['size'] = Number($(".mod_size").val());
		ord_spec['unit'] = mod_form;
		//수량 설정
		ord_qty['qty'] = Number($("#mod_ea_qty").val());

		data['ord_unit_frm'] = {
			'item_gb'			: JSON.stringify(item_gb),
			'option'			: JSON.stringify(option),
			'ord_spec'			: JSON.stringify(ord_spec),
			'ord_qty'			: JSON.stringify(ord_qty),
			'memo'				: $("#mod_ea_memo").val(),
		};
	}
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if($("input[name=ord_gb]:checked").val() === 'O'){
					$("input[name=ord_gb]").prop('disabled' , true);
					$("#esti_print").hide();
					$("#spec_print").show();
					$("#job_transfer").show();
				}
				//get_ord_prd_list 함수 경로 : /public/js/dev/ord_reg_popup.js
				get_ord_prd_list($(".mod_cust_cd").val() , $(".mod_ord_no").val());
				$('.ord_mod_pop').bPopup().close();
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 수정팝업용_주문저장시 필수입력값 검사
 * @author 황호진  @version 1.0, @last update 2022/01/06
 */
function mod_ord_popup_input_check(mod_form) {
	console.log(mod_form);
	if(mod_form === '001' || mod_form === '002') {//회배 , m2 입력값 검증
		if(Number($("#mod_ord_width").val()) === 0){
			toast('가로길이을 입력해주세요.', true, 'danger');
			$('#mod_ord_width').focus();
			return false;
		}
		if(Number($("#mod_ord_height").val()) === 0){
			toast('세로길이을 입력해주세요.', true, 'danger');
			$('#mod_ord_height').focus();
			return false;
		}
		var division = Number($("#mod_division").val());
		if(division === 1){
			if(Number($("#mod_left_qty").val()) === 0 && Number($("#mod_right_qty").val()) === 0){
				if(Number($("#mod_left_qty").val()) === 0){
					toast('좌 수량을 입력해주세요.', true, 'danger');
					$('#mod_left_qty').focus();
					return false;
				}else{
					toast('우 수량을 입력해주세요.', true, 'danger');
					$('#mod_right_qty').focus();
					return false;
				}
			}
		}else{
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
			}
			//분할시 묶음 수량
			if(Number($("#mod_blind_qty").val()) === 0){
				toast('수량을 입력해주세요.', true, 'danger');
				$('#mod_blind_qty').focus();
				return false;
			}
		}
	}else{//EA , BOX 입력값 검증
		if(Number($('#mod_ea_qty').val()) === 0){
			toast('수량을 입력해주세요.', true, 'danger');
			$('#mod_ea_qty').focus();
			return false;
		}
	}
	return true;
}
