$.toast.config.align = 'right';
$.toast.config.width = 400;

$(function(){
    $('#edit').off().click(function(){
        if($('#cust_cd').val() == ""){
            $.toast('거래처명을 입력해주세요.', {sticky: true, type: 'danger'});
            $('#cust_name').focus();
            return false;
        }

        approve('N');
    });

    $('#cancle').off().click(function(){
        approve('C');
    });
});

/**
 * 리스트에서 ID 클릭 시 정보 가져와 view처리
 */
function get_user_info(ikey, useyn){
    $.ajax({ 
        url: '/cen/user_wait/g',
        type: 'get',
        data: {
            ikey : ikey
        },
        dataType: "json",
        success: function(result) { 
            $('#btn').show();
            if(result.info.accyn != 'Y'){
                $('#cancle').hide();
            }else{
                $('#cancle').show();
            }
            $('#ikey').val(result.info.ikey);

            /*switch(result.info.useyn){
                case 'Y':
                    $('#useY, #useC').show();
                    $('#useN').hide();
                break;
                case 'N': case 'C':
                    $('#useY, #useC').show();
                    $('#useN').hide();
                break;
            }*/
            $('#prov_cust').text(result.info.cust_name);
            $('#prov_name').text(result.info.name_pres);
            $('#cust_name').val(result.info.prov_name);
            $('#cust_cd').val(result.info.cust_cd);
            $('#prov_name_pres').text(result.info.prov_pres);
            if(result.info.accyn == "N"){
                $('#accyn').val('Y').attr('selected','selected');
            }else{
                $('#accyn').val(result.info.accyn).attr('selected','selected');
            }
            $('#re_id').text(result.info.id);
            $('#re_name').text(result.info.user_name);
            $('#re_phone').text(num_format(result.info.tel,1));
            $('#re_bir').text(num_format(result.info.birth,2));
            if(result.info.certiyn == "Y"){
                $('#re_certi').text('인증');
            }else{
                $('#re_certi').text('미인증');                
            }
            if(result.info.agreeyn == "Y"){
                $('#re_agree').text('동의');
            }else{
                $('#re_agree').text('미동의');
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        }
    });
}

/**
 * 정보 update
 */
function approve(accyn){
    var yn;

    if(accyn == "C"){
        yn = "C";
    }else{
        yn = $('#accyn option:selected').val();
    };

    var con = confirm('처리하시겠습니까?');

    if(con){
        $.ajax({ 
            url: '/cen/user_wait/u',
            type: 'get',
            data: {
                ikey : $('#ikey').val(),
                cust_cd : $('#cust_cd').val(),
                accyn : yn
            },
            dataType: "json",
            success: function(result) { 
                if(result.msg == "success"){
                    $.toast('수정되었습니다.', {sticky: false, type: 'info'});
                    $('#prod_name_'+result.ikey+'').text($('#cust_name').val());
                    if(result.accyn != "N"){ // 승인완료 시 가입일 표기
                        $('#acc_dt_'+result.ikey+'').text(result.acc_dt);
                    }else{
                        $('#acc_dt_'+result.ikey+'').text('');
                    }
                    switch(result.accyn){
                        case 'Y':
                            $('#acc_'+result.ikey+'').html('<span class="green-box">승인완료</span>');
                        break;
                        case 'N':
                            $('#acc_'+result.ikey+'').html('<span class="blue-box">승인대기</span>');
                        break;
                        case 'C':
                            $('#acc_'+result.ikey+'').html('<span class="red-box">승인취소</span>');
                        break;
                    }

                    reset();
                }else{
                    $.toast('에러가 발생했습니다. 잠시 후 다시 시도해주세요.', {sticky: true, type: 'danger'});
                }
            },
            error: function(request,status,error) {
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                $.toast('실패', {sticky: true, type: 'danger'});
            }
        });
    }
}

function reset(){
    $('#btn').hide();
    $('#ikey').val('');

    //$('#useY, #useN, #useC').show();
    $('#prov_cust').text('');
    $('#prov_name').text('');
    $('#cust_name').val('');
    $('#cust_cd').val('');
    $('#prov_name_pres').text('');
    $('#accyn').val('Y').attr('selected','selected');
    $('#re_id').text('');
    $('#re_name').text('');
    $('#re_phone').text('');
    $('#re_bir').text('');
    $('#re_certi').text('');
    $('#re_agree').text('');
}