/*================================================================================
 * @description 장비관리 JS
 * @author 김민주, @version 1.0, @last date 2022/10/20
 ================================================================================*/

 $(function () {

    // 수정 이벤트
    $("#btn_mod").off().click(function () { 
        var con = confirm('저장 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            info_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

});

/**
 * @description 전송 값 유효성 검사
 */
 function info_validation(obj) 
 {
    $.ajax({
        url: '/app/information/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                info_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                info_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                info_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });
}

/**
 * @description 장비 수정
 * @return result code, comment
 */
 function info_modify(obj) 
 {
    $.ajax({

        url: '/app/information/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                alert('수정이 완료되었습니다.');
            }
            else if (data.code == '400') // fail 
            {
                alert('장비정보 없음. 확인 후 다시 이용 바랍니다.');
            } // end else if
            else if (data.code == '600') // fail 
            {
                alert('기계명 중복. 이미 동일한 기계명이 있습니다.');
            } // end else if
            else if (data.code == '999') // fail 
            {
                alert('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.');
            } // end else if

        }
    });
}