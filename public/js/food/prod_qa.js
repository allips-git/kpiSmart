/*================================================================================
 * @description FMS 생산 입고 검사 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/26
 ================================================================================*/

 $(function () {

    // FMS 생산 입고 리스트
    get_qa_list($("#frm_search").serializeObject(), 'Y');

    // 버튼, 엔터 검색 이벤트
    $('#btn_search').off().click(function(){
        get_qa_list($("#frm_search").serializeObject(), 'Y');
    });
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_qa_list($("#frm_search").serializeObject(), 'Y');
        }
    });
    
    // 검색 조건 변경 이벤트
    $("#start_dt, #end_dt, #wh_uc, #page_size").change(function() {
        get_qa_list($("#frm_search").serializeObject(), "Y");
    });

    // 바코드 출력 이벤트
    $('#btn_barcode').off().click(function() {

        var arr = new Array();
        var con = confirm('바코드를 출력 하시겠습니까?');
        if (con) 
        {
            // 체크값 배열 저장
            arr = check_box();

            // 체크가 1개라도 있을경우 출력
            if (Array.isArray(arr) && arr.length > 0)
            {
                barcode_print({'ikey':arr});
            }
            else
            {
                alert('작업 선택 후 바코드 출력 가능합니다.');
            }
        }

    });

});


function work_time(start_dt, end_dt, plan_time)
{
    // 시작시간, 종료시간, 일 작업시간 다 있을경우만 계산
    if (is_empty(start_dt) && is_empty(end_dt) && is_empty(plan_time))
    {
        // 시작일, 종료일 시간(hour) 차이 계산
        var start = dayjs(start_dt, "YYYY-MM-DD HH:mm:ss");
        var end = dayjs(end_dt, "YYYY-MM-DD HH:mm:ss");
        let hour = Math.floor(end.diff(start, "hour", true));

        // 일 작업시간
        let ptime = parseInt(plan_time);

        // 날짜 차이 변수
        let base_dt = day_diff(start_dt.substr(0, 10), end_dt.substr(0, 10));

        // 첫쨋날 기준 퇴근시간(출근시간 9시 + 일 작업시간), second 시간차이, hour 시간차이
        var first_day = dayjs(start.set("hour", parseInt(9+ptime)).set("minute", 0).set("second", 0).format(), "YYYY-MM-DD HH:mm:ss");
        var first_sec = first_day.diff(start, "second");
        var first_hour = first_day.diff(start, "hour");
        if(first_hour > ptime) // 첫날 시간차가 일 작업시간 이상일경우
        {
            first_sec = (3600 * plan_time) * (base_dt-1);
        }

        // 마지막날 기준 출근시간 (9시 정각)
        var last_day = dayjs(end.set("hour", 9).set("minute", 0).set("second", 0).format(), "YYYY-MM-DD HH:mm:ss");
        var last_sec = end.diff(last_day, "second");
        var last_hour = end.diff(last_day, "hour");
        if(last_hour > ptime) // 마지막날 시간차가 일 작업시간 이상일경우
        {
            last_sec = (3600 * plan_time) * (base_dt-1);
        }
        
        // 날짜 차이 계산
        if (base_dt > 0) // 날짜 차이가 하루 이상이면
        {
            if (base_dt == 1) //  날짜 차이가 하루일 경우
            {
                return convert_hms(first_sec+last_sec);
            }
            else // 날짜 차이가 이틀 이상일 경우
            {
                // 시작일시,종료일시 차이 + (1시간 * 일 작업시간) * (날짜 차이-1)
                var base_time = (3600 * plan_time) * (base_dt-1);
                return convert_hms(base_time+first_sec+last_sec);
            }
            
        }
        else // 당일
        { 
            // 총 작업시간이 일 작업 산정시간보다 작을경우만 실제 작업시간 표기 (당일은 퇴근시간 계산없이 시작시간, 종료시간 차이 표기)
            if (hour > ptime)
            {
                if (ptime < 10) 
                {
                    ptime = "0"+ptime;
                }
                return ptime+":00:00";
            }
            else
            {
                return convert_hms(end.diff(start, "second"));
            }
        }

    } 
    else 
    {
        return '';
    }
}

$('.btn_flaw').on('click',function(){

    var updatedValues = [];
    var isExceed = false;
    
    $('.edit-field').each(function() {
        var ikey = $(this).data('ikey');
        var flaw_cnt = $(this).val();
        var lot = $('.hidden-lot[data-ikey="' + ikey + '"]').val();
        var job_no = $('.hidden-job_no[data-ikey="' + ikey + '"]').val();
        var pp_uc = $('.hidden-pp_uc[data-ikey="' + ikey + '"]').val();
        var jobQtyText = $(this).closest('tr').find('td span[dd]').text();
        var jobQty = parseInt(jobQtyText.replace(/[^0-9]/g, ''), 10);
        var work_cnt = $(this).closest('tr').find('.Elli.work_cnt').text();

        console.log(flaw_cnt, jobQty, work_cnt);

        if (flaw_cnt > jobQty) {
            alert(' 항목의 불량 수량이 작업 지시 수량을 초과할 수 없습니다.');
            isExceed = true;
            return false; // each 함수를 종료하고 반복을 멈춥니다.
        }
        else if(work_cnt + flaw_cnt >= jobQty)
        {
            alert('수량이 지시 수량을 초과할 수 없습니다 (작업 + 불량) ');
            isExceed = true;
            return false; // each 함수를 종료하고 반복을 멈춥니다.
        }

        updatedValues.push({ ikey: ikey, flaw_cnt: flaw_cnt, lot: lot, job_no: job_no, pp_uc: pp_uc });
    });

   //console.log(updatedValues)

    if (!isExceed) {

        if(updatedValues.length === 0)
        {
            alert('등록할 불량 수량을 선택하세요.');
        }
        else
        {
            updateWorkCounts(updatedValues);
        }
    }
    
})


