/*================================================================================
 * @name: 황호진 - item.js	통합제품등록
 * @version: 1.0.0, @date: 2021-09-16
 ================================================================================*/
var g_item_cd = '';		//전역변수 item_cd
var page_num = 1;
$(function () {
	//화면이 맨 처음 로드될때!
	//================================================================================
	var search_data = {
		's' : null
	};
	get_list(search_data , 'select');			//리스트 호출
	get_search_prod_master();		//제품군 설정
	get_frm_prod_detail();			//입력폼의 소속제품군 설정
	get_frm_item_lv1();				//제품분류 가져오는 함수
	//================================================================================

	//이벤트 연동!
	//================================================================================
	/**
	 * @description 검색폼 제품군_전체 이벤트 연동 => 값에 따라 소속제품군 값이 재설정
	 * @author 황호진  @version 1.0, @last update 2021/09/24
	 */
	$(document).on("input","#op_2",function () {
		var pm_val = $(this).val();
		get_search_prod_detail(pm_val);
	});

	/**
	 * @description 검색버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/09/24
	 */
	$("#search_btn").off().click(function () {
		$("input[name='s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data , 'select');			//분류리스트 호출
		form_reset('r');
	});

	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/24
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			$("input[name='s']").val('t');		//검색하기 때문에 't' 라는 값이 주어짐
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data , 'select');			//분류리스트 호출
			form_reset('r');
		}
	});

	/**
	 * @description 입력폼 제품군 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/24
	 */
	$(document).on("input","#pm_cd",function () {
		get_frm_prod_detail();	//값이 바뀌면 입력폼의 소속제품군이 재설정
	});

	/**
	 * @description 입력폼 대분류 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/24
	 */
	$(document).on("input","#item_lv1",function () {
		var val = $(this).val();
		get_item_lv("item_lv2",val);	//target_id , value
	});

	/**
	 * @description 입력폼 중분류 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/24
	 */
	$(document).on("input","#item_lv2",function () {
		var val = $(this).val();
		get_item_lv("item_lv3",val);	//target_id , value
	});

	/**
	 * @description 제품리스트 가용여부 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/24
	 */
	$(document).on('click','.switch', function () {
		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con){
			var id = $(this).attr("id");
			var cd = id.replace('switch_','');			//item_cd값 추출
			useyn_change(cd);			//id , sysyn , useyn
		}
	});

	/**
	 * @description 입력폼 등록,수정,삭제 버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/09/24
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
			case 'del_btn':	//2021-09-24 기준 삭제버튼 (사용안함) 차 후 확장하여 생길수 있음
				con = confirm("삭제 하시겠습니까?");
				if(con) {
					d();	//구현안된 함수
				}
				break;
		}
	});

	/**
	 * @description 입력폼 reset 함수
	 * @author 황호진  @version 1.0, @last update 2021/09/24
	 */
	$("#reset_btn").off().click(function () {		//리셋버튼
		var con = confirm('입력을 초기화 하시겠습니까?');
		if(con){
			form_reset('r');	//입력폼 초기화
		}
	});

	$("#unit").on('change' , function () {
		var v = $(this).val();
		if(v === '001' || v === '002'){
			$("#unit_form_1").hide();
			$("#unit_form_2").show();
		}else{
			$("#unit_form_1").show();
			$("#unit_form_2").hide();
		}
	});

	/**
	 * @description 입력폼 금액부분 적용 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/09/27
	 */
	$("#unit_amt , #sale_amt , #unit_amt_1 , #unit_amt_2 , #unit_amt_3 , " +
		"#unit_amt_4 , #unit_amt_5 , #unit_amt_6 , #unit_amt_7 , #unit_amt_8" +
		"#unit_amt_9 , #unit_amt_10").on("input", function() {
			var num = $(this).val().replace(/[^0-9.]/gi,"");
			$(this).val(num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
		});

	/**
	 * @description 입력폼 단위부분 적용 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/09/27
	 */
	$("#size , #min_qty , #min_width , #min_height , #max_width , #max_height").on("input", function() {
		$(this).val($(this).val().replace(/[^0-9.]/gi,""));
	});

	/**
	 * @description 단가명칭관리 팝업 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/10/06
	 */
	$(document).on('click', '#amt_mod_btn', function () {
		var con = confirm('단가명칭을 수정하시겠습니까?');
		if(con){
			amt_nm_change();
		}
	});

	/**
	 * @description 소속제품군에 따른 단위 설정
	 * @author 황호진  @version 1.0, @last update 2022/01/18
	 */
	$('#pd_cd').on('change' , function () {
		get_frm_unit();
	});
	//================================================================================
});

