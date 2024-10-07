/*================================================================================
 * @name: 황호진 - router.js	공정라우터 등록
 * @version: 1.0.0, @date: 2021-12-09
 ================================================================================*/
var g_pc_uc = '';
var g_detail_init_padding_v = padding_left_val('detail-container');
var g_detail_init_str = '<tr><td colspan="15" style="text-align: left; padding-left: '+g_detail_init_padding_v+'px;">조회 가능한 데이터가 없습니다.</td></tr>';
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var search_data = {'s':null};
	get_master_list(search_data);
	//입력폼의 작업장리스트 설정
	get_work_place_list();
	//라우터 절차 초기화
	$("#detail-container").html(g_detail_init_str);
	//router_in_pop 라우터 설정
	get_pc_uc_popup();
	//================================================================================


	//이벤트 연동!
	//================================================================================
	/**
	 * @description 검색버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/12/09
	 */
	$("#search_btn").off().click(function () {
		$("input[name='s']").val('t');				//검색하기 때문에 't' 라는 값이 주어짐
		var search_data = $("#frm").serialize();	//form 데이터
		get_master_list(search_data);
		form_reset('r');
	});

	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2021/12/09
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='s']").val('t');				//검색하기 때문에 't' 라는 값이 주어짐
			var search_data = $("#frm").serialize();	//form 데이터
			get_master_list(search_data);
			form_reset('r');
		}
	});

	/**
	 * @description insert , update , delete
	 * @author 황호진  @version 1.0, @last update 2021/12/09
	 */
	$("#add_btn , #mod_btn , #del_btn").on('click' , function () {
		var id = $(this).attr('id');
		var con = '';

		switch(id){
			case 'add_btn': case 'mod_btn':
				if(master_input_check()){	//필수입력값 체크
					if(id === "add_btn"){
						con = confirm("등록 하시겠습니까?");
					} else if(id === "mod_btn") {
						con = confirm("수정 하시겠습니까?");
					}
				}
				if(con){
					master_iu();	//insert , update
				}
				break;
			case 'del_btn':
				con = confirm("삭제 하시겠습니까?");
				if(con) {
					master_d();		//delete
				}
				break;
		}
	});

	/**
	 * @description 입력폼 reset 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/12/09
	 */
	$("#reset_btn").off().click(function () {		//리셋버튼
		var con = confirm('입력을 초기화 하시겠습니까?');
		if(con){
			form_reset('r');	//입력폼 초기화
		}
	});

	/**
	 * @description master 및 detail 가용여부 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/12/09
	 */
	$(document).on('click','.switch', function () {
		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con){
			var id = $(this).attr("id");
			var uc = id.replace('switch_','');	//고유코드 추출
			var target = $(this).attr("data-text");
			useyn_change(uc , target);	//고유코드 , 타겟(master , detail)
		}
	});

	/**
	 * @description router_in_pop insert
	 * @author 황호진  @version 1.0, @last update 2021/12/13
	 */
	$("#add_btn_popup").on('click' , function () {
		if(detail_input_check()) {	//절차 추가 필수값 체크
			var con = confirm('절차 추가 하시겠습니까?');
			if (con) {
				detail_i();
			}
		}
	});

	$("#close_btn_popup").on('click' , function () {
		$('.router_in_pop').bPopup().close();
	});

	$("#procedure_remove").on('click' , function () {
		var remove_list = new Array();
		$('.detail_remove:checked').each(function() {
			remove_list.push(this.value.split('_'));
		});
		if(remove_list.length > 0){
			var con = confirm('선택하신 라우터 절차를 삭제하시겠습니까?');
			if(con){
				var url = '/base/router/detail_remove';
				var type = 'POST';
				var data = {remove_list};
				fnc_ajax(url , type , data)
					.done(function (res) {
						if(res.result){
							toast(res.msg, false, 'info');
							$("input[name='s']").val('t');
							var search_data = $("#frm").serialize();
							get_master_list(search_data);
							get_detail(g_pc_uc);
						}else{
							toast(res.msg, true, 'danger');
						}
					}).fail(fnc_ajax_fail);
			}
		}else{
			toast('삭제할 라우터 절차를 선택해주세요.', true, 'danger');
		}
	});
	//================================================================================
});

