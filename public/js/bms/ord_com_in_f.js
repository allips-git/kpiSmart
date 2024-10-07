/*================================================================================
 * @description 공장 시스템 공장 주문 내역 상세보기 화면 JS
 * @author 황호진, @version 1.0, @last date 2022/06/21
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	get_ord_list({ord_no : $('#ord_no').val()});
	//================================================================================

	//화면 이벤트 연동
	//================================================================================
	$('#appr_can_btn').on('click' , function () {
		//chk_arr에 담는 함수
		var chk_arr = [];
		//선택된 체크박스 담기
		$(".ord_chk").each(function () {
			if($(this).is(":checked") == true){
				chk_arr.push($(this).val());
			}
		});

		if(chk_arr.length > 0){
			var con = custom_fire('확인창' , '승인 취소 하시겠습니까?' , '취소' , '확인');
			con.then((result) => {
				if(result.isConfirmed){
					var url = '/cen/ord_com_f/appr_can';
					var type = 'POST';
					var data = {
						ord_no	: $('#ord_no').val(),
						seq_arr	: chk_arr
					};
					fnc_ajax(url , type , data)
						.done(function (res) {
							// console.log(res);
							if(res.result){
								toast(res.msg, false, 'info');
								get_ord_list({ord_no : $('#ord_no').val()});
							}else{
								toast(res.msg, true, 'danger');
							}
						}).fail(fnc_ajax_fail);
				}
			});
		}
	});

	/**
	 * @description 분할상세보기 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/07/08
	 */
	$(document).on('click' , '.bunhal' , function () {
		var id = $(this).attr('id');
		var ord_no = $(this).attr('data-text1');
		var ord_seq = $(this).attr('data-text2');
		bunhal_detail(id , ord_no , ord_seq);
	});

	/**
	 * @description 분할상세보기 닫기 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/07/08
	 */
	$(document).on('click' , '#bunhal_close' , function () {
		$('#bunhal_detail').hide();
	});
	//================================================================================
	
});

/**
 * @description get_ord_list 해당 주문건의 리스트 조회
 * @author 황호진  @version 1.0, @last update 2022/06/21
 */
