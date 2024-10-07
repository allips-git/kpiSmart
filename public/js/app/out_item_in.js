/*================================================================================
 * @description 플랜오더APP 외주 공장 제품 등록,수정,삭제 관리JS
 * @author 김민주, @version 1.0, @last date 2022/04/08
 ================================================================================*/

 $(function () {

    // 기본 세팅
    var item_lv = get_parameter("k");
    unit({ 'ikey':item_lv });   // 기본단위
    $("#item_nm").focus();      // 제품명 포커스
    $("#item_lv").val(item_lv); // hidden value 세팅

    // 외주 제품 상세 조회
    if( !nan_chk(get_parameter("cd")) ) { // 제품코드 null check
        $("#item_cd").val(get_parameter("cd"));
        get_color_detail($("#frm_mod").serializeObject()); // 제품색상 상세조회
    } else {
        $("#cust_cd").val(get_parameter("f"));
    }

    // 외주공장 제품 등록 이벤트
    $(".btn_item_reg").off().click(function () { 
        var con = confirm('#0054FF/저장합니다/선택하신 제품을 안전하게 저장합니다.');
        if(con) {
            item_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 외주공장 제품 수정 이벤트
    $(".btn_item_mod").off().click(function () { 
        var con = confirm('#0054FF/저장합니다/선택하신 제품을 안전하게 저장합니다.');
        if(con) {
            item_validation($("#frm_mod").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 외주공장 제품 삭제 이벤트
    $(".btn_item_del").off().click(function () { 
        var con = confirm('#FF0000/제품 정보를 삭제합니다./삭제 이후 복구가 불가능합니다.');
        if(con) {
            item_delete($("#frm_mod").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 외주제품 색상추가 이벤트
    var cnt = 1;
    $(".btn_color_add").off().click(function () { 
        cnt += 1;
        var str = "";
        str += "<li id='li_color_"+cnt+"'>";
        str += "<div class='input_wrap'>";
        str += "<input type='text' class='sub_nm_01' name='sub_nm_01' placeholder='"+cnt+") 색상명을 입력해주세요.' autocomplete='off'>";
        str += "</div>";
        str += "<button type='button' class='del' onclick=item_color_del({id:"+cnt+"});>삭제</button>";
        str += "</li>";
        $("#color-container").append(str);
        $('#count').html(cnt);
    });

});

/**
 * @description 제품 색상라인 동적 UI삭제
 */
function item_color_del(obj) {
    $("#li_color_"+obj.id).remove();
}

/**
 * @description 제품 업종별 단위 기본값 세팅
 */
 function unit(obj) {

    $.ajax({

        url: '/fac/out_item_li/unit',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) { 

            // success, fail
            var str = "";
            if(data.code == '100') {
                if(data.result.key_name == "블라인드") {
                    str += "<option value='001'>회베</option>";
                    str += "<option value='002'>㎡</option>";
                    str += "<option value='005'>EA</option>";
                } else if(data.result.key_name == "커텐") {
                    str += "<option value='006'>야드</option>";
                    str += "<option value='007'>폭</option>";
                    str += "<option value='005'>EA</option>";
                } else {
                    str += "<option value='005'>EA</option>";
                    str += "<option value='011'>BOX</option>";
                }
                $("#unit").html(str);
            } else if(data.code == '999') {
                alert('#FF0000/제품정보가 정확하지 않습니다/확인 후 다시 이용바랍니다.');
                window.history.back();
            }
        }
        
    });

}

/**
 * @description 외주공장 제품 상세조회 - 화면 깜빡임으로 미사용. 김민주 2022/03/22
*/
function get_item_detail(obj) {

    $.ajax({
        url: '/fac/out_item_li/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            //console.log('출력:'+JSON.stringify(data));

            // 제품 상세 VALUE 값
            var field = { 
                "ikey": data.result.list[0].ikey, "cen_uc": data.result.list[0].cen_uc
                , "item_cd": data.result.list[0].item_cd, "item_nm": data.result.list[0].item_nm
                , "size": (data.result.list[0].size > 0) ? parseFloat(data.result.list[0].size) : ''
                , "height": (data.result.list[0].height > 0) ? parseFloat(data.result.list[0].height) : ''
                , "unit_amt": (data.result.list[0].unit_amt > 0) ? parseFloat(data.result.list[0].unit_amt) : ''
                , "sale_amt": (data.result.list[0].sale_amt > 0) ? parseFloat(data.result.list[0].sale_amt) : ''
             };
            process(field, "val");
            $("#minute").val(data.result.list[0].minute).prop("selected", true);

            // 제품 단위 텍스트비교 선택
            $('.unit option').each(function() {
                if($(this).text() == data.result.list[0].code_nm) {
                    $(this).prop('selected', true);
                } 
            });

        }, // success end
        error: function(request, status, error) {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리

        }, // err end

    }); // ajax end

} // function end


/**
 * @description 외주공장 제품색상 상세 조회
*/
function get_color_detail(obj) {

    $.ajax({
        url: '/fac/out_item_li/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            var str = "";
            var count = data.result.count;
            if(count > 0) { // 색상 있을경우
                $.each(data.result.list, function (idx, list) {
                    idx += 1;
                    str += "<li id='li_color_"+idx+"'>";
                    if(idx == 1) {
                        str += "<div class='input_wrap'>";
                        str += "<input type='text' class='sub_nm_01' name='sub_nm_01' placeholder='"+idx+") 색상명을 입력해주세요.' autocomplete='off' value="+list.sub_nm_01+">";
                        str += "</div>";
                        str += "<button type='button' class='add_color btn_color_add'>컬러추가</button>";
                    } else {
                        str += "<div class='input_wrap'>";
                        str += "<input type='text' class='sub_nm_01' name='sub_nm_01' placeholder='"+idx+") 색상명을 입력해주세요.' autocomplete='off' value="+list.sub_nm_01+">";
                        str += "</div>";
                        str += "<button type='button' class='del' onclick=item_color_del({id:"+idx+"});>삭제</button>";
                    }
                    str += "</li>";
                    $('#count').html(idx);
                });
            } else { //  색상 없을경우
                str += "<li id='li_color_1'>";
                str += "<div class='input_wrap'>";
                str += "<input type='text' class='sub_nm_01' name='sub_nm_01' placeholder='1) 색상명을 입력해주세요.' autocomplete='off' value=''>";
                str += "</div>";
                str += "<button type='button' class='add_color btn_color_add'>컬러추가</button>";
                str += "</li>";
            }
            $("#color-container").html(str);

        }, // success end
        error: function(request, status, error) {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리

        }, // err end

    }); // ajax end

} // function end


 /**
 * @description 전송 값 유효성 검사
 */
 function item_validation(obj) {

    var item_cd = get_parameter("cd"); 

    // 색상값 추출
    var sub_nm_01 = new Array();
    $("input[name=sub_nm_01]").each(function(index, item) {
        // 배열의 값이 null일 경우 배열 제외 
        if($(item).val() != '') { 
            sub_nm_01.push($(item).val());
        }
    });

    $.ajax({

        url: '/fac/out_item_in/v',
        type: 'POST',
        data: {
            'csrf_token_ci': obj.csrf_token_ci,
            'p': obj.p,
            'cust_cd': obj.cust_cd,
            'item_cd': item_cd,
            'item_lv': obj.item_lv,
            'item_nm': obj.item_nm,
            'sub_nm_01': sub_nm_01,
            'size': obj.size,
            'unit': obj.unit,
            'minute': obj.minute,
            'height': obj.height,
            'unit_amt': obj.unit_amt,
            'sale_amt': obj.sale_amt
        },
        dataType: "json",
        success: function (data) { 

            // in, up, fail
            if(data.code == '100') {
                item_register(data.list);
            } else if(data.code == '200') { 
                item_modify(data.list);
            } else if(data.code == '999') {
                alert('#FF0000/입력값이 정확하지 않습니다/확인 후 다시 이용바랍니다.');
            }

        }

    });

}

/**
 * @description 외주공장 제품 등록
 * @return result code, comment
 */
 function item_register(obj) {

    // 인입 경로 구분자
    var param = get_parameter("p"); 
    $.ajax({

        url: '/fac/out_item_in/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // success, fail 
            if(data.code == '100') {
                alert('#0054FF/제품정보/저장이 완료되었습니다.');
                // 제품군 페이지에서 인입
                if(param == "item") { 
                    window.history.go(-2);
                } else {
                    window.history.back();
                }
            } else if(data.code == '900' || data.code == '910') { 
                alert('#FF0000/중복등록/확인 후 다시 이용 바랍니다.');
            } else if(data.code == '999') {
                alert('#FF0000/저장실패/지속될 경우 관리자에게 문의 바랍니다.');
            }

        }

    });
}

/**
 * @description 외주공장 제품 수정
 * @return result code, comment
 */
 function item_modify(obj) {

    $.ajax({

        url: '/fac/out_item_in/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // 수정 전 list
            $('#results').html(decodeURI(localStorage.getItem("out_item_list")));

            // 내용 변경
            $("#"+get_parameter("cd")+" > ul > li > .p_name").text(obj.item_nm);
            $("#"+get_parameter("cd")+" > ul > li > .dan").text($(".unit").find("option[value='" + obj.unit + "']").text());
            $("#"+get_parameter("cd")+" > ul > li > .p_price > span").text(obj.sale_amt);
            localStorage.setItem("out_item_list", $('#results').html());
            
            // success, fail 
            if(data.code == '100') {
                alert('#0054FF/제품정보/저장이 완료되었습니다.');
                window.history.back();
            } else if(data.code == '999') {
                alert('#FF0000/저장실패/지속될 경우 관리자에게 문의 바랍니다.');
            }

        }

    });
}

/**
 * @description 외주공장 제품 삭제
 * @return result code, comment
 */
 function item_delete(obj) {

    $.ajax({

        url: '/fac/out_item_in/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // 수정 전 list
            $('#results').html(decodeURI(localStorage.getItem("out_item_list")));

            // 내용 삭제
            $("#"+get_parameter("cd")).remove();
            localStorage.setItem("out_item_list", $('#results').html());

            // success, fail 
            if(data.code == '100') {
                alert('#0054FF/제품정보/삭제 완료되었습니다.');
                window.history.back();
            } else if(data.code == '999') {
                alert('#FF0000/삭제실패/지속될 경우 관리자에게 문의 바랍니다.');
            }

        }

    });

}
