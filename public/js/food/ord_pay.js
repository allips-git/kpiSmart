/*================================================================================
 * @description 매출/수금 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/09
 ================================================================================*/

 $(function () {

    // 검색 - select2 lib 사용
    call_select2('#biz_list', '/base/select2/biz_list', 0, '거래처를', '매출거래처_선택'); // 거래처 전체 조회
    
    // 검색 조건 변경 이벤트
    $("#start_dt, #end_dt, #page_size").change(function() {
        get_ord_pay_list($("#frm_search").serializeObject(), "Y");
    });

 });

/**
 * @description 매출/수금 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_ord_pay_list(obj, mode='') 
{
    const container = $('#pagination');
    $.ajax({

        url: '/acc/ord_pay/list',
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
                    if (mode == "Y")
                    {
                        $("li.paginationjs-page.J-paginationjs-page").val(1);
                    }

                    // count,length
                    var str = '';
                    var bank = '';
                    var count = data.result.list.length;
                    if (count > 0) 
                    {
                        $.each (result, function (i, list) 
                        {
                            bank = is_empty(list.bank_nm) ? list.bank_nm+' '+list.acc_nm+' '+list.bl_num : '';
                            str += '<tr id="tr_'+ list.ikey +'">';
                            str += '<td>'+ list.rownum +'</td>';
                            str += '<td class="Elli">'+ list.acc_dt +'</td>';
                            if (list.detail == "001") // 거래 상세
                            {
                                str += '<td><span style="color:blue;">'+ list.detail_nm + '</span></td>';
                            }
                            else if (list.detail == "002")
                            {
                                str += '<td><span style="color:red;">'+ list.detail_nm + '</span></td>';
                            }
                            else
                            {
                                str += '<td>'+ list.detail_nm + '</td>';
                            }
                            str += '<td class="Elli">'+ list.acc_no +'</td>';
                            str += '<td class="Elli">'+ is_empty(list.code_nm) +'</td>';
                            str += '<td class="T-left Elli">'+ bank + '</td>';
                            str += '<td class="T-right Elli">'+ commas(list.amt) +'</td>';
                            str += '<td class="T-right Elli">'+ commas(list.tax) +'</td>';
                            str += '<td class="T-right Elli">'+ commas(Math.round(list.total_amt)) +'</td>';
                            str += '<td class="T-left Elli">'+ list.memo +'</td>';
                            str += '<td class="Elli">' + is_empty(list.reg_nm) + '</td>';
                            str += '<td class="Elli">' + is_empty(list.reg_dt) +'</td>';
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        str += "<tr>";
                        str += "<td colspan='12'>조회 가능한 데이터가 없습니다.</td>";
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
 * @description select2 거래처 변경 이벤트
 */
function change_item(id, count='')
{
    $.ajax({
        url: '/biz/client/detail',
        type: 'POST',
        data: {
            'ikey': $("#"+id+" option:selected").val()
        },
        dataType: "json",
        success: function (data) {

            form_reset();
            $(".btns").css('display', 'flex'); // 수금 버튼 활성화
            $(".cust_cd").val(data.result.detail.cust_cd);
            $(".cust_nm").val(data.result.detail.cust_nm);
            get_ord_pay_list($("#frm_search").serializeObject(), "Y");

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end
    }); // ajax end
}

/**
 * @description 초기화
 */
 function form_reset()
 {
    $('#frm_reg')[0].reset();
    $('.input').val("");
    $("li.paginationjs-page.J-paginationjs-page").val(1);

    // css 활성화/비활성화
    $('tr').removeClass('active');

    // 초기값 지정
    $(".acc_dt").datepicker("setDate", new Date());
}
