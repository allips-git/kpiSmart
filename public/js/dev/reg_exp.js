/*================================================================================
 * @description 정규식 관리 JS
 * @author 김민주, @version 1.0, @last date 2022/08/17
 ================================================================================*/

 $(function () {
    
    // input type 숫자, 하이픈만 입력 허용
    $(".num_type").on("propertychange change keyup paste input", function() {
         this.value = $(this).val().replace(/[^0-9-]/g, '').replace(/(\..*)\./g, '$1');
    });
     
     // autocomplete="off" 속성 제거
     $("input:text[Auto]").attr("autocomplete", "off");

    // input type 숫자만 입력 허용
    $("input:text[numOnly]").on("propertychange change keyup paste input", function() {
         this.value = $(this).val().replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
    });

    // input type 숫자, 콤마만 입력 허용
    $("input:text[numberOnly]").on("propertychange change keyup paste input", function() {
         this.value = addComma($(this).val().replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1'));
    });

    // input type 숫자, 소수점, 콤마만 입력 허용
    $("input:text[numberPoint]").on("propertychange change keyup paste input", function() {
         this.value = addComma($(this).val().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
    });

});

// 함수형으로 호출
function fc_reg_exp()
{
     // input type 숫자, 하이픈만 입력 허용
    $(".num_type").on("propertychange change keyup paste input", function() {
         this.value = $(this).val().replace(/[^0-9-]/g, '').replace(/(\..*)\./g, '$1');
    });
     
     // autocomplete="off" 속성 제거
     $("input:text[Auto]").attr("autocomplete", "off");

    // input type 숫자만 입력 허용
    $("input:text[numOnly]").on("propertychange change keyup paste input", function() {
         this.value = $(this).val().replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
    });

    // input type 숫자, 콤마만 입력 허용
    $("input:text[numberOnly]").on("propertychange change keyup paste input", function() {
         this.value = addComma($(this).val().replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1'));
    });

    // input type 숫자, 소수점, 콤마만 입력 허용
    $("input:text[numberPoint]").on("propertychange change keyup paste input", function() {
         this.value = addComma($(this).val().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
    });
}

// 천단위마다 콤마 생성
function addComma(data) 
{
   return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 콤마 전체 제거 정규식(replaceAll)
function comma_replace(data)
{
    const number = data.replace(/,/g, "");
    return number;
}