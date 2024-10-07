<!-- 권한 관리 페이지 -->
<input type="hidden" id="site_url" value="<?=$site_url ?>">
<link rel="stylesheet" href="/public/css/loading.css">
<script src="/public/js/lib/split-pane.js"></script>

<link rel="stylesheet" href="/public/css/food/user.css?<?=time()?>">
<script src="/public/js/food/auth.js?<?=time()?>"></script>
<script src="/public/js/bms_sub.js?<?=time()?>"></script>

<!--각 기능 처리 후 messge 처리 부분-->
<script>
	<?php if ($msg == "i") { ?>
		toast('등록이 완료되었습니다.', false, 'info');
	<?php } elseif ($msg == 'u') { ?>
		toast('수정이 완료되었습니다.', false, 'info');
	<?php } elseif ($msg == 'o') { ?>
		toast('중복된 부서명이 존재합니다.', true, 'danger');
	<?php } elseif ($msg == 'd') { ?>
		toast('삭제가 완료되었습니다.', false, 'info');
	<?php } elseif ($msg == 'e') { ?>
		toast('진행 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
	<?php } ?>
</script>

<div class="content auth">
	<?php
		/** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
	    $w = Authori::get_list()['data']->write; // 쓰기 권한
	    $m = Authori::get_list()['data']->modify; // 쓰기 권한
	    $d = Authori::get_list()['data']->delete; // 삭제 권한
    ?>
	<!-- <?= $title ?> -->
    <?php $attributes1 = array('id' => 'frm1', 'method' => 'get', 'accept-charset' => 'utf-8'); ?> 
    <?php echo form_open($site_url, $attributes1); ?>
	<div class="section search_zone">
		<dl>
			<dt>
				<span>검색</span>
			</dt>
				<input type="hidden" name="s" value="t">
			<dd>
				<div class="input_line w10">
					<select name="op" id="op">
						<option value="dp_name" <?=($params['op'] == "dp_name" ? "selected" : "") ?>>부서명</option>
						<option value="dp_cd"   <?=($params['op'] == "dp_cd" ? "selected" : "") ?>>부서코드</option>
						<option value="memo"    <?=($params['op'] == "memo" ? "selected" : "") ?>>비고</option>
					</select>
				</div>
				<div class="input_line w20">
					<input type="text" name="sc" id="sc" autocomplete="off" placeholder="검색어를 입력하세요." value="<?php if(isset($params['sc'])){ echo $params['sc']; } ?>">
				</div>
				<button type="submit">검색</button>
			</dd>
		</dl>
	</div>
    <?php echo form_close(); ?>
	<div class="bottom">
		<div class="input_zone">
			<div class="short section">
				<h4>부서입력
					<button type="button" class='F-right'  id="reset">
						<i class="btn_re_icon" aria-hidden="true"></i>
					</button>
				</h4>
				<div class="form-group ">
					<dl>
						<dt class="impt">부서명</dt>
						<dd>
							<div class="input_line">
								<input type="text" autocomplete="off" class="w150" name="dpt" id="dpt" placeholder='부서명 입력'>
							</div>
						</dd>
					</dl>
					<dl>
						<dt>비고</dt>
						<dd>
							<div class="input_line">
								<input type="text" class="w100" autocomplete="off" name="memo" id="memo" placeholder='비고 입력'>
							</div>
						</dd>
					</dl>
					
					<p class='imptp'><span>*</span> 은 필수 입력 항목입니다.</p>
				</div>
				
			</div>
			<div class="section long">
				<h4>부서별 권한 설정
					<input type="checkbox" name="all_chk" id="all_chk">
					<label for="all_chk" class="all_chk">전체허용</label>
				</h4>
				<div class="table_wrap">
					<div class="n-scroll">
						<table class="set-table authority ac">
							<thead>
								<tr>
									<th scope="col" rowspan="2" class="w30">화면명</th>
									<th scope="col" class=''>접근권한</th>
									<th scope="col" colspan="3" class=''>작업권한</th>
								</tr>
								<tr>
									<th class=""><input type="checkbox" id="look" data-auth="Y"><label for="look"></label> <label for="look">허용</label></th>
									<th class=""><input type="checkbox" id="input" data-auth="Y"><label for="input"></label> <label for="input">등록</label></th>
									<th class=""><input type="checkbox" id="modify" data-auth="Y"><label for="modify"></label> <label for="modify">수정</label></th>
									<th class=""><input type="checkbox" id="delete" data-auth="Y"><label for="delete"></label> <label for="delete">삭제</label></th>
								</tr>
							</thead>
						</table>
					</div>
					<div class="h-scroll mCustomScrollbar">
						<?php $attributes2 = array('id' => 'frm2', 'method' => 'post', 'accept-charset' => 'utf-8'); ?>
						<?php echo form_open('base/auth/v', $attributes2); ?>	
						<input type="hidden" id="p" name="p" value="in">
						<input type="hidden" id="dp_uc" name="dp_uc" value="<?php if(isset($set_value->dp_uc)){ echo $set_value->dp_uc; }else{ echo "not"; }?>">
						<input type="hidden" name="dpt_new" id="dpt_new" value="<?php if(isset($set_value->dp_name)){ echo $set_value->dp_name; }?>">
						<input type="hidden" name="memo_new" id="memo_new" value="<?php if(isset($set_value->memo)){ echo $set_value->memo; }?>">
						<input type="hidden" name="p_sysyn" id="p_sysyn" value="<?php if(isset($set_value->sysyn)){ echo $set_value->sysyn; }?>">
						<input type="hidden" name="op_new" id="op_new" value="<?php if(isset($params['op'])){ echo $params['op']; } ?>">
						<input type="hidden" name="sc_new" id="sc_new" value="<?php if(isset($params['sc'])){ echo $params['sc']; } ?>">
						<table class="set-table authority ac">
							<colgroup>
								<col width='30%'>
								<col width=''>
								<col width=''>
								<col width=''>
								<col width=''>
							</colgroup>
							<tbody>
								<?php foreach($head as $hrow) :?>
									<tr>
										<td class="T-left set-title" colspan='5'>※ <?=$hrow->cm_nm;?></td>
									</tr>
									<?php foreach ($pgm_id as $row) :?>
										<?php if ($row->head_id == $hrow->pgm_id) { ?>
											<tr>
												<td class="T-left w30 pad"><?=$row->cm_nm;?></td>
												<td class="">
													<input type="checkbox" id="look<?=$row->pgm_id;?>" name="sel[<?=$row->pgm_id?>]" value="read" data-pro='<?=$row->pgm_id;?>' data-auth="Y" <?php if(set_value('sel['.$row->pgm_id.']') == "read"){ echo "checked"; }?>>
													<label for="look<?=$row->pgm_id;?>"></label>
												</td>
												<td class="">
													<input type="checkbox" id="input<?=$row->pgm_id;?>" name="input[<?=$row->pgm_id?>]" value="write" data-pro='<?=$row->pgm_id;?>' data-auth="Y" <?php if(set_value('input['.$row->pgm_id.']') == "write"){ echo "checked"; }?>>
													<label for="input<?=$row->pgm_id;?>"></label>
												</td>
												<td class="">
													<input type="checkbox" id="modify<?=$row->pgm_id;?>" name="edit[<?=$row->pgm_id?>]" value="modify" data-pro='<?=$row->pgm_id;?>' data-auth="Y" <?php if(set_value('edit['.$row->pgm_id.']') == "modify"){ echo "checked"; }?>>
													<label for="modify<?=$row->pgm_id;?>"></label>
												</td>
												<td class="">
													<input type="checkbox" id="delete<?=$row->pgm_id;?>" name="del[<?=$row->pgm_id?>]" value="delete" data-pro='<?=$row->pgm_id;?>' data-auth="Y" <?php if(set_value('del['.$row->pgm_id.']') == "delete"){ echo "checked"; }?>>
													<label for="delete<?=$row->pgm_id;?>"></label>
												</td>
												<?php // 관리자권한 미사용으로 비활성화 ?>
												<td class="" style="display: none;">
													<input type="checkbox" id="admin<?=$row->pgm_id;?>" name="admin[<?=$row->pgm_id?>]" value="admin" data-pro='<?=$row->pgm_id;?>' data-auth="Y" <?php if(set_value('admin['.$row->pgm_id.']') == "admin"){ echo "checked"; }?>>
													<label for="admin<?=$row->pgm_id;?>"></label>
												</td>
											</tr>
										<?php } ?>
									<?php endforeach ?>
								<?php endforeach ?>
							</tbody>
						</table>
						<?php echo form_close();?>
					</div>
				</div>
				<div class=" btn-box">
					<?php if($w == "Y") { ?>
						<button class="blue" id="enroll" type="button">
							등록
						</button>
					<?php } else{ ?>
						<button class="disable" id="d_enroll" type="button" onclick="alert('권한이 없습니다.');">
							등록
						</button>
					<?php } ?>
					<?php if ($d == "Y") { ?>
						<button type="button" id="del" style="display:none;">
							삭제</i>
						</button>
					<?php } else { ?>
						<button class="disable" id="d_del" type="button" style="display:none;">
							삭제</i>
						</button>
					<?php } ?>
					<?php if ($m == "Y") {?>
						<button id="mod" type="button" style="display:none;">
							수정
						</button>
					<?php } else { ?>
						<button class="disable" id="d_mod" type="button" style="display:none;" onclick="alert('권한이 없습니다.');">
							수정
						</button>
					<?php } ?>
				</div>
			</div>
		</div>
		<div class="list_zone section">
			<h4>부서 리스트</h4>
			<div class="n-scroll">
				<table class="set-table">
					<thead>
						<tr>
							<th class="w6">순번</th>
							<th class="w7">부서코드</th>
							<th class="">부서명</th>
							<th class="w14">등록자명(ID)</th>
							<th class="w13">등록일시</th>	
							<th class="w14">수정자명(ID)</th>
							<th class="w13">수정일시</th>	
							<th class="w8">가용여부</th>
						</tr>
					</thead>
				</table>
			</div>

			<div class="h-scroll mCustomScrollbar">
				<table class='hovering'>
					<tbody class="at ac">
						<?php if ($total_count > 0) { ?>
							<?php 
							empty($page) ? $p = 0 : $p = (int)$page;
							$i=1+$p;
							foreach ($list as $row): ?>
								<tr id="list_<?=$row->dp_uc;?>">
									<td class="w6"><?=$i?></td>
									<td class="w7 tb_click" onclick="get_data('<?=$row->dp_uc;?>', '<?=$row->sysyn;?>', '<?=$row->dp_name;?>', '<?=$row->memo?>');">
										<?=$row->dp_cd;?>
									</td>
									<td class="tb_click Elli" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" onclick="get_data('<?=$row->dp_uc;?>', '<?=$row->sysyn;?>', '<?=$row->dp_name;?>', '<?=$row->memo?>');"><?=$row->dp_name;?></td>
									
									<td class="w14 Elli"><?= $this->common->get_column('z_plan.user_list', $row->reg_ikey, 'ul_nm'); ?>(<?=$this->common->get_column('z_plan.user_list', $row->reg_ikey, 'id'); ?>)</td>
									<td class="w13 Elli"><?=$row->reg_dt;?></td>	
									<td class="w14 Elli">
										<?php if($row->mod_ikey != ""){ ?>
											<?= $this->common->get_column('z_plan.user_list', $row->mod_ikey, 'ul_nm'); ?>(<?=$this->common->get_column('z_plan.user_list', $row->mod_ikey, 'id'); ?>)
										<?php } ?>
									</td>
									<td class="w13 Elli"><?=$row->mod_dt;?></td>
									<td class="w8">
										<label class="switch" id="">
											<input type="checkbox" name="useyn" id="<?=$row->dp_uc;?>" data-use="<?=$row->useyn;?>" <?=$row->useyn == "Y" ? "checked" : ""; ?> disabled>
											<span class="slider round"></span>
										</label>
									</td>
								</tr>
								<?php 
								$i++;
							endforeach
							?>
						<?php } else { ?>
							<tr>
								<td colspan="9"> 조회 가능한 데이터가 없습니다.</td>
							</tr>
						<?php } ?>
					</tbody>
				</table>
			</div>
		</div>
	</div>
    <div class="total">
        <ul>
            <li class='T-right'>총 검색 : <strong><?php echo ($total_count) ? number_format($total_count):0; ?></strong><span>건</span></li>
        </ul>
    </div>
</div>
<!--Loading image popup 2020/08/25 추가 김원명-->
<div id="loading" style="display:none;">
	<img id="loading-image" src="/public/img/loading.gif"/>
</div>
<script>
	$(function() {
		$('div.split-pane').splitPane();
		$(".custom-scroll").mCustomScrollbar({
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