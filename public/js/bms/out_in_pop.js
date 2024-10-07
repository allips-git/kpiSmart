/*================================================================================
 * @name: 김원명 - out_in_pop.js
 * @version: 1.0.0, @date: 2021-02-01
================================================================================*/

/**
 * order_detail 각 정보
 */
var arr_list        =   new Array(); // lot_m과 ord_dseq정보
var arr_ord_memo    =   new Array(); // 비고 값 정보

$(function(){
    /** 전체 checkbox on/off */
    $('#chk_all').off().click(function(){
        if($('input:checkbox[id="chk_all"]').is(':checked') == true){
            $("input[type=checkbox]").prop("checked",true);
        }else{
            $("input[type=checkbox]").prop("checked",false); 
        }
    });

    $(".datepicker").datepicker({
        dateFormat:'yy-mm-dd'
        , showOn: 'button' 
        , buttonImage: '/public/img/calender_img.png'  // 달력 아이콘 이미지 경로
        , buttonImageOnly: true //  inputbox 뒤에 달력 아이콘만 표시
        , changeMonth: false // 월선택 select box 표시 (기본은 false)
        ,changeYear: false  // 년선택 selectbox 표시 (기본은 false)
    });

    $("#cust").select2();
	$("#cust").on('change' , function () {
        if($(this).val() != ""){
            get_cust($(this).val());
        }else{
            $('#cust_tel, #cust_fax, #cust_person').val('');
        }
	});

    $('#in, #up').off().click(function(){
        if(input_check()){ // 필수 값 체크 후 이동
            apply($(this).attr('id'));
        }
    });

    $('#de').off().click(function(){
        var del = confirm('주문서를 삭제하시겠습니까?');

        if(del){
            go_del();
        }
    });
});

/**
 * @description 거래처 선택 시 정보 input val
 */
function get_cust(cust_cd){
    $.ajax({
        url: '/ord/out_in/get_cust',
        type: 'GET',
        data: {
            cust_cd : cust_cd
        },
        dataType: "json",
        success: function(result){
            $('#cust_tel').val(result.cust['tel']);
            $('#cust_fax').val(result.cust['fax']);
            $('#cust_person').val(result.cust['person']);
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            toast('처리 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
        },
    });
}
/**
 * @description 필수 입력 값 check
 */
function input_check(){
    arr_list        = [];
    arr_ord_memo    = [];
    var chk = false;

    if($('#cust').val() == ""){
        toast('매입거래처 상호명을 선택하세요.', true, 'danger');
        return false;
    }

    if($('#ord_dt').val() == ""){
        toast('주문일자를 입력하세요.', true, 'danger');
        return false;
    }

    if($('#dlv_dt').val() == ""){
        toast('출고일자를 입력하세요.', true, 'danger');
        return false;
    }

    chk = get_list('in');

    if(chk){
        return true;
    }else{
        toast('최소 1개이상의 주문 데이터를 선택해주세요.', true, 'danger');
        return false;
    }
}

/**
 * @description 주문서 생성/수정
 */
function apply(p){
    if(p == "in"){
        var con = confirm('주문서를 생성하시겠습니까?');
    }else{
        var con = confirm('주문서를 수정하시겠습니까?');
    }

    if(con){
        $('#loading').show();

        $.ajax({
            url: '/ord/out_in/a',
            type: 'GET',
            data: {
                p           : p,
                out_no      : $('#out_no').val(),
                cust        : $('#cust').val(),
                ord_dt      : $('#ord_dt').val(),
                dlv_dt      : $('#dlv_dt').val(),
                hm_addr     : $('#hm_addr').val(),
                person      : $('#person').val(),
                dlv_gb      : $("input[name='dlv_gb']:checked").val(),
                recept      : $('#recept').val(),
                addr        : $('#addr').val(),
                tel         : $('#tel').val(),
                memo        : $('#memo').val(),
                list        : arr_list,
                ord_memo    : arr_ord_memo,
                remark      : $('#remark').val()
            },
            dataType: "json",
            success: function(result){
                switch(result.msg){
                    case 'in':
                        alert('주문서 생성이 완료되었습니다.');
                        location.href="/ord/out_li";
                    break;
                    case 'up':
                        alert('주문서 수정이 완료되었습니다.');
                        location.href="/ord/out_li";
                    break;
                    case 'error':
                        toast('처리 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
                    break;
                };
                opener.parent.clickBtn();
            },
            error: function(request,status,error) {
                console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                toast('처리 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
                $('#loading').hide();
            },
        });
    }
}

/**
 * 주문서 삭제
 */
function go_del(){
    get_list('d');

    $.ajax({
        url: '/ord/out_in/d',
        type: 'GET',
        data: {
            out_no  : $('#out_no').val(),
            lot     : arr_list
        },
        dataType: "json",
        success: function(result){
            if(result.msg == "success"){
                alert('삭제되었습니다.');
                location.href="/ord/out_li";
            }else{
                toast('처리 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
            };
            opener.parent.clickBtn();
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            toast('처리 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
        },
    });
}

/**
 * @description lot array 생성
 */
function get_list(k){
    var chk;

    if(k == "in"){
        $("input:checkbox").each(function(){
            if($(this).attr('id') != 'chk_all'){
                if($(this).is(":checked") == true){
                    var lot = $(this).val();
                    arr_ord_memo.push($('#ord_memo_'+lot+'').val());
                    arr_list.push($(this).val());
                    chk = true;
                }
            }
        });
    }else{
        $("input:checkbox").each(function(){
            if($(this).attr('id') != 'chk_all'){
                arr_list.push($(this).val());
            }
        });
    }

    return chk;
}

/**
 * @description 출력물 JSP 연동
 */
function open_print(){
	var con = confirm("주문서를 출력하시겠습니까?");

    if(con){
        $('#p_gb').val(print_gb);
        var option = "width = 1100, height = 720, top = 400, left = 400";
        var pop_title = "out_print";
    
        var _width = '825';
        var _height = '900';
     
        var _left = Math.ceil(( window.screen.width - _width )/2);
        var _top = Math.ceil(( window.screen.height - _height )/2);
    
        window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);
    
        var frmData = document.p_frm;
    
        frmData.target = pop_title;

        if(print_host == 'bms-tmp.allips.kr') {
            frmData.action = print_domain+"/out_in.jsp";
        } else {
            frmData.action = print_local+"/out_in.jsp";
        }
    
        frmData.submit();
    }
}