/*================================================================================
 * 개발팀 w_place js - custom function package
 * @version: 1.0.0
 ================================================================================*/
var d_wp_uc = '';
var page_num = 1;
$(function () {

	var data = {'s':null};	//null로 보냄! 값이 있을때는 't' 라는 값을 전송
	get_list(data , 'select');

	//검색버튼 연동
	$("#search_btn").off().click(function () {
		$("input[name='s']").val('t');	//검색하기 때문에 't' 라는 값이 주어짐
		var data = $("#frm").serialize();	//form 데이터
		get_list(data , 'select');		//작업장리스트 호출 함수
		form_reset();
	});

	//검색어 입력후 엔터칠때 실행
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='s']").val('t');	//검색하기 때문에 't' 라는 값이 주어짐
			var data = $("#frm").serialize();	//form 데이터
			get_list(data , 'select');		//작업장리스트 호출 함수
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
		$("#p_wp_uc").val(d_wp_uc);
		var con = confirm('수정하시겠습니까?');
		if(con){
			iu(p);	//insert or update ajax 함수 호출
		}
	});

	//리셋버튼 연동
	$("#reset_btn").off().click(function () {
		var con = confirm('초기화하시겠습니까?');
		if(con) {
			form_reset();	//form reset 함수 호출
		}
	});

	//삭제버튼 연동
	$("#del_btn").off().click(function () {
		var con = confirm('삭제하시겠습니까?');
		if(con){
			d_data();
		}
	});

	$("#tel").on("input", function() {$(this).val( $(this).val().replace(/[^0-9-]/gi,"") );});

	/**
	 * @description 작업장리스트 가용여부 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/24
	 */
	$(document).on('click','.switch', function () {
		var id = $(this).attr("id");
		var wp_uc = id.replace('switch_','');

		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con) {
			useyn_change(wp_uc);			//id
		}
	});

});

/**
 * @description 데이터 delete 함수
 */
