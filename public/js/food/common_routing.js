/*================================================================================
 * @description 라우팅 공통JS
 * @author 김민주, @version 1.0, @last date 2022/07/13
 ================================================================================*/

/**
 * @description 공정 검색시 select2 라이브러리 사용
 */
function dynamic_list(count)
{
    $("#proc_list_"+count).select2({

        // 검색 통신
        ajax : {
            url : '/base/routing/proc_list',
            type: 'POST',
            dataType : 'json',
            delay: 100,

            // 검색어를 AJAX 파라미터로 재 전달
            data : function (params) {
                return {
                    content : params.term 
                };
            },

            // 검색 결과를 SELECT BOX로 전송
            // option value = id, option text = text 칼럼 별칭으로 가공해서 전송必
            processResults: function (data) {
                return {
                    results: $.map(data.result.list, function(item) {
                        return { 
                            id: item.id,
                            text: item.text
                        };
                    })
                };
            },
            cache: true
        },
        
        // 한글 멘트 추가
        language: 
        {
            // 검색 결과 대기중 TEXT
            searching : function() {
                return "검색 정보 확인 중입니다.";
            },

            // 검색된 결과 값이 없을 때 TEXT
            noResults:function() {
                return "결과값이 없습니다.";
            }
        },

        // SELECT BOX 기본 힌트용 멘트
        placeholder: "공정_선택"
        
    });

}

/**
 * @description 공정 변경 이벤트
 */
function change_item(count)
{
    $.ajax({
        url: '/base/routing/proc_detail',
        type: 'POST',
        data: {
            'ikey': $("#proc_list_"+count+" option:selected").val()
        },
        dataType: "json",
        success: function (data) {

            // detail
            $("#pp_uc_"+count).val(data.result.detail.pp_uc);
            $("#pp_cd_"+count).text(data.result.detail.pp_cd);
            $("#pp_gb_"+count).text(data.result.detail.code_nm);
            $("#pp_hisyn_"+count).text(data.result.detail.pp_hisnm);

        }, // success end
        error: function(request, status, error) {
            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }, // err end
    }); // ajax end
}
