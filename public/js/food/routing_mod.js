/*================================================================================
 * @description FMS 라우팅 수정/삭제 관리JS
 * @author 김민주, @version 1.0, @last date 2022/07/13
 ================================================================================*/

 let mod_cnt = 100;     // 동적UI [ID용]
 let mod_list_cnt = 0;  // 공정 리스트 카운터
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
            routing_delete($("#frm_mod").serializeObject());
        }
    });

    // 확인 버튼 이벤트
    $(".btn_close").off().click(function () { 
        $('.router_mod_pop').bPopup().close();
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
    str += '<td><select id="proc_list_'+mod_cnt+'" class="proc_list" onchange="change_item('+mod_cnt+')"></select></td>';
    str += '<input type="hidden" id="sub_ikey_'+mod_cnt+'" name="sub_ikey" value="" required>';
    str += '<input type="hidden" id="pp_uc_'+mod_cnt+'" name="pp_uc" value="" required>';
    str += '<td class="w7"><input type="number" class="pr_seq_'+mod_cnt+'" name="pr_seq" value="1" required></td>';
    str += '<td id="pp_cd_'+mod_cnt+'" class="w12"></td>';
    str += '<td id="pp_gb_'+mod_cnt+'" class="w12"></td>';
    str += '<td id="pp_hisyn_'+mod_cnt+'" class="w12"></td>';
    str += '<td><input type="text" id="memo_'+mod_cnt+'" class="T-left" name="sub_memo" autocomplete="off" value=""></td>';
    str += '<td class="w7"><button type="button" class="delete" onclick=dynamic_del({class:"'+mod_cnt+'"});>삭제</button></td>';
    str += '</tr>';
    $(".list-container").append(str);

    // 공정 검색 - select2 lib 사용 
    // 동적 로드시에는 동적 순번으로 사용됨
    dynamic_list(mod_cnt);

    // 총 카운터 갱신
    mod_list_cnt = $("#tb_mod_list > tbody > tr").length;
    $(".list_count").text(mod_list_cnt);
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

        // 총 카운터 갱신
        $(".list_count").text(mod_list_cnt-=1);
    }
}


/**
 * @description 라우팅 상세조회
 */
 function get_mod_detail(obj) 
 {
    $.ajax({
        url: '/base/routing/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            var str = '';
            var count = data.result.detail.length;
            if (count > 0) 
            {
                // 라우팅 기본정보
                $(".useyn").val(data.result.detail[0].useyn).prop("selected", true);
                var field = { 
                    "p":"up", "pc_uc":data.result.detail[0].pc_uc
                  , "pc_nm":data.result.detail[0].pc_nm, "memo":data.result.detail[0].memo
                }; process(field, "cval");

                // 라우팅 상세조회(수정 팝업창)
                $.each (data.result.detail, function (i, list) 
                {
                    count += 1;
                    str += '<tr id="tr_'+count+'">';
                    str += '<td><select id="proc_list_'+count+'" onchange="change_item('+count+')">';
                    str += '<option>'+list.pp_nm+'</option>';
                    str += '</select></td>';
                    str += '<input type="hidden" id="sub_ikey_'+count+'" name="sub_ikey" value="'+ list.sub_ikey +'">';
                    str += '<input type="hidden" id="pp_uc_'+count+'" name="pp_uc" value="'+ list.pp_uc +'" required>';
                    str += '<td class="w7"><input type="number" class="pr_seq_'+count+'" name="pr_seq" value="'+ list.pr_seq +'" required></td>';
                    str += '<td id="pp_cd_'+count+'" class="w12">'+ list.pp_cd +'</td>';
                    str += '<td id="pp_gb_'+count+'" class="w12">'+ list.code_nm +'</td>';
                    str += '<td id="pp_hisyn_'+count+'" class="w12">'+ list.pp_hisyn +'</td>';
                    str += '<td><input type="text" id="memo_'+count+'" class="T-left" name="sub_memo" autocomplete="off" value="'+list.sub_memo+'"></td>';
                    str += '<td class="w7"><button type="button" class="delete" onclick=dynamic_del({class:"'+count+'"});>삭제</button></td>';
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

            // 총 카운터 갱신
            mod_list_cnt = $("#tb_mod_list > tbody > tr").length;
            $(".list_count").text(mod_list_cnt);

            // 다중UI select2 lib 적용
            for (var j = 0; j <= count; j++)
            {
                dynamic_list(j);
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
    var pr_seq = new Array();
    var sub_ikey = new Array();
    var sub_memo = new Array();
    $('#'+table+' tbody tr').each(function (index, item) {
        pp_uc.push($(this).find("input[name=pp_uc]").val());
        pr_seq.push($(this).find("input[name=pr_seq]").val());
        sub_ikey.push($(this).find("input[name=sub_ikey]").val());
        sub_memo.push($(this).find("input[name=sub_memo]").val());
    });

    $.ajax({
        url: '/base/routing/v',
        type: 'POST',
        data: {
            'csrf_token_ci':    obj.csrf_token_ci,
            'p':                obj.p,
            'ikey':             obj.ikey,
            'pc_uc':            obj.pc_uc, 
            'pc_nm':            obj.pc_nm,
            'useyn':            obj.useyn,
            'memo':             obj.memo,
            'sub_ikey':         sub_ikey,
            'pp_uc':            pp_uc,
            'pr_seq':           pr_seq,
            'sub_memo':         sub_memo
        },
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '200') // in
            {
                routing_modify(data.list);
            }
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });
}

/**
 * @description 라우팅 수정
 * @return result code, comment
 */
function routing_modify(obj) 
{
    $.ajax({

        url: '/base/routing/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {
            
            // result code
            if (data.code == '100') // success 
            {
                toast('수정이 완료되었습니다.', false, 'info');               // success comment 
                get_routing_list($("#frm_search").serializeObject(), 'Y');  // clear
                $("#ikey_" + data.ikey).addClass("active");
                get_routing_detail({'ikey':data.ikey});
                $('.router_mod_pop').bPopup().close();
            }
            else if (data.code == '400') // fail 
            {
                toast('이미 사용 중인 명칭입니다. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }

    });
}

/**
 * @description 라우팅 삭제
 * @return result code, comment
 */
 function routing_delete(obj) 
 {
    $.ajax({

        url: '/base/routing/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                toast('삭제 완료되었습니다.', false, 'info');                 // success comment
                get_routing_list($("#frm_search").serializeObject(), 'Y');  // clear
                $("#sub-container").html("<tr><td colspan='11'>라우팅 목록 선택 후 조회 가능합니다.</td></tr>");
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

