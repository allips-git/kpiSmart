/*==============================================================================================
 * @description 사용자관리JS
 * @author 김원명, @version 1.0
 * @author 김민주, @version 2.0, @last date 2022/04/28 - 라인 정리 및 comfirm, 관리자권한 삭제
 ==============================================================================================*/

let p_ul_uc = '';
let c_ul_uc = '';
$(function()
{
    p_ul_uc = $('#p_ul_uc').val();

    /** 수정 모드 유지 시 실행 => 부서별 권한 체크 */
    // if (p_ul_uc != "n")
    // {
    //     get_user(p_ul_uc, $('#p_dp_uc').val(), $('#sysyn').val());
    //     $('#list_'+p_ul_uc+'').trigger('click');
    // }

    // 부서 및 권한선택 선택 시 go
    $('#dpt').off().change(function() { 
        var dp_uc = $(this).val();
        $('#p_dp_uc').val(dp_uc);
        if (dp_uc != '')
        {
            get_dpt(dp_uc);
        }
        else
        {
            chk_reset();
        }
    });

    /* 리스트 => 사용여부 on / off */
    $('.switch').off().click(function() {
         stat_change($(this).children('input').attr('id'), $(this).children('input').attr('data-use'));
    });

    $('#reset').off().click(function() {
        var con = confirm('초기화 하시겠습니까?');
        if (con)
        {
            $('#mod, #d_mod, #del, #d_del').hide();
            $('#enroll, #d_enroll').show();

            $('#p').val('in');
            $('#dpt, #ul_job, #bank_cd').val('').attr('selected', 'selected');
            $('#admin_gb').val('N').attr('selected', 'selected');
            $('#ul_gb').val('001').attr('selected', 'selected');
            $('#ul_gb').removeClass('gray');
            $('#ul_gb').prop('disabled', false);
            $('#id, #ul_nm, #pwd, #pwdck, #tel, #email, #post_code, #addr, #addr_detail, #memo, #in_dt, #out_dt, #bank_no').val('');
            $('#useyn').val('Y').attr('selected', 'selected');
            
            chk_reset();
            $('#id').removeClass('disable');
            $('#id').removeAttr('readonly');
        }
    });

    $('#enroll, #mod, #del').off().click(function() {
        var id = $(this).attr('id');
        if (check_val(id))
        {
            var con;
            switch (id)
            {
                case 'enroll':
                    con = confirm('등록 하시겠습니까?');
                    break;
                case 'mod':
                    con = confirm('수정 하시겠습니까?');
                    break;
                case 'del':
                    con = confirm('삭제 하시겠습니까?');
                break;
            }
            if (con)
            {
                get_form();
                if (id == "del")
                {
                    $('#p').val('de');
                }
                $('#loading').show();
                $('#frm2').submit();
            }
        }
    });    

    /** 전체허용 클릭 시  */
	$('#all_chk').off().click(function() {
		if ($('#all_chk').prop("checked")) 
        {
			$('td input:checkbox').each(function() {
                if ($(this).attr('name') != 'useyn')
                {
                    $(this).prop("checked", true);
                }
			});
		}
        else
        {
			$('td input:checkbox').each(function() {
                if ($(this).attr('name') != 'useyn')
                {
                    $(this).prop("checked", false);
                }
			});
		}
	});
});

/**
 * @description 폼 hidden에 값 저장
 */
