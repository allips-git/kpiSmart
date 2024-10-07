/*================================================================================
 * @name: 김원명 - 앱 견적 등록 
 * @version: 1.0.0, @date: 2022/03/14
 ================================================================================*/
sessionStorage.clear(); 

$(function(){
    if($('#type').val() == 'M'){ /** 수정일 시 제품 정보 get */
        var item = get_item($('#p_item_cd').val(), $('#p_item_sub').val(), $('#p_local_cd').val(), 'M');

        if(item){
            switch(get_s_str('g', 'unit')){
                case '001': case '002':
                    var data = {
                        size    : get_s_str('g', 'n_size'),
                        width   : $('#p_b_width').val(),
                        height  : $('#p_b_height').val()
                    };
        
                    get_s_str('s', 'hebe', JSON.stringify([indi_hebe(data)]));
                break;
                case '006': case '007':
                    get_color();
                break;
            }

            if($('#division').val() != '1'){
                get_division();
                //div_width('w');
            }else{
                get_calculation(); 
            }
        }
    }

    $('.change').off().click(function(){
        if(get_parameter('gubun') == 'O'){
            swal('알림', '계약완료 견적은 제품 변경이 불가능합니다.', '', 1);
        }else{
            $('.product_pop').bPopup();
        }

        device(3);
    });

    $("input[name*='p_div_height']").on('input', function(){
        var height = $(this).val();

        $.each($("input[name*='p_div_height']"), function(index, item){
            $(this).val(height);
        });

        div_width('h');
    });

    /** 블라인드 */
    $('#p_b_width, #p_b_height, #p_b_left_qty, #p_b_right_qty').on('propertychange change keyup paste input', function(){
        get_unit_calculation();
    });

    /** EA, BOX */
    $('#p_e_qty').on('propertychange change keyup paste input', function(){
        get_calculation();
    });

    /** 커튼 */
    $('#p_c_width, #p_c_height, #p_c_usage, #p_c_base_st, #p_c_qty').on('propertychange change keyup paste input', function(){
        get_unit_calculation();
    });

    $('.sub, .add').off().click(function(){
        setTimeout(function(){ 
            get_calculation();
        },200);
    });

    /** 분할 가로 입력 시 */
    $("input[name*='p_div_width_']").on('input', function(){
        var num     = $(this).attr('data-num');
        var width   = $('#p_div_width_'+num+'').val();
        var height  = $('#p_div_height_'+num+'').val();

        /** 분할별 회베 계산 처리 */
        var data = {
            size    : get_s_str('g', 'n_size'),
            width   : width,
            height  : height
        };

        $('#p_div_unit_'+num+'').val(indi_hebe(data));

        var sum_width   = 0;
        var div_hebe    = new Array();
        /** 분할 가로 합계 처리 */
        $.each($("input[name*='p_div_width_']"), function(index, item){
            if($(this).parent('div').parent('div').css('display') == 'block'){
                var num = Number(index) + 1;

                sum_width = sum_width + Number($(this).val());
                //sum_hebe = sum_hebe + Number($('#p_div_unit_'+num+'').val());
                div_hebe.push(Number($('#p_div_unit_'+num+'').val()));
            }
        });

        get_s_str('s', 'hebe', JSON.stringify(div_hebe));

        $('#p_div_width').val(Number(sum_width.toFixed(1)));
        $('#p_b_width').val(Number(sum_width.toFixed(1)));

        get_calculation();
    });

    /** 세로(cm) 입력 시 */
    $("input[name*='p_div_height']").on('input', function(){
        var division    = $('#division').val();
        var div_hebe    = new Array();

        for(i=1; i<=Number(division); i++){
            var width   = $('#p_div_width_'+i+'').val();
            var height  = $('#p_div_height_'+i+'').val();

            /** 분할별 회베 계산 처리 */
            var data = {
                size    : get_s_str('g', 'n_size'),
                width   : width,
                height  : height
            };

            $('#p_div_unit_'+i+'').val(indi_hebe(data));

            //sum_hebe = sum_hebe + Number($('#p_div_unit_'+i+'').val());
            div_hebe.push(Number($('#p_div_unit_'+i+'').val()));
        }

        get_s_str('s', 'hebe', JSON.stringify(div_hebe));

        get_calculation();
    });

    $(document).on('input', '#p_c_inside_acn', function(){
        var acn = $('#p_c_acn').val();
        var val = $(this).val();

        if(acn <= 0 || acn == ''){
            swal('알림', '입력 값을 입력하여, 최종 계산이 필요합니다.', 'p_c_acn', 1);
            return false;
        }

        if(Number(val) > Number(acn)){
            swal('알림', '최종 계산된 값보다 클 수 없습니다.', 'p_c_outside_acn', 1);
            $(this).val(acn);
            $('#p_c_outside_acn').val(0);
            return false;
        }else{
            $('#p_c_outside_acn').val((Number(acn) - Number(val)).toFixed(1));
        }
    });

    /** 선택완료 클릭 시 */
    $('.next_btn').off().click(function(){
        if(get_val_check()){
            var title;
            var msg;

            if($('#type').val() == 'M'){
                title = '견적 수정';
                msg = '견적을 수정하시겠습니까?';
            }else{
                title = '견적 등록';
                msg = '견적등록을 완료하시겠습니까?';
            }

            var con = custom_fire(title, msg, '취소', '완료');

            con.then((result) => {
                if(result.isConfirmed){
                    get_result();
                }
            });
        };
    });
});

