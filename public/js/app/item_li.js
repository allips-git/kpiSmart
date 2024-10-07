/*================================================================================
 * @name: 김원명 - 앱 제품 리스트
 * @version: 1.0.0, @date: 2022/03/10
 ================================================================================*/
let item_cnt  = 20;
let item_stat = true;

$(function(){
    /** 무한 스크롤 적용 */
    $('.list_zone').on("scroll", function(){
        if((parseInt($(this).prop('scrollHeight'))/10*9) <= (parseInt($(this).height()) + parseInt($(this).scrollTop()))) { // 스크롤 끝부분에 도착할 시
            if(item_stat){
                item_stat = false;
                $('#loading').show();
                document.body.scrollIntoView(false);

                setTimeout(function(){ /** 로딩 이미지 0.2초 보여주고 실행 */
                    get_item_list();
                },200);
            }
        }
    });

    /** 공장 변경 시 */
    $('#fac').change(function(){
        $('#list').html('');
        $('#loading').show();
        item_cnt = 0;
        
        setTimeout(function(){ /** 로딩 이미지 0.2초 보여주고 실행 */
            get_item_list();
        },200);
    });

    /** 검색 text에서 엔터키 누를 시 list */
    $("#sc").keyup(function(e){
        if(e.keyCode == 13){
            $('#list').html('');
            $('#loading').show();
            item_cnt = 0;
            
            setTimeout(function(){ /** 로딩 이미지 0.2초 보여주고 실행 */
                get_item_list();
            },200);
        }
    });
});

/**
 * @description 제품 검색
 */
