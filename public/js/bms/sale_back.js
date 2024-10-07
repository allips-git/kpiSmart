/*================================================================================
 * @name: 황호진 - sale.js	거래처등록 화면
 * @version: 1.0.0, @date: 2021-10-18
 ================================================================================*/
var g_cust_cd = '';
var page_num = 1;
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var search_data = { 's' : null };
	get_list(search_data, 'select');
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
		get_list(search_data, 'select');			//분류리스트 호출
		form_reset('r');
	});
	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/30
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data, 'select');			//분류리스트 호출
			form_reset('r');
		}
	});

	/**
	 * @description 거래처리스트 가용여부 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/18
	 */
	$(document).on('click','.switch', function () {
		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con){
			var id = $(this).attr("id");
			var cust_cd = id.replace('switch_','');
			useyn_change(cust_cd);
		}
	});

	/**
	 * @description 입력폼 reset 함수
	 * @author 황호진  @version 1.0, @last update 2021/10/18
	 */
	$("#reset_btn").off().click(function () {		//리셋버튼
		var con = confirm('입력을 초기화 하시겠습니까?');
		if(con){
			form_reset('r');	//입력폼 초기화
		}
	});

	/**
	 * @description 입력폼 등록,수정,삭제 버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/18
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

	$("#reg_num1 , #reg_num2").on("input", function() {$(this).val( $(this).val().replace(/[^0-9]/gi,"") );});
	$("#biz_num , #tel , #fax , #ceo_tel , #person_tel , #bl_num").on("input", function() {$(this).val( $(this).val().replace(/[^0-9-]/gi,"") );});
	$("#limit_amt").on("input", function() {
		var num = $(this).val().replace(/[^0-9.]/gi,"");
		$(this).val(num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
	});
	//================================================================================
});

/**
 * @description get_list 함수(거래처 리스트)
 * @author 황호진  @version 1.0, @last update 2021/10/18
 * data = 검색창의 데이터
 */
