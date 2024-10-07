/*================================================================================
 * @name: 김원명 - 앱 시공시간 설정
 * @version: 1.0.0, @date: 2022/07/26
 ================================================================================*/

$(function(){
    $('#cons_btn').off().click(function(){
        var data = new Array();

        $.each($('input[type="number"]'), function(){
            var info = new Object();

            info['pd_cd'] = $(this).attr('id');
            info['time']  = $(this).val();

            data.push(info);
        });

        get_time_set(data);
    });
});

/**
 * @description 시공시간 수정
 */
function get_time_set(data)
{
    $.ajax({ 
        url: '/cs/cons_time/get_time_set',
        type: 'GET',
        data: {
            data : data
        },
        dataType: "json",
        success: function(result) 
        {
            if (result.msg == 'success')
            {
                swal('알림', '시공시간이 수정 되었습니다.', '', 1);
            }
            else
            {
                swal('알림', '시공시간 수정에 실패하였습니다. 지속될 경우 관리자에게 문의하세요.', '', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}