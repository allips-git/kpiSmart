/*================================================================================
 * @name: 황호진 - work_mn_curtain.js	커튼 공정(재단,가공,형상,검품,배송) 공통
 * @version: 1.0.0, @date: 2022-04-25
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	$("#sc").val('').select2();
	get_list(search_organize());
	//================================================================================

	//================================================================================
	/**
	 * @description 당일 , 금월 , 전월 기한 공통 이벤트!
	 * @author 황호진  @version 1.0, @last update 2022/04/22
	 */
	$('#sd').on('change', function () {
		var id = $(this).val();
		var now = new Date();
		var now_y = now.getFullYear();
		var now_m = now.getMonth();
		var now_d = now.getDate();
		if(id === 'A'){
			//당일 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m , now_d - 7)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m + 1 , now_d - 1)));
		}else if(id === 'B'){
			//금월 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m , 1)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m + 1 , 0)));
		}else if(id === 'C'){
			//전월 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m - 1 , 1)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m , 0)));
		}
		get_list(search_organize());
	});

	/**
	 * @description 검색폼의 selectbox의 값이 바뀌면 리스트 내역 검사
	 * @author 황호진  @version 1.0, @last update 2022/04/21
	 */
	$('#st_dt , #ed_dt , #sc , #si, #op_1 , #op_2 , #op_3 , #op_4').on('change' , function () {

		var site_name = $('#site_name').val();
		if(site_name === 'curtain_alt') {
			if ($(this).attr('id') === 'op_1') {	//변경된 값이 작업구분에 한해서 UI 변경
				var v = $(this).val();
				if (v === 'A') {
					$('#no_out').hide();	//바코드 미출력 비활성화
					$('#work_prog').hide();	//작업 진행 비활성화
					$('#barcode_print').show();	//작업 출력 활성화
				} else if (v === 'B') {
					$('#no_out').hide();	//바코드 미출력 비활성화
					$('#work_prog').hide();	//작업 진행 비활성화
					$('#barcode_print').hide();	//작업 출력 비활성화

				} else {
					$('#no_out').show();	//바코드 미출력 활성화
					$('#work_prog').show();	//작업 진행 활성화

					//바코드 미출력 , 작업 진행 버튼중 어느 버튼이 클릭되었는지에 따라 작업 출력버튼 유무
					if($('#b_type').val() === 'no_out'){
						$('#barcode_print').show();
					}else if($('#b_type').val() === 'work_prog'){
						$('#barcode_print').hide();
					}
				}
			}
		}
		get_list(search_organize());
	});

	/**
	 * @description 바코드 미출력 , 작업 진행 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/04/29
	 */
	$('#no_out , #work_prog').on('click' , function () {
		var id = $(this).attr('id');
		if(id === 'no_out'){
			$('#barcode_print').show();
		}else if(id === 'work_prog'){
			$('#barcode_print').hide();
		}
		// b_type 역할! 검색폼이 아닌 하단의 바코드 미출력 , 작업 진행 버튼 클릭에 따른 값을 다르게 주면서 이벤트 동작
		$('#b_type').val(id);
		get_list(search_organize());
	});

	/**
	 * @description 바코드 출력 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/04/29
	 */
	$('#barcode_print').on('click' , function () {
		var site_name = $('#site_name').val();

		var barcode_arr = [];
		//선택된 바코드 담는 작업
		$(".barcode").each(function () {
			if($(this).is(":checked") == true){
				barcode_arr.push("'"+$(this).val()+"'");
			}
		});

		if(site_name === 'curtain_alt'){	//재단 공정에 한해서만 작업 출력 가능
			if(barcode_arr.length > 0){		//선택된 체크박스 개수
				var con = custom_fire('확인창' , '출력 완료하시겠습니까?' , '취소' , '확인');
				con.then((result) => {
					if(result.isConfirmed){
						barcode_print(barcode_arr);
					}
				});
			}else{	//선택되어있는 바코드 데이터가 없다면!
				toast('출력할 바코드 데이터가 선택되어 있지 않습니다! 선택 후 다시 시도해주세요!', true, 'danger');
			}
		}else{	//레일 , 원단 공정 화면이 아닐 경우!

		}
	});

	/**
	 * @description 바코드 찍었을때
	 * @author 황호진  @version 1.0, @last update 2022/05/02
	 */
	$(document).scannerDetection({
		timeBeforeScanTest: 200, // wait for the next character for upto 200ms
		startChar: [120], // Prefix character for the cabled scanner (OPL6845R)
		endChar: [13], // be sure the scan is complete if key 13 (enter) is detected
		avgTimeByChar: 40, // it's not a barcode if a character takes longer than 40ms
		onComplete: function(barcode, qty){
			$(document).focus();
			$('#bar_scan').val(barcode);
			var site_name = $('#site_name').val();
			var url = '/proc/'+site_name+'/barcode_scan';
			var type = 'POST';
			var data = {
				barcode : barcode,
				organize: search_organize()
			};
			fnc_ajax(url , type , data)
				.done(function (res) {
					if(res.result){
						toast(res.msg, false, 'info');
						get_list(search_organize());

						var update_data = res.update_data;
						$('#alt_comp_cnt').text(update_data['alt_comp_cnt']);
						$('#alt_cnt').text(update_data['alt_cnt']);
						$('#proc_comp_cnt').text(update_data['proc_comp_cnt']);
						$('#proc_cnt').text(update_data['proc_cnt']);
						$('#st_comp_cnt').text(update_data['st_comp_cnt']);
						$('#st_cnt').text(update_data['st_cnt']);
						$('#insp_comp_cnt').text(update_data['insp_comp_cnt']);
						$('#insp_cnt').text(update_data['insp_cnt']);
						$('#ship_comp_cnt').text(update_data['ship_comp_cnt']);
						$('#ship_cnt').text(update_data['ship_cnt']);
					}else{
						toast(res.msg, true, 'danger');
					}
				}).fail(fnc_ajax_fail);
		}
	});

	/**
	 * @description 소계기준으로 체크박스를 눌렀을때 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/05/10
	 */
	$(document).on('change' , 'input[name=sub_chk]' , function () {
		var v = $(this).val();
		if($(this).is(':checked')){
			$('.sub_total'+v).prop('checked' , true).parent().parent().addClass('a');
		}else{
			$('.sub_total'+v).prop('checked' , false).parent().parent().removeClass('a');
		}
	});
	//================================================================================
});

