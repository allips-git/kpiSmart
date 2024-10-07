/*================================================================================
 * @name: 황호진 - coupon.js 할인쿠폰등록
 * @version: 1.0.0, @date: 2022-01-14
 ================================================================================*/
var page_num = 1;
var g_cp_uc = '';
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	get_list({s : null} , 'select');
	//================================================================================

	//검색버튼 연동
	$("#search_btn").off().click(function () {
		$("input[name='s']").val('t');	//검색하기 때문에 't' 라는 값이 주어짐
		var data = $("#frm").serialize();	//form 데이터
		get_list(data , 'select');		//작업장리스트 호출 함수
		form_reset('r');
	});

	//검색어 입력후 엔터칠때 실행
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='s']").val('t');	//검색하기 때문에 't' 라는 값이 주어짐
			var data = $("#frm").serialize();	//form 데이터
			get_list(data , 'select');		//작업장리스트 호출 함수
			form_reset('r');
		}
	});

	//리셋버튼 연동
	$("#reset_btn").off().click(function () {
		var con = confirm('초기화하시겠습니까?');
		if(con) {
			form_reset('r');	//form reset 함수 호출
		}
	});

	//등록 , 수정 , 삭제 버튼
	$("#add_btn, #mod_btn , #del_btn").off().click(function () {
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

	//가용여부 변경
	$(document).on('click','.switch', function () {
		var id = $(this).attr("id");
		var uc = id.replace('switch_','');			//uc값 추출
		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con) {
			useyn_change(uc);				//사용여부 변경 함수
		} // if end
	});

	//수량제한없음 이벤트
	$('#limit_yn').on('change' , function () {
		if($('#limit_yn').is(':checked')){
			$('#qty').val('').addClass('gray').prop('disabled' , true);
		}else{
			$('#qty').removeClass('gray').prop('disabled' , false);
		}
	});

	$("#amt").on("input", function() {
		var num = $(this).val().replace(/[^0-9.]/gi,"");
		$(this).val(num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
	});

	$("#qty").on("input", function() {$(this).val($(this).val().replace(/[^0-9]/gi,""));});

});	// page load end

/**
 * @description 쿠폰 리스트
 * @author 황호진  @version 1.0, @last update 2022-01-14
 */
function get_list(data , state) {
	$("#myTable").tablesorter({theme : 'blue'});	//테이블 정렬 기능
	var container = $('#pagination');	//pagination
	var url = '/event/coupon/get_list';
	var type = 'GET';
	if(state === 'insert' || state === 'select' || state === 'delete'){
		page_num = 1;
	}
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 20,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: true,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: true,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				pageNumber: page_num, 	// 현재 페이지 세팅
				callback: function (res, pagination) {
					var len = res.length;
					$('#list_cnt').html(len);
					var str = '';
					if(len > 0){
						var arr = [];
						$.each(res , function (i , list) {
							str += '<tr class="ad" id="tr_'+ list.cp_uc +'">';
							str += '<td>'+ list.row_no +'</td>';
							str += '<td class="tb_click" onclick=get_detail("'+ list.cp_uc +'")>'+ list.rec_gb +'</td>';
							str += '<td class="tb_click" onclick=get_detail("'+ list.cp_uc +'")>'+ list.cp_uc +'</td>';
							str += '<td class="tb_click T-left" onclick=get_detail("'+ list.cp_uc +'")>'+ list.cp_nm +'</td>';
							str += '<td class="tb_click T-right" onclick=get_detail("'+ list.cp_uc +'")>'+ commas(Number(list.amt))+list.unit +'</td>';
							str += '<td class="tb_click" onclick=get_detail("'+ list.cp_uc +'")>'+ list.qty +'</td>';
							str += '<td class="tb_click" onclick=get_detail("'+ list.cp_uc +'")>'+ list.start_dt +' ~ '+ list.end_dt +'</td>';
							str += '<td>' +
									'<label class="switch" id="switch_'+ list.cp_uc +'" style="cursor: pointer;">' +
									'<input type="checkbox" id="useyn_'+ list.cp_uc +'" disabled>' +
									'<span class="slider round"></span>' +
									'<span class="offtxt">off</span>' +
									'<span class="ontxt">on</span>' +
									'</label>' +
									'</td>';
							str += '<td class="T-left Elli">'+ list.memo +'</td>';
							str += '<td>'+ list.reg_ikey +'</td>';
							str += '<td>'+ list.reg_dt +'</td>';
							str += '<td>'+ list.mod_ikey +'</td>';
							str += '<td>'+ list.mod_dt +'</td>';
							if(list.sysyn === 'Y'){
								str += '<td class="red">삭제불가</td>';
							}else{
								str += '<td>삭제가능</td>';
							}
							str += '</tr>';
							if(list.useyn == 'Y'){
								arr.push("useyn_"+list.cp_uc);
							}
						});
						$("#data-container").html(str); // ajax data output

						for(var i = 0; i < len; i++){
							$('#'+arr[i]).prop('checked', true);
						}

						if($('#p').val() === 'up') {
							$(".ad").removeClass("active");
							$("#tr_" + g_cp_uc).addClass("active");
						}

						$("#myTable").trigger("update");
					}else{	//조회할 데이터가 없을때
						str += "<tr><td colspan='16'>조회 가능한 데이터가 없습니다.</td></tr>"
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
				}	// callback end
			})	// page end
		}).fail(fnc_ajax_fail);	//ajax end
} //get_list end

