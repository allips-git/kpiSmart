/*================================================================================
 * @name: 황호진 - after_service_pop.js	A/S 등록 팝업 JS
 * @version: 1.0.0, @date: 2022-06-28
 ================================================================================*/
$(function () {
	//이벤트 연동
	//================================================================================
	/**
	 * @description 반품일 경우에만 금액 차감하는 이벤트 적용
	 * @author 황호진  @version 1.0, @last update 2022/06/28
	 */
	$(document).on('input', '.as_input' , function () {
		var data = $(this).data();
		var set_v = $(this).val().replace(/[^0-9]/gi,"");
		if(set_v > data['max']){
			set_v = 0;
		}
		$(this).val(set_v);

		var popup_type = $('#popup_type').val();
		var hap = 0;
		var i = Number(data['num']);

		$('.as_input').each(function (index , item) {
			var n = Number($(this).attr('data-num'));
			if(i === n){
				hap += Number($(this).val());
			}
		});

		//AS 사유 ON/OFF
		if(hap > 0)
		{
			$('#fac_text_'+data['lot']).prop('disabled' , false);
		}
		else
		{
			$('#fac_text_'+data['lot']).val('').prop('disabled' , true);
		}

		if(popup_type === 'C'){
			var amt = Number($('#'+data['lot']).attr('data-amt'));
			var result = amt - ((data['ordamt'] + data['taxamt']) * hap);
			$('#'+data['lot']).html(commas(Number(result))+'원');
		}
	});
	/**
	 * @description 수선
	 * @author 황호진  @version 1.0, @last update 2022/06/28
	 */
	$('#repair_pop_btn').on('click' , function () {

	});

	/**
	 * @description 교환
	 * @author 황호진  @version 1.0, @last update 2022/06/28
	 */
	$('#change_pop_btn').on('click' , function () {
		var flag = data_validation();
		if(flag){
			var arr = as_orga_data();
			if(Object.keys(arr).length > 0){
				var con = custom_fire('확인창' , '교환등록 하시겠습니까?' , '취소' , '확인');
				con.then((result) => {
					if (result.isConfirmed) {
						re_as(arr , 'C');
					}
				});
			}
		}
	});

	/**
	 * @description 반품
	 * @author 황호진  @version 1.0, @last update 2022/06/28
	 */
	$('#return_pop_btn').on('click' , function () {
		var flag = data_validation();
		if(flag) {
			var arr = as_orga_data();
			if (Object.keys(arr).length > 0) {
				var con = custom_fire('확인창', '반품등록 하시겠습니까?', '취소', '확인');
				con.then((result) => {
					if (result.isConfirmed) {
						re_as(arr, 'R');
					}
				});
			}
		}
	});
	//================================================================================
});

/**
 * @description 수선 , 교환 , 반품 버튼을 눌러 팝업을 열때 함수
 * @author 황호진  @version 1.0, @last update 2022/06/28
 */
