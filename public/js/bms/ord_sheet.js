/*================================================================================
 * @name: 황호진 - ord_sheet.js
 * @version: 1.0.0
 ================================================================================*/
$(function(){
	//화면이 맨처음 로드 될때!
	//================================================================================
	//매출거래처
	$("#sc").val('').select2();

	//매입거래처
	$("#bc").val('').select2();
	
	//리스트 조회
	var search_data = {
		s		: null,
		st_dt	: $('#st_dt').val(),
		ed_dt	: $('#ed_dt').val(),
		op_3	: $('#op_3').val(),
	};
	get_list(search_data);
	//================================================================================

	//이벤트 걸기
	//================================================================================
	/**
	 * @description 검색조건 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/06/15
	 */
	$('#sc , #bc , #st_dt , #ed_dt , #op_1 , #op_2 , #op_3').on('change' , function () {
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
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
			$("#ed_dt").val('');
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
	 * @description A/S페이지 입고팝업 열기
	 * @author 황호진  @version 1.0, @last update 2022/07/08
	 */
	$(document).on('click', '.in_pop' , function () {
		$('#input_url').val('/ord/ord_sheet');
		$('#input_ik').val($(this).attr('data-outno'));

		$('.input_pop').bPopup({
			modalClose: false,
			opacity: 0.8,
			positionStyle: 'absolute',
			speed: 300,
			transition: 'fadeIn',
			transitionClose: 'fadeOut',
			zIndex: 99997
			//, modalColor:'transparent'
		});
	});
	//================================================================================
});

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2022/05/31
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2022/05/31
 */
function get_list(data) {
	var container = $('#pagination');
	var url = '/ord/ord_sheet/get_list';
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
						var buy_cd = '';	//저장할 매입처코드
						var calc_amt = 0;	//소계기준 합계금액
						$.each(res , function (i , list) {
							var arg = encodeURIComponent(JSON.stringify({
								ord_no : list.ord_no ,
								ord_gb : list.ord_gb ,
								buy_cd : list.buy_cd ,
								sys_gb : list.sys_gb
							}));

							var arg2 = encodeURIComponent(JSON.stringify({
								out_no : list.out_no,
								ord_gb : list.ord_gb ,
								out_finyn : list.out_finyn,
								sys_gb : list.sys_gb
							}));

							if(buy_cd === ''){	//저장할 매입처코드가 빈값일때!
								buy_cd = list.buy_cd;
							}else if(buy_cd !== list.buy_cd && buy_cd !== ''){
								//저장할 매입처코드가 빈값이 아닌 상황에서 뿌리는 리스트의 매입처코드랑 다를때
								str += '<tr class="total_tr">';
								str += '<td colspan="5">매입처별 소계</td>';
								str += '<td colspan="2" class="T-right">'+ commas(Number(calc_amt)) +'원</td>';
								str += '<td colspan="5"></td>';
								str += '</tr>';
								buy_cd = list.buy_cd;
								calc_amt = 0;
							}


							str += '<tr onclick=open_ord_sheet("' + arg2 + '")>';
							str += '<td class="w4">'+ list.row_no +'</td>';
							str += '<td class="T-left">'+ list.sale_nm +'</td>';
							str += '<td class="w5">'+ list.memo +'</td>';
							str += '<td class="T-left">'+ list.buy_nm +'</td>';
							str += '<td class="blue" onclick="event.stopPropagation()"><span onclick=open_ordno("'+ list.ord_no +'")>'+ list.ord_no +'</span></td>';
							str += '<td class="w5">'+ list.sum_qty +'개</td>';	//개수
							str += '<td class="w8 T-right">'+ commas(Number(list.sum_amt)) +'원</td>';		//금액
							str += '<td class="w5">'+ list.dlv_gb +'</td>';
							str += '<td class="w9">'+ list.dlv_dt +'</td>';
							if(list.out_finyn === ''){			//발주대기
								str += '<td class="w9">';
								if(list.sys_gb === 'Y'){		//시스템매입처여부
									str += '<button type="button" class="purple" onclick=create_ord_sheet("'+ arg +'")>발주</button>';
								}else{
									str += '<button type="button" class="gray" onclick=create_ord_sheet("'+ arg +'")>발주</button>';
								}
								str += '</td>';
								str += '<td class="w9"></td>';
								str += '<td class="w9"></td>';
							}else if(list.out_finyn === 'ORD') {	//발주 승인전
								str += '<td class="w9 blue">' + list.order_date + '</td>';
								str += '<td class="w9"></td>';
								str += '<td class="w9" onclick="event.stopPropagation()"></td>';
							}else if(list.out_finyn === 'APPR'){	//발주 승인후
								str += '<td class="w9 blue">' + list.order_date + '</td>';
								str += '<td class="w9">';
								if (list.out_date !== '') {
									str += '<span>' + list.out_date + '</span>'
								} else if (list.sys_gb === 'Y') {
									str += '<span>출고대기</span>';
								}
								str += '</td>';
								str += '<td class="w9" onclick="event.stopPropagation()">';
								if (list.sys_gb === 'Y') {		//시스템매입처여부
									str += '<button type="button" class="purple in_pop" data-outno="' + list.out_no + '">입고완료</button>';
								} else {
									str += '<button type="button" class="gray in_pop" data-outno="' + list.out_no + '">입고완료</button>';
								}
								str += '</td>';
							}else if(list.out_finyn === 'IN'){	//모두 완료상태
								str += '<td class="w9 blue">'+ list.order_date +'</td>';
								str += '<td class="w9">';
								if(list.out_date !== ''){
									str += '<span>'+ list.out_date +'</span>'
								}else if(list.sys_gb === 'Y'){
									str += '<span>출고대기</span>';
								}
								str += '</td>';
								str += '<td class="w9" onclick="event.stopPropagation()">'+ list.in_date +'</td>';
							}
							str += '</tr>';

							calc_amt += Number(list.sum_amt);
						});
						
						str += '<tr class="total_tr">';
						str += '<td colspan="5">매입처별 소계</td>';
						str += '<td colspan="2" class="T-right">'+ commas(Number(calc_amt)) +'원</td>';
						str += '<td colspan="5"></td>';
						str += '</tr>';

						$('#os_list').html(str);
					}else{
						str += '<tr>';
						str += '<td colspan="11">조회할 데이터가 없습니다.</td>';
						str += '</tr>';
						$('#os_list').html(str);
					}
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description 주문창 열기
 * @author 황호진  @version 1.0, @last update 2022-09-19
 */
function open_ordno(ord_no) {
	let protocol = window.location.protocol;	//https:   (URL Scheme)
	let hostname = window.location.hostname;	//bms.plansys.kr   (도메인 네임)
	let path = '/ord/ord_reg/v/';				//경로     (폴더경로)

	var pop_title = "거래원장";
	var width = '1800';
	var height = '900';

	var left = Math.ceil(( window.screen.width - width )/2);
	var top = Math.ceil(( window.screen.height - height )/2);

	window.open(protocol+'//'+hostname+path+ord_no , pop_title, 'width='+ width +', height='+ height +', left=' + left + ', top='+ top);
}
