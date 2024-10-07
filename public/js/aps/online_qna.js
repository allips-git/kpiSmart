/*================================================================================
 * @name: 황호진 - online_qna.js	온라인 문의 관리
 * @version: 1.0.0, @date: 2022-01-21
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var now = new Date();
	var now_y = now.getFullYear();
	var now_m = now.getMonth();
	get_list({
		s	: null,
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
 * @author 황호진  @version 1.0, @last update 2022/01/21
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description 온라인 문의사항 가져오기
 * @author 황호진  @version 1.0, @last update 2022/01/21
 */
function get_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/cs/online_qna/get_list';
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
						$.each(res, function (i, list) {
							str += '<tr onclick=online_qna_deteil("'+ list.ikey +'") style="cursor: pointer;">';
							str += '<td class="w6">'+ list.row_no +'</td>';
							str += '<td class="w9">'+ list.name +'</td>';
							str += '<td class="w11">'+ list.tel +'</td>';
							str += '<td class="w12">'+ list.email +'</td>';
							str += '<td class="T-left Elli">'+ list.qn_title +'</td>';
							str += '<td class="w11">'+ list.reg_dt +'</td>';
							str += '<td class="w7">';
							if(list.answer === '대기'){
								str += '<span class="aw">'+ list.answer +'</span>';
							}else if(list.answer === '확인완료'){
								str += '<span class="aw checkcom">'+ list.answer +'</span>';
							}else{
								str += '<span class="">'+ list.answer +'</span>';
							}
							str += '</td>';
							str += '</tr>';
						});
						$("#data-container").html(str); // ajax data output

					}else{
						str += "<tr>";
						str += "<td colspan='7'>등록된 문의사항이 없습니다.</td>";
						str += "</tr>";
						$("#data-container").html(str); // ajax data output
					}
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description 클릭한 문의 상세내용으로 이동하는 함수
 * @author 황호진  @version 1.0, @last update 2022/01/21
 */
function online_qna_deteil(ikey) {
	location.href = '/cs/online_qna/v?ikey='+ikey;
}
