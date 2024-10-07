/*================================================================================
 * @description 플랜오더APP 외주 공장 제품 관리JS
 * @author 김민주, @version 1.0, @last date 2022/04/08
 ================================================================================*/

let current_page = 0;   // current page
 $(function () {

    // variable list - 외주공장 코드, 현재 페이지
    var cust_cd = get_parameter("f");
    $("#cust_cd").val(cust_cd);
    $("#page").val(current_page);

    if(localStorage.getItem("out_item_content")) { // 검색어 유지
        $("#content").val(decodeURI(localStorage.getItem("out_item_content")));
        localStorage.removeItem("out_item_content");
    }
    get_item_list($("#frm_search").serializeObject(), false);    // basic search

    // 검색어 조회
    $("#content").off().keyup(function (e) {
        if(e.keyCode == 13){
            $("#page").val(0); // page reset
            current_page = 0;
            get_item_list($("#frm_search").serializeObject(), false);
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
            get_item_list($("#frm_search").serializeObject(), true);
        }
    });

    // 저장된 페이지 정보 있을경우 로컬스토리지에 저장된 list로 reload
    if(localStorage.getItem("out_item_page")) {
        $('#data-container').html(decodeURI(localStorage.getItem("out_item_list")));
        current_page = localStorage.getItem("out_item_page");
        localStorage.removeItem("out_item_page");
    } 

    // 업종 추가 이벤트
    $(".txt_gb").off().click(function () { 
        window.location.href="/fac/out_item_st?f="+cust_cd;
    });

});

/**
 * @description 외주공장 제품 리스트 - 무한스크롤(뒤로가기 스크롤유지)
 * @param form data, scroll 체크 플래그 
*/
function get_item_list(obj, scroll) {

    $.ajax({
        url: '/fac/out_item_li/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            var str = "";
            var str2 = "";
            var cust_cd = data.result.var.cust_cd; // 외주공장 코드
            var count = data.result.list.length;
            if(count > 0) {
                $(".add_category").addClass("l_line");
                $.each(data.result.list, function (i, list) {
                    if(list.key_nm == "ia1l2l3i4p5s6i") {
                        str += "<div class='add_prod' onclick=window.location.href='/fac/out_item_in?f="+cust_cd+"&k="+list.item_lv+"'>";
                            str += "<p>"+ list.key_name +"</p>";
                            str += "<span>제품 추가</span>";
                        str += "</div>";
                    }
                    str += "<div id='"+ list.item_cd +"' class='prod_list'>";
                    str += "<ul onclick=next_page({'item_cd':'"+list.item_cd+"','k':'"+list.item_lv+"'})>";
                    str += "<li>";
                    str += "<p class='p_name'>"+ list.item_nm +"</p>";
                    str += "<p class='dan'>"+ list.code_nm +"</p>";
                    str += "<p class='p_price'><span>"+ list.sale_amt +"</span>원</p>";
                    str += "</li>";
                    str += "</ul>";
                    str += "</div>";
                }); // end each

                if(scroll) { // scroll check flag
                    $("#data-container").append(str);
                } else {
                    $("#data-container").html(str);
                }

            } else if(count == 0 && scroll == false){ 
                $(".add_category").removeClass("l_line"); // reset
                $("#data-container").html("");
                current_page = 0; // page reset
            } // list length 0 
            
            // 최초실행 또는 검색결과 있을경우만
            if(data.result.not_count > 0 && (data.result.var.content == "" || data.result.var.content == null)) {
                $.each(data.result.not_list, function (i, list) {
                    str2 += "<div class='add_prod' onclick=window.location.href='/fac/out_item_in?f="+cust_cd+"&k="+list.ikey+"'>";
                    str2 += "<p>"+ list.key_name +"</p>";
                    str2 += "<span>제품 추가</span>";
                    str2 += "</div>";
                });
            }
            $("#data-container2").html(str2);

        }, // success end
        error: function(request, status, error) {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리

        }, // err end

    }); // ajax end

} // function end

/**
 * @description 제품 상세페이지로 이동시 현재까지 확인된 리스트, 현재페이지NO 로컬스토리지 저장
 * @param item_list.item_cd
*/
function next_page(obj) {
    var copy_list = $('#data-container').html();
    localStorage.setItem("out_item_content", $("#content").val());
    localStorage.setItem("out_item_page", current_page);
    localStorage.setItem("out_item_list", copy_list);
    window.location.href='/fac/out_item_li/v?cd='+obj.item_cd+'&k='+obj.k;
}