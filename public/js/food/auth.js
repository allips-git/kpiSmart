/*==============================================================================================
 * @description 부서관리JS
 * @author 김원명, @version 1.0
 * @author 김민주, @version 2.0, @last date 2022/04/28 - 라인 정리 및 comfirm, 관리자권한 삭제
 ==============================================================================================*/

let p_dp_uc = '';
$(function() {

    get_set('in', 'lod');
    p_dp_uc = $('#dp_uc').val();

    /** 수정 모드 유지 시 실행 => 부서별 권한 체크 */
    if (p_dp_uc != "not")
    {
        get_data(p_dp_uc, $('#p_sysyn').val(), $('#dpt_new').val(), $('#memo_new').val());
        $('#list_'+p_dp_uc+'').trigger('click');
    }

    /** 엔터키 방지 */
    $('#dpt').keydown(function() {
        if (event.keyCode === 13) 
        {
            event.preventDefault();
        }
    });

    /** 초기화 버튼 */
    $('#reset').off().click(function() {
        var con = confirm('초기화 하시겠습니까?');
        if(con)
        {
            get_set('in');
        }
    });

    /* 리스트 => 사용여부 on / off */
    $('.switch').off().click(function() {
        stat_change($(this).children('input').attr('id'), $(this).children('input').attr('data-use'));
    });

    /** 등록, 수정, 삭제 버튼 */
    $('#enroll, #mod, #del').off().click(function() {
        var id = $(this).attr('id');
        if ($('#dpt').val() == '') 
        {
            $('.danger').remove();
            toast('부서명을 입력해주세요.', true, 'danger');
            return false;
        }
        else
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
                $('#dpt_new').val($('#dpt').val());
                $('#memo_new').val($('#memo').val());
                $('#op_new').val($('#op').val());
                $('#sc_new').val($('#sc').val());
                if (id == "del")
                {
                    get_set('de');
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
			$('td input:checkbox').each(function() 
            {
                if ($(this).attr('name') != 'useyn')
                {
                    $(this).prop("checked", true);
                }
			});
		}
        else
        {
			$('td input:checkbox').each(function()
            {
                if ($(this).attr('name') != 'useyn')
                {
                    $(this).prop("checked", false);
                }
			});
		}
	});
});

/**
 * @description 부서별 권한 체크
 * @param {부서 고유 코드} dp_uc 
 * @param {삭제 가능 여부} sysyn 
 * @param {부서명} data_name 
 * @param {메모} data_memo 
 */
function get_data(dp_uc, sysyn, data_name, data_memo)
{
    get_set('up');
    $('#dp_uc').val(dp_uc);
    $('#dpt').val(data_name);
    $('#memo').val(data_memo);

    /** 삭제 버튼 활성화 여부 체크 */
    if (sysyn == "N")
    {
        console.log(sysyn);
        $('#del, #d_del').show();
    }
    else
    {
        console.log(sysyn);
        $('#del, #d_del').hide();
    }

    var l = 'Y';
    var i = 'Y';
    var m = 'Y';
    var d = 'Y';
    var a = 'Y';

    $.ajax({ 
        url: '/base/auth/get_auth',
        type: 'GET',
        data: {
            dp_uc:dp_uc
        },
        dataType: "json",
        success: function(data) {
            $.each(data.auth, function(index, item)
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

/**
 * @description 가용여부 on / off update
 * @param {부서 고유 코드} dp_uc 
 * @param {가용여부 Y/N} useyn 
 */
 function stat_change(dp_uc, useyn) {
    $.ajax({
        url: '/base/auth/stat_change',
        type: 'GET',
        data: {
            dp_uc : dp_uc,
            useyn : useyn,
        },
        dataType: "json",
        success: function(data) {

            switch (data.result_code)
            {
                case 100:
                    $('#'+dp_uc+'').prop('checked', true);
                    toast('최소 1개 이상의 부서 활성화가 필요합니다.', true, 'danger');
                break;
                case 110:
                    toast('가용여부 상태 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
                break;
                case 120:
                    toast('사용 중인 부서입니다.', true, 'danger');
                break;
                case 200:
                    toast('가용여부 상태가 변경되었습니다.', false, 'info');
                    if (useyn == "Y")
                    {
                        $('#'+dp_uc+'').prop('checked', false);
                        $('#'+dp_uc+'').attr('data-use', 'N');
                    }
                    else
                    {
                        $('#'+dp_uc+'').prop('checked', true);
                        $('#'+dp_uc+'').attr('data-use', 'Y');
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
 * @description 상황별 셋팅
 * @param {상황 구분 함수} kind 
 * @param {첫 화면 구분} t 
 */
function get_set(kind, t="")
{
    console.log(kind);
    switch (kind)
    {
        case 'in':
            $.each($('input:checkbox'), function()
            {
                if ($(this).attr('data-auth') == "Y")
                {
                    $(this).prop('checked', true);
                    $("input:checkbox[id*=admin]").prop("checked", false);
                }
            });

            if (t != "lod")
            {
                $('#dp_uc').val('not');
                $('#enroll, #d_enroll').show();
                $('#dpt, #memo').val('');
                $('#p').val('in');
                $('#mod, #d_mod, #del, #d_del').hide();
            }
            $('tr').removeClass('active');
        break;
        case 'up':
            $.each($('input:checkbox'), function()
            {
                if ($(this).attr('data-auth') == "Y")
                {
                    $(this).prop('checked', false);
                }
            });
            $('#p').val('up');
            $('#enroll, #d_enroll').hide();
            $('#mod, #d_mod').show();
        break;
        case 'de':
            $('#p').val('de');
            $('#enroll, #d_enroll').hide();
        break;
    }
}