/*================================================================================
 * @name: 황호진 - pay_detial.js	매출수금 상세화면
 * @version: 1.0.0, @date: 2022-08-01
 ================================================================================*/
let start_num = 0;
let stat = true;
const max_num = 50;
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	get_detail_list(search_organize());
	//================================================================================

	//이벤트
	//================================================================================
	/**
	 * @description 스크롤 기반 데이터 더보기 형태의 조회
	 * @author 황호진  @version 1.0, @last update 2022/08/08
	 */
	$('#content').on("scroll", function(){
		let scroll_top = $(this).scrollTop();
		let inner_height = $(this).innerHeight();
		let scroll_height = $(this).prop('scrollHeight');
		if (scroll_top + inner_height >= scroll_height) // 스크롤 끝 부분쯤 도착했을 시
		{
			if(stat)
			{
				get_detail_list(search_organize() , 'scroll');
			}
		}
	});

	/**
	 * @description 입금/직접 수정 팝업 열기
	 * @author 황호진  @version 1.0, @last update 2022/08/08
	 */
	$('.edit_price').click(function(){
		let url = '/acc/pay/get_acc_info';
		let type = 'GET';
		let data = {
			cust_cd : $('#cust_cd').val()
		};
		fnc_ajax(url , type , data)
			.done(function (res) {
				//ik 설정
				$('#pop_ik').val('');

				//거래구분 초기값(입금)
				$('#pop_at_gb1').prop('checked' , true).trigger('change');

				//거래처명 설정
				$('#pop_cust_nm').html(res.data.cust_nm);

				//잔액 설정
				$('#pop_amt').val('0');
				$('#pop_bal_amt').val(res.data.bal_amt);
				$('#pop_before_amt').html(commas(res.data.bal_amt)+'원');
				$('#pop_after_amt').html(commas(res.data.bal_amt)+'원');

				//입금일자 설정
				//max => 이 후의 날짜 선택 불가능
				//min => 이 전의 날짜 선택 불가능(1년 전꺼는 불가) '2022-08-08T10:10'
				let default_time = new Date().format("yyyy-MM-ddTHH:mm");
				// 현재 날짜 및 시간
				var now = new Date();
				// 1년 제한 걸기
				let min = new Date(now.setFullYear(now.getFullYear() - 1)).format("yyyy-MM-ddTHH:mm");
				$('#pop_acc_dt').val(default_time).attr('min' , min);

				//비고 설정
				$('#pop_memo').val('');

				//삭제버튼 비활성화
				$('#pop_delete_btn').hide();

				$('.edit_price_pop').bPopup({
					modalClose: true ,
					opacity: 0.8 ,
					positionStyle: 'absolute' ,
					speed: 300 ,
					transition: 'fadeIn' ,
					transitionClose: 'fadeOut' ,
					zIndex : 99997
					//, modalColor:'transparent'
				});
			}).fail(fnc_ajax_fail);
	});
	//================================================================================
});

/**
 * @description 날짜 포멧 함수
 * @author 황호진  @version 1.0, @last update 2022/08/08
 */
Date.prototype.format = function(f) {
	if (!this.valueOf()) return " ";
	let weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	let d = this;
	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
			case "yyyy": return d.getFullYear();
			case "yy": return (d.getFullYear() % 1000).zf(2);
			case "MM": return (d.getMonth() + 1).zf(2);
			case "dd": return d.getDate().zf(2);
			case "E": return weekName[d.getDay()];
			case "HH": return d.getHours().zf(2);
			case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
			case "mm": return d.getMinutes().zf(2);
			case "ss": return d.getSeconds().zf(2);
			case "a/p": return d.getHours() < 12 ? "오전" : "오후";
			default: return $1;
		}
	});
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};


/**
 * @description 검색란 조건 정리
 * @author 황호진  @version 1.0, @last update 2022/08/01
 */
function search_organize() {
	return {
		'start_num'	: start_num,
		'cust_cd'	: $('#cust_cd').val(),
	}
}

/**
 * @description get_detail_list
 * @author 황호진  @version 1.0, @last update 2022/08/01
 */
