/*================================================================================
 * @description 제조 오더 수정/삭제 관리JS
 * @author 김민주, @version 1.0, @last date 2022/10/14
 ================================================================================*/

 $(function () {

    // 제조 오더 상세 조회
    var job_no = get_parameter('no');
    if(job_no != null)
    {
        get_job_detail({'job_no':job_no});
    }

    // 제조 오더 수정 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        console.log($('#frm_mod').serializeObject());
        if (con) 
        {
            $("#p").val("up");
            job_validation($("#frm_mod").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 제조 오더 삭제 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            job_delete($("#frm_mod").serializeObject());
        }
    });

 });

 /**
 * @description 제조 오더 상세조회
 */
function get_job_detail(obj)
{
    $.ajax({
        url: '/pr/job_ord/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            console.log(data)
            // 기본값 세팅
            $("#list_count").text(data.result.detail.length);

            // 제조 오더 리스트
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
                $("#wokr_place").val(data.result.detail[0].wp_uc).prop("selected", true);

                // 제조 오더 기본정보
                var field = { 
                    "p":"up", "ikey":data.result.detail[0].ikey, "item_cd":data.result.detail[0].item_cd, "job_dt":data.result.detail[0].job_dt
                  , "job_no":data.result.detail[0].job_no, "item_nm":data.result.detail[0].item_nm, "job_qty":commas(data.result.detail[0].job_qty)
                  , "unit":data.result.detail[0].size+" "+data.result.detail[0].unit_nm, "fac_text":data.result.detail[0].fac_text
                  , "memo":data.result.detail[0].memo , "id":data.result.detail[0].job_id, "pw":data.result.detail[0].job_pw, "con_nm": data.result.detail[0].con_nm
                };
                process(field, "val");
                
                $.each (data.result.detail, function (i, list) 
                {
                    count += 1;
                    str += '<tr id="tr_'+ list.ikey +'">';
                    str += '<td class="w4">'+ list.rownum +'</td>';
                    str += '<td class="w4">'+ list.pp_seq +'</td>';
                    str += '<td class="w6">'+ list.pp_cd + '</td>';
                    str += '<td class="w6">'+ list.pp_gb_nm +'</td>';
                    str += '<td class="Elli w17">'+ list.pp_nm +'</td>';
                    str += '<td class="w7">'+ list.hisyn_nm +'</td>';
                    if (list.pp_hisyn == "Y") // 실적등록 사용시
                    {
                        str += '<td class="w7"><input type="text" id="plan_cnt_'+count+'" name="plan_cnt" value="'+ list.plan_cnt +'" Auto numberOnly></td>';
                    }
                    else
                    {
                        str += '<td class="w7"><input type="hidden" id="plan_cnt_'+count+'" name="plan_cnt" value="0" Auto></td>';
                    }
                    str += '<td class="w8">';
                    str += '<input type="hidden" name="pp_uc" value="'+ list.pp_uc +'">';
                    str += '<input type="hidden" name="pp_seq" value="'+ list.pp_seq +'">';
                    str += '<input type="hidden" name="pp_nm" value="'+ list.pp_nm +'">';
                    str += '<input type="hidden" name="pp_hisyn" value="'+ list.pp_hisyn +'">';
                    str += '<select id="ul_uc_'+count+'" class="ul_uc" name="ul_uc"></select></td>';
                    str += '<td class="w7"><input type="text" id="plan_time_'+count+'" name="plan_time" value="'+ list.plan_time +'" Auto numOnly></td>';
                    str += '<td class="w7"><input type="text" id="plan_num_'+count+'" name="plan_num" value="'+ list.plan_num +'" Auto numOnly></td>';
                    str += '<td class=""><input type="text" id="sub_memo_'+count+'" class="T-left" name="sub_memo" value="'+ list.sub_memo +'" Auto></td>';
                    str += '</tr>';
                    // 담당자 추가
                    user_list(count, list.ul_uc);
                });
                $("#data-container").html(str); // ajax data output

                // BOM 리스트
                var bom = '';
                var amt = 0;
                var job_qty = is_empty($("#job_qty").val()) ? comma_replace($("#job_qty").val()) : 0;
                $.each (data.result.bom, function (i, list) 
                {
                    amt += Number.parseInt(list.amt);
                    bom += '<tr id="'+ list.sub_ikey +'">';
                    bom += '<td class="w4">';
                    bom += '<input type="hidden" name="sub_item_cd" value="'+ list.sub_item_cd +'">';
                    bom += '<input type="hidden" name="base_usage" value="'+ list.usage +'">';
                    bom += list.rownum +'</td>';
                    bom += '<td class="w4">'+ list.pr_seq +'</td>';
                    bom += '<td class="w12">'+ list.pp_nm + '</td>';
                    bom += '<td class="w7">'+ list.sub_item_cd +'</td>';
                    bom += '<td class="T-left">'+ list.sub_item_nm +'</td>';
                    bom += '<td class="w8">'+ list.item_gb_nm +'</td>';
                    bom += '<td class="w8">'+ list.size +' '+ list.unit_nm +'</td>';
                    bom += '<td id="usage_'+ list.sub_ikey +'" class="T-right w7">'+ list.usage +'</td>';
                    bom += '<td id="unit_amt_'+ list.sub_ikey +'"class="T-right w7">'+ commas(list.unit_amt) +'</td>';
                    bom += '<td id="total_'+ list.sub_ikey +'" class="T-right w7">'+ commas(list.usage*job_qty) +'</td>';
                    bom += '<td id="amt_'+ list.sub_ikey +'"class="T-right w7">'+ commas(list.usage*job_qty*list.unit_amt) +'</td>';
                    bom += '<td class="w10">'+ is_empty(list.detail_wh_nm) +'</td>';
                    bom += '</tr>';
                });
                $("#sub-container").html(bom);
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
 * @description 담당자 동적 추가
 */
function user_list(count, text='') 
{
    $.ajax({
        url: '/pr/job_ord/user_list',
        type: 'POST',
        dataType: "json",
        success: function(data) { 

            var str = "";
            if (data.result.user.length > 0) 
            {
                $.each (data.result.user, function (i, list) 
                {
                    str += "<option value='"+ list.ul_uc + "'>" + list.ul_nm +" ("+ list.id +")</option>";
                });
                $("#ul_uc_"+count).html(str);
                // 선택 파라미터 있을경우 담당자 선택 처리
                if (text != "")
                {
                    $("#ul_uc_"+count).val(text).prop("selected", true);
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
 * @description 제조 오더 수정
 * @return result code, comment
 */
function job_modify(obj) 
{
    $.ajax({

        url: '/pr/job_ord/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {
            console.log(obj)
            console.log(data)

            // result code
            if (data.code == '100') // success 
            {
                toast('수정이 완료되었습니다.', false, 'info');
                window.location.href='/pr/job_ord';
            }
            else if (data.code == '401' || data.code == '999') // fail 

                console.log(data)
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        },

        error: function (xhr, status, error) {
            console.error("오류 발생:", xhr.responseText, status, error);
           
        }

    });
}

/**
 * @description 제조 오더 삭제
 * @return result code, comment
 */
 function job_delete(obj) 
 {
    $.ajax({

        url: '/pr/job_ord/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                toast('삭제 완료되었습니다.', false, 'info');
                window.location.href='/pr/job_ord';
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