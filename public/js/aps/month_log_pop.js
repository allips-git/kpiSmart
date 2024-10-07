/*================================================================================
 * 개발팀 month_log_pop js - custom function package
 * @version: 1.0.0
 ================================================================================*/
$(function () {
	get_list({
		s 		: null,
		op_1 	: $('#op_1').val()
	});

	//검색버튼 연동
	$("#search_btn").off().click(function () {
		$("input[name='s']").val('t');
		var data = $("#frm").serialize();
		get_list(data);
	});

	//검색어 입력후 엔터칠때 실행
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='s']").val('t');
			var data = $("#frm").serialize();
			get_list(data);
		}
	});

	//엑셀버튼을 눌렀을때
	$("#btn_log_excel").off().click(function () {
		var op_1 = $("#op_1").val();
		var op_2 = $("#op_2").val();
		var sc = $("#sc").val();
		location.href = '/user/log_excel?op_1='+op_1+'&op_2='+op_2+'&sc='+sc;
	});

	//전체엑셀버튼을 눌렀을때
	$("#btn_all_log_excel").off().click(function () {
		var op_2 = $("#op_2").val();
		var sc = $("#sc").val();
		location.href = '/user/all_log_excel?op_2='+op_2+'&sc='+sc;
	});
});

function get_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/user/month_log_pop/get_list';
	var type = 'GET';
	fnc_ajax(url ,type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 18,	//page 갯수 리스트가 18개 간격으로 페이징한다는 의미
				autoHidePrevious: true,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: true,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					var len = res.length;
					$("#list_cnt").html(len);
					var str = '';
					if(len > 0){
						$.each(res, function (i, list) {
							str += '<tr>';
							str += '<td class="T-left w12">'+ list.uc_nm +'</td>';
							str += '<td class="w12">'+ list.sv_nm +'</td>';
							str += '<td class="w12">'+ list.pay_dt +'</td>';
							str += '<td class="w5">'+ list['01'] +'</td>';
							str += '<td class="w5">'+ list['02'] +'</td>';
							str += '<td class="w5">'+ list['03'] +'</td>';
							str += '<td class="w5">'+ list['04'] +'</td>';
							str += '<td class="w5">'+ list['05'] +'</td>';
							str += '<td class="w5">'+ list['06'] +'</td>';
							str += '<td class="w5">'+ list['07'] +'</td>';
							str += '<td class="w5">'+ list['08'] +'</td>';
							str += '<td class="w5">'+ list['09'] +'</td>';
							str += '<td class="w5">'+ list['10'] +'</td>';
							str += '<td class="w5">'+ list['11'] +'</td>';
							str += '<td class="w5">'+ list['12'] +'</td>';
							str += '</tr>';
						});
						$("#data-container").html(str); // ajax data output

					}else{
						str += "<tr>";
						str += "<td colspan='15'>조회 가능한 데이터가 없습니다.</td>";
						str += "</tr>";
						$("#data-container").html(str); // ajax data output
					}
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}
