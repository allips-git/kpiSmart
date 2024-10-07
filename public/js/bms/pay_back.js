/*================================================================================
 * @name: 황호진 - pay.js	 매출수금관리화면
 * @version: 1.0.0, @date: 2021-11-12
 ================================================================================*/
var padding_left_v = padding_left_val('tb_list');
var g_acc_no = '';
var g_vat = '';
var list_init_str = '<tr><td class="T-left" colspan="14" style="padding-left: '+padding_left_v+'px;">거래처 검색 후 조회 가능합니다.</td></tr>';
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	$("#data-container").html(list_init_str);
	//================================================================================

	//이벤트 연동
	//================================================================================
	/**
	 * @description select2 및 change 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/11/12
	 */
	$("#cust").select2();
	$("#cust").on('change' , function () {
		var cust_cd = $(this).val();
		if(cust_cd !== ''){
			form_reset('select2');
			get_payinfo();
		}else{
			form_reset('all');
		}
	});

	/**
	 * @description 버튼별 기한 설정
	 * @author 황호진  @version 1.0, @last update 2021/11/12
	 */
	$('#btn01 , #btn02 , #btn03 , #btn04').on('click', function () {
		var id = $(this).attr("id");
		var now = new Date();
		var now_y = now.getFullYear();
		var now_m = now.getMonth();
		var now_d = now.getDate();
		if(id === 'btn01'){
			$("#st_dt").val('');
			$("#ed_dt").val(conver_date(new Date(now_y , now_m + 1 , 0)));
		}else if(id === 'btn02'){
			//전월 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m - 1 , 1)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m , 0)));
		}else if(id === 'btn03'){
			//금월 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m , 1)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m + 1 , 0)));
		}else if(id === 'btn04'){
			//당일 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m , now_d - 1)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m , now_d)));
		}
	});

	/**
	 * @description 결재방식이 통장일때
	 * @author 황호진  @version 1.0, @last update 2021/11/12
	 */
	$('#acc_type').on('change' , function () {
		var id = $(this).val();
		if(id === '005'){
			$('.bank').show();
		}else{
			$('.bank').hide();
		}
	});

	/**
	 * @description insert update delete
	 * @author 황호진  @version 1.0, @last update 2021/11/12
	 */
	$('#add_btn , #mod_btn , #del_btn').on('click' , function () {
		var id = $(this).attr('id');
		var con = '';
		switch(id) {
			case 'add_btn': case 'mod_btn':
				if (input_check()) {
					if (id === "add_btn") {
						con = confirm("등록 하시겠습니까?");
					} else if (id === "mod_btn") {
						con = confirm("수정 하시겠습니까?");
					}
				}
				if (con) {
					iu();
				}
				break;

			case 'del_btn':
				con = confirm("삭제 하시겠습니까?");
				if (con) {
					d();
				}
				break;
		}
	});

	/**
	 * @description 전체 초기화 버튼
	 * @author 황호진  @version 1.0, @last update 2021/11/12
	 */
	$("#reset_btn").on('click' , function () {
		var con = confirm('초기화 하시겠습니까?');
		if(con){
			form_reset('all');
		}
	});

	/**
	 * @description 추가 등록 버튼
	 * @author 황호진  @version 1.0, @last update 2021/11/12
	 */
	$("#add_reg_btn").on('click' , function () {
		form_reset('add');
	});

	/**
	 * @description 입력시 천자리 콤마 자동변환
	 * @author 황호진  @version 1.0, @last update 2021/11/12
	 */
	$("#amt").on("input", function() {
		var num = $(this).val().replace(/[^0-9]/gi,"");
		$(this).val(num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
	});

	/**
	 * @description 검색버튼 눌렀을때 작동
	 * @author 황호진  @version 1.0, @last update 2021/11/12
	 */
	$("#search_btn").off().click(function () {
		$("input[name='s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
		var cust = $("#cust").val();
		if(cust !== ''){
			get_payinfo();
		}
	});
	//================================================================================
});

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2021/11/12
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description 거래처 찾기 팝업에서 선택 눌렀을때 실행하는 함수
 * @author 황호진  @version 1.0, @last update 2021/11/10
 */
function cust_close(arg) {
	arg = JSON.parse(decodeURIComponent(arg)); // 필수
	cust_select_set('cust' , arg['cust_cd'], arg['cust_nm']); // 기타 화면별 사용법 참고
	form_reset('select2'); // 기타 화면별 사용법 참고
	get_payinfo(); // 기타 화면별 사용법 참고
	$('.biz-li-pop').bPopup().close(); // 필수
}

