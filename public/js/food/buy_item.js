/*================================================================================
 * @description FMS 원자재 관리JS
 * @author 안성준, @version 1.0, @last date 2022/07/31
 ================================================================================*/

$(function () {

    // FMS 원자재 리스트 조회
    get_item_list($("#frm_search").serializeObject(), "Y");
    item_lv_list();

    // 버튼, 엔터 검색 이벤트
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_item_list($("#frm_search").serializeObject(), "Y");
        }
    });

    // 검색 조건 변경 이벤트
    $("#keyword, #item_lv, #wh_uc, #page_size, #useyn").change(function() {
        get_item_list($("#frm_search").serializeObject(), "Y");
    });

    // 초기화 이벤트
    $('.btn_reset').off().click(function(){
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            form_reset();
        }
    });

    // 매출 제품 등록 이벤트
    $(".btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            buy_item_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 매출 제품 수정 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            buy_item_validation($("#frm_reg").serializeObject());
        }
    });

    // 매출 제품 삭제 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            buy_item_delete($("#frm_reg").serializeObject());
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
 * @description 원자재 관리 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_item_list(obj, mode='') 
{
    const container = $('#pagination');
    $.ajax({

        url: '/base/buy_item/list',
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
                        $("li.paginationjs-page.J-paginationjs-page").val(1); // search mode
                    }

                    // count,length
                    var str = '';
                    var count = data.result.list.length;
                    if (count > 0) 
                    {
                        $.each (result, function (i, list) 
                        {
                            str += '<tr id="tr_'+ list.ikey +'">';
                            str += '<td>'+ list.rownum +'</td>';
                            str += '<td class="Elli">'+ list.item_cd +'</td>';
                            str += '<td class="Elli">'+ list.item_gb_nm + '</td>';
                            str += '<td class="T-left Elli tb_click" onclick=get_item_detail({ikey:"'+list.ikey+'"})>'+ list.item_nm + '</td>';
                            str += '<td class="T-right">'+ commas(list.total_qty) +'</td>';
                            str += '<td class="Elli">' + is_empty(list.reg_nm) + '</td>';
                            str += '<td class="Elli">' + is_empty(list.reg_dt) +'</td>';
                            str += '<td class="Elli">' + is_empty(list.mod_nm) + '</td>';
                            str += '<td class="Elli">' + is_empty(list.mod_dt) +'</td>';
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
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        str += "<tr>";
                        str += "<td colspan='10'>조회 가능한 데이터가 없습니다.</td>";
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
 * @description 원자재 관리 상세조회
 */
 function get_item_detail(obj) 
 {
    // form clear
    $("#p").val("up");

    // css 활성화/비활성화
    process({ "div_reg":"none", "div_mod":"flex" }, "display2");

    $.ajax({
        url: '/base/buy_item/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // item detail radio, select val
            $("input[name='useyn'][value='"+data.result.detail.useyn+"']").prop("checked", true);
            $(".item_gb").val(data.result.detail.item_gb).prop("selected", true);
            $(".item_lv").val(data.result.detail.item_lv).prop("selected", true);
            $(".unit").val(data.result.detail.unit).prop("selected", true);
            $(".wh_uc").val(data.result.detail.wh_uc).prop("selected", true);
            $('.buy_cd').val(data.result.detail.buy_cd).trigger('change');

            // item detail input val
            $("#ikey").val(data.result.detail.ikey);
            var field = { 
                "item_nm":data.result.detail.item_nm, "size":data.result.detail.size
              , "maker":data.result.detail.maker, "origin":data.result.detail.origin
              , "sale_amt":(parseFloat(data.result.detail.sale_amt) > 0) ? commas(data.result.detail.sale_amt) : ""
              , "unit_amt":(parseFloat(data.result.detail.unit_amt) > 0) ? commas(data.result.detail.unit_amt) : ""
              , "safe_qty":(parseFloat(data.result.detail.safe_qty) > 0) ? commas(data.result.detail.safe_qty) : ""
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
 * @description 제품분류 리스트 조회
 */
function item_lv_list() 
{
    $.ajax({
        url: '/base/buy_item/lv',
        type: 'POST',
        dataType: "json",
        success: function (data) {

            var str = "";
            // 제품군에 따른 기본단위 기본값 세팅 
            if (data.result.item_lv.length > 0) 
            {
                $.each (data.result.item_lv, function (i, list) 
                {
                    str += "<option value='"+ list.ikey + "'>" + list.key_name + "</option>";
                });
                $(".item_lv").html(str); // item unit
                $("#item_lv").prepend(str);

            }
            $("#item_lv").prepend('<option value="">품목분류_전체</option>');
            $("#item_lv option:eq(0)").attr('selected', 'selected');
            
        } // end success
        
    });

}

/**
 * @description 가용여부 on, off 변경 이벤트
 * @return switch change, comment
 */
 function useyn_change(ikey, useyn) 
 {
    var state = (useyn == "Y") ? "N" : "Y"; // 가용 상태값 반전 처리
    $.ajax({

        url: '/base/item_list/useyn',
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
 function buy_item_validation(obj) 
 {
    $.ajax({
        url: '/base/buy_item/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                buy_item_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                buy_item_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                buy_item_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }

        }
    });
}

/**
 * @description 원자재 관리 등록
 * @return result code, comment
 */
 function buy_item_register(obj) 
 {
    $.ajax({
        url: '/base/buy_item/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_item_list($("#frm_search").serializeObject(), "Y"); 
                toast('등록이 완료되었습니다.', false, 'info');
                form_reset();
            }
            else if (data.code == '401') // fail
            {
                get_item_list($("#frm_search").serializeObject(), "Y"); 
                toast('이미 사용중인 제품명입니다. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '402') // fail
            {
                get_item_list($("#frm_search").serializeObject(), "Y"); 
                toast('중복 실패. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if
        }
    });
}

/**
 * @description 원자재 관리 수정
 * @return result code, comment
 */
 function buy_item_modify(obj) 
 {
    $.ajax({
        url: '/base/buy_item/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_item_list($("#frm_search").serializeObject(), "Y"); 
                $("li.paginationjs-page.J-paginationjs-page").val($("#page").val()); // 페이지 유지
                toast('수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '401') // fail
            {
                get_item_list($("#frm_search").serializeObject(), "Y"); 
                toast('이미 사용중인 제품명입니다. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '402') // fail
            {
                get_item_list($("#frm_search").serializeObject(), "Y"); 
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
 * @description 원자재 관리 삭제
 * @return result code, comment
 */
 function buy_item_delete(obj) 
 {
    $.ajax({
        url: '/base/buy_item/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                form_reset();
                get_item_list($("#frm_search").serializeObject(), "Y"); 
                $("li.paginationjs-page.J-paginationjs-page").val($("#page").val()); // 페이지 유지
                toast('삭제 완료되었습니다.', false, 'info');
            } 
            else if (data.code == '400') // fail
            {
                get_item_list($("#frm_search").serializeObject(), "Y"); 
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
    $('.wh_gb').find('option:first').attr('selected', 'selected');
    $("li.paginationjs-page.J-paginationjs-page").val(1);

    // css 활성화/비활성화
    process({ "div_reg":"flex", "div_mod":"none" }, "display2");
    $('tr').removeClass('active');
}



