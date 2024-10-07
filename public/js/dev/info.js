$(function(){
    $('#img').change(function(){
        let img_len = $('#img')[0].files;

        if(img_len.length == 1){
            if(file_check()){
                $('#k').val('i');
                var reader = new FileReader();
                reader.onload = function(e) {
                    $('#pic').attr('src', e.target.result);
                }
                reader.readAsDataURL(this.files[0]);
            }
        }else{
            $('#pic').attr('src', '/public/img/no_img.jpg');
        };
    });

    $('#save').off().click(function(){
    	var site_name = $('#site_name').val();
    	var input_check_result;
    	if(site_name === 'bms_info'){
			input_check_result = input_check();
		}else if(site_name === 'center_info'){
    		input_check_result = center_input_check();
		}
        if(input_check_result){
            if(confirm('저장하시겠습니까?')){
                get_result();
            }
        }
    });

    $('#file_del').off().click(function(){
        if(confirm('파일을 삭제하시겠습니까? 저장하기 클릭 시 적용됩니다.')){
            $('#k').val('d');
            $('#pic').attr('src', '/public/img/no_img.jpg');
            $('#img').val('');
        }
    });
});

function get_result(){
    let form = $('#frm')[0];

    $.ajax({
        url: '/base/info/u',
        type: 'POST',
        enctype: 'multipart/form-data',
        data: new FormData(form),
        dataType: "json",
        processData: false,
        contentType: false,
        success: function(data) {
        	console.log(data);
            if(data.result_code == 200){
                toast('저장되었습니다.', false, 'info');
				$('#pic').attr('src', data.file_path);
            }else{
                toast('저장에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
            }
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
};

/**
 * @description bms_info 필수 입력 값 검증
 */
function input_check(){
    let info_chk_stat = true;
    let info_id = ['biz_nm', 'biz_cd', 'tel', 'post_code', 'ceo_nm'];

    $.each(info_id, function(index, item){
        if($('#'+item+'').val() == ""){
            toast(''+$('#'+item+'').attr('data-text')+'를(을) 입력하세요.', true, 'danger');
            $('#'+item+'').focus();
            info_chk_stat = false;
            return false;
        }
    });

	/** 사업자번호 유효성 체크 */
	let biz_cd = $("#biz_cd").val().replaceAll('-','');

	if(biz_cd.length === 10 || biz_cd.length === 13){

	}else{
		toast('사업자등록번호는 10자리 법인등록번호는 13자리입니다. 제대로 입력 해주세요.', true, 'danger');
		$('#biz_cd').focus();
		return false;
	}

	return info_chk_stat;
}

function center_input_check() {
	let info_chk_stat = true;
	let info_id = ['biz_nm', 'tel'];

	$.each(info_id, function(index, item){
		if($('#'+item+'').val() == ""){
			toast(''+$('#'+item+'').attr('data-text')+'를(을) 입력하세요.', true, 'danger');
			$('#'+item+'').focus();
			info_chk_stat = false;
			return false;
		}
	});

	/** 사업자번호 유효성 체크 */
	let biz_num = $("#biz_num").val().replaceAll('-','');

	if(biz_num.length !== 0){
		if(biz_num.length >= 10 && biz_num.length <= 13){

		}else{
			toast('등록번호는 10자리에서 13자리내에 입력해주셔야 합니다. 제대로 입력 해주세요.', true, 'danger');
			$('#biz_num').focus();
			return false;
		}
	}

	return info_chk_stat;
}

/**
 * @description 파일 확장자, 용량 체크
 */
function file_check(){
    let ext = $("#img").val().split(".").pop().toLowerCase();
    let maxSize = 2 * 1024 * 1024; // 2MB

	var fileSize = $("#img")[0].files[0].size;
	if(fileSize > maxSize){
		toast('이미지 파일 용량 제한은 5MB 입니다.', true, 'danger');
		$("#img").val("");
		return false;
	}

	if($.inArray(ext, ["jpg", "jpeg", "png"]) == -1) {
		toast('첨부파일은 이미지만 등록 가능합니다.', true, 'danger');
		$("#img").val("");
		return false;
	}

    return true;
}