function get_list(data , state) {
	$("#myTable").tablesorter({theme : 'blue'});	//테이블 정렬 기능
	var container = $('#pagination');	//pagination
	var url = '/biz/sale/get_list';
	var type = 'get';
	var p = $("#p").val();
	if(p === 'in' || state === 'select' || state === 'delete'){
		page_num = 1;
	}
	fnc_ajax(url , type , data)
		.done(function (res) {
			//console.log(res);
			var cust_grade = res.data.cust_grade;
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
					$("#list_cnt").html(len);

					var str = '';
					if(len > 0){
						var arr = [];

						$.each(res, function (i, list) {
							var grade = list.cust_grade !== 'amt0' ? cust_grade[list.cust_grade] : '';

							str += '<tr class="ad" id="tr_'+ list.cust_cd +'">';
							str += '<td>' + list.biz_no + '</td>';
							str += '<td class="tb_click" onclick=get_detail("'+ list.cust_cd +'")>' + list.cust_cd + '</td>';
							str += '<td class="tb_click T-left" onclick=get_detail("'+ list.cust_cd +'")>' + list.cust_nm + '</td>';
							str += '<td>' +
								'<label class="switch" id="switch_'+ list.cust_cd +'" style="cursor: pointer;">' +
								'<input type="checkbox" id="useyn_'+ list.cust_cd +'" disabled>' +
								'<span class="slider round"></span>' +
								'<span class="offtxt">off</span>' +
								'<span class="ontxt">on</span>' +
								'</label>' +
								'</td>';
							str += '<td>' + list.tel + '</td>';
							str += '<td>' + list.sales_person + '</td>';
							//str += '<td class="T-right">' + Number(list.limit_amt).toLocaleString('ko-KR') + '원</td>'; //소수점 제거
							str += '<td class="T-right">' + commas(Number(list.acc_amt)) + '원</td>';
							str += '<td>' + list.ceo_nm + '</td>';
							str += '<td>' + list.ceo_tel + '</td>';
							str += '<td>' + list.fax + '</td>';
							str += '<td>' + grade + '</td>';
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
								arr.push("useyn_"+list.cust_cd);
							}
						});
						$("#data-container").html(str); // ajax data output

						for(var i = 0; i < len; i++){	//가용여부 체크
							$('#'+arr[i]).prop('checked', true);
						}

						//update 입력폼일때 어느 데이터행을 선택했는지 설정
						if(p === 'up') {
							$(".ad").removeClass("active");
							$("#tr_" + g_cust_cd).addClass("active");
						}

						$("#myTable").trigger("update");
					}else{
						var v = padding_left_val('myTable');	//CSS 길이조절
						str += "<tr>";
						str += "<td colspan='18' style='text-align: left; padding-left: "+v+"px'>조회 가능한 데이터가 없습니다.</td>";
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
 * @author 황호진  @version 1.0, @last update 2021/10/18
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
 * @description 상세정보
 * @author 황호진  @version 1.0, @last update 2021/10/18
 */
function get_detail(cust_cd) {
	var url = '/biz/sale/get_detail';
	var type = 'GET';
	var data = {
		'cust_cd' : cust_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var row = res.data.row;
			var dlv_cd = res.data.dlv_cd;

			$(".ad").removeClass('active');
			$("#tr_"+cust_cd).addClass('active');
			$("#add_btn").hide();	//등록버튼 비활성화
			$("#mod_btn").show();	//수정버튼 활성화
			$("#p").val('up');		//입력폼 수정모드 up => update
			g_cust_cd = cust_cd;
			$("#p_cust_cd").val(cust_cd);

			//가용여부 설정
			if(row.useyn === 'Y') $("#useyn1").prop("checked",true);
			else if(row.useyn === 'N') $("#useyn2").prop("checked",true);

			//sysyn이 Y일때 삭제버튼이 보이면 안됨!
			if(row.sysyn === 'Y'){
				$("#del_btn").hide();	//삭제버튼 비활성화
			}else if(row.sysyn === 'N'){
				$("#del_btn").show();	//삭제버튼 활성화
			}

			//결제조건
			$("#pay_gb").val(row.pay_gb);
			//거래처 구분
			$("#cust_gb").val(row.cust_gb);
			//거래처
			$("#cust_grade").val(row.cust_grade);
			//배송구분
			$("#dlv_gb").val(row.dlv_gb);
			//거래처명
			$("#cust_nm").val(row.cust_nm);
			//사업자명
			$("#biz_nm").val(row.biz_nm);
			//사업자구분
			$("#biz_gb").val(row.biz_gb);
			//사업자등록번호
			$("#biz_num").val(row.biz_num);
			//업태
			$("#biz_class").val(row.biz_class);
			//종목
			$("#biz_type").val(row.biz_type);
			//전화번호
			$("#tel").val(row.tel);
			//팩스번호
			$("#fax").val(row.fax);
			//이메일주소
			$("#email").val(row.email);
			//사업장 우편번호
			$("#biz_zip").val(row.biz_zip);
			//사업장 소재지
			$("#address").val(row.address);
			//사업장 상세소재지지
			$("#addr_detail").val(row.addr_detail);
			//대표자
			$("#ceo_nm").val(row.ceo_nm);
			//대표자연락처
			$("#ceo_tel").val(row.ceo_tel);
			//담당자
			$("#person").val(row.person);
			//담당자연락처
			$("#person_tel").val(row.person_tel);
			//예금주 입력
			$("#holder_nm").val(row.holder_nm);
			//은행
			$("#bl_nm").val(row.bl_nm);
			//은행
			$("#bl_num").val(row.bl_num);
			//영업 담당자
			$("#sales_person").val(row.sales_person);
			//부가세
			$("#vat").val(row.vat);
			//미수금한도
			$("#limit_amt").val(Number(row.limit_amt).toLocaleString('ko-KR'));
			//비고
			$("#memo").val(row.memo);

			var str = '<option value="">미선택</option>';
			$.each(dlv_cd , function (i , list) {
				str += '<option value="' + list.ik + '">' + list.ba_gb + '</option>'
			});

			$("#dlv_cd_up").html(str).val(row.dlv_cd);

			//배송지관리
			$("#ba_in").hide();
			$("#ba_up").show();

		}).fail(fnc_ajax_fail);
}

/**
 * @description 가용여부 변경
 * @author 황호진  @version 1.0, @last update 2021/10/18
 */
function useyn_change(cust_cd) {
	var url = '/biz/sale/useyn_change';
	var type = 'POST';
	var data = {
		'cust_cd' : cust_cd
	};
	fnc_ajax(url, type , data)
		.done(function (res) {
			if(res.result){
				if($("#useyn_"+cust_cd).is(":checked") === true){
					$("#useyn_"+cust_cd).prop('checked', false);	//checked => false

					//입력폼의 데이터와 변경한 가용여부의 cust_cd가 같을때
					if(cust_cd === g_cust_cd){
						$("#useyn02").prop("checked",true);	//사용불가
					}
					toast('가용여부 Off로 변경 완료되었습니다.', false, 'info');
				}else{
					$("#useyn_"+cust_cd).prop('checked', true);	//checked => true

					//입력폼의 데이터와 변경한 가용여부의 cust_cd가 같을때
					if(cust_cd === g_cust_cd){
						$("#useyn01").prop("checked",true);	//사용가능
					}
					toast('가용여부 On으로 변경 완료되었습니다.', false, 'info');
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 배송지관리 팝업 부르기
 * @author 황호진  @version 1.0, @last update 2021/10/19
 */
function addr_mng() {
	var cust_cd = $("#p_cust_cd").val();
	var setting = 'width=1000, height=460, top=300, left=500';
	pop = window.open('/base/addr?s=t&cust_cd='+cust_cd, '배송지관리', setting);
}

/**
 * @description 입력폼 reset 함수
 * @author 황호진  @version 1.0, @last update 2021/10/18
 * type = 'i' insert 용 리셋방법! 필수입력란을 제외한 나머지값 초기화
 * type = 'r' 전체 리셋방법! 모든 입력란을 초기화
 */
function form_reset(type) {
	$("#add_btn").show();	//등록버튼 활성화
	$("#mod_btn").hide();	//수정버튼 비활성화
	$("#del_btn").hide();	//삭제버튼 비활성화
	$("#p").val('in');
	g_cust_cd = '';
	$("#p_cust_cd").val('');

	$("#cust_nm").val('');		//거래처명
	$("#biz_nm").val('');		//사업자명
	$("#biz_num").val('');		//사업자등록번호
	$("#biz_class").val('');	//업태
	$("#biz_type").val('');		//타입
	$("#tel").val('');			//전화번호
	$("#fax").val('');			//팩스
	$("#email").val('');		//이메일
	$("#biz_zip").val('');		//사업장 우편번호
	$("#address").val('');		//사업장 주소
	$("#addr_detail").val('');	//사업장 상세주소
	$("#ceo_nm").val('');		//대표자
	$("#ceo_tel").val('');		//대표자 연락처
	$("#person").val('');		//담당자
	$("#person_tel").val('');	//담당자 연락처
	$("#holder_nm").val('');	//예금주 입력
	$("#bl_nm option:eq(0)").prop("selected", true);//은행
	$("#bl_num").val('');		//계좌번호
	$("#sales_person").val('');	//영업담당자 초기화
	$("#vat option:eq(0)").prop("selected", true);	//부가세
	$("#limit_amt").val(Number('4000000').toLocaleString('ko-KR'));	//미수금한도
	$("#memo").val('');			//비고

	$("#ba_nm").val('');		//배송지명
	$("#ba_zip").val('');		//배송지우편번호
	$("#ba_addr").val('');		//배송지주소
	$("#ba_detail").val('');	//배송지상세주소

	$("#ba_in").show();
	$("#ba_up").hide();

	if(type === 'r'){
		$("#biz_gb option:eq(0)").prop("selected", true);
		$("#b_biz_num").show();
		$("#p_biz_num").hide();

		$("#pay_gb option:eq(0)").prop("selected", true);
		$("#cust_gb option:eq(0)").prop("selected", true);
		$("#cust_grade option:eq(0)").prop("selected", true);
		$("#dlv_gb option:eq(0)").prop("selected", true);
	}
}

/**
 * @description 입력값 검사 함수
 * @author 황호진  @version 1.0, @last update 2021/10/18
 */
function input_check() {
	var check_list = ['cust_nm' , 'tel' , 'limit_amt'];
	var flag = true;
	$.each(check_list, function (i, list) {
		if($('#'+list).val() == ""){
			var fleid_name = $("#"+list).attr('data-text');
			toast(fleid_name+'은(는) 필수입력입니다. 입력 후 다시 시도해주세요.', true, 'danger');
			$('#'+list).focus();
			flag = false;
			return false;
		}
	});
	if(!flag){
		return false;
	}


	//사업자등록번호 10자 or 13자(중복X)
	var biz_num = $("#biz_num").val();

	if(biz_num !== ""){
		var val = biz_num.replaceAll("-","");
		var len = val.length;
		if(len < 10){
			toast('등록번호는 10자리 이상 입력해주세요.', true, 'danger');
			$('#biz_num').focus();
			return false;
		}
	}

	//미수금한도
	if($('#limit_amt').val() == 0){
		toast('미수금한도는 0원으로 입력이 불가능합니다.', true, 'danger');
		$('#limit_amt').focus();
		return false;
	}
	var p = $("#p").val();
	//배송지명과 배송주소 검사
	if(p === 'in'){
		var ba_list = ['dlv_cd_in' , 'ba_zip' , 'ba_addr'];
		var ba_flag = true;
		$.each(ba_list, function (i, list) {
			if($('#'+list).val() !== ""){	//ba_nm , ba_zip , ba_addr 중 값이 기입된 란이 있는지
				ba_flag = false;
				return false;
			}
		});
		if(!ba_flag){	//있다면.... 다 기입이 되어야한다.
			var ba_val_flag = true;
			$.each(ba_list, function (i, list) {
				if($('#'+list).val() == ""){
					var fleid_name = $("#"+list).attr('data-text');
					toast(fleid_name+'의 값이 비어있습니다. 입력해주세요.', true, 'danger');
					$('#'+list).focus();
					ba_val_flag = false;
					return false;
				}
			});
			if(!ba_val_flag){
				return false;
			}
		}
	}

	return true;
}

/**
 * @description insert , update
 * @author 황호진  @version 1.0, @last update 2021/10/18
 */
function iu() {
	var p = $("#p").val();

	var biz_gb = $("#biz_gb").val();
	var biz_num;
	if(biz_gb === 'B'){
		biz_num = $("#biz_num").val();
	}else{
		biz_num = $("#reg_num1").val() + "-" + $("#reg_num2").val();
	}

	$("#p_cust_cd").val(g_cust_cd);
	var url = '/biz/sale/iu';
	var type = 'POST';
	var data = {
		'p'				:	p,
		'p_cust_cd'		:	$("#p_cust_cd").val(),
		'useyn'			:	$('input[name=useyn]:checked').val(),
		'pay_gb'		:	$("#pay_gb").val(),
		'cust_gb'		:	$("#cust_gb").val(),
		'cust_grade'	:	$("#cust_grade").val(),
		'dlv_gb'		:	$("#dlv_gb").val(),
		'cust_nm'		:	$("#cust_nm").val(),
		'biz_nm'		:	$("#biz_nm").val(),
		'biz_num'		:	biz_num,
		'biz_gb'		:	biz_gb,
		'biz_class'		:	$("#biz_class").val(),
		'biz_type'		:	$("#biz_type").val(),
		'tel'			:	$("#tel").val(),
		'fax'			:	$("#fax").val(),
		'email'			:	$("#email").val(),
		'biz_zip'		:	$("#biz_zip").val(),
		'address'		:	$("#address").val(),
		'addr_detail'	:	$("#addr_detail").val(),
		'ceo_nm'		:	$("#ceo_nm").val(),
		'ceo_tel'		:	$("#ceo_tel").val(),
		'person'		:	$("#person").val(),
		'person_tel'	:	$("#person_tel").val(),
		'holder_nm'		:	$("#holder_nm").val(),
		'bl_nm'			:	$("#bl_nm").val(),
		'bl_num'		:	$("#bl_num").val(),
		'sales_person'	:	$("#sales_person").val(),
		'vat'			:	$("#vat").val(),
		'limit_amt'		:	$("#limit_amt").val().replace(/,/g,""),
		'ba_zip'		:	$("#ba_zip").val(),
		'ba_addr'		:	$("#ba_addr").val(),
		'ba_detail'		:	$("#ba_detail").val(),
		'dlv_cd_in'		:	$("#dlv_cd_in").val(),
		'dlv_cd_up'		:	$("#dlv_cd_up").val(),
		'memo'			:	$("#memo").val(),
	};

	var search_data;

	fnc_ajax(url, type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if(p === 'in'){
					$('#frm')[0].reset();
					get_list({'s' : null} , 'insert');
					form_reset('i');
				}else{
					search_data = $("#frm").serialize();
					get_list(search_data , 'update');	// 은행계좌 리스트 재호출
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description delete
 * @author 황호진  @version 1.0, @last update 2021/10/19
 */
function d() {
	var url = '/biz/sale/d';
	var type = 'post';
	var data = {
		'p_cust_cd'	:	$("#p_cust_cd").val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				get_list({'s':null} , 'delete');
				form_reset('r');
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 카카오톡 팝업
 * @author 황호진  @version 1.0, @last update 2021/10/19
 */
function kakao_popup(cust_cd) {
	open_popup('/base/kakao?cust_cd='+cust_cd, '카카오톡발송', 1100, 748);
}
