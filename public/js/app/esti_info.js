/*================================================================================
 * @name: 김원명 - 앱 견적 상세 
 * @version: 1.0.0, @date: 2022/03/29
 ================================================================================*/
var g_id = '';
var hour = '00';
var minu = '00';

var minus_amt   = 0;
var minus_unit  = 'N';
var minus_memo  = '';

var add_amt     = 0;
var add_memo    = '';

var result_amt  = 0;
var dis_amt     = 0;

$(function(){
    minus_amt   = $('#adjust_dis_amt').val();
    minus_unit  = $('#adjust_dis_unit').val();
    minus_memo  = $('#adjust_dis_memo').val();

    add_amt     = $('#adjust_add_amt').val();
    add_memo    = $('#adjust_add_memo').val();
    
    /** 수정, 삭제 구분 => 태그가 겹쳐 구분 */
    $('.size').off().click(function(e){
        if(!$(e.target).is('button')){
            var data = $(this).data();

            location_url('/ord/esti_ing?cust_cd='+data.cd+'&ord_no='+data.no+'&ord_seq='+data.seq+'&type=M');
        }
    });

    $('#dis_amt, #deposit_amt').focus(function(){
        $(this).val('');
    });

    /** 삭제 버튼 클릭 시 */
    $('.delete').off().click(function(){
        var data = $(this).data();
        var con  = custom_fire('삭제', '해당 견적을 삭제하시겠습니까?', '취소', '삭제');

        con.then((result) => {
            if(result.isConfirmed){
                get_esti_del(data);
            }
        });
    });

    /** 계약일, 시공일 클릭 시 */
    $('.datepicker').off().click(function(){
        var id = $(this).attr('id');
        var dp = new AirDatepicker('#'+id+'', {
            isMobile: true,
            autoClose: true,
            dateFormat: 'yyyy-MM-dd '+$('#'+id+'_2').val()+'',
            onSelect : function(e){ /** 날짜 선택 시 */
                dp.hide();

                get_time_pop();
                g_id = id;

                $('#'+id+'_1').val(e.formattedDate.substr(0,10));
            }
        });

        dp.show();
    });

    /** 시간(시) 선택 시 */
    $('.time_li').off().click(function(){
        hour = $(this).attr('data-val');

        $('.time_li_pop').bPopup().close();

        get_minutes_pop();

        $('#'+g_id+'_2').val(hour+':00');
        $('#'+g_id+'').val($('#'+g_id+'_1').val()+' '+hour+':00');
    });

    /** 시간(분) 선택 시 */
    $('.minutes_li').off().click(function(){
        minu = $(this).attr('data-val');

        $('.minutes_li_pop').bPopup().close();

        if(g_id != 'time'){
            $('#'+g_id+'_2').val(hour+':'+minu);
            $('#'+g_id+'').val($('#'+g_id+'_1').val()+' '+hour+':'+minu);
        }else{
            $('#time').val(minu+'분');
        }
    });

    /** 설치예상시간 선택 시 */
    $('#time').off().click(function(){
        g_id = $(this).attr('id');
        get_minutes_pop();
    });

    /**
     * 금액조정 할인 / 추가 클릭 시 팝업 open
     */
    $('.discount_btn').off().click(function(){
        var id = $(this).attr('id');

		$('.discount_pop').bPopup({
			  modalClose: true
			, opacity: 0.7
			, positionStyle: 'absolute' 
			, speed: 100
			, transition: 'fadeIn'
			, transitionClose: 'fadeOut'
			, zIndex : 500,
            onOpen : function(){ /** 팝업창 열릴 때 */
                device(3);
                g_id = id;

                if(g_id == 'dis_minus'){
                    $('#dis_pop_title').text('할인');

                    switch(minus_unit){
                        case 'N': case '001':
                            $('#price').prop('checked', true);
                            $('#percent').prop('checked', false);
                            $('#dis_pop_unit_nm').text('원');
                        break;
                        case '002':
                            $('#price').prop('checked', false);
                            $('#percent').prop('checked', true);
                            $('#dis_pop_unit_nm').text('%');
                        break;
                    }
                    $('#dis_amt').val(minus_amt);
                    $('#dis_memo').val(minus_memo);
                    $('.percent').show();
                }else{
                    $('#dis_pop_title').text('추가');
                    $('#price').prop('checked', true);
                    $('#percent').prop('checked', false);
                    $('#dis_pop_unit_nm').text('원');
                    $('#dis_amt').val(add_amt);
                    $('#dis_memo').val(add_memo);
                    $('.percent').hide();
                }
            },
            onClose : function(){ /** 팝업창 닫힐 때 */
                device(1);
            }
		});
    });

    /** 할인 정액, % 선택 시  */
    $('.price, .percent').off().click(function(){
        if(g_id == 'dis_minus'){
            $('#dis_amt').val(0);
            if($(this).attr('class') == 'price'){
                $('#dis_pop_unit_nm').text('원');
            }else{
                $('#dis_pop_unit_nm').text('%');
            }
        }
    });

    /** 할인 팝업 닫기 */
    $('#dis_cancle').off().click(function(){ 
        $('.discount_pop').bPopup().close();
    });

    /** 다음단계 팝업 닫기 */
    $('#next_cancle').off().click(function(){
        $('body').removeClass('fixed');
        $('.date_pop').bPopup().close();
    });

    /** 할인 및 추가 금액 적용 */
    $('#dis_ok').off().click(function(){
        device(1);
        
        if(g_id == 'dis_minus'){
            minus_amt   = $('#dis_amt').val();
            minus_unit  = $("input[name='dis_pop_unit']:checked").val();
        }else{
            add_amt     = $('#dis_amt').val();
        }

        if(minus_unit == '002' && Number(minus_amt) > 100){
            swal('알림', '100%를 초과할 수 없습니다.', 'dis_amt', 1);
            return false;
        }

        $('.discount_pop').bPopup().close();
        get_amt();
    });

    /** 천원단위 절삭 클릭 시 */
    $('#cut').off().click(function(){
        get_amt();
    });

    /** 저장하기 클릭 시 */
    $('#save, #con_ok').off().click(function(){
        var con = '';
        var type = '';

        if($(this).attr('id') == 'save'){
            con = custom_fire('저장', '해당 정보를 저장하시겠습니까?', '취소', '저장');
            type = 'S';
        }else{
            if($('#deli_dt').val() == ''){
                swal('알림', '시공일을 입력하세요.', 'deli_dt', 1);
                return false;
            }

            con = custom_fire('저장', '계약완료 처리하시겠습니까?', '취소', '저장');
            type = 'O';
        }

        con.then((result) => {
            if(result.isConfirmed){
                get_esti_result(type);
            }
        });
    });
});

