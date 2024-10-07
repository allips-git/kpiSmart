/*================================================================================
 * @description 구매 발주 수정/삭제 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/18
 ================================================================================*/

 $(function () {

    // 발주 상세 조회
    var ord_no = get_parameter('no');
    if(ord_no != null)
    {
        get_buy_detail({'ord_no':ord_no});
    }

    // 발주 수정 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            buy_validation($("#frm_mod").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 발주 삭제 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            buy_delete($("#frm_mod").serializeObject());
        }
    });

    // 구매요청서 출력 이벤트
    $('.btn_esti').off().click(function() {
        var con = confirm('구매요청서를 출력하시겠습니까?');
        if (con) 
        {
            esti_print({'ord_no':ord_no});
        }
    });
    
    // 테이블 ROW COUNT 확인
    var table = document.getElementById('tb_list');
    var cnt = table.rows.length;
    $("#list_count").text(cnt);

    // 제품 추가 이벤트
    $("#btn_add").off().click(function () {
        cnt++; 
        item_add(cnt);
    });

    // 발주 합계액 표시 및 갱신
    total_amount();

 });

 /**
 * @description 제품 동적 UI추가
 */
let list_count = 0;
function item_add(cnt) 
{
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
    str += '<td class="w8"><input type="text" id="ord_amt_'+cnt+'" class="T-right amt gray" name="ord_amt" value="0" Auto readonly></td>';
    str += '<td class="w8"><input type="text" id="tax_amt_'+cnt+'" class="T-right tax gray" name="tax_amt" value="0" Auto readonly></td>';
    str += '<td><input type="text" id="memo_'+cnt+'" class="w100 T-left" name="ord_memo" Auto></td>';
    str += '<td class="w5"><button type="button" class="del" onclick=item_del({class:"'+cnt+'"});>삭제</button></td>';
    str += '</tr>';
    $("#list-container").append(str);

    // 품목 검색 - select2 lib 사용 
    // 동적 로드시에는 동적 순번으로 사용됨
    dynamic_item(cnt);
    
    // 테이블 ROW COUNT 재확인
    var table = document.getElementById('tb_list');
    list_count = table.rows.length;

    // 총 품목수 갱신
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
        var table = document.getElementById('tb_list');
        var cnt = table.rows.length;
        $("#list_count").text(cnt);
    }
}


 /**
 * @description 구매 발주 상세조회
 */
