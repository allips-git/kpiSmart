/*================================================================================
 * @name: 황호진 - ord_sheet.js
 * @version: 1.0.0
 ================================================================================*/
$(function () {
	/**
	 * @description 매입거래처 변경이벤트
	 * @author 황호진  @version 1.0, @last update 2022/06/16
	 */
	$('#buy_cust_nm').on('change' , function () {
		var v = $(this).val();
		if(v !== ''){
			get_buy_info(v);
		}
	});

	/**
	 * @description 전화번호 , 팩스 , 담당자 , 비고 , 배송요구사항 값이 바뀌면 인쇄물에 적용
	 * @author 황호진  @version 1.0, @last update 2022/06/16
	 */
	$('#buy_tel , #buy_fax , #buy_person , #memo , #addr_text , .fac_text').on('input' , function () {
		var id = $(this).attr('id');
		var val = $(this).val();
		$('#p_'+id).html(val);
	});

	/**
	 * @description 주문일 , 출고일 변경 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/06/17
	 */
	$('#ord_dt , #dlv_dt').on('change' , function () {
		var id = $(this).attr('id');
		var val = $(this).val();
		$('#p_'+id).html(val);
	});

	/**
	 * @description 각 주문별 요청사항란 수정 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/06/17
	 */
	$(document).on('input' , '.fac_text' , function () {
		var id = $(this).attr('id');
		var val = $(this).val();
		$('#p_'+id).html(val);
	});

	/**
	 * @description 배송옵션 변경에 따른 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/06/17
	 */
	$('input[name=dlv_gb]').on('change' , function () {
		var v = $(this).val();
		if(v === '001'){
			$('#ord_zip').val('');
			$('#address').val('').addClass('gray').prop('disabled' , true);

			//인쇄물 설정
			$('#p_dlv_gb01').prop('checked' , true);
		}else if(v === '002'){
			$('#address').removeClass('gray').prop('disabled' , false);

			//인쇄물 설정
			$('#p_dlv_gb02').prop('checked' , true);
		}else if(v === '003'){
			$('#address').removeClass('gray').prop('disabled' , false);

			//인쇄물 설정
			$('#p_dlv_gb03').prop('checked' , true);
		}else if(v === '007'){
			$('#address').removeClass('gray').prop('disabled' , false);

			//인쇄물 설정
			$('#p_dlv_gb04').prop('checked' , true);
		}
		set_address();
	});

	/**
	 * @description 다음 주소 API
	 * @author 황호진  @version 1.0, @last update 2022/06/17
	 */
	$('#address').on('click' , function () {
		daum_postcode('ord_zip' , 'address' , 'addr_detail' , set_address);
	});

	/**
	 * @description 상세주소 변경시 인쇄물에 적용
	 * @author 황호진  @version 1.0, @last update 2022/06/17
	 */
	$('#addr_detail').on('input' , function () {
		set_address();
	});

	/**
	 * @description 매출처 표기 / 미표기
	 * @author 황호진  @version 1.0, @last update 2022/06/17
	 */
	$('#viewyn').on('change' , function () {
		var f = $(this).val();
		if(f === 'Y'){
			var cust_nm = $('.osp_list_cust_nm').attr('data-text');
			$('.osp_list_cust_nm').html(cust_nm);
		}else{
			$('.osp_list_cust_nm').html('');
		}
	});

	/**
	 * @description print
	 * @author 황호진  @version 1.0, @last update 2022/06/16
	 */
	$('#print_btn').on('click' , function () {
		let cust_cd = $('#buy_cust_nm').val();

		//매입거래처가 선택되어 있지 않으면 인쇄 안열리도록 수정 ★★★★★★2022-08-09★★★★★★
		if(cust_cd !== '')
		{
			$("#print_div").show().printThis({
				debug: false,               // show the iframe for debugging
				importCSS: false,            // import parent page css
				importStyle: false,          // import style tags
				printContainer: true,       // print outer container/$.selector
				loadCSS: "/public/css/bms/hidden_wrap.css?<?=time()?>",                // path to additional css file - use an array [] for multiple
				pageTitle: "",              // add title to print page
				removeInline: true,        // remove inline styles from print elements
				removeInlineSelector: "*",  // custom selectors to filter inline styles. removeInline must be true
				printDelay: 500,            // variable print delay
				header: null,               // prefix to html
				footer: null,               // postfix to html
				base: false,                // preserve the BASE tag or accept a string for the URL
				formValues: true,           // preserve input/form values
				canvas: true,              // copy canvas content
				doctypeString: '...',       // enter a different doctype for older markup
				removeScripts: false,       // remove script tags from print content
				copyTagClasses: false,      // copy classes from the html & body tag
				beforePrintEvent: function () {
					// console.log('test3');
				},     // function for printEvent in iframe
				beforePrint: function () {
					// console.log('test1');
				},          // function called before iframe is filled
				afterPrint: function () {
					$("#print_div").hide();
					save_data(post_print_work);
				}            // function called before iframe is removed
			});
		}
	});

	/**
	 * @description 시스템발주
	 * @author 황호진  @version 1.0, @last update 2022/06/17
	 */
	$('#system_btn').on('click' , function () {
		var con = custom_fire('확인창' , '시스템발주 하시겠습니까?' , '취소' , '확인');
		con.then((result) => {
			if(result.isConfirmed){
				save_data(system_msg);
			}
		});
	});
});

