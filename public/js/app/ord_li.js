/*================================================================================
 * @description 플랜오더APP 공장 주문관리JS
 * @author 김민주, @version 1.0, @last date 2022/04/08
 ================================================================================*/

let current_page = 0;   // current page
$(function() {
    // variable list - 공장 구분, 공장 코드, 상태값 선택, 현재 페이지
    $("#param").val(get_parameter("p"));
    $("#local_cd").val(get_parameter("f"));
    $("#finyn").val(get_parameter("s")).prop("selected", true);
    $("#page").val(current_page);

    if(localStorage.getItem("ord_li_content")) { // 검색어 유지
        $("#content").val(decodeURI(localStorage.getItem("ord_li_content")));
        localStorage.removeItem("ord_li_content");
    }
    get_ord_list($("#frm_search").serializeObject(), false);    // basic search

    // 상태값 변경 조회 이벤트
    $("#finyn").change(function(){
        $("#page").val(0); // page reset
        get_ord_list($("#frm_search").serializeObject(), false);
    });

    // 검색어 조회
    $("#content").off().keyup(function (e) {
        if(e.keyCode == 13){
            $("#page").val(0); // page reset
            get_ord_list($("#frm_search").serializeObject(), false);
        }
    });

    // 페이지 스크롤 이동 이벤트
    $(window).on("scroll", function() {
        let $window = $(this);
        let scroll_top = $window.scrollTop();       // 스크롤 top이 위치하고 있는 높이
        let window_height = $window.height();       // 화면의 높이
        let document_height = $(document).height(); // 문서 전체의 높이

        // 스크롤 위치가 바닥에 닿거나 혹은 닿기 직전으로 세팅. 그 조건을때 데이터 추가 함수 호출
        if( scroll_top + window_height +1 >= document_height ) {
            current_page++; $("#page").val(current_page);
            get_ord_list($("#frm_search").serializeObject(), true);
        }
    });

    // 저장된 페이지 정보 있을경우 로컬스토리지에 저장된 list로 reload
    if(localStorage.getItem("ord_li_page")) {
        $('#results').html(decodeURI(localStorage.getItem("ord_li_list")));
        current_page = localStorage.getItem("ord_li_page");
        localStorage.removeItem("ord_li_page");
    } 

});


/**
 * @description 플랜오더/외주공장 주문 리스트 - 무한스크롤(뒤로가기 스크롤유지)
 * @param form data, scroll 체크 플래그 
*/
function get_ord_list(obj, scroll) {

    $.ajax({

        url: '/fac/ord_li/list',
        type: 'POST',
        data: obj,
        dataType: 'json',
        async: false,
        success: function (data) {
            var str = "";
            var count = data.result.list.length;
            if(count > 0) {
                for(var i=0; i < data.result.list.length; i++) {
                    var list = data.result.list[i];
                    var spec = list.mas_spec != "" ? JSON.parse(list.mas_spec) : "N";
                    var amt  = 0; // 주문금액

                    var adjust_dis_amt = 0; // 할인 금액 및 퍼센트
                    var adjust_add_amt = 0; // 추가 금액
                    var cut_amt        = 0; // 절삭 할인 금액

                    
                    if(spec != 'N' && list.m_finyn == '008'){ // 해당 명세서가 발주 완료 처리 일 시
                        if(spec.adjust_dis_unit == '001'){ // 할인 금액이 퍼센트가 아닐 경우
                            adjust_dis_amt = Number(spec.adjust_dis_amt);
                        }else{ // 퍼센트
                            adjust_dis_amt = ( amt / 100 ) * Number(spec.adjust_dis_amt);
                        }

                        adjust_add_amt = Number(spec.adjust_add_amt); // 추가금액
                        cut_amt        = Number(spec.cut_amt);        // 절삭할인 금액

                        amt = Number(list.ord_amt) - adjust_dis_amt + adjust_add_amt - cut_amt; // 발주 완료 금액
                    }

                    str += "<li>";
                    str += "<p class='user_name'>"+ list.cust_nm+" 고객" ;
                    str += "<span>발주금액 : "+commas(amt)+"원</span>";
                    str += "</p>";
                    str += "<div class='li_left'>";
                    str += "<p class='num'>주문수량 <span>"+ list.ord_cnt + "</span>건</p>";
                    str += "<span class='detail_btn' onclick=next_page({'cust_cd':'"+ list.cust_cd +"'})>제품 상세</span>";
                    str += "</div>";
                    str += "<div class='li_right'>";
                    // 주문 접수
                    str += (is_empty(list.prod_dt) == "" && list.dlv_cnt == 0) ? "<div class='p_box active'>" : "<div class='p_box'>";
                    str += "<div class='circle'></div>";
                    str += "<p class='process'>주문 접수</p>";
                    str += "<span class='date'>"+ list.reg_dt + "</span>";
                    str += "</div>";
                    // 생산 완료
                    str += (is_empty(list.prod_dt) != "" && list.dlv_cnt == 0) ? "<div class='p_box active'>" : "<div class='p_box'>";
                    str += "<div class='circle'></div>";
                    str += "<p class='process'>생산 완료</p>";
                    str += "<span class='date'>"+ is_empty(list.prod_dt) + "</span>";
                    str += "</div>";
                    // 출고 완료
                    str += (list.dlv_cnt > 0) ? "<div class='p_box active'>" : "<div class='p_box'>";
                    str += "<div class='circle'></div>";
                    str += "<p class='process'>출고 완료</p>";
                    str += "<span class='date'>"+ is_empty(list.out_dt) + "</span>";
                    str += "</div>";
                    str += "</div>";
                    str += "</li>";
                } // end for

                if(scroll) { // scroll check flag
                    $("#results").append(str);
                } else {
                    $("#results").html(str);
                }

            } else if(count == 0 && scroll == false){ 
                $("#results").html("");
                current_page = 0; // page reset
            } // list length 0
        }
    });

}

/**
 * @description 고객 상세페이지로 이동시 현재까지 확인된 리스트, 현재페이지NO 로컬스토리지 저장
 * @param center_biz_list.cust_cd
*/
function next_page(obj) {
    var copy_list = $('#results').html();
    localStorage.setItem("ord_li_content", $("#content").val());
    localStorage.setItem("ord_li_page", current_page);
    localStorage.setItem("ord_li_list", copy_list);
    window.location.href='/client/client_info?cust_cd='+obj.cust_cd;
}