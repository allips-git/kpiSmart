/*================================================================================
 * @name: 김원명 - aps_question.js - 2021/05/20
 * @version: 1.0.1 - update => 2021/11/03
 ================================================================================*/
let aps_q_stat = true;

$(function(){
    $('#answer_enroll').off().click(function(){
        if(CKEDITOR.instances['ans_content'].getData() == ""){
            toast('내용을 입력하세요.', true, 'danger');
            CKEDITOR.instances['ans_content'].focus();
            return;
        }
        
        if(aps_q_stat){
            $('#frm').submit();
            aps_q_stat = false;
        }
    });

    $('#checking, #checkcom, #complete').off().click(function(){
        var con;
        var k;

        switch($(this).attr('id')){
            case 'checking':
                k = 'C';
                con = confirm('확인 처리하시겠습니까?');                
            break;
            case 'checkcom':
                k = 'F';
                con = confirm('확인완료 처리하시겠습니까?');
            break;
            case 'complete':
                k = 'Y';
                con = confirm('완료 처리하시겠습니까?');                
            break;
        }

        if(con){
            $.ajax({
                url: '/cs/question/pro',
                type: 'GET',
                data: {
                    i : $('#i').val(),
                    f : k
                },
                dataType: "json",
                success: function(result) {
                    if(result.msg == "success"){
                        toast('처리되었습니다.', false, 'info');
                    }else{
                        toast('에러가 발생했습니다. 잠시 후 다시 시도해주세요.', false, 'info');
                    }
                },
                error: function(e) {
                    $.toast('실패', { sticky: false,type: 'info' });
                },
            });             
        }
    });
});