/*================================================================================
 * @description: 아임포트API 연동
 * @name: kimminju, @version: 1.0.0, @date: 2021/04/27
 ================================================================================*/

/**
 * [token description] 다날 본인확인 REST API사용을 위한 인증키 확인(access_token취득)
 * @param  [type] $imp_key 아임포트 REST API 키
 * @param  [type] $imp_secret 아임포트 REST API Secret 키
 * @return [return] $access_token
*/
 function token() {
    var result = '';
    var token = '';
    var IMP = window.IMP;       // 생략가능
    var key = imp_key;          // 아임포트 REST API 키
    var secret = imp_secret;    // 아임포트 REST API Secret
    IMP.init(danal_key);        // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
    IMP.certification({
        merchant_uid : 'merchant_' + new Date().getTime() //본인인증과 연관된 가맹점 내부 주문번호가 있다면 넘겨주세요
    }, function(rsp) {
        if ( rsp.success ) {
            // 인증성공
            //console.log(rsp.imp_uid);
            //console.log(rsp.merchant_uid);

            var imp_uid = rsp.imp_uid;

            $.ajax({
                url: "/api/iamport/token", // 서비스 웹서버
                method: "POST",
                dataType : 'json',
                data: { 
                    imp_key: key,
                    imp_secret: secret
                },
                success: function(data) {

                    if(data.code == "100") {
                        result = JSON.parse(data.result);
                        token = result.response.access_token;

                        //$("#phone").val(token);
                        danal(imp_uid, token);
                    }
                            
                },
                error: function(request,status,error) {

                    console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                    alert('인증에 실패하였습니다.');

                },
            });

        } else {
            // 인증취소 또는 인증실패
            var msg = '인증에 실패하였습니다.';
            msg += '에러내용 : ' + rsp.error_msg;
            alert(msg);
        }
    });
}    

/**
 * [danal description] 다날 SMS본인인증결과 조회 및 관리
 * @param  [type] $imp_uid 다날SMS 인증성공 key
 * @param  [type] $token access_token
 * @return [return] 인증 사용자 정보(ex: name, gender, birthday등..)
 * - 아임포트 API메뉴얼: https://api.iamport.kr
*/
 function danal(imp_uid, token) {
    var url = window.location.pathname;

 	$.ajax({
		url: "/api/iamport/info", // 서비스 웹서버
		method: "POST",
		dataType : 'json',
		data: { 
			imp_uid: imp_uid,
			token: token
		},
		success: function(data) {
            var result = JSON.parse(data.result);

            switch(url){
                /** 이용약관 */
                case '/join/terms':
                    if(result.response.certified){
                        sessionStorage.clear();

                        if(data.cnt >= 4){ /** 임시로 4개까지 */
                            Swal.fire({
                                title: '알림',
                                html: "<br>생성 가능한 계정 갯수를 초과하였습니다.(최대 3개)<br><br>",
                                showCancelButton: false,
                                confirmButtonColor: '#5384ed',
                                confirmButtonText: '확인'
                            });
                        }else{
                            Swal.fire({
                                title: '알림',
                                html: "<br>본인인증이 완료되었습니다.<br><br>",
                                showCancelButton: false,
                                confirmButtonColor: '#5384ed',
                                confirmButtonText: '확인'
                            }).then((data) => {
                                stg['name']     = decodeUnicode(result.response.name);
                                stg['birthday'] = result.response.birthday;
                                stg['phone']    = result.response.phone;

                                sessionStorage.setItem("stg", JSON.stringify(stg));
                                location_url('/join/sign');
                            });
                        }
                    }
                break;
                /** 아이디 찾기 */
                case '/help/id_find':
                    if(result.response.certified){
                        var info     = new Object();

                        sessionStorage.clear();

                        if(data.cnt >= 1){ /** 본인인증된 아이디가 있을 시 */
                            Swal.fire({
                                title: '알림',
                                html: "<br>본인인증이 완료되었습니다.<br><br>",
                                showCancelButton: false,
                                confirmButtonColor: '#5384ed',
                                confirmButtonText: '확인'
                            }).then((data) => {
                                info['name']     = decodeUnicode(result.response.name);
                                info['birthday'] = result.response.birthday;
                                info['phone']    = result.response.phone;
    
                                get_id_info(info);
                            });
                        }else{
                            Swal.fire({
                                title: '알림',
                                html: "<br>가입된 계정이 존재하지 않습니다.<br><br>",
                                showCancelButton: false,
                                confirmButtonColor: '#5384ed',
                                confirmButtonText: '확인'
                            });
                        }
                    }
                break;
                /** 비밀번호 찾기 */
                case '/help/pwd_find':
                    if(result.response.certified){
                        sessionStorage.clear();

                        self_info['name']     = decodeUnicode(result.response.name);
                        self_info['birthday'] = result.response.birthday;
                        self_info['phone']    = result.response.phone;

                        get_self_check();
                    }
                break;
            }
		},
		error: function(request,status,error) {
			console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			alert('인증에 실패하였습니다.');
		},
	});
}

/**
 * 유니코드 디코딩
 * @returns 유니코드 디코딩된 값 return
 */
function decodeUnicode(unicodeString) {
    var r = /\\u([\d\w]{4})/gi; 
    unicodeString = unicodeString.replace(r, function (match, grp){ 
        return String.fromCharCode(parseInt(grp, 16)); 
    });

    return unescape(unicodeString); 
}