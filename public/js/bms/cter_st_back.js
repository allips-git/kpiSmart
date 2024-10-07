var send_val = new Array();

$(function(){
    $('.btn_send').off().click(function(){
        var chk = false;
        send_val = [];

        $("input:checkbox").each(function(){
            if($(this).attr('id') != 'chk_all' && $(this).attr('data-chk') == 'Y'){
                if($(this).is(":checked") == true){
                    send_val.push($(this).val());
                    chk = true;
                }
            }
        });

        if(!chk) {
            alert('전송할 대상을 선택하세요.');
            return;            
        }else{
            open_popup();
            get_send_data('S');
        }
    });

    $('#send').off().click(function(){
        if(confirm('전송하시겠습니까?')){
            get_send();
            $('#loading').show();
        }
    });

    $(document).on('change', '#p_op_1, #p_op_2',function(){
        switch($(this).attr('id')){
            case 'p_op_1':
                get_send_data('O1');
            break;
            case 'p_op_2':
                get_send_data('O2');
            break;
        }
    });

    /* 리스트 => 사용여부 on / off */
    $(document).on('click', '.switch', function(){
        let uc    = $(this).children('input').attr('data-uc');
        let useyn = $(this).children('input').val();

        if(confirm('가용 여부를 변경하시겠습니까?')){
            stat_change(uc, useyn);
        }
    });

    /** 전체 checkbox on/off */
    $('#chk_all').off().click(function(){
        if($('input:checkbox[id="chk_all"]').is(':checked') == true){
            $("input[type=checkbox]").prop("checked", true);
            $("input[type=checkbox]").parents('tr').addClass('active');
            $("input[type=checkbox]").parents('tr').next().addClass('active');
        }else{
            $("input[type=checkbox]").prop("checked", false); 
            $("input[type=checkbox]").parents('tr').removeClass('active');
            $("input[type=checkbox]").parents('tr').next().removeClass('active');
        }
    });
    $('input[type=checkbox]').click(function(){
        if($(this).is(':checked') == true){
            $(this).parents('tr').addClass('active');
            $(this).parents('tr').next().addClass('active');
        }else{
            $(this).prop("checked",false);
            $(this).parents('tr').removeClass('active');
            $(this).parents('tr').next().removeClass('active');
        }
    });
});

/**
 * @description 팝업창 활성화 시 리스트 셋팅
 */
function get_send_data(type){
    $.ajax({
        url: '/work/cter_st/get_send_data',
        dataType: "json",
        data : {
            type : type,
            op_1 : $('#p_op_1 option:selected').val(),
            op_2 : $('#p_op_2 option:selected').val()
        },
        success: function(data) {
            var sel_1   = '';
            var sel_2   = '';
            var data_list  = '';
            var sel_list   = '';

            if(data.proc.length == 0){
                sel_list += '<dd class="no_list">선택 가능한 라우터가 없습니다. 라우터를 활성화해주세요.</dd>';

                $('#sel_list').html(sel_list);
            }else{
                if(type == 'S'){
                    sel_1 += '<select name="p_op_1" id="p_op_1" class="w15">';
                    $.each(data.work, function(index, item){
                        sel_1 += '<option value="'+item.wp_uc+'">'+item.wp_nm+'</option>';
                    });
                    sel_1 += '</select>';
                    $('#sel_1').html(sel_1);
                }

                if(type == 'S' || type == 'O1'){
                    sel_2 += '<select name="p_op_2" id="p_op_2" class="w18">';
                    $.each(data.proc, function(index, item){
                        sel_2 += '<option value="'+item.pc_uc+'">'+item.pc_nm+'</option>';
                    });
                    sel_2 += '</select>';
                    $('#sel_2').html(sel_2);
                }
            }

            if(data.list.length == 0){
                data_list += '<tr><td colapsn="8">조회할 데이터가 없습니다.</td></tr>';
            }else{
                $.each(data.list, function(index, item){
                    var chk = '';
                    if(item.useyn == 'Y'){
                        chk = 'checked';
                    }else{
                        chk = '';
                    }
                    data_list += '<tr>';
                    data_list += '<td class="w10">'+item.pr_seq+'</td>';
                    data_list += '<td class="T-left">'+item.pp_nm+'</td>';
                    data_list += '<td>'+item.next_seq+'</td>';
                    data_list += '<td class="w10">'+item.pp_gb+'</td>';
                    data_list += '<td class="w10">'+item.pp_hisyn+'</td>';
                    data_list += '<td class="T-left w30">';
                    data_list += '<p class="Elli T-left">'+item.memo+'</p>';
                    data_list += '</td>';
                    data_list += '</tr>';

                });

                $('#data_list').html(data_list);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 가용여부 on / off update (사용안함 2021/01/04)
 */
 function stat_change(uc, useyn){
    $.ajax({
        url: '/work/cter_st/stat_change',
        type: 'GET',
        data: {
            uc      : uc,
            useyn   : useyn,
        },
        dataType: "json",
        success: function(data) {
            switch(data.result_code){
                case 100:
                    toast('사용여부 상태 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
                break;
                case 200:
                    toast('사용여부 상태가 변경되었습니다.', false, 'info');
                    if(useyn == "Y"){
                        $('#use_'+data.uc+'').prop('checked', false);
                        $('#use_'+data.uc+'').val('N');
                    }else{
                        $('#use_'+data.uc+'').prop('checked', true);
                        $('#use_'+data.uc+'').val('Y');
                    }
                break;
            }

            get_send_data('O2');
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 전송
 */
function get_send(){
    $.ajax({
        url: '/work/cter_st/get_send',
        type: 'GET',
        data: {
            wp_uc : $('#p_op_1 option:selected').val(),
            pc_uc : $('#p_op_2 option:selected').val(),
            list : send_val
        },
        dataType: "json",
        success: function(data) { 
            if(data.msg == 'success'){
                alert('전송되었습니다.');
                location.reload();
            }else{
                alert('전송에 실패하였습니다. 잠시 후 다시 시도해주세요.');
            }

            $('#loading').hide();
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },

    });
}