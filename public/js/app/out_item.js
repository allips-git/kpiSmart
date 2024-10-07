/*================================================================================
 * @description 플랜오더APP 외주 공장 업종 관리JS
 * @author 김민주, @version 1.0, @last date 2022/04/08
 ================================================================================*/

 $(function () {

    var cust_cd = get_parameter("f"); // 외주공장 코드
    get_item_st_list({ 'cust_cd':cust_cd });

    // 외주공장 제품 업종 설정 페이지 이동
    $(".txt_gb_add").off().click(function () { 

        var result = prompt("#0054FF/제품업종/업종명을 입력하세요.");
        if(!nan_chk(result)) {
            $("#key_name").val(result); // 추가 정보
            $("#cust_cd").val(cust_cd);
            item_st_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        } else {
            if(result != null) {
                alert('#FF0000/입력값이 정확하지 않습니다/확인 후 다시 이용바랍니다.');
            }
        }

    });

    // 외주공장 제품등록 페이지 이동
    $(".btn_item_add").off().click(function () { 

        var item_lv = $('input[name=item_lv]:checked').attr('class');
        window.location.href="/fac/out_item_in?f="+cust_cd+"&k="+item_lv+"&p=item";

    });

});


 /**
 * @description 전송 값 유효성 검사
 */
 function item_st_validation(obj) {

    $.ajax({

        url: '/fac/out_item_st/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) { 

            // in, up, fail
            if(data.code == '100') {
                item_st_register(obj);
            } else if(data.code == '200') {
                //item_modify(obj);
            } else if(data.code == '999') {
                alert('#FF0000/입력값이 정확하지 않습니다/확인 후 다시 이용바랍니다.');
            }

        }

    });

}


/**
 * @description 외주공장 제품 업종 등록
 * @return result code, comment
 */
 function item_st_register(obj) {

    $.ajax({

        url: '/fac/out_item_st/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // success, fail
            if(data.code == '100') {
                alert('#0054FF/제품업종/등록이 완료되었습니다.');
                get_item_st_list(obj);
            } else if(data.code == '500') {
                alert('#FF0000/중복명칭/확인 후 다시 이용 바랍니다.');
            } else if(data.code == '999') {
                alert('#FF0000/등록실패/지속될 경우 관리자에게 문의 바랍니다.');
            }

        }

    });

}


/**
 * @description 외주공장 업종 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_item_st_list(obj) {

    $.ajax({
        url: '/fac/out_item_st/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) { 

            var str = "";
            var count = data.result.count;
            if(count > 0) {
                $.each(data.result.list, function (i, list) {
                    str += "<li>";
                    str += "<input type='radio' id='chk"+i+"' class="+list.ikey+" name='item_lv' value="+list.key_name+">";
                    str += "<label for='chk"+i+"' class='chk"+i+"'>"+list.key_name+"</label>";
                    str += "</li>";
                    str += "</li>";
                });
                str += "<p class='hint'>판매 품목만 선택해 주세요.</p>";
            } 
            $("#data-container").html(str); // ajax data output
            $(":input:radio[name='item_lv']").eq(0).attr("checked", true); // first eq check

        }, // success end
        error: function(request, status, error) {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리

        }, // err end

    }); // ajax end

} // function end