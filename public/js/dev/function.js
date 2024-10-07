/*================================================================================
 * @description: 개발팀 공통JS - base function package
 * @author 개발팀, @version 1.0, @last date
 ================================================================================*/
 
 /**
  * @description jqGrid * desc : form의 데이터를 json 형태로 변환해 준다. 
  * @return : 성공시에는 객체((JSON)을 리턴한다. 실패시에는 null을 리턴한다. 
  * @사용방법
  * - 적용: $("form").serializeObject();
  * - 출력: console.log('출력 테스트:' + JSON.stringify(obj));
  */
var ajaxRequest; 
(function( $, window ){ 
    $.fn.serializeObject = function() { 
        var obj = null; 

        try { 
            // this[0].tagName이 form tag일 경우 
            if(this[0].tagName && this[0].tagName.toUpperCase() == "FORM" ) { 
                var arr = this.serializeArray(); 
                if(arr){ 
                    obj = {}; 
                    jQuery.each(arr, function() { 
                        // obj의 key값은 arr의 name, obj의 value는 value값 
                        obj[this.name] = this.value; 
                    }); 
                }
            } 
        } catch(e) { 
            console.log(e.message); 
        } finally {} 

        return obj; 
    }; 
})( jQuery, window );

jQuery.fn.serializeObject = function() { 
    var obj = null; 
    try { 
        if ( this[0].tagName && this[0].tagName.toUpperCase() == "FORM" ) { 
            var arr = this.serializeArray(); 
            if ( arr ) { 
                obj = {};
                jQuery.each(arr, function() { 
                    obj[this.name] = this.value; 
                }); 
            }//if ( arr ) { 
        } 
    } 
    catch(e) {
        console.log(e.message);} 
    finally {} 

    return obj; 
};



 /**
 * @description frm 전체 값 리셋(input, select, radio)
 */
function frm_all_reset() {
    $("input").val("");
    $('select').prop('selectedIndex', 0);
    if($('input[type="radio"').length) { // 요소 확인
        $('input[type="radio"]')[0].checked = true;
    }
}
 
/**
 * @description url query string 가져오는 함수
 * @return key에 해당하는 value
 */
function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

/**
 * @description url query string 가져오는 함수
 * @author 김민주, @version 1.0, @last date 2021/11/18
 * @return key에 해당하는 value
 */
function get_parameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// datepicker 입력창 클릭시 날짜 선택창 호출
function call_date(obj)
{
    $(obj).datepicker().datepicker("show");
}

/**
 * @description 등록,수정
 */
function send(frm, p, gubun) {

    var msg ='';
    var p = p;
    var frm = frm;
    switch (gubun) {
        case 'in':
            msg = '등록하시겠습니까?';
            break;
        case 'up':
            msg = '수정하시겠습니까?';
            break;
        case 'pin':
            msg = '등록하시겠습니까?';
            break;        
        case 'pup':
            msg = '수정하시겠습니까?';
            break;
        default:
            // statements_def
            break;
    }
    var result = confirm(msg); 
    if(result) { 
        $("#"+p).val(gubun);
        $("#"+frm).submit();

    } else {
                    
    }  

}

/**
 * @description 등록,수정
 */
 function a_send(frm, type) {

    var msg ='';
    var type = type;
    var frm = frm;
    switch (type) {
        case 'in':
        msg = '등록하시겠습니까?';
        break;
        case 'up':
        msg = '수정하시겠습니까?';
        break;
        case 'pin':
        msg = '등록하시겠습니까?';
        break;        
        case 'pup':
        msg = '수정하시겠습니까?';
        break;
        default:
            // statements_def
            break;
        }
        var result = confirm(msg); 
        if(result) { 
            $("#"+frm).submit();
        } else {

        }  

    }

/**
 * @description 승인
 */
function permission(page) {
    var page = page;
    var result = confirm('관리자 승인을 하시겠습니까?'); 
    if(result) { 
        
        location.href=page;

    } else { 
      
    }
}

/**
 * @description 변경
 */
function state(text, page) {
    var page = page;
    var result = confirm(text); 
    if(result) { 
        
        location.href=page;

    } else { 
      
    }
}

/**
 * @description 등록
 */
