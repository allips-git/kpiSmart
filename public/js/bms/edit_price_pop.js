/*================================================================================
 * @name: 황호진 - edit_price_pop.js	입금/직접 수정 팝업
 * @version: 1.0.0, @date: 2022-08-08
 ================================================================================*/
$(function () {
	/**
	 * @description 거래구분(입금 , 금액차감 , 금액추가)
	 * @author 황호진  @version 1.0, @last update 2022/08/08
	 */
	$('input[name=pop_at_gb]').on('change' , function () {
		let gb = $(this).data()['gb1'];
		if(gb === 'D')
		{
			$('.pop_at_gb_nm').html('입금');
		}
		else if(gb === 'M')
		{
			$('.pop_at_gb_nm').html('수정');
		}
		$('#pop_amt').trigger('input');
	});

	/**
	 * @description 금액부분 input 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/08/08
	 */
	$('#pop_amt').on('input' , function () {
		let v = Number($(this).val().replace(/[^0-9]/gi,""));	//숫자만 입력가능하도록 제한
		$(this).val(v.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));	//천자리 콤마 적용
		let gb2 = $('input[name=pop_at_gb]:checked').attr('data-gb2');	//입금 , 금액차감 , 금액추가
		let bal_amt = Number($('#pop_bal_amt').val());	//잔액
		let result;
		if(gb2 === 'D' || gb2 === 'M')
		{
			result = bal_amt - v;
		}
		else if(gb2 === 'P')
		{
			result = bal_amt + v;
		}
		$('#pop_after_amt').html(commas(result)+'원');	//계산하여 총 잔액이 얼마인지 확인
	});

	/**
	 * @description 적용버튼 눌렀을때 이벤트(신규기입 , 수정)
	 * @author 황호진  @version 1.0, @last update 2022/08/08
	 */
	$('#pop_apply_btn').on('click' , function () {

		//입력 검증
		let amt = Number($('#pop_amt').val().replaceAll(',',''));
		if(amt === 0)
		{	//금액
			toast('금액을 입력해주세요.', true, 'danger');
			$('#pop_amt').focus();
			return false;
		}

		if($('#pop_acc_dt').val() === '')
		{	//일자
			toast('일자를 입력해주세요.', true, 'danger');
			$('#pop_acc_dt').focus();
			return false;
		}

		let con = custom_fire('확인창' , '적용하시겠습니까?' , '취소' , '확인');
		con.then((result) => {
			if (result.isConfirmed) {
				//거래구분(입금,금액추가,금액차감)
				let pop_at_gb = $('input[name=pop_at_gb]:checked').data();

				//거래구분(입금 , 금액차감)에 따른 금액 마이너스 처리
				if(pop_at_gb['gb2'] === 'D' || pop_at_gb['gb2'] === 'M')
				{
					amt = (amt * -1);
				}

				let url = '/acc/pay/acc_apply';
				let type = 'POST';
				let data = {
					ik			: $('#pop_ik').val(),
					cust_cd		: $('#cust_cd').val(),
					acc_gb		: pop_at_gb['gb1'],
					trade_gb	: pop_at_gb['gb2'],
					acc_dt		: $('#pop_acc_dt').val(),
					amt			: amt,
					memo		: $('#pop_memo').val()
				};
				fnc_ajax(url , type , data)
					.done(function (res) {
						if(res.result)
						{
							toast(res.msg, false, 'info');
							$('.edit_price_pop').bPopup().close();
							start_num = 0;
							stat = false;
							get_detail_list(search_organize() , 'change');
						}
						else
						{
							toast(res.msg, true, 'danger');
						}
					}).fail(fnc_ajax_fail);
			}
		});
	});

	/**
	 * @description 삭제버튼 눌렀을때 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/08/08
	 */
	$('#pop_delete_btn').on('click' , function () {
		let con = custom_fire('확인창' , '삭제하시겠습니까?' , '취소' , '확인');
		con.then((result) => {
			if (result.isConfirmed) {
				let url = '/acc/pay/acc_del';
				let type = 'POST';
				let data = {
					ik	: $('#pop_ik').val()
				};
				fnc_ajax(url , type , data)
					.done(function (res) {
						if(res.result)
						{
							toast(res.msg, false, 'info');
							$('.edit_price_pop').bPopup().close();
							start_num = 0;
							stat = false;
							get_detail_list(search_organize() , 'delete');
						}
						else
						{
							toast(res.msg, true, 'danger');
						}
					}).fail(fnc_ajax_fail);
			}
		});
	});
});
