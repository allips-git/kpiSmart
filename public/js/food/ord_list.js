/*================================================================================
 * @description 온라인 주문 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/16
 ================================================================================*/
 $(function () {

    // 온라인 주문 조회
    get_ord_list($("#frm_search").serializeObject(), "Y");

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
    $("#start_dt, #end_dt, #finyn, #page_size").change(function() {
        get_ord_list($("#frm_search").serializeObject(), "Y");
    });

    // 주문 확정 이벤트
    $('#btn_confirm').off().click(function() {

        var arr = new Array();
        var con = confirm('현 시간으로 주문이 확정됩니다. 진행하시겠습니까?');
        if (con) 
        {
            // 체크값 배열 저장
            arr = check_box();

            // 체크가 1개라도 있을경우 주문 확정 적용
            if (Array.isArray(arr) && arr.length > 0)
            {
                change_state({'ikey':arr});
            }
            else
            {
                alert('작업 선택 후 주문 확정 가능합니다.');
            }
        }

    });

 });

/**
 * @description 온라인 주문 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_ord_list(obj, mode='') 
{
    const container = $('#pagination');
    $.ajax({

        url: '/ord/ord_list/list',
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
                    var ord_cnt = 0;
                    var mall_cnt = 0;
                    var count = data.result.list.length;
                    if (count > 0) 
                    {
                        $.each (result, function (i, list) 
                        {
                            str += '<tr>';
                            if (list.state == "001") // 접수 상태일때만 체크 표기
                            {
                                str += '<td>';
                                str += '<input type="checkbox" id="'+list.ikey+'" name="ikey">';
                                str += '<label for="'+list.ikey+'"></label>';
                                str += '</td>';
                            } 
                            else
                            {
                                str += '<td></td>';
                            } 
                            str += '<td>'+ list.rownum +'</td>';
                            str += '<td class="Elli">'+ list.ord_dt +'</td>';
                            str += '<td class="Elli">'+ list.ord_no +'</td>';
                            str += '<td class="Elli">'+ list.cust_nm +'</td>';
                            if (list.mall_cnt > 1)
                            {
                                mall_cnt = Number.parseInt(list.mall_cnt)-1;
                                str += '<td class="Elli">'+ list.mall_nm +'&nbsp;외&nbsp;'+ mall_cnt +'&nbsp;개</td>';
                            }
                            else
                            {
                                str += '<td class="Elli">'+ list.mall_nm +'</td>';
                            }

                            if (list.ord_cnt > 1) // 주문수가 1개 이상일경우
                            {
                                ord_cnt = Number.parseInt(list.ord_cnt)-1;
                                str += '<td class="T-left Elli tb_click" onclick=location.href="/ord/ord_list/up?no='+list.ord_no+'">'+ list.item_nm +'&nbsp;외&nbsp;'+ ord_cnt +'&nbsp;개</td>';
                            }
                            else
                            {
                                str += '<td class="T-left Elli tb_click" onclick=location.href="/ord/ord_list/up?no='+list.ord_no+'">'+ list.item_nm +'</td>';
                            }
                            
                            str += '<td class="T-right">'+ commas(list.ord_qty) +'</td>';
                            str += '<td class="T-right Elli">'+ commas(list.ord_amt) +'&nbsp;원</td>';
                            str += '<td class="T-right Elli">'+ commas(list.tax_amt) +'&nbsp;원</td>';
                            
                            if (list.finyn == "Y") // 전표 마감 표시
                            {
                                str += '<td><span class="red">마감</span></td>';
                            }
                            else
                            {
                                str += '<td><button type="button" class="online_magam" onclick=get_key({no:'+list.ord_no+'})>등록</button></td>';
                            }
                            
                            if (list.state == "001") // 상태 표시 
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

                            str += '<td><button type="button" onclick="ord_print('+list.ord_no+');">거래명세표</button></td>';
                            str += '</tr>';
                        });
                    } 
                    else 
                    {
                        str += "<tr>";
                        str += "<td colspan='13'>조회 가능한 데이터가 없습니다.</td>";
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

/**
 * @description 주문 확정 적용
 */
function change_state(obj) 
{
    $.ajax({
        url: '/ord/ord_list/su',
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

/**
 * @description 거래명세표 출력
*/
function ord_print(ord_no)
{
    var con = confirm('거래명세표를 출력하시겠습니까?');
    if (con) 
    {
        gurae_print({'ord_no':ord_no});
    }
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