/*================================================================================
 * @name: 황호진 - deli_order_pop.js	출고지시 출력물 JS
 * @version: 1.0.0, @date: 2022-07-27
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	/**
	 * @description 같은값 rowspan으로 묶어주기 위한 로직
	 * @author 황호진  @version 1.0, @last update 2022/07/28
	 */
	$.each($('.deli_print') , function (index , item) {
		var row_no = $(item).attr('data-rowno');
		$('#test'+row_no+' tbody').mergeClassRowspan(0);
		$('#test'+row_no+' tbody').mergeClassRowspan(1);
	});
	$('.deli_print').show();
	//================================================================================

	/**
	 * @description 출력버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/07/28
	 */
	$(document).on('click' , '#deli_print_btn' , function () {
		opener.parent.deli_comp($('#ik').val());
		$(this).hide();
		window.print();
		$(this).show();
	});
});

/**
 * @description td rowspan으로 묶는 함수
 * @author 황호진  @version 1.0, @last update 2022/07/27
 */
$.fn.mergeClassRowspan = function (colIdx) {
	return this.each(function () {
		var that;
		$('tr', this).each(function (row) {
			$('td:eq(' + colIdx + ')', this).filter((index , item) => $(item).attr('data-yn') === 'Y').each(function (col) {

				if ($(this).attr('data-after') == $(that).attr('data-after') && $(this).attr('data-before') == $(that).attr('data-before')) {
					rowspan = $(that).attr("rowspan") || 1;
					rowspan = Number(rowspan) + 1;

					$(that).attr("rowspan", rowspan);
					// do your action for the colspan cell here
					$(this).hide();
					//$(this).remove();
					// do your action for the old cell here
				} else {
					that = this;
				}

				// set the that if not already set
				that = (that == null) ? this : that;
			});
		});
	});
};
