/*================================================================================
 * @name: 김원명 - 앱 공장 발주
 * @version: 1.0.0, @date: 2022/04/08
 ================================================================================*/
var sys_local_cd    = '';
var minus_amt       = 0;
var minus_unit      = 'N';

var ord_amt         = 0;
var dis_amt         = 0;
var add_amt         = 0;
var deposit_amt     = 0;

var cancle_data     = '';

$(function(){
    ord_amt     = Number($('#total_pay_amt').val());
    deposit_amt = typeof $('#p_deposit_amt').val() == "undefined" ? 0 : Number($('#p_deposit_amt').val());

    /** 수정, 삭제 구분 => 태그가 겹쳐 구분 */
    $('.size').off().click(function(e){
        if(!$(e.target).is('button')){
            var data = $(this).data();

            $.ajax({ 
                url: '/ord/ord_in/get_location',
                type: 'GET',
                data: {
                    data : data
                },
                dataType: "json",
                success: function(result) {
                    if(result.msg == 'esti'){
                        location_url('/ord/esti_ing?cust_cd='+data.cd+'&ord_no='+data.no+'&ord_seq='+data.seq+'&type=M');
                    }else{
                        swal('알림', '해당 명세표는 발주 진행 중입니다.<br>진행 중인 상품은 수정이 불가능합니다.', '', 1);
                    }
                },
                error: function(request,status,error) {
                    alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                    $.toast('실패', {sticky: true, type: 'danger'});
                }
            });
        }
    });

    /** 계약일, 시공일 클릭 시 */
    $('.datepicker').off().click(function(){
        var id = $(this).attr('id');
        var dp = new AirDatepicker('#'+id+'', {
            isMobile: true,
            autoClose: true,
            dateFormat: 'yyyy-MM-dd'
        });

        dp.show();
    });

    $(document).on('click', '.delete, .add_ord, .wait_ord, .cancle', function(){
        switch($(this).attr('class')){
            case 'delete': /** 삭제 버튼 클릭 시 */
                if($(this).attr('data-type') == 'del'){
                    var data = $(this).data();
                    var con  = custom_fire('삭제', '해당 견적을 삭제하시겠습니까?', '취소', '삭제');
        
                    con.then((result) => {
                        if(result.isConfirmed){
                            get_esti_del(data);
                        }
                    });
                }
            break;
            case 'add_ord': /** 시스템발주 클릭 시 */
                get_factory_pop($(this).data());
            break;
            case 'wait_ord': /** 발주 취소 클릭 시 */
                sys_local_cd = $(this).attr('data-factory');

                var con = custom_fire('발주', '발추 취소 처리하시겠습니까?', '취소', '확인');
        
                con.then((result) => {
                    if(result.isConfirmed){
                        get_ord_cancle(sys_local_cd);
                    }
                });
            break;
            case 'delete cancle': /** 주문취소요청 클릭 시 */
                var data = $(this).data();
                //var id   = $(this).parent('div').attr('id');
                
                get_cancle_info(data);
            break;
        }
    });

    /** 주문취소 신청 완료 클릭 시 */
    $('#cancle_ok').off().click(function(){
        var con  = custom_fire('주문취소', '해당 항목을 주문 취소요청 하시겠습니까?', '취소', '확인');

        con.then((result) => {
            if(result.isConfirmed){
                get_esti_cancle(cancle_data);
            }
        });
    });

    /** 외주발주 배송지 변경 시 */
    $('#plan_dlv_gb').change(function(){
        if($(this).val() == '001'){
            $('#plan_addr').prop("readonly", true);
            $('#plan_addr').addClass('gray');
        }else{
            $('#plan_addr').prop("readonly", false);
            $('#plan_addr').removeClass('gray');
        }

        $('#plan_addr').val('');
    });

    $('#sys_ord, #plan_ord').off().click(function(){
        switch($(this).attr('id')){
            case 'sys_ord':
                if($('#sys_addr').val() == '' && $('#sys_addr_detail').val() == ''){
                    swal('알림', '배송지 주소를 입력하세요.', '', 3).then((result) => {
                        $('#sys_addr').focus();
                        return false;
                    });
                }

                var con = custom_fire('발주', '시스템 발주 처리하시겠습니까?', '취소', '완료');

                con.then((result) => {
                    if(result.isConfirmed){
                        get_esti_ord('S');
                    }
                });
            break;
            case 'plan_ord':
                if($('#plan_addr').val() == '' && $('#plan_addr_detail').val() == ''){
                    swal('알림', '배송지 주소를 입력하세요.', '', 3).then((result) => {
                        $('#plan_addr').focus();
                        return false;
                    });
                }else{
                    get_esti_ord('P');
                }
            break;
        }
    });

    /** 할인 팝업 취소 클릭 시 */
    $('#dis_cancle').off().click(function(){
        device(1);
        $('.discount_pop').bPopup().close();
    });

    /** 할인 정액, % 선택 시  */
    $('.price, .percent').off().click(function(){
        $('#dis_pop_amt').val(0);
        if($(this).attr('class') == 'price'){
            $('#dis_pop_unit_nm').text('원');
        }else{
            $('#dis_pop_unit_nm').text('%');
        }
    });

    /** 할인 및 추가 금액 적용 */
    $('#dis_ok').off().click(function(){
        device(1);
        
        minus_amt   = $('#dis_pop_amt').val();
        minus_unit  = $("input[name='dis_pop_unit']:checked").val();

        if(minus_unit == '002' && Number(minus_amt) > 100){
            swal('알림', '100%를 초과할 수 없습니다.', 'dis_pop_amt', 1);
            return false;
        }

        $('.discount_pop').bPopup().close();

        get_amt('D');
    });

    /** 추가 금액 적용 시 */
    $("#add_pay_amt").on('input', function(){
        get_amt('A');
    });

    /** 최종 결제 금액 수정 시 */
    $("#total_pay_amt").on('input', function(){
        get_amt('M');
    });

    /** 결제 팝업 취소 클릭 시 */
    $('#pay_cancle').off().click(function(){
        $('body').removeClass('fixed');
        $('.pay_pop').bPopup().close();
    });

    $('#pay_ok').off().click(function(){
        var con = custom_fire('결제', '결제완료 처리 하시겠습니까?', '취소', '완료');

        con.then((result) => {
            if(result.isConfirmed){
                get_pay();
            }
        });
    });
});