/**
 * @description select2 값 강제 설정 함수
 * @author 황호진  @version 1.0, @last update 2021/11/12
 */
function cust_select_set(name , arg1 , arg2) {
	$('#'+name).val(arg1).prop('selected',true);
	$("#select2-"+name+"-container").html(arg2);
}

/**
 * @description 매출/수금 화면 리스트 및 정보 가져오기
 * @author 황호진  @version 1.0, @last update 2021/11/12
 * insert 시 , update 시 , select2 선택시
 */
function get_payinfo() {
	var realtime_pagenum = $("li.paginationjs-page.J-paginationjs-page").val();
	realtime_pagenum = realtime_pagenum === 0 ? undefined : realtime_pagenum;

	var container = $('#pagination');	//pagination
	var url = '/acc/pay/get_payinfo';
	var type = 'get';
	var data = $('#frm').serialize();
	fnc_ajax(url , type , data)
		.done(function (res) {
			var vat = res.data.vat;
			var cust_cd = res.data.cust_cd;
			var cust_nm = res.data.cust_nm;
			var sales_person = res.data.sales_person;
			container.pagination({
				// pagination setting
				dataSource: res.data.list, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: true,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: true,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				pageNumber: realtime_pagenum, // 현재 페이지 세팅
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					var p = $("#p").val();

					//입력폼 모드에 따른 페이징 설정 다르게 하기
					if(p === 'up'){	//update
						var page = pagination.pageNumber;
						$("li.paginationjs-page.J-paginationjs-page").val(page); // 현재 페이지 값
					}else{			//insert
						$("li.paginationjs-page.J-paginationjs-page").val(1); // 현재 페이지 값
					}

					var len = res.length;
					$("#list_cnt").html(len);
					var str = '';
					var sum_amt = 0;
					if(len > 0){
						$.each(res, function (i, list) {
							var acc_gb_nm = convert_acc_gb(list.acc_gb);
							str += '<tr id="tr_'+list.acc_no+'">';
							str += '<td class="w5">'+list.acc_dt+'</td>';
							if(list.acc_gb === 'B' || list.acc_gb === 'M'){
								var arg = new Array();
								arg.push(list.cust_cd);
								arg.push(list.acc_no);
								str += '<td class="w5 tb_click" onclick=get_detail("'+arg+'")>'+acc_gb_nm+'</td>';
								str += '<td class="w7 tb_click" onclick=get_detail("'+arg+'")>'+list.acc_no+'</td>';
								str += '<td class="T-left Elli tb_click" onclick=get_detail("'+arg+'")>'+list.cust_nm+'</td>';
							}else{
								str += '<td class="w5">'+acc_gb_nm+'</td>';
								str += '<td class="w7">'+list.acc_no+'</td>';
								str += '<td class="T-left Elli">'+list.cust_nm+'</td>';
							}
							str += '<td class="w5">'+list.acc_type_nm+'</td>';
							str += '<td class="w5 T-right">'+commas(Number(list.price))+'원</td>';
							str += '<td class="w5 T-right">'+commas(Math.abs(Number(list.amt)))+'원</td>';
							str += '<td class="w5 T-right">'+commas(Math.abs(Number(list.tax)))+'원</td>';
							str += '<td class="w5 T-right">'+commas(Number(list.amt) + Number(list.tax) + Number(list.price)) +'원</td>';
							str += '<td class="T-left Elli">'+list.memo+'</td>';
							str += '<td class="w7">'+list.reg_ikey+'</td>';
							str += '<td class="w8">'+list.reg_dt+'</td>';
							str += '<td class="w7">'+list.mod_ikey+'</td>';
							str += '<td class="w8">'+list.mod_dt+'</td>';
							if(list.sysyn === 'Y'){
								str += '<td class="w5 red">삭제불가</td>';
							}else{
								str += '<td class="w5">삭제가능</td>';
							}
							str += '</tr>';
							sum_amt = commas(Number(list.sum_amt));
						});
						$("#data-container").html(str); // ajax data output

					}else{
						str += "<tr>";
						str += "<td class='T-left' colspan='14' style='padding-left: "+padding_left_v+"px;'>조회 가능한 데이터가 없습니다.</td>";
						str += "</tr>";
						$("#data-container").html(str); // ajax data output
					}
					//frm open
					//거래처 코드 설정
					$("#cust_cd").val(cust_cd);

					//거래처의 부가세로 설정
					if(p === 'in'){
						g_vat = vat;
						if(vat === 'Y'){
							$("#vat_y").prop('checked' , true);
						}else{
							$("#vat_n").prop('checked' , true);
						}
					}
					//update 입력폼일때 어느 데이터행을 선택했는지 설정
					if(p === 'up') {
						$(".ad").removeClass("active");
						$("#tr_" + g_acc_no).addClass("active");
					}
					//거래처명 setting
					$("#cust_nm").val(cust_nm);
					//영업담당자 setting
					$("#sales_person").val(sales_person);
					//미수잔액 setting
					$("#sum_amt").val(sum_amt);
					$(".before").hide();
					$(".after").show();
				}
			}) // page end

		}).fail(fnc_ajax_fail);
}

