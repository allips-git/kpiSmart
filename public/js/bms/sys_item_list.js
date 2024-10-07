/*================================================================================
 * @name: 황호진 - sys_item_list.js 시스템 매입제품설정
 * @version: 1.0.0, @date: 2022-06-10
 ================================================================================*/
//단위값을 저장하는 글로벌변수
var g_unit = '';
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var fc = $('#fc').val();
	//공장값이 있는지 여부
	if(fc !== ''){
		var search_data = {
			s	: null,
			fc	: fc
		};
		get_list(search_data);
	}
	//================================================================================


	//이벤트
	//================================================================================
	/**
	 * @description factort_list change event
	 * @author 황호진  @version 1.0, @last update 2022-06-10
	 */
	$('#fc').on('change' , function () {
		var v = $(this).val();
		if(v !== ''){
			//아이템리스트 , 제품분류(대) , 원단분류(중) 값 가져오기
			factory_info(v);
		}
	});

	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2022-06-10
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data);
		}
	});

	/**
	 * @description 검색란의 selectbox change 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022-06-10
	 */
	$("#il , #ic , #tg , #use").on('change' , function () {
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
	});

	/**
	 * @description 수정버튼 눌렀을때 이벤트
	 * @author 황호진  @version 1.0, @last update 2022-06-10
	 */
	$('#mod_btn').on('click' , function () {
		var con = custom_fire('확인창' , '수정하시겠습니까?' , '취소' , '확인');
		con.then((result) => {
			if(result.isConfirmed){
				save_item();
			}
		});
	});

	/**
	 * @description 금액부분에 한해서만 천자리 단위 걸기
	 * @author 황호진  @version 1.0, @last update 2022-06-10
	 */
	$("#sale_amt , #unit_amt_1 , #unit_amt_2 , #unit_amt_3 , #client_amt").on('input' , function () {
		var num = $(this).val().replace(/[^0-9]/gi,"");
		$(this).val(num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
	});

	//================================================================================
});

/**
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2022-06-10
 */
function get_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/base/sys_item_list/get_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 50,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: false,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: false,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					draw_list(res);
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description draw_list 리스트 그리는 함수
 * @author 황호진  @version 1.0, @last update 2022-06-10
 */
function draw_list(data) {
	var len = data.length;
	var str = '';

	if(len > 0){
		var arr = [];
		$.each(data , function (i , list) {
			//public/js/bms/sys_item_list_pop.js get_detail 함수
			if(list.base_useyn === 'Y'){
				str += '<tr onclick=get_detail("'+ list.item_cd +'");>';
			}else{
				str += '<tr class="impos_prd">'
			}
			str += '<td class="w4">'+ list.row_no +'</td>';
			str += '<td class="w8">'+ list.work_gb +'</td>';
			str += '<td class="w7">'+ list.trade_gb +'</td>';
			str += '<td class="w8">'+ list.category +'</td>';
			str += '<td class="w8">'+ list.proc_gb +'</td>';
			str += '<td class="blue T-left Elli">'+ list.item_nm +'</td>';
			str += '<td class="blue w7">'+ list.sub_cnt +'종</td>';
			str += '<td class="w7">'+ Number(list.size) + list.unit_nm +'</td>';
			str += '<td class="w7">'+ list.reg_ikey +'</td>';
			str += '<td class="w7">'+ list.reg_dt +'</td>';
			str += '<td class="w7">'+ list.mod_ikey +'</td>';
			str += '<td class="w7">'+ list.mod_dt +'</td>';
			if(list.base_useyn === 'Y'){
				str += '<td class="w7" onclick="event.stopPropagation()">';
				str += '<label class="switch" id="switch" data-useyn="" style="cursor: pointer;" onclick=useyn_change("'+ list.item_cd +'")>';
				str += '<input type="checkbox" id="useyn_'+ list.item_cd +'" disabled>';
				str += '<span class="slider round"></span>';
				str += '</label>';
				str += '</td>';
			}else{
				str += '<td class="w7">';
				str += '<label class="switch" id="switch" data-useyn="" style="cursor: pointer;">';
				str += '<input type="checkbox" id="useyn_'+ list.item_cd +'" disabled>';
				str += '<span class="slider round"></span>';
				str += '</label>';
				str += '</td>';
			}
			str += '</tr>';
			//추후 주문가능여부를 체크하도록 만들기 위해 담는 작업
			if(list.useyn === 'Y'){
				arr.push('useyn_'+list.item_cd);
			}
		});
		$("#item-container").html(str); // ajax data output

		for(var i = 0; i < arr.length; i++){
			$('#'+arr[i]).prop('checked', true);
		}
	}else{
		str += "<tr>";
		str += "<td colspan='13'>조회 가능한 데이터가 없습니다.</td>";
		str += "</tr>";
		$("#item-container").html(str); // ajax data output
	}
}

/**
 * @description fc select box 값이 변경됨에 따라 동작하는 함수
 * @author 황호진  @version 1.0, @last update 2022-06-10
 */
