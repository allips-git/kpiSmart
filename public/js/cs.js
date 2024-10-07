/*================================================================================
* @name: 김원명 - cs.js - 2020/12/14
* @version: 1.0.0
================================================================================*/
$.toast.config.align = 'right';
$.toast.config.width = 400;

$(function(){
    $('#save, #edit').off().click(function(){
        if($('#title').val() == ""){
            $.toast('제목을 입력하세요.', {sticky: true, type: 'danger'});
            $('#title').focus();
            return;
        }
        
        switch($('#k').val()){
            case 'n':
                if(CKEDITOR.instances['contents'].getData() == ""){
                    $.toast('내용을 입력하세요.', {sticky: true, type: 'danger'});
                    CKEDITOR.instances['contents'].focus();
                    return;
                }
            break;
            case 'f':
                if(CKEDITOR.instances['answer'].getData() == ""){
                    $.toast('답변을 입력하세요.', {sticky: true, type: 'danger'});
                    CKEDITOR.instances['answer'].focus();
                    return;
                }                
            break;
        }
        $('#frm').submit();
    });
});