/**
 * @description 시스템 발주
 */
function get_factory_pop(data){
    $.ajax({ 
        url: '/ord/ord_in/get_info',
        type: 'GET',
        data: {
            data : data
        },
        dataType: "json",
        success: function(result) {
            $('.sys_pop').bPopup({
                modalClose: true
                , opacity: 0.7
                , positionStyle: 'absolute' 
                , speed: 300
                , transition: 'slideUp'
                , transitionClose: 'fadeOut'
                , zIndex : 100,
                onOpen: function(){ /** 팝업창 열릴 때 */
                    sys_local_cd = data['factory'];
                    
                    $('body').addClass('fixed');
                    $("#dlv_gb option:eq(0)").prop("selected", true);
                    $('#sys_addr').prop("readonly", true);
                    $('#sys_addr').addClass('gray');

                    if(result.addr != ''){
                        $('#sys_addr').val(result.addr['ba_addr']);
                        $('#sys_addr_detail').val(result.addr['ba_detail']);
                    }else{
                        $('#sys_addr').val('');
                        $('#sys_addr_detail').val('');
                    }
                },
                onClose: function(){ /** 팝업창 닫힐 때 */
                    $('body').removeClass('fixed');
                }
            });
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}

/**
 * @description 배송지 변경 시
 */
function get_dlv_gb(){
    var dlv_gb = $('#sys_dlv_gb').val();

    $.ajax({ 
        url: '/ord/ord_in/get_info',
        type: 'GET',
        data: {
            data : {
                'factory' : sys_local_cd,
                'dlv_gb'  : dlv_gb
            }
        },
        dataType: "json",
        success: function(result) {
            if(result.addr != ''){
                $('#sys_addr').val(result.addr['ba_addr']);
                $('#sys_addr_detail').val(result.addr['ba_detail']);
            }else{
                $('#sys_addr').val('');
                $('#sys_addr_detail').val('');
            }

            if(dlv_gb == '001'){
                $('#sys_addr').prop("readonly", true);
                $('#sys_addr').addClass('gray');
            }else{
                $('#sys_addr').prop("readonly", false);
                $('#sys_addr').removeClass('gray');
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}

/**
 * @description 견적 삭제 처리
 */
 function get_esti_del(data){
    $.ajax({ 
        url: '/ord/ord_in/get_esti_delete',
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

                    if(result.factory_total === 0){
                        $('#factory_'+data['factory']+'').remove();
                    }
                }
            }else{
                swal('알림', '견적 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.', '', 1);
            }

            $('#item_amt').text(commas(result.info['amt']));
            $('#op_amt').text(commas(result.info['op_amt']));
            $('#base_amt').text(commas(result.info['base_amt']));
            $('#dis_amt').text(commas(result.info['adjust_dis_amt']));
            $('#cut_amt').text(commas(result.info['cut_amt']));
            $('#total_amt').text(commas(result.info['total_amt']));
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}

/**
 * @description 발주 처리
 */
 function get_esti_ord(type){
    $.ajax({ 
        url: '/ord/ord_in/get_esti_ord',
        type: 'GET',
        data: {
            'type'          : type,
            'local_cd'      : sys_local_cd,
            'ord_no'        : $('#p_ord_no').val(),
            'ord_dt'        : type == 'S' ? $('#sys_ord_dt').val() : $('#plan_ord_dt').val(),
            'dlv_dt'        : type == 'S' ? $('#sys_dlv_dt').val() : $('#plan_dlv_dt').val(),
            'dlv_gb'        : type == 'S' ? $('#sys_dlv_gb').val() : $('#plan_dlv_gb').val(),
            'addr'          : type == 'S' ? $('#sys_addr').val() : $('#plan_addr').val(),
            'addr_detail'   : type == 'S' ? $('#sys_addr_detail').val() : $('#plan_addr_detail').val(),
            'memo'          : type == 'S' ? $('#sys_memo').val() : $('#plan_memo').val()
        },
        dataType: "json",
        success: function(result) {
            if(type == 'S'){
                $("div[id*='btn_"+sys_local_cd+"']").each(function(){
                    $(this).remove();
                });
    
                $('#btns_'+sys_local_cd+'').html('<button type="button" class="wait_ord" data-factory="'+sys_local_cd+'">발주 취소</button>');
    
                $('body').removeClass('fixed');
                $('.sys_pop').bPopup().close();
            }else{
                location_url('/ord/plan?n='+$('#p_ord_no').val()+'&l='+sys_local_cd+'');
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}

/**
 * @description 발주 취소(복구 처리)
 */
 function get_ord_cancle(local_cd){
    $.ajax({ 
        url: '/ord/ord_in/get_ord_cancle',
        type: 'GET',
        data: {
            local_cd : local_cd,
            ord_no   : $('#p_ord_no').val()
        },
        dataType: "json",
        success: function(result) {
            switch(result.msg){
                case 'success':
                    location.reload();
                break;
                case 'fail':
                    swal('알림', '발주 취소에 실패하였습니다. 잠시 후 다시 시도해주세요.', '', 1);
                break;
                case 'not':
                    Swal.fire({
                        title: '알림',
                        html: '<br>승인이 처리된 견적입니다. 화면을 재로딩 처리합니다.<br><br>',
                        showCancelButton: false,
                        confirmButtonColor: '#0176F9',
                        confirmButtonText: '확인'
                    }).then((result) => {
                        location.reload();
                    });
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
 * @description 주문취소 요청 정보
 */
function get_cancle_info(data){
    var list = '';

    $.ajax({ 
        url: '/ord/ord_in/get_cancle_info',
        type: 'GET',
        data: {
            ord_no  : data['no'],
            ord_seq : data['seq']
        },
        dataType: "json",
        success: function(result) {
            cancle_data = data;

            var spec    = result.list[0].ord_spec;
            var qty     = result.list[0].ord_qty;

            spec        = JSON.parse(spec);
            qty         = JSON.parse(qty);

            list += '<div class="product">'+result.item+'</div>';

            switch(spec['unit']){
                case '001': case '002': /** 회배, m2 */
                    if(spec['division'] == 1){
                        list += '<div class="size">사이즈 <span>'+spec.ord_width+'</span> X <span>'+spec.ord_height+'</span> (좌 : '+qty['left_qty']+', 우 : '+qty['right_qty']+')</div>';
                    }else{
                        $.each(result.list, function(index, item){
                            spec    = JSON.parse(item.ord_spec);
                            var pos = spec['handle_pos'] == 'R' ? '우' : '좌';
                            qty     = item.ord_qty != '' ? JSON.parse(item.ord_qty) : '';

                            list += '<div class="size">사이즈 <span>'+spec['div_width']+'</span> X <span>'+spec['div_height']+'</span> ('+pos+')</div>';
                        });
                    }
                break;
                case '006': case '007': /** 야드, 폭 */
                    list += '<div class="size">사이즈 <span>'+spec.ord_width+'</span> X <span>'+spec.ord_height+'</span></div>';
                break;
            }

            $('#cancle_list').html(list);

            $('.ord_cancle_pop').bPopup({
                    modalClose: true
                , opacity: 0.7
                , positionStyle: 'fixed' 
                , speed: 100
                , transition: 'fadeIn'
                , transitionClose: 'fadeOut'
                , zIndex : 500,
                onOpen: function(){ /** 팝업창 열릴 때 */
				    device(3);
                },
                onClose: function(){ /** 팝업창 닫힐 때 */
                    device(1);
                }
            });
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}

/**
 * @description 견적 주문취소요청
 */
 function get_esti_cancle(data){
    $.ajax({ 
        url: '/ord/ord_in/get_esti_cancle',
        type: 'GET',
        data: {
            data        : data,
            cancle_gb   : $("input[name='cancle_gb']:checked").val(),
            memo        : $('#p_memo').val()
        },
        dataType: "json",
        success: function(result) {
            if(result.msg == 'success'){
                location.reload();
            }else{
                swal('알림', '주문 취소요청에 실패하였습니다. 잠시 후 다시 시도해주세요.', '', 1);
            }

            $('#item_amt').text(commas(result.info['amt']));
            $('#op_amt').text(commas(result.info['op_amt']));
            $('#base_amt').text(commas(result.info['base_amt']));
            $('#dis_amt').text(commas(result.info['adjust_dis_amt']));
            $('#cut_amt').text(commas(result.info['cut_amt']));
            $('#total_amt').text(commas(result.info['total_amt']));
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}

/**
 * @deprecated 결제완료 처리
 */
function get_pay(){

    $.ajax({ 
        url: '/ord/ord_in/get_pay',
        type: 'GET',
        data: {
            ord_no : get_parameter('ord_no'),
            params : {
                dis_unit        : minus_unit,
                dis_amt         : minus_amt,
                dis_memo        : $('#dis_memo').val(),
                add_amt         : $('#add_pay_amt').val(),
                deposit         : $('#deposit').val(),
                deposit_memo    : $('#deposit_memo').val()
            }
        },
        dataType: "json",
        success: function(result) {
            if(result.msg == 'success'){
                history.back();
            }else{
                swal('알림', '결제 처리에 실패하였습니다. 잠시 후 다시 시도하세요.', '', 1);
            };
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}

/**
 * @description 금액 처리
 */
function get_amt(type){
    switch(type){
        case 'D': /** 할인 금액 적용 시 */
            if(minus_unit == '001'){
                dis_amt = Number(minus_amt);
            }else{
                dis_amt = ( ord_amt / 100 ) * Number(minus_amt);
            }

            $('#dis_pay_amt').val(dis_amt);
            $('#total_pay_amt').val(ord_amt - dis_amt + add_amt);
            $('#deposit_amt').val(ord_amt - dis_amt + add_amt - deposit_amt);
        break;
        case 'M': /** 최종결제금액 수정 시 */
            var input_amt = Number($('#total_pay_amt').val());

            $('#price').prop('checked', true);
            $('#dis_pop_unit_nm').text('원');

            if(ord_amt === input_amt){ /** 입력 값과 결제금액이 같을 시 */
                $('#dis_pop_amt, #dis_pay_amt, #add_pay_amt').val(0);
            }else{
                if(ord_amt > input_amt){ /** 최종 금액이 높을 시 */
                    $('#dis_pop_amt, #dis_pay_amt').val(ord_amt - input_amt);
                    $('#add_pay_amt').val(0);
                }else{ /** 최종 금액이 낮을 시 */
                    $('#dis_pop_amt, #dis_pay_amt').val(0);
                    $('#add_pay_amt').val(input_amt - ord_amt);
                }
            }

            $('#deposit_amt').val(input_amt - deposit_amt);
        break;
        case 'A': /** 추가 금액 적용 시 */
            add_amt = parseInt(Number($('#add_pay_amt').val()));

            $('#dis_pay_amt').val(dis_amt);
            $('#total_pay_amt').val(ord_amt - dis_amt + add_amt);
            $('#deposit_amt').val(ord_amt - dis_amt + add_amt - deposit_amt);
        break;
    }
}