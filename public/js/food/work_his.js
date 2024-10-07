/*================================================================================
 * @description FMS 작업 현황 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/12
 ================================================================================*/

 $(function () {

    // FMS 작업 현황 조회
    get_his_list($("#frm_search").serializeObject(), 'Y');

    // 버튼, 엔터 검색 이벤트
    $('#btn_search').off().click(function(){
        get_his_list($("#frm_search").serializeObject(), 'Y');
    });
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_his_list($("#frm_search").serializeObject(), 'Y');
        }
    });
    
    // 검색 조건 변경 이벤트
    $("#start_dt, #end_dt, #page_size").change(function() {
        get_his_list($("#frm_search").serializeObject(), "Y");
    });

});

/**
 * @description 작업 현황 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_his_list(obj, mode='') 
{
    const container = $('#pagination');
    $.ajax({

        url: '/st/work_his/list',
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
                    var time = '';
                    var count = data.result.list.length;
                    if (count > 0) 
                    {
                        $.each (result, function (i, list) 
                        {
                            str += '<tr>';
                            str += '<td>'+ list.rownum +'</td>';
                            str += '<td class="Elli">'+ list.pp_cd +'</td>';
                            str += '<td class="Elli">'+ list.pp_nm +'</td>';
                            str += '<td class="Elli">'+ list.pp_gb_nm +'</td>';
                            str += '<td class="Elli">'+ list.total_num +'</td>';
                            str += '<td class="Elli">'+ commas(list.total_cnt) +'</td>';
                            str += '<td>'+ commas(list.work_cnt) +'</td>';
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        str += "<tr>";
                        str += "<td colspan='7'>조회 가능한 데이터가 없습니다.</td>";
                        str += "</tr>";
                    } // count end
                    
                    $("#data-container").html(str); // ajax data output

                    // tr td row css
                    $(".ac tr").click(function(){
                        $(".ac tr").removeClass("active");
                        $(this).addClass("active");
                    });

                    $(".ac td").click(function(){
                        $(".ac td").removeClass("active");
                        $(this).addClass("active");
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