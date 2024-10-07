/*================================================================================
 * @name: 황호진 - template.js
 * @version: 1.0.0, @date: 2021-10-12
================================================================================*/
var g_te_uc = '';
$(function () {
	//화면 로드될때 불러올 함수
	//================================================================================
	get_list({'s' : null});
	//================================================================================
	
	//이벤트 연동
	//================================================================================
	/**
	 * @description 검색버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/12
	 */
	$("#search_btn").off().click(function () {
		$("input[name='s']").val('t');
		var search_data = $("#frm").serialize();
		get_list(search_data);
		form_reset('r');
	});
	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/12
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='s']").val('t');
			var search_data = $("#frm").serialize();
			get_list(search_data);
			form_reset('r');
		}
	});

	/**
	 * @description 탬플릿 리스트의 가용여부 변경 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/12
	 */
	$(document).on('click', '.switch', function () {	//클래스가 스위치인 태그 클릭이벤트
		var sysyn = $(this).attr('data-sysyn');		//시스템YN
		var useyn = $(this).attr('data-useyn');		//사용YN
		var id =$(this).attr('id');					//id 속성값
		var te_uc = id.replace('switch_','');			//ikey 추출

		if(sysyn === 'Y' && useyn === 'Y'){	//가용여부 Y AND 시스템 Y
			return toast("사용 중 템플릿인 경우 가용 여부 off 불가합니다.", true, 'danger');
		}

		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con) {
			useyn_change(te_uc, sysyn, useyn);				//사용여부 변경 함수
		}
	});

	/**
	 * @description 초기화버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/12
	 */
	$("#reset_btn").off().click(function () {		//리셋버튼
		var con = confirm('초기화하시겠습니까?');
		if(con){
			form_reset('r');
		}
	});

	/**
	 * @description 입력폼 등록,수정,삭제 버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/12
	 */
	$("#add_btn, #mod_btn , #del_btn").off().click(function () {	//등록,수정,삭제 버튼 클릭 이벤트
		var id = $(this).attr('id');
		var con = '';

		switch(id){
			case 'add_btn': case 'mod_btn':
				if(input_check()){	//필수입력값 체크
					if(id === "add_btn"){
						con = confirm("등록 하시겠습니까?");
					} else if(id === "mod_btn") {
						con = confirm("수정 하시겠습니까?");
					}
				}
				if(con){
					iu();
				}
				break;
			case 'del_btn':
				con = confirm("삭제 하시겠습니까?");
				if(con) {
					d();
				}
				break;
		}
	});

	/**
	 * @description 입력폼의 가용여부,코드구분 체크박스 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/12
	 */
	$("input[type='checkbox']").change(function () {
		if($(this).is(":checked")){
			$(this).val("Y");
		}else{
			$(this).val("N");
		}
	});

	/**
	 * @description 입력폼의 기본단위 이벤트 연동
	 * @author 황호진  @version 2.0, @last_update 2022-01-18
	 */
	$('#te_unit').on('change' , function () {
		var unit = $(this).val();	//선택된 단위의 값
		if(unit !== ""){	//선택된 단위의 값이 ""이 아닐때!
			var unit_nm = $('#te_unit option:checked').attr('data-name');	//단위명 가져오기
			var str = '<span class="te_unit_list" data-code="'+unit+'">'+unit_nm+' <i class="fa fa-times" onclick=unit_delete("'+unit+'")></i></span>';
			var len = $('.te_unit_list').length;	//선택되어있는 값 불러오기
			var flag = true;	//추가하기 위한 플래그
			for(var i = 0; i < len; i++){
				var code = $('.te_unit_list').eq(i).attr('data-code');
				if(code === unit){	//겹치는 값이 있다면은...
					flag = false;	//추가가 안되도록 플래그 false 값 처리
					break;
				}	//if end
			}	//for end
			if(flag){
				//기본단위 하단에 값추가
				$('#unit_list').append(str);
			}	//if end

			//기본단위 초기화
			$('#te_unit').val('');
		}	//if end
	});


	//================================================================================
});

/**
 * @description get_list 함수 템플릿리스트를 가져옴
 * @author 황호진  @version 2.0,  @last_update 2022-01-18
 * data = 검색창의 데이터
 */
