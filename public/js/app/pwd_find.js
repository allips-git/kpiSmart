/*================================================================================
 * @name: 김원명 - 플랜 오더 앱 => 비밀번호 찾기
 * @version: 1.0.0, @date: 2022/02/23
 ================================================================================*/
let self_info = new Object();

$(function(){
    $('.ok_btn').off().click(function(){
        if($('#id').val() == ''){
            swal('알림', '아이디를 입력하세요.', 'id', 1);
        }else{
            get_id_check();
        }
    });
});

/**
 * @description 아이디 유무 체크
 */
function get_id_check(){
    $.ajax({ 
        url: '/help/pwd_find/get_id_check',
        type: 'GET',
        data: {
            id : $('#id').val()
        },
        dataType: "json",
        success: function(result) {
            if(result.stat){
                token();
            }else{
                swal('알림', '존재하지 않는 아이디입니다. 아이디를 확인하세요.', 'id', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 본인 아이디 체크
 */
function get_self_check(){
    $.ajax({ 
        url: '/help/pwd_find/get_self_check',
        type: 'GET',
        data: {
            id      : $('#id').val(),
            self    : self_info
        },
        dataType: "json",
        success: function(result) {
            if(result.stat){
                Swal.fire({
                    title: '알림',
                    html: "<br>본인인증이 완료되었습니다.<br><br>",
                    showCancelButton: false,
                    confirmButtonColor: '#0176f9',
                    confirmButtonText: '확인'
                }).then((data) => {
                    self_info['id'] = $('#id').val();

                    sessionStorage.setItem("self_info", JSON.stringify(self_info));

                    location_url('/help/pwd_change');
                });
            }else{
                swal('알림', '본인정보와 불일치하는 아이디입니다.', 'id', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}