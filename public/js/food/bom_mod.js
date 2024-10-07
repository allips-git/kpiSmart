/*================================================================================
 * @description FMS BOM 수정/삭제 관리JS
 * @author 김민주, @version 1.0, @last date 2022/07/19
 ================================================================================*/

 let mod_cnt = 100;     // 동적UI [ID용]
 $(function () {

    // 공정 추가 이벤트
    $(".btn_add").off().click(function () {
        dynamic_mod_add();
    });

    // 수정 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
            mod_validation($("#frm_mod").serializeObject(), 'tb_mod_list'); // form 데이터 유효성 검사
        }
    });

    // 삭제 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            bom_delete($("#frm_mod").serializeObject());
        }
    });

    // 확인 버튼 이벤트
    $(".btn_close").off().click(function () { 
        $('.bom_mod_pop').bPopup().close();
    });

});

/**
 * @description 동적 UI추가
 */
function dynamic_mod_add() 
{
    var str = '';
    mod_cnt += 1;
    str += '<tr id="tr_'+mod_cnt+'">';
    str += '<td class="w15"><select id="proc_list_'+mod_cnt+'" class="proc_list" onchange="change_proc(this.id, '+mod_cnt+')"></select></td>';
    str += '<td><select id="item_'+mod_cnt+'" class="item" onchange="change_item(this.id, '+mod_cnt+')"></select></td>';
    str += '<input type="hidden" id="pp_uc_'+mod_cnt+'" name="pp_uc" value="" required>';
    str += '<input type="hidden" id="pp_nm_'+mod_cnt+'" name="pp_nm" value="" required>';
    str += '<input type="hidden" id="buy_cd_'+mod_cnt+'" name="buy_cd" value="" required>';
    str += '<td class="w8 buy_cd_'+mod_cnt+'"></td>';
    str += '<td id="buy_gb_'+mod_cnt+'" class="w10"></td>';
    str += '<td id="unit_'+mod_cnt+'" class="w10"></td>';
    str += '<td id="unit_amt_'+mod_cnt+'" class="w8"></td>';
    str += '<td class="w6"><input type="text" id="usage_'+mod_cnt+'" name="usage" autocomplete="off" value="1"></td>';
    str += '<td><input type="text" id="memo_'+mod_cnt+'" class="T-left" name="sub_memo" autocomplete="off" value=""></td>';
    str += '<td class="w7"><button type="button" class="delete" onclick=item_del({class:"'+mod_cnt+'"});>삭제</button></td>';
    str += '</tr>';
    $(".list-container").append(str);

    // 공정 검색 - select2 lib 사용 
    // 동적 로드시에는 동적 순번으로 사용됨
    
    call_select2('#proc_list_'+mod_cnt, '/base/prod_bom/proc_list', 0, '', '공정_선택');
    call_select2('#item_'+mod_cnt, '/base/select2/buy_list', 0, '', '원/부자재_선택');
}

/**
 * @description 동적 UI삭제
 */
function dynamic_del(obj) 
{
    var con = confirm('삭제 하시겠습니까?');
    if (con) 
    {
        $("#tr_"+obj.class).remove();
    }
}

