/*================================================================================
 * @description FMS 라우팅 등록 관리JS
 * @author 김민주, @version 1.0, @last date 2022/07/13
 ================================================================================*/

 let cnt = 0;          // 동적UI [ID용]
 let list_count = 0;   // 공정 리스트 카운터
 $(function () {

    // 공정 추가 이벤트
    $("#btn_add").off().click(function () { 
        dynamic_add();
    });

    // 라우팅 등록 이벤트
    $("#btn_reg").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            reg_validation($("#frm_reg").serializeObject(), 'tb_list'); // form 데이터 유효성 검사
        }
    });

    // 확인 버튼 이벤트
    $("#btn_close").off().click(function () { 
        $('.router_reg_pop').bPopup().close();
    });

});

/**
 * @description 동적 UI추가
 */ 
function dynamic_add() 
{
    var str = '';
    cnt += 1;
    list_count += 1;
    str += '<tr id="tr_'+cnt+'">';
    str += '<td><select id="proc_list_'+cnt+'" class="proc_list" onchange="change_item('+cnt+')"></select></td>';
    str += '<input type="hidden" id="pp_uc_'+cnt+'" name="pp_uc" value="" required>';
    str += '<td class="w7"><input type="number" class="pr_seq_'+cnt+'" name="pr_seq" value="1" required></td>';
    str += '<td id="pp_cd_'+cnt+'" class="w12"></td>';
    str += '<td id="pp_gb_'+cnt+'" class="w12"></td>';
    str += '<td id="pp_hisyn_'+cnt+'" class="w12"></td>';
    str += '<td><input type="text" id="memo_'+cnt+'" class="T-left" name="sub_memo" autocomplete="off" value=""></td>';
    str += '<td class="w7"><button type="button" class="delete" onclick=item_del({class:"'+cnt+'"});>삭제</button></td>';
    str += '</tr>';
    $("#list-container").append(str);

    // 공정 검색 - select2 lib 사용 
    // 동적 로드시에는 동적 순번으로 사용됨
    dynamic_list(cnt);

    // 총 카운터 갱신
    $("#list_count").text(list_count);
}

/**
 * @description 동적 UI삭제
 */
function item_del(obj) 
{
    var con = confirm('삭제 하시겠습니까?');
    if (con) 
    {
        $("#tr_"+obj.class).remove();

        // 총 카운터 갱신
        $("#list_count").text(list_count-=1);
    }
}

/**
 * @description 전송 값 유효성 검사
 */
 function reg_validation(obj, table) 
 {
    // 다중 입력
    var pp_uc = new Array();
    var pr_seq = new Array();
    var sub_memo = new Array();
    $('#'+table+' tbody tr').each(function (index, item) {
        pp_uc.push($(this).find("input[name=pp_uc]").val());
        pr_seq.push($(this).find("input[name=pr_seq]").val());
        sub_memo.push($(this).find("input[name=sub_memo]").val());
    });

    $.ajax({
        url: '/base/routing/v',
        type: 'POST',
        data: {
            'csrf_token_ci':    obj.csrf_token_ci,
            'p':                obj.p,
            'pc_nm':            obj.pc_nm,
            'useyn':            obj.useyn,
            'memo':             obj.memo,
            'pp_uc':            pp_uc,
            'pr_seq':           pr_seq,
            'sub_memo':         sub_memo
        },
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                routing_register(data.list);
            }
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });
}

/**
 * @description 라우팅 등록
 * @return result code, comment
 */
function routing_register(obj) 
{
    $.ajax({
        url: '/base/routing/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('등록이 완료되었습니다.', false, 'info');           // success comment 
                get_routing_list($("#frm_search").serializeObject());   // pop close
                $('.router_reg_pop').bPopup().close();
            }
            else if (data.code == '400') // fail 
            {
                toast('이미 사용 중인 명칭입니다. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '401' || data.code == '999') // fail 
            {
                toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }

    });
}

/**
 * @description 초기화
 */
 function form_reset()
 {
    $('#frm_reg')[0].reset();
    $('.input').val("");
    $('input[name="useyn"][value="Y"]').prop("checked", true);

    // select2 clear
    $("#list-container").empty();
    $(".list-container").empty();
    cnt = 0;
    list_count = 0;
    dynamic_add();
}