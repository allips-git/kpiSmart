/*================================================================================
 * @name: 황호진 - ord_reg.js	신규주문등록 화면
 * @version: 1.0.0, @date: 2022-02-28
 ================================================================================*/

$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	out_date();

	//화면 맨 처음 로드시 거래처코드가 있다면! 주문 상세보기 화면에서 거래처코드 값을 넘겨받은 것!
	//그런 경우에는 거래처 설정을 해줄 것!
	var cust_cd = $("#cust_cd").val();
	if(cust_cd !== ""){
		$('#search_cust').val(cust_cd).prop('selected',true).select2(); // 기타 화면별 사용법 참고
		get_cust_info(cust_cd);
	}else {	//없을 경우
		$("#search_cust").val('').select2({
			placeholder: '거래처(고객) 명을 입력해주세요.'
		});
	}
	//주문상태 값에 따른 명칭
	var ord_gb = $("input[name=ord_gb]:checked").val();
	if(ord_gb === 'N'){
		$('.ord_gb_by_name').html('견적서');
	}else{
		$('.ord_gb_by_name').html('거래명세');
	}
	//================================================================================

	//이벤트 연동
	//================================================================================
	/**
	 * @description select2 라이브러리에서 선택된 selectbox의 값으로 거래처코드 설정
	 * @author 황호진  @version 1.0, @last update 2022/02/28
	 */
	$("#search_cust").on('change' , function () {
		var cust_cd = $(this).val();
		get_cust_info(cust_cd);
	});

	/**
	 * @description 배송구분 change 이벤트 걸기
	 * @author 황호진  @version 1.0, @last update 2022/02/28
	 */
	$("#dlv_gb").on('change' , function () {
		var cust_cd = $("#cust_cd").val();
		var ord_no = $("#ord_no").val();
		var dlv_gb = $(this).val();
		if(dlv_gb !== "006"){ //배송구분이 방문이 아닐 경우!
			if(cust_cd !== ""){
				var url = '/ord/ord_reg/get_dlv_gb_addr';
				var type = 'POST';
				var data = {
					ord_no 	: ord_no,
					cust_cd : cust_cd,
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
			}
		}else{
			$("#ord_zip").val('');
			$("#address").val('').prev().removeClass('active');
			$("#addr_detail").val('').prev().removeClass('active');
		}
	});

	/**
	 * @description 다음 주소API 호출
	 * @author 황호진  @version 1.0, @last update 2022/02/28
	 */
	$("#address").on('click' , function () {
		if($("#dlv_gb").val() !== "006"){
			daum_postcode('ord_zip', 'address', 'addr_detail' , post_addr);
		}
	});

	/**
	 * @description ord_no가 있을때 값이 바뀌면 저장하는 이벤트(change) 걸기
	 * @author 황호진  @version 1.0, @last update 2022/03/17
	 */
	$("#ord_dt , #dlv_gb , #ord_prop , #dlv_dt").on('change' , function () {
		var ord_no = $("#ord_no").val();
		if(ord_no !== ""){
			var name = $(this).attr('name');
			var val = $(this).val();
			master_update({ord_no : ord_no , name : name , val : val});
		}
	});

	/**
	 * @description ord_no가 있을때 값이 바뀌면 저장하는 이벤트(focusout) 걸기
	 * @author 황호진  @version 1.0, @last update 2022/03/17
	 */
	$("#memo , #addr_text , #addr_detail").on('focusout' , function () {
		var ord_no = $("#ord_no").val();
		if(ord_no !== ""){
			var name = $(this).attr('name');
			var val = $(this).val();
			master_update({ord_no : ord_no , name : name , val : val});
		}
	});

	/**
	 * @description ord_no가 있을때 부가세,주문상태 값이 바뀔때 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/03/18
	 */
	$("input[name=vat] , input[name=ord_gb]").on('change' , function () {
		var ord_no = $("#ord_no").val();
		var cust_cd = $("#cust_cd").val();
		var name = $(this).attr('name');
		var val = $(this).val();
		if(ord_no !== ""){
			vat_or_ord_gb_update({ord_no : ord_no , cust_cd : cust_cd , name : name , val : val});
		}
	});

	/**
	 * @description 거래명세 삭제 이벤트!
	 * @author 황호진  @version 1.0, @last update 2022/03/22
	 */
	$("#delete_ord_no").on('click' , function () {
		var ord_no = $("#ord_no").val();
		var cust_cd = $("#cust_cd").val();
		if(ord_no !== ""){	//거래번호가 발행이 되어 있어야 삭제 가능
			var con = confirm('거래원장을 삭제하시겠습니까?');
			if(con){
				del_ord({ord_no : ord_no , cust_cd : cust_cd});
			}
		}
	});
});

