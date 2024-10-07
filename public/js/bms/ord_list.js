/*================================================================================
 * @name: 황호진 - ord_list.js	주문등록 화면
 * @version: 1.0.0, @date: 2022/02/24
 ================================================================================*/
let g_bunhal_flag = true;
let start_num = 0;
let stat = true;
const max_num = 50;
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	get_list(search_organize() , 'load');
	//================================================================================

	//이벤트
	//================================================================================
	/**
	 * @description 스크롤 기반 데이터 더보기 형태의 조회
	 * @author 황호진  @version 1.0, @last update 2022/08/01
	 */
	$('#content').on("scroll", function(){
		let scroll_top = $(this).scrollTop();
		let inner_height = $(this).innerHeight();
		let scroll_height = $(this).prop('scrollHeight');
		if (scroll_top + inner_height >= scroll_height) // 스크롤 끝 부분쯤 도착했을 시
		{
			if(stat)
			{
				get_list(search_organize() , 'scroll');
			}
		}
	});

	/**
	 * @description 검색기한 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/02/24
	 */
	$('#sd').on('change', function () {
		let id = $(this).val();
		let now = new Date();
		let now_y = now.getFullYear();
		let now_m = now.getMonth();
		let now_d = now.getDate();
		if(id === 'A'){
			//전월 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m - 1 , 1)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m , 0)));
		}else if(id === 'B'){
			//금월 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m , 1)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m + 1 , 0)));
		}else if(id === 'C'){
			//당일 구하기
			$("#st_dt").val(conver_date(new Date(now_y , now_m , now_d)));
			$("#ed_dt").val(conver_date(new Date(now_y , now_m + 1 , now_d - 1)));
		}
		start_num = 0;
		stat = false;
		get_list(search_organize() , 'change');
	});

	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2022/02/24
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			start_num = 0;
			stat = false;
			get_list(search_organize() , 'change');
		}
	});

	/**
	 * @description 즉시검색 select box change 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022/02/24
	 */
	$("input[name=dt_gb] , #st_dt , #ed_dt , #keyword_1 , #op_1 , #op_2 , #op_3").on('change' , function () {
		start_num = 0;
		stat = false;
		get_list(search_organize() , 'change');
	});

	/*input 클릭 이벤트 추가 22-02-24 성시은*/ 
	$('.input_line input').focus(function(){
		$(this).parent().addClass('active');
	});
	$('.input_line input').blur(function(){
		$(this).parent().removeClass('active');
	});
	$('.input_line select').focus(function(){
		$(this).parent().addClass('active');
	});
	$('.input_line select').blur(function(){
		$(this).parent().removeClass('active');
	});

	/**
	 * @description 거래명세서 연결
	 * @author 황호진  @version 1.0, @last update 2022/02/25
	 */
	$(document).on('click' , ".gurae_print" , function () {
		let ord_no = $(this).attr('data-text');
		gurae_print(ord_no);
	});

	/**
	 * @description 견적서 연결
	 * @author 황호진  @version 1.0, @last update 2022/02/25
	 */
	$(document).on('click' , ".esti_print" , function () {
		let ord_no = $(this).attr('data-text');
		esti_print(ord_no);
	});
	//================================================================================
});

/**
 * @description 검색란 조건 정리
 * @author 황호진  @version 1.0, @last update 2022/09/16
 */
function search_organize() {
	return {
		'start_num'	: start_num,
		'dt_gb'		: $('input[name=dt_gb]:checked').val(),
		'st_dt'		: $('#st_dt').val(),
		'ed_dt'		: $('#ed_dt').val(),
		'keyword_1'	: $('#keyword_1').val(),
		'sc'		: $('#sc').val(),
		'op_1'		: $('#op_1').val(),
		'op_2'		: $('#op_2').val(),
		'op_3'		: $('#op_3').val()
	}
}

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2022/02/24
 */
