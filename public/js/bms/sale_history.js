/*================================================================================
 * @name: 황호진 - sale_history.js	매출내역 js
 * @version: 1.0.0, @date: 2022-08-11
 ================================================================================*/
let start_num = 0;
let stat = true;
const max_num = 50;
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	//list 조회
	get_list(search_organize() , 'load');
	//================================================================================

	//이벤트
	//================================================================================
	/**
	 * @description 스크롤 기반 데이터 더보기 형태의 조회
	 * @author 황호진  @version 1.0, @last update 2022/08/10
	 */
	$('#content').on("scroll", function(){
		let scroll_top = $(this).scrollTop();
		let inner_height = $(this).innerHeight();
		let scroll_height = $(this).prop('scrollHeight');
		if (scroll_top + inner_height >= scroll_height) // 스크롤 끝 부분쯤 도착했을 시
		{
			if(stat)
			{
				get_list(search_organize() , 'scroll');
			}
		}
	});
	//================================================================================
});

/**
 * @description 검색란 조건 정리
 * @author 황호진  @version 1.0, @last update 2022-08-09
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
		'op_4'		: $('#op_4').val(),
		'op_5'		: $('#op_5').val(),
		'op_6'		: $('#op_6').val()
	}
}

/**
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2022-08-16
 */
function get_list(data , event_type) {
	let url = '/ledg/sale_history/get_list';
	let type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			let len = res.data.length;
			let str = '';

			if(event_type === 'change')
			{
				$('#content').scrollTop(0);
				$('#sh_list').html('');
			}

			if(len > 0)
			{
				let ord_no = '' , ord_seq = 0;

				/*
				size			: 회베,야드,폭 등등
				option 			: 옵션
				ord_spec 		: ord_bseq가 1인 규격
				total_qty		: 총수량
				amt_spec 		: 매출금액
				buy_amt_spec	: 매입금액
				 */
				let unit_nm , size , option , ord_spec , total_qty , amt_spec , buy_amt_spec;
				$.each(res.data , function (i , list) {

					if(ord_no === '')
					{	//주문번호가 빈값일 경우
						ord_no = list.ord_no;
						ord_seq = list.ord_seq;
					}
					else if(ord_no !== list.ord_no || ord_seq !== list.ord_seq)
					{
						ord_no = list.ord_no;
						ord_seq = list.ord_seq;

						if(ord_spec['unit'] === '006' || ord_spec['unit'] === '007')
						{
							if(ord_spec['base_st'] === 'Y')
							{
								str += addline('형상' ,
									ord_spec['ord_width'] ,
									ord_spec['ord_height'] ,
									total_qty ,
									unit_nm ,
									ord_spec['purc_base_amt'] ,
									Number(buy_amt_spec['base_amt']) + Number(buy_amt_spec['base_tax']),
									ord_spec['base_amt'],
									Number(amt_spec['base_amt']) + Number(amt_spec['base_tax']));
							}

							if(amt_spec['height_amt'] > 0)
							{
								str += addline('세로길이추가금액' ,
									ord_spec['ord_width'] ,
									ord_spec['ord_height'] ,
									total_qty ,
									unit_nm ,
									'' ,
									'',
									ord_spec['base_amt'],
									Number(amt_spec['base_amt']) + Number(amt_spec['base_tax']));
							}
						}
						
						//옵션부분은 미완성
						
					}

					//설정
					unit_nm = list.unit_nm;
					size = list.size;
					option = JSON.parse(list.option);		//옵션
					ord_spec = JSON.parse(list.ord_spec);	//ord_bseq가 1인 규격
					total_qty = list.total_qty;				//수량
					amt_spec = JSON.parse(list.amt_spec);	//개별금액
					buy_amt_spec = JSON.parse(list.buy_amt_spec);

					str += '<tr>';
					str += '<td class="w4">'+ list.row_no +'</td>';
					str += '<td class="w6">'+ list.ord_dt +'</td>';
					str += '<td class="w5 blue">'+ list.make_gb_nm +'</td>';
					str += '<td class="T-left">'+ list.cust_nm +'</td>';
					str += '<td class="T-left blue">'+ list.item_nm +'</td>';
					str += '<td class="w5">'+ list.width +'</td>';
					str += '<td class="w5">'+ list.height +'</td>';
					str += '<td class="w4">'+ list.left_qty +'</td>';
					str += '<td class="w4">'+ list.right_qty +'</td>';
					str += '<td class="w4">'+ list.qty +'</td>';
					str += '<td class="w5">'+ list.unit_nm +'</td>';
					str += '<td class="w6 T-right">'+ commas(Number(list.buy_unit_amt)) +'</td>';
					str += '<td class="w6 T-right">'+ commas(Number(list.buy_amt)) +'</td>';
					str += '<td class="w6 T-right">'+ commas(Number(list.unit_sale_amt)) +'</td>';
					str += '<td class="w6 T-right">'+ commas(Number(list.sale_amt)) +'</td>';
					str += '<td class="w6 T-right">'+ commas(Number(list.prf_amt)) +'</td>';
					str += '<td class="w6 T-right">'+ Number(list.margin_rate) +'%</td>';
					str += '</tr>';
				});

				if(ord_spec['unit'] === '006' || ord_spec['unit'] === '007')
				{
					if(ord_spec['base_st'] === 'Y')
					{
						str += addline('형상' ,
							ord_spec['ord_width'] ,
							ord_spec['ord_height'] ,
							total_qty ,
							unit_nm ,
							ord_spec['purc_base_amt'] ,
							Number(buy_amt_spec['base_amt']) + Number(buy_amt_spec['base_tax']),
							ord_spec['base_amt'],
							Number(amt_spec['base_amt']) + Number(amt_spec['base_tax']));
					}

					if(amt_spec['height_amt'] > 0)
					{
						str += addline('세로길이추가금액' ,
							ord_spec['ord_width'] ,
							ord_spec['ord_height'] ,
							total_qty ,
							unit_nm ,
							'' ,
							'',
							ord_spec['base_amt'],
							Number(amt_spec['base_amt']) + Number(amt_spec['base_tax']));
					}
				}

				//옵션부분은 미완성

				$('#sh_list').append(str);

				if(len === max_num)
				{	//불러온 데이터 수가 50일 경우 다음이 있다 판단하여 start_num에 값을 더함
					stat = true;
					start_num = start_num + max_num;
				}
				else
				{	//그게 아닐 경우 다음이 없다 판단하여 상태값을 false 처리
					stat = false;
				}

				$('#total_sale_amt').html(commas(Number(res.sale_amt)));
				$('#total_buy_amt').html(commas(Number(res.buy_amt)));
				$('#total_prf_amt').html(commas(Number(res.prf_amt)));
				$('#total_margin_rate').html(Number(res.margin_rate));
			}
			else
			{
				if(start_num === 0)
				{
					str += '<tr>';
					str += "<td colspan='17'>조회 가능한 데이터가 없습니다.</td>";
					str += '</tr>';
					$('#sh_list').html(str);

					$('#total_sale_amt').html('0');
					$('#total_buy_amt').html('0');
					$('#total_prf_amt').html('0');
					$('#total_margin_rate').html('0%');
				}
			}

		}).fail(fnc_ajax_fail);
}

