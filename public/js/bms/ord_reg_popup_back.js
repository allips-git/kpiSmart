/*================================================================================
 * @name: 황호진 - ord_reg_popup.js	제품추가 팝업 공통부분
 * @version: 1.0.0, @date: 2021-11-24
 ================================================================================*/
//★★★★★★★★★★★★★★정독 할것★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
//이 팝업을 사용하는 화면은 ord_no , cust_cd , cust_nm , ord_dt , dlv_dt , ord_gb ,
//dlv_gb , ord_prop , vat , ord_zip , address , addr_detail , addr_text , fac_text
//위의 컬럼이 전부 선언되어 있어야 함! 저장버튼 이벤트인 ord_pop_form_insert 함수 확인할것!
//★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
var g_bunhal_flag = true;
$(function () {
	/**
	 * @description 제품추가 팝업의 아이템 검색
	 * @author 황호진  @version 1.0, @last update 2021/11/10
	 */
	$("#item_search_btn").off().click(function () {
		$("input[name='item_s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
		var search_data = {
			item_s : $("input[name='item_s']").val(),
			item_sc : $("#item_sc").val(),
			item_op_1 : $("#item_op_1").val(),
			item_op_2 : $("#item_op_2").val(),
			cust_cd : $("#cust_cd").val(),
		};
		get_item_list(search_data);
	});

	/**
	 * @description 제품추가 팝업의 아이템 검색 enter 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/11/10
	 */
	$("#item_sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='item_s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
			var search_data = {
				item_s : $("input[name='item_s']").val(),
				item_sc : $("#item_sc").val(),
				item_op_1 : $("#item_op_1").val(),
				item_op_2 : $("#item_op_2").val(),
				cust_cd : $("#cust_cd").val(),
			};
			get_item_list(search_data);
		}
	});

	/**
	 * @description 제품추가 팝업의 옵션 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/11/11
	 */
	$("select[name='option1'] , select[name='option2'] , select[name='option3']").on('change' , function () {
		var v = $(this).val();
		var amt_flag;
		if(v !== ''){
			var amt = $(this).find('option:selected').attr('data-amt');
			var unit = $(this).find('option:selected').attr('data-unit');
			$(this).next().html(unit+amt+'원');
		}else{
			$(this).next().html('');
		}
		amt_flag = calc_yn();
		if(amt_flag){
			total_amt_calc();
		}
	});


	/**
	 * @description 제품추가 팝업의 분할방식 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/11/11
	 */
	$("#division").on('change' , function () {
		var num = $(this).val();
		if(num > 1){
			var division_str = '';
			for(let i = 1; i <= num; i++){
				division_str += '<p>';
				division_str += '<input type="hidden" id="div_hebe'+i+'" name="div_hebe'+i+'">';
				division_str += i+'.'+'<span>가로 : <input type="text" id="div_width'+i+'" name="div_width'+i+'" class="w10 division_w_class" autocomplete="off"> cm</span>';
				division_str += '<span>세로 : <input type="text" id="div_height'+i+'" name="div_height'+i+'" class="w10 division_h_class" autocomplete="off" readonly> cm</span>';
				division_str += '<span>위치 : ';
				division_str += '<select name="position_'+i+'" id="position_'+i+'">';
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
			$("#division_btn").show();	//균등분할 , 초기화 버튼 활성화
			$("#division_list").html(division_str).parent().show();	//분할 html 설정후 활성화
			$("#division_pre").hide();	//수량(좌) , 수량(우) 숨기기
			$("#division_post").show();	//수량 보이기
			$("#blind_qty").val(1);
			division_setting();
			//분할 설정 후 필요 입력값이 다 입력되어 있다면 금액 계산
			var amt_flag = calc_yn();
			if(amt_flag){
				total_amt_calc();
			}
		}else{
			$("#division_btn").hide();	//균등분할 , 초기화 비활성화
			$("#division_list").html("").parent().hide();			//분할 html 초기화후 비활성화
			$("#division_pre").show();	//수량(좌) , 수량(우) 보이기
			$("#division_post").hide();	//수량 숨기기
			$("#left_qty").val('');
			$("#right_qty").val('');

			//금액 폼 초기화
			amt_frm_reset('hebe');
		}
	});

	/**
	 * @description 숫자 및 소수점 입력
	 * @author 황호진  @version 1.0, @last update 2021/11/11
	 */
	$(document).on('input' , '#ord_width , #ord_height , .division_w_class , .division_h_class' ,function () {
		$(this).val($(this).val().replace(/[^0-9.]/gi,""));
	});

	/**
	 * @description 숫자 입력
	 * @author 황호진  @version 1.0, @last update 2021/11/11
	 */
	$(document).on('input' , '#ea_qty , #left_qty , #right_qty , #blind_qty' ,function () {
		$(this).val($(this).val().replace(/[^0-9]/gi,""));
	});

	/**
	 * @description 세로길이가 변경되었을때 분할된 입력폼에 다 적용
	 * @author 황호진  @version 1.0, @last update 2021/11/11
	 */
	$("#ord_height").on('input' , function () {
		var v = $(this).val();
		$('.division_h_class').val(v);
	});

	/**
	 * @description 재분할
	 * @author 황호진  @version 1.0, @last update 2021/11/11
	 */
	$("#re_division").on('click' , function () {
		division_setting();
	});

	/**
	 * @description 가로길이 입력후 포커스 벗어날경우 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/11/11
	 */
	$('#ord_width').focusout(function() {
		$("#re_division").click();
	});

	/**
	 * @description 분할 입력폼에 가로길이 입력시 가로길이 총합 다시 계산
	 * @author 황호진  @version 1.0, @last update 2021/11/11
	 */
	$(document).on('input' , '.division_w_class' , function () {
		var num = $("#division").val();
		var sum = 0;
		for(let i = 1 ; i <= num; i++){
			var v = Number(document.getElementById('div_width'+i).value);
			sum = sum + v;
		}
		$("#ord_width").val(Number(sum.toFixed(1)));
	});

	/**
	 * @description 분할 초기화
	 * @author 황호진  @version 1.0, @last update 2021/11/11
	 */
	$("#reset_division").on('click' , function () {
		var con = confirm('초기화 하시겠습니까?');
		if(con){
			$("#division option:eq(0)").prop("selected", true).trigger('change');
		}
	});

	/**
	 * @description EA , BOX 일때 포커스아웃될때 계산
	 * @author 황호진  @version 1.0, @last update 2021/11/18
	 */
	$('#ea_qty').on('input , focusout',function() {
		if(Number($("#ea_qty").val()) !== 0){
			total_amt_calc();
		}else{
			amt_frm_reset('ea');
		}
	});

	/**
	 * @description selectbox 쿠폰 선택값이 바뀌었을때 발생
	 * @author 황호진  @version 1.0, @last update 2021/11/18
	 */
	$('select[name="coupon"]').on('change' , function () {
		var amt_flag = calc_yn();
		if(amt_flag){
			total_amt_calc();
		}
	});

	/**
	 * @description ord_pop_save 주문 저장
	 * @author 황호진  @version 1.0, @last update 2021/11/22
	 */
	$("#ord_pop_form_save").on('click' , function () {
		var select_form = $(".select_form").val();
		if(select_form !== ''){
			if(ord_popup_input_check(select_form)){	//입력값 검증
				var con = confirm('주문등록 하시겠습니까?');
				if(con){
					//callback를 이용하여 추후 어떤 함수를 쓸지 정할것
					setTimeout(ord_pop_form_insert , 300 , select_form , ord_pop_close);
				}
			}
		}
	});

	/**
	 * @description ord_pop 닫기
	 * @author 황호진  @version 1.0, @last update 2021/11/22
	 */
	$("#ord_pop_close").on('click' , function () {
		ord_pop_close();
	});

	/**
	 * @description ord_pop_add_ord 계속 주문하기
	 * @author 황호진  @version 1.0, @last update 2021/11/23
	 */
	$("#ord_pop_add_ord").on('click' , function () {
		var select_form = $(".select_form").val();
		if(select_form !== ''){
			if(ord_popup_input_check(select_form)){	//입력값 검증
				var con = confirm('주문등록 하시겠습니까?');
				if(con){
					//callback를 이용하여 추후 어떤 함수를 쓸지 정할것
					setTimeout(ord_pop_form_insert , 300 , select_form);
				}
			}
		}
	});


	/**
	 * @description 부가세 변경에 따른 값(해당 함수는 ord_reg , ord_detail의 부가세 radio_btn 이벤트! 팝업에 없음)
	 * @author 황호진  @version 1.0, @last update 2021/11/23
	 */
	$("input[name=vat]").on('change' , function () {
		var ord_no = $("#ord_no").val();
		var sum = 0;
		if(ord_no !== ''){	//주문번호가 있는 경우에만 (설명 : 주문번호가 없다는 것은 주문데이터가 없다는 것을 의미)
			//부가세 변경에 따른 이벤트
			var vat = $(this).val();
			var len = $('.vat_calc').length;
			var ord_amt;
			if(vat === 'Y'){
				for(let i = 0 ; i < len; i++){
					ord_amt = Number($('.vat_calc').eq(i).text().replaceAll(',',''));
					$('.vat_calc').eq(i).next().html('0');
					sum += ord_amt;	//부가세 포함 총금액 구하기
				}
			}else{
				for(let i = 0 ; i < len; i++){
					ord_amt = Number($('.vat_calc').eq(i).text().replaceAll(',',''));
					var vat_amt = Math.round(ord_amt / 10);
					$('.vat_calc').eq(i).next().html(commas(vat_amt));
					sum += (ord_amt + vat_amt);	//부가세 별도 총금액 구하기
				}
			}
			$("#ord_total_amt").html(commas(sum));
		}
	});

	/**
	 * @description 회배 , m2일때 입력값 검증 및 계산식
	 * @author 황호진  @version 1.0, @last update 2021/11/23
	 * 참고 이벤트 : propertychange change keyup paste input
	 */
	$(document).on('input ,focusout','#left_qty , #right_qty , #blind_qty , #ord_width , #ord_height , .division_w_class , .division_h_class',function () {
		var amt_flag = calc_yn();
		if(amt_flag){
			total_amt_calc();
		}else{
			//금액 폼 초기화
			amt_frm_reset('hebe');
		}
	});

	/**
	 * @description 줄길이 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/11/30
	 */
	$("#len").on('change' , function () {
		var len = $(this).val();
		if(len === '0'){
			$("#len_self").show().focus();
		}else{
			$("#len_self").val('').hide();
		}
	});

	/**
	 * @description 옵션 추가 버튼
	 * @author 황호진  @version 1.0, @last update 2021/11/30
	 */
	$(".option_add_btn").on('click' , function () {
		$(this).parent().parent().next().show();
	});

	/**
	 * @description 옵션 삭제 버튼
	 * @author 황호진  @version 1.0, @last update 2021/11/30
	 */
	$(".option_remove_btn").on('click' , function () {
		var target = $(this).attr('data-text');

		var flag = false;
		var n = 0;
		if(target === 'option2'){
			var len = $('.option3').length;
			for(var i = 0 ; i < len; i++){
				if($('.option3').eq(i).parent().parent().css('display') === 'block'){
					flag = true;
					n = i;
					break;
				}
			}
			target = 'option3';
		}
		$("."+target).html('');
		$("select[name='"+target+"']").val('');
		if(flag){
			$('.option3').eq(n).parent().parent().hide();
		}else{
			$(this).parent().parent().hide();
		}
		var amt_flag = calc_yn();
		if(amt_flag){
			total_amt_calc();
		}
	});

	/**
	 * @description 금액조정단위 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/12/07
	 */
	$('select[name="update_unit"]').on('change' , function () {
		var amt_flag = calc_yn();
		if(amt_flag){
			total_amt_calc();
		}
	});

	/**
	 * @description 금액조정 포커스아웃 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/12/07
	 */
	$('input[name=update_amt]').on('input ,focusout',function() {
		var amt_flag = calc_yn();
		if(amt_flag){
			total_amt_calc();
		}
	});
});

