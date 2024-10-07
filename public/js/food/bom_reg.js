/*================================================================================
 * @description FMS 제조BOM 등록 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/05
 ================================================================================*/

 let cnt = 0; // 동적UI [ID용]
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
        $('.bom_reg_pop').bPopup().close();
    });

});

/**
 * @description 동적 UI추가 -라우팅 선택시에만 BOM추가 가능(공정 일치 必) 
 */
function dynamic_add() 
{
    var str = '';
    var pc_uc = $("#pc_uc").val();
    if(pc_uc != "")
    {
        cnt += 1;
        str += '<tr id="tr_'+cnt+'">';
        str += '<td class="w15"><select id="proc_list_'+cnt+'" class="proc_list" onchange="change_proc(this.id, '+cnt+')"></select></td>';
        str += '<td><select id="item_'+cnt+'" class="item" onchange="change_item(this.id, '+cnt+')"></select></td>';
        str += '<input type="hidden" id="pp_uc_'+cnt+'" name="pp_uc" value="" required>';
        str += '<input type="hidden" id="pp_nm_'+cnt+'" name="pp_nm" value="" required>';
        str += '<input type="hidden" id="buy_cd_'+cnt+'" name="buy_cd" value="" required>';
        str += '<td class="w8 buy_cd_'+cnt+'"></td>';
        str += '<td id="buy_gb_'+cnt+'" class="w10"></td>';
        str += '<td id="unit_'+cnt+'" class="w10"></td>';
        str += '<td id="unit_amt_'+cnt+'" class="w8"></td>';
        str += '<td class="w6"><input type="text" id="usage_'+cnt+'" name="usage" autocomplete="off" value="1"></td>';
        str += '<td><input type="text" id="memo_'+cnt+'" class="T-left" name="sub_memo" autocomplete="off" value=""></td>';
        str += '<td class="w7"><button type="button" class="delete" onclick=item_del({class:"'+cnt+'"});>삭제</button></td>';
        str += '</tr>';
        $("#list-container").append(str);
        call_select2('#proc_list_'+cnt, '/base/prod_bom/proc_list', 0, '', '공정_선택');
        call_select2('#item_'+cnt, '/base/select2/buy_list', 0, '', '원/부자재_선택');
    }
    else
    {
        $("#list-container").html("<tr><td colspan='9'>라우팅 선택 후 BOM 리스트 추가 가능합니다.</td></tr>");
    }
    // 검색 - select2 lib 사용
    // 동적 로드시에는 동적 순번으로 사용됨
    call_select2('#item_list', '/base/select2/sale_list', 0, '', '제품_선택');
    call_select2('#routing_list', '/base/select2/routing_list', 0, '', '라우팅_선택');
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
    }
}

/**
 * @description 전송 값 유효성 검사
 */
 function reg_validation(obj, table) 
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
            if (data.code == '100') // in
            {
                bom_register(data.list);
            }
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });
}

/**
 * @description BOM 등록
 * @return result code, comment
 */
function bom_register(obj) 
{
    $.ajax({
        url: '/base/prod_bom/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('등록이 완료되었습니다.', false, 'info');           // success comment 
                get_bom_list($("#frm_search").serializeObject());   // pop close
                $('.bom_reg_pop').bPopup().close();
            }
            else if (data.code == '400') // fail 
            {
                toast('이미 등록된 제품입니다. 확인 후 다시 이용 바랍니다.', true, 'danger');
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
    $('#item_list, #routing_list').html('').select2({data: [{id: '', text: ''}]});

    // list clear
    $("#list-container").empty();
    $(".list-container").empty();
    cnt = 0;
    dynamic_add();
}