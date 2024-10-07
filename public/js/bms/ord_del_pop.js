/*================================================================================
 * @name: 황호진 - ord_del_pop.js	주문 삭제 팝업
 * @version: 1.0.0, @date: 2021-12-22
 ================================================================================*/
$(function () {
	/**
	 * @description ord_del_pop 닫기
	 * @author 황호진  @version 1.0, @last update 2021/12/23
	 */
	$('#ord_del_pop_close').on('click' , function () {
		var con = confirm('팝업창을 닫으시겠습니까?');
		if(con){
			$('.ord_del_pop').bPopup().close();
		}
	});
	/**
	 * @description 거래명세서 삭제버튼
	 * @author 황호진  @version 1.0, @last update 2021/12/23
	 */
	$('#ord_del_btn').on('click' , function () {
		var con = confirm('거래명세서를 삭제하시겠습니까?');
		if(con){
			var url = '/ord/ord_list/ord_del';
			var type = 'GET';
			var data = {
				cust_cd	: $("#del_cust_cd").val(),
				ord_no	: $("#del_ord_no").text(),
			};
			fnc_ajax(url , type , data)
				.done(function (res) {
					if(res.result){
						$('.ord_del_pop').bPopup().close();
						alert(res.msg);
						location.replace('/ord/ord_list');
					}else{
						toast(res.msg, true, 'danger');
					}
				}).fail(fnc_ajax_fail);
		}
	});
});

/**
 * @description ord_del_pop 열기
 * @author 황호진  @version 1.0, @last update 2021/12/23
 */
function ord_del_pop() {
	//거래처 설정
	$("#del_cust_cd").val($("#cust_cd").val());
	//거래처명 설정
	$("#del_cust_nm").html($("#cust_nm").val());
	//주문번호 설정
	$("#del_ord_no").html($("#ord_no").val());
	//제품수 설정
	$("#del_total_qty").html($("#ord_total_qty").text()+"개");
	//총금액 설정
	$("#del_total_amt").html($("#ord_total_amt").text()+"원");
	//주문일 설정
	$("#del_ord_dt").html(ymd_format($("#ord_dt").val()));
	//출고일 설정
	$("#del_dlv_dt").html(ymd_format($("#dlv_dt").val()));

	$('.ord_del_pop').bPopup({
		modalClose: false
		, opacity: 0.8
		, positionStyle: 'absolute'
		, speed: 300
		, transition: 'fadeIn'
		, transitionClose: 'fadeOut'
		, zIndex : 99999
		//, modalColor:'transparent'
	});
}

/**
 * @description xxxx-xx-xx -> xxxx년 xx월 xx일 포멧 함수
 * @author 황호진  @version 1.0, @last update 2021/12/23
 */
function ymd_format(dt) {
	var arr = dt.split('-');
	return arr[0]+'년 '+arr[1]+'월 '+arr[2]+'일';
}