/**
 * @description create_ord_sheet 주문서 생성
 * @author 황호진  @version 1.0, @last update 2022/06/15
 */
function create_ord_sheet(data) {
	data = JSON.parse(decodeURIComponent(data));
	var url = '/ord/ord_sheet/create_ord_sheet';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			//매입거래처 , 시스템매입거래처 구분값
			var sys_gb = data['sys_gb'];
			pop_set_buy_select(res.pop_buy_cust_select);
			if(sys_gb === 'Y'){
				$('#buy_cust_nm').prop('disabled' , true);

				$('#system_btn').show();
				$('#print_btn').hide();
				$('#kakao_btn').hide();
				$('#email_btn').hide();
			}else{
				$('#buy_cust_nm').prop('disabled' , false);

				$('#system_btn').hide();
				$('#print_btn').show();
				$('#kakao_btn').show();
				$('#email_btn').show();
			}

			$('#h_sys_gb').val(sys_gb);
			pop_set_overlap_code(res.data);

			$('.ord_sheet_pop').bPopup({
				modalClose: true,
				opacity: 0.8,
				positionStyle: 'absolute',
				speed: 300,
				transition: 'fadeIn',
				transitionClose: 'fadeOut',
				zIndex: 99990
				//, modalColor:'transparent'
			});
		}).fail(fnc_ajax_fail);
}

/**
 * @description open_ord_sheet
 * @author 황호진  @version 1.0, @last update 2022/06/16
 */
function open_ord_sheet(data) {
	data = JSON.parse(decodeURIComponent(data));
	var url = '/ord/ord_sheet/open_ord_sheet';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			var out_finyn	= res.data[0].out_finyn;	//현 주문서의 상태(추후 개발)
			var sys_gb 		= data['sys_gb'];			//매입거래처 , 시스템매입거래처 구분값
			pop_set_buy_select(res.pop_buy_cust_select);

			$('#buy_cust_nm').prop('disabled' , true);
			if(sys_gb === 'Y'){
				$('#system_btn').hide();
				$('#print_btn').hide();
				$('#kakao_btn').hide();
				$('#email_btn').hide();
			}else{
				$('#system_btn').hide();
				$('#print_btn').show();
				$('#kakao_btn').show();
				$('#email_btn').show();
			}

			$('#h_sys_gb').val(sys_gb);
			$('#h_out_no').val(res.data[0].out_no);
			pop_set_overlap_code(res.data);

			$('.ord_sheet_pop').bPopup({
				modalClose: true,
				opacity: 0.8,
				positionStyle: 'absolute',
				speed: 300,
				transition: 'fadeIn',
				transitionClose: 'fadeOut',
				zIndex: 9900
				//, modalColor:'transparent'
			});
		}).fail(fnc_ajax_fail);
}

