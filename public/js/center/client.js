/*================================================================================
 * @name: 김원명 - 앱 고객 리스트
 * @version: 1.0.0, @date: 2022/08/03
 ================================================================================*/
let client_cnt  = 20;
let client_stat = true;
let client_pop  = ['N'];

let client_ing_stat = true;

$(function(){
    /**
     * @description 고객 리스트에서 사용
     */
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

    /**
     * @description 고객 등록 및 수정에서 사용
     */
	$("#tel").on("input", function() {
        $(this).val( $(this).val().replace(/[^0-9]/gi,"") );
    });

    $(document).on('click', '#in, #nt, #up', function(){
        if (check_val())
        {
            if (client_ing_stat)
            {
                get_client_result($(this).attr('id'));
            }
            else
            {
                swal('처리 중', '잠시만 기다려주세요.', '', 1);
            }
        };
    });
});

/**
 * @description 고객리스트
 */
function get_client_list()
{
    var client_list = '';

    $.ajax({ 
        url: '/ord/ord/get_client_list',
        type: 'GET',
        data: {
            st : client_cnt,
            op : $('#op option:selected').val(),
            sc : $('#sc').val()
        },
        dataType: "json",
        success: function(result) 
        {
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

                    client_list += '<li class="client_list" onclick="get_client_detail(\''+item.cust_cd+'\')">'

                    switch (item.finyn)
                    {
                        case '002':
                            client_list += '<div class="icon unreg"><span>대기</span></div>';
                        break;
                        case '003':
                            client_list += '<div class="icon est"><span>견적</span></div>';
                        break;
                        case '005':
                            client_list += '<div class="icon balju"><span>발주</span></div>';
                        break;
                        case '008':
                            client_list += '<div class="icon sigong"><span>시공</span></div>';
                        break;
                        case '017':
                            client_list += '<div class="icon pay"><span>결제</span></div>';
                        break;
                        case '018':
                            client_list += '<div class="icon cancle"><span>취소</span></div>';
                        break;
                        case '031':
                            client_list += '<div class="icon com"><span>완료</span></div>';
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

                    client_list += '<p class="add">';

                    if (item.biz_zip != "")
                    {
                        client_list += '<span class="Elli">'+item.address+'</span>';
                        client_list += '<span class="Elli">'+item.addr_detail+'</span>';
                    }
                    else
                    {
                        client_list += '<span class="Elli"></span>';
                        client_list += '<span class="Elli"></span>';
                    }

                    client_list += '</p>';
                    client_list += '</div>';
                    client_list += '<div class="w10 phone_num nomobile">'+item.tel+'</div>';
                    client_list += '<div class="etc">';
                    client_list += '<p class="date">'+item.reg_dt.substr(0, 10)+'</p>';
                    client_list += '<p class="nomobile">그룹</p>';
                    client_list += '<p class="price T-right pdr50">';
                    client_list += '<span class="number">'+commas(parseInt(ord_amt))+'</span><span class="nopc">원</span>';
                    client_list += '</p>'
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
        error: function(request,status,error) 
        {
            swal('실패', '고객 리스트를 불러오는데 실패하였습니다. 관리자에게 문의해주세요.', '', 1);
            //alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        },
    });
}

/**
 * @description 고객 리스트 클릭 시 고객 상세
 */
function get_client_detail(cust_cd)
{
    $.ajax({ 
        url: '/ord/ord/get_client_detail',
        type: 'GET',
        data: {
            cust_cd : cust_cd
        },
        dataType: "json",
        success: function(result) 
        {
            var client = result.client;
            
            $('#client_info_btn').attr('onclick', 'get_client_pop(2, \''+client['cust_cd']+'\')');
            $client_info_tel = $('#client_info_tel');

            $client_info_tel.text(client['tel']);
            $client_info_tel.attr('href', 'tel:'+client['tel']+'');

            $('#client_info_dt').text(client['esti_dt']);
            $('#client_info_address').text(client['address']);
            $('#client_info_addr_detail').text(client['addr_detail']);
            $('#client_info_person').text(client['person']);

            $('#client_info').bPopup({
                modalClose: true
                , opacity: 0.7
                , positionStyle: 'absolute' 
                , speed: 100
                , transition: 'fadeIn'
                , transitionClose: 'fadeOut'
                , zIndex : 100,
                //, modalColor:'transparent' 
            });
        },
        error: function(request,status,error) 
        {
            swal('실패', '고객 정보를 불러오는데 실패하였습니다. 관리자에게 문의해주세요.', '', 1);
            //alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        },
    });
}

/**
 * @description 고객 등록 및 수정 팝업 open
 */
function get_client_pop(num, cust_cd='')
{
    if(num == 1)
    {
        var date = new Date();
        var hh   = ('0' + date.getHours()).slice(-2);
        var mm   = ('0' + date.getMinutes()).slice(-2);

        $('#client_p').val('in');
        $('#cust_nm, #tel, #address, #addr_detail, #biz_zip').val('');
        $('#client_person option:eq(0)').prop('selected', true);
        $('#datepicker').val(get_date('today'));
        $('#client_time').val(hh+':'+mm);

        $('#client_btn').html("<button type='button' id='in' class='gray'>저장하기</button><button type='button' id='nt' class='blue add_ord'>명세서 이동</button>");

        get_bpopup('client_ing_pop', 'client_pop', 500);
    }
    else
    {
        $('#client_p').val('up');
        $('#client_btn').html("<button type='button' id='up' class='blue'>수정하기</button>");

        $.ajax({ 
            url: '/ord/ord/get_client_info',
            type: 'GET',
            data: {
                cust_cd : cust_cd
            },
            dataType: "json",
            success: function(result) 
            {
                var client_info = result.client;
                
                $('#datepicker').val(client_info['esti_Ymd']);
                $('#client_time').val(client_info['esti_time']);
                $('#cust_cd_p').val(client_info['cust_cd']);
                $('#cust_nm').val(client_info['cust_nm']);
                $('#tel').val(client_info['tel']);
                $('#biz_zip').val(client_info['biz_zip']);
                $('#address').val(client_info['address']);
                $('#addr_detail').val(client_info['addr_detail']);

                if (client_info['person'] != '')
                {
                    $('#client_person').val(client_info['person']).prop('selected', true);
                }
                
                get_bpopup('client_ing_pop', 'client_pop', 500);
            },
            error: function(request,status,error) 
            {
                swal('실패', '고객 정보를 불러오는데 실패하였습니다. 관리자에게 문의해주세요.', '', 1);
                //alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            },
        });
    }
}

/**
 * @description 고객등록 및 수정 (중복 검증 포함)
 */
function get_client_result(kind)
{
    client_ing_stat = false;

    $.ajax({ 
        url: '/ord/ord/get_client_result',
        type: 'GET',
        data: {
            type        : $('#client_p').val(),
            date        : $('#datepicker').val(),
            time        : $('#client_time').val(),
            cust_cd     : $('#cust_cd_p').val(),
            cust_nm     : $('#cust_nm').val(),
            tel         : $('#tel').val(),
            biz_zip     : $('#biz_zip').val(),
            address     : $('#address').val(),
            addr_detail : $('#addr_detail').val(),
            person      : $('#client_person option:selected').val()
        },
        dataType: "json",
        success: function(result) 
        {
            var cust_cd = result.cust_cd;
            var ord_no  = result.ord_no;

            switch (result.msg)
            {
                /** 전화번호 중복 시 */
                case 'overlap':
                    swal('중복', '이미 등록된 전화번호입니다.', '', 1);
                    $('#tel').focus();
                break;
                /** 성공 */
                case 'success':
                    switch (kind)
                    {
                        /** 고객등록 */
                        case 'in': case 'nt':
                            swal('완료', '고객등록이 완료되었습니다.', '', 3).then((result) => {
                                if (kind == 'in')
                                {
                                    /** 처리 예정 */
                                }
                                else
                                {
                                    /** 처리 예정 */
                                }
                            });
                        break;
                        /** 고객수정 */
                        case 'up':
                            swal('완료', '고객수정이 완료되었습니다.', '', 3).then((result) => {
                                /** 처리 예정 */
                            });
                        break;
                    }
                break;
                /** 실패 */
                case 'fail':
                    swal('실패', '고객등록 등록 및 수정에 실패하였습니다. 잠시 후 다시 시도해주세요.', '', 1);
                break;
            }

            client_ing_stat = true;
        },
        error: function(request,status,error) 
        {
            swal('실패', '고객등록 등록 및 통신에 실패하였습니다. 관리자에게 문의해주세요.', '', 1);
            //alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        },
    });
}

/**
 * @description 고객 등록 및 수정 시 공백 값 check
 */
function check_val()
{
    if ($('#cust_nm').val() == '')
    {
        swal('알림', '고객명을 입력하세요.', 'cust_nm', 1);
        return false;
    }

    if ($('#tel').val() == '')
    {
        swal('알림', '전화번호를 입력하세요.', 'tel', 1);
        return false;
    }

    if ($('#address').val() == '')
    {
        swal('알림', '주소를 검색하여 입력하세요.', '', 1);
        return false;
    }

    return true;
};

/**
 * @description 키보드가 올라온 상태에서 주소 검색시 디자인 에러로 키보드 내린다음에 주소창이 호출되도록 설정
 * @author 김민주, @version 1.0, @last date 2022/03/03
 */
function call_keyboard()
{
    var os;
    var mobile = (/iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()));  
    // mobile check
    if (mobile) 
    { 
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.search("android") > -1) { // agent: android
            window.androidFunction.downKeyboard();
        } 
    } 
    else 
    {
        call_post(); // web 테스트용
    }
}

function call_post() 
{
    postcode();
}