/*================================================================================
 * @name: 김원명 - all_price.js
 * @version: 1.0.0, @date: 2021-02-05
================================================================================*/
$.toast.config.align = 'right';
$.toast.config.width = 400;

var item_list = new Array();

$(function(){
    /** 전체 checkbox on/off */
    $('#chk_all').off().click(function(){
        if($('input:checkbox[id="chk_all"]').is(':checked') == true){
            $("input[type=checkbox]").prop("checked",true);
            $("input[type=checkbox]").parents('tr').addClass('active');
        }else{
            $("input[type=checkbox]").prop("checked",false); 
            $("input[type=checkbox]").parents('tr').removeClass('active');
        }
    });

    $('input[type=checkbox]').click(function(){
        if($(this).is(':checked') == true){
            $(this).parents('tr').addClass('active');
        }else{
            $(this).prop("checked",false);
            $(this).parents('tr').removeClass('active');

        }
    });
    
    $('#g').off().change(function(){
        $('#n').val($(this).find("option:selected").data("ikey"));

        $('#frm').submit();
    });

    $('input[name="unit_amt"]').bind('keyup', function(e){
        var rgx1 = /\D/g;
        var rgx2 = /(\d+)(\d{3})/;
        var num = this.value.replace(rgx1,"");
        
        while (rgx2.test(num)) num = num.replace(rgx2, '$1' + ',' + '$2');
        this.value = num;

        $('#unit_amt').val(comma($(this).val()));
    });

    $('#apply').off().click(function(){
        var chk = false;
        item_list = [];

        $("input:checkbox").each(function(){
            if($(this).attr('id') != 'chk_all'){
                if($(this).is(":checked") == true){
                    chk = true;
                    item_list.push($(this).val());
                }
            }
        });

        if($('#unit_amt').val() == ""){
            $.toast('수정할 단가 금액을 입력하세요.', {sticky: true, type: 'danger'});
            $('#unit_amt').focus();
            return false;
        }

        if(chk){
            var con = confirm('금액을 수정하시겠습니까?');

            if(con){
                $('#arr_ikey').val(item_list);
                $('#amt_val').val($('#unit_amt').val());
                $('#k').val($('#n').val());
    
                $('#frm_u').submit();
            }
        }else{
            $.toast('수정할 목록을 최소 1개이상 체크하여 선택하세요.', {sticky: true, type: 'danger'});
            return false;
        }
    });
});

/**
 * @ 금액 콤마 찍기
 */
function comma(val){
    val = String(val);
    return val.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}