/*================================================================================
 * @name: 황호진 - ord_detail.js	견적/주문 상세내역 화면
 * @version: 1.0.0, @date: 2022-03-23
 ================================================================================*/

$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	// /js/bms/ord_reg_popup.js   get_ord_prd_list 함수 호출
	get_ord_prd_list($("#ord_no").val());

	//주문상태 값에 따른 명칭
	var ord_gb = $('#ord_gb').val();
	if(ord_gb === 'N'){
		$('.ord_gb_by_name').html('견적서');
	}else{
		$('.ord_gb_by_name').html('거래명세');
	}
	//================================================================================

	//이벤트 연동
	//================================================================================
	/**
	 * @description select2 라이브러리
	 * @author 황호진  @version 1.0, @last update 2022/03/23
	 */
	$("#search_cust").val($("#cust_cd").val()).select2({
		placeholder: '거래처(고객) 명을 입력해주세요.'
	});
	$("#search_cust").on('change' , function () {
		var cust_cd = $(this).val();
		new_ord(cust_cd);
	});


	/**
	 * @description 배송구분 change 이벤트 걸기
	 * @author 황호진  @version 1.0, @last update 2022/03/23
	 */
	$("#dlv_gb").on('change' , function () {
		var dlv_gb = $(this).val();
		if(dlv_gb !== "006"){ //배송구분이 방문이 아닐 경우!
			var url = '/ord/ord_reg/get_dlv_gb_addr';
			var type = 'POST';
			var data = {
				ord_no 	: $("#ord_no").val(),
				cust_cd : $("#cust_cd").val(),
				dlv_gb	: dlv_gb
			};
			fnc_ajax(url , type , data)
				.done(function (res) {
					if(res.result){
						$("#ord_zip").val(res.data.ba_zip);
						$("#address").val(res.data.ba_addr).prev().addClass('active');
						if(res.data.ba_detail !== ""){
							$("#addr_detail").val(res.data.ba_detail).prev().addClass('active');
						}
					}
				}).fail(fnc_ajax_fail);
		}else{
			$("#ord_zip").val('');
			$("#address").val('').prev().removeClass('active');
			$("#addr_detail").val('').prev().removeClass('active');
		}
	});

	/**
	 * @description 다음 주소API 호출
	 * @author 황호진  @version 1.0, @last update 2022/03/23
	 */
	$("#address").on('click' , function () {
		if($("#dlv_gb").val() !== "006"){
			daum_postcode('ord_zip', 'address', 'addr_detail' , post_addr);
		}
	});

	/**
	 * @description ord_no가 있을때 값이 바뀌면 저장하는 이벤트(change) 걸기
	 * @author 황호진  @version 1.0, @last update 2022/03/23
	 */
	$("#ord_dt , #dlv_gb , #ord_prop , #dlv_dt").on('change' , function () {
		var name = $(this).attr('name');
		var val = $(this).val();
		var last_finyn = $('#last_finyn').val();
		var rec_gb = $('#rec_gb').val();
		var ord_gb = $('#ord_gb').val();
		if(last_finyn === '002' && rec_gb === 'F' && (ord_gb === 'N' || ord_gb === 'O')){
			master_update({ord_no : $("#ord_no").val() , name : name , val : val});
		}
	});

	/**
	 * @description ord_no가 있을때 값이 바뀌면 저장하는 이벤트(focusout) 걸기
	 * @author 황호진  @version 1.0, @last update 2022/03/23
	 */
	$("#memo , #addr_text , #addr_detail").on('focusout' , function () {
		var name = $(this).attr('name');
		var val = $(this).val();
		var last_finyn = $('#last_finyn').val();
		var rec_gb = $('#rec_gb').val();
		var ord_gb = $('#ord_gb').val();
		if(last_finyn === '002' && rec_gb === 'F' && (ord_gb === 'N' || ord_gb === 'O')){
			master_update({ord_no : $("#ord_no").val() , name : name , val : val});
		}
	});

	/**
	 * @description ord_no가 있을때 부가세,주문상태 값이 바뀔때 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/03/23
	 */
	$("input[name=vat] , input[name=ord_gb]").on('change' , function () {
		var name = $(this).attr('name');
		var val = $(this).val();
		var last_finyn = $('#last_finyn').val();
		var rec_gb = $('#rec_gb').val();
		var ord_gb = $('#ord_gb').val();
		if(last_finyn === '002' && rec_gb === 'F' && (ord_gb === 'N' || ord_gb === 'O')){
			vat_or_ord_gb_update({ord_no: $("#ord_no").val(), cust_cd: $("#cust_cd").val(), name: name, val: val});
		}
	});

	/**
	 * @description 거래명세 삭제 이벤트!
	 * @author 황호진  @version 1.0, @last update 2022/03/23
	 */
	$("#delete_ord_no").on('click' , function () {
		var last_finyn = $('#last_finyn').val();
		var rec_gb = $('#rec_gb').val();
		var ord_gb = $('#ord_gb').val();
		if(last_finyn === '002' && rec_gb === 'F' && (ord_gb === 'N' || ord_gb === 'O')){
			var con = confirm('거래원장을 삭제하시겠습니까?');
			if(con){
				del_ord({ord_no : $("#ord_no").val() , cust_cd : $("#cust_cd").val()});
			}
		}
	});

	/**
	 * @description 수선버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/06/27
	 */
	$('#repair_btn , #change_btn , #return_btn').on('click' , function () {
		var popup_type = $(this).attr('data-text');
		var ord_no = $("#ord_no").val();
		after_service_pop(popup_type , ord_no);
	});
	//================================================================================
});

