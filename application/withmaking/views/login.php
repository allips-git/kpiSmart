<?php // 로그인 페이지 ?>
<input type="hidden" id="title" value="로그인">
<link rel="stylesheet" href="/public/css/login.css?<?=time()?>">
<div class="container_wrap div-table">
	<div class="div-tablecell">
		<div class="logosection">
				<!-- <img src="/public/img/login_logo.png" alt="로고" class="logo"> -->
				<p>위드메이킹</p>
				<b>위드메이킹 erp system</b>
				<!-- <p class="title"><strong>Allips</strong> 로그인</p>
				<p class="sub-title">allips에 등록한 아이디로 로그인해주세요.</p>  -->
		</div>
		<div class="loginzone">
			<?php echo form_open('login/v'); ?>
			<input type="hidden" id="csrf_token" name="<?= $this->security->get_csrf_token_name() ?>" value="<?= $this->security->get_csrf_hash() ?>">
			<div class="inputsection">
				<div class="id-title">사번과 아이디, 패스워드를 입력해주세요.</div>
					<div class="input-box">
						<div class="id">
							<p><i class="fa fa-pencil-square-o" aria-hidden="true"></i> 사번</p>
							<input type="text" id="ul_cd" name="ul_cd" autocomplete="off" class="inputID" value="<?php if(isset($ck['ul_cd'])){ echo $ck['ul_cd']; }else{ echo set_value('ul_cd'); };?>">
						</div>
						<div class="id">
							<p><i class="fa fa-pencil-square-o" aria-hidden="true"></i> 아이디</p>
							<input type="text" id="id" name="id" autocomplete="off" class="inputID" value="<?php if(isset($ck['id'])){ echo $ck['id']; }else{ echo set_value('id'); };?>">
						</div>
						<!-- <?php echo form_error('id'); ?> -->
						<div class="pw">
							<p><i class="fa fa-key" aria-hidden="true"></i> 패스워드</p>
							<input type="password" id="password" name="password" autocomplete="off" class="inputPW" value="<?php echo set_value('password') ?>">
						</div>
						<!-- <?php echo form_error('password'); ?> -->
					</div>
				</div>
				<div class="btn-box">
					<input type="submit" value="로그인" class="btnlogin">
				</div>
				<div class="save">
					<input type="checkbox" name="check" id="check" value="Y" <?php if(isset($ck['check'])){ echo 'checked'; }else{ if(set_value('check') == "Y"){ echo "checked"; }}?>>
					<label for="check" class="check">&nbsp;사번 / 아이디 저장</label>
				</div>
				<?php echo form_close(); ?>
				<p class="copy">
					copyright &copy; <strong>Allips</strong> All right reserved.
				</p>
			</div>
		</div>
	</div>
</div>

