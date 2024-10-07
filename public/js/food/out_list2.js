/*================================================================================
 * @description FMS 제품 출고 현황 관리 JS
 * @author 김민주, @version 1.0, @last date 2022/08/31
 ================================================================================*/

 $(function () {

    // FMS 출고 현황 조회
    get_out_list($("#frm_search").serializeObject(), 'Y');

    // 엔터 검색 이벤트
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_out_list($("#frm_search").serializeObject(), 'Y');
        }
    });
    
    // 검색 조건 변경 이벤트
    $("#start_dt, #end_dt, #wh_uc, #ul_uc, #state, #page_size").change(function() {
        get_out_list($("#frm_search").serializeObject(), "Y");
    });

    // 배송사원 적용 이벤트
    $('#btn_worker').off().click(function() {

        var arr = new Array();
        var con = confirm('배송사원을 적용 하시겠습니까?');
        if (con) 
        {
            // 체크값 배열 저장
            arr = check_box();

            // 체크가 1개라도 있을경우 배송사원 적용
            if (Array.isArray(arr) && arr.length > 0)
            {
                var ul_uc = $(".ul_uc").val();
                change_worker({'ikey':arr, 'ul_uc':ul_uc});
            }
            else
            {
                alert('작업 선택 후 배송사원 지정 가능합니다.');
            }
        }

    });

    // 출고 완료 이벤트
    $('#btn_out').off().click(function() {

        var arr = new Array();
        var con = confirm('현 시간으로 출고 작업이 완료됩니다. 출고 작업을 완료하시겠습니까?');
        if (con) 
        {
            // 체크값 배열 저장
            arr = check_box();

            // 체크가 1개라도 있을경우 출고 완료 적용
            if (Array.isArray(arr) && arr.length > 0)
            {
                change_state({'ikey':arr});
            }
            else
            {
                alert('작업 선택 후 출고 완료 가능합니다.');
            }
        }

    });

    // 출고 요청서 출력 이벤트
    $('#btn_print').off().click(function() {

        var obj = new Object();
        obj.start_dt = $("#start_dt").val();
        obj.end_dt = $("#end_dt").val();
        out_print(obj);

    });

    // 출고 바코드 스캔 
    // *개발 완료되었으나 내부 협의 후 기능 비활성화. 김민주 2022/09/02
    // $(document).scannerDetection({
    //     timeBeforeScanTest: 200,        // wait for the next character for upto 200ms
    //     avgTimeByChar: 100,             // it's not a barcode if a character takes longer than 100ms
    //     endChar: [13],                  // be sure the scan is complete if key 13 (enter) is detected
    //     avgTimeByChar: 1000,            // it's not a barcode if a character takes longer than 40ms
    //     onComplete: function(barcode, qty) {

    //         $(document).focus();
    //         $('#bar_scan').val(barcode);
    //         $.ajax({
    //             url: '/stock/out_list/bu',
    //             type: 'POST',
    //             data: $("#frm_barcode").serializeObject(),
    //             dataType: "json",
    //             success: function (data) {

    //                 // result code
    //                 if (data.code == '100') // success 
    //                 {
    //                     get_out_list($("#frm_search").serializeObject(), 'Y');
    //                     toast('출고완료', false, 'info');           // success comment 
    //                 }
    //                 else if (data.code == '999') // fail 
    //                 {
    //                     toast('출고 항목 확인 불가. 확인 후 다시 이용 바랍니다.', true, 'danger');
    //                 } // end else if
                    
    //             } // end success
                
    //         });
    //     }
    // });

});

/**
 * @description 제품 출고 현황 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_out_list(obj, mode='') 
{
    const container = $('#pagination');
    $.ajax({

        url: '/stock/out_list/list',
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
                            str += '<tr>';
                            if (list.state == "005") // 출고대기 상태일때만 체크 표기
                            {
                                str += '<td>';
                                str += '<input type="checkbox" id="'+list.ikey+'" name="ikey">';
                                str += '<label for="'+list.ikey+'"></label>';
                                str += '</td>';
                            } 
                            else
                            {
                                str += '<td></td>';
                            } 
                            str += '<td>'+ list.rownum +'</td>';
                            str += '<td class="Elli">'+ list.put_dt +'</td>';
                            str += '<td class="Elli">'+ list.wh_nm +'</td>';
                            str += '<td class="Elli">'+ list.item_cd +'</td>';
                            str += '<td class="Elli">'+ list.barcode +'</td>';
                            str += '<td class="T-left Elli">'+ list.item_nm +'</td>';
                            str += '<td class="Elli">'+ list.size +'&nbsp;'+list.unit_nm +'</td>';
                            // str += '<td class="Elli">'+ list.max_dt +'</td>';
                            str += '<td class="T-right Elli">'+ commas(Number.parseFloat(list.amt)+Number.parseFloat(list.tax)) +'</td>';
                            str += '<td class="T-right Elli">'+ commas(list.ord_qty) +'</td>';
                            str += '<td class="T-right Elli">'+ commas(list.qty) +'</td>';
                            str += '<td class="Elli">'+ is_empty(list.worker_nm) +'</td>';
                            str += '<td class="Elli">'+ is_empty(list.fin_dt) +'</td>';
                            if (list.state == "005") // 출고상태 표시
                            {
                                str += '<td><span style="color: blue; font-weight: bold;">납품대기</span></td>';
                            }
                            else if (list.state == "006")
                            {
                                str += '<td><span style="color: gray;">납품완료</span></td>';
                            }
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        str += "<tr>";
                        str += "<td colspan='14'>조회 가능한 데이터가 없습니다.</td>";
                        str += "</tr>";
                    } // count end
                    $("#data-container").html(str); // ajax data output

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
 * @description 배송사원 적용/변경
 */
function change_worker(obj) 
{
    $.ajax({
        url: '/stock/out_list/wu',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('등록이 완료되었습니다.', false, 'info');           // success comment 
                get_out_list($("#frm_search").serializeObject(), 'Y');
                $("input[name=chk_all]").prop("checked", false);
            }
            else if (data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if
            
        } // end success
        
    });

}

/**
 * @description 출고완료 적용
 */
function change_state(obj) 
{
    $.ajax({
        url: '/stock/out_list/su',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('등록이 완료되었습니다.', false, 'info');           // success comment 
                get_out_list($("#frm_search").serializeObject(), 'Y');
                $("input[name=chk_all]").prop("checked", false);
            }
            else if (data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if
            
        } // end success
        
    });
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
 * @description 출고요청서 출력
*/
function out_print(obj)
{
    var con = confirm('출고요청서를 출력하시겠습니까?');
    if (con) 
    {
        chulgo_print(obj);
    }
}
