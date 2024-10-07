/*================================================================================
 * @name: 김원명 - 앱 회계 관리
 * @version: 1.0.0, @date: 2022/05/25
 ================================================================================*/
let acc_gubun   = get_parameter('t');
let acc_cnt     = 20;
let acc_stat    = true;
let btn_stat    = 'W';
let acc_pop     = 'F';

$(function(){
    $(window).on("scroll", function(){
        if (acc_gubun == 'F' && get_parameter('dt') == '') /** 첫 화면 결제대기 리스트만 무한 스크롤 적용 */
        {
            if (parseInt($(window).scrollTop()) >= (($(document).height() - $(window).height())*0.9)) // 스크롤 끝 부분쯤 도착했을 시
            { 
                if (acc_stat)
                {
                    acc_stat = false;
                    $('#loading').show();
                    document.body.scrollIntoView(false);
    
                    setTimeout(function(){ /** 로딩 이미지 0.2초 보여주고 실행 */
                        get_acc_list('Y');
                    },200);
                }
            }
        }
    });
    
    $("input:radio[name=radio]").change(function(){
        var id = $(this).attr('id');

        if (id == 'radio01')
        {
            acc_gubun = 'F';

            if (get_parameter('t') != 'F')
            {
                $('.tabbox01_1').show();
            }
            else
            {
                $('.tabbox01_1').hide();
            }
        }
        else
        {
            acc_gubun = 'N';
            $('.tabbox01_1').hide();
        }
    });

    /** 결제대기, 계약진행 버튼 */
    $(document).on('click', '#btn_wait, #btn_ing', function(){
        switch ($(this).attr('id'))
        {
            case 'btn_wait':
                if (btn_stat != 'W')
                {
                    $('#loading').show();

                    btn_stat = 'W';
                    acc_cnt  = 0;
                    acc_stat = true;

                    get_acc_list('N');
                }
            break;
            case 'btn_ing':
                if (btn_stat != 'I')
                {
                    $('#loading').show();

                    btn_stat = 'I';
                    acc_cnt  = 0;
                    acc_stat = true;
                    
                    get_acc_list('N');
                }
            break;
        }
    });

    /** 이전 년도 기록 불러오기 */
    $('#btn_prev').off().click(function(){
        $('#loading').show();
        get_mon_list($(this).attr('data-year'));
    });

    /** 비용/고정자산 저장하기 버튼 클릭 */
    $('#btn_save').off().click(function(){
        var con     = custom_fire('저장하기', '저장하시겠습니까?', '취소', '저장');

        con.then((result) => {
            if (result.isConfirmed)
            {
                expend_validation($("#frm").serializeObject());
            }
        });
    });

    /** 비용/고정자산 삭제 버튼 클릭 */
    $('#asst_del').off().click(function(){
        var del_val = [];

        $.each($("input:checkbox[name=chkbox]"), function(index, item){
            if ($(this).is(":checked"))
            {
                del_val.push($(this).val());
            }
        });

        if (del_val.length === 0)
        {
            swal('알림', '삭제할 데이터를 선택하세요.', '', 1);
        }
        else
        {
            var con     = custom_fire('삭제하기', '삭제하시겠습니까?', '취소', '삭제');

            con.then((result) => {
                if (result.isConfirmed)
                {
                    expend_del(del_val);
                }
            });
        }
    });

    $(document).on('click', '#asst_list li', function(e){
        if ($(e.target).is('li'))
        {
            $.ajax({ 
                url: '/acc/acc_mgt/get_expend_info',
                type: 'GET',
                data: {
                    cd : $(this).attr('data-cd')
                },
                dataType: "json",
                success: function(result) {
                    $('#p').val('up');
                    $('#p_asst_cd').val(result.info['asst_cd']);
                    $('#asst_dt').val(result.info['asst_dt']);
                    $('#asst_gb').val(result.info['asst_gb']);
                    $('#amt').val(parseInt(result.info['amt']));
                    $('#content').val(result.info['content']);
                    $('#content_detail').val(result.info['content_detail']);

                    $('.expend_ing').bPopup({
                        modalClose: true
                        , opacity: 0.7
                        , positionStyle: 'fixed' 
                        , speed: 100
                        , transition: 'fadeIn'
                        , transitionClose: 'fadeOut'
                        , zIndex : 500,
                        onOpen: function(){ /** 팝업창 열릴 때 */
                            device(3);
                            acc_pop = 'F';
                        },
                        onClose: function(){ /** 팝업창 닫힐 때 */
                            device(1);
                        }
                    });
                },
                error: function(request,status,error) {
                    alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                    //$.toast('실패', {sticky: true, type: 'danger'});
                },
            });
        }
    });

    $("input:radio[name=gubun]").off().click(function(){
        get_statistics($(this).val());
    });
});

