let center_stat = 'N';
let p_cen_uc;

$(function(){
    $('#reset').off().click(function(){
        if(confirm('초기화하시겠습니까?')){
            get_reset();
        }
    });

    $('#up').off().click(function(){
        if(input_check()){
            if(confirm('수정하시겠습니까?')){
                get_result();
            }
        }
    });

    /* 리스트 => 사용여부 on / off */
    $(document).on('click', '.switch', function(){
        let cen_uc = $(this).children('input').attr('data-cen_uc');
        let useyn = $(this).children('input').val();

        if(confirm('가용 여부를 변경하시겠습니까?')){
            stat_change(cen_uc, useyn);
        }
    });
});

/**
 * @description 리스트 클릭 시 정보 get
 */
function get_detail(cen_uc){
    $.ajax({
        url: '/base/center/get_detail',
        type: 'GET',
        data: {
            cen_uc : cen_uc
        },
        dataType: "json",
        success: function(data) {
            $('#before').hide();
            $('#up, #after').show();
            center_stat = 'Y';
            p_cen_uc = cen_uc;

            if(data.user['dp_uc'] == ""){
                // 첫 수정 시 무조건 사용가능 처리
                $("input[name='useyn']:radio[value='Y']").prop("checked",true);
            }else{
                $("input[name='useyn']:radio[value='"+data.center['useyn']+"']").prop("checked",true);
            }
            $('#memo').val(data.center['memo']);

            $('span, select').each(function(){
                if($(this).attr('data-detail') == 'Y'){
                    switch($(this).prop('tagName')){
                        case 'SPAN':
                            $(this).text('');

                            if(data.center[$(this).attr('id')] != ""){
                                $(this).text(data.center[$(this).attr('id')]);
                                $(this).text(data.user[$(this).attr('id')]);
                            }
                        break;
                        case 'SELECT':
                            $(this).find('option:first').prop('selected', true);
                            $('#joinY').hide();
                            $('#joinyn').show();

                            $(this).val(data.center[$(this).attr('id')]).prop('selected', true);

                            if(data.center[$(this).attr('id')] == "Y"){
                                $('#joinY').show();
                                $('#joinyn').hide();   
                            }
                        break;
                    }
                }
            });
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 가용여부 on / off update
 */
 function stat_change(cen_uc, useyn){
    $.ajax({
        url: '/base/center/stat_change',
        type: 'GET',
        data: {
            cen_uc      : cen_uc,
            useyn       : useyn,
        },
        dataType: "json",
        success: function(data) {
            switch(data.result_code){
                case 100:
                    toast('가용여부 상태 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
                break;
                case 200:
                    toast('가용여부 상태가 변경되었습니다.', false, 'info');

                    if(useyn == "Y"){
                        $("input:checkbox[id='use_"+cen_uc+"']").prop('checked', false);
                        $("input:checkbox[id='use_"+cen_uc+"']").val('N');
                    }else{
                        $("input:checkbox[id='use_"+cen_uc+"']").prop('checked', true);
                        $("input:checkbox[id='use_"+cen_uc+"']").val('Y');
                    }

                    if(p_cen_uc == cen_uc){
                        switch(useyn){
                            case 'Y':
                                $("input[name='useyn']:radio[value='N']").prop("checked",true);
                            break;
                            case 'N':
                                $("input[name='useyn']:radio[value='Y']").prop("checked",true);
                            break;
                        }
                    }
                break;
            }
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 승인처리
 */
function get_result(){
    $.ajax({
        url: '/base/center/u',
        type: 'GET',
        data: {
            cen_uc : p_cen_uc,
            useyn  : $("input[name='useyn']:checked").val(),
            joinyn : $('#joinyn').val(),
            memo   : $('#memo').val(),
            pass   : $('#pass').val()
        },
        dataType: "json",
        success: function(data) {
            if(data.msg == "success"){
                toast('처리되었습니다.', false, 'info');

                if(data.center['joinyn'] == "Y"){
                    $('#joinyn').hide();
                    $('#joinY').show();
                }
                if(data.center['useyn'] == "Y"){
                    $("input:checkbox[id='use_"+p_cen_uc+"']").prop('checked', true);
                    $("input:checkbox[id='use_"+p_cen_uc+"']").val('Y');
                }else{
                    $("input:checkbox[id='use_"+p_cen_uc+"']").prop('checked', false);
                    $("input:checkbox[id='use_"+p_cen_uc+"']").val('N');
                }

                var a = '';

                switch(data.center.joinyn){
                    case 'N':
                        a = '<span class="blue-box">승인대기</span>';
                    break;
                    case 'Y':
                        a = '<span class="green-box">승인완료</span>';
                    break;
                    case 'C':
                        a = '<span class="red-box">승인취소</span>';
                    break;
                }

                $('#join_'+p_cen_uc+'').html(a);
                $('#admin_ikey_'+p_cen_uc+'').html(data.center['admin_nm']+"("+data.center['admin_id']+")");
                $('#admin_dt_'+p_cen_uc+'').html(data.center['admin_dt']);
                $('#mod_ikey_'+p_cen_uc+'').html(data.center['mod_nm']+"("+data.center['mod_id']+")");
                $('#mod_dt_'+p_cen_uc+'').html(data.center['mod_dt']);
                $('#admin_dt').text(data.center['admin_dt']);
            }else{
                toast('처리에 실패하였습니다. 지속될 경우 개발팀에 문의주세요.', true, 'danger');
            }
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 입력 값 검증
 */
function input_check(){
    var num = $('#pass').val().search(/[0-9]/g);
    var eng = $('#pass').val().search(/[a-z]/ig);

    if($('#pass').val() != ''){
        if(num < 0 || eng < 0 || $('#pass').val().length < 6){
            toast('비밀번호는 숫자와 영문자 조합으로 6~20자리를 사용해야 합니다.', true, 'danger');
            $('#pass').focus();
            return false;
        }
    
        if($('#pass').val() != $('#pass_chk').val()){
            toast('비밀번호 확인란과 일치하지 않습니다.', true, 'danger');
            $('#pass_chk').focus();
            return false;
        }
    }
    return true;
}

/**
 * @description 초기화
 */
function get_reset(){
    $('#up, #after').hide();
    $('#before').show();
}