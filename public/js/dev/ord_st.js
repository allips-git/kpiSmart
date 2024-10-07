/*================================================================================
 * @description 공장, 센터PC 주문 통계 관리 JS(통합)
 * @author 김민주, @version 1.0, @last date 2022/01/05
 ================================================================================*/

  $(function () {

    // 올해, 이번달 기본 값 세팅
    var year = $("#year").val(get_today("year"));
    var month = $("#month").val(get_today("month"));

    get_ord_st_list($("#frm_search").serializeObject(), "Y");

    // 버튼, 엔터 검색 이벤트
    $("#btn_search").off().click(function () { 
        get_ord_st_list($("#frm_search").serializeObject(), "Y");
    });

});

/**
 * @description 주문 통계 리스트
 * @param 검색모드, 공장코드 or 센터코드, 검색 키워드, 검색 년도, 검색 월
 * @return 일별 주문 통계(주문 건수, 금액, 세액, 총 금액)
 */
 function get_ord_st_list(obj, mode='') {
    
    var site_url = $("#site_url").val();
    $.ajax({

        url: site_url+'/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function(data) { 

            // 합계 TEXT 값
            var field = { 
                  "sum_cnt": data.result.list[0].sum_cnt
                , "sum_amt": commas(parseFloat(data.result.list[0].sum_amt))
                , "sum_tax_amt": commas(parseFloat(data.result.list[0].sum_tax_amt))
                , "total_sum_amt": commas(parseFloat(data.result.list[0].total_sum_amt))
                , "today_cnt": data.result.list[0].today_cnt
                , "today_amt": commas(parseFloat(data.result.list[0].today_amt))
                , "month_cnt": data.result.list[0].month_cnt
                , "month_amt": commas(parseFloat(data.result.list[0].month_amt))
            }; 
            process(field, "ctext");

            // count,length
            var str = '';
            $.each(data.result.list, function (i, list) {

                str += '<tr>';
                str += '<td>'+list.dt+'</td>';
                str += '<td>'+list.ord_cnt+' 건'+'</td>';
                str += '<td class="T-right">'+commas(parseFloat(list.ord_amt))+' 원'+'</td>';
                str += '<td class="T-right">'+commas(parseFloat(list.tax_amt))+' 원'+'</td>';
                str += '<td class="T-right" style="padding-right:25px">'+commas(parseFloat(list.total_amt))+' 원'+'</td>';
                str += '</tr>';

            });

            $("#data-container").html(str); // ajax data output

        }, // success end
        error: function(request, status, error) {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', { sticky: true, type: 'danger' });

        }, // err end

    }); // ajax end
    
} // function end
