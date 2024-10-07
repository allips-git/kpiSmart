/*================================================================================
 * @description FMS 거래처 관리JS
 * @author 김민주, @version 1.0, @last date 2022/05/17
 ================================================================================*/

 $(function () {

    // FMS 거래처 리스트 조회
    get_client_list($("#frm_search").serializeObject(), "Y"); 

    // 엔터 검색 이벤트
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            form_reset();
            get_client_list($("#frm_search").serializeObject(), "Y");
        }
    });

    // 검색 조건 변경 이벤트
    $("#cust_gb, #cust_grade, #sales_person, #useyn ,#page_size").change(function() {
        get_client_list($("#frm_search").serializeObject(), "Y");
    });

    // 초기화 이벤트
    $('.btn_reset').off().click(function(){
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            form_reset();
        }
    });

    // 거래처 등록 이벤트
    $(".btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            client_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });
    
    // 거래처 수정 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            client_validation($("#frm_reg").serializeObject());
        }
    });

    // 거래처 삭제 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            client_delete($("#frm_reg").serializeObject());
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
 * @description 거래처 관리 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
 */
 function get_client_list(obj, mode='') 
 {
    $("#myTable").tablesorter({theme : 'blue'}); // sort plugin - 테이블 정렬 기능
    const container = $('#pagination');
    $.ajax({

        url: '/biz/client/list',
        type: 'POST',
        data: obj,
        dataType: "json",
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
                            str += '<td class="w5">'+ list.rownum +'</td>';
                            str += '<td class="w6 Elli">'+ list.code_nm +'</td>';
                            str += '<td class="w9 Elli">'+ list.cust_cd +'</td>';
                            str += '<td class="T-left Elli tb_click" onclick=get_client_detail({ikey:"'+list.ikey+'"})>'+ list.cust_nm +'</td>';
                            str += '<td class="w11 Elli">'+ list.reg_nm +'</td>';
                            str += '<td class="w12 Elli">'+ list.reg_dt +'</td>';
                            str += '<td class="w11 Elli">'+ is_empty(list.mod_nm) +'</td>';
                            str += '<td class="w12 Elli">'+ is_empty(list.mod_dt) +'</td>';
                            str += '<td class="w7">';
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
                        str += "<td colspan='9'>조회 가능한 데이터가 없습니다.</td>";
                        str += "</tr>";
                    } // count end
                    
                    $("#data-container").html(str); // ajax data output

                    // tablesorter 사용을 위해 update event trigger
                    $("#myTable").trigger("update"); 

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
 * @description 거래처 상세조회
 */
 function get_client_detail(obj) 
 {
    // form clear
    $("#p").val("up");

    // css 활성화/비활성화
    process({ "div_reg":"none", "div_mod":"flex" }, "display2");
    $.ajax({
        url: '/biz/client/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // item detail radio, select val
            $("input[name='useyn'][value='"+data.result.detail.useyn+"']").prop("checked", true);
            $(".cust_gb").val(data.result.detail.cust_gb).prop("selected", true);
            $(".cust_grade").val(data.result.detail.cust_grade).prop("selected", true);
            $(".dlv_gb").val(data.result.detail.dlv_gb).prop("selected", true);
            $(".bl_nm").val(data.result.detail.bl_nm).prop("selected", true);
            $(".sales_person").val(data.result.detail.sales_person).prop("selected", true);
            $(".vat").val(data.result.detail.vat).prop("selected", true);

            // item detail input val
            var field = { 
                "ikey": data.result.detail.ikey, "cust_nm": data.result.detail.cust_nm, "biz_nm": data.result.detail.biz_nm,
                "biz_num": data.result.detail.biz_num, "cust_num": data.result.detail.cust_num, "ceo_nm": data.result.detail.ceo_nm,
                "ceo_tel": data.result.detail.ceo_tel, "biz_class": data.result.detail.biz_class, "biz_type": data.result.detail.biz_type,
                "tel": data.result.detail.tel, "fax": data.result.detail.fax, "email": data.result.detail.email,
                "biz_zip": data.result.detail.biz_zip, "address": data.result.detail.address, "addr_detail": data.result.detail.addr_detail,
                "person": data.result.detail.person, "person_tel": data.result.detail.person_tel, "holder_nm": data.result.detail.holder_nm,
                "bl_num": data.result.detail.bl_num, "dlv_zip": data.result.detail.dlv_zip, "dlv_addr": data.result.detail.dlv_addr,
                "dlv_detail": data.result.detail.dlv_detail, "memo": data.result.detail.memo
          };
          process(field, "cval");

          // 미수금액 정보
          $(".ord_amt").val(commas(Math.round(data.result.detail.total_amt)));

          // 미지급액 정보
          $(".buy_amt").val(commas(Math.round(data.result.detail.buy_amt)));

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

        url: '/biz/client/useyn',
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
 function client_validation(obj) {

    $.ajax({

        url: '/biz/client/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                client_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                client_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                client_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }

        }

    });

}

/**
 * @description 거래처 등록
 * @return result code, comment
 */
 function client_register(obj) 
 {
    $.ajax({

        url: '/biz/client/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                form_reset();
                get_client_list($("#frm_search").serializeObject(), "Y"); 
                toast('등록이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '400') // fail
            {
                toast('중복 등록. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '401') // fail
            {
                toast('이미 사용 중인 사업자 등록번호입니다. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 거래처 수정
 * @return result code, comment
 */
 function client_modify(obj) 
 {
    $.ajax({

        url: '/biz/client/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_client_list($("#frm_search").serializeObject(), "Y"); 
                $("li.paginationjs-page.J-paginationjs-page").val($("#page").val()); // 페이지 유지
                toast('수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '400') // fail
            {
                get_client_list($("#frm_search").serializeObject(), "Y"); 
                toast('거래처정보 없음. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '401') // fail
            {
                toast('이미 사용 중인 사업자 등록번호입니다. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 거래처 삭제
 * @return result code, comment
 */
 function client_delete(obj) 
 {
    $.ajax({

        url: '/biz/client/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                form_reset();
                get_client_list($("#frm_search").serializeObject(), "Y"); 
                $("li.paginationjs-page.J-paginationjs-page").val($("#page").val()); // 페이지 유지
                toast('삭제 완료되었습니다.', false, 'info');
            } 
            else if (data.code == '400') // fail
            {
                get_client_list($("#frm_search").serializeObject(), "Y"); 
                toast('삭제 불가. 이미 사용중인 거래처 입니다.', true, 'danger');
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
}