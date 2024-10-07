/*================================================================================
 * @description 공통 출력물 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/29
 ================================================================================*/

/**
 * @description 구매요청서 출력 JSP 연동
 */
function esti_print(obj)
{
    $('#p_gb').val(print_gb);
    $("#p_ord_no").val(obj.ord_no);
    var pop_title = "buy list";
    var _width = '800';
    var _height = '1500';

    var _left = Math.ceil(( window.screen.width - _width )/2);
    var _top = Math.ceil(( window.screen.height - _height )/2);
    window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

    var frm_data = document.frm;
    frm_data.target = pop_title;
    if(print_host == '3d_erp.localhost' || print_host == 'geumgan.localhost') 
    {
        frm_data.action = print_local+"/esti.jsp";
    } 
    else 
    {
        frm_data.action = print_domain+"/esti.jsp";
    }
    frm_data.submit();
}

/**
 * @description 거래명세표 출력 JSP 연동
 */
function gurae_print(obj)
{
    $('#p_gb').val(print_gb);
    $("#p_ord_no").val(obj.ord_no);
    var pop_title = "gurae list";
    var _width = '800';
    var _height = '1500';

    var _left = Math.ceil(( window.screen.width - _width )/2);
    var _top = Math.ceil(( window.screen.height - _height )/2);
    window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

    var frm_data = document.frm;
    frm_data.target = pop_title;
    if(print_host == '3d_erp.localhost' || print_host == 'geumgan.localhost') 
    {
        frm_data.action = print_local+"/food_gurae.jsp";
    } 
    else 
    {
        frm_data.action = print_domain+"/food_gurae.jsp";
    }
    frm_data.submit();
}

/**
 * @description 출고요청서 출력 JSP 연동
 */
function chulgo_print(obj)
{
    $('#p_gb').val(print_gb);
    $("#p_start_dt").val(obj.start_dt);
    $("#p_end_dt").val(obj.end_dt);
    var pop_title = "out list";
    var _width = '800';
    var _height = '1500';

    var _left = Math.ceil(( window.screen.width - _width )/2);
    var _top = Math.ceil(( window.screen.height - _height )/2);
    window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

    var frm_data = document.frm;
    frm_data.target = pop_title;
    if(print_host == '3d_erp.localhost' || print_host == 'geumgan.localhost') 
    {
        frm_data.action = print_local+"/out_list.jsp";
    } 
    else 
    {
        frm_data.action = print_domain+"/out_list.jsp";
    }
    frm_data.submit();
}

/**
 * @description 바코드 출력 JSP 연동
 */
function barcode_print(obj)
{
    $('#p_gb').val(print_gb);
    $("#p_ikey").val(obj.ikey);
    var pop_title = "barcode";
    var _width = '750';
    var _height = '385';

    var _left = Math.ceil(( window.screen.width - _width )/2);
    var _top = Math.ceil(( window.screen.height - _height )/2);
    window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

    var frm_data = document.frm;
    frm_data.target = pop_title;
    if(print_host == '3d_erp.localhost' || print_host == 'geumgan.localhost') 
    {
        frm_data.action = print_local+"/barcode.jsp";
    } 
    else 
    {
        frm_data.action = print_domain+"/barcode.jsp";
    }
    frm_data.submit();
}

/**
 * @description 바코드 출력 후 업데이트 - update
 */
 function barcode_update(obj, path, url) 
 {
    $.ajax({
        url: url,
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

             // result code
            if (data.code == '100') // success 
            {
                toast('출력 완료', false, 'info');
                if(path == 'base') // 기초재고
                {
                    get_base_list($("#frm_search").serializeObject(), "Y"); 
                }
                else if(path == 'equipment') // 장비 등록
                {
                    $("input[class=chk_all]").prop("checked", false);
                    get_equipment_list($("#frm_search").serializeObject(), "Y"); 
                }
            }
            else if (data.code == '999') // fail 
            {
                toast('출력 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end