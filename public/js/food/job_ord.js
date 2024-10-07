/*================================================================================
 * @description 제조 오더 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/19
 ================================================================================*/

 $(function () {

    // 제조 오더 조회
    get_ord_list($("#frm_search").serializeObject(), 'Y');

    // 버튼, 엔터 검색 이벤트
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_ord_list($("#frm_search").serializeObject(), "Y");
        }
    });
    $("#btn_search").off().click(function () { 
        get_ord_list($("#frm_search").serializeObject(), "Y");
    });

    // 검색 조건 변경 이벤트
    $("#start_dt, #end_dt, #finyn, #state").change(function() {
        get_ord_list($("#frm_search").serializeObject(), "Y");
    });

    // 제조 오더 확정 이벤트
    $('#btn_confirm').off().click(function() {

        var arr = new Array();
        var con = confirm('현 시간으로 제조 오더가 확정됩니다. 진행하시겠습니까?');
        if (con) 
        {
            // 체크값 배열 저장
            arr = check_box();

            // 체크가 1개라도 있을경우 제조 오더 확정 적용
            if (Array.isArray(arr) && arr.length > 0)
            {
                change_state({'ikey':arr});
            }
            else
            {
                alert('작업 선택 후 제조 오더 확정 가능합니다.');
            }
        }

    });


 });

/**
 * @description 제조 오더 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_ord_list(obj, mode='') 
{
    const container = $('#pagination');
    $.ajax({

        url: '/pr/job_ord/list',
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
                    $("#page_count").text(data.result.list.length); // page num

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
                            $(".pay_ikey").val(list.ikey);
                            str += '<tr>';
                           
                                str += '<td class="w4">';
                                str += '<input type="checkbox" id="'+list.ikey+'" name="ikey">';
                                str += '<label for="'+list.ikey+'"></label>';
                                str += '</td>';
                          
                           
                            str += '<td>'+ list.rownum +'</td>';
                            str += '<td>'+ list.ikey +'</td>';
                            str += '<td class="Elli">'+ list.job_no +'</td>';
                            str += '<td class="Elli">'+ list.item_cd +'</td>';
                            str += '<td class="Elli tb_click T-left" onclick=location.href="/pr/job_ord/up?no='+list.job_no+'">'+ list.item_nm +'</td>';
                            str += '<td class="Elli">'+ list.code_nm +'</td>';
                            str += '<td class="Elli">'+ list.size +' '+ list.unit_nm + '</td>';
                            str += '<td class="Elli">'+ list.job_dt +'</td>';
                            str += '<td class="T-right">'+ commas(list.job_qty) +'</td>';
                            str += '<td class="Elli">'+ list.wp_nm +'</td>';

                            if (parseInt(list.work_cnt) >= parseInt(list.job_qty)) {
                                list.state = "004";
                            }

                            // 상태 표시
                            if (list.state == "001") 
                            {
                                str += '<td><span style="font-weight: bold;">접수</span></td>';
                            }
                            else if (list.state == "002")
                            {
                                str += '<td><span style="color: blue; font-weight: bold;">대기</span></td>';
                            }
                            else if (list.state == "003")
                            {
                                str += '<td><span style="color: #FF5E00; font-weight: bold;">진행</span></td>';
                            }
                            else if (list.state == "004")
                            {
                                str += '<td><span style="color: gray;">완료</span></td>';
                            }
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
                    $("#list_cnt").text(count);     // list count

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
 * @description 제조 오더 확정 적용
 */
function change_state(obj) 
{
    $.ajax({
        url: '/pr/job_ord/su',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('등록이 완료되었습니다.', false, 'info');           // success comment 
                get_ord_list($("#frm_search").serializeObject(), 'Y');
                $("input[name=chk_all]").prop("checked", false);
            }
            else if (data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if
            
        } // end success
        
    });

}


$('#btn_barcode').click(function() {
    var con = confirm('바코드를 출력 하시겠습니까?');
    if (con) {
        var selectedData = [];

        $('input[type="checkbox"][name="ikey"]:checked').each(function() {
            var row = $(this).closest('tr');
            var rowData = {
                id: row.find('td:nth-child(3)').text(),
                orderNo: row.find('td:nth-child(4)').text(),
                itemCd: row.find('td:nth-child(5)').text(),
                // 필요한 다른 데이터를 이곳에서 추출
            };

            selectedData.push(rowData);
        });

        console.log(selectedData);

        if (selectedData.length > 0) {
            barcode_print({'ikey': selectedData});
        } else {
            alert('작업 선택 후 바코드 출력 가능합니다.');
        }
    }
});

$('#btn_barcodes').click(function() {
    var selectedData = [];

    // 선택된 데이터 수집
    $('input[type="checkbox"][name="ikey"]:checked').each(function() {
        var row = $(this).closest('tr');
        var rowData = {
            id     : row.find('td:nth-child(3)').text(),
            orderNo: row.find('td:nth-child(4)').text(),
            itemCd : row.find('td:nth-child(5)').text(),
            date   : row.find('td:nth-child(9)').text(), 
        };

        selectedData.push(rowData);
    });

    // 선택된 데이터가 있을 경우
    if (selectedData.length > 0) {
        $.ajax({
            url: '/pr/job_ord/item_list',
            data: { itemCd: selectedData[0]['itemCd'] }, 
            datatype: 'json',
            type: 'POST',
            success: function(res) {
                console.log(res)
                var data = JSON.parse(res); // JSON 문자열을 객체로 변환
                let item_nm = data.item_nm;
                let size = data.size;
                let item_cd = data.item_cd;

                var queryString = encodeURIComponent(JSON.stringify(selectedData));
                var popupURL = '/pr/job_ord/pop?data=' + queryString + '&item_nm=' + item_nm + '&size=' + size + '&item_cd=' + item_cd; 
    

                console.log(popupURL)

                // 팝업 창 열기
                var printWindow = window.open(popupURL, 'barcodePrintWindow', 'width=800,height=600');
                printWindow.onload = function() {
                    printWindow.focus();
                    printWindow.print();
                };
            },
            error: function(res1) {
                console.log(res1);
            }
        });
    } else {
        alert('작업 선택 후 바코드 출력 가능합니다.');
    }
});



function barcode_print(data) {
    console.log('전송 데이터:', JSON.stringify(data));
    $.ajax({
        url: '/pr/job_ord/item_list',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function(response) {
            var popup = window.open('', '_blank', 'width=800,height=600');
            popup.document.write(response);
            popup.document.close();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('QR 코드 생성 실패:', textStatus, errorThrown, jqXHR);
        }
    });
}

function generateQRCodeURL(data) {
    // 여기서 QR 코드 생성 로직을 구현합니다.
    // 예: Google Charts API 또는 qrcode.js 라이브러리 사용
    var baseURL = 'https://chart.googleapis.com/chart?cht=qr&chl=';
    var qrSize = '&chs=150x150&chld=L|0';
    return baseURL + data + qrSize;
}

/**
 * @description 체크박스 체크 이벤트
 */
function check_box() 
{
    // 체크값 배열 저장
    var arr = new Array();
    $("input[name=ikey]:checked").each(function() {
        if($(this).val() && $(this).val() != '') 
        {
            arr.push($(this).attr('id'));
        }
    });
    return arr;
}