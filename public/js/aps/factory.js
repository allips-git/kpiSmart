let fa_local_cd = '';
let p_pd_cd = '';

$(function(){
	/** 제품 선택 팝업창 닫기 누를 시 값 저장 */
	$($('input:checkbox[name="pd_cd"]')).click (function(){
		p_pd_cd = '';

		$.each($('input:checkbox[name="pd_cd"]'), function(index, item){
			if(this.checked == true){
				p_pd_cd += $(this).val()+",";
			}
		});

		p_pd_cd = p_pd_cd.slice(0, -1);

		$('#pd_cd').val(p_pd_cd);
	});

	get_list(); // 초기 리스트 get

	/** 검색 버튼 클릭 시 리스트 get */
	$('#search').off().click(function(){
		get_list();
	});

	/** 리셋 버튼 */
	$('#reset').off().click(function(){
		get_reset();
	});

	/** 검색 text에서 엔터키 누를 시 list */
	$("#sc").keyup(function(e){
		if(e.keyCode == 13){
			get_list();
		}
	});

	/** 전체허용 버튼 클릭 시 관리자 메뉴 제외하고 check => true/false */
	$('#all_chk').off().click(function(){
		if($('#all_chk').prop("checked")){
			$("td input:checkbox[id*=pgm]").prop("checked",true);
		}else{
			$('td input:checkbox[id*=pgm]').each(function(){
				if($(this).attr('data-admin') != "Y"){
					$(this).prop("checked", false);
				}
			});
		}
	});

	/** 등록, 수정 버튼 클릭 시 */
	$('#in, #up').off().click(function(){
		var kind = $(this).attr('id');
		let con;

		if(input_check()){
			if(kind == "in"){
				con = confirm('등록하시겠습니까?');
			}else{
				con = confirm('수정하시겠습니까?');
			}

			if(con){
				$('#local_cd').val(fa_local_cd);
				$("input:checkbox").prop('disabled', false);
				$('#loading').show();
				get_result();
			}
		};
	});

	/* 리스트 => 사용여부 on / off */
	$(document).on('click', '.switch', function(){
		let local_cd = $(this).children('input').attr('data-local');
		let useyn = $(this).children('input').val();

		if(confirm('가용 여부를 변경하시겠습니까?')){
			stat_change(local_cd, useyn);
		}
	});

	/* 카카오톡 API 발신번호 입력제한 걸기 */
	$("#call_back").on("input", function() {
		$(this).val($(this).val().replace(/[^0-9-]/gi,""));
	});
});

/**
 * @description 공장 리스트
 */
function get_list(){
	$("#myTable").tablesorter({theme : 'blue'});	//테이블 정렬 기능

	$.ajax({
		url: '/base/factory/get_list',
		type: 'POST',
		data: {
			op1     :   $('#op1').val(),
			sc      :   $('#sc').val(),
			op2     :   $('#op2').val(),
			op3     :   $('#op3').val()
		},
		dataType: "json",
		success: function(result) {
			let fac_list = '';
			let num = 1;
			let cnt = 0;

			if(result.list.length == 0){
				fac_list += '<tr>';
				fac_list += '<td colspan="16">조회 가능한 데이터가 없습니다.</td>';
				fac_list += '</td>';
			}else{
				$.each(result.list, function(index, item){
					fac_list += '<tr id="list_'+item.local_cd+'">';
					fac_list += '<td class="w3">'+num+'</td>';
					fac_list += '<td class="w3">'+item.country_nm+'</td>';
					fac_list += '<td class="w">'+item.biz_gb+'</td>';
					fac_list += '<td class="w tb_click" onclick="get_info(\''+item.local_cd+'\')">'+item.local_cd+'</td>';
					fac_list += '<td class="w T-left Elli tb_click" onclick="get_info(\''+item.local_cd+'\')">'+item.fa_nm+'</td>';
					fac_list += '<td class="w T-left Elli">'+item.biz_nm+'</td>';
					fac_list += '<td class="w">';
					fac_list += '<label class="switch" style="cursor: pointer;">';
					if(item.useyn == 'Y'){
						fac_list += '<input type="checkbox" id="use_'+item.local_cd+'" value="'+item.useyn+'" data-local="'+item.local_cd+'" checked disabled>';
					}else{
						fac_list += '<input type="checkbox" id="use_'+item.local_cd+'" value="'+item.useyn+'" data-local="'+item.local_cd+'" disabled>';
					}
					fac_list += '<span class="slider round"></span>';
					fac_list += '<span class="offtxt">off</span>';
					fac_list += '<span class="ontxt">on</span>';
					fac_list += '</label>';
					fac_list += '</td>';
					fac_list += '<td class="w">'+num_format(item.tel,1)+'</td>';
					fac_list += '<td class="w Elli T-left">'+"("+item.biz_zip+")"+item.address+" "+item.addr_detail+'</td>';
					fac_list += '<td class="w">'+item.ceo_nm+'</td>';
					fac_list += '<td class="w">'+num_format(item.ceo_tel,1)+'</td>';
					fac_list += '<td class="w T-left Elli">'+item.memo+'</td>';
					fac_list += '<td class="w6">'+item.reg_nm+"("+item.reg_id+")"+'</td>';
					fac_list += '<td class="w6">'+item.reg_dt+'</td>';
					if(item.mod_nm != ''){
						fac_list += '<td class="w6">'+item.mod_nm+"("+item.mod_id+")"+'</td>';
						fac_list += '<td class="w6">'+item.mod_dt+'</td>';
					}else{
						fac_list += '<td class="w6"></td>';
						fac_list += '<td class="w6"></td>';
					}
					fac_list += '</tr>';

					num++;
					cnt++;
				});
			}

			$('#fac_list').html(fac_list);
			$('#cnt').html(cnt);

			$("#myTable").trigger("update");
		},
		error: function(request,status,error) {
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			$.toast('실패', {sticky: true, type: 'danger'});
		},
	});
}