function d_data() {
	$("#p_wp_uc").val(d_wp_uc);

	var url = '/base/w_place/d_data';
	var type = 'POST';
	var data = $("#iu_frm").serialize();	//serialize로 넘기기
	fnc_ajax(url, type, data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				var search_data = {'s':null};
				get_list(search_data , 'delete');	//작업장 리스트 재호출
				form_reset();	//입력폼 초기화시키기
				$('#frm')[0].reset();
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description insert 및 update ajax 통신
 */
function iu(p) {
	if(!val_check('wp_nm','str')){	//빈값 체크
		return toast('작업자명이 빈값입니다. 입력 후 시도해주세요!', true, 'danger');
	}
	var url = '/base/w_place/iu';
	var type = 'POST';
	var data = {
		'p'				: p,
		'main_cd'		: $('#main_cd').val(),
		'p_wp_uc'		: $('#p_wp_uc').val(),
		'useyn'			: $('input[name=useyn]:checked').val(),
		'wp_gb'			: $('#wp_gb').val(),
		'wp_no'			: $('#wp_no').val(),
		'wp_nm'			: $('#wp_nm').val(),
		'person'		: $('#person').val(),
		'tel'			: $('#tel').val(),
		'post_code'		: $('#post_code').val(),
		'addr'			: $('#addr').val(),
		'addr_detail'	: $('#addr_detail').val(),
		'memo'			: $('#memo').val()
	};

	var s = $("input[name='s']").val();
	var search_data;
	fnc_ajax(url, type, data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if(p === 'in'){
					search_data = {'s':null};
					get_list(search_data , 'insert');	//작업장 리스트 재호출
					form_reset();	//입력폼 초기화시키기
					$('#frm')[0].reset();
				}else{
					search_data = $("#frm").serialize();
					get_list(search_data , 'update');	//작업장 리스트 재호출
					get_detail(d_wp_uc);
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 입력폼 reset 함수
 */
function form_reset() {
	d_wp_uc = '';
	$("button[name=add_btn]").show();	//등록버튼 활성화
	$("button[name=mod_btn]").hide();	//수정버튼 비활성화
	$("button[name=del_btn]").hide();	//삭제버튼 추후구현
	$("#p").val('in');		//in 값 설정
	$("#p_wp_uc").val("");		//선택된 작업장데이터 고유코드 초기화
	$('#use01').prop('checked', true);
	$(".ad").removeClass("active");
	$("#wp_gb").val("생산작업");	//화면 맨처음 들어왔을때 생산작업로 설정되어 있음
	$("#wp_no").val("1");		//화면 맨처음 들어왔을때 1로 설정되어 있음
	$("#wp_nm").val("");
	$("#person").val("");
	$("#tel").val("");
	$("#post_code").val("");
	$("#addr").val("");
	$("#addr_detail").val("");
	$("#memo").val("");
}

/**
 * @description useyn 변경 함수
 */
function useyn_change(id) {
	var url = '/base/w_place/useyn_change';
	var type = 'POST';
	var data = {
		'wp_uc' : id
	};
	fnc_ajax(url , type , data)	//ajax 공용 함수
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if($("#useyn_"+id).is(":checked") === true){
					$("#useyn_"+id).prop('checked', false);	//checked => false

					if(id === d_wp_uc){
						$("#use02").prop("checked",true);
					}
				}else{
					$("#useyn_"+id).prop('checked', true);	//checked => true

					if(id === d_wp_uc){
						$("#use01").prop("checked",true);
					}
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);	//ajax fail 공용 함수
}

function get_list(data , state) {
	$("#myTable").tablesorter({theme : 'blue'});	//테이블 정렬 기능
	var container = $('#pagination');	//pagination
	var url = '/base/w_place/get_data_list';
	var type = 'POST';
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
							str += '<tr class="ad" id="tr_'+ list.wp_uc +'">';
							str += '<td>' + list.wp_no + '</td>';
							str += '<td class="tb_click" onclick=get_detail("'+ list.wp_uc +'")>' + list.wp_cd + '</td>';
							str += '<td class="T-left tb_click" style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis" onclick=get_detail("'+ list.wp_uc +'")>' + list.wp_nm + '</td>';
							str += '<td class="tb_click" onclick=get_detail("'+ list.wp_uc +'")>' + list.wp_gb + '</td>';
							str += '<td>' +
									'<label class="switch" id="switch_'+ list.wp_uc +'" style="cursor: pointer;">' +
									'<input type="checkbox" id="useyn_'+ list.wp_uc +'" disabled>' +
									'<span class="slider round"></span>' +
									'<span class="offtxt">off</span>' +
									'<span class="ontxt">on</span>' +
									'</label>' +
									'</td>';
							str += '<td>' + list.person + '</td>';
							str += '<td>' + list.tel + '</td>';
							str += '<td class="T-left" style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis">' + list.addr + '</td>';
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
								arr.push("useyn_"+list.wp_uc);
							}
						});
						$("#data-container").html(str); // ajax data output

						for(var i = 0; i < len; i++){
							$('#'+arr[i]).prop('checked', true);
						}
						if(p === 'up') {
							$(".ad").removeClass("active");
							$("#tr_" + d_wp_uc).addClass("active");
						}

						$("#myTable").trigger("update");
					}else{	//조회할 데이터가 없을때
						str += "<tr><td colspan='14'>조회 가능한 데이터가 없습니다.</td></tr>"
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

function get_detail(wp_uc) {
	var url = '/base/w_place/get_detail';
	var type = 'POST';
	var data = {
		'wp_uc' : wp_uc		//고유 코드로 상세내용 불러옴
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			$("button[name=add_btn]").hide();	//등록버튼 비활성화
			$("button[name=mod_btn]").show();	//수정버튼 활성화
			if(res.sysyn == 'Y'){
				$("button[name=del_btn]").hide();	//삭제버튼 비활성화
			}else{
				$("button[name=del_btn]").show();	//삭제버튼 활성화
			}
			$(".ad").removeClass("active");
			$("#tr_"+wp_uc).addClass("active");
			$("#p").val('up');		//up으로 바꾸며 update form으로 설정
			d_wp_uc = wp_uc;	//고유 코드 설정
			$("#p_wp_uc").val(wp_uc);
			if(res.useyn === 'Y'){
				$('#use01').prop('checked', true);
			}else if(res.useyn === 'N'){
				$('#use02').prop('checked', true);
			}
			$("#wp_gb").val(res.wp_gb);
			$("#wp_no").val(res.wp_no);
			$("#wp_nm").val(res.wp_nm);
			$("#person").val(res.person);
			$("#tel").val(res.tel);
			$("#post_code").val(res.post_code);
			$("#addr").val(res.addr);
			$("#addr_detail").val(res.addr_detail);
			$("#memo").val(res.memo);
		}).fail(fnc_ajax_fail);
}
