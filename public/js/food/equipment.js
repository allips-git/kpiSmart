/*================================================================================
 * @description 장비 관리JS
 * @author 김민주, @version 1.0, @last date 2022/10/18
 ================================================================================*/

 $(function () {

    // FMS 장비 리스트 조회
    get_equipment_list($("#frm_search").serializeObject(), "Y"); 

    // 엔터 검색 이벤트
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            form_reset();
            get_equipment_list($("#frm_search").serializeObject(), "Y");
        }
    });

    // 검색 조건 변경 이벤트
    $("#useyn ,#page_size").change(function() {
        get_equipment_list($("#frm_search").serializeObject(), "Y");
    });

    // 초기화 이벤트
    $('.btn_reset').off().click(function(){
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            form_reset();
        }
    });

    // 장비 등록 이벤트
    $(".btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            equipment_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 장비 수정 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            equipment_validation($("#frm_reg").serializeObject());
        }
    });

    // 장비 삭제 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            equipment_delete($("#frm_reg").serializeObject());
        }
    });

    // 바코드 출력 이벤트
    $('#btn_barcode').off().click(function() {

        var arr = new Array();
        var con = confirm('바코드를 출력 하시겠습니까?');
        if (con) 
        {
            // 체크값 배열 저장
            arr = check_box();

            // 체크가 1개라도 있을경우 출력
            if (Array.isArray(arr) && arr.length > 0)
            {
                barcode_update({'ikey':arr}, 'equipment', '/base/equipment/bar_update');
                barcode_print({'ikey':arr});
            }
            else
            {
                alert('작업 선택 후 바코드 출력 가능합니다.');
            }
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
 * @description 장비 관리 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
 */
 function get_equipment_list(obj, mode='') 
 {
    const container = $('#pagination');
    $.ajax({

        url: '/base/equipment/list',
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
                            str += '<td>';
                            str += '<input type="checkbox" id="'+list.ikey+'" class="chk_all" name="ikey">';
                            str += '<label for="'+list.ikey+'"></label>';
                            str += '</td>';
                            str += '<td>'+ list.rownum +'</td>';
                            str += '<td class="Elli">'+ list.buy_dt +'</td>';
                            str += '<td class="Elli tb_click" onclick=get_equipment_detail({ikey:"'+list.ikey+'"})>'+ list.eq_nm +'</td>';
                            str += '<td class="Elli">'+ list.buy_corp +'</td>';
                            str += '<td class="Elli">'+ list.buy_tel +'</td>';
                            str += '<td>';
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
                            if (list.print_yn == "Y")
                            {
                                str += '<td><span style="color:gray;">출력완료</span></td>';
                            }
                            else
                            {
                                str += '<td><span style="color:blue; font-weight: bold;">미출력</span></td>';
                            }
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
 * @description 장비 상세조회
 */
 function get_equipment_detail(obj) 
 {
    // form clear
    $("#p").val("up");

    // css 활성화/비활성화
    process({ "div_reg":"none", "div_mod":"flex" }, "display2");

    $.ajax({
        url: '/base/equipment/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // item detail radio, select val
            $("input[name='useyn'][value='"+data.result.detail.useyn+"']").prop("checked", true);

            // item detail input val
            var field = { 
               "ikey": data.result.detail.ikey, "eq_nm": data.result.detail.eq_nm
              , "buy_corp": data.result.detail.buy_corp, "buy_tel": data.result.detail.buy_tel, "buy_dt": data.result.detail.buy_dt
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
 * @description 가용여부 on, off 변경 이벤트
 * @return switch change, comment
 */
 function useyn_change(ikey, useyn) 
 {
    var state = (useyn == "Y") ? "N" : "Y"; // 가용 상태값 반전 처리
    $.ajax({

        url: '/base/equipment/useyn',
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
 function equipment_validation(obj) {

    $.ajax({
        url: '/base/equipment/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                equipment_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                equipment_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                equipment_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });

}

/**
 * @description 장비 등록
 * @return result code, comment
 */
 function equipment_register(obj) 
 {
    $.ajax({
        url: '/base/equipment/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // // result code
            if (data.code == '100') // success 
            {
                get_equipment_list($("#frm_search").serializeObject(), "Y"); 
                toast('등록이 완료되었습니다.', false, 'info');
                form_reset();
            }
            else if (data.code == '400') // fail
            {
                get_equipment_list($("#frm_search").serializeObject(), "Y"); 
                toast('중복 등록. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '600') // fail
            {
                toast('기계명 중복. 이미 동일한 기계명이 있습니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 장비 수정
 * @return result code, comment
 */
 function equipment_modify(obj) 
 {
    $.ajax({
        url: '/base/equipment/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {
            
            // result code
            if (data.code == '100') // success 
            {
                get_equipment_list($("#frm_search").serializeObject(), "Y"); 
                $("li.paginationjs-page.J-paginationjs-page").val($("#page").val()); // 페이지 유지
                toast('수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '400') // fail
            {
                get_equipment_list($("#frm_search").serializeObject(), "Y"); 
                toast('장비정보 없음. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '600') // fail
            {
                toast('기계명 중복. 이미 동일한 기계명이 있습니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if
        }
    });
}

/**
 * @description 장비 삭제
 * @return result code, comment
 */
 function equipment_delete(obj) 
 {
    $.ajax({
        url: '/base/equipment/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                form_reset();
                get_equipment_list($("#frm_search").serializeObject(), "Y"); 
                $("li.paginationjs-page.J-paginationjs-page").val($("#page").val()); // 페이지 유지
                toast('삭제 완료되었습니다.', false, 'info');
            } 
            else if (data.code == '400') // fail
            {
                get_equipment_list($("#frm_search").serializeObject(), "Y"); 
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

/**
 * @description 체크박스 체크 이벤트
 */
function check_box() 
{
    // 체크값 배열 저장
    var arr = new Array();
    $("input[name=ikey]:checked").each(function() {
        if($(this).val() && $(this).val() != '') 
        {
            arr.push($(this).attr('id'));
        }
    });
    return arr;
}