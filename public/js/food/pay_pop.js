/*================================================================================
 * @description 발주 전표 마감 관리JS
 * @author 김민주, @version 1.0, @last date
 ================================================================================*/
 $(function () {

    // 발주 번호 파라미터 확인(수정페이지용)
    var ord_no = get_parameter("no");
    if (!nan_chk(ord_no))
    {
        $(".pay_ord_no").val(ord_no);
    }

    // 전표 마감
    $('.btn_finish').off().click(function () {
        var con = confirm('전표 마감은 취소가 불가합니다. 그대로 진행하시겠습니까?');
        if (con) 
        {
            pay_register($("#frm_pay").serializeObject());
        } 
    });

    // 팝업창 닫기
    $('.btn_list').off().click(function () { 
        $('.magam_pop').bPopup().close();
    });

    $('.magam_btn').click (function(){
        $('.magam_pop').bPopup({
          modalClose: true
          , opacity: 0.8
          , positionStyle: 'absolute' 
          , speed: 300
          , transition: 'fadeIn'
          , transitionClose: 'fadeOut'
          , zIndex : 99997
            //, modalColor:'transparent' 
        }); 
    });

 });

/**
 * @description 발주 번호 확인(마감용)
 */
function get_key(obj)
{
    $(".pay_ord_no").val(obj.no);
}

/**
 * @description 전표 마감 등록
 * @return result code, comment
 */
function pay_register(obj) 
{
    $.ajax({

        url: '/ord/ord_buy/pay',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('마감 등록이 완료되었습니다.', false, 'info');
                window.location.href='/ord/ord_buy';
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }

    });
}