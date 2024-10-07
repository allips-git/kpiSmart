/*================================================================================
 * @name: 황호진 - log.js	접속기록 관리
 * @version: 1.0.0, @date: 2022-01-20
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var now = new Date();
	var now_y = now.getFullYear();
	var now_m = now.getMonth();
	get_list({
		s 		: null,
		st_dt	: conver_date(new Date(now_y , now_m , 1)),
		ed_dt	: conver_date(new Date(now_y , now_m + 1 , 0))
	});
	//================================================================================

	//이벤트 연동
	//================================================================================
	/**
	 * @description 검색버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022/01/20
	 */
	$("#btn_search").off().click(function () {
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
	});
    
    // 검색 조건 변경 이벤트
    $("#start_dt, #end_dt").change(function() {
		get_list($("#frm").serialize());
    });

	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2022/01/20
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data);
		}
	});
	//================================================================================
});

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2022/01/20
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

function get_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/user/log/get_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 26,	//page 갯수 리스트가 26개 간격으로 페이징한다는 의미
				autoHidePrevious: true,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: true,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					var len = res.length;
					$("#list_cnt").html(len);
					var str = '';
					if(len > 0){
						var site_name = $('#site_name').val();
						$.each(res, function (i, list) {
							str += '<tr>';
							str += '<td class="w5">'+ list.row_no +'</td>';
							str += '<td class="w12">'+ list.reg_dt +'</td>';
							if(site_name === 'aps_log'){
								str += '<td class="w6">'+ list.rec_gb +'</td>';
								str += '<td class="w6">'+ list.uc_nm +'</td>';
							}
							str += '<td class="w6">'+ list.acc_gb +'</td>';
							str += '<td class="w8">'+ list.ul_id +'</td>';
							str += '<td class="w10">'+ list.ul_nm +'</td>';
							str += '<td class="w9">'+ list.reg_ip +'</td>';
							str += '<td class="w8">'+ list.crud +'</td>';
							str += '<td class="w10">'+ list.result +'</td>';
							str += '</tr>';
						});
						$("#data-container").html(str); // ajax data output

					}else{
						str += "<tr>";
						str += "<td colspan='8'>조회 가능한 데이터가 없습니다.</td>";
						str += "</tr>";
						$("#data-container").html(str); // ajax data output
					}
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}