function get_detail_list(data , event_type) {
	let url = '/acc/pay/get_detail_list';
	let type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			let len = res.data.length;
			let str = '';

			if(event_type === 'change' || event_type === 'delete')
			{
				$('#content').scrollTop(0);
				$('#detail_list').html('');
			}

			if(len > 0)
			{
				$.each(res.data , function (i , list) {
					if(list.acc_gb === "D" || list.acc_gb === "M")
					{	//입금 , 수정의 경우 수정 팝업이 떠야함
						str += '<tr onclick=mod_price_pop("'+ list.ikey +'")>';
					}
					else
					{	//그 이외
						str += '<tr>';
					}
					str += '<td class="w4">';
					if(list.acc_gb === "S")
					{	//매출
						str += '<span class="blue">'+ list.acc_gb_nm +'</span>';
					}
					else if(list.acc_gb === "D")
					{	//입금
						str += '<span class="red">'+ list.acc_gb_nm +'</span>';
					}
					else if(list.acc_gb === "M")
					{	//수정
						str += '<span class="red">'+ list.acc_gb_nm +'</span>';
					}
					else if(list.acc_gb === "R")
					{	//반품
						str += '<span class="yellow">'+ list.acc_gb_nm +'</span>';
					}
					str += '</td>';
					str += '<td class="w6">';
					if(list.acc_gb === "S")
					{	//매출
						str += '<span class="blue">'+ list.trade_gb_nm +'</span>';
					}
					else if(list.acc_gb === "D")
					{	//입금
						str += '<span class="red">'+ list.trade_gb_nm +'</span>';
					}
					else if(list.acc_gb === "M")
					{	//수정
						str += '<span class="red">'+ list.trade_gb_nm +'</span>';
					}
					else if(list.acc_gb === "R")
					{	//반품
						str += '<span class="yellow">'+ list.trade_gb_nm +'</span>';
					}
					str += '</td>';
					str += '<td class="w10">'+ list.acc_dt +'</td>';
					str += '<td class="w14 Elli T-left">'+ list.cust_nm +'</td>';
					str += '<td class="w5">'+ list.acc_type_nm +'</td>';
					str += '<td class="w7">'+ list.person +'</td>';
					if(list.acc_gb === "S")
					{	//매출
						str += '<td class="w7 T-right"></td>';
						str += '<td class="w7 T-right"></td>';
						str += '<td class="w7 T-right">'+ commas(Number(list.hap_amt)) +'</td>';
					}
					else if(list.acc_gb === "D")
					{	//입금
						str += '<td class="w7 T-right">'+ commas(Number(list.hap_amt)) +'</td>';
						str += '<td class="w7 T-right"></td>';
						str += '<td class="w7 T-right"></td>';
					}
					else if(list.acc_gb === "M")
					{	//수정
						str += '<td class="w7 T-right"></td>';
						str += '<td class="w7 T-right">'+ commas(Number(list.hap_amt)) +'</td>';
						str += '<td class="w7 T-right"></td>';
					}
					else if(list.acc_gb === "R")
					{	//반품
						str += '<td class="w7 T-right"></td>';
						str += '<td class="w7 T-right">'+ commas(Number(list.hap_amt)) +'</td>';
						str += '<td class="w7 T-right"></td>';
					}

					str += '<td class="w7 T-right">'+ commas(Number(list.misu_amt)) +'</td>';
					str += '<td class="w7 T-right">'+ commas(Number(list.bal_amt)) +'</td>';
					str += '<td class="Elli T-left">'+ list.memo +'</td>';
					str += '</tr>';
				});

				$('#detail_list').append(str);

				if(len === max_num)
				{	//불러온 데이터 수가 10일 경우 다음이 있다 판단하여 start_num에 값을 더함
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
					str += '<tr>';
					str += "<td colspan='12'>조회 가능한 데이터가 없습니다.</td>";
					str += '</tr>';
					$('#detail_list').html(str);
				}
			}
		}).fail(fnc_ajax_fail)
}

/**
 * @description 입금 직접 수정 팝업(수정용)
 * @author 황호진  @version 1.0, @last update 2022/08/08
 */
function mod_price_pop(ik) {
	let url = '/acc/pay/get_mod_acc_info';
	let type = 'GET';
	let data = {
		ik 		: ik,
		cust_cd	: $('#cust_cd').val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			
			let info = res.data.info;
			let detail = res.data.detail;

			//ik 설정
			$('#pop_ik').val(ik);

			//거래구분 설정
			if(detail['acc_gb'] === 'D' && detail['trade_gb'] === 'D')
			{	//입금 , 입금처리 일때
				$('#pop_at_gb1').prop('checked' , true);
			}
			else if(detail['acc_gb'] === 'M' && detail['trade_gb'] === 'M')
			{	//수정 , 금액차감 일때
				$('#pop_at_gb2').prop('checked' , true);
			}
			else if(detail['acc_gb'] === 'M' && detail['trade_gb'] === 'P')
			{	//수정 , 금액추가 일때
				$('#pop_at_gb3').prop('checked' , true);
			}

			//거래처명 설정
			$('#pop_cust_nm').html(info.cust_nm);

			let bal_amt = Number(info.bal_amt);	//미수잔액
			let abs_amt = Math.abs(detail.amt);	//절대값 금액
			let amt = Number(detail.amt);		//금액

			//잔액 설정
			$('#pop_amt').val(commas(abs_amt));									//입금금액
			$('#pop_bal_amt').val(bal_amt + (amt * -1));						//총잔액(수정일 경우에는 입금금액을 포함시킴)
			$('#pop_before_amt').html(commas(bal_amt + (amt * -1))+'원');	//입금 전 잔액
			$('#pop_after_amt').html(commas(bal_amt)+'원');						//입금 후 잔액

			// 현재 날짜 및 시간
			let now = new Date();
			// 1년 제한 걸기
			let min = new Date(now.setFullYear(now.getFullYear() - 1)).format("yyyy-MM-ddTHH:mm");
			$('#pop_acc_dt').val(detail['acc_dt']).attr('min' , min);

			//비고 설정
			$('#pop_memo').val(detail['memo']);

			//삭제버튼 활성화
			$('#pop_delete_btn').show();

			$('.edit_price_pop').bPopup({
				modalClose: true ,
				opacity: 0.8 ,
				positionStyle: 'absolute' ,
				speed: 300 ,
				transition: 'fadeIn' ,
				transitionClose: 'fadeOut' ,
				zIndex : 99997
				//, modalColor:'transparent'
			});
		}).fail(fnc_ajax_fail);
}
