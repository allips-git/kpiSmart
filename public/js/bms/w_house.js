/*================================================================================
 * @name: 김원명 - w_house.js
 * @version: 1.0.0, @date: 2021-08-12
 ================================================================================*/
let ex = true;
let p_wh_uc = '';

$(function(){
    p_wh_uc = $('#p_wh_uc').val();
    /** 수정 이후 리스트 클릭 효과 */
    $('#list_'+p_wh_uc+'').trigger('click');
    
    /** tablesorter 플러그인 (정렬) */
    $("#myTable").tablesorter({
        theme : 'blue'
    });

    /** 연락처 숫자, 하이픈만 입력 허용 */
    $("#tel").on("input", function(){
        $(this).val($(this).val().replace(/[^0-9-]/gi,""));
    });

    /** 수정 시 삭제불가일 경우 가용여부 변경 불가능 */
    $("input:radio[name=useyn]").off().click(function(){
        if($(this).attr('data-sys') == "Y"){
            return false;
        }
    });

    /* 등록, 수정, 삭제 버튼 클릭 시 */
    $('#in, #up, #del').off().click(function(){
        let id = $(this).attr('id');

        if(ex){
                        
            if(id == "del"){
                let con = confirm('삭제하시겠습니까?');

                if(con){
                    $('#p').val('del');
                    $('#p_wh_uc').val(p_wh_uc);

                    val_check();
                    ex = false;
                }else{
                    ex = true;
                }
            }else{
                if(input_check()){
    
                    switch(id){
                        case 'in': // 등록
                            $('#p').val('in');
                        break;
                        case 'up': // 수정
                            $('#p').val('up');
                            $('#p_wh_uc').val(p_wh_uc);
                        break;
                    }
        
                    if(!frm_chk()){
                        ex = true;
                    }else{
                        ex = false;
                        val_check();
                    }
                }else{
                    ex = true;
                }
            }
        }else{
            alert('처리 중입니다.');
            return false;
        }
    });

    /* 리스트 => 사용여부 on / off */
    $('.switch').off().click(function(){
        if(confirm('가용 여부를 변경하시겠습니까?')){
            stat_change($(this).children('input').attr('id'), $(this).children('input').attr('data-use'));
        }
    });

    /* 리셋 버튼 */
    $('#reset').off().click(function(){
        let con = confirm('초기화하시겠습니까?');

        if(con){
            get_set('in');
        }
    });
});

/**
 * @description 코드 생성 및 중복 값 체크 ajax 통신
 */
function val_check(){
    $.ajax({
        url: '/base/w_house/val_check',
        type: 'GET',
        data: {
            p       : $('#p').val(),
            wh_no   : $("#wh_no option:selected").val(),
            wh_nm   : $('#wh_nm').val(),
            p_wh_uc : $('#p_wh_uc').val(),
            useyn   : $("input[name='useyn']:checked").val()
        },
        dataType: "json",
        success: function(data) {
            switch(data.result_code){
                case 100:
                    ex = true;
                    toast('중복된 우선순위 또는 창고명이 존재합니다.', true, 'danger');
                break;
                case 110:
                    ex = true;
                    toast('최소 1개 이상은 가용여부가 활성화 되어 있어야합니다.', true, 'danger');
                break;
                case 120:
                    ex = true;
                    toast('삭제불가. 가용 중인 창고가 하나 이상 존재해야됩니다.', true, 'danger');
                break;
                case 130:
                    ex = true;
                    toast('삭제 불가능한 창고입니다.', true, 'danger');
                break;
                case 200:
                    $('#frm').submit();
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
 * @description 클릭 시 정보 get
 */
function get_detail(wh_uc){
    $.ajax({
        url: '/base/w_house/get_detail',
        type: 'GET',
        data: {
            wh_uc : wh_uc
        },
        dataType: "json",
        success: function(data) {
            get_set('up', data.info['sysyn']);
            
            p_wh_uc = data.info['wh_uc'];
            $("input[name='useyn']:radio[value='"+data.info['useyn']+"']").prop("checked",true);
            $('#wh_gb').val(data.info['wh_gb']).prop('selected',true);
            $('#wh_no').val(data.info['wh_no']).prop('selected',true);
            $('#wh_nm').val(data.info['wh_nm']);
            $('#person').val(data.info['person']);
            $('#tel').val(data.info['tel']);
            $('#post_code').val(data.info['post_code']);
            $('#addr').val(data.info['addr']);
            $('#addr_detail').val(data.info['addr_detail']);
            $('#memo').val(data.info['memo']);
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 사용여부 on / off update
 */
function stat_change(wh_uc, useyn){
    $.ajax({
        url: '/base/w_house/stat_change',
        type: 'GET',
        data: {
            wh_uc : wh_uc,
            useyn : useyn,
        },
        dataType: "json",
        success: function(data) {
            switch(data.result_code){
                case 100:
                    $('#'+wh_uc+'').prop('checked', true);
                    toast('최소 1개 이상은 사용여부가 활성화 되어 있어야합니다.', true, 'danger');
                break;
                case 110:
                    toast('사용여부 상태 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
                break;
                case 120:
                    toast('삭제 불가능한 창고는 가용여부를 변경할 수 없습니다.', true, 'danger');
                break;
                case 200:
                    toast('사용여부 상태가 변경되었습니다.', false, 'info');
                    if(useyn == "Y"){
                        $('#'+wh_uc+'').prop('checked', false);
                        $('#'+wh_uc+'').attr('data-use', 'N');
                    }else{
                        $('#'+wh_uc+'').prop('checked', true);
                        $('#'+wh_uc+'').attr('data-use', 'Y');
                    }

                    if(p_wh_uc == wh_uc){
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
 * @description 상황별 값 설정
 */
function get_set(kind, sysyn=''){
    $('#p').val(kind);

    switch(kind){
        case 'in': // 입력
            $('tr').removeClass('active');
            $("input[name='useyn']:radio[value='Y']").prop("checked",true);
            $('#wh_gb option:eq(0)').prop('selected',true);
            $('#wh_no option:eq(0)').prop('selected',true);
            $('#wh_nm, #person, #tel, #post_code, #addr, #addr_detail, #memo').val('');
            $('#in').show();
            $('#up, #del').hide();
        break;
        case 'up': // 수정
            $('#in').hide();
            $('#up').show();
            if(sysyn == "Y"){
                $('#del').hide();
                $("input:radio[name=useyn]").attr("data-sys", sysyn);
            }else{
                $('#del').show();
                $("input:radio[name=useyn]").attr("data-sys", sysyn);
            }
        break;
    }
}

/**
 * @description 필수 입력 값 체크
 */
function input_check(){
    if($('#wh_nm').val() == ""){
        toast('창고명을 입력하세요.', true, 'danger');
        $('#wh_nm').focus();
        return false;
    }

    return true;
}
