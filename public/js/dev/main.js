/*================================================================================
 * @name: 황호진 - main.js
 * @version: 1.0.0
 ================================================================================*/
var v_setinterval = [];
var interval_flag = [];		// 1: 대기 , 2: 진행 , 3: 완료
var size = 5;
//canvas 전역변수화
var sales_chart = null;
//aps canvas1,2 전역변수화
var aps_chart = {};
aps_chart['factory_chart'] = null;
aps_chart['center_chart'] = null;
var max_value = 1000000;
$(function () {
	if($('#site_name').val() === 'aps_main'){	//aps
		aps_factory_payment_chart();
		aps_center_payment_chart();
	}else{	//bms , center
		redraw_canvas();
	}

	for(let i = 0; i < size; i++){
		interval_flag[i] = 1;
	}

	$("#notice_upbtn , #concurrent_upbtn , #qna_upbtn , #sales_status_upbtn , #factory_payment_upbtn , #center_payment_upbtn").on('click' , function () {
		var id = $(this).attr('id');
		var target = id.replace('_upbtn' , '')+'_loading';
		var n;
		switch (id) {
			case 'notice_upbtn':
				n = 4;
				if(interval_flag[n] === 1){
					loading(target , n , false);
					notice_update(n);
				}
				break;
			case 'concurrent_upbtn':
				n = 2;
				if(interval_flag[n] === 1){
					loading(target , n , true);
					concurrent_user_update(n);
				}
				break;
			case 'qna_upbtn':
				n = 3;
				if(interval_flag[n] === 1){
					loading(target , n , false);
					qna_update(n);
				}
				break;
			case 'sales_status_upbtn':
				//bms 1 : 매출현황
				//center 1 : 매출현황
				n = 1;
				if(interval_flag[n] === 1){
					loading(target , n , true);
					if($('#site_name').val() === 'bms_main'){
						bms_sales_status_update(n);
					}else if($('#site_name').val() === 'center_main'){
						center_sales_status_update(n);
					}
				}
				break;
				//TODO : APS 용도 0 , 1번 case가 추가 예정
			case 'factory_payment_upbtn':
				n = 0;
				if(interval_flag[n] === 1){
					loading(target , n , true);
					aps_factory_payment_chart(n);
				}
				break;
			case 'center_payment_upbtn':
				n = 1;
				if(interval_flag[n] === 1){
					loading(target , n , true);
					aps_center_payment_chart(n);
				}
				break;
		}
	});
});

/**
 * @description loading css 조정
 * @author 황호진  @version 1.0, @last update 2021/11/01
 */
function loading(target , n , reverse) {
	var num;
	interval_flag[n] = 2;
	if(reverse){
		num = 360;
		v_setinterval[n] = setInterval(function () {
			num -= 15;
			$("#"+target).css({
				"transform": "rotate("+num+"deg)"
			});

			if(num === 0){
				num = 360;
			}
			if(num === 360 && interval_flag[n] === 3){
				interval_flag[n] = 1;
				clearInterval(v_setinterval[n]);
			}
		} , 50);
	}else{
		num = 0;
		v_setinterval[n] = setInterval(function () {
			num += 15;
			$("#"+target).css({
				"transform": "rotate("+num+"deg)"
			});

			if(num === 360){
				num = 0;
			}
			if(num === 0 && interval_flag[n] === 3){
				interval_flag[n] = 1;
				clearInterval(v_setinterval[n]);
			}
		} , 50);
	}
}
/**
 * @description notice_update 공지사항 업데이트
 * @author 황호진  @version 1.0, @last update 2021/10/29
 */
function notice_update(n) {
	var url = '/main/notice_update';
	fnc_ajax(url , 'get' , {})
		.done(function (res) {
			interval_flag[n] = 3;
			$("#notice_uptime").html(get_time());
			var str = '';
			if(res.data.length > 0){
				str += '<ul>';
				$.each(res.data , function (i , list) {
					str += '<li onclick=location.href="/cs/notice/v?ikey='+list.ikey+'">';
					if(list.category === 'N'){
						str += '<span class="kind normal">일반</span>';
					}else{
						str += '<span class="kind red">중요</span>';
					}
					str += '<p class="Elli">'+list.title+'</p><span class="date">'+list.reg_dt+'</span>';
				});
				str += '</ul>';
			}else{
				str = '<div class="no_list"><p>등록된 공지사항이 없습니다.</p></div>';
			}
			$("#notice_list").html(str);
		}).fail(fnc_ajax_fail);
}