function after_service_pop(popup_type , ord_no) {
	var url = '/ord/ord_reg/after_service_pop';
	var type = 'GET';
	var data = {
		ord_no	: ord_no
	};
	fnc_ajax(url , type , data)
		.done(function (res) {

			var len = res.data.length;
			var str = '';

			if(len > 0){
				$.each(res.data , function (i , list) {
					var item_gb = JSON.parse(list.item_gb);
					var option = JSON.parse(list.option);
					var ord_spec = JSON.parse(list.ord_spec);
					var amt_spec = JSON.parse(list.amt_spec);

					var left_qty = Number(list.left_qty) === 0 ? "" : list.left_qty;
					var right_qty = Number(list.right_qty) === 0 ? "" : list.right_qty;

					var ord_amt = Number(amt_spec['prd_amt']) + Number(amt_spec['base_amt']) +
								+ Number(amt_spec['height_amt']) + Number(amt_spec['op1_amt']) +
								+ Number(amt_spec['op2_amt']);
					var tax_amt = Number(amt_spec['prd_tax']) + Number(amt_spec['base_tax'])
								+ Number(amt_spec['height_tax']) + Number(amt_spec['op1_tax'])
								+ Number(amt_spec['op2_tax']);

					str += '<tr>';
					str += '<td class="w6">'+ list.make_gb_nm +'</td>';

					var item_nm = list.item_nm;		//가공방법 , 형상 , 옵션1 , 옵션2 적용할것
					str += '<td class="T-left">'+ item_nm +'</td>';
					str += '<td class="w5">'+ list.width +'</td>';
					str += '<td class="w5">'+ list.height +'</td>';
					if(list.handle_pos === 'L'){
						str += '<td class="w5">1</td>';		//좌
						str += '<td class="w5"></td>';		//우
						str += '<td class="w5"></td>';		//수량
					}else if(list.handle_pos === 'R'){
						str += '<td class="w5"></td>';		//좌
						str += '<td class="w5">1</td>';		//우
						str += '<td class="w5"></td>';		//수량
					}else{
						str += '<td class="w5">'+ left_qty +'</td>';	//좌
						str += '<td class="w5">'+ right_qty +'</td>';	//우
						str += '<td class="w5">'+ list.qty +'</td>';	//수량
					}
					str += '<td class="w7">'+ list.size + list.unit_nm +'</td>';
					str += '<td class="T-right g50 w8">'+ commas(Number(list.unit_amt)) +'원</td>';

					if(list.handle_pos === 'L'){
						str += '<td class="w5">';
						str += '<input type="text" class="as_input" data-num="'+i+'" data-max="1" data-seq="'+ list.ord_seq +'" data-bseq="'+ list.ord_bseq +'" data-ordamt="'+ ord_amt +'" data-taxamt="'+ tax_amt +'" data-lot="'+ list.lot +'" data-pos="L" autocomplete="off"></td>';
						str += '</td>';
						str += '<td class="w5"></td>';
						str += '<td class="w5"></td>';
					}else if(list.handle_pos === 'R'){
						str += '<td class="w5"></td>';
						str += '<td class="w5">';
						str += '<input type="text" class="as_input" data-num="'+i+'" data-max="1" data-seq="'+ list.ord_seq +'" data-bseq="'+ list.ord_bseq +'" data-ordamt="'+ ord_amt +'" data-taxamt="'+ tax_amt +'" data-lot="'+ list.lot +'" data-pos="R" autocomplete="off"></td>';
						str += '</td>';
						str += '<td class="w5"></td>';
					}else{
						//좌 설정
						if(left_qty !== ''){
							str += '<td class="w5">';
							str += '<input type="text" class="as_input" data-num="'+i+'" data-max="'+ left_qty +'" data-seq="'+ list.ord_seq +'" data-bseq="'+ list.ord_bseq +'" data-ordamt="'+ ord_amt +'" data-taxamt="'+ tax_amt +'" data-lot="'+ list.lot +'" data-pos="L" autocomplete="off"></td>';
							str += '</td>';
						}else{
							str += '<td class="w5"></td>';
						}
						//우 설정
						if(right_qty !== ''){
							str += '<td class="w5">';
							str += '<input type="text" class="as_input" data-num="'+i+'" data-max="'+ right_qty +'" data-seq="'+ list.ord_seq +'" data-bseq="'+ list.ord_bseq +'" data-ordamt="'+ ord_amt +'" data-taxamt="'+ tax_amt +'" data-lot="'+ list.lot +'" data-pos="R" autocomplete="off"></td>';
							str += '</td>';
						}else{
							str += '<td class="w5"></td>';
						}
						//수량 설정
						if(list.qty !== ''){
							str += '<td class="w5">';
							str += '<input type="text" class="as_input" data-num="'+i+'" data-max="'+ list.qty +'" data-seq="'+ list.ord_seq +'" data-bseq="'+ list.ord_bseq +'" data-ordamt="'+ ord_amt +'" data-taxamt="'+ tax_amt +'" data-lot="'+ list.lot +'" data-pos="C" autocomplete="off"></td>';
							str += '</td>';
						}else{
							str += '<td class="w5"></td>';
						}
					}
                    str += '<td>';
                    str += '<input type="text" class="w100 T-left" id="fac_text_'+ list.lot +'" data-lot="'+ list.lot +'" autocomplete="off" disabled>';
                    str += '</td>';
					if(list.unit === '001' || list.unit === '002'){
						if(list.handle_pos === 'L' || list.handle_pos === 'R'){
							str += '<td class="T-right g50 w8" id="'+ list.lot +'" data-amt="'+ (ord_amt + tax_amt) +'">'+ commas(ord_amt + tax_amt) +'원</td>';
						}else{
							str += '<td class="T-right g50 w8" id="'+ list.lot +'" data-amt="'+ list.sum_amt +'">'+ commas(Number(list.sum_amt)) +'원</td>';
						}
					}else{
						str += '<td class="T-right g50 w8" id="'+ list.lot +'" data-amt="'+ list.sum_amt +'">'+ commas(Number(list.sum_amt)) +'원</td>';
					}
					str += '</tr>';
				});
			}else{
				str += '<tr>';
				str += '<td colspan="14">조회할 A/S 데이터가 없습니다.</td>';
				str += '</tr>';
			}
			$('#as_list_pop').html(str);

			//누른 버튼에 따라 보이는 버튼 처리
			$('#popup_type').val(popup_type);
			if(popup_type === 'A'){
				$('#repair_pop_btn').show();
				$('#change_pop_btn').hide();
				$('#return_pop_btn').hide();
			}else if(popup_type === 'B'){
				$('#repair_pop_btn').hide();
				$('#change_pop_btn').show();
				$('#return_pop_btn').hide();
			}else if(popup_type === 'C'){
				$('#repair_pop_btn').hide();
				$('#change_pop_btn').hide();
				$('#return_pop_btn').show();
			}

			var now = new Date();
			var now_y = now.getFullYear();
			var now_m = now.getMonth();
			var now_d = now.getDate();
			$('#as_dt').val(conver_date(new Date(now_y , now_m , now_d)));

			//팝업 열기
			$('.after_service_pop').bPopup({
				modalClose: false,
				opacity: 0.8,
				positionStyle: 'absolute',
				speed: 300,
				transition: 'fadeIn',
				transitionClose: 'fadeOut',
				zIndex: 99997
				//, modalColor:'transparent'
			});
		}).fail(fnc_ajax_fail);
}

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2022/09/20
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description 수선 , 교환 , 반품 버튼 눌렀을시 데이터 정리 함수
 * @author 황호진  @version 1.0, @last update 2022/06/28
 */
