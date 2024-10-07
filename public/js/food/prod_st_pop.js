/*================================================================================
 * @description 제품 재고 리스트 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/30
 ================================================================================*/

/**
 * @description 제품 재고 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_stock_list(obj, mode='') 
{
    const container = $('#stock_pagination');
    $.ajax({
        url: '/stock/prod_st/stock_list',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function(data) {

            container.pagination({ 

                // pagination setting
                dataSource: data.result.list, // ajax data list
                className: 'paginationjs-theme-blue paginationjs-small', // pagination css
                pageSize: $(".stock_page_size option:selected").val(),
                autoHidePrevious: true,
                autoHideNext: true,
                afterPaging: true,
                pageNumber: 1, // get selected page num
                callback: function (result, pagination) {

                    var page = pagination.pageNumber;
                    $(".stock_cnt").text(data.result.list.length); // page num

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
                            str += '<td>'+ list.item_cd + '</td>';
                            str += '<td>'+ list.barcode +'</td>';
                            str += '<td class="T-left Elli tb_click" onclick=stock_close("'+arg+'")>'+ list.item_nm +'</td>';
                            str += '<td>'+ list.size +' '+ list.unit_nm +'</td>';
                            str += '<td>'+ list.wh_nm +'</td>';
                            str += '<td>'+ list.max_dt +'</td>';
                            str += '<td class="T-right">'+ commas(Math.round(list.total_amt)) +'</td>';
                            str += '<td class="T-right">'+ commas(list.safe_qty) +'</td>';
                            str += '<td class="T-right">'+ commas(list.qty) +'</td>';
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        str += "<tr>";
                        str += "<td colspan='10'>출고 가능한 재고품이 없습니다. 확인 후 다시 이용 바랍니다.</td>";
                        str += "</tr>";
                    } // count end
                    
                    $("#stock-container").html(str); // ajax data output

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

/*
 각 화면의 VIEW페이지 또는 JS에서 아래 함수를 구현하여 각 SELECT BOX, INPUT태그에 사용할 것
function pop_close(arg)
{
    // 사용 예제
    arg = JSON.parse(decodeURIComponent(arg));
    $("#item_cd").val(arg.item_cd);
    $("#cust_cd").val(arg.cust_cd);
    $('.buy_li_pop').bPopup().close();
    console.log('arg:'+JSON.stringify(arg));  // arg object content 출력 예제
}
*/
