/*================================================================================
 * @description 센터 주문승인 요청리스트 JS
 * @author 황호진, @version 1.0, @last date 2022/05/20
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var search_data = {
		s		: null,
		st_dt	: $('#st_dt').val(),
		ed_dt	: $('#ed_dt').val()
	};
	get_list(search_data);
	//================================================================================
	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2022/05/20
	 */
	$('#sc').off().keyup(function (e) {
		if(e.keyCode == 13){
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data);
		}
	});
	/**
	 * @description 검색기한 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/05/20
	 */
	$('#sd').on('change', function () {
		var v = $(this).val();
		var now = new Date();
		var now_y = now.getFullYear();
		var now_m = now.getMonth();
		var now_d = now.getDate();
		if(v === 'A'){
			//기본값
			$("#st_dt").val(conver_date(new Date(now_y , now_m , now_d - 10)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m , now_d)));
		}else if(v === 'B'){
			//전월 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m - 1, 1)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m , 0)));
		}else if(v === 'C'){
			//금월 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m , 1)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m + 1 , 0)));
		}else if(v === 'D'){
			//당일 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m , now_d)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m , now_d + 1)));
		}
		var search_data = $("#frm").serialize();	//form 데이터
		//변경되자마자 즉시 검색 들어갈것
		get_list(search_data);
	});

	/**
	 * @description 날짜 변경시 리스트 조회
	 * @author 황호진  @version 1.0, @last update 2022/05/20
	 */
	$("#st_dt , #ed_dt").on('change' , function () {
		$("input[name='s']").val('t');				//검색하기 때문에 't' 라는 값이 주어짐
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
	});
});

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2022/05/20
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2022/05/20
 */
function get_list(data) {
	var container = $('#pagination');
	var url = '/cen/ord_wait/get_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 20,	//page 갯수 리스트가 20개 간격으로 페이징한다는 의미
				autoHidePrevious: false,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: false,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					console.log(res);
					var len = res.length;
					var str = '';
					if(len > 0){
						$.each(res , function (i , list) {
							if(list.rec_gb === 'F'){
								str += '<tr onclick=location.href="/cen/ord_wait/f/'+ list.out_no +'">';
							}else if(list.rec_gb === 'C'){
								str += '<tr onclick=location.href="/cen/ord_wait/c/'+ list.ord_no +'">';
							}
							str += '<td class="w5">'+ list.row_no +'</td>';
							if(list.rec_gb === 'F'){
								str += '<td class="w6">공장</td>';
							}else if(list.rec_gb === 'C'){
								str += '<td class="w6">센터</td>';
							}
							str += '<td class="w8">'+ list.ord_dt +'</td>';
							str += '<td class="w8">';
							if(list.req === "A"){		//주문승인요청
								str += '<span class="blue">주문 승인 요청</span>';
							}else if(list.req === "B"){	//주문취소요청
								str += '<span class="red">주문 취소 요청</span>';
							}
							str += '</td>';
							str += '<td class="blue w10">'+ list.ord_no +'</td>';
							str += '<td class="blue w6">'+ list.memo +'</td>';
							str += '<td class="blue T-left">'+ list.center_cust_nm +'</td>';
							str += '<td class="blue T-left">'+ list.factory_cust_nm +'</td>';
							str += '<td class="w9 T-right">'+ commas(Number(list.total_amt)) +'원</td>';
							str += '<td class="w8">'+ list.total_ord +'</td>';
							str += '<td class="w8">'+ list.total_qty +'</td>';
							str += '<td class="w7">';
							if(1 > 0){
								str += '<span>'+ list.ord_prop +'</span>';
							}else{
								str += '<span class="red">'+ list.ord_prop +'</span>';
							}
							str += '</td>';
							str += '</tr>';
						});
						$('#ow_list').html(str);
					}else{
						str += '<tr>';
						str += '<td colspan="11">조회할 요청 건이 없습니다.</td>';
						str += '</tr>';
						$('#ow_list').html(str);
					}
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}
