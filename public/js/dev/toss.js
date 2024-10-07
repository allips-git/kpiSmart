/*================================================================================
 * @name: 김원명 - 토스페이먼츠 결제 모듈
 * @version: 1.0.0, @date: 2022/01/21
 ================================================================================*/
/**
 * @description 토스페이먼츠 결제 모츌 호출
 */
function payment(data, type){ /** type => 결제금액 유무 (Y : 있음, N : 없음) */
    if(type == 'Y'){
        var tossPayments = TossPayments(clientKey);

        tossPayments.requestPayment(data.type, {                                                /** 카드, 계좌이체 2가지, 추후 가상계좌 추가 예정 */
            amount: Number(data.amount),                                                        /** 금액 */
            orderId: ''+data.gb+'_'+Math.random().toString(36).substr(2, 11),                   /** 랜덤 주문 ID data_gb ( 앱 : APP, 센터 : CENTER, 공장 : BMS ) */
            orderName: data.orderName,                                                          /** 제품명 */
            customerName: data.customerName,                                                    /** 고객명(주문자명) */
            successUrl: window.location.origin+'/api/toss/get_request?pay_uc='+data.pay_uc+'&gb='+data.gb+'&cp_uc='+data.cp_uc+'',
            failUrl: window.location.origin+'/api/toss/fail?pay_uc='+data.pay_uc+'&gb='+data.gb+'&cp_uc='+data.cp_uc+'',
        }).catch(function (error) {
            if(error.code === 'USER_CANCEL'){ /** 결제 화면이 닫혔을 때 */ 
                switch(data.gb){
                    case 'APP':
                        device(1);
                    break;
                    case 'CENTER':
                    break;
                    case 'BMS':
                    break;
                }
                /** 결제 모듈 닫을 시 처리 루틴 */
            }
        });
        /** 성공, 실패 URL => pay_uc(이용권 고유 코드), gb(앱[APP], 센터[CENTER], 공장[BMS]), cp_uc(쿠폰 번호) */
    }else{
        location_url('/api/toss/get_coupon_pay?pay_uc='+data.pay_uc+'&gb='+data.gb+'&cp_uc='+data.cp_uc+'');
    }
}