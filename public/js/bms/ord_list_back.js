/*================================================================================
 * @name: 황호진 - ord_list.js	주문등록 화면
 * @version: 1.0.0, @date: 2021-11-08
 ================================================================================*/
var g_bunhal_flag = true;
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var now = new Date();
	var now_y = now.getFullYear();
	var now_m = now.getMonth();
	var search_data = {
		's' 	: null,
		'st_dt'	: conver_date(new Date(now_y , now_m , 1)),
		'ed_dt'	: conver_date(new Date(now_y , now_m + 1 , 0))
	};
	get_list(search_data);
	//================================================================================

	//이벤트 연동
	//================================================================================
	/**
	 * @description 검색기한 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/11/08
	 */
	$('#btn01 , #btn02 , #btn03 , #btn04').on('click', function () {
		var id = $(this).attr("id");
		var now = new Date();
		var now_y = now.getFullYear();
		var now_m = now.getMonth();
		var now_d = now.getDate();
		if(id === 'btn01'){
			$("#st_dt").val('');
			$("#ed_dt").val(conver_date(new Date(now_y , now_m , now_d)));
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
	 * @description 검색버튼 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/11/08
	 */
	$("#search_btn").off().click(function () {
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
	});

	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2021/11/24
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data);
		}
	});

	/**
	 * @description 즉시검색 select box change 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2021/11/09
	 */
	$("#op_1 , #op_2 , #op_3 , #op_4 , #op_5 , #op_6 , #op_7").on('change' , function () {
		$("input[name='s']").val('t');				//검색하기 때문에 't' 라는 값이 주어짐
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
	});
	//================================================================================
});

/**
 * @description 받아온 날짜를 Y-m-d 로 return
 * @author 황호진  @version 1.0, @last update 2021/11/09
 */
function conver_date(time) {
	var y = time.getFullYear();
	var m = (time.getMonth() + 1) < 10 ? '0'+(time.getMonth() + 1) : (time.getMonth() + 1);
	var d = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
	return y+'-'+m+'-'+d;
}

/**
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2021/11/08
 */
