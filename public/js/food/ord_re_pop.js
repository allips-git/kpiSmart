/*================================================================================
 * @description FMS 반품 입고 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/30
 ================================================================================*/

 $(function () {

    // 등록 이벤트
    $(".btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $(".p").val("in");
            pop_validation($(".frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 수정 이벤트
    $(".btn_mod").off().click(function () {
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $(".p").val("up");
            pop_validation($(".frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 삭제 이벤트
    $(".btn_del").off().click(function () {
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $(".p").val("del");
            pop_delete($(".frm_reg").serializeObject());
        }
    });

    // 초기화 이벤트
    $('.btn_reset').off().click(function(){
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            pop_reset();
        }
    });

});

/**
 * @description 반품 입고 등록 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_pop_list(obj, mode='') 
{
    $.ajax({
        url: '/stock/prod_return/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function(data) {

            $(".list_cnt").text(data.result.list.length); // page num

            // count,length
            var str = '';
            var count = data.result.list.length;
            if (count > 0) 
            {
                $.each (data.result.list, function (i, list) 
                {
                    str += '<tr class="tr_'+ list.ikey +'">';
                    str += '<td>'+ list.rownum +'</td>';
                    str += '<td>'+ list.put_dt +'</td>';
                    str += '<td>'+ list.re_nm +'</td>';
                    str += '<td>'+ list.qty +'</td>';
                    str += '<td class="T-left Elli tb_click" onclick=get_pop_detail({ikey:"'+list.ikey+'"})>'+ list.re_memo +'</td>';
                    str += '<td>'+ is_empty(list.reg_nm) +'</td>';
                });
            } 
            else 
            {
                str += "<tr>";
                str += "<td colspan='6'>조회 가능한 데이터가 없습니다.</td>";
                str += "</tr>";
            } // count end
            $(".data-container").html(str); // ajax data output

            // table selected row css
            if ($(".p").val() == 'up')
            {  
                $(".tr_"+$(".ikey").val()).addClass('active');
            }

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
 * @description 반품 입고 등록 상세조회
 */
 function get_pop_detail(obj) 
 {
    // css 활성화/비활성화
    process({ "div_reg":"none", "div_mod":"flex" }, "display2");
    $.ajax({
        url: '/stock/prod_return/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            // item detail radio, select val
            // $(".vat").val(data.result.detail.vat).prop("selected", true);
            
            var cval = { 
                "p":"up", "ikey":data.result.detail.ikey, "qty":data.result.detail.qty
              , "re_memo":data.result.detail.re_memo, "memo":data.result.detail.memo
            };
            process(cval, "cval");

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end

/**
 * @description 전송 값 유효성 검사
 */
 function pop_validation(obj) 
 {
    $.ajax({
        url: '/stock/prod_return/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                pop_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                pop_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                pop_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });
}

/**
 * @description 반품 입고 등록
 * @return result code, comment
 */
function pop_register(obj) 
{
    $.ajax({
        url: '/stock/prod_return/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_pop_list($(".frm_reg").serializeObject(), 'Y');
                get_out_list($("#frm_search").serializeObject(), 'Y');
                pop_reset();
                toast('등록이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }

    });
}

/**
 * @description 반품 입고 수정
 * @return result code, comment
 */
 function pop_modify(obj) 
 {
    $.ajax({
        url: '/stock/prod_return/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_pop_list($(".frm_reg").serializeObject(), "Y"); 
                get_out_list($("#frm_search").serializeObject(), 'Y');
                toast('수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '400') // fail 
            {
                toast('수정 가능한 재고가 없습니다. 확인 후 다시 이용 바랍니다.', true, 'danger');
            } // end else if
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 반품 입고 삭제
 * @return result code, comment
 */
 function pop_delete(obj) 
 {
    $.ajax({
        url: '/stock/prod_return/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                pop_reset();
                get_pop_list($(".frm_reg").serializeObject(), "Y"); 
                get_out_list($("#frm_search").serializeObject(), 'Y');
                toast('삭제 완료되었습니다.', false, 'info');
            }
            else if (data.code == '401' || data.code == '999')  // fail
            {
                toast('삭제 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            }

        }
    });
}

/**
 * @description 팝업창 초기화
 */
 function pop_reset()
 {
    // $('.frm_reg')[0].reset();
    $('.input, .textarea').val("");
    $('.select option:eq(0)').attr('selected', 'selected');

    // css 활성화/비활성화
    process({ "div_reg":"flex", "div_mod":"none" }, "display2");
    $('tr').removeClass('active');

    // 초기값 지정
    $(".put_dt").datepicker("setDate", new Date());
}