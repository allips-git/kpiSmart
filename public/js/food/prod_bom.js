/*================================================================================
 * @description FMS 제조BOM 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/05
 ================================================================================*/

 $(function () {

    // BOM 조회
    get_bom_list($("#frm_search").serializeObject(), 'Y');

    // 엔터 검색 이벤트
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_bom_list($("#frm_search").serializeObject(), 'Y');
            $("#sub-container").html("<tr><td colspan='11'>제품 목록 선택 후 조회 가능합니다.</td></tr>");
        }
    });
    
    // 검색 조건 변경 이벤트
    $("#useyn, #page_size").change(function() {
        get_bom_list($("#frm_search").serializeObject(), "Y");
        $("#sub-container").html("<tr><td colspan='11'>제품 목록 선택 후 조회 가능합니다.</td></tr>");
    });

});

 // 리스트 => 가용 여부 on, off 이벤트
 $(document).on('click', '.switch', function() {
    let ikey = $(this).children('input').attr('data-use');
    let useyn = $(this).children('input').val();
    let gb = $(this).children('input').attr('data-gb');
    useyn_change(gb, ikey, useyn);
});

/**
 * @description BOM 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_bom_list(obj, mode='') 
{
    $.ajax({
        url: '/base/prod_bom/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function(data) {

            // count,length
            var str = '';
            var count = data.result.list.length;
            if (count > 0) 
            {
                $.each (data.result.list, function (i, list) 
                {
                    str += '<tr>';
                    str += '<td class="w4">'+ list.rownum +'</td>';
                    str += '<td class="w7">'+ list.item_cd +'</td>';
                    str += '<td class="w7">'+ list.item_gb_nm +'</td>';
                    str += '<td class="Elli tb_click" onclick=get_bom_detail({item_cd:"'+list.item_cd+'"})>'+ list.item_nm + '</td>';
                    str += '<td class="w10">'+ list.size +' '+ list.unit_nm +'</td>';
                    str += '<td class="w6">'+ list.pc_cnt +'</td>';
                    str += '<td class="w6">'+ list.bom_cnt +'</td>';
                    str += '<td class="T-left Elli">'+ list.memo +'</td>';
                    str += '<td class="w6">';
                    str += '<label class="switch" style="cursor: pointer;">';
                    if (list.useyn == "Y")
                    {
                        str += '<input type="checkbox" id="chk_'+list.ikey+'A" data-use="'+list.ikey+'A" data-gb="A" name="list_useyn" value="'+list.useyn+'" checked disabled>';
                    }
                    else
                    {
                        str += '<input type="checkbox" id="chk_'+list.ikey+'A" data-use="'+list.ikey+'A" data-gb="A" name="list_useyn" value="'+list.useyn+'" disabled>';
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
                str += "<td colspan='9'>조회 가능한 데이터가 없습니다.</td>";
                str += "</tr>";
            } // count end
                    
            $("#data-container").html(str); // ajax data output
            $("#list_cnt").text(count);     // list num

            // tr td row css
            $('.ac tr').click(function(){
                $('.ac tr').removeClass('active');
                $(this).addClass('active');
            });

            $('.ac td').click(function(){
                $('.ac td').removeClass('active');
                $(this).addClass('active');
            });

        }, // success end
        error: function(request, status, error) {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', { sticky: true, type: 'danger' });

        }, // err end

    }); // ajax end

} // function end

/**
 * @description BOM 상세조회
 */
 function get_bom_detail(obj) 
 {
    $.ajax({
        url: '/base/prod_bom/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // count,length
            var amt = 0;
            var str = '';
            var count = data.result.detail.length;
            if (count > 0) 
            {
                if(data.result.detail[0].sysyn == "N")
                {
                    $("#div_mod").css("display", "block");
                }
                else
                {
                    $("#div_mod").css("display", "none");
                }
                
                $.each (data.result.detail, function (i, list) 
                {
                    amt = comma_replace(list.unit_amt);
                    str += '<tr>';
                    str += '<td class="w4">'+ list.rownum +'</td>';
                    str += '<td class="w4">'+ list.pr_seq +'</td>';
                    str += '<td class="w15 Elli">'+ list.pp_nm + '</td>';
                    str += '<td class="w10 Elli">'+ list.sub_item_cd +'</td>';
                    str += '<td class=" Elli">'+ list.sub_item_nm + '</td>';
                    str += '<td class="w8 Elli">'+ list.item_gb_nm +'</td>';
                    str += '<td class="w8 Elli">'+ list.size +' '+ list.unit_nm +'</td>';
                    str += '<td class="T-right w7">'+ list.usage +'</td>';
                    str += '<td class="T-right w7">'+ commas(list.unit_amt) +'</td>';
                    str += '<td class="T-right w7">'+ commas(amt*list.usage) +'</td>';
                    str += '<td class="w6">';
                    str += '<label class="switch" style="cursor: pointer;">';
                    if (list.useyn == "Y")
                    {
                        str += '<input type="checkbox" id="chk_'+list.sub_ikey+'B" data-use="'+list.sub_ikey+'B" data-gb="B" name="list_useyn" value="'+list.useyn+'" checked disabled>';
                    }
                    else
                    {
                        str += '<input type="checkbox" id="chk_'+list.sub_ikey+'B" data-use="'+list.sub_ikey+'B" data-gb="B" name="list_useyn" value="'+list.useyn+'" disabled>';
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
                str += "<td colspan='10'>조회 가능한 데이터가 없습니다.</td>";
                str += "</tr>";
            } // count end
                    
            $("#sub-container").html(str); // ajax data output
            $(".ikey").val(data.result.detail[0].ikey);
            $(".item_cd").val(data.result.var.item_cd);
            $(".pc_uc").val(data.result.detail[0].pc_uc);

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end

/**
 * @description 가용여부 on, off 변경 이벤트
 * @return switch change, comment
 */
 function useyn_change(gb, ikey, useyn) 
 {
    var state = (useyn == "Y") ? "N" : "Y"; // 가용 상태값 반전 처리
    $.ajax({
        url: '/base/prod_bom/useyn',
        type: 'POST',
        data: {
            'gb': gb,
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
