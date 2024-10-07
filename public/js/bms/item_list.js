/*================================================================================
 * @description BMS 통합제품 관리JS
 * @author 김민주, @version 2.0, @last date 2022/04/22
 ================================================================================*/

 $(function () {

    // BMS 통합제품 조회
    get_item_list($("#frm_search").serializeObject(), "Y"); 

    // 버튼, 엔터 검색 이벤트
    $("#btn_search").off().click(function () { 
        get_item_list($("#frm_search").serializeObject(), "Y");
    });
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_item_list($("#frm_search").serializeObject(), "Y");
        }
    });

    // 검색 조건 변경 이벤트
    $("#item_lv, #page_size, #proc_gb, #trade_gb, #useyn").change(function() {
        get_item_list($("#frm_search").serializeObject(), "Y");
    });

});

/**
 * @description 통합 제품 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_item_list(obj, mode='') 
{
    
    const container = $('#pagination');
    $.ajax({

        url: '/base/item_list/list',
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

                    // set page parameter
                    $("#page").val(page);
                    if (mode == "Y") 
                    {
                        $("li.paginationjs-page.J-paginationjs-page").val(1); // search mode
                    }

                    // count,length
                    var str = '';
                    var count = data.result.count;
                    if (count > 0) 
                    {
                        $.each (result, function (i, list) 
                        {
                            str += '<tr onclick=get_item_detail({cd:"'+list.item_cd+'"})>';
                            str += '<td class="w5 Roboto">'+ list.rownum +'</td>';
                            str += '<td>'+ list.work_nm +'</td>';
                            str += '<td>'+ list.trade_gb +'</td>';
                            str += '<td>(미정)</td>';
                            str += '<td>'+ list.proc_gb + '</td>';
                            str += '<td class="blue">'+ list.item_nm + '</td>';
                            str += '<td class="blue">'+ list.sub_cnt + '종</td>';
                            str += '<td>'+ Number(list.size)+list.unit_nm +'</td>';
                            str += '<td>' + list.reg_nm + '</td>';
                            str += '<td class="Roboto">' + list.reg_dt +'</td>';
                            str += '<td>' + is_empty(list.mod_nm) + '</td>';
                            str += '<td class="Roboto">' + is_empty(list.mod_dt) +'</td>';
                            str += '<td class="w7" onclick="event.stopPropagation()">';
                            str += '<label class="switch" id="switch" data-useyn="" style="cursor: pointer;" onclick=useyn_change("'+ list.ikey +'")>';
                            if (list.useyn == "Y")
                            {
                                str += '<input type="checkbox" id="chk_'+list.ikey+'" name="list_useyn" value="'+list.useyn+'" checked disabled>';
                            }
                            else
                            {
                                str += '<input type="checkbox" id="chk_'+list.ikey+'" name="list_useyn" value="'+list.useyn+'" disabled>';
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
                        str += "<td colspan='12'>조회 가능한 데이터가 없습니다.</td>";
                        str += "</tr>";
                    } // count end
                    
                    $("#data-container").html(str); // ajax data output

                    // table selected row css
                    if ($("#p").val() == 'up')
                    {  
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

/**
 * @description 가용여부 on, off 변경 이벤트
 * @return switch change, comment
 * @author 황호진  @version 1.1, @last update 2022/05/09
 * 			tr태그기반으로 제품등록,수정팝업이 열리도록 수정함에 따라 주문가능여부 이벤트 변경작업
 */
function useyn_change(ikey)
{
    $.ajax({

        url: '/base/item_list/useyn',
        type: 'POST',
        data: {
            'ikey': ikey
        },
        dataType: "json",
        success: function (data) {

            // success, fail
            if (data.code == '100') 
            {
                toast('변경이 완료되었습니다.', false, 'info');
                if($('#chk_'+ikey+'').is(':checked') === true){
					$('#chk_'+ikey+'').prop('checked', false).val('N');
				}else{
					$('#chk_'+ikey+'').prop('checked', true).val('Y');
				}
            } 
            else if (data.code == '999') 
            {
                toast('변경실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
            }

        }

    });

}