function factory_info(fa_cd) {
	var url = '/base/sys_item_list/factory_info';
	var type = 'GET';
	var data = {
		fa_cd : fa_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var item_lv = res.data.item_lv;
			var item_cd = res.data.item_cd;

			var str = '';

			//제품분류(대)
			str = '<option value="">제품분류 (대)_전체</option>';
			$.each(item_lv , function (i , list) {
				str += '<option value="'+ list.ikey +'">'+ list.key_name +'</option>';
			});
			$('#il').html(str);

			//원단분류(중)
			str = '<option value="">원단분류 (중)_전체</option>';
			$.each(item_cd , function (i , list) {
				str += '<option value="'+ list.item_cd +'">'+ list.item_nm +'</option>';
			});
			$('#ic').html(str);

			//리스트 조회
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data);

		}).fail(fnc_ajax_fail);
}


/**
 * @description get_detail
 * @author 황호진  @version 1.0, @last update 2022-06-10
 */
function get_detail(item_cd) {
	var url = '/base/sys_item_list/get_detail';
	var type = 'GET';
	var data = {
		item_cd : item_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var item_info = res.data.item_info;
			var sub_info  = res.data.sub_info;

			//item_cd 설정
			$('#item_cd').val(item_info.item_cd);

			//사용여부 설정
			if(item_info.useyn === 'Y') $('#item_useyn_y').prop('checked' , true);
			else $('#item_useyn_n').prop('checked' , true);

			//단위에 따라 설정되는 유동적인 값들을 제외한 나머지 설정
			var field = {
				work_gb : item_info.work_gb, proc_gb : item_info.proc_gb, trade_gb : item_info.trade_gb,
				item_lv : item_info.item_lv, item_nm : item_info.item_nm, size : Number(item_info.size),
				unit : item_info.unit_nm,
				unit_amt : commas(Number(item_info.unit_amt)),
				sale_amt : commas(Number(item_info.sale_amt)),
				unit_amt_1 : commas(Number(item_info.unit_amt_1)),
				unit_amt_2 : commas(Number(item_info.unit_amt_2)),
				unit_amt_3 : commas(Number(item_info.unit_amt_3)),
				client_amt : commas(Number(item_info.client_amt)),
				memo : item_info.memo
			};
			process(field , 'val');

			$('#form_hebe').hide();
			$('#form_yard').hide();
			$('#form_pok').hide();
			$('#form_ea').hide();
			$('#form_base_set').hide();

			var spec = JSON.parse(item_info.spec);

			//전역변수 설정
			g_unit = item_info.unit;

			//단위
			if(item_info.unit === '001' || item_info.unit === '002'){	//회베
				$('#hebe_max_width').val(zero_convert(spec['max_width']));
				$('#hebe_max_height').val(zero_convert(spec['max_height']));
				$('#hebe_min_width').val(zero_convert(spec['min_width']));
				$('#hebe_min_height').val(zero_convert(spec['min_height']));

				$('#form_hebe').show();
			}else if(item_info.unit === '006' || item_info.unit === '007'){	//야드,폭
				
				$('#work_way').val(spec['work_way']);
				$('#usage').val(spec['usage']);
				$('#div_gb').val(spec['div_gb']);
				$('#base_st').val(spec['base_st']);

				if(item_info.unit === '006'){
					$('#yard_purc_base_amt').val(zero_convert(spec['purc_base_amt']));
					$('#yard_base_amt').val(zero_convert(spec['base_amt']));
					$('#yard_max_width').val(zero_convert(spec['max_width']));
					$('#yard_max_height').val(zero_convert(spec['max_height']));


					$('#form_yard').show();
				}else if(item_info.unit === '007'){
					$('#pok_width_len').val(zero_convert(spec['width_len']));
					$('#pok_purc_base_amt').val(zero_convert(spec['purc_base_amt']));
					$('#pok_base_amt').val(zero_convert(spec['base_amt']));
					$('#pok_height_len').val(zero_convert(spec['height_len']));

					var height_unit;
					if(spec['height_unit'] === '010'){
						height_unit = 'CM';
					}

					$('#pok_height_unit').val(height_unit).attr('data-text' , spec['height_unit']);
					$('#pok_height_op1').val(spec['height_op1']);
					$('#pok_height_op2').val(spec['height_op2']);
					$('#pok_max_width').val(zero_convert(spec['max_width']));
					$('#pok_max_height').val(zero_convert(spec['max_height']));

					$('#form_pok').show();
				}
				$('#form_base_set').show();
			}else if(item_info.unit === '005' || item_info.unit === '011'){	//EA , BOX
				$('#ea_min_qty').val(zero_convert(spec['min_qty']));

				$('#form_ea').show();
			}

			//세부 그리기
			sub_draw(sub_info);

			$('.sys_item_list_pop').bPopup({
				modalClose: true,
				opacity: 0.8,
				positionStyle: 'absolute',
				speed: 300,
				escClose: false,
				transition: 'fadeIn',
				transitionClose: 'fadeOut',
				zIndex: 99990
				//, modalColor:'transparent'
			});

		}).fail(fnc_ajax_fail);
}


