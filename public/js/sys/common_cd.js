/*================================================================================
 * @name: 황호진 - common_cd.js
 * @version: 1.0.0, @date: 2021-09-08
 ================================================================================*/
var ikey = '';		//ikey 전역변수
var cm = undefined;	//code_main 전역변수(입력폼 메인코드 리스트 불러올시 'cm'값이 존재하면 설정)
$(function(){

	var data = { 's' : null };	//검색데이터 null 값
	get_main_category(data);	//분류리스트 호출

	get_code_gb();				//분류코드 설정

	//검색버튼 연동
	$("#search_btn").off().click(function () {
		$("input[name='s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
		var data = $("#frm").serialize();	//form 데이터
		get_main_category(data);			//분류리스트 호출
		form_reset('r');
	});

	//검색어 입력후 엔터칠때 실행
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
			var data = $("#frm").serialize();	//form 데이터
			get_main_category(data);			//분류리스트 호출
			form_reset('r');
		}
	});

	$("#code_gb").on("input", function () {		//입력폼 분류코드의 값이 바뀌면 발생하는 이벤트
		get_code_main($(this).val(),set_code_main);	//입력폼 메인코드 변경하기 위한 함수
	});

	$(document).on('click', '.switch', function () {	//클래스가 스위치인 태그 클릭이벤트
		var sysyn = $(this).attr('data-sysyn');	//시스템YN
		var useyn = $(this).attr('data-useyn');	//사용YN
		var id =$(this).attr('id');				//id 속성값
		var n = id.replace('switch','');			//ikey 추출

		// if(sysyn === 'Y' && useyn === 'Y'){	//가용여부 Y AND 시스템 Y
		// 	return toast("사용 중 공통코드인 경우 가용 여부 off 불가합니다.", true, 'danger');
		// }

		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con) {
			useyn_change(n, sysyn, useyn);				//사용여부 변경 함수
		}
	});

	$("#reset_btn").off().click(function () {		//리셋버튼
		var con = confirm('초기화하시겠습니까?');
		if(con){
			form_reset('r');
			cm = undefined;		//code_main 초기화
			ikey = '';			//ikey 초기화
		}
	});

	$("input[type='checkbox']").change(function () {	//화면단의 가용여부 및 코드구분 체크박스 change이벤트
		if($(this).is(":checked")){
			$(this).val("Y");
		}else{
			$(this).val("N");
		}
	});

	$("#add_btn, #mod_btn , #del_btn").off().click(function () {	//등록,수정,삭제 버튼 클릭 이벤트
		var id = $(this).attr('id');
		var con = '';

		switch(id){
			case 'add_btn': case 'mod_btn':
				if(input_check()){
					if(id === "add_btn"){
						con = confirm("등록하시겠습니까?");
					} else if(id === "mod_btn") {
						con = confirm("수정하시겠습니까?");
					}
				}
				if(con){
					iu();
				}
				break;
			case 'del_btn':
				con = confirm("삭제하시겠습니까?");
				if(con) {
					d();
				}
				break;
		}
	});

	$("#myTable").tablesorter({	//테이블 정렬
		theme : 'blue',
		headers: {
			// disable sorting of the first & second column - before we would have to had made two entries
			// note that "first-name" is a class on the span INSIDE the first column th cell
			'.sorter-false' : {
				// disable it by setting the property sorter to false
				sorter: false
			}
		}
	});

});

/**
 * @description 화면 로드 , 검색 , 분류리스트 데이터 설정
 * data = BA , PR , AC , HR 등
 */
