/*================================================================================
 * @name: 황호진 - prod_proc2.js (공정등록)
 * @version: 1.0.1, @date: 2021-10-07
 ================================================================================*/
var g_pp_uc = "";
var page_num = 1;
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var data = {s : null};
	get_list(data , 'select');
	//================================================================================

	//이벤트 연동!
	//================================================================================

	/**
	 * @description 검색버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/14
	 */
	$("#search_btn").off().click(function () {
		$("input[name='s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
		var data = $("#frm").serialize();	//form 데이터
		get_list(data, 'select');						//공정리스트 호출
		form_reset('r');
	});

	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/14
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
			var data = $("#frm").serialize();	//form 데이터
			get_list(data, 'select');						//공정리스트 호출
			form_reset('r');
		}
	});

	/**
	 * @description 공정리스트 가용여부 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/14
	 */
	$(document).on('click','.switch', function () {
		var id = $(this).attr("id");
		var uc = id.replace('switch_','');			//uc값 추출
		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con) {
			useyn_change(uc);				//사용여부 변경 함수
		}
	});

	/**
	 * @description 입력폼 가용여부 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/09/14
	 */
	$("input[type='checkbox']").change(function () {	//화면단의 가용여부 및 코드구분 체크박스 change이벤트
		if($(this).is(":checked")){
			$(this).val("Y");
		}else{
			$(this).val("N");
		}
	});

	/**
	 * @description 입력폼 외주여부에 따른 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/09/14
	 */
	$("#prod_gb").on("input" , function () {
		var gb = $(this).val();
		if(gb === 'A'){
			$("#cust").hide();
		}else if(gb === 'B'){
			$("#cust").show();
		}
	});

	/**
	 * @description 입력폼 초기화
	 * @author 황호진  @version 1.0, @last update 2021/10/07
	 */
	$("#reset_btn").off().click(function () {		//리셋버튼
		var con = confirm('초기화하시겠습니까?');
		if(con){
			form_reset('r');
		}
	});

	/**
	 * @description 입력폼 등록,수정,삭제 버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/07
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
	
	//================================================================================
});

/**
 * @description 공정리스트 호출
 * @author 황호진  @version 1.0, @last update 2021/09/14
 */
