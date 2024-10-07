$(function(){
	
	$('tr.question').click(function(){
		if ($(this).hasClass('active')==false){
			$('tr.question').removeClass('active');
			$(this).addClass('active');
			$('tr.answer').hide();
			$(this).next('tr.answer').show();
		} else {
			$(this).removeClass('active');
			$(this).next('tr.answer').hide();
		}
	});
});