/**
 * @description 거래처 찾기 팝업에서 선택 눌렀을때 실행하는 함수
 * @author 황호진  @version 1.0, @last update 2022/02/28
 */
function cust_close(arg) {
	arg = JSON.parse(decodeURIComponent(arg)); // 필수
	$('#search_cust').val(arg['cust_cd']).prop('selected',true).select2(); // 기타 화면별 사용법 참고
	get_cust_info(arg['cust_cd']); // 기타 화면별 사용법 참고
	$('.biz-li-pop').bPopup().close();	//필수
}


/**
 * @description selectbox에 선택된 거래처의 값을 기반으로 정보 가져오기
 * @author 황호진  @version 1.0, @last update 2022/02/28
 */
function get_cust_info(cust_cd) {
	var url = '/ord/ord_reg/get_cust_info';
	var type = 'GET';
	var data = {
		cust_cd : cust_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var info = res.data.info;
			var cust_grade = res.data.cust_grade;

			//거래처코드 설정
			$("#cust_cd").val(cust_cd);
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

			//해당 거래처의 대표 배송지 설정! 없다면 001 화물로 설정
			var dlv_gb = info['ba_gb'] == "" ? "001" : info['ba_gb'];
			$("#dlv_gb").val(dlv_gb).trigger('change');

			//부가세여부 설정
			if(info.vat === 'Y'){
				$("#vat_y").prop('checked' , true);
			}else{
				$("#vat_n").prop('checked' , true);
			}

			//거래명세번호 발행 전 UI
			$("#pre_publish").show();
			//거래명세번호 발행 후 UI
			$("#post_publish").hide();

			//신규제품추가 버튼 보이게 처리
			$("#new_ord_add").show();

			//주문내역 초기화
			$("#ord_list").html('<tr><td colspan="11">제품 추가를 클릭해주세요!</td></tr>');
			//주문번호 초기화
			$("#ord_no").val('');		//주문번호 빈값 처리
			$("#view_ord_no").html('');	//view용 주문번호 빈값 처리

		}).fail(fnc_ajax_fail);
}

/**
 * @description 이름 , 전화번호 값을 받아와서 하나의 문자로 가공하는 함수
 * @author 황호진  @version 1.0, @last update 2022/02/28
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
 * @author 황호진  @version 1.0, @last update 2022/03/02
 */
function post_addr() {
	$("#address").prev().addClass('active');
}

/**
 * @description master update!
 * @author 황호진  @version 1.0, @last update 2022/03/17
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
 * @author 황호진  @version 1.0, @last update 2022/03/18
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
 * @author 황호진  @version 1.0, @last update 2022/03/22
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
	if(ord_no !== ""){
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
					$("#info_cust_grade").html(cust_grade[info.cust_grade]);
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

	}else{
		$('.biz-change-li-pop').bPopup().close();  //필수
	}
}

/**
 * @description 출력물 연계함수
 * @author 황호진  @version 1.0, @last update 2022/03/25
 */
function printout() {
	var ord_no = $("#ord_no").val();
	if(ord_no !== ""){	//주문번호가 발행되지 않을 경우! 만에 하나 모르니 제한 둘것!
		//주문상태
		var ord_gb = $("input[name=ord_gb]:checked").val();
		if(ord_gb === 'N'){
			esti_print(ord_no);
		}else{
			gurae_print(ord_no);
		}
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
