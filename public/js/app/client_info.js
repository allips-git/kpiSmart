$(function(){
    $("button[id*='deli_']").on('click', function(){
        var ord_no  = $(this).attr('data-ord_no');
        var con     = custom_fire('시공완료', '시공완료 처리하시겠습니까?', '취소', '완료');

        con.then((result) => {
            if (result.isConfirmed)
            {
                get_deil(ord_no);
            }
        });
    });

    $('#ord_cancel').off().click(function(){
        var con     = custom_fire('명세표 취소', '해당 명세표를 취소하시겠습니까?', '취소', '확인');

        con.then((result) => {
            if (result.isConfirmed)
            {
                get_cancle();
            }
        });
    });

    $('.restore').off().click(function(){
        get_s_str('s', 'ord_no', $(this).attr('data-no')); /** 세션 스토리지 */

        var con     = custom_fire('명세표 복원', '해당 명세표를 복원하시겠습니까?', '취소', '확인');

        con.then((result) => {
            if (result.isConfirmed)
            {
                get_restore();
            }
        });
    });
});

/**
 * @description 시공완료 처리
 */
function get_deil(ord_no)
{
    $.ajax({ 
        url: '/client/client_info/get_deil',
        type: 'GET',
        data: {
            ord_no : ord_no
        },
        dataType: "json",
        success: function(result) {
            if (result.msg == 'success')
            {
                location.reload();
            }
            else
            {
                swal('알림', '시공완료 처리에 실패하였습니다. 관리자에게 문의하세요.', '', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}

/**
 * @description 명세표 취소
 */
function get_cancle()
{
    $.ajax({ 
        url: '/client/client_info/get_cancle',
        type: 'GET',
        data: {
            ord_no : get_s_str('g', 'ord_no')
        },
        dataType: "json",
        success: function(result) {
            switch (result.msg)
            {
                case 'success':
                    location.reload();
                break;
                case 'not':
                    swal('알림', '발주 처리된 명세표는 취소가 불가능합니다.', '', 1);
                break;
                case 'fail':
                    swal('알림', '명세표 취소 처리에 실패하였습니다. 관리자에게 문의하세요.', '', 1);
                break;
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}

/**
 * @description 명세표 복원
 */
function get_restore()
{
    $.ajax({ 
        url: '/client/client_info/get_restore',
        type: 'GET',
        data: {
            ord_no : get_s_str('g', 'ord_no')
        },
        dataType: "json",
        success: function(result) {
            switch (result.msg)
            {
                case 'success':
                    location.reload();
                break;
                case 'fail':
                    swal('알림', '명세표 복원 처리에 실패하였습니다. 관리자에게 문의하세요.', '', 1);
                break;
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}