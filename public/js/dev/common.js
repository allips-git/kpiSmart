/*================================================================================
 * 개발팀 공통 js - custom function package
 * @version: 1.0.0
 ================================================================================*/


// 프린터 서버(tomcat) 로컬, 외부 도메인(URL)
var print_local = 'http://print.localhost:8080/bms_print';
var print_domain = 'https://print.allips.kr:8443/bms';
var print_gb = ''

var print_host = $(location).attr('host');
//var gb = host == "test.localhost" ? 't' : 'b';
switch (print_host) {
	case '3d-erp.allips.kr':
	case 'erp.3d-space.co.kr':
		print_gb = '3d_erp';
		break;
	case '3d_erp.localhost':
		print_gb = '3d_test';
		break;
	case 'geumgan.allips.kr':
		print_gb = 'geumgan_erp';
		break;
	case 'geumgan.localhost':
		print_gb = 'geumgan_test';
		break;
	case 'brceratech.allips.kr':
		print_gb = 'brceratech';
	break;
	case 'acevisual.allips.kr':
		print_gb = 'acevisual';
	break;
	case 'gounhome.allips.kr':
		print_gb = 'gounhome';
	break;
	case 'koai.allips.kr':
		print_gb = 'koai';
	break;
	case 'withmaking.allips.kr':
		print_gb = 'withmaking';
	break;
}

console.log(print_gb);

// 서비스 오픈 예정 알림
function open_alert() {
    alert('#0054FF/서비스 오픈 예정/곧 찾아뵐께요!');
}

/**
 * @description 검색어 클릭시 팝업창 호출
 */
function search(url, title, width, height) {

	if($('#op option:selected').val() == "cust_name"){
		open_popup(url, title, width, height);
	};

}

/**
 * @description A/S, 반품 유형 코드 변환
 */
function service_cd(type) {

	if(!nan_chk(type)) {

		switch( type ) {
			case "대기":
				return "H";
			case "진행":
				return "R";
			case "완료":
				return "Y";
			case "미반입":
				return "N";
			case "보유":
				return "I";
			case "출고":
				return "O";
			default:
				return type;
		}

	} else {
		return '해당없음';
	}

}

/**
 * @description A/S, 반품 유형 텍스트 변환
 */
function service_txt(type) {

	if(!nan_chk(type)) {

		switch( type ) {
			case "H":
				return "대기";
			case "R":
				return "진행";
			case "Y":
				return "완료";
			case "N":
				return "미반입";
			case "I":
				return "보유";
			case "O":
				return "출고";
			default:
				return type;
		}

	} else {
		return '해당없음';
	}

}

/**
 * @description A/S, 반품 유형 다음 진행상태 텍스트 변환
 */
function service_st(type) {

	if(!nan_chk(type)) {

		switch( type ) {
			case "H":
				return "진행";
			case "R":
				return "완료";
			case "Y":
				return "";
			case "N":
				return "보유";
			case "I":
				return "출고";
			case "O":
				return "";
			default:
				return type;
		}

	} else {
		return '해당없음';
	}

}

/**
 * @description 고객/거래처 다음 상태 텍스트 변환
 */
function biz_st(type) {

	if(!nan_chk(type)) {

		switch( type ) {
			case "Y":
				return "거래불가";
			case "N":
				return "거래가능";
			default:
				return type;
		}

	} else {
		return '해당없음';
	}

}

/**
 * @description 주문상태(차후 고도화 예정)
 */
function ord_state(state) {
	switch (state) {
		case 'N':
			return '대기';
			break;
		case 'Y':
			return '진행';
			break;
		case 'F':
			return '완료';
			break;
		case 'C':
			return '강제취소';
			break;
		default:
			break;
	}
}

/**
 * @description 업체등급(차후 고도화 예정)
 */
