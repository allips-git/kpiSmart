/*================================================================================
 * @name: 황호진 - sales_p.js	영업사원 등록 화면
 * @version: 1.0.0, @date: 2021-10-28
 ================================================================================*/
var g_ul_uc = '';
var page_num = 1;
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	get_list({s : null} , 'select');
	get_sales_users();
	//================================================================================

	//이벤트 연동!
	//================================================================================
	/**
	 * @description 검색버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/28
	 */
	$("#search_btn").off().click(function () {
		$("input[name='s']").val('t');
		var search_data = $("#frm").serialize();
		get_list(search_data, 'select');
		form_reset();
	});

	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/28
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='s']").val('t');
			var search_data = $("#frm").serialize();
			get_list(search_data, 'select');
			form_reset();
		}
	});

	/**
	 * @description 등록가능한 영업사원 불러오기
	 * @author 황호진  @version 1.0, @last update 2021/10/28
	 */
	$(document).on("input" , "#ul_uc" , function () {
		var ul_uc = $(this).val();
		get_user_detail(ul_uc);
	});

	/**
	 * @description 가용여부 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/28
	 */
	$(document).on('click','.switch', function () {
		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con){
			var id = $(this).attr("id");
			var ul_uc = id.replace('switch_','');
			useyn_change(ul_uc);
		}
	});

	/**
	 * @description 입력폼 reset 함수
	 * @author 황호진  @version 1.0, @last update 2021/10/28
	 */
	$("#reset_btn").off().click(function () {		//리셋버튼
		var con = confirm('입력을 초기화 하시겠습니까?');
		if(con){
			form_reset();
		}
	});

	/**
	 * @description 입력폼 등록,수정,삭제 버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/28
	 */
	$("#add_btn, #mod_btn , #del_btn").off().click(function () {	//등록,수정,삭제 버튼 클릭 이벤트
		var id = $(this).attr('id');
		var con = '';

		switch(id){
			case 'add_btn': case 'mod_btn':
				if(input_check()){
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
	 * @description 수당률 숫자 및 소수점만 입력 가능
	 * @author 황호진  @version 1.0, @last update 2021/10/28
	 */
	$("#s_bonus1 , #a_bonus1 , #a_bonus2 , #a_bonus3").on("input", function() {
		$(this).val($(this).val().replace(/[^0-9.]/gi,""));
	});

	/**
	 * @description 수당 구분 change 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/11/15
	 */
	$("#sp_pay").on('change' , function () {
		var type = $(this).val();
		if(type === 'S'){
			$("#s_bonus_frm").show();
			$("#a_bonus_frm").hide();
		}else{
			$("#s_bonus_frm").hide();
			$("#a_bonus_frm").show();
		}
	});

	/**
	 * @description 수당명칭관리 수정버튼
	 * @author 황호진  @version 1.0, @last update 2021/11/15
	 */
	$("#fbn_mod_btn").on('click' , function () {
		var con = confirm('수당 명칭을 변경하시겠습니까?');
		if(con) {
			save_bonus_nm();
		}
	});

	/**
	 * @description 영업구분 change이벤트
	 * @author 황호진  @version 1.0, @last update 2022/02/14
	 */
	$('#sp_gb').on('change' , function () {
		get_sales_users();
	});
	//================================================================================

});

/**
 * @description get_list 함수
 * @author 황호진  @version 1.0, @last update 2021/10/28
 * data = 검색창의 데이터
 */
function get_list(data , state) {
	$("#myTable").tablesorter({theme : 'blue'});	//테이블 정렬 기능
	var container = $('#pagination');				//pagination
	var url = '/biz/sales_p/get_list';
	var type = 'get';
	var p = $("#p").val();
	if(p === 'in' || state === 'select' || state === 'delete'){
		page_num = 1;
	}
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: true,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: true,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				pageNumber: page_num, // 현재 페이지 세팅
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					// ajax content setting
					var len = res.length;
					$("#list_cnt").html(len);

					var str = '';
					if(len > 0){
						var arr = [];

						$.each(res, function (i, list) {
							str += '<tr class="ad" id="tr_'+ list.ul_uc +'">';
							str += '<td>'+list.sales_no+'</td>';
							str += '<td class="tb_click" onclick=get_detail("'+list.ul_uc+'")>'+list.ul_cd+'</td>';
							str += '<td class="tb_click" onclick=get_detail("'+list.ul_uc+'")>'+list.ul_nm+'</td>';
							str += '<td class="tb_click" onclick=get_detail("'+list.ul_uc+'")>'+list.dp_name+'/'+list.ul_job+'</td>';
							str += '<td class="tb_click" onclick=get_detail("'+list.ul_uc+'")>'+list.sp_gb+'</td>';
							str += '<td class="tb_click" onclick=get_detail("'+list.ul_uc+'")>'+list.sp_pay+'</td>';
							str += '<td>' +
								'<label class="switch" id="switch_'+ list.ul_uc +'" style="cursor: pointer;">' +
								'<input type="checkbox" id="useyn_'+ list.ul_uc +'" disabled>' +
								'<span class="slider round"></span>' +
								'<span class="offtxt">off</span>' +
								'<span class="ontxt">on</span>' +
								'</label>' +
								'</td>';
							str += '<td class="T-left Elli">' + list.memo + '</td>';
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
							if(list.useyn == 'Y'){	//가용여부 체크를 위한 선행작업
								arr.push("useyn_"+list.ul_uc);
							}
						});
						$("#data-container").html(str); // ajax data output

						for(var i = 0; i < len; i++){	//가용여부 체크
							$('#'+arr[i]).prop('checked', true);
						}

						//update 입력폼일때 어느 데이터행을 선택했는지 설정
						// if(p === 'up') {
						// 	$(".ad").removeClass("active");
						// 	$("#tr_" + g_cust_cd).addClass("active");
						// }

						$("#myTable").trigger("update");
						$('.at tr').click(function(){
							$('.at tr').removeClass('active');
							$(this).addClass('active')
						});
					
						$('.at td').click(function(){
							$('.at td').removeClass('active');
							$(this).addClass('active')
						});
					}else{
						var v = padding_left_val('myTable');	//CSS 길이조절
						str += "<tr>";
						str += "<td colspan='13' style='text-align: left; padding-left: "+v+"px'>조회 가능한 데이터가 없습니다.</td>";
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
 * @author 황호진  @version 1.0, @last update 2021/10/28
 */
function padding_left_val(id) {
	var screen_width = screen.availWidth;	//실제 사용중인 모니터 길이
	var id_width = document.getElementById(id).clientWidth;	//지정한 id의 길이
	var result;
	if(screen_width === 2560){	//해상도 2560*1440
		result = id_width/2;
	}else if(screen_width === 1920){	//해상도 1920*1080
		result = id_width/4;
	}else if(screen_width === 1440){	//해상도 1440*900
		result = id_width/5;
	}else{	//그이외에...
		result = id_width/3;
	}
	return result;
}

/**
 * @description 영업직 리스트 조회
 * @author 황호진  @version 2.0, @last update 2022/02/14
 */
function get_sales_users() {
	var url = '/biz/sales_p/get_sales_users';
	var type = 'GET';
	var data = {
		sp_gb : $('#sp_gb').val()
	};
	fnc_ajax(url,type,data)
		.done(function (res) {
			var len = res.data.length;
			if(len > 0){	//len이 0일 경우 등록할수 있는 영업사원이 없다는 것을 의미
				$("#sales_imposs").hide();
				$("#sales_poss").show();
				var str = '';
				$.each(res.data, function (i, list) {
					str += '<option value="'+list.ul_uc+'">'+list.ul_nm+'</option>';
				});
				$("#ul_uc").html(str).trigger("input");
			}else{
				$("#ul_uc").html('');
				$("#sales_imposs").show();
				$("#sales_poss").hide();
				$("#user_detail").hide();
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 선택된 사용자의 상세정보를 가져옴
 * @author 황호진  @version 1.0, @last update 2021/10/28
 */
function get_user_detail(ul_uc) {
	var url = '/biz/sales_p/get_user_detail';
	var type = 'GET';
	var data = {
		ul_uc : ul_uc
	};
	fnc_ajax(url,type,data)
		.done(function (res) {
			var bank = '';
			if(res.data.bank_cd !== null){
				bank = "["+res.data.bank_cd+"] "+res.data.bank_no;
			}
			$("#user_detail").show();
			$("#ud_dp_rank").html(res.data.dp_name+"/"+res.data.ul_job);
			$("#ud_ul_gb").html(res.data.ul_gb);
			$("#ud_ul_cd").html(res.data.ul_cd);
			$("#ud_id").html(res.data.id);
			$("#ud_tel").html(res.data.tel);
			$("#ud_email").html(res.data.email);
			$("#ud_memo").html(res.data.memo);
			$("#ud_bank").html(bank);
		}).fail(fnc_ajax_fail);
}

/**
 * @description 가용여부 Y/N
 * @author 황호진  @version 1.0, @last update 2021/10/28
 */
function useyn_change(ul_uc) {
	var url = '/biz/sales_p/useyn_change';
	var type = 'POST';
	var data = {
		'ul_uc' : ul_uc
	};
	fnc_ajax(url, type , data)
		.done(function (res) {
			if(res.result){
				if($("#useyn_"+ul_uc).is(":checked") === true){
					$("#useyn_"+ul_uc).prop('checked', false);	//checked => false
					if(ul_uc === g_ul_uc){
						$('#useyn02').prop('checked' , true);
					}
					toast('가용여부 Off로 변경 완료되었습니다.', false, 'info');
				}else{
					$("#useyn_"+ul_uc).prop('checked', true);	//checked => true
					if(ul_uc === g_ul_uc){
						$('#useyn01').prop('checked' , true);
					}
					toast('가용여부 On으로 변경 완료되었습니다.', false, 'info');
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 리스트 행 클릭시 상세내용 가져오기
 * @author 황호진  @version 1.0, @last update 2021/10/28
 */
function get_detail(ul_uc) {
	var url = '/biz/sales_p/get_detail';
	var type = 'GET';
	var data = {
		'ul_uc' : ul_uc
	};
	fnc_ajax(url , type , data)
		.done(function (res) {

			$('#p').val('up');
			$('#add_btn').hide();
			$('#mod_btn').show();
			$('#p_ul_uc').val(ul_uc);
			g_ul_uc = ul_uc;

			$("#sales_imposs").hide();
			$("#sales_poss").show();

			var row = res.data.list;

			if(row.sysyn === 'Y'){
				$('#del_btn').hide();
			}else{
				$('#del_btn').show();
			}

			if(row.useyn === 'Y'){
				$('#useyn01').prop('checked' , true);
			}else{
				$('#useyn02').prop('checked' , true);
			}

			$('#sp_gb').val(row.sp_gb).addClass('gray').prop('disabled' , true);

			$('#sp_pay').val(row.sp_pay);
			if(row.sp_pay === 'S'){
				$("#s_bonus_frm").show();
				$("#a_bonus_frm").hide();
				$('#s_bonus1').val(Number(row.bonus1) === 0 ? '' : Number(row.bonus1));
			}else{
				$("#s_bonus_frm").hide();
				$("#a_bonus_frm").show();
				$('#a_bonus1').val(Number(row.bonus1) === 0 ? '' : Number(row.bonus1));
				$('#a_bonus2').val(Number(row.bonus2) === 0 ? '' : Number(row.bonus2));
				$('#a_bonus3').val(Number(row.bonus3) === 0 ? '' : Number(row.bonus3));
			}
			var str = '<option value="'+row.ul_uc+'">'+row.ul_nm+'</option>';
			$('#ul_uc').html(str).addClass('gray').prop('disabled' , true);
			$('#memo').val(row.memo);

			get_user_detail(row.ul_uc);

		}).fail(fnc_ajax_fail);
}

/**
 * @description form reset
 * @author 황호진  @version 1.0, @last update 2021/10/28
 */
function form_reset() {
	$('#p').val('in');
	$('#add_btn').show();
	$('#mod_btn').hide();
	$('#del_btn').hide();
	$('#p_ul_uc').val();
	g_ul_uc = '';

	$('#useyn01').prop('checked' , true);
	$('#sp_gb option:eq(0)').prop("selected", true);
	$('#sp_pay option:eq(1)').prop("selected", true);
	$('#s_bonus1').val('');
	$('#a_bonus1').val('');
	$('#a_bonus2').val('');
	$('#a_bonus3').val('');
	$('#ul_uc').removeClass('gray').prop('disabled' , false);
	$('#sp_gb').removeClass('gray').prop('disabled' , false);
	$('#memo').val('');
	get_sales_users();
}

/**
 * @description 입력값 검증
 * @author 황호진  @version 1.0, @last update 2021/10/28
 */
function input_check() {
	if($('#sales_poss').css('display') === 'none'){
		toast('등록가능한 사원이 없습니다.', true, 'danger');
		return false;
	}
	return true;
}

/**
 * @description insert update
 * @author 황호진  @version 1.0, @last update 2021/10/28
 */
function iu() {
	var p = $("#p").val();
	$("#p_ul_uc").val(g_ul_uc);

	var sp_pay = $('#sp_pay').val();
	var bonus1 = '',bonus2 = '' ,bonus3 = '';
	if(sp_pay === 'S'){
		bonus1 = $('#s_bonus1').val();
	}else{
		bonus1 = $('#a_bonus1').val();
		bonus2 = $('#a_bonus2').val();
		bonus3 = $('#a_bonus3').val();
	}

	var url = '/biz/sales_p/iu';
	var type = 'POST';
	var data = {
		p		: p,
		useyn 	: $('input[name=useyn]:checked').val(),
		sp_gb	: $('#sp_gb').val(),
		sp_pay	: sp_pay,
		bonus1	: bonus1,
		bonus2	: bonus2,
		bonus3	: bonus3,
		ul_uc	: $('#ul_uc').val(),
		memo	: $('#memo').val(),
	};

	var search_data;

	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if(p === 'in'){
					$('#frm')[0].reset();
					get_list({'s' : null} , 'insert');
					form_reset();
				}else{
					search_data = $("#frm").serialize();
					get_list(search_data , 'update');
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 가용여부 delete
 * @author 황호진  @version 1.0, @last update 2021/10/28
 */
function d() {
	var url = '/biz/sales_p/d';
	var type = 'POST';
	var data = {
		'p_ul_uc'	:	$("#p_ul_uc").val()
	};

	var search_data;
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				search_data = $("#frm").serialize();
				get_list(search_data , 'delete');
				form_reset();
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 공장별 bonus 명칭 변경
 * @author 황호진  @version 1.0, @last update 2021/10/28
 */
function save_bonus_nm() {
	var url = '/biz/sales_p/save_bonus_nm';
	var type = 'POST';
	var data = {
		'bonus1'	:	$("#fbn_bonus1").val(),
		'bonus2'	:	$("#fbn_bonus2").val(),
		'bonus3'	:	$("#fbn_bonus3").val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				$("#a_bonus1_nm").html($("#fbn_bonus1").val());
				$("#a_bonus2_nm").html($("#fbn_bonus2").val());
				$("#a_bonus3_nm").html($("#fbn_bonus3").val());
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