function get_list(data) {
	$("#myTable").tablesorter({theme : 'blue'});	//테이블 정렬 기능
	var url = '/base/template/get_list';
	var type = 'get';
	fnc_ajax(url , type , data)
		.done(function (res) {
			var len = res.data.length;
			$("#list_cnt").html(len);	//총 검색 수 설정
			var str = '';
			if(len > 0){
				var arr = [];
				$.each(res.data, function (i, list) {
					str += '<tr class="ad" id="tr_'+ list.te_uc +'">';
					str += '<td>' + list.te_no + '</td>';
					str += '<td class="tb_click Elli T-center" onclick=get_detail("'+ list.te_uc +'")>' + list.te_cd + '</td>';
					str += '<td class="tb_click Elli" onclick=get_detail("'+ list.te_uc +'")>' + list.te_gb + '</td>';
					str += '<td class="tb_click Elli T-left" onclick=get_detail("'+ list.te_uc +'")>' + list.te_nm + '</td>';
					str += '<td class="tb_click" onclick=get_detail("'+ list.te_uc +'")>' + list.te_unit + '</td>';
					str += '<td>' +
						'<label class="switch" id="switch_'+ list.te_uc +'" data-sysyn="'+list.sysyn+'" data-useyn="'+list.useyn+'" style="cursor: pointer;">' +
						'<input type="checkbox" id="useyn_'+ list.te_uc +'" disabled>' +
						'<span class="slider round"></span>' +
						'<span class="offtxt">off</span>' +
						'<span class="ontxt">on</span>' +
						'</label>' +
						'</td>';
					str += '<td class="T-left Elli">' + list.memo + '</td>';
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
					if(list.useyn == 'Y'){	//가용여부 체크를 위한 선행작업
						arr.push("useyn_"+list.te_uc);
					}
				});
				$("#data-container").html(str); // ajax data output

				for(var i = 0; i < len; i++){	//가용여부 체크
					$('#'+arr[i]).prop('checked', true);
				}
				
				//수정했을때 리스트에서 해당하는 행의 데이터에 active 클래스 부여
				var p = $("#p").val();
				if(p === 'up') {
					$(".ad").removeClass("active");
					$("#tr_" + g_te_uc).addClass("active");
				}

				$("#myTable").trigger("update");
			}else{
				var v = padding_left_val('myTable');
				str += "<tr>";
				str += "<td colspan='12' style='text-align: left; padding-left: "+v+"px'>조회 가능한 데이터가 없습니다.</td>";
				str += "</tr>";
				$("#data-container").html(str); // ajax data output
			}

		}).fail(fnc_ajax_fail);
}

/**
 * @description 조회가능한 데이터 없을 경우 해상도에 따른 설정할 padding값 가져오기
 * @author 황호진  @version 1.0, @last update 2021/10/12
 */
function padding_left_val(id) {
	var screen_width = screen.availWidth;	//실제 사용중인 모니터 길이
	var id_width = document.getElementById(id).clientWidth;	//지정한 id의 길이
	var result;
	if(screen_width === 2560){	//해상도 2560*1440
		result = id_width/2;
	}else if(screen_width === 1920){	//해상도 1920*1080
		result = id_width/3;
	}else if(screen_width === 1440){	//해상도 1440*900
		result = id_width/5;
	}else{	//그이외에...
		result = id_width/3;
	}
	return result;
}
/**
 * @description 템플릿리스트에서 선택한 데이터의 상세내용
 * @author 황호진  @version 2.0 , @last_update 2022-01-18
 * te_uc = 템플릿 고유코드
 */
function get_detail(te_uc) {
	var url = '/base/template/get_detail';
	var type = 'GET';
	var data = {
		'te_uc' : te_uc
	};
	fnc_ajax(url, type, data)
		.done(function (res) {
			$(".ad").removeClass('active');
			$("#tr_"+te_uc).addClass('active');

			$("#add_btn").hide();
			$("#mod_btn").show();

			$("#useyn").prop("disabled",false);
			$("#useyn_box").removeClass('disable');

			if(res.data.useyn === 'Y') $("#useyn").val(res.data.useyn).prop("checked",true);
			else if(res.data.useyn === 'N') $("#useyn").val(res.data.useyn).prop("checked",false);

			if(res.data.sysyn === 'Y'){			//시스템YN이 Y일 경우
				$("#del_btn").hide();
				$("#sysyn").val(res.data.sysyn).prop('checked' , true).prop('disabled' , true);
				$("#sysyn_box").addClass('disable');
				if(res.data.useyn === 'Y'){		//거기에다가 가용여부까지 Y일 경우
					$("#useyn").prop('disabled' , true);
					$("#useyn_box").addClass('disable');
				}
			}else if(res.data.sysyn === 'N'){	//시스템YN이 N일 경우
				$("#del_btn").show();
				$("#sysyn").val(res.data.sysyn).prop('checked' , false).prop('disabled' , false);
				$("#sysyn_box").removeClass('disable');
			}
			$("#p").val('up');
			$("#p_te_uc").val(te_uc);
			g_te_uc = te_uc;
			//템플릿유형
			$("#te_gb").val(res.data.te_gb);
			//템플릿이름
			$("#te_nm").val(res.data.te_nm);

			//기본단위 설정
			$('.te_unit_list').remove();	//값 초기화
			for(var i = 0; i < res.unit.length; i++){
				var str = '<span class="te_unit_list" data-code="'+res.unit[i]['code_sub']+'">'+res.unit[i]['code_nm']+' <i class="fa fa-times" onclick=unit_delete("'+res.unit[i]['code_sub']+'")></i></span>';
				$('#unit_list').append(str);
			}	//for end
			
			//메모
			$("#memo").val(res.data.memo);
		}).fail(fnc_ajax_fail);
}

/**
 * @description 리스트에서 가용여부 클릭시 발생 함수
 * @author 황호진  @version 1.0, @last update 2021/10/12
 * id = 템플릿 고유코드
 * sysyn = 시스템YN
 * useyn = 가용여부YN
 */
