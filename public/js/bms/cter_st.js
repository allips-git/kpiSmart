/*================================================================================
 * @name: 황호진 - cter_st.js	중앙현황 화면
 * @version: 1.0.0, @date: 2022-04-06
 ================================================================================*/
$(function(){
	//화면이 맨처음 로드 될때!
	//================================================================================
	$("#sc").val('').select2();
	var search_data = {
		's' 	: null,
		'st_dt'	: $('#st_dt').val(),
		'ed_dt'	: $('#ed_dt').val()
	};
	get_list(search_data);
	//================================================================================

	/**
	 * @description 전체 , 당일 , 금월 , 전월 기한
	 * @author 황호진  @version 1.0, @last update 2022/04/06
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
	 * @author 황호진  @version 1.0, @last update 2022/04/07
	 */
	$('#st_dt , #ed_dt , #sc , #si , #op_1 , #op_2 , #op_3 , #op_4 , #op_5').on('change' , function () {
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
	});

	/**
	 * @description 간편검색 이벤트 걸기
	 * @author 황호진  @version 1.0, @last update 2022/04/15
	 */
	$("div[name=box_search]").on('click' , function () {
		var type = $(this).attr('data-text');
		get_easy_search_list({type : type});
	});

	/**
	 * @description 작업전송 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/04/15
	 */
	$("#send_btn").on('click' , function () {
		var chkyn = $('.chkyn');
		var data = [];
		for(var i = 0; i < chkyn.length; i++){
			if($('#'+chkyn[i].id).is(':checked')){
				var separation = chkyn[i].value.split('-');
				data.push({
					ord_no : separation[0],
					ord_seq : separation[1]
				})
			}
		}
		if(data.length){
			var con = custom_fire('작업 전송창' , '작업전송하시겠습니까?' , '취소' , '확인');
			con.then((result) => {
				if(result.isConfirmed){
					//작업전송 함수
					work_send({data : data});
				}
			});
		}
	});

	$(document).on('click' , '.cancle' , function () {
		var con = custom_fire('강제취소창' , '강제취소하시겠습니까?' , '취소' , '확인');
		con.then((result) => {
			if(result.isConfirmed){
				var v = $(this).val().split('-');
				var data = {
					ord_no	: v[0],
					ord_seq	: v[1]
				};
				//강제취소
				work_cancel(data);
			}
		});
	});
});

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2022/04/06
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2022/04/07
 */
function get_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/work/cter_st/get_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: false,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: false,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					draw_list(res);
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description get_easy_search_list 간편검색
 * @author 황호진  @version 1.0, @last update 2022/04/15
 */
function get_easy_search_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/work/cter_st/get_easy_search_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, 		// ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,				//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: false,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: false,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					draw_list(res);
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description list 그리는 함수
 * @author 황호진  @version 1.0, @last update 2022/04/07
 */