function get_main_category(data) {
	var url = '/base/common_cd/get_main_category';
	var type = 'GET';
	fnc_ajax(url,type,data)
		.done(function (res) {
			var li = res.data.list;		//리스트
			var cnt = res.data.count;	//리스트 총 개수
			var str = '';
			var arr = [];
			if(cnt > 0){
				$.each(li, function (i, list) {
					str += '<tr class="at" id="main_'+list.code_nm+'">';
					str += '<td>' + list.no + '</td>';
					str += '<td class="tb_click" onclick=get_sub_category("'+list.code_nm+'","r")>' + list.code_gb + '</td>';
					str += '<td class="tb_click" onclick=get_sub_category("'+list.code_nm+'","r")>' + list.code_main + '</td>';
					str += '<td class="tb_click" onclick=get_sub_category("'+list.code_nm+'","r")>' + list.code_sub + '</td>';
					str += '<td class="T-left tb_click" onclick=get_sub_category("'+list.code_nm+'","r")>' + list.code_nm + '</td>';
					str += '<td>' +
						'<label class="switch" id="switch'+ list.ikey +'" data-sysyn="'+list.sysyn+'" data-useyn="'+list.useyn+'" style="cursor: pointer;">' +
						'<input type="checkbox" id="useyn'+ list.ikey +'" disabled>' +
						'<span class="slider round"></span>' +
						'<span class="offtxt">off</span>' +
						'<span class="ontxt">on</span>' +
						'</label>' +
						'</td>';
					str += '<td class="T-left">' + list.descrip + '</td>';
					if(list.sysyn == 'Y'){
						str += '<td class="red">삭제불가</td>';
					}else{
						str += '<td>삭제가능</td>';
					}
					str += '</tr>';
					if(list.useyn == 'Y'){
						arr.push("useyn"+ list.ikey);
					}
				});
			}else{
				str += "<tr><td colspan='8'>조회 가능한 데이터가 없습니다.</td></tr>"
			}
			$("#main_category_list").html(str);
			$("#main_category_count").html(cnt);

			for(var i = 0; i < arr.length; i++){
				$('#'+arr[i]).prop('checked', true);
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 분류리스트에서 클릭한 데이터 소속 코드 리스트에 설정
 * code_nm = 코드명(BA,PR,AC 등)
 * gb = 구분값 
 * 	'r' 일 경우 cm 과 ikey 초기화(분류리스트 클릭시)
 * 	'u' 일 경우 cm 과 ikey는 유지(수정했을때 경우)
 */
function get_sub_category(code_nm , gb) {
	if(gb === 'r'){
		form_reset('r');	// 입력폼 초기화
		cm = undefined;			// code_main 초기화
		ikey = '';				// ikey 초기화
	}
	var url = '/base/common_cd/get_sub_category';
	var type = 'GET';
	var data = {
		"code_gb" : code_nm
	};
	fnc_ajax(url, type, data)
		.done(function (res) {
			$(".at").removeClass('active');
			$("#main_"+code_nm).addClass('active');
			var li = res.data.list;
			var cnt = res.data.count;
			var str = '';
			var arr = [];
			if(cnt > 0){
				$.each(li, function (i, list) {
					str += '<tr class="ad" id="sub_'+list.ikey+'">';
					str += '<td class="tb_click" onclick=get_detail("'+list.ikey+'")>' + list.code_gb + '</td>';
					str += '<td class="tb_click" onclick=get_detail("'+list.ikey+'")>' + list.code_main + '</td>';
					str += '<td class="tb_click" onclick=get_detail("'+list.ikey+'")>' + list.code_sub + '</td>';
					str += '<td class="T-left tb_click" onclick=get_detail("'+list.ikey+'")>' + list.code_nm + '</td>';
					str += '<td>' +
						'<label class="switch" id="switch'+ list.ikey +'" data-sysyn="'+list.sysyn+'" data-useyn="'+list.useyn+'" style="cursor: pointer;">' +
						'<input type="checkbox" id="useyn'+ list.ikey +'" disabled>' +
						'<span class="slider round"></span>' +
						'<span class="offtxt">off</span>' +
						'<span class="ontxt">on</span>' +
						'</label>' +
						'</td>';
					str += '<td class="T-left" style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis">' + list.descrip + '</td>';
					str += '<td style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis">' + list.code_ref + '</td>';
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
						arr.push("useyn"+ list.ikey);
					}
				});

			}else{
				str += "<tr><td colspan='13'>조회 가능한 데이터가 없습니다.</td></tr>"
			}
			$("#sub_category_list").html(str);
			$("#sub_category_count").html(cnt);
			for(var i = 0; i < arr.length; i++){
				$('#'+arr[i]).prop('checked', true);
			}
			$("#myTable").trigger("update");
			// 수정 후 분류리스트 내역을 클릭했을 때 경우
			if(ikey !== ''){
				$(".ad").removeClass('active');
				$("#sub_"+ikey).addClass('active');
				get_detail(ikey);	//입력폼 데이터 호출
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 가용여부 수정 함수
 * id = ikey
 * sysyn = 코드구분(시스템YN)
 * useyn = 가용여부(사용YN)
 */
function useyn_change(id,sysyn,useyn) {
	var url = '/base/common_cd/useyn_change';
	var type = 'POST';
	var data = {
		'ikey' : id
	};
	fnc_ajax(url , type , data)	//ajax 공용 함수
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if($("#useyn"+id).is(":checked") === true){
					$("#useyn"+id).prop('checked', false);	//checked => false
					$("#switch"+id).attr("data-useyn","N");
					if(id === ikey) $("#useyn").val("N").prop("checked",false);
				}else{
					$("#useyn"+id).prop('checked', true);	//checked => true
					$("#switch"+id).attr("data-useyn","Y");
					if(id === ikey) $("#useyn").val("Y").prop("checked",true);
					//sysyn = 'Y' useyn = 'N' 이고
					//가져온 id와 입력폼의 ik가 같을때 밑에와 같은 알고리즘 태우기
					if(sysyn === 'Y' && id === ikey){
						$("#useyn").prop("disabled",true);
						$("#useyn_box").addClass('disable');
					}
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);	//ajax fail 공용 함수
}

/**
 * @description 소속 코드 리스트 클릭시 상세 데이터 입력폼에 기입 함수
 * ik = ikey
 */
function get_detail(ik) {
	var url = '/base/common_cd/get_detail';
	var type = 'GET';
	var data = {
		'ikey' : ik
	};
	fnc_ajax(url , type , data)	//ajax 공용 함수
		.done(function (res) {
			$(".ad").removeClass('active');
			$("#sub_"+ik).addClass('active');
			$("#add_btn").hide();	//등록버튼 활성화
			$("#mod_btn").show();	//수정버튼 비활성화
			
			//받아온 code_main_list 리스트 데이터를 입력폼 메인코드에 설정
			set_code_main(res.code_main_list);
			
			$("#p").val('up'); //up모드 설정
			$("#ikey").val(res.data.ikey); //ikey 설정
			ikey = res.data.ikey;	//전역변수에 값 넣기

			$("#useyn").prop("disabled",false);	//useyn 우선은 활성화시킴
			$("#useyn_box").removeClass('disable');

			if(res.data.useyn === 'Y') $("#useyn").val("Y").prop("checked",true);
			else if(res.data.useyn === 'N') $("#useyn").val("N").prop("checked",false);

			if(res.data.sysyn === 'Y'){	//sysyn이 'Y'일때
				$("#del_btn").hide();	//삭제버튼 비활성화
				$("#sysyn").val("Y").prop("checked",true).prop("disabled",true);	//코드구분(시스템코드) 비활성화
				$("#sysyn_box").addClass('disable');

				if(res.data.useyn === 'Y'){	//시스템코드가 'Y' 에서 useyn이 'Y'일때
					$("#useyn").prop("disabled",true);	//가용여부 비활성화
					$("#useyn_box").addClass('disable');
				}

			} else if(res.data.sysyn === 'N'){	//sysyn가 'N' 일때
				$("#del_btn").show();	//삭제버튼 활성화
				$("#sysyn").val("N").prop("checked",false).prop("disabled",false);	//코드구분(시스템코드) 활성화
				$("#sysyn_box").removeClass('disable');
			}

			$("#code_gb").val(res.data.code_gb).addClass("gray").prop("disabled",true);		//수정모드는 비활성화하여 수정을 금지한다.
			$("#code_main").val(res.data.code_main).addClass("gray").prop("disabled",true);	//수정모드는 비활성화하여 수정을 금지한다.

			$("#code_nm").val(res.data.code_nm);
			$("#descrip").val(res.data.descrip);
			$("#code_ref").val(res.data.code_ref);
			$("#memo").val(res.data.memo);
		}).fail(fnc_ajax_fail);
}

/**
 * @description 입력폼 분류코드 AJAX
 */
function get_code_gb() {
	var url = '/base/common_cd/get_code_gb';
	var type = 'GET';
	var data = {};
	fnc_ajax(url , type , data)	//ajax 공용 함수
		.done(function (res) {
			set_code_gb(res.data);
		}).fail(fnc_ajax_fail);
}

/**
 * @description 입력폼 분류코드 리스트 설정
 * data = 기초(BA) , 생산(PR) , 회계(AC) 리스트 목록
 */
function set_code_gb(data) {
	var str = '';
	$.each(data, function (i, list) {
		str += '<option value="'+list.code_nm+'">'+list.descrip+'</option>';
	});
	$("#code_gb").html(str).trigger('input');	//값 설정후 트리거 작용
}

/**
 * @description 입력폼 메인코드 AJAX(분류코드 값이 바뀜에 따라 이벤트 발생)
 * code_gb = BA , PR , AC 등
 * callback = set_code_main(); 함수
 */
function get_code_main(code_gb , callback) {
	var url = '/base/common_cd/get_code_main';
	var type = 'GET';
	var data = {
		'code_gb' : code_gb
	};
	fnc_ajax(url , type , data)	//ajax 공용 함수
		.done(function (res) {
			callback(res.data);
		}).fail(fnc_ajax_fail);
}

/**
 * @description 입력폼 메인코드 리스트 설정
 */
function set_code_main(data) {
	var str = '';
	$.each(data, function (i, list) {
		str += '<option value="'+list.code_main+'">'+list.code_main+'</option>';
	});
	str += '<option value="">메인코드_추가</option>';
	$("#code_main").html(str);
	//seleted 화 시키기
	if(cm !== undefined){	//code_master의 값이 존재할때
		$("#code_main").val(cm);
	}
}

/**
 * @description 입력폼 조건별 초기화
 * type = 'i' insert 경우 리셋
 * type = 'r' 완전 초기화
 * 전역변수 ikey , cm 초기화는 따로 분리해둠
 */
function form_reset(type) {
	$("#add_btn").show();	//등록버튼 활성화
	$("#mod_btn").hide();	//수정버튼 비활성화
	$("#del_btn").hide();	//삭제버튼 비활성화
	$("#p").val('in');		//in 등록폼 설정
	$("#ikey").val('');		//ikey 초기화
	$("#useyn").prop("disabled",false);	//활성화
	$("#sysyn").prop("disabled",false);	//활성화
	$("#code_gb").removeClass("gray").prop("disabled",false);	//gray 클래스 제거후 활성화
	$("#code_main").removeClass("gray").prop("disabled",false);	//gray 클래스 제거후 활성화
	$("#useyn_box").removeClass('disable');
	$("#sysyn_box").removeClass('disable');
	if(type === 'r'){	//type = 'r' 일 경우
		$("#useyn").val('Y').prop("checked",true);	//초기값 셋팅
		$("#sysyn").val('N').prop("checked",false);	//초기값 셋팅
		get_code_gb();	//입력폼 분류코드 재설정
	}
	$("#code_nm").val('');
	$("#descrip").val('');
	$("#code_ref").val('');
	$("#memo").val('');
}

/**
 * @description 코드명 검사 함수
 */
function input_check(){
	if($('#code_nm').val() == ""){
		toast('코드명을 입력하세요.', true, 'danger');
		$('#code_nm').focus();
		return false;
	}
	return true;
}

/**
 * @description insert update
 */
function iu() {
	var p = $("#p").val();

	$("#ikey").val(ikey);

	var url = '/base/common_cd/iu';
	var type = 'POST';
	var data = {
		'p' : p,
		'ikey' : ikey,
		'useyn' : $("#useyn").val(),
		'sysyn' : $("#sysyn").val(),
		'code_gb' : $("#code_gb").val(),
		'code_main' : $("#code_main").val(),
		'code_nm' : $("#code_nm").val(),
		'descrip' : $("#descrip").val(),
		'code_ref' : $("#code_ref").val(),
		'memo' : $("#memo").val(),
	};

	var s = $("input[name='s']").val();
	var search_data;

	fnc_ajax(url, type, data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if(p === 'in'){
					cm = res.code_main;	//입력폼 메인코드값 유지하기 위한 전역변수 설정
					get_code_main($("#code_gb").val(),set_code_main);	//입력폼 메인코드 재설정

					form_reset('i');	//입력폼 초기화 type = 'i' 일때는 가용여부,코드구분,분류코드,메인코드를 제외하여 초기화

					if(s === 't'){	//검색여부에 따라 분류리스트 불러오는 곳
						search_data = $("#frm").serialize();	//form 데이터
						get_main_category(search_data);	//분류리스트 호출
					}else{
						search_data = { 's' : null };
						get_main_category(search_data);	//분류리스트 호출
					}
					//소속 코드 리스트 초기화
					var str = "<tr><td colspan='13'>조회 가능한 데이터가 없습니다.</td></tr>";
					$("#sub_category_list").html(str);	//소속 코드리스트 덮어씌우기
					$("#sub_category_count").html(0);	//소속 코드리스트 총 검색 수 0건 설정
				}else{
					//소속 코드 리스트 호출
					//gb = 'u'일때 cm 과 ikey는 유지하여 폼을 리셋함
					get_sub_category($("#code_gb").val() , 'u');
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description delete
 */
function d() {
	$("#ikey").val(ikey);

	var code_gb = $("#code_gb").val();

	var url = '/base/common_cd/d';
	var type = 'POST';
	var data = {
		'ikey' : ikey
	};

	fnc_ajax(url, type, data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				//삭제후 ikey , cm 초기화
				ikey = '';
				cm = undefined;
				//입력폼 초기화
				form_reset('r');
				//소속코드리스트 재로드(code_nm) : BA 등과 같은 정보 필요
				get_sub_category(code_gb,'r');
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
