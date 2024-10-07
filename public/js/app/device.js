/*function device(type){
    alert('start:'+type);
    var app = false;
    var agent = navigator.userAgent.toLowerCase(); // WEB API: 사용자 에이젠트 확인

    if(agent.indexOf("chrome") != -1 || agent.indexOf("edge") != -1){ // 크롬, 엣지 구분
        app = true;
    }

    if(!app){ // 웹 아닐 시(크롬, 엣지)
        alert('android:'+type);
        if( agent.indexOf("android") !== -1 ) { // agent: android
            window.androidFunction.exitFlag(type);
        } else if( agent.indexOf("iphone") !== -1 ) { // agent: iphone
            webkit.messageHandlers.exitFlag.postMessage(type);
        }
    }else{
        alert('web:'+type);
    }
}*/

/**
 * @description 안드로이드/ ios 휴대폰 이동 플래그. (0 = 종료, 1 = 정상, 2 = 뒤로 가기, 3 = 팝업창 닫기, 4 = 결제모듈 닫기)
 * @author 김원명, @version 1.0, @last date 2022/01/14
 */
function device(type){
    var os;
    var mobile = (/iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()));  
    // mobile check
    if (mobile) { 
        //alert('app:'+type);
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.search("android") > -1) { // agent: android
            window.androidFunction.exitFlag(type);
            window.androidFunction.onScreenShotState("Y");
        } else if ((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1) || (userAgent.search("ipad") > -1)) { // agent: iphone
            webkit.messageHandlers.exitFlag.postMessage(type);
        } else {
            //alert('web:'+type);
        }
    } else {
        //alert('pc:'+type);
    }
}
