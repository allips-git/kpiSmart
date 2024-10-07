/*================================================================================
 * @description 공장, 센터PC, 센터APP 마이페이지 비밀번호 변경 팝업창 관리 JS(통합)
 * @author 김민주, @version 1.0, @last date 2021/12/08
 ================================================================================*/

 $(function () {

    // validation password
    $("#pass, #new_pass, #re_pass").on("propertychange change keyup paste input", function(e) {

        var current = $("#current_pass").val().toLowerCase();
        var pass = CryptoJS.SHA256($("#pass").val());
        
        var new_pass = $("#new_pass").val();
        var re_pass = $("#re_pass").val();

        var result = false;
        var result2 = false;

        // 특수문자, 영문, 숫자 검증 비밀번호 정규식(6자~15자 제한)
        var regexp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^~*+=-])(?=.*[0-9]).{6,15}$/;  

        // 기존 비밀번호와 현재 입력한 비밀번호 일치 여부 확인
        if((current != pass)) {
            $("#txt_pass1").text("비밀번호가 맞지 않습니다. 다시 입력해주세요.");
        } else {
            $("#txt_pass1").text("");
            result = true;
        }

        // 신규 입력 비밀번호와 재입력 비밀번호 일치 확인 및 6자리 이상(특수문자,영문,숫자) 조합 검증
        if(new_pass.length > 0 && re_pass.length > 0) {

            if(new_pass != re_pass){
                $("#txt_pass2").text("비밀번호가 맞지 않습니다. 다시 입력해주세요.");
            } else if (new_pass.length < 6 || new_pass.length > 15) {
                $("#txt_pass2").text("비밀번호는 6자 이상 15자 이하로 설정 가능합니다.");
            } else if (!(regexp.test(new_pass))) {
                $("#txt_pass2").text("최소 1자리 이상 특수문자, 영문, 숫자가 포함되어야 합니다.");
            } else {

                $("#txt_pass2").text("");
                result2 = true;

            }

        }

        // 결과값에 따라 확인 버튼 활성화/비활성화
        if((result == true) && (result2 == true)) {
            $("#btn_save")
                .attr('disabled', false)
                .removeClass('gray')
                .addClass('blue');
        } else {
            $("#btn_save")
                .attr('disabled', true)
                .removeClass('blue')
                .addClass('gray');
        }

    });

    // 현재 페이지 URL 확인
    var url = window.location.pathname;

    // 공장, 센터 PC용 패스워드 변경 팝업일 경우만 호출
    $("#btn_save").off().click(function () {
        if(url == "/user/mypage") {
            toast('저장하기 버튼을 누르면 정보가 최종적으로 변경됩니다.', false, 'info');
            $("#key").val(CryptoJS.SHA256($("#new_pass").val()));
            $("#btn_save").addClass("b-close");
        } 
    });

});