/**
 * @description 거래처 찾기 팝업에서 선택 눌렀을때 실행하는 함수
 * @author 황호진  @version 1.0, @last update 2022/03/23
 */
function cust_close(arg) {
	arg = JSON.parse(decodeURIComponent(arg)); // 필수
	new_ord(arg['cust_cd']);
	$('.biz-li-pop').bPopup().close();	//필수
}

/**
 * @description 거래처 찾기 팝업에서 선택된 거래처코드의 값으로 새로 주문접수하기 위한 form 넘기기 처리
 * @author 황호진  @version 1.0, @last update 2022/03/23
 */
function new_ord(cust_cd) {
	var form = document.createElement("form");
	form.setAttribute("method", "POST");
	form.setAttribute("action", '/ord/ord_reg');
	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "new_cust_cd");
	hiddenField.setAttribute("value", cust_cd);
	form.appendChild(hiddenField);
	document.body.appendChild(form);
	form.submit();
}

/**
 * @description 이름 , 전화번호 값을 받아와서 하나의 문자로 가공하는 함수
 * @author 황호진  @version 1.0, @last update 2022/03/23
 */
function process_user_info(nm , tel) {
	var str = '';
	if(nm !== ''){
		str += nm;
		if(tel !== ''){
			str += '/'+tel;
		}
	}
	return str;
}

/**
 * @description 다음주소 API를 통해 값을 받아왔을때 처리하는 후속로직
 * @author 황호진  @version 1.0, @last update 2022/03/23
 */
function post_addr() {
	$("#address").prev().addClass('active');
}

/**
 * @description master update!
 * @author 황호진  @version 1.0, @last update 2022/03/23
 */
