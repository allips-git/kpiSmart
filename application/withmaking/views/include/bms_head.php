<link rel="stylesheet" href="/public/css/bms.css?<?=time()?>">
<script src="/public/js/bms.js?<?=time()?>"></script>
</div>
<?php
$result = true;
$auth = Authori::give_auth('menu'); /* 각 메뉴 접근 시 권한 리스트 가져오기 20200921 김원명 */
$head = Authori::give_auth('head'); /* 헤드메뉴 권한 가져오기 20200921 김원명 */
if ($_SERVER['PHP_SELF'] != "/index.php/base/main" && $_SERVER['PHP_SELF'] != "/index.php/main"
    && $_SERVER['PHP_SELF'] != "/index.php/cs/policy" && $_SERVER['PHP_SELF'] != "/index.php/cs/privacy" && $_SERVER['PHP_SELF'] != "/index.php/user/mypage") {
    $list = Authori::get_list(); /* 전체 메뉴 리스트 가져오기 20200921 김원명 */
    $result = Authori::get_url_auth(); /* 화면 권한 조회 */
}

$dis_url = '';
foreach ($auth as $row):
    if ($row->useyn == "N") {
        if ($dis_url == '') {
            $dis_url = $row->cm_url;
        }
    }
endforeach;
?>
<header class="header">
	<div class="inner Clearfix">
		<div class="logo F-left">
			<a href="/">위드메이킹</a>
		</div>
		<div class="toggle_btn">
			<img src="/public/img/ham.png" alt="">
		</div>
		<div class="F-left">
			<ul class="menu">
				<!--20200915 권한 부여로 소스 변경 20200915 김원명-->
			
				<?php $i = 1; foreach($head as $row): 
			
						if ($row->cm_gb == "H") { 
							if ($row->cm_nm !== '3D 프린터 제작') { 
								// '3D프린터제작' 메뉴 항목의 경우 새로운 경로로 설정합니다.
								?>
									<li rel="menu0<?=$row->head_id;?>" id="menu<?=$row->head_id;?>0">
										<a href="<?=$row->cm_url;?>"><?=$row->cm_nm;?></a>
									</li>
								<?php
							}
							$i++;
						}
					endforeach; ?>
				<?php if ($this->session->userdata['local_cd'] == 'KR04') {?>
					<?php if ($dis_url == '') {?>
						<li rel="menu0999" id="menu9990"><a onclick="alert('개발 중인 메뉴가 없습니다.');">개발중</a></li>
					<?php } else {?>
						<li rel="menu0999" id="menu9990"><a href="<?=$dis_url?>">개발중</a></li>
					<?php }?>
				<?php }?>
			</ul>
		</div>
		<ul class="member F-right">
			<li class="mb manual">메뉴얼
				<div class="manual-list">
					<a href="/public/img/3d_erp_manual.pdf" target="_blank" id="manual">ERP 메뉴얼</a>
					<!-- <a href="/public/img/fms_user_manual_tablet.pdf" target="_blank" id="manual">ERP 테블릿PC 메뉴얼</a> -->
					<a href="/public/img/barcode_label_manual.pdf" target="_blank" >라벨지프린트 메뉴얼</a>
					<a href="/public/file/food/apk/mes_apk_v1.0.apk" target="_blank" >태블릿APK 다운로드</a>
				</div>
			</li>
			<li class="mb">
				<a href="/user/mypage">
					<!-- <span class="biz_name center_name">[<?php echo $this->session->userdata['fa_nm']; ?> 공장]</span> -->
					<!-- <span class="biz_name fact_name">디자인윈도우공장</span> -->
					<strong><?php echo $this->session->userdata['ul_nm']; ?></strong>
				</a>&nbsp;
				<i class="fa fa-angle-down" aria-hidden="true"></i>
			</li>
			<!-- <li class="mb"><a href="/public/img/bms_manual_5.pdf" id="ErpGuide">가이드</a></li>
			<script>
				$('a#ErpGuide').attr({target: '_blank',
					href  : '/public/img/bms_manual_5.pdf'});
				</script> -->

				<!-- <li><button type="button" class="logout-btn" onclick="javascript:location.href='/login/log_out'"><i class="fa fa-sign-out" aria-hidden="true"></i> 로그아웃</button></li> -->
				<li class="setting" onclick="javascript:location.href='/login/log_out'">
					<img src="/public/img/logout.png" alt="" title="로그아웃">
					<!-- <i class="fa fa-cog" aria-hidden="true"></i> -->
				</li>
			</ul>
		</div>
	</header>

	<aside class="aside">
		<div class="inner">
			<!-- 01 -->
			<!-- 거래관리. -->
			<?php if ($_SERVER['PHP_SELF'] == "/index.php/base/main" || $_SERVER['PHP_SELF'] == "/index.php/main"
    || $_SERVER['PHP_SELF'] == "/index.php/cs/policy" || $_SERVER['PHP_SELF'] == "/index.php/cs/privacy"
    || $_SERVER['PHP_SELF'] == "/index.php/user/mypage") {?>
				<!-- 즐겨찾기 메뉴 -->
				<ul class="main-menu">
					<li><a href="">거래관리</a></li>
				</ul>
			<?php } else {?>

				<?php $currentUrl = $_SERVER['REQUEST_URI'];?>
<ul class="sub-menu" id="menu<?=$list['data']->head_id;?>">
    <?php foreach ($list['list'] as $srow): ?>
        <?php if ($this->common->get_column_count('z_plan.factory_menu', array('parent_id' => $srow->pgm_id, 'cm_gb' => 'N', 'useyn' => 'Y', 'local_cd' => $this->session->userdata['local_cd'])) != "0") {?>
            <li><a><?=$srow->cm_nm;?></a><i class="fa fa-angle-right" aria-hidden="true"></i></li>
            <?php if ($srow->head_id === $list['data']->head_id) {?>
                <ul class="dropmenu">
                    <?php foreach ($auth as $nrow): ?>
                        <?php if ($srow->pgm_id == $nrow->parent_id) {?>
                            <?php if ($nrow->useyn == "Y" && $nrow->read == "Y") {?>
                                <?php if ($nrow->pop_gb == "Y") {?>
                                    <li>
                                        <a href="#" data-href="<?=$nrow->cm_url;?>" class="popup_link">
                                            <i class="far fa-file"></i> <?=$nrow->cm_nm;?>
                                        </a>
                                    </li>
                                <?php } else {?>
                                    <li>
                                        <a href="<?=$nrow->cm_url;?>">
                                            <i class="far fa-file"></i> <?=$nrow->cm_nm;?>
                                        </a>
                                    </li>

                                <?php }?>
                            <?php }?>

                        <?php }?>
                    <?php endforeach?>

                    <?php if (strpos($currentUrl, "/pr") === 0): ?>

						<li>
							<a href="/pr/prod_qa">
								<i class="far fa-file"></i> 생산 불량 관리
							</a>
						</li>


                        <li>
                            <a href="/pr/PrPrint">
                                <i class="far fa-file"> IoT 3D 프린터 DATA</i>
                            </a>
                        </li>
                    <?php endif;?>
                </ul>
            <?php }?>
        <?php }?>
    <?php endforeach?>

	<?php if (strpos($currentUrl, "/kpi/test") === 0): ?>
            <!-- 현재 URL이 /kpi/test로 시작할 때 '생산관리' 메뉴 추가 -->
            <li class="active" >
                <a href="/kpi/test">
                    <i class="far fa-file"></i> &nbsp; 생산관리
                </a>
            </li>
        <?php endif;?>

		<?php if (strpos($currentUrl, "/pr/PrPrint") === 0): ?>

			<ul class="sub-menu <?php echo (strpos($currentUrl, "/pr/PrPrint") === 0) ? 'active' : ''; ?>" id="menu402" style="display: <?php echo (strpos($currentUrl, "/pr/PrPrint") === 0) ? 'block' : 'none'; ?>;">
				<li class="<?php echo (strpos($currentUrl, "/pr/PrPrint") === 0) ? 'active' : ''; ?>">
					<a class="<?php echo (strpos($currentUrl, "/pr/PrPrint") === 0) ? 'active' : ''; ?>">생산관리</a>
					<i class="fa fa-angle-right" aria-hidden="true"></i>
				</li>
				<ul class="dropmenu" style="display: <?php echo (strpos($currentUrl, "/pr/PrPrint") === 0) ? 'block' : 'none'; ?>;">
					<li>
						<a href="/pr/job_ord" class="<?php echo ($currentUrl == "/pr/job_ord") ? 'active' : ''; ?>">
							<i class="far fa-file"></i> 제조 오더 등록
						</a>
					</li>
					<li>
						<a href="/pr/prod_list" class="<?php echo ($currentUrl == "/pr/prod_list") ? 'active' : ''; ?>">
							<i class="far fa-file"></i> 생산 현황 관리
						</a>
					</li>

					<li>
						<a href="/pr/prod_qa" class="<?php echo ($currentUrl == "/pr/prod_qa") ? 'active' : ''; ?>">
							<i class="far fa-file"></i> 생산 불량 관리
						</a>
					</li>

					<li>
						<a href="/pr/PrPrint" class="<?php echo ($currentUrl == "/pr/PrPrint") ? 'active' : ''; ?>">
							<i class="far fa-file"></i> IoT 3D 프린터 DATA
						</a>
					</li>
				</ul>
			</ul>
        <?php endif;?>
</ul>
				<!--개발팀 사용 메뉴 2021/12/27 김원명-->
				<?php if ($this->session->userdata['local_cd'] == 'KR04') {?>
					<ul class="sub-menu" id="menu999">
						<li><a>개발메뉴</a></li>
						<ul class="dropmenu">
							<?php foreach ($auth as $nrow): ?>
								<?php if ($nrow->useyn == "N") {?>
									<?php if ($nrow->pop_gb == "Y") {?>
										<li>
											<a href="#" data-href="<?=$nrow->cm_url;?>" class="popup_link">
												<i class="far fa-file"></i> <?=$nrow->cm_nm;?>
											</a>
										</li>
									<?php } else {?>
										<li>
											<a href="<?=$nrow->cm_url;?>">
												<i class="far fa-file"></i> <?=$nrow->cm_nm;?>
											</a>
										</li>
									<?php }?>
								<?php }?>
							<?php endforeach?>
						</ul>
					</ul>
				<?php }?>
			<?php }?>
		</div>
		<!-- 올립스 BMS시스템 외 링크 비활성화 - 김민주 2021/06/16 -->
		<?php if ($_SERVER['HTTP_HOST'] == "plan-bms.localhost" || $_SERVER['HTTP_HOST'] == "bms.plansys.kr") {?>
			<div class="banner">
			<!-- 추후 오픈 예정으로 비활성화 작업
				<a href="/admin/main" target="_blank"><i class="fa fa-home" aria-hidden="true"></i>
					<span>홈페이지 관리 <img src="/public/img/new.png" alt="" style="display:none"></span>
				</a>
			-->
			<?php
$local_cd = $this->session->userdata['local_cd'];
    if ($local_cd == 'KR01') // 올립스 공장 로그인시에만 노출. 김민주 2021/11/18
    {
        ?>
				<!-- <a href="https://smartstore.naver.com/naturalwindow" target="_blank">
					<i class="fa fa-arrows" aria-hidden="true"></i>
					<span>마켓 사이트이동</span>
				</a> -->
			<?php }?>
		</div>
	<?php }?>
</aside>

<?php

if (strpos($currentUrl, "/pr") === 0) {
    $result = 'true';

    if (!$result) {?>
	<script>
		alert('해당 화면에 대한 권한이 없습니다.');
		history.back();
	</script>

	<?php }?>

<?php }?>

<div class="container">
<script>
	$('li.manual').mouseover(function(){
		$('.manual-list').show(10);
	});
	$('manual-list').mouseover(function(){
		$('.manual-list').show(10);
	});
	$('li.manual').mouseleave(function(){
		$('.manual-list').hide(10);
	});
	$('manual-list').mouseleave(function(){
		$('.manual-list').hide(10);
	});
</script>
