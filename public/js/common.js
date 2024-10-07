$(function(){

		/*$(document).ready(function(){
            $("html").smoothWheel()
        });*/

	$(window).load(function(){
		$('body').css({
				'visibility':'visible', 'opacity':1
		});
	});


	$('header .nav > li').mouseover(function(){
		$(this).children('.submenu').fadeIn(400);
	});

	$('header .nav > li').mouseleave(function(){
		$('.submenu').fadeOut(100);
	});


});