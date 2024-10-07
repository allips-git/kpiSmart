/*================================================================================
 * @name: 김원명 - tax.js
 * @version: 1.0.0, @date: 2020-07-31
 ================================================================================*/

/**
 * @description 세금신고관리 JS
 */

 $(function(){
	$(function() {
        $(".datepicker").datepicker({
        	dateFormat:'yy-mm-dd'
            , showOn: 'button' 
            , buttonImage: '/public/img/calender_img.png'  // 달력 아이콘 이미지 경로
            , buttonImageOnly: true //  inputbox 뒤에 달력 아이콘만 표시
            , changeMonth: false // 월선택 select box 표시 (기본은 false)
            ,changeYear: false  // 년선택 selectbox 표시 (기본은 false)
        });
    }); 
         
    $('#btn_cancel').off().click(function(){
        $("#dv_in").show();
        $("#dv_up").css("display", "none");
        $("#p").val('in');        

        cust_open('add');
    });
 });

/**
 * @description 거래처 찾기 팝업에서 선택 눌렀을때 실행하는 함수
 * @author 황호진  @version 1.0, @last update 2021/11/10
 */
function cust_close(arg) {
	arg = JSON.parse(decodeURIComponent(arg)); // 필수
	$('.biz-li-pop').bPopup().close(); // 필수
	$("#biz_cd").val(arg.cust_cd);
	clickBtn();
}

 /** 숫자만 입력되도록 금액 text (사용안함)*/
function onlyNumber(){
    if((event.keyCode<48)||(event.keyCode>57))
    event.returnValue=false;
}

 /* 수정 할 데이터 가져오기 */
function edit_data(key){

    cust_open("edit");

    $("#dv_in").css("display", "none");
    $("#p").val('up');

    $.ajax({ 
        url: '/acc/tax/vw',
        type: 'get',
        data: {
            ikey : key
        },
        dataType: "json",
        success: function(result) { 
            if(result.code == 100){
                $("#dv_up").css('display', 'inline');
                $('#col_dt').val(result.data.REGS_DT.substring(0,4)+"-"+result.data.REGS_DT.substring(4,6)+"-"+result.data.REGS_DT.substring(6,8));
                $('#item').val(result.data.ITEM_NM);
                $('#amt').val(Math.floor(result.data.TOTL_AMT));
                $('#sply').val(Math.floor(result.data.SPLY_AMT));                
                $('#memo').val(result.data.NOTE);
                if(Math.floor(result.data.VAT_AMT) != 0){
                    $('#vat_choice').val('in').attr('selected','selected');
                }else{
                    $('#vat_choice').val('not').attr('selected','selected');                    
                }
                $('#ikey').val(result.data.ikey);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}

function cust_open(data) {

    var biz_cd = $('#biz_cd').val();
    var biz_name = $('#biz_name').val();
    var ceo_nm = $('#h_ceo_nm').val();
    var biz_num = $('#h_biz_num').val();
    var ceo_tel = $('#h_ceo_tel').val();
    var tel = $('#h_tel').val();
    var address = $('#h_address').val();
    
    if(!nan_chk(biz_cd) || !nan_chk(biz_name)) {
        if(biz_num.length < 10){
            $('#dv_in').hide();
            $('#biz_num').addClass('red');
            $('#biz_num').text('사업자등록번호가 잘못됐을 경우 세금신고가 불가능합니다.');
            /*$.toast.config.align = 'right';
            $.toast.config.width = 400;
            $.toast('사업자등록번호가 없는 거래처는 세금신고가 불가능합니다.', {sticky: true, type: 'danger'});*/
        }else{
            $('#biz_num').text(biz_num);
        }

        $('#amt').focus();
        $("#col_dt").val(get_date('today')); // 기본값 세팅
        $('#biz_nm').text(biz_name);
        $('#ceo_nm').text(ceo_nm);
        $('#ceo_tel').text(ceo_tel);
        $('#tel').text(tel);
        $('#address').text(address);
        fm_reset(data); // 리셋

        $('.after').css('display', 'inline');
        $('.before').css('display', 'none');
    } else {
        $.toast.config.align = 'right';
        $.toast.config.width = 400;
        $.toast('초기화 상태입니다.', {sticky: true, type: 'danger'});
    }
}

/* 입력값 리셋 */
function fm_reset(data) {
    $("#col_dt").val(get_date('today')); // 기본값 세팅
    $('#col_dt').next('span').css('pointer-events', 'initial');
    $('#vat_choice').val('in').attr('selected','selected');
    var field = new Array(
        "amt","item","sply","memo"
    );
    $.each(field, function(i, val) {
        $('#'+field[i]).val('');
    });
    if(data != "edit"){
        var now = new Date();
        var Month = now.getMonth()+1;
        var biz = $('#biz_name').val();
        //var date = now.getFullYear()+""+lpad(String(Month))+""+lpad(String(now.getDate()))+""+now.getHours()+""+lpad(String(now.getMinutes()))+""+lpad(String(now.getSeconds()));

        $('#item').val(biz+"_"+Month+"월매출");
    }
}

/* 입력창 재활성화 */
var biz_cd = $('#biz_cd').val(); 

    if(!nan_chk(biz_cd)) {
        cust_open();
    } 

/* 조회 버튼 트리거 */
function clickBtn(){
    $('#frm').submit();
}

function lpad(s){
    if(s.length == 1){
        return "0"+s;
    }else{
        return s;
    }
}
