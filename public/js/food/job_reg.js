/*================================================================================
 * @description 제조 오더 등록 관리JS
 * @author 김민주, @version 1.0, @last date 2022/10/14
 ================================================================================*/

 $(function () {

    // 검색 - select2 lib 사용
    call_select2('#item_list', '/base/select2/sale_list', 0, '제품명 또는 반제품명을', '제품_선택'); // 제품

    // 제품 추가 이벤트
    $("#btn_add").off().click(function () { 
        item_add();
    });

    // 제조 오더 등록 이벤트
    $("#btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');

        console.log(($("#frm_reg").serializeObject()));

        if (con) 
        {
            $("#p").val("in");
            job_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

});

/**
 * @description select2 변경 이벤트
 */
function change_item(id, count='')
{
    $.ajax({
        url: '/pr/job_ord/sub_list',
        type: 'POST',
        data: {
            'item_cd': $("#"+id+" option:selected").val()
        },
        dataType: "json",
        success: function (data) {
            
            // 기본값 세팅
            $("#unit").val(data.result.item.size+' '+data.result.item.unit_nm);
            $("#list_count").text(data.result.list.length);

            // count,length
            var str = '';
            var count = data.result.list.length;
            if (count > 0) 
            {
                // 공정 리스트
                $.each (data.result.list, function (i, list) 
                {
                    str += '<tr id="tr_'+ list.ikey +'">';
                    str += '<td class="w4">'+ list.rownum +'</td>';
                    str += '<td class="w4">'+ list.pr_seq +'</td>';
                    str += '<td class="w6">'+ list.pp_cd + '</td>';
                    str += '<td class="w6">'+ list.code_nm +'</td>';
                    str += '<td class="Elli w17">'+ list.pp_nm +'</td>';
                    str += '<td class="w7">'+ list.hisyn_nm +'</td>';
                    if (list.pp_hisyn == "Y") // 실적등록 사용시
                    {
                        str += '<td class="w7"><input type="text" id="plan_cnt_'+count+'" name="plan_cnt" Auto numberOnly></td>';
                    }
                    else
                    {
                        str += '<td class="w7"><input type="hidden" id="plan_cnt_'+count+'" name="plan_cnt" value="0"></td>';
                    }
                    str += '<td class="w8">';
                    str += '<input type="hidden" name="pp_uc" value="'+ list.pp_uc +'">';
                    str += '<input type="hidden" name="pp_seq" value="'+ list.pr_seq +'">';
                    str += '<input type="hidden" name="pp_nm" value="'+ list.pp_nm +'">';
                    str += '<input type="hidden" name="pp_hisyn" value="'+ list.pp_hisyn +'">';
                    str += '<select class="ul_uc" name="ul_uc"></select></td>';
                    str += '<td class="w7"><input type="text" id="plan_time_'+count+'" name="plan_time" Auto numOnly></td>';
                    str += '<td class="w7"><input type="text" id="plan_num_'+count+'" name="plan_num" Auto numOnly></td>';
                    str += '<td class=""><input type="text" id="sub_memo_'+count+'" class="T-left" name="sub_memo" value="" Auto></td>';
                    str += '</tr>';
                });
                $("#data-container").html(str); // ajax data output

                // 담당자 세팅 
                var users = '';
                if ( data.result.user.length > 0) 
                {
                    $.each (data.result.user, function (i, list) 
                    {
                        users += "<option value='"+ list.ul_uc + "'>" + list.ul_nm +" ("+ list.id +")</option>";
                    });
                } 
                else
                {
                    users += "<option value=''>생산직 사원 등록 후 사용 가능합니다.</option>";
                }
                $(".ul_uc").html(users);
                $(".ul_uc option:eq(0)").attr('selected', 'selected');

                // BOM 리스트
                var bom = '';
                var amt = 0;
                $.each (data.result.bom, function (i, list) 
                {
                    amt += Number.parseInt(list.amt);
                    bom += '<tr id="'+ list.sub_ikey +'">';
                    bom += '<td class="w4">';
                    // bom += '<input type="hidden" name="sub_item_cd" value="'+ list.sub_item_cd +'">';
                    // bom += '<input type="hidden" name="base_usage" value="'+ list.usage +'">';
                    bom += list.rownum +'</td>';
                    bom += '<td class="w4">'+ list.pr_seq +'</td>';
                    bom += '<td class="w12">'+ list.pp_nm + '</td>';
                    bom += '<td class="w7">'+ list.sub_item_cd +'</td>';
                    bom += '<td class="T-left">'+ list.sub_item_nm +'</td>';
                    bom += '<td class="w8">'+ list.item_gb_nm +'</td>';
                    bom += '<td class="w8">'+ list.size +' '+ list.unit_nm +'</td>';
                    bom += '<td id="usage_'+ list.sub_ikey +'" class="T-right w7">'+ list.usage +'</td>';
                    bom += '<td id="unit_amt_'+ list.sub_ikey +'"class="T-right w7">'+ commas(list.unit_amt) +'</td>';
                    bom += '<td id="total_'+ list.sub_ikey +'" class="T-right w7"></td>';
                    bom += '<td id="amt_'+ list.sub_ikey +'"class="T-right w7"></td>';
                    bom += '<td class="w10">'+ is_empty(list.detail_wh_nm) +'</td>';
                    bom += '</tr>';
                });
                $("#sub-container").html(bom); // ajax data output
                $("#unit_amt").val(amt);
            } 
            else 
            {
                str += "<tr>";
                str += "<td colspan='11'>BOM 등록 후 제조 오더 등록 가능합니다.</td>";
                str += "</tr>";
                $("#data-container, #sub-container").html(str); // ajax data output
            } // count end
            fc_reg_exp(); // 입력값 검증

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end
    }); // ajax end
}

/**
 * @description 제조 오더 등록
 * @return result code, comment
 */
function job_register(obj) 
{
    $.ajax({

        url: '/pr/job_ord/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            console.log(data);

            // result code
            if (data.code == '100') // success 
            {
                toast('등록이 완료되었습니다.', false, 'info');
                window.location.href='/pr/job_ord';
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        },
        error: function(data){
            console.log(data)
        }

    });
}