function as_orga_data() {
	var arr = {};
	$('.as_input').each(function (index , item) {
		if($(this).val().trim() !== ''){
			var data = $(this).data();
			//seq 기준으로 공간생성해두었는지 검사여부
			if(arr[data['seq']] === undefined){
				arr[data['seq']] = {};
			}
			//bseq 기준으로 공간생성해두었는지 검사여부
			if(arr[data['seq']][data['bseq']] === undefined){
				arr[data['seq']][data['bseq']] = {}
			}

			//포지션 설정
			var pos;
			if(data['pos'] === 'L'){
				pos = 'left_qty';
			}else if(data['pos'] === 'R'){
				pos = 'right_qty';
			}else if(data['pos']){
				pos = 'qty';
			}

			//금액
			arr[data['seq']][data['bseq']]['ord_amt'] = Number(data['ordamt']);
			arr[data['seq']][data['bseq']]['tax_amt'] = Number(data['taxamt']);
			//개수
			arr[data['seq']][data['bseq']][pos] = $(this).val();
			//AS 사유
			arr[data['seq']][data['bseq']]['fac_text'] = $('#fac_text_'+data['lot']).val();
		}
	});
	return arr;
}

/**
 * @description AS 함수
 * @author 황호진  @version 1.0, @last update 2022/06/28
 */
function re_as(arr , as_type) {
	var url = '/ord/ord_reg/re_as';
	var type = 'POST';
	var data = {
		ord_no		: $('#ord_no').val(),
		as_dt		: $('#as_dt').val(),
		arr			: arr,
		popup_type	: as_type
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				get_ord_prd_list($('#ord_no').val());
				$('.after_service_pop').bPopup().close();
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description AS 사유 입력 검증
 * @author 황호진  @version 1.0, @last update 2022/07/18
 */
function data_validation() {
	var flag = true;
	$('.as_input').each(function (index , item) {
		var data = $(this).data();
		if($('#fac_text_'+data['lot']).is(":disabled") === false){
			if($('#fac_text_'+data['lot']).val() === '' && flag){
				toast("A/S 사유는 필수 입력입니다.", true, 'danger');
				$('#fac_text_'+data['lot']).focus();
				flag = false;
				return 0;
			}
		}
	});
	return flag;
}
