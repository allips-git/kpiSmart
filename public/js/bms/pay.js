/*================================================================================
 * @name: 황호진 - pay.js	매출수금 화면
 * @version: 1.0.0, @date: 2022-07-29
 ================================================================================*/
let start_num = 0;
let stat = true;
const max_num = 50;
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	//list 조회
	get_stat_list(search_organize() , 'load');
	//================================================================================

	//이벤트
	//================================================================================
	/**
	 * @description 스크롤 기반 데이터 더보기 형태의 조회
	 * @author 황호진  @version 1.0, @last update 2022/08/01
	 */
	$('#content').on("scroll", function(){
		let scroll_top = $(this).scrollTop();
		let inner_height = $(this).innerHeight();
		let scroll_height = $(this).prop('scrollHeight');
		if (scroll_top + inner_height >= scroll_height) // 스크롤 끝 부분쯤 도착했을 시
		{
			if(stat)
			{
				get_stat_list(search_organize() , 'scroll');
			}
		}
	});

	/**
	 * @description 검색기한 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/08/01
	 */
	$('#sd').on('change', function () {
		let id = $(this).val();
		let now = new Date();
		let now_y = now.getFullYear();
		let now_m = now.getMonth();
		let now_d = now.getDate();
		if(id === 'A'){
			//당일 구하기
			$("#st_dt").val(convert_date(new Date(now_y , now_m , now_d)));
			$("#ed_dt").val(convert_date(new Date(now_y , now_m , now_d + 1)));
		}else if(id === 'B'){
			//전월 구하기
			$("#st_dt").val(convert_date(new Date(now_y , now_m - 1 , 1)));
			$("#ed_dt").val(convert_date(new Date(now_y , now_m , 0)));
		}else if(id === 'C'){
			//금월 구하기
			$("#st_dt").val(convert_date(new Date(now_y , now_m , 1)));
			$("#ed_dt").val(convert_date(new Date(now_y , now_m + 1 , 0)));
		}
		start_num = 0;
		stat = false;
		get_stat_list(search_organize() , 'change');
	});

	/**
	 * @description 검색란의 selectbox change event
	 * @author 황호진  @version 1.0, @last update 2022/08/10
	 */
	$('#st_dt , #ed_dt , #op_1 , #op_2 , #op_3').on('change', function () {
		start_num = 0;
		stat = false;
		get_stat_list(search_organize() , 'change');
	});

	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2022/08/01
	 */
	$("#sc , #sp").off().keyup(function (e) {
		if(e.keyCode == 13){
			start_num = 0;
			stat = false;
			get_stat_list(search_organize() , 'change');
		}
	});
	//================================================================================
});

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2022/08/01
 */
function convert_date(time) {
	let y = time.getFullYear();
	let m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	let d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description 검색란 조건 정리
 * @author 황호진  @version 1.0, @last update 2022/07/29
 */
function search_organize() {
	return {
		'start_num'	: start_num,
		'st_dt'		: $('#st_dt').val(),
		'ed_dt'		: $('#ed_dt').val(),
		'sc'		: $('#sc').val(),
		'op_1'		: $('#op_1').val(),
		'op_2'		: $('#op_2').val(),
		'op_3'		: $('#op_3').val(),
		'sp'		: $('#sp').val(),
	}
}

/**
 * @description get_stat_list
 * @author 황호진  @version 1.0, @last update 2022/07/29
 */
function get_stat_list(data , event_type) {
	let url = '/acc/pay/get_stat_list';
	let type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			let len = res.data.length;
			let str = '';

			if(event_type === 'change')
			{
				$('#content').scrollTop(0);
				$('#stat_list').html('');
			}

			if(len > 0)
			{
				$.each(res.data , function (i , list) {
					str += '<tr onclick=javascript:location.href="/acc/pay/v?cust_cd='+ list.cust_cd +'">';
					str += '<td class="w5">'+ list.row_no +'</td>';
					str += '<td class="w7">'+ list.pay_gb_nm +'</td>';
					str += '<td class="T-left Elli">'+ list.cust_nm +'</td>';
					str += '<td class="T-right w8">'+ commas(Number(list.pre_amt)) +'원</td>';
					str += '<td class="T-right w8">'+ commas(Number(list.sale_amt)) +'원</td>';
					str += '<td class="T-right w8">'+ commas(Number(list.re_amt)) +'원</td>';
					str += '<td class="T-right w8">'+ commas(Number(list.cm_amt)) +'원</td>';
					str += '<td class="T-right w8">'+ commas(Number(list.mod_amt)) +'원</td>';
					str += '<td class="T-right w8">'+ commas(Number(list.bal_amt)) +'원</td>';
					str += '<td class="w8">'+ list.sales_person +'</td>';
					str += '<td class="w8">'+ list.acc_nm +'</td>';
					str += '<td class="w8">'+ list.acc_dt +'</td>';
					str += '</tr>';
				});

				$('#stat_list').append(str);

				if(len === max_num)
				{	//불러온 데이터 수가 50일 경우 다음이 있다 판단하여 start_num에 값을 더함
					stat = true;
					start_num = start_num + max_num;
				}
				else
				{	//그게 아닐 경우 다음이 없다 판단하여 상태값을 false 처리
					stat = false;
				}
			}
			else
			{
				if(start_num === 0)
				{
					str += '<tr>';
					str += "<td colspan='12'>조회 가능한 데이터가 없습니다.</td>";
					str += '</tr>';
					$('#stat_list').html(str);
				}
			}

			//금액 설정
			$('#all_pre_amt').html(commas(Number(res.amt.all_pre_amt)));
			$('#all_sale_amt').html(commas(Number(res.amt.all_sale_amt)));
			$('#all_re_amt').html(commas(Number(res.amt.all_re_amt)));
			$('#all_cm_amt').html(commas(Number(res.amt.all_cm_amt)));
			$('#all_mod_amt').html(commas(Number(res.amt.all_mod_amt)));
			$('#all_bal_amt').html(commas(Number(res.amt.all_bal_amt)));
		}).fail(fnc_ajax_fail);
}