/**
 * @description 현재시간 구하기
 * @author 황호진  @version 1.0, @last update 2021/11/01
 */
function get_time() {
	var date = new Date();
	var h = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
	var m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
	var s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
	return h+":"+m+":"+s;
}

/**
 * @description concurrent_user_update 현재접속중인 사용자 업데이트
 * @author 황호진  @version 1.0, @last update 2021/10/29
 */
function concurrent_user_update(n) {
	var url = '/main/concurrent_user_update';
	fnc_ajax(url , 'get' , {})
		.done(function (res) {
			interval_flag[n] = 3;
			var str = '';
			$.each(res.data , function (i , list) {
				str += '<p>'+list.ul_nm+'('+list.id+')</p>';
			});
			$("#concurrent_users").html(str);
		}).fail(fnc_ajax_fail);
}

/**
 * @description qna_update 미답변문의 사항 업데이트
 * @author 황호진  @version 1.0, @last update 2021/12/14
 */
function qna_update(n) {
	var url = '/main/qna_update';
	fnc_ajax(url , 'get' , {})
		.done(function (res) {
			interval_flag[n] = 3;
			$("#qna_uptime").html(get_time());
			var str = '';
			if(res.data.length > 0){
				str += '<ul>';
				$.each(res.data , function (i , list) {
					str += '<li onclick=location.href="/cs/question/vw?i='+list.ikey+'">';
					str += '<p class="Elli">'+list.qn_title+'</p><span class="date">'+list.reg_dt+'</span>';
				});
				str += '</ul>';
			}else{
				str = '<div class="no_list"><p>신규로 접수된 문의사항이 없습니다.</p></div>';
			}
			$("#qna_list").html(str);
		}).fail(fnc_ajax_fail);
}

/**
 * @description redraw_canvas 캔버스 다시 그리기
 * @author 황호진  @version 1.0, @last update 2021/12/15
 */
function redraw_canvas() {
	var ord_amt 		= $('#ord_amt').val();
	var collect_amt 	= $('#collect_amt').val();
	var unrealized_amt 	= $('#unrealized_amt').val();

	var v = ord_amt == 0 ? max_value : calc_max_value(ord_amt);
	if(sales_chart === null){
		sales_chart = new Chart($("#canvas"), {
			type: 'horizontalBar',
			data: {
				labels: ['주문 금액   ', '수금 금액   ', '총 미수잔액   '],
				datasets: [{
					label: '',
					data: [ord_amt, collect_amt, unrealized_amt],
					borderColor: "rgba(89, 120, 185, 1)",
					backgroundColor: "rgba(242, 125, 45, 1)",
					barThickness:15,
				}],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				legend:false,
				title: {
					display:false,
				},
				tooltips: {
					mode: 'index',
					intersect: false,
					callbacks: {
						label: function(tooltipItem, data) {
							var value = data.datasets[0].data[tooltipItem.index];
							value = value.toString();
							value = value.split(/(?=(?:...)*$)/);
							value = value.join(',');
							return value+'원';
						}
					}
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					yAxes: [{
						ticks:{
							fontColor:'rgba(0,0,0)'
						},
						gridLines:false,
						// barPercentage: 1.0,
						// minBarLength: 2,
					}],
					xAxes: [{
						ticks: {
							min: 0,
							max: v,
							userCallback: function(value, index, values) {
								value = value.toString();
								value = value.split(/(?=(?:...)*$)/);
								value = value.join(',');
								return value+'원';
							}
						},
					}],
				},

			}
		});
	}else{
		sales_chart.data.datasets = [{
			label: '',
			data: [ord_amt, collect_amt, unrealized_amt],
			borderColor: "rgba(89, 120, 185, 1)",
			backgroundColor: "rgba(242, 125, 45, 1)",
			barThickness:15,
		}];
		sales_chart.update();
	}
}

