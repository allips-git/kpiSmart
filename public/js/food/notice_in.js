/*================================================================================
 * @description FMS 공지사항 관리JS
 * @author 안성준, @version 1.0, @last date 2022/05/20
 ================================================================================*/

 $(function () {

    var type_tag = $("#tag").val();
    var ikey = $("#ikey").val();

    if(type_tag == "v") //공지사항 detail 페이지 진입시
    {
        get_notice_detail({'ikey' : ikey});
    }
    else if(type_tag == "u") //공지사항 업데이트 페이지 진입시
    {   
        get_u_notice_detail({'ikey' : ikey});
    }

    // 공지사항 등록 이벤트
    $("#btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");

            var obj = $("#frm_reg").serializeObject();
            obj.content = CKEDITOR.instances.contents.getData(); //CKEDITOR 사용시 value값 따로 받아와야 이용가능
            notice_validation(obj); // form 데이터 유효성 검사
        }
    });

    // 공지사항 등록 취소 / 수정 취소 이벤트
    $("#btn_cancel").off().click(function () { 
        var con = confirm('저장하지 않은 내용은 초기화 됩니다. 메인으로 이동하시겠습니까?');
        if (con) 
        {
            location.href='/cs/notice';
        }
    });

    // 공지사항 수정페이지 이동 이벤트
    $("#btn_move_u").off().click(function () { 
        location.href='/cs/notice/u?ikey='+ikey;
    });

    // 공지사항 수정 이벤트
    $("#btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            var obj = $("#frm_reg").serializeObject();
            obj.ikey    = $("#ikey").val();
            obj.content = CKEDITOR.instances.contents.getData(); //CKEDITOR 사용시 value값 따로 받아와야 이용가능
            notice_validation(obj); // form 데이터 유효성 검사
        }
    });

    // 초기화 이벤트
    $('#btn_del').off().click(function(){
        var con = confirm('삭제하시겠습니까?');
        if(con)
        {
            var ikey = $("#ikey").val();
            notice_delete({"ikey" : ikey});
            {ikey:"'+list.ikey+'"}
        }
    });

});


/**
 * @description 전송 값 유효성 검사
 */
 function notice_validation(obj) 
 {
    $.ajax({
        url: '/cs/notice/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                notice_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                notice_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                notice_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }
    });

}

/**
 * @description 공지사항 등록
 * @return result code, comment
 */
 function notice_register(obj) 
 {
    $.ajax({
        url: '/cs/notice/n_i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('등록이 완료되었습니다.', false, 'info');
                location.href='/cs/notice';
            }
            else if (data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 공지사항 수정
 * @return result code, comment
 */
 function notice_modify(obj) 
 {
    $.ajax({
        url: '/cs/notice/n_u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('수정이 완료되었습니다.', false, 'info');
                location.href='/cs/notice';
            }
            else if (data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 공지사항 상세조회
 */
 function get_notice_detail(obj) 
 {
    $.ajax({
        url: '/cs/notice/n_detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            $('#category').text(data.result.detail.category);
            $('#reg_dt').text(data.result.detail.reg_dt);
            $('#title').text(data.result.detail.title);
            $('#reg_nm').text(data.result.detail.reg_nm);
            $('#content').html(data.result.detail.content);

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end

/**
 * @description 공지사항 수정 세팅
 */
 function get_u_notice_detail(obj) 
 {
    $.ajax({
        url: '/cs/notice/u_detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            $('#category').val(data.result.detail.category);
            $("input[name='useyn'][value='"+data.result.detail.useyn+"']").prop("checked", true);
            $('#title').val(data.result.detail.title);
            CKEDITOR.instances.contents.setData(data.result.detail.content);

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end
    }); // ajax end
} // function end

function notice_delete(obj) 
{
    $.ajax({
        url: '/cs/notice/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {
            
            // result code
            if (data.code == '100') // success
            {
                location.href='/cs/notice';
                toast('삭제 완료되었습니다.', false, 'info');
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
