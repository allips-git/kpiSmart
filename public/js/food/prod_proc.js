/*================================================================================
 * @description FMS 공정 등록JS
 * @author 안성준, @version 1.0, @last date 2022/05/24
 ================================================================================*/

 $(function () {

    // FMS 공정 등록 조회
    get_prod_proc_list($("#frm_search").serializeObject(), "Y"); 

    // 엔터 검색 이벤트
    $(".content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            form_reset();
            get_prod_proc_list($("#frm_search").serializeObject(), "Y");
        }
    });

    // 검색 조건 변경 이벤트
    $(".keyword, .pp_gb, .useyn, #page_size").change(function() {
        get_prod_proc_list($("#frm_search").serializeObject(), "Y");
    });

    // 초기화 이벤트
    $('.btn_reset').off().click(function(){
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            form_reset();
        }
    });

    // 공정 등록 이벤트
    $(".btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            prod_proc_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 공정 수정 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            prod_proc_validation($("#frm_reg").serializeObject());
        }
    });

    // 공정 삭제 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            prod_proc_delete($("#frm_reg").serializeObject());
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
 * @description 공정 관리 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
 */
 function get_workplace_list(obj, mode='') 
 {
    const container = $('#pagination');
    $.ajax({

        url: '/base/w_place/list',
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
                    $("#page_count").text(data.result.list.length); // page num

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
                            str += '<td class="w9">'+ list.wp_cd +'</td>';
                            str += '<td class="Elli tb_click" onclick=get_workplace_detail({ikey:"'+list.ikey+'"})>'+ list.wp_nm +'</td>';
                            str += '<td class="w12">'+ list.reg_nm +'</td>';
                            str += '<td class="w12">'+ list.reg_dt +'</td>';
                            str += '<td class="w12">'+ is_empty(list.mod_nm) +'</td>';
                            str += '<td class="w12">'+ is_empty(list.mod_dt) +'</td>';
                            str += '<td class="w8">';
                            str += '<label class="switch" id="switch" data-useyn="" style="cursor: pointer;">';
                            if (list.useyn == "Y")
                            {
                                str += '<input type="checkbox" id="chk_'+list.ikey+'" data-use="'+list.ikey+'" name="list_useyn" value="'+list.useyn+'" checked disabled>';
                            }
                            else
                            {
                                str += '<input type="checkbox" id="chk_'+list.ikey+'" data-use="'+list.ikey+'" name="list_useyn" value="'+list.useyn+'" disabled>';
                            }
                            str += '<span class="slider round"></span>';
                            str += '</label>';
                            str += '</td>';
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
 * @description 공정 상세조회
 */
 function get_workplace_detail(obj) 
 {
    // form clear
    $("#p").val("up");

    // css 활성화/비활성화
    process({ "div_reg":"none", "div_mod":"flex" }, "display2");

    $.ajax({
        url: '/base/w_place/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // item detail radio, select val
            $("input[name='useyn'][value='"+data.result.detail.useyn+"']").prop("checked", true);

            // item detail input val
            var field = { 
              "ikey": data.result.detail.ikey, "wp_nm": data.result.detail.wp_nm, "person": data.result.detail.person
              , "tel": data.result.detail.tel, "post_code": data.result.detail.post_code
              , "addr": data.result.detail.addr, "addr_detail": data.result.detail.addr_detail
              , "memo": data.result.detail.memo
          };
          process(field, "cval");

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end

/**
 * @description 공정 등록 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
 */
 function get_prod_proc_list(obj, mode='') 
 {
    const container = $('#pagination');
    $.ajax({

        url: '/base/prod_proc/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function(data) {

            // 수정 페이지 유지
            if (mode == "Y") // search mode page reset
            {
                $("li.paginationjs-page.J-paginationjs-page").val(1);
            }
            else
            {
                $("li.paginationjs-page.J-paginationjs-page").val(mode);
            }

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
                    $("#page_count").text(data.result.list.length); // page num

                    // set page parameter
                    $("#page").val(page);

                    // count,length
                    var str = '';
                    var count = data.result.list.length;
                    if (count > 0) 
                    {
                        $.each (result, function (i, list) 
                        {
                            str += '<tr id="tr_'+ list.ikey +'">';
                            str += '<td class="w6">'+ list.rownum +'</td>';
                            str += '<td class="w8 Elli">'+ list.pp_cd +'</td>';
                            str += '<td class="w8 Elli">'+ list.code_nm.substring(0,2) +'</td>';
                            str += '<td class="Elli tb_click" onclick=get_prod_proc_detail({ikey:"'+list.ikey+'"})>'+ list.pp_nm +'</td>';
                            str += '<td class="w8 Elli">'+ list.pp_hisyn +'</td>';
                            str += '<td class="T-left w30 Elli">'+ list.memo +'</td>';
                            str += '<td class="w8">';
                            str += '<label class="switch" id="switch" data-useyn="" style="cursor: pointer;">';
                            if (list.useyn == "Y")
                            {
                                str += '<input type="checkbox" id="chk_'+list.ikey+'" data-use="'+list.ikey+'" name="list_useyn" value="'+list.useyn+'" checked disabled>';
                            }
                            else
                            {
                                str += '<input type="checkbox" id="chk_'+list.ikey+'" data-use="'+list.ikey+'" name="list_useyn" value="'+list.useyn+'" disabled>';
                            }
                            str += '<span class="slider round"></span>';
                            str += '</label>';
                            str += '</td>';
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
 * @description 공정 상세조회
 */
 function get_prod_proc_detail(obj) 
 {
    // form clear
    $("#p").val("up");

    // css 활성화/비활성화
    process({ "div_reg":"none", "div_mod":"flex" }, "display2");

    $.ajax({
        url: '/base/prod_proc/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // item detail radio, select val
            $("#pp_hisyn").val(data.result.detail.pp_hisyn).prop("selected", true);
            $("input[name='useyn'][value='"+data.result.detail.useyn+"']").prop("checked", true);

            $("#ikey").val(data.result.detail.ikey);
            $("#pp_gb").val(data.result.detail.pp_gb);
            $("#pp_nm").val(data.result.detail.pp_nm);
            $("#pp_gb").val(data.result.detail.pp_gb);
            $("#memo").val(data.result.detail.memo);

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end

/**
 * @description 가용여부 on, off 변경 이벤트
 * @return switch change, comment
 */
 function useyn_change(ikey, useyn) 
 {
    var state = (useyn == "Y") ? "N" : "Y"; // 가용 상태값 반전 처리
    $.ajax({

        url: '/base/prod_proc/useyn',
        type: 'POST',
        data: {
            'ikey': ikey,
            'useyn': useyn
        },
        dataType: "json",
        success: function (data) {

            // success, fail 
            var chk_yn = (state == "Y") ? true : false;
            if (data.code == '100') 
            {
                toast('변경이 완료되었습니다.', false, 'info');
                $('#chk_'+ikey+'').prop('checked', chk_yn); // list switch
                $('#chk_'+ikey+'').val(state);
                $(":radio[name='list_useyn'][value='"+state+"']").prop('checked', true); // frm radio
            } 
            else if (data.code == '999') 
            {
                toast('변경실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
            }

        }

    });

}

/**
 * @description 전송 값 유효성 검사
 */
 function prod_proc_validation(obj) {

    $.ajax({
        url: '/base/prod_proc/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                prod_proc_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                prod_proc_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                prod_proc_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }

        }

    });

}

/**
 * @description 공정 등록
 * @return result code, comment
 */
 function prod_proc_register(obj) 
 {
    $.ajax({

        url: '/base/prod_proc/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_prod_proc_list($("#frm_search").serializeObject(), "Y"); 
                toast('등록이 완료되었습니다.', false, 'info');
                form_reset();
            }
            else if (data.code == '400') // fail
            {
                get_prod_proc_list($("#frm_search").serializeObject(), "Y"); 
                toast('중복 등록. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '600') // fail
            {
                toast('명칭 중복. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 공정 수정
 * @return result code, comment
 */
 function prod_proc_modify(obj) 
 {
    $.ajax({

        url: '/base/prod_proc/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_prod_proc_list($("#frm_search").serializeObject(), $("#page").val()); 
                toast('수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '400') // fail
            {
                get_prod_proc_list($("#frm_search").serializeObject(), $("#page").val()); 
                toast('정보 없음. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '600') // fail
            {
                toast('명칭 중복. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 공정 삭제
 * @return result code, comment
 */
 function prod_proc_delete(obj) 
 {
    $.ajax({

        url: '/base/prod_proc/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {
            // result code
            if (data.code == '100') // success
            {
                get_prod_proc_list($("#frm_search").serializeObject(), $("#page").val()); 
                toast('삭제 완료되었습니다.', false, 'info');
                form_reset();
            } 
            else if (data.code == '401') // fail
            {
                get_prod_proc_list($("#frm_search").serializeObject(), $("#page").val()); 
                toast('이미 사용중인 공정입니다. 확인 후 다시 이용 바랍니다.', true, 'danger');
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
    $("input[name='useyn'][value='Y']").prop("checked", true);
    $("li.paginationjs-page.J-paginationjs-page").val(1);

    // css 활성화/비활성화
    process({ "div_reg":"flex", "div_mod":"none" }, "display2");
    $('tr').removeClass('active');
}