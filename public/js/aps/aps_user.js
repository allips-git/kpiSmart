let p_ul_uc = '';

$(function(){
	get_list();

	$('#search').off().click(function(){
		get_list();
	});

	/** 검색 text에서 엔터키 누를 시 list */
	$("#sc").keyup(function(e){
		if(e.keyCode == 13){
			get_list();
		}
	});

	/** 수정 버튼 클릭 */
	$('#mod').off().click(function(){
		if(p_ul_uc == ''){
			toast('리스트에서 사용자를 선택하세요.', true, 'danger');
			return false;
		}else{
			if($('#ul_nm').val() != ""){
				if($('#pass').val() != "") {
					if($('#pass').val() != $('#pass_chk').val()){
						toast('비밀번호가 일치하지 않습니다.', true, 'danger');
						$('#pass').focus();
						return false;
					}
					if($('#pass').val().length < 4 ){
						toast('비밀번호는 4자리 이상입니다.', true, 'danger');
						$('#pass').focus();
						return false;
					}
				}

				if(confirm('권한을 부여하시겠습니까?')){
					$('#p_ul_uc').val(p_ul_uc);
					$('#loading').show();
					get_result();
				}
			}else{
				toast('사원명을 입력하세요.', true, 'danger');
				$('#ul_nm').focus();
				return false;
			}
		}
	});

    /** 전체허용 클릭 시  */
	$('#all_chk').off().click(function(){
		if($('#all_chk').prop("checked")){
			$('td input:checkbox').each(function(){
                if($(this).attr('name') != 'useyn'){
                    $(this).prop("checked", true);
                }
			});
		}else{
			$('td input:checkbox').each(function(){
                if($(this).attr('name') != 'useyn'){
                    $(this).prop("checked", false);
                }
			});
		}
	});
});

