/*================================================================================
 * @name: 황호진 - peri_trans_stat.js	기간 거래현황 js
 * @version: 1.0.0, @date: 2022-08-09
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
 * @author 황호진  @version 1.0, @last update 2022-08-10
 */
function get_list(data , event_type) {
	let url = '/ledg/peri_trans_stat/get_list';
	let type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			let len = res.data.length;
			let str = '';

			if(event_type === 'change')
			{
				$('#content').scrollTop(0);
				$('#dts_list').html('');
			}

			if(len > 0)
			{
				let ord_no = '' , ord_seq = 0;
				/*
				gb			: 구분
				vat			: 부가세
				option 		: 옵션
				ord_spec1 	: ord_bseq가 분할인값도 다 포함한 규격
				ord_spec2 	: ord_bseq가 1인 규격
				ord_qty		: 수량스펙
				amt_spec 	: 금액스펙
				 */
				let gb , vat , option , ord_spec1 , ord_spec2 , ord_qty , amt_spec;
				$.each(res.data , function (i , list) {

					if(ord_no === '')
					{	//주문번호가 빈값일 경우
						ord_no = list.ord_no;
						ord_seq = list.ord_seq;
					}
					else if(ord_no !== list.ord_no || ord_seq !== list.ord_seq)
					{	//주문번호가 현재 그리는 주문번호랑 다르거나 순번또한 다를 경우
						ord_no = list.ord_no;
						ord_seq = list.ord_seq;

						str += duplicate_source(gb , vat , option , ord_spec1 , ord_spec2 , ord_qty , amt_spec);
					}

					//설정
					gb = list.gb;
					vat = list.vat;
					option = JSON.parse(list.option);		//옵션
					ord_spec1 = JSON.parse(list.ord_spec1);
					ord_spec2 = JSON.parse(list.ord_spec2);	//ord_bseq가 1인 규격
					ord_qty = JSON.parse(list.ord_qty);		//수량
					amt_spec = JSON.parse(list.amt_spec);	//개별금액

					if(gb === 'S')
					{	//매출
						str += '<tr>';
					}
					else if(gb === 'B')
					{	//매입
						str += '<tr class="maeip">';
					}
					str += '<td class="w4">'+ list.row_no +'</td>';
					str += '<td class="w6">'+ list.ord_dt +'</td>';
					str += '<td class="w5">'+ list.make_gb_nm +'</td>';
					str += '<td class="T-left">'+ list.cust_nm +'</td>';
					str += '<td class="w5">'+ list.pay_gb_nm +'</td>';
					str += '<td class="w5">'+ list.vat_nm +'</td>';
					str += '<td class="T-left">'+ list.item_nm +'</td>';
					str += '<td class="w5">'+ list.width +'</td>';
					str += '<td class="w5">'+ list.height +'</td>';
					str += '<td class="w4">'+ list.left_qty +'</td>';
					str += '<td class="w4">'+ list.right_qty +'</td>';
					str += '<td class="w4">'+ list.qty +'</td>';
					str += '<td class="w5">'+ list.unit_nm +'</td>';
					str += '<td class="w6 T-right">'+ list.unit_amt +'</td>';

					//금액 , 세액 , 합계 설정
					let amt = 0 , tax = 0;
					if(ord_spec2['unit'] === '001' || ord_spec2['unit'] === '002')
					{	//회베 , m2
						if(ord_spec2['division'] > 1)
						{
							amt = Number(amt_spec['prd_amt']);
							tax = Number(amt_spec['prd_tax']);
						}
						else
						{
							amt = Number(amt_spec['prd_amt']) * (Number(list.left_qty) + Number(list.right_qty));
							tax = Number(amt_spec['prd_tax']) * (Number(list.left_qty) + Number(list.right_qty));
						}

					}
					else
					{	//Yard , 폭 , EA , Box
						amt = Number(amt_spec['prd_amt']) * Number(list.qty);
						tax = Number(amt_spec['prd_tax']) * Number(list.qty);
					}
					str += '<td class="w6 T-right">'+ commas(amt) +'</td>';
					str += '<td class="w6 T-right">'+ commas(tax) +'</td>';
					str += '<td class="w6 T-right">'+ commas(amt + tax) +'</td>';
					str += '</tr>';
				});

				str += duplicate_source(gb , vat , option , ord_spec1 , ord_spec2 , ord_qty , amt_spec);

				$('#dts_list').append(str);

				if(len === max_num)
				{	//불러온 데이터 수가 50일 경우 다음이 있다 판단하여 start_num에 값을 더함
					stat = true;
					start_num = start_num + max_num;
				}
				else
				{	//그게 아닐 경우 다음이 없다 판단하여 상태값을 false 처리
					stat = false;
				}
				
				//금액설정
				let sale_amt = res.sale_amt;
				let re_sale_amt = res.re_sale_amt;
				let buy_amt = res.buy_amt;
				let re_buy_amt = res.re_buy_amt;

				//매출금액 - 공급가액
				$('#sale_ord_amt').html(commas(Number(sale_amt['sale_ord_amt'])));
				//매출 반품금액 - 공급가액
				$('#re_sale_ord_amt').html(commas(Number(re_sale_amt['re_sale_ord_amt'])));
				//총 매출금액 - 공급가액
				$('#sum_sale_ord_amt').html(commas(Number(sale_amt['sale_ord_amt']) + Number(re_sale_amt['re_sale_ord_amt'])));
				//매입금액 - 공급가액
				$('#buy_ord_amt').html(commas(Number(buy_amt['buy_ord_amt'])));
				//매입 반품금액 - 공급가액
				$('#re_buy_ord_amt').html(commas(Number(re_buy_amt['re_buy_ord_amt'])));
				//총 매입금액 - 공급가액
				$('#sum_buy_ord_amt').html(commas(Number(buy_amt['buy_ord_amt']) + Number(re_buy_amt['re_buy_ord_amt'])));
				//매출금액 - 세액
				$('#sale_tax_amt').html(commas(Number(sale_amt['sale_tax_amt'])));
				//매출 반품금액 - 세액
				$('#re_sale_tax_amt').html(commas(Number(re_sale_amt['re_sale_tax_amt'])));
				//총 매출금액 - 세액
				$('#sum_sale_tax_amt').html(commas(Number(sale_amt['sale_tax_amt']) + Number(re_sale_amt['re_sale_tax_amt'])));
				//매입금액 - 세액
				$('#buy_tax_amt').html(commas(Number(buy_amt['buy_tax_amt'])));
				//매입 반품금액 - 세액
				$('#re_buy_tax_amt').html(commas(Number(re_buy_amt['re_buy_tax_amt'])));
				//총 매입금액 - 세액
				$('#sum_buy_tax_amt').html(commas(Number(buy_amt['buy_tax_amt']) + Number(re_buy_amt['re_buy_tax_amt'])));
				//매출금액 - 합계
				$('#total_sale_amt').html(commas(Number(sale_amt['sale_ord_amt']) + Number(sale_amt['sale_tax_amt'])));
				//매출 반품금액 - 합계
				$('#total_re_sale_amt').html(commas(Number(re_sale_amt['re_sale_ord_amt']) + Number(re_sale_amt['re_sale_tax_amt'])));
				//총 매출금액 - 합계
				$('#total_all_sale_amt').html(commas(Number(sale_amt['sale_ord_amt']) + Number(sale_amt['sale_tax_amt']) + Number(re_sale_amt['re_sale_ord_amt']) + Number(re_sale_amt['re_sale_tax_amt'])));
				//매입금액 - 합계
				$('#total_buy_amt').html(commas(Number(buy_amt['buy_ord_amt']) + Number(buy_amt['buy_tax_amt'])));
				//매입 반품금액 - 합계
				$('#total_re_buy_amt').html(commas(Number(re_buy_amt['re_buy_ord_amt']) + Number(re_buy_amt['re_buy_tax_amt'])));
				//총 매입금액 - 합계
				$('#total_all_buy_amt').html(commas(Number(buy_amt['buy_ord_amt']) + Number(buy_amt['buy_tax_amt']) + Number(re_buy_amt['re_buy_ord_amt']) + Number(re_buy_amt['re_buy_tax_amt'])));
			}
			else
			{
				if(start_num === 0)
				{
					str += '<tr>';
					str += "<td colspan='17'>조회 가능한 데이터가 없습니다.</td>";
					str += '</tr>';
					$('#dts_list').html(str);

					//매출금액 - 공급가액
					$('#sale_ord_amt').html(0);
					//매출 반품금액 - 공급가액
					$('#re_sale_ord_amt').html(0);
					//총 매출금액 - 공급가액
					$('#sum_sale_ord_amt').html(0);
					//매입금액 - 공급가액
					$('#buy_ord_amt').html(0);
					//매입 반품금액 - 공급가액
					$('#re_buy_ord_amt').html(0);
					//총 매입금액 - 공급가액
					$('#sum_buy_ord_amt').html(0);
					//매출금액 - 세액
					$('#sale_tax_amt').html(0);
					//매출 반품금액 - 세액
					$('#re_sale_tax_amt').html(0);
					//총 매출금액 - 세액
					$('#sum_sale_tax_amt').html(0);
					//매입금액 - 세액
					$('#buy_tax_amt').html(0);
					//매입 반품금액 - 세액
					$('#re_buy_tax_amt').html(0);
					//총 매입금액 - 세액
					$('#sum_buy_tax_amt').html(0);
					//매출금액 - 합계
					$('#total_sale_amt').html(0);
					//매출 반품금액 - 합계
					$('#total_re_sale_amt').html(0);
					//총 매출금액 - 합계
					$('#total_all_sale_amt').html(0);
					//매입금액 - 합계
					$('#total_buy_amt').html(0);
					//매입 반품금액 - 합계
					$('#total_re_buy_amt').html(0);
					//총 매입금액 - 합계
					$('#total_all_buy_amt').html(0);
				}
			}

		}).fail(fnc_ajax_fail);
}