function get_ord_list(data) {
	var url = '/cen/ord_com_f/get_ord_list';
	var type = 'get';
	fnc_ajax(url , type , data)
		.done(function (res) {
			var len = res.data.length;

			if(len > 0){
				var str = '';
				var total_amt = 0;
				$.each(res.data , function (i , list) {
					var item_gb = JSON.parse(list.item_gb);
					var option = JSON.parse(list.option);
					var ord_spec = JSON.parse(list.ord_spec);
					var ord_qty = JSON.parse(list.ord_qty);
					str += '<tr>';
					str += '<td class="w5">';
					str += '<input type="checkbox" class="ord_chk" id="chk'+list.ikey+'" name="chk'+list.ikey+'" value="'+ list.ord_seq +'">';
					str += '<label for="chk'+list.ikey+'"></label>';
					str += '</td>';
					str += '<td class="w6">'+ list.make_gb +'</td>';	//구분
					str += '<td class="T-left">';
					//아이템명
					if(ord_spec['unit'] === '006' || ord_spec['unit'] === '007'){
						if(ord_spec['color'] === 'one'){	//원톤일때
							str += '<span class="blue">'+ list.item_nm +'</span>';
						}else{		//투톤일때
							str += '<span class="blue">'+ list.item_nm +' '+ ord_spec['inside_color'] +'</span>';
						}
					}else{
						str += '<span class="blue">'+ list.item_nm +'</span>';
					}
					//참조 명칭 설정
					var ref_str = '';	//초기에는 빈값 설정
					ref_str = addstr(ref_str , option['op1_nm']);
					ref_str = addstr(ref_str , option['op2_nm']);
					if(ord_spec['unit'] === '006' || ord_spec['unit'] === '007') {
						var work_way = ord_spec['work_way'] === '001' ? '평주름' : '나비주름';
						ref_str = addstr(ref_str, work_way);
						var base_str = ord_spec['base_st'] === 'Y' ? '형상옵션' : '';
						ref_str = addstr(ref_str, base_str);
					}
					ref_str = ref_str.length > 0 ? '('+ref_str+')' : ref_str;

					str += '<span class="pp">'+ ref_str +'</span>';
					str += '</td>';
					//추가분류
					str += '<td class="T-left blue w12">'+ item_gb['item_gb'] +'</td>';
					str += '<td class="w6">'+ ord_spec['ord_width'] +'</td>';	//가로
					str += '<td class="w6">'+ ord_spec['ord_height'] +'</td>';	//세로

					//수량
					if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
						var qty_str = '';
						if(ord_qty['left_qty'] > 0){
							qty_str = '좌 : ' + ord_qty['left_qty'];
							if(ord_qty['right_qty'] > 0){
								qty_str += ', 우 : ' + ord_qty['right_qty'];
							}
						}else if(ord_qty['right_qty'] > 0){
							qty_str = '우 : ' + ord_qty['right_qty'];
						}
						str += '<td class="w6">'+ qty_str +'</td>';
					}else if(ord_spec['unit'] === '006' || ord_spec['unit'] === '007'){
						if(ord_spec['div_gb'] === '001'){
							str += '<td class="w6">양개 : '+ ord_qty['qty'] +'</td>';
						}else{
							str += '<td class="w6">편개 : '+ ord_qty['qty'] +'</td>';
						}
					}
					//분할
					str += '<td class="w6">';
					if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
						if(ord_spec['division'] > 1){
							str += '<span class="blue bunhal" id="'+ list.lot +'" data-text1="'+ list.ord_no +'" data-text2="'+ list.ord_seq +'">'+ ord_spec['division'] +'분할</span>';
						}
					}
					str += '</td>';
					if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
						str += '<td class="w6">'+ ord_spec['ord_hebe'] +'회베</td>';
					}else if(ord_spec['unit'] === '006'){
						str += '<td class="w6">'+ ord_spec['ord_yard'] +'야드</td>';
					}else if(ord_spec['unit'] === '007'){
						str += '<td class="w6">'+ ord_spec['ord_pok'] +'폭</td>';
					}
					str += '<td class="T-right w9">'+ commas(Number(list.unit_amt)) +'원</td>';	//단가
					str += '<td class="T-right w9">'+ commas(Number(list.sum_amt)) +'원</td>';	//총금액
					str += '<td class="Elli T-left">'+ list.fac_text +'</td>';	//비고
					str += '<td class="w5">';
					if(list.finyn === '002'){
						str += '<span class="blue">'+ list.finyn_nm +'</span>';
					}else{
						str += '<span class="red">'+ list.finyn_nm +'</span>';
					}
					str += '</td>';
					str += '</tr>'

					//합계 금액 설정
					total_amt += Number(list.sum_amt);
				});
				$('#ord_list').html(str);

				//토탈 합계 금액
				$('#total_amt').html(commas(total_amt)+'원');
			}else{
				location.replace('/cen/ord_com_f');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 문자 더하기(중복부분이 많아서 함수로 축소작업)
 * @author 황호진  @version 1.0, @last update 2022/06/21
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

/**
 * @description 분할 상세보기
 * @author 황호진  @version 1.0, @last update 2022/06/21
 */
function bunhal_detail(id , ord_no , ord_seq) {
	var url = '/cen/ord_com_f/bunhal_detail';
	var type = 'GET';
	var data = {
		'ord_no'	: ord_no,
		'ord_seq'	: ord_seq,
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var str = '<div class="inner">';
			str += '<span id="bunhal_close">X</span>';
			str += '<p>분할정보</p>';
			str += '<ul>';
			$.each(res.data, function (i, list) {
				str += '<li>';
				str += '<span>가로 : '+ list.div_width +'</span>';
				str += '<span>세로 : '+ list.div_height +'</span>';
				str += '<span>('+ list.handle_pos +')</span>';
				str += '<span>('+ list.div_hebe +'회베)</span>';
				str += '</li>';
			});
			str += '</ul>';
			str += '</div>';

			$('#bunhal_detail').html(str).show();

			var id_info = document.getElementById(id); // 요소의 id 값이 target이라 가정
			var id_rect = id_info.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
			var target_info = document.getElementById('bunhal_detail');
			var target_rect = target_info.getBoundingClientRect();
			var y = id_rect.bottom + 20;
			var x = id_rect.left - (target_rect.width / 2) + (id_rect.width / 2);

			$('#bunhal_detail').css({"top": y+"px", "left": x+"px"});
		}).fail(fnc_ajax_fail);
}
