$(function(){
    $('#ord').off().click(function(){
        var con = custom_fire('발주', '발주 처리하시겠습니까?', '취소', '완료');

        con.then((result) => {
            if(result.isConfirmed){
                get_plan_ord();
            }
        });
    });
});

/**
 * @description 카카오톡 발주 처리
 */
function get_plan_ord(){
    $.ajax({ 
        url: '/ord/plan/get_info',
        type: 'GET',
        data: {
            local_cd    : $('#p_local_cd').val(),
            ord_no      : $('#p_ord_no').val()
        },
        dataType: "json",
        success: function(result) {
            var kakao = new Array();

            kakao['phone'] = result.info['person_tel'];
            kakao['msg'] = ''+result.info['recp_nm']+'님 발주서 요청이 도착했습니다.\r\n\r\n' +
                '- 발신자명 : '+result.info['call_nm']+'\r\n' +
                '- 수신자명 : '+result.info['recp_nm']+'\r\n' +
                '- 주문번호 : '+$('#p_ord_no').val()+'\r\n' +
                '- 주문일자 : '+result.info['ord_dt']+'\r\n' +
                '- 출고일자 : '+result.info['dlv_dt']+'\r\n' +
                '- 제품건수 : '+result.info['item_cnt']+'건\r\n' +
                '- 배송지명 : '+result.info['address']+'\r\n' +
                '- 배송사항 : '+result.info['addr_text']+'\r\n' +
                '-------------------------------------\r\n' +
                ''+result.info['call_nm']+' 관련 문의사항은\r\n' +
                '매장번호 ( '+num_format(result.info['tel'], 1)+' ) 연락바랍니다.';
            
            kakao['template_code']  = 'PLAN03';
            kakao['btn_txts']       = '발주서 보기';
            kakao['btn_urls1']      = 'https://app.plansys.kr/ord/plan?n='+$('#p_ord_no').val()+'&l='+$('#p_local_cd').val()+'&t=P';
            kakao['btn_urls2']      = 'https://app.plansys.kr/ord/plan?n='+$('#p_ord_no').val()+'&l='+$('#p_local_cd').val()+'&t=P';
            kakao['cust_cd']        = $("#p_local_cd").val();
            kakao['ord_no']         = $('#p_ord_no').val();

            app_msg(kakao);
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}