/**
 * @description 제품추가 팝업 get_list
 * @author 황호진  @version 1.0, @last update 2021/11/10
 */
function get_item_list(data) {
	var container = $('#item_pagination');	//pagination
	var url = '/ord/ord_reg/get_item_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data.list, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 10,	//page 갯수 리스트가 10개 간격으로 페이징한다는 의미
				autoHidePrevious: true,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: true,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data의 데이터를 가지고 callback에서 작동
					var len = res.length;
					$("#item_cnt").html(len);
					var str = '';
					var cust_cd = $("#cust_cd").val();
					if(len > 0){
						$.each(res, function (i, list) {
							var arg = new Array();
							arg.push(list.item_cd);
							arg.push(cust_cd);
							str += '<tr onclick=ord_form("'+arg+'")>';
							str += '<td class="w12">';
							if(list.proc_gb === '1'){
								str += '<span class="make">생산</span>';
							}else{
								str += '<span class="buy">외주</span>';
							}
							str += '</td>';
							str += '<td class="w13">' + list.pd_cd + '</td>';
							str += '<td class="T-left tb_click">';
							str += '<p>'+list.item_nm+'</p>';
							str += '<p>('+list.item_cd+')</p>';
							str += '</td>';
							str += '<td class="w21 T-left tb_click">' + list.item_lv4 + '</td>';
							str += '<td class="w10">'+Number(list.size)+' '+list.unit+'</td>';
							str += '<td class="w13 T-right">'+Number(list.amt).toLocaleString('ko-KR')+'원</td>';
							str += '</tr>';
						});
						$("#item-container").html(str); // ajax data output
					}else{
						str += "<tr>";
						str += "<td colspan='6'>조회 가능한 데이터가 없습니다.</td>";
						str += "</tr>";
						$("#item-container").html(str); // ajax data output
					}
				}
			}); // page end

			$('.ac tr').click(function(){
				$('.ac tr').removeClass('active');
				$(this).addClass('active')
			});

			$('.ac td').click(function(){
				$('.ac td').removeClass('active');
				$(this).addClass('active')
			});

		}).fail(fnc_ajax_fail);

}


