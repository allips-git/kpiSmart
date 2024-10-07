/*================================================================================
 * @name: 황호진 - sale_trans_detail.js	매출처별 거래내역 상세 js
 * @version: 1.0.0, @date: 2022-08-22
 ================================================================================*/
let g_bal_amt = 0;	//잔액
let g_prd_amt = 0;	//합계
let g_dep_amt = 0;	//입금
let g_mod_amt = 0;	//수정

//화면이 맨처음 로드 될때!
//================================================================================
get_std_list(std_search_organize());
//================================================================================
//이벤트
//================================================================================
/**
 * @description 검색란의 값이 바뀔때 이벤트
 * @author 황호진  @version 1.0, @last update 2022-08-25
 */
$('#st_dt , #ed_dt , #pd').on('change' , function () {
	get_std_list(std_search_organize());
});

/**
 * @description 거래내역 출력 버튼
 * @author 황호진  @version 1.0, @last update 2022/08/23
 */
$(document).on('click' , '#std_print_btn' , function () {
	/** 팝업 */
	let innerHtml = document.getElementById('mytest').innerHTML;
	let popupWindow = window.open("", "_blank", "width=793.7,height=1122.5");
	popupWindow.document.write("<!DOCTYPE html>"+
								"<html>"+
								"<head>"+
								"<link rel='stylesheet' href='/public/css/bms/ord_print_pop.css'>" +
								"<link rel='stylesheet' href='/public/css/bms/new_common.css'>" +
								"</head>"+
								"<body>"+innerHtml+"</body>"+
								"</html>");
    
	popupWindow.document.close();
	popupWindow.focus();

	/** 1초 지연 */
	setTimeout(() => {
		popupWindow.print();
		popupWindow.close();
	}, 1000)
});
//================================================================================

/**
 * @description 검색란 조건 정리
 * @author 황호진  @version 1.0, @last update 2022-08-22
 */