function get_item_list(){
    var item_list = '';

    $.ajax({ 
        url: '/ord/esti_ing/get_item_list',
        type: 'GET',
        data: {
            st          : item_cnt,
            local_cd    : $('#fac').val(),
            sc          : $('#sc').val()
        },
        dataType: "json",
        success: function(result) {
            $('#loading').hide();

            if(result.list.length != 0){
                $.each(result.list, function(index, item1){
                    item_list += "<li class='product_li'>";
                    item_list += "<input type='radio' id='radio"+item1.item_cd+"' name='item'>";
                    item_list += "<label for='radio"+item1.item_cd+"' class='radio"+item1.item_cd+"'>"+item1.item_nm+"";
                    if(item1.sale_amt == 0){
                        item_list += "<p>"+item1.code_nm+" <span>"+commas(parseInt(item1.client_amt))+" <strong>원</strong></span></p></label>";
                    }else{
                        item_list += "<p>"+item1.code_nm+" <span>"+commas(parseInt(item1.sale_amt))+" <strong>원</strong></span></p></label>";
                    }
                    item_list += "<ul class='sub_list'>";

                    $.each(result.sub, function(index, item2){
                        var local_cd;

                        if(result.cnt > 0){
                            local_cd = item2.cust_cd;
                        }else{
                            local_cd = item2.local_cd;
                        }

                        if(item1.item_cd == item2.item_cd && item1.local_cd == local_cd){
                            item_list += '<li class="color_li" onclick="get_item(\''+item1.item_cd+'\', \''+item2.sub_nm_01+'\', \''+item1.local_cd+'\')">';
                            /*item_list += "<p class='color'><span>└ </span> "+item2.sub_nm_01+"</p>";
                            item_list += "<p class='type'>"+item1.key_name+"</p>";*/
                            item_list += '<input type="radio" id="color'+item1.item_cd+'_'+item2.sub_nm_01.replace(/ /g,"")+'" name="color">'
                            item_list += '<label class="color">'+item2.sub_nm_01+'</label>';
                            item_list += "</li>";
                        }
                    });

                    item_list += "</ul>";
                    item_list += "</li>";
                });

                if(result.list.length == 20){
                    item_cnt = item_cnt + 20;
                    item_stat = true;
                }

                $('#list').append(item_list);
            }else{
                item_stat = false;
                if(item_cnt == 0){
                    $('#list').html("<li class='product_li'><p class='no_item'>검색결과에 맞는 제품 리스트가 없습니다.</p></li>");
                }
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 제품 정보 set
 */
function get_item(item_cd, item_sub, local_cd, type=''){
    var stat = false; 

    $.ajax({ 
        url: '/ord/esti_ing/get_item',
        type: 'GET',
        async: false,
        data: {
            item_cd     : item_cd,
            local_cd    : local_cd,
            ord_no      : $('#p_ord_no').val(),
            ord_seq     : $('#p_ord_seq').val()
        },
        dataType: "json",
        success: function(result) {
            $('#color'+item_cd+'_'+item_sub.replace(/ /g,"")+'').prop('checked', true);

            if(type != 'M'){
                $('.product_pop').bPopup().close();     // 제품 팝업 닫기
                device(2);
                $('.add_esti').show();
    
                /** 옵션 초기화 */
                $('#option_nm_1').text('옵션1');
                $('#option1').text('옵션 선택1');
                $('#option2').text('옵션 선택2');
                $('#option_nm_2').text('옵션2');
                $('#option1_amt, #option2_amt').text(0);
                $('#opti_1, #opti_2, #bast_i, #height_i').hide();
                get_s_str('r', 'option1');
                get_s_str('r', 'option2');
    
                /** 총 단위 및 금액 초기화 */
                $('#total_unit').text(0);
                $('#item_amt, #base_amt').text('+ 0');
                $('#total_amt').text(0);
    
                $('.select_product').hide();            // 제품 선택 div 숨기기
                switch(result.item['unit']){
                    case '001': case '002':
                        $('.blind').css('display', 'flex');     // 블라인드 입력 폼 show
    
                        $('.curtain').css('display', 'none');
                        $('.ea').css('display', 'none');
                    break;
                    case '005': case '011':
                        $('.ea').css('display', 'flex');     // EA, BOX 입력 폼 show
    
                        $('.curtain').css('display', 'none');
                        $('.blind').css('display', 'none');
                    break;
                    case '006': case '007':
                        $('.curtain').css('display', 'flex');   // 커텐 입력 폼 show
    
                        $('.blind').css('display', 'none');
                        $('.ea').css('display', 'none');
                        $('.ct').text(result.item['code_nm']);
                        if(result.item['proc_gb'] === "1"){
                            var spec = JSON.parse(result.item['spec']);

                            $('#p_c_work_way').val(spec['work_way']).prop("selected", true);
                            $('#p_c_usage').val(spec['usage']).prop("selected", true);
                            $('#p_c_div_gb').val(spec['div_gb']).prop("selected", true);
                            $('#p_c_base_st').val(spec['base_st']).prop("selected", true);
                        }
                    break;
                }
    
                $('.p_name').text(result.item['item_nm']+' '+item_sub+' ('+parseInt(result.item['size'])+result.item['code_nm']+')');        // 제품명-색상 표기
                $('#p_local_cd').val(result.item['local_cd']);
                $('#p_item_cd').val(result.item['item_cd']);
                $('#p_item_nm').val(result.item['item_nm']+' '+item_sub);
                $('#p_unit_amt').val(parseInt(result.item['sale_amt']));                    // 공장 판매 단가
    
                /*if(result.item['sale_amt'] == 0){                                           // 가격 표기
                    $('.price').text(commas(parseInt(result.item['client_amt']))+' 원');
                    $('#p_sale_amt').val(parseInt(result.item['client_amt']));
                }else{
                    $('.price').text(commas(parseInt(result.item['sale_amt']))+' 원');
                    $('#p_sale_amt').val(parseInt(result.item['sale_amt']));
                }*/

                /** 단가 => 소비자 판매단가로 설정 */
                $('.price').text(commas(parseInt(result.item['client_amt']))+' 원'); 
                $('#p_sale_amt').val(parseInt(result.item['client_amt']));
                $('#p_base_amt').val(parseInt(result.item['base_amt']));
            }

            $('#p_buy_vat').val(result.item['buy_vat']);                                // 매입처 세액 여부

            var amt         = 0;

            /** 세션 스토리지 저장 */
            if(type == 'M'){
                var ord_spec    = JSON.parse(result.esti['ord_spec']);
                var option      = JSON.parse(result.esti['option']);

                amt = parseInt(result.esti['unit_amt']);
            }else{
                amt = parseInt(result.item['client_amt']);
            }
            //get_s_str('s', 'pd_cd', result.item['pd_cd']);
            get_s_str('s', 'amt', amt);
            get_s_str('s', 'base_amt', result.item['base_amt']);
            get_s_str('s', 'n_size', type == 'M' ? ord_spec['size'] : result.item['size']);
            get_s_str('s', 'unit', type == 'M' ? ord_spec['unit'] : result.item['unit']);
            get_s_str('s', 'item_sub', item_sub);
            get_s_str('s', 'width_len', type == 'M' ? ord_spec['width_len'] : result.item['width_len']);
            get_s_str('s', 'height_len', type == 'M' ? ord_spec['height_len'] : result.item['height_len']);
            get_s_str('s', 'height_unit', type == 'M' ? ord_spec['height_unit'] : result.item['height_unit']);
            get_s_str('s', 'height_op1', type == 'M' ? ord_spec['height_op1'] : result.item['height_op1']);
            get_s_str('s', 'height_op2', type == 'M' ? ord_spec['height_op2'] : result.item['height_op2']);

            if(type == 'M'){
                var option1 = {
                    'amt'   :   option['op1_amt'],
                    'unit'  :   option['op1_unit'] == '001' ? '+' : '*'
                };
            
                get_s_str('s', 'option1', JSON.stringify(option1));

                var option2 = {
                    'amt'   :   option['op2_amt'],
                    'unit'  :   option['op2_unit'] == '001' ? '+' : '*'
                };
            
                get_s_str('s', 'option2', JSON.stringify(option2));
            }

            get_option_list(result.item['item_lv']); /** /app/esti_ing.js */
            get_unit_calculation();

            stat = true;
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });

    return stat;
}