function master_update(data) {
	var url = '/ord/ord_reg/master_update';
	var type = 'POST';
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description master vat or ord_gb update
 * @author 황호진  @version 1.0, @last update 2022/03/23
 */
function vat_or_ord_gb_update(data) {
	var url = '/ord/ord_reg/vat_or_ord_gb_update';
	var type = 'POST';
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				//ord_reg_popup.js get_ord_prd_list함수 호출
				get_ord_prd_list(data['ord_no']);

				//명칭 변경
				if(data['name'] === 'ord_gb'){
					if(data['val'] === 'N'){
						$('.ord_gb_by_name').html('견적서');
					}else{
						$('.ord_gb_by_name').html('거래명세');
					}
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 거래명세 삭제 함수
 * @author 황호진  @version 1.0, @last update 2022/03/23
 */
function del_ord(data) {
	var url = '/ord/ord_reg/del_ord';
	var type = 'POST';
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				alert(res.msg);
				location.replace('/ord/ord_list');
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 거래처 변경 함수
 * @author 황호진  @version 1.0, @last update 2022/03/23
 */
function cust_change_close(arg) {
	arg = JSON.parse(decodeURIComponent(arg)); // 필수
	var ord_no = $("#ord_no").val();
	var url = '/ord/ord_reg/cust_change';
	var type = 'POST';
	var data = {
		cust_cd 		: $("#cust_cd").val(),
		ord_no			: ord_no,
		change_cust_cd 	: arg['cust_cd'],
		change_cust_nm	: arg['cust_nm']
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				//select2 -> 변경된 거래처로 설정
				$('#search_cust').val(arg['cust_cd']).prop('selected',true).select2();

				//거래처 정보 설정
				var info = res.data.info;
				var cust_grade = res.data.cust_grade;

				//거래처코드 설정
				$("#cust_cd").val(info.cust_cd);
				//거래처명 설정
				$("#cust_nm").val(info.cust_nm);

				//업체명 설정
				$("#info_cust_nm").html(info.cust_nm);
				//담당자 설정
				$("#info_person").html(process_user_info(info.person , info.person_tel));
				//단가구분 설정
				var grade = info.cust_grade === 'amt0' ? '없음' : cust_grade[info.cust_grade];
				$("#info_cust_grade").html(grade);
				//결제 설정
				$("#info_pay_gb").html(info.pay_gb);
				//영업담당자 설정
				$("#info_salesperson").html(process_user_info(info.sales_person , info.sales_person_tel));
				//거래처비고 설정
				$("#info_memo").html(info.memo);

				//  /js/bms/ord_reg_popup.js get_ord_prd_list함수 호출
				get_ord_prd_list(ord_no);

				$('.biz-change-li-pop').bPopup().close();  //필수
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 출력물 연계함수
 * @author 황호진  @version 1.0, @last update 2022/03/25
 */
function printout() {
	var ord_no = $("#ord_no").val();
	//주문상태
	var ord_gb = $("input[name=ord_gb]:checked").val();
	if(ord_gb === 'N'){
		esti_print(ord_no);
	}else{
		gurae_print(ord_no);
	}
}

/**
 * @description 거래명세서 출력
 * @author 황호진  @version 1.0, @last update 2022/03/25
 */
function gurae_print(ord_no) {
	var result = confirm("거래명세내역을 출력하시겠습니까?");
	if(result){

		// 전송 파라미터
		$('#p_gb').val(print_gb);
		$('#p_ord_no').val(ord_no);

		var pop_title = "gurae_print";

		var _width = '800';
		var _height = '950';

		var _left = Math.ceil(( window.screen.width - _width )/2);
		var _top = Math.ceil(( window.screen.height - _height )/2);

		window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

		var frm_data = document.gurae_frm;

		frm_data.target = pop_title;
		if(print_host == 'plan-bms.localhost') {
			frm_data.action = print_local+"/gurae.jsp";
		} else {
			frm_data.action = print_domain+"/gurae.jsp";
		}
		frm_data.submit();
	}
}

/**
 * @description 견적서 출력
 * @author 황호진  @version 1.0, @last update 2022/03/25
 */
function esti_print(ord_no){

	var con = confirm("견적서를 출력하시겠습니까?");
	if(con){

		$('#esti_gb').val(print_gb);
		$('#esti_ord_no').val(ord_no);

		var pop_title = "esti_print";

		var _width = '800';
		var _height = '2100';

		var _left = Math.ceil(( window.screen.width - _width )/2);
		var _top = Math.ceil(( window.screen.height - _height )/2);

		window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

		var frm_data = document.esti_frm;

		frm_data.target = pop_title;
		if(print_host == 'plan-bms.localhost') {
			frm_data.action = print_local+"/esti.jsp";
		} else {
			frm_data.action = print_domain+"/esti.jsp";
		}
		frm_data.submit();
	}

}