/**
 * @description BOM 상세조회
 */
 function get_mod_detail(obj) 
 {
    $.ajax({
        url: '/base/prod_bom/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            var str = '';
            var count = data.result.detail.length;
            if (count > 0) 
            {
                // 기본정보
                $(".useyn").val(data.result.detail[0].useyn).prop("selected", true);
                var field = { 
                    "p":"up", "bom_uc":data.result.detail[0].bom_uc, "item_cd":data.result.detail[0].item_cd, "pc_uc":data.result.detail[0].pc_uc
                  , "item_nm":data.result.detail[0].item_nm, "pc_nm":data.result.detail[0].pc_nm, "memo":data.result.detail[0].memo
                }; process(field, "cval");

                // BOM 상세조회(수정 팝업창)
                $.each (data.result.detail, function (i, list) 
                {
                    count += 1;
                    str += '<tr id="tr_'+count+'">';
                    str += '<td class="w15"><select id="proc_list_'+count+'" class="proc_list" onchange="change_proc(this.id, '+count+')">';
                    str += '<option>'+list.pp_nm+'</option>';
                    str += '</select></td>';
                    str += '<td><select id="item_'+count+'" class="item" onchange="change_item(this.id, '+count+')">';
                    str += '<option>'+list.sub_item_nm+'</option>';
                    str += '</select></td>';
                    str += '<input type="hidden" id="pp_uc_'+count+'" name="pp_uc" value="'+ list.pp_uc +'" required>';
                    str += '<input type="hidden" id="pp_nm_'+count+'" name="pp_nm" value="'+ list.pp_nm +'" required>';
                    str += '<input type="hidden" id="buy_cd_'+count+'" name="buy_cd" value="'+ list.sub_item_cd +'" required>';
                    str += '<td class="w8 buy_cd_'+count+'">'+ list.sub_item_cd +'</td>';
                    str += '<td id="buy_gb_'+count+'" class="w10">'+ list.item_gb_nm +'</td>';
                    str += '<td id="unit_'+count+'" class="w10">'+ list.size +' '+ list.unit_nm +'</td>';
                    str += '<td id="unit_amt_'+count+'" class="w8">'+ commas(list.unit_amt) +'</td>';
                    str += '<td class="w6"><input type="text" id="usage_'+count+'" name="usage" autocomplete="off" value="'+ list.usage +'"></td>';
                    str += '<td><input type="text" id="memo_'+count+'" class="T-left" name="sub_memo" autocomplete="off" value="'+ list.sub_memo +'"></td>';
                    str += '<td class="w7"><button type="button" class="delete" onclick=item_del({class:"'+count+'"});>삭제</button></td>';
                    str += '</tr>';
                });
            } 
            else 
            {
                str += "<tr>";
                str += "<td colspan='10'>조회 가능한 데이터가 없습니다.</td>";
                str += "</tr>";
            } // count end
            $(".list-container").html(str); // ajax data output

            // 다중UI select2 lib 적용
            for (var j = 0; j <= count; j++)
            {
                call_select2('#proc_list_'+j, '/base/prod_bom/proc_list', 0, '', '공정_선택');
                call_select2('#item_'+j, '/base/select2/buy_list', 0, '', '원/부자재_선택');
            }

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end

    }); // ajax end

} // function end


/**
 * @description 전송 값 유효성 검사
 */
 function mod_validation(obj, table) 
 {
    // 다중 입력
    var pp_uc = new Array();
    var pp_nm = new Array();
    var buy_cd = new Array();
    var usage = new Array();
    var sub_memo = new Array();
    $('#'+table+' tbody tr').each(function (index, item) {
        pp_uc.push($(this).find("input[name=pp_uc]").val());
        pp_nm.push($(this).find("input[name=pp_nm]").val());
        buy_cd.push($(this).find("input[name=buy_cd]").val());
        usage.push($(this).find("input[name=usage]").val());
        sub_memo.push($(this).find("input[name=sub_memo]").val());
    });

    $.ajax({
        url: '/base/prod_bom/v',
        type: 'POST',
        data: {
            'csrf_token_ci':    obj.csrf_token_ci,
            'p':                obj.p,
            'ikey':             obj.ikey,
            'bom_uc':           obj.bom_uc,
            'item_cd':          obj.item_cd,
            'pc_uc':            obj.pc_uc,
            'useyn':            obj.useyn,
            'memo':             obj.memo,
            'pp_uc':            pp_uc,
            'pp_nm':            pp_nm,
            'buy_cd':           buy_cd,
            'usage':            usage,
            'sub_memo':         sub_memo
        },
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '200') // in
            {
                bom_modify(data.list);
            }
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });
}

/**
 * @description BOM 수정
 * @return result code, comment
 */
function bom_modify(obj) 
{
    $.ajax({

        url: '/base/prod_bom/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {
            
            // result code
            if (data.code == '100') // success 
            {
                toast('수정이 완료되었습니다.', false, 'info');           // success comment 
                get_bom_list($("#frm_search").serializeObject(), 'Y');  // clear
                $("#ikey_" + data.result.ikey).addClass("active");
                get_bom_detail({'item_cd':data.result.item_cd});
                $('.bom_mod_pop').bPopup().close();
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }

    });
}

/**
 * @description BOM 삭제
 * @return result code, comment
 */
 function bom_delete(obj) 
 {
    $.ajax({

        url: '/base/prod_bom/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                toast('삭제 완료되었습니다.', false, 'info');                 // success comment
                get_bom_list($("#frm_search").serializeObject(), 'Y');      // clear
                $("#sub-container").html("<tr><td colspan='11'>제품 목록 선택 후 조회 가능합니다.</td></tr>");
                $("#div_mod").css("display", "none");
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

/**
 * @description 초기화
 */
 function mod_reset()
 {
    $('#frm_mod')[0].reset();
    $('.input').val("");
    $('input[name="useyn"][value="Y"]').prop("checked", true);
}