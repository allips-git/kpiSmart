/*================================================================================
 * @description 공장 시스템 센터 주문 승인내역 상세 관리 JS
 * @author 김민주, @version 1.0, @last date 2022/01/18
 ================================================================================*/

  $(function () {

    // 주문 상세 조회
    var ord_no = get_parameter('no');
    get_ord_com_detail({'local_cd':$("#local_cd").val(), 'ord_no':ord_no}); 

    // 목록으로 돌아가기
    $("#btn_list").off().click(function () { 
        window.location.replace('/cen/ord_com');
    });

});

/**
 * @description 주문 상세 확인
 */
 function get_ord_com_detail(obj) {

    $.ajax({

        url: '/cen/ord_com/detail',
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
                ord_addr = (ord_zip != '') ? '('+ord_zip+') '+ord_addr+' '+ord_addr_detail : ''; 

                // 주문 상세 TEXT 값
                var field = { "cust_nm":data.result.list[0].cust_nm, "ceo_nm":data.result.list[0].ceo_nm, "biz_num":data.result.list[0].biz_num
                    , "address":data.result.list[0].address, "amount":commas(parseFloat(data.result.list[0].amount))
                    , "limit_amt":commas(parseFloat(data.result.list[0].limit_amt)), "pay_gb":data.result.list[0].pay_gb_nm
                    , "cust_grade":data.result.list[0].cust_grade_nm, "biz_memo":data.result.list[0].biz_memo // 거래처 비고
                    , "dlv_dt": data.result.list[0].dlv_dt, "ord_dt":data.result.list[0].ord_dt
                    , "per_dt":data.result.list[0].per_dt, "ord_addr":ord_addr
                }; process(field, "text");

                var field = { "total_ord_qty":data.result.list[0].base_seq, "total_qty":data.result.list[0].total_qty
                    , "total_amt":commas(parseFloat(data.result.list[0].total_amt)), "memo":data.result.list[0].memo // 주문 마스터 비고
                }; process(field, "ctext");

                // 주문 상세 VALUE 값
                var field = { "ord_no": data.result.list[0].ord_no };
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
						str += '<p>' + spec['size'] + '&nbsp;' + list.unit_nm + '</p>';
						str += '</td>';
						str += '<td class="w10 number">' + qty['qty'] + '</td>';


					} else if(spec['unit']  == '006' || spec['unit']  == '007') { // 기본 단위가 야드, 폭일 경우
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
                    str += '<td class="T-left w23">' + list.ord_memo + '</td>';
                    str += '<td class="w10">' + list.fin_nm + '</td>';
                    str += '</tr>';

                }); 

            } else {

                alert('주문번호 조회가 불가합니다. 다시 이용 바랍니다.');
                window.location.replace('/cen/ord_com');

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

        url: '/cen/ord_com/division',
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
