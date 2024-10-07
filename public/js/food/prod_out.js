/*================================================================================
 * @description FMS 제품 출고 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/30
 ================================================================================*/

 $(function () {

    // FMS 제품 출고 조회
    get_out_list($("#frm_search").serializeObject(), 'Y');

    // 버튼, 엔터 검색 이벤트
    $('#btn_search').off().click(function(){
        get_out_list($("#frm_search").serializeObject(), 'Y');
    });
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_out_list($("#frm_search").serializeObject(), 'Y');
        }
    });
    
    // 검색 조건 변경 이벤트
    $("#start_dt, #end_dt, #wh_uc, #page_size").change(function() {
        get_out_list($("#frm_search").serializeObject(), "Y");
    });

    // 초기화 이벤트
    $('#btn_reset').off().click(function(){
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            form_reset();
        }
    });

    // 제품 출고 등록 이벤트
    $("#btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            out_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 제품 출고 수정 이벤트
    $("#btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            out_validation($("#frm_reg").serializeObject());
        }
    });

    // 제품 출고 삭제 이벤트
    $("#btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            out_delete($("#frm_reg").serializeObject());
        }
    });

});

/**
 * @description 제품 출고 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_out_list(obj, mode='') 
{
    const container = $('#pagination');
    $.ajax({

        url: '/stock/prod_out/list',
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
                            var arg = encodeURIComponent(JSON.stringify(list));
                            str += '<tr id="tr_'+ list.ikey +'">';
                            str += '<td>'+ list.rownum +'</td>';
                            str += '<td>'+ list.put_dt +'</td>';
                            str += '<td>'+ list.wh_nm +'</td>';
                            str += '<td>'+ list.item_cd +'</td>';
                            str += '<td class="T-left Elli tb_click" onclick=get_out_detail({ikey:"'+list.ikey+'"})>'+ list.item_nm +'</td>';
                            str += '<td>'+ list.size +'&nbsp;'+list.unit_nm +'</td>';
                            str += '<td class="T-right">'+ commas(Number(list.amt)+Number(list.tax)) +'</td>';
                            str += '<td class="T-right">'+ commas(list.qty) +'</td>';
                            str += '<td class="T-right no_tablet">'+ commas(list.re_qty) +'</td>';
                            str += '<td class="w7 no_tablet"><button type="button" class="btn_re" onclick=pop_open("'+arg+'")>등록</button></td>';
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        // 해상도 테이블 ROW카운터 적용(PC: 13개, 태블릿: 9개)
                        var row_count = 10;
                        var width = $(window).width();
                        if(width <= 1200)
                        {
                            row_count = 8; // table row count
                        }
                        str += "<tr>";
                        str += "<td colspan="+row_count+">조회 가능한 데이터가 없습니다.</td>";
                        str += "</tr>";
                    } // count end
                    $("#data-container").html(str); // ajax data output

                    // 반품 입고 버튼 클릭 이벤트
                    $('.btn_re').click (function() {
                        get_pop_list($(".frm_reg").serializeObject(), 'Y'); // 반품 입고 리스트
                        $('.ord_re_pop').bPopup({
                          modalClose: true
                          , opacity: 0.8
                          , positionStyle: 'absolute' 
                          , speed: 300
                          , transition: 'fadeIn'
                          , transitionClose: 'fadeOut'
                          , zIndex : 99997
                            //, modalColor:'transparent' 
                        });
                    });  

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
 * @description 제품 출고 상세조회
 */
 function get_out_detail(obj) 
 {
    // css 활성화/비활성화
    process({ "div_reg":"none", "div_mod":"flex", "div_out":"block" }, "display2");
    $.ajax({
        url: '/stock/prod_out/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            // item detail input val
            var val = { 
                  "p":"up", "ikey":data.result.detail.ikey, "st_sq":data.result.detail.st_sq
                , "base_qty":data.result.detail.qty, "safe_qty":data.result.detail.safe_qty, "total_qty":data.result.detail.total_qty
            }; process(val, "val");
            var cval = { 
                  "lot":data.result.detail.lot, "st_sq":data.result.detail.st_sq
                , "ord_amt":(parseFloat(data.result.detail.amt) > 0) ? commas(data.result.detail.amt) : 0
                , "tax_amt":(parseFloat(data.result.detail.tax) > 0) ? commas(data.result.detail.tax) : 0
                , "put_dt":data.result.detail.put_dt, "item_nm":data.result.detail.item_nm
                , "wh_nm":data.result.detail.wh_nm, "unit":data.result.detail.size+data.result.detail.unit_nm, "max_dt":data.result.detail.max_dt
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
 * @description 반품 입고 팝업 기본값 세팅
 */
function pop_open(arg)
{
    arg = JSON.parse(decodeURIComponent(arg));
    $(".key_parent").val(arg.ikey);
}

/**
 * @description 전송 값 유효성 검사
 */
 function out_validation(obj) 
 {
    $.ajax({
        url: '/stock/prod_out/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                out_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                out_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                out_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });
}

/**
 * @description 제품 출고 등록
 * @return result code, comment
 */
function out_register(obj) 
{
    $.ajax({
        url: '/stock/prod_out/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_out_list($("#frm_search").serializeObject(), "Y");
                toast('등록이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '400' || data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }

    });
}

/**
 * @description 제품 출고 수정
 * @return result code, comment
 */
 function out_modify(obj) 
 {
    $.ajax({
        url: '/stock/prod_out/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_out_list($("#frm_search").serializeObject(), $("#page").val()); 
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
 * @description 제품 출고 삭제
 * @return result code, comment
 */
 function out_delete(obj) 
 {
    $.ajax({
        url: '/stock/prod_out/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                get_out_list($("#frm_search").serializeObject(), $("#page").val()); 
                toast('삭제 완료되었습니다.', false, 'info');
                form_reset();
            } 
            else if (data.code == '400') // fail
            {
                get_out_list($("#frm_search").serializeObject(), "Y"); 
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
    process({ "div_reg":"flex", "div_mod":"none", "div_out":"none" }, "display2");
    $('tr').removeClass('active');

    // 초기값 지정
    $(".put_dt").datepicker("setDate", new Date());
}
