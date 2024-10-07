//sub.js
$(function(){
	//user_grade checkbox

	//all
	$("#look").click(function(){
		if($("#look").prop("checked")) {
			$("input:checkbox[id*=look]").prop("checked",true);
			$("input:checkbox[id*=look]").parent().addClass('change');
			$(this).parent().addClass('change');
		} else {
			$("input:checkbox[id*=look]").prop("checked",false);
			$("input:checkbox[id*=look]").parent().removeClass('change');
			$(this).parent().removeClass('change');
		}
	});

	$("#input").click(function(){
		if($("#input").prop("checked")) {
			$("input:checkbox[id*=input]").prop("checked",true);
			$("input:checkbox[id*=input]").parent().addClass('change');
			$(this).parent().addClass('change');
		} else {
			$("input:checkbox[id*=input]").prop("checked",false);
			$("input:checkbox[id*=input]").parent().removeClass('change');
			$(this).parent().removeClass('change');
		}
	});

	$("#modify").click(function(){
		if($("#modify").prop("checked")) {
			$("input:checkbox[id*=modify]").prop("checked",true);
			$("input:checkbox[id*=modify]").parent().addClass('change');
			$(this).parent().addClass('change');
		} else {
			$("input:checkbox[id*=modify]").prop("checked",false);
			$("input:checkbox[id*=modify]").parent().removeClass('change');
			$(this).parent().removeClass('change');
		}
	});

	$("#delete").click(function(){
		if($("#delete").prop("checked")) {
			$("input:checkbox[id*=delete]").prop("checked",true);
			$("input:checkbox[id*=delete]").parent().addClass('change');
			$(this).parent().addClass('change');
		} else {
			$("input:checkbox[id*=delete]").prop("checked",false);
			$("input:checkbox[id*=delete]").parent().removeClass('change');
			$(this).parent().removeClass('change');
		}
	});

	$("#admin").click(function(){
		if($("#admin").prop("checked")) {
			$("input:checkbox[id*=admin]").prop("checked",true);
			$("input:checkbox[id*=admin]").parent().addClass('change');
			$(this).parent().addClass('change');
		} else {
			$("input:checkbox[id*=admin]").prop("checked",false);
			$("input:checkbox[id*=admin]").parent().removeClass('change');
			$(this).parent().removeClass('change');
		}
	});

	//first====================================================================
	$("#look").click(function(){
		if($("#look").prop("checked")) {
			$(".chk0 input:checkbox[id*=look]").prop("checked",true);
			$(".chk0 input:checkbox[id*=look]").parent().addClass('active');
		} else {
			$(".chk0 input:checkbox[id*=look]").prop("checked",false);
			$(".chk0 input:checkbox[id*=look]").parent().removeClass('active');
		}
	});

	$("#input0").click(function(){
		if($("#input0").prop("checked")) {
			$(".chk0 input:checkbox[id*=input]").prop("checked",true);
			$(".chk0 input:checkbox[id*=input]").parent().addClass('active');
		} else {
			$(".chk0 input:checkbox[id*=input]").prop("checked",false);
			$(".chk0 input:checkbox[id*=input]").parent().removeClass('active');
		}
	});

	$("#modify0").click(function(){
		if($("#modify0").prop("checked")) {
			$(".chk0 input:checkbox[id*=modify]").prop("checked",true);
			$(".chk0 input:checkbox[id*=modify]").parent().addClass('active');
		} else {
			$(".chk0 input:checkbox[id*=modify]").prop("checked",false);
			$(".chk0 input:checkbox[id*=modify]").parent().removeClass('active');

		}
	});

	$("#delete0").click(function(){
		if($("#delete0").prop("checked")) {
			$(".chk0 input:checkbox[id*=delete]").prop("checked",true);
			$(".chk0 input:checkbox[id*=delete]").parent().addClass('active');
		} else {
			$(".chk0 input:checkbox[id*=delete]").prop("checked",false);
			$(".chk0 input:checkbox[id*=delete]").parent().removeClass('active');
		}
	});

	$("#amdin0").click(function(){
		if($("#amdin0").prop("checked")) {
			$(".chk0 input:checkbox[id*=admin]").prop("checked",true);
			$(".chk0 input:checkbox[id*=admin]").parent().addClass('active');
		} else {
			$(".chk0 input:checkbox[id*=admin]").prop("checked",false);
			$(".chk0 input:checkbox[id*=admin]").parent().removeClass('active');
		}
	});

	//second====================================================================
	$("#look00").click(function(){
		if($("#look00").prop("checked")) {
			$(".chk00 input:checkbox[id*=look]").prop("checked",true);
			$(".chk00 input:checkbox[id*=look]").parent().addClass('active');
		} else {
			$(".chk00 input:checkbox[id*=look]").prop("checked",false);
			$(".chk00 input:checkbox[id*=look]").parent().removeClass('active');
		}
	});

	$("#input00").click(function(){
		if($("#input00").prop("checked")) {
			$(".chk00 input:checkbox[id*=input]").prop("checked",true);
			$(".chk00 input:checkbox[id*=input]").parent().addClass('active');
		} else {
			$(".chk00 input:checkbox[id*=input]").prop("checked",false);
			$(".chk00 input:checkbox[id*=input]").parent().removeClass('active');
		}
	});

	$("#modify00").click(function(){
		if($("#modify00").prop("checked")) {
			$(".chk00 input:checkbox[id*=modify]").prop("checked",true);
			$(".chk00 input:checkbox[id*=modify]").parent().addClass('active');
		} else {
			$(".chk00 input:checkbox[id*=modify]").prop("checked",false);
			$(".chk00 input:checkbox[id*=modify]").parent().removeClass('active');
		}
	});

	$("#delete00").click(function(){
		if($("#delete00").prop("checked")) {
			$(".chk00 input:checkbox[id*=delete]").prop("checked",true);
			$(".chk00 input:checkbox[id*=delete]").parent().addClass('active');
		} else {
			$(".chk00 input:checkbox[id*=delete]").prop("checked",false);
			$(".chk00 input:checkbox[id*=delete]").parent().removeClass('active');
		}
	});

	$("#admin00").click(function(){
		if($("#admin00").prop("checked")) {
			$(".chk00 input:checkbox[id*=admin]").prop("checked",true);
			$(".chk00 input:checkbox[id*=admin]").parent().addClass('active');
		} else {
			$(".chk00 input:checkbox[id*=admin]").prop("checked",false);
			$(".chk00 input:checkbox[id*=admin]").parent().removeClass('active');
		}
	});

	// $('.authority-table input:checkbox').click(function(){
	// 	if ($(this).parent().hasClass('active') == true){

	// 		$(this).parent().removeClass('active');
	// 	} else {
	// 		$(this).parent().addClass('active');
	// 	}
	// });



	// //user_gd table tr select
	// $('.user_gd .search-table tr').click(function(){
	// 	$('.user_gd .search-table tr').removeClass('active');
	// 	$(this).addClass('active');
	// });



});
