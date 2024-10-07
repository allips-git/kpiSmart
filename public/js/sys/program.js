/*================================================================================
 * @name: 김원명 - prod_process.js
 * @version: 1.0.0, @date: 2020-09-21
 ================================================================================*/

$.toast.config.align = 'right';
$.toast.config.width = 400; 

var list_ord = new Array();
var list_ikey = new Array();

var p;
var k;

/** url로 메뉴 구분 */
var gubun;

switch(window.location.pathname){
    case '/bms/program': case '/bms/pro_li':
        gubun = "bms";
    break;
    case '/center/program': case '/center/pro_li':
        gubun = "center";
    break;
    case '/app/program': case '/app/pro_li':
        gubun = "app";
    break;
    case '/aps/program': case '/aps/pro_li':
        gubun = "aps";
    break;
}

$(function(){
    $('#head').off().change(function(){ // 첫번째 메뉴명 select box 선택 시
        get_program($(this).val(), 'S');
    });

    $('#shead').off().change(function(){ // 두번째 메뉴명 selecte box 선택 시
        $('#before').hide();
        $('#after').show();
        get_program($(this).val(), 'N');
    });

    $('#add, #modify').off().click(function(){
        if(check_val()){
            send();
        }
    });

    $('#reset').off().click(function(){
        reset();
    });

    $("#after").sortable({ // jquery-ui 이용하여 메뉴 목록 드래그 앤 드롭 이용
        update : function(e, ui){ // 리스트를 드래그하여 순서 변경 시 적용됨.
            var data = $('#after').children('tr');
            
            $.each(data, function(index, item){ // 드래그 후 리스트 정렬 순서 ikey를 list_key에 배열로 값 저장
                list_ikey.push(item.dataset['ikey']);
            });

            /**
             * 저장된 배열에 따라 순서를 재정렬
             */
            $.ajax({
                url: '/'+gubun+'/program/menu_ord_update',
                type: 'GET',
                data: {
                    ikey : list_ikey,
                    ord : list_ord
                },
                dataType: "json",
                success: function(result) {
                    if(result.msg == "success"){
                        $.toast('메뉴 리스트 순서가 변경되었습니다.', {sticky: false, type: 'info'});
                        get_program(p, k);
                    }else{
                        $.toast('메뉴 변경 중에 문제가 발생했습니다. 계속될 경우 관리자에게 문의바랍니다.', {sticky: true, type: 'danger'});                        
                    }
                },
                error: function(request,status,error) {
                    alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                    $.toast('실패', {sticky: true, type: 'danger'});
                },
            });            
        }
    });
});

/**
 * 
 * @param {program_list 테이블 code id} pgmid 
 * @param {대, 소메뉴 구분 함수} kind 
 */