/**
 * @description addline
 * @author 황호진  @version 1.0, @last update 2022-08-11
 */
function addline(gb , nm , u_amt , o_amt , t_amt) {
	let str = '';
	if(gb === 'S')
	{
		str += '<tr>';
	}
	else if(gb === 'B')
	{
		str += '<tr class="maeip">';
	}
	str += '<td class="w4"></td>';
	str += '<td class="w6"></td>';
	str += '<td class="w5"></td>';
	str += '<td class="T-left"></td>';
	str += '<td class="w5"></td>';
	str += '<td class="w5"></td>';
	str += '<td class="T-left">'+ nm +'</td>';
	str += '<td class="w5"></td>';
	str += '<td class="w5"></td>';
	str += '<td class="w4"></td>';
	str += '<td class="w4"></td>';
	str += '<td class="w4"></td>';
	str += '<td class="w5"></td>';
	str += '<td class="w6 T-right">'+ commas(u_amt) +'</td>';
	str += '<td class="w6 T-right">'+ commas(o_amt) +'</td>';
	str += '<td class="w6 T-right">'+ commas(t_amt) +'</td>';
	str += '<td class="w6 T-right">'+ commas(o_amt + t_amt) +'</td>';
	str += '</tr>';

	return str;
}

/**
 * @description 옵션1,옵션2,형상,세로길이추가금액과 같이 tr태그가 추가적으로 그려지는 코드가 중복이라 함수로 묶음
 * @author 황호진  @version 1.0, @last update 2022-08-11
 */
