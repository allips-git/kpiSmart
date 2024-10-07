<!-- 엑셀 일괄 업로드 팝업 페이지 -->
<link rel="stylesheet" href="/public/css/loading.css">
<div class="popup ord_excel_pop">
    <div class="title">주문 일괄 등록
        <span class="b-close">&times;</span>
    </div>
    <?php $attributes = array("id" => "frm_upload", "method" => "post", "enctype" => "multipart/form-data", "onsubmit" => "return frm_chk();"); ?>
    <?php echo form_open($site_url."/file_v", $attributes); ?>
    <input type="hidden" id="p" name="p" value="excel">
    <div class="inner">
        <input type="radio" id="tab01" name="tab" checked>
        <label for="tab01" class="tab01">주문 등록</label>
        <!-- <input type="radio" id="tab02" name="tab">
        <label for="tab02" class="tab002">관련상품 설정</label>
        <input type="radio" id="tab03" name="tab">
        <label for="tab03" class="tab03">옵션/재고 수정</label> -->
        <div class="tabbox tabbox01">
            <h5>양식 다운로드</h5>
            <dl>
                <dt>엑셀 양식 다운로드</dt>
                <dd>
                    <button type="button" class="excel_btn"><i class="fas fa-file-excel"></i> &nbsp;<a href="/public/file/food/ord/fms_ord_excel.xlsx" download="주문 일괄 등록 양식 다운로드">양식 다운로드</a></button>
                </dd>
            </dl>
            <h5>엑셀 업로드</h5>
            <dl>
                <dt class="impt">엑셀 파일 등록</dt>
                <dd>
                    <input type="file" id="excel_file" name="excel_file" value="" required>
                </dd>
            </dl>
            <div class="btn_wrap">
                <button type="button" class="gray b-close">닫기</button>
                <button type="button" id="btn_upload" class="upload blue">엑셀 업로드</button>
            </div>
        </div>
        <div class="tabbox tabbox02"></div>
        <div class="tabbox tabbox03"></div>
    </div>
    <?php echo form_close(); ?>
</div>

<div id="loading" style="display:none;">
    <img id="loading-image" src="/public/img/loading.gif"/>
</div>
<script src="/public/js/food/ord_excel.js?<?=time();?>"></script>
<script>
    $('.add_ord_all').click (function() {
        $('.ord_excel_pop').bPopup({
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