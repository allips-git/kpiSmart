/*================================================================================
 * @name: 김원명 - 앱 고객 등록 및 수정
 * @version: 1.0.0, @date: 2022/02/25
 ================================================================================*/
var stat        = true;
var client_cnt  = -1;

$(function(){
	/** 전화번호 숫자만 입력되도록 설정 */
	$("#tel").on("input", function() {
        $(this).val( $(this).val().replace(/[^0-9]/gi,"") );
    });
    
    $('.delete_client').off().click(function(){
        var con = custom_fire('고객삭제', '해당 고객을 삭제하시겠습니까?', '취소', '삭제');
        
        con.then((result) => {
            if (result.isConfirmed)
            {
                get_client_del();
            }
        });
    });

    $('#in, #nt, #up').off().click(function(){
        if (check_val())
        {
            if (stat)
            {
                get_result($(this).attr('id'));
            }
            else
            {
                swal('처리 중', '잠시만 기다려주세요.', '', 1);
            }
        };
    });
});

/**
 * @description 고객삭제
 */
function get_client_del()
{
    $.ajax({ 
        url: '/client/client_ing/get_client_del',
        type: 'GET',
        data: {
            cust_cd : $('#cust_cd').val()
        },
        dataType: "json",
        success: function(result) {
            if (result.msg == 'success')
            {
                swal('고객삭제', '해당 고객이 삭제되었습니다.', '', 3).then((result) => {
                    client_cnt--; // 고객정보 화면을 보이면 안되므로
                    history.go(client_cnt);
                });
            }
            else
            {
                swal('삭제실패', '해당 고객 삭제에 실패했습니다. 관리자에게 문의하세요.', '', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 고객등록 및 수정 (중복 검증 포함)
 */
function get_result(kind)
{
    stat = false;

    $.ajax({ 
        url: '/client/client_ing/get_result',
        type: 'GET',
        data: $('#frm').serialize(),
        dataType: "json",
        success: function(result) {
            var cust_cd = result.cust_cd;
            var ord_no  = result.ord_no;

            switch (result.msg)
            {
                /** 전화번호 중복 시 */
                case 'overlap':
                    swal('중복', '이미 등록된 전화번호입니다.', '', 1);
                    $('#tel').focus();
                break;
                /** 성공 */
                case 'success':
                    switch (kind)
                    {
                        /** 고객등록 */
                        case 'in': case 'nt':
                            swal('완료', '고객등록이 완료되었습니다.', '', 3).then((result) => {
                                if (kind == 'in')
                                {
                                    history.go(client_cnt);
                                }
                                else
                                {
                                    location_url('/ord/esti_ing?cust_cd='+cust_cd+'&ord_no='+ord_no+'&ord_seq=1&type=A');
                                }
                            });
                        break;
                        /** 고객수정 */
                        case 'up':
                            swal('완료', '고객수정이 완료되었습니다.', '', 3).then((result) => {
                                history.go(client_cnt);
                            });
                        break;
                    }
                break;
                /** 실패 */
                case 'fail':
                    swal('실패', '고객등록 등록 및 수정에 실패하였습니다. 잠시 후 다시 시도해주세요.', '', 1);
                break;
            }

            stat = true;
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 각 태그 값 check
 */
function check_val()
{
    if ($('#cust_nm').val() == '')
    {
        swal('알림', '고객명을 입력하세요.', 'cust_nm', 1);
        return false;
    }

    if ($('#tel').val() == '')
    {
        swal('알림', '전화번호를 입력하세요.', 'tel', 1);
        return false;
    }

    if ($('#address').val() == '')
    {
        swal('알림', '주소를 검색하여 입력하세요.', '', 1);
        //postcode(1);
        return false;
    }

    return true;
};

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
        //alert('app:'+type);
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.search("android") > -1) { // agent: android
            window.androidFunction.downKeyboard();
        } 
    } 
    else 
    {
        //alert('pc:'+type);
        call_post(); // web 테스트용
    }
}

function call_post() 
{
    postcode(1);
}