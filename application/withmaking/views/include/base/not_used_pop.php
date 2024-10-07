<?php // 비가동 유형 관리 팝업 페이지 ?>
<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">

<div class="popup notused_pop">
    <div class="title">비가동 유형 등록
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <div class="left">
        <h4>입력
            <button type="button" class="F-right btn_nu_reset"><i class="btn_re_icon" aria-hidden="true"></i></button>
        </h4>
            <?php $attributes = array("id" => "frm_nu_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
            <?php echo form_open($site_url."/v", $attributes); ?>
            <input type="hidden" id="nu_p" class="nu_p" name="nu_p" value="in">
            <input type="hidden" id="pop" class="pop" name="pop" value="nu">
            <input type="hidden" id="nu_ikey" class="nu_ikey" name="nu_ikey" value="">
            <input type="hidden" id="page" name="page" value="">
            <dl>
                <dt class="impt">가용여부</dt>
                <dd class="radio_box">
                    <input type="radio" id="nu_chk01" class="nu_useyn" name="nu_useyn" value="Y" checked="checked">
                    <label for="nu_chk01">사용가능</label>
                    <input type="radio" id="nu_chk02" class="nu_useyn" name="nu_useyn" value="N">
                    <label for="nu_chk02">사용불가</label>
                        <!-- <input type="radio" id="y" name="radio">
                        <label for="y">사용</label>
                        <input type="radio" id="n" name="radio">
                        <label for="n">사용불가</label> -->
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">비가동유형</dt>
                    <dd class="input_zone">
                        <div class="nu_input_line input_line" style="margin-right:0">
                            <input type="text" id="nu_nm" class="nu_nm" name="nu_nm" autocomplete="off" placeholder="비가동 유형 입력">
                        </div>
                    </dd>
                </dl>
                <p class='imptp'><span>*</span> 은 필수 입력 항목입니다.</p>
                
                <div class="btn_wrap div_nu_reg">
                    <button type="button" class="blue btn_nu_reg">추가 등록</button>
                </div>
                <div class="btn_wrap div_nu_mod" style="display:none">
                    <button type="button" class="gray btn_nu_del">삭제</button>
                    <button type="button" class="blue btn_nu_mod">수정</button>
                </div>
                <?php echo form_close(); ?>
            </div>
            
            <div class="right">
                <h4>리스트</h4>
                <div class="h-scroll n-h-scroll">
                    <ul>
                        <li class="top_menu">공통</li>
                        <ul class="ac hovering nlist">
                            <!-- <li class="sub_menu">청소
                                <span class="on">ON</span>
                            </li>
                            <li class="sub_menu">교육
                                <span class="off">OFF</span>
                            </li>
                            <li class="sub_menu">작업준비
                                <span class="on">ON</span>
                            </li>
                            <li class="sub_menu">점심시간
                                <span class="on">ON</span>
                            </li>
                            <li class="sub_menu">휴계시간
                                <span class="on">ON</span>
                            </li>
                            <li class="sub_menu">점검
                                <span class="on">ON</span>
                            </li>
                            <li class="sub_menu">설비고장
                                <span class="on">ON</span>
                            </li>
                            <li class="sub_menu">작업지원
                                <span class="on">ON</span>
                            </li> -->
                        </ul>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script src="/public/js/food/not_used_pop.js?<?=time();?>"></script>
    <script>
        $('.notused_btn').click (function(){

            form_nu_reset();
            get_not_used_list("Y"); 

            $('.notused_pop').bPopup({
              modalClose: true
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
    <script>
        /*input 클릭 이벤트 추가 22-02-24 성시은*/ 
        $(".nu_input_line input").focus(function(){
          $(this).parent().addClass("active");
      });
        $(".nu_input_line input").blur(function(){
          $(this).parent().removeClass("active");
      });
        $(".nu_input_line select").focus(function(){
          $(this).parent().addClass("active");
      });
        $(".nu_input_line select").blur(function(){
          $(this).parent().removeClass("active");
      });
  </script>
  <script>
    // tr td row css
    $('.ac li').click(function(){
        $('.ac li').removeClass('active');
        $(this).addClass('active');
    });

    $('.ac td').click(function(){
        $('.ac td').removeClass('active');
        $(this).addClass('active');
    });
</script>