function insert() {
    var result = confirm('등록 하시겠습니까?'); 
    if(result) { 

        $('#param').val('insert');
        $('#frm').submit(); 

    } else {
                    
    }
}

/**
 * @description 수정
 */
function update() {
    var result = confirm('수정하시겠습니까?'); 
    if(result) { 

        $('#param').val('update');
        $('#frm').submit(); 

    } else {
                    
    }   
}

/**
 * @description 삭제
 */
function del(page) {
    var page = page;
    var result = confirm('삭제하시겠습니까?'); 
    if(result) { 
        
        location.href=page;

    } else { 
      
    }
}

/**
 * @description 삭제
 */
function del2(page) {
    var page = page;
    var result = confirm('삭제하시겠습니까?'); 
    if(result) { 
        
        $('#frm')[0].reset();
        location.href=page;

    } else { 
      
    }
}

/**
 * @description 입력값 초기화
 */
function input_reset(page) {
    var page = page;
    var url = location.pathname;
    var result = confirm('입력을 초기화 하시겠습니까?'); 
    if(result) { 

        $("#id").attr("readonly",false);

        if(url == page) {
            $('#frm')[0].reset();
        } else {
            location.href=page;
        }

    } else {  
                
    }
}

/**
 * @description 페이지 새로고침
 */
function page(page) {

    //var url = location.pathname;
    var result = confirm('입력을 초기화 하시겠습니까?'); 
    if(result) { 

        location.href=page;

    } else {  
                
    }

}

/**
 * @description 팝업창 새로고침
 */
function re_popup(name) {
    var result = confirm('입력을 초기화 하시겠습니까?'); 
    if(result) { 

        $('.'+name).trigger("click");

    } else {  
                
    }
}

/**
 * @description 팝업창 취소버튼 
 */
function confim() {

    var result = confirm('취소하시겠습니까?'); 
    if(result) { 
        
        $('.btn_re').addClass("b-close");

    } else { 
      
        $('.btn_re').removeClass("b-close");

    }

}

/**
 * @description submit confim message
 */
function frm_chk() { // id type

    var txt = send_gb($('#p').val()); // type : in, up. del
    if(!confirm(txt+' 하시겠습니까?')) {
        return false;
    }else{
        return true;
    }

}
function frm_chk2() { // name type
    var txt = send_gb($('.p').val()); // type : in, up. del
    if(!confirm(txt+' 하시겠습니까?')) {
        return false;
    }
}

/**
 * @description 센티미터를 미터로 변환
 */
function centi_to_meter($centimeter) {

    return $centimeter * 0.01;
}
    
    
/**
 * @description 미터를 센티미터로 변환
 */
function meter_to_centi($meter) {

    return $meter * 100;
}


/**
 *  @description readonly 필수입력 체크
 */
$(function() {
    $(".readonly").keydown(function(e){
        e.preventDefault();
        $(".readonly").attr('readonly', true);
    });
});

/**
 * @description 소수점 올림
 */
function roundup(num, gubun) {
    var round = num;
    round = num * Number(gubun);
    round = Math.ceil(round);
    round = round / Number(gubun);
    return round;
}

/**
 * @description 전화번호, 생년월일, 사업자번호 하이픈(-) 정규식
 */
function num_format(number, type) {

    try{
        if(!nan_chk(number)) {
            var len = 0;
            len = number.length;
            
            switch(type) {
                case 1: // 일반 전화번호 또는 휴대폰번호
                    //return number.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
                    /** 전화번호 정규식 수정 2021/05/24 김원명 */
                    return number.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-");
                    break;
                case 2: // 생년월일
                    return number.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                    break;
                case 3: // 사업자 번호
                    if(len == 10) {
                        return number.replace(/(\d{3})(\d{2})(\d{4})(\d{1})/, '$1-$2-$3-$4');
                        break;
                    } else if(len == 13) {
                        return number.replace(/(\d{4})(\d{2})(\d{6})(\d{1})/, '$1-$2-$3-$4');
                        break;
                    }
                default :
                  return number;
                  break;
            }            
        } else {
            return '';
        }

    } catch(e) {
        console.log(e);
    }
    
}

/**
 *  @description yyyy-MM-dd 숫자 -> 날짜포맷으로 반환
 */
