/*================================================================================
 * @description 공장 제품코드 등록 옵션팝업 JS
 * @author 황호진, @version 1.0, @last date 2022/01/17
 ================================================================================*/
$(document).ready(function(){
	$(document).on('click','.switch', function () {
		var con = confirm('가용 여부를 변경하시겠습니까?');
		if(con){
			var id = $(this).attr("id");
			var ik = id.replace('switch_','');
			useyn_change(ik);
		}
	});
});
/**
 * @description 가용여부 on/off
 */
function useyn_change(ik) {
	var url = '/base/item_in/useyn_change';
	var type = 'GET';
	var data = {
		'ik' : ik
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				if($("#useyn_"+ik).is(":checked") === true){
					$("#useyn_"+ik).prop('checked', false);	//checked => false

					toast('가용여부 Off로 변경 완료되었습니다.', false, 'info');
				}else{
					$("#useyn_"+ik).prop('checked', true);	//checked => true

					toast('가용여부 On으로 변경 완료되었습니다.', false, 'info');
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
/**
 * @description 상세정보 가져오기
 */
function get_detail(ik , sysyn) {

	$("#p3").val('up');
	$("#div_in").css('display', 'none');

	if(sysyn === 'Y'){
		$("#div_up").css('display', 'none');
	}else{
		$("#div_up").css('display', 'block');
	}

	var input_field = new Array("ikey3","key_name2","unit_amt", "list_ikey", "list_parent");
	var select_field = new Array("key_parent" , "unit");

	var str = ""
	var tdArr = new Array();

	var tr = $("#tr_"+ik);
	var td = tr.children();

	td.each(function(i){
		tdArr.push(td.eq(i).text());
	});

	var unit = $("#unit_"+ik).attr('data-text');
	var amt = td.eq(5).text().replaceAll(",","");
	amt = amt.replace("원","");

	$("#"+input_field[0]).val(ik);
	$("select[name="+select_field[0]+"]").val($("#kp_"+ik).val()).attr('selected', 'selected');
	$("#"+input_field[1]).val(td.eq(4).text());
	$("#"+input_field[2]).val(amt);
	$("#"+select_field[1]).val(unit);
}
/**
 * @description submit confim message
 */
function op_chk() { // id type

	var txt = send_gb($('#p3').val()); // type : in, up. del
	if(!confirm(txt+' 하시겠습니까?')) {
		return false;
	}

}

/**
 * @description delete
 */
function op_del() {
	var con = confirm('삭제하시겠습니까?');
	if(con){
		var ik = $("#ikey3").val();
		location.href = '/base/item_in/d?p=odel&ikey='+ik;
	}
}
