<!-- 사원 마이페이지 -->
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">
<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/allips.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/mypage.css?<?=time()?>">
<style>
    .container,
    .container>.content {
        height: 100%;
    }
    .aside{transition:none}
    .container.open{transition: none;}
    .container{margin-left:0 !important}
</style>
<div class="content user">
    <h3 class="title Clearfix">
        <div class="F-left title-box">
            <i class="fa fa-user" aria-hidden="true"></i> 마이페이지
        </div>
    </h3>
    <?php $attributes = array('id' => 'frm_reg', 'method' => 'post', 'accept-charset' => 'utf-8', 'onsubmit' => 'return frm_chk();'); ?>
    <?php echo form_open($site_url.'/v', $attributes); ?>
    <div class="user_info">
        <input type="hidden" id="p" name="p" value="up">
        <input type="hidden" id="key" class="w50" name="key" autocomplete="off" value="<?=$user->pass?>">
        <h3>기본 정보</h3>
        <table>
            <tr>
                <th>부서/직급</th>
                <td>
                    <?=$user->dp_name.'/'.$user->job_nm;?>
                </td>
                <th>사원명(한글)</th>
                <td>
                    <?= $user->ul_nm ?>
                </td>
            </tr>
            <tr>
                <th>연락처</th>
                <td>
                    <input type="text" id="tel" class="num_type w50" name="tel" autocomplete="off" value="<?=$user->tel?>">
                </td>
                <th>이메일주소</th>
                <td>
                    <input type="email" class="w50" name="email" autocomplete="off" value="<?=$user->email?>">
                </td>
            </tr>
            <tr>
                <th>아이디</th>
                <td>
                    <?= $user->id ?>
                </td>
                <th>비밀번호</th>
                <td>
                    ****** &nbsp;<button type="button" class="pw_btn"><i class="fa fa-refresh" aria-hidden="true"></i> 변경하기</button>
                </td>
            </tr>
        </table>
    </div>
    <div class="btn-wrap">
        <button type="button" class="blue btn_save"><i class="fa fa-floppy-o" aria-hidden="true"></i> 저장하기</button>
    </div>
    <?php echo form_close(); ?>
</div>
<script src="/public/js/food/mypage.js?=<?=time();?>"></script>
<script>
    $('.aside').hide();
    $('.container').addClass('open');
	$('.header .toggle_btn').hide();
</script>