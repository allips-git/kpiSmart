let con_stat = true;
let con_cp_uc = '';

$(function(){
    con_cp_uc = $('#p_cp_uc').val();
    $("#myTable").tablesorter({theme : 'blue'});	//테이블 정렬 기능 

    $('#reset').off().click(function(){
        if(confirm('초기화하시겠습니까?')){
            get_set('in');
        }
    });

    $('#in, #up, #de').off().click(function(){
        let cou_id = $(this).attr('id');
        let cou_con = '';

        if(cou_id != "de"){
            con_stat = input_check();
        }

        if(con_stat){
            switch(cou_id){
                case 'in':
                    cou_con = confirm('등록하시겠습니까?');
                break;
                case 'up':
                    cou_con = confirm('수정하시겠습니까?');
                break;
                case 'de':
                    cou_con = confirm('삭제하시겠습니까?');
                break;
            }
        }

        if(cou_con){
            if(cou_id == 'de'){
                $('#p').val(cou_id);
            }

            $('#frm').submit();
        }
    });

    /* 리스트 => 사용여부 on / off */
    $(document).on('click', '.switch', function(){
        let id = $(this).children('input').attr('id');
        let useyn = $(this).children('input').val();

        if(confirm('가용 여부를 변경하시겠습니까?')){
            stat_change(id, useyn);
        }
    });
});

/**
 * @description 리스트 클릭 시 정보 view
 */
function get_info(cp_uc){
    $.ajax({ 
        url: '/event/coupon/get_info',
        type: 'GET',
        data: {
            cp_uc   :   cp_uc
        },
        dataType: "json",
        success: function(result) {
            con_cp_uc = cp_uc;

            if(result.msg == "success"){
                $('#p_cp_uc').val(cp_uc);
                $("input[name='useyn']:radio[value='"+result.info['useyn']+"']").prop("checked",true);
                $('#cp_nm').val(result.info['cp_nm']);
                $('#amt').val(parseInt(result.info['amt']));
                $('#unit').val(result.info['unit']).prop('selected', true);
                $('#memo').val(result.info['memo']);

                get_set('up', result.info['sysyn']);
            }else{
                toast('조회실패. 잠시 후 다시 시도해주세요.', true, 'danger');
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 가용여부 on / off
 */
function stat_change(id, useyn){
    $.ajax({
        url: '/event/coupon/stat_change',
        type: 'GET',
        data: {
            id        : id,
            useyn     : useyn,
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
                        $('#'+id+'').prop('checked', false);
                        $('#'+id+'').val('N');
                    }else{
                        $('#'+id+'').prop('checked', true);
                        $('#'+id+'').val('Y');
                    }

                    if(con_cp_uc == id){
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
 * @description 상황별 셋팅
 */
function get_set(p, sysyn=''){
    switch(p){
        case 'in':
            $("input[name='useyn']:radio[value='Y']").prop("checked",true);
            $('#cp_nm, #amt, #memo').val('');
            $('#unit').find('option:first').prop('selected', true);
            $('#p').val('in');
            $('#in').show();
            $('#up, #de').hide();
        break;
        case 'up':
            $('#p').val('up');
            $('#in').hide();
            if(sysyn == 'N'){
                $('#up, #de').show();
            }else{
                $('#up, #de').hide();
            }
        break;
    }
}

/**
 * @description 필수 입력 값 체크
 */
function input_check(){
    let cou_chk_stat = true;
    let cou_id = ['cp_nm', 'amt'];

    $.each(cou_id, function(index, item){
        if($('#'+item+'').val() == ""){            
            toast(''+$('#'+item+'').attr('data-text')+'를(을) 입력하세요.', true, 'danger');
            $('#'+item+'').focus();
            cou_chk_stat = false;
            return false;
        }
    });

    return cou_chk_stat;
}