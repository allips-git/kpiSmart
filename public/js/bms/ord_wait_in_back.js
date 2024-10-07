/*================================================================================
 * @description 공장 시스템 센터 주문 승인(대기) 등록페이지 관리 JS
 * @author 김민주, @version 1.0, @last date 2021/12/21
 ================================================================================*/

 $(function () {

    // 주문 상세 조회
    var ord_no = get_parameter('no');
    get_ord_detail({'local_cd':$("#local_cd").val(), 'ord_no':ord_no}); 

    // 목록으로 돌아가기
    $("#btn_list").off().click(function () { 
        var con = confirm('메인페이지로 다시 나가시겠습니까?');
        if(con) {
            window.location.replace('/cen/ord_wait');
        }
    });

    // 주문 승인
    $("#btn_reg").off().click(function() {

        var con = confirm('센터 주문 승인을 하시겠습니까?');
        if(con) {
            ord_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }

    });

});

/**
 * @description 전송 값 유효성 검사
 */
function ord_validation(obj) {

    $.ajax({

        url: '/cen/ord_wait/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) { 

            // in, up, fail
            if(data.code == '100') {
                ord_register(obj);
            } else if(data.code == '999') {
                toast('입력값이 정확하지 않습니다. 확인 후 다시 이용바랍니다.', true, 'danger');
            }

        }

    });

}

/**
 * @description 주문 승인 등록
 */
function ord_register(obj) {

    $.ajax({

        url: '/cen/ord_wait/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // success, fail 
            if(data.code == '100') {
                alert('승인이 완료 되었습니다');
                window.location.replace('/cen/ord_wait');
            } else if(data.code == '400') {
                toast('이미 승인 완료된 주문입니다. 확인 후 다시 이용바랍니다.', true, 'danger');
            } else if(data.code == '999') {
                toast('승인실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
            }

        }

    });

}

