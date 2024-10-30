/*================================================================================
 * @description FMS 생산 작업 관리JS
 * @author 김민주, @version 1.0, @last date 2022/08/12
 ================================================================================*/

 $(function () {

    // FMS 생산 작업 조회
    get_his_list($("#frm_search").serializeObject(), 'Y');

    // 버튼, 엔터 검색 이벤트
    $('#btn_search').off().click(function(){
        get_his_list($("#frm_search").serializeObject(), 'Y');
    });
    $("#content").off().keyup(function (e) {
        if (e.keyCode == 13)
        {
            get_his_list($("#frm_search").serializeObject(), 'Y');
        }
    });
    
    // 검색 조건 변경 이벤트
    $("#start_dt, #end_dt, #page_size").change(function() {
        get_his_list($("#frm_search").serializeObject(), "Y");
    });

});

/**
 * @description 생산 작업 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html
*/
function get_his_list(obj, mode='') {
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
                            str += '<td class="Elli">'+ list.pc_nm +'</td>';
                            str += '<td class="T-left Elli">'+ list.pp_nm +'</td>';
                            str += '<td class="Elli">'+ list.ul_nm +'</td>';
                            if (list.pp_hisyn == "Y") {
                                str += '<td><span dd style="font-weight: bold;">'+ commas(list.job_qty) +'</span></td>';
                                str += '<td><input type="text" class="edit-field" data-ikey="' + list.ikey + '" value="' + commas(list.work_cnt) + '"></td>';
                            } else {
                                str += '<td><span style="color: gray;">사용안함</span></td>';
                                str += '<td><span style="color: gray;">사용안함</span></td>';
                            }
                            str += '<td>'+ list.plan_time +'</td>';
                            str += '<td>'+ list.plan_num +'</td>';

                            if (parseInt(list.work_cnt) >= parseInt(list.job_qty)) {
                                list.job_st = "F";
                            }
                            
                            if (list.state == "001") {
                                str += '<td><span style="font-weight: bold;">접수</span></td>';
                            } else {
                                if (list.job_st == "N") {
                                    str += '<td><span style="color: blue; font-weight: bold;">대기</span></td>';
                                } else if (list.job_st == "P") {
                                    str += '<td><span style="color: #FF5E00; font-weight: bold;">진행</span></td>';
                                } else if (list.job_st == "F") {
                                    str += '<td><span style="color: gray;">완료</span></td>';
                                } else if (list.job_st == "S") {
                                    str += '<td><span style="font-weight: bold;">비가동</span></td>';
                                }
                            }
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
}

$('#UpdateCnt').on('click',function(){
    var updatedValues = [];
    var isExceed = false; // 초과 여부를 체크할 변수 추가

    $('.edit-field').each(function() {
        var ikey = $(this).data('ikey');
        var workCnt = parseInt($(this).val().replace(/,/g, ''), 10); // 쉼표 제거 후 정수 변환
        var lot = $('.hidden-lot[data-ikey="' + ikey + '"]').val();
        var job_no = $('.hidden-job_no[data-ikey="' + ikey + '"]').val();
        var pp_uc = $('.hidden-pp_uc[data-ikey="' + ikey + '"]').val();
        var state = '003';
        var jobQtyText = $(this).closest('tr').find('td span[dd]').text();
        var jobQty = parseInt(jobQtyText.replace(/[^0-9]/g, ''), 10); // 정수 변환

        // 작업 수량 검증
        if (workCnt > jobQty) {
            alert('항목의 작업 수량이 작업 지시 수량을 초과할 수 없습니다.');
            isExceed = true;
            return false; // each 반복 중단
        }

        // 업데이트 배열에 추가
        updatedValues.push({ ikey: ikey, workCnt: workCnt, lot: lot, job_no: job_no, pp_uc: pp_uc, state : state });
    });

    // 수량 초과가 없을 경우에만 AJAX 요청을 수행
    if (!isExceed) {
        if(updatedValues.length === 0)
        {
            alert('완료할 실적이 없습니다.')
        }
        else
        {
            updateWorkCounts(updatedValues);
        }
    }
});


function updateWorkCounts(updatedValues) {
    $.ajax({
        url: '/pr/prod_list/set_work_result_save', // 컨트롤러의 메서드 URL
        type: 'POST',
        dataType: "json",
        async: false,
        data: {
            updatedValues: JSON.stringify(updatedValues) // JSON 문자열로 변환
        },
        success: function(res) {
            console.log(res);
            alert(res['ResultMessage'])
            // 성공 처리 로직 (예: 알림 메시지 표시)
        },
        error: function(error) {
            console.error(error);
            // 오류 처리 로직 (예: 오류 메시지 표시)
        }
    });
}

/**
 * @description 총 작업 시간 계산 - dayjs lib 사용
 * @param 시작일시, 종료일시, 일 작업시간[기준]
 * @return work time [json] 
*/
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

/**
 * @description 초 단위를 시분초 단위로 변환
 * @param 기준second
 * @return hour, minute, second
*/
function convert_hms(value) 
{
    const sec = parseInt(value, 10);                        // convert value to number if it's string
    let hours   = Math.floor(sec / 3600);                   // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60);  // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60);    // get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;                   // Return is HH : MM : SS
}

/**
 * @description 두 날짜 차이 계산 함수
 * @param 시작일자, 종료일자
 * @return 날짜 차이값
*/
function day_diff(start_dt, end_dt)
{
    const date1 = new Date(start_dt); // 시작일
    const date2 = new Date(end_dt);   // 종료일
    const elapsed_mSec = date2.getTime() - date1.getTime(); // 172800000
    const elapsed_day = elapsed_mSec / 1000 / 60 / 60 / 24; // 2
    return elapsed_day;
}