/**
 * @description item_sub draw
 * @author 황호진  @version 1.0, @last update 2022-06-10
 */
function sub_draw(data) {
	var str = '';
	var len = data.length;

	var arr = [];

	if(len > 0){
		$.each(data , function (i , list) {
			str += '<dl>';
			str += '<dt>제품명 세부 추가</dt>';
			str += '<dd class="half">';
			str += '<input type="text" class="gray" autocomplete="off" value="'+ list.sub_nm_01 +'" disabled>';
			str += '</dd>';
			str += '<dt class="half">추가분류</dt>';
			str += '<dd class="half">';
			str += '<input type="text" class="gray w70" autocomplete="off" value="'+ list.sub_nm_02 +'" disabled>';
			str += '<label class="switch" id="">';
			str += '<input type="checkbox" name="sub_useyn" id="sub_useyn_'+list.ikey+'" data-use="" value="">';
			str += '<span class="slider round"></span>';
			str += '</label>';
			str += '</dd>';
			str += '</dl>';
			//추후 주문가능여부를 체크하도록 만들기 위해 담는 작업
			if(list.useyn === 'Y'){
				arr.push('sub_useyn_'+list.ikey);
			}
		});
	}
	$('#sub_list').html(str);

	for(var i = 0; i < arr.length; i++){
		$('#'+arr[i]).prop('checked', true);
	}
}


/**
 * @description v 값이 0일때 빈값으로 변환
 * @author 황호진  @version 1.0, @last update 2022-06-10
 */
function zero_convert(v) {
	if(v == 0){
		return '';
	}else{
		return v;
	}
}

/**
 * @description 수정
 * @author 황호진  @version 1.0, @last update 2022-06-10
 */
function save_item() {
	var url = '/base/sys_item_list/save_item';
	var type = 'POST';
	var data = {
		item_cd		: $('#item_cd').val(),
		unit		: g_unit,
		sale_amt	: $('#sale_amt').val(),
		unit_amt_1	: $('#unit_amt_1').val(),
		unit_amt_2	: $('#unit_amt_2').val(),
		unit_amt_3	: $('#unit_amt_3').val(),
		client_amt	: $('#client_amt').val(),
		useyn		: $('input[name=item_useyn]:checked').val()
	};

	//야드 , 폭만 spec값 저장
	if(g_unit === '006' || g_unit === '007'){
		var spec = {};
		if(g_unit === '006'){
			spec['purc_base_amt'] = Number($('#yard_purc_base_amt').val());
			spec['base_amt'] = Number($('#yard_base_amt').val());
			spec['max_width'] = Number($('#yard_max_width').val());
			spec['max_height'] = Number($('#yard_max_height').val());
		}else if(g_unit === '007'){
			spec['width_len'] = Number($('#pok_width_len').val());
			spec['purc_base_amt'] = Number($('#pok_purc_base_amt').val());
			spec['base_amt'] = Number($('#pok_base_amt').val());
			spec['height_len'] = Number($('#pok_height_len').val());
			spec['height_unit'] = $('#pok_height_unit').attr('data-text');
			spec['height_op1'] = Number($('#pok_height_op1').val());
			spec['height_op2'] = Number($('#pok_height_op2').val());

			spec['max_width'] = Number($('#pok_max_width').val());
			spec['max_height'] = Number($('#pok_max_height').val());
		}
		spec['work_way'] = $('#work_way').val();
		spec['usage'] = $('#usage').val();
		spec['div_gb'] = $('#div_gb').val();
		spec['base_st'] = $('#base_st').val();

		data['spec'] = JSON.stringify(spec);
	}

	var sub = $('input[name=sub_useyn]');
	var sub_data = {};
	for(var i = 0 ; i < sub.length; i++){
		sub_data[i] = {
			ik	: sub.eq(i).attr('id'),
			yn	: sub.eq(i).is(':checked') === true ? 'Y' : 'N'
		}
	}
	data['sub_data'] = sub_data;

	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				$('.sys_item_list_pop').bPopup().close();

				//제품리스트 재조회
				var search_data = $("#frm").serialize();	//form 데이터
				get_list(search_data);
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 사용여부 변경
 * @author 황호진  @version 1.0, @last update 2022/07/04
 */
function useyn_change(item_cd) {
	var url = '/base/sys_item_list/useyn_change';
	var type = 'POST';
	var data = {
		item_cd : item_cd
	};

	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if($("#useyn_"+item_cd).is(":checked") === true){
					$("#useyn_"+item_cd).prop('checked', false);	//checked => false
				}else{
					$("#useyn_"+item_cd).prop('checked', true);	//checked => true
				}
				//주문불가 카운트 조회하여 가져와서 설정
				$("#no_ord_cnt").html(res.no_ord_cnt);
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
