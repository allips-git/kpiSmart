/*================================================================================
 * @description 온라인 주문 수정/삭제 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/17
 ================================================================================*/

 $(function () {
    
    // 거래처 검색 - select2 lib 사용
    call_select2('#biz_list', '/base/select2/biz_list', 0, '거래처명을', '매출거래처_선택');

    // 주문 상세 조회
    var ord_no = get_parameter('no');
    if(ord_no != null)
    {
        get_ord_detail({'ord_no':ord_no});
    }

    // 주문 수정 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            ord_validation($("#frm_mod").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 주문 삭제 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            ord_delete($("#frm_mod").serializeObject());
        }
    });

    // 거래명세서 출력 이벤트
    $('.btn_gurae').off().click(function() {
        var con = confirm('거래명세서를 출력하시겠습니까?');
        if (con) 
        {
            gurae_print({'ord_no':ord_no});
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

    // 주문 합계액 표시 및 갱신
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
    str += '<input type="number" id="qty_'+cnt+'" name="ord_qty" value="1" oninput="calculation('+cnt+');" readonly Auto />';
    str += '<span class="add" onclick="num_plus('+cnt+');">+</span>';
    str += '</span></div></td>';
    str += '<td class="w8"><input type="text" id="ord_amt_'+cnt+'" class="T-right amt gray" name="ord_amt" value="0" Auto readOnly></td>';
    str += '<td class="w8"><input type="text" id="tax_amt_'+cnt+'" class="T-right tax gray" name="tax_amt" value="0" Auto readOnly></td>';
    str += '<td class="number_td bottom_td" style="background-color:#fff !important;"></td>';
    str += '<td class="abtd">'+cnt+'</td>';
    str += '<td class="abtd2"><input type="text" id="mall_nm_'+cnt+'" class="gray02 T-left" name="mall_nm" value="" Auto></td>';
    str += '<td class="w9 bottom_td" style="margin-left:15.03%"><input type="text" id="client_nm_'+cnt+'" name="client_nm" value="" placeholder="고객명 입력" Auto></td>';
    str += '<td class="w11 bottom_td"><input type="text" id="client_tel_'+cnt+'" name="client_tel" value="" placeholder="ex) 010-1234-5678" Auto></td>';
    str += '<td class="w6 bottom_td"><select id="dlv_gb_'+cnt+'" name="dlv_gb">';
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

    // 품목 검색 - select2 lib 사용 
    // 동적 로드시에는 동적 순번으로 사용됨
    dynamic_item(cnt);
    dlv_list(cnt);
    
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

        // 주문 합계액 갱신
        total_amount();
        
        // 총 품목수 갱신
        var table = document.getElementById('tb_list');
        var cnt = table.rows.length;
        $("#list_count").text(cnt);
    }
}


 /**
 * @description 주문 상세조회
 */
function get_ord_detail(obj)
{
    $.ajax({
        url: '/ord/ord_list/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            // 주문 리스트
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
                $("#cust_gb").val(data.result.detail[0].cust_gb).prop("selected", true);
                $("#state").val(data.result.detail[0].state).prop("selected", true);
                $("#vat").val(data.result.detail[0].vat).prop("selected", true);
                $('#select2-biz_list-container').text(data.result.detail[0].cust_nm);

                // 주문 기본정보
                var field = { 
                      "p":"up", "ikey":data.result.detail[0].ikey, "ord_dt":data.result.detail[0].ord_dt, "ord_no":data.result.detail[0].ord_no
                    , "state":data.result.detail[0].state, "cust_cd":data.result.detail[0].cust_cd, "tel":data.result.detail[0].tel
                    , "ceo_nm":data.result.detail[0].ceo_nm, "ceo_tel":data.result.detail[0].ceo_tel, "memo":data.result.detail[0].master_memo
                    , "client_nm":data.result.detail[0].client_nm, "client_tel":data.result.detail[0].client_tel, "dlv_zip":data.result.detail[0].dlv_zip
                    , "address":data.result.detail[0].address, "addr_detail":data.result.detail[0].addr_detail, "addr_text":data.result.detail[0].addr_text
                };
                process(field, "val");
                
                $.each (data.result.detail, function (i, list) 
                {
                    count += 1;
                    str += '<tr id="tr_'+count+'">'
                    str += '<input type="hidden" class="item_cd_'+count+'" name="item_cd" value="'+ list.item_cd +'" required>';
                    str += '<input type="hidden" class="item_nm_'+count+'" name="item_nm" value="'+ list.item_nm +'" required>';
                    str += '<input type="hidden" class="size_'+count+'" name="size" value="'+list.size+'" required>';
                    str += '<input type="hidden" class="unit_'+count+'" name="unit" value="'+list.unit+'" required>';
                    str += '<input type="hidden" class="sale_amt_'+count+'" name="sale_amt" value="'+list.sale_amt+'" required>';
                    str += '<td class="w3"></td>'
                    str += '<td class="w12"></td>'
                    str += '<td colspan="3" class="w26"><select id="item_list_'+count+'" onchange="change_item('+count+')">';
                    str += '<option>'+list.item_nm+'</option>';
                    str += '</select></td>';
                    str += '<td id="item_cd_'+count+'" class="w11">'+ list.item_cd +'</td>';
                    str += '<td id="unit_'+count+'" class="w11">'+list.size+'&nbsp;'+list.code_nm+'</td>';
                    str += '<td id="sale_amt_'+count+'" class="T-right w8">'+commas(list.sale_amt)+'</td>';
                    str += '<td class="w8 spindd">';
                    str += '<div class="spin">';
                    str += '<span class="spinner">';
                    str += '<span class="sub" onclick="num_minus('+count+');">-</span>';
                    str += '<input type="number" id="qty_'+count+'" name="ord_qty" value="'+list.ord_qty+'" oninput="calculation('+count+');" readonly Auto />';
                    str += '<span class="add" onclick="num_plus('+count+');">+</span>';
                    str += '</span></div></td>';
                    str += '<td class="w8"><input type="text" id="ord_amt_'+count+'" class="T-right amt gray" name="ord_amt" value="'+commas(list.ord_amt)+'" Auto readonly></td>';
                    str += '<td class="w8"><input type="text" id="tax_amt_'+count+'" class="T-right tax gray" name="tax_amt" value="'+commas(list.tax_amt)+'" Auto readonly></td>';
                    str += '<td class="number_td bottom_td" style="background-color:#fff !important;"></td>';
                    str += '<td class="abtd">'+ list.ord_seq +'</td>';
                    str += '<td class="abtd2"><input type="text" id="mall_nm_'+count+'" class="gray02 T-left" name="mall_nm" value="'+ list.mall_nm +'" Auto></td>';
                    str += '<td class="w9 bottom_td" style="margin-left:15.03%"><input type="text" id="client_nm_'+count+'" name="client_nm" value="'+ list.client_nm +'" Auto></td>';
                    str += '<td class="w11 bottom_td"><input type="text" id="client_tel_'+count+'" name="client_tel" value="'+ list.client_tel +'" Auto></td>';
                    str += '<td class="w6 bottom_td"><select id="dlv_gb_'+count+'" name="dlv_gb">';
                    str += '</select></td>';
                    str += '<td class="w6 bottom_td" colspan="2">';
                    str += '<input type="text" id="dlv_zip_'+count+'" name="dlv_zip" value="'+ list.dlv_zip +'" Auto numOnly></td>';
                    str += '<td class="w16 bottom_td" colspan="2">';
                    str += '<input type="text" id="address_'+count+'" class="T-left" name="address" value="'+ list.address +'" Auto></td>';
                    str += '<td class="w16 bottom_td" colspan="2">';
                    str += '<input type="text" id="addr_detail_'+count+'" class="T-left" name="addr_detail" value="'+ list.addr_detail +'" Auto></td>';
                    str += '<td class="w16 bottom_td" colspan="2" class="bgo">';
                    str += '<input type="text" id="addr_text_'+count+'" class="T-left" name="addr_text" value="'+ list.addr_text +'" Auto></td>';
                    str += '<td class="w5 del_td" rowspan="2" style="height:4.375rem !important">';
                    str += '<button type="button" class="del" onclick=item_del({class:"'+count+'"});>삭제</button>';
                    str += '</td>';
                    str += '</tr>';
                    // 배송구분 추가
                    dlv_list(count, list.dlv_gb);
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
            for (var j = 0; j < count; j++)
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
 * @description 주문 수정
 * @return result code, comment
 */
function ord_modify(obj) 
{
    $.ajax({

        url: '/ord/ord_list/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('수정이 완료되었습니다.', false, 'info');
                window.location.href='/ord/ord_list';
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }

    });
}

/**
 * @description 주문 삭제
 * @return result code, comment
 */
 function ord_delete(obj) 
 {
    $.ajax({
        url: '/ord/ord_list/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                toast('삭제 완료되었습니다.', false, 'info');
                window.location.href='/ord/ord_list';
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
