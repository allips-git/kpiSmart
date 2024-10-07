/*================================================================================
 * @name: 황호진 - day_li_pop.js	금일수금내역
 * @version: 1.0.0, @date: 2021-12-08
 ================================================================================*/
$(function () {
	var search_data = $("#frm").serialize();
	get_popup_list(search_data);

	/**
	 * @description 검색버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/12/08
	 */
	$("#search_btn").off().click(function () {
		var search_data = $("#frm").serialize();
		get_popup_list(search_data);
	});
	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2021/12/08
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			var search_data = $("#frm").serialize();
			get_popup_list(search_data);
		}
	});
});

/**
 * @description 금일수금내역 검색조건
 * @author 황호진  @version 1.0, @last update 2021/12/08
 */
function get_popup_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/acc/acc_day_li/get_popup_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 18,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: true,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: true,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					var len = res.length;	//리스트 갯수
					var str = '';
					var amt_sum = 0;			//총계변수
					if(len > 0){
						$.each(res, function (i, list) {
							var get_arg = encodeURIComponent(JSON.stringify({
								'cust_cd'	: list.cust_cd,
								'cust_nm'	: list.cust_nm,
								'acc_dt'	: list.acc_dt
							}));
							var del_arg = encodeURIComponent(JSON.stringify({
								'cust_cd'	: list.cust_cd,
								'acc_no'	: list.acc_no
							}));
							str += '<tr>';
							str += '<td class="w10">'+list.acc_dt+'</td>';
							str += '<td class="w20 T-left tb_click" onclick=select_target_info("'+get_arg+'")>'+list.cust_nm+'</td>';
							str += '<td class="T-right w9">'+commas(Math.abs(list.amt))+'원</td>';
							str += '<td class="w6">'+list.acc_type+'</td>';
							str += '<td class="w7">'+list.bl_uc+'</td>';
							str += '<td class="w10">'+list.acc_nm+'</td>';
							str += '<td class="w10">'+list.sales_person+'</td>';
							str += '<td class="T-left">';
							str += '<p class="Ellipsis">'+list.memo+'</p>';
							str += '</td>';
							str += '<td class="w8">';
							if(list.sysyn === 'N'){
								str += '<button type="button" onclick=del("'+del_arg+'")>삭제</button>';
							}
							str += '</td>';
							str += '</tr>';
							//총계 계산
							amt_sum += Math.abs(list.amt);
						});
						$("#data-container").html(str);
						//총금액
						$("#amt_sum").html(commas(amt_sum)+"원");
						//총계 보이기
						$("#total_table").show();
					}else{
						str += '<tr>';
						str += '<td colspan="9">검색된 데이터가 없습니다.</td>';
						str += '</tr>';
						$("#data-container").html(str);
						//총계 숨기기
						$("#total_table").hide();
					}
					$("#list_cnt").html(len);
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description 팝업에서 거래처 선택
 * @author 황호진  @version 1.0, @last update 2021/12/08
 */
function select_target_info(arg) {
	arg = JSON.parse(decodeURIComponent(arg));
	opener.document.getElementById("st_dt").value = arg['acc_dt'];
	opener.document.getElementById("ed_dt").value = arg['acc_dt'];
	//select2에 해당 거래처 강제선택
	opener.parent.cust_select_set('cust' , arg['cust_cd'], arg['cust_nm']);
	//form_reset 리셋
	opener.parent.form_reset('select2');
	//매출/수금관리 정보 호출
	opener.parent.get_payinfo();
	//팝업 닫기
	window.close();
}

/**
 * @description 팝업에서 수금내역 삭제
 * @author 황호진  @version 1.0, @last update 2021/12/08
 */
function del(arg) {
	var con = confirm('삭제하시겠습니까?');
	if(con){
		arg = JSON.parse(decodeURIComponent(arg));
		var url = '/acc/acc_day_li/del';
		var type = 'GET';
		var data = {
			cust_cd : arg['cust_cd'],
			acc_no  : arg['acc_no']
		};
		fnc_ajax(url , type , data)
			.done(function (res) {
				if(res.result){
					toast(res.msg, false, 'info');
					var search_data = $("#frm").serialize();
					get_popup_list(search_data);
				}else{
					toast(res.msg, true, 'danger');
				}
			}).fail(fnc_ajax_fail);
	}
}
