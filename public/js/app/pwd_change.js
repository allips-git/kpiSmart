/*================================================================================
 * @name: 김원명 - 플랜 오더 앱 => 비밀번호 변경
 * @version: 1.0.0, @date: 2022/02/23
 ================================================================================*/
let self_info = JSON.parse(sessionStorage.getItem("self_info"));

$(function(){
    $('.ok_btn').off().click(function(){
        if($('#pwd').val() == ''){
            swal('알림', '비밀번호를 입력하세요.', 'pwd', 1);
            return false;
        }

        if($('#pwd_chk').val() == ''){
            swal('알림', '비밀번호 확인란을 입력하세요.', 'pwd_chk', 1);
            return false;
        }

        if($('#pwd').val() != $('#pwd_chk').val()){
            swal('알림', '비밀번호 입력란과 확인란이 일치하지 않습니다.', 'pwd_chk', 1);
            return false;
        }

        if(!pwd_check($('#pwd'))){
            swal('알림', '6~20자의 특수문자, 영문, 숫자를 혼합해서 사용해주세요.', 'pwd_chk', 1);
            return false;
        }

        get_pwd_change();
    });
});

/**
 * @description 비밀번호 변경
 */
function get_pwd_change(){
    $.ajax({ 
        url: '/help/pwd_change/get_pwd_change',
        type: 'GET',
        data: {
            id  : self_info['id'],
            pwd : $('#pwd').val()
        },
        dataType: "json",
        success: function(result) {
            if(result.stat){
                Swal.fire({
                    title: '알림',
                    html: "<br>비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.<br><br>",
                    showCancelButton: false,
                    confirmButtonColor: '#0176f9',
                    confirmButtonText: '확인'
                }).then((data) => {
                    location_url('/login');
                });
            }else{
                swal('알림', '비밀번호 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.', 'pwd', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 비밀번호 규정 체크
 */
function pwd_check(This){
    /** 특수문자, 영문, 숫자 검증 비밀번호 정규식(6자~15자 제한) */
    var regexp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^~*+=-])(?=.*[0-9]).{6,15}$/;

    if(!(regexp.test(This.val()))) {
        return false;
    }

    return true;
}