/**
 * @description 정보 get
 */
function get_info(local_cd){
	$('tr').removeClass('active');
	$('#list_'+local_cd+'').addClass('active');
	get_reset();

	$.ajax({
		url: '/base/factory/get_info',
		type: 'POST',
		data: {
			local_cd : local_cd
		},
		dataType: "json",
		success: function(result) {
			fa_local_cd = local_cd;

			if(result.info['item'] != ""){
				$('#pd_cd').val(result.info['item']);
				var item = result.info['item'].split(',');

				$.each(item, function(index, i){
					$('#chk'+i+'').prop('checked', true);
				});
			}

			$('#p').val('up');
			$('#in').hide();
			$('#up').show();

			$("input[name='useyn']:radio[value='"+result.info['useyn']+"']").prop("checked",true);
			if(result.info['houseyn'] == 'Y'){
				$('#houseyn').prop('checked', true);
			}else{
				$('#houseyn').prop('checked', false);
			}
			if(result.info['placeyn'] == 'Y'){
				$('#placeyn').prop('checked', true);
			}else{
				$('#placeyn').prop('checked', false);
			};
			$('input:text, select').each(function(index, item){
				if($(this).attr('data-search') != 'Y'){

					switch($(this).prop('tagName')){
						case 'INPUT':
							$(this).val(result.info[$(this).attr('id')]);
							break;
						case 'SELECT':
							$(this).val(result.info[$(this).attr('id')]).prop('selected', true);
							break;
					}
				}
			});

			$("#code").text(result.info['code']);
			$('#memo').val(result.info['memo']);

			$.each(result.auth, function(index, item){
				$('#pgm'+item.pgm_id+'').prop('checked', true);
			});

			$('#id, #country_cd').addClass('gray');
			$('#id').prop('readonly', true);
			$('#house, #place').addClass('disable');
			$('#houseyn, #placeyn, #country_cd').prop('disabled', true);
		},
		error: function(request,status,error) {
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			$.toast('실패', {sticky: true, type: 'danger'});
		},
	});
}

/**
 * @description 가용여부 on / off update
 */
