/*================================================================================
 * @description FMS 수도계량 등록JS
 * @author 안성준, @version 1.0, @last date 2022/07/31
 ================================================================================*/

 $(function () {

    // FMS 수도 계량 리스트 조회
    get_water_list($("#frm_search").serializeObject(), "Y"); 

    // 엔터 검색 이벤트
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            form_reset();
            get_water_list($("#frm_search").serializeObject(), "Y");
        }
    });

    // 검색 조건 변경 이벤트
    $("#keyword, #wg_gb ,#page_size").change(function() {
        get_water_list($("#frm_search").serializeObject(), "Y");
    });

    // 초기화 이벤트
    $('.btn_reset').off().click(function(){
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            form_reset();
        }
    });

    // 수도계량 등록 이벤트
    $(".btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            water_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 수도계량 수정 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            water_validation($("#frm_reg").serializeObject());
        }
    });

    // 수도계량 삭제 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            water_delete($("#frm_reg").serializeObject());
        }
    });

});

 // 리스트 => 가용 여부 on, off 이벤트
 $(document).on('click', '.switch', function() {
    let ikey = $(this).children('input').attr('data-use');
    let useyn = $(this).children('input').val();
    useyn_change(ikey, useyn);
});

/**
 * @description 수도계량 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
 */
 function get_water_list(obj, mode='') 
 {
    const container = $('#pagination');
    $.ajax({

        url: '/wk/water_gauge/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function(data) { 
            container.pagination({ 

                // pagination setting
                dataSource: data.result.list, // ajax data list
                className: 'paginationjs-theme-blue paginationjs-small', // pagination css
                pageSize: $("#page_size option:selected").val(),
                autoHidePrevious: true,
                autoHideNext: true,
                afterPaging: true,
                pageNumber: $("li.paginationjs-page.J-paginationjs-page").val(), // get selected page num
                callback: function (result, pagination) {

                    var page = pagination.pageNumber;
                    $("#list_cnt").text(data.result.list.length); // page num

                    // set page parameter
                    $("#page").val(page);
                    if (mode == "Y") // search mode page reset
                    {
                        $("li.paginationjs-page.J-paginationjs-page").val(1);
                    }

                    // count,length
                    var str = '';
                    var count = data.result.list.length;
                    if (count > 0) 
                    {
                        $.each (result, function (i, list) 
                        {
                            str += '<tr id="tr_'+ list.ikey +'">';
                            str += '<td class="w6">'+ list.rownum +'</td>';
                            str += '<td class="w10 Elli">'+ list.base_dt +'</td>';
                            str += '<td class="w12 Elli tb_click T-right" onclick=get_water_detail({ikey:"'+list.ikey+'"})>'+ list.volume +" "+list.code_nm+'</td>';
                            str += '<td class="T-left Elli">'+ list.memo +'</td>';
                            str += '<td class="w12 Elli">'+ list.reg_nm +'</td>';
                            str += '<td class="w12 Elli">'+ list.reg_dt +'</td>';
                            str += '<td class="w12 Elli">'+ is_empty(list.mod_nm) +'</td>';
                            str += '<td class="w12 Elli">'+ is_empty(list.mod_dt) +'</td>';
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        str += "<tr>";
                        str += "<td colspan='8'>조회 가능한 데이터가 없습니다.</td>";
                        str += "</tr>";
                    } // count end
                    
                    $("#data-container").html(str); // ajax data output

                    // table selected row css
                    if ($("#p").val() == 'up')
                    {  
                        $("#tr_"+$("#ikey").val()).addClass('active');
                    }

                    // tr td row css
                    $('.ac tr').click(function(){
                        $('.ac tr').removeClass('active');
                        $(this).addClass('active');
                    });

                    $('.ac td').click(function(){
                        $('.ac td').removeClass('active');
                        $(this).addClass('active');
                    });

                } // callback end

            }) // page end


        }, // success end
        error: function(request, status, error) {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', { sticky: true, type: 'danger' });

        }, // err end

    }); // ajax end

} // function end

/**
 * @description 수도계량 상세조회
 */
 function get_water_detail(obj) 
 {
    // form clear
    $("#p").val("up");

    // css 활성화/비활성화
    process({ "div_reg":"none", "div_mod":"flex" }, "display2");

    $.ajax({
        url: '/wk/water_gauge/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // item detail input val
            $("#ikey").val(data.result.detail.ikey);
            $("#base_dt").val(data.result.detail.base_dt);
            $("#volume").val(data.result.detail.volume);
            $("#unit").val(data.result.detail.unit);
            $("#memo").val(data.result.detail.memo);

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end

/**
 * @description 전송 값 유효성 검사
 */
 function water_validation(obj) {
  
    $.ajax({

        url: '/wk/water_gauge/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                water_register(obj);
            } 
            else if (data.code == '200') // up 
            {
                water_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                water_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }

        }

    });

}

/**
 * @description 수도 계량 등록
 * @return result code, comment
 */
 function water_register(obj) 
 {
    $.ajax({

        url: '/wk/water_gauge/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_water_list($("#frm_search").serializeObject(), "Y"); 
                toast('등록이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '400') // fail
            {
                toast('기준일 중복. 이미 중복되는 기준일이 있습니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 수도 계량 수정
 * @return result code, comment
 */
 function water_modify(obj) 
 {
    $.ajax({
        url: '/wk/water_gauge/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            console.log("data2 : "+JSON.stringify(data));
            // result code
            if (data.code == '100') // success 
            {
                get_water_list($("#frm_search").serializeObject(), "Y"); 
                $("li.paginationjs-page.J-paginationjs-page").val($("#page").val()); // 페이지 유지
                toast('수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '400') // fail
            {
                get_water_list($("#frm_search").serializeObject(), "Y"); 
                toast('정보 없음. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '600') // fail
            {
                toast('기준일 중복. 이미 중복되는 기준일이 있습니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 수도 계량 삭제
 * @return result code, comment
 */
 function water_delete(obj) 
 {
    $.ajax({

        url: '/wk/water_gauge/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                form_reset();
                get_water_list($("#frm_search").serializeObject(), "Y"); 
                $("li.paginationjs-page.J-paginationjs-page").val($("#page").val()); // 페이지 유지
                toast('삭제 완료되었습니다.', false, 'info');
            } 
            else if (data.code == '400') // fail
            {
                // get_water_list($("#frm_search").serializeObject(), "Y"); 
                toast('삭제 실패. 확인 후 다시 이용 바랍니다.', true, 'danger');
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
 function form_reset()
 {
    $('#frm_reg')[0].reset();
    $('.input').val("");
    $("li.paginationjs-page.J-paginationjs-page").val(1);

    // 주문일, 출고일 기본날짜 세팅
    $(".datepicker").datepicker({
        dateFormat: 'yy-mm-dd',
        showOn: 'button',
        buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
        buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
        changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
        changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
    }).datepicker("setDate", new Date());               // today setting

    // css 활성화/비활성화
    process({ "div_reg":"flex", "div_mod":"none" }, "display2");
    $('tr').removeClass('active');
}