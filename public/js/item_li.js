$(function(){
	
	$('tr.open').click(function(){
		if ($(this).hasClass('active')==false){
			$('tr.open').removeClass('active');
			$(this).addClass('active');
			$('tr.hidden').hide();
			$(this).next('tr.hidden').show();
		} else {
			$(this).removeClass('active');
			$(this).next('tr.hidden').hide();
		}
	});

	//sale_in table tr open/close
	$('.tr-open-btn').click(function(){
		$('tr.hidden').show();
	});

	$('.tr-close-btn').click(function(){
		$('tr.hidden').hide();
	});
});