/*================================================================================
 * @name: 김원명 - 앱 할인쿠폰 설정
 * @version: 1.0.0, @date: 2022/07/26
 ================================================================================*/

$(function(){
    /*$(window).on("scroll", function(){
        if (parseInt($(window).scrollTop()) >= (($(document).height() - $(window).height())*0.9)) // 스크롤 끝 부분쯤 도착했을 시
        { 
            $('#loading').show();
            document.body.scrollIntoView(false);

            setTimeout(function(){
                get_coupon_list();
            },200);
        }
    });*/

    /** 금액, 퍼센트 선택 시 */
    $('input[name="radio"]').off().click(function(){
        $('label').removeClass('coupon_checked');
        $('#amt').val(0);

        var id = $(this).attr('id');

        $('label[for="'+id+'"]').addClass('coupon_checked');

        if( $(this).val() == '001')
        {
            $('.dan').text('원');
        }
        else
        {
            $('.dan').text('%');
        }
    });

    /** 금액 부분 */
    $('#amt').on({ 
        focus: function()
        {
            if ($(this).val() == 0)
            {
                $(this).val('');
            }
        },
        focusout: function()
        {
            if ($(this).val() == '')
            {
                $(this).val(0);
            }
        }
    });

    /** 쿠폰 리스트 선택 시 수정 화면 처리 */
    $('#cp_list').find('li').off().click(function(){
        $('label').removeClass('coupon_checked');
        $('#p').val('up');
        var data = JSON.parse($(this).attr('data-json'));
        var unit = data['unit'] == '001' ? '원' : '%';
        $('#p_cp_uc').val(data['cp_uc']);
        
        if (data['unit'] == '001')
        {
            $('label[for="radio01"]').addClass('coupon_checked');
        }
        else
        {
            $('label[for="radio02"]').addClass('coupon_checked');
        }

        $('#cp_nm').val(data['cp_nm']);
        $('#amt').val(Number(data['amt']));
        $('.dan').text(unit);
        $('.apply_coupon').text('쿠폰 수정');

        $('.coupon_li_pop').bPopup({
            modalClose: true
            , opacity: 0.7
            , positionStyle: 'fixed' 
            , speed: 100
            , transition: 'fadeIn'
            , transitionClose: 'fadeOut'
            , zIndex : 500,
            onOpen: function(){ /** 팝업창 열릴 때 */
                device(3);
            },
            onClose: function(){ /** 팝업창 닫힐 때 */
                device(1);
            }
        });
    });

    /** 쿠폰 등록, 수정 버튼 클릭 시 */
    $('.apply_coupon').off().click(function(){
        get_apply_coupon();
    });
});

/**
 * @description 쿠폰 리스트
 */
function get_coupon_list()
{
    console.log('test');
}

/**
 * @description 쿠폰 등록 / 수정
 */
function get_apply_coupon()
{
    $.ajax({ 
        url: '/cs/coupon/get_apply_coupon',
        type: 'GET',
        data: {
            type  : $('#p').val(),
            cp_nm : $('#cp_nm').val(),
            amt   : $('#amt').val(),
            unit  : $('input[name="radio"]:checked').val(),
            cp_uc : $('#p_cp_uc').val()
        },
        dataType: "json",
        success: function(result) 
        {
            if (result.msg == 'success') /** 성공 */
            {
                swal('완료', '쿠폰이 입력 또는 수정되었습니다.', '', 3).then((result) => {
                    location.reload();
                });
            }
            else if (result.msg == 'error') /** 입력 값 에러 */
            {
                switch (result.detail)
                {
                    case 'cp_nm':
                        swal('알림', '쿠폰명을 입력하세요.', 'cp_nm', 1);
                    break;
                    case 'amt':
                        swal('알림', '금액 또는 퍼센트를 입력하세요.', 'amt', 1);
                    break;
                    case 'amt_over':
                        swal('알림', '퍼센트는 100%를 넘을 수 없습니다.', 'amt', 1);
                    break;
                }
            }
            else /** 통신 에러 */
            {
                swal('알림', '쿠폰 입력 또는 수정에 실패하였습니다. 지속될 경우 관리자에게 문의하세요.', '', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}