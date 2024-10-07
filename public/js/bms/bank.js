/*================================================================================
 * @name: 황호진 - bank.js	은행계좌 등록 화면
 * @version: 1.0.0, @date: 2021-09-30
 ================================================================================*/
var g_bl_uc = '';
var page_num = 1;
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var search_data = { 's' : null };
	get_list(search_data,'select');
	//================================================================================

	//이벤트 연동!
	//================================================================================

	/**
	 * @description 검색버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/30
	 */
	$("#search_btn").off().click(function () {
		$("input[name='s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data,'select');			//분류리스트 호출
		form_reset();
	});
	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/30
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data,'select');			//분류리스트 호출
			form_reset();
		}
	});

	/**
	 * @description 은행계좌리스트 가용여부 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/30
	 */
	$(document).on('click','.switch', function () {
		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con){
			var id = $(this).attr("id");
			var bl_uc = id.replace('switch_','');	//item_cd값 추출
			useyn_change(bl_uc);					//id
		}
	});

	/**
	 * @description 입력폼 reset 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/30
	 */
	$("#reset_btn").off().click(function () {		//리셋버튼
		var con = confirm('입력을 초기화 하시겠습니까?');
		if(con){
			form_reset();	//입력폼 초기화
		}
	});

	/**
	 * @description 입력폼 등록,수정,삭제 버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/30
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
	$("#bl_num").on("input", function() {$(this).val( $(this).val().replace(/[^0-9-]/gi,"") );});
	//================================================================================
});

/**
 * @description get_list 함수 은행계좌를 가져옴
 * @author 황호진  @version 1.0, @last update 2021/09/30
 * data = 검색창의 데이터
 */
function get_list(data , state) {
	$("#myTable").tablesorter({theme : 'blue'});	//테이블 정렬 기능
	var container = $('#pagination');	//pagination
	var url = '/base/bank/get_list';
	var type = 'get';
	var p = $("#p").val();
	if(p === 'in' || state === 'select' || state === 'delete'){
		page_num = 1;
	}
	fnc_ajax(url , type , data)
		.done(function (res) {
			$("#list_cnt").html(res.data.count);	//총 검색 수 설정
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
						$.each(res, function (i, list) {
							str += '<tr class="ad" id="tr_'+ list.bl_uc +'">';
							str += '<td>' + list.bl_no + '</td>';
							str += '<td class="tb_click Elli" onclick=get_detail("'+ list.bl_uc +'")>' + list.bl_cd + '</td>';
							str += '<td class="tb_click Elli T-left" onclick=get_detail("'+ list.bl_uc +'")>' + list.holder_nm + '</td>';
							str += '<td class="tb_click Elli" onclick=get_detail("'+ list.bl_uc +'")>' + list.bl_nm + '</td>';
							str += '<td class="tb_click Elli T-left" onclick=get_detail("'+ list.bl_uc +'")>' + list.bl_num + '</td>';
							str += '<td class="tb_click Elli" onclick=get_detail("'+ list.bl_uc +'")>' + list.off_nm + '</td>';
							str += '<td class="tb_click Elli" onclick=get_detail("'+ list.bl_uc +'")>' + list.bl_gb + '</td>';
							str += '<td>' +
									'<label class="switch" id="switch_'+ list.bl_uc +'" style="cursor: pointer;">' +
									'<input type="checkbox" id="useyn_'+ list.bl_uc +'" disabled>' +
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
								arr.push("useyn_"+list.bl_uc);
							}
						});
						$("#data-container").html(str); // ajax data output

						for(var i = 0; i < len; i++){	//가용여부 체크
							$('#'+arr[i]).prop('checked', true);
						}

						if(p === 'up') {	//update 입력폼일때 어느 데이터행을 선택했는지 설정
							$(".ad").removeClass("active");
							$("#tr_" + g_bl_uc).addClass("active");
						}

						$("#myTable").trigger("update");
					}else{	// TODO : 조회가능한 데이터가 없을때 CSS 조절할 것
						var v = padding_left_val('myTable');
						str += "<tr>";
						str += "<td colspan='14' style='text-align: left; padding-left: "+v+"px'>조회 가능한 데이터가 없습니다.</td>";
						//str += "<td colspan='5'></td>";
						str += "</tr>";
						$("#data-container").html(str); // ajax data output
					}

					$('#pagination').addHook('afterRender', function() {
						page_num = $("li.paginationjs-page.J-paginationjs-page.active").attr('data-num');
					});

				}
			}) // page end

		}).fail(fnc_ajax_fail);
}

/**
 * @description 조회가능한 데이터 없을 경우 해상도에 따른 설정할 padding값 가져오기
 * @author 황호진  @version 1.0, @last update 2021/10/01
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
 * @description 은행계좌에서 선택한 데이터의 상세내용
 * @author 황호진  @version 1.0, @last update 2021/09/30
 * bl_uc = 은행계좌 고유코드
 */
function get_detail(bl_uc) {
	var url = '/base/bank/get_detail';
	var type = 'GET';
	var data = {
		'bl_uc' : bl_uc
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			$(".ad").removeClass('active');			//ad 클래스가 달린 모든 태그에서 actice 클래스 제거
			$("#tr_"+bl_uc).addClass('active');		//선택한 데이터 행에 actice 클래스 부여
			$("#add_btn").hide();	//등록버튼 비활성화
			$("#mod_btn").show();	//수정버튼 활성화

			if(res.sysyn === 'Y'){		//sysyn이 Y일때 삭제버튼이 보이면 안됨!
				$("#del_btn").hide();	//삭제버튼 비활성화
			}else if(res.sysyn === 'N'){
				$("#del_btn").show();	//삭제버튼 활성화
			}
			$("#p").val('up');			//입력폼 수정모드 up => update
			$("#p_bl_uc").val(bl_uc);	//가져온 bl_uc 값 설정
			g_bl_uc = bl_uc;			//전역변수에 설정

			//가용여부 설정
			if(res.useyn === 'Y') $("#use01").prop("checked",true);
			else if(res.useyn === 'N') $("#use02").prop("checked",true);

			//계좌유형
			$("#bl_gb").val(res.bl_gb);
			//정렬순서
			$("#bl_no").val(res.bl_no);
			//은행명
			$("#bl_nm").val(res.bl_nm);
			//예금주
			$("#holder_nm").val(res.holder_nm);
			//계좌번호
			$("#bl_num").val(res.bl_num);
			//지점명
			$("#off_nm").val(res.off_nm);
			//비고
			$("#memo").val(res.memo);

		}).fail(fnc_ajax_fail);
}

