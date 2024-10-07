/*================================================================================
 * @description FMS 반품 유형 관리 JS
 * @author 김민주, @version 1.0, @last date
 ================================================================================*/

 $(function () {

    // FMS 반품 유형 조회
    // get_return_gb_list();

    // 초기화 이벤트
    $('.btn_gb_reset').off().click(function(){
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            frm_pop_reset();
        }
    });

    // 등록 이벤트
    $(".btn_gb_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $(".p").val("in");
            return_gb_validation($(".frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 수정 이벤트
    $(".btn_gb_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $(".p").val("up");
            return_gb_validation($(".frm_reg").serializeObject());
        }
    });

    // 삭제 이벤트
    $(".btn_gb_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $(".p").val("del");
            return_gb_delete($(".frm_reg").serializeObject());
        }
    });

});

/**
 * @description 반품 유형 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_return_gb_list() 
{
    $.ajax({

        url: '/base/return_gb/list',
        type: 'POST',
        dataType: "json",
        async: false,
        success: function(data) { 

            var str = '';
            var count = data.result.list.length;
            if (count > 0) 
            {
                $.each (data.result.list, function (i, list) 
                {
                    str += '<li class="sub_menu" onclick=get_return_gb_detail({ikey:"'+list.ikey+'"})>'+ list.re_nm;
                    if (list.useyn == "Y")
                    {
                        str += '<span class="on">ON</span>';
                    }
                    else
                    {
                        str += '<span class="off">OFF</span>';
                    }
                    str += '</li>';
                });
            } 
            else 
            {
                str += '<li class="no_list">조회 가능한 데이터가 없습니다</li>';
            } // count end

            $("#gb-container").html(str); // ajax data output

            // list row css
            $('.ac3 li').click(function(){
                $('.ac3 li').removeClass('active');
                $(this).addClass('active');
            });
            $('.ac3 td').click(function(){
                $('.ac3 td').removeClass('active');
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
 * @description 반품 유형 상세조회
 */
 function get_return_gb_detail(obj) 
 {
    // form clear
    $(".p").val("up");

    // css 활성화/비활성화
    process({ "div_gb_reg":"none", "div_gb_mod":"flex" }, "display2");

    $.ajax({
        url: '/base/return_gb/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // item detail radio, select val
            $("input[name='gb_useyn'][value='"+data.result.detail.useyn+"']").prop("checked", true);

            $(".ikey").val(data.result.detail.ikey);
            $("#re_nm").val(data.result.detail.re_nm);

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end

/**
 * @description 전송 값 유효성 검사
 */
function return_gb_validation(obj) {

    $.ajax({

        url: '/base/return_gb/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                return_gb_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                return_gb_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                return_gb_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }

        }

    });

}

/**
 * @description 반품 유형 등록
 * @return result code, comment
 */
 function return_gb_register(obj) 
 {
    $.ajax({

        url: '/base/return_gb/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_return_gb_list(); 
                frm_pop_reset();
                toast('등록이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '401') // fail
            {
                get_return_gb_list(); 
                toast('이미 사용중인 반품 유형명입니다. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 반품 유형 수정
 * @return result code, comment
 */
 function return_gb_modify(obj) 
 {
    $.ajax({

        url: '/base/return_gb/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_return_gb_list();
                toast('수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '401') // fail
            {
                get_return_gb_list();
                toast('이미 사용중인 제품명입니다. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '402') // fail
            {
                get_return_gb_list(); 
                toast('제품정보 없음. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 반품 유형 삭제
 * @return result code, comment
 */
 function return_gb_delete(obj) 
 {
    $.ajax({

        url: '/base/return_gb/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                frm_pop_reset();
                get_return_gb_list();
                toast('삭제 완료되었습니다.', false, 'info');
            } 
            else if (data.code == '400') // fail
            {
                get_return_gb_list();
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
 * @description 팝업창 초기화
 */
 function frm_pop_reset()
 {
    $('.frm_reg')[0].reset();
    $('.input').val("");
    $("input[name='gb_useyn'][value='Y']").prop("checked", true);

    // css 활성화/비활성화
    process({ "div_gb_reg":"flex", "div_gb_mod":"none" }, "display2");
    $('li').removeClass('active');
}