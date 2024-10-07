/*================================================================================
 * @name: 황호진 - work_st_curtain.js	작업현황 커튼 화면
 * @version: 1.0.0, @date: 2022-04-19
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	$("#sc").val('').select2();
	var now = new Date();
	var now_y = now.getFullYear();
	var now_m = now.getMonth();
	var now_d = now.getDate();
	var search_data = {
		's' 			: null,
		'search_type'	: $('#search_type').val(),
		'pc_cd' 		: $('#pc_cd').val(),
		'st_dt'			: conver_date(new Date(now_y , now_m , now_d)),
		'ed_dt'			: conver_date(new Date(now_y , now_m + 1 , now_d - 1))
	};
	get_list(search_data);
	//================================================================================


	//================================================================================
	/**
	 * @description 당일 , 금월 , 전월 기한
	 * @author 황호진  @version 1.0, @last update 2022/04/19
	 */
	$('#sd').on('change', function () {
		var id = $(this).val();
		var now = new Date();
		var now_y = now.getFullYear();
		var now_m = now.getMonth();
		var now_d = now.getDate();
		if(id === 'A'){
			//당일 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m , now_d)));
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
		var search_data = $("#frm").serialize();	//form 데이터
		//변경되자마자 즉시 검색 들어갈것
		get_list(search_data);
	});

	/**
	 * @description 검색폼의 selectbox의 값이 바뀌면 리스트 내역 검사
	 * @author 황호진  @version 1.0, @last update 2022/04/19
	 */
	$('#st_dt , #ed_dt , #sc , #si, #op_1 , #op_2 , #op_3').on('change' , function () {
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
	});

	/**
	 * @description 검색폼의 selectbox의 값이 바뀌면 리스트 내역 검사
	 * @author 황호진  @version 1.0, @last update 2022/04/19
	 */
	$('#stat').on('change' , function () {
		var v = $(this).val();
		if(v === 'A' || v === 'B'){	//커튼 작업현황 , 커튼 작업완료가 클릭되었을때
			$('#search_type').val('A');		//검색타입을 A로 설정!
			$('#work_comp_btn').show();
		}else{						//커튼 강제취소 클릭되었을때
			$('#search_type').val('B');		//검색타입을 B로 설정!
			$('#work_comp_btn').hide();
		}
		get_list($("#frm").serialize());
	});

	/**
	 * @description 간편검색 이벤트 걸기
	 * @author 황호진  @version 1.0, @last update 2022/04/19
	 */
	$("div[name=box_search]").on('click' , function () {
		var v = $(this).attr('data-text');
		if(v === 'A' || v === 'B'){	//블라인드 작업현황 , 블라인드 작업완료가 클릭되었을때
			$('#search_type').val('A');		//검색타입을 A로 설정!
			$('#work_comp_btn').show();
		}else {						//블라인드 강제취소 클릭되었을때
			$('#search_type').val('B');		//검색타입을 B로 설정!
			$('#work_comp_btn').hide();
		}
		$('#stat').val(v);	//클릭된 간편검색의 값을 검색폼의 stat에 설정
		get_easy_search_list({type : v , pc_cd : $('#pc_cd').val() });
	});

	/**
	 * @description 작업완료 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/05/03
	 */
	$("#work_comp_btn").on('click' , function () {
		var work_arr = [];

		//선택된 작업정보 담는 작업
		$(".work_info").each(function () {
			if($(this).is(":checked") == true){
				work_arr.push($(this).val());
			}
		});

		if(work_arr.length > 0){
			var con = custom_fire('확인창' , '작업 완료하시겠습니까?' , '취소' , '확인');
			con.then((result) => {
				if(result.isConfirmed){
					work_comp(work_arr);
				}
			});
		}else{
			toast('작업 완료할 데이터가 선택되어 있지 않습니다! 선택 후 다시 시도해주세요!', true, 'danger');
		}
	});
	//================================================================================

});

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2022/04/19
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description get_list 데이터 조회 함수
 * @author 황호진  @version 1.0, @last update 2022/04/19
 */
