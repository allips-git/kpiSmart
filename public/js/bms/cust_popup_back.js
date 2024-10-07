/*================================================================================
 * @name: 황호진 - cust_popup.js	거래처팝업 공통부분
 * @version: 1.0.0, @date: 2021-11-12
 ================================================================================*/

$(function () {
	/**
	 * @description 거래처 찾기 팝업에 검색기능
	 * @author 황호진  @version 1.0, @last update 2021/11/12
	 */
	$("#cust_search_btn").off().click(function () {
		$("input[name='cust_s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
		var search_data = $("#cust_frm").serialize();	//form 데이터
		get_cust_list(search_data);
	});

	/**
	 * @description 거래처 찾기 검색폼의 enter 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/11/12
	 */
	$("#cust_sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='cust_s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
			var search_data = $("#cust_frm").serialize();	//form 데이터
			get_cust_list(search_data);
		}
	});
});

/**
 * @description 거래처 찾기 팝업 get_list
 * @author 황호진  @version 1.0, @last update 2021/11/12
 */
function get_cust_list(data) {
	var container = $('#cust_pagination');	//pagination
	var url = '/ord/ord_reg/get_cust_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: true,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: true,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data의 데이터를 가지고 callback에서 작동
					var len = res.length;
					$("#cust_cnt").html(len);
					var str = '';
					if(len > 0){
						$.each(res, function (i, list) {
							var arg = encodeURIComponent(JSON.stringify(list));
							str += '<tr>';
							str += '<td>' + list.cust_gb + '</td>';
							str += '<td class="T-left Elli">' + list.cust_nm + '</td>';
							str += '<td>' + list.biz_num + '</td>';
							str += '<td>' + list.ceo_nm + '</td>';
							str += '<td>' + list.sales_person + '</td>';
							str += '<td class="T-right">' + Number(list.limit_amt).toLocaleString('ko-KR') + '원</td>';
							str += '<td class="T-right">' + Number(list.acc_rec).toLocaleString('ko-KR') + '원</td>';
							//TODO : cust_close함수는 동작이 다를수 있기때문에 각 화면 js에 개별 구현할것
							str += '<td class="w10"><button type="button" onclick=cust_close("'+arg+'")>선택</button></td>';
							str += '</tr>';
						});
						$("#cust-container").html(str); // ajax data output
					}else{
						str += "<tr>";
						str += "<td colspan='8'>조회 가능한 데이터가 없습니다.</td>";
						str += "</tr>";
						$("#cust-container").html(str); // ajax data output
					}
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * 밑에 2개의 줄은 필수이며 나머지는 커스터마이징이 필요
 *
 function cust_close(arg) {
    arg = JSON.parse(decodeURIComponent(arg)); // 필수
    //console.log('arg:'+JSON.stringify(arg)); // arg object content 출력
    $('.biz-li-pop').bPopup().close();  //필수
}
 */
