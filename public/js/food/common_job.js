/*================================================================================
 * @description 제조 오더 공통JS
 * @author 김민주, @version 1.0, @last date 2022/08/25
 ================================================================================*/

 $(function () {

    // 목록 클릭 이벤트
    $("#btn_list").off().click(function () { 
        var con = confirm('아직 데이터 등록 전입니다. 목록으로 되돌아가시겠습니까?');
        if (con) 
        {
            window.location.href='/pr/job_ord';
        }
    });

});

/**
 * @description 전송 값 유효성 검사
 */
 function job_validation(obj) 
 {
    // 다중 입력
    var pp_uc = new Array();
    var pp_seq = new Array();
    var pp_nm = new Array();
    var pp_hisyn = new Array();
    var plan_cnt = new Array();
    var ul_uc = new Array();
    var plan_time = new Array();
    var plan_num = new Array();
    var sub_memo = new Array();
    // var sub_item_cd = new Array();
    // var base_usage = new Array();
    $('#tb_list tr').each(function (index, item) {
        pp_uc.push($(this).find("input[name=pp_uc]").val());
        pp_seq.push($(this).find("input[name=pp_seq]").val());
        pp_nm.push($(this).find("input[name=pp_nm]").val());
        pp_hisyn.push($(this).find("input[name=pp_hisyn]").val());
        plan_cnt.push(comma_replace($(this).find("input[name=plan_cnt]").val()));
        ul_uc.push($(this).find("select[name=ul_uc]").val());
        plan_time.push($(this).find("input[name=plan_time]").val());
        plan_num.push($(this).find("input[name=plan_num]").val());
        sub_memo.push($(this).find("input[name=sub_memo]").val());
    });

    // $('#sub_table tr').each(function (index, item) {
    //     sub_item_cd.push($(this).find("input[name=sub_item_cd]").val());
    //     base_usage.push($(this).find("input[name=base_usage]").val());
    // });

    $.ajax({
        url: '/pr/job_ord/v',
        type: 'POST',
        data: {
            'csrf_token_ci':   obj.csrf_token_ci,
            'p':               obj.p,
            'job_dt':          obj.job_dt,
            'job_no':          obj.job_no,
            'item_cd':         obj.item_cd,
            'id'     :         obj.id,
            'pw'     :         obj.pw,
            'con_nm' :         obj.con_nm,
            'wp_uc':           obj.wp_uc,
            'order_num':       obj.orderNum,
            'job_qty':         comma_replace(obj.job_qty),
            'unit_amt':        obj.unit_amt,
            'fac_text':        obj.fac_text,
            'memo':            obj.memo,
            'state':           obj.state,
            'pp_uc':           pp_uc,
            'pp_seq':          pp_seq,
            'pp_nm':           pp_nm,
            'pp_hisyn':        pp_hisyn,
            'plan_cnt':        plan_cnt,
            'ul_uc':           ul_uc,
            'plan_time':       plan_time,
            'plan_num':        plan_num,
            // 'sub_item_cd':     sub_item_cd,
            // 'base_usage':      base_usage,
            'sub_memo':        sub_memo
        },
        dataType: "json",
        success: function (data) {
            console.log(data)

            // result code
            if (data.code == '100') // in
            {
                job_register(data.list);
            } 
            if (data.code == '200') // up 
            { 
                job_modify(data.list);
            }
            else if (data.code == '999') // fail validation
            {
                toast(data.err_msg, true, 'danger');
            }
        }

    });
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
 * @description 소요량, 1EA 소요단가 예측 계산
 * @hint 계산식) 지시 수량 * 자재 소요량(개별)
 * @return total usage
 */
function calculation()
{
    // 지시 수량
    var job_qty = is_empty($("#job_qty").val()) ? comma_replace($("#job_qty").val()) : 0;
    $('#sub_table tr').each(function() {

        // tr id
        var id = $(this).attr('id');
        var usage = is_empty($("#usage_"+id).text()) ? $("#usage_"+id).text() : 0; // 자재 소요량
        var unit_amt = is_empty($("#unit_amt_"+id).text()) ? comma_replace($("#unit_amt_"+id).text()) : 0;  // 매입 단가

        // 소요량 예측(개별)
        $("#total_"+id).text(commas((job_qty*usage).toFixed(1)));

        // 소요단가 예측(개별)
        $("#amt_"+id).text(commas((job_qty*usage*unit_amt).toFixed(0)));

    });
}