function date_format(num, type){

     if(!num) return "";
     var formatNum = '';

     // 공백제거
     num=num.replace(/\s/gi, "");

     try{
        if(num.length == 8 && type == "-") {
            formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        } else if(num.length == 8 && type == "text"){
            formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, '$1년 $2월 $3일');
        }
     } catch(e) {
          formatNum = num;
          console.log(e);
     }
     return formatNum;
}
 
/**
 * @description null 체크 함수
 */
function nan_chk(value){
 
    if (value === null) return true; 
    if (value === 'null') return true; 
    if (typeof value === 'string' && value === '') return true;
    if (typeof value === 'undefined') return true;
                
    return false;
 
}

/**
 * @description null 체크 후 빈값으로 치환해서 리턴
 */
function is_empty(value){

    if(value == null || value.length === 0) {
        return "";
     } else {
        return value;
     }

}

/**
 * @description 3자리 숫자 콤마 처리
 */
function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * @description 숫자 정수 체크
 */
function integer_check(obj){
    var num_check=/^[0-9]*$/;
        if(!num_check.test(obj)){
        return true;
    }
    return false;
}

/**
 * @description 숫자 소수점 체크
 */
function float_check(obj){
    var num_check=/^([0-9]*)[\.]?([0-9])?$/;
        if(!num_check.test(obj)){
        return true;
    }
    return false;
}

/**
 * @description 파라미터명으로 get 파라미터값 추출
 */
function paramsFunc(paramsNm) {

    var nullChk = "";
    var paramsList = location.search.substring(1).split("&"); //파라미터가 담긴 배열

    for(var i=0; i<paramsList.length; i++) {

        if(paramsNm == paramsList[i].split("=")[0]) {

            return paramsList[i].split("=")[1]; 

        } else {

        if(i == paramsList.length-1) nullChk = true;

        }     

    }

}

/**
 * @description 날짜 변환 함수
 */
function get_date(type, str='', param='')
{   
    var year = '';
    var month = '';
    var date = '';
    var last = '';
    var lastD = '';
    switch (type) {
        case 'today': // 오늘 날짜
            date = new Date();
            break;
        case '+n': // 날짜 더하기(str=0은 today)
            date = new Date(new Date().setDate(new Date().getDate()+str)); 
            break;
        case '-30': // 한달전 날짜
            date = new Date(new Date().setMonth(new Date().getMonth()-1)); 
            break;
        case '+30': // 한달후 날짜
            date = new Date(new Date().setMonth(new Date().getMonth()+1)); 
            break;
        case '-3m': // 3개월 전 시작일(1일)
            date = new Date(new Date().setMonth(new Date().getMonth()-2));
            date.setDate(new Date(1).getDate());
            break;
        case 'base_mth': // 지정개월 전 시작일(1일)
            date = new Date(new Date().setMonth(new Date().getMonth()-param));
            date.setDate(new Date(1).getDate());
            break;
        case '시작일': // 매달 시작일
            date = new Date(new Date().setDate(new Date(1).getDate())); 
            break;
        case '말일': // 매달 말일
            date  = new Date();
            year  = date.getFullYear();
            month = date.getMonth() + 1;
            last  = new Date( year, month ); 
            last  = new Date( last - 1 ).getDate();  
            break;
        case 'l_e_mth': // 지난달 말일
            date  = new Date();
            year  = date.getFullYear();
            month = date.getMonth();
            last  = new Date( year, month ); 
            last  = new Date( last - 1 ).getDate();  
            break;
    }

    function num_format(num) {
        num = num + '';
        return num.length < 2 ? '0' + num : num;
    }
    if(!nan_chk(month)) {
        return year +'-'+ num_format(month) +'-'+ num_format(last);
    } else {
        return date.getFullYear() +'-'+ num_format(date.getMonth()+1) +'-'+ num_format(date.getDate());
    }
    
}

/**
 * @description 현재 (년도, 월) 구하기
 */
function get_today(type) {

    var today = '';
    var date  = new Date();

    switch (type) {

        case 'year': // 올해 구하기
            today = date.getFullYear(); 
            break;

        case 'month': // 이번달 구하기
            today = date.getMonth() + 1
            break;
    }
    
    return today;

}


/**
 * @description 특정일 요일 구하기
 */