function stat_change(local_cd, useyn){
	$.ajax({
		url: '/base/factory/stat_change',
		type: 'POST',
		data: {
			local_cd  : local_cd,
			useyn     : useyn,
		},
		dataType: "json",
		success: function(data) {
			switch(data.result_code){
				case 100:
					toast('사용여부 상태 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
					break;
				case 200:
					toast('사용여부 상태가 변경되었습니다.', false, 'info');
					if(useyn == "Y"){
						$('#use_'+local_cd+'').prop('checked', false);
						$('#use_'+local_cd+'').val('N');
					}else{
						$('#use_'+local_cd+'').prop('checked', true);
						$('#use_'+local_cd+'').val('Y');
					}

					if(fa_local_cd == local_cd){
						switch(useyn){
							case 'Y':
								$("input[name='useyn']:radio[value='N']").prop("checked",true);
								break;
							case 'N':
								$("input[name='useyn']:radio[value='Y']").prop("checked",true);
								break;
						}
					}
					break;
			}
		},
		error: function(request,status,error) {
			console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			//$.toast('실패', {sticky: true, type: 'danger'});
		},
	});
}

/**
 * @description 데이터 전송
 */
function get_result(){
	$.ajax({
		url: '/base/factory/v',
		type: 'POST',
		data: $('#frm').serialize(),
		dataType: "json",
		success: function(result) {
			$('#loading').hide();

			switch(result.result_code){
				case 100:
					toast('등록실패. 잠시 후 다시 시도해주세요.', true, 'danger');
					get_reset();
					break;
				case 110:
					toast('수정실패. 잠시 후 다시 시도해주세요.', true, 'danger');
					break;
				case 200:
					toast('등록이 완료되었습니다.', false, 'info');
					get_reset();
					break;
				case 210:
					toast('수정이 완료되었습니다.', false, 'info');
					break;
			}

			get_list();
		},
		error: function(request,status,error) {
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			$.toast('실패', {sticky: true, type: 'danger'});
		},
	});
}

/**
 * @description 필수 입력 값 검증
 */
function input_check(){
	let fac_chk_stat    = true;
	let menu_chk        = false;
	let fac_id          = ['fa_nm', 'biz_nm', 'biz_cd', 'tel', 'post_code', 'ceo_nm', 'ul_nm', 'id'];

	if($('#pd_cd').val() == ""){
		toast('대표제품을 제품선택 버튼을 이용하여 선택하세요.', true, 'danger');
		$('#pd_cd').focus();
		fac_chk_stat = false;
		return false;
	}

	$.each(fac_id, function(index, item){
		if($('#'+item+'').val() == ""){
			toast(''+$('#'+item+'').attr('data-text')+'를(을) 입력하세요.', true, 'danger');
			$('#'+item+'').focus();
			fac_chk_stat = false;
			return false;
		}
	});

	if(fac_chk_stat){
		if($('#pass').val().length < 4 && $('#pass').val() != ''){
			toast('비밀번호는 4자리 이상입니다.', true, 'danger');
			$('#pass').focus();
			return false;
		}
		if($('#pass').val() != $('#pass_chk').val()){
			toast('비밀번호가 일치하지 않습니다.', true, 'danger');
			$('#pass').focus();
			return false;
		}
	}else{
		return false;
	}

	/** 사업자번호 유효성 체크 */
	let biz_cd = $("#biz_cd").val().replaceAll('-','');

	if(biz_cd.length !== 10 && biz_cd.length !== 13){
		toast('잘못된 사업자번호입니다.', true, 'danger');
		$('#biz_cd').focus();
		return false;
	}

	if($('#email').val() != ""){
		var email_reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

		if(!email_reg.test($('#email').val())){
			toast('이메일 형식이 잘못됐습니다.', true, 'danger');
			$('#email').focus();
			return false;
		}
	}

	$("input:checkbox").each(function(){
		if($(this).attr('id') != 'chk_all'){
			if($(this).is(":checked") == true){
				menu_chk = true;
			}
		}
	});

	if(!menu_chk){
		toast('화면 권한은 최소 1개 이상 부여되어야 합니다.', true, 'danger');
		return false;
	}

	return true;
}

/**
 * @description 초기화
 */
function get_reset(){
	$('#p').val('in');
	$('#in').show();
	$('#up').hide();

	$("input[name='useyn']:radio[value='Y']").prop("checked",true);
	$('#id, #country_cd').removeClass('gray');
	$('#id').prop('readonly', false);
	$('#house, #place').removeClass('disable');
	$('#houseyn, #placeyn, #country_cd').prop('disabled', false);
	$('#code').text("");
	$('#memo').val('');

	$("input:text, input:password").each(function(){
		if($(this).attr('data-search') != 'Y'){
			$(this).val('');
		}
	});

	$("select").each(function(){
		if($(this).attr('data-search') != 'Y'){
			$(this).find('option:first').prop('selected', true);
		}
	});

	$('td input:checkbox[id*=pgm]').each(function(){
		if($(this).attr('data-admin') != "Y"){
			$(this).prop("checked", false);
		}else{
			$(this).prop('disabled', true);
		}
	});

	$('input:checkbox[name="pd_cd"]').prop('checked', false);
	$('#pd_cd').val('');
}
