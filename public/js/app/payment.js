/*================================================================================
 * @name: 김원명 - 플랜 오더 앱 => 결제 요청 화면
 * @version: 1.0.0, @date: 2022/01/21
 ================================================================================*/

let p_data      = new Object();
let p_cp_uc     = '';
p_data['type']  = '카드';


$(function(){
    $('.user-payment').off().click(function(){
        $('.userpay-pop').bPopup({
            modalClose: true
            , opacity: 0.5
            , positionStyle: 'fixed' 
            , speed: 300
            , transition: 'fadeIn'
            , transitionClose: 'fadeOut'
            , zIndex : 99997
            , follow : [false, false],
            onOpen: function(){ 
                $('.contain').addClass('h100');
                $('.header').addClass('blur')
            },
            onClose: function(){ 
                $('.contain').removeClass('h100');
                $('.header').removeClass('blur')
            }
        });
    });

    /** 결제 방식 선택 시 */
    $('input:radio[name=chk]').off().click(function(){
        p_data['type'] = $(this).val();
    });

    /** 결제 go */
    $('#pay').off().click(function(){
        get_pay_info($('input[name=pay]:checked').val());
    });

    /** 쿠폰 등록 */
    $('.cp_btn').off().click(function(){
        if($('#cp_uc').val() != ''){
            if(p_cp_uc.toUpperCase() == $('#cp_uc').val().toUpperCase()){
                swal('알림', '이미 적용 중인 쿠폰 번호입니다.', 'cp_uc', 1);
            }else{
                if(p_cp_uc != ''){
                    Swal.fire({
                        title: '알림',
                        html: '<span>이미 쿠폰이 적용 중입니다.</span><br>해당 쿠폰으로 변경하시겠습니까?<br><br>',
                        showCancelButton: true,
                        confirmButtonColor: '#0176f9',
                        cancelButtonColor: '#f1f1f5',
                        cancelButtonText: '취소',
                        confirmButtonText: '확인'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            get_coupon();
                        }
                    });
                }else{
                    get_coupon();
                }
            }
        }else{
            swal('알림', '쿠폰 번호를 입력하세요.' , 'cp_uc', 1);
        }
    });
});

/**
 * @description 선택한 결제 정보 get
 */
function get_pay_info(pay_uc){
    $.ajax({ 
        url: '/join/payment/get_pay_info',
        type: 'POST',
        data: {
            pay_uc : pay_uc,
            cp_uc  : p_cp_uc
        },
        dataType: "json",
        success: function(result) {
            var type = 'Y';

            p_data['gb']            = 'APP';
            p_data['pay_uc']        = pay_uc;
            p_data['customerName']  = $('#ul_nm').val();
            p_data['amount']        = Number(result.data.amt);
            p_data['orderName']     = result.data.pay_nm;
            p_data['cp_uc']         = p_cp_uc;

            if(p_data['amount'] == 0){
                type = 'N';
            }else{
                device(4);
            }

            payment(p_data, type); /** /dev/toss.js */
        },
        error: function(request,status,error) {
            swal('에러', '통신에 에러가 발생했습니다. 지속될 경우 관리자에게 문의해주세요.', '', 1);
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            /*$.toast('실패', {sticky: true, type: 'danger'});*/
        },
    });
}

/**
 * @description 쿠폰 등록
 */
function get_coupon(){
    $.ajax({ 
        url: '/join/payment/p_get_coupon',
        type: 'POST',
        data: {
            cp_uc : $('#cp_uc').val(),
        },
        dataType: "json",
        success: function(result) {
            var list = '';

            switch(result.msg){
                case 'success':
                    var cnt = 0;

                    $.each(result.pay, function(index, item){
                        var chk = cnt == 0 ? 'checked' : '';

                        list += '<div class="half">';
                        list += '<div class="tab">';
                        list += '<input type="radio" id="'+item.pay_uc+'" name="pay" value="'+item.pay_uc+'" '+chk+'>';
                        list += '<label for="'+item.pay_uc+'">'+item.pay_nm+'</label>';
                        list += '</div>';
                        list += '<div class="price">';
                        list += '<div class="pro Clearfix">';
                        list += '<span class="best Clearfix">';
                        list += ''+item.pay_gb+'';
                        list += '</span>';
                        list += '</div>';
                        list += '<p>월 '+commas(Number(item.amt))+'원</p>';
                        list += '</div>';
                        list += '<div class="sub">';
                        list += '<p>'+item.main_title+'</p>';
                        list += '<ul>';
                        list += '<textarea rows="3" spellcheck="false">'+item.content+'</textarea>';
                        list += '</ul>';
                        list += '</div>';
                        list += '</div>';

                        cnt ++;
                    });

                    $('.pay_kind').html(list);

                    swal('알림', '쿠폰이 적용되었습니다.', '', 1);
                    p_cp_uc = $('#cp_uc').val();
                    $('#cp_uc').val('');
                break;
                case 'exist':
                    swal('알림', '이미 등록한 쿠폰입니다.', 'cp_uc', 1);
                break;
                case 'not':
                    swal('알림', '존재하지 않는 쿠폰입니다. 쿠폰 번호를 확인해주세요.', 'cp_uc', 1);
                break;
                case 'over':
                    swal('알림', '기간 만료 또는 사용할 수 없는 쿠폰입니다.', 'cp_uc', 1);
                break;
            }
        },
        error: function(request,status,error) {
            swal('에러', '쿠폰 등록 중 에러가 발생했습니다. 지속될 경우 관리자에게 문의해주세요.', '', 1);
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        },
    });
}