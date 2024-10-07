/*================================================================================
 * @description 주문 일괄 등록(엑셀) 관리JS
 * @author 김민주, @version 1.0, @last date 2022/09/05
 ================================================================================*/

 $(function () {

    // 주문 일괄 등록 이벤트
    $("#btn_upload").off().click(function () { 
        var con = confirm('엑셀 업로드를 하시겠습니까?');
        if (con) 
        {
            excel_validation($("#frm_upload").serializeObject()); // form 데이터 유효성 검사
        }
    });

 });

/**
 * @description 전송 값 유효성 검사
 */
 function excel_validation(obj) 
 {
    var form = $("#frm_upload")[0];
    var form_data = new FormData(form);
    form_data.append("file", $("#excel_file")[0].files[0]);
    $.ajax({
        url: '/ord/ord_list/file_v',
        type: 'POST',
        processData: false,
        contentType: false,
        data: form_data,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                // 엑셀 업로드 팝업창 종료 및 로딩 이미지 활성화
                $('.ord_excel_pop').bPopup().close();
                $('#loading').show();
                excel_register(form_data);
            }
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });
}

/**
 * @description 엑셀 주문 일괄 등록
 * @return result code, comment
 */
function excel_register(obj) 
{
    // ajax file send
    $.ajax({
        url: '/ord/ord_list/excel',
        type: 'POST',
        processData: false,
        contentType: false,
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                alert('등록이 완료되었습니다.');
                $('#loading').hide();
                window.location.href='/ord/ord_list';
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                alert('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.');
                $('#loading').hide();
                window.location.href='/ord/ord_list';
            } // end else if

        },
        error: function (data) {
            alert('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.');
            $('#loading').hide();
            window.location.href='/ord/ord_list';
        }

    });
}
