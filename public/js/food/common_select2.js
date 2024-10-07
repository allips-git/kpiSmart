/*================================================================================
 * @description 제조 오더 공통JS
 * @author 김민주, @version 1.0, @last date 2022/08/05
 ================================================================================*/

/**
 * @description 검색시 select2 라이브러리 사용
 * @param id: jquery 선택자, url: ajax url, sub_params: 추가 파라미터(array)
 * @param max_size: minimumInputLength value, text1: 힌트문구1, text2: 힌트문구2
 * @return select2 result value, text
 */
function call_select2(id, url, max_size, text1, text2)
{
    $(id).select2({

        // 검색 통신
        ajax : {
            url : url,
            type: 'POST',
            dataType : 'json',
            delay: 100,

            // 검색어를 AJAX 파라미터로 재 전달
            data : function (params) {
                return {
                    content : params.term,
                    pc_uc : $("#pc_uc").val() // 라우팅 코드(공정 검색시에만 사용됨)
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
            // 검색 힌트
            inputTooShort: function () {
                return text1+" 1글자 이상 입력해 주세요.";
            },  
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
        placeholder: text2,
        minimumInputLength: max_size
        
    });

}