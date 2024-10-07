/*================================================================================
 * @description 온라인 주문 등록 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/17
 ================================================================================*/

 $(function () {

    // 제품 추가 이벤트
    $("#btn_add").off().click(function () { 
        item_add();
    });

    // 주문 등록 이벤트
    $("#btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            ord_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 목록 클릭 이벤트
    $("#btn_list").off().click(function () { 
        var con = confirm('아직 데이터 등록 전입니다. 목록으로 되돌아가시겠습니까?');
        if (con) 
        {
            window.location.href='/ord/ord_list';
        }
    });

    // 거래처 검색 - select2 lib 사용
    call_select2('#biz_list', '/base/select2/biz_list', 0, '거래처명을', '매출거래처_선택');

    // 제품 검색 - select2 lib 사용   
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
    str += '<tr class="tr_'+cnt+'">';
    str += '<input type="hidden" class="item_cd_'+cnt+'" name="item_cd" value="" required>';
    str += '<input type="hidden" class="item_nm_'+cnt+'" name="item_nm" value="" required>';
    str += '<input type="hidden" class="unit_'+cnt+'" name="unit" value="" required>';
    str += '<input type="hidden" class="size_'+cnt+'" name="size" value="" required>';
    str += '<input type="hidden" class="sale_amt_'+cnt+'" name="sale_amt" value="0" required>';
    str += '<td class="w3"></td>';
    str += '<td class="w12"></td>'
    str += '<td colspan="3" class="w26"><select id="item_list_'+cnt+'" onchange="change_item('+cnt+')"></select></td>';
    str += '<td id="item_cd_'+cnt+'" class="w11"></td>';
    str += '<td id="unit_'+cnt+'" class="w11"></td>';
    str += '<td id="sale_amt_'+cnt+'" class="T-right w8"></td>';
    str += '<td class="w8 spindd">';
    str += '<div class="spin">';
    str += '<span class="spinner">';
    str += '<span class="sub" onclick="num_minus('+cnt+');">-</span>';
    str += '<input type="number" id="qty_'+cnt+'" name="ord_qty" value="1" oninput="calculation('+cnt+');" Auto />';
    str += '<span class="add" onclick="num_plus('+cnt+');">+</span>';
    str += '</span></div></td>';
    str += '<td class="w8"><input type="text" id="ord_amt_'+cnt+'" class="T-right amt gray" name="ord_amt" value="0" Auto readOnly></td>';
    str += '<td class="w8"><input type="text" id="tax_amt_'+cnt+'" class="T-right tax gray" name="tax_amt" value="0" Auto readOnly></td>';
    str += '<td class="number_td bottom_td" style="background-color:#fff !important;"></td>';
    str += '<td class="abtd">'+cnt+'</td>';
    str += '<td class="abtd2"><input type="text" id="mall_nm_'+cnt+'" class="T-left" name="mall_nm" value="쇼핑몰명 입력" Auto></td>';
    str += '<td class="w9 bottom_td" style="margin-left:15.03%"><input type="text" id="client_nm_'+cnt+'" name="client_nm" value="" placeholder="고객명 입력" Auto></td>';
    str += '<td class="w11 bottom_td"><input type="text" id="client_tel_'+cnt+'" name="client_tel" value="" placeholder="ex) 010-1234-5678" Auto></td>';
    str += '<td class="w6 bottom_td"><select id="dlv_gb_'+cnt+'" name="dlv_gb">';
    str += '<option value=""></option>';
    str += '</select></td>';
    str += '<td class="w6 bottom_td" colspan="2">';
    str += '<input type="text" id="dlv_zip_'+cnt+'" name="dlv_zip" value="" placeholder="우편번호 입력" Auto numOnly></td>';
    str += '<td class="w16 bottom_td" colspan="2">';
    str += '<input type="text" id="address_'+cnt+'" class="T-left" name="address" value="" placeholder="배송주소 입력" Auto></td>';
    str += '<td class="w16 bottom_td" colspan="2">';
    str += '<input type="text" id="addr_detail_'+cnt+'" class="T-left" name="addr_detail" value="" placeholder="상세주소 입력" Auto></td>';
    str += '<td class="w16 bottom_td" colspan="2" class="bgo">';
    str += '<input type="text" id="addr_text_'+cnt+'" class="T-left" name="addr_text" value="" placeholder="배송 요청사항 입력" Auto></td>';
    str += '<td class="w5 del_td" rowspan="2" style="height:4.375rem !important">';
    str += '<button type="button" class="del" onclick=item_del({class:"'+cnt+'"});>삭제</button>';
    str += '</td>';
    str += '</tr>';
    $("#list-container").append(str);
    fc_reg_exp(); // 입력값 검증

    // 제품 검색 - select2 lib 사용 
    // 동적 로드시에는 동적 순번으로 사용됨
    dynamic_item(cnt);
    dlv_list(cnt); // 배송 구분

    // 총 제품수 추가
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
        $(".tr_"+obj.class).remove();

        // 주문 합계액 갱신
        total_amount();

        // 총 제품수 갱신
        list_count -=1;
        $("#list_count").text(list_count);
    }
}

/**
 * @description 주문 등록
 * @return result code, comment
 */
function ord_register(obj) 
{
    $.ajax({

        url: '/ord/ord_list/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('등록이 완료되었습니다.', false, 'info');
                window.location.href='/ord/ord_list';
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }

    });
}