function updateWorkCounts(updatedValues) {
    $.ajax({
        url: '/pr/prod_list/set_flaw_result_save', // 컨트롤러의 메서드 URL
        type: 'POST',
        dataType: "json",
        async: false,
        data: {
            updatedValues: JSON.stringify(updatedValues) // JSON 문자열로 변환
        },
        success: function(res) {
            console.log(res);
            alert('등록되었습니다');
            // 성공 처리 로직 (예: 알림 메시지 표시)
        },
        error: function(error) {
            console.error(error);
            // 오류 처리 로직 (예: 오류 메시지 표시)
        }
    });
}


/**
 * @description 생산 입고 검사 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_qa_list(obj, mode='')  // 조회 
{
    const container = $('#pagination');
    $.ajax({
        url: '/pr/prod_list/list',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function(data) {
            console.log(data);

            container.pagination({
                dataSource: data.result.list,
                className: 'paginationjs-theme-blue paginationjs-small',
                pageSize: $("#page_size option:selected").val(),
                autoHidePrevious: true,
                autoHideNext: true,
                pageNumber: $("li.paginationjs-page.J-paginationjs-page").val(),
                callback: function (result, pagination) {
                    var page = pagination.pageNumber;
                    $("#list_cnt").text(data.result.list.length);
                    $("#page").val(page);
                    if (mode == "Y") {
                        $("li.paginationjs-page.J-paginationjs-page").val(1);
                    }

                    var str = '';
                    var dataExist = false;

                    $.each(result, function (i, list) {
                        if (list.state !== "001") {
                            dataExist = true;
                            var time = work_time(list.start_dt, list.end_dt, list.plan_time);
                            str += '<tr>';
                            str += '<td>'+ list.ikey +'</td>';
                            str += '<input type="hidden" class="hidden-lot" data-ikey="' + list.ikey + '" value="' + list.lot + '">';
                            str += '<input type="hidden" class="hidden-job_no" data-ikey="' + list.ikey + '" value="' + list.job_no + '">';
                            str += '<input type="hidden" class="hidden-pp_uc" data-ikey="' + list.ikey + '" value="' + list.pp_uc + '">';
                            str += '<td class="Elli">'+ list.job_dt +'</td>';
                            str += '<td class="T-left Elli">'+ list.item_nm +'</td>';
                            str += '<td class="Elli">'+ list.pp_gb_nm +'</td>';
                            str += '<td class="T-left Elli">'+ list.pp_nm +'</td>';
                            str += '<td class="Elli">'+ list.ul_nm +'</td>';
                            if (list.pp_hisyn == "Y") {
                                str += '<td><span dd style="font-weight: bold;">'+ commas(list.job_qty) +'</span></td>';
                                str += '<td><input type="text" class="edit-field" data-ikey="' + list.ikey + '" value="' + commas(list.flaw_cnt) + '"></td>';
                            } else {
                                str += '<td><span style="color: gray;">사용안함</span></td>';
                                str += '<td><span style="color: gray;">사용안함</span></td>';
                            }
                            str += '<td>'+ list.plan_time +'</td>';
                            str += '<td>'+ list.plan_num +'</td>';

                         
                            
                            str += '<td class="Elli">'+ is_empty(list.start_dt) +'</td>';
                            str += '<td class="Elli">'+ is_empty(list.end_dt) +'</td>';
                            str += '<td class="Elli">'+ time +'</td>';
                            str += '</tr>';
                        }
                    });

                    if (!dataExist) {
                        str += "<tr><td colspan='14'>조회 가능한 데이터가 없습니다.</td></tr>";
                    }

                    $("#data-container").html(str);

                    $(".ac tr").click(function(){
                        $(".ac tr").removeClass("active");
                        $(this).addClass("active");
                    });

                    $(".ac td").click(function(){
                        $(".ac td").removeClass("active");
                        $(this).addClass("active");
                    });
                }
            });
        },
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error);
            $.toast('실패', { sticky: true, type: 'danger' });
        }
    });

} // function end

/**
 * @description 불량 팝업 기본값 세팅
 */
function pop_open(arg)
{
    arg = JSON.parse(decodeURIComponent(arg));
    $(".key_parent").val(arg.ikey);
}

/**
 * @description 체크박스 체크 이벤트
 */
function check_box() 
{
    // 체크값 배열 저장
    var arr = new Array();
    $("input[name=ikey]:checked").each(function() {
        if($(this).val() && $(this).val() != '') 
        {
            arr.push($(this).attr('id'));
        }
    });
    return arr;
}