/**
 * @description 은행계좌리스트의 가용여부 변경 함수
 * @author 황호진  @version 1.0, @last update 2021/09/30
 * bl_uc = 은행계좌 고유코드
 */
function useyn_change(bl_uc) {
	var url = '/base/bank/useyn_change';
	var type = 'POST';
	var data = {
		'bl_uc' : bl_uc
	};
	fnc_ajax(url, type , data)
		.done(function (res) {
			if(res.result){
				if($("#useyn_"+bl_uc).is(":checked") === true){
					$("#useyn_"+bl_uc).prop('checked', false);	//checked => false

					if(bl_uc === g_bl_uc){
						$("#use02").prop("checked",true);	//사용불가
					}
					toast('가용여부 Off로 변경 완료되었습니다.', false, 'info');
				}else{
					$("#useyn_"+bl_uc).prop('checked', true);	//checked => true

					if(bl_uc === g_bl_uc){
						$("#use01").prop("checked",true);	//사용가능
					}
					toast('가용여부 On으로 변경 완료되었습니다.', false, 'info');
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 입력폼 초기화
 * @author 황호진  @version 1.0, @last update 2021/09/30
 */
function form_reset() {
	$("#add_btn").show();	//등록버튼 활성화
	$("#mod_btn").hide();	//수정버튼 비활성화
	$("#del_btn").hide();	//삭제버튼 비활성화
	$("#p").val('in');
	$("#p_bl_uc").val('');
	g_bl_uc = '';

	//가용여부 초기화
	$("#use01").prop("checked",true);
	//계좌유형 초기화
	$("#bl_gb option:eq(0)").prop("selected", true);
	//정렬순서 초기화
	$("#bl_no option:eq(0)").prop("selected", true);
	//은행명 초기화
	$("#bl_nm option:eq(0)").prop("selected", true);
	//예금주 초기화
	$("#holder_nm").val('');
	//계좌번호 초기화
	$("#bl_num").val('');
	//지점명 초기화
	$("#off_nm").val('');
	//비고 초기화
	$("#memo").val('');
}

/**
 * @description 입력폼 필수값 체크
 * @author 황호진  @version 1.0, @last update 2021/09/30
 */
function input_check() {
	if($('input[name=useyn]:checked').val() == ""){
		toast('가용여부 선택후 시도해주세요.', true, 'danger');
		return false;
	}
	if($('#bl_gb').val() == ""){
		toast('계좌유형을 선택해주세요.', true, 'danger');
		$('#bl_gb').focus();
		return false;
	}
	if($('#bl_no').val() == ""){
		toast('정렬순서를 선택해주세요.', true, 'danger');
		$('#bl_no').focus();
		return false;
	}
	if($('#bl_nm').val() == ""){
		toast('은행명을 선택해주세요.', true, 'danger');
		$('#bl_nm').focus();
		return false;
	}

	if($('#holder_nm').val() == ""){
		toast('예금주를 입력해주세요.', true, 'danger');
		$('#holder_nm').focus();
		return false;
	}

	if($('#bl_num').val() == ""){
		toast('계좌번호를 입력해주세요.', true, 'danger');
		$('#bl_num').focus();
		return false;
	}
	return true;
}

/**
 * @description insert update
 * @author 황호진  @version 1.0, @last update 2021/10/01
 */
function iu() {
	var p = $("#p").val();

	$("#p_bl_uc").val(g_bl_uc);
	var url = '/base/bank/iu';
	var type = 'POST';
	var data = {
		'p'				:	p,
		'p_bl_uc'		:	$('#p_bl_uc').val(),
		'main_cd'		:	$('#main_cd').val(),
		'useyn'			:	$('input[name=useyn]:checked').val(),
		'bl_gb'			:	$('#bl_gb').val(),
		'bl_no'			:	$('#bl_no').val(),
		'bl_nm'			:	$('#bl_nm').val(),
		'holder_nm'		:	$('#holder_nm').val(),
		'bl_num'		:	$('#bl_num').val(),
		'off_nm'		:	$('#off_nm').val(),
		'memo'			:	$('#memo').val(),
	};

	var s = $("input[name='s']").val();
	var search_data;

	fnc_ajax(url, type, data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if(p === 'in') {
					//검색 유지할 필요 없이 리스트 및 입력폼 초기화
					$('#frm')[0].reset();
					get_list({'s' : null} , 'insert');
					form_reset();
				}else{
					search_data = $("#frm").serialize();
					get_list(search_data , 'update');	// 은행계좌 리스트 재호출
					get_detail(g_bl_uc);
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description delete
 * @author 황호진  @version 1.0, @last update 2021/10/01
 */
function d() {
	var url = '/base/bank/d';
	var type = 'post';
	var data = {
		bl_uc : $("#p_bl_uc").val()
	};
	var search_data;
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				search_data = {'s':null};
				get_list(search_data , 'delete');	//은행계좌 리스트 재호출
				form_reset();
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