function biz_grade(grade) {
	switch (grade) {
		case '000':
			return '등급없음';
			break;
		case '001':
			return '로얄';
			break;
		case '002':
			return '골드';
			break;
		case '003':
			return 'VIP';
			break;
		case '004':
			return 'VVIP';
			break;
		case '005':
			return '특별단가';
			break;
		case '006':
			return '소비자단가';
			break;
		case '007':
			return '소비자단가2';
			break;
		case '008':
			return '소비자단가3';
			break;
		case '009':
			return '소비자단가4';
			break;
		case '010':
			return '소비자단가5';
			break;
		default:
			break;
	}
}

/**
 * @description 핸들위치(차후 고도화 예정)
 */
function handle(text) {
	switch (text) {
		case 'R':
			return '우';
			break;
		case 'L':
			return '좌';
			break;
		case 'N':
			return '없음';
			break;
		default:
			break;
	}
}

/**
 * @description confim 구분
 */
function send_gb(gubun) {
	switch (gubun) {
		case 'in':
		case 'pin':
			return '등록';
			break;
		case 'up':
		case 'pup':
			return '수정';
			break;
		case 'del':
			return '삭제';
			break;
		case 'per':
			return '승인';
			break;
		case 'excel':
			return '엑셀 업로드를';
			break;
		default:
			break;
	}
}

/**
 * @description 매출/수금 구분 (S:주문접수(매출) / A: AS처리(매출) / R:반품(매출) / B:수금)
 */
function acc_gb(gubun) {
	switch(gubun) {
		case "S":
			return "매출";
			break;
		case "B":
			return "수금";
			break;
		case "D":
			return "D.C";
			break;
		case "A":
			return "A/S";
			break;
		case "R":
			return "반품";
			break;
		case "P":
			return "미수잔액증액";
			break;
		case "C":
			return "미수잔액차감";
			break;
	}
}

/**
 * @description 결제방식 구분
 */
function acc_type(gubun) {
	switch(gubun) {
		case "001":
			return "매출총액";
			break;
		case "002":
			return "현금";
			break;
		case "003":
			return "통장";
			break;
		case "004":
			return "카드";
			break;
		case "005":
			return "기타";
			break;
		default:
			return '';
			break;

	}
}

function process(field, type) {

	try {
		switch (type) {
			case 'val':
				$.each(field, function(column, val) {
					$('#'+column).val(val);
				});
				break;
			case 'cval':
				$.each(field, function(column, val) {
					$('.'+column).val(val);
				});
				break;
			case 'opener_val':
				$.each(field, function(column, val) {
					$(opener.document).find('#'+column).val(val);
				});
				break;
			case 'opener_cval':
				$.each(field, function(column, val) {
					$(opener.document).find('.'+column).val(val);
				});
				break;
			case 'text':
				$.each(field, function(column, val) {
					$('#'+column).text(val);
				});
				break;
			case 'ctext':
				$.each(field, function(column, val) {
					$('.'+column).text(val);
				});
				break;
			case 'display':
				$.each(field, function(column, val) {
					$('#'+column).css('display', val);
				});
				break;
			case 'display2':
				$.each(field, function(column, val) {
					$('.'+column).css('display', val);
				});
				break;
			case 'required':
				$.each(field, function(column, val) {
					$('#'+column).attr("required", val);
				});
				break;
			case 're_required':
				$.each(field, function(column, val) {
					$('#'+column).removeAttr("required");
				});
				break;
			case 'cre_required':
				$.each(field, function(column, val) {
					$('.'+column).removeAttr("required");
				});
				break;
			case 'disabled':
				$.each(field, function(column, val) {
					$('.'+column).attr("disabled", val);
				});
				break;
			default:
				break;
		}
	} catch (e) {
		console.log('{process} 시스템 에러. 지속될 경우 사이트 관리자에게 문의 바랍니다.'+e.message);
	}

}

/**
 * @description A/S, 반품 상태 변경 이벤트
 */