function get_week(date) {

    // date format - 2021-02-02
    var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
    
    var today = new Date(date).getDay();
    var todayLabel = week[today];
    
    return todayLabel;

}

/**
 * @description 현재시간 구하기
 */
function get_time(base) {
    var now = new Date();
    switch (base) {
        case 'hour': // 시간
            return now.getHours();
            break;
        case 'min': // 분
            return now.getMinutes();
            break;
        case 'secon': // 초
            return now.getSeconds();
            break;
    }
}

/**
 * @description 숫자앞에 0붙이는 포맷 처리
 */
function zero_format(num) {
    num = num + '';
    return num.length < 2 ? '0' + num : num;
}

/**
 * @description 팝업창 호출
 */
function open_popup(url, title, width, height){
    var pop_width = width;
    var pop_height = height;

    var popup_x = (window.screen.width / 2) - (pop_width / 2);
    var popup_y = (window.screen.height / 2) - (pop_height / 2) - 50;

    var windowObj = window.open(url, title, 'status=no, resizable=0, height=' + pop_height  + ', width=' + pop_width  + ', left='+ popup_x + ', top='+ popup_y);
    windowObj.focus(); // ie에서 이미 열린창 포커스
}

/**
 * @description 팝업창 호출-snb active 처리 by minhyuk
 */
$(document).on('click', '.popup_link', function(e) {
    e.preventDefault();
    // 이전 active 클래스 찾기.
    var prevAnchor = $(this);
    $(this).parent().siblings().each(function() {
        if( $(this).find('a').hasClass('active') ) {
            prevAnchor = $(this).find('a');
        }
    });

    var thisAnchor = $(this);
    thisAnchor.parent().siblings().each(function(i) {
        $(this).find('a').removeClass('active');
    });
    thisAnchor.addClass('active');

    var width = 1020;
    var height = 945;
    var url = thisAnchor.data("href");

    var pop_width = width;
    var pop_height = height;

    var popup_x = (window.screen.width / 2) - (pop_width / 2);
    var popup_y = (window.screen.height / 2) - (pop_height / 2);

    var windowObj = window.open(url, '신규등록', 'status=no, resizable=0, height=' + pop_height  + ', width=' + pop_width  + ', left='+ popup_x + ', top='+ popup_y);
    var interval = window.setInterval(function() {
        try {
            if( windowObj == null || windowObj.closed) {
                window.clearInterval(interval);
                //closeCallback(windowObj);
                thisAnchor.removeClass('active');
                prevAnchor.addClass('active');
            }
        } catch (e) {

        }
        //return windowObj;
    })

    return false;
});


/**
 * @description 두 날짜 사이의 날짜 구하기
 */
function getDateRangeData(param1, param2){  //param1은 시작일, param2는 종료일이다.
    var res_day = [];
    var ss_day = new Date(param1);
    var ee_day = new Date(param2);      
        while(ss_day.getTime() <= ee_day.getTime()){
            var _mon_ = (ss_day.getMonth()+1);
            _mon_ = _mon_ < 10 ? '0'+_mon_ : _mon_;
            var _day_ = ss_day.getDate();
            _day_ = _day_ < 10 ? '0'+_day_ : _day_;
            res_day.push(ss_day.getFullYear() + '-' + _mon_ + '-' +  _day_);
            ss_day.setDate(ss_day.getDate() + 1);
    }
    return res_day;
}

function toast(msg, sticky, type) {
    $.toast.config.align = 'right';
    $.toast.config.width = 400;
    $.toast(msg, {sticky: Boolean(sticky), type: type});
}

/**
 * @description sweetalert 라이브러리 
 * @title => 제목
 * @msg   => 메세지
 * @id    => 확인 후 포커싱 id 명
 */
function swal(title, msg, id='', type){
    switch(type){
        case 1:
            Swal.fire({
                title: title,
                html: '<br>'+msg+'<br><br>',
                showCancelButton: false,
                confirmButtonColor: '#0176F9',
                confirmButtonText: '확인',
                didClose : () => {
                    $('#'+id+'').focus();
                }
            });
        break;
        case 2:
            Swal.fire({
                title: title,
                html: '<br>'+msg+'<br><br>',
                showCancelButton: false,
                confirmButtonColor: '#0176F9',
                confirmButtonText: '확인'
            }).then((result) => {
                history.back();
            });
        break;
        case 3:
            return Swal.fire({
                title: title,
                html: '<br>'+msg+'<br><br>',
                showCancelButton: false,
                confirmButtonColor: '#0176F9',
                confirmButtonText: '확인'
            });
        break;
    }
}