/**
 * @description 검색란 조건 정리
 * @author 황호진  @version 1.0, @last update 2022/09/21
 */
function search_organize() {
	return {
		'pc_uc'		: $('#pc_uc').val(),
		'pc_cd'		: $('#pc_cd').val(),
		'pp_uc'		: $('#pp_uc').val(),
		'b_type'	: $('#b_type').val(),
		'site_name'	: $('#site_name').val(),
		'st_dt'		: $('#st_dt').val(),
		'ed_dt'		: $('#ed_dt').val(),
		'sc'		: $('#sc').val(),
		'op_1'		: $('#op_1').val(),
		'op_2'		: $('#op_2').val(),
		'op_3'		: $('#op_3').val(),
		'op_4'		: $('#op_4').val(),
		'si'		: $('#si').val(),
	};
}

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2022/04/25
 * @param time = (type Date) 년월일
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2022/04/25
 */
function get_list(data) {
	var site_name = $('#site_name').val();
	var url = '/proc/'+site_name+'/get_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			var len = res.data.length;
			var str = '';
			if(len > 0){
				var count 	= 0;		//카운트
				var item_nm = '';	//저장할 아이템명
				var num 	= 0;		//소계기준 카운터
				var b_type 	= $('#b_type').val();
				var op_1 	= $('#op_1').val();
				$.each(res.data , function (i , list) {
					var item_gb = JSON.parse(list.item_gb);		//추가분류[JSON]
					var option = JSON.parse(list.option);		//옵션[JSON]
					var ord_spec = JSON.parse(list.ord_spec);	//규격[JSON]
					var ord_qty = JSON.parse(list.ord_qty);		//수량[JSON]

					if(item_nm === ''){
						item_nm = list.item_nm;
					}else if(item_nm !== list.item_nm && item_nm !== ''){
						str += '<tr class="sub_total">';
						str += '<td colspan="13">소계 : '+ count +'</td>';
						str += '<td>'
						if(b_type === 'no_out' || op_1 === 'A'){	//바코드 미출력일때만 표시되도록!
							str += '<input type="checkbox" class="sub_total'+num+'" id="sub_chk'+ num +'" name="sub_chk" value="'+ num +'">';
							str += '<label for="sub_chk'+ num +'" class="chk"></label>';
						}
						str += '</td>';
						str += '</tr>';
						item_nm = list.item_nm;	//새로운 제품명으로 변수 저장
						count = 0;				//소계 카운트 초기화
						num++;
					}

					str += '<tr id="tr'+i+'" onclick=tr_click("tr'+i+'")>';
					str += '<td class="w5">'+ list.dlv_dt +'</td>';					//출고일
					str += '<td class="w5">'+ list.dlv_gb +'</td>';					//배송방법
					str += '<td class="w5">'+ list.memo +'</td>';					//고객명
					str += '<td class="Elli w11">'+ list.cust_nm +'</td>';			//업체명

					//옵션 명칭 설정
					var op_nm = '';
					if(option['op1_nm'] !== ''){
						op_nm += option['op1_nm'];
						if(option['op2_nm'] !== ''){
							op_nm += '/'+option['op2_nm'];
						}
					}else if(option['op2_nm'] !== ''){
						op_nm += option['op2_nm'];
					}
					//제품명 (투톤정보) + 옵션명
					if(ord_spec['color'] === 'one'){
						str += '<td class="w11">'+ list.item_nm +' '+ op_nm +'</td>';			//제품명
					}else if(ord_spec['color'] === 'two'){
						str += '<td class="w11">'+ list.item_nm +' '+ ord_spec['inside_num'] +'(안쪽) '+ op_nm +'</td>';			//제품명
					}
					if(ord_spec['work_way'] === '001'){			//평주름
						str += '<td class="w7">평주름</td>';
					}else if(ord_spec['work_way'] === '002'){	//나비주름
						str += '<td class="w7">나비주름</td>';
					}
					if(ord_spec['base_st'] === 'Y'){			//형상있음
						str += '<td class="w7">형상</td>';
					}else if(ord_spec['base_st'] === 'N'){		//형상없음
						str += '<td class="w7"></td>';
					}
					str += '<td class="w4 size">';
					str += '<p>'+ ord_spec['ord_width'] +'</p>';
					str += '</td>';
					str += '<td class="w4 size">';
					str += '<p>'+ ord_spec['ord_height'] +'</p>';
					str += '</td>';
					var div_gb;
					if(ord_spec['div_gb'] === '001'){
						div_gb = '양개';
					}else if(ord_spec['div_gb'] === '002'){
						div_gb = '편개';
					}
					//수량
					str += '<td class="count">'+ div_gb +': 1</td>';
					//단위 계산하는 곳!
					if(ord_spec['unit'] === '006'){
						//개별야드 = 총야드 / 수량
						var yard = Math.round((ord_spec['ord_yard'] / ord_qty['qty']) * 10) / 10;
						str += '<td class="w7"><span class="yard">'+ yard +'야드</span></td>';
					}else if(ord_spec['unit'] === '007'){
						//개별폭 = 총폭 / 수량
						var pok = ord_spec['ord_pok'] / ord_qty['qty'];
						str += '<td class="w7"><span class="poc">'+ pok +'폭</span></td>';
					}

					str += '<td class="memo Elli">'+ list.fac_text +'</td>';		//공장 요청사항
					str += '<td class="w5">';
					//진행여부
					if(list.finyn === 'S'){			//전송
						str += '<span class="send">전송</span>';
					}else if(list.finyn === 'P'){	//진행
						str += '<span class="ing">진행</span>';
					}else if(list.finyn === 'C'){	//완료
						str += '<span class="comp">완료</span>';
					}
					str += '</td>';
					str += '<td class="w5">';
					if(site_name === 'curtain_alt'){
						if(list.finyn === 'S' || op_1 === 'A'){	//현재상태가 전송 또는 작업구분이 출력완료일 경우
							str += '<input type="checkbox" class="barcode sub_total'+num+'" id="chk'+ i +'" name="chk" value="'+ list.barcode_no +'">';
							str += '<label for="chk'+ i +'" class="chk"></label>';
						}
					}
					str += '</td>';
					str += '</tr>';

					//소계 카운트 증가
					count++;
				});
				str += '<tr class="sub_total">';
				str += '<td colspan="13">소계 : '+ count +'</td>';
				str += '<td>';
				if(b_type === 'no_out' || op_1 === 'A') {	//바코드 미출력일때만 표시되도록!
					str += '<input type="checkbox" class="sub_total'+num+'" id="sub_chk'+ num +'" name="sub_chk" value="'+ num +'">';
					str += '<label for="sub_chk'+ num +'" class="chk"></label>';
				}
				str += '</td>';
				str += '</tr>';

				$("#work_nm_list").html(str); // ajax data output
			}else{
				str += '<tr>';
				str += '<td colspan="14">조회 가능한 데이터가 없습니다.</td>';
				str += '</tr>';
				$("#work_nm_list").html(str); // ajax data output
			}
			$('#chk_all').prop('checked' , false);

			let cnt = res.cnt;
			$('#alt_comp_cnt').text(cnt['alt_comp_cnt']);
			$('#alt_cnt').text(cnt['alt_cnt']);
			$('#proc_comp_cnt').text(cnt['proc_comp_cnt']);
			$('#proc_cnt').text(cnt['proc_cnt']);
			$('#st_comp_cnt').text(cnt['st_comp_cnt']);
			$('#st_cnt').text(cnt['st_cnt']);
			$('#insp_comp_cnt').text(cnt['insp_comp_cnt']);
			$('#insp_cnt').text(cnt['insp_cnt']);
			$('#ship_comp_cnt').text(cnt['ship_comp_cnt']);
			$('#ship_cnt').text(cnt['ship_cnt']);
		}).fail(fnc_ajax_fail);
}

