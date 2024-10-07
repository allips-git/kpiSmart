/*================================================================================
 * @name: 황호진 - ord_detail.js	견적/주문 상세내역 화면
 * @version: 1.0.0, @date: 2021-11-25
 ================================================================================*/

$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	//get_ord_prd_list 경로 : /public/js/dev/ord_reg_popup.js
	get_ord_prd_list($('#cust_cd').val() , $('#ord_no').val());
	//================================================================================

	/**
	 * @description select2 라이브러리를 통해 선택된 값 change 이벤트로 연결
	 * @author 황호진  @version 1.0, @last update 2021/11/09
	 */
	$("#addr_list").on('change' , function () {
		var cust_cd = $("#cust_cd").val();
		var seq = $(this).val();
		get_detail_addr(cust_cd , seq);
	});
	/**
	 * @description 다음주소API
	 * @author 황호진  @version 1.0, @last update 2021/11/10
	 */
	$("#search_addr").on('click' , function () {
		search_addr();
	});

	/**
	 * @description 주문 변경 완료
	 * @author 황호진  @version 1.0, @last update 2021/11/30
	 */
	$("#ord_mod_btn").on('click' , function () {
		var con = confirm('주문 변경하시겠습니까?');
		if(con){
			ord_update();
		}
	});

	/**
	 * @description 견적출력서
	 * @author 황호진  @version 1.0, @last update 2021/11/30
	 */
	$("#esti_print").on('click' , function () {
		var ord_no = $('#ord_no').val();
		esti_print(ord_no);
	});

	/**
	 * @description 거래명세서
	 * @author 황호진  @version 1.0, @last update 2021/11/30
	 */
	$("#gurae_print").on('click' , function () {
		var ord_no = $('#ord_no').val();
		gurae_print(ord_no);
	});
});


/**
 * @description 배송주소에 selectbox에 이벤트 연동
 * @author 황호진  @version 1.0, @last update 2021/11/09
 */
function get_detail_addr(cust_cd , seq) {
	if(seq !== ''){
		var url = '/ord/ord_reg/get_detail_addr';
		var type = 'GET';
		var data = {
			cust_cd : cust_cd,
			seq : seq
		};
		fnc_ajax(url , type , data)
			.done(function (res) {
				$("#ord_zip").val(res.data.ba_zip);
				$("#address").val(res.data.ba_addr);
				$("#addr_detail").val(res.data.ba_detail);
			}).fail(fnc_ajax_fail);
	}else{
		$("#ord_zip").val('');
		$("#address").val('');
		$("#addr_detail").val('');
	}
}

/**
 * @description 다음주소API
 * @author 황호진  @version 1.0, @last update 2021/11/10
 */
function search_addr() {
	daum_postcode('ord_zip', 'address', 'addr_detail' , select_change);
}

/**
 * @description 다음주소API callback 함수
 * @author 황호진  @version 1.0, @last update 2021/11/10
 */
function select_change() {
	$("#addr_list").val('');
}

/**
 * @description 주문 변경 완료 이벤트
 * @author 황호진  @version 1.0, @last update 2021/11/30
 */
function ord_update() {
	var url = '/ord/ord_reg/ord_update';
	var type = 'POST';
	//master 테이블에 저장할 값들은 들고가야함
	var data = {
		'ord_no'		: $("#ord_no").val(),
		'cust_cd'		: $("#cust_cd").val(),
		'ord_dt'		: $("#ord_dt").val(),
		'dlv_dt'		: $("#dlv_dt").val(),
		'ord_gb'		: $("input[name=ord_gb]:checked").val(),
		'dlv_gb'		: $("#dlv_gb").val(),
		'ord_prop'		: $("#ord_prop").val(),
		'vat'			: $("input[name=vat]:checked").val(),
		'ord_zip'		: $("#ord_zip").val(),
		'address'		: $("#address").val(),
		'addr_detail'	: $("#addr_detail").val(),
		'addr_text'		: $("#addr_text").val(),
		'fac_text'		: $("#fac_text").val(),
		'memo'			: $("#memo").val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				location.href = '/ord/ord_list';
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail)
}

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
		if(print_host == 'bms-tmp.localhost') {
			frm_data.action = print_local+"/esti.jsp";
		} else {
			frm_data.action = print_domain+"/esti.jsp";
		}
		frm_data.submit();
	}

}

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
		if(print_host == 'bms-tmp.localhost') {
			frm_data.action = print_local+"/gurae.jsp";
		} else {
			frm_data.action = print_domain+"/gurae.jsp";
		}
		frm_data.submit();
	}
}