function get_program(pgmid, kind){
    reset();
    var s_list;

    $.ajax({ 
        url: '/'+gubun+'/program/get_program',
        type: 'GET',
        data: {
            pgmid : pgmid,
            kind : kind
        },
        dataType: "json",
        success: function(result) {
            console.log(result);
            switch(result.gubun){
                case 'S': // 첫번째 선택 시 두번째 메뉴 list view
                    $('#shead').html('<option value="">:: 선택하세요</option>');
                    
                    $.each(result.data, function(index, item){
                        $('#shead').append('<option value='+item.pgmid+'>'+item.program+'</option>');
                    });
                break;
                case 'N': // 두번째 메뉴 선택 시 메뉴 목록에 list view
                    p = pgmid;
                    k = kind;

                    list_ord = [];
                    list_ikey = [];

                    if(result.data.length == 0){
                        $('#after').html('<tr><td colspan="6">메뉴가 없습니다. 메뉴를 추가해주세요.</td></tr>');
                    }else{
                        $.each(result.data, function(index, item){
                            list_ord.push(item.ord); // 불러온 리스트 순서를 배열에 저장
                            var num = index + 1;
    
                            s_list += '<tr data-ord="'+item.ord+'" data-ikey="'+item.ikey+'">';
                            s_list += '<td class="w5">'+num+'</td>';
                            if(item.confirmyn == "N"){
                                s_list += '<td class="T-left" style="color:blue; cursor:pointer;" onclick="javascript:get_edit_data(\''+item.pgmid+'\', \''+item.program+'\', \''+item.url+'\', \''+item.popupyn+'\', \''+item.useyn+'\')">'+item.program+'</td>';
                            }else{
                                s_list += '<td class="T-left">'+item.program+'</td>';
                            }
                            s_list += '<td class="T-left">'+item.url+'</td>';
                            if(item.useyn == "Y"){
                               s_list += '<td class="w10">활성</td>';
                            }else{
                               s_list += '<td class="w10">비활성</td>';
                            }
                            s_list += '<td class="w10">'+item.popupyn+'</td>';
                            if(item.confirmyn == "N"){
                                s_list += '<td class="w10"><button type="button" onclick="go_del(\''+item.pgmid+'\')">삭제</button></td>';
                                s_list += '<td class="w10"><button type="button" onclick="conf(\''+item.pgmid+'\')">확정</button></td>';
                            }else{
                                s_list += '<td class="w10 red">확정완료</td>';
                                s_list += '<td class="w10 red">확정완료</td>';                            
                            }
                            s_list += '</tr>';
                        });
    
                        $('#after').html(s_list);
                    }
                break;
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * 검증 후 데이터 insert OR update
 */
function send(){
    var con;
    if($('#p').val() == "in"){
        con = confirm('입력하시겠습니까?');
    }else{
        con = confirm('수정하시겠습니까?');
    }
    if(con){
        $.ajax({ 
            url: '/'+gubun+'/program/v',
            type: 'POST',
            data: {
                p : $('#p').val(),
                parentsid : $('#shead').val(),
                program : $('#program').val(),
                url : $('#url').val(),
                function : $("input[name=kind]:checked").val(),
                popupyn : $("input[name=popupyn]:checked").val(),
                useyn : $("input[name=useyn]:checked").val(),
                pgmid : $('#i').val()
            },
            dataType: "json",
            success: function(result) {
                switch(result.msg){
                    case 'success':
                        get_program($('#shead').val(), 'N');
                        $('#program, #url').val('');
                        $.toast('정상 처리되었습니다.', {sticky: false, type: 'info'});
                    break;
                    case 'error':
                        $.toast('에러가 발생했습니다. 잠시 후 다시 시도해주세요.', {sticky: true, type: 'danger'});
                    break;
                    case 'fail':
                        $.toast('입력 값이 잘못되었습니다.', {sticky: true, type: 'danger'});
                    break;
                }
            },
            error: function(request,status,error) {
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                $.toast('실패', {sticky: true, type: 'danger'});
            },
        });
    }
}

/**
 * 해당 목록 확정버튼 클릭 시 확정 처리
 */
function conf(pgmid){
    var con = confirm('확정 처리하시겠습니까?');
    if(con){
        $.ajax({
            url: '/'+gubun+'/pro_li/conf',
            type: 'GET',
            data: {
                pgmid : pgmid
            },
            dataType: "json",
            success: function(result) {
                switch(result.msg){
                    case 'success':
                        get_program($('#shead').val(), 'N');
                        $('#program, #url').val('');
                        $.toast('확정 처리되었습니다.', {sticky: false, type: 'info'});
                    break;
                    case 'error':
                        $.toast('에러가 발생했습니다. 잠시 후 다시 시도해주세요.', {sticky: true, type: 'danger'});
                    break;
                }
            },
            error: function(request,status,error) {
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                $.toast('실패', {sticky: true, type: 'danger'});
            },                
        });
    }
}

/**
 * 해당 목록 삭제 버튼 클릭 시 삭제 ( table data 삭제됨 )
 */
function go_del(pgmid){
    var con = confirm('해당 메뉴를 삭제하시겠습니까? 삭제 시 복구 할 수 없습니다.');
    if(con){
        $.ajax({
            url: '/'+gubun+'/program/go_del',
            type: 'GET',
            data: {
                pgmid : pgmid
            },
            dataType: "json",
            success: function(result) {
                switch(result.msg){
                    case 'success':
                        get_program($('#shead').val(), 'N');
                        $('#program, #url').val('');
                        $.toast('삭제되었습니다.', {sticky: false, type: 'info'});
                    break;
                    case 'error':
                        $.toast('에러가 발생했습니다. 잠시 후 다시 시도해주세요.', {sticky: true, type: 'danger'});
                    break;
                }
            },
            error: function(request,status,error) {
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                $.toast('실패', {sticky: true, type: 'danger'});
            },                
        });
    }    
}

/**
 * 메뉴 목록에서 해당 메뉴 클릭 시 수정 모드로 변경
 */
function get_edit_data(pgmid, program, url, popupyn, useyn){
    $('#i').val(pgmid);
    $('#program').val(program);
    $('#url').val(url);
    $('#p').val('up');
    switch(popupyn){
        case 'Y':
            $("input:radio[name='popupyn']:radio[value='Y']").prop("checked",true);
        break;
        case 'N':
            $("input:radio[name='popupyn']:radio[value='N']").prop("checked",true);
        break;
    }

    switch(useyn){
        case 'Y':
            $("input:radio[name='useyn']:radio[value='Y']").prop("checked",true);
        break;
        case 'N':
            $("input:radio[name='useyn']:radio[value='N']").prop("checked",true);
        break;
     }    

    $('#add').hide();
    $('#modify').show();
}

/**
 * 값 추가, 수정 시 공백값 체크
 */
function check_val(){
    if($('#head').val() == "" || $('#shead').val() == ""){
        $.toast('메뉴를 선택하세요.', {sticky: true, type: 'danger'});
        return false;
    }
    if($('#program').val() == ""){
        $.toast('메뉴 명칭을 입력하세요.', {sticky: true, type: 'danger'});
        $('#program').focus();
        return false;
    }
    if($('#url').val() == ""){
        $.toast('경로(url)을 입력해주세요.', {sticky: true, type: 'danger'});
        $('#url').focus();
        return false;
    }
    if($('#url').val().substr(0,1) != "/"){
        $.toast('경로(url)을 정확히 입력해주세요.', {sticky: true, type: 'danger'});
        $('#url').focus();
        return false;
    }
    return true;
}

/**
 * reset
 */
function reset(){
    $('#program, #url').val('');

    $('#add').show();
    $('#modify').hide();
    $('#p').val('in');
    $("input:radio[name='popupyn']:radio[value='N']").prop("checked",true);
    $("input:radio[name='useyn']:radio[value='Y']").prop("checked",true);
}