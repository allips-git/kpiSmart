<!-- 문의하기 확인 화면 -->
<link rel="stylesheet" href="/public/css/food/cs.css?<?=time()?>">
<input type="hidden" id="site_url" value="<?=$site_url ?>">

<div class="notice_v content">
	<?php echo form_open('cs/inquire/c'); ?>
		<div class="section">
			<h4>문의사항 상세</h4>
			<div class="top_table">
				<table class="v-table">
					<input type="hidden" value="<?=$ikey?>" name="i">
					<tr>
						<th>작성일</th>
						<td class="T-left"><?=$this->common->my_date($row->reg_dt); ?></td>
						<th>작성자</th>
						<td class="T-left"><?=$row->name?></td>
						<th>전화번호</th>
						<td class="T-left"><?=$this->common->format_number($row->tel, 1)?></td>
						<th>이메일</th>
						<td class="T-left"><?=$row->email?></td>
					</tr>				
					<tr>
						<th>제목</th>
						<td colspan="5" class="T-left"><?=$row->title?></td>
						<th>문의종류</th>
						<td class="T-left"><?=$row->kind === "01" ? '견적문의' : '일반문의'; ?></td>
					</tr>
				</table>
			</div>
			<div class="main_table">
				<table>
					<tr>
						<th>내용</th>
						<td class="T-left">
							<div id="content" class="inner">
								<?=$row->contents?>
							</div>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="btn_wrap">
			<?php if($row->confirm === "N"){?>
				<button type="submit" class="upload blue" id="">게시글 확인</button>
			<?php } ?>
		</div>
	<?php echo form_close(); ?>
</div>