function get_form()
{
    $('#p_op').val($('#op option:selected').val());
    $('#p_sc').val($('#sc').val());
    $('#p_dp_uc').val($('#dpt option:selected').val());
    $('#p_ul_job').val($('#ul_job option:selected').val());
    $('#p_admin_gb').val($('#admin_gb option:selected').val());
    $('#p_ul_gb').val($('#ul_gb option:selected').val());
    $('#p_id').val($('#id').val());
    $('#p_ul_nm').val($('#ul_nm').val());
    $('#p_pass').val($('#pwd').val());
    $('#p_tel').val($('#tel').val());
    $('#p_email').val($('#email').val());
    $('#p_biz_code').val($('#post_code').val());
    $('#p_address').val($('#addr').val());
    $('#p_addr_detail').val($('#addr_detail').val());
    $('#p_memo').val($('#memo').val());
    $('#p_in_dt').val($('#in_dt').val());
    $('#p_out_dt').val($('#out_dt').val());
    $('#p_bank_cd').val($('#bank_cd').val());
    $('#p_bank_no').val($('#bank_no').val());
    $('#p_useyn').val($('#useyn').val());
    $("input:checkbox[id=look]").is(":checked") == true ? $('#p_look').val($('#look').val()) : '';
    $("input:checkbox[id=input]").is(":checked") == true ? $('#p_input').val($('#input').val()) : '';
    $("input:checkbox[id=modify]").is(":checked") == true ? $('#p_modify').val($('#modify').val()) : '';
    $("input:checkbox[id=delete]").is(":checked") == true ? $('#p_delete').val($('#delete').val()) : '';
}

/**
 * 부서 및 권한선택 선택 시 값 checkbox에 check
 */
