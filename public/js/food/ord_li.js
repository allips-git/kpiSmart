/*================================================================================
 * @description 온라인 주문(팝업) 리스트 관리JS
 * @author 김민주, @version 1.0, @last date
 ================================================================================*/

 $(function () {

    // 태블릿 해상도 디자인
    window_size();

    // 버튼, 엔터 검색 이벤트
    $(".content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_ord_li($(".frm_search").serializeObject());
        }
    });
    $(".btn_search").off().click(function () { 
        get_ord_li($(".frm_search").serializeObject());
    });
    
    // 검색 조건 변경 이벤트
    $(".start_dt, .end_dt").change(function() {
        get_ord_li($(".frm_search").serializeObject(), "Y");
    });


 });

/**
 * @description 온라인 주문 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_ord_li(obj, mode='') 
{
    const container = $('#ord_pagination');
    $.ajax({

        url: '/ord/ord_li/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function(data) {

            container.pagination({ 

                // pagination setting
                dataSource: data.result.list, // ajax data list
                className: 'paginationjs-theme-blue paginationjs-small', // pagination css
                pageSize: $(".page_size option:selected").val(),
                autoHidePrevious: true,
                autoHideNext: true,
                afterPaging: true,
                pageNumber: 1, // get selected page num
                callback: function (result, pagination) {

                    var page = pagination.pageNumber;
                    $(".list_cnt").text(data.result.list.length); // page num

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
                            str += '<td>'+ list.ord_dt +'</td>';
                            str += '<td class="no_tablet tablet">'+ list.lot +'</td>';
                            str += '<td>'+ list.cust_nm + '</td>';
                            str += '<td class="T-left Elli tb_click" onclick=ord_close("'+arg+'")>'+ list.item_nm +'</td>';
                            str += '<td>'+ list.size +' '+ list.unit_nm +'</td>';
                            str += '<td class="T-right">'+ commas(list.ord_amt) +'</td>';
                            str += '<td class="T-right">'+ commas(list.tax_amt) +'</td>';
                            str += '<td class="T-right">'+ commas(list.ord_qty-list.re_qty) +'</td>';
                            str += '<td class="T-right">'+ commas(list.out_qty) +'</td>';
                            str += '<td class="T-right">'+ commas((list.ord_qty-list.re_qty)-list.out_qty) +'</td>';
                            // str += '<td class="T-right w6">'+ commas(list.re_qty) +'</td>';
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        // 해상도 테이블 ROW카운터 적용(PC: 11, 태블릿: 10개)
                        var row_count = 11;
                        var width = $(window).width();
                        if(width <= 1200)
                        {
                            row_count = 10; // table row count
                        }
                        str += "<tr>";
                        str += "<td colspan="+row_count+">조회 가능한 데이터가 없습니다.</td>";
                        str += "</tr>";
                    } // count end
                    
                    $("#ord-container").html(str); // ajax data output

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
