/*================================================================================
 * @description FMS 공지사항 관리JS
 * @author 안성준, @version 1.0, @last date 2022/05/20
 ================================================================================*/

 $(function () {

    // FMS 공지사항 리스트 조회
    get_notice_list($("#frm_search").serializeObject(), "Y"); 

    // 엔터 검색 이벤트
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_notice_list($("#frm_search").serializeObject(), "Y");
        }
    });


    // 검색 조건 변경 이벤트
    $("#keyword, #category, #useyn ,#page_size").change(function() {
        get_notice_list($("#frm_search").serializeObject(), "Y");
    });


});

 // 리스트 => 가용 여부 on, off 이벤트
 $(document).on('click', '.switch', function() {

    let ikey = $(this).children('input').attr('data-use');
    let useyn = $(this).children('input').val();

    useyn_change(ikey, useyn);
});

// function get_kpi_list()
// {
//     $.ajax ({
//         url : '/kpi/Test/get_list',
//         type : 'POST',
//         dataType : 'json',
//         success: function(data){
//             console.log(data);
//             console.log(data.result.list)
//            createChart(data.result.list);
//         },

//         error(fuc) {
//             console.log(fuc)
//         }
//     })
// }


// function createChart(dataList) {
//     // 현재 날짜로부터 지난 12개월 생성 후 순서 뒤집기
//     const months = Array.from({ length: 12 }, (_, i) => {
//         const date = new Date();
//         date.setMonth(date.getMonth() - i);
//         return date.toISOString().substring(0, 7); // 'YYYY-MM' 형식
//     });

//     // 주어진 데이터를 월별로 집계
//     const aggregatedData = dataList.reduce((acc, item) => {
//         const month = item.job_dt.substring(0, 7); // 'YYYY-MM' 형식으로 변환
//         acc[month] = (acc[month] || 0) + parseInt(item.work_cnt, 10);
//         return acc;
//     }, {});

//     // 12개월 데이터에 집계 결과 통합, 값이 없는 달은 0으로 설정
//     const data = months.map(month => aggregatedData[month] || 0);

//     // 차트 생성
//     const ctx = document.getElementById('myChart').getContext('2d');
//     const myChart = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: months,
//             datasets: [{
//                 label: '월별 완료 수량',
//                 data: data,
//                 backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             maintainAspectRatio: false,
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }


/**
 * @description 공지사항 관리 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
 */
 function get_notice_list(obj, mode='') 
 {
    const container = $('#pagination');
    $.ajax({

        url: '/cs/notice/list',
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
                        $("li.paginationjs-page.J-paginationjs-page").val(1);
                    }

                    // count,length
                    var str = '';
                    var count = data.result.list.length;
                    if (count > 0) 
                    {
                        $.each (result, function (i, list) 
                        {
                            str += '<tr id="tr_'+ list.ikey +'">';
                            str += '<td class="w6">'+ list.rownum +'</td>';
                            str += '<td class="w6">'+ list.category +'</td>';
                            str += '<td class="Elli tb_click" onclick=move_detail_page({ikey:"'+list.ikey+'"})>'+ list.title +'</td>';
                            str += '<td class="w11 Elli">'+ list.reg_nm +'</td>';
                            str += '<td class="w11 Elli">'+ list.reg_dt +'</td>';
                            str += '<td class="w11 Elli">'+ is_empty(list.mod_nm) +'</td>';
                            str += '<td class="w11 Elli">'+ is_empty(list.mod_dt) +'</td>';
                            str += '<td class="w7">';
                            str += '<label class="switch" id="switch" data-useyn="" style="cursor: pointer;">';
                            if (list.useyn == "Y")
                            {
                                str += '<input type="checkbox" id="chk_'+list.ikey+'" data-use="'+list.ikey+'" name="list_useyn" value="'+list.useyn+'" checked disabled>';
                            }
                            else
                            {
                                str += '<input type="checkbox" id="chk_'+list.ikey+'" data-use="'+list.ikey+'" name="list_useyn" value="'+list.useyn+'" disabled>';
                            }
                            str += '<span class="slider round"></span>';
                            str += '</label>';
                            str += '</td>';
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        str += "<tr>";
                        str += "<td colspan='8'>조회 가능한 데이터가 없습니다.</td>";
                        str += "</tr>";
                    } // count end
                    
                    $("#data-container").html(str); // ajax data output

                    // table selected row css
                    if ($("#p").val() == 'up')
                    {  
                        $("#tr_"+$("#ikey").val()).addClass('active');
                    }

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
 * @description 공지사항 상세페이지 이동
 */
function move_detail_page(obj)
{
    location.href='/cs/notice/detail?ikey='+obj.ikey;
}

/**
 * @description 가용여부 on, off 변경 이벤트
 * @return switch change, comment
 */
 function useyn_change(ikey, useyn) 
 {
    var state = (useyn == "Y") ? "N" : "Y"; // 가용 상태값 반전 처리
    $.ajax({

        url: '/cs/notice/useyn',
        type: 'POST',
        data: {
            'ikey': ikey,
            'useyn': useyn
        },
        dataType: "json",
        success: function (data) {

            // success, fail 
            var chk_yn = (state == "Y") ? true : false;
            if (data.code == '100') 
            {
                toast('변경이 완료되었습니다.', false, 'info');
                $('#chk_'+ikey+'').prop('checked', chk_yn); // list switch
                $('#chk_'+ikey+'').val(state);
                $(":radio[name='list_useyn'][value='"+state+"']").prop('checked', true); // frm radio
            } 
            else if (data.code == '999') 
            {
                toast('변경실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
            }

        }

    });
}

