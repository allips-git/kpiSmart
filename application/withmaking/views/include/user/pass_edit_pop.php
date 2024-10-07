<div class="pw_change">
    <div class="title">
        <span id="title"></span> 비밀번호 변경
        <span class="b-close">&times;</span>
    </div>
    <form>
        <div class="content Clearfix">
            <p>안전한 비밀번호로 내정보를 보호하세요.</p>
            <dl>
                <dt class="important">현재 비밀번호</dt>
                <dd>
                    <input type="hidden" id="current_pass" value="<?= $user->pass ?>">
                    <input type="password" id="pass" autocomplete="off" placeholder="현재 비밀번호를 입력해주세요.">
                    <span id="txt_pass1" class="noti"></span>
                </dd>
            </dl>
            <dl>
                <dt class="important">새 비밀번호</dt>
                <dd>
                    <input type="password" id="new_pass" autocomplete="off" placeholder="신규 비밀번호를 입력해주세요.">
                </dd>
            </dl>
            <dl>
                <dt class="important">새 비밀번호 확인</dt>
                <dd>
                    <input type="password" id="re_pass" autocomplete="off" placeholder="신규 비밀번호를 입력해주세요."><br/>
                    <span id="txt_pass2" class="noti"></span>
                </dd>
            </dl>
            <span class="phar"><strong>*</strong> 은 필수입력 항목입니다.</span>
            <div class="btn_wrap">
                <button type="button" class="b-close"><i class="fa fa-times-circle"></i> 취소</button>
                <button type="button" id="btn_save" class="gray" disabled="true"><i class="fa fa-check-circle"></i> 확인</button>
            </div>
        </div>
    </form>
</div>
<!-- 암호화JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></script>
<script src="/public/js/dev/pass_pop.js?<?=time()?>"></script>
<script>

    // 입력값 유효성 검사
    $(function () {

        // 한글 입력 제한
        $("#new_pass, #re_pass").keyup(function(event){ 
            var value = $(this).val();
            $(this).val(value.replace(/[ㄱ-힣]/g,''));
        });

    });

    $('.pw_btn').click (function(){

        // reset input value 
        var field = { "pass":"", "new_pass":"", "re_pass":"" };
        process(field, "val");
        $("#btn_save")
            .attr('disabled', true)
            .removeClass('blue')
            .addClass('gray');

        // call pop 
        $('.pw_change').bPopup({
          modalClose: false
          , opacity: 0.8
          , positionStyle: 'absolute' 
          , speed: 300
          , transition: 'fadeIn'
          , transitionClose: 'fadeOut'
          , zIndex : 99997
            //, modalColor:'transparent' 
        }); 

    });  
</script>