/**
 * @description bms_sales_status_update 매출현황 업데이트
 * @author 황호진  @version 1.0, @last update 2021/12/15
 */
function bms_sales_status_update(n) {
	var url = '/main/sales_status_update';
	fnc_ajax(url , 'get' , {})
		.done(function (res) {
			interval_flag[n] = 3;
			//현재월 설정
			$('#now_month').html(res.data['now_month']);
			//한달 기한 설정
			$('#one_month').html(res.data['first_dt']+' ~ '+res.data['last_dt']);
			//주문금액 설정
			$('#ord_amt').val(res.data['ord_amt']);
			//수금금액 설정
			$('#collect_amt').val(res.data['collect_amt']);
			//미수잔액 설정
			$('#unrealized_amt').val(res.data['unrealized_amt']);
			//오늘날짜 설정
			$('#now_date').html(res.data['now_dt']+'('+res.data['now_yoil']+')');
			//견적 개수 설정
			$('#esti_cnt').html(res.data['esti_cnt']);
			//주문 개수 설정
			$('#ord_cnt').html(res.data['ord_cnt']);
			//생산완료 개수 설정
			$('#prod_cnt').html(res.data['prod_cnt']);
			//취소신청 개수 설정
			$('#cancel_cnt').html(res.data['cancel_cnt']);
			//반품신청 개수 설정
			$('#return_cnt').html(res.data['return_cnt']);
			//교환신청 개수 설정
			$('#exchange_cnt').html(res.data['exchange_cnt']);

			redraw_canvas();
		}).fail(fnc_ajax_fail);
}

/**
 * @description 매출현황 차트 xAxis max 값 계산 함수
 * @author 황호진  @version 1.0, @last update 2021/12/29
 */
function calc_max_value(n) {
	let max_str = '';
	for(let i = 0; i < n.length; i++){
		if(i === 0){
			max_str += Number(n.substr(0,1)) + 1;
		}else{
			max_str += '0'
		}
	}
	return Number(max_str);
}

/**
 * @description center_sales_status_update 매출현황 업데이트
 * @author 황호진  @version 1.0, @last update 2022/01/05
 */
function center_sales_status_update(n) {
	var url = '/main/sales_status_update';
	fnc_ajax(url , 'get' , {})
		.done(function (res) {
			interval_flag[n] = 3;
			//현재월 설정
			$('#now_month').html(res.data['now_month']);
			//한달 기한 설정
			$('#one_month').html(res.data['first_dt']+' ~ '+res.data['last_dt']);
			//주문금액 설정
			$('#ord_amt').val(res.data['ord_amt']);
			//수금금액 설정
			$('#collect_amt').val(res.data['collect_amt']);
			//미수잔액 설정
			$('#unrealized_amt').val(res.data['unrealized_amt']);
			//오늘날짜 설정
			$('#now_date').html(res.data['now_dt']+'('+res.data['now_yoil']+')');
			//견적 개수 설정
			$('#esti_cnt').html(res.data['esti_cnt']);
			//견적 금액 설정
			$('#esti_amt').html(res.data['esti_amt']);
			//발주 개수 설정
			$('#plac_cnt').html(res.data['plac_cnt']);
			//발주 금액 설정
			$('#plac_amt').html(res.data['plac_amt']);
			//시공 개수 설정
			$('#deil_cnt').html(res.data['deil_cnt']);
			//시공 금액 설정
			$('#deil_amt').html(res.data['deil_amt']);

			redraw_canvas();
		}).fail(fnc_ajax_fail);
}

/**
 * @description aps_factory_payment_chart 공장현황 업데이트
 * @author 황호진  @version 1.0, @last update 2022/01/25
 */
