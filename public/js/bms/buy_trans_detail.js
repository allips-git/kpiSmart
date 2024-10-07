/*================================================================================
 * @name: 황호진 - buy_trans_detail.js	매입처별 거래내역 상세 js
 * @version: 1.0.0, @date: 2022-08-24
 ================================================================================*/
let g_bal_amt = 0;	//잔액
let g_prd_amt = 0;	//합계
let g_wd_amt = 0;	//입금
let g_mod_amt = 0;	//수정

//화면이 맨처음 로드 될때!
//================================================================================
get_btd_list(btd_search_organize());
//================================================================================

//이벤트
//================================================================================
/**
 * @description 검색란의 값이 바뀔때 이벤트
 * @author 황호진  @version 1.0, @last update 2022-08-25
 */
$('#st_dt , #ed_dt , #pd').on('change' , function () {
	get_btd_list(btd_search_organize());
});
//================================================================================


/**
 * @description 검색란 조건 정리
 * @author 황호진  @version 1.0, @last update 2022-08-24
 */
function btd_search_organize() {
	return {
		'st_dt'		: $('#st_dt').val(),
		'ed_dt'		: $('#ed_dt').val(),
		'cc'		: $('#cc').val(),
		'pd'		: $('#pd').val()
		// 'op_1'		: $('#op_1').val(),
		// 'op_2'		: $('#op_2').val(),
		// 'op_3'		: $('#op_3').val(),
		// 'op_4'		: $('#op_4').val(),
		// 'op_5'		: $('#op_5').val(),
		// 'op_6'		: $('#op_6').val()
	}
}

/**
 * @description get_btd_list
 * @author 황호진  @version 1.0, @last update 2022-08-24
 */
function get_btd_list(data) {
	let url = '/ledg/buy_trans_history/get_btd_list';
	let type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			g_bal_amt = Number(res.pre_mon_amt);
			g_prd_amt = 0;
			g_wd_amt = 0;
			g_mod_amt = 0;

			let len = res.data.length;
			let str = '';

			str += '<tr class="tr_before">';
			str += '<td colspan="15">이월 잔액</td>';
			str += '<td colspan="2">'+ commas(Number(res.pre_mon_amt)) +'</td>';
			str += '</tr>';

			if(len > 0)
			{
				let dt = '';	//날짜
				$.each(res.data , function (i , list) {
					let flag = false;

					//일별 합계 그리기
					if(dt === '')
					{	//날짜가 빈값일때 값 담기
						flag = true;
						dt = list.ord_dt;

					}
					else if(dt !== list.ord_dt)
					{	//담고있는 날짜와 그리는 날짜가 다를 경우
						flag = true;
						dt = list.ord_dt;

						str += '<tr class="tr_total">';
						str += '<td colspan="12">일별 합계</td>';
						str += '<td class="T-right">'+ commas(Number(g_prd_amt)) +'</td>';
						str += '<td class="T-right green">'+ commas(Number(g_wd_amt)) +'</td>';
						str += '<td class="T-right yellow">'+ commas(Number(g_mod_amt)) +'</td>';
						str += '<td class="T-right">'+ commas(Number(g_bal_amt)) +'</td>';
						str += '<td></td>';
						str += '</tr>';
					}

					str += '<tr>';

					if(flag)
					{
						str += '<td scope="col" class="'+ list.font_color_nm +'">'+ list.ord_dt +'</td>';
					}
					else
					{
						str += '<td scope="col" class="'+ list.font_color_nm +'"></td>';
					}
					str += '<td scope="col" class="'+ list.font_color_nm +'">';
					str += '<span>'+ list.acc_gb_nm +'</span>';
					str += '</td>';
					str += '<td scope="col" class="'+ list.font_color_nm +'">'+ list.trade_gb_nm +'</td>';
					str += '<td class="T-left '+ list.font_color_nm +'">'+ list.item_nm +'</td>';
					str += '<td scope="col" class="'+ list.font_color_nm +'">'+ list.width +'</td>';
					str += '<td scope="col" class="'+ list.font_color_nm +'">'+ list.height +'</td>';
					str += '<td scope="col" class="'+ list.font_color_nm +'">'+ list.qty +'</td>';
					str += '<td scope="col" class="'+ list.font_color_nm +'">'+ list.division +'</td>';
					str += '<td scope="col" class="'+ list.font_color_nm +'">'+ list.unit_nm +'</td>';
					str += '<td scope="col" class="T-right '+ list.font_color_nm +'">'+ discriminator('num' , list.unit_amt) +'</td>';
					str += '<td scope="col" class="T-right '+ list.font_color_nm +'">'+ discriminator('num' , list.ord_amt) +'</td>';
					str += '<td scope="col" class="T-right '+ list.font_color_nm +'">'+ discriminator('num' , list.tax_amt) +'</td>';
					str += '<td scope="col" class="T-right '+ list.font_color_nm +'">'+ discriminator('num' , list.total_amt) +'</td>';
					str += '<td scope="col" class="T-right '+ list.font_color_nm +'">'+ discriminator('num' , list.wd_amt) +'</td>';
					str += '<td scope="col" class="T-right '+ list.font_color_nm +'">'+ discriminator('num' , list.mod_amt) +'</td>';

					g_prd_amt += Number(list.total_amt);	//합계
					g_wd_amt += Number(list.wd_amt);	//입금
					g_mod_amt += Number(list.mod_amt);	//수정

					//잔액 계산
					g_bal_amt += (Number(list.total_amt) + Number(list.wd_amt) + Number(list.mod_amt));
					str += '<td scope="col" class="T-right">'+ commas(g_bal_amt) +'</td>';
					str += '<td scope="col" class="T-left">'+ list.fac_text +'</td>';
					str += '</tr>';

					if(list.unit === '006' || list.unit === '007')
					{
						let ord_spec = JSON.parse(list.ord_spec);
						let amt_spec = JSON.parse(list.amt_spec);
						//형상
						if(ord_spec['base_st'] === 'Y')
						{
							str += addline(list , 'b' , '형상');
						}
						//세로길이 추가금액
						if(amt_spec['height_amt'] > 0)
						{
							str += addline(list , 'h' , '세로길이추가금액');
						}
					}
				});

				str += '<tr class="tr_total">';
				str += '<td colspan="12">일별 합계</td>';
				str += '<td class="T-right">'+ commas(Number(g_prd_amt)) +'</td>';
				str += '<td class="T-right green">'+ commas(Number(g_wd_amt)) +'</td>';
				str += '<td class="T-right yellow">'+ commas(Number(g_mod_amt)) +'</td>';
				str += '<td class="T-right">'+ commas(Number(g_bal_amt)) +'</td>';
				str += '<td></td>';
				str += '</tr>';

				$('#btd_list').html(str);
			}
			else
			{
				$('#btd_list').html(str);
			}

			//금액 설정
			$('#all_pre_amt').html(commas(Number(res.amt.all_pre_amt)));
			$('#all_buy_amt').html(commas(Number(res.amt.all_buy_amt)));
			$('#all_re_amt').html(commas(Number(res.amt.all_re_amt)));
			$('#all_wd_amt').html(commas(Number(res.amt.all_wd_amt)));
			$('#all_mod_amt').html(commas(Number(res.amt.all_mod_amt)));
			$('#all_bal_amt').html(commas(Number(res.amt.all_bal_amt)));

		}).fail(fnc_ajax_fail);
}

