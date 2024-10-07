/*================================================================================
 * @description FMS 매출제품 관리JS
 * @author 김민주, @version 1.0, @last date 2022/06/03
 ================================================================================*/

 $(function () {

    // FMS 매출 제품 조회
    get_item_list($("#frm_search").serializeObject(), "Y");
    item_gb_list(); // 제품분류 기본값 세팅

    // 버튼, 엔터 검색 이벤트
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_item_list($("#frm_search").serializeObject(), "Y");
        }
    });

    // 검색 조건 변경 이벤트
    $("#item_lv, #wh_uc, #page_size, #useyn").change(function() {
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
            console.log($("#frm_reg").serializeObject());
            $("#p").val("in");
            item_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 매출 제품 수정 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            item_validation($("#frm_reg").serializeObject());
        }
    });

    // 매출 제품 삭제 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            item_delete($("#frm_reg").serializeObject());
        }
    });
    
    // 제품분류가 상품(완제품)일 경우 매입단가 입력 활성화/비활성화
    $(".item_gb").change(function() {

        var item = $(this).val();
        if (item == "002")
        {
            frm_amt_active(true); // 활성화
        }
        else
        {
            frm_amt_active(false); // 비활성화
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
 * @description 매출 제품 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_item_list(obj, mode='') 
{
    const container = $('#pagination');
    $.ajax({

        url: '/base/item_list/list',
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
                            str += '<td class="w5">'+ list.rownum +'</td>';
                            str += '<td class="w7 Elli">'+ list.item_cd +'</td>';
                            str += '<td class="w8 Elli">'+ list.item_gb_nm + '</td>';
                            str += '<td class="T-left Elli tb_click" onclick=get_item_detail({ikey:"'+list.ikey+'"})>'+ list.item_nm + '</td>';
                            str += '<td class="T-right w8 Elli">'+ commas(list.total_qty) +'</td>';
                            str += '<td class="w11 Elli">' + is_empty(list.reg_nm) + '</td>';
                            str += '<td class="w11 Elli">' + is_empty(list.reg_dt) +'</td>';
                            str += '<td class="w11 Elli">' + is_empty(list.mod_nm) + '</td>';
                            str += '<td class="w11 Elli">' + is_empty(list.mod_dt) +'</td>';
                            str += '<td class="w6">';
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
 * @description 매출제품 상세조회
 */
 function get_item_detail(obj) 
 {
    // form clear
    $("#p").val("up");

    // css 활성화/비활성화
    process({ "div_reg":"none", "div_mod":"flex" }, "display2");

    $.ajax({
        url: '/base/item_list/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // 제품분류가 상품(완제품)일 경우 매입단가 입력 활성화/비활성화
            if (data.result.detail.item_gb == "002")
            {
                //frm_amt_active(true); // 활성화
                $(".unit_amt").val((parseFloat(data.result.detail.unit_amt) > 0) ? commas(data.result.detail.unit_amt) : "");
            }
            else
            {
                frm_amt_active(false); // 비활성화
            }

            // item detail radio, select val
            $("input[name='useyn'][value='"+data.result.detail.useyn+"']").prop("checked", true);
            $(".proc_gb").val(data.result.detail.proc_gb).prop("selected", true);
            $(".item_gb").val(data.result.detail.item_gb).prop("selected", true);
            $(".item_lv").val(data.result.detail.item_lv).prop("selected", true);
            $(".unit").val(data.result.detail.unit).prop("selected", true);
            $(".wh_uc").val(data.result.detail.wh_uc).prop("selected", true);

            // item detail input val
            $("#ikey").val(data.result.detail.ikey);
            var field = { 
                "item_nm":data.result.detail.item_nm, "size":data.result.detail.size
              , "min_size":(parseInt(data.result.detail.min_size) > 0) ? commas(data.result.detail.min_size) : ""
              , "sale_amt":(parseFloat(data.result.detail.sale_amt) > 0) ? commas(data.result.detail.sale_amt) : ""
              , "unit_amt_1":(parseFloat(data.result.detail.unit_amt_1) > 0) ? commas(data.result.detail.unit_amt_1) : ""
              , "unit_amt_2":(parseFloat(data.result.detail.unit_amt_2) > 0) ? commas(data.result.detail.unit_amt_2) : ""
              , "unit_amt_3":(parseFloat(data.result.detail.unit_amt_3) > 0) ? commas(data.result.detail.unit_amt_3) : ""
              , "unit_amt_4":(parseFloat(data.result.detail.unit_amt_4) > 0) ? commas(data.result.detail.unit_amt_4) : ""
              , "unit_amt_5":(parseFloat(data.result.detail.unit_amt_5) > 0) ? commas(data.result.detail.unit_amt_5) : ""
              , "safe_qty":(parseFloat(data.result.detail.safe_qty) > 0) ? commas(data.result.detail.safe_qty) : ""
              , "Battery" : (parseFloat(data.result.detail.Battery) > 0  ? commas(data.result.detail.Battery)  : "")
              , "mfr" : data.result.detail.mfr
              , "taking_weight" : data.result.detail.taking_weight
              , "self_weight"   : data.result.detail.self_weight
              , "maximum_filght" : data.result.detail.maximum_filght
              , "maximum_speed"  : data.result.detail.maximum_speed
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
function item_gb_list() 
{
    $.ajax({
        url: '/base/item_list/gb',
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
            } 
            else
            {
                str += "<option value='' disabled>제품분류 등록 후 사용가능</option>";
            }
            $("#item_lv, .item_lv").html(str); // item unit
            $("#item_lv").prepend('<option value="">제품분류_전체</option>');
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
 function item_validation(obj) 
 {

    $.ajax({
        url: '/base/item_list/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {


            // result code
            if (data.code == '100') // in
            {
                item_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                item_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                item_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }

        }
    });
}

/**
 * @description 매출제품 등록
 * @return result code, comment
 */
 function item_register(obj) 
 {
    $.ajax({

        url: '/base/item_list/i',
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

        },

        error:function(data){
            console.log(data);
        }
    });
}

/**
 * @description 매출제품 수정
 * @return result code, comment
 */
 function item_modify(obj) 
 {
    $.ajax({

        url: '/base/item_list/u',
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
 * @description 매출제품 삭제
 * @return result code, comment
 */
 function item_delete(obj) 
 {
    $.ajax({

        url: '/base/item_list/d',
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
    process({ "div_reg":"flex", "div_mod":"none", "dl_amt":"none" }, "display2");
    $('tr').removeClass('active');
}

/**
 * @description 제품분류가 상품(완제품)일 경우 매입단가 필수입력 설정
 * @param active == true(필수입력 활성화), false(필수입력 비활성화)
 */
function frm_amt_active(active) 
{

    if(active == true)
    {
        $(".dl_amt").css('display', 'flex');
    }
    else
    {
        $(".dl_amt").css('display', 'none');
    }

}