/**
 * @description 팝업 열면서 설정해주는 것들 중복이라 하나로 묶음
 * @author 황호진  @version 1.0, @last update 2022/06/16
 */
function pop_set_overlap_code(data) {
	$('#viewyn').val(data[0].viewyn);

	//공통부분(배송구분)====================================================
	if(data[0].dlv_gb === '001') $('#dlv_gb01').prop('checked' , true);
	else if(data[0].dlv_gb === '002') $('#dlv_gb02').prop('checked' , true);
	else if(data[0].dlv_gb === '003') $('#dlv_gb03').prop('checked' , true);
	else if(data[0].dlv_gb === '004') $('#dlv_gb04').prop('checked' , true);
	$('input[name=dlv_gb]').trigger('change');
	//=====================================================================

	//popup 적용============================================================
	$('#buy_cust_nm').val(data[0].buy_cust_cd).prop('selected',true).select2();

	var input_list = {
		h_ord_no : data[0].ord_no ,
		buy_tel : num_format(data[0].buy_tel , 1) ,
		buy_fax : data[0].buy_fax ,
		buy_person : data[0].buy_person ,
		ord_dt : data[0].ord_dt ,
		dlv_dt : data[0].dlv_dt ,
		ord_zip : data[0].ord_zip ,
		address : data[0].address ,
		addr_detail : data[0].addr_detail ,
		addr_text : data[0].addr_text ,
		memo : data[0].memo
	};
	process(input_list , 'val');

	var text_list = {
		sale_cust_nm : data[0].sale_cust_nm ,
		sale_tel : num_format(data[0].sale_tel , 1) ,
		sale_fax : data[0].sale_fax ,
		sale_ceo_nm : data[0].sale_ceo_nm
	};
	process(text_list , 'text');



	//리스트
	var pop_str = '';
	$.each(data , function (i , list) {
		var option = JSON.parse(list.option);
		var ord_spec1 = JSON.parse(list.ord_spec1);
		var ord_spec2 = JSON.parse(list.ord_spec2);
		var ord_qty = JSON.parse(list.ord_qty);

		//가로 세로 설정
		var width = ord_spec2['div_width'] === undefined ? ord_spec2['ord_width'] : ord_spec2['div_width'];
		var height = ord_spec2['div_height'] === undefined ? ord_spec2['ord_height'] : ord_spec2['div_height'];

		//단위 설정
		var size;
		//개수 설정
		var qty , left_qty , right_qty;
		if(ord_spec1['unit'] === '001' || ord_spec1['unit'] === '002'){	//회베
			size = ord_spec2['div_hebe'] === undefined ? ord_spec2['ord_hebe'] : ord_spec2['div_hebe'];

			if(ord_spec1['division'] > 1){		//분할O
				qty = 1;
				if(ord_spec2['handle_pos'] === 'L'){	//좌
					left_qty = 1;
					right_qty = '';
				}else{									//우
					left_qty = '';
					right_qty = 1;
				}
			}else{								//분할X
				qty = ord_qty['qty'] === undefined ? '' : ord_qty['qty'];
				left_qty = ord_qty['left_qty'] === 0 ? '' : ord_qty['left_qty'];
				right_qty = ord_qty['right_qty'] === 0 ? '' : ord_qty['right_qty'];
			}
		}else if(ord_spec1['unit'] === '006'){	//야드
			size = ord_spec2['ord_yard'];

			qty = ord_qty['qty'];
			left_qty = '';
			right_qty = '';
		}else if(ord_spec1['unit'] === '007'){	//폭
			size = ord_spec2['ord_pok'];

			qty = ord_qty['qty'];
			left_qty = '';
			right_qty = '';
		}

		pop_str += '<tr>';
		if(list.viewyn === 'Y'){
			pop_str += '<td class="osp_list_cust_nm Elli" data-text="'+ list.cust_nm +'">'+ list.cust_nm +'</td>';
		}else{
			pop_str += '<td class="osp_list_cust_nm Elli" data-text="'+ list.cust_nm +'"></td>';
		}
		pop_str += '<td class="Elli">'+ list.item_nm +'</td>';
		pop_str += '<td>'+ width +'</td>';
		pop_str += '<td>'+ height +'</td>';
		pop_str += '<td class="no_pd">'+ size + list.unit_nm +'</td>';

		pop_str += '<td>'+ qty +'</td>';
		pop_str += '<td>'+ left_qty +'</td>';
		pop_str += '<td>'+ right_qty +'</td>';
		pop_str += '<td>';
		pop_str += '<input type="text" class="fac_text" id="fac_text'+ list.ikey +'" autocomplete="off" value="'+ list.fac_text +'">';
		pop_str += '</td>';
		pop_str += '</tr>';

		// //야드 , 폭 : 가공방법 , 형상옵션에 관해서
		if(ord_spec1['unit'] === '006' || ord_spec1['unit'] === '007'){
			var work_way = '';
			if(ord_spec1['work_way'] === '001'){
				work_way = '평주름'
			}else if(ord_spec1['work_way'] === '002'){
				work_way = '나비주름'
			}
			pop_str = additional_str(pop_str , work_way);

			var base_st = '';
			if(ord_spec1['base_st'] === 'Y'){
				base_st = '형상옵션'
			}
			pop_str = additional_str(pop_str , base_st);
		}

		//옵션1
		pop_str = additional_str(pop_str , option['op1_nm']);
		//옵션2
		pop_str = additional_str(pop_str , option['op2_nm']);
	});
	$('#osp_list').html(pop_str);

	//=======================================================================

	//인쇄물 적용=============================================================
	var print_text_list = {
		p_buy_cust_nm : data[0].buy_cust_nm ,
		p_buy_tel : num_format(data[0].buy_tel , 1) ,
		p_buy_fax : data[0].buy_fax ,
		p_buy_person : data[0].buy_person ,
		p_ord_dt : data[0].ord_dt ,
		p_dlv_dt : data[0].dlv_dt ,
		p_sale_cust_nm : data[0].sale_cust_nm ,
		p_sale_tel : num_format(data[0].sale_tel , 1) ,
		p_sale_fax : data[0].sale_fax ,
		p_sale_ceo_nm : data[0].sale_ceo_nm ,
		p_address : data[0].address+' '+data[0].addr_detail ,
		p_addr_text : data[0].addr_text ,
		p_memo : data[0].memo
	};
	process(print_text_list , 'text');

	//리스트
	var print_str = '';
	console.log(data.length);

	let z = 27;	//첫번째 기준
	let y = 38; //두번째 기준

	let n = z;
	if(data.length > z){
		let x = ((data.length - z) / y) + 1;
		n = z + (y * x);
	}

	for(let i = 0, j = 0; i < n; j++){
		if(j < data.length){
			var option = JSON.parse(data[j].option);
			var ord_spec1 = JSON.parse(data[j].ord_spec1);
			var ord_spec2 = JSON.parse(data[j].ord_spec2);
			var ord_qty = JSON.parse(data[j].ord_qty);

			//가로 세로 설정
			var width = ord_spec2['div_width'] === undefined ? ord_spec2['ord_width'] : ord_spec2['div_width'];
			var height = ord_spec2['div_height'] === undefined ? ord_spec2['ord_height'] : ord_spec2['div_height'];

			//단위 설정
			var size;
			//개수 설정
			var qty , left_qty , right_qty;
			if(ord_spec1['unit'] === '001' || ord_spec1['unit'] === '002'){	//회베
				size = ord_spec2['div_hebe'] === undefined ? ord_spec2['ord_hebe'] : ord_spec2['div_hebe'];

				if(ord_spec1['division'] > 1){		//분할O
					qty = 1;
					if(ord_spec2['handle_pos'] === 'L'){	//좌
						left_qty = 1;
						right_qty = '';
					}else{									//우
						left_qty = '';
						right_qty = 1;
					}
				}else{								//분할X
					qty = ord_qty['qty'] === undefined ? '' : ord_qty['qty'];
					left_qty = ord_qty['left_qty'] === 0 ? '' : ord_qty['left_qty'];
					right_qty = ord_qty['right_qty'] === 0 ? '' : ord_qty['right_qty'];
				}
			}else if(ord_spec1['unit'] === '006'){	//야드
				size = ord_spec2['ord_yard'];

				qty = ord_qty['qty'];
				left_qty = '';
				right_qty = '';
			}else if(ord_spec1['unit'] === '007'){	//폭
				size = ord_spec2['ord_pok'];

				qty = ord_qty['qty'];
				left_qty = '';
				right_qty = '';
			}

			print_str += '<tr>';
			if(data[j].viewyn === 'Y'){
				print_str += '<td class="osp_list_cust_nm" data-text="'+ data[j].cust_nm +'">'+ data[j].cust_nm +'</td>';
			}else{
				print_str += '<td class="osp_list_cust_nm" data-text="'+ data[j].cust_nm +'"></td>';
			}
			print_str += '<td>'+ data[j].item_nm +'</td>';
			print_str += '<td>'+ width +'</td>';
			print_str += '<td>'+ height +'</td>';
			print_str += '<td class="no_pd">'+ size + data[j].unit_nm +'</td>';

			print_str += '<td>'+ qty +'</td>';
			print_str += '<td>'+ left_qty +'</td>';
			print_str += '<td>'+ right_qty +'</td>';
			print_str += '<td id="p_fac_text'+ data[j].ikey +'">'+ data[j].fac_text +'</td>';
			print_str += '</tr>';

			// //야드 , 폭 : 가공방법 , 형상옵션에 관해서
			if(ord_spec1['unit'] === '006' || ord_spec1['unit'] === '007'){
				var work_way = '';
				if(ord_spec1['work_way'] === '001'){
					work_way = '평주름'
				}else if(ord_spec1['work_way'] === '002'){
					work_way = '나비주름'
				}
				print_str = additional_str(print_str , work_way);
				i++;

				var base_st = '';
				if(ord_spec1['base_st'] === 'Y'){
					base_st = '형상옵션';
					i++;
				}
				print_str = additional_str(print_str , base_st);
			}

			//옵션1
			if(option['op1_nm'] === ''){
				print_str = additional_str(print_str , option['op1_nm']);
				i++;
			}
			//옵션2
			if(option['op2_nm'] === ''){
				print_str = additional_str(print_str , option['op2_nm']);
				i++;
			}
		}else{
			print_str += '<tr>';
			print_str += '<td></td>';
			print_str += '<td></td>';
			print_str += '<td></td>';
			print_str += '<td></td>';
			print_str += '<td></td>';
			print_str += '<td></td>';
			print_str += '<td></td>';
			print_str += '<td></td>';
			print_str += '<td></td>';
			print_str += '</tr>';
		}
		i++;
	}

	$('#p_osp_list').html(print_str);

	//=======================================================================
}