function get_list(data , state) {
	$("#myTable").tablesorter({theme : 'blue'});	//테이블 정렬 기능
	var container = $('#pagination');	//pagination
	var url = "/base/prod_proc/get_list";
	var type = "GET";
	var p = $("#p").val();
	if(p === 'in' || state === 'select' || state === 'delete'){
		page_num = 1;
	}
	fnc_ajax(url , type , data)
		.done(function (res) {
			$("#list_cnt").html(res.data.count);
			container.pagination({
				// pagination setting
				dataSource: res.data.list, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 24,	//page 갯수 리스트가 24개 간격으로 페이징한다는 의미
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
							str += '<tr class="" id="tr_'+ list.pp_uc +'">';
							str += '<td>' + list.pp_no + '</td>';
							str += '<td class="tb_click" onclick=get_detail("'+ list.pp_uc +'")>' + list.pp_cd + '</td>';
							str += '<td class="T-left tb_click Elli" onclick=get_detail("'+ list.pp_uc +'")>' + list.pp_nm + '</td>';
							str += '<td class="tb_click" onclick=get_detail("'+ list.pp_uc +'")>' + list.pp_gb + '</td>';
							str += '<td>' +
								'<label class="switch" id="switch_'+ list.pp_uc +'" style="cursor: pointer;">' +
								'<input type="checkbox" id="useyn_'+ list.pp_uc +'" disabled>' +
								'<span class="slider round"></span>' +
								'<span class="offtxt">off</span>' +
								'<span class="ontxt">on</span>' +
								'</label>' +
								'</td>';
							str += '<td>' + list.prod_gb + '</td>';
							str += '<td class="T-left">' + list.cust_name + '</td>';
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
							if(list.useyn == 'Y'){
								arr.push("useyn_"+list.pp_uc);
							}
						});
						$("#data-container").html(str); // ajax data output

						for(var i = 0; i < len; i++){
							$('#'+arr[i]).prop('checked', true);
						}
						if(p === 'up') {
							//$(".ad").removeClass("active");
							//$("#tr_" + g_pp_uc).addClass("active");
							
						}

						$("#myTable").trigger("update");
											
						$('.at tr').click(function(){
							$('.at tr').removeClass('active');
							$(this).addClass('active')
						});

						$('.at td').click(function(){
							$('.at td').removeClass('active');
							$(this).addClass('active')
						});
					}else{	//조회할 데이터가 없을때
						var v = padding_left_val('myTable');
						str += "<tr><td colspan='13' style='text-align: left; padding-left: "+v+"px'>조회 가능한 데이터가 없습니다.</td></tr>"
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
 * @author 황호진  @version 1.0, @last update 2021/10/07
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
 * @description 공정리스트 가용여부 변경 이벤트
 * @author 황호진  @version 1.0, @last update 2021/09/14
 */
function useyn_change(uc) {
	var url = '/base/prod_proc/useyn_change';
	var type = 'POST';
	var data = {
		'uc' : uc
	};
	fnc_ajax(url , type , data)	//ajax 공용 함수
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if($("#useyn_"+uc).is(":checked") === true){
					$("#useyn_"+uc).prop('checked', false);	//checked => false

					//입력폼 연동
					if(uc === g_pp_uc) $("#useyn").val("N").prop("checked",false);
				}else{
					$("#useyn_"+uc).prop('checked', true);	//checked => true

					//입력폼 연동
					if(uc === g_pp_uc) $("#useyn").val("Y").prop("checked",true);
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);	//ajax fail 공용 함수
}

/**
 * @description 공정리스트 클릭한 데이터 상세내용
 * @author 황호진  @version 1.0, @last update 2021/09/14
 */
function get_detail(uc) {
	var url = '/base/prod_proc/get_detail';
	var type = 'GET';
	var data = {
		'uc' : uc
	};
	fnc_ajax(url , type , data)	//ajax 공용 함수
		.done(function (res) {
			//$("#tr_"+uc).addClass('active');
			$("#p").val("up");
			$("#p_pp_uc").val(uc);
			g_pp_uc = uc;		//전역변수
			$("#cust_cd").val(res.data.cust_cd);
			$("button[name=add_btn]").hide();
			$("button[name=mod_btn]").show();

			if(res.data.useyn === 'Y') $("#useyn").val("Y").prop("checked",true);
			else if(res.data.useyn === 'N') $("#useyn").val("N").prop("checked",false);

			if(res.data.sysyn === "Y"){
				$("button[name=del_btn]").hide();
				$("#prod_gb").prop("disabled", true);	//시스템코드가 Y일때 외주여부를 수정하지 못하게 막기
			}else{
				$("button[name=del_btn]").show();
				$("#prod_gb").prop("disabled", false);	//시스템코드가 N일때 외주여부는 수정가능
			}

			if(res.data.prod_gb === 'A'){
				$("#cust").hide();
			}else{
				$("#cust").show();
			}
			$("#pp_hisyn").val(res.data.pp_hisyn);
			$("#prod_gb").val(res.data.prod_gb);
			$("#cust_name").val(res.data.cust_name);
			$("#pp_gb").val(res.data.pp_gb);
			$("#pp_no").val(res.data.pp_no);
			$("#pp_nm").val(res.data.pp_nm);
			$("#memo").val(res.data.memo);

		}).fail(fnc_ajax_fail);
}
/**
 * @description 입력폼 reset 함수
 * type = reset 할때 type
 * 'i'  = insert시 폼 초기화
 * 'r'  = 완전 초기화
 */
function form_reset(type) {
	$("button[name=add_btn]").show();	//등록버튼 활성화
	$("button[name=mod_btn]").hide();	//수정버튼 비활성화
	$("button[name=del_btn]").hide();	//삭제버튼 비활성화
	//insert 폼으로 변경
	$("#p").val('in');
	//고유코드 초기화
	$("#p_pp_uc").val('');
	g_pp_uc = '';
	//공정명 초기화
	$("#pp_nm").val('');
	//메모 초기화
	$("#memo").val('');
	//정렬순서 초기화
	$("#pp_no option:eq(0)").prop("selected", true);

	if(type === 'r'){
		//거래처코드 초기화
		$("#cust_cd").val('');
		//가용여부 초기화
		$("#useyn").val('Y').prop("checked",true);
		//실적등록 초기화
		$("#pp_hisyn").val('N');
		//외주여부 초기화
		$("#prod_gb option:eq(0)").prop("selected", true);
		$("#prod_gb").prop('disabled', false);
		$("#cust").hide();
		//거래처명 초기화
		$("#cust_name").val('');
		//공정유형 초기화
		$("#pp_gb option:eq(0)").prop("selected", true);
	}
}

/**
 * @description insert , update
 * @author 황호진  @version 1.0, @last update 2021/10/07
 */
function iu() {
	var p = $("#p").val();

	$("#p_pp_uc").val(g_pp_uc);

	var cust_cd;
	if($('#prod_gb').val() === 'B'){
		cust_cd = $('#cust_cd').val();
	}else{
		cust_cd = "";
	}

	var url = '/base/prod_proc/iu';
	var type = 'POST';
	var data = {
		p			: p,
		p_pp_uc		: $('#p_pp_uc').val(),
		main_cd		: $('#main_cd').val(),
		cust_cd		: cust_cd,
		useyn		: $('#useyn').val(),
		pp_hisyn	: $('#pp_hisyn').val(),
		prod_gb		: $('#prod_gb').val(),
		pp_gb		: $('#pp_gb').val(),
		pp_no		: $('#pp_no').val(),
		pp_nm		: $('#pp_nm').val(),
		memo		: $('#memo').val(),
	};

	var s = $("input[name='s']").val();
	var search_data;

	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if(p === 'in'){
					//검색 유지할 필요 없이 리스트 및 입력폼 초기화
					$('#frm')[0].reset();
					get_list({'s' : null} , 'insert');
					form_reset('i');
				}else{
					search_data = $("#frm").serialize();
					get_list(search_data , 'update');	// 공정리스트 재호출
					get_detail(g_pp_uc);
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 필수입력값 체크
 * @author 황호진  @version 1.0, @last update 2021/10/07
 */
function input_check() {
	let prod_gb = $("#prod_gb").val();
	if(prod_gb === 'B') {
		if($('#cust_name').val() == ""){
			toast('외주거래처를 입력해주세요.', true, 'danger');
			return false;
		}
	}
	if($('#pp_nm').val() == ""){
		toast('공정명을 입력해주세요.', true, 'danger');
		$('#pp_nm').focus();
		return false;
	}
	return true;
}

/**
 * @description delete
 * @author 황호진  @version 1.0, @last update 2021/10/07
 */
function d() {
	var url = '/base/prod_proc/d';
	var type = 'post';
	var data = {
		p_pp_uc	: $('#p_pp_uc').val()
	};
	var search_data;
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				search_data = {'s':null};
				get_list(search_data , 'delete');	// 공정리스트 재호출
				form_reset('r');
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 거래처팝업에서 선택을 눌렀을시 동작하는 버튼
 * @author 황호진  @version 1.0, @last update 2021/12/13
 */
function cust_close(arg) {
	arg = JSON.parse(decodeURIComponent(arg)); // 필수
	$("#cust_name").val(arg['cust_nm']);
	$("#cust_cd").val(arg['cust_cd']);
	$('.biz-li-pop').bPopup().close();  //필수
}
