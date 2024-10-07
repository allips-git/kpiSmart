/*================================================================================
 * @name: 김원명 - 앱 캘린더 관리
 * @version: 1.0.0, @date: 2022/07/01
 ================================================================================*/
var p_date      = '';
var p_time      = ''; 
var hour        = '00';
var minu        = '00';
var p_ord_no    = '';
var p_con_per   = '';
var p_esti_per  = '';
var p_params    = '';
var p_gubun     = '';

$(function(){
    $(document).on('click', '#btn_cons, #btn_esti', function(){

        if ($(this).attr('id') == 'btn_cons')
        {
            p_gubun = 'C';
        }
        else
        {
            p_gubun = 'E';
        }

        var dp = new AirDatepicker('#p_cons_dt', {
            isMobile: true,
            autoClose: true,
            dateFormat: 'yyyy-MM-dd',
            onSelect : function(e){ /** 날짜 선택 시 */
                dp.hide();
                var dt       = new Date(e.formattedDate.substr(0,10));
                p_date       = e.formattedDate.substr(0,10);

                var time   = p_gubun == 'C' ? $('#t_cons_dt').text().substr(-6) : $('#t_esti_dt').text().substr(-6);
                var yoil   = week[dt.getDay()];
                var month  = dt.getMonth()+1;
                var day    = dt.getDate();

                month = String(month).length === 1 ? ('0'+month) : month;
                day   = String(day).length === 1 ? ('0'+day) : day;

                var date  = month+'월 '+day+'일'+'('+yoil+')'+time;
                p_time    = month+'월 '+day+'일'+'('+yoil+')';

                if(p_gubun == 'C')
                {
                    $('#t_cons_dt').text(date);
                }
                else
                {
                    $('#t_esti_dt').text(date);
                }

                get_time_pop();
            }
        });

        dp.show();
    });

    /**
     * @description 앱에 주소 위도, 경도 정보 전송
     */
    $(document).on('click', '#navi', function(){
        var address = $(this).text();
        var geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, function(result, status) {
            var x = result[0].road_address['x'].toString();
            var y = result[0].road_address['y'].toString();

            window.androidFunction.open_navi(y, x);
        });
    });

    /** 시간(시) 선택 시 */
    $('.time_li').off().click(function(){
        hour = $(this).attr('data-val');

        $('.time_li_pop').bPopup().close();

        get_minutes_pop();

        if(p_gubun == 'C')
        {
            $('#t_cons_dt').text(p_time+' '+hour+':00');
        }
        else
        {
            $('#t_esti_dt').text(p_time+' '+hour+':00');
        }

        p_date = p_date+' '+hour;
    });

    /** 시간(분) 선택 시 */
    $('.minutes_li').off().click(function(){
        minu = $(this).attr('data-val');

        $('.minutes_li_pop').bPopup().close();

        if(p_gubun == 'C')
        {
            $('#t_cons_dt').text(p_time+' '+hour+':'+minu);
        }
        else
        {
            $('#t_esti_dt').text(p_time+' '+hour+':'+minu);
        }

        p_date = p_date+':'+minu+':00';

        get_date_upt();
    });

    $('.btn_day').off().click(function(){
        get_calendar($(this).attr('data-type'), 1);
        $('.week_calendar').toggle();
    });

    /**
     * 주차에서 일자 클릭 시
     */
    $(document).on('click', '.week_calendar ul li', function(){
        $('.week_calendar ul li').removeClass('click');
        $(this).addClass('click');

        var day = $(this).attr('data-day');
        calendar.gotoDate(day);
        p_dt = day;

        var select_date = p_dt.replace(/-/gi, '.')+' '+week[new Date(p_dt).getDay()];

        $('.select_date').text(select_date);

        $('.fc-daygrid-body-natural, .fc-timegrid-divider').hide();
    });

    /**
     * 날짜 선택 시
     */
    $('.select_date').off().click(function(){
        var dp = new AirDatepicker('#select_date', {
            isMobile: true,
            autoClose: true,
            dateFormat: 'yyyy-MM-dd',
            onSelect : function(e){ /** 날짜 선택 시 */
                dp.hide();
                var dt  = e.formattedDate.substr(0,10);

                var sel = $('[data-day="'+dt+'"]');

                if(sel.length != 0)
                {
                    $('.week_calendar ul li').removeClass('click');
                    sel.addClass('click')
                }
                else
                {
                    get_day_list(dt);
                }

                calendar.gotoDate(dt);
                p_dt = dt;
            }
        });

        dp.show();
    });

    /**
     * 견적일, 시공일 수정 버튼 클릭 시
     */
    $(document).on('click', '#btn_person, #btn_esti_person', function(){
        $('#per_list').find('li').removeClass('active');

        if ($(this).attr('id') == 'btn_person')
        {
            $('#p_'+p_con_per+'').addClass('active');
            p_gubun = 'C';
        }
        else
        {
            $('#p_'+p_esti_per+'').addClass('active');
            p_gubun = 'E';
        }

        $('.member_pop').bPopup({
            modalClose: true
            , opacity: 0.2
            , position:[ ,0]
            , positionStyle: 'absolute' 
            , speed: 100
            , transition: 'slideUp'
            , transitionClose: 'fadeOut'
            , zIndex : 990,
            //, modalColor:'transparent' 
        });
    });

    $(document).on('click', '.select_pop ul li', function(){
        if ($(this).attr('id') != 'pop_close' && $(this).attr('class') != 'active')
        {
            get_stat_upt($(this));
        }
    });

    $(document).on('taphold', '.fc-timegrid-slot-lane', function(){
        var time = $(this)[0].dataset.time.substr(0,5);

        var con = custom_fire('등록', '해당 일정에 고객을 등록하시겠습니까?<br>'+p_dt+' ('+time+')', '취소', '이동');

        con.then((result) => {
            if (result.isConfirmed)
            {
                location_url('/client/client_ing?t=i&dt='+p_dt+'&time='+time+'');
            }
        });
    });
});
/**
 * @description 날짜 클릭 시 일정 가져오기
 */
