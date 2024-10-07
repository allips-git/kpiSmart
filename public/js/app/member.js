/*================================================================================
 * @name: 김원명 - 앱 멤버관리 (멤버 추가 및 수정, 상세, 권한 설정)
 * @version: 1.0.0, @date: 2022/07/27
 ================================================================================*/
let member_pop = ['N'];

$(function(){
    $(document).on('click', '.mb_setting, .mb_view, .member_btn_ing', function(){
        switch($(this).attr('class'))
        {
            case 'mb_setting':
                get_member_list('F');
            break;
            case 'mb_view':
                get_member_info($(this).attr('data-cd'));
            break;
            case 'blue member_btn_ing':
                get_member_result();
            break;
        }
    });
});

/**
 * @description 멤버관리 리스트 get
 */
function get_member_list(type)
{
    $.ajax({ 
        url: '/cs/mypage/get_member_list',
        dataType: "json",
        success: function(result) 
        {
            var member = '';

            $.each(result.member, function(index, item){
                member += '<li class="mb_view" data-cd="'+item.ul_uc+'">';
                member += '<div class="mb_img"></div>';
                member += '<div class="mb_info">';
                member += '<h4>'+item.ul_nm+' <span>스탠다드</span></h4>';
                member += '<p>대표</p>';
                member += '</div>';
                member += '</li>';
            });

            $('.member_list').html(member);

            if (type == 'F') /** 초기에만 팝업 open 호출 */
            {
                $('.mb_li_pop').bPopup({
                    modalClose: true
                    , opacity: 0.7
                    , positionStyle: 'fixed' 
                    , speed: 100
                    , transition: 'fadeIn'
                    , transitionClose: 'fadeOut'
                    , zIndex : 500
                    , position : [0, 0]
                    , onOpen: function(){ /** 팝업창 열릴 때 */
                        device(3);
                        member_pop.push('mb_li_pop');
                    }
                });
            }
        },
        error: function(request,status,error) 
        {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        },
    });
}

/**
 * @description 멤버상세 정보 get
 */
function get_member_info(ul_uc)
{
    $.ajax({ 
        url: '/cs/mypage/get_member_info',
        type: 'GET',
        data: 
        {
            ul_uc : ul_uc
        },
        dataType: "json",
        success: function(result) 
        {
            $('#p_ul_uc').val(ul_uc);

            var member = '';

            member += '<div class="top_info">';
            member += '<div class="mem_img"></div>';
            member += '<div class="mem_st">';
            member += '<h4>'+result.member['ul_nm']+'</h4>';
            member += '<p>매니저</p>';
            member += '</div>';
            member += '<a href="tel:'+result.member['tel']+'"><div class="call"></div></a>';
            member += '</div>';
            member += '<div class="bottom_info">';
            member += '<dl>';
            member += '<dt>전화번호 :</dt>';
            member += '<dd class="blue">'+num_format(result.member['tel'],1)+'</dd>';
            member += '</dl>';
            member += '<dl>';
            member += '<dt>등록일 :</dt>';
            member += '<dd>'+result.member['reg_dt']+'</dd>';
            member += '</dl>';
            member += '<dl>';
            member += '<dt>주소 :</dt>';
            member += '<dd>'+result.member['address']+'</dd>';
            member += '</dl>';
            member += '<dl>';
            member += '<dt>상세주소 :</dt>';
            member += '<dd>'+result.member['detail']+'</dd>';
            member += '</dl>';
            member += '<dl>';
            member += '<dt>아이디 :</dt>';
            member += '<dd>'+result.member['id']+'</dd>';
            member += '</dl>';
            member += '<dl>';
            member += '<dt>멤버등급 :</dt>';
            member += '<dd>실장</dd>';
            member += '</dl>';
            member += '</div>';

            $('#member_info').html(member);

            /** 멤버 수정 시 사용 데이터 셋팅 */
            $('#id').val(result.member['id']);
            $('#ul_nm').val(result.member['ul_nm']);
            $('#tel').val(result.member['tel']);
            $('#address').val(result.member['address']);
            $('#addr_detail').val(result.member['detail']);
            $('#biz_zip').val(result.member['biz_zip']);

            $('.mb_detail_pop').bPopup({
                modalClose: true
                , opacity: 0.7
                , positionStyle: 'fixed' 
                , speed: 100
                , transition: 'fadeIn'
                , transitionClose: 'fadeOut'
                , zIndex : 500
                , position : [0, 0]
                , onOpen: function(){ /** 팝업창 열릴 때 */
                    device(3);
                    member_pop.push('mb_detail_pop');
                }
            });
        },
        error: function(request,status,error) 
        {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        },
    });
}

/**
 * @description 멤버 추가/수정
 */
function get_member_result()
{
    $.ajax({ 
        url: '/cs/mypage/get_member_result',
        type: 'GET',
        data: $('#frm').serialize(),
        dataType: "json",
        success: function(result) 
        {
            switch(result.msg)
            {
                case 'success':
                    swal('알림', '멤버 추가 또는 수정되었습니다.', '', 1);

                    if ($('#p').val() == 'in')
                    {
                        get_member_list('N');
                        $('#id, #pass, #pass_chk, #ul_nm, #tel, #address, #addr_detail').val('');
                        member_pop.pop();
                        $('.mb_add_pop').bPopup().close();
                    }
                    else
                    {
                        get_member_list('N');
                        get_member_info($('#p_ul_uc').val());
                        member_pop.pop();
                        $('.mb_add_pop').bPopup().close();
                    }
                break;
                case 'null':
                    swal('알림', ''+$('#'+result.detail+'').attr('data-text')+'를(을) 입력해주세요.', result.detail, 1);
                break;
                case 'error':
                    if (result.detail == 'id_fail')
                    {
                        swal('알림', '아이디는 5~20자리, 특수문자는 사용 불가능합니다.', 'id', 1);
                    }
                    else if(result.detail == 'id_over')
                    {
                        swal('알림', '이미 사용중인 아이디입니다.', 'id', 1);
                    }
                    else if(result.detail == 'pass_fail')
                    {
                        swal('알림', '비밀번호는 6~20자의 특수문자, 영문, 숫자를 혼합해서 사용해주세요.', 'pass', 1);
                    }
                    else if(result.detail == 'pass_noSame')
                    {
                        swal('알림', '비밀번호 확인란이 불일치합니다.', 'pass_chk', 1);
                    }
                break;
                case 'fail':
                    swal('알림', '멤버 추가 또는 수정에 실패하였습니다. 지속될 경우 관리자에게 문의하세요.', '', 1);
                break;
            }
        },
        error: function(request,status,error) 
        {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        },
    });
}

/**
 * @description 키보드가 올라온 상태에서 주소 검색시 디자인 에러로 키보드 내린다음에 주소창이 호출되도록 설정
 * @author 김민주, @version 1.0, @last date 2022/03/03
 */
function call_keyboard()
{
    var os;
    var mobile = (/iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()));  
    // mobile check
    if (mobile) 
    { 
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.search("android") > -1) // agent: android
        { 
            window.androidFunction.downKeyboard();
        } 
    } 
    else 
    {
        call_post(); // web 테스트용
    }
}

function call_post() 
{
    postcode();
}