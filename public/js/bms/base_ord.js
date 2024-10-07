/*================================================================================
 * @name: 김원명 - base_ord.js
 * @version: 1.0.0
 ================================================================================*/
$(function(){
    $(".datepicker").datepicker({ /** 달력 */
        dateFormat:'yy-mm-dd'
        , showOn: 'button' 
        , buttonImage: '/public/img/calender_img.png'  // 달력 아이콘 이미지 경로
        , buttonImageOnly: true //  inputbox 뒤에 달력 아이콘만 표시
        , changeMonth: false // 월선택 select box 표시 (기본은 false)
        ,changeYear: false  // 년선택 selectbox 표시 (기본은 false)
        ,setDate : new Date()
    });

    get_list();

    $('input[name="sd"], input[name="ed"]').bind('keyup', function(e){ /** 숫자만 표기 */
        $(this).val($(this).val().replace(/[^0-9]/g,""));
    });

   $('#save').off().click(function(){
        if($('#sd').val() == ""){
            toast('주문 기준시간 전을 입력하세요.', true, 'danger');
            $('#sd').focus();
            return;
        }

        if($('#ed').val() == ""){
            toast('주문 기준시간 후를 입력하세요.', true, 'danger');
            $('#ed').focus();
            return;
        }

        get_save();
   });

    $('#set').off().click(function(){
        if($('#content').val() == ""){
            toast('내용을 입력하세요.', true, 'danger');
            $('#content').focus();
            return;
        }

        get_result('in');
    });

    /** 년도 변경 시 list 변경 */
    $('#year').change(function(){
        get_list();
    });
});

/**
 * @description 휴무일 리스트
 */
function get_list(){
    $.ajax({
        url: '/base/order/get_list',
        type: 'GET',
        data: {
            year : $("#year option:selected").val()
        },
        dataType: 'json',
        success: function(result){
            let dlv_list = '';
            let cnt = 0;

            if(result.list.length > 0){
                $.each(result.list, function(index, item){
                    dlv_list += '<tr>';
                    dlv_list += '<td>'+item.holiday+'</td>';
                    dlv_list += '<td>'+item.content+'</td>';
                    dlv_list += '<td>';
                    dlv_list += '<button type="button" id="btn_de" onclick="get_result(\'de\', \''+item.ikey+'\');">';
                    dlv_list += '<i class="btn_del_icon fa fa-trash" aria-hidden="true"></i> 삭제';
                    dlv_list += '</button>';
                    dlv_list += '</td>';
                    dlv_list += '</td>';
                    dlv_list += '</tr>';

                    cnt++;
                });
            }else{
                dlv_list += '<tr>';
                dlv_list += '<td colspan="3">조회할 데이터가 없습니다.</td>';
                dlv_list += '</tr>';
            }

            $('#list').html(dlv_list);
            $('#cnt').html(cnt);
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
};

/**
 * @description 출고일 설정
 */
 function get_save(){
    $.ajax({
        url: '/base/order/get_save',
        type: 'GET',
        data: $('#frm').serialize(),
        dataType: 'json',
        success: function(result){
            if(result.msg == 'success'){
                toast('저장되었습니다.', false, 'info');
            }else{
                toast('저장실패. 잠시 후 다시 시도해주세요.', false, 'info');
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
};

/**
 * @description 휴무일 등록/삭제
 */
function get_result(p, i=''){
    var con;
    var type;

    switch(p){
        case 'in':
            con = confirm('등록하시겠습니까?');
            type = '등록';
        break;
        case 'de':
            con = confirm('삭제하시겠습니까?');
            type = '삭제';
        break;
    }

    if(con){
        $.ajax({
            url: '/base/order/get_result',
            type: 'GET',
            data: {
                p           : p,
                i           : i,
                holiday     : $('#holiday').val(),
                content     : $('#content').val()
            },
            dataType: 'json',
            success: function(result){
                if(result.msg == 'success'){
                    toast(type+' 완료되었습니다.', false, 'info');
                    $(".datepicker").datepicker('setDate', new Date());
                    $("#content").val("");
                }else if(result.msg == "overlap"){
                    toast('해당 날짜에 이미 휴무일이 등록되어있습니다.', true, 'danger');
                }else{
                    toast(type+'실패. 잠시 후 다시 시도해주세요.', true, 'danger');
                }

                get_list();
            },
            error: function(request,status,error) {
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                $.toast('실패', {sticky: true, type: 'danger'});
            }
        });
    }
};