function st_change(gb, no, type) {

	var txt = service_st(type);
	var url = '';
	var href = '';

	var result = confirm('[ '+txt+' ] 상태로 변경하시겠습니까?');
	if(result) {

		if(!nan_chk(gb) && !nan_chk(no) && !nan_chk(type)) {

			if(gb == 'as') {
				url = '/ord/ord_as/st';
				href = '/ord/ord_as?st=t';
			} else {
				url = '/ord/ord_re/st';
				href = '/ord/ord_re?st=t';
			}

			$.ajax({

				url: url,
				type: 'GET',
				data: {
					no:no,
					type:type
				},
				dataType: "json",
				success: function(data) {

					if(data.code == '100') {
						location.href = href;
					}

				},
				error: function(request,status,error) {

					console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
					toast('실패', true, 'danger');

				},

			});

		}

	} else {

	}

}

/**
 * @description 고객/거래처 상태변경 이벤트
 */
function biz_change(gb, ikey, type) {

	var txt = biz_st(type);
	var url = '';
	var href = '';

	var result = confirm('[ '+txt+' ] 상태로 변경하시겠습니까?');
	if(result) {

		if(!nan_chk(gb) && !nan_chk(ikey) && !nan_chk(type)) {

			if( gb == 's' ) {
				url = '/biz/sale/st';
				href = '/biz/sale?st=t';
			} else if( gb == 'i') {
				url = '/biz/indiv/st';
				href = '/biz/indiv?st=t';
			} else if( gb == 'c') {
				url = '/biz/indiv/st';
				href = '/biz/busi?st=t';
			} else {
				url = '/biz/buying/st';
				href = '/biz/buying?st=t';
			}

			$.ajax({

				url: url,
				type: 'GET',
				data: {
					ikey:ikey,
					type:type
				},
				dataType: "json",
				success: function(data) {

					if(data.code == '100') {
						location.href = href;
					}

				},
				error: function(request,status,error) {

					console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
					toast('실패', true, 'danger');

				},

			});

		}

	} else {

	}

}

/**
 * @description 주문일/출고일 주문관리 연동
 */