function conver_date(time) {
	let y = time.getFullYear();
	let m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	let d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2022/02/24
 */
function get_list(data , event_type) {
	let url = '/ord/ord_list/get_list';
	let type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			let len = res.data.length;
			$("#list_cnt").html(len);
			let str = '';

			if(event_type === 'change')
			{
				$('#content').scrollTop(0);
				$('#ord_list').html('');
			}

			if(len > 0)
			{
				$.each(res.data, function (i, list) {
					let arg = encodeURIComponent(JSON.stringify({ ord_no : list.ord_no , cust_cd : list.cust_cd }));
					str += '<tr class="open" id="tr_'+list.ord_no+'" onclick=location.href="/ord/ord_reg/v/'+list.ord_no+'">';
					str += '<td class="w5">';
					if(list.rec_gb === 'F'){
						str += '<span class="factory">공장</span>';
					}else if(list.rec_gb === 'C'){
						str += '<span class="center">센터</span>';
					}else if(list.rec_gb === 'O'){
						str += '<span class="out_factory">외주공장</span>';
					}else{
						str += '<span class="mewachang">미와창</span>';
					}
					str += '</td>';
					str += '<td class="w5">';
					if(list.ord_gb === 'O' || list.ord_gb === 'D'){
						str += list.ord_gb_nm;
					}else if(list.ord_gb === 'N'){
						str += '<span class="est">'+ list.ord_gb_nm +'</span>';
					}else{
						str += '<span class="as">'+ list.ord_gb_nm +'</span>';
					}
					str += '</td>';
					str += '<td class="w5">'+ list.stat +'</td>';
					str += '<td class="w9 blue" style="cursor: pointer;">'+list.ord_no+'</td>';
					str += '<td class="w5">'+list.memo+'</td>';
					str += '<td>'+list.cust_nm+'</td>';
					str += '<td class="w5" onclick="event.stopPropagation()">상세보기</td>';
					str += '<td class="w7">'+list.ord_qty+'개</td>';			//천자리 콤마
					str += '<td class="w10">'+commas(Number(list.ord_amt))+'원</td>'; //천자리 콤마
					str += '<td class="w6">'+list.ord_dt+'</td>';
					str += '<td class="w6">'+list.dlv_dt+'</td>';
					str += '<td class="w7">'+list.reg_ikey+'</td>';
					str += '<td class="w10" onclick="event.stopPropagation()">';
					if(list.ord_gb === 'N'){
						str += '<a class="print esti_print" data-text="'+ list.ord_no +'" style="cursor: pointer;">견적서</a>';
					}else{
						str += '<a class="print gurae_print" data-text="'+ list.ord_no +'" style="cursor: pointer;">인쇄출력</a>';
					}
					if($("#kakao_tel").val() !== ''){
						str += '<a class="kakao" style="cursor: pointer;" onclick=ord_list_kakao_pop("'+ arg +'")>카톡발송</a>';
					}else{
						str += '<a class="kakao">카톡발송</a>';
					}
					str += '</td>';
					str += '</tr>';

				});
				$("#ord_list").append(str); // ajax data output

				if(len === max_num)
				{	//불러온 데이터 수가 50일 경우 다음이 있다 판단하여 start_num에 값을 더함
					stat = true;
					start_num = start_num + max_num;
				}
				else
				{	//그게 아닐 경우 다음이 없다 판단하여 상태값을 false 처리
					stat = false;
				}

			}
			else
			{
				if(start_num === 0)
				{
					str += "<tr>";
					str += "<td colspan='15'>조회 가능한 데이터가 없습니다.</td>";
					str += "</tr>";
					$("#ord_list").html(str); // ajax data output
				}
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 카카오톡 팝업 열기
 * @author 황호진  @version 1.0, @last update 2022/02/24
 */
function ord_list_kakao_pop(arg) {
	arg = JSON.parse(decodeURIComponent(arg));
	open_popup('/ord/ord_list_kakao_pop?ord_no='+arg['ord_no']+'&cust_cd='+arg['cust_cd'], '카카오톡발송', 1100, 811);
}


/**
 * @description 거래명세서 출력
 * @author 황호진  @version 1.0, @last update 2022/02/25
 */
function gurae_print(ord_no) {
	let result = confirm("거래명세내역을 출력하시겠습니까?");
	if(result){

		// 전송 파라미터
		$('#p_gb').val(print_gb);
		$('#p_ord_no').val(ord_no);

		let pop_title = "gurae_print";

		let _width = '800';
		let _height = '950';

		let _left = Math.ceil(( window.screen.width - _width )/2);
		let _top = Math.ceil(( window.screen.height - _height )/2);

		window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

		let frm_data = document.gurae_frm;

		frm_data.target = pop_title;
		if(print_host == 'plan-bms.localhost') {
			frm_data.action = print_local+"/gurae.jsp";
		} else {
			frm_data.action = print_domain+"/gurae.jsp";
		}
		frm_data.submit();
	}
}

/**
 * @description 견적서 출력
 * @author 황호진  @version 1.0, @last update 2022/02/25
 */
function esti_print(ord_no){

	let con = confirm("견적서를 출력하시겠습니까?");
	if(con){

		$('#esti_gb').val(print_gb);
		$('#esti_ord_no').val(ord_no);

		let pop_title = "esti_print";

		let _width = '800';
		let _height = '2100';

		let _left = Math.ceil(( window.screen.width - _width )/2);
		let _top = Math.ceil(( window.screen.height - _height )/2);

		window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

		let frm_data = document.esti_frm;

		frm_data.target = pop_title;
		if(print_host == 'plan-bms.localhost') {
			frm_data.action = print_local+"/esti.jsp";
		} else {
			frm_data.action = print_domain+"/esti.jsp";
		}
		frm_data.submit();
	}

}
