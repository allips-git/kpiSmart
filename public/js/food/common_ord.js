/*================================================================================
 * @description 온라인 주문 공통JS
 * @author 김민주, @version 1.0, @last date 2022/08/16
 ================================================================================*/

 $(function () {

    // 검색 - select2 lib 사용
    call_select2('#biz_list', '/ord/ord_buy/biz_list', 0, '거래처명을', '매출거래처_선택');

    // 부가세 변경 이벤트. 부가세(N: 과세, Y: 면세, S: 영세)
    $("#vat").change(function() {

        var vat_gb = $("#vat option:selected").val();
        $('input[name="ord_amt"]').each(function(index) {    
            var ord_amt = $("input[name=ord_amt]:eq(" + index + ")").val();
            var tax_amt = vat_gb == "N" ? commas(Math.round(comma_replace($(this).val()) * 0.1)) : 0;
            $("input[name=tax_amt]:eq(" + index + ")").val(tax_amt);
        });

        // 주문 합계액 표시 및 갱신
        total_amount();

    });

 });

/**
 * @description 제품 검색시 select2 라이브러리 사용
 */
function dynamic_item(cnt)
{
    // 검색 - select2 lib 사용
    call_select2('#item_list_'+cnt, '/base/select2/all_sale_list', 0, '제품명을', '매출제품_선택');
}

/**
 * @description select2 거래처 변경 이벤트
 */
