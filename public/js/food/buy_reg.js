/*================================================================================
 * @description 구매 발주 등록 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/04
 ================================================================================*/

 $(function () {

    // 제품 추가 이벤트
    $("#btn_add").off().click(function () { 
        item_add();
    });

    // 발주 등록 이벤트
    $(".btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            buy_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 목록 클릭 이벤트
    $(".btn_list").off().click(function () { 
        var con = confirm('아직 데이터 등록 전입니다. 목록으로 되돌아가시겠습니까?');
        if (con) 
        {
            window.location.href='/ord/ord_buy';
        }
    });

    // 품목 검색 - select2 lib 사용
    // 최초 로드시에는 tr순번 1에서 사용됨
    dynamic_item(1);

 });

/**
 * @description 제품 동적 UI추가
 */
let cnt = 1;
let list_count = 1;
function item_add() 
{
    cnt += 1;
    list_count += 1;
    
    var str = '';
    str += '<tr id="tr_'+cnt+'">';
    str += '<input type="hidden" class="item_cd_'+cnt+'" name="item_cd" value="" required>';
    str += '<input type="hidden" class="item_nm_'+cnt+'" name="item_nm" value="" required>';
    str += '<input type="hidden" class="size_'+cnt+'" name="size" value="" required>';
    str += '<input type="hidden" class="unit_'+cnt+'" name="unit" value="" required>';
    str += '<input type="hidden" class="unit_amt_'+cnt+'" name="unit_amt" value="" required>';
    str += '<td><select id="item_list_'+cnt+'" onchange="change_item('+cnt+')"></select></td>';
    str += '<td id="item_cd_'+cnt+'" class="w8"></td>';
    str += '<td id="unit_'+cnt+'" class="w8"></td>';
    str += '<td id="unit_amt_'+cnt+'" class="T-right w8"></td>';
    str += '<td class="w7 spindd">';
    str += '<div class="spin">';
    str += '<span class="spinner">';
    str += '<span class="sub" onclick="num_minus('+cnt+');">-</span>';
    str += '<input type="number" id="qty_'+cnt+'" name="ord_qty" value="1" oninput="calculation('+cnt+');" Auto />';
    str += '<span class="add" onclick="num_plus('+cnt+');">+</span>';
    str += '</span></div></td>';
    str += '<td class="w8"><input type="text" id="ord_amt_'+cnt+'" class="T-right amt gray" name="ord_amt" value="0" readonly></td>';
    str += '<td class="w8"><input type="text" id="tax_amt_'+cnt+'" class="T-right tax gray" name="tax_amt" value="0" readonly></td>';
    str += '<td><input type="text" id="memo_'+cnt+'" class="w100 T-left" name="ord_memo" Auto></td>';
    str += '<td class="w5"><button type="button" class="del" onclick=item_del({class:"'+cnt+'"});>삭제</button></td>';
    str += '</tr>';
    $("#list-container").append(str);
    fc_reg_exp(); // 입력값 검증

    // 품목 검색 - select2 lib 사용 
    // 동적 로드시에는 동적 순번으로 사용됨
    dynamic_item(cnt);

    // 총 품목수 추가
    $("#list_count").text(list_count);

}

/**
 * @description 제품 동적 UI삭제
 */
function item_del(obj) 
{
    var con = confirm('삭제 하시겠습니까?');
    if (con) 
    {
        $("#tr_"+obj.class).remove();

        // 발주 합계액 갱신
        total_amount();

        // 총 품목수 갱신
        list_count -=1;
        $("#list_count").text(list_count);
    }
}

/**
 * @description 구매 발주 등록
 * @return result code, comment
 */
function buy_register(obj) 
{
    $.ajax({

        url: '/ord/ord_buy/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('등록이 완료되었습니다.', false, 'info');
                window.location.href='/ord/ord_buy';
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        },
        error: function(request, status, error) {
            console.log(request);
            console.log(error);
        }

    });
}