/**
 * @description 입력폼 리셋
 * @author 황호진  @version 1.0, @last update 2022-01-14
 * type = reset 할때 type
 * 'i'  = insert시 폼 초기화
 * 'r'  = 완전 초기화
 */
function form_reset(type) {
	$('#add_btn').show();	//등록버튼 활성화
	$('#mod_btn').hide();	//수정버튼 비활성화
	$('#del_btn').hide();	//삭제버튼 비활성화
	//insert 폼으로 변경
	$('#p').val('in');
	//쿠폰 고유 코드 초기화
	$('#cp_uc').val('');
	g_cp_uc = '';
	//쿠폰명 초기화
	$('#cp_nm').val('');
	//금액 초기화
	$('#amt').val('');
	//수량 초기화
	$('#qty').val('');
	//비고 초기화
	$('#memo').val('');
	if(type === 'r'){
		//가용여부 Y로 초기화
		$('#use01').prop('checked' , true);
		//사용처 초기화
		$('#rec_gb option:eq(0)').prop("selected", true);
		//단위 초기화
		$('#unit option:eq(0)').prop("selected", true);
		//수량제한없음
		$('#limit_yn').prop('checked' , false).trigger('change');
		//현재 년월 구하기
		var now = new Date();
		var now_y = now.getFullYear();
		var now_m = now.getMonth();
		//시작일
		$('#start_dt').val(conver_date(new Date(now_y , now_m , 1)));
		//종료일
		$('#end_dt').val(conver_date(new Date(now_y , now_m+1 , 0)));
	}
}	//form_reset end

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2022/01/14
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}	//conver_date end

/**
 * @description 입력값 검증
 * @author 황호진  @version 1.0, @last update 2022-01-14
 */
function input_check() {
	//쿠폰명 입력 검증
	if($('#cp_nm').val() === ""){
		toast('쿠폰명을 입력해주세요.', true, 'danger');
		$('#cp_nm').focus();
		return false;
	}

	//금액 입력 검증
	if(Number($('#amt').val().replaceAll(',','')) === 0){
		toast('금액을 입력해주세요.', true, 'danger');
		$('#amt').focus();
		return false;
	}

	//단위가 %일때 금액 조건
	if($('#unit').val() === '002'){
		if(Number($('#amt').val().replaceAll(',','')) > 100){
			toast('%단위에서 100 초과금액을 입력할 수 없습니다.', true, 'danger');
			$('#amt').focus();
			return false;
		}
	}

	//수량 검사
	if(!$("#limit_yn").is(':checked')){
		if(Number($('#qty').val()) === 0){
			toast('수량을 입력해주세요.', true, 'danger');
			$('#qty').focus();
			return false;
		}
	}

	//날짜 비교
	var start_dt = $('#start_dt').val();
	var end_dt = $('#end_dt').val();
	if(end_dt < start_dt){
		toast('날짜를 제대로 입력해주세요.', true, 'danger');
		return false;
	}

	return true;
}	//input_check end

