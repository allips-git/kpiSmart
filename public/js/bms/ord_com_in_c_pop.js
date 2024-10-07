
$(function () {
	/**
	 * @description 히스토리 보기 팝업 열기
	 * @author 황호진  @version 1.0, @last update 2022/05/27
	 */
	$('.history_open').on('click' , function () {
		var url = '/cen/ord_com_c/get_history_data';
		var type = 'GET';
		var data = {
			ord_no	: $('#ord_no').val()
		};
		fnc_ajax(url , type , data)
			.done(function (res) {
				var str = '';
				$.each(res.data , function (i , list) {
					str += '<tr>';
					str += '<td class="w20">'+ list.reg_dt +'</td>';
					str += '<td class="w12">'+ list.reg_ikey +'</td>';
					str += '<td class="Elli">'+ list.item_nm +'</td>';
					str += '<td class="w9">'+ list.width +'</td>';
					str += '<td class="w9">'+ list.height +'</td>';
					str += '<td class="w9">'+ list.qty +'</td>';
					str += '<td class="w9">';
					if(list.app_gb === 'A'){
						str += '<span class="blue">승인</span>';
					}else if(list.app_gb === 'C'){
						str += '<span class="red">취소</span>';
					}
					str += '</td>';
					str += '</tr>';
				});

				$('#history_list').html(str);

				$('.ord_com_in_c_pop').bPopup({
					modalClose: true,
					opacity: 0.8,
					positionStyle: 'absolute',
					speed: 300,
					escClose: false,
					transition: 'fadeIn',
					transitionClose: 'fadeOut',
					zIndex: 99990
					//, modalColor:'transparent'
				});

			}).fail(fnc_ajax_fail)
	});
});
