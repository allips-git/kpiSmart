/*================================================================================
 * @description 구매 발주 리스트 관리JS
 * @author 김민주, @version 1.1, @last date 2022/07/20
 ================================================================================*/

 $(function () {

    // 구매 발주 내역 조회
    get_buy_list($(".frm_search").serializeObject());

    // 버튼, 엔터 검색 이벤트
    $(".content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_buy_list($(".frm_search").serializeObject());
        }
    });
    $(".btn_search").off().click(function () { 
        get_buy_list($(".frm_search").serializeObject());
    });
    
    // 검색 조건 변경 이벤트
    $(".start_dt, .end_dt").change(function() {
        get_buy_list($(".frm_search").serializeObject(), "Y");
    });


 });

/**
 * @description 구매 발주 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_buy_list(obj, mode='') 
{
    const container = $('#pop_pagination');
    $.ajax({

        url: '/ord/buy_li/list',
        type: 'POST',
        data: obj,
        dataType: "json",
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
                            str += '<td class="w7">'+ list.ord_dt +'</td>';
                            str += '<td class="w11">'+ list.lot +'</td>';
                            str += '<td class="w14 tb_click" onclick=pop_close("'+arg+'")>'+ list.cust_nm + '</td>';
                            str += '<td class="Elli tb_click" onclick=pop_close("'+arg+'")>'+ list.item_nm +'</td>';
                            str += '<td class="w8" onclick=pop_close("'+arg+'")>'+ list.item_cd +'</td>';
                            str += '<td class="w8">'+ list.size +' '+ list.unit_nm +'</td>';
                            str += '<td class="T-right w8">'+ commas(list.unit_amt) +'</td>';
                            str += '<td class="T-right w6">'+ commas(list.ord_qty) +'</td>';
                            str += '<td class="T-right w6">'+ commas(list.in_qty) +'</td>';
                            str += '<td class="T-right w6">'+ commas(list.re_qty) +'</td>';
                            str += '<td class="T-right w6">'+ commas(list.ord_qty-(list.in_qty-list.re_qty)) +'</td>';
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        str += "<tr>";
                        str += "<td colspan='11'>조회 가능한 데이터가 없습니다.</td>";
                        str += "</tr>";
                    } // count end
                    
                    $(".data-container").html(str); // ajax data output

                    // tr td row css
                    $('.ac2 tr').click(function(){
                        $('.ac2 tr').removeClass('active');
                        $(this).addClass('active');
                    });

                    $('.ac2 td').click(function(){
                        $('.ac2 td').removeClass('active');
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
