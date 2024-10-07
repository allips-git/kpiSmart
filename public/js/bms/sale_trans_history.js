/*================================================================================
 * @name: 황호진 - sale_trans_history.js	매출처별 거래내역 js
 * @version: 1.0.0, @date: 2022-08-22
 ================================================================================*/
let start_num = 0;
let stat = true;
const max_num = 50;

//화면이 맨처음 로드 될때!
//================================================================================
get_sth_list(sth_search_organize() , 'load');
//================================================================================

//이벤트
//================================================================================
/**
 * @description 스크롤 기반 데이터 더보기 형태의 조회
 * @author 황호진  @version 1.0, @last update 2022/08/22
 */
$('#content').on("scroll", function(){
	let scroll_top = $(this).scrollTop();
	let inner_height = $(this).innerHeight();
	let scroll_height = $(this).prop('scrollHeight');
	if (scroll_top + inner_height >= scroll_height) // 스크롤 끝 부분쯤 도착했을 시
	{
		if(stat)
		{
			get_sth_list(sth_search_organize() , 'scroll');
		}
	}
});

/**
 * @description 검색 이벤트
 * @author 황호진  @version 1.0, @last update 2022/08/25
 */
$('#st_dt , #ed_dt').on('change' , function () {
	start_num = 0;
	stat = false;
	get_sth_list(sth_search_organize() , 'change');
});
//================================================================================


/**
 * @description 검색란 조건 정리
 * @author 황호진  @version 1.0, @last update 2022-08-22
 */
function sth_search_organize() {
	return {
		'start_num'	: start_num,
		'st_dt'		: $('#st_dt').val(),
		'ed_dt'		: $('#ed_dt').val(),
		'sc'		: $('#sc').val(),
		// 'op_1'		: $('#op_1').val(),
		// 'op_2'		: $('#op_2').val(),
		// 'op_3'		: $('#op_3').val(),
		// 'op_4'		: $('#op_4').val(),
		// 'op_5'		: $('#op_5').val(),
		// 'op_6'		: $('#op_6').val()
	}
}

/**
 * @description get_sth_list
 * @author 황호진  @version 1.0, @last update 2022-08-22
 */
function get_sth_list(data , event_type) {
	let url = '/ledg/sale_trans_history/get_sth_list';
	let type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			let len = res.data.length;
			let str = '';

			if(event_type === 'change')
			{
				$('#content').scrollTop(0);
				$('#sth_list').html('');
			}

			if(len > 0)
			{
				$.each(res.data , function (i , list) {
					str += '<tr onclick=location.href="/ledg/sale_trans_history/v?cc='+ list.cust_cd +'">';
					str += '<td class="w5" onclick="event.stopPropagation()">';
					str += '<input type="checkbox" id="chk'+ list.ikey +'" name="chk">';
					str += '<label for="chk'+ list.ikey +'"></label>';
					str += '</td>';
					str += '<td class="w5">'+ list.row_no +'</td>';
					str += '<td class="T-left">'+ list.cust_nm +'</td>';
					str += '<td class="w10 T-right">'+ commas(Number(list.pre_amt)) +'</td>';
					str += '<td class="w10 T-right">'+ commas(Number(list.sale_amt)) +'</td>';
					str += '<td class="w10 T-right">'+ commas(Number(list.re_amt)) +'</td>';
					str += '<td class="w10 T-right">'+ commas(Number(list.cm_amt)) +'</td>';
					str += '<td class="w10 T-right">'+ commas(Number(list.mod_amt)) +'</td>';
					str += '<td class="w10 T-right">'+ commas(Number(list.bal_amt)) +'</td>';
					str += '<td class="w7">'+ list.sales_person_nm +'</td>';
					str += '<td class="w7">'+ list.acc_dt +'</td>';
					str += '</tr>';
				});

				$('#sth_list').append(str);

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
					str += "<td colspan='11'>조회 가능한 데이터가 없습니다.</td>";
					str += '</tr>';
					$('#sth_list').html(str);
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
