/*================================================================================
 * @description FMS 단가 명칭 관리JS
 * @author 김민주, @version 1.0, @last date 2022/06/03
 ================================================================================*/

 $(function () {

    // 수정 버튼 클릭 이벤트
    $(".btn_amt_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if(con) {
            amt_validation($("#frm_amt").serializeObject()); // form 데이터 유효성 검사
        }
    });

 });


/**
 * @description 전송 값 유효성 검사
 */
function amt_validation(obj) {

    $.ajax({

        url: '/base/factory_amt_nm/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // in, up, fail
            if(data.code == '100') {
                amt_modify(obj);
            } else if(data.code == '999') {
                toast(data.err_msg, true, 'danger');
            }

        }

    });

}

/**
 * @description 등급별 단가 명칭 등록/수정
 */
function amt_modify(obj) {

    $.ajax({

        url: '/base/factory_amt_nm/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // success, fail 
            if(data.code == '100') {

                alert('수정이 완료되었습니다.');
                window.location.replace('/base/item_list');

            } else if(data.code == '999') {
                toast('등록실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
            }

        }

    });

}