/**
 * @description 조회가능한 데이터 없을 경우 해상도에 따른 설정할 padding값 가져오기
 * @author 황호진  @version 1.0, @last update 2021/11/16
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
 * @description 결제구분 문자변환 함수
 * @author 황호진  @version 1.0, @last update 2021/11/12
 */
function convert_acc_gb(acc_gb) {
	var arr = {
		'S' 	: '매출',
		'B' 	: '수금',
		'M' 	: '금액차감',
		'C' 	: '취소(매출)',
		'R' 	: '반품(매출)'
	};
	return arr[acc_gb];
}

/**
 * @description 입력값 검증
 * @author 황호진  @version 1.0, @last update 2021/11/12
 */
function input_check() {
	if($('#acc_type').val() === '005'){
		var bl_uc = $("#bl_uc").val();
		if(bl_uc === undefined){
			toast('등록되어 있는 은행이 없습니다. 은행계좌 화면에 계좌를 등록하고 진행해주세요.', true, 'danger');
			return false;
		}else if(bl_uc === ''){
			toast('은행이 선택되어 있지 않습니다. 선택 후 진행해주세요.', true, 'danger');
			$('#bl_uc').focus();
			return false;
		}
	}
	if($('#amt').val() == "" || $('#amt').val() == 0){
		toast('금액을 입력해주세요.', true, 'danger');
		$('#amt').focus();
		return false;
	}
	return true;
}

/**
 * @description insert update
 * @author 황호진  @version 1.0, @last update 2021/11/12
 */
