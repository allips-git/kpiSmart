let lot = new Array();
let ikey = new Array();

$(function(){
    $('#sale_btn, #print_btn').off().click(function(){
        var kind = $(this).attr('data-kind');
        var con;

        if(input_check(kind)){

            switch(kind){
                case 'S':
                    if($('#sale').val() == "del"){
                        con = confirm('배송사원을 삭제하시겠습니까?');
                    }else{
                        con = confirm('배송사원을 수정하시겠습니까?');
                    }
                break;
                case 'P':
                    con = confirm('납품일지를 출력하시겠습니까?');
                break;
            }

            if(con){
                get_result(kind);
            }
        }
    });

    $('#d_excel').off().click(function(){
        var sc      = $('#sc').val();
        var ds      = $('#ds').val();
        var de      = $('#de').val();
        var op_1    = $('#op_1 option:selected').val();
        var op_2    = $('#op_2 option:selected').val();

        $('#down').attr('href', '/ord/deliver_excel?sc='+sc+'&de='+de+'&ds='+ds+'&op_1='+op_1+'&op_2='+op_2);
    });
});

/**
 * @description 배송사원 수정 / 출력 상태변경
 */
function get_result(k){
    $.ajax({ 
        url: '/ord/deliver/get_result',
        type: 'GET',
        data: {
            k       : k,
            lot     : lot,
            sale    : $('#sale').val()
        },
        dataType: "json",
        success: function(result) {
            if(result.msg == 'success'){
                switch(k){
                    case 'S':
                        alert('배송사원이 설정되었습니다.');
                    break;
                    case 'P':
                        get_print();
                    break;
                }
                location.reload();
            }else{
                alert('배송사원이 설정에 실패하였습니다. 잠시 후 다시 시도해주세요.');
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        },
    });
}

/**
 * @description JSP 출력물 연동
 */
function get_print(){
    $('#p_gb').val(print_gb);
    $('#ikey').val(ikey);

    var pop_title = "deliver";

    var _width = '825';
    var _height = '900';
 
    var _left = Math.ceil(( window.screen.width - _width )/2);
    var _top = Math.ceil(( window.screen.height - _height )/2);

    window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);

    var frmData = document.frm_d;

    frmData.target = pop_title;
    if(print_host == 'plan-bms.localhost') {
        frmData.action = print_local+"/nappum.jsp";
    } else {
        frmData.action = print_domain+"/nappum.jsp";
    }

    frmData.submit();
}

/**
 * @description 입력 값 체크
 */
function input_check(kind){

    if($("input:checkbox[name=cp]").is(":checked") == true) {
        $("input:checkbox[name=cp]").each(function(){
            if(this.checked == true){
                lot.push($(this).val());
                ikey.push($(this).attr('data-ikey'));
            }
        });
    }else{
        toast('리스트를 선택해주세요.', true, 'danger');
        return false;
    }

    if(kind == 'S'){
        if($('#sale').val() == ""){
            toast('배송사원을 선택해주세요.', true, 'danger');
            $('#sale').focus();
            return false;
        }
    }

    return true;
}