/**
 * @description addline
 * @author 황호진  @version 1.0, @last update 2022-08-17
 */
function addline(name , width , height , qty , unit_nm , buy_unit_amt , buy_amt , unit_sale_amt , sale_amt) {
	let str = '';

	str += '<tr>';
	str += '<td class="w4"></td>';
	str += '<td class="w6"></td>';
	str += '<td class="w5 blue"></td>';
	str += '<td class="T-left"></td>';
	str += '<td class="T-left blue">'+ name +'</td>';
	str += '<td class="w5">'+ width +'</td>';
	str += '<td class="w5">'+ height +'</td>';
	str += '<td class="w4"></td>';
	str += '<td class="w4"></td>';
	str += '<td class="w4">'+ qty +'</td>';
	str += '<td class="w5">'+ unit_nm +'</td>';
	str += '<td class="w6 T-right">'+ commas(Number(buy_unit_amt)) +'</td>';
	str += '<td class="w6 T-right">'+ commas(Number(buy_amt)) +'</td>';
	str += '<td class="w6 T-right">'+ commas(Number(unit_sale_amt)) +'</td>';
	str += '<td class="w6 T-right">'+ commas(Number(sale_amt)) +'</td>';
	str += '<td class="w6 T-right">'+ commas(Number(sale_amt - buy_amt)) +'</td>';

	//마진율
	let margin_rate = 0;
	if(Number(buy_amt) !== 0)
	{	//매입금액이 0원이 아닐때
		if(Number(sale_amt - buy_amt) !== 0)
		{	//이익금액이 0원이 아닐때
			margin_rate = Math.round(Number(sale_amt - buy_amt) / Number(buy_amt) * 1000) / 10;
		}
		else
		{	//이익금액이 0원일때
			margin_rate = 0;
		}
	}
	else
	{	//매입금액이 0원일때
		margin_rate = 100;
	}

	str += '<td class="w6 T-right">'+ Number(margin_rate)  +'%</td>';
	str += '</tr>';

	return str;
}