/**
 * @description 견적 삭제 처리
 */
function get_esti_del(data){
    $.ajax({ 
        url: '/ord/esti_info/get_esti_delete',
        type: 'GET',
        data: {
            data : data
        },
        dataType: "json",
        success: function(result) {
            if(result.msg == 'success'){
                if(result.cnt === 1){
                    history.back();
                }else{
                    $('#ord_'+data['no']+data['seq']+'').remove();

                    if(result.place_total === 0){
                        $('#place_'+data['place']+'').remove();
                    }

                    get_amt();
                }
            }else{
                swal('삭제 실패', '잠시 후 다시 시도해주세요.', '', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}

/**
 * @description 저장하기 / 계약완료 처리
 */
function get_esti_result(type){
    var params = new Object();

    params['type']          = type;
    params['con_dt']        = $('#con_dt').val();
    params['deli_dt']       = $('#deli_dt').val();
    params['time']          = $('#time').val();
    params['person']        = $('#person').val();
    params['deposit']       = $('#deposit').val();
    params['deposit_amt']   = $('#deposit_amt').val();
    params['deposit_memo']  = $('#deposit_memo').val();

    $.ajax({ 
        url: '/ord/esti_info/get_esti_result?params='+JSON.stringify(params)+'',
        type: 'GET',
        data: $('#frm').serialize(),
        dataType: "json",
        success: function(result) {
            //console.log(result);
            switch(result.msg){
                case 'not':
                    swal('알림', '실측 데이터가 있을 시 계약이 불가능합니다.', '', 1);
                break;
                case 'success':
                    if(type == 'S'){
                        location_url('/client/client_info?cust_cd='+get_parameter('cust_cd')+'');
                    }else{
                        locationReplace('/ord/ord_in?cust_cd='+$('#p_cust_cd').val()+'&ord_no='+$('#p_ord_no').val()+'');
                    }
                break;
                case 'fail':
                    swal('저장 실패', '확인 후 다시 이용바랍니다.', '', 1);
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
 * @description 금액 계산
 */
function get_amt(){
    $.ajax({ 
        url: '/ord/esti_info/get_amt',
        type: 'GET',
        data: {
            ord_no : $('#p_ord_no').val()
        },
        dataType: "json",
        success: function(result) {
            var ord_amt     = result.amt + result.base_amt + result.op_amt;
            var dis_text    = '';

            if(Number(minus_amt) != 0){
                if(minus_unit == '001'){
                    dis_text = dis_text;
                }else{
                    dis_text = dis_text + minus_amt + '%';
                }
            }

            $('#ord_amt').text(commas(ord_amt));
            $('#item_amt').text(commas(result.amt));
            $('#op_amt').text('+'+commas(result.op_amt));

            if(g_id == 'dis_minus'){
                minus_memo = $('#dis_memo').val();
        
                if(minus_memo != ''){
                    dis_text = dis_text + ' ' + minus_memo;
                }

                $('#adjust_dis_unit').val(minus_unit);
                $('#adjust_dis_amt').val(Number(minus_amt));
                $('#adjust_dis_memo').val(minus_memo);
            }else{
                add_memo = $('#dis_memo').val();
        
                if(add_memo != ''){
                    $('#add_memo_text').text('('+add_memo+')');
                }

                $('#adjust_add_unit').val('001');
                $('#adjust_add_amt').val(Number(add_amt));
                $('#adjust_add_memo').val(add_memo);
            }
        
            if(minus_unit == '001'){
                result_amt  = ord_amt - Number(minus_amt);
                dis_amt     = Number(minus_amt);
                $('#dis_per').text('( '+dis_text+' )');
            }else{
                result_amt = ord_amt - (( ord_amt / 100 ) * Number(minus_amt));
        
                dis_amt = (( ord_amt / 100 ) * Number(minus_amt));
                $('#dis_per').text('( '+dis_text+' )');
            }
        
            if(dis_amt === 0 ){
                $('#dis_title').hide();
            }else{
                $('#dis_title').show();
            }

            $('#dis_minus_amt').text('-'+commas(parseInt(dis_amt)));
            $('#dis_minus').val(parseInt(dis_amt));
        
            result_amt = Math.ceil(result_amt) + Number(add_amt);

            if(Number(add_amt) === 0 ){
                $('#add_title').hide();
            }else{
                $('#add_title').show();
            }

            $('#dis_add_amt').text('+'+commas(Number(add_amt)));
            $('#dis_add').val(add_amt);
        
            var cut         = Number(String(result_amt).substr(-4));
            var total_amt   = result_amt - cut;
        
            if($('#cut').is(':checked')){
                $('#cut_title').show();
                $('#cut_amt').text('-'+commas(cut));
                $('#total_amt').text(commas(total_amt));
            }else{
                $('#cut_title').hide();
                $('#cut_amt').text(0);
                $('#total_amt').text(commas(result_amt));
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}