/**
 * @description 주문 가능 제품 선택시 주문폼 가져오기
 * @author 황호진  @version 1.0, @last update 2021/11/10
 */
function ord_form(arg) {
	arg = arg.split(',');
	var url = '/ord/ord_reg/ord_form';
	var type = 'GET';
	var data = {
		item_cd : arg[0],
		cust_cd : arg[1]
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var item_info 	= res.data.item_info;
			var option 		= res.data.option;

			//item_info
			var item_str = '';
			var sell_price = Number(item_info.amt).toLocaleString('ko-KR');
			item_str += '<strong>'+item_info.item_nm+' ('+item_info.item_cd+')</strong>';
			item_str += '<span>판매 단가: '+sell_price+' 원</span><span>기본 단위: '+Number(item_info.size)+' '+item_info.unit_nm+'</span>';
			$(".selected_item").html(item_str);
			//option
			option_setting('옵션_선택' , 'option1' , option);
			$("select[name='option1']").next().html('');
			option_setting('옵션_선택' , 'option2' , option);
			$("select[name='option2']").next().html('').parent().parent().hide();
			option_setting('옵션_선택' , 'option3' , option);
			$("select[name='option3']").next().html('').parent().parent().hide();

			//제품코드 설정
			$(".select_item_cd").val(item_info.item_cd);
			//단위값 받기
			$(".select_form").val(item_info.unit);
			//size 받기
			$(".select_size").val(item_info.size);
			//소속제품군 받기
			$(".select_pd_cd").val(item_info.pd_cd);
			//제작구분 받기
			$(".select_proc_gb").val(item_info.proc_gb);
			//기준단가 받기
			$(".select_unit_amt").val(item_info.amt);
			//메모 초기화

			//분할로 일어난 이벤트 제거
			$("#division option:eq(0)").prop("selected", true).trigger('change');
			$("#len option:eq(0)").prop("selected", true).trigger('change');

			//회배 , EA폼 리셋
			$('#ord_blind_frm')[0].reset();
			$('#ord_ea_frm')[0].reset();

			//금액 폼 초기화
			$("#prd_amt").html("0원");
			$("#op_amt").html("0원");
			$("#discount").html("0원");
			$("#ord_amt").html("0원");
			$("#tax_amt").html("0원");

			//금액폼 활성화
			$("#amt_form").show();

			//아무것도 선택안되었을때 나오는 화면 숨기기
			$("#not_selected").hide();
			if(item_info.unit === '001' || item_info.unit === '002'){
				$("#unit_nm").html("총 회배");
				$("#unit_num").html("0회배");

				//회배폼 열고 EA폼 닫기
				$("#blind_form").show();
				$("#ea_form").hide();
			}else{
				$("#unit_nm").html("");
				$("#unit_num").html("");

				//회배폼 닫고 EA폼 열기
				$("#blind_form").hide();
				$("#ea_form").show();
			}

		}).fail(fnc_ajax_fail);
}