function get_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/ord/ord_list/get_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			var kakao_apl_call_back = res.kakao_tel;
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: true,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: true,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동

					var len = res.length;
					$("#list_cnt").html(len);

					var str = '';
					if(len > 0){
						$.each(res, function (i, list) {
							var arg = encodeURIComponent(JSON.stringify({ ord_no : list.ord_no , cust_cd : list.cust_cd }));
							str += '<tr class="open" id="tr_'+list.ord_no+'">';
							str += '<td class="w6">';
							if(list.rec_gb === 'F'){
								str += '<span class="factory">공장</span>';
							}else if(list.rec_gb === 'C'){
								str += '<span class="center">센터</span>';
							}else{
								str += '<span class="mewachang">미와창</span>';
							}
							str += '</td>';
							if(list.ord_gb === 'O'){
								str += '<td class="w5">주문</td>';
							}else{
								str += '<td class="w5">견적</td>';
							}
							str += '<td class="w8 tb_click line" onclick=location.href="/ord/ord_list/v/'+list.ord_no+'">'+list.ord_no+'</td>';
							str += '<td class="w5"><button class="summary-btn" onclick=summary_open("'+arg+'")>요약</button></td>';
							str += '<td class="T-left">'+list.cust_nm+'</td>';
							str += '<td class="w7">'+list.ord_qty+'개</td>';			//천자리 콤마
							str += '<td class="w7 T-right">'+commas(Number(list.ord_amt))+'원</td>'; //천자리 콤마
							str += '<td class="w6">'+list.ord_dt+'</td>';
							str += '<td class="w6">'+list.dlv_dt+'</td>';
							str += '<td class="w6">'+list.sales_person+'</td>';
							str += '<td class="w6">'+list.reg_ikey+'</td>';
							str += '<td class="w12" colspan="2">'
							if(list.ord_gb === 'O'){
								str += '<button type="button" class="gurae_print" data-text="'+ list.ord_no +'" onclick=""><i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;거래명세서</button>&nbsp;';
								str += '<button type="button" class="maechul_print" data-text="'+ list.cust_cd +'" onclick=""><i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;매출처원장</button>';
							}else{
								str += '<button type="button" class="esti_print" data-text="'+ list.ord_no +'" onclick=""><i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;견적서</button>';
							}
							str += '</td>';
							if(kakao_apl_call_back !== ''){
								str += '<td class="w7"><button type="button" class="" onclick=ord_list_kakao_pop("'+ arg +'")>발송</button></td>';
							}else{
								str += '<td class="w7"><button type="button" class="notyet">발송</button></td>';
							}
							str += '</tr>';

							str += '<tr class="hidden">';
							str += '<td colspan="14" style="padding: 0; border: 0;">';
							str += '<div class="x-scroll mCustomScrollbar">';
							str += '<table class="none summery ">';
							str += '<thead>';
							str += '<tr>';
							str += '<th class="w6" rowspan="2">순번</th>';
							str += '<th class="w5" rowspan="2">제작 구분</th>';
							str += '<th class="w8" rowspan="2">구분</th>';
							str += '<th rowspan="2">제품(CD)</th>';
							str += '<th class="w14" rowspan="2">규격</th>';
							str += '<th class="w12" rowspan="2">수량</th>';
							str += '<th class="w6" rowspan="2">상태</th>';
							str += '<th class="w6" rowspan="2">단가(원)</th>';
							str += '<th class="w6" rowspan="2">금액(원)</th>';
							str += '<th class="w6" rowspan="2">세액(원)</th>';
							str += '<th class="w7">등록자명</th>';
							str += '</tr>';
							str += '<tr>';
							str += '<th class="w7">최종수정자</th>';
							str += '</tr>';
							str += '</thead>';
							str += '<tbody class="ord_detail">';//리스트 표기
							str += '</tbody>';
							str += '</table>';
							str += '</div>';
							str += '<table style="border-top:0">';
							str += '<tfoot class="order_sum">';
							str += '<tr>';
							str += '<th class="" colspan="2">[ 합계 ]</th>';
							str += '<th class="w26">총 수량 : <span class="ord_qty">0</span>개</th>';
							str += '<th class="w31" colspan="2">총 금액 : <span class="ord_amt">0</span>원</th>';
							str += '</tr>';
							str += '</tfoot>';
							str += '</table>';
							str += '</td>';
							str += '</tr>';

						});
						$("#data-container").html(str); // ajax data output

						$('.mCustomScrollbar').mCustomScrollbar();

						/**
						 * @description 거래명세서 연결
						 * @author 황호진  @version 1.0, @last update 2021/12/29
						 */
						$(".gurae_print").on('click' , function () {
							var ord_no = $(this).attr('data-text');
							gurae_print(ord_no);
						});

						/**
						 * @description 견적서 연결
						 * @author 황호진  @version 1.0, @last update 2021/12/29
						 */
						$(".esti_print").on('click' , function () {
							var ord_no = $(this).attr('data-text');
							esti_print(ord_no);
						});

						/**
						 * @description 매출처원장 연결
						 * @author 황호진  @version 1.0, @last update 2022/01/25
						 */
						$(".maechul_print").on('click' , function () {
							var cust_cd = $(this).attr('data-text');
							maechul_print(cust_cd);
						});

					}else{
						str += "<tr>";
						str += "<td colspan='14'>조회 가능한 데이터가 없습니다.</td>";
						str += "</tr>";
						$("#data-container").html(str); // ajax data output
					}
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description 요약 open
 * @author 황호진  @version 1.0, @last update 2021/11/23
 */
