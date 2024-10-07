
/*============================================================================================
 * 날짜비교 JS - date.js
 * @name: 김민주, @version: 1.0.0, @last date: 2021/05/26
 * @version history: 날짜 검색 체인지 이벤트. 검색 범위가 기준개월수를 초과할 경우 검색불가 처리 
 ============================================================================================*/

$(function() {

	var page = window.document.location.pathname;
	$("#ds, #de").change(function(){
		// 거래관리 > 거래원장 검색 날짜는 기본값 12개월로 세팅
		/*if(page == '/ord/ord_li') { // 거래원장
			search_date(11);
		} else {
			search_date();
		}*/
		search_date(11); // 전체 적용
	});	

});

function search_date(base_date = 2) {

	var chk_num = base_date; // 3개월이면 2로 셋팅

	// 선택된 값 가져오기
	var start_year = $("#ds").val().substring(0,4);
	var start_month = $("#ds").val().substring(5,7);
	var end_year = $("#de").val().substring(0,4);
	var end_month = $("#de").val().substring(5,7);

	// 계산을 위해 명시적으로 형 변환
	var start_year_num = Number(start_year);
	var start_month_mum = Number(start_month);
	var end_year_num = Number(end_year);
	var end_month_num = Number(end_month);

	// 차이가 기준 개월수를 넘어가는지 확인
	var result = ((end_year_num*12)+end_month_num) - ((start_year_num*12)+start_month_mum);

	if(result > chk_num) {

		alert('날짜 검색 범위는 '+(chk_num+1)+'개월 입니다.');

		if (end_month_num <= chk_num) {

			start_year_num = end_year_num-1;
			start_month_mum = 12-(chk_num-end_month_num);
			$("#ds").val(start_year_num+'-'+zero_format(start_month_mum)+'-01');

		} else {

			start_year_num = end_year_num;
			start_month_mum = end_month_num-chk_num;

			$("#ds").val(start_year_num+'-'+zero_format(start_month_mum)+'-01');

		}

	}
}