function out_date() {

	var saturday = '';
	var base_date = '';
	var base_time = '';
	var base_week = '';
	var base_sat = '';
	var before_time = 0;
	var after_time = 0;
	var ord_before = '';
	var ord_after = '';
	var dlv_before = '';
	var dlv_after = '';
	var today = get_date('today');	// 기준 출고일자 = 현재일시
	var week = get_week(today); 	// 기준 요일

	// 기준 요일 (오늘부터 ~ 10일간)
	var holiday = new Array();
	var day = new Array(get_date('+n', 0), get_date('+n', 1), get_date('+n', 2), get_date('+n', 3),get_date('+n', 4)
		, get_date('+n', 5), get_date('+n', 6), get_date('+n', 7), get_date('+n', 8), get_date('+n', 9), get_date('+n', 10));

	try {
		$.ajax({
			url: '/ord/ord_reg/out_date',
			type: 'GET',
			dataType: "json",
			success: function(data) {
				if(data.code == '100') {

					// 현재 시간+분
					base_time = zero_format(get_time('hour'))+'-'+zero_format(get_time('min'));
					saturday = data.result[0].saturday; 	// 토요일 휴무여부(Y:휴무 / N:정상근무)
					base_week = data.result[0].base_week; 	// 설정된 평일 기준시간(00시-00분)
					base_sat = data.result[0].base_sat; 	// 설정된 토요일 기준시간(00시-00분)
					before_time = Number(data.result[0].before_time); 	// 설정된 주문기준시간 전(오늘+일)
					after_time = Number(data.result[0].after_time); 	// 설정된 주문기준시간 후(오늘+일)

					/*
					console.log('base_time:'+base_time);
					console.log('saturday:'+saturday);
					console.log('base_week:'+base_week);
					console.log('base_sat:'+base_sat);
					console.log('before_time:'+before_time);
					console.log('after_time:'+after_time);*/

					// 휴무일 배열 생성
					$.each(data.result, function(i, list) {
						holiday.push(list.holiday);
					});

					// 오늘부터 10일간 연속 임시공휴일 여부 체크
					function week_holiday(cnt) {
						var idx = 0;
						for(var i = cnt; i <= 10; i++ ) {
							if(holiday.indexOf(day[i]) != -1) {
								idx = i;
							} else { break; }
						}
						return idx;
					}
					var idx = week_holiday(0);

					// 특정일 임시공휴일 여부 체크
					function base_holiday(base_dt) {
						var idx = 0;
						if($.inArray(base_dt, holiday) > 0) {
							idx = 1;
						}
						return idx;
					}

					// 특정일 기준 임시공휴일 익일 확인
					function base_date(idx) {
						var result = '';
						for(var i = 0; i <= 10; i++ ) {
							var base_dt = get_date('+n', idx+i);
							if($.inArray(base_dt, holiday) == -1) {
								result = get_date('+n', idx+i);
								break;
							}
						}
						return result;
					}

					// 주문일/출고일 계산
					if (week == '토요일') { // 현재일시가 토요일

						if(saturday == 'N') { // 토요일 정상근무

							// 주문기준시간 전/후 주문일, 출고일 기본값 출력
							ord_before = base_date(0+idx);
							ord_after = base_date(2+idx);
							dlv_before = base_date(before_time+1+idx);
							dlv_after = base_date(after_time+1+idx);

							// 주문일 세팅
							base_sat > base_time ? $("#ord_dt").val(ord_before) : $("#ord_dt").val(ord_after);

							// 출고일 검증. 주문일 = 출고일 같을경우 출고일 +1일
							dlv_before = (ord_before != dlv_before) ? dlv_before : base_date(before_time+idx+2);
							dlv_after = (ord_after != dlv_after) ? dlv_after : base_date(after_time+idx+2);

							base_sat > base_time ? $("#dlv_dt").val(dlv_before) : $("#dlv_dt").val(dlv_after);

						} else if (saturday == 'Y') { // 토요일 휴무

							ord_after = base_date(2+idx);
							dlv_after = base_date(3+idx);

							// 주문일 세팅
							$("#ord_dt").val(ord_after);

							// 출고일 세팅
							dlv_after = (ord_after != dlv_after) ? dlv_after : base_date(4+idx);
							$("#dlv_dt").val(dlv_after);

						}

					} else if (week == '일요일') { // 현재일시가 일요일

						ord_after = base_date(1+idx);
						dlv_after = base_date(2+idx);

						// 주문일 세팅
						$("#ord_dt").val(ord_after);

						// 출고일 세팅
						dlv_after = (ord_after != dlv_after) ? dlv_after : base_date(3+idx);
						$("#dlv_dt").val(dlv_after);

					} else { // 평일 정상근무 - 주문기준시간 전/후 주문일 세팅

						// 주문기준시간 전/후 주문일, 출고일 기본값 출력
						ord_before = base_date(0+idx);
						ord_after = base_date(1+idx);
						dlv_before = base_date(before_time+idx);
						dlv_after = base_date(after_time+idx);

						// 주문일 세팅
						base_week > base_time ? $("#ord_dt").val(ord_before) : $("#ord_dt").val(ord_after);

						// 출고일 검증. 주문일 = 출고일 같을경우 출고일 +1일
						dlv_before = (ord_before != dlv_before) ? dlv_before : base_date(before_time+idx+1);
						dlv_after = (ord_after != dlv_after) ? dlv_after : base_date(after_time+idx+1);

						// 출고일 세팅
						base_week > base_time ? $("#dlv_dt").val(dlv_before) : $("#dlv_dt").val(dlv_after);

					}

				}

			},
			error: function(request,status,error) {
				console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
				toast('실패', true, 'danger');
			},
		});
	} catch (e) {
		alert('출고일관리 시스템에러. 지속될 경우 사이트 관리자에게 문의 바랍니다.'+e.message);
	}

}


