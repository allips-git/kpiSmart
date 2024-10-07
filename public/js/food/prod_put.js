/*================================================================================
 * @description FMS 입고 관리JS
 * @author 안성준, @version 1.0, @last date
 * @author 김민주, @version 1.1, @last date 2022/07/20, @description 재고 리뉴얼
 ================================================================================*/

 $(function () {

    // 태블릿 해상도 디자인
    window_size();

 	// FMS 입/출고 리스트 조회
    get_prod_put_list($("#frm_search").serializeObject(), "Y"); 

    // 버튼, 엔터 검색 이벤트
    $('#btn_search').off().click(function(){
        get_prod_put_list($("#frm_search").serializeObject(), "Y");
    });
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_prod_put_list($("#frm_search").serializeObject(), "Y");
            form_reset();
        }
    });

    // 검색 조건 변경 이벤트
    $("#start_dt, #end_dt, #wh_uc, #page_size").change(function() {
        get_prod_put_list($("#frm_search").serializeObject(), "Y");
    });

    // 초기화 이벤트
    $('.btn_reset').off().click(function(){
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            form_reset();
        }
    });

    // 입고 등록 이벤트
    $(".btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            prod_put_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 입고 수정 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            prod_put_validation($("#frm_reg").serializeObject());
        }
    });

    // 입고 삭제 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            prod_put_delete($("#frm_reg").serializeObject());
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
                //barcode_update({'ikey':arr}, 'base');
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
 * @description 입고 관리 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
 */
 function get_prod_put_list(obj, mode='') 
 {
    const container = $('#pagination');
    $.ajax({
        url: '/stock/prod_put/list',
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
                            var arg = encodeURIComponent(JSON.stringify(list));
                            str += '<tr id="tr_'+ list.ikey +'">';
                            str += '<td class="no_tablet tablet">';
                            str += '<input type="checkbox" id="'+list.ikey+'" name="ikey">';
                            str += '<label for="'+list.ikey+'"></label>';
                            str += '</td>';
                            str += '<td>'+ list.rownum +'</td>';
                            str += '<td class="Elli">'+ list.put_dt +'</td>';
                            str += '<td>'+ list.wh_nm +'</td>';
                            str += '<td class="T-left tb_click Elli" onclick=get_prod_put_detail({ikey:"'+list.ikey+'"})>'+ list.item_nm +'</td>';
                            str += '<td>'+ list.size+ ' ' + list.code_nm +'</td>';
                            str += '<td class="T-right">'+ commas(list.amt) +'</td>';
                            // str += '<td class="Elli">'+ list.max_dt +'</td>';
                            str += '<td class="T-right">'+ commas(list.qty) +'</td>';
                            str += '<td class="T-right no_tablet tablet">'+ commas(list.out_qty) + '</td>';
                            str += '<td class="no_tablet tablet">';
                            str += '<button type="button" class="re_btn" onclick=open_re_pop("'+arg+'")>등록</td>';
                            str += '</td>';                            
                            str += '<td class="no_tablet tablet">'+ list.printyn +'</td>';
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        // 해상도 테이블 ROW카운터 적용(PC: 11, 태블릿: 9개)
                        var row_count = 11;
                        var width = $(window).width();
                        if(width <= 1200)
                        {
                            row_count = 8; // table row count
                        }
                        str += "<tr>";
                        str += "<td colspan="+row_count+">조회 가능한 데이터가 없습니다.</td>";
                        str += "</tr>";
                    } // count end
                    
                    // $("#page_count").text(count);
                    $("#data-container").html(str); // ajax data output

                    $('.re_btn').off().click(function() {
                        form_re_reset(); // FMS 반품출고 리스트
                        get_return_list($("#frm_re_reg").serializeObject(), 'Y');
                        $('.re_pop').bPopup({
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
 * @description 입고 상세조회
 */
 function get_prod_put_detail(obj) 
 {
    // form clear
    $("#p").val("up");
    process({ "div_reg":"none", "div_reg2":"none", "div_mod":"flex", "div_out":"block" }, "display2");
    $.ajax({
        url: '/stock/prod_put/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            $(".wh_uc").val(data.result.detail.wh_uc);
            $(".ikey").val(data.result.detail.ikey);
            $(".barcode").val(data.result.detail.barcode);
            $(".put_dt").val(data.result.detail.put_dt);
            $(".item_nm").val(data.result.detail.item_nm);
            $('.item_cd').val(data.result.detail.item_cd);
            $(".ord_no").val(data.result.detail.ord_no);
            $(".st_sq").val(data.result.detail.st_sq);     
            $(".wh_nm").val(data.result.detail.wh_nm);   
            $(".amt").val((parseFloat(data.result.detail.amt) > 0) ? commas(data.result.detail.amt) : 0);
            $(".qty").val((parseFloat(data.result.detail.qty) > 0) ? commas(data.result.detail.qty) : 0);
            $(".vat").html('<option value="'+data.result.detail.vat+'">'+data.result.detail.vat_text+'</option>');
            // $(".unit_nm").val(data.result.detail.code_nm);
            $(".unit_nm").val(data.result.detail.size+" "+data.result.detail.code_nm);
            $(".max_dt").val(data.result.detail.max_dt);
            $(".lot").val(data.result.detail.lot);
            $(".memo").val(data.result.detail.memo);

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end

 /**
 * @description 전송 값 유효성 검사
 */
 function prod_put_validation(obj) {

    $.ajax({

        url: '/stock/prod_put/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                prod_put_register(obj);
            } 
            else if (data.code == '200') // up 
            { 
                prod_put_modify(obj);
            } 
            else if (data.code == '300') // del 
            { 
                prod_put_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }

        }

    });

}

/**
 * @description 입고 등록
 * @return result code, comment
 */
 function prod_put_register(obj) 
 {
    $.ajax({

        url: '/stock/prod_put/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            // // result code
            if (data.code == '100') // success 
            {
                form_reset();
                get_prod_put_list($("#frm_search").serializeObject(), "Y"); 
                toast('등록이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '500') // fail
            {
                toast('수량 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 입고 수정
 * @return result code, comment
 */
 function prod_put_modify(obj) 
 {
    $.ajax({

        url: '/stock/prod_put/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {
            
            // result code
            if (data.code == '100') // success 
            {
                get_prod_put_list($("#frm_search").serializeObject(), $("#page").val());
                toast('수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '500') // fail
            {
                toast('수량 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 입고 삭제
 * @return result code, comment
 */
 function prod_put_delete(obj) 
 {
    $.ajax({
        url: '/stock/prod_put/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                get_prod_put_list($("#frm_search").serializeObject(), $("#page").val());
                toast('삭제 완료되었습니다.', false, 'info');
                form_reset();
            }
            else if (data.code == '401')
            {
                toast('삭제 불가. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
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
    $('.ord_no').val("");
    $(".vat").text("");
    $(".put_dt").datepicker({
        	dateFormat: 'yy-mm-dd',
        	showOn: 'button',
			buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
        }).datepicker("setDate", new Date()); 

    $("li.paginationjs-page.J-paginationjs-page").val(1);

    // css 활성화/비활성화
    process({ "div_reg":"block", "div_reg2":"flex", "div_mod":"none" }, "display2");
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

/**
 * @description 불량 팝업 기본값 세팅
 */
function open_re_pop(arg)
{
    arg = JSON.parse(decodeURIComponent(arg));
    $(".key_parent").val(arg.ikey);
    $(".st_sq").val(arg.st_sq);
}


/**
 * @description 태블릿 해상도 디자인 처리
 */
function window_size()
{
    var width = $(window).width();
    if(width <= 1200)
    {
        $(".tablet").css("display", "none");
    }
}