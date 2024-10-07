/*================================================================================
 * @description 마이페이지 관리 JS
 * @author 김민주, @version 1.0, @last date 2022/08/11
 ================================================================================*/

 $(function () {

    // 저장 버튼 클릭 이벤트
    $(".btn_save").off().click(function () { 
        var con = confirm('저장 하시겠습니까?');
        if(con) {
            mypage_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

});

/**
 * @description 전송 값 유효성 검사
 */
 function mypage_validation(obj) {

    $.ajax({

        url: '/user/mypage/v',
        type: 'POST',
        data: {
            p: obj.p,
            pass: obj.key,
            tel: obj.tel,
            email: obj.email
        },
        dataType: "json",
        success: function (data) { 
            
            // up, fail
            if(data.code == '200') {
                mypage_modify(obj);
            } else if(data.code == '999') {
                toast(data.err_msg, true, 'danger');
            }

        }

    });

}

/**
 * @description 마이페이지 수정
 */
 function mypage_modify(obj) {

    $.ajax({

        url: '/user/mypage/u',
        type: 'POST',
        data: {
            p: obj.p,
            pass: obj.key,
            tel: obj.tel,
            email: obj.email
        },
        dataType: "json",
        success: function (data) {

            // success, fail 
            if(data.code == '100') {
                toast('수정이 완료되었습니다.', false, 'info');
            } else if(data.code == '999') {
                toast('수정실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
            }

        }

    });

}