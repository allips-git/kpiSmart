/*================================================================================
 * @name: 김원명 - work_mn.js
 * @version: 1.0.0, @date: 2021-02-10
================================================================================*/
let p_lot_arr;

$(function(){
    $('#all_chk, #all_rel').off().click(function(){ // 전체 선택/해제
        switch($(this).attr('id')){
            case 'all_chk':
                $("input[type=checkbox]").prop("checked", true);                
            break;
            case 'all_rel':
                $("input[type=checkbox]").prop("checked", false);                
            break;
        }
    });
    /*$('#sc').keydown(function(key){
        if(key.keyCode == 13){
            get_search();
        }
    });*/
    /*window.onafterprint = function() {
        get_test();
    };*/

    $('#complete, #barcode').off().click(function(){
        p_lot_arr = [];
        var chk = false;

        $("input:checkbox").each(function(){
            if($(this).is(":checked") == true){
                var lot = $(this).val().split(',');

                $.each(lot, function(index, item){
                    p_lot_arr.push("'"+item+"'");
                });
                chk = true; // 체크박스가 하나라도 체크 되어있을 시 true 변경
            }
        });

        switch($(this).attr('id')){
            case 'complete':
                if(chk){
                    if(confirm('해당 데이터를 완료처리 하시겠습니까?')){
                        get_complete();
                    }
                }else{
                    alert('완료 처리할 데이터를 선택하세요.');
                    return false;
                }
            break;
            case 'barcode':
                if(chk){
                    $('#lot_arr').val(p_lot_arr);

                    barcode_print();
                }else{
                    alert('바코드 출력할 데이터를 선택하세요.');
                    return false;
                }
            break;
        }
    });

    $('#op_1').change(function(){
        get_proc_list();
    });
});

/**
 * @description 작업장 변경 시 공정 리스트 재구성
 */
function get_proc_list(){
    $.ajax({
        url: '/work/work_mn/get_proc_list',
        type: 'GET',
        data: {
            wp_uc : $('#op_1 option:selected').attr('data-wp'),
            pc_uc : $('#op_1 option:selected').attr('data-pc')
        },
        dataType: "json",
        success: function(data) {
            var op_2 = '<option class="red" disabled="" style="background:#FAF4C0">공정 목록</option>';

            $.each(data.list, function(index, item){
                op_2 += "<option value='"+item.pp_cd+"'>"+item.pp_nm+"</option>";
            });

            $('#op_2').html(op_2);
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 완료처리
 */
function get_complete(){
    $.ajax({
        url: '/work/work_mn/get_complete',
        type: 'GET',
        data: {
            lot : p_lot_arr
        },
        dataType: "json",
        success: function(data) {
            switch(data.msg){
                case 'success':
                    alert('완료처리되었습니다.');
                    location.reload();
                break;
                case 'not':
                    toast('삭제된 작업건이 포함되어 해당 화면이 새로고침됩니다.', true, 'danger');
                    setTimeout(function(){ 
                        location.reload();
                    }, 2000);
                break;
                case 'fail':
                    alert('데이터 처리에 실패하였습니다. 잠시 후 다시 시도해주세요.');
                break;
            }
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

/**
 * @description 바코드 출력 JSP 연동
 */
function barcode_print(){
    $.ajax({
        url: '/work/work_mn/barcode_print',
        type: 'GET',
        data: {
            lot : p_lot_arr
        },
        dataType: "json",
        success: function(data) {
            switch(data.msg){
                case 'success': // 성공
                    $('#p_gb').val(print_gb);

                    var pop_title = "barcode";
                
                    var _width = '750';
                    var _height = '385';
                 
                    var _left = Math.ceil(( window.screen.width - _width )/2);
                    var _top = Math.ceil(( window.screen.height - _height )/2);
                
                    window.open("", pop_title, 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top);
                
                    var frmData = document.frm_b;
                
                    frmData.target = pop_title;
                    if(print_host == 'test.localhost' || print_host == 'bms-tmp.localhost') {
                        frmData.action = print_local+"/work_barcode.jsp";
                    } else {
                        frmData.action = print_domain+"/work_barcode.jsp";
                    }
                
                    frmData.submit();
                    if($('#op_7 option:selected').val() == 'N' || $('#op_7 option:selected').val() == ''){
                        location.reload();
                    }
                break;
                case 'not': // 바코드 삭제 되었을 시
                    toast('삭제된 작업건이 포함되어 해당 화면이 새로고침됩니다.', true, 'danger');
                    setTimeout(function(){ 
                        location.reload();
                    }, 2000);
                break;
                case 'fail': // 실패
                    alert('바코드 출력에 실패하였습니다. 잠시 후 다시 시도해주세요.');
                break;
            }
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            //$.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}