/*================================================================================
 * @description FMS 자사 정보JS
 * @author 안성준, @version 1.0, @last date
 ================================================================================*/

$(function () {
    get_factory_info();

    get_today_date();
    // 자사정보 저장 이벤트
    $("#btn_save").off().click(function () { 
        var con = confirm('등록 하시겠습니까?');
        if (con) 
        {
            // $("#p").val("in");
            factory_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
        }
    });

    // 자사정보 목록 이벤트
    $("#btn_list").off().click(function () { 
        var con = confirm('변경 후 저장하지 않은 내용은 초기화 됩니다.메인으로 이동하시겠습니까?');
        if (con) 
        {
            location.href = '../main'
        }
    });

    $('#img').change(function(){
        let img_len = $('#img')[0].files;

        if(img_len.length == 1)
        {
            if(file_check())
            {
                // $('#k').val('i');
                var reader = new FileReader();
                reader.onload = function(e) {
                    $('#pic').attr('src', e.target.result);
                }
                reader.readAsDataURL(this.files[0]);
            }
        }
        else{
            $('#pic').attr('src', '/public/img/no_img.jpg');
        };
    });
});

function get_today_date(){
    var today = new Date();

    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);

    var dateString = year + '년 ' + month  + '월 ' + day +'일 현재 시스템 정상 가동중입니다.';

    $('.date span').html(dateString);
}

function get_factory_info()
{
    $.ajax({
        url: '/base/info/detail',
        type: 'POST',
        dataType: "json",
        success: function(data) { 
            $('#local_cd').text(data.result.local_cd);

            $("#ikey").val(data.result.ikey);
            $('#biz_nm').val(data.result.biz_nm);
            $('#biz_cd').val(data.result.biz_cd);
            $('#biz_class').val(data.result.biz_class);
            $('#biz_type').val(data.result.biz_type);
            $('#tel').val(data.result.tel);
            $('#fax').val(data.result.fax);
            $('#email').val(data.result.email);
            $('#biz_zip').val(data.result.biz_zip);
            $('#address').val(data.result.address);
            $('#addr_detail').val(data.result.addr_detail);
            $('#ceo_tel').val(data.result.ceo_tel);
            $('#ceo_nm').val(data.result.ceo_nm);
            $('#memo').val(data.result.memo);

            $("input:radio[name='biz_gb'][value='"+data.result.biz_gb+"']").prop('checked', true);

            //// item detail input val
            // var field = { 
            //   "ikey": data.result.ikey, "biz_nm": data.result.biz_nm,"biz_cd": data.result.biz_cd
            //   ,"biz_class" : data.result.biz_class, "biz_type": data.result.biz_type, "tel": data.result.tel
            //   ,"fax": data.result.fax, "email": data.result.email, "biz_zip": data.result.biz_zip
            //   ,"address": data.result.address ,"addr_detail": data.result.addr_detail ,"ceo_tel": data.result.ceo_tel 
            //   ,"ceo_nm": data.result.ceo_nm ,"memo": data.result.memo 
            // };
            // process(field, "cval");
        }, 
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', { sticky: true, type: 'danger' });
        }, // err end
    }); // ajax end
}
    /**
 * @description 전송 값 유효성 검사
 */
function factory_validation(obj) {

    $.ajax({

        url: '/base/info/v',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // in
            {
                info_modify(obj);
            } 
            else if (data.code == '999') // fail validation
            {
                toast('입력값이 정확하지 않습니다. 필수 입력 확인 후 다시 이용바랍니다.', true, 'danger');
            }
        }
    });
}

/**
 * @description 자사정보 수정
 * @return result code, comment
 */
 function info_modify(obj) 
 {
    $.ajax({

        url: '/base/info/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                toast('수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '400') // fail
            {
                toast('자사정보 없음. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            } // end else if

        }
    });
}

/**
 * @description 파일 확장자, 용량 체크
 */
function file_check(){
    let ext = $("#img").val().split(".").pop().toLowerCase();
    let maxSize = 2 * 1024 * 1024; // 2MB

    var fileSize = $("#img")[0].files[0].size;
    if(fileSize > maxSize)
    {
        toast('이미지 파일 용량 제한은 5MB 입니다.', true, 'danger');
        $("#img").val("");
        return false;
    }

    if($.inArray(ext, ["jpg", "jpeg", "png"]) == -1) 
    {
        toast('첨부파일은 이미지만 등록 가능합니다.', true, 'danger');
        $("#img").val("");
        return false;
    }

    return true;
}