/**
 * @description 입력값 검증
 * @author 황호진  @version 1.0, @last update 2022-01-14
 */
function iu() {
	var p = $("#p").val();

	$("#cp_uc").val(g_cp_uc);

	var url = '/event/coupon/iu';
	var type = 'POST';
	var data = {
		p			: p,
		main_cd		: $('#main_cd').val(),
		cp_uc		: g_cp_uc,
		useyn		: $('input[name=useyn]:checked').val(),
		rec_gb		: $('#rec_gb').val(),
		cp_nm		: $('#cp_nm').val(),
		amt			: Number($('#amt').val().replaceAll(',','')),
		unit		: $('#unit').val(),
		qty			: Number($('#qty').val()),
		limit_yn	: $('#limit_yn').is(':checked') ? 'Y' : 'N',
		start_dt	: $('#start_dt').val(),
		end_dt		: $('#end_dt').val(),
		memo		: $('#memo').val(),
	};

	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if(p === 'in'){
					get_list({ s : null } , 'insert');
					form_reset('i');
				}else{
					get_list($("#frm").serialize() , 'update');
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}	// iu end

/**
 * @description get_detail
 * @author 황호진  @version 1.0, @last update 2022-01-14
 */
function get_detail(cp_uc) {
	var url = '/event/coupon/get_detail';
	var type = 'GET';
	var data = {
		cp_uc : cp_uc
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			$("#p").val("up");

			//cp_uc 설정
			$("#cp_uc").val(cp_uc);
			g_cp_uc = cp_uc;

			//등록버튼 비활성화
			$("#add_btn").hide();
			//수정버튼 활성화
			$("#mod_btn").show();

			//가용여부 설정
			if(res.data.useyn === 'Y') $("#use01").prop("checked",true);
			else if(res.data.useyn === 'N') $("#use02").prop("checked",true);

			//sysyn 여부에 따른 삭제버튼 활성화 , 비활성화
			if(res.data.sysyn === "Y"){
				$("#del_btn").hide();
			}else{
				$("#del_btn").show();
			}

			//사용처 설정
			$('#rec_gb').val(res.data.rec_gb);
			//쿠폰명 설정
			$('#cp_nm').val(res.data.cp_nm);
			//금액 설정
			$('#amt').val(commas(Number(res.data.amt)));
			//단위 설정
			$('#unit').val(res.data.unit);
			//수량 및 수량제한없음 설정
			if(res.data.limit_yn === 'Y'){
				//수량제한없음
				$('#limit_yn').prop('checked' , true).trigger('change');
				//수량
				$('#qty').val('');
			}else{
				//수량제한없음
				$('#limit_yn').prop('checked' , false).trigger('change');
				//수량
				$('#qty').val(res.data.qty);
			}

			//시작일 설정
			$('#start_dt').val(res.data.start_dt);
			//종료일 설정
			$('#end_dt').val(res.data.end_dt);
			//비고 설정
			$('#memo').val(res.data.memo);
		}).fail(fnc_ajax_fail);	//ajax end
}	//get_detail end

/**
 * @description useyn_change 가용여부 변경 함수
 * @author 황호진  @version 1.0, @last update 2022-01-14
 */
function useyn_change(uc) {
	var url = '/event/coupon/useyn_change';
	var type = 'POST';
	var data = {
		'uc' : uc
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if($("#useyn_"+uc).is(":checked") === true){
					$("#useyn_"+uc).prop('checked', false);	//checked => false

					//입력폼 연동
					if(uc === g_cp_uc) $("#use02").prop("checked",true);
				}else{
					$("#useyn_"+uc).prop('checked', true);	//checked => true

					//입력폼 연동
					if(uc === g_cp_uc) $("#use01").prop("checked",true);
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}	//useyn_change end

/**
 * @description delete
 * @author 황호진  @version 1.0, @last update 2021/10/07
 */
function d() {
	var url = '/event/coupon/d';
	var type = 'post';
	var data = {
		cp_uc	: $('#cp_uc').val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				get_list({'s':null} , 'delete');	// 쿠폰리스트 재호출
				form_reset('r');
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
