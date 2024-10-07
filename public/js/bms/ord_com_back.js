/*================================================================================
 * @description 공장 시스템 센터 주문 승인내역 관리 JS
 * @author 김민주, @version 1.0, @last date 2022/01/17
 ================================================================================*/

  $(function () {

    // 공장별 주문 승인(대기) 내역 조회
    get_ord_com_list($("#frm_search").serializeObject(), "Y"); 
    
    // 버튼, 엔터 검색 이벤트
    $("#btn_search").off().click(function () { 
        get_ord_com_list($("#frm_search").serializeObject(), "Y");
    });
    $("#content").off().keyup(function (e) {
        if(e.keyCode == 13){
            get_ord_com_list($("#frm_search").serializeObject(), "Y");
        }
    });

});

/**
 * @description 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_ord_com_list(obj, mode='') {
    
    $("#myTable").tablesorter({theme : 'blue'});
    const container = $('#pagination');
    $.ajax({

        url: '/cen/ord_com/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function(data) { 

            container.pagination({ 

                // pagination setting
                dataSource: data.result.list, // ajax data list
                className: 'paginationjs-theme-blue paginationjs-small', // pagination css
                pageSize: 200,
                autoHidePrevious: true,
                autoHideNext: true,
                afterPaging: true,
                pageNumber: $("li.paginationjs-page.J-paginationjs-page").val(), // get selected page num
                callback: function (result, pagination) { 

                    var page = pagination.pageNumber;

                    // set page parameter
                    $("#page").val(page);
                    if(mode == "Y") {
                        $("li.paginationjs-page.J-paginationjs-page").val(1); // search mode
                    }

                    // count,length
                    var str = '';
                    var count = data.result.count;
                    $("#count").html(count);

                    if(count > 0) {

                        $.each(result, function (i, list) {

                            str += '<tr onclick=location.href="/cen/ord_com/in?no='+list.ord_no+'";>';
                            str += '<td class="w8">' + list.rownum + '</td>';
                            str += '<td class="w10 tb_click">' + list.per_dt + '</td>';
                            str += '<td class="w10 tb_click">' + list.dlv_dt + '</td>';
                            str += '<td class="w10 tb_click">' + list.ord_dt + '</td>';
                            str += '<td class="w15 tb_click">' + list.ord_no + '</td>';
                            str += '<td class="T-left tb_click">' + list.cust_nm + '</td>';
                            str += '<td class="w10">' + list.ord_seq; + '</td>';
                            str += '<td class="w10 T-right">' + commas(parseFloat(list.total_amt))+ '&nbsp원' + '</td>';
                            str += '</tr>';

                        });

                    } else {

                        str += "<tr>";
                        str += "<td colspan='8'>조회 가능한 데이터가 없습니다.</td>";
                        str += "</tr>";

                    } // else end
                    
                    $("#data-container").html(str); // ajax data output

                    // tablesorter 사용을 위해 update event trigger
                    $("#myTable").trigger("update"); 

                    // table selected row css
                    if($("#p").val() == 'up'){  
                        $("#tr_"+$("#ikey").val()).addClass('active');
                    } 

                } // callback end

            }) // page end

        }, // success end
        error: function(request, status, error) {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', { sticky: true, type: 'danger' });

        }, // err end

    }); // ajax end
    
} // function end