function iu() {
	var p = $("#p").val();

	$("#acc_no").val(g_acc_no);

	var url = '/acc/pay/iu';
	var type = 'post';
	var data = {
		'p'			: p,
		'acc_no'	: $("#acc_no").val(),
		'cust_cd'	: $("#cust_cd").val(),
		'acc_gb'	: $("input[name=acc_gb]:checked").val(),
		'acc_dt'	: $("#acc_dt").val(),
		'col_gb'	: $("#col_gb").val(),
		'acc_type'	: $("#acc_type").val(),
		'bl_uc'		: $("#bl_uc").val() === undefined ? '' : $("#bl_uc").val(),
		'acc_nm'	: $("#acc_nm").val(),
		'amt'		: $("#amt").val().replaceAll(',',''),
		'vat'		: $("input[name=vat]:checked").val(),
		'memo'		: $("#memo").val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if(p === 'in') {
					form_reset('ins');
					get_payinfo();
				}else{
					get_payinfo();
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description form_reset
 * @author 황호진  @version 1.0, @last update 2021/11/12
 * type = 리셋타입
 *        all 		: 화면 전체를 리셋
 *        ins 		: insert시 리셋
 *        add 		: 추가등록버튼 리셋
 *        select2 	: select2에서 데이터값이 변경될때 폼 초기화
 */
function form_reset(type) {
	//insert 입력폼으로 변경
	//================================================================================
	$("#p").val('in');
	$("#add_btn").show();
	$("#mod_btn").hide();
	$("#del_btn").hide();
	g_acc_no = '';
	$("#acc_no").val('');
	//================================================================================

	//input text값 초기화
	//================================================================================
	$("#acc_nm").val('');	//입금자명
	$("#amt").val('');		//금액
	$("#memo").val('');		//비고
	//================================================================================

	var now = new Date();
	var now_y = now.getFullYear();
	var now_m = now.getMonth();
	var now_d = now.getDate();

	var bl_uc = $("#bl_uc").val();

	if(type === 'all'){ // 완전초기화

		//pagination 초기화
		//================================================================================
		$('#pagination').pagination({
			dataSource: [],
			autoHidePrevious: true,
			autoHideNext: true
		});
		//================================================================================

		//입력폼 및 리스트 초기화
		//================================================================================
		$(".before").show();
		$(".after").hide();
		$("#data-container").html(list_init_str);
		$("#list_cnt").html(0);
		//================================================================================

		//검색폼 초기화
		//================================================================================
		$("#btn01").click();
		cust_select_set('cust' , '', '거래처 명을 입력해주세요.');
		//================================================================================

		//입력폼의 입력되어 있는 값 초기화
		//================================================================================
		$("#cust_cd").val('');
		//수금 선택
		$("#acc_gb01").prop('checked' , true);
		//오늘날짜로 초기화
		$("#acc_dt").val(conver_date(new Date(now_y , now_m , now_d)));
		//수금분류 초기화
		$("#col_gb option:eq(0)").prop("selected", true);
		//현금 선택
		$("#acc_type option:eq(0)").prop("selected", true).trigger('change');
		//통장값이 있는지 확인
		if(bl_uc !== undefined){
			$("#bl_uc option:eq(0)").prop("selected", true);
		}
		//부가세 초기화
		$("#vat_y").prop('checked' , true);
		//미수잔액 초기화
		$("#sum_amt").val('');
		//================================================================================
	}else if(type === 'add'){	//추가등록시 초기화
		//수금 선택
		$("#acc_gb01").prop('checked' , true);
		//오늘날짜로 초기화
		$("#acc_dt").val(conver_date(new Date(now_y , now_m , now_d)));
		//수금분류 초기화
		$("#col_gb option:eq(0)").prop("selected", true);
		//현금 선택
		$("#acc_type option:eq(0)").prop("selected", true).trigger('change');
		//통장값이 있는지 확인
		if(bl_uc !== undefined){
			$("#bl_uc option:eq(0)").prop("selected", true);
		}
		//거래처의 부가세로 설정
		if(g_vat === 'Y'){
			$("#vat_y").prop('checked' , true);
		}else{
			$("#vat_n").prop('checked' , true);
		}
	}else if(type === 'select2'){	//select2의 값이 변경될때 폼 초기화
		//수금 선택
		$("#acc_gb01").prop('checked' , true);
		//오늘날짜로 초기화
		$("#acc_dt").val(conver_date(new Date(now_y , now_m , now_d)));
		//수금분류 초기화
		$("#col_gb option:eq(0)").prop("selected", true);
		//현금 선택
		$("#acc_type option:eq(0)").prop("selected", true).trigger('change');
		//통장값이 있는지 확인
		if(bl_uc !== undefined){
			$("#bl_uc option:eq(0)").prop("selected", true);
		}
	}
}

/**
 * @description get_detail
 * @author 황호진  @version 1.0, @last update 2021/11/12
 */
function get_detail(arg) {
	arg = arg.split(',');
	var url = '/acc/pay/get_detail';
	var type = 'GET';
	var data = {
		cust_cd : arg[0],
		acc_no : arg[1]
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			$(".ad").removeClass("active");
			$("#tr_" + arg[1]).addClass("active");
			$("#p").val('up');
			$("#add_btn").hide();
			$("#mod_btn").show();
			if(res.data.sysyn === 'Y'){
				$("#del_btn").hide();
			}else{
				$("#del_btn").show();
			}

			g_acc_no = arg[1];
			$("#acc_no").val(arg[1]);

			if(res.data.acc_gb === 'B'){
				$("#acc_gb01").prop('checked' , true);
			}else if(res.data.acc_gb === 'M'){
				$("#acc_gb02").prop('checked' , true);
			}

			$("#acc_dt").val(res.data.acc_dt);
			$("#col_gb").val(res.data.col_gb);
			$("#acc_type").val(res.data.acc_type);

			if(res.data.acc_type === '005'){
				$('.bank').show();
				$("#bl_uc").val(res.data.bl_uc);
				$("#acc_nm").val(res.data.acc_nm);
			}else{
				$('.bank').hide();
			}

			$("#amt").val(Math.abs(Number(res.data.amt)).toLocaleString('ko-KR'));

			if(res.data.vat === 'Y'){
				$("#vat_y").prop('checked' , true);
			}else{
				$("#vat_n").prop('checked' , true);
			}

			$("#memo").val(res.data.memo);
		}).fail(fnc_ajax_fail);
}

/**
 * @description delete
 * @author 황호진  @version 1.0, @last update 2021/11/16
 */
function d() {
	var url = '/acc/pay/d';
	var type = 'post';
	var data = {
		cust_cd : $("#cust_cd").val(),
		acc_no  : $("#acc_no").val()
	};

	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				form_reset('add');
				get_payinfo();
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);

}
