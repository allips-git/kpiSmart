/*================================================================================
 * @name: 김원명 - 플랜 오더 앱 => 사업주 회원가입
 * @version: 1.0.0, @date: 2022/01/13
 ================================================================================*/
let sign_stg        = JSON.parse(sessionStorage.getItem("stg"));
let sign_id         = false;
let sign_biz_num    = false;
let pd_cd_arr       = new Array();

$(function(){
    $('#ul_nm').val(sign_stg['name']);
    $('#birthday').val(sign_stg['birthday']);
    $('#tel').val(sign_stg['phone']);

    /** text 폼에 입력 시 변화 */
    $("input:text").on('input', function(){
        if($(this).attr('data-chg') == 'Y'){
            if($(this).val() == ''){
                $(this).parent('div').parent('li').children('span').hide();
            }else{
                $(this).parent('div').parent('li').children('span').show();
            }

            /** 입력 제한 */
            switch($(this).attr('id')){
                case 'id': /** 아이디 => 숫자, 영문, 특수문자 (-) 또는 (_)만 입력가능 */
                    $(this).val( $(this).val().replace(/[^a-zA-Z0-9-_]/gi,"") );
                break;
                case 'biz_num': /** 사업자 등록번호 => 숫자, 하이픈(-)만 가능 */
                    $(this).val( $(this).val().replace(/[^0-9-]/gi,"") );
                break;
            }
        }
    });

    /** 비밀번호 규정 체크 */
    $('#pwd, #pwd_chk').on('propertychange change keyup paste input', function(){
        if(pwd_check($(this))){
            $(this).parent('div').children('.hint').hide();
        }else{
            $(this).parent('div').children('.hint').show();
        }
    });

    /** 아이디, 비밀번호 각 아이콘 클릭 시 */
    $('.id_delete, .show').off().click(function(){
        switch($(this).attr('class')){
            case 'id_delete':
                if(!$('#id').prop('readonly')){
                    $(this).parent('div').children('input:text').val('');
                    $(this).parent('div').children('input:text').focus();
                    $(this).parent('div').parent('li').children('span').hide();
                }
            break;
            case 'show':
                if($(this).parent('div').children('input').attr('type') == 'text'){
                    $(this).parent('div').children('input').attr('type', 'password');
                }else{
                    $(this).parent('div').children('input').attr('type', 'text');
                }

                $(this).parent('div').children('input').focus();
            break;
        }
    });

    /** 중복체크 버튼 클릭 시*/
    $('.dd_chk').off().click(function(){
        var chk_type = $(this).attr('data-type');

        if($(this).text() == '중복체크'){
            if($(this).parent('li').find('input:text').val() == ''){
                if(chk_type == 'id'){
                    swal('알림', '아이디를 입력하세요.', 'id', 1);
                }else{
                    if($('#biz_chk').prop('checked')){
                        swal('알림', '사업자 등록번호 없음을 체크하셨습니다', '', 1);
                    }else{
                        swal('알림', '사업자 등록번호를 입력하세요.', 'biz_num', 1);
                    }
                }
            }else{
                dupl_check(chk_type);
            }
        }else{
            $(this).text('중복체크');

            $(this).parent('li').removeClass('disable');
            $('#'+chk_type+'').prop('readonly', false);
            $('#'+chk_type+'').focus();

            if(chk_type == 'id'){
                sign_id = false;
            }else{
                sign_biz_num = false;
            }
        }
    });

    /** 사업자 등록번호 없음 클릭 시 */
    $('#biz_chk').off().click(function(){
        if($(this).prop('checked')){
            $('#biz_nm').val(sign_stg['name']);
            $('#biz_nm').prop('readonly', true);
            $('#biz_nm').parent('div').parent('li').addClass('disable');
            
            $('#biz_num').val('');
            $('#biz_num').parent('div').parent('li').addClass('disable');
            $('#biz_num').parent('div').parent('li').children('span').hide();
            sign_biz_num = false;
        }else{
            $('#biz_nm').val('');
            $('#biz_nm').prop('readonly', false);
            $('#biz_nm').parent('div').parent('li').removeClass('disable');
            $('#biz_num').parent('div').parent('li').removeClass('disable');
        }
    });

    /** 업종선택 팝업에서 제품 선택 시 */
    $('input:checkbox[name=cd]').off().click(function(){
        if($(this).prop('checked')){
            $('#pd_list').append('<span class="biz_selected" id="'+$(this).val()+'">'+$(this).next('label').text()+' <i class="fa fa-times"></i></span>');
            pd_cd_arr.push($(this).val());
        }else{
            $('#'+$(this).val()).remove();
            var index = pd_cd_arr.indexOf($(this).val());
            if(index > -1){
                pd_cd_arr.splice(index, 1);
            }
        }

        $('#pd_cd').val(pd_cd_arr);
    });

    /** 추가된 업종 X 이미지 클릭 시 삭제 */
    $(document).on('click', '.fa-times', function(){
        var id = $(this).parent('span').attr('id');

        $('#'+id+'').remove();
        var index = pd_cd_arr.indexOf(id);
        if(index > -1){
            pd_cd_arr.splice(index, 1);
        }

        $('#pd_'+id+'').prop('checked', false);
    });

    /** 완료 버튼 클릭 시 */
    $('.login_btn').off().click(function(){
        if(input_check()){ /** 폼 값 검증 */
            Swal.fire({
                title: '알림',
                html: '<br>회원가입을 완료하시겠습니까?.<br>완료 후 결제 화면으로 이동합니다.<br><br>',
                showCancelButton: true,
                confirmButtonColor: '#0176f9',
                cancelButtonColor: '#f1f1f5',
                cancelButtonText: '취소',
                confirmButtonText: '이동'
            }).then((result) => {
                if(result.isConfirmed) {
                    get_join();
                }
            });
        };
    });
});