/**
 * @description 분할 값 분배 설정
 * @author 황호진  @version 1.0, @last update 2021/11/11
 */
function division_setting() {
	//가로 값 가져오기!
	var ord_width = Number($("#ord_width").val()) === '' ? 0 : Number($("#ord_width").val());
	//세로 값 가져오기!
	var ord_height = $("#ord_height").val();
	//분할수량
	var num = Number($("#division").val());
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
			$("#div_width"+i).val(last_width);
		}else{
			$("#div_width"+i).val(division_width);
		}
		$("#div_height"+i).val(ord_height);
	}
}

/**
 * @description 주문금액 계산전에 선택된 폼이 무엇인지 판별한 후 필수 입력창에 값이 입력되어 있는지 확인하는 flag 함수
 * @author 황호진  @version 1.0, @last update 2021/11/18
 */
function calc_yn() {
	var select_form = $(".select_form").val();
	var amt_flag;
	if(select_form === '001' || select_form === '002'){
		if(Number($("#ord_width").val()) === 0){
			amt_flag = false;
		}else if(Number($("#ord_height").val()) === 0){
			amt_flag = false;
		}else{
			var division = Number($("#division").val());
			if(division === 1){	//분할X
				//좌 , 우 수량이 둘다 0일때
				if(Number($("#left_qty").val()) === 0 && Number($("#right_qty").val()) === 0){
					amt_flag = false;
				}else{
					amt_flag = true;
				}
			}else{				//분할O
				for(let i = 1; i <= division; i++){
					if(Number($("#div_width"+i).val()) === 0){
						amt_flag = false;
						break;
					}else if(Number($("#div_height"+i).val()) === 0){
						amt_flag = false;
						break;
					}else{
						amt_flag = true;
					}
				}
				if(Number($("#blind_qty").val()) === 0){
					amt_flag = false;
				}
			}
		}
	}else{
		if(Number($("#ea_qty").val()) === 0){
			amt_flag = false;
		}else{
			amt_flag = true;
		}
	}
	return amt_flag;
}

/**
 * @description 주문금액 계산
 * @author 황호진  @version 1.0, @last update 2021/11/11
 */
function total_amt_calc() {
	var select_form = $('.select_form').val();
	var url = '/ord/ord_reg/total_amt_calc';
	var type = 'GET';
	var data = {
		'select_cust_cd' 	: $('.select_cust_cd').val(),
		'select_item_cd' 	: $('.select_item_cd').val(),
		'select_form' 		: select_form,
		'vat' 				: $("input[name=vat]:checked").val()
	};
	if(select_form === '001' || select_form === '002'){
		var division = $('#division').val();
		data['option1'] = $('#blind_option1').val();
		data['option2'] = $('#blind_option2').val();
		data['option3'] = $('#blind_option3').val();
		data['coupon'] = $('#blind_coupon').val();
		data['ord_width'] = $('#ord_width').val();
		data['ord_height'] = $('#ord_height').val();
		data['left_qty'] = $('#left_qty').val();
		data['right_qty'] = $('#right_qty').val();
		data['blind_qty'] = $('#blind_qty').val();
		data['division'] = division;
		if(division != 1){
			for(let i = 1; i <= division; i++){
				data['div_width'+i] = $('#div_width'+i).val();
				data['div_height'+i] = $('#div_height'+i).val();
			}
		}
		data['update_unit'] = $('#blind_update_unit').val();
		data['update_amt'] = $('#blind_update_amt').val();
	}else{
		data['option1'] = $('#ea_option1').val();
		data['option2'] = $('#ea_option2').val();
		data['option3'] = $('#ea_option3').val();
		data['coupon'] = $('#ea_coupon').val();
		data['ea_qty'] = $('#ea_qty').val();
		data['update_unit'] = $('#ea_update_unit').val();
		data['update_amt'] = $('#ea_update_amt').val();
	}
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				var check = calc_yn();
				if(check){
					if(select_form === '001' || select_form === '002'){
						let op_amt = res.data.op_amt > 0 ? '+'+commas(res.data.op_amt) : res.data.op_amt;
						let discount = res.data.discount > 0 ? '-'+commas(res.data.discount) : res.data.discount;
						$("#prd_amt").html('+'+commas(res.data.prd_amt)+'원');
						$("#op_amt").html(op_amt+'원');
						$("#discount").html(discount+'원');
						$("#ord_amt").html(commas(res.data.ord_amt)+'원');
						$("#tax_amt").html(commas(res.data.tax_amt)+'원');
						$("#unit_num").html(res.data.unit_num+"회배");
						if(division != 1){
							for(let i = 1; i <= division; i++){
								$("#div_hebe"+i).val(res.data.div_hebe[i-1]);
							}
						}
					}else{
						let op_amt = res.data.op_amt > 0 ? '+'+commas(res.data.op_amt) : res.data.op_amt;
						let discount = res.data.discount > 0 ? '-'+commas(res.data.discount) : res.data.discount;
						$("#prd_amt").html('+'+commas(res.data.prd_amt)+'원');
						$("#op_amt").html(op_amt+'원');
						$("#discount").html(discount+'원');
						$("#ord_amt").html(commas(res.data.ord_amt)+'원');
						$("#tax_amt").html(commas(res.data.tax_amt)+'원');
					}
				}else{
					//금액 폼 초기화
					if(select_form === '001' || select_form === '002') {
						amt_frm_reset('hebe');
					}else{
						amt_frm_reset('ea');
					}
				}
			}else{
				if(select_form === '001' || select_form === '002'){
					amt_frm_reset('hebe');
					//회배 , m2 폼 경우에는 한계치수
					$("#ord_width").val('');
					$("#ord_height").val('');
					$("#division").trigger('change');
				}else{
					amt_frm_reset('ea');
					//EA , BOX 경우에는 최소주문수량
					$('#ea_qty').val('');
				}
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);

}