function get_schedule(date)
{
    $.ajax({ 
        url: '/calendar/calendar/get_schedule',
        type: 'GET',
        data: {
            date : date
        },
        dataType: "json",
        success: function(result) {
            $('#title_date').text(date.substr(-2)+'일 '+week[new Date(date).getDay()]);
            var schedule = '';

            if (result.schedule.length == 0)
            {
                $('#schedule').html(schedule);
            }
            else
            {
                $.each(result.schedule, function(index, item){
                    var stat        = '';
                    var color       = '';

                    switch (item['stat'])
                    {
                        case 'N':
                            stat  = '견적취소';
                            color = 'red';
                        break;
                        case '002':
                            stat  = '견적대기';
                            color = 'blue_1';
                        break;
                        case '003':
                            stat  = '견적완료';
                            color = 'blue_2';
                        break;
                        case '008': case '005':
                            stat  = '시공대기';
                            color = 'pink_1';
                        break;
                        case '017':
                            stat  = '시공완료';
                            color = 'pink_2';
                        break;
                    }

                    schedule += '<li>';
                    schedule += '<div class="sched">';
                    schedule += '<span class="circle '+color+'"></span>';
                    schedule += '<p class="name">'+item['cust_nm']+'</p>';
                    schedule += '<p class="kind '+color+'">'+stat+'</p>';
                    schedule += '</div>';
                    schedule += '<div class="sub">';
                    schedule += '<p class="time">';
                    if (item['stat'] == '005' || item['stat'] == '008')
                    {
                        schedule += ''+item['st_dt']+' ~ '+item['en_dt']+'';
                    }
                    else
                    {
                        schedule += ''+item['st_dt']+'';
                    }
                    schedule += '</p>';
                    schedule += '<p class="addr Elli">'+item['address']+' '+item['addr_detail']+'</p>';
                    schedule += '</div>';
                    schedule += '</li>';
                });

                $('#schedule').html(schedule);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 월별 데이터 get
 */
function get_month_list(dt)
{
    var list;

    $.ajax({ 
        url: '/calendar/calendar/get_month_list',
        type: 'GET',
        async: false,
        data:{
            dt : dt
        },
        dataType: "json",
        success: function(result) {
            list = result.list;
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });

    return list;
}

/**
 * @description 일자별 데이터 get
 */
function get_day_list(dt)
{
    var list;

    $.ajax({ 
        url: '/calendar/calendar/get_day_list',
        type: 'GET',
        async: false,
        data:{
            dt : dt
        },
        dataType: "json",
        success: function(result) {
            var week = '';

            list = result.list;
            
            $.each(result.date, function(index, item){
                var gubun = '';
                var click = '';

                if (index == 0)
                {
                    gubun = 'sun';
                }

                if (item.today)
                {
                    if (gubun == 'sun')
                    {
                        gubun = 'sun today';
                    }
                    else
                    {
                        gubun = 'today';
                    }
                }

                if (item.day == dt)
                {
                    click = 'click';
                }

                var day = item.day.substr(-2);

                if(day.substr(0, 1) == '0')
                {
                    day = item.day.substr(-2).replace("0", "");
                }

                week += '<li class="'+gubun+' '+click+'" data-day="'+item.day+'">';
                week += '<p>'+item.yoil+'</p>';
                week += '<p class="da">'+day+'</p>';
                if (item.cnt != '0')
                {
                    week += '<span>'+item.cnt+'</span>';
                }
                week += '</li>';
            });

            $('#week_list').html(week);
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });

    return list;
}

/**
 * @description 일자별 데이터 get
 */
 function day_result(data){
    $.ajax({ 
        url: '/calendar/calendar/day_result',
        type: 'GET',
        data: data,
        dataType: "json",
        success: function(result) {
            if (result.msg == 'fail')
            {
                swal('알림', '일정변경에 실패하였습니다. 잠시 후 다시 시도해주세요.', '', 1);
            }
            else
            {
                get_calendar('D');
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 이벤트(일정) 상세 팝업 view
 */
function get_event_info(params){
    var data = JSON.parse(params);

    p_params = params;

    var stat = '';

    if (data.stat == '005' || data.stat == '008' || data.stat == '017')
    {
        stat = '시공';
    }
    else
    {
        stat = '견적';
    }

    var info = '';

    info += '<div class="top">';
    info += '<div class="icon">';
    info += '</div>';
    info += '<div class="name">';
    info += '<span>일정</span>';
    info += '<p onclick="location.href=\'/client/client_info?cust_cd='+data.cust_cd+'\'">'+data.cust_nm+'</p>';
    info += '</div>';
    info += '<div class="kind">'+stat+'</div>';
    info += '</div>';
    info += '<div class="bottom">';
    info += '<div class="wrap01">';
    switch (data.stat)
    {
        case 'N':
            info += '<div class="select select03">견적취소</div>';
        break;
        case '002': case '003': 
            info += '<div class="select select01">견적</div>';
        break;
        case '008': case '005':
            info += '<div class="select select01">시공</div>';
        break;
        case '017':
            info += '<div class="select select02">시공완료</div>';
        break;
    }
    info += '</div>';
    info += '<div class="wrap02">';
    info += '<p class="date">'+data.dt+'</p>';
    info += '<p class="phone"><a href="tel:'+data.tel+'">'+num_format(data.tel, 1)+'</a></p>';
    info += '<p class="add"><a id="navi">'+data.address+' '+data.addr_detail+'</a></p>';
    if (data.stat == '005' || data.stat == '008' || data.stat == '017')
    {
        if(data.time > 60)
        {
            info += '<p class="time">설치 예상시간 : '+parseInt(data.time / 60)+'시간 '+data.time % 60+'분</p>';
        }
        else
        {
            if(data.time == 60)
            {
                info += '<p class="time">설치 예상시간 : 1시간</p>';
            }
            else
            {
                info += '<p class="time">설치 예상시간 : '+data.time+'분</p>';
            }
        }
        info += '<p class="">설치 수량 : '+data.pd_info+'</p>';
    }
    info += '</div>';
    info += '</div>';
    info += '<div class="btn_wrap">';
    info += '<button class="yellow" onclick=\'get_user_info()\'>수정</button>';
    //info += '<button class="red">삭제</button>';
    info += '</div>';

    $('#event_info').html(info);

    var pop_list  = '';

    if (data.stat == 'N' || data.stat == '003' || data.stat == '002')
    {
        pop_list += '<ul>';
        if (data.stat == 'N')
        {
            pop_list += '<li data-gubun="Y">견적</li>';
            pop_list += '<li class="active" data-gubun="N">견적 취소</li>';
        }
        else
        {
            pop_list += '<li class="active" data-gubun="Y">견적</li>';
            pop_list += '<li data-gubun="N">견적 취소</li>';
        }
        pop_list += '<li id="pop_close" onclick="pop_close()">닫기</li>';
        pop_list += '</ul>';
    }
    else
    {
        pop_list += '<ul>';
        if (data.stat == '005' || data.stat == '008')
        {
            pop_list += '<li class="active" data-gubun="008">시공대기</li>';
            pop_list += '<li data-gubun="017">시공완료</li>';
        }
        else
        {
            pop_list += '<li data-gubun="008">시공대기</li>';
            pop_list += '<li class="active" data-gubun="017">시공완료</li>';
        }
        pop_list += '<li id="pop_close" onclick="pop_close(1)">닫기</li>';
        pop_list += '</ul>';
    }

    $('#event_sel_pop').html(pop_list);
    
    $('.detail_pop').bPopup({
        modalClose: true
      , opacity: 0.7
      , positionStyle: 'fixed' 
      , speed: 100
      , transition: 'fadeIn'
      , transitionClose: 'fadeOut'
      , zIndex : 888,
    });

    p_ord_no  = data.ord_no;
}

/**
 * @description 고객 정보 view 또는 수정
 */
function get_user_info()
{
    var params = JSON.parse(p_params);

    var info = '';
    var stat = '';

    if (params.stat == '005' || params.stat == '008' || params.stat == '017')
    {
        if(params.stat == '017')
        {
            stat = '시공완료';
        }
        else
        {
            stat = '시공';
        }
    }
    else
    {
        if(params.stat == 'N')
        {
            stat = '견적취소';
        }
        else
        {
            stat = '견적';
        }
    }

    info += '<div class="arrw" onclick="pop_close(2)">';
    info += '<img src="/public/img/arrow02.png" alt="">';
    info += '</div>';
    info += '<div class="user">';
    info += '<div class="icon"></div>';
    info += '<div class="name_wrap">';
    info += '<span>고객</span>';
    info += '<p>'+params.cust_nm+'</p>';
    info += '<img src="/public/img/app/arrow_right_g.png" alt="" id="arrw" onclick="location.href=\'/client/client_info?cust_cd='+params.cust_cd+'\'">';
    info += '</div>';
    info += '</div>';
    info += '<div class="info">';
    info += '<ul>';
    info += '<li>';
    info += '<span>견적 담당</span>';
    info += '<p id="p_esti_person">'+params.esti_person+'</p>';
    if (params.stat == 'N' || params.stat == '002' || params.stat == '003')
    {
        info += '<a class="mod_member" id="btn_esti_person">수정</a>';
    }
    info += '</li>';
    info += '<li class="bb">';
    info += '<span>견적일</span>';
    info += '<p id="t_esti_dt">'+params.esti_dt+'</p>';
    if (params.stat == 'N' || params.stat == '002' || params.stat == '003')
    {
        info += '<a class="mod_member" id="btn_esti">수정</a>';
    }
    info += '</li>';

    if(params.stat == '005' || params.stat == '008' || params.stat == '017')
    {
        info += '<li>';
        info += '<span>시공 담당</span>';
        info += '<p id="p_cons_person">'+params.cons_person+'</p>';
        info += '<a class="mod_member" id="btn_person">수정</a>';
        info += '</li>';
        info += '<li>';
        info += '<span>시공일</span>';
        info += '<p id="t_cons_dt">'+params.cons_dt+'</p>';
        info += '<a class="mod_member" id="btn_cons">수정</a>';
        info += '</li>';
    }
    info += '<input type="hidden" id="p_cons_dt">';

    info += '</ul>';
    info += '</div>';

    /** 명세표 히스토리 */
    info += '<div class="list">';
    info += '<div class="title">명세표 기록</div>';
    info += '<ul>';
    $.each(params.history, function(index, item){
        info += '<li>';
        info += '<div class="icon_small"></div>';
        info += '<div class="text_wrap">';
        switch (item.finyn)
        {
            case 'N':
                info += '<p>'+item.name+' 맴버가 견적을 취소하였습니다.</p>';
            break;
            case 'Y':
                info += '<p>'+item.name+' 맴버가 견적을 복원하였습니다.</p>';
            break;
            case '002':
                info += '<p>'+item.name+' 맴버가 새로운 견적을 만들었습니다</p>';
            break;
            case '003':
                info += '<p>'+item.name+' 맴버가 견적을 완료하였습니다.</p>';
            break;
            case '005':
                info += '<p>'+item.name+' 맴버가 계약을 완료하였습니다.</p>';
            break;
            case '008':
                info += '<p>'+item.name+' 맴버가 시공대기 처리하였습니다.</p>';
            break;
            case '017':
                info += '<p>'+item.name+' 맴버가 시공완료 처리하였습니다.</p>';
            break;
            case '031':
                info += '<p>'+item.name+' 맴버가 결제완료 처리하였습니다.</p>';
            break;
        }
        info += '<span>'+item.date+'</span>';
        info += '</div>';
        info += '</li>';
    });
    info += '</ul>';
    info += '</div>';

    $('#mod_info').html(info);

    $('.mod_pop').bPopup({
        modalClose: true
        , opacity: 0.7
        , position:[ ,0]
        , positionStyle: 'absolute' 
        , speed: 100
        , transition: 'slideUp'
        , transitionClose: 'fadeOut'
        , zIndex : 900,
        //, modalColor:'transparent' 
    });

    p_con_per  = params.cons_ul_uc;
    p_esti_per = params.esti_ul_uc;
}

/**
 * @description 상태 수정
 */
function get_stat_upt(data)
{
    $.ajax({ 
        url: '/calendar/calendar/get_stat_upt',
        type: 'GET',
        data: {
            ord_no : p_ord_no,
            finyn  : data.attr('data-gubun')
        },
        dataType: "json",
        success: function(result) {
            if (result.msg == 'success')
            {
                var stat_html_1 = '';

                swal('알림', '일정 상태가 변경되었습니다.', '', 1);

                $('.select_pop ul li').removeClass('active');
                data.addClass('active');

                var params = JSON.parse(p_params);
                
                switch(data.attr('data-gubun'))
                {
                    case 'N':
                        stat_html_1   = '<div class="select select03">견적취소</div>';
                        params.stat   = 'N';
                    break;
                    case 'Y':
                        stat_html_1   = '<div class="select select01">견적</div>';
                        params.stat   = '003';
                    break;
                    case '008':
                        stat_html_1   = '<div class="select select01">시공</div>';
                        params.stat   = '008';
                    break;
                    case '017':
                        stat_html_1   = '<div class="select select02">시공완료</div>';
                        params.stat   = '017';
                    break;
                }

                p_params = JSON.stringify(params);

                get_history();

                $('.wrap01').html(stat_html_1);
                get_calendar('D');
            }
            else
            {
                switch(result.msg)
                {
                    case 'fail':
                        swal('알림', '일정 상태 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.', '', 1);
                    break;
                    case 'cancle_err':
                        swal('알림', '해당 일정은 견적취소가 불가능합니다. 명세서를 확인하세요.', '', 1);
                    break;
                    case 'cons_wait_err':
                        swal('알림', '해당 일정은 시공대기 상태가 불가능합니다. 명세서를 확인하세요.', '', 1);
                    break;
                    case 'cons_comp_err':
                        swal('알림', '해당 일정은 시공완료가 불가능합니다. 명세서를 확인하세요.', '', 1);
                    break;
                }
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 견적일, 시공일 수정
 */
function get_date_upt()
{
    $.ajax({ 
        url: '/calendar/calendar/get_date_upt',
        type: 'GET',
        data: {
            ord_no : p_ord_no,
            dt     : p_date,
            gubun  : p_gubun
        },
        dataType: "json",
        success: function(result) {
            if (result.msg == 'success')
            {
                var params = JSON.parse(p_params);

                if (p_gubun == 'C')
                {
                    params.cons_dt = $('#t_cons_dt').text();
                }
                else
                {
                    params.esti_dt = $('#t_esti_dt').text();
                }

                swal('알림', '일정이 변경되었습니다.', '', 1);
                get_calendar('D');

                p_params = JSON.stringify(params);
            }
            else
            {
                swal('알림', '일정 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.', '', 1);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 시공 담당자 수정
 */
function get_person_upt(ul_uc, ul_nm)
{
    $.ajax({ 
        url: '/calendar/calendar/get_person_upt',
        type: 'GET',
        data: {
            ord_no : p_ord_no,
            ul_uc  : ul_uc,
            gubun  : p_gubun
        },
        dataType: "json",
        success: function(result) {
            if (result.msg == 'success')
            {
                var params = JSON.parse(p_params);

                if (p_gubun == 'C')
                {
                    params.cons_person = ul_nm;
                    params.cons_ul_uc  = ul_uc;
                    $('#p_cons_person').text(ul_nm);
                    p_con_per  = params.cons_ul_uc;
                }
                else
                {
                    params.esti_person = ul_nm;
                    params.esti_ul_uc  = ul_uc;
                    $('#p_esti_person').text(ul_nm);
                    p_esti_per = params.esti_ul_uc;
                }

                p_params = JSON.stringify(params);
                swal('알림', '담당자가 변경되었습니다.', '', 1);
                get_calendar('D');
            }
            else
            {
                swal('알림', '담당자 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.', '', 1);
            }

            $('.member_pop').bPopup().close();
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 명세서 히스토리 업데이트
 */
function get_history()
{
    $.ajax({ 
        url: '/calendar/calendar/get_history',
        type: 'GET',
        data: {
            ord_no : p_ord_no
        },
        dataType: "json",
        success: function(result) {
            var params = JSON.parse(p_params);

            params.history = result.history;

            p_params = JSON.stringify(params);
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 팝업닫기
 */
function pop_close(num)
{
    switch (num)
    {
        case 1:
            $('.select_pop').bPopup().close();
        break;
        case 2:
            $('.mod_pop').bPopup().close();
        break;
        case 3:
            $('.member_pop').bPopup().close();
        break;
    }
}