/**
 * @description 회원가입 완료
 */
function get_join(){
    $.ajax({ 
        url: '/join/sign/get_join',
        type: 'POST',
        data: $('#frm').serialize(),
        dataType: "json",
        success: function(result) {
            switch(result.msg){
                case 'success': /** 회원가입 성공 */
                    Swal.fire({
                        title: '알림',
                        html: "<br>회원가입이 완료되었습니다. 결제화면으로 이동합니다.<br><br>",
                        showCancelButton: false,
                        confirmButtonColor: '#0176f9',
                        confirmButtonText: '확인'
                    }).then((data) => {
                        location_url('/join/payment');
                    });
                break;
                case 'fail': /** 회원가입 실패 */
                    swal('알림', '회원가입에 실패했습니다. 지속될 경우 관리자에게 문의해주세요.', '', 1);
                break;
                case 'id_fail': /** 아이디 검증 실패 */
                    swal('알림', '아이디는 5~20자리, 특수문자는 사용 불가능합니다.', 'id', 1);
                break;
                case 'id_over': /** 아이디 중복 */
                    swal('알림', '이미 사용중인 아이디입니다.', 'id', 1);
                break;
                case 'biz_fail': /** 사업자 등록번호 검증 실패 */
                    swal('알림', '사업자 등록번호는 10자리이상 13자리이하, 숫자와 하이픈(-)만 가능합니다.', 'biz_num', 1);
                break;
                case 'biz_over': /** 사업자 등록번호 중복 */
                    swal('알림', '이미 등록된 사업자 등록번호입니다.', 'biz_num', 1);
                break;
                case 'code_not': /** 존재하지 않는 추천인 코드일 시 */
                    swal('알림', '존재하지 않는 추천인코드입니다.', 'code', 1);
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
 * @description 중복 체크
 */
function dupl_check(type){
    $.ajax({ 
        url: '/join/sign/p_dupl_check',
        type: 'GET',
        data: {
            type : type,
            val  : type == 'id' ? $('#id').val() : $('#biz_num').val()
        },
        dataType: "json",
        success: function(result) {
            if(result.msg == 'success'){
                swal('알림', '중복체크가 완료되었습니다.', '', 1);

                switch(type){
                    case 'id':
                        $('#id').parent('div').parent('li').addClass('disable');
                        $('#id').prop('readonly', true);
                        $('#id').parent('div').parent('li').children('button').text('수정하기');
                        sign_id = true;
                    break;
                    case 'biz_num':
                        $('#biz_num').parent('div').parent('li').addClass('disable');
                        $('#biz_num').prop('readonly', true);
                        $('#biz_num').parent('div').parent('li').children('button').text('수정하기');
                        sign_biz_num = true;
                    break;
                }
            }else if(result.msg == 'over'){
                switch(type){
                    case 'id':
                        swal('알림', '이미 사용중인 아이디입니다.', type, 1);
                    break;
                    case 'biz_num':
                        swal('알림', '이미 등록된 사업자 등록번호입니다.', type, 1);
                    break;
                }
            }else{
                switch(type){
                    case 'id':
                        swal('알림', '아이디는 5~20자리, 특수문자는 사용 불가능합니다.', type, 1);
                    break;
                    case 'biz_num':
                        swal('알림', '사업자 등록번호는 10자리이상 13자리이하, 숫자와 하이픈(-)만 가능합니다.', type, 1);
                    break;
                }
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 입력 폼 값 체크
 */
function input_check(){
    var pd_cd = false;

    if($('#id').val() == '' || sign_id == false){
        swal('알림', '아이디 입력 또는 중복체크를 해주세요.', 'id', 1);
        return false;
    }

    if($('#pwd').val() == ''){
        swal('알림', '비밀번호를 입력하세요.', 'pwd', 1);
        return false;
    }

    if($('#pwd_chk').val() == ''){
        swal('알림', '비밀번호 확인란을 입력하세요.', 'pwd_chk', 1);
        return false;
    }

    if($('#biz_nm').val() == ''){
        swal('알림', '업체 상호를 입력하세요.', 'biz_nm', 1);
        return false;
    }

    $('input:checkbox[name=cd]').each(function(){
        if($(this).prop('checked')){
            pd_cd = true;
        }
    });

    if(!pd_cd){
        swal('알림', '업종선택을 해주세요.', '', 1);
        return false;
    }

    if(!$('#biz_chk').prop('checked')){
        if($('#biz_num').val() == '' || sign_biz_num == false){
            swal('알림', '사업자 등록번호 입력 또는 중복체크를 해주세요.', 'biz_num', 1);
            return false;
        }
    }

    if($('#pwd').val() != $('#pwd_chk').val()){
        swal('알림', '비밀번호 입력란과 확인란이 일치하지 않습니다.', 'pwd_chk', 1);
        $('#pwd_chk').parent('div').children('.hint').show();
        return false;
    }

    if(!pwd_check($('#pwd')) || !pwd_check($('#pwd_chk'))){
        $('#pwd').focus();
        return false;
    }

    return true;
}

/**
 * @description 비밀번호 규정 체크
 */
 function pwd_check(This){
    /** 특수문자, 영문, 숫자 검증 비밀번호 정규식(6자~15자 제한) */
    var regexp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^~*+=-])(?=.*[0-9]).{6,15}$/;

    if(This.attr('id') == 'pwd'){
        if(!(regexp.test(This.val()))) {
            return false;
        }
    }else{
        if($('#pwd').val() != $('#pwd_chk').val()){
            return false;
        }
    }

    return true;
}