function get_buy_detail(obj)
{
    $.ajax({
        url: '/ord/ord_buy/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            // 구매 발주 리스트
            var str = '';
            var count = 0;
            var length = data.result.detail.length;
            if (length > 0) 
            {
                if(data.result.detail[0].state >= "002")
                {
                    // css 활성화/비활성화
                    process({ "div_mod":"none", "div_close":"block" }, "display2");
                }

                // 각 진행 상태에 맞는 상태값만 표기 (사용자 선택 불가)
                if (data.result.detail[0].state == "002")
                {
                    $("#state").html('<option value="002">대기</option>');
                }
                else if (data.result.detail[0].state == "003")
                {
                    $("#state").html('<option value="003">진행</option>');
                }
                else if (data.result.detail[0].state == "004")
                {
                    $("#state").html('<option value="004">완료</option>');
                }

                // detail radio, select val
                $("#state").val(data.result.detail[0].state).prop("selected", true);
                $("#vat").val(data.result.detail[0].vat).prop("selected", true);
                $('#select2-biz_list-container').text(data.result.detail[0].cust_nm);

                // 구매 발주 기본정보
                var field = { 
                      "p":"up", "ikey":data.result.detail[0].ikey, "ord_dt":data.result.detail[0].ord_dt, "ord_no":data.result.detail[0].ord_no
                    , "state":data.result.detail[0].state, "cust_cd":data.result.detail[0].cust_cd, "tel":data.result.detail[0].tel
                    , "ceo_nm":data.result.detail[0].ceo_nm, "ceo_tel":data.result.detail[0].ceo_tel, "memo":data.result.detail[0].master_memo
                };
                process(field, "val");
                
                $.each (data.result.detail, function (i, list) 
                {
                    count += 1;
                    str += '<tr id="tr_'+count+'">';
                    str += '<input type="hidden" class="item_cd_'+count+'" name="item_cd" value="'+ list.item_cd +'" required>';
                    str += '<input type="hidden" class="item_nm_'+count+'" name="item_nm" value="'+ list.item_nm +'" required>';
                    str += '<input type="hidden" class="size_'+count+'" name="size" value="'+list.size+'" required>';
                    str += '<input type="hidden" class="unit_'+count+'" name="unit" value="'+list.unit+'" required>';
                    str += '<input type="hidden" class="unit_amt_'+count+'" name="unit_amt" value="'+list.unit_amt+'" required>';
                    str += '<td><select id="item_list_'+count+'" onchange="change_item('+count+')">';
                    str += '<option>'+list.item_nm+'</option>';
                    str += '</select></td>';
                    str += '<td id="item_cd_'+count+'" class="w8">'+ list.item_cd +'</td>';
                    str += '<td id="unit_'+count+'" class="w8">'+list.size+'&nbsp;'+list.code_nm+'</td>';
                    str += '<td id="unit_amt_'+count+'" class="T-right w8">'+commas(list.unit_amt)+'</td>';
                    str += '<td class="w7 spindd">';
                    str += '<div class="spin">';
                    str += '<span class="spinner">';
                    str += '<span class="sub" onclick="num_minus('+count+');">-</span>';
                    str += '<input type="number" id="qty_'+count+'" name="ord_qty" value="'+list.ord_qty+'" Auto oninput="calculation('+count+');" Auto />';
                    str += '<span class="add" onclick="num_plus('+count+');">+</span>';
                    str += '</span></div></td>';
                    str += '<td class="w8"><input type="text" id="ord_amt_'+count+'" class="T-right amt gray" name="ord_amt" value="'+commas(list.ord_amt)+'" Auto readonly></td>';
                    str += '<td class="w8"><input type="text" id="tax_amt_'+count+'" class="T-right tax gray" name="tax_amt" value="'+commas(list.tax_amt)+'" Auto readonly></td>';
                    str += '<td><input type="text" id="memo_'+count+'" class="w100 T-left" name="ord_memo" value="'+list.ord_memo+'" Auto></td>';
                    str += '<td class="w5"><button type="button" class="del" onclick=item_del({class:"'+count+'"});>삭제</button></td>';
                    str += '</tr>';
                });

            } 
            else 
            {
                str += "<tr>";
                str += "<td colspan='9'>조회 가능한 데이터가 없습니다.</td>";
                str += "</tr>";
            } // count end
            $("#list-container").html(str); // ajax data output
            fc_reg_exp(); // 입력값 검증

            // 다중 품목UI select2 lib 적용
            for (var j = 0; j <= count; j++)
            {
                dynamic_item(j);
            }


        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end
}


/**
 * @description 구매 발주 수정
 * @return result code, comment
 */
function buy_modify(obj) 
{
    $.ajax({

        url: '/ord/ord_buy/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('수정이 완료되었습니다.', false, 'info');
                window.location.href='/ord/ord_buy';
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }

    });
}

/**
 * @description 발주 삭제
 * @return result code, comment
 */
 function buy_delete(obj) 
 {
    $.ajax({

        url: '/ord/ord_buy/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                toast('삭제 완료되었습니다.', false, 'info');
                window.location.href='/ord/ord_buy';
            } 
            else if (data.code == '401') // fail
            {
                toast('삭제 불가. 확인 후 다시 이용 바랍니다.', true, 'danger');
            } 
            else if (data.code == '999')  // fail
            {
                toast('삭제 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            }

        }
    });
}