/**
 * @description 게시물 등록/수정 후 뒤로가기 popstate 버전
 * @author 황호진, @version 1.0 @last_update 2021-06-17
 * r_url = 이전 페이지 url
 * a_url = history.pushState에 추가할 url(보통 현재 페이지 url 가지고 오면 됨)
 * s_url = r_url에 검색할때 쓰이는 기본베이스 설정 url
 * s_data = 기본베이스 뒤에 붙는 추가 url 데이터 및 그 url에 따른 숫자값
 *          ex) {'/in' : -2 ,  '/up' : -4}
 */
function dev_backward_p(r_url , a_url, s_url , s_data) {
	history.pushState({},"",a_url);
	window.addEventListener("popstate",function(e){
		if(e.state == null){
			var n = -1;
			for(var item in s_data){
				var loc = r_url.indexOf(s_url+item);
				if(loc > 0){
					n = s_data[item];
					break;
				}
			}
			history.go(n);
		}
	});
}

/**
 * @description 게시물 등록/수정 후 뒤로가기 ajax 버전
 * @author 황호진, @version 1.0 @last_update 2021-06-17
 * type 		= get , post
 * param 		= $("form[name='']").serialize();
 * url 			= ajax url
 * location_u 	= document.location.replace url
 */
function dev_backward_a(type , param , url , location_u , data_type = 'json') {
	$.ajax({
		type : type,
		url : url,
		data : param,
		dataType : data_type,
		error: function(request, status, error){
			console.log("code = "+ request.status + " message = "+ request.responseText +" error = ", error);
			alert('통신에 실패하였습니다.');
		},
		success : function(res){
			if(res[0]['result']){
				dev_replace(location_u+res[0]['ik']);
			}else{
				$("input[name='csrf_token_ci']").val(res[0]['token']);
				$.toast(res[0]['msg'],{
					duration: 2000,
					type: 'info'
				});
			}
		}
	});
}

/**
 * @description replace
 * @author 황호진, @version 1.0 @last_update 2021-06-18
 */
function dev_replace(url) {;
	document.location.replace(url);
}

/**
 * @description 공용 ajax 함수
 * @author 황호진, @version 1.0 @last_update 2021-08-27
 */
function fnc_ajax(url , type , data , data_type = 'json') {
	return $.ajax({
		url: url,
		type: type,
		data: data,
		dataType: data_type
	});
}

/*
 * @description 공용 ajax error 불러올 함수
 * @author 황호진, @version 1.0 @last_update 2021-08-27
 * */
function fnc_ajax_fail(request,status,error) {
	alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
	$.toast('실패', {sticky: true, type: 'danger'});
}

/*
 * @description 공용 현재 날짜를 불러오는 함수
 * @author 황호진, @version 1.0 @last_update 2021-09-01
 * */
function get_now_date() {
	var now = new Date();
	var y = now.getFullYear();
	var m = (now.getMonth() + 1);
		m = m >= 10 ? m : '0'+m;
	var d = now.getDate();
		d = d >= 10 ? d : '0'+d;
	return y + "-" + m + "-" + d;
}

/*
 * @description 공용 빈값 검사하는 함수
 * @author 황호진, @version 1.0 @last_update 2021-09-06
 * id = 검사할 ID
 * type = 검사할 ID의 값 type
 * */
function val_check(id , type) {
	var value = $("#"+id).val();	//받아온 id값으로 val 확인
	if(type === 'str'){	//type에 따라 빈값 검사를 다르게 가능
		if(value === ''){
			return false;
		}
	}
	return true;
}

/*
 * @description history 넘기는 함수
 * @author 김효진, @version 1.0 @last_update 2021-10-19
 * url = 처리 후 이동할 url
 */
function locate_url(url) {
	if (history.replaceState) {
		history.replaceState(null, document.title, url);
		history.go(0);
	} else {
		location.replace(url);
	}
}