/**
 * @description ord_form 입력값 검증
 * @author 황호진  @version 1.0, @last update 2021/11/22
 */
function ord_popup_input_check(select_form) {
	if(select_form === '001' || select_form === '002'){//회배 , m2 입력값 검증
		if(Number($("#ord_width").val()) === 0){
			toast('가로길이을 입력해주세요.', true, 'danger');
			$('#ord_width').focus();
			return false;
		}
		if(Number($("#ord_height").val()) === 0){
			toast('세로길이을 입력해주세요.', true, 'danger');
			$('#ord_height').focus();
			return false;
		}
		var division = Number($("#division").val());
		if(division === 1){
			if(Number($("#left_qty").val()) === 0 && Number($("#right_qty").val()) === 0){
				if(Number($("#left_qty").val()) === 0){
					toast('수량을 입력해주세요.', true, 'danger');
					$('#left_qty').focus();
					return false;
				}else{
					toast('수량을 입력해주세요.', true, 'danger');
					$('#right_qty').focus();
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
			if(Number($("#blind_qty").val()) === 0){
				toast('수량을 입력해주세요.', true, 'danger');
				$('#blind_qty').focus();
				return false;
			}
		}
	}else{//EA , BOX 입력값 검증
		if(Number($('#ea_qty').val()) === 0){
			toast('수량을 입력해주세요.', true, 'danger');
			$('#ea_qty').focus();
			return false;
		}
	}
	return true;
}

/**
 * @description ord popup 닫기
 * @author 황호진  @version 1.0, @last update 2021/11/22
 */
function ord_pop_close() {
	$('.item_ord02').bPopup().close();
}

/**
 * @description ord_form 저장
 * @author 황호진  @version 1.0, @last update 2021/11/22
 * ★주의사항 : 이 팝업을 사용하는 화면에는 master_frm가 담는 ID 및 값은 필수로 있어야함!
 */
function ord_pop_form_insert(select_form , callback = undefined) {
	var url = '/ord/ord_reg/ord_pop_form_insert';
	var type = 'POST';
	var data = {
		'master_frm' 	: {
			'ord_no'		: $("#ord_no").val(),						//주문번호(없는 경우 insert / 있는 경우 update)
			'cust_cd'		: $("#cust_cd").val(),						//거래처코드
			'cust_nm'		: $("#cust_nm").val(),						//거래처명
			'rec_gb'		: $("#rec_gb").val(),						//접수처
			'ord_dt'		: $("#ord_dt").val(),						//주문일
			'dlv_dt'		: $("#dlv_dt").val(),						//출고일
			'ord_gb'		: $("input[name=ord_gb]:checked").val(),	//주문구분
			'dlv_gb'		: $("#dlv_gb").val(),						//배송구분
			'ord_prop'		: $("#ord_prop").val(),						//배송옵션
			'vat'			: $("input[name=vat]:checked").val(),		//부가세여부
			'ord_zip'		: $("#ord_zip").val(),						//우편번호
			'address'		: $("#address").val(),						//주소
			'addr_detail'	: $("#addr_detail").val(),					//상세주소
			'addr_text'		: $("#addr_text").val(),					//배송사항
			'fac_text'		: $("#fac_text").val(),						//공장지시
			'memo'			: $("#memo").val()							//비고
		},
		'ord_amt'		: $('#ord_amt').text().replace('원' , '').replaceAll(',' , ''),	//주문금액
		'item_cd'		: $(".select_item_cd").val(),			//item_cd
		'pd_cd'			: $(".select_pd_cd").val(),				//소속제품군
		'proc_gb'		: $(".select_proc_gb").val(),			//제작구분
		'unit_amt'		: Number($(".select_unit_amt").val()),	//기준단가
		'select_form'	: select_form,							//선택된 form 보내기! ex) 회배 , m2 , EA , BOX
		'site_name'		: $("#site_name").val()					//site name 보내기 ex)ord_reg , ord_detail
	};
	//JSON 형태 정리할 목록들
	var item_gb = {} , option = {} , ord_spec = {} , ord_qty = {} , div_whp = {};
	if(select_form === '001' || select_form === '002'){
		//추가분류 설정
		item_gb['item_gb'] = $("#blind_item_gb").val() === '' ? '' : Number($("#blind_item_gb").val());
		//옵션 , 할인 설정
		option['option1'] = Number($("#blind_option1").val()) === 0 ? '' : Number($("#blind_option1").val());
		option['option2'] = Number($("#blind_option2").val()) === 0 ? '' : Number($("#blind_option2").val());
		option['option3'] = Number($("#blind_option3").val()) === 0 ? '' : Number($("#blind_option3").val());
		option['coupon'] = $("#blind_coupon").val() === '' ? '' : $("#blind_coupon").val();
		option['update_unit'] = $("#blind_update_unit").val();
		option['update_amt'] = $("#blind_update_amt").val() === '' ? '' : $("#blind_update_amt").val();

		//분할수량 값 가져오기
		var division = Number($("#division").val());
		//규격 설정
		ord_spec['size'] 		= Number($(".select_size").val());
		ord_spec['unit'] 		= select_form;
		ord_spec['division'] 	= division;
		ord_spec['ord_width'] 	= Number($("#ord_width").val());
		ord_spec['ord_height'] 	= Number($("#ord_height").val());
		ord_spec['ord_hebe']	= $("#unit_num").text().replace('회배','');
		ord_spec['handle'] 		= $("#handle").val();
		ord_spec['type'] 		= $("#type").val();
		ord_spec['place'] 		= $("#place").val();
		ord_spec['len'] 		= Number($("#len").val()) === 0 ? Number($("#len_self").val()) : Number($("#len").val());
		//분할있을때...
		if(division > 1){
			var div_left_qty = 0;
			var div_right_qty = 0;
			var blind_qty = Number($("#blind_qty").val());
			for(let i = 1, j = 1; i <= division * blind_qty; i++ , j++){
				div_whp['div_width'+i] = Number($("#div_width"+j).val());
				div_whp['div_height'+i] =Number($("#div_height"+j).val());
				//회배 설정
				div_whp['div_hebe'+i] = Number($("#div_hebe"+j).val());
				//수량 설정
				if($("#position_"+j).val() === 'right'){
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
			ord_qty['left_qty'] = Number($("#left_qty").val());
			ord_qty['right_qty'] = Number($("#right_qty").val());
		}
		data['ord_unit_frm'] = {
			'item_gb'			: JSON.stringify(item_gb),
			'option'			: JSON.stringify(option),
			'ord_spec'			: JSON.stringify(ord_spec),
			'div_whp'			: JSON.stringify(div_whp),
			'ord_qty'			: JSON.stringify(ord_qty),
			'memo'				: $("#blind_memo").val(),
		};

	}else{
		//추가분류 설정
		item_gb['item_gb'] = $("#ea_item_gb").val() === '' ? '' : $("#ea_item_gb").val();
		//옵션 , 할인 설정
		option['option1'] = Number($("#ea_option1").val()) === 0 ? '' : Number($("#ea_option1").val());
		option['option2'] = Number($("#ea_option2").val()) === 0 ? '' : Number($("#ea_option2").val());
		option['option3'] = Number($("#ea_option3").val()) === 0 ? '' : Number($("#ea_option3").val());
		option['coupon'] = $("#ea_coupon").val() === 0 ? '' : $("#ea_coupon").val();
		option['update_unit'] = $("#ea_update_unit").val();
		option['update_amt'] = $("#ea_update_amt").val() === '' ? '' : $("#ea_update_amt").val();
		//주문상세스펙 설정
		ord_spec['size'] = Number($(".select_size").val());
		ord_spec['unit'] = select_form;
		//수량 설정
		ord_qty['qty'] = Number($("#ea_qty").val());

		data['ord_unit_frm'] = {
			'item_gb'			: JSON.stringify(item_gb),
			'option'			: JSON.stringify(option),
			'ord_spec'			: JSON.stringify(ord_spec),
			'ord_qty'			: JSON.stringify(ord_qty),
			'memo'				: $("#ea_memo").val(),
		};
	}
	fnc_ajax(url , type , data)
		.done(function (res) {
			//console.log(res);
			if(res.result){
				toast(res.msg, false, 'info');
				//주문한 리스트 호출
				$("#ord_no").val(res.ord_no);

				//site_name 이 주문상세보기일 경우! 견적 -> 주문으로 제품추가시 주문구분 비활성화!
				if($("#site_name").val() === 'ord_detail' && $("input[name=ord_gb]:checked").val() === 'O'){
					$(".ord_gb_title").html(' 주문');
					$("#state").hide();
					$("#esti_print").hide();
					$("#spec_print").show();
					$("#job_transfer").show();
				}

				get_ord_prd_list($("#cust_cd").val() , res.ord_no);

				if(callback !== undefined){
					callback();
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description option setting
 * @author 황호진  @version 1.0, @last update 2021/11/10
 */
function option_setting(initial_val , name , data) {
	var str = '<option value="">'+initial_val+'</option>';
	$.each(data, function (i, list) {
		str += '<option value="'+list.ikey+'" data-amt="'+Number(list.unit_amt).toLocaleString('ko-KR')+'" data-unit="'+list.unit+'">'+list.key_name+'</option>';
	});
	$("select[name='"+name+"']").html(str);
}

/**
 * @description 주문된 데이터 가져오기
 * @author 황호진  @version 1.0, @last update 2021/11/23
 */
function get_ord_prd_list(cust_cd , ord_no) {
	var url = '/ord/ord_reg/get_ord_prd_list';
	var type = 'GET';
	var data = {
		cust_cd : cust_cd,
		ord_no 	: ord_no
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			//site_name -> ord_reg , ore_detail
			var site_name = $("#site_name").val();
			var len = res.data.length;
			$('#ord_cnt').html(len);
			var str = '';
			var total_amt = 0;
			var total_qty = 0;
			var total_hebe = 0;
			if(len > 0){
				$.each(res.data, function (i, list) {
					//데이터 설정
					var ord_spec = JSON.parse(list.ord_spec);
					var ord_qty = JSON.parse(list.ord_qty);
					var arg = encodeURIComponent(JSON.stringify(
						{
							'ord_no' : list.ord_no,
							'cust_cd' : list.cust_cd,
							'ord_seq' : list.ord_seq,
						}
					));

					str += '<tr class="cov">';
					str += '<td rowspan="2" class="w4">'+list.row_no+'</td>';	//rownum
					str += '<td rowspan="2" class="w5">';
					if(list.proc_gb === '1'){
						str += '<span class="make">생산</span>';	//proc_gb
					}else if(list.proc_gb === '2'){
						str += '<span class="buy">외주</span>';	//proc_gb
					}
					str += '</td>';
					str += '<td rowspan="2" class="w7">'+list.pd_cd+'</td>';	//소속제품군
					//수정 이벤트 걸기
					if(site_name === 'ord_detail') {
						if(list.finyn === '002' || list.finyn === '003') {
							str += '<td rowspan="2" class="T-left tb_click" onclick=ord_mod_pop("' + arg + '")>';
						}else{
							str += '<td rowspan="2" class="T-left">';
						}
					}else{
						str += '<td rowspan="2" class="T-left">';
					}
					str += '<p>'+list.item_nm+'</p> ';	//item_nm
					str += '<p>('+list.item_cd+')</p>';	//item_cd
					str += '</td>';
					str += '<td class="ord-info w10">';	//규격
					if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
						str += '<p>'+ord_spec['ord_width']+' * '+ord_spec['ord_height']+' ('+Number(ord_spec['ord_hebe']).toFixed(2)+' '+list.unit+')</p>';
						if(ord_spec['division'] == 1){
							str += '<p class="nobun">분할없음</p>';
						}else{
							str += '<span class="bunhal hebe_bunhal" id="bunhal_'+list.lot+'" data-text1="'+list.ord_no+'" data-text2="'+list.ord_seq+'">'+ord_spec['division']+'분할(상세보기)</span>';
						}
						//총 회배 계산
						total_hebe += Number(ord_spec['ord_hebe']);
					}else{
						str += '<p>'+list.size+list.unit+'</p>';	//size , unit
					}
					str += '</td>';
					str += '<td class="w8 name02">';
					if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){	//회배
						//총 개수 계산
						if(ord_spec['division'] == 1) {	//분할이 아닌가
							str += '<p class="no">좌 : '+list.left_qty+'</p>';
							str += '<p class="no">우 : '+list.right_qty+'</p>';
							total_qty += Number(list.left_qty)  + Number(list.right_qty);
						}else{
							str += '<div class="counter">'+ord_qty['qty']+'</div>';
							str += '<p>좌 : '+list.left_qty+'</p>';
							str += '<p>우 : '+list.right_qty+'</p>';
							total_qty += ord_spec['division'] * ord_qty['qty'];
						}
					}else{		//EA
						str += ord_qty['qty'];	//qty
						//총 개수 계산
						total_qty += ord_qty['qty'];
					}
					str += '</td>';
					str += '<td class="w17 T-left discount">';
					if(list.coupon !== ''){
						str += '<span>[ 할인쿠폰 ] '+list.cp_nm+' '+commas(Number(list.cp_amt))+' '+list.cp_unit+' 할인</span>';	//coupon
					}else{
						str += '<p></p>';	//coupon
					}
					str += '</td>';
					if(site_name === 'ord_detail'){
						str += '<td rowspan="2" class="w5">';
						if(list.finyn === '002'){	//대기
							str += '<span class="dg">'+list.finyn_nm+'</span>';
						}else if(list.finyn === '003'){	//전송
							str += '<span class="send">'+list.finyn_nm+'</span>';
						}else if(list.finyn === '004'){		//진행
							str += '<span class="saengsan">'+list.finyn_nm+'</span>';
						}else if(list.finyn === '005'){		//완료
							str += '<span class="complete">' + list.finyn_nm + '</span>';
						}else if(list.finyn === '006' || list.finyn === '007'){	//출고대기 , 출고완료
							str += '<span class="chulgo">'+list.finyn_nm+'</span>';
						}else if(list.finyn === '008' || list.finyn === '009'){	//배송대기 , 배송완료
							str += '<span class="baesong">'+list.finyn_nm+'</span>';
						}else if(list.finyn === '010' || list.finyn === '011'){	//취소접수 , 취소완료
							str += '<span class="cancle">'+list.finyn_nm+'</span>';
						}else if(list.finyn === '012' || list.finyn === '013' || list.finyn === '014'){	//반품접수 , 반품처리중 , 반품완료
							str += '<span class="banpum">'+list.finyn_nm+'</span>';
						}else if(list.finyn === '015' || list.finyn === '016'){	//교환접수 , 교환완료
							str += '<span class="change">'+list.finyn_nm+'</span>';
						}
						str += '</td>';
					}
					str += '<td rowspan="2" class="w5 T-right">'+commas(Number(list.unit_amt))+'</td>';
					str += '<td rowspan="2" class="w5 T-right vat_calc">'+commas(Number(list.ord_amt))+'</td>';
					str += '<td rowspan="2" class="w5 T-right">'+commas(Number(list.tax_amt))+'</td>';
					str += '<td rowspan="2" class="w6">'+list.ul_nm+'</td>';
					if(site_name === 'ord_detail'){
						str += '<td rowspan="2" class="w5 name03">';
						str += '<p>'+list.reg_ikey+'</p>';
						str += '<p>'+list.mod_ikey+'</p>';
						str += '</td>';
					}
					str += '<td rowspan="2" class="w5">';
					if(site_name === 'ord_detail'){
						if(list.rec_gb === 'F') {
							if (list.finyn === '002' || list.finyn === '003') {
								str += '<button type="button" class="dele" onclick=ord_prd_del("' + arg + '")><i class="fa fa-trash"></i> 삭제</button>';
							}
						}
					}else{
						str += '<button type="button" class="dele" onclick=ord_prd_del("'+arg+'")><i class="fa fa-trash"></i> 삭제</button>';
					}
					str += '</td>';
					str += '</tr>';
					str += '<tr class="bgo">';
					str += '<td colspan="3" class="T-left Elli">'+list.memo+'</td>';
					str += '</tr>';

					//총 금액 계산하는 로직
					total_amt += (Number(list.ord_amt) + Number(list.tax_amt))
				});
			}else{
				//조회건수가 0건일때 초기 안내문을 보여야할것!
				str = '<tr class="cov"><td>제품 추가 선택 시 주문 등록 가능합니다.</td></tr>';
				//조회했을때 없다는 것은 삭제 후의 리스트 호출이라는 의미이며 ord_no를 제거처리
				$("#ord_no").val('');
				if(site_name === 'ord_detail'){	//주문상세내역같은 경우는 리스트로 나가기
					alert('거래원장이 삭제되어 주문 목록 조회화면으로 이동합니다.');
					location.replace('/ord/ord_list');
				}
			}
			$("#ord_list").html(str);
			//회배가 있을시 설정
			if(total_hebe > 0){
				var hebe_str = "총 회배 : "+total_hebe.toFixed(2);
				$("#ord_total_hebe").html(hebe_str);
			}
			$("#ord_total_qty").html(total_qty);
			$("#ord_total_amt").html(commas(total_amt));

			$(".hebe_bunhal").hover(function(){
				g_bunhal_flag = true;
				var id = $(this).attr('id');
				var ord_no = $(this).attr('data-text1');
				var ord_seq = $(this).attr('data-text2');
				bunhal_detail(id , ord_no , ord_seq);
			},function(){
				g_bunhal_flag = false;
				$('.bunhal_list').hide();
			});

			$('.cov').mouseover(function(){
				$(this).next('.bgo').addClass('acg')
			});
			$('.cov').mouseleave(function(){
				$(this).next('.bgo').removeClass('acg')
			});

			$('.bgo').mouseover(function(){
				$(this).prev('.cov').addClass('acg')
			});
			$('.bgo').mouseleave(function(){
				$(this).prev('.cov').removeClass('acg')
			});


		}).fail(fnc_ajax_fail);


}

/**
 * @description 주문 접수된 데이터 삭제하기
 * @author 황호진  @version 1.0, @last update 2021/11/23
 */
function ord_prd_del(arg) {
	var con = confirm('삭제하시겠습니까?');
	if(con){
		arg = JSON.parse(decodeURIComponent(arg)); // 필수
		var url = '/ord/ord_reg/ord_prd_del';
		var type = 'POST';
		var data = {
			'ord_no' 	: arg['ord_no'],
			'cust_cd' 	: arg['cust_cd'],
			'ord_seq' 	: arg['ord_seq'],
			'site_name'	: $("#site_name").val()
		};
		fnc_ajax(url , type , data)
			.done(function (res) {
				if(res.result){
					toast(res.msg, false, 'info');
					get_ord_prd_list(arg['cust_cd'] , arg['ord_no']);
				}else{
					toast(res.msg, true, 'danger');
				}
			}).fail(fnc_ajax_fail);
	}
}

/**
 * @description 분할 상세보기
 * @author 황호진  @version 1.0, @last update 2021/11/30
 */
function bunhal_detail(id , ord_no , ord_seq) {
	var url = '/ord/ord_list/bunhal_detail';
	var type = 'GET';
	var data = {
		'ord_no'	: ord_no,
		'ord_seq'	: ord_seq,
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(g_bunhal_flag) {
				var str = '';
				$.each(res.data, function (i, list) {
					var pos;
					if (list.handle_pos === 'R') {
						pos = '우';
					} else {
						pos = '좌';
					}
					str += '<span>' + Number(i + 1) + '. 가로 : ' + list.div_width + 'cm 세로 : ' + list.div_height + 'cm 위치 : ' + pos + ' (' + list.div_hebe + '회배)</span>';
				});

				$('.bunhal_list').html(str).show();

				var id_info = document.getElementById(id); // 요소의 id 값이 target이라 가정
				var id_rect = id_info.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
				var target_info = document.getElementById('bunhal_list');
				var target_rect = target_info.getBoundingClientRect();
				var top = id_rect.top - (target_rect.height - 15);
				var left = id_rect.right + 10;

				$('.bunhal_list').css({"top": top + "px", "left": left + "px"});
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 제품추가_주문금액 초기화
 * @author 황호진  @version 1.0, @last update 2021/12/31
 */
function amt_frm_reset(type) {
	$("#prd_amt").html("0원");
	$("#op_amt").html("0원");
	$("#discount").html("0원");
	$("#ord_amt").html("0원");
	$("#tax_amt").html("0원");
	if(type === 'hebe'){
		$("#unit_nm").html("총 회배");
		$("#unit_num").html("0회배");
	}
}