function duplicate_source(gb , vat , option , ord_spec1 , ord_spec2 , ord_qty , amt_spec) {
	let str = '';

	//옵션 단가 구하기위해 단위 수치 설정
	let size = 1;
	if(ord_spec2['unit'] === '001' || ord_spec2['unit'] === '002')
	{	//화베 , m2
		size = ord_spec1['ord_hebe'];
	}
	else if(ord_spec2['unit'] === '006')
	{	//yard
		size = ord_spec1['ord_yard'];
	}
	else if(ord_spec2['unit'] === '007')
	{	//pok
		size = ord_spec1['ord_pok'];
	}

	//수량 설정
	let qty = 1;
	if(ord_spec2['unit'] === '001' || ord_spec2['unit'] === '002')
	{
		qty = ord_qty['left_qty'] + ord_qty['rigth_qty'];
	}
	else
	{
		qty = ord_qty['qty'];
	}

	//기준단가 , 옵션 총세액
	let op_unit_amt , op_tax_amt = 0;

	//옵션1이 존재할때 추가되는 라인
	if(option['op1_nm'] !== '')
	{
		//기준단가
		if(option['op1_unit'] === '*')
		{	//면적당일때 기준단가를 추려내는 방법은 나눠야함
			op_unit_amt = amt_spec['op1_amt'] / size;
		}
		else if(option['op1_unit'] === '+')
		{	//개당
			op_unit_amt = amt_spec['op1_amt'];
		}

		//부가세
		if(vat === 'Y')
		{
			op_tax_amt = Math.round(option['op1_amt'] / 10);
		}
		str += addline(gb , option['op1_nm'] , op_unit_amt , option['op1_amt'] , op_tax_amt)
	}

	//옵션2이 존재할때 추가되는 라인
	if(option['op2_nm'] !== '')
	{
		//기준단가
		if(option['op2_unit'] === '*')
		{	//면적당일때 기준단가를 추려내는 방법은 나눠야함
			op_unit_amt = amt_spec['op2_amt'] / size;
		}
		else if(option['op2_unit'] === '+')
		{	//개당
			op_unit_amt = amt_spec['op2_amt'];
		}

		//부가세
		if(vat === 'Y')
		{
			op_tax_amt = Math.round(option['op2_amt'] / 10);
		}
		str += addline(gb , option['op2_nm'] , op_unit_amt , option['op2_amt'] , op_tax_amt)
	}

	//야드 , 폭일 경우
	if(ord_spec2['unit'] === '006' || ord_spec2['unit'] === '007')
	{
		//형상
		if(ord_spec2['base_st'] === 'Y')
		{
			str += addline(gb , '형상' , ord_spec2['base_amt'] , amt_spec['base_amt'] * qty , amt_spec['base_tax'] * qty);
		}

		//세로길이추가금액
		if(amt_spec['height_amt'] > 0)
		{
			str += addline(gb , '세로길이추가금액' , '' , amt_spec['height_amt'] * qty , amt_spec['height_tax'] * qty);
		}
	}

	return str;
}
