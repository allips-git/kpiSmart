$(function () {

	$('#btn_question').on('click',function () {
		if(input_check()){
		var con = confirm('문의사항을 등록하시겠습니까?');
			if(con){
				var url = '/question/i';
				var type = 'POST';
				var qn_gb = {
					product		: $('input[name=product]:checked').val()
				};
				var data = {
					qn_gb		: JSON.stringify(qn_gb),
					name		: $('#name').val(),
					tel			: $('#tel').val(),
					email		: $('#email').val(),
					qn_content	: $('#qn_content').val()
				};
				fnc_ajax(url , type , data)
					.done(function (res) {
						if(res.result){
							alert(res.msg);
							location.href = '/';
						}else{
							toast(res.msg, true, 'danger');
						}
					}).fail(fnc_ajax_fail);
			}
		}
	});

	$("#tel").on("input", function() {$(this).val( $(this).val().replace(/[^0-9-]/gi,"") );});
});

function input_check() {
	var check_list = ['name' , 'tel' , 'email' , 'qn_content'];
	var flag = true;
	$.each(check_list, function (i, list) {
		if($('#'+list).val() == ""){
			var fleid_name = $("#"+list).attr('data-text');
			toast(fleid_name+'은(는) 필수입력입니다. 입력 후 다시 시도해주세요.', true, 'danger');
			$('#'+list).focus();
			flag = false;
			return false;
		}
	});
	if(!flag){
		return false;
	}
	return true;
}
