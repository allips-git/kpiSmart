/*================================================================================
 * @name: 김원명 - 앱 고객 리스트
 * @version: 1.0.0, @date: 2022/03/02
 ================================================================================*/
let client_cnt  = 20;
let client_stat = true;

$(function(){
    $(window).on("scroll", function(){
        if (parseInt($(window).scrollTop()) >= (($(document).height() - $(window).height())*0.9)) // 스크롤 끝 부분쯤 도착했을 시
        {
            if (client_stat)
            {
                client_stat = false;
                $('#loading').show();
                document.body.scrollIntoView(false);

                setTimeout(function(){ /** 로딩 이미지 0.2초 보여주고 실행 */
                    get_client_list();
                },200);
            }
        }
    });

    $('#op').change(function(){
        $('#loading').show();
        $('#client_list').html('');
        client_cnt = 0;
        
        get_client_list();        
    });

    /** 검색 text에서 엔터키 누를 시 list */
    $("#sc").keyup(function(e){
        if (e.keyCode == 13)
        {
            $('#loading').show();
            $('#client_list').html('');
            client_cnt = 0;
            
            get_client_list();
        }
    });
});

/**
 * @description 고객리스트
 */
function get_client_list()
{
    var client_list = '';

    $.ajax({ 
        url: '/client/client_list/get_client_list',
        type: 'GET',
        data: {
            st : client_cnt,
            op : $('#op option:selected').val(),
            sc : $('#sc').val()
        },
        dataType: "json",
        success: function(result) {
            $('#loading').hide();

            if (result.list.length != 0)
            {
                client_list += '<ul>';

                $.each(result.list, function(index, item){
                    var mas_spec = item.mas_spec != '' ? JSON.parse(item.mas_spec) : '';
                    var mas_pay  = item.mas_pay != '' ? JSON.parse(item.mas_pay) : '';
                    var ord_amt  = parseInt(item.amt);

                    if (mas_spec !== '')
                    {
                        if (mas_spec['adjust_dis_unit'] == '001')
                        {
                            var adjust_dis_amt = parseInt(mas_spec['adjust_dis_amt']);
                        }
                        else
                        {
                            var adjust_dis_amt = ( (ord_amt) / 100 ) * parseFloat(mas_spec['adjust_dis_amt']);
                        }

                        ord_amt = ord_amt - parseInt(adjust_dis_amt) + parseInt(mas_spec['adjust_add_amt']) - parseInt(mas_spec['cut_amt']);
                    }

                    if (mas_pay !== '')
                    {
                        if (mas_pay['dis_unit'] == '001')
                        {
                            var pay_dis_amt = parseInt(mas_pay['dis_amt']);
                        }
                        else
                        {
                            var pay_dis_amt = ( ord_amt / 100 ) * mas_pay['dis_amt'];
                        }

                        ord_amt = ord_amt - pay_dis_amt + mas_pay['add_amt'];
                    }

                    client_list += '<li onclick="location.href=\'/client/client_info?cust_cd='+item.cust_cd+'\'">'

                    switch (item.stat)
                    {
                        case '1':
                            if (item.finyn == '002')
                            {
                                client_list += '<div class="icon unreg">대기</div>';
                            }
                            else
                            {
                                client_list += '<div class="icon est">견적</div>';
                            }
                        break;
                        case '3':
                            client_list += '<div class="icon balju">발주</div>';
                        break;
                        case '4':
                            client_list += '<div class="icon sigong">시공</div>';
                        break;
                        case '5':
                            client_list += '<div class="icon pay">결제</div>';
                        break;
                        case '6':
                            client_list += '<div class="icon com">완료</div>';
                        break;
                        case '7':
                            client_list += '<div class="icon cancle">취소</div>';
                        break;
                    }

                    client_list += '<div class="user">';

                    if (item.cust_nm != "")
                    {
                        client_list += '<h5>'+item.cust_nm+'</h5>';
                    }
                    else
                    {
                        client_list += '<h5></h5>';
                    }

                    if (item.biz_zip != "")
                    {
                        client_list += '<p class="add Elli">'+item.address+item.addr_detail+'</p>';
                    }
                    else
                    {
                        client_list += '<p class="add Elli"></p>';
                    }

                    client_list += '</div>';
                    client_list += '<div class="etc">';
                    client_list += '<p class="date">'+item.reg_dt.substr(0, 10)+'</p>';
                    client_list += '<p class="price"><span>'+commas(parseInt(ord_amt))+'</span> 원</p>';
                    client_list += '</div>';
                    client_list += '</li>';
                });

                client_list += '</ul>';
    
                $('#client_list').append(client_list);

                if (result.list.length == 20)
                {
                    client_cnt = client_cnt + 20;
                    client_stat = true;
                }
            }
            else
            {
                client_stat = false;
                if (client_cnt == 0)
                {
                    $('#client_list').html('<div class="no_client"><p> 해당 검색 결과의 고객이 없습니다.</p></div>');
                }
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}