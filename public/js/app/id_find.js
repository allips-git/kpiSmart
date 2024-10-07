/*================================================================================
 * @name: 김원명 - 앱 아이디 찾기
 * @version: 1.0.0, @date: 2022/02/23
 ================================================================================*/
/**
 * @description 아이디 정보 get
 */
function get_id_info(info){
    $.ajax({ 
        url: '/help/id_find/get_id_info',
        type: 'GET',
        data: {
            info : info
        },
        dataType: "json",
        success: function(result) {
            var data = new Array();

            $.each(result.data, function(index, item){
                data.push(item['id']);
            });

            sessionStorage.setItem("info", JSON.stringify(data));

            location_url('/help/id_success');
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}