function summary_open(data) {
	data = JSON.parse(decodeURIComponent(data));
	if($('#tr_'+data['ord_no']).next().css('display') === "none"){
		var url = '/ord/ord_list/summary_open';
		var type = 'GET';
		fnc_ajax(url , type , data)
			.done(function (res) {
				var str = '';
				var total_amt = 0;
				var total_qty = 0;
				$.each(res.data, function (i, list) {
					var ord_spec = JSON.parse(list.ord_spec);
					var ord_qty = JSON.parse(list.ord_qty);

					str += '<tr>';
					str += '<td colspan="11" class="covering">';
					str += '<table class="">';
					str += '<tr class="cov">';
					str += '<td rowspan="2" class="w6">'+list.row_no+'</td>';
					str += '<td rowspan="2" class="w5">';
					str += '<span class="proc_gb">'+list.proc_gb+'</span>';
					str += '</td>';
					str += '<td rowspan="2" class="w8">'+list.pd_cd+'</td>';
					str += '<td rowspan="2" class="T-left">';
					str += '<p>'+list.item_nm+'</p> ';
					str += '<p>('+list.item_cd+')</p>';
					str += '</td>';
					str += '<td class="w14 ord-info">';
					if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){
						str += '<p>'+ord_spec['ord_width']+' * '+ord_spec['ord_height']+' ('+ord_spec['ord_hebe']+' '+list.unit+')</p>';
						if(ord_spec['division'] == 1){	//분할이 아닌가
							str += '<p class="nobun">분할없음</p>';
						}else{	//분할 -> 마우스 이벤트 걸고 올리면 분할상세내역 보이기
							str += '<span class="bunhal" id="bunhal_'+list.lot+'" data-text1="'+list.ord_no+'" data-text2="'+list.ord_seq+'">'+ord_spec['division']+'분할(상세보기)</span>';
						}
					}else{
						str += '<p>'+ord_spec['size']+list.unit+'</p>';
					}
					str += '</td>';
					str += '<td class="w12 name02">';
					if(ord_spec['unit'] === '001' || ord_spec['unit'] === '002'){ 	//좌 , 우
						//총 개수 계산
						if(ord_spec['division'] == 1) {	//분할이 아닌가
							str += '<p class="no">좌 : '+list.left_qty+'</p>';
							str += '<p class="no">우 : '+list.right_qty+'</p>';
							total_qty += Number(list.left_qty)  + Number(list.right_qty);
						}else{
							str += '<div class="counter">'+ord_qty['qty']+'</div>';
							str += '<p>좌 : '+list.left_qty+'</p>';
							str += '<p>우 : '+list.right_qty+'</p>';
							total_qty += ord_spec['division'] * ord_qty['qty'];
						}
					}else{		//EA
						str += ord_qty['qty'];
						//총 개수 계산
						total_qty += ord_qty['qty'];
					}
					str += '</td>';
					str += '<td rowspan="2" class="w6">';
					if(list.finyn === '002'){	//대기
						str += '<span class="dg">'+list.finyn_nm+'</span>';
					}else if(list.finyn === '003'){	//전송
						str += '<span class="send">'+list.finyn_nm+'</span>';
					}else if(list.finyn === '004') {	//진행
						str += '<span class="saengsan ing">' + list.finyn_nm + '</span>';
					}else if(list.finyn === '005'){		//완료
						str += '<span class="complete">' + list.finyn_nm + '</span>';
					}else if(list.finyn === '006' || list.finyn === '007'){	//출고대기 , 출고완료
						str += '<span class="chulgo">'+list.finyn_nm+'</span>';
					}else if(list.finyn === '008' || list.finyn === '009'){	//배송대기 , 배송완료
						str += '<span class="baesong">'+list.finyn_nm+'</span>';
					}else if(list.finyn === '010' || list.finyn === '011'){	//취소접수 , 취소완료
						str += '<span class="cancle">'+list.finyn_nm+'</span>';
					}else if(list.finyn === '012' || list.finyn === '013' || list.finyn === '014'){	//반품접수 , 반품처리중 , 반품완료
						str += '<span class="banpum">'+list.finyn_nm+'</span>';
					}else if(list.finyn === '015' || list.finyn === '016'){	//교환접수 , 교환완료
						str += '<span class="change">'+list.finyn_nm+'</span>';
					}
					str += '</td>';
					str += '<td rowspan="2" class="w6 T-right">'+commas(Number(list.unit_amt))+'원</td>';
					str += '<td rowspan="2" class="w6 T-right">'+commas(Number(list.ord_amt))+'원</td>';
					str += '<td rowspan="2" class="w6 T-right">'+commas(Number(list.tax_amt))+'원</td>';
					str += '<td rowspan="2" class="w7 name03">';
					str += '<p>'+list.reg_ikey+'</p>';
					str += '<p>'+list.mod_ikey+'</p>';
					str += '</td>';
					str += '</tr>';
					str += '<tr class="bgo" >';
					str += '<td colspan="2" class="T-left Elli">'+list.memo+'</td>';
					str += '</tr>';
					str += '</table>';
					str += '</td>';
					str += '</tr>';
					//총 금액 계산
					total_amt += (Number(list.ord_amt) + Number(list.tax_amt));
				});
				$('.open').next().hide();
				$('#tr_'+data['ord_no']).next().find('tbody').html(str);
				$('#tr_'+data['ord_no']).next().find('tfoot .ord_qty').html(total_qty);
				$('#tr_'+data['ord_no']).next().find('tfoot .ord_amt').html(commas(total_amt));

				design_class_add();

				$('#tr_'+data['ord_no']).next().show();

				$(".bunhal").hover(function(){
					g_bunhal_flag = true;
					var id = $(this).attr('id');
					var ord_no = $(this).attr('data-text1');
					var ord_seq = $(this).attr('data-text2');
					bunhal_detail(id , ord_no , ord_seq);
				},function(){
					g_bunhal_flag = false;
					$('.bunhal_list').hide();
				});

			}).fail(fnc_ajax_fail);
	}else{
		$('#tr_'+data['ord_no']).next().hide();
	}
}

/**
 * @description text 문자를 기반으로 클래스주는 함수
 * @author 황호진  @version 1.0, @last update 2021/11/24
 * TODO : 과한 사용에는 속도가 느려지는 경우 있으니 추 후 볼것
 */