/**
 * @description 라우터 목록 조회
 * @author 황호진  @version 1.0, @last update 2021/12/09
 */
function get_master_list(data) {
	var url = '/base/router/get_master_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			var str = '';
			if(res.data.length > 0){
				var arr = [];
				$.each(res.data, function (i, list) {
					str += '<tr class="" id="tr_'+ list.pc_uc +'">';
					str += '<td>'+list.pc_no+'</td>';
					str += '<td class="T-left Elli tb_click" onclick=get_detail("'+list.pc_uc+'")>'+list.wp_nm+'</td>';
					str += '<td class="tb_click" onclick=get_detail("'+list.pc_uc+'")>'+list.pc_cd+'</td>';
					str += '<td class="T-left Elli tb_click" onclick=get_detail("'+list.pc_uc+'")>'+list.pc_nm+'</td>';
					str += '<td class="tb_click" onclick=get_detail("'+list.pc_uc+'")>'+list.rp_cnt+'</td>';
					str += '<td>' +
						'<label class="switch" id="switch_'+ list.pc_uc +'" data-text="master" style="cursor: pointer;">' +
						'<input type="checkbox" id="useyn_'+ list.pc_uc +'" disabled>' +
						'<span class="slider round"></span>' +
						'<span class="offtxt">off</span>' +
						'<span class="ontxt">on</span>' +
						'</label>' +
						'</td>';
					str += '<td class="T-left Elli">'+list.memo+'</td>';
					str += '<td>'+list.reg_ikey+'</td>';
					str += '<td>'+list.reg_dt+'</td>';
					str += '<td>'+list.mod_ikey+'</td>';
					str += '<td>'+list.mod_dt+'</td>';
					if(list.sysyn == 'Y'){
						str += '<td class="red">삭제불가</td>';
					}else{
						str += '<td>삭제가능</td>';
					}
					str += '</tr>';

					if(list.useyn === 'Y'){	//가용여부 체크를 위한 선행작업
						arr.push("useyn_"+list.pc_uc);
					}
				});
				$("#master-container").html(str);
				//라우터 목록 총검색 건수 설정
				$("#master_cnt").html(res.data.length);

				for(var i = 0; i < arr.length; i++){	//가용여부 체크
					$('#'+arr[i]).prop('checked', true);
				}

				var p = $("#p").val();
				if(p === 'up') {
					//$(".ad").removeClass("active");
					//$("#tr_" + g_pc_uc).addClass("active");
					
				}
				$('.ac tr').click(function(){
					$('.ac tr').removeClass('active');
					$(this).addClass('active')
				});
			
				$('.ac td').click(function(){
					$('.ac td').removeClass('active');
					$(this).addClass('active')
				});

			}else{
				var v = padding_left_val('master-container');
				str += '<tr>';
				str += '<td colspan="12" style="text-align: left; padding-left: '+v+'px;">조회 가능한 데이터가 없습니다.</td>';
				str += '</tr>';
				$("#master-container").html(str);
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 조회가능한 데이터 없을 경우 해상도에 따른 설정할 padding값 가져오기
 * @author 황호진  @version 1.0, @last update 2021/12/09
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
 * @description 필수입력값 체크
 * @author 황호진  @version 1.0, @last update 2021/12/09
 */
function master_input_check() {
	//작업장 검사
	if($('#w_place_have').css('display') === 'none'){
		toast('등록가능한 작업장이 없습니다. 작업장 등록 화면에서 선행 작업을 한 후 다시 시도해주세요!', true, 'danger');
		return false;
	}
	//라우터명 검사
	if($('#pc_nm').val() == ""){
		toast('라우터명을 입력해주세요.', true, 'danger');
		$('#pc_nm').focus();
		return false;
	}
	return true;
}

/**
 * @description insert update
 * @author 황호진  @version 1.0, @last update 2021/12/09
 */
function master_iu() {
	var p = $("#p").val();

	$("#pc_uc").val(g_pc_uc);
	var url = '/base/router/master_iu';
	var type = 'POST';
	var data = {
		'p'			:	p,
		'pc_uc'		:	$("#pc_uc").val(),
		'main_cd'	:	$('#main_cd').val(),
		'useyn'		:	$('input[name=useyn]:checked').val(),
		'wp_uc'		:	$('#wp_uc').val(),
		'pc_no'		:	$('#pc_no').val(),
		'pc_nm'		:	$('#pc_nm').val(),
		'memo'		:	$('#memo').val(),
	};

	fnc_ajax(url , type, data)
		.done(function (res) {
			// console.log(res);
			if(res.result){
				toast(res.msg, false, 'info');
				if(p === 'in'){	//insert
					//search frm reset
					$('#frm')[0].reset();
					//master list 재조회
					get_master_list({'s' : null});
					//insert용 초기화
					form_reset('i');
				}else{			//update
					var search_data = $("#frm").serialize();
					//master list 재조회
					get_master_list(search_data);
					//작업장리스트 때문에 다시 detail 호출하는 것!
					get_detail(res.pc_uc);
				}
				//팝업의 라우터 리스트 재조회
				get_pc_uc_popup();
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description get_detail
 * @author 황호진  @version 1.0, @last update 2021/12/09
 */
function get_detail(id) {
	var url = '/base/router/get_detail';
	var type = 'GET';
	var data = {
		'pc_uc' : id
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var master_info = res.data.master_info;		//라우터목록 detail
			var wp = res.data.wp;						//작업장선택
			var detail_list = res.data.detail_list;		//라우터절차


			//$(".ad").removeClass('active');			//ad 클래스가 달린 모든 태그에서 actice 클래스 제거
			//$("#tr_"+id).addClass('active');		//선택한 데이터 행에 actice 클래스 부여

			$("button[name=add_btn]").hide();		//등록버튼 비활성화
			$("button[name=mod_btn]").show();		//수정버튼 활성화

			if(master_info.sysyn === 'Y'){		//sysyn이 Y일때 삭제버튼이 보이면 안됨!
				$("button[name=del_btn]").hide();	//삭제버튼 비활성화
			}else if(master_info.sysyn === 'N'){
				$("button[name=del_btn]").show();	//삭제버튼 활성화
			}
			$("#p").val('up');			//입력폼 수정모드 up => update
			$("#pc_uc").val(id);		//가져온 pc_uc 값 설정
			g_pc_uc = id;				//전역변수에 설정

			//가용여부 설정
			if(master_info.useyn === 'Y') $("#useyn01").prop("checked",true);
			else if(master_info.useyn === 'N') $("#useyn02").prop("checked",true);

			//작업장선택
			var wp_str = '';
			$.each(wp, function (i, list) {
				wp_str += '<option value="'+list.wp_uc+'">'+list.wp_nm+'</option>';
			});
			$("#wp_uc").html(wp_str).val(master_info.wp_uc);

			//작업장 활성화
			$("#w_place_have").show();
			$("#w_place_none").hide();

			//정렬순서
			$("#pc_no").val(master_info.pc_no);
			//라우터명
			$("#pc_nm").val(master_info.pc_nm);
			//메모
			$("#memo").val(master_info.memo);

			//라우터 절차 설정
			var detail_str = '';
			if(detail_list.length > 0){
				var arr = [];

				$.each(detail_list, function (i, list) {
					var unique = list.pc_uc + '_' + list.pp_uc + '_' + list.pr_seq;
					detail_str	+= '<tr>';
					detail_str	+= '<td><input type="checkbox" class="detail_remove" id="checkbox_'+unique+'" value="'+unique+'"><label for="checkbox_'+unique+'"><label></td>';
					detail_str	+= '<td>'+ list.pr_seq +'</td>';
					detail_str	+= '<td class="T-left Elli">'+ list.pp_nm +'</td>';
					detail_str	+= '<td>'+ list.next_seq +'</td>';
					detail_str	+= '<td>'+ list.pp_gb +'</td>';
					detail_str	+= '<td>'+ list.prod_gb +'</td>';
					detail_str	+= '<td class="T-left Elli">'+ list.cust_nm +'</td>';
					detail_str	+= '<td>'+ list.pp_hisyn +'</td>';
					detail_str += '<td>' +
						'<label class="switch" id="switch_'+ unique +'" data-text="detail" style="cursor: pointer;">' +
						'<input type="checkbox" id="useyn_'+ unique +'" disabled>' +
						'<span class="slider round"></span>' +
						'<span class="offtxt">off</span>' +
						'<span class="ontxt">on</span>' +
						'</label>' +
						'</td>';
					detail_str	+= '<td class="T-left Elli">'+ list.memo +'</td>';
					detail_str	+= '<td>'+ list.reg_ikey +'</td>';
					detail_str	+= '<td>'+ list.reg_dt +'</td>';
					detail_str	+= '<td>'+ list.mod_ikey +'</td>';
					detail_str	+= '<td>'+ list.mod_dt +'</td>';
					if(list.sysyn === 'Y'){
						detail_str += '<td class="red">삭제불가</td>';
					}else{
						detail_str += '<td>삭제가능</td>';
					}
					detail_str	+= '</tr>';

					if(list.useyn === 'Y'){	//가용여부 체크를 위한 선행작업
						arr.push("useyn_"+unique);
					}
				});

				$("#detail-container").html(detail_str);
				
				$('input[type=checkbox]').click(function(){
						if($(this).is(':checked') == true){
							$(this).parents('tr').addClass('active');
						}else{
							$(this).prop("checked",false);
							$(this).parents('tr').removeClass('active');

						}
					});
				//라우터 절차 총검색 건수 설정
				$("#detail_cnt").html(detail_list.length);

				for(var i = 0; i < arr.length; i++){	//가용여부 체크
					$('#'+arr[i]).prop('checked', true);
				}
			}else{
				$("#detail-container").html(g_detail_init_str);
			}

			//절차 삭제 버튼
			$('#procedure_remove').removeClass('gray').addClass('red');
			$('button[name=procedure_remove]').prop('disabled' , false);

		}).fail(fnc_ajax_fail);
}

/**
 * @description 화면 첫로드 및 form_reset할때 작업장선택
 * @author 황호진  @version 1.0, @last update 2021/12/09
 */
function get_work_place_list() {
	var url = '/base/router/get_work_place_list';
	var type = 'get';
	var data = {};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var str = '';
			if(res.length > 0){	//등록할 작업장이 있을때!
				$.each(res, function (i, list) {
					str += '<option value="'+list.wp_uc+'">'+list.wp_nm+'</option>';
				});
				$("#wp_uc").html(str);

				$("#w_place_have").show();
				$("#w_place_none").hide();
			}else{				//등록할 작업장이 없을때!
				$("#wp_uc").html(str);

				$("#w_place_have").hide();
				$("#w_place_none").show();
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description form_reset
 * @author 황호진  @version 1.0, @last update 2021/12/09
 * type = 초기화 타입
 * i	= insert용 초기화 작업장선택은 냅둠
 * r	= 완전초기화
 */
function form_reset(type) {
	//$(".ad").removeClass('active');

	$("button[name=add_btn]").show();		//등록버튼 활성화
	$("button[name=mod_btn]").hide();		//수정버튼 비활성화
	$("button[name=del_btn]").hide();		//삭제버튼 비활성화

	$("#p").val('in');			//등록폼으로 변경
	$("#pc_uc").val('');		//가져온 pc_uc 빈값 설정
	g_pc_uc = '';				//전역변수 초기화

	//가용여부 Y처리
	$("#useyn01").prop("checked",true);
	//정렬순서 초기화
	$("#pc_no option:eq(0)").prop("selected", true);
	//라우터명 초기화
	$("#pc_nm").val('');
	//메모 초기화
	$("#memo").val('');
	//라우터 절차 초기화
	$("#detail-container").html(g_detail_init_str);
	//라우터 절차 삭제버튼 비활성화
	$('#procedure_remove').removeClass('red').addClass('gray');
	$('button[name=procedure_remove]').prop('disabled' , true);
	if(type === 'r'){
		//작업장리스트 재호출
		get_work_place_list();
	}
}

/**
 * @description delete
 * @author 황호진  @version 1.0, @last update 2021/12/09
 */
function master_d() {
	var url = '/base/router/master_d';
	var type = 'post';
	var data = {
		'pc_uc'	:	$("#pc_uc").val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				//검색폼 초기화
				$('#frm')[0].reset();
				//master list 재조회
				get_master_list({'s' : null});
				//입력폼 완전초기화
				form_reset('r');
				//팝업의 라우터리스트 변경
				get_pc_uc_popup();
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 가용여부 변경
 * @author 황호진  @version 1.0, @last update 2021/12/09
 */
function useyn_change(uc , target) {
	var url = '/base/router/useyn_change';
	var type = 'GET';
	var data = {
		'uc' 		: uc,
		'target'	: target
	};
	fnc_ajax(url, type , data)
		.done(function (res) {
			if(res.result){
				if($("#useyn_"+uc).is(":checked") === true){
					$("#useyn_"+uc).prop('checked', false);	//checked => false

					if(target === 'master'){	//타겟이 master 테이블일 경우
						if(uc === g_pc_uc){		//입력폼의 값이랑 가지고 온 고유코드가 같을때!
							$("#useyn02").prop("checked",true);
						}
						//팝업의 라우터 리스트 재조회
						get_pc_uc_popup();
					}

					toast('가용여부 Off로 변경 완료되었습니다.', false, 'info');
				}else{
					$("#useyn_"+uc).prop('checked', true);	//checked => true

					if(target === 'master'){	//타겟이 master 테이블일 경우
						if(uc === g_pc_uc){		//입력폼의 값이랑 가지고 온 고유코드가 같을때!
							$("#useyn01").prop("checked",true);
						}
						//팝업의 라우터 리스트 재조회
						get_pc_uc_popup();
					}

					toast('가용여부 On으로 변경 완료되었습니다.', false, 'info');
				}
				if(target === 'detail'){
					var arg = uc.split('_');
					get_detail(arg[0]);
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description router_in_pop pc_uc 리스트 조회
 * @author 황호진  @version 1.0, @last update 2021/12/13
 */
function get_pc_uc_popup() {
	var url = '/base/router/get_pc_uc_popup';
	var type = 'get';
	fnc_ajax(url , type , {})
		.done(function (res) {
			var str = '';
			if(res.data.length > 0){
				$.each(res.data, function (i, list) {
					str += '<option value="'+list.pc_uc+'">'+list.pc_nm+'</option>';
				});
				$("#pc_uc_popup").html(str);
				$("#pc_uc_have").show();
				$("#pc_uc_none").hide();
			}else{
				$("#pc_uc_popup").html(str);
				$("#pc_uc_have").hide();
				$("#pc_uc_none").show();
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description router_in_pop 필수값 검증
 * @author 황호진  @version 1.0, @last update 2021/12/13
 */
function detail_input_check() {
	//라우터 선택여부 검사
	if($('#pc_uc_have').css('display') === 'none'){
		toast('등록 가능한 라우터가 없습니다. 라우터를 먼저 등록 후 진행해주시길 바랍니다.', true, 'danger');
		return false;
	}
	//공정 값 검사(controller로 처리했기에 undefined로 검사할수밖에 없음)
	if($('#pp_uc_popup').val() === undefined){
		toast('등록 가능한 공정이 없습니다. 공정 등록 화면의 선행작업 후 진행해주시길 바랍니다.', true, 'danger');
		return false;
	}
	return true;
}

/**
 * @description router_in_pop insert
 * @author 황호진  @version 1.0, @last update 2021/12/13
 */
function detail_i() {
	var url = '/base/router/detail_i';
	var type = 'post';
	var data = {
		pc_uc 			: $('#pc_uc_popup').val(),
		pp_uc 			: $('#pp_uc_popup').val(),
		pr_seq 			: $('#pr_seq_popup').val(),
		memo			: $('#memo_popup').val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');

				$("input[name='s']").val('t');				//검색하기 때문에 't' 라는 값이 주어짐
				var search_data = $("#frm").serialize();	//form 데이터
				get_master_list(search_data);
				//라우터 절차 초기화
				$("#detail-container").html(g_detail_init_str);
				//router_in_pop 라우터 설정
				get_pc_uc_popup();
				$('.router_in_pop').bPopup().close();  //필수
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
