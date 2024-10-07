/*================================================================================
 * @description FMS 구매 반품(출고) 목록 관리JS
 * @author 안성준, @version 1.0, @last date 2022/09/06
 ================================================================================*/

 $(function () {

    // FMS 입/출고 리스트 조회
    // get_prod_put_list($("#frm_search").serializeObject(), "Y"); 

    // 초기화 이벤트
    $('.btn_re_reset').off().click(function(){
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            form_re_reset();
        }
    });

    // 반품 등록 이벤트
    $(".btn_re_reg").off().click(function () { 
        var con = confirm('반품 등록 하시겠습니까?');
        if (con) 
        {
            $(".re_p").val("in");
            return_validation($("#frm_re_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 반품 수정 이벤트
    $(".btn_re_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $(".re_p").val("up");
            return_validation($("#frm_re_reg").serializeObject());
        }
    });

    // 반품 삭제 이벤트
    $(".btn_re_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $(".re_p").val("del");
            return_delete($("#frm_re_reg").serializeObject());
        }
    });

});

/**
 * @description 반품 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
 */
 function get_return_list(obj, mode='') 
 {
    $.ajax({
        url: '/stock/return_pop/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function(data) {
            
            // count,length
            var str = '';
            var count = data.result.list.length;
            if (count > 0) 
            {
                $.each (data.result.list, function (i, list) 
                {
                    str += '<tr id="tr_'+ list.ikey +'">';
                    str += '<td>'+ list.rownum +'</td>';
                    str += '<td>'+ list.put_dt +'</td>';
                    str += '<td>'+ list.re_nm +'</td>';
                    str += '<td class="T-right">'+ commas(list.qty) +'</td>';
                    str += '<td class="T-left tb_click Elli" onclick=get_return_detail({ikey:"'+list.ikey+'"})>'+ list.re_memo +'</td>';
                    str += '<td>'+ list.reg_nm +'</td>';
                    str += '</tr>';
                });
            } 
            else 
            {
                str += "<tr>";
                str += "<td colspan='6'>조회 가능한 데이터가 없습니다.</td>";
                str += "</tr>";
            } // count end
            $("#re_page_count").text(count);
            $("#re-data-container").html(str); // ajax data output

            // tr td row css
            $('.ac2 tr').click(function(){
                $('.ac2 tr').removeClass('active');
                $(this).addClass('active');
            });

            $('.ac2 td').click(function(){
                $('.ac2 td').removeClass('active');
                $(this).addClass('active');
            });

        }, // success end
        error: function(request, status, error) {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', { sticky: true, type: 'danger' });

        }, // err end

    }); // ajax end

} // function end

/**
 * @description 구매 반품 목록 리스트 클릭 detail - ajax
 * @document URL: https://pagination.js.org/docs/index.html
 */
function get_return_detail(obj) 
{
    // form clear
    process({ "div_re_reg":"none", "div_re_mod":"flex" }, "display2");

    $.ajax({
        url: '/stock/return_pop/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            $(".ikey").val(data.result.detail.ikey);
            $(".re_put_dt").val(data.result.detail.put_dt);
            $(".re_gb").val(data.result.detail.re_gb);
            $(".re_qty").val(data.result.detail.qty);
            $('.re_memo').val(data.result.detail.re_memo);
            $('.memo').val(data.result.detail.memo);
            
            // get_return_list( {'group':data.result.detail.ikey}, "Y"); 

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end/ function end


 /**
 * @description 전송 값 유효성 검사
 */
 function return_validation(obj) 
 {
    $.ajax({
        url: '/stock/return_pop/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                return_register(obj); 
            } 
            else if (data.code == '200') // up 
            { 
                return_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                return_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }
    });
}

/**
 * @description 반품 등록
 * @return result code, comment
 */
 function return_register(obj) 
 {
    $.ajax({
        url: '/stock/return_pop/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // // result code
            if (data.code == '100') // success 
            {
                get_return_list($("#frm_re_reg").serializeObject(), "Y");
                get_prod_put_list($("#frm_search").serializeObject(), "Y");     
                toast('등록이 완료되었습니다.', false, 'info');
                form_re_reset();
            }
            else if (data.code == '500') // fail
            {
                toast('수량 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 반품 수정
 * @return result code, comment
 */
 function return_modify(obj) 
 {
    $.ajax({
        url: '/stock/return_pop/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_return_list($("#frm_re_reg").serializeObject(), "Y");
                get_prod_put_list($("#frm_search").serializeObject(), "Y");     
                toast('수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '500') // fail
            {
                toast('수량 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 반품 등록 삭제
 * @return result code, comment
 */
function return_delete(obj) 
{
    $.ajax({
        url: '/stock/return_pop/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                get_return_list($("#frm_re_reg").serializeObject(), "Y");
                get_prod_put_list($("#frm_search").serializeObject(), "Y"); 
                toast('삭제 완료되었습니다.', false, 'info');
                form_re_reset();
            } 
            else if (data.code == '400') // fail
            {
                toast('삭제 불가. 확인 후 다시 이용 바랍니다.', true, 'danger');
            } 
            else if (data.code == '999')  // fail
            {
                toast('삭제 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            }
        }
    });
}

/**
 * @description 초기화
 */
 function form_re_reset()
 {
    // $('#frm_re_reg')[0].reset();
    $('.input, .textarea').val("");
    $('.select option:eq(0)').attr('selected', 'selected');

    // css 활성화/비활성화
    process({ "div_re_reg":"flex", "div_re_mod":"none" }, "display2");
    $('tr').removeClass('active');

    // 초기값 지정
    $(".re_put_dt").datepicker("setDate", new Date());
}