function draw_list(data) {
	var len = data.length;
	var str = '';

	if(len > 0){
		$.each(data , function (i , list) {
			//데이터 설정
			var option = JSON.parse(list.option);
			var ord_spec = JSON.parse(list.ord_spec);
			var ord_qty = JSON.parse(list.ord_qty);
			str += '<tr>';
			str += '<td class="w5">'+ list.dlv_dt +'</td>';
			str += '<td class="w5">'+ list.factory +'</td>';
			str += '<td class="w5">'+ list.memo +'</td>';
			str += '<td class="Elli">'+ list.cust_nm +'</td>';

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
			//제품명 + 옵션명
			str += '<td class="w15">'+ list.item_nm + ' ' + op_nm +'</td>';
			str += '<td class="w7">'+ list.spec +'</td>';
			str += '<td>';
			if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
				//좌측 수량이 없을때!
				if(ord_qty['left_qty'] === 0){
					str += '<span></span>';
				}else{
					str += '<span>좌:'+ ord_qty['left_qty'] +'</span>';
				}
				//우측 수량이 없을때!
				if(ord_qty['right_qty'] === 0){
					str += '<span></span>';
				}else{
					str += '<span>우:'+ ord_qty['right_qty'] +'</span>';
				}
			}else if(ord_spec['unit'] === '005'){
				str += ord_qty['qty']+'EA';
			}else if(ord_spec['unit'] === '006' || ord_spec['unit'] === '007'){
				//커튼 분할 div_gb 가 001 : 양개 , 002 : 편개
				if(ord_spec['div_gb'] === '001'){
					str += '양개:'+ord_qty['qty'];
				}else if(ord_spec['div_gb'] === '002'){
					str += '편개:'+ord_qty['qty'];
				}
			}
			str += '</td>';
			if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
				if(ord_spec['division'] > 1){
					str += '<td class="bunhal bhl" id="bunhal_'+list.lot+'" data-text1="'+list.ord_no+'" data-text2="'+list.ord_seq+'">'+ ord_spec['division'] +'분할(상세보기)</td>';
				}else{
					str += '<td></td>';
				}
			}else if(ord_spec['unit'] === '006' || ord_spec['unit'] === '007'){
				//색상 원톤 , 투톤
				if(ord_spec['color'] === 'two'){
					str += '<td class="twoton tdl" id="twoton_'+list.lot+'" data-text1="'+list.ord_no+'" data-text2="'+list.ord_seq+'">투톤(상세보기)</td>';
				}else{
					str += '<td></td>';
				}
			}else{
				str += '<td></td>';
			}
			str += '<td class="w7">';
			if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
				str += Math.floor(ord_spec['ord_hebe'] * 10) / 10+'회베';
			}else if(ord_spec['unit'] === '006') {
				str += Math.floor(ord_spec['ord_yard'] * 10) / 10+'야드';
			}else if(ord_spec['unit'] === '007'){
				str += ord_spec['ord_pok']+'폭';
			}else{
				str += ord_qty['qty']+'EA';
			}
			str += '</td>';
			str += '<td>'+ commas(Number(list.unit_amt)) +'원</td>';
			str += '<td>'+ commas(Number(list.ord_amt) + Number(list.tax_amt)) +'원</td>';
			str += '<td class="w5">'+ list.dlv_gb +'</td>';
			str += '<td class="w5 blue">'+ list.finyn_nm +'</td>';
			str += '<td class="w5">';
			if(list.finyn === '003' || list.finyn === '004' || list.finyn === '005'){
				str += '<button type="button" class="cancle" value="'+ list.ord_no +'-'+ list.ord_seq +'">강제취소</button>';
			}
			str += '</td>';
			str += '<td class="w5">';
			if(list.finyn === '002'){
				str += '<input type="checkbox" id="chk'+ list.ikey +'" class="chkyn" name="chk" value="'+ list.ord_no +'-'+ list.ord_seq +'">';
				str += '<label for="chk'+ list.ikey +'" class="chk"></label>';
			}
			str += '</td>';
			str += '</tr>';
		});
		$("#cter_list").html(str); // ajax data output
	}else{
		str += "<tr>";
		str += "<td colspan='15'>조회 가능한 데이터가 없습니다.</td>";
		str += "</tr>";
		$("#cter_list").html(str); // ajax data output
	}
}

/**
 * @description 작업전송 이벤트
 * @author 황호진  @version 1.0, @last update 2022/04/15
 */
function work_send(data) {
	var url = '/work/cter_st/work_send';
	var type = 'POST';
	fnc_ajax(url , type , data)
		.done(function (res) {
			console.log(res);
			if(res.result){
				toast(res.msg, false, 'info');
				var search_data = $("#frm").serialize();	//form 데이터
				get_list(search_data);
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 강제취소 이벤트
 * @author 황호진  @version 1.0, @last update 2022/04/18
 */
function work_cancel(data) {
	var url = '/work/cter_st/work_cancel';
	var type = 'POST';
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				var search_data = $("#frm").serialize();	//form 데이터
				get_list(search_data);
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