function aps_factory_payment_chart(n = undefined) {
	var url = '/main/aps_factory_payment_list';
	fnc_ajax(url , 'get' , {})
		.done(function (res) {
			if(n !== undefined){
				interval_flag[n] = 3;
			}
			//월 설정
			$('#factory_now_month').html(res.data.factory_now_month);
			//기한 설정
			$('#factory_dt').html(res.data.factory_first_dt+' ~ '+res.data.factory_last_dt);
			//카드결제 건수 설정
			$('#factory_card_cnt').html(res.data.factory_card_cnt);
			//현금결제 건수 설정
			$('#factory_cash_cnt').html(res.data.factory_cash_cnt);
			//자동결제 건수 설정
			$('#factory_auto_cnt').html(res.data.factory_auto_cnt);
			//통계 그리기
			aps_redraw_canvas("#canvas" , "factory_chart" , res.data.factory_payment);
		}).fail(fnc_ajax_fail);
}

/**
 * @description aps_chart 차트 그리기
 * @author 황호진  @version 1.0, @last update 2022/01/25
 */
function aps_redraw_canvas(id , target_chart , data) {

	var v;
	var max = 100000;
	var labels = [];
	var amts = [];
	if(data.length > 0){	//data 길이 검사
		var pay_amt_max = 0;

		for(let i = 0; i < data.length; i++){
			//차트 라벨 표기 문자
			labels.push(data[i]['pay_nm']+"   ");
			//데이터
			amts.push(Number(data[i]['pay_amt']));

			//데이터중 가장 높은 값 구하기
			if(Number(data[i]['pay_amt']) > pay_amt_max){
				pay_amt_max = Number(data[i]['pay_amt']);
			}
		}

		if(pay_amt_max > 0){	//마지막길이의 값 가져오기
			v = calc_max_value(String(pay_amt_max));
		}else{	//가장 높은 값이 0보다 크지 않을때
			v = max;
		}
	}else{	//data 길이가 0일때
		v = max;
	}
	if(aps_chart[target_chart] === null){
		aps_chart[target_chart] = new Chart($(id), {
			type: 'horizontalBar',
			data: {
				labels: labels,
				datasets: [{
					label: '',
					data: amts,
					borderColor: "rgba(89, 120, 185, 1)",
					backgroundColor: "rgba(242, 125, 45, 1)",
					barThickness:15,
				}],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				legend:false,
				title: {
					display:false,
				},
				tooltips: {
					mode: 'index',
					intersect: false,
					callbacks: {
						label: function(tooltipItem, data) {
							var value = data.datasets[0].data[tooltipItem.index];
							value = value.toString();
							value = value.split(/(?=(?:...)*$)/);
							value = value.join(',');
							return value+'원';
						}
					}
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					yAxes: [{
						ticks:{
							fontColor:'rgba(0,0,0)'
						},
						gridLines:false,
						// barPercentage: 1.0,
						// minBarLength: 2,
					}],
					xAxes: [{
						ticks: {
							min: 0,
							max: v,
							userCallback: function(value, index, values) {
								value = value.toString();
								value = value.split(/(?=(?:...)*$)/);
								value = value.join(',');
								return value+'원';
							},
						},
					}],
				},

			}
		});
	}else{
		aps_chart[target_chart].data.datasets = [{
			label: '',
			data: amts,
			borderColor: "rgba(89, 120, 185, 1)",
			backgroundColor: "rgba(242, 125, 45, 1)",
			barThickness:15,
		}];
		aps_chart[target_chart].update();
	}
}

/**
 * @description aps_center_payment_chart 센터 현황
 * @author 황호진  @version 1.0, @last update 2022/01/25
 */
function aps_center_payment_chart(n = undefined) {
	var url = '/main/aps_center_payment_list';
	fnc_ajax(url , 'get' , {})
		.done(function (res) {
			if(n !== undefined){
				interval_flag[n] = 3;
			}
			//월 설정
			$('#center_now_month').html(res.data.center_now_month);
			//기한 설정
			$('#center_dt').html(res.data.center_first_dt+' ~ '+res.data.center_last_dt);
			//카드결제 건수 설정
			$('#center_card_cnt').html(res.data.center_card_cnt);
			//현금결제 건수 설정
			$('#center_cash_cnt').html(res.data.center_cash_cnt);
			//자동결제 건수 설정
			$('#center_auto_cnt').html(res.data.center_auto_cnt);
			//통계 그리기
			aps_redraw_canvas("#canvas2" , "center_chart" , res.data.center_payment);
		}).fail(fnc_ajax_fail);
}
