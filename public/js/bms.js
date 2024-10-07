$(function(){

	$('.header .menu li').click(function(){
		$(this).children('.submenu').fadeIn();
	});

	$('.header .menu li').mouseleave(function(){
		$(this).children('.submenu').stop().fadeOut();
	});

	$('.header .toggle_btn').click(function(){
		$('.aside').toggleClass('hidden');
		$(this).toggleClass('active');
		$('.container').toggleClass('open');
	});

	$('ul.menu li').click(function(){
		$('.aside').removeClass('hidden');
		$('.container').removeClass('open');
		$('.aside .toggle_btn').removeClass('active');
	});

	//
	$(".sub-menu").hide();
	$(".sub-menu:first").show();

	$(".menu li").click(function () {
		$(".menu li").removeClass("active");
		$(this).addClass("active");
		$(".sub-menu").hide()
		var activeTab = $(this).attr("rel");
		$("#" + activeTab).show()
	});

	//sidebar drop menu
	$('.aside .sub-menu > li').click(function(){

		if ($(this).hasClass('active') == false) {
			$('.aside .sub-menu > li').removeClass('active');
			$('.aside .sub-menu > li a').removeClass('active');



			$(this).addClass('active');
			$(this).children('a').addClass('active');
			$('.aside .sub-menu .dropmenu').slideUp(400);
			$(this).next('.aside .sub-menu .dropmenu').slideDown(400);
		} else {
			$(this).removeClass('active');
			$(this).children('a').removeClass('active');
			$('.aside .sub-menu .dropmenu').slideUp(400);
			$(this).next('.aside .sub-menu .dropmenu').slideUp(400);
		}

		var current = $("#site_url").val();
		$('.aside .sub-menu > li a').each(function() {
			var $this = $(this);

			// we check comparison between current page and attribute redirection.
			if ($this.attr('href') === current) {
				$this.addClass('active');
				$this.parent().addClass('active');
			}
		})

		$('.aside .sub-menu > .dropmenu li a').each(function() {
			var $this = $(this);

			if ($this.attr('href') === current) {
				$this.parents('.dropmenu').prev('li').children('a').addClass('active');
			}
		})

	});

	$(document).ready(function(){
		(function() {
			//var current = location.pathname;
			var current = $("#site_url").val();
			$('.aside .sub-menu > .dropmenu li a').each(function() {
				var $this = $(this);
				var href = $this.attr('href').split('?');
				if(href[0] === current) {
					//if ($this.attr('href') === current) {
					$this.addClass('active');
					//$this.parents('.dropmenu').slideDown();
					$this.parents('.dropmenu').css('display', 'block');
					$this.parents('.dropmenu').prev('li').addClass('active');
					$this.parents('.dropmenu').prev('li').children('a').addClass('active');
					$this.parents('.sub-menu').addClass('active');
					$(".sub-menu").hide();
					$(".sub-menu.active").show();

					var ID = $this.parents('.sub-menu').attr('id');

					$(".header .menu").find('#'+ID+'0').addClass('active');
				}
			});
		})();

		(function() {
			//var current = location.pathname;
			var current = $("#site_url").val();
			$('.aside .sub-menu > li a').each(function() {
				var $this = $(this);

				// we check comparison between current page and attribute redirection.
				if ($this.attr('href') === current) {
					$this.addClass('active');
					$this.parent().addClass('active');
					$this.parents('.sub-menu').addClass('active');
					$(".sub-menu").hide();
					$(".sub-menu.active").show();

					var ID = $this.parents('.sub-menu').attr('id');

					$(".header .menu").find('#'+ID+'0').addClass('active');
				}
			});
		})();
	});

	$('.ac tr').click(function(){
		$('.ac tr').removeClass('active');
		$(this).addClass('active')
	});

	$('.ac td').click(function(){
		$('.ac td').removeClass('active');
		$(this).addClass('active')
	});

	$('.at tr').click(function(){
		$('.at tr').removeClass('active');
		$(this).addClass('active')
	});

	$('.at td').click(function(){
		$('.at td').removeClass('active');
		$(this).addClass('active')
	});

	//backtop
	$(window).scroll(function(){
		var WT = $(window).scrollTop(),
			Wh = $(window).height(),
			Dh = $(document).height(),
			Fh = $(".footer").innerHeight();

		if (WT > Dh-Wh-Fh) {
			$(".back-top span").removeClass('fixed');
		} else {
			$(".back-top span").addClass('fixed');
		}

		if ($(this).scrollTop() > 100) {
			$('.back-top span').fadeIn(400);
			$('.back-top span').addClass("show");

		} else {
			$('.back-top span').fadeOut(400);
			$('.back-top span').removeClass("show");

		}
	});

	$('.back-top').click(function(){
		$('body, html').animate({ scrollTop: 0 }, 700); return false;
	});


	//date

	$(document).on('mouseover' , '.notyet' , function () {
		$(this).addClass('show');
	});

	$(document).on('mouseleave' , '.notyet' , function () {
		$(this).removeClass('show');
	});
});