function get_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/work/work_st_curtain/get_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			//작업완료 치기 위한 기준데이터
			var proc_list = res.data.proc_list;
			container.pagination({
				// pagination setting
				dataSource: res.data.work_st_list, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: false,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: false,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					draw_list(res , proc_list);
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description get_easy_search_list 간편검색
 * @author 황호진  @version 1.0, @last update 2022/04/19
 */
function get_easy_search_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/work/work_st_curtain/get_easy_search_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			//작업완료 치기 위한 기준데이터
			var proc_list = res.data.proc_list;
			container.pagination({
				// pagination setting
				dataSource: res.data.work_st_list, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: false,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: false,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					draw_list(res , proc_list);
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description draw_list 리스트 그리는 곳
 * @author 황호진  @version 1.0, @last update 2022/04/19
 */
function draw_list(draw_data , ref_list) {
	var draw_len = draw_data.length;
	var str = '';
	if(draw_len > 0){
		$.each(draw_data , function (i , list) {
			var option = JSON.parse(list.option);
			var ord_spec = JSON.parse(list.ord_spec);
			var ord_qty = JSON.parse(list.ord_qty);
			str += '<tr id="tr'+i+'" onclick=tr_click("tr'+i+'")>';
			str += '<td class="w5">'+ list.dlv_dt +'</td>';
			str += '<td class="w5">'+ list.factory +'</td>';

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
			str += '<td class="">'+ list.item_nm + ' ' + op_nm +'</td>';
			if(ord_spec.base_st === 'Y'){
				str += '<td>형상</td>';
			}else{
				str += '<td></td>';
			}
			str += '<td class="w7">'+ ord_spec.ord_width +' X '+ ord_spec.ord_height +'</td>';
			str += '<td class="w7 count">';
			//커튼 분할부분 양개 , 편개
			if(ord_spec.div_gb === '001'){
				str += '양개 :'+ord_qty.qty;
			}else if(ord_spec.div_gb === '002'){
				str += '편개 :'+ord_qty.qty;
			}
			str += '</td>';
			if(ord_spec.unit === '006'){		//yard
				str += '<td class="w5">'+ ord_spec.ord_yard + list.unit_nm +'</td>';
			}else if(ord_spec.unit === '007'){	//pok
				str += '<td class="w5">'+ ord_spec.ord_pok + list.unit_nm +'</td>';
			}
			str += '<td class="w5">'+ list.memo +'</td>';
			str += '<td class="Elli">'+ list.cust_nm +'</td>';
			str += '<td class="w5">'+ list.dlv_gb +'</td>';
			str += '<td class="w5">';
			if(list.finyn === '003'){			//전송
				str += '<span class="send">'+ list.finyn_nm +'</span>';
			}else if(list.finyn === '004'){		//진행
				str += '<span class="ing">'+ list.finyn_nm +'</span>';
			}else if(list.finyn === '005'){		//완료
				str += '<span class="comp">'+ list.finyn_nm +'</span>';
			}
			str += '</td>';
			//공정 개수 그리는 곳
			for(let i = 0; i < ref_list.length; i++){
				str += '<td class="w5">';
				if(list['proc'+(i+1)] === 'S'){
					str += '<span class="send">전송</span>';
				}else if(list['proc'+(i+1)] === 'P'){
					str += '<span class="ing">진행</span>';
				}else if(list['proc'+(i+1)] === 'C'){
					str += '<span class="comp">완료</span>';
				}
				str += '</td>';
			}
			//작업 완료 체크박스 보이는 기준 플래그!
			var flag = false;
			for(let i = 0; i < ref_list.length; i++){
				if(ref_list[i]['compyn'] === 'Y'){
					if(list['proc'+(i+1)] === 'C'){
						flag = true;
					}else{
						flag = false;
						break;
					}
				}
			}
			str += '<td class="w5">';
			//list['ty'] : 조회타입! A (작업현황) , B (강제취소)
			if(flag && list['ty'] === 'A' && list.finyn === '004'){
				var info = list.ord_no+"/"+list.ord_seq;
				str += '<input type="checkbox" class="work_info" id="chk'+ i +'" name="chk" value="'+ info +'">';
				str += '<label for="chk'+ i +'" class="chk"></label>';
			}
			str += '</td>';
			str += '</tr>';
		});
		$("#work_st_list").html(str); // ajax data output
	}else{
		//공정수를 제외한 table col 숫자 11개
		//ref_list.length => 공정수
		var n = 11 + ref_list.length;
		str += '<tr>';
		str += '<td colspan="'+ n +'">조회 가능한 데이터가 없습니다.</td>';
		str += '</tr>';
		$("#work_st_list").html(str); // ajax data output
	}
	$('#chk_all').prop('checked' , false);
}

/**
 * @description tr태그를 클릭했을때 일어나는 이벤트
 * @author 황호진  @version 1.0, @last update 2022/05/10
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

/**
 * @description 작업완료 버튼 함수
 * @author 황호진  @version 1.0, @last update 2022/05/03
 */
function work_comp(arr) {
	var url = '/work/work_st_curtain/work_comp';
	var type = 'POST';
	var data = {
		works : arr
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			console.log(res);
			if(res.result){
				toast(res.msg, false, 'info');
				var search_data = $("#frm").serialize();	//form 데이터
				get_list(search_data);

				var update_data = res.data;
				$('#work_ing_cnt').text(update_data['work_ing_cnt']);
				$('#work_comp_cnt').text(update_data['work_comp_cnt']);
				$('.all_work_cnt').text(update_data['all_work_cnt']);
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