function std_search_organize() {
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
 * @description get_std_list
 * @author 황호진  @version 1.0, @last update 2022-08-22
 */
function get_std_list(data) {
	let url = '/ledg/sale_trans_history/get_std_list';
	let type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			g_bal_amt = Number(res.pre_mon_amt);
			g_prd_amt = 0;
			g_dep_amt = 0;
			g_mod_amt = 0;

			let len = res.data.length;
			let str = '';

			str += '<tr class="tr_before">';
			str += '<td colspan="14" class="T-center">이월 잔액</td>';
			str += '<td class="w6 T-right">'+ commas(Number(res.pre_mon_amt)) +'</td>';
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
						str += '<td colspan="11" class="T-center">일별 합계</td>';
						str += '<td class="T-right">'+ commas(Number(g_prd_amt)) +'</td>';
						str += '<td class="T-right green">'+ commas(Number(g_dep_amt)) +'</td>';
						str += '<td class="T-right yellow">'+ commas(Number(g_mod_amt)) +'</td>';
						str += '<td class="T-right">'+ commas(Number(g_bal_amt)) +'</td>';
						str += '</tr>';
					}

					str += '<tr onclick=open_ordno("'+ list.ord_no +'")>';

					if(flag)
					{
						str += '<td colspan="2" class="w12'+ list.font_color_nm +'">'+ list.ord_dt +'</td>';
					}
					else
					{
						str += '<td colspan="2" class="w12'+ list.font_color_nm +'"></td>';
					}
					str += '<td class="T-left w21 prname'+ list.font_color_nm +'">'+ list.item_nm +'</td>';
					str += '<td rowspan="2" class="w5'+ list.font_color_nm +'">'+ list.width +'</td>';
					str += '<td rowspan="2" class="w5'+ list.font_color_nm +'">'+ list.height +'</td>';
					str += '<td rowspan="2" class="w5'+ list.font_color_nm +'">'+ list.qty +'</td>';
					str += '<td rowspan="2" class="w5'+ list.font_color_nm +'">'+ list.division +'</td>';
					str += '<td rowspan="2" class="w5'+ list.font_color_nm +'">'+ list.unit_nm +'</td>';
					str += '<td rowspan="2" class="w6 T-right '+ list.font_color_nm +'">'+ discriminator('num' , list.unit_amt) +'</td>';
					str += '<td rowspan="2" class="w6 T-right '+ list.font_color_nm +'">'+ discriminator('num' , list.ord_amt) +'</td>';
					str += '<td rowspan="2" class="w6 T-right '+ list.font_color_nm +'">'+ discriminator('num' , list.tax_amt) +'</td>';
					str += '<td rowspan="2" class="w6 T-right '+ list.font_color_nm +'">'+ discriminator('num' , list.total_amt) +'</td>';
					str += '<td rowspan="2" class="w6 T-right '+ list.font_color_nm +'">'+ discriminator('num' , list.dep_amt) +'</td>';
					str += '<td rowspan="2" class="w6 T-right '+ list.font_color_nm +'">'+ discriminator('num' , list.mod_amt) +'</td>';
					
					g_prd_amt += Number(list.total_amt);	//합계
					g_dep_amt += Number(list.dep_amt);	//입금
					g_mod_amt += Number(list.mod_amt);	//수정

					//잔액 계산
					g_bal_amt += (Number(list.total_amt) + Number(list.dep_amt) + Number(list.mod_amt));
					str += '<td rowspan="2" class="w6 T-right">'+ commas(g_bal_amt) +'</td>';
					str += '</tr>';
                    str += '<tr>';
					str += '<td scope="col" class="w6 '+ list.font_color_nm +'">';
					str += '<span>'+ list.acc_gb_nm +'</span>';
					str += '</td>';
					str += '<td scope="col" class="w6 '+ list.font_color_nm +'">'+ list.trade_gb_nm +'</td>';
					str += '<td scope="col" class="w21 T-left bgo">'+ list.fac_text +'</td>';
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
				str += '<td colspan="11" class="T-center">일별 합계</td>';
				str += '<td class="T-right">'+ commas(Number(g_prd_amt)) +'</td>';
				str += '<td class="T-right green">'+ commas(Number(g_dep_amt)) +'</td>';
				str += '<td class="T-right yellow">'+ commas(Number(g_mod_amt)) +'</td>';
				str += '<td class="T-right">'+ commas(Number(g_bal_amt)) +'</td>';
				str += '</tr>';

				$('#std_list').html(str);
			}
			else
			{
				$('#std_list').html(str);
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

/**
 * @description 식별 함수
 * @author 황호진  @version 1.0, @last update 2022-08-23
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
 * @author 황호진  @version 1.0, @last update 2022-08-23
 */
function addline(data , type , name) {
	let str = '';

	str += '<td colspan="2" class="w12'+ data.font_color_nm +'"></td>';
	str += '<td class="T-left w21 prname'+ data.font_color_nm +'">'+ name +'</td>';
	str += '<td rowspan="2" class="'+ data.font_color_nm +'">'+ data.width +'</td>';
	str += '<td rowspan="2" class="'+ data.font_color_nm +'">'+ data.height +'</td>';
	str += '<td rowspan="2" class="'+ data.font_color_nm +'">'+ data.qty +'</td>';
	str += '<td rowspan="2" class="'+ data.font_color_nm +'"></td>';
	str += '<td rowspan="2" class="'+ data.font_color_nm +'">'+ data.unit_nm +'</td>';
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
	str += '<td rowspan="2" class="T-right '+ data.font_color_nm +'">'+ discriminator('num' , unit_amt) +'</td>';
	str += '<td rowspan="2" class="T-right '+ data.font_color_nm +'">'+ discriminator('num' , ord_amt) +'</td>';
	str += '<td rowspan="2" class="T-right '+ data.font_color_nm +'">'+ discriminator('num' , tax_amt) +'</td>';
	str += '<td rowspan="2" class="T-right '+ data.font_color_nm +'">'+ discriminator('num' , Number(ord_amt) + Number(tax_amt)) +'</td>';
	str += '<td rowspan="2" class="T-right '+ data.font_color_nm +'"></td>';
	str += '<td rowspan="2" class="T-right '+ data.font_color_nm +'"></td>';
	//합계 계산
	g_prd_amt += (Number(ord_amt) + Number(tax_amt));
	//잔액 계산
	g_bal_amt += (Number(ord_amt) + Number(tax_amt));
	str += '<td rowspan="2" class="T-right">'+ commas(g_bal_amt) +'</td>';
	str += '</tr>';
    str += '<tr>';
	str += '<td class="w6 '+ data.font_color_nm +'">';
	str += '<span>'+ data.acc_gb_nm +'</span>';
	str += '</td>';
	str += '<td class="w6 '+ data.font_color_nm +'">'+ data.trade_gb_nm +'</td>';
	str += '<td class="w21 T-left bgo">'+ data.fac_text +'</td>';
	str += '</tr>';

	return str;
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
