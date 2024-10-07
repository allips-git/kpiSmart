<?php // 공지사항 등록 페이지 ?>
<input type="hidden" id="site_url" value="<?=$site_url ?>">
<input type="hidden" id="tag" class="tag" name="tag" value="i">
<link rel="stylesheet" href="/public/css/food/cs.css?<?=time()?>">
<script type="text/javascript" src="/public/js/lib/ckeditor_standard/ckeditor.js"></script>

<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write; // 쓰기 권한
?>
<?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
<?php echo form_open($site_url."/v", $attributes); ?>
<input type="hidden" id="p" class="p" name="p" value="in">
<div class="notice_v notice_w content">
    <div class="section">
        <h4>공지사항 등록</h4>
        <div class="top_table">
            <table>
                <tr>
                    <th>구분</th>
                    <td class="T-left">
                        <div class="input_line w30">
                            <select id="category" name="category">
                                <option value="N">일반</option>
                                <option value="S">중요</option>
                            </select>
                        </div>
                    </td>
                    <th>가용여부</th>
                    <td class="T-left">
                        <input type="radio" id="chky" name="useyn" value="Y" checked>
                        <label for="chky">사용</label>
                        <input type="radio" id="chkn" name="useyn" value="N">
                        <label for="chkn">미사용</label>
                    </td>
                </tr>
                <tr>
                    <th>제목</th>
                    <td colspan="3">
                        <div class="input_line w70">
                            <input type="text" id="title" name="title" autocomplete="off" placeholder='제목을 입력하세요.'>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div class="main_table">
            <table>
                <tr>
                    <th>내용</th>
                    <td class="T-left">
                        <div class="inner">
                            <textarea id="contents" name="content" cols="30" rows="10"></textarea>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    
    <div class="btn_wrap">
        <button type="button" id="btn_cancel" class="gray">목록</button>
        <?php if($w == "Y") { ?>
            <button type="button" id="btn_reg" class="blue">등록</button>
        <?php } else{ ?>
            <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">등록</button>
        <?php } ?>
        <!-- <button type="button" id="btn_reg" class="blue">등록</button> -->
    </div>
</div>
<?php echo form_close(); ?>

<script src="/public/js/food/notice_in.js?<?=time();?>"></script>
<script>
    /*input 클릭 이벤트 추가 22-02-24 성시은*/ 
    $(".input_line input").focus(function(){
        $(this).parent().addClass("active");
    });
    $(".input_line input").blur(function(){
        $(this).parent().removeClass("active");
    });
    $(".input_line select").focus(function(){
        $(this).parent().addClass("active");
    });
    $(".input_line select").blur(function(){
        $(this).parent().removeClass("active");
    });
    $(".input_line textarea").focus(function(){
        $(this).parent().addClass("active");
    });
    $(".input_line textarea").blur(function(){
        $(this).parent().removeClass("active");
    });
</script>
<script>
    CKEDITOR.replace('contents',{
        height:500
    })
</script>