function get_result(){
	$.ajax({
		url: '/base/user/aps_auth',
		type: 'GET',
		data: $('#frm').serialize(),
		dataType: "json",
		success: function(result) {
			if(result.result_code == 200){
				toast('권한이 부여되었습니다.', false, 'info');
			}else{
				toast('권한 부여에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
			}

			$('#loading').hide();
			get_list();
		},
		error: function(request,status,error) {
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			$.toast('실패', {sticky: true, type: 'danger'});
		},
	});
}

function get_list(){
	$("#myTable").tablesorter({theme : 'blue'});	//테이블 정렬 기능

	$.ajax({
		url: '/base/user/get_list',
		type: 'GET',
		data: {
			op : $('#op').val(),
			sc : $('#sc').val()
		},
		dataType: "json",
		success: function(result) {
			let list = '';
			let cnt = 1;

			if(result.list.length == 0){
				var v = padding_left_val('myTable');
				list += '<tr>';
				list += '<td colspan="9" style="text-align: left; padding-left: '+v+'px">조회 가능한 데이터가 없습니다.</td>';
				list += '</tr>';
			}else{
				$.each(result.list, function(index, item){
					list +='<tr class="at" id="list_'+item.ul_uc+'">';
					list +='<td class="w5">'+cnt+'</td>';
					list +='<td class="w15 tb_click" onclick="get_info(\''+item.id+'\', \''+item.ul_nm+'\', \''+item.ul_uc+'\');">'+item.admin_gb+'</td>';
					list +='<td class="w15 tb_click" onclick="get_info(\''+item.id+'\', \''+item.ul_nm+'\', \''+item.ul_uc+'\');">'+item.ul_nm+"("+item.id+")"+'</td>';
					list +='<td class="w10">'+item.tel+'</td>';
					list +='<td class="w15 T-left">'+item.memo+'</td>';
					list +='<td class="w10">'+item.reg_nm+"("+item.reg_id+")"+'</td>';
					list +='<td class="w10">'+item.reg_dt+'</td>';
					list +='<td class="w10">'+item.mod_nm+"("+item.mod_id+")"+'</td>';
					list +='<td class="w10">'+item.mod_dt+'</td>';
					list +='</tr>';

					cnt++;
				});
			}

			$('#list').html(list);
			$('#user_cnt').html(cnt-1);
			$("#myTable").trigger("update");
		},
		error: function(request,status,error) {
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			$.toast('실패', {sticky: true, type: 'danger'});
		},
	});
}

/**
 * @description 조회가능한 데이터 없을 경우 해상도에 따른 설정할 padding값 가져오기
 * @author 황호진  @version 1.0, @last update 2021/10/01
 */
function padding_left_val(id) {
	var screen_width = screen.availWidth;	//실제 사용중인 모니터 길이
	var id_width = document.getElementById(id).clientWidth;	//지정한 id의 길이
	var result;
	if(screen_width === 2560){	//해상도 2560*1440
		result = id_width/2;
	}else if(screen_width === 1920){	//해상도 1920*1080
		result = id_width/3;
	}else if(screen_width === 1440){	//해상도 1440*900
		result = id_width/5;
	}else{	//그이외에...
		result = id_width/3;
	}
	return result;
}

function get_info(id, ul_nm, ul_uc){
	chk_reset();
	$('tr').removeClass('active');
	$('#list_'+ul_uc+'').addClass('active');

	var l = 'Y';
	var i = 'Y';
	var m = 'Y';
	var d = 'Y';
	var a = 'Y';

	$('#id').val(id);
	$('#id').addClass('gray');
	$('#id').prop('readonly', true);
	$('#ul_nm').val(ul_nm);

	$.ajax({
		url: '/base/user/get_info',
		type: 'GET',
		data: {
			ul_uc : ul_uc
		},
		dataType: "json",
		success: function(result) {
			p_ul_uc = ul_uc;

			$.each(result.list, function(index, item){
				item.read == "Y" ? $("input:checkbox[name='read["+item.pgm_id+"]']").prop("checked", true) : $("input:checkbox[name='read["+item.pgm_id+"]']").prop("checked", false);
				item.write == "Y" ? $("input:checkbox[name='write["+item.pgm_id+"]']").prop("checked", true) : $("input:checkbox[name='write["+item.pgm_id+"]']").prop("checked", false);
				item.modify == "Y" ? $("input:checkbox[name='modify["+item.pgm_id+"]']").prop("checked", true) : $("input:checkbox[name='modify["+item.pgm_id+"]']").prop("checked", false);
				item.delete == "Y" ? $("input:checkbox[name='delete["+item.pgm_id+"]']").prop("checked", true) : $("input:checkbox[name='delete["+item.pgm_id+"]']").prop("checked", false);
				item.admin == "Y" ? $("input:checkbox[name='admin["+item.pgm_id+"]']").prop("checked", true) : $("input:checkbox[name='admin["+item.pgm_id+"]']").prop("checked", false);

				if(item.read == 'N'){
					l = 'N';
				};
				if(item.write == 'N'){
					i = 'N';
				};
				if(item.modify == 'N'){
					m = 'N';
				};
				if(item.delete == 'N'){
					d = 'N';
				};
				if(item.admin == 'N'){
					a = 'N';
				};

				if(l == 'Y'){
					$("input:checkbox[id='look']").prop("checked", true);
				}
				if(i == 'Y'){
					$("input:checkbox[id='input']").prop("checked", true);
				}
				if(m == 'Y'){
					$("input:checkbox[id='modify']").prop("checked", true);
				}
				if(d == 'Y'){
					$("input:checkbox[id='delete']").prop("checked", true);
				}
				if(a == 'Y'){
					$("input:checkbox[id='admin']").prop("checked", true);
				}
			});
		},
		error: function(request,status,error) {
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			$.toast('실패', {sticky: true, type: 'danger'});
		},
	});
}

function chk_reset(){ // 체크 박스 리셋
	$('#pass, #pass_chk').val('');

	$('input[type=checkbox]').each(function(){
		if($(this).attr('data-list') != 'Y'){
			$(this).prop('checked', false);
		}
	});
}
