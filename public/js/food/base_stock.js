/*================================================================================
 * @description FMS 기초 재고 관리JS
 * @author 김민주, @version 1.0, @last date 2022/09/01
 ================================================================================*/

 $(function () {

    // 검색 - select2 lib 사용
    call_select2('#item_list', '/base/select2/item_list', 0, '품목명을', '품목_선택'); // 품목 전체 조회

    // FMS 기초 재고 조회
    get_base_list($("#frm_search").serializeObject(), 'Y');

    // 버튼, 엔터 검색 이벤트
    $('#btn_search').off().click(function(){
        get_base_list($("#frm_search").serializeObject(), 'Y');
    });
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_base_list($("#frm_search").serializeObject(), 'Y');
        }
    });
    
    // 검색 조건 변경 이벤트
    $("#start_dt, #end_dt, #wh_uc, #page_size").change(function() {
        get_base_list($("#frm_search").serializeObject(), "Y");
    });

    // 초기화 이벤트
    $('#btn_reset').off().click(function(){
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            form_reset();
        }
    });

    // 기초 재고 등록 이벤트
    $("#btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            base_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 기초 재고 수정 이벤트
    $("#btn_mod").off().click(function () {

        // 수정 후 예상 현재고가 안전재고 미달일 경우 경고메세지 제공
        var safe_qty = $("#safe_qty").val();
        var total_qty = (Number($("#total_qty").val())-Number($("#base_qty").val()))+Number($(".qty").val());
        if ((safe_qty != 0) && (total_qty <= safe_qty))
        {
            alert('안전재고 미달 품목입니다. 참고 바랍니다.');
        }
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            base_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }

    });

    // 기초 재고 삭제 이벤트
    $("#btn_del").off().click(function () {

        // 삭제 후 예상 현재고가 안전재고 미달일 경우 경고메세지 제공
        var safe_qty = $("#safe_qty").val();
        var total_qty = Number($("#total_qty").val())-Number($("#base_qty").val());
        if ((safe_qty != 0) && (total_qty <= safe_qty))
        {
            alert('안전재고 미달 품목입니다. 참고 바랍니다.');
        }
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            base_delete($("#frm_reg").serializeObject());
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
                barcode_update({'ikey':arr}, 'base', '/base/base_stock/bar_update');
                barcode_print({'ikey':arr});
            }
            else
            {
                alert('작업 선택 후 바코드 출력 가능합니다.');
            }
        }

    });

});

/**
 * @description 기초 재고 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_base_list(obj, mode='') 
{
    const container = $('#pagination');
    $.ajax({
        url: '/base/base_stock/list',
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
                    $("#list_cnt").text(data.result.list.length); // page num

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
                            str += '<td>';
                            str += '<input type="checkbox" id="'+list.ikey+'" name="ikey">';
                            str += '<label for="'+list.ikey+'"></label>';
                            str += '</td>';
                            str += '<td>'+ list.rownum +'</td>';
                            str += '<td class="Elli">'+ list.put_dt +'</td>';
                            str += '<td class="Elli">'+ list.wh_nm +'</td>';
                            str += '<td class="Elli">'+ list.item_cd +'</td>';
                            str += '<td class="T-left Elli tb_click" onclick=get_base_detail({ikey:"'+list.ikey+'"})>'+ list.item_nm +'</td>';
                            str += '<td class="Elli">'+ list.size +'&nbsp;'+list.unit_nm +'</td>';
                            str += '<td class="T-right">'+ commas(list.amt) +'</td>';
                            str += '<td class="T-right">'+ commas(list.qty) +'</td>';
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
 * @description 기초재고 상세조회
 */
 function get_base_detail(obj) 
 {
    // css 활성화/비활성화
    process({ "div_reg":"none", "div_mod":"flex" }, "display2");
    $.ajax({
        url: '/base/base_stock/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            // item detail radio, select val
            $(".vat").val(data.result.detail.vat).prop("selected", true);

            // item detail input val
            var val = { 
                  "p":"up", "ikey":data.result.detail.ikey, "st_sq":data.result.detail.st_sq
                , "base_qty":data.result.detail.qty, "safe_qty":data.result.detail.safe_qty, "total_qty":data.result.detail.total_qty
                , "vat":commas(data.result.detail.vat_nm)
            }; process(val, "val");
            var cval = { 
                  "item_list":data.result.detail.item_nm, "wh_nm":data.result.detail.wh_nm, "put_dt":data.result.detail.put_dt
                , "unit":data.result.detail.size+data.result.detail.unit_nm, "max_dt":data.result.detail.max_dt
                , "amt":(parseFloat(data.result.detail.amt) > 0) ? commas(data.result.detail.amt) : 0
                , "qty":(parseFloat(data.result.detail.qty) > 0) ? commas(data.result.detail.qty) : 0
                , "size":data.result.detail.size, "memo": data.result.detail.memo
            };
            process(cval, "cval");

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end

/**
 * @description select2 변경 이벤트
 */
function change_item(id, count='')
{
    // 초기화
    $(".amt").val("");
    $.ajax({
        url: '/base/select2/item_detail',
        type: 'POST',
        data: {
            'item_cd': $("#"+id+" option:selected").val()
        },
        dataType: "json",
        success: function (data) {

            // 매입제품일 경우 매입단가 기본값 세팅
            if(data.result.detail.main_cd == "B")
            {
                $(".amt").val(commas(data.result.detail.unit_amt));
            }

            var unit = data.result.detail.size+' '+data.result.detail.unit_nm;
            $("#unit").val(unit);
            // 품목에 설정된 기본창고 있을경우 기본값 세팅
            if (data.result.detail.wh_uc != '') 
            {
                $(".wh_uc").val(data.result.detail.wh_uc).prop("selected", true);
            }

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end
    }); // ajax end
}

/**
 * @description 전송 값 유효성 검사
 */
 function base_validation(obj) 
 {
    $.ajax({
        url: '/base/base_stock/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                base_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                base_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                base_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });
}

/**
 * @description 기초 재고 등록
 * @return result code, comment
 */
function base_register(obj) 
{
    $.ajax({

        url: '/base/base_stock/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_base_list($("#frm_search").serializeObject(), 'Y');
                toast('등록이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }

    });
}

/**
 * @description 기초 재고 수정
 * @return result code, comment
 */
 function base_modify(obj) 
 {
    $.ajax({

        url: '/base/base_stock/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_base_list($("#frm_search").serializeObject(), $("#page").val());
                toast('수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '400') // fail 
            {
                toast('수정 가능한 재고가 없습니다. 확인 후 다시 이용 바랍니다.', true, 'danger');
            } // end else if
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 기초 재고 삭제
 * @return result code, comment
 */
 function base_delete(obj) 
 {
    $.ajax({

        url: '/base/base_stock/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                get_base_list($("#frm_search").serializeObject(), $("#page").val()); 
                toast('삭제 완료되었습니다.', false, 'info');
                form_reset();
            }
            else if (data.code == '401' || data.code == '999')  // fail
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
    $('.wh_gb').find('option:first').attr('selected', 'selected');
    $("li.paginationjs-page.J-paginationjs-page").val(1);

    // css 활성화/비활성화
    process({ "div_reg":"flex", "div_mod":"none" }, "display2");
    $('tr').removeClass('active');

    // 초기값 지정
    $(".put_dt").datepicker("setDate", new Date());
    $("#item_list").text("");
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