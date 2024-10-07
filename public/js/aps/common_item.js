/*================================================================================
 * @name: 김원명 - common_item.js
 * @version: 1.0.0, @date: 2021-09-04
================================================================================*/
let ct_stat = false;
let p_cd = '';
let p_k = 'm';

$(function(){ 
    get_list('m');

    /** 제품군 변경 시 값 설정 */
    $('#pm_cd').change(function(){
        var pm_cd = $(this).val();

        /** 전체 아닐 시 소속 제품군 */
        if(pm_cd !== ""){ 
            get_list('d', pm_cd);
            p_k = 'd';
			$('#template').show();
        }else{ /** 전체 일시 제품군 */
            get_list('m', pm_cd);
            p_k = 'm';
			$('#template').hide();
        }
    });

    /** 등록, 수정, 삭제 버튼 클릭 시 */
    $('#in, #up, #del').off().click(function(){
        let id = $(this).attr('id');
        let con = '';

        switch(id){
            /** 등록, 수정 */
            case 'in': case 'up': 
                if(input_check()){
                    if(id == "in"){
                        con = confirm('등록하시겠습니까?');
                    }else{
                        con = confirm('수정하시겠습니까?');
                    }
                }
                if(con){
                    $('#k').val(p_k);
                    $('#p_cd').val(p_cd);
                    get_result();
                }
            break;
            /** 삭제 */
            case 'del':
                con = confirm('삭제하시겠습니까?');

                if(con){
                    $('#k').val(p_k);
                    $('#p_cd').val(p_cd);
                    get_set(id);
                }
            break;
        }
    });
    
    /** 검색 시 입력 버튼 초기화 및 리스트 셋팅 */
    $('#search').off().click(function(){
        get_set('in');
        get_list('m');
    });

    /** 검색 text에서 엔터키 누를 시 list */
    $("#sc").keyup(function(e){
        if(e.keyCode == 13){
            get_set('in');
            get_list('m');
        }
    });

    /* 리스트 => 사용여부 on / off */
    $(document).on('click', '.switch', function(){
        let k = $(this).children('input').attr('data-k');
        let pm_cd = $(this).children('input').attr('data-pm');
        let yn = $(this).children('input').val();
        let cd = $(this).children('input').attr('data-cd');
        let sysyn = $(this).children('input').attr('data-sys');

        if(sysyn == "Y" && $(this).children('input').attr('data-use') == "Y"){
            toast('삭제 불가능한 제품군은 가용여부를 변경할 수 없습니다.', true, 'danger');
        }else{
            if(confirm('가용 여부를 변경하시겠습니까?')){
                stat_change(k, pm_cd, yn, cd, sysyn);
            }
        }
    });

    $(document).on('click', 'td', function(){
        if($(this).hasClass('tb_click')){
            $('tr').removeClass('active');
            $(this).parent('tr').addClass('active');
        }
    });

    /** 리셋 버튼 클릭 시 */
    $('#reset').off().click(function(){
        let con = confirm('초기화하시겠습니까');

        if(con){
            get_set('in');
        }
    });
});

/**
 * @description 코드 생성 및 중복 값 체크 & 데이터 insert / update
 */
