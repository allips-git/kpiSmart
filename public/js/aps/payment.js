/*================================================================================
 * @description APS 이용권 관리 JS
 * @author 김민주, @version 1.0, @last date 2022/01/19
 ================================================================================*/

 $(function () {

    // APS 이용권 조회
    get_pay_list($("#frm_search").serializeObject(), "Y"); 
    
    // 버튼, 엔터 검색 이벤트
    $("#btn_search").off().click(function () { 
        get_pay_list($("#frm_search").serializeObject(), "Y");
    });
    $("#content").off().keyup(function (e) {
        if(e.keyCode == 13){
            get_pay_list($("#frm_search").serializeObject(), "Y");
        }
    });

    // 등록 버튼 클릭 이벤트
    $(".btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if(con) {
            pay_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 수정 버튼 클릭 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if(con) {
            $('.read').removeAttr("disabled"); // 수정 데이터 전송가능하게 변경
            pay_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 삭제 버튼 클릭 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if(con) {
            // 입력값 리셋 및 검색 초기화
            all_reset();
            $('#keyword').prop('selectedIndex', 0); 
            $('#content').val('');
            pay_delete($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 초기화 이벤트
    $("#btn_reset").off().click(function () {
        var con = confirm('입력값을 초기화하시겠습니까?');
        if(con) {
            // 초기화
            all_reset();
            get_pay_list($("#frm_search").serializeObject());
        }
    });
});

 // 리스트 => 가용 여부 on, off 이벤트
 $(document).on('click', '.switch', function(){
    let ikey = $(this).children('input').attr('data-use');
    let useyn = $(this).children('input').val();

    if(confirm('가용 여부를 변경하시겠습니까?')){
        useyn_change(ikey, useyn);
    }
});


/**
 * @description 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
 */
 function get_pay_list(obj, mode='') {

    $("#myTable").tablesorter({theme : 'blue'});
    const container = $('#pagination');
    $.ajax({

        url: '/plan/payment/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function(data) { 

            container.pagination({ 

                // pagination setting
                dataSource: data.result.list, // ajax data list
                className: 'paginationjs-theme-blue paginationjs-small', // pagination css
                pageSize: 200,
                autoHidePrevious: true,
                autoHideNext: true,
                afterPaging: true,
                pageNumber: $("li.paginationjs-page.J-paginationjs-page").val(), // get selected page num
                callback: function (result, pagination) { 

                    var page = pagination.pageNumber;

                    // set page parameter
                    $("#page").val(page);
                    if(mode == "Y") {
                        $("li.paginationjs-page.J-paginationjs-page").val(1); // search mode
                    }

                    // count,length
                    var str = '';
                    var count = data.result.count;
                    $("#count").html(count);
                    if(count > 0) {

                        $.each(result, function (i, list) {
                            str += '<tr id="tr_'+list.ikey+'">';
                            str += '<td class="w5">' + list.rownum + '</td>';
                            str += '<td class="w5">' + list.rec_gb +'</td>';
                            str += '<td class="w6 tb_click" onclick=get_pay_detail("'+list.ikey+'")>' + list.code_nm +'</td>';
                            str += '<td class="w8 tb_click" onclick=get_pay_detail("'+list.ikey+'")>' + list.pay_uc + '</td>';
                            str += '<td class="T-left Elli tb_click" onclick=get_pay_detail("'+list.ikey+'")>' + list.pay_nm +'</td>';
                            str += '<td class="w7 T-right tb_click" onclick=get_pay_detail("'+list.ikey+'")>' + list.amt +'</td>';
                            str += '<td class="Elli T-left tb_click" onclick=get_pay_detail("'+list.ikey+'")>' + list.memo +'</td>';
                            str += '<td class="w6">';
                            str += '<label id="switch" class="switch">';
                            if(list.useyn == "Y"){
                                str += '<input type="checkbox" id="chk_'+list.ikey+'" data-use="'+list.ikey+'" name="useyn" value="'+list.useyn+'" checked disabled>';
                            }else{
                                str += '<input type="checkbox" id="chk_'+list.ikey+'" data-use="'+list.ikey+'" name="useyn" value="'+list.useyn+'" disabled>';
                            }
                            str += '<span class="slider round"></span>';
                            str += '<span class="offtxt">off</span>';
                            str += '<span class="ontxt">on</span>';
                            str += '</label>';
                            str += '</td>';
                            str += '<td class="w8">' + is_empty(list.reg_user) +'</td>';
                            str += '<td class="w9">' + list.reg_dt +'</td>';
                            str += '<td class="w8">' + is_empty(list.mod_user) +'</td>';
                            str += '<td class="w9">' + list.mod_dt +'</td>';
                            str += '<td class="w5">' + (list.sysyn == 'N' ? '삭제가능' : '<span class="red">삭제불가</span>') + '</td>';
                            str += '</tr>';
                        });

                    } else {

                        str += "<tr>";
                        str += "<td colspan='10'>조회 가능한 데이터가 없습니다.</td>";
                        str += "<td colspan='3'></td>";
                        str += "</tr>";

                    } // else end
                    
                    $("#data-container").html(str); // ajax data output

                    // tablesorter 사용을 위해 update event trigger
                    $("#myTable").trigger("update"); 

                    // table selected row css
                    if($("#p").val() == 'up'){  
                        $("#tr_"+$("#ikey").val()).addClass('active');
                    } 

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
 * @description 이용권 상세 확인
 * @param index key
 * @return row detail data
 */
 function get_pay_detail(param) {

    // btn modify mode
    var field = { "btn_reg":"none", "btn_mod":"inline", "btn_del":"inline" };
    process(field, "display2");

    // list color
    $('.at tr').click(function(){
        $('.at tr').removeClass('active');
        $(this).addClass('active');
    });

    $.ajax({

        url: '/plan/payment/detail',
        type: 'POST',
        data: {
            ikey: param
        },
        dataType: "json",
        success: function (data) { 

            // sysyn="Y or N"에 따른 수정 UI디자인 활성화/비활성화 
            frm_change(data.result.row.sysyn);

            // 가용여부, 사용처, 이용권 구분(DA/040)
            $(":radio[name='useyn'][value='"+data.result.row.useyn+"']").prop('checked', true);
            $('.rec_gb').val(data.result.row.rec_gb).attr('selected', 'selected');
            $('.pay_gb').val(data.result.row.pay_gb).attr('selected', 'selected');

            // var setting
            var field = { "p":"up", "ikey":data.result.row.ikey, "pay_nm":data.result.row.pay_nm, "main_title":data.result.row.main_title
            , "contents":data.result.row.content, "amt":data.result.row.amt.replace(",",""), "memo":data.result.row.memo };
            process(field, "cval");

        }, // end success
        error: function(request, status, error) {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', { sticky: true, type: 'danger' });

        }, // end error

    });

}

 /**
  * @description input form, btn, search, page_num 초기화 
  */
  function all_reset() {
    $('#frm_reg')[0].reset();
    var field = { "btn_reg":"inline", "btn_mod":"none", "btn_del":"none" };
    process(field, "display2");
    $("li.paginationjs-page.J-paginationjs-page").val(1); 
    $("#p").val("in");
    frm_change("N"); // UI 비활성화 해제
}

/**
 * @description 전송 값 유효성 검사
 */
 function pay_validation(obj) {

    $.ajax({

        url: '/plan/payment/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) { 

            // in, up, fail
            if(data.code == '100') {
                pay_register(obj);
            } else if(data.code == '200') {
                pay_modify(obj);
            } else if(data.code == '999') {
                toast('입력값이 정확하지 않습니다. 확인 후 다시 이용바랍니다.', true, 'danger');
            }

        }

    });

}

/**
 * @description 이용권 등록
 * @return result code, comment
 */
 function pay_register(obj) {

    $.ajax({

        url: '/plan/payment/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // success, fail 
            if(data.code == '100') {
                toast('등록이 완료되었습니다.', false, 'info');
                get_pay_list($("#frm_search").serializeObject(), "Y"); 
                all_reset(); // data reset
            } else if(data.code == '999') {
                toast('등록실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
            }

        }

    });

}

/**
 * @description 이용권 수정
 * @return result code, comment
 */
 function pay_modify(obj) {

    $.ajax({

        url: '/plan/payment/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // success, fail 
            if(data.code == '100') {
                toast('수정이 완료되었습니다.', false, 'info');
                get_pay_list($("#frm_search").serializeObject(), "Y"); 
                $("li.paginationjs-page.J-paginationjs-page").val($("#page").val()); // 페이지 유지
            } else if(data.code == '999') {
                toast('수정실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
            }

        }

    });

}

/**
 * @description 이용권 삭제
 * @return result code, comment
 */
 function pay_delete(obj) {

    $.ajax({

        url: '/plan/payment/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // success, fail 
            if(data.code == '100') {
                toast('삭제가 완료되었습니다.', false, 'info');
            } else if(data.code == '400') {
                toast('사용 중인 이용권은 삭제가 불가합니다.', true, 'danger');
            } else if(data.code == '999') {
                toast('삭제실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
            }

            // list restart
            get_pay_list($("#frm_search").serializeObject(), "Y"); 

        }

    });

}

/**
 * @description 가용여부 on, off 변경 이벤트
 * @return switch change, comment
 */
 function useyn_change(ikey, useyn) {

    var state = (useyn == "Y") ? "N" : "Y"; // 가용 상태값 반전 처리
    $.ajax({

        url: '/plan/payment/useyn',
        type: 'POST',
        data: {
            'ikey': ikey,
            'useyn': useyn
        },
        dataType: "json",
        success: function (data) {

            // success, fail 
            var chk_yn = (state == "Y") ? true : false;
            if(data.code == '100') {
                toast('변경이 완료되었습니다.', false, 'info');
                $('#chk_'+ikey+'').prop('checked', chk_yn); // list switch
                $('#chk_'+ikey+'').val(state);
                $(":radio[name='useyn'][value='"+state+"']").prop('checked', true); // frm radio
            } else if(data.code == '999') {
                toast('변경실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
            }

            // list restart
            //get_pay_list($("#frm_search").serializeObject(), "Y"); 

        }

    });

}

/**
 * @description 시스템 사용여부(sysyn)에 따른 UI 활성화/비활성화
 * @return form ui readonly true, false
 */
 function frm_change(sys_gb) {

    switch (sys_gb) {
        case "Y":
            $('.read').attr("disabled", true);
            $('.read').addClass("gray");
            break;
        case "N":
            $('.read').removeAttr("disabled");
            $('.read').removeClass("gray");
            break;
    }

}