/*
 * @description 형상옵션 , 가공방법 , 옵션1 , 옵션2에 대한 한줄 추가건
 * @author 황호진, @version 1.0 @last_update 2022-06-16
 * */
function additional_str(str , content) {
	if(content !== ''){
		str += '<tr>';
		str += '<td></td>';
		str += '<td>'+ content +'</td>';
		str += '<td></td>';
		str += '<td></td>';
		str += '<td></td>';
		str += '<td></td>';
		str += '<td></td>';
		str += '<td></td>';
		str += '<td></td>';
		str += '</tr>';
	}
	return str;
}

/*
 * @description 주문서 팝업에서 select2를 통한 매입거래처 정보 조회
 * @author 황호진, @version 1.0 @last_update 2022-06-16
 * */
function get_buy_info(v) {
	var url = '/ord/ord_sheet/get_buy_info';
	var type = 'GET';
	var data = {
		buy_cd : v
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			//popup
			$('#buy_cust_nm').val(res.data.cust_cd);
			$('#buy_tel').val(res.data.tel);
			$('#buy_fax').val(res.data.fax);
			$('#buy_person').val(res.data.person);

			//인쇄물
			$('#p_buy_cust_nm').html(res.data.cust_nm);
			$('#p_buy_tel').html(res.data.tel);
			$('#p_buy_fax').html(res.data.fax);
			$('#p_buy_person').html(res.data.person);
		}).fail(fnc_ajax_fail);
}

