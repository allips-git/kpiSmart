/*================================================================================
 * @description 플랜오더APP 공장 관리JS
 * @author 김민주, @version 1.0, @last date 2022/04/08
 ================================================================================*/

 $(function () {

    // 로딩바 보류로 주석(사장님 요청건). 2022/03/03
    /*var loading = '<div id="loading"><img id="loading-image" src="/public/img/app/app_loading2.gif"/></div>';
    $("#reg-container").append(loading);
    $("#out-container").append(loading);*/

    // 외주공장 추가 클릭 이벤트
    $(".add_btn").on().click(function () { 
        window.location.href='/fac/factory_in'; 
    });
    
});

/**
 * @description 플랜오더 공장 거래요청 이벤트
*/
function biz_register(obj) {
    
    var con = confirm('#0054FF/공장등록/거래요청을 하시겠습니까?');
    if(con) {
        $.ajax({
            url: '/fac/factory_li/i',
            type: 'POST',
            data: obj,
            dataType: "json",
            success: function (data) { 

                var str = "";
                // in, fail
                if(data.code == '100') {

                    alert('#0054FF/접수완료/공장 승인 후 거래 가능하니 참고 바랍니다.');
                    var unreg_count = data.result.unreg_count;
                    if(unreg_count > 0) {
                        $(".factory_before").css("display", "block");
                        $.each(data.result.unreg_list, function (i, list) {
                            str += "<li>";
                            str += "<div class='logo'>";
                            if(!nan_chk(list.img_logo)) {
                                str += "<img src='"+list.img_logo+"' alt=''>";
                            } 
                            str += "로고";
                            str += "</div>";
                            str += "<div class='middle'>";
                            str += "<p class='name'>"+ list.biz_nm +"</p>";
                            if(!nan_chk(list.homepage)) {
                                str += "<a onclick=location.href='"+list.homepage+"'>공장정보 홈페이지 이동</a>";
                            } 
                            str += "</div>";
                            str += "<button type='button' class='gurae' onclick=biz_register({'local_cd':'"+list.local_cd+"'})>거래요청</button>";
                            str += "</li>";
                        });
                    } else {
                        $(".factory_before").css("display", "none");
                    }     
                    $("#unreg-container").html(str); // ajax data output

                } else if(data.code == '999') {
                    alert('#FF0000/접수실패/지속될 경우 관리자에게 문의 바랍니다.');
                }
            }

        });
    }
}


/**
 * @description 플랜오더 공장 하단 팝업 호출
*/
function plan_pop(key, url) {

    // plan pop display
    var str = "";
    str +="<div class='inner'>";
    str +="<h5>더 많은 기능</h5>";
    str +="<ul>";
    str +="<li onclick=open_alert();>거래원장 보기</li>";
    str +="<li onclick=window.location.href='/fac/factory_li/v?f="+key+"'>공장 상세정보</li>";
    str +="<li onclick=window.location.href='/fac/factory_item_li?f="+key+"'>제품 설정</li>";
    if(!nan_chk(url)) {
        str +="<li class='homepage' onclick=window.location.href='"+url+"'>기업 홈페이지 이동</li>";
    }
    str +="<li onclick=open_alert();>거래 중지하기</li>";
    str +="</ul>";
    str +="</div>";
    $(".fac_li_pop").html(str);

    $('.fac_li_pop').bPopup({ // call plan pop
        modalClose: true
        , opacity: 0.7
        , position:[ ,0]
        , speed: 300
        , transition: 'fadeIn'
        , transitionClose: 'fadeOut'
        , zIndex : 99997
        , positionStyle :'absolute'
        //, modalColor:'transparent' 
    });
    $('.homepage').parent('ul').parent().addClass('p05');
}

/**
 * @description 외주 공장 하단 팝업 호출
*/
function out_pop(key) {

    // out pop display
    var str = "";
    str +="<div class='inner'>";
    str +="<h5>더 많은 기능</h5>";
    str +="<ul>";
    str +="<li onclick=open_alert();>거래원장 보기</li>";
    str +="<li onclick=window.location.href='/fac/factory_in?p=v&f="+key+"'>외주공장 상세정보</li>";
    str +="<li onclick=window.location.href='/fac/out_item_li?f="+key+"'>외주제품 설정</li>";
    str +="<li onclick=open_alert();>거래 중지하기</li>";
    str +="</ul>";
    str +="</div>";
    $(".out_fac_pop").html(str);

    $('.out_fac_pop').bPopup({ // call out pop
        modalClose: true
        , opacity: 0.7
        , position:[ ,0]
        , speed: 300
        , transition: 'slideUp'
        , transitionClose: 'slideUp'
        , zIndex : 99997
        , positionStyle :'absolute'
        //, modalColor:'transparent' 
    }); 

}

/**
 * @description 공장 주문상태 상세페이지 이동 이벤트
*/
function ord_li(obj) {

    //open_alert();

    window.location.href='/fac/ord_li?p='+obj.p+'&f='+obj.f+'&s='+obj.s;
    //window.location.href='/fac/ord_li';

    /*$.ajax({
        url: '/fac/factory_li/',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) { 
            //window.location.href='/fac/ord_li';
        }

    });*/
}
