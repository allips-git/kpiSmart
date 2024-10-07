/*================================================================================
 * @description BOM 공통JS
 * @author 김민주, @version 1.0, @last date 2022/08/05
 ================================================================================*/

/**
 * @description select2 제품 변경 이벤트
 */
function change_sale_item(id, count='')
{
    $.ajax({
        url: '/base/select2/item_detail',
        type: 'POST',
        data: {
            'item_cd': $("#"+id+" option:selected").val()
        },
        dataType: "json",
        success: function (data) {

            $("#item_cd").val(data.result.detail.item_cd);

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end
    }); // ajax end
}

/**
 * @description select2 라우팅 변경 이벤트
 */
function change_routing(id, count='')
{
    $.ajax({
        url: '/base/routing/detail',
        type: 'POST',
        data: {
            'ikey': $("#"+id+" option:selected").val()
        },
        dataType: "json",
        success: function (data) {
            
            $("#pc_uc").val(data.result.detail[0].pc_uc);
            $("#list-container").html(""); // clear
            dynamic_add();

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end
    }); // ajax end
}

/**
 * @description select2 공정 변경 이벤트
 */
function change_proc(id, count='')
{
    $.ajax({
        url: '/base/routing/proc_detail',
        type: 'POST',
        data: {
            'ikey': $("#"+id+" option:selected").val()
        },
        dataType: "json",
        success: function (data) {

            $("#pp_uc_"+count).val(data.result.detail.pp_uc);
            $("#pp_nm_"+count).val(data.result.detail.pp_nm);

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end
    }); // ajax end
}

/**
 * @description select2 품목 변경 이벤트
 */
function change_item(id, count='')
{
    $.ajax({
        url: '/base/prod_bom/item_detail',
        type: 'POST',
        data: {
            'ikey': $("#"+id+" option:selected").val()
        },
        dataType: "json",
        success: function (data) {
            
            $("#buy_cd_"+count).val(data.result.detail.item_cd);
            $(".buy_cd_"+count).text(data.result.detail.item_cd);
            $("#buy_gb_"+count).text(data.result.detail.item_gb_nm);
            $("#unit_"+count).text(data.result.detail.size+' '+data.result.detail.unit_nm);
            $("#unit_amt_"+count).text(commas(data.result.detail.unit_amt));

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end
    }); // ajax end
}
