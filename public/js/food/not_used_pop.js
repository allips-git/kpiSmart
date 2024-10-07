/*================================================================================
 * @description FMS 비가동 유형 등록JS
 * @author 안성준, @version 1.0, @last date 2022/05/25
 ================================================================================*/

 $(function () {

    // FMS 비가동 유형 리스트 조회
    // get_not_used_list("Y"); 

    // 초기화 이벤트
    $('.btn_nu_reset').off().click(function(){
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            form_nu_reset();
        }
    });

    // 비가동 등록 이벤트
    $(".btn_nu_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#nu_p").val("in");
            not_used_validation($("#frm_nu_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 비가동 수정 이벤트
    $(".btn_nu_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#nu_p").val("up");
            not_used_validation($("#frm_nu_reg").serializeObject());
        }
    });

    // 비가동 삭제 이벤트
    $(".btn_nu_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#nu_p").val("del");
            not_used_delete($("#frm_nu_reg").serializeObject());
        }
    });

});

/**
 * @description 비가동 관리 리스트 - ajax
 * @document URL: https://pagination.js.org/docs/index.html
 */
 function get_not_used_list(mode='') 
 {
    $.ajax({
        url: '/base/not_used_pop/list',
        type: 'POST',
        async: false,
        dataType: "json",
        success: function(data) { 
            
            var str = '';
            var count = data.result.list.length;
            if (count > 0) 
            {
                str += '<ul>';
                str += '<li class="top_menu">공통</li>';
                str += '<ul class="ac hovering nlist">';
                $.each (data.result.list, function (i, list) 
                {
                    str += '<li class="sub_menu" onclick=get_not_used_detail({ikey:"'+list.ikey+'"})>'+ list.nu_nm;
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
                str += '</ul>';
            } 
            else 
            {
                str += "<tr>";
                str += "<td>조회 가능한 데이터가 없습니다.</td>";
                str += "</tr>";
            } // count end
                    
            $(".n-h-scroll").html(str); // ajax data output

                // table selected row css
            if ($("#nu_p").val() == 'up')
            {  
                $("#tr_"+$("#ikey").val()).addClass('active');     
            }

            // list row css
            $('.ac li').click(function(){
                $('.ac li').removeClass('active');
                $(this).addClass('active');
            });
            $('.ac td').click(function(){
                $('.ac td').removeClass('active');
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
 * @description 비가동 상세조회
 */
 function get_not_used_detail(obj) 
 {
    // form clear
    $("#nu_p").val("up");

    // css 활성화/비활성화
    process({ "div_nu_reg":"none", "div_nu_mod":"flex" }, "display2");

    $.ajax({
        url: '/base/not_used_pop/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            console.log(data);
            // item detail radio, select val
            $("input[name='nu_useyn'][value='"+data.result.detail.useyn+"']").prop("checked", true);

            $("#nu_ikey").val(data.result.detail.ikey);
            $("#nu_nm").val(data.result.detail.nu_nm);

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end



/**
 * @description 전송 값 유효성 검사
 */
function not_used_validation(obj) {

    $.ajax({

        url: '/base/not_used_pop/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                not_used_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                not_used_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                not_used_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }

        }

    });

}

/**
 * @description 비가동 등록
 * @return result code, comment
 */
 function not_used_register(obj) 
 {
    $.ajax({
        url: '/base/not_used_pop/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_not_used_list("Y"); 
                toast('등록이 완료되었습니다.', false, 'info');
                form_nu_reset();
            }
            else if (data.code == '400') // fail
            {
                // get_prod_proc_list($("#frm_search").serializeObject(), "Y"); 
                toast('중복 등록. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '600') // fail
            {
                toast('명칭 중복. 이미 동일한 명칭이 있습니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 비가동 수정
 * @return result code, comment
 */
 function not_used_modify(obj) 
 {
    $.ajax({

        url: '/base/not_used_pop/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_not_used_list("Y"); 
                toast('수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '400') // fail
            {
                toast('정보 없음. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '600') // fail
            {
                toast('명칭 중복. 이미 동일한 명칭이 있습니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 비가동 삭제
 * @return result code, comment
 */
function not_used_delete(obj) 
{
    $.ajax({

        url: '/base/not_used_pop/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {
            // result code
            if (data.code == '100') // success
            {
                get_not_used_list("Y");
                $("li.paginationjs-page.J-paginationjs-page").val($("#page").val()); // 페이지 유지
                toast('삭제 완료되었습니다.', false, 'info');
                form_nu_reset();
            } 
            else if (data.code == '400') // fail
            {
                get_not_used_list("Y");
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
 function form_nu_reset()
 {
    $('#frm_nu_reg')[0].reset();
    $('.input').val("");
    $("input[name='nu_useyn'][value='Y']").prop("checked", true);

    // css 활성화/비활성화
    process({ "div_nu_reg":"flex", "div_nu_mod":"none" }, "display2");
    $('li').removeClass('active');
}