/**
 * @description 주문 상세 확인
 */
 function get_ord_detail(obj) {

    $.ajax({

        url: '/cen/ord_wait/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) { 

            // var setting
            var str = '';
            var spec = '';
            var qty = '';
            var biz_addr = '';

            var count = data.result.count;
            if(count > 0) {

                // 센터 주소
                var ord_zip = data.result.list[0].ord_zip;
                var ord_addr = data.result.list[0].ord_addr;
                var ord_addr_detail = data.result.list[0].ord_addr_detail;

                var dlv_gb = data.result.list[0].dlv_gb;
                var dlv_gb_nm = data.result.list[0].dlv_gb_nm;
                if(dlv_gb === '001'){
					ord_addr = '['+dlv_gb_nm+'] '+ord_addr_detail;
				}else{
					ord_addr = '('+ord_zip+') '+ord_addr+' '+ord_addr_detail;
				}

                // 주문 상세 TEXT 값
                var field = { "cust_nm":data.result.list[0].cust_nm, "ceo_nm":data.result.list[0].ceo_nm, "biz_num":data.result.list[0].biz_num
                    , "address":data.result.list[0].address, "amount":commas(parseFloat(data.result.list[0].amount))
                    , "limit_amt":commas(parseFloat(data.result.list[0].limit_amt)), "pay_gb":data.result.list[0].pay_gb_nm
                    , "cust_grade":data.result.list[0].cust_grade_nm, "ord_dt": data.result.list[0].ord_dt, "reg_dt":data.result.list[0].reg_dt
                    , "biz_memo":data.result.list[0].biz_memo, "total_qty":data.result.list[0].total_qty
                    , "total_amt":commas(parseFloat(data.result.list[0].total_amt)), "memo":data.result.list[0].memo, "ord_addr":ord_addr
                };
                process(field, "text");

                // 주문 상세 VALUE 값
                var field = { "ord_no": data.result.list[0].ord_no, "dlv_dt": data.result.list[0].dlv_dt };
                process(field, "val");

                $.each(data.result.list, function (i, list) {

                    spec = JSON.parse(list.ord_spec);   // 주문 스팩
                    qty = JSON.parse(list.ord_qty);     // 주문 수량

                    // 선택된 리스트의 키값으로 객체 생성(주문번호, 순번)
                    var choice = new Object();
                    choice.ord_no = list.ord_no;
                    choice.ord_seq = list.ord_seq;

                    str += '<tr>';
                    str += '<td class="w5">'+ list.rownum +'</td>';
                    str += '<td class="T-left">'+ list.item_nm;
                    str += '<br>('+ list.item_cd + ')';
                    str += '</td>';

                    if(spec['unit']  == '005' || spec['unit'] == '011') { // 기본 단위가 EA, BOX일 경우

                        str += '<td class="w12 ord-info">';
                        str += '<p>'+spec['size']+'&nbsp;'+list.unit_nm+'</p>';
                        str += '</td>';
                        str += '<td class="w10 number">'+qty['qty']+'</td>';

					} else if(spec['unit'] == '006' || spec['unit'] == '007') { // 기본 단위가 야드, 폭일 경우

						var div_gb , unit;
						if(spec['div_gb'] === '001'){		//가공방법이 001 일 경우! 양개
							div_gb = '양개';
						}else if(spec['div_gb'] === '002'){	//가공방법이 002 일 경우! 편개
							div_gb = '편개';
						}

						if(spec['unit']  == '006'){			//야드
							unit = spec['ord_yard'];
						}else if(spec['unit']  == '007'){	//폭
							unit = spec['ord_pok'];
						}

						str += '<td class="w12 ord-info">';
						str += '<p>'+spec['ord_width']+' * '+spec['ord_height']+' ('+unit+' '+list.unit_nm+')</p>';
						str += '</td>';
						str += '<td class="w10 number">'+ div_gb + ':' + qty['qty'] + '</td>';

                    } else if(spec['unit'] == '001' || spec['unit'] == '002') { // 기본 단위가 회배, ㎡일 경우

                        if(spec['division'] > 1) { // 분할일 경우

                            str += '<td class="w12 ord-info">';
                            str += '<p>'+spec['ord_width']+' * '+spec['ord_height']+' ('+spec['ord_hebe']+' 회배)</p>';
                            str += '<span class="bunhal" onmouseover=get_division(event,'+JSON.stringify(choice)+'); onmouseout=focus_out();>'+spec['division']+'분할(상세보기)</span>';
                            str += '</p>';
                            str += '</td>';
                            str += '<td class="w10 number">';
                            str += '<div class="counter">'+Number(qty['qty'])+'</div>';
                            str += '<p>좌 : '+qty['left_qty']+'</p><p>우 : '+qty['right_qty']+'</p>';
                            str += '</td>';                     

                        } else { // 분할 아닐경우

                            str += '<td class="w12 ord-info">';
                            str += '<p>'+spec['ord_width']+' * '+spec['ord_height']+' ('+spec['ord_hebe']+' 회배)</p>';
                            str += '<span class="nobun">분할없음</span>';
                            str += '</p>';
                            str += '</td>';
                            str += '<td class="w10 number">';
                            str += '<div class="counter">'+Number(qty['left_qty']+qty['right_qty'])+'</div>';
                            str += '<p>좌 : '+qty['left_qty']+'</p><p>우 : '+qty['right_qty']+'</p>';
                            str += '</td>';

                        } // end division check

                    } // end unit check

                    str += '<td class="w10 T-right">'+ commas(parseFloat(list.unit_amt))+'원'+'</td>';
                    str += '<td class="w10 T-right">'+ commas(parseFloat(list.amt))+'원'+'</td>';
                    str += '<td class="T-left w25">' + list.ord_memo + '</td>';
                    str += '</tr>';

                }); 

            } else {

                alert('주문번호 조회가 불가합니다. 다시 이용 바랍니다.');
                window.location.replace('/cen/ord_wait');

            } // end else if
                
            $("#data-container").html(str); // ajax data output

        }, // success end
        error: function(request, status, error) {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', { sticky: true, type: 'danger' });

        }, // err end

    });


}

/**
 * @description 분할 상세보기
 */
function get_division(event, obj) {

    $.ajax({

        url: '/cen/ord_wait/division',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) { 

            var str = '';
            if(data.result.count > 0) {
                $.each(data.result.list, function (i, list) {
                    str += '<span>' + (i+1) + '. 가로 : '+list.div_width;
                    str += 'cm 세로 : '+list.div_height;
                    str += 'cm 위치 : '+handle(JSON.parse(list.handle_pos));
                    str += '('+list.div_hebe+'&nbsp;'+list.unit_nm+')';
                    str += '</span>';   
                });
            } else {
                str += '<span>분할없음</span>';  
            }

            // 마우스 우측 상단으로 상세분할 데이터 표기
            $('.bunhal_list').css({"left": event.pageX+"px", "top": event.pageY-50 +"px"});
            $(".bunhal_list").html(str).show(); 
            
        }

    });

}

/**
 * @description 분할 마우스 아웃 이벤트용 함수
 */
function focus_out() {

    $(".bunhal_list").hide(); 

}
