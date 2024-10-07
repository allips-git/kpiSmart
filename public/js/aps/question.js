/*================================================================================
* @name: 김원명 - question.js - 2020/12/11
* @version: 1.0.0
================================================================================*/
let q_stat = true;

$(function(){
    $('#save').off().click(function(){
        if(input_check()){
            if(q_stat){
                $('#frm').submit();

                q_stat = false;
            }else{
                alert('진행 중입니다. 잠시만 기다려주세요.');
                return;
            }
        }
    });

    $('#q_file').change(function(){
        file_check();
    });

    /** 엔터키 방지 */
    $('#qn_title').keydown(function(){
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    });
});

/**
 * @description 필수 입력 값 체크
 */
function input_check(){
    if($('#qn_title').val() == ""){
        toast('제목을 입력하세요.', true, 'danger');
        $('#qn_title').focus();
        return false;
    }
    
    if(CKEDITOR.instances['qn_content'].getData() == ""){
        toast('내용을 입력하세요.', true, 'danger');
        CKEDITOR.instances['qn_content'].focus();
        return false;
    }

    return true;
}

/**
 * @description 파일 확장자, 용량 체크
 */
 function file_check(){
    let ext = $("#q_file").val().split(".").pop().toLowerCase();
    let maxSize = 2 * 1024 * 1024; // 2MB

	var fileSize = $("#q_file")[0].files[0].size;
	if(fileSize > maxSize){
		toast('이미지 파일 용량 제한은 2MB 입니다.', true, 'danger');
		$("#q_file").val("");
		return false;
	}

	if($.inArray(ext, ["jpg", "jpeg", "png", "gif", "bmp", "pdf"]) == -1) {
		toast('첨부파일은 이미지만 등록 가능합니다.', true, 'danger');
		$("#q_file").val("");
		return false;
	}

    return true;
}