/**
 * @description 회계 - 결제 리스트 ( 결제대기 )
 */
function get_acc_list(gubun){
    var acc_list = '<div class="btns"><button class="pp" id="btn_wait">결제대기</button><button class="blue" id="btn_ing">계약진행</button></div>';

    $.ajax({ 
        url: '/acc/acc_mgt/acc_list',
        type: 'GET',
        data: {
            stat    : btn_stat, /** 구분 (W : 결제대기, I : 계약진행) */
            gubun   : gubun,    /** 무한스크롤 구분 (Y/N) */
            st      : acc_cnt,
            lt      : $('#acc_last').val()
        },
        dataType: "json",
        success: function(result) {
            $('#loading').hide();

            if (result.info['list'].length != 0)
            {
                $.each(result.info['date'], function(index, date){
                    var week = ['일', '월', '화', '수', '목', '금', '토'];

                    var d_dt      = date.dt;
                    var last      = gubun == 'N' ? get_date('today').replace(/-/gi, "") : $('#acc_last').val();

                    var d_year    = d_dt.substr(0,4);
                    var d_mon     = d_dt.substr(4,2);
                    var d_day     = d_dt.substr(6,2);

                    var d_week    = week[new Date(d_year+'-'+d_mon+'-'+d_day).getDay()];

                    if (gubun == 'N' && index == 0)
                    {
                        acc_list += '<div class="date">';
                        acc_list += '<p>';
                        acc_list += ''+d_mon+'/'+d_day+' ';
                        acc_list += ''+d_week+' ';
                        acc_list += '</p>';
                        acc_list += '</div>';
                    }
                    else
                    {
                        if (d_dt != last)
                        {
                            acc_list += '<div class="date">';
                            acc_list += '<p>';
                            acc_list += ''+d_mon+'/'+d_day+' ';
                            acc_list += ''+d_week+' ';
                            acc_list += '</p>';
                            acc_list += '</div>';
                        }
                    }

                    $.each(result.info['list'], function(index, list){
                        /*if (list.dt === last)
                        {
                            acc_list += '<li>';
                            acc_list += '<div class="left">';
                            acc_list += '<h2>';
                            acc_list += '<span class="Elli">'+list.cust_nm+'</span>';
                            if (btn_stat == 'W')
                            {
                                acc_list += '<button type="button" class="indigo" onclick="location_url(\'/ord/ord_in?cust_cd='+list.cust_cd+'&ord_no='+list.ord_no+'\')">결제대기</button>';
                            }
                            else
                            {
                                acc_list += '<button type="button" class="blue" onclick="location_url(\'/ord/ord_in?cust_cd='+list.cust_cd+'&ord_no='+list.ord_no+'\')">계약진행</button>';
                            }
                            acc_list += '</h2>';
                            acc_list += '<p>견적일 : '+list.esti_dt+'</p>';
                            acc_list += '<p>'+list.addr_detail+'</p>';
                            acc_list += '</div>';
                            acc_list += '<div class="right">';
                            acc_list += '<dl>';
                            acc_list += '<dt>매출</dt>';
                            acc_list += '<dd><span>'+commas(parseInt(list.result_amt))+'원</dd>';
                            acc_list += '</dl>';
                            acc_list += '<dl>';
                            acc_list += '<dt>매입</dt>';
                            acc_list += '<dd><span>'+commas(parseInt(list.buy_amt))+'</span>원</dd>';
                            acc_list += '</dl>';
                            acc_list += '<dl class="blue">';
                            acc_list += '<dt>수익</dt>';
                            acc_list += '<dd><span>'+commas(parseInt((list.result_amt-list.buy_amt)))+'</span>원</dd>';
                            acc_list += '</div>';
                            acc_list += '</li>';
                        }
                        else
                        {
                            if (d_dt === list.dt)
                            {
                                acc_list += '<li>';
                                acc_list += '<div class="left">';
                                acc_list += '<h2>';
                                acc_list += '<span class="Elli">'+list.cust_nm+'</span>';
                                if (btn_stat == 'W')
                                {
                                    acc_list += '<button type="button" class="indigo" onclick="location_url(\'/ord/ord_in?cust_cd='+list.cust_cd+'&ord_no='+list.ord_no+'\')">결제대기</button>';
                                }
                                else
                                {
                                    acc_list += '<button type="button" class="blue" onclick="location_url(\'/ord/ord_in?cust_cd='+list.cust_cd+'&ord_no='+list.ord_no+'\')">계약진행</button>';
                                }
                                acc_list += '</h2>';
                                acc_list += '<p>견적일 : '+list.esti_dt+'</p>';
                                acc_list += '<p>'+list.addr_detail+'</p>';
                                acc_list += '</div>';
                                acc_list += '<div class="right">';
                                acc_list += '<dl>';
                                acc_list += '<dt>매출</dt>';
                                acc_list += '<dd><span>'+commas(parseInt(list.result_amt))+'원</dd>';
                                acc_list += '</dl>';
                                acc_list += '<dl>';
                                acc_list += '<dt>매입</dt>';
                                acc_list += '<dd><span>'+commas(parseInt(list.buy_amt))+'</span>원</dd>';
                                acc_list += '</dl>';
                                acc_list += '<dl class="blue">';
                                acc_list += '<dt>수익</dt>';
                                acc_list += '<dd><span>'+commas(parseInt((list.result_amt-list.buy_amt)))+'</span>원</dd>';
                                acc_list += '</div>';
                                acc_list += '</li>';
                            }
                        }*/

                        if (d_dt === list.dt)
                        {
                            acc_list += '<li>';
                            acc_list += '<div class="left">';
                            acc_list += '<h2>';
                            acc_list += '<span class="Elli">'+list.cust_nm+'</span>';
                            if (btn_stat == 'W')
                            {
                                acc_list += '<button type="button" class="indigo" onclick="location_url(\'/ord/ord_in?cust_cd='+list.cust_cd+'&ord_no='+list.ord_no+'\')">결제대기</button>';
                            }
                            else
                            {
                                acc_list += '<button type="button" class="blue" onclick="location_url(\'/ord/ord_in?cust_cd='+list.cust_cd+'&ord_no='+list.ord_no+'\')">계약진행</button>';
                            }
                            acc_list += '</h2>';
                            // acc_list += '<p>견적일 : '+list.esti_dt+'</p>';
                            acc_list += '<p>'+list.addr_detail+'</p>';
                            acc_list += '</div>';
                            acc_list += '<div class="right">';
                            acc_list += '<dl>';
                            acc_list += '<dt>매출</dt>';
                            acc_list += '<dd><span>'+commas(parseInt(list.result_amt))+'원</dd>';
                            acc_list += '</dl>';
                            acc_list += '<dl>';
                            acc_list += '<dt>매입</dt>';
                            acc_list += '<dd><span>'+commas(parseInt(list.buy_amt))+'</span>원</dd>';
                            acc_list += '</dl>';
                            acc_list += '<dl>';
                            acc_list += '<dt>수익</dt>';
                            acc_list += '<dd class="green"><span>'+commas(parseInt((list.result_amt-list.buy_amt)))+'</span>원</dd>';
                            acc_list += '</div>';
                            acc_list += '</li>';
                        }
                    });
                });

                if (gubun == 'Y')
                {
                    $('#acc_list').append(acc_list);
                }
                else
                {
                    $('#acc_list').html(acc_list);
                }

                if (result.info['list'].length == 20 || gubun == 'N')
                {
                    acc_cnt     = acc_cnt + 20;
                    acc_stat    = true;
                }

                $('#acc_last').val(result.info['last']);
            }
            else
            {
                if (gubun == 'N')
                {
                    $('#acc_list').html('<div class="btns"><button class="pp" id="btn_wait">결제대기</button><button class="blue" id="btn_ing">계약진행</button></div>');
                }
                acc_stat = false;
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 회계 - 결제 리스트 ( 계약진행 )
 */

/**
 * @description 이전 년도 기록
 */
function get_mon_list(y){
    var month_list = '';

    $.ajax({ 
        url: '/acc/acc_mgt/month_list',
        type: 'GET',
        data: {
            year : y
        },
        dataType: "json",
        success: function(result) {
            $('#loading').hide();
            if (result.info.list.length == 0)
            {
                swal('알림', ''+result.info.year+'년도 데이터가 없습니다.');
            }
            else
            {
                month_list += '<h2>'+result.info.year+'</h2>';
                month_list += '<div class="list_box">';
                month_list += '<ul>';

                $.each(result.info.list, function(index, item){
                    var yield   = Number.parseFloat(parseInt(item.result_amt) / parseInt(item.buy_ord_amt) * 50).toFixed(2);
                    var url     = '/acc/acc_mgt?t=W&y='+result.info.year+'&m='+item.m+'';

                    month_list += '<li>';
                    month_list += '<h1>'+item.m+'월</h1>';
                    month_list += '<div class="left_box">';
                    month_list += '<p>평균 수익률 '+yield+'%</p>';
                    month_list += '<p>월간 수익 '+commas(parseInt(item.result_amt)-parseInt(item.buy_ord_amt))+'원</p>';
                    month_list += '<p>결제 대기 '+commas(Number(item.wait_amt))+'원</p>';
                    month_list += '</div>';
                    month_list += '<div class="right_box">';
                    month_list += '<p>'+commas(parseInt(item.result_amt))+'원</p>';
                    month_list += '<span onclick="location_url(\''+String(url)+'\')">';
                    month_list += '<img src="/public/img/app/arrow_right_g.png" alt="">';
                    month_list += '</span>';
                    month_list += '</div>';
                    month_list += '</li>';
                });

                month_list += '</ul>';
                month_list += '</div>';
            }

            $('#mon_list').append(month_list);
            $('#prev_year').text(result.info.year-1+'년 기록을 보시겠습니까?');
            $('#btn_prev').attr('data-year', result.info.year-1);
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 통계 데이터
 */
function get_statistics(type){
    $.ajax({ 
        url: '/acc/acc_mgt/get_statistics',
        type: 'GET',
        data: {
            type : type
        },
        dataType: "json",
        success: function(result) {
            var in_amt  = Number(result.data['in_amt']);
            var out_amt = Number(result.data['out_amt']);
            var cost_amt = Number(result.data['cost_amt']);

            var in_per  = Math.floor(in_amt / (in_amt + out_amt + cost_amt) * 100);
            var out_per = Math.floor(out_amt / (in_amt + out_amt + cost_amt) * 100);
            var cost_per = 100 - in_per - out_per;

            in_per      = isNaN(in_per) ? 0 : in_per;
            out_per     = isNaN(out_per) ? 0 : out_per;
            cost_per    = isNaN(cost_per) ? 0 : cost_per;

            $('#in_amt').html('수입 : '+commas(in_amt)+' <span>원</span>');
            $('#out_amt').html('매입 : '+commas(out_amt)+' <span>원</span>');
            $('#cost_amt').html('비용 : '+commas(cost_amt)+' <span>원</span>');

            $('.blue_bar').css('width',''+in_per+'%');
            $('.yellow_bar').css('width',''+out_per+'%');
            $('.red_bar').css('width',''+cost_per+'%');

            $('#result_amt').html('손익 : '+commas(in_amt-(out_amt + cost_amt))+' <span>원</span>');
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 분류 선택 팝업 클릭 시
 */
function get_gb(gb_nm, gb_cd){
    $('#asst_gb').val(gb_nm);
    $('#p_asst_gb').val(gb_cd);

    $('.select_pop').bPopup().close();
}

/**
 * @description 비용/고정자산 입력 시 유효성 검사
 */
function expend_validation(obj){
    $.ajax({
        url: '/acc/acc_mgt/expend_validation',
        type: 'POST',
        data: obj,
        dataType: "JSON",
        success: function (result) {
            if (result.msg == 'success')
            {
                expend_result(result.params);
            }
            else
            {
                swal('알림', '입력 값을 확인해주세요.', '', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 비용/고정자산 데이터 INSERT
 */
function expend_result(obj){
    $.ajax({
        url: '/acc/acc_mgt/expend_result',
        type: 'POST',
        data: obj,
        dataType: "JSON",
        success: function (result) {
            if (result.msg == 'success')
            {
                swal('알림', '저장되었습니다.', '', 1);

                expend_list_set(result.list, result.info);

                $('.expend_ing').bPopup().close();

                $('#asst_gb, #amt, #content, #content_detail').val('');
                device(1);
            }
            else
            {
                swal('알림', '저장에 실패했습니다. 잠시 후 다시 시도해주세요.', '', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 비용/고정자산 데이터 삭제
 */
function expend_del(cd){
    $.ajax({
        url: '/acc/acc_mgt/expend_del',
        type: 'POST',
        data: {
            cd : cd
        },
        dataType: "JSON",
        success: function (result) {
            if (result.msg == 'success')
            {
                swal('알림', '삭제되었습니다.', '', 1);
                expend_list_set(result.list, result.info);
            }
            else
            {
                swal('알림', '저장 또는 수정에 실패했습니다. 잠시 후 다시 시도해주세요.', '', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        },
    });
}

/**
 * @description 비용/고정자산 리스트 셋팅
 */
function expend_list_set(data, info){
    var asst_list = '';

    $.each(data, function(index, item){
        asst_list += '<li data-cd="'+item.asst_cd+'">';
        asst_list += '<input type="checkbox" id="chkbox'+item.asst_cd+'" name="chkbox" value="'+item.asst_cd+'">';
        asst_list += '<label for="chkbox'+item.asst_cd+'">';
        asst_list += '<span>'+item.content+'</span>';
        asst_list += '<p>'+item.content_detail+'</p>';
        asst_list += '</label>';
        asst_list += '<div class="right_price">';
        asst_list += '<span class="date">'+item.asst_dt+'</span>';
        asst_list += '<p class="price">'+commas(parseInt(item.amt))+'원</p>';
        asst_list += '</div>';
        asst_list += '</li>'; 
    });

    $('#asst_list').html(asst_list);

    $('#asst_cnt').text(info['cnt']+'건');
    $('#asst_amt').text(commas(parseInt(info['asst_amt']))+'원');

    get_statistics($("input:radio[name=gubun]:checked").val());
}