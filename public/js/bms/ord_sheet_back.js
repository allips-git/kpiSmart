/*================================================================================
 * @name: 김원명 - ord_sheet.js
 * @version: 1.0.0
 ================================================================================*/
var ord_list = new Array();

$(function(){
    /** 전체 checkbox on/off */
    $('#chk_all').off().click(function(){
        if($('input:checkbox[id="chk_all"]').is(':checked') == true){
            $("input[type=checkbox]").prop("checked",true);
        }else{
            $("input[type=checkbox]").prop("checked",false); 
        }
    });

    $('#sheet_pro, #get_ord').off().click(function(){
        var id = $(this).attr('id');
        var lot = $(this).attr('data-lot');
        var chk = false;
        var result = false;

        var ord_list = [];

        if(id == "get_ord"){ // 생성된 주문서 가져올 경우
            chk = true;
            result = true;
        }

        $("input:checkbox").each(function(){
            if($(this).attr('id') != 'chk_all'){
                if($(this).is(":checked") == true){
                    chk = true;
                    ord_list.push($(this).val());
                }
            }
        });

        if(chk) {
            if(id == "sheet_pro"){
                con = confirm('주문서를 생성하시겠습니까?');
                if(con){
                    result = true;
                }
            }

            if(result){
                switch(id){ /** 주문서가 새로 생성인지 생성된 주문서 인지 id 값으로 구분 */
                    case 'sheet_pro':
                        $('#p').val('in');
                        $('#list').val(ord_list);
                        $('#p_ord').val($('#ord').val());
                    break;
                    case 'get_ord':
                        $('#p').val('up');
                        $('#list').val(lot);
                        $('#p_ord').val($('#ord').val());
                    break;
                }
    
                var pop_title = "ord_sheet_print";
    
                var _width = '1100';
                var _height = '720';
                
                var _left = Math.ceil(( window.screen.width - _width )/2);
                var _top = Math.ceil(( window.screen.height - _height )/2);
            
                window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);
            
                var frmData = document.frm_sheet;
            
                frmData.target = pop_title;
                frmData.action = '/ord/out_in';
            
                frmData.submit();
            }
        }else{
            alert('생성할 주문서를 선택하세요.');
            return;
        }
    });    
});

/**
 * 주문서 생성 및 수정 시 데이터 재갱신
 */
function clickBtn(){
    document.querySelector('#frm1').submit();
}