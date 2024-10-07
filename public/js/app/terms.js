/*================================================================================
 * @name: 김원명 - 플랜 오더 앱 => 약관 동의 화면
 * @version: 1.0.0, @date: 2022/01/13
 ================================================================================*/
let chk_id  = '';
let stg     = new Object();

$(function(){
    /** 화살표 이미지 클릭 시 */
    $('.arrow').off().click(function () {
        chk_id = $(this).parent('li').children('input').attr('id');
        $('h2').text($(this).attr('data-text'));

        /** 팝업 호출 및 내용 view 처리 */
        terms_open($(this).attr('data-gb'));
    });

    /** 약관 동의 화면에서 약관동의 버튼 클릭 시 */
    $('#agree').off().click(function(){
        $('#'+chk_id+'').prop('checked', true);
        $('.terms_pop').bPopup().close();

        $('.terms').removeClass('blur');
        $('.header').removeClass('blur');
    });

    /** 약관동의 본인인증 버튼 클릭 시 */
    $('#certi').off().click(function(){
        let stat = true;

        $('input:checkbox').each(function(index, item){
            if($(this).attr('data-req') == 'Y' && !$(this).prop('checked')){
                stat = false;
            }

            if($(this).attr('data-req') == 'N'){
                stg['agree'] = $(this).is(":checked") ? 'Y' : 'N';
            }
        });

        if(stat){
            token();
        }else{
            Swal.fire({
                title: '알림',
                html: "<br><span style='color:#0176F9; font-size: 18px !important'>필수약관 동의를 선택해주세요</span>.<br>약관 동의 후 회원가입이 가능합니다.<br><br>",
                showCancelButton: false,
                confirmButtonColor: '#0176F9',
                confirmButtonText: '확인'
            });
        }
    });
});

/**
 * @description 약관별 내용 가져오기
 */
function terms_open(main_gb){
    $.ajax({ 
        url: '/join/terms/get_terms',
        type: 'GET',
        data: {
            main_gb : main_gb
        },
        dataType: "json",
        success: function(result) {
            /** 약관 내용 html */
            $('.text_zone').html(result.content);

            /** 팝업창 함수 => bPopup */
            $('.terms_pop').bPopup({
                modalClose: true,
                opacity: 0.4,
                follow: [
                    false, false
                ],
                bottom:0,
                speed: 300,
                transition: 'slideUp',
                transitionClose: 'fadeOut',
                zIndex: 99997,
                onOpen: function(){ /** 팝업창 열릴 때 */
                    $('.terms').addClass('blur');
                    $('.header').addClass('blur');
                },
                onClose: function(){ /** 팝업창 닫힐 때 */
                    $('.terms').removeClass('blur');
                    $('.header').removeClass('blur');
                }
            });
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}