/**
 * @description 옵션 리스트
 */
function get_option_list(item_lv){
    var option = '';

    $.ajax({ 
        url: '/ord/esti_ing/get_option_list',
        type: 'GET',
        data: {
            item_lv :   item_lv
        },
        dataType: "json",
        success: function(result) {
            if(result.option.length != 0){
                $('.opti_btn').attr('data-yn', 'Y');
                
                $.each(result.option, function(index, item){
                    option += "<li onclick=get_option(\'"+item.key_name+"\')>"+item.key_name+"</li>";
                });

                $('#option_list').html(option);
            }else{
                $('.opti_btn').attr('data-yn', 'N');
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }
    });
}

/**
 * @description 옵션 정보 get
 */
function get_option(op_nm){
    $.ajax({ 
        url: '/ord/esti_ing/get_option',
        type: 'GET',
        data: {
            op_nm :   op_nm
        },
        dataType: "json",
        success: function(result) {
            $('.option_pop').bPopup().close();     // 옵션 팝업 닫기

            var num = $('#option_list').attr('data-sel');

            if(num == 1){
                $('#p_option1').val(result.option['key_name']);
                $('#option1').text(result.option['key_name']);
                $('#option_nm_1').text(result.option['key_name']+' 옵션1');
                $('#opti_1').show();
        
                var option = {
                    'amt'   :   result.option['unit_amt'],
                    'unit'  :   result.option['unit'] == '001' ? '+' : '*'
                };
            
                get_s_str('s', 'option1', JSON.stringify(option));
            }else{
                $('#p_option2').val(result.option['key_name']);
                $('#option2').text(result.option['key_name']);
                $('#option_nm_2').text(result.option['key_name']+' 옵션2');
                $('#opti_2').show();
        
                var option = {
                    'amt'   :   result.option['unit_amt'],
                    'unit'  :   result.option['unit'] == '001' ? '+' : '*'
                };
        
                get_s_str('s', 'option2', JSON.stringify(option));
            }
        
            get_calculation();
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }
    });
}

/**
 * @description 분할 처리 시
 */
function get_division(){
    var division    = $('#division').val();

    if(division > 1){
        $('#p_div_width').val($('#p_b_width').val() == '' ? $('#p_div_width').val() : $('#p_b_width').val());
        $('#p_div_height').val($('#p_b_height').val() == '' ? $('#p_div_height').val() : $('#p_b_height').val());

        $('#b_no_bn').hide();
        $('.bunhal').show();

        var div_hebe = new Array();

        for(var i=1; i<=division; i++){
            $('#p_div_height_'+i+'').val($('#p_b_height').val() == '' ? $('#p_div_height').val() : $('#p_b_height').val());
            $('.div'+i+'').show();

            var data = {
                size    : get_s_str('g', 'n_size'),
                width   : $('#p_div_width_'+i+'').val(),
                height  : $('#p_b_height').val()
            };

            div_hebe.push(Number(indi_hebe(data)));
        };

        for(var j=Number(division)+1; j<=10; j++){
            $('.div'+j+'').hide();
        };

        get_s_str('s', 'hebe', JSON.stringify(div_hebe));
    }else{
        $('#p_b_width').val($('#p_div_width').val() == '' ? $('#p_b_width').val() : $('#p_div_width').val());
        $('#p_b_height').val($('#p_div_height').val() == '' ? $('#p_b_height').val() : $('#p_div_height').val());

        $('#b_no_bn').show();
        $('.bunhal').hide();

        var data = {
            size    : get_s_str('g', 'n_size'),
            width   : $('#p_b_width').val(),
            height  : $('#p_b_height').val()
        };

        get_s_str('s', 'hebe', JSON.stringify([indi_hebe(data)]));
    }

    get_calculation();
}

/**
 * @description 균등분할 처리
 */
function div_width(type) {
	try {
        var ord_width       = Number($("#p_div_width").val()) === '' ? 0 : Number($("#p_div_width").val());
        var num             = Number($("#division").val());
        var division_width  = '', nam , last_width = '';
        var ord_height      = $('#p_div_height').val();

        var div_hebe        = new Array();

        if(ord_width !== 0){
            division_width  = Number(Math.floor((ord_width / num) * 10) / 10);
            nam             = (division_width * (num - 1)).toFixed(1);
            last_width      = Number((ord_width - nam).toFixed(1));
        }

        for(let i = 1; i <= num; i++){
            if(type == 'w'){
                if(i === num){
                    $("input[name=p_div_width_"+i+"]").val(last_width);
                }else{
                    $("input[name=p_div_width_"+i+"]").val(division_width);
                }

                var data = {
                    size    : get_s_str('g', 'n_size'),
                    width   : i === num ? last_width : division_width,
                    height  : ord_height
                };

                $('#p_div_unit_'+i+'').val(indi_hebe(data));

                //sum_hebe = sum_hebe + Number(indi_hebe(data));
                div_hebe.push(Number(indi_hebe(data)));
            }
        }
        get_s_str('s', 'hebe', JSON.stringify(div_hebe));

        get_calculation();

	} catch (e) {
		alert('{div_width} 시스템 에러. 지속될 경우 사이트 관리자에게 문의 바랍니다.'+e.message);
	}
}

/**
 * @description 커튼 - 색상추가
 */
function get_color(){
    if($('#p_c_color').val() == '001'){
        $('.two_tone').hide();
    }else{
        var list = '<option value="">색상없음</option>';
        $('.two_tone').show();

        $.ajax({ 
            url: '/ord/esti_ing/get_color',
            type: 'GET',
            data: {
                local_cd :  $('#p_local_cd').val(),
                item_cd  :  $('#p_item_cd').val(),
                item_nm  :  $('#p_item_nm').val(),
                item_sub :  get_s_str('g', 'item_sub')
            },
            dataType: "json",
            success: function(result) {
                var sel = '';

                $('#p_c_outside_color').val(result.ord_color);

                $.each(result.list, function(index, item){
                    if($('#p_item_sub_2').val() == item.sub_nm_01){
                        sel = 'selected';
                    }

                    list += '<option value="'+item.sub_nm_01+'" '+sel+'>'+item.sub_nm_01+'</option>';
                });

                $('#p_c_inside_color').html(list);
            },
            error: function(request,status,error) {
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            }
        });
    }
}

/**
 * @description 각 단위 계산 처리
 */
function get_unit_calculation(){
    var data;
    var unit;

    switch(get_s_str('g', 'unit')){
        case '001': case '002':
            var division = $('#division').val();

            if(division == '1'){
                var data = {
                    size    : get_s_str('g', 'n_size'),
                    width   : $('#p_b_width').val(),
                    height  : $('#p_b_height').val()
                };
        
                get_s_str('s', 'hebe', JSON.stringify([indi_hebe(data)]));
            }else{
                var div_hebe = new Array();

                for(var i=1; i<=division; i++){
                    $('#p_div_height_'+i+'').val($('#p_b_height').val() == '' ? $('#p_div_height').val() : $('#p_b_height').val());
                    $('.div'+i+'').show();
        
                    var data = {
                        size    : get_s_str('g', 'n_size'),
                        width   : $('#p_div_width_'+i+'').val(),
                        height  : $('#p_b_height').val()
                    };
        
                    div_hebe.push(Number(indi_hebe(data)));
                };

                get_s_str('s', 'hebe', JSON.stringify(div_hebe));
            }
        break;
        case '006':
            data = {
                width 	: $('#p_c_width').val(),
                usage	: $("#p_c_usage").val(),
                size	: get_s_str('g', 'n_size'),
                los		: 60
            };
    
            unit = indi_yard(data);

            $('#p_c_acn').val(unit);

            get_color();
        break;
        case '007':
            data = {
                width 	    : $('#p_c_width').val(),
                usage	    : $("#p_c_usage").val(),
                size	    : get_s_str('g', 'n_size'),
                los		    : 60,
                width_len   : get_s_str('g', 'width_len')
            };
    
            unit = indi_pok(data);

            $('#p_c_acn').val(unit);

            get_color();
        break;
    }

    get_calculation();
}

/**
 * @description 총 면적, 금액 계산
 */
function get_calculation(){
    var data = new Object();
    var info;
    var sale;

    switch(get_s_str('g', 'unit')){
        case '001': case '002': /** 회배, m2 */
            data['amt']         = get_s_str('g', 'amt');
            data['hebe']        = JSON.parse(get_s_str('g', 'hebe'));
            data['qty']         = $('#division').val() == '1' ? Number($('#p_b_left_qty').val()) + Number($('#p_b_right_qty').val()) : $('#p_div_qty').val()
            data['option1']     = get_s_str('g', 'option1') == null ? '' : JSON.parse(get_s_str('g', 'option1'));
            data['option2']     = get_s_str('g', 'option2') == null ? '' : JSON.parse(get_s_str('g', 'option2'));
            data['vat']         = 'N';
            data['division']    = $('#division').val();
            data['update_unit'] = '-';
            data['update_amt']  = 0;

            info = m2_calculation(data);
            
            if(get_s_str('g', 'unit') == '001'){
                $('#total_unit').html('<span>'+info['ord_hebe'].toFixed(1)+" "+'</span>'+"회베"+'');
            }else{
                $('#total_unit').html('<span>'+info['ord_hebe'].toFixed(1)+" "+'</span>'+"m2"+'');
            }
            $('#p_ord_unit').val(info['ord_hebe'].toFixed(1));

            /** 매입 단가 계산 */
            var sale_data = {
                amt             : $('#p_unit_amt').val(),
                hebe            : JSON.parse(get_s_str('g', 'hebe')),
                qty             : $('#division').val() == '1' ? Number($('#p_b_left_qty').val()) + Number($('#p_b_right_qty').val()) : $('#p_div_qty').val(),
                option1         : get_s_str('g', 'option1') == null ? '' : JSON.parse(get_s_str('g', 'option1')),
                option2         : get_s_str('g', 'option2') == null ? '' : JSON.parse(get_s_str('g', 'option2')),
                vat             : $('#p_buy_vat').val(),
                division        : $('#division').val(),
                update_unit     : '-',
                update_amt      : 0 
            };

            sale = m2_calculation(sale_data);
            
        break;
        case '005': case '011': /** EA */
            data['amt']         = get_s_str('g', 'amt');
            data['qty']         = $('#p_e_qty').val();
            data['option1']     = get_s_str('g', 'option1') == null ? '' : JSON.parse(get_s_str('g', 'option1'));
            data['option2']     = get_s_str('g', 'option2') == null ? '' : JSON.parse(get_s_str('g', 'option2'));
            data['update_unit'] = '-';
            data['update_amt']  = 0;
            data['vat']         = 'N';

            info = ex_calculation(data);

            if(get_s_str('g', 'unit') == '005'){
                $('#total_unit').html('<span>'+info['qty']+" "+'</span>'+"EA"+'');
            }else{
                $('#total_unit').html('<span>'+info['qty']+" "+'</span>'+"BOX"+'');
            }

            /** 매입 단가 계산 */
            var sale_data = {
                amt             : $('#p_unit_amt').val(),
                qty             : $('#p_e_qty').val(),
                option1         : get_s_str('g', 'option1') == null ? '' : JSON.parse(get_s_str('g', 'option1')),
                option2         : get_s_str('g', 'option2') == null ? '' : JSON.parse(get_s_str('g', 'option2')),
                update_unit     : '-',
                update_amt      : 0,
                vat             : $('#p_buy_vat').val()
            };

            sale = ex_calculation(sale_data);
        break;
        case '006': /** 야드*/
            data['amt']         = get_s_str('g', 'amt');
            data['yard']        = $('#p_c_acn').val();
            data['qty']         = $('#p_c_qty').val();
            data['option1']     = get_s_str('g', 'option1') == null ? '' : JSON.parse(get_s_str('g', 'option1'));
            data['option2']     = get_s_str('g', 'option2') == null ? '' : JSON.parse(get_s_str('g', 'option2'));
            data['vat']         = 'N';
            data['base_amt']    = get_s_str('g', 'base_amt');
            data['base_st']     = $('#p_c_base_st').val();
            data['update_unit'] = '-';
            data['update_amt']  = 0;

            info = yard_calculation(data);

            $('#total_unit').html('<span>'+info['ord_yard']+" "+'</span>'+"야드"+'');
            $('#bast_i').show();
            $('#bast_amt').text('+ '+commas(parseInt(info['base_amt'])));
            $('#p_ord_unit').val(info['ord_yard']);

            /** 매입 단가 계산 */
            var sale_data = {
                amt             : $('#p_unit_amt').val(),
                yard            : $('#p_c_acn').val(),
                qty             : $('#p_c_qty').val(),
                option1         : get_s_str('g', 'option1') == null ? '' : JSON.parse(get_s_str('g', 'option1')),
                option2         : get_s_str('g', 'option2') == null ? '' : JSON.parse(get_s_str('g', 'option2')),
                vat             : $('#p_buy_vat').val(),
                base_amt        : get_s_str('g', 'base_amt'),
                base_st         : $('#p_c_base_st').val(),
                update_unit     : '-',
                update_amt      : 0
            };

            sale = yard_calculation(sale_data);
        break;
        case '007':
            data['amt']             = get_s_str('g', 'amt');
            data['pok']             = $('#p_c_acn').val();
            data['qty']             = $('#p_c_qty').val();
            data['option1']         = get_s_str('g', 'option1') == null ? '' : JSON.parse(get_s_str('g', 'option1'));
            data['option2']         = get_s_str('g', 'option2') == null ? '' : JSON.parse(get_s_str('g', 'option2'));
            data['vat']             = 'N';
            data['base_amt']        = get_s_str('g', 'base_amt');
            data['base_st']         = $('#p_c_base_st').val();
            data['height']          = $('#p_c_height').val();
            data['width_len']       = get_s_str('g', 'width_len');
            data['height_len']      = get_s_str('g', 'height_len');
            data['height_unit']     = get_s_str('g', 'height_unit');
            data['height_op1']      = get_s_str('g', 'height_op1');
            data['height_op2']      = get_s_str('g', 'height_op2');
            data['update_unit']     = '-';
            data['update_amt']      = 0;

            info = pok_calculation(data);

            $('#total_unit').html('<span>'+info['ord_pok']+" "+'</span>'+"폭"+'');
            $('#bast_i, #height_i').show();
            $('#bast_amt').text('+ '+commas(parseInt(info['base_amt'])));
            $('#p_ord_unit').val(info['ord_pok']);

            /** 매입 단가 계산 */
            var sale_data = {
                amt             : $('#p_unit_amt').val(),
                pok             : $('#p_c_acn').val(),
                qty             : $('#p_c_qty').val(),
                option1         : get_s_str('g', 'option1') == null ? '' : JSON.parse(get_s_str('g', 'option1')),
                option2         : get_s_str('g', 'option2') == null ? '' : JSON.parse(get_s_str('g', 'option2')),
                vat             : $('#p_buy_vat').val(),
                base_amt        : get_s_str('g', 'base_amt'),
                base_st         : $('#p_c_base_st').val(),
                height          : $('#p_c_height').val(),
                width_len       : get_s_str('g', 'width_len'),
                height_len      : get_s_str('g', 'height_len'),
                height_unit     : get_s_str('g', 'height_unit'),
                height_op1      : get_s_str('g', 'height_op1'),
                height_op2      : get_s_str('g', 'height_op2'),
                update_unit     : '-',
                update_amt      : 0
            };

            sale = pok_calculation(sale_data);
        break;
    }
    console.log(sale);

    $('#item_amt').text('+ '+commas(parseInt(info['prd_amt'])));
    $('#height_amt').text('+ '+commas(parseInt(info['height_amt'])));
    $('#p_op1_amt').val(info['indi_op1_amt']);
    $('#p_op2_amt').val(info['indi_op2_amt']);
    $('#p_ord_amt').val(parseInt(info['ord_amt']));
    $('#option1_amt').text(commas(parseInt(info['op1_amt'])));
    $('#option2_amt').text(commas(parseInt(info['op2_amt'])));
    $('#total_amt').text(commas(parseInt(info['ord_amt'])));

    $('#p_prd_amt').val(sale['indi_prd_amt']);
    $('#p_prd_tax').val(sale['indi_prd_tax']);
    $('#p_buy_ord_amt').val(parseInt(sale['ord_amt']));
    $('#p_indi_base_amt').val(sale['indi_base_amt']);
    $('#p_indi_base_tax').val(sale['indi_base_tax']);
    $('#p_height_amt').val(parseInt(sale['indi_height_amt']));
    $('#p_height_tax').val(parseInt(sale['indi_height_tax']));
}

/**
 * @description 견적등록 및 수정 처리
 */
function get_result(){
    $.ajax({ 
        url: '/ord/esti_ing/get_result',
        type: 'GET',
        data: $('#frm').serialize(),
        dataType: "json",
        success: function(result) {
            if(result.msg == 'success'){
                if(result.type == 'S' || result.type == 'M'){ /** 제품 추가 등록 및 수정 시 */
                    history.back();
                }else{ /** 신규 견적 등록 시 */
                    locationReplace('/ord/esti_info?cust_cd='+result.cust_cd+'&ord_no='+result.ord_no+'');
                }
            }else{
                swal('에러', '견적 등록에 실패하였습니다. 지속될 경우 관리자에게 문의해주세요.', '', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }
    });
}

/**
 * @description 입력 값 체크
 */
function get_val_check(){

    switch(get_s_str('g', 'unit')){
        case '001': case '002':
            /*if($('#p_b_place').val() == ''){
                swal('알림', '설치할 위치를 입력해주세요.', 'p_b_place', 1);
                return false;
            }*/

            var division = Number($('#division').val());

            if(division == 1){
                if(Number($('#p_b_width').val()) == 0){
                    swal('알림', '가로(CM)를 입력하세요.', 'p_b_width', 1);
                    return false;
                }
        
                if(Number($('#p_b_height').val()) == 0){
                    swal('알림', '세로(CM)를 선택하세요.', 'p_b_height', 1);
                    return false;
                }
        
                if(Number($('#p_b_left_qty').val()) == 0 && Number($("#p_b_right_qty").val()) == 0){
                    swal('알림', '수량을 입력하세요.', 'p_b_left_qty', 1);
                    return false;
                }
            }else{
                if(Number($('#p_div_width').val()) == 0){
                    swal('알림', '가로(CM)를 입력하세요.', 'p_div_width', 1);
                    return false;
                }
        
                if(Number($('#p_div_height').val()) == 0){
                    swal('알림', '세로(CM)를 입력하세요.', 'p_div_height', 1);
                    return false;
                }

                if(Number($('#p_div_qty').val()) == 0){
                    swal('알림', '수량 갯수를 입력하세요.', 'p_div_qty', 1);
                    return false;
                }
        
                var sum_width = 0;
        
                for(i=1; i<=division; i++){
                    sum_width = sum_width + Number($('#p_div_width_'+i+'').val());
        
                    if(Number($('#p_div_width_'+i+'').val()) == 0){
                        swal('알림', ''+i+'번째 가로(CM)를 입력하세요.', 'p_div_width_'+i+'', 1);
                        return false;
                    }
                }
        
                if($('#p_div_width').val() != sum_width){
                    swal('알림', '가로(CM) 분할 합계가 불일치합니다. <br>균등분할 처리 또는 분할 가로(CM)를 일치하게 입력하세요.', 'p_div_width', 1);
                    return false;
                }
            }
        break;
        case '005': case '011':
            /*if($('#p_e_place').val() == ''){
                swal('알림', '설치할 위치를 입력해주세요.', 'p_e_place', 1);
                return false;
            }*/

            if(Number($('#p_e_qty').val()) == 0){
                swal('알림', '수량 갯수를 입력하세요.', 'p_e_qty', 1);
                return false;
            }
        break;
        case '006': case '007':
            /*if($('#p_c_place').val() == ''){
                swal('알림', '설치할 위치를 입력해주세요.', 'p_c_place', 1);
                return false;
            }*/

            if(Number($('#p_c_width').val()) == 0){
                swal('알림', '가로(CM)를 입력하세요.', 'p_c_width', 1);
                return false;
            }

            if(Number($('#p_c_height').val()) == 0){
                swal('알림', '세로(CM)를 입력하세요.', 'p_c_height', 1);
                return false;
            }

            if($('#p_c_qty').val() == 0){
                swal('알림', '수량(좌) 갯수를 입력하세요.', 'p_c_qty', 1);
                return false;
            }

            if(Number($('#p_c_acn').val()) == 0){
                swal('알림', '최종계산을 입력하세요.', 'p_c_acn', 1);
                return false;
            }

            if($('#p_c_color').val() == '002'){
                if($('#p_c_inside_color').val() == ''){
                    swal('알림', '투톤 안쪽 색상을 선택하세요.', 'p_c_inside_color', 1);
                    return false;
                }

                if(Number($('#p_c_outside_acn').val()) == 0){
                    swal('알림', '기둥 색상 단위를 입력하세요.', 'p_c_outside_acn', 1);
                    return false;
                }

                if(Number($('#p_c_inside_acn').val()) == 0){
                    swal('알림', '안쪽 색상 단위를 입력하세요.', 'p_c_inside_acn', 1);
                    return false;
                }

                var acn = $('#p_c_acn').val();

                var val_1 = $('#p_c_outside_acn').val();
                var val_2 = $('#p_c_inside_acn').val();
        
                if(Number(acn) !== (Number(val_1)+Number(val_2))){
                    swal('알림', '최종 계산된 값과 투톤의 합계가 맞지 않습니다.', 'p_c_inside_acn', 1);
                    return false;
                }
            }
        break;
    }

    return true;
}