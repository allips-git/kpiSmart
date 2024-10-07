
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	get_kakao_history($("#p_cust_cd").val());
	//================================================================================

	/**
	 * @description 발송 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/12/28
	 */
	$('#kakao_send').off().click(function(){
		console.log($('#memo').val());
		//확인작업 필요함!
		var con = confirm("카카오톡 발송하시겠습니까?");

		if(con){
			var url = '/ord/ord_list_kakao_pop/inspec_before_send';
			var type = 'GET';
			var data = {
				ord_no : $('#p_ord_no').val()
			};
			fnc_ajax(url , type , data)		//전송전 검사할 사항 ex)삭제된 거래원장인지?
				.done(function (res) {
					if(res.result){
						let regExp = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
						let tel = $('#re_tel').val();

						if($('#re_tel').val() == ''){
							$.toast('수신번호를 입력하세요.', {sticky: true, type: 'danger'});
							$('#re_tel').focus();
							return false;
						}

						if(!regExp.test(tel)) {
							$.toast('잘못된 수신번호입니다.', {sticky: true, type: 'danger'});
							$('#re_tel').focus();
							return false;
						}

						let kakao_arr = new Array();

						kakao_arr['phone'] = $('#re_tel').val();
						kakao_arr['callback'] = $('#call_tel').val().replace(/-/g, "");
						kakao_arr['msg'] = ''+$('#p_cust_nm').val()+'님\r\n' +
							'주문 접수가 완료되었습니다.\r\n\r\n' +
							'주문번호: '+$('#p_ord_no').val()+'\r\n' +
							'주문일: '+$('#p_ord_dt').val()+'\r\n' +
							'출고일: '+$('#p_dlv_dt').val()+'\r\n' +
							'제품명: '+$('#p_ord_nm').val()+'\r\n' +
							'금액: '+$('#p_sum_total_amt').val()+'원\r\n' +
							$('#memo').val();
						kakao_arr['template_code'] = 'A07';

						kakao_arr['cust_cd'] = $("#p_cust_cd").val();

						msg(kakao_arr , get_kakao_history);

						console.log(kakao_arr['msg']);
					}else{
						toast(res.msg, true, 'danger');
					}
				}).fail(fnc_ajax_fail);
		}
	});

	$("#re_tel").on("input", function() {
		$(this).val($(this).val().replace(/[^0-9]/gi, ''));
	});
});

/**
 * @description kakao_history 조회
 * @author 황호진  @version 1.0, @last update 2021/10/01
 */
function get_kakao_history(cust_cd) {
	var container = $('#pagination');	//pagination
	var url = '/ord/ord_list_kakao_pop/get_kakao_history';
	var type = 'GET';
	var data = {
		cust_cd : cust_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: true,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: true,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					// ajax content setting
					var str = '';
					if(res.length > 0){
						$.each(res, function (i, list) {
							str += '<tr>';
							str += '<td class="w12">'+list.rownum+'</td>';
							str += '<td>'+num_format(list.phone,1)+'</td>';
							str += '<td>'+num_format(list.call_back,1)+'</td>';
							str += '<td>'+list.reg_dt+'</td>';
							str += '<td class="w15">'+list.result_cd+'</td>';
							str += '<td class="w15">';
							str += '<button class="summary-btn">요약</button>';
							str += '</td>';
							str += '</tr>';
							str += '<tr style="table-layout: auto;"class="hidden">';
							str += '<td colspan="6" style="padding: 0;">';
							str += '<div class="mCustomScrollbar">';
							str += '<table class="none summery" >';
							str += '<thead>';
							str += '<tr>';
							str += '<th style="border:0">내용</th>';
							str += '</tr>';
							str += '</thead>';
							str += '<tbody class="detail">';
							str += '<tr>';
							str += '<td class="T-left" style="border:0"><pre>'+list.msg+'</pre></td>';
							str += '</tr>';
							str += '</tbody>';
							str += '</table>';
							str += '</div>';
							str += '</td>';
							str += '</tr>';
						});
						$("#data-container").html(str); // ajax data output

						/**
						 * @description 발송히스토리 요약버튼 이벤트 연동
						 * @author 황호진  @version 1.0, @last update 2021/12/28
						 */
						$('.summary-btn').click(function(){
							if ($(this).parent().parent('tr').hasClass('act')==false){
								$('.item-table tr.open').removeClass('act');
								$(this).parent().parent('tr').addClass('act');
								$('tr.hidden').hide();
								$(this).parent().parent('tr').next('tr.hidden').show();
							} else {
								$(this).parent().parent('tr').removeClass('act');
								$(this).parent().parent('tr').next('tr.hidden').hide();
							}
						});

						$('.at tr').click(function(){
							$('.at tr').removeClass('active');
							$(this).addClass('active')
						});

						$('.at td').click(function(){
							$('.at td').removeClass('active');
							$(this).addClass('active')
						});

					}else{
						str += '<tr>';
						str += '<td colspan="6" >발송된 히스토리가 없습니다.</td>';
						str += '</tr>';
						$("#data-container").html(str); // ajax data output
					}
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}
