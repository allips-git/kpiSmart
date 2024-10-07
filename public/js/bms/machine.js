/*================================================================================
 * 개발팀 machine js - custom function package
 * @version: 1.0.0
 ================================================================================*/
var d_mc_uc = '';
var page_num = 1;
$(function(){
	//맨처음 javascript 로드시 설비 리스트에 뿌리기 위한 데이터 설정 값
	var data = {'s':null};	//null로 보냄! 값이 있을때는 't' 라는 값을 전송
	get_list(data , 'select');			//설비리스트 호출 함수

	//검색버튼 연동
	$("#search_btn").off().click(function () {
		$("input[name='s']").val('t');	//검색하기 때문에 't' 라는 값이 주어짐
		var data = $("#frm").serialize();	//form 데이터
		get_list(data , 'select');		//설비리스트 호출 함수
		form_reset();
	});

	//검색어 입력후 엔터칠때 실행
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='s']").val('t');	//검색하기 때문에 't' 라는 값이 주어짐
			var data = $("#frm").serialize();	//form 데이터
			get_list(data , 'select');		//설비리스트 호출 함수
			form_reset();
		}
	});

	//등록버튼 연동
	$("#add_btn").off().click(function () {
		var p = $("#p").val();	//현재 p의 값을 가져옴! in => insert
		var con = confirm('등록하시겠습니까?');
		if(con){
			iu(p);	//insert or update ajax 함수 호출
		}
	});
	
	//수정버튼 연동
	$("#mod_btn").off().click(function () {
		var p = $("#p").val();	//현재 p의 값을 가져옴! up => update
		$("#p_mc_uc").val(d_mc_uc);
		var con = confirm('수정하시겠습니까?');
		if(con){
			iu(p);	//insert or update ajax 함수 호출
		}
	});

	//삭제버튼 연동
	$("#del_btn").off().click(function () {
		var con = confirm('삭제하시겠습니까?');
		if(con){
			d_data();
		}
	});

	//리셋버튼 연동
	$("#reset_btn").off().click(function () {
		var con = confirm('입력을 초기화 하시겠습니까?');
		if(con) {
			form_reset();	//form reset 함수 호출
		}
	});

	/**
	 * @description 제품리스트 가용여부 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/24
	 */
	$(document).on('click','.switch', function () {
		var sysyn = $(this).attr('data-sysyn');	//시스템YN
		var useyn = $(this).attr('data-useyn');	//사용YN
		var id = $(this).attr("id");
		var mc_uc = id.replace('switch_','');			//item_cd값 추출

		if(sysyn === 'Y' && useyn === 'Y'){	//가용여부 Y AND 시스템 Y
			return toast("사용 중 설비인 경우 가용 여부 off 불가합니다.", true, 'danger');
		}

		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con) {
			useyn_change(mc_uc);			//id , sysyn , useyn
		}
	});

	$("#amt").on("input", function() {$(this).val( $(this).val().replace(/[^0-9]/gi,"") );});

});

/**
 * @description 데이터 delete 함수
 */