function change_biz_list(id, count='')
{
    $.ajax({
        url: '/biz/client/detail',
        type: 'POST',
        data: {
            'ikey': $("#"+id+" option:selected").val()
        },
        dataType: "json",
        success: function (data) {

            // select val
            $("#vat").val(data.result.detail.vat).prop("selected", true);
            $("#cust_gb").val(data.result.detail.cust_gb).prop("selected", true);

            // 부가세 갱신
            $("#vat").trigger("change");
            $("#cust_gb").trigger("change");

            // client detail
            var field = { 
                "cust_cd": data.result.detail.cust_cd, "tel": data.result.detail.tel, "ceo_nm": data.result.detail.ceo_nm
                , "ceo_tel": data.result.detail.ceo_tel
            };
            process(field, "val");

            // 주문 수정페이지에서 거래처 수정시 추가 멘트 제공
            var pathname = $(location).attr('pathname');
            if (pathname == '/ord/ord_list/up')
            {
                alert('거래처 변경 시 제품 단가는 변경되지 않으니 확인 후 이용 바랍니다.');
            }

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end
}

/**
 * @description 제품 변경 이벤트
 */
function change_item(cnt)
{
    var cust_cd = $("#cust_cd").val();
    if (is_empty(cust_cd))
    {
        $.ajax({
            url: '/base/select2/client_item_detail',
            type: 'POST',
            data: {
                'cust_cd': cust_cd,
                'item_cd': $("#item_list_"+cnt+" option:selected").val()
            },
            dataType: "json",
            success: function (data) {

                // item detail
                $("#item_cd_"+cnt).text(data.result.detail.item_cd);
                $(".item_cd_"+cnt).val(data.result.detail.item_cd);
                $(".item_nm_"+cnt).val(data.result.detail.item_nm);
                $("#unit_"+cnt).text(data.result.detail.size+' '+data.result.detail.unit_nm);
                $(".size_"+cnt).val(data.result.detail.size);
                $(".unit_"+cnt).val(data.result.detail.unit);
                $("#sale_amt_"+cnt).text(commas(data.result.detail.base_amt));
                $(".sale_amt_"+cnt).val(data.result.detail.base_amt);
                $(".ord_amt_"+cnt).val(data.result.detail.ord_amt);
                $(".tax_amt_"+cnt).val(data.result.detail.tax_amt);

                // 주문 금액, 세액 계산
                calculation(cnt); 

            }, // success end
            error: function(request, status, error) {
                    console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            }, // err end
        }); // ajax end       
    }
    else
    {
        // 판매단가 산정 사유로 거래처 선행 선택 필요
        alert('거래처 선택 후 사용 가능합니다');
    }
}

/**
 * @description 배송 구분 동적 추가
 */
function dlv_list(count, text='') 
{
    $.ajax({
        url: '/ord/ord_list/dlv_list',
        type: 'POST',
        dataType: "json",
        success: function(data) { 

            var str = "";
            if (data.result.dlv_gb.length > 0) 
            {
                $.each (data.result.dlv_gb, function (i, list) 
                {
                    str += "<option value='"+ list.code_sub + "'>" + list.code_nm + "</option>";
                });
                $("#dlv_gb_"+count).html(str);
                // 선택 파라미터 있을경우 배송구분 선택 처리
                if (text != "")
                {
                    $("#dlv_gb_"+count).val(text).prop("selected", true);
                }
            }

        }, // success end
        error: function(request, status, error) {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', { sticky: true, type: 'danger' });

        }, // err end

    }); // ajax end
}

/**
 * @description 숫자만 입력 허용
 */
function onlyNumber(obj) 
{
    $(obj).keyup(function() {
         $(this).val($(this).val().replace(/[^0-9]/g,""));
    });
}

/**
 * @description 제품 수량 더하기
 * @return qty
 */
function num_plus(cnt)
{
    var qty = $("#qty_"+cnt).val();
    $("#qty_"+cnt).val(Number(qty)+1);
    calculation(cnt); // 주문 금액, 세액 계산
}

/**
 * @description 제품 수량 빼기(음수 불가)
 * @return qty
 */
function num_minus(cnt)
{
    var qty = $("#qty_"+cnt).val();
    var num = Number(qty)-1 >= 0 ? Number(qty)-1 : 0;
    $("#qty_"+cnt).val(num);
    calculation(cnt); // 주문 금액, 세액 계산
}

/**
 * @description 주문금액, 세액 계산
 * @hint 판매단가 있을경우. 계산식) 주문금액:판매단가*수량
 * @return ord_amt, tax_amt
 */
function calculation(cnt)
{
    // 판매 단가 (콤마 제거)
    var sale_amt = comma_replace($("#sale_amt_"+cnt).text());

    // 수량
    var qty = $("#qty_"+cnt).val();

    // 주문 금액
    var amt = sale_amt*qty >= 0 ? sale_amt*qty : 0;
    $("#ord_amt_"+cnt).val(commas(amt));

    // 부가세 여부
    var vat_gb = $("#vat option:selected").val();

    // 부가세
    var vat = vat_gb == "N" ? commas(Math.round(amt * 0.1)) : 0;
    $("#tax_amt_"+cnt).val(vat);

    // 주문 합계액 표시 및 갱신
    total_amount();

}

/**
 * @description 주문 총액 합산
 * @hint 동일 클래스명으로 계산된 주문금액+세액 합산
 * @return total_amt
 */
function total_amount() 
{
    var amt = 0;
    var tax = 0;
    $('.amt').each(function() {
        if (!isNaN(comma_replace($(this).val())))
        {
            // 숫자인 경우만 합산
            amt += parseInt(comma_replace($(this).val()));
        }
    });
    $('.tax').each(function() {
        if (!isNaN(comma_replace($(this).val())))
        {
            // 숫자인 경우만 합산
            tax += parseInt(comma_replace($(this).val()));
        }
    });

    $("#total_amt").text(commas(amt+tax));
    $(".total_amt").val(amt);
    $(".total_tax").val(tax);
  
}

/**
 * @description 전송 값 유효성 검사
 */
 function ord_validation(obj) 
 {
    // 고객정보 다중 입력
    var mall_nm = new Array();
    var client_nm = new Array();
    var client_tel = new Array();
    var dlv_gb = new Array();
    var dlv_zip = new Array();
    var address = new Array();
    var addr_detail = new Array();
    var addr_text = new Array();

    // 주문정보 다중 입력
    var item_cd = new Array();
    var item_nm = new Array();
    var size = new Array();
    var unit = new Array();
    var ord_qty = new Array();
    var sale_amt = new Array();
    var ord_amt = new Array();
    var tax_amt = new Array();
    var ord_memo = new Array();
    $('#tb_list tr').each(function (index, item) {
        mall_nm.push($(this).find("input[name=mall_nm]").val());
        client_nm.push($(this).find("input[name=client_nm]").val());
        client_tel.push($(this).find("input[name=client_tel]").val());
        dlv_gb.push($(this).find("select[name=dlv_gb]").val());
        dlv_zip.push($(this).find("input[name=dlv_zip]").val());
        address.push($(this).find("input[name=address]").val());
        addr_detail.push($(this).find("input[name=addr_detail]").val());
        addr_text.push($(this).find("input[name=addr_text]").val());
        item_cd.push($(this).find("input[name=item_cd]").val());
        item_nm.push($(this).find("input[name=item_nm]").val());
        size.push($(this).find("input[name=size]").val());
        unit.push($(this).find("input[name=unit]").val());
        ord_qty.push($(this).find("input[name=ord_qty]").val());
        sale_amt.push(comma_replace($(this).find("input[name=sale_amt]").val()));
        ord_amt.push(comma_replace($(this).find("input[name=ord_amt]").val()));
        tax_amt.push(comma_replace($(this).find("input[name=tax_amt]").val()));
        ord_memo.push($(this).find("input[name=ord_memo]").val());
    });

    $.ajax({
        url: '/ord/ord_list/v',
        type: 'POST',
        data: {
            'csrf_token_ci':   obj.csrf_token_ci,
            'p':               obj.p,
            'ord_no':          obj.ord_no,
            'ord_dt':          obj.ord_dt,
            'state':           obj.state,
            'cust_cd':         obj.cust_cd,
            'vat':             obj.vat,
            'memo':            obj.memo,
            'mall_nm':         mall_nm,
            'client_nm':       client_nm,
            'client_tel':      client_tel,
            'dlv_gb':          dlv_gb,
            'dlv_zip':         dlv_zip,
            'address':         address,
            'addr_detail':     addr_detail,
            'addr_text':       addr_text,
            'item_cd':         item_cd,
            'item_nm':         item_nm,
            'size':            size,
            'unit':            unit,
            'ord_qty':         ord_qty,
            'sale_amt':        sale_amt,
            'ord_amt':         ord_amt,
            'tax_amt':         tax_amt,
            'total_amt':       obj.total_amt,
            'total_tax':       obj.total_tax,
            'ord_memo':        ord_memo,
        },
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                ord_register(data.list);
            } 
            else if (data.code == '200') // up 
            { 
                ord_modify(data.list);
            } 
            else if (data.code == '300') // del 
            { 
                ord_delete(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });
}