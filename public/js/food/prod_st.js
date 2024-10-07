/*================================================================================
 * @description 완제품 재고 관리JS
 * @author 김민주, @version 1.0, @last date
 * @author 김민주, @version 1.1, @last date 2022/07/21 - 재고DB 리뉴얼
 ================================================================================*/

 $(function () {

    // 완제품 재고 조회
    get_prod_st_list($("#frm_search").serializeObject(), 'Y');

    // 엔터 검색 이벤트
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_prod_st_list($("#frm_search").serializeObject(), 'Y');
        }
    });
    
    // 검색 조건 변경 이벤트
    $("#wh_uc, #item_gb, #safe_gb, #page_size").change(function() {
        get_prod_st_list($("#frm_search").serializeObject(), "Y");
    });

});

/**
 * @description 완제품 재고 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_prod_st_list(obj, mode='') 
{
    const container = $('#pagination');
    $.ajax({

        url: '/stock/prod_st/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function(data) {
            console.log(data)
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
                            var safe_qty = Number.parseFloat(list.safe_qty);
                            var qty = Number.parseFloat(list.qty);
                            if (safe_qty > qty) // 안전재고 미달 재고품목
                            {
                                str += '<tr class="red_bg">';
                            }
                            else
                            {
                                str += '<tr>';
                            }
                            str += '<td>'+ list.rownum +'</td>';
                            str += '<td class="Elli">'+ list.item_cd +'</td>';
                            str += '<td class="Elli">'+ list.item_gb_nm +'</td>';
                            str += '<td class="T-left Elli">'+ list.item_nm +'</td>';
                            str += '<td class="Elli">'+ list.size +'&nbsp;'+list.unit_nm +'</td>';
                            str += '<td class="Elli">'+ list.wh_nm +'</td>';
                            // str += '<td class="Elli">'+ list.max_dt +'</td>';
                            str += '<td class="T-right">'+ commas(Math.round(list.total_amt)) +'</td>';
                            str += '<td class="T-right">'+ commas(list.safe_qty) +'</td>';
                            str += '<td class="T-right">'+ commas(list.base_qty) +'</td>';
                            str += '<td class="T-right">'+ commas(list.pr_in_qty) +'</td>';
                            str += '<td class="T-right">'+ commas(list.out_qty) +'</td>';
                            str += '<td class="T-right">'+ commas(list.re_in_qty) +'</td>';
                            str += '<td class="T-right">'+ commas(list.flaw_qty) +'</td>';
                            str += '<td class="T-right">'+ commas(list.qty) +'</td>';
                            str += '<td class="T-right">'+ commas(list.total_qty) +'</td>';
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        str += "<tr>";
                        str += "<td colspan='16'>조회 가능한 데이터가 없습니다.</td>";
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