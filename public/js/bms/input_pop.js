/*================================================================================
 * @name: 황호진 - input_pop.js 입고 공용 팝업
 * @version: 1.0.0
 ================================================================================*/
$(function () {
	/**
	 * @description 팝업 닫기
	 * @author 황호진  @version 1.0, @last update 2022/07/01
	 */
	$('#input_can_btn').on('click' , function () {
		$('.input_pop').bPopup().close();
	});

	/**
	 * @description 입고완료
	 * @author 황호진  @version 1.0, @last update 2022/07/01
	 */
	$('#input_com_btn').on('click' , function () {
		var con = custom_fire('확인창' , '입고완료하시겠습니까?' , '취소' , '확인');
		con.then((result) => {
			if (result.isConfirmed) {
				var url = $('#input_url').val()+'/in_com';
				var type = 'POST';
				var data = {
					ik		: $('#input_ik').val(),
					in_dt	: $('#in_dt').val()
				};
				fnc_ajax(url , type , data)
					.done(function (res) {
						if(res.result){
							toast(res.msg, false, 'info');

							var search_data = $("#frm").serialize();
							get_list(search_data);
							$('.input_pop').bPopup().close();
						}else{
							toast(res.msg, true, 'danger');
						}
					}).fail(fnc_ajax_fail);
			}
		});
	});
});
