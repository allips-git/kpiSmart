/*================================================================================
 * @description 제품 관리 팝업창(공통)
 * @author 김민주, @version 2.0, @last date 2021/11/22
 ================================================================================*/
 $(function () {

    $("#search_btn_pop").off().click(function () { // 검색 버튼 모드
        get_item_list($("#frm_item").serializeObject()); // form 데이터. 검색
    });

    $("#content_pop").off().keyup(function (e) { // 검색 엔터 모드
        if(e.keyCode == 13){
            get_item_list($("#frm_item").serializeObject()); // form 데이터. 검색
        }
    });

 });

/**
 * @description 제품 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html, 예제: https://junho85.pe.kr/1440
*/
function get_item_list(obj) {

    const container = $('#item_pagination');
    $.ajax({

        url: '/base/item_li/list',
        type: 'POST',
        data: {
            s: obj.s,
            keyword: obj.keyword_pop,
            content: obj.content_pop
        },
        dataType: "json",

        success: function(data) { 

            container.pagination({ 

                // pagination setting
                dataSource: data.result.list, // ajax data list
                className: 'paginationjs-theme-gray paginationjs-small', // pagination css
                pageSize: 12,
                autoHidePrevious: true,
                autoHideNext: true,

                callback: function (result, pagination) { 

                    // count,length
                    var str = '';
                    var count = data.result.count;
                    $("#item_count").html(count);

                    if(count > 0) {

                        $.each(result, function (i, list) {
                            var arg = encodeURIComponent(JSON.stringify(list));
                            str += '<tr>';
                            str += '<td class="w8">' + list.proc_gb + '</td>';
                            str += '<td class="w8">' + list.pd_nm + '</td>';
                            str += '<td class="T-left">' + list.item_nm + '(' + list.item_cd + ')</td>';
                            str += '<td class="w13">' + list.i4_name + '</td>';
                            str += '<td class="w8">' + parseFloat(list.size) + '('+list.code_nm+')</td>';
                            str += '<td class="T-right w9">' + list.sale_amt + '원</td>';
                            str += '<td class="w10"><button type="button" onclick=item_close("'+arg+'")>선택</button></td>';
                            str += '</tr>';
                        });

                    } else {

                        str += "<tr>";
                        str += "<td colspan='7'>조회 가능한 데이터가 없습니다.</td>";
                        str += "</tr>";

                    }
                    
                    $("#item-container").html(str); // ajax data output

                } // callback end

            }) // page end

        } // ajax end

    });
}


/**
 * 밑에 2개의 줄은 필수이며 나머지는 커스터마이징이 필요
 *
 function item_close(arg) {
    arg = JSON.parse(decodeURIComponent(arg));  // 필수
    $('.item_li_pop').bPopup().close();         //필수
    //console.log('arg:'+JSON.stringify(arg));  // arg object content 출력
}
 */
