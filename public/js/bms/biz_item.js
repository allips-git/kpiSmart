/*================================================================================
 * @name: 김원명 - biz_item.js
 * @version: 1.0.0, @date: 2021-06-01
================================================================================*/
$.toast.config.align = 'right';
$.toast.config.width = 400;

var chk_arr = new Array();

$(function(){
    $("#buyer").select2({
        language:{
            /** 대기 중 text */
            searching : function(){
                return "검색 중입니다.";
            },
            /** 검색된 결과 값이 없을 때 text */
            noResults:function(){
                return "결과값이 없습니다.";
            }
        },
        /** 기본적으로 표기되는 text */
        placeholder: "매입처_전체",
        ajax : {
            url : '/biz/biz_item/get_buyer',
            dataType : 'json',
            delay: 250,
            data : function(params){
                return{
                    sc : params.term // 검색 시 입력되는 값
                };
            },
            processResults: function (data) {
                return {
                  results: data // 결과 값 뿌려줌 ( id(select value), text(select text) ) 지정값을 id와 text로 명칭해줘야됨.
                };
            },
            cache: true
        }
    });

    $('#e, #d').off().click(function(){
        var gubun = $(this).attr('id');
        var chk = false;
        chk_arr = [];
        
        $("input:checkbox").each(function(){
            if($(this).attr('id') != 'chk_all'){
                if($(this).is(":checked") == true){
                    chk = true;
                    chk_arr.push($(this).val());
                }
            }
        });

        if(chk){
            if($('#buyer option:selected').val() == null && gubun == "e"){
                $.toast('입력할 매입처를 선택하세요.', {sticky: true, type: 'danger'});
                return false;
            }else{
                var con = confirm('처리하시겠습니까?');

                if(con){
                    choice_action(gubun);
                }
            }
        }else{
            $.toast('수정 및 삭제할 데이터를 체크하여 선택하세요.', {sticky: true, type: 'danger'});
            return false;
        }
    });

    $('#buyer').change(function(){
        if($(this).val() == "0"){ /** 매입처_전체 => 선택 시 값 초기화 */
            $(this).html('');
        }
        var b = $.trim($('#buyer option:selected').text());
        $('#b').val(b);
    });
});

/**
 * 선택 수정, 삭제
 */
function choice_action(gubun){
    $.ajax({ 
        url: '/biz/biz_item/choice_action',
        type: 'get',
        data: {
            gubun : gubun,
            arr_ikey : chk_arr,
            buy_cd : $('#buyer option:selected').val()
        },
        dataType: "json",
        success: function(result) {
            if(result.msg == "success"){
                $.toast('완료되었습니다.', {sticky: false, type: 'info'});

                var buyer_name = $.trim($('#buyer option:selected').text());

                $.each(result.arr, function(index, item){
                    switch(result.gubun){
                        case 'e':
                            $('#buyer_'+item+'').removeClass('blue');
                            $('#buyer_'+item+'').text(buyer_name);
                        break;
                        case 'd':
                            $('#buyer_'+item+'').addClass('blue');
                            $('#buyer_'+item+'').text('미등록');
                        break;
                    }
                });
            }else{
                $.toast('에러가 발생했습니다. 잠시 후 다시 시도해주세요.', {sticky: true, type: 'danger'});
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });    
}