/**
 * @description 식별 함수
 * @author 황호진  @version 1.0, @last update 2022-08-24
 */
function discriminator(type , str) {
	let result = '';

	switch (type) {
		case 'str':
			break;
		case 'num':
			if(Number(str) === 0)
			{
				result = '';
			}
			else
			{
				result = commas(Number(str));
			}
			break;
	}

	return result;
}

/**
 * @description 형상 , 세로길이추가금액에 따른 추가라인
 * @author 황호진  @version 1.0, @last update 2022-08-24
 */
function addline(data , type , name) {
	let str = '';

	str += '<td scope="col" class="'+ data.font_color_nm +'"></td>';
	str += '<td scope="col" class="'+ data.font_color_nm +'">';
	str += '<span>'+ data.acc_gb_nm +'</span>';
	str += '</td>';
	str += '<td scope="col" class="'+ data.font_color_nm +'">'+ data.trade_gb_nm +'</td>';
	str += '<td class="T-left '+ data.font_color_nm +'">'+ name +'</td>';
	str += '<td scope="col" class="'+ data.font_color_nm +'">'+ data.width +'</td>';
	str += '<td scope="col" class="'+ data.font_color_nm +'">'+ data.height +'</td>';
	str += '<td scope="col" class="'+ data.font_color_nm +'">'+ data.qty +'</td>';
	str += '<td scope="col" class="'+ data.font_color_nm +'"></td>';
	str += '<td scope="col" class="'+ data.font_color_nm +'">'+ data.unit_nm +'</td>';
	//금액부분 재계산
	let ord_spec = JSON.parse(data.ord_spec);
	let amt_spec = JSON.parse(data.amt_spec);
	let unit_amt = '' , ord_amt = '' , tax_amt = '';

	if(type === 'b')
	{	//형상
		unit_amt = Number(ord_spec.base_amt);
		ord_amt = unit_amt * data.qty;
		if(amt_spec['base_tax'] > 0)
		{
			tax_amt = Math.round(ord_amt / 10);
		}
	}
	else if(type === 'h')
	{	//세로길이
		unit_amt = '';
		ord_amt = amt_spec['height_amt'] * data.qty;
		if(amt_spec['height_tax'] > 0)
		{
			tax_amt = Math.round(ord_amt / 10);
		}
	}
	str += '<td scope="col" class="T-right '+ data.font_color_nm +'">'+ discriminator('num' , unit_amt) +'</td>';
	str += '<td scope="col" class="T-right '+ data.font_color_nm +'">'+ discriminator('num' , ord_amt) +'</td>';
	str += '<td scope="col" class="T-right '+ data.font_color_nm +'">'+ discriminator('num' , tax_amt) +'</td>';
	str += '<td scope="col" class="T-right '+ data.font_color_nm +'">'+ discriminator('num' , Number(ord_amt) + Number(tax_amt)) +'</td>';
	str += '<td scope="col" class="T-right '+ data.font_color_nm +'"></td>';
	str += '<td scope="col" class="T-right '+ data.font_color_nm +'"></td>';
	//합계 계산
	g_prd_amt += (Number(ord_amt) + Number(tax_amt));
	//잔액 계산
	g_bal_amt += (Number(ord_amt) + Number(tax_amt));
	str += '<td scope="col" class="T-right">'+ commas(g_bal_amt) +'</td>';
	str += '<td scope="col" class="T-left">'+ data.fac_text +'</td>';
	str += '</tr>';

	return str;
}
