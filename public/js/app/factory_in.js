/*================================================================================
 * @description 플랜오더APP 외주공장 등록 관리JS
 * @author 김민주, @version 1.0, @last date 2022/04/08
 ================================================================================*/

 $(function () {

    // variable list
    var cust_cd = get_parameter("f"); // 외주공장 코드

    // 저장 버튼 클릭 이벤트
    $(".btn_reg").off().click(function () { 
        var con = confirm('#0054FF/저장합니다/선택하신 공장을 안전하게 저장합니다.');
        if(con) {
            var route = $("#route").val('');
            out_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 제품추가 이동 버튼 클릭 이벤트
    $(".btn_item").off().click(function () { 
        // 제품추가 이동 이벤트일때 정보 수정 후 이벤트 경로 조건
        var route = $("#route").val('route'); 
        out_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
    });

});

 /**
 * @description 전송 값 유효성 검사
 */
 function out_validation(obj) {

    $.ajax({

        url: '/fac/factory_in/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) { 

            // in, up, fail
            if(data.code == '100') {
                out_register(obj);
            } else if(data.code == '200') {
                out_modify(obj);
            } else if(data.code == '999') {
                alert('#FF0000/입력값이 정확하지 않습니다/확인 후 다시 이용바랍니다.');
            }

        }

    });

}

/**
 * @description 외주공장 등록
 * @return result code, comment
 */
 function out_register(obj) {

    $.ajax({

        url: '/fac/factory_in/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // success, fail 
            if(data.route == '101') {
                if(data.code == '100') {
                    alert('#0054FF/공장정보/저장이 완료되었습니다.');
                    window.history.back();
                } else if(data.code == '200') { 
                    alert('#0054FF/공장정보/저장이 완료되었습니다.');
                    window.history.go(-2);
                } else if(data.code == '999') {
                    alert('#FF0000/저장실패/지속될 경우 관리자에게 문의 바랍니다.');
                }
            } else if(data.route == '201') {
                if(data.code == '100' || data.code == '200') {
                    window.location.href='/fac/out_item_li?f='+data.cust_cd; 
                } else if(data.code == '999') {
                    alert('#FF0000/저장실패/지속될 경우 관리자에게 문의 바랍니다.');
                }
            }

        }

    });

}

/**
 * @description 외주공장 저장
 * @return result code, comment
 */
 function out_modify(obj) {

    $.ajax({

        url: '/fac/factory_in/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // success, fail 
            if(data.route == '101') {
                if(data.code == '100') {
                    alert('#0054FF/공장정보/저장이 완료되었습니다.');
                    window.history.back();
                } else if(data.code == '200') { 
                    alert('#0054FF/공장정보/저장이 완료되었습니다.');
                    window.history.go(-2);
                } else if(data.code == '999') {
                    alert('#FF0000/저장실패/지속될 경우 관리자에게 문의 바랍니다.');
                }
            } else if(data.route == '201') {
                if(data.code == '100' || data.code == '200') {
                    window.location.href='/fac/out_item_li?f='+data.cust_cd; 
                } else if(data.code == '999') {
                    alert('#FF0000/저장실패/지속될 경우 관리자에게 문의 바랍니다.');
                }
            }

        }

    });

}
