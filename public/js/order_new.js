$(function(){

	$('.item-table .summary-btn').click(function(){
		if ($(this).parent().parent('tr').hasClass('act')==false){
			$('.item-table tr.open').removeClass('act');
			$(this).parent().parent('tr').addClass('act');
			$('.item-table tr.hidden').hide();
			$(this).parent().parent('tr').next('tr.hidden').show();
		} else {
			$(this).parent().parent('tr').removeClass('act');
			$(this).parent().parent('tr').next('tr.hidden').hide();
		}
	});

	/*$('.summery .order_detail').mouseover(function(){
		alert('ok');
		$(this).css('background-color', 'orange');
		$(this).parent().next('.trR').children('td').css('background-color', 'orange');
	});*/

	/*
	$('.upload-list .summary-btn').click(function(){
		if ($(this).parent().parent('tr').hasClass('active')==false){
			$('.upload-list tr.open').removeClass('active');
			$(this).parent().parent('tr').addClass('active');
			$('.upload-list tr.hidden').hide();
			$(this).parent().parent('tr').next('tr.hidden').show();
		} else {
			$(this).parent().parent('tr').removeClass('active');
			$(this).parent().parent('tr').next('tr.hidden').hide();
		}
	});*/
});