/**
 * @description barcode_print 함수 (JSP 출력물)
 * @author 황호진  @version 1.0, @last update 2022/04/29
 */
function barcode_print(arr) {
	var site_name = $('#site_name').val();
	var url = '/proc/'+site_name+'/barcode_print';
	var type = 'POST';
	var data = {
		bars : arr,
		pc_uc : $('#pc_uc').val(),
		pp_uc : $('#pp_uc').val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				//리스트 재호출
				get_list(search_organize());
				
				// 전송 파라미터
				$('#p_gb').val(print_gb);
				$('#p_barcode').val(arr);

				var pop_title = "barcode_print";

				var _width = '750';
				var _height = '385';

				var _left = Math.ceil(( window.screen.width - _width )/2);
				var _top = Math.ceil(( window.screen.height - _height )/2);

				window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

				var frm_data = document.barcode_frm;

				frm_data.target = pop_title;
				if(print_host == 'plan-bms.localhost') {
					frm_data.action = print_local+"/c_work_barcode.jsp";
				} else {
					frm_data.action = print_domain+"/c_work_barcode.jsp";
				}
				frm_data.submit();
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);

}

/**
 * @description tr태그를 클릭했을때 일어나는 이벤트
 * @author 황호진  @version 1.0, @last update 2022/05/03
 */
function tr_click(id) {
	if($('#'+id).find('input[type=checkbox]').length){
		if($('#'+id).find('input[type=checkbox]').is(':checked')){
			//checkbox false 처리
			$('#'+id).find('input[type=checkbox]').prop('checked' , false);

			//checkbox false 처리에 따른 클래스 제거
			$('#'+id).removeClass('a');
		}else{
			//checkbox true 처리
			$('#'+id).find('input[type=checkbox]').prop('checked' , true);

			//checkbox true 처리에 따른 클래스 추가
			$('#'+id).addClass('a');
		}
	}
}