// back button click event
function back() {
    var url = window.location.pathname;

    switch(url){
        case '/join/sign': case '/client/client_ing': case '/ord/esti_ing':
            Swal.fire({
                title: '알림',
                html: '<span>입력이 초기화됩니다.</span><br>다음에 다시 등록하시겠습니까?<br><br>',
                showCancelButton: true,
                confirmButtonColor: '#0176f9',
                cancelButtonColor: '#f1f1f5',
                cancelButtonText: '취소',
                confirmButtonText: '확인'
            }).then((result) => {
                if (result.isConfirmed) {
                    if(get_parameter('type') == 'C'){
                        location_url('/client/client_info?cust_cd='+get_parameter('cust_cd')+'');
                    }else{
                        history.back();
                    }
                } 
            });
        break;
        case '/join/payment':
            Swal.fire({
                title: '알림',
                html: '<span>결제를 취소하시겠습니까?</span><br>취소 시 메인 페이지로 이동합니다.<br><br>',
                showCancelButton: true,
                confirmButtonColor: '#0176f9',
                cancelButtonColor: '#f1f1f5',
                cancelButtonText: '취소',
                confirmButtonText: '확인'
            }).then((result) => {
                if (result.isConfirmed) {
                    location_url('/main');
                } 
            });
        break;
        case '/join/terms': case '/help/kind':
            locationReplace('/login');
        break;
        case '/api/toss/get_request': case '/client/client_list':
            location_url('/main');
        break;
        case '/client/client_info':
            location_url('/client/client_list');
        break;
        case '/ord/esti_info':
            location_url('/client/client_info?cust_cd='+get_parameter('cust_cd')+'');
        break;
        case '/api/toss/success': case '/api/toss/fail':
            locationReplace('/join/payment');
        break;
        case '/help/id_find': case '/help/pwd_find':
            locationReplace('/help/kind');
        break;
        default:
            history.back();
    }
}

/**
 * @description APP에서 화면 이동 시
 */
function location_url(url){
    window.location.href=url;
}
/**
 * @description APP에서 다음페이지 이동 시 history 안남도록 이동
 */
function locationReplace(url) {
    if (history.replaceState) {
        history.replaceState(null, document.title, url);
        history.go(0);
    } else {
        location.replace(url);
    }
}

/**
 * @description sessionstorage 모듈화
 */
function get_s_str(type, name, val=''){
    switch(type){
        case 's': // 저장
            sessionStorage.setItem(name, val);
        break;
        case 'g': // 가져오기
            return sessionStorage.getItem(name);
        break;
        case 'r': // 삭제
            sessionStorage.removeItem(name);
        break;
    }
}

/**
 * @description custom confirm
 * @author 황호진  @version 1.0, @last update 2022/03/31
 * 사용법 - var con = custom_fire(타이틀 , 메시지 , 취소버튼명 , 확인버튼명);
 * 			con.then((result) => {
 *				if(result.isConfirmed){
 *					내용
 *				}
 *			});
 */
function custom_fire(title , msg , cancel_text , confirm_text) {
	return Swal.fire({
		title: title,
		html: '<br>'+ msg +'<br><br>',
		showCancelButton: true,
		confirmButtonColor: '#0176f9',
		cancelButtonColor: '#f1f1f5',
		cancelButtonText: cancel_text,
		confirmButtonText: confirm_text
	});
}

/**
 * @description 팝업 호출
 */
function get_bpopup(name, pop_name, z_index)
{
    $('.'+name+'').bPopup({
        modalClose: true
        , opacity: 0.7
        , positionStyle: 'absolute' 
        , speed: 100
        , transition: 'fadeIn'
        , transitionClose: 'fadeOut'
        , zIndex : z_index
        , onOpen : function(){
            console.log('open');
        }
        , onClose : function(){
            console.log('close');
        }
    });
}