function useyn_change(id , sysyn , useyn) {
	var url = '/base/template/useyn_change';
	var type = 'POST';
	var data = {
		'te_uc' : id
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if($("#useyn_"+id).is(":checked") === true){
					$("#useyn_"+id).prop('checked', false);
					$("#switch_"+id).attr("data-useyn","N");

					if(id === g_te_uc) $("#useyn").val("N").prop("checked",false);
				}else{
					$("#useyn_"+id).prop('checked', true);
					$("#switch_"+id).attr("data-useyn","Y");

					if(id === g_te_uc) $("#useyn").val("Y").prop("checked",true);

					//sysyn이 'Y' 이고 입력폼의 te_uc와 변경한 리스트의 te_uc가 같을때
					if(sysyn === 'Y' && id === g_te_uc){
						$("#useyn").prop("disabled",true);
						$("#useyn_box").addClass('disable');
					}
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 리스트에서 가용여부 클릭시 발생 함수
 * @author 황호진  @version 2.0, @last_update 2022-01-18
 * type = 'r' or 'i'
 * r => 전체 초기화
 * i => 등록시 필수입력 ComboBox를 제외한 초기화
 */
function form_reset(type) {
	$(".ad").removeClass('active');
	$("#add_btn").show();
	$("#mod_btn").hide();
	$("#del_btn").hide();
	$("#p").val('in');
	$("#p_te_uc").val("");
	g_te_uc = "";
	$("#useyn").prop("disabled",false);
	$("#sysyn").prop("disabled",false);
	$("#useyn_box").removeClass('disable');
	$("#sysyn_box").removeClass('disable');
	$("#te_nm").val('');
	$("#memo").val('');

	//선택된 기본 단위 삭제
	$('.te_unit_list').remove();
	$("#te_unit option:eq(0)").prop("selected", true);

	if(type === 'r'){
		$("#te_gb option:eq(0)").prop("selected", true);
		$("#useyn").val("Y").prop("checked",true);
		$("#sysyn").val("N").prop("checked",false);
	}
}

/**
 * @description 필수입력값 검사
 * @author 황호진  @version 1.0, @last update 2021/10/12
 */
function input_check() {
	if($("#te_nm").val() == ""){
		toast('템플릿 명을 입력해주세요!', true, 'danger');
		$("#te_nm").focus();
		return false;
	}
	if($('.te_unit_list').length < 1){
		toast('기본단위를 선택해주세요!', true, 'danger');
		return false;
	}
	return true;
}

/**
 * @description insert update
 * @author 황호진  @version 1.0, @last update 2021/10/12
 */
function iu() {
	var p = $("#p").val();

	var te_unit = '';
	//길이 불러오기
	var len = $('.te_unit_list').length;
	for(var i = 0; i < len; i++){
		var code = $('.te_unit_list').eq(i).attr('data-code');
		if(i === 0){
			te_unit += code;
		}else{
			te_unit += ','+code;
		}
	}// for end

	$("#p_te_uc").val(g_te_uc);
	var url = '/base/template/iu';
	var type = 'POST';
	var data = {
		'p'				:	p,
		'te_uc'			:	$('#p_te_uc').val(),
		'main_cd'		:	$('#main_cd').val(),
		'useyn'			:	$('#useyn').val(),
		'sysyn'			:	$('#sysyn').val(),
		'te_gb'			:	$('#te_gb').val(),
		'te_nm'			:	$('#te_nm').val(),
		'te_unit'		:	te_unit,
		'memo'			:	$('#memo').val(),
	};

	var s = $("input[name='s']").val();
	var search_data;

	fnc_ajax(url , type, data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if(p === 'in'){
					$('#frm')[0].reset();
					get_list({'s' : null});
					form_reset('i');
				}else{
					//리스트 재호출
					if(s === 't'){	//검색조건이 있는지 확인
						search_data = $("#frm").serialize();
						get_list(search_data);
					}else{
						search_data = {'s':null};
						get_list(search_data);
					}
					get_detail(g_te_uc);
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description delete
 * @author 황호진  @version 1.0, @last update 2021/10/12
 */
function d() {
	var url = '/base/template/d';
	var type = 'post';
	var data = {
		te_uc : $("#p_te_uc").val()
	};
	var s = $("input[name='s']").val();
	var search_data;
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				//리스트 재호출
				if(s === 't'){	//검색조건이 있는지 확인
					search_data = $("#frm").serialize();
					get_list(search_data);
				}else{
					search_data = {'s':null};
					get_list(search_data);
				}
				form_reset('r');
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description te_unit_list 화면에서 제거
 * @author 황호진  @version 1.0, @last update 2022/01/18
 */
function unit_delete(unit) {
	//길이 불러오기
	var len = $('.te_unit_list').length;
	for(var i = 0; i < len; i++){
		var code = $('.te_unit_list').eq(i).attr('data-code');
		if(code === unit){	//겹치는 값이 있다면
			$('.te_unit_list').eq(i).remove();	//삭제
			break;
		}// if end
	}// for end
}
