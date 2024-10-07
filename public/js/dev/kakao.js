/*================================================================================
 * @description: 카카오API 연동
 * @name: 김민주, @version: 1.0.0, @last date: 2021/04/29
 ================================================================================*/

/**
 * [send description] 카카오 알림톡 발신번호 사전등록 API
 * @param  [type] $client_id 카카오 알림 API Store Key
 * @return [return]
 */
function send() {

	var client_id = kakao_client_id;    // API스토어 ID
	var store_key = kakao_store_key;	// API Store Key

	$.ajax({

		url: "/api/kakao/send", // 서비스 웹서버
		method: "POST",
		dataType : 'json',
		data: {
			client_id: client_id,
			store_key: store_key,
			sendnumber: '01077661769',
			pintype: 'LMS',
			//pincode: '727308',
			comment: '카카오 테스트'
		},
		success: function(data) {

			console.log('data:'+data.result);

			if(data.code == "100") {
				//result = JSON.parse(data.result);
				//console.log('result:'+result);
				//token = result.response.access_token;

				//$("#phone").val(token);
				//danal(imp_uid, token);
			}

		},
		error: function(request,status,error) {

			console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			alert('인증에 실패하였습니다.');

		},
	});

}

/**
 * [msg description] 카카오 알림톡 발송API
 * @param  [type] $client_id 카카오 알림 API Store Key
 * @kakao_arr => 배열로 각 phone(수신번호), callback(발신번호), msg(전달 메세지), template_code(템플릿 코드) 전송하도록 수정 2021/07/05 김원명
 * @callback [function] 필요에 따라서 각 화면마다 구현할것! ex) kakao_history 남기기 위한 함수로 구현
 * @return [return]
 */
function msg(kakao_arr , callback = undefined) {

	var client_id = kakao_client_id;    // API스토어 ID
	var store_key = kakao_store_key;	// API Store Key

	$.ajax({

		url: "/api/kakao/msg", // 서비스 웹서버
		method: "POST",
		dataType : 'json',
		data: {
			client_id: client_id,
			store_key: store_key,
			phone: kakao_arr['phone'],
			callback: kakao_arr['callback'],
			msg : kakao_arr['msg'],
			template_code: kakao_arr['template_code'],
			failed_type: 'SMS',
			cust_cd : kakao_arr['cust_cd']
		},
		success: function(data) {
			console.log('data:'+data.result);
			switch (data.code) {
				case '200':	//전송완료
					alert('전송되었습니다.');
					break;
				case '600':	//요금부족
					alert('충전요금이 부족합니다. 해당 프로그램 관리자에게 문의하세요.');
					break;
				default:	//그 이외의...
					alert('전송에 실패했습니다.');
					break;
			}

			if(callback !== undefined){
				var pathname = location.pathname;
				switch (pathname) {
					case '/ord/ord_list_kakao_pop':
						callback(kakao_arr['cust_cd']);
						break;
					default :
						callback();
						break;
				}
			}
		},
		error: function(request,status,error) {

			console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			alert('인증에 실패하였습니다.');

		},
	});

}

/**
 * @description APP에서 사용하는 카카오톡 발송
 */
function app_msg(kakao){
	var url 		= window.location.pathname;
	var client_id 	= kakao_client_id;    // API스토어 ID
	var store_key 	= kakao_store_key;	// API Store Key

	$.ajax({
		url: "/api/kakao/msg", // 서비스 웹서버
		method: "POST",
		dataType : 'json',
		data: {
			client_id		: client_id,
			store_key		: store_key,
			phone			: kakao['phone'],
			msg 			: kakao['msg'],
			template_code	: kakao['template_code'],
			btn_txts 		: kakao['btn_txts'],
			btn_urls1 		: kakao['btn_urls1'],
			btn_urls2 		: kakao['btn_urls2'],
			ord_no			: kakao['ord_no'],
			cust_cd 		: kakao['cust_cd']
		},
		success: function(data) {
			switch (data.code) {
				case '200':	//전송완료
					alert('전송되었습니다.');
					switch(url){
						case '/ord/plan':
							history.back();
						break;
					}
					break;
				case '600':	//요금부족
					alert('충전요금이 부족합니다. 해당 프로그램 관리자에게 문의하세요.');
					break;
				default:	//그 이외의...
					alert('전송에 실패했습니다.');
					break;
			}
		},
		error: function(request,status,error) {
			//console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			alert('인증에 실패하였습니다.');
		},
	});
}

/**
 * [msg description] 카카오 알림톡 발송API
 * @param  [type] $client_id 카카오 알림 API Store Key
 * @return [return]
 */
function tem() {

	var client_id = kakao_client_id;    // API스토어 ID
	var store_key = kakao_store_key;	// API Store Key

	$.ajax({

		url: "/api/kakao/tem", // 서비스 웹서버
		method: "GET",
		dataType : 'json',
		data: {
			client_id: client_id,
			store_key: store_key,
			template_code : '',
			status : '3'
		},
		success: function(data) {

			console.log('data:'+data.result);

			if(data.code == "100") {
				//result = JSON.parse(data.result);
				//console.log('result:'+result);
				//token = result.response.access_token;

				//$("#phone").val(token);
				//danal(imp_uid, token);
			}

		},
		error: function(request,status,error) {

			console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			alert('인증에 실패하였습니다.');

		},
	});

}