function design_class_add() {
	$('.proc_gb:contains(생산)').addClass('make');
	$('.proc_gb:contains(외주)').addClass('buy');

	//str += '<span class="finyn">'+list.finyn_nm+'</span>';
	//$('.finyn:contains(대기)').addClass('dg');
}

/**
 * @description 분할 상세보기
 * @author 황호진  @version 1.0, @last update 2021/11/30
 */
function bunhal_detail(id , ord_no , ord_seq) {
	var url = '/ord/ord_list/bunhal_detail';
	var type = 'GET';
	var data = {
		'ord_no'	: ord_no,
		'ord_seq'	: ord_seq,
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(g_bunhal_flag){
				var str = '';
				$.each(res.data, function (i, list) {
					var pos;
					if(list.handle_pos === 'R'){
						pos = '우';
					}else{
						pos = '좌';
					}
					str += '<div>'+Number(i+1)+'. 가로 : '+list.div_width+'cm 세로 : '+list.div_height+'cm 위치 : '+pos+' ('+ list.div_hebe +'회배)</div>';
				});

				$('.bunhal_list').html(str).show();

				var id_info = document.getElementById(id); // 요소의 id 값이 target이라 가정
				var id_rect = id_info.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
				var target_info = document.getElementById('bunhal_list');
				var target_rect = target_info.getBoundingClientRect();
				var top = id_rect.top - (target_rect.height - 15);
				var left = id_rect.right + 10;

				$('.bunhal_list').css({"top": top+"px", "left": left+"px"});
			}
		}).fail(fnc_ajax_fail);
}
/**
 * @description 카카오톡 팝업 열기
 * @author 황호진  @version 1.0, @last update 2021/12/28
 */
function ord_list_kakao_pop(arg) {
	arg = JSON.parse(decodeURIComponent(arg));
	open_popup('/ord/ord_list_kakao_pop?ord_no='+arg['ord_no']+'&cust_cd='+arg['cust_cd'], '카카오톡발송', 1100, 811);
}
/**
 * @description 거래명세서 출력
 * @author 황호진  @version 1.0, @last update 2021/12/29
 */
function gurae_print(ord_no) {
	var result = confirm("거래명세내역을 출력하시겠습니까?");
	if(result){

		// 전송 파라미터
		$('#p_gb').val(print_gb);
		$('#p_ord_no').val(ord_no);

		var pop_title = "gurae_print";

		var _width = '800';
		var _height = '950';

		var _left = Math.ceil(( window.screen.width - _width )/2);
		var _top = Math.ceil(( window.screen.height - _height )/2);

		window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

		var frm_data = document.gurae_frm;

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
 * @author 황호진  @version 1.0, @last update 2021/12/30
 */
function esti_print(ord_no){

	var con = confirm("견적서를 출력하시겠습니까?");
	if(con){

		$('#esti_gb').val(print_gb);
		$('#esti_ord_no').val(ord_no);

		var pop_title = "esti_print";

		var _width = '800';
		var _height = '2100';

		var _left = Math.ceil(( window.screen.width - _width )/2);
		var _top = Math.ceil(( window.screen.height - _height )/2);

		window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

		var frm_data = document.esti_frm;

		frm_data.target = pop_title;
		if(print_host == 'plan-bms.localhost') {
			frm_data.action = print_local+"/esti.jsp";
		} else {
			frm_data.action = print_domain+"/esti.jsp";
		}
		frm_data.submit();
	}

}

/**
 * @description 매출처원장 출력
 * @author 황호진  @version 1.0, @last update 2022/01/25
 */
function maechul_print(cust_cd) {
	var con = confirm("매출처원장을 출력하시겠습니까?");

	if(con){
		$('#maechul_cust_cd').val(cust_cd);
		$('#maechul_gb').val(print_gb);

		var pop_title = "maechul_print";

		var _width = '1100';
		var _height = '2100';

		var _left = Math.ceil(( window.screen.width - _width )/2);
		var _top = Math.ceil(( window.screen.height - _height )/2);

		window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

		var frmData = document.maechul_frm;

		frmData.target = pop_title;
		frmData.action = "/ord/sales_li";

		frmData.submit();
	}


	// var con = confirm("매출처원장을 출력하시겠습니까?");
	//
	// if(con){
	//
	// 	var pop_title = "maechul_print";
	//
	// 	var _width = '1100';
	// 	var _height = '2100';
	//
	// 	var _left = Math.ceil(( window.screen.width - _width )/2);
	// 	var _top = Math.ceil(( window.screen.height - _height )/2);
	//
	// 	window.open("/ord/sales_li?cust_cd="+ cust_cd +"&p_ds="+ $('#st_dt').val() +"&p_de="+ $('#ed_dt').val() +"&p_gb="+ print_gb +"", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);
	// }
}
