<?php // 장비 정보 페이지 ?>
<link rel="stylesheet" href="/public/css/food/app_information.css?<?=time()?>">
<header class="header">
    <div class="title">장비정보</div>
</header>
<?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
<?php echo form_open($site_url."/v", $attributes); ?>
<input type="hidden" id="p" name="p" value="up">
<input type="hidden" id="barcode" name="barcode" value="<?= $info->barcode; ?>">
<div class="content">
    <ul>
        <li>
            <div class="li_title">기계명</div>
            <div class="input_wrap">
                <input type="text" id="eq_nm" value="<?php echo $info->eq_nm; ?>" name="eq_nm" Auto>
            </div>
        </li>
        <li>
            <div class="li_title">구매처 업체명</div>
            <div class="input_wrap">
                <input type="text" id="buy_corp" value="<?php echo $info->buy_corp; ?>" name="buy_corp" Auto>
            </div>
        </li>
        <li>
            <div class="li_title">구매처 전화번호</div>
            <div class="input_wrap">
                <input type="text" id="buy_tel" value="<?php echo $info->buy_tel; ?>" name="buy_tel" Auto>
            </div>
        </li>
        <li>
            <div class="li_title">특이사항</div>
            <div class="input_wrap">
                <textarea id="memo" name="memo" cols="30" rows="10"><?php echo $info->memo; ?></textarea>
            </div>
        </li>
    </ul>
    <div class="btn_wrap">
        <button type="button" class="save" id="btn_mod">저장</button>
    </div>
</div>
<?php echo form_close(); ?>
<script src="/public/js/food/information.js?<?=time();?>"></script>