/*
 * @description 주소 설정
 * @author 황호진, @version 1.0 @last_update 2022-06-17
 * */
function set_address() {
	var address = $('#address').val();
	var addr_detail = $('#addr_detail').val();

	var result = address + ' ' + addr_detail;
	$('#p_address').html(result);
}

/*
 * @description 인쇄출력 , 시스템발주 눌렀을때의 동작
 * @author 황호진, @version 1.0 @last_update 2022-06-17
 * */
function save_data(callback = undefined) {
	//주문 건별 비고란 설정
	var fac_text = new Array();
	$('.fac_text').each(function(i, list)
	{
		var ikey = $(this).attr('id').replace('fac_text' , '');
		fac_text.push({
			ikey		: ikey,
			fac_text 	: $(this).val()
		});
	});

	var cust_cd = $('#buy_cust_nm').val();
	var cust_nm;
	if(cust_cd !== ''){
		cust_nm = $('#buy_cust_nm option:checked')[0].label;
	}else{
		cust_nm = '';
	}

	//서버 통신
	var url = '/ord/ord_sheet/save_data';
	var type = 'POST';
	var data = {
		out_no		: $('#h_out_no').val(),
		ord_no		: $('#h_ord_no').val(),
		sys_gb		: $('#h_sys_gb').val(),
		cust_cd 	: cust_cd,
		cust_nm 	: cust_nm,
		tel			: $('#buy_tel').val(),
		fax			: $('#buy_fax').val(),
		person		: $('#buy_person').val(),
		ord_dt		: $('#ord_dt').val(),
		dlv_dt		: $('#dlv_dt').val(),
		emer		: $('#emer').val(),
		dlv_gb		: $('input[name=dlv_gb]:checked').val(),
		ord_zip		: $('#ord_zip').val(),
		address		: $('#address').val(),
		addr_detail	: $('#addr_detail').val(),
		addr_text	: $('#addr_text').val(),
		memo		: $('#memo').val(),
		viewyn		: $('#viewyn').val(),
		fac_text	: fac_text
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			//public/js/bms/ord_sheet.js 의 get_list 함수
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data);

			if(callback !== undefined){
				callback(res.result);
			}
		}).fail(fnc_ajax_fail);
}

/*
 * @description 시스템발주 버튼을 눌렀을때의 콜백
 * @author 황호진, @version 1.0 @last_update 2022-06-17
 * */
function system_msg(result) {
	if(result){
		toast('시스템발주 완료되었습니다.', false, 'info');
		$('.ord_sheet_pop').bPopup().close();
	}else{
		toast('시스템발주 도중 문제가 발생했습니다. 문제가 지속될 경우 문의 해주시길 바랍니다.', true, 'danger');
	}
}

/*
 * @description 인쇄 후의 작업
 * @author 황호진, @version 1.0 @last_update 2022-07-15
 * */
function post_print_work(result) {
	$('#h_out_no').val(result.out_no);
}

/*
 * @description 주문서 팝업 매입거래처부분 select2 그리기
 * @author 황호진, @version 1.0 @last_update 2022-07-14
 * */
function pop_set_buy_select(data) {
	var str = '<option value="">매입거래처명을 입력해주세요.</option>';
	$.each(data , function (i , list) {
		str += '<option value="'+ list.cust_cd +'">'+ list.cust_nm +'</option>';
	});
	$('#buy_cust_nm').html(str).select2();
};
