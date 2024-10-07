/*================================================================================
 * @name: kimminju - addr.js
 * @version: 1.0.0, @date: 2020-05-28
 ================================================================================*/

/**
 * @description 거래처별 배송지 확인 및 갱신
 */
function addr(cust_cd, dlv_cd, text) {
	var str = '';
	var text = text;
	var dlv_cd = dlv_cd;
	var cust_cd = cust_cd;
	if(cust_cd != '') {
		$.ajax({ // 거래처별 배송지 설정

			url: '/base/addr/addr_view',
			type: 'GET',
			data: {
				cust_cd:cust_cd
			},
			dataType: "json",
			success: function(data) { 

				if(data.code == '999') { // 배송지 없을경우
						str += '<option value="">'+text+'</option>';
						
				} else {
					if(text == '직접입력') { // 주문등록 배송지에서만 사용
						str += '<option value="">'+text+'</option>';
					}
					$.each(data.result, function(i, list) { 
						str += '<option value="'+list.addr_dlv_cd+'">'+list.addr_dlv_name+'</option>';	
					});
				}
				$("#dlv_cd").html(str); // address add
				
			},
			error: function(request,status,error) {

				alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
				$.toast('실패', {sticky: true, type: 'danger'});

			},

		});
	}
}

/**
 * @description 배송지 체인지 이벤트
 */
$(function() {
    $('#dlv_cd').change( function(){
		dlv_address();
	});
});

function dlv_address() {
	var cust_cd = $("#cust_cd").val();
	var val = $("#dlv_cd option:selected").val();
	$.ajax({

		url: '/base/addr/view',
		type: 'GET',
		data: {
			cust_cd:cust_cd,
			dlv_cd:val
		},
		dataType: "json",
		success: function(data) {
			if(data.code == '999') { 
				$('#dlv_addr').attr('readonly', false); // 읽기,쓰기
				$('#dlv_addr').val('');
			} else {
				$('#dlv_addr').attr('readonly', true); // 읽기 전용
				$('#dlv_addr').val(data.result.dlv_address+' '+data.result.dlv_detail);
			}

		},
		error: function(request,status,error) {

			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			$.toast('실패', {sticky: true, type: 'danger'});

		},

	});		
}