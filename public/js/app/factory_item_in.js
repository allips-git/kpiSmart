/*================================================================================
 * @description 플랜오더APP 공장 제품 등록,수정,삭제 관리JS
 * @author 김민주, @version 1.0, @last date 2022/04/08
 ================================================================================*/

 $(function () {

    // 제품 코드
    var item_cd = get_parameter("cd");
    $("#item_cd").val(item_cd);

    // 공장 제품 등록/수정 이벤트
    $(".btn_item_reg").off().click(function () { 
        var con = confirm('#0054FF/저장합니다/선택하신 제품을 안전하게 저장합니다.');
        if(con) {
            item_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

});

 /**
 * @description 전송 값 유효성 검사
 */
 function item_validation(obj) {

    $.ajax({

        url: '/fac/factory_item_in/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // in, up, fail
            if(data.code == '100') { 
                item_register(data.list);
            } else if(data.code == '999') {
                alert('#FF0000/입력값이 정확하지 않습니다/확인 후 다시 이용바랍니다.');
            }

        }

    });

}

/**
 * @description 공장 제품 등록/수정
 * @return result code, comment
 */
 function item_register(obj) {

    $.ajax({

        url: '/fac/factory_item_in/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // 수정 전 list
            $('#results').html(decodeURI(localStorage.getItem("factory_item_list")));

            // 금액 변경
            $("#"+get_parameter("cd")+" > ul > li > .p_price > span").text(obj.sale_amt);
            localStorage.setItem("factory_item_list", $('#results').html());

            // success, fail 
            if(data.code == '100') {
                alert('#0054FF/제품정보/저장이 완료되었습니다.');
                window.history.back();
            } else if(data.code == '999') {
                alert('#FF0000/저장실패/지속될 경우 관리자에게 문의 바랍니다.');
            }

        }

    });
}