function d_data() {
	$("#p_mc_uc").val(d_mc_uc);

	var url = '/base/machine/d_data';
	var type = 'POST';
	var data = $("#iu_frm").serialize();	//serialize로 넘기기
	fnc_ajax(url, type, data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				get_list({'s':null} , 'delete');	//설비 리스트 재호출
				form_reset();	//입력폼 초기화시키기
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 입력폼 reset 함수
 */
function form_reset() {
	d_mc_uc = '';
	$("button[name=add_btn]").show();	//등록버튼 활성화
	$("button[name=mod_btn]").hide();	//수정버튼 비활성화
	$("button[name=del_btn]").hide();	//삭제버튼 추후구현
	$("#p").val('in');		//in 값 설정
	$("#p_mc_uc").val("");		//선택된 설비데이터 고유코드 초기화
	$('#use01').prop('checked', true);
	$(".ad").removeClass("active");
	$("#mc_gb").val("생산설비");	//화면 맨처음 들어왔을때 생산설비로 설정되어 있음
	$("#mc_no").val("1");		//화면 맨처음 들어왔을때 1로 설정되어 있음
	$("#mc_nm").val("");
	$("#maker").val("");
	$("#model_nm").val("");
	$("#spec").val("");
	$("#buy_corp").val("");
	$("#buy_dt").val(get_now_date());	//현재 날짜로 초기화
	$("#amt").val("");
	$("#memo").val("");
}

/**
 * @description useyn 변경 함수
 */
function useyn_change(id) {
	var url = '/base/machine/useyn_change';
	var type = 'POST';
	var data = {
		'mc_uc' : id
	};
	fnc_ajax(url , type , data)	//ajax 공용 함수
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if($("#useyn_"+id).is(":checked") === true){
					$("#useyn_"+id).prop('checked', false);	//checked => false
					$("#switch_"+id).attr("data-useyn","N");

					//변경한 가용여부 item_cd가 입력폼에 기입된 item_cd와 같을때
					if(id === d_mc_uc){
						$("#use02").prop("checked",true);	//사용불가
					}
				}else{
					$("#useyn_"+id).prop('checked', true);	//checked => true
					$("#switch_"+id).attr("data-useyn","Y");

					//변경한 가용여부 item_cd가 입력폼에 기입된 item_cd와 같을때
					if(id === d_mc_uc){
						$("#use01").prop("checked",true);	//사용가능
					}
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);	//ajax fail 공용 함수
}

/**
 * @description insert 및 update ajax 통신
 */
function iu(p) {
	if(!val_check('mc_nm','str')){	//빈값 체크
		return toast('설비명이 빈값입니다. 입력 후 시도해주세요!', true, 'danger');
	}
	var url = '/base/machine/iu';
	var type = 'POST';
	var data = $("#iu_frm").serialize();		//입력폼 serialize

	fnc_ajax(url, type, data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if(p === 'in'){
					var search_data = {'s':null};
					get_list(search_data , 'insert');	//설비 리스트 재호출
					form_reset();	//입력폼 초기화시키기
				}else{
					var search_data = $("#frm").serialize();
					get_list(search_data , 'update');	//설비 리스트 재호출
					get_detail(d_mc_uc);
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);


	// if(p === 'in'){	//in 일때
	// 	//var s = $("input[name='s']").val();
	// 	fnc_ajax(url, type, data)
	// 		.done(function (res) {
	// 			if(res.result){
	// 				toast(res.msg, false, 'info');
	// 				if(s === 't'){	//검색조건이 있는지 확인
	// 					var search_data = $("#frm").serialize();
	// 					get_list(search_data);	//설비 리스트 재호출
	// 				}else{
	// 					var search_data = {'s':null};
	// 					get_list(search_data);	//설비 리스트 재호출
	// 				}
	// 				form_reset();	//입력폼 초기화시키기
	// 			}else{
	// 				toast(res.msg, true, 'danger');
	// 			}
	// 		}).fail(fnc_ajax_fail);
	// }else if(p === 'up'){	//up 일때
	// 	fnc_ajax(url, type, data)
	// 		.done(function (res) {
	// 			if(res.result){
	// 				toast(res.msg, false, 'info');
	// 				if(s === 't'){	//검색조건이 있는지 확인
	// 					var search_data = $("#frm").serialize();
	// 					get_list(search_data);	//설비 리스트 재호출
	// 				}else{
	// 					var search_data = {'s':null};
	// 					get_list(search_data);	//설비 리스트 재호출
	// 				}
	// 				//update_list(d_mc_uc, res.data);	//해당 행의 데이터를 찾아서 update
	// 			}else{
	// 				toast(res.msg, true, 'danger');
	// 			}
	// 		}).fail(fnc_ajax_fail);
	// }

}

/**
 * @description update 성공시 데이터 리스트 변경(사용안함)
 */
function update_list(id , data_list) {
	//var x = document.getElementById("data-container").rows[index].cells.length;
	var list_1 = $("#tr_"+id).find("td:eq(0)");	//우선순위
	list_1.html(data_list.mc_no);
	var list_2 = $("#tr_"+id).find("td:eq(1)");	//설비코드
	list_2.html(data_list.mc_cd);
	var list_3 = $("#tr_"+id).find("td:eq(2)");	//설비명
	list_3.html(data_list.mc_nm);
	var list_4 = $("#tr_"+id).find("td:eq(3)");	//설비유형
	list_4.html(data_list.mc_gb);
	if(data_list.useyn === 'Y'){	//사용여부가 Y일때
		$("#"+data_list.mc_uc).prop('checked', true);	//checked => true
	}else{
		$("#"+data_list.mc_uc).prop('checked', false);	//checked => false
	}
	var list_6 = $("#tr_"+id).find("td:eq(5)");	//메이커명
	list_6.html(data_list.maker);
	var list_7 = $("#tr_"+id).find("td:eq(6)");	//모델명
	list_7.html(data_list.model_nm);
	var list_8 = $("#tr_"+id).find("td:eq(7)");	//규격
	list_8.html(data_list.spec);
	var list_9 = $("#tr_"+id).find("td:eq(8)");	//구매처
	list_9.html(data_list.buy_corp);
	var list_10 = $("#tr_"+id).find("td:eq(9)");	//구매일자
	list_10.html(data_list.buy_dt);
	var list_11 = $("#tr_"+id).find("td:eq(10)");	//구매금액
	list_11.html(parseInt(data_list.amt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
	var list_12 = $("#tr_"+id).find("td:eq(11)");	//비고
	list_12.html(data_list.memo);
	var list_13 = $("#tr_"+id).find("td:eq(12)");	//등록자명
	list_13.html(data_list.reg_ikey);
	var list_14 = $("#tr_"+id).find("td:eq(13)");	//등록일시
	list_14.html(data_list.reg_dt);
	var list_15 = $("#tr_"+id).find("td:eq(14)");	//수정자명
	list_15.html(data_list.mod_ikey);
	var list_16 = $("#tr_"+id).find("td:eq(15)");	//수정일시
	list_16.html(data_list.mod_dt);
	$("#myTable").trigger("update");
}

/**
 * @description 빈값 검사하는 함수 (타입 추가)
 */
function val_check(id , type) {
	var value = $("#"+id).val();	//받아온 id값으로 val 확인
	if(type === 'str'){	//type에 따라 빈값 검사를 다르게 가능
		if(value === ''){
			return false;
		}
	}
	return true;
}

/**
 * @description 화면 로드 , 검색 , pagenation의 집합 함수
 */
function get_list(data , state) {
	$("#myTable").tablesorter({theme : 'blue'});	//테이블 정렬 기능
	var container = $('#pagination');	//pagination
	var url = '/base/machine/get_data_list';
	var type = 'GET';
	var p = $("#p").val();
	if(p === 'in' || state === 'select' || state === 'delete'){
		page_num = 1;
	}
	fnc_ajax(url, type, data)
		.done(function (res) {
			$("#list_cnt").html(res.data.total_count);
			container.pagination({
				// pagination setting
				dataSource: res.data.list, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: true,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: true,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				pageNumber: page_num, // 현재 페이지 세팅
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					// ajax content setting
					var len = res.length;
					var str = '';
					if(len > 0){
						var arr = [];
						$.each(res, function (i, list) {	//받아온 데이터 화면에 표현
							var amt = parseInt(list.amt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
							amt = amt == 0 ? "" : amt;
							str += '<tr class="ad" id="tr_'+ list.mc_uc +'">';
							str += '<td>' + list.mc_no + '</td>';
							str += '<td class="tb_click" onclick=get_detail("'+ list.mc_uc +'")>' + list.mc_cd + '</td>';
							str += '<td class="T-left tb_click" style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis" onclick=get_detail("'+ list.mc_uc +'")>' + list.mc_nm + '</td>';
							str += '<td class="tb_click" onclick=get_detail("'+ list.mc_uc +'")>' + list.mc_gb + '</td>';
							str += '<td>' +
									'<label class="switch" id="switch_'+ list.mc_uc +'" data-sysyn="'+list.sysyn+'" data-useyn="'+list.useyn+'" style="cursor: pointer;">' +
									'<input type="checkbox" id="useyn_'+ list.mc_uc +'" disabled>' +
									'<span class="slider round"></span>' +
									'<span class="offtxt">off</span>' +
									'<span class="ontxt">on</span>' +
									'</label>' +
									'</td>';
							str += '<td class="T-left" style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis">' + list.maker + '</td>';
							str += '<td class="T-left" style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis">' + list.model_nm + '</td>';
							str += '<td class="T-left" style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis">' + list.spec + '</td>';
							str += '<td class="T-left" style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis">' + list.buy_corp + '</td>';
							str += '<td class="T-center" style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis">' + list.buy_dt + '</td>';
							str += '<td class="T-right" style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis">' + amt + '</td>';
							str += '<td class="T-left" style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis">' + list.memo + '</td>';
							str += '<td>' + list.reg_ikey + '</td>';
							str += '<td>' + list.reg_dt + '</td>';
							str += '<td>' + list.mod_ikey + '</td>';
							str += '<td>' + list.mod_dt + '</td>';
							if(list.sysyn == 'Y'){
								str += '<td class="red">삭제불가</td>';
							}else{
								str += '<td>삭제가능</td>';
							}
							str += '</tr>';
							if(list.useyn == 'Y'){
								arr.push('useyn_'+list.mc_uc);
							}
						});
						$("#data-container").html(str); // ajax data output

						for(var i = 0; i < len; i++){
							$('#'+arr[i]).prop('checked', true);
						}
						if(p === 'up') {
							$(".ad").removeClass("active");
							$("#tr_" + d_mc_uc).addClass("active");
						}
					

						$("#myTable").trigger("update");
					}else{	//조회할 데이터가 없을때
						str += "<tr><td colspan='17'>조회 가능한 데이터가 없습니다.</td></tr>"
						$("#data-container").html(str); // ajax data output
					}

					$('#pagination').addHook('afterRender', function() {
						page_num = $("li.paginationjs-page.J-paginationjs-page.active").attr('data-num');
					});

									
					$('.at tr').click(function(){
						$('.at tr').removeClass('active');
						$(this).addClass('active')
					});

					$('.at td').click(function(){
						$('.at td').removeClass('active');
						$(this).addClass('active')
					});

				}

			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description 리스트의 데이터 클릭시 상세내용 불러오는 함수 ajax 통신
 */
function get_detail(mc_uc) {
	var url = '/base/machine/get_detail';
	var type = 'get';
	var data = {
		'mc_uc' : mc_uc		//고유 코드로 상세내용 불러옴
	};
	fnc_ajax(url , type , data)
		.done(function (res) {

			var amt = Math.floor(res.amt);
			amt = amt == 0 ? "" : amt;

			$("button[name=add_btn]").hide();	//등록버튼 비활성화
			$("button[name=mod_btn]").show();	//수정버튼 활성화
			if(res.sysyn == 'Y'){
				$("button[name=del_btn]").hide();	//삭제버튼 비활성화
			}else{
				$("button[name=del_btn]").show();	//삭제버튼 활성화
			}
			$(".ad").removeClass("active");
			$("#tr_"+mc_uc).addClass("active");
			$("#p").val('up');		//up으로 바꾸며 update form으로 설정
			d_mc_uc = mc_uc;	//고유 코드 설정
			$("#p_mc_uc").val(mc_uc);
			if(res.useyn === 'Y'){
				$('#use01').prop('checked', true);
			}else if(res.useyn === 'N'){
				$('#use02').prop('checked', true);
			}
			$("#mc_gb").val(res.mc_gb);			//설비유형
			$("#mc_no").val(res.mc_no);			//우선순위
			$("#mc_nm").val(res.mc_nm);			//설비명
			$("#maker").val(res.maker);			//메이커명
			$("#model_nm").val(res.model_nm);	//모델명
			$("#spec").val(res.spec);			//규격
			$("#buy_corp").val(res.buy_corp);	//구매처
			$("#buy_dt").val(res.buy_dt);		//구매일자
			$("#amt").val(amt);	//구매금액
			$("#memo").val(res.memo);			//비고
		}).fail(fnc_ajax_fail);
}