/**
 * @description 제품리스트 호출
 * @author 황호진  @version 1.0, @last update 2021/09/24
 * data = 검색창 입력폼에 대한 것들...
 * s	= t    일때 검색
 * s	= null 기본상태
 */
function get_list(data , state) {
	$("#myTable").tablesorter({theme : 'blue'});	//테이블 정렬 기능
	var container = $('#pagination');	//pagination
	var url = '/base/item_list/get_list';
	var type = 'GET';
	var p = $("#p").val();
	if(p === 'in' || state === 'select'){
		page_num = 1;
	}
	fnc_ajax(url , type , data)
		.done(function (res) {
			$("#list_cnt").html(res.data.count);	//총 검색 수 설정
			container.pagination({
				// pagination setting
				dataSource: res.data.list, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 100,	//page 갯수 리스트가 100개 간격으로 페이징한다는 의미
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
							var proc_gb = '';
							//제작구분 하드코딩
							if(list.proc_gb === '1'){
								proc_gb = '생산제품';
							}else if(list.proc_gb === '2'){
								proc_gb = '외주제품';
							}else if(list.proc_gb === '3'){
								proc_gb = '기타제품';
							}
							str += '<tr class="ad" id="tr_'+ list.item_cd +'">';
							str += '<td>'+list.item_no+'</td>';
							str += '<td class="tb_click Elli" onclick=get_detail("'+ list.item_cd +'")>' + list.pd_cd + '</td>';
							str += '<td class="tb_click Elli" onclick=get_detail("'+ list.item_cd +'")>' + proc_gb + '</td>';
							str += '<td class="tb_click Elli" onclick=get_detail("'+ list.item_cd +'")>' + list.item_gb + '</td>';
							str += '<td class="tb_click Elli" onclick=get_detail("'+ list.item_cd +'")>' + list.item_cd + '</td>';
							str += '<td class="tb_click Elli T-left" onclick=get_detail("'+ list.item_cd +'")>' + list.item_nm + '</td>';
							str += '<td class="tb_click Elli T-left" onclick=get_detail("'+ list.item_cd +'")>' + list.item_lv4 + '</td>';
							str += '<td>' +
									'<label class="switch" id="switch_'+ list.item_cd +'" data-sysyn="'+list.sysyn+'" data-useyn="'+list.useyn+'" style="cursor: pointer;">' +
									'<input type="checkbox" id="useyn_'+ list.item_cd +'" disabled>' +
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
								arr.push("useyn_"+list.item_cd);
							}
						});
						$("#data-container").html(str); // ajax data output

						for(var i = 0; i < len; i++){	//가용여부 체크
							$('#'+arr[i]).prop('checked', true);
						}
						if(p === 'up') {	//update 입력폼일때 어느 데이터행을 선택했는지 설정
							$(".ad").removeClass("active");
							$("#tr_" + g_item_cd).addClass("active");
						}

						$("#myTable").trigger("update");
					}else{	//조회할 데이터가 없을때
						var v = padding_left_val('myTable');
						str += "<tr><td colspan='15' style='text-align: left; padding-left: "+v+"px'>조회 가능한 데이터가 없습니다.</td></tr>";
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
		result = id_width/3;
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
 * @description 검색창 제품군 리스트 불러오기
 * @author 황호진  @version 1.0, @last update 2021/09/24
 */
function get_search_prod_master() {
	var url = '/base/item_list/get_search_prod_master';
	var type = 'GET';
	fnc_ajax(url , type , {})
		.done(function (res) {
			var len = res.data.length;
			var str = '<option value="">제품군_전체</option>';	//전체를 검색할수 있도록 맨 위에 전체 넣기 작업
			if(len > 0){
				$.each(res.data, function (i, list) {
					str += '<option value="'+list.pm_cd+'">'+list.pm_nm+'</option>';
				});
			}
			$("#op_2").html(str);
		}).fail(fnc_ajax_fail);
}

/**
 * @description 검색창 제품군 값에 따른 소속제품군 재설정
 * @author 황호진  @version 1.0, @last update 2021/09/24
 * pm_val	= 제품군 값
 * pm_val 가 "" 일땐 제품군_전체가 선택되어있다는 의미
 */
function get_search_prod_detail(pm_val) {
	if(pm_val !== ""){
		var url = '/base/item_list/get_search_prod_detail';
		var type = 'GET';
		var data = {
			pm_cd : pm_val
		};
		fnc_ajax(url , type , data)
			.done(function (res) {
				var len = res.data.length;
				var str = '<option value="">소속제품군_전체</option>';	//전체를 검색할수 있도록 값 설정
				if(len > 0){
					$.each(res.data, function (i, list) {
						str += '<option value="'+list.pd_cd+'">'+list.pd_nm+'</option>';
					});
				}
				$("#op_3").html(str);
			}).fail(fnc_ajax_fail);
	}else{
		var str = '<option value="">소속제품군_전체</option>';
		$("#op_3").html(str);
	}
}

/**
 * @description 제품리스트의 클릭한 데이터 행의 상세내용 가져오기
 * @author 황호진  @version 1.0, @last update 2021/09/24
 * item_cd	= 제품코드
 */
function get_detail(item_cd) {
	var url = '/base/item_list/get_detail';
	var type = 'GET';
	var data = {
		item_cd : item_cd
	};
	fnc_ajax(url,type,data)
		.done(function (res) {
			var row = res.data.row;
			var pd_cd = res.data.pd_cd;
			var item_lv1 = res.data.item_lv1;
			var item_lv2 = res.data.item_lv2;
			var item_lv3 = res.data.item_lv3;

			$(".ad").removeClass('active');			//ad 클래스가 달린 모든 태그에서 actice 클래스 제거
			$("#tr_"+item_cd).addClass('active');	//선택한 데이터 행에 actice 클래스 부여
			$("#add_btn").hide();	//등록버튼 비활성화
			$("#mod_btn").show();	//수정버튼 활성화
			$("#p").val('up');		//입력폼 수정모드 up => update
			$("#p_item_cd").val(item_cd);	//가져온 item_cd 값 설정
			g_item_cd = item_cd;	//전역변수에 설정

			$("#dv_item").css('display', 'none');
			$("#dv_item2").css('display', 'inline');

			//가용여부 설정
			if(row.useyn === 'Y') $("#useyn1").prop("checked",true);
			else if(row.useyn === 'N') $("#useyn2").prop("checked",true);

			//sysyn이 Y일때 삭제버튼이 보이면 안됨!
			if(row.sysyn === 'Y'){
				$("#del_btn").hide();	//삭제버튼 비활성화
			}else if(row.sysyn === 'N'){
				$("#del_btn").show();	//삭제버튼 활성화
			}

			//제품군 설정
			$("#pm_cd").val(row.pm_cd).prop('disabled', true).addClass('gray');
			//소속제품군 설정
			$("#pd_cd").html('<option value="'+pd_cd.pd_cd+'">'+pd_cd.pd_nm+'</option>').prop('disabled', true).addClass('gray');

			//제품유형 설정
			$("#item_gb").val(row.item_gb);
			//제품구분 설정
			$("#prod_gb").val(row.prod_gb);
			//거래구분 설정
			$("#trade_gb").val(row.trade_gb);
			//제작구분 설정
			$("#proc_gb").val(row.proc_gb);
			//제품분류(대분류) 설정
			var str1 = '<option value="'+item_lv1.ikey+'">'+item_lv1.key_name+'</option>';
			$("#item_lv1").html(str1).prop('disabled', true).addClass('gray');
			//원단분류(중분류) 설정
			var str2 = '<option value="'+item_lv2.ikey+'">'+item_lv2.key_name+'</option>';
			$("#item_lv2").html(str2).prop('disabled', true).addClass('gray');
			//색상분류(소분류) 설정
			var str3 = '<option value="'+item_lv3.ikey+'">'+item_lv3.key_name+'</option>';
			$("#item_lv3").html(str3).prop('disabled', true).addClass('gray');
			//샷시코드 설정
			$("#item_lv4").val(row.item_lv4);
			//최소주문사이즈(규격) 설정
			$("#size").val(val_convert(row.size , 'u'));

			//단위 설정
			get_frm_unit(row.unit);

			var spec = JSON.parse(row.spec);
			if(row.unit === '001' || row.unit === '002'){
				//최소주문수량
				$("#min_qty").val('');
				//최소금액치수(가로)
				$("#min_width").val(spec['min_width']);
				//최소금액치수(세로)
				$("#min_height").val(spec['min_height']);
				//최대(가로)
				$("#max_width").val(spec['max_width']);
				//최대(세로)
				$("#max_height").val(spec['max_height']);
			}else{
				//최소주문수량
				$("#min_qty").val(spec['min_qty']);
				//최소금액치수(가로)
				$("#min_width").val('');
				//최소금액치수(세로)
				$("#min_height").val('');
				//최대(가로)
				$("#max_width").val('');
				//최대(세로)
				$("#max_height").val('');
			}
			//매입단가
			$("#unit_amt").val(val_convert(row.unit_amt , 'm'));
			//판매단가
			$("#sale_amt").val(val_convert(row.sale_amt , 'm'));
			//등급단가1
			$("#unit_amt_1").val(val_convert(row.unit_amt_1 , 'm'));
			//등급단가2
			$("#unit_amt_2").val(val_convert(row.unit_amt_2 , 'm'));
			//등급단가3
			$("#unit_amt_3").val(val_convert(row.unit_amt_3 , 'm'));
			//등급단가4
			$("#unit_amt_4").val(val_convert(row.unit_amt_4 , 'm'));
			//등급단가5
			$("#unit_amt_5").val(val_convert(row.unit_amt_5 , 'm'));
			//등급단가6
			$("#unit_amt_6").val(val_convert(row.unit_amt_6 , 'm'));
			//등급단가7
			$("#unit_amt_7").val(val_convert(row.unit_amt_7 , 'm'));
			//등급단가8
			$("#unit_amt_8").val(val_convert(row.unit_amt_8 , 'm'));
			//등급단가9
			$("#unit_amt_9").val(val_convert(row.unit_amt_9 , 'm'));
			//등급단가10
			$("#unit_amt_10").val(val_convert(row.unit_amt_10 , 'm'));
			//비고
			$("#memo").val(row.memo);
		}).fail(fnc_ajax_fail);
}

/**
 * @description 입력폼 값 바꾸기(숫자한정)
 * @author 황호진  @version 1.0, @last update 2021/09/27
 * n = 숫자
 * type = 변환시킬 타입 m(Money) , u(Unit)
 */
function val_convert(n , type) {
	var v = Number(n);
	if(v === 0){
		return "";
	}
	if(type === 'm'){
		return v.toLocaleString('ko-KR');
	}else if(type === 'u'){
		return v;
	}
}

/**
 * @description 입력폼 소속제품군 설정
 * @author 황호진  @version 1.0, @last update 2021/09/23
 * seleted_data = 설정되면서 소속제품군의 값이 선택되어야할 경우 사용! 보통은 undefined
 */
function get_frm_prod_detail() {
	var url = '/base/item_list/get_frm_prod_detail';
	var type = 'GET';
	var data = {
		pm_cd : $("#pm_cd").val()
	};
	fnc_ajax(url,type,data)
		.done(function (res) {
			var str = '';
			$.each(res.data, function (i, list) {
				str += '<option value="'+list.pd_cd+'">'+list.pd_nm+'</option>';
			});
			$("#pd_cd").html(str);
			$("#pd_cd").trigger('change');
		}).fail(fnc_ajax_fail);

}

/**
 * @description 중분류,소분류 설정
 * @author 황호진  @version 1.0, @last update 2021/09/24
 * id	= 설정할 태그의 id(중분류,소분류)
 * val	= 상위 태그의 값(중분류 설정시 대분류 값이라고 보면 됨)
 */
function get_item_lv(id , val) {
	var url = '/base/item_list/get_item_lv';
	var type = 'GET';
	var data = {
		val : val
	};
	fnc_ajax(url,type,data)
		.done(function (res) {
			var str = '';
			$.each(res.data, function (i, list) {
				str += '<option value="'+list.ikey+'">'+list.key_name+'</option>';
			});
			$("#"+id).html(str).trigger("input");
		}).fail(fnc_ajax_fail);
}

/**
 * @description 가용여부 값 변경
 * @author 황호진  @version 1.0, @last update 2021/09/24
 * cd		= item_cd
 * sysyn	= 시스템코드
 * useyn	= 가용여부
 */
function useyn_change(cd) {
	var url = '/base/item_list/useyn_change';
	var type = 'POST';
	var data = {
		'cd' : cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				if($("#useyn_"+cd).is(":checked") === true){
					$("#useyn_"+cd).prop('checked', false);	//checked => false

					//변경한 가용여부 item_cd가 입력폼에 기입된 item_cd와 같을때
					if(cd === g_item_cd){
						$("#useyn2").prop("checked",true);	//사용불가
					}
					toast('가용여부 Off로 변경 완료되었습니다.', false, 'info');
				}else{
					$("#useyn_"+cd).prop('checked', true);	//checked => true

					//변경한 가용여부 item_cd가 입력폼에 기입된 item_cd와 같을때
					if(cd === g_item_cd){
						$("#useyn1").prop("checked",true);	//사용가능
					}
					toast('가용여부 On으로 변경 완료되었습니다.', false, 'info');
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 대분류 설정
 * @author 황호진  @version 1.0, @last update 2021/09/24
 */
function get_frm_item_lv1() {
	var url = '/base/item_list/get_frm_item_lv1';
	var type = 'GET';
	fnc_ajax(url,type,{})
		.done(function (res) {
			var len = res.data.length;
			if(len > 0){	//len이 0일 경우 등록할수 있는 제품이 없다는 것을 의미
				var str = '';
				$.each(res.data, function (i, list) {
					str += '<option value="'+list.ikey+'">'+list.key_name+'</option>';
				});
				$("#item_lv1").html(str).trigger("input");
			}else{
				$("#dv_item").css('display', 'inline');	//입력할수 없다는 메세지 활성화
				$("#dv_item2").css('display', 'none');	//대,중,소 비활성화
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 입력값 검사 함수
 * @author 황호진  @version 1.0, @last update 2021/09/24
 */
function input_check(){
	if($('input[name=useyn]:checked').val() == ""){
		toast('가용여부 선택후 시도해주세요.', true, 'danger');
		return false;
	}
	if($('#pm_cd').val() == ""){
		toast('제품군을 선택해주세요.', true, 'danger');
		$('#pm_cd').focus();
		return false;
	}
	if($('#pd_cd').val() == ""){
		toast('소속제품군을 선택해주세요.', true, 'danger');
		$('#pd_cd').focus();
		return false;
	}
	if($('#trade_gb').val() == ""){
		toast('거래구분을 선택해주세요.', true, 'danger');
		$('#trade_gb').focus();
		return false;
	}
	if($('#proc_gb').val() == ""){
		toast('제작구분을 선택해주세요.', true, 'danger');
		$('#proc_gb').focus();
		return false;
	}
	if($('#item_gb').val() == ""){
		toast('제품구분을 선택해주세요.', true, 'danger');
		$('#item_gb').focus();
		return false;
	}
	if($('#dv_item2').css("display") == "none"){
		toast('등록할 제품이 없습니다.', true, 'danger');
		return false;
	}
	if($('#item_lv1').val() == ""){
		toast('제품분류를 선택해주세요.', true, 'danger');
		$('#item_lv1').focus();
		return false;
	}
	if($('#item_lv2').val() == ""){
		toast('원단분류를 선택해주세요.', true, 'danger');
		$('#item_lv2').focus();
		return false;
	}
	if($('#item_lv3').val() == ""){
		toast('색상분류를 선택해주세요.', true, 'danger');
		$('#item_lv3').focus();
		return false;
	}
	if($('#size').val() == "" || $('#size').val() == 0){
		toast('기본단위가 바르지 않습니다. 필수 입력 확인 후 이용 바랍니다.', true, 'danger');
		$('#size').focus();
		return false;
	}
	if($('#sale_amt').val() == "" || $('#sale_amt').val() == 0){
		toast('판매단가가 바르지 않습니다. 필수 입력 확인 후 이용 바랍니다.', true, 'danger');
		$('#sale_amt').focus();
		return false;
	}
	return true;
}

/**
 * @description insert update
 * @author 황호진  @version 1.0, @last update 2021/09/24
 */
function iu() {
	var p = $("#p").val();

	$("#p_item_cd").val(g_item_cd);

	var spec = {};

	var unit = $("#unit").val();

	if(unit === '001' || unit === '002'){
		spec['min_width'] = Number($("#min_width").val()) === 0 ? '' : Number($("#min_width").val());
		spec['min_height'] = Number($("#min_height").val()) === 0 ? '' : Number($("#min_height").val());
		spec['max_width'] = Number($("#max_width").val()) === 0 ? '' : Number($("#max_width").val());
		spec['max_height'] = Number($("#max_height").val()) === 0 ? '' : Number($("#max_height").val());
	}else{
		spec['min_qty'] = Number($("#min_qty").val()) === 0 ? '' : Number($("#min_qty").val());
	}
	var json_data = JSON.stringify(spec);

	var url = '/base/item_list/iu';
	var type = 'POST';
	var data = {
		'p' 			: p,
		'item_cd' 		: g_item_cd,								//아이템코드
		'useyn' 		: $('input[name=useyn]:checked').val(),		//가용여부
		'pm_cd' 		: $("#pm_cd").val(),						//제품군
		'pd_cd' 		: $("#pd_cd").val(),						//소속제품군
		'trade_gb' 		: $("#trade_gb").val(),						//거래구분
		'proc_gb' 		: $("#proc_gb").val(),						//제작구분
		'prod_gb' 		: $("#prod_gb").val(),						//제품구분
		'item_gb' 		: $("#item_gb").val(),						//제품유형
		'item_lv1' 		: $("#item_lv1").val(),						//대분류
		'item_lv2' 		: $("#item_lv2").val(),						//중분류
		'item_lv3' 		: $("#item_lv3").val(),						//소분류
		'item_lv4' 		: $("#item_lv4").val(),						//추가분류
		'size' 			: $("#size").val(),							//값
		'unit' 			: unit,										//단위
		'spec' 			: json_data,								//JSON 데이터
		'unit_amt' 		: $("#unit_amt").val().replace(/,/g,""),	//매입단가
		'sale_amt' 		: $("#sale_amt").val().replace(/,/g,""),	//판매단가
		'unit_amt_1' 	: $("#unit_amt_1").val().replace(/,/g,""),	//등급
		'unit_amt_2' 	: $("#unit_amt_2").val().replace(/,/g,""),	//등급
		'unit_amt_3' 	: $("#unit_amt_3").val().replace(/,/g,""),	//등급
		'unit_amt_4' 	: $("#unit_amt_4").val().replace(/,/g,""),	//등급
		'unit_amt_5' 	: $("#unit_amt_5").val().replace(/,/g,""),	//등급
		'unit_amt_6' 	: $("#unit_amt_6").val().replace(/,/g,""),	//등급
		'unit_amt_7' 	: $("#unit_amt_7").val().replace(/,/g,""),	//등급
		'unit_amt_8' 	: $("#unit_amt_8").val().replace(/,/g,""),	//등급
		'unit_amt_9' 	: $("#unit_amt_9").val().replace(/,/g,""),	//등급
		'unit_amt_10' 	: $("#unit_amt_10").val().replace(/,/g,""),	//등급
		'memo' 			: $("#memo").val()							//비고
	};

	var s = $("input[name='s']").val();
	var search_data;

	fnc_ajax(url, type, data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if(p === 'in'){
					//검색창 제품군 재설정
					get_search_prod_master();
					//검색창 소속제품군 재설정
					get_search_prod_detail("");
					//리스트 재호출
					search_data = { 's' : null};
					get_list(search_data , 'insert');
					//form_reset('i');
					get_frm_item_lv1();
				}else{
					search_data = $("#frm").serialize();
					get_list(search_data , 'update');	//통합제품 리스트 재호출
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 삭제 미구현
 * @author 황호진  @version 1.0, @last update 2021/09/24
 */
function d() {
	
}

/**
 * @description 입력폼 reset 함수
 * @author 황호진  @version 1.0, @last update 2021/09/24
 * type = 'i' insert 용 리셋방법! 필수입력란을 제외한 나머지값 초기화
 * type = 'r' 전체 리셋방법! 모든 입력란을 초기화
 */
function form_reset(type) {
	$("#add_btn").show();	//등록버튼 활성화
	$("#mod_btn").hide();	//수정버튼 비활성화
	$("#del_btn").hide();	//삭제버튼 비활성화
	$("#p").val('in');
	$("#p_item_cd").val('');
	g_item_cd = '';
	$("#pm_cd").prop('disabled', false).removeClass('gray');
	$("#pd_cd").prop('disabled', false).removeClass('gray');
	get_frm_prod_detail();
	$("#item_lv4 option:eq(0)").prop("selected", true);

	//=====================================================================
	$("#min_qty").val('');	//최소주문수량
	$("#min_width").val('');		//최소금액치수(가로)
	$("#min_height").val('');		//최소금액치수(세로)
	$("#max_width").val('');		//한계치수(가로)
	$("#max_height").val('');		//한계치수(세로)
	//=====================================================================

	$("#unit_amt").val('');		//매입단가
	$("#sale_amt").val('');		//판매단가
	$("#unit_amt_1").val('');	//등급
	$("#unit_amt_2").val('');	//등급
	$("#unit_amt_3").val('');	//등급
	$("#unit_amt_4").val('');	//등급
	$("#unit_amt_5").val('');	//등급
	$("#unit_amt_6").val('');	//등급
	$("#unit_amt_7").val('');	//등급
	$("#unit_amt_8").val('');	//등급
	$("#unit_amt_9").val('');	//등급
	$("#unit_amt_10").val('');	//등급
	$("#memo").val('');
	get_frm_item_lv1();
	$("#item_lv1").prop('disabled', false).removeClass('gray');
	$("#item_lv2").prop('disabled', false).removeClass('gray');
	$("#item_lv3").prop('disabled', false).removeClass('gray');
	if(type === 'r') {
		$("#unit_form_1").hide();
		$("#unit_form_2").show();
		//가용여부 초기화
		$("#useyn1").prop("checked",true);
		//제품군 초기화
		$("#pm_cd option:eq(0)").prop("selected", true).trigger('input');
		//제품구분 초기화
		$("#item_gb option:eq(0)").prop("selected", true);
		//거래구분 초기화
		$("#trade_gb option:eq(0)").prop("selected", true);
		//제작구분 초기화
		$("#proc_gb option:eq(0)").prop("selected", true);
		//단위 초기화
		$("#size").val('');
		//기본단위 초기화
		$("#unit option:eq(0)").prop("selected", true).trigger('change');
	}
}

/**
 * @description 단가명 변경
 * @author 황호진  @version 1.0, @last update 2021/10/06
 */
function amt_nm_change() {
	//10개의 값 중복체크
	var nm_arr = ['amt1','amt2','amt3','amt4','amt5','amt6','amt7','amt8','amt9','amt10'];
	var val_arr = [];
	for(var i = 0; i < nm_arr.length; i++){
		var val = $("#"+nm_arr[i]).val();
		if(val !== ""){
			val_arr.push(val);
		}
	}
	var set = new Set(val_arr);
	if(set.size === 10){
		var url = '/base/item_list/amt_update';
		var type = 'POST';
		var data = $("#amt_frm").serialize();
		fnc_ajax(url , type , data)
			.done(function (res) {
				if(res.result){
					location.reload();
				}else{
					toast(res.msg, true, 'danger');
				}
			}).fail(fnc_ajax_fail);
	}else{
		toast('입력하신 단가명칭에 빈값 및 중복이 있어 수정이 불가능합니다.', true, 'danger');
	}
}

/**
 * @description 소속제품군에 따른 단위 설정
 * @author 황호진  @version 1.0, @last update 2022/01/18
 */
function get_frm_unit(val = undefined) {
	var url = '/base/item_list/get_frm_unit';
	var type = 'GET';
	var data = {
		pd_cd : $('#pd_cd').val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var str = '';
			for(var i = 0; i < res.data.length; i++){
				str += '<option value="'+res.data[i]['code_sub']+'" data-text="'+res.data[i]['code_nm']+'">'+res.data[i]['code_nm']+'</option>';
			}	//for end
			$('#unit').html(str);
			if(val !== undefined){
				$('#unit').val(val);
			}
			$('#unit').trigger('change');
		}).fail(fnc_ajax_fail);
}
