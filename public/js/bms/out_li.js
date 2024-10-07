/*================================================================================
 * @name: 김원명 - out_li.js
 * @version: 1.0.0, @date: 2021-02-08
================================================================================*/

/**
 * 출력물 JSP 연동
 */
function open_print(out_no){
	var con = confirm("주문서를 출력하시겠습니까?");

    if(con){
        $.ajax({ 
            url: '/ord/out_li/p',
            type: 'GET',
            data: {
                out_no : out_no
            },
            dataType: "json",
            success: function(data) {
                if(data.msg == "error"){
                    toast('출력에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
                    return;
                }else{
                    location.reload();
                }
            },
            error: function(request,status,error) {
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                $.toast('실패', {sticky: true, type: 'danger'});
            },

        });	        

        $('#p_gb').val(print_gb);
        $('#out_no').val(out_no);
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

/**
 * 매입처명 클릭 시 주문서로 go
 */
function list_go(out_no){
    $('#list').val(out_no);

    var frmData = document.go_list;

    frmData.target = "_self";
    frmData.action = '/ord/out_in';

    frmData.submit();
}