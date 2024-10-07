/*================================================================================
 * @name: 황호진 - faq.js	자주묻는질문 FAQ 화면
 * @version: 1.0.0, @date: 2021-10-21
 ================================================================================*/

$(function () {

	var addr = window.location.pathname;
	if(addr === '/cs/faq/i'){
		get_frm_sub_gb();
	}

	/**
	 * @description 분류 선택에 따른 서브값 설정
	 * @author 황호진  @version 1.0, @last update 2021/10/21
	 */
	$(document).on("input","#main_gb",function () {
		get_frm_sub_gb();	//값이 바뀌면 입력폼의 소속제품군이 재설정
	});

	/**
	 * @description 등록버튼 이벤트연동
	 * @author 황호진  @version 1.0, @last update 2021/10/21
	 */
	$("#add_btn").off().click(function () {
		if(input_check()){
			var con = confirm('등록하시겠습니까?');
			if(con) {
				var url = "/cs/faq/insert";
				var type = "post";
				var data = {
					plat_gb : $('input[name=plat_gb]:checked').val(),
					main_gb : $("#main_gb").val(),
					sub_gb 	: $("#sub_gb").val(),
					title 	: $("#title").val(),
					content : CKEDITOR.instances.content.getData(),
					useyn 	: $('input[name=useyn]:checked').val(),
				};
				fnc_ajax(url , type , data)
					.done(function (res) {
						if(res.result){
							location.replace('/cs/faq');
						}else{
							toast(res.msg, true, 'danger');
						}
					}).fail(fnc_ajax_fail);
			}
		}
	});

	/**
	 * @description 수정버튼 이벤트연동
	 * @author 황호진  @version 1.0, @last update 2021/10/21
	 */
	$("#mod_btn").off().click(function () {
		if(input_check()){
			var con = confirm('수정하시겠습니까?');
			if(con) {
				var url = "/cs/faq/update";
				var type = "post";
				var data = {
					ik		: $('#ik').val(),
					plat_gb : $('input[name=plat_gb]:checked').val(),
					main_gb : $("#main_gb").val(),
					sub_gb 	: $("#sub_gb").val(),
					title 	: $("#title").val(),
					content : CKEDITOR.instances.content.getData(),
					useyn 	: $('input[name=useyn]:checked').val(),
				};
				fnc_ajax(url , type , data)
					.done(function (res) {
						if(res.result){
							location.replace('/cs/faq');
						}else{
							toast(res.msg, true, 'danger');
						}
					}).fail(fnc_ajax_fail);
			}
		}
	});

	/**
	 * @description 삭제버튼 이벤트연동
	 * @author 황호진  @version 1.0, @last update 2021/10/21
	 */
	$("#del_btn").off().click(function () {
		var con = confirm('삭제하시겠습니까?');
		if(con) {
			var url = "/cs/faq/delete";
			var type = "post";
			var data = {
				ik		: $('#ik').val()
			};
			fnc_ajax(url , type , data)
				.done(function (res) {
					if(res.result){
						location.replace('/cs/faq');
					}else{
						toast(res.msg, true, 'danger');
					}
				}).fail(fnc_ajax_fail);
		}
	});

	/**
	 * @description 전체 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/21
	 */
	$('#btn01').on('click', function () {
		var url = "/cs/faq/first_reg";
		var type = "GET";
		fnc_ajax(url , type , {})
			.done(function (res) {
				$("#st_dt").val(res.data);
			}).fail(fnc_ajax_fail);
	});

	/**
	 * @description 1개월,3개월,6개월 이벤트 연동
	 * @author 황호진  @version 2.0, @last update 2022/01/18
	 */
	$('#btn02 , #btn03 , #btn04').on('click', function () {
		var ed_dt = $("#ed_dt").val();
		var ed_time = new Date(ed_dt.substr(0,4) , ed_dt.substr(5,2) - 1 , ed_dt.substr(8,2));
		var end_y = ed_time.getFullYear();
		var end_m = ed_time.getMonth();
		var end_d = ed_time.getDate();
		var st_dt;
		var id = $(this).attr("id");
		if(id === 'btn02'){
			st_dt = conver_date(new Date(end_y , end_m - 1 , end_d));
		}else if(id === 'btn03'){
			st_dt = conver_date(new Date(end_y , end_m - 3 , end_d));
		}else if(id === 'btn04'){
			st_dt = conver_date(new Date(end_y , end_m - 6 , end_d));
		}

		$("#st_dt").val(st_dt);
	});

	/**
	 * @description 가용여부 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/21
	 */
	$(document).on('click','.switch', function () {
		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con){
			var id = $(this).attr("id");
			var ik = id.replace('switch_','');
			useyn_change(ik);					//id
		}
	});
});

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2022/01/18
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description 가용여부 변경 함수
 * @author 황호진  @version 1.0, @last update 2021/10/21
 */
function useyn_change(ik) {
	var url = '/cs/faq/useyn_change';
	var type = 'POST';
	var data = {
		'ik' : ik
	};
	fnc_ajax(url, type , data)
		.done(function (res) {
			if(res.result){
				if($("#useyn_"+ik).is(":checked") === true){
					$("#useyn_"+ik).prop('checked', false);	//checked => false
					toast('가용여부 Off로 변경 완료되었습니다.', false, 'info');
				}else{
					$("#useyn_"+ik).prop('checked', true);	//checked => true
					toast('가용여부 On으로 변경 완료되었습니다.', false, 'info');
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}


/**
 * @description 서브구분 가져오기
 * @author 황호진  @version 1.0, @last update 2021/10/21
 */
function get_frm_sub_gb() {
	var url = '/cs/faq/get_frm_sub_gb';
	var type = 'GET';
	var data = {
		val : $("#main_gb").val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var str = '';
			$.each(res.data, function (i, list) {
				str += '<option value="'+list.code_sub+'">'+list.code_name+'</option>';
			});
			$("#sub_gb").html(str);
		}).fail(fnc_ajax_fail);
}

/**
 * @description 필수입력값 검사
 * @author 황호진  @version 1.0, @last update 2021/10/21
 */
function input_check() {
	if($("#title").val() === ""){
		toast('제목은 필수입력입니다. 입력 후 다시 시도해주세요.', true, 'danger');
		$('#title').focus();
		return false;
	}
	if(CKEDITOR.instances.content.getData() === ""){
		toast('내용은 필수입력입니다. 입력 후 다시 시도해주세요.', true, 'danger');
		CKEDITOR.instances.content.focus();
		return false;
	}
	return true;
}
