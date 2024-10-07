<?php // 단가 명칭 관리 팝업 페이지 ?>
<link rel="stylesheet" href="/public/css/food/item_list.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">

<div class="popup amt_pop">
    <div class="title">단가 명칭 관리
        <span class="b-close">&times;</span>
    </div>
    <?php $attributes = array("id" => "frm_amt", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
    <?php echo form_open("factory_amt_nm/v", $attributes); ?>
    <input type="hidden" class="p" name="p" value="in">
    <div class="inner">
        <table>
            <thead>
                <tr>
                    <th class="w30">번호</th>
                    <th>단가명칭</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="impt">1</td>
                    <td>
                        <div class="input_line w100">
                            <input type="text" id="amt2" name="amt2" value="<?=$amt_nm->amt2 ?>" autocomplete="off" required>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="impt">2</td>
                    <td>
                        <div class="input_line w100">
                            <input type="text" id="amt3" name="amt3" value="<?=$amt_nm->amt3 ?>" autocomplete="off" required>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="impt">3</td>
                    <td>
                        <div class="input_line w100">
                            <input type="text" id="amt4" name="amt4" value="<?=$amt_nm->amt4 ?>" autocomplete="off" required>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="impt">4</td>
                    <td>
                        <div class="input_line w100">
                            <input type="text" id="amt5" name="amt5" value="<?=$amt_nm->amt5 ?>" autocomplete="off" required>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
    </div>
    <div class="btn_wrap">
        <button type="button" class="gray">목록</button>
        <button type="button" class="blue btn_amt_mod">수정</button>
    </div>
    <?php echo form_close(); ?>
</div>

<script src="/public/js/food/amt_nm.js?<?=time();?>"></script>
<script>
    $(".btn_amt").click (function(){
        $(".amt_pop").bPopup({
          modalClose: true
          , opacity: 0.8
          , positionStyle: "absolute" 
          , speed: 300
          , transition: "fadeIn"
          , transitionClose: "fadeOut"
          , zIndex : 99997
            //, modalColor:"transparent" 
        }); 

    });  
</script>
<script>
    /*input 클릭 이벤트 추가 22-02-24 성시은*/ 
	$(".input_line input").focus(function(){
		$(this).parent().addClass("active");
	});
	$(".input_line input").blur(function(){
		$(this).parent().removeClass("active");
	});
</script>
<script>
    // tr td row css
    $(".ac li").click(function(){
        $(".ac li").removeClass("active");
        $(this).addClass("active");
    });

    $(".ac td").click(function(){
        $(".ac td").removeClass("active");
        $(this).addClass("active");
    });
</script>