function get_result(){
    $.ajax({
        url: '/base/common_item/get_result',
        type: 'GET',
        data: {
            p           : $('#p').val(),
            k           : $('#k').val(),
            useyn       : $('input:checkbox[id="useyn"]').is(":checked") == true ? 'Y' : 'N',
            sysyn       : $('input:checkbox[id="sysyn"]').is(":checked") == true ? 'Y' : 'N',
            pm_cd       : $("#pm_cd option:selected").val(),
            prod_name   : $('#prod_name').val(),
			te_uc   	: $('#te_uc').val(),
            memo        : $('#memo').val(),
            p_cd        : $('#p_cd').val()
        },
        dataType: "json",
        success: function(data) {
            switch(data.result_code){
                case 100:
                    toast('중복된 제품군 코드명이 존재합니다.', true, 'danger');
                break;
                case 110:
                    toast('중복된 소속 제품군 코드명이 존재합니다.', true, 'danger');
                break;
                case 120:
                    toast('등록에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
                break;
                case 130:
                    toast('수정에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
                break;
                case 140:
                    toast('삭제에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
                break;
                case 150:
                    toast('최소 1개 이상은 가용여부가 활성화 되어 있어야합니다.', true, 'danger');
                break;
                case 160:
                    toast('삭제 불가능한 가용여부를 off 할 수 없습니다.', true, 'danger');
                break;
                case 200:
                    toast('등록되었습니다.', false, 'info');
                    if(data.k == "m"){
                        get_list(data.k);
                    }else{
                        get_list(data.k, data.pm_cd);
                        $('#sys_'+data.pm_cd+'').text('삭제불가');
                        $('#sys_'+data.pm_cd+'').addClass('red');
                    }
                break;
                case 250:
                    toast('수정되었습니다.', false, 'info');
                    if(data.k == "m"){
                        get_list(data.k);
                    }else{
                        get_list(data.k, data.pm_cd);
                    }
                    if($('input:checkbox[id="sysyn"]').is(":checked") == true){
                        $('#sysyn').prop('disabled', true);
                        $('#sys').addClass('disable');
                        $('#del').hide();

                        if($('input:checkbox[id="useyn"]').is(":checked") == true){
                            $('#useyn').prop('disabled', true);
                            $('#use').addClass('disable');
                        }
                    }
                break;
                case 300:
                    toast('삭제되었습니다.', false, 'info');
                    if(data.k == "m"){
                        get_list(data.k);
                        $('#pm_cd').prop('disabled', false);
                        $('#pm_cd').removeClass('gray');
                    }else{
                        get_list(data.k, data.pm_cd);
                    }
                    $('#prod_name, #memo').val('');
                    $('#in').show();
                    $('#up, #del').hide();
                    $('#p').val('in');
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
 * @description 리스트 데이터 get
 * @param { 제품군(m), 소속 제품군 구분(d) } k 
 * @param { k = d 일 시 (제품군 코드) } pm_cd 
 */
function get_list(k, pm_cd = ''){
    $("#table_1, #table_2").tablesorter({theme : 'blue'});	//테이블 정렬 기능  
    $.ajax({
        url: '/base/common_item/get_list',
        type: 'GET',
        data: {
            k     : k,
            pm_cd : pm_cd,
            op_1  : $("#op_1 option:selected").val(),
            sc    : $('#sc').val(),
            sysyn : $("#op_sysyn option:selected").val(),
            useyn : $("#op_useyn option:selected").val()
        },
        dataType: "json",
        success: function(data) {
            
            let list = '';
            let cnt = 0;
            let sel = '<option value="">전체</option>';

            switch(k){
                case 'm': /** 제품군 리스트 */
                    if(data.list.length == 0){ /** 데이터 없을 시 */
                        list += '<tr>';
                        list += '<td colspan="9">조회 가능한 데이터가 없습니다.</td>';
                        list += '</tr>';
                    }else{ /** 데이터 있을 시 */
                        $.each(data.list, function(index, item){
                            if(item.pm_cd == p_cd){
                                list += '<tr class="active">';
                            }else{
                                list += '<tr>';
                            }
                            list += '<td class="w5 tb_click" onclick="get_detail(\'m\', \''+item.pm_cd+'\');">'+item.pm_cd+'</td>';
                            list += '<td class="w15 tb_click T-left" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" onclick="get_detail(\'m\', \''+item.pm_cd+'\');">'+item.pm_nm+'</td>';
                            list += '<td class="w5">';
                            list += '<label class="switch">';
                            if(item.useyn == "Y"){
                                list += '<input type="checkbox" name="use_st" id="use_'+item.pm_cd+'" value="'+item.useyn+'" data-pm="'+item.pm_cd+'" data-cd="'+item.pm_cd+'" data-k="'+k+'" data-sys="'+item.sysyn+'" data-use="'+item.useyn+'" checked disabled>';
                            }else{
                                list += '<input type="checkbox" name="use_st" id="use_'+item.pm_cd+'" value="'+item.useyn+'" data-pm="'+item.pm_cd+'" data-cd="'+item.pm_cd+'" data-k="'+k+'" data-sys="'+item.sysyn+'" data-use="'+item.useyn+'" disabled>';
                            }
                            list += '<span class="slider round"></span>';
                            list += '<span class="offtxt">off</span>';
                            list += '<span class="ontxt">on</span>';
                            list += '</label>';
                            list += '</td>';
                            list += '<td class="w20 T-left" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">'+item.memo+'</td>';
                            list += '<td class="w10">'+item.reg_name+"("+item.reg_id+")"+'</td>';
                            list += '<td class="w10">'+item.reg_dt+'</td>';
                            if(item.mod_id != ""){
                                list += '<td class="w10">'+item.mod_name+"("+item.mod_id+")"+'</td>';
                                list += '<td class="w10">'+item.mod_dt+'</td>';
                            }else{
                                list += '<td class="w10"></td>';
                                list += '<td class="w10"></td>';
                            }
                            if(item.sysyn == "N"){
                                list += '<td class="w5" style="padding-right:10px" id="sys_'+item.pm_cd+'">삭제가능</td>';
                            }else{
                                list += '<td class="w5 red" style="padding-right:10px" id="sys_'+item.pm_cd+'">삭제불가</td>';
                            }
                            list += '</tr>';
            
                            cnt ++;

                            if(item.pm_cd == p_cd){
                                sel += '<option value="'+item.pm_cd+'" selected>'+item.pm_nm+'</option>';
                            }else{
                                sel += '<option value="'+item.pm_cd+'">'+item.pm_nm+'</option>';
                            }
                        });
                    }

                    $('#list_1').html(list);
                    $('#cnt_1').text(cnt);

                    if(!ct_stat){
                        var detail_list = '<tr><td colspan="11">제품군을 선택 시 조회가능합니다.</td></tr>';

                        $('#list_2').html(detail_list);
                        $('#cnt_2').text(0);
                    }

                    $('#pm_cd').html(sel);

                    ct_stat = true;

                    $("#table_1").trigger("update");
                    //$("#table_2").trigger("update");
                break;
                case 'd': /** 소속 제품군 리스트 */
                    if(data.list.length == 0){ /** 데이터 없을 시 */
                        list += '<tr>';
                        list += '<td colspan="11">조회 가능한 데이터가 없습니다.</td>';
                        list += '</tr>';
                    }else{ /** 데이터 있을 시 */
                        $.each(data.list, function(index, item){
                            if(item.pd_cd == p_cd){
                                list += '<tr class="active">';
                            }else{
                                list += '<tr>';
                            }
                            list += '<td class="w5">'+item.pm_cd+'</td>';
                            list += '<td class="w10 tb_click" onclick="get_detail(\'d\', \''+item.pd_cd+'\');">'+item.pd_cd+'</td>';
                            list += '<td class="w15 tb_click T-left" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" onclick="get_detail(\'d\', \''+item.pd_cd+'\');">'+item.pd_nm+'</td>';
                            list += '<td class="w5">';
                            list += '<label class="switch">';
                            if(item.useyn == "Y"){
                                list += '<input type="checkbox" name="use_st" id="use_'+item.pd_cd+'" value="'+item.useyn+'" data-pm="'+item.pm_cd+'" data-cd="'+item.pd_cd+'" data-k="'+k+'" data-sys="'+item.sysyn+'" data-use="'+item.useyn+'" checked disabled>';
                            }else{
                                list += '<input type="checkbox" name="use_st" id="use_'+item.pd_cd+'" value="'+item.useyn+'" data-pm="'+item.pm_cd+'" data-cd="'+item.pd_cd+'" data-k="'+k+'" data-sys="'+item.sysyn+'" data-use="'+item.useyn+'" disabled>';
                            }
                            list += '<span class="slider round"></span>';
                            list += '<span class="offtxt">off</span>';
                            list += '<span class="ontxt">on</span>';
                            list += '</label>';
                            list += '</td>';
							list += '<td class="w10">'+item.te_nm+'</td>';
                            list += '<td class="w20 T-left" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">'+item.memo+'</td>';
                            list += '<td class="w10">'+item.reg_name+"("+item.reg_id+")"+'</td>';
                            list += '<td class="w10">'+item.reg_dt+'</td>';
                            if(item.mod_id != ""){
                                list += '<td class="w10">'+item.mod_name+"("+item.mod_id+")"+'</td>';
                                list += '<td class="w10">'+item.mod_dt+'</td>';
                            }else{
                                list += '<td class="w10"></td>';
                                list += '<td class="w10"></td>';
                            }
                            if(item.sysyn == "N"){
                                list += '<td class="w5" style="padding-right:10px">삭제가능</td>';
                            }else{
                                list += '<td class="w5 red" style="padding-right:10px">삭제불가</td>';
                            }
                            list += '</tr>';
            
                            cnt ++;
                        });
                    }

                    $('#list_2').html(list);
                    $('#cnt_2').text(cnt);

                    $("#table_2").trigger("update");
                break;
            }
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
};

/**
 * @description 클릭 시 정보 get
 * @param { 제품군(m), 소속 제품군 구분(d) } k 
 * @param { 해당 코드 (pm_cd, pd_cd) } cd 
 */
function get_detail(k, cd){
    let gubun = '';

    $.ajax({
        url: '/base/common_item/get_detail',
        type: 'GET',
        data: {
            k   : k,
            cd  : cd
        },
        dataType: "json",
        success: function(data) {
            get_set('up', data.info['sysyn']);
            p_cd = cd;
            
            if(k == "m"){
                gubun = "d"
                $('#pm_cd').val(cd).prop('selected',true);
                $('#prod_name').val(data.info['pm_nm']);
                get_list(gubun, cd);
				$('#template').hide();
            }else{
                gubun = "m";
                $('#prod_name').val(data.info['pd_nm']);
				$('#te_uc').val(data.info['te_uc']);
				$('#template').show();
            }
        
            p_k = k;
            $('#pm_cd').prop('disabled', true);
            $('#pm_cd').addClass('gray');

            if(data.info['useyn'] == "Y"){
                $('#useyn').prop('checked', true);
            }else{
                $('#useyn').prop('checked', false);
            }

            if(data.info['sysyn'] == "Y"){
                $('#sysyn').prop('checked', true);
                $('#sysyn').prop('disabled', true);
                $('#sys').addClass('disable');

                if(data.info['useyn'] == "Y"){
                    $('#useyn').prop('disabled', true);
                    $('#use').addClass('disable');
                }else{
                    $('#useyn').prop('disabled', false);
                    $('#use').removeClass('disable');
                }
            }else{
                $('#sysyn').prop('checked', false);
                $('#sysyn, #useyn').prop('disabled', false);
                $('#sys, #use').removeClass('disable');
            }
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
 * @param { 제품군(m), 소속 제품군 구분(d) } k 
 * @param { 제품군 코드 pm_cd } pm 
 * @param { 가용여부 값 } useyn 
 * @param { k 값에 따른 코드 } cd
 */
function stat_change(k, pm, useyn, cd, sysyn){
    $.ajax({
        url: '/base/common_item/stat_change',
        type: 'GET',
        data: {
            k       :   k,
            pm      :   pm,
            useyn   :   useyn,
            cd      :   cd
        },
        dataType: "json",
        success: function(data) {
            switch(data.result_code){
                case 100:
                    toast('가용여부 상태 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
                break;
                case 150:
                    toast('가용여부 상태를 모두 off 할 수 없습니다.', true, 'danger');
                break;
                case 200:
                    toast('가용여부 상태가 변경되었습니다.', false, 'info');
                    if(useyn == "Y"){
                        $('#use_'+cd+'').prop('checked', false);
                        $('#use_'+cd+'').val('N');
                        $('#use_'+cd+'').attr('data-use', 'N');
                    }else{
                        $('#use_'+cd+'').prop('checked', true);
                        $('#use_'+cd+'').val('Y');
                        $('#use_'+cd+'').attr('data-use', 'Y');
                    }

                    if(p_cd == cd){
                        switch(useyn){
                            case 'Y':
                                $('#useyn').prop('checked', false);
                            break;
                            case 'N':
                                $('#useyn').prop('checked', true);
                                if(sysyn == "Y"){
                                    $('#useyn').prop('disabled', true);
                                    $('#use').addClass('disable');                                    
                                }
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
 * @param { 상황별 값 구분 } kind
 * @param { 시스템 사용구분 값 } sysyn
 */
function get_set(kind, sysyn=''){
    $('#p').val(kind);

    switch(kind){
        case 'in':
            p_cd = '';
            p_k = 'm';
            ct_stat = false;
            $('#pm_cd').prop('disabled', false);
            $('#pm_cd').removeClass('gray');
            $('#sysyn, #useyn').prop('disabled', false);
            $('#sys, #use').removeClass('disable');
            get_list('m');
            $('#prod_name, #memo').val('');
            $('#sysyn').prop('checked', false);
			$('#useyn').prop('checked', false);
            $('#in').show();
            $('#up, #del').hide();
			$('#template').hide();
			$("#te_uc option:eq(0)").prop("selected", true);
        break;
        case 'up':
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
        case 'del':
            get_result();
        break;
    }
}

/**
 * @description 필수 입력 값 체크
 */
function input_check(){
    if($('#prod_name').val() == ""){
        toast('코드명을 입력하세요.', true, 'danger');
        $('#prod_name').focus();
        return false;
    }

    return true;
}
