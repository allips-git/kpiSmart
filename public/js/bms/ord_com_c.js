/*================================================================================
 * @description 센터 주문 내역 JS
 * @author 황호진, @version 1.0, @last date 2022/05/25
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var search_data = {
		s		: null,
		st_dt	: $('#st_dt').val(),
		ed_dt	: $('#ed_dt').val(),
		sb		: $('#sb').val()
	};
	get_list(search_data);
	//================================================================================
	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2022/05/25
	 */
	$('#sc').off().keyup(function (e) {
		if(e.keyCode == 13){
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data);
		}
	});
	/**
	 * @description 검색기한 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/05/25
	 */
	$('#sd').on('change', function () {
		var v = $(this).val();
		var now = new Date();
		var now_y = now.getFullYear();
		var now_m = now.getMonth();
		var now_d = now.getDate();
		if(v === 'A'){
			//기본값
			$("#st_dt").val(conver_date(new Date(now_y , now_m - 1 , now_d)));
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
	 * @author 황호진  @version 1.0, @last update 2022/05/25
	 */
	$("#st_dt , #ed_dt").on('change' , function () {
		$("input[name='s']").val('t');				//검색하기 때문에 't' 라는 값이 주어짐
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
	});
});

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2022/05/25
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2022/05/25
 */
function get_list(data) {
	var container = $('#pagination');
	var url = '/cen/ord_com_c/get_list';
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
				callback: function (res, pagination) {	//res.data의 데이터를 가지고 callback에서 작동
					var len = res.length;
					var str = '';
					if(len > 0){
						$.each(res , function (i , list) {
							str += '<tr onclick=location.href="/cen/ord_com_c/v/'+ list.ord_no +'">';
							str += '<td class="w4">'+ list.row_no +'</td>';
							str += '<td class="blue w10">'+ list.ord_no +'</td>';
							str += '<td class="blue w10 Elli T-left">'+ list.cust_nm +'</td>';
							str += '<td class="w8">'+ list.per_dt +'</td>';
							str += '<td class="w8">'+ list.ord_dt +'</td>';
							str += '<td class="w8">'+ list.dlv_dt +'</td>';
							str += '<td class="w7">'+ list.reg_ikey +'</td>';
							str += '<td class="T-right w8">'+ commas(Number(list.total_amt)) +'원</td>';
							str += '<td class="w7">'+ list.total_ord +'</td>';
							str += '<td class="w7">'+ list.total_qty +'</td>';
							str += '<td class="w7">';
							if(1 > 0){	//배송옵션
								str += '<span>일반</span>';
							}
							str += '</td>';
							str += '</tr>';
						});
						$('#oc_list').html(str);
					}else{
						str += '<tr>';
						str += '<td colspan="12">조회할 승인내역 건이 없습니다.</td>';
						str += '</tr>';
						$('#oc_list').html(str);
					}
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}