function get_dpt(dp_uc)
{
    chk_reset();

    var l = 'Y';
    var i = 'Y';
    var m = 'Y';
    var d = 'Y';
    var a = 'Y';

    $.ajax({ 
        url: '/base/user/get_info',
        type: 'GET',
        data: {
            dp_uc : dp_uc,
            kind : 'dpt'
        },
        dataType: "json",
        success: function(result) {

            $.each (result.info, function(index, item)
            {
                item.read == "Y" ? $("input:checkbox[id='look"+item.pgm_id+"']").prop("checked", true) : $("input:checkbox[id='look"+item.pgm_id+"']").prop("checked", false);
                item.write == "Y" ? $("input:checkbox[id='input"+item.pgm_id+"']").prop("checked", true) : $("input:checkbox[id='input"+item.pgm_id+"']").prop("checked", false);
                item.modify == "Y" ? $("input:checkbox[id='modify"+item.pgm_id+"']").prop("checked", true) : $("input:checkbox[id='modify"+item.pgm_id+"']").prop("checked", false);
                item.delete == "Y" ? $("input:checkbox[id='delete"+item.pgm_id+"']").prop("checked", true) : $("input:checkbox[id='delete"+item.pgm_id+"']").prop("checked", false);
                item.admin == "Y" ? $("input:checkbox[id='admin"+item.pgm_id+"']").prop("checked", true) : $("input:checkbox[id='admin"+item.pgm_id+"']").prop("checked", false);

                if (item.read == 'N')
                {
                    l = 'N';
                };
                if (item.write == 'N')
                {
                    i = 'N';
                };
                if (item.modify == 'N')
                {
                    m = 'N';
                };
                if (item.delete == 'N')
                {
                    d = 'N';
                };
                if (item.admin == 'N')
                {
                    a = 'N';
                };
            });

            if (l == 'Y')
            {
                $("input:checkbox[id='look']").prop("checked", true);
            }
            if (i == 'Y')
            {
                $("input:checkbox[id='input']").prop("checked", true);
            }
            if (m == 'Y')
            {
                $("input:checkbox[id='modify']").prop("checked", true);
            }
            if (d == 'Y')
            {
                $("input:checkbox[id='delete']").prop("checked", true);
            }
            if (a == 'Y')
            {
                $("input:checkbox[id='admin']").prop("checked", true);
            }
        },
        error: function(request,status,error) {
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

function get_user(ul_uc, dp_uc, sysyn)
{
    chk_reset();

    $('#mod, #d_mod').show();
    if (sysyn == "Y")
    {
        $('#del, #d_del').hide();
    }
    else
    {
        $('#del, #d_del').show();
    }
    $('#enroll, #d_enroll').hide();
    $('#p').val('up');
    $('#id').addClass('gray');
    $('#id').attr('readonly', 'readonly');

    var l = 'Y';
    var i = 'Y';
    var m = 'Y';
    var d = 'Y';
    var a = 'Y';

    $.ajax({ 
        url: '/base/user/get_info',
        type: 'GET',
        data: {
            ul_uc   :   ul_uc,
            dp_uc   :   dp_uc,
            kind    :   'user'
        },
        dataType: "json",
        success: function(result) 
        {
            c_ul_uc = ul_uc;
            $('#dpt').val(result.info['dp_uc']).prop('selected',true);
            $('#p_dp_uc').val(result.info['dp_uc']);
            $('#p_ul_uc').val(result.info['ul_uc']);
            $('#ul_job').val(result.info['ul_job']).prop('selected',true);
            if (result.info['ul_gb_yn'] == 'Y')
            {
                $('#ul_gb').addClass('gray');
                $('#ul_gb').prop('disabled', true);
            }
            else
            {
                $('#ul_gb').removeClass('gray');
                $('#ul_gb').prop('disabled', false);
            }
            $('#ul_gb').val(result.info['ul_gb']).prop('selected',true);
            $('#id').val(result.info['id']);
            $('#ul_nm').val(result.info['ul_nm']);
            $('#pwd, #pwdck').val('');
            $('#tel').val(result.info['tel']);
            $('#email').val(result.info['email']);
            $('#post_code').val(result.info['biz_code']);
            $('#addr').val(result.info['address']);
            $('#addr_detail').val(result.info['addr_detail']);
            $('#memo').val(result.info['memo']);
            $('#in_dt').val(result.info['in_dt']);
            $('#out_dt').val(result.info['out_dt']);
            $('#bank_cd').val(result.info['bank_cd']).prop('selected',true);
            $('#bank_no').val(result.info['bank_no']);
            $('#useyn').val(result.info['useyn']).prop('selected',true);
            $('#admin_gb').val(result.info['admin_gb']).prop('selected', true);

            $.each (result.auth, function(index, item)
            {
                //console.log(item);
                item.read == "Y" ? $("input:checkbox[id='look"+item.pgm_id+"']").prop("checked", true) : $("input:checkbox[id='look"+item.pgm_id+"']").prop("checked", false);
                item.write == "Y" ? $("input:checkbox[id='input"+item.pgm_id+"']").prop("checked", true) : $("input:checkbox[id='input"+item.pgm_id+"']").prop("checked", false);
                item.modify == "Y" ? $("input:checkbox[id='modify"+item.pgm_id+"']").prop("checked", true) : $("input:checkbox[id='modify"+item.pgm_id+"']").prop("checked", false);
                item.delete == "Y" ? $("input:checkbox[id='delete"+item.pgm_id+"']").prop("checked", true) : $("input:checkbox[id='delete"+item.pgm_id+"']").prop("checked", false);
                item.admin == "Y" ? $("input:checkbox[id='admin"+item.pgm_id+"']").prop("checked", true) : $("input:checkbox[id='admin"+item.pgm_id+"']").prop("checked", false);

                if (item.read == 'N')
                {
                    l = 'N';
                };
                if (item.write == 'N')
                {
                    i = 'N';
                };
                if (item.modify == 'N')
                {
                    m = 'N';
                };
                if (item.delete == 'N')
                {
                    d = 'N';
                };
                if (item.admin == 'N')
                {
                    a = 'N';
                };
            });

            if (l == 'Y')
            {
                $("input:checkbox[id='look']").prop("checked", true);
            }
            if (i == 'Y')
            {
                $("input:checkbox[id='input']").prop("checked", true);
            }
            if (m == 'Y')
            {
                $("input:checkbox[id='modify']").prop("checked", true);
            }
            if (d == 'Y')
            {
                $("input:checkbox[id='delete']").prop("checked", true);
            }
            if (a == 'Y')
            {
                $("input:checkbox[id='admin']").prop("checked", true);
            }
        },
        error: function(request,status,error) {
            console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            $.toast('실패', {sticky: true, type: 'danger'});
        },
    });
}

function stat_change(ul_uc, useyn)
{
    $.ajax({
        url: '/base/user/stat_change',
        type: 'GET',
        data: {
            ul_uc : ul_uc,
            useyn : useyn,
        },
        dataType: "json",
        success: function(data) {

            switch(data.result_code)
            {
                /*case 100:
                    $('#'+ul_uc+'').prop('checked', true);
                    toast('최소 1개 이상은 사용여부가 활성화 되어 있어야합니다.', true, 'danger');
                break;*/
                case 110:
                    toast('가용여부 상태 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
                    break;
                case 120:
                    toast('삭제 불가능한 사용자는 가용여부를 변경할 수 없습니다.', true, 'danger');
                    break;
                case 200:
                    toast('가용여부 상태가 변경되었습니다.', false, 'info');
                    if (useyn == "Y")
                    {
                        $('#'+ul_uc+'').prop('checked', false);
                        $('#'+ul_uc+'').attr('data-use', 'N');
                        if (c_ul_uc == ul_uc)
                        {
                            $('#useyn').val('N').prop('selected', true);
                        }
                    }
                    else
                    {
                        $('#'+ul_uc+'').prop('checked', true);
                        $('#'+ul_uc+'').attr('data-use', 'Y');
                        if (c_ul_uc == ul_uc)
                        {
                            $('#useyn').val('Y').prop('selected', true);
                        }
                    }
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
 * @description 필수 입력 값 체크
 */
 function check_val(id)
 {
    if ($('#dpt option:selected').val() == "")
    {
        toast('부서를 선택해주세요.', true, 'danger');
        $('#dpt').focus();
        return false;        
    }
    if ($('#ul_job').val() == "")
    {
        toast('직급을 선택해주세요.', true, 'danger');
        $('#ul_job').focus();
        return false;        
    }
    if ($('#ul_gb').val() == "")
    {
        toast('사원유형을 선택해주세요.', true, 'danger');
        $('#ul_gb').focus();
        return false;        
    }
    if ($('#ul_nm').val() == "")
    {
        toast('사원명을 입력해주세요.', true, 'danger');
        $('#ul_nm').focus();
        return false;
    }
    if ($('#id').val() == "")
    {
        toast('로그인(ID)를 입력해주세요.', true, 'danger');
        $('#id').focus();        
        return false;
    }

    // 특수문자, 영문, 숫자 검증 비밀번호 정규식(6자~15자 제한)
    var regexp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^~*+=-])(?=.*[0-9]).{6,15}$/;  
    if (id == "mod" || id == "del")
    {
        if ($('#pwd').val() != "") 
        {
            if ($('#pwd').val() != $('#pwdck').val())
            {
                toast('비밀번호가 일치하지 않습니다.', true, 'danger');
                $('#pwdck').focus();
                return false;
            }
            if ($('#pwd').val().length < 6 || $('#pwd').val().length > 15)
            {
                toast('비밀번호는 6자 이상 15자 이하로 설정 가능합니다.', true, 'danger');
                $('#pwd').focus();
                return false;
            }
            if (!(regexp.test($('#pwd').val())))
            {
                toast('최소 1자리 이상 특수문자, 영문, 숫자가 포함되어야 합니다.', true, 'danger');
                $('#pwd').focus();
                return false;
            }
        }
    }
    else
    {
        if ($('#pwd').val() == "")
        {
            toast('비밀번호를 입력해주세요.', true, 'danger');
            $('#pwd').focus();        
            return false;
        }
        if ($('#pwd').val() != $('#pwdck').val())
        {
            toast('비밀번호가 일치하지 않습니다.', true, 'danger');
            $('#pwdck').focus();
            return false;
        }
        if ($('#pwd').val().length < 6 || $('#pwd').val().length > 15)
        {
            toast('비밀번호는 6자 이상 15자 이하로 설정 가능합니다.', true, 'danger');
            $('#pwd').focus();
            return false;
        }
        if (!(regexp.test($('#pwd').val())))
        {
            toast('최소 1자리 이상 특수문자, 영문, 숫자가 포함되어야 합니다.', true, 'danger');
            $('#pwd').focus();
            return false;
        }
    }
    return true;
}

function chk_reset() // 체크 박스 리셋 
{ 
    $('input[type=checkbox]').each(function(){
        if ($(this).attr('data-list') != 'Y')
        {
            $(this).prop('checked', false);
        }
    });
}