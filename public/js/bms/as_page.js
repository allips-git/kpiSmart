/*================================================================================
 * @name: 황호진 - as_page.js	A/S 페이지 JS
 * @version: 1.0.0, @date: 2022-06-30
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var search_data = {
		s	: null
	};
	get_list(search_data);
	//================================================================================

	//이벤트 걸기
	//================================================================================
	/**
	 * @description A/S페이지 입고팝업 열기
	 * @author 황호진  @version 1.0, @last update 2022/07/01
	 */
	$(document).on('click', '.in_pop' , function () {
		$('#input_url').val('/ord/as_page');
		$('#input_ik').val($(this).attr('data-ik'));

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
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2022/06/30
 */
function get_list(data) {
	var container = $('#pagination');
	var url = '/ord/as_page/get_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				dataSource: res.data.list,
				className: 'paginationjs-theme-blue paginationjs-small',
				pageSize: 20,
				autoHidePrevious: false,
				autoHideNext: false,
				callback: function (cres, pagination) {
					var len = cres.length;
					var str = '';
					if(len > 0){
						$.each(cres , function (i , list) {
							var item_gb = JSON.parse(list.item_gb);
							var option = JSON.parse(list.option);
							var ord_spec = JSON.parse(list.ord_spec);

							str += '<tr>';
							str += '<td class="w10 T-left">' + list.cust_nm + '</td>';

							var item_nm = list.item_nm;
							if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
								item_nm = addstr(item_nm, item_gb['item_gb']);
							}else if(ord_spec['unit'] === '006' || ord_spec['unit'] === '007'){
								var work_way = ord_spec['work_way'] === '001' ? '평주름' : '나비주름';
								item_nm = addstr(item_nm, work_way);
								var base_st = ord_spec['base_st'] === 'Y' ? '형상옵션' : '';
								item_nm = addstr(item_nm , base_st);
							}
							item_nm = addstr(item_nm , option['op1_nm']);
							item_nm = addstr(item_nm , option['op2_nm']);
							str += '<td class="blue T-left w16">'+ item_nm +'</td>';
							if(ord_spec['unit'] === '005' || ord_spec['unit'] === '011'){
								//EA , BOX 단위의 경우 가로 세로 빈값처리
								str += '<td class="w5"></td>';
								str += '<td class="w5"></td>';
							}else if(ord_spec['unit'] === '006' || ord_spec['unit'] === '007'){
								//Yard , pok 의 경우 가로 세로의 값이 존재함에 따라 아래와 같이 처리
								str += '<td class="w5">'+ ord_spec['ord_width'] +'</td>';
								str += '<td class="w5">'+ ord_spec['ord_height'] +'</td>';
							}else if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
								if(ord_spec['division'] > 1){
									str += '<td class="w5">'+ ord_spec['div_width'] +'</td>';
									str += '<td class="w5">'+ ord_spec['div_height'] +'</td>';
								}else{
									str += '<td class="w5">'+ ord_spec['ord_width'] +'</td>';
									str += '<td class="w5">'+ ord_spec['ord_height'] +'</td>';
								}
							}

							//수량 설정
							if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
								if(ord_spec['division'] > 1){
									str += '<td class="w5">1개</td>';
								}else{
									str += '<td class="w5">'+ list.qty +'개</td>';
								}
							}else{
								str += '<td class="w5">'+ list.qty +'개</td>';
							}

							if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
								if(ord_spec['division'] > 1){
									str += '<td class="w6">'+ ord_spec['div_hebe'] + list.unit_nm +'</td>';
								}else{
									str += '<td class="w6">'+ ord_spec['ord_hebe'] + list.unit_nm +'</td>';
								}
							}else if(ord_spec['unit'] === '006'){
								str += '<td class="w6">'+ ord_spec['ord_yard'] + list.unit_nm +'</td>';
							}else if(ord_spec['unit'] === '007'){
								str += '<td class="w6">'+ ord_spec['ord_pok'] + list.unit_nm +'</td>';
							}else if(ord_spec['unit'] === '005' || ord_spec['unit'] === '011'){
								str += '<td class="w6">'+ list.qty + list.unit_nm +'</td>';
							}
							str += '<td class="w6 T-right">'+ commas(Number(list.sum_amt)) +'원</td>';
							str += '<td class="T-left">'+ list.rec_detail +'</td>';
							str += '<td class="w8">';
							str += '<span class="red">'+ list.make_gb_nm +'</span>';
							str += '</td>';
							str += '<td class="w7">'+ list.rec_dt +'</td>';
							str += '<td class="w7">';
							//생산반품 , 외주반품 , 시스템반품은 출고할것이 없기때문에 출고상태 빈값처리
							if(list.make_gb === '004' || list.make_gb === '006' || list.make_gb === '007' || list.make_gb === '008' || list.make_gb === '012'){
							}else{
								if(list.out_dt === ""){		//빈값의 경우 출고대기
									str += '<span class="yellow">출고대기</span>';
								}else{						//빈갑이 아니란 소리는 출고완료인 상태! 날짜 표기
									str += '<span>'+ list.out_dt +'</span>';
								}
							}
							str += '</td>';
							str += '<td class="w7">';
							if(list.in_dt === ""){
								if(list.sysgb === 'A'){			//A : 외주
									str += '<button type="button" class="in_pop" data-ik="'+ list.ikey +'">입고완료</button>';
								}else if(list.sysgb === 'B'){	//B : 시스템외주
									str += '<button type="button" class="pp in_pop" data-ik="'+ list.ikey +'">입고완료</button>';
								}
							}else{		//입고날짜가 있을 경우 입고완료된 경우!
								str += '<span>'+ list.in_dt +'</span>';
							}
							str += '</td>';
							str += '</tr>';
						});
						$('#as_list').html(str);
					}else{
						str += '<tr>';
						str += '<td colspan="12">조회할 데이터가 없습니다.</td>';
						str += '</tr>';
						$('#as_list').html(str);
					}

					//합계 설정하는 곳
					$('#total_cnt').html(res.data.total.total_cnt);
					if(res.data.total.total_yard > 0) $('#total_yard').html(commas(Number(res.data.total.total_yard))).parent().show();
					else $('#total_yard').html(0).parent().hide();
					if(res.data.total.total_pok > 0) $('#total_pok').html(commas(Number(res.data.total.total_pok))).parent().show();
					else $('#total_pok').html(0).parent().hide();
					if(res.data.total.total_hebe > 0) $('#total_hebe').html(commas(Number(res.data.total.total_hebe))).parent().show();
					else $('#total_hebe').html(0).parent().hide();
					if(res.data.total.total_tax_amt > 0) $('#total_tax_amt').html(commas(Number(res.data.total.total_tax_amt))).parent().show();
					else $('#total_tax_amt').html(0).parent().hide();
					$('#total_ord_amt').html(commas(Number(res.data.total.total_ord_amt)));
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description 문자 더하기(중복부분이 많아서 함수로 축소작업)
 * @author 황호진  @version 1.0, @last update 2022/07/04
 */
function addstr(str , addstr) {
	if(str.length > 0){
		if(addstr.length > 0){
			return str+'/'+addstr;
		}else{
			return str;
		}
	}else{
		if(addstr.length > 0){
			return addstr;
		}else{
			return str;
		}
	}
}
