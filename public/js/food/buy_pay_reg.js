/*================================================================================
 * @description 매입/지급 등록 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/10
 ================================================================================*/

 $(function () {

    // 검색 - select2 lib 사용
    // call_select2('#biz_list', '/base/select2/biz_list', 0, '거래처를', '매출거래처_선택'); // 거래처 전체 조회

    // 등록 이벤트
    $("#btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            buy_pay_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 결제 방식 변경 이벤트
    $(".acc_type").change(function() {
        if ($(this).val() == "005") // 통장
        {
            $(".div_bank").css('display', 'flex');
        }
        else // 그외
        {
            $(".div_bank").css('display', 'none');
        }
    });

 });

/**
 * @description 전송 값 유효성 검사
 */
 function buy_pay_validation(obj) 
 {
    $.ajax({
        url: '/acc/buy_pay/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                buy_pay_register(obj);
            }
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });
}

/**
 * @description 지급/금액차감 등록
 * @return result code, comment
 */
function buy_pay_register(obj) 
{
    $.ajax({

        url: '/acc/buy_pay/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('등록이 완료되었습니다.', false, 'info');
                $('.buy_pay_reg').bPopup().close();
                get_buy_pay_list($("#frm_search").serializeObject(), "Y");
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }

    });
}