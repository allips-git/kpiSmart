<input type="hidden" id="site_url" value="<?php echo $site_url ?>">
<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>

<link rel="stylesheet" href="/public/css/loading.css">
<script src="/public/js/lib/split-pane.js"></script>
<link rel="stylesheet" href="/public/css/food/user.css?<?=time()?>">
<script src="/public/js/bms_sub.js?<?=time()?>"></script>
<script src="/public/js/food/user.js?<?=time()?>"></script>

<script>
	$(function () {
        //$( ".datepicker" ).datepicker();
        $(".datepicker")
        .datepicker({
        	dateFormat: 'yy-mm-dd',
        	showOn: 'button',
				buttonImage: '/public/img/calender_img.png', // 달력 아이콘 이미지 경로
                buttonImageOnly: true, //  inputbox 뒤에 달력 아이콘만 표시
                changeMonth: false, // 월선택 select box 표시 (기본은 false)
                changeYear: false, // 년선택 selectbox 표시 (기본은 false)
            });
            //.datepicker("setDate", new Date()); // today setting
            $(".datepicker2")
            .datepicker({
            	dateFormat: 'yy-mm-dd',
            	showOn: 'button',
				buttonImage: '/public/img/calender_img.png', // 달력 아이콘 이미지 경로
                buttonImageOnly: true, //  inputbox 뒤에 달력 아이콘만 표시
                changeMonth: false, // 월선택 select box 표시 (기본은 false)
                changeYear: false, // 년선택 selectbox 표시 (기본은 false)
            });
        });
    </script>
    <script>
    	<?php if ($msg == "s") { ?>
    		toast('등록이 완료되었습니다.', false, 'info');
    	<?php } else if ($msg == "u") { ?>
    		toast('수정이 완료되었습니다.', false, 'info');
    	<?php } else if ($msg == "d") { ?>	
    		toast('삭제가 완료되었습니다.', false, 'info');
    	<?php  }else if ($msg == "de") { ?>
    		toast('현재 로그인 중인 아이디는 삭제 불가능합니다.', true, 'danger');
    	<?php } else if ($msg == "o") { ?>
    		toast('이미 사용중인 아이디입니다.', true, 'danger');
    	<?php } else if ($msg == "e") { ?>
    		toast('입력 값이 잘못 되었거나, 에러가 발생했습니다. 잠시 후 다시 시도해주세요.', true, 'danger');
    	<?php } ?>
    </script>
    <div class="content user">
    	<?php
		    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
		    $w = Authori::get_list()['data']->write; // 쓰기 권한
		    $m = Authori::get_list()['data']->modify; // 쓰기 권한
		    $d = Authori::get_list()['data']->delete; // 삭제 권한
    	?>
    	<!-- <div class="F-left title-box"><i class="fa fa-credit-card" aria-hidden="true"></i> <?=$title?></div> -->
    	

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
						<option value='ul_nm' <?php if($params['op'] == "ul_nm"){ echo "selected";}?>>사원명</option>
						<option value="id"    <?php if($params['op'] == "id"){ echo "selected";}?>>아이디</option>			
						<option value="tel"   <?php if($params['op'] == "tel"){ echo "selected";}?>>연락처</option>
						<option value="memo"  <?php if($params['op'] == "memo"){ echo "selected";}?>>비고</option>
					</select>		
				</div>
				<div class="input_line w20">
					<input type="text" id="sc" name="sc" autocomplete="off" placeholder="검색어를 입력하세요." value="<?php if (isset($params['sc'])){ echo $params['sc']; } ?>">
				</div>
				<button type="submit">검색</button>
			</dd>
		</dl>
	</div>
    <?php echo form_close(); ?>
	<div class="bottom ">
		<div class="input_zone section">
			<div class="short">
				<h4>사원정보
    					<!-- <button type="button" class="F-right" id="reset"><i class="btn_re_icon" aria-hidden="true"></i></button> -->
    				<div class="F-right btn-box">
    					<button type="button" id="reset"><i class="btn_re_icon" aria-hidden="true"></i></button>
    					<?php if ($w == "Y") { ?>
    						<button class="blue" id="enroll" type="button">
    							<i class="btn_in_icon" aria-hidden="true"></i> 등록
    						</button>
    					<?php } else { ?>
    						<button class="disable" id="d_enroll" type="button" onclick="alert('권한이 없습니다.');">
    							<i class="btn_in_icon" aria-hidden="true"></i> 등록
    						</button>
    					<?php } ?>
    					<?php if ($m == "Y") {?>
    						<button id="mod" type="button" style="display:none;">
    							<i class="btn_ref_icon fa fa-refresh" aria-hidden="true"></i> 수정
    						</button>
    					<?php } else { ?>
    						<button class="disable" id="d_mod" type="button" style="display:none;" onclick="alert('권한이 없습니다.');">
    							<i class="btn_ref_icon fa fa-refresh" aria-hidden="true"></i> 수정
    						</button>
    					<?php } ?>
    					<?php if ($d == "Y") {?>
    						<button type="button" id="del" style="display:none;">
    							<i class="btn_del_icon fa fa-trash" aria-hidden="true"> 삭제</i>
    						</button>
    					<?php } else { ?>
    						<button class="disable" id="d_del" type="button" style="display:none;">
    							<i class="btn_del_icon fa fa-trash" aria-hidden="true"> 삭제</i>
    						</button>
    					<?php } ?>
    				</div>
    			</h4>


				
				<input type="hidden" id="sysyn" value="<?php if(isset($set_value['sysyn'])){ echo $set_value['sysyn']; }?>">
				<div class="form-group">
    					<dl>
    						<dt class="impt">부서/직급</dt>
    						<dd class="half">
								<div class="input_line w48">
									<select name="dpt" id="dpt" title="부서 선택. 필수 선택 항목입니다.">
										<option value=""> :: 부서선택</option>
										<?php foreach ($dpt as $row) :?>
											<option value="<?=$row->dp_uc?>" <?php if (isset($set_value['dp_uc'])) { if ($set_value['dp_uc'] == $row->dp_uc) { echo "selected"; } } ?>><?=$row->dp_name;?></option>
										<?php endforeach ?>
									</select>
								</div>
								<div class="input_line w48">
									<select name="ul_job" id="ul_job" title="직급 선택. 필수 선택 항목입니다.">
										<option value=""> :: 직급선택</option>
										<?php 
										foreach ($ul_job as $row) :
											if ($row->code_sub != '000') {
												?>
												<option value="<?=$row->code_sub;?>" <?php if (isset($set_value['ul_job'])) { if ($set_value['ul_job'] == $row->code_sub) { echo "selected"; } } ?>><?=$row->code_nm?></option>
												<?php 
											}
										endforeach 
										?>
									</select>
								</div>
    						</dd>
    						<dt class="impt">사원 유형</dt>
    						<dd class="half">
								<div class="input_line w48">
									<select name="admin_gb" id="admin_gb" title="사원 유형 선택">
										<option value="N">일반사용자</option>
										<option value="A">최고관리자</option>
									</select>
								</div>
								<div class="input_line w48">
									<select name="ul_gb" id="ul_gb" title="영업 사원으로 등록 완료 시 사원 유형 변경 불가">
										<?php 
										foreach ($ul_gb as $row) :
											if ($row->code_sub != '000') {
												?>
												<option value="<?=$row->code_sub;?>" <?php if (isset($set_value['ul_gb'])) { if ($set_value['ul_gb'] == $row->code_sub) { echo "selected"; } } ?>><?=$row->code_nm?></option>
												<?php 
											}
										endforeach 
										?>
									</select>
								</div>
    						</dd>
    					</dl>							
    					<dl>			
    						<dt class="impt">로그인계정(ID)</dt>
    						<dd class="half">
								<div class="input_line">
									<input type="text" autocomplete="off" id="id" onKeyup="this.value=this.value.replace(/[^a-z0-9]/gi,'');" 
									value="<?php if (isset($set_value['id'])) { echo $set_value['id']; }?>" title="아이디 입력. 필수 입력 항목입니다.">
								</div>
    						</dd>
    						<dt class="impt">사원명(한글)</dt>
    						<dd class="half">
								<div class="input_line">
    								<input type="text" autocomplete="off" id="ul_nm" 
                                	value="<?php if (isset($set_value['ul_nm'])) { echo $set_value['ul_nm']; }?>" title="사원명 입력. 필수 입력 항목입니다.">
								</div>
    						</dd>
    					</dl>				
    					<dl>
    						<dt class="impt" id="pwd_tx">비밀번호</dt>
    						<dd class="half">
								<div class="input_line">
                                	<input type="password" autocomplete="off" class="" id="pwd" title="비밀번호 입력. 필수 입력 항목입니다. (6자리 이상 입력)">
								</div>
							</dd>
    						<dt class="impt" id="pwdck_tx">비밀번호확인</dt>
    						<dd class="half">
								<div class="input_line">
									<input type="password" autocomplete="off" class="" id="pwdck" title="비밀번호 확인 입력. 입력하신 비밀번호와 동일해야합니다.">
								</div>
							</dd>
    					</dl>
    					<dl>
    						<dt>연락처</dt>
    						<dd class="half">
								<div class="input_line">
									<input type="text" autocomplete="off" class="" id="tel" 
									onKeyup="this.value=this.value.replace(/[^0-9-]/g,'');" value="<?php if (isset($set_value['tel'])) { echo $set_value['tel']; }?>">
								</div>
							</dd>
    						<dt>이메일 주소</dt>
    						<dd class="half">
								<div class="input_line">
    								<input type="text" autocomplete="off" class="" id="email" value="<?php if (isset($set_value['email'])) { echo $set_value['email']; }?>">
								</div>
							</dd>
    					</dl>
    					<dl>
    						<dt>우편번호</dt>
    						<dd>
								<div class="input_line w20">
									<input type="hidden" id="sample6_postcode" >
									<input type="hidden" id="sample6_extraAddress">
									
									<input type="text" id="post_code" class="gray readonly" autocomplete="off" 
									value="<?php if (isset($set_value['biz_code'])) { echo $set_value['biz_code']; }?>" title="주소 입력. 검색 버튼은 활용하여 입력하세요."
									onclick="javascript:daum_postcode('post_code', 'addr', 'addr_detail');">
								</div>
								<button type="button" onclick="javascript:daum_postcode('post_code', 'addr', 'addr_detail');">검색</button>
							</dd>
    					</dl>
    					<dl>
    						<dt>주소</dt>
    						<dd>
								<div class="input_line">
    							<input type="text" id="addr" class="gray readonly" autocomplete="off" value="<?php if (isset($set_value['address'])) { echo $set_value['address']; }?>" title="주소 입력. 검색 버튼은 활용하여 입력하세요.">
								</div>
							</dd>	
    					</dl>
    					<dl>
    						<dt>상세주소</dt>
    						<dd>
								<div class="input_line">
    							<input type="text" autocomplete="off" id="addr_detail" value="<?php if (isset($set_value['addr_detail'])) { echo $set_value['addr_detail']; }?>" title="상세주소 입력">
								</div>
							</dd>	
    					</dl>
    					<dl>
    						<dt>비고</dt>
    						<dd>
								<div class="input_line">
    							<input type="text" autocomplete="off" id="memo" value="<?php if (isset($set_value['memo'])) { echo $set_value['memo']; }?>" title="비고 입력">
								</div>
							</dd>
    					</dl>	
    					<dl>
    						<dt>입사일자</dt>
    						<dd class="half">
                                <div class="date_line w110p">
    								<input type="text" class="datepicker readonly w80" id="in_dt" autocomplete="off" value="<?php if (isset($set_value['in_dt'])) { echo $set_value['in_dt']; }?>" title="입사일자 선택">
								</div>
							</dd>
    						<dt>퇴사일자</dt>
    						<dd class="half">
                                <div class="date_line w110p">
    								<input type="text" class="datepicker2 datepick readonly w80" id="out_dt" autocomplete="off" value="<?php if (isset($set_value['out_dt'])) { echo $set_value['out_dt']; }?>" title="퇴사일자 선택">
								</div>
							</dd>	
    					</dl>
    					<dl>
    						<dt>급여통장</dt>
    						<dd>
								<div class="input_line w25">
									<select id="bank_cd" title="은행 선택">
										<option value="">은행선택</option>
										<?php 
										foreach ($bank as $row) :
											if ($row->code_sub != '000') {
												?>
												<option value="<?=$row->code_sub;?>" <?php if (isset($set_value['bank_cd'])) { if($set_value['bank_cd'] == $row->code_sub){ echo "selected"; } } ?>><?=$row->code_nm?></option>
												<?php 
											}
										endforeach 
										?>
									</select>
								</div> 
								<div class="input_line w40">
    								<input type="text" id="bank_no" autocomplete="off" autocomplete="off" onKeyup="this.value=this.value.replace(/[^0-9-]/g,'');" value="<?php if (isset($set_value['bank_no'])) { echo $set_value['bank_no']; }?>" title="계좌번호 입력">
								</div> 
							</dd>
    					</dl>
    					<dl>
    						<dt class="impt">계정상태</dt>
    						<dd>
								<div class="input_line w20">
									<select id="useyn">
										<option value="Y" <?php if (isset($set_value['useyn'])) { if ($set_value['useyn'] == "Y") { echo "selected"; } }?>>사용가능</option>
										<option value="N" <?php if (isset($set_value['useyn'])) { if ($set_value['useyn'] == "N") { echo "selected"; } }?>>사용불가</option>
									</select>
								</div>
    						</dd>
    					</dl>
				</div>
				
                <p class='imptp'><span>*</span> 은 필수 입력 항목입니다.</p>
			</div>


				
			<div class="long">
				<h4>
    				화면별 권한 상세설정
    				<input type="checkbox" name="all_chk" id="all_chk">
    				<label for="all_chk" class="all_chk">전체허용</label>
    			</h4>
    			<div class="table_wrap ">
    				<div class="n-scroll">
    					<table class="set-table authority ati">
    						<thead>
    							<tr>
    								<th scope="col" rowspan="2" class="w30">메뉴명</th>
    								<th scope="col" class="">접근권한</th>
    								<th scope="col" colspan="3" class="">작업권한</th>
    							</tr>
    							<tr>
    								<th class="">
    									<input type="checkbox" id="look" name="look" value="Y">
    									<label for="look"></label> <label for="look">조회</label>
    								</th>
    								<th class="">
    									<input type="checkbox" id="input" name="input" value="Y">
    									<label for="input"></label> <label for="input">입력</label>
    								</th>
    								<th class="">
    									<input type="checkbox" id="modify" name="modify" value="Y">
    									<label for="modify"></label> <label for="modify">수정</label>
    								</th>
    								<th class="">
    									<input type="checkbox" id="delete" name="delete" value="Y">
    									<label for="delete"></label> <label for="delete">삭제</label>
    								</th>
    							</tr>
    						</thead>
    					</table>
    				</div>
    				<div class="h-scroll mCustomScrollbar">
    					<?php $attributes2 = array('id' => 'frm2', 'method' => 'post', 'accept-charset' => 'utf-8'); ?>				
    					<?php echo form_open('/base/user/v', $attributes2);?>
    					<input type="hidden" id="p" name="p" value="in">
    					<input type="hidden" id="p_op" name="p_op">
    					<input type="hidden" id="p_sc" name="p_sc">
    					<input type="hidden" id="p_dp_uc" name="p_dp_uc" value="<?php if (isset($set_value['dp_uc'])) { echo $set_value['dp_uc']; }?>">
    					<input type="hidden" id="p_ul_uc" name="p_ul_uc" value="<?php if (isset($set_value['ul_uc'])) { echo $set_value['ul_uc']; } else { echo "n"; }?>">
    					<input type="hidden" name="p_ul_nm" id="p_ul_nm">
    					<input type="hidden" name="p_ul_gb" id="p_ul_gb">
    					<input type="hidden" name="p_ul_job" id="p_ul_job">
    					<input type="hidden" name="p_admin_gb" id="p_admin_gb">
    					<input type="hidden" name="p_id" id="p_id">
    					<input type="hidden" name="p_pass" id="p_pass">
    					<input type="hidden" name="p_tel" id="p_tel">
    					<input type="hidden" name="p_email" id="p_email">
    					<input type="hidden" name="p_biz_code" id="p_biz_code">
    					<input type="hidden" name="p_address" id="p_address">
    					<input type="hidden" name="p_addr_detail" id="p_addr_detail">
    					<input type="hidden" name="p_in_dt" id="p_in_dt">
    					<input type="hidden" name="p_out_dt" id="p_out_dt">
    					<input type="hidden" name="p_bank_cd" id="p_bank_cd">
    					<input type="hidden" name="p_bank_no" id="p_bank_no">
    					<input type="hidden" name="p_memo" id="p_memo">
    					<input type="hidden" name="p_useyn" id="p_useyn">
    					<input type="hidden" name="p_look" id="p_look">
    					<input type="hidden" name="p_input" id="p_input">
    					<input type="hidden" name="p_modify" id="p_modify">
    					<input type="hidden" name="p_delete" id="p_delete">
    					<table class="set-table authority ati">
							<colgroup>
								<col width='30%'>
								<col width=''>
								<col width=''>
								<col width=''>
								<col width=''>
							</colgroup>
    						<tbody>
    							<?php foreach ($head as $hrow) :?>
    								<tr>
    									<td class="T-left set-title" colspan='5'>※ <?=$hrow->cm_nm;?></td>
    								</tr>
    								<?php foreach ($pgm_id as $row) :?>
    									<?php if ($row->head_id == $hrow->pgm_id) {?>
    										<tr>
    											<td scope="col"  class="T-left pad w30"><?=$row->cm_nm;?></td>
    											<td scope="col"  class="">
    												<input type="checkbox" id="look<?=$row->pgm_id;?>" name="sel[<?=$row->pgm_id?>]" value="read" data-pro='<?=$row->pgm_id;?>' <?php if (set_value('sel['.$row->pgm_id.']') == "read") { echo "checked"; }?>>
    												<label for="look<?=$row->pgm_id;?>"></label>
    											</td>
    											<td scope="col"  class="">
    												<input type="checkbox" id="input<?=$row->pgm_id;?>" name="input[<?=$row->pgm_id?>]" value="write" data-pro='<?=$row->pgm_id;?>' <?php if (set_value('input['.$row->pgm_id.']') == "write") { echo "checked"; }?>>
    												<label for="input<?=$row->pgm_id;?>"></label>
    											</td>
    											<td scope="col"  class="">
    												<input type="checkbox" id="modify<?=$row->pgm_id;?>" name="edit[<?=$row->pgm_id?>]" value="modify" data-pro='<?=$row->pgm_id;?>' <?php if (set_value('edit['.$row->pgm_id.']') == "modify") { echo "checked"; }?>>
    												<label for="modify<?=$row->pgm_id;?>"></label>
    											</td>
    											<td scope="col"  class="">
    												<input type="checkbox" id="delete<?=$row->pgm_id;?>" name="del[<?=$row->pgm_id?>]" value="delete" data-pro='<?=$row->pgm_id;?>' <?php if (set_value('del['.$row->pgm_id.']') == "delete") { echo "checked"; }?>>
    												<label for="delete<?=$row->pgm_id;?>"></label>
    											</td>
    											<td class="" style="display:none;">
    												<input type="checkbox" id="admin<?=$row->pgm_id;?>" name="admin[<?=$row->pgm_id?>]" value="admin" data-pro='<?=$row->pgm_id;?>' <?php if (set_value('admin['.$row->pgm_id.']') == "admin") { echo "checked"; }?>>
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
    				<span style="font-size: 12px; font-family:'Malgun Gothic'; color:red;"><?=validation_errors();?></span>
    			</div>
				<div class=" btn-box">
    					<?php if ($w == "Y") { ?>
    						<button class="blue" id="enroll" type="button">등록</button>
    					<?php } else { ?>
    						<button class="disable" id="d_enroll" type="button" onclick="alert('권한이 없습니다.');">
    							등록
    						</button>
    					<?php } ?>
    					<?php if ($d == "Y") {?>
    						<button type="button" id="del" style="display:none;">
    							삭제
    						</button>
    					<?php } else { ?>
    						<button class="disable" id="d_del" type="button" style="display:none;">
    							삭제
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
			<h4>사용자 리스트 </h4>
			<div class="table-wrap">
				<div class="n-scroll">
					<table class="set-table" >
						<thead>
							<tr>
								<th class="w6">순번</th>
								<th class="w7">부서</th>
								<th class="w6">직급</th>
								<th class="w7">사원코드</th>
								<th class="">사원명(ID)</th>
								<th class="w13">등록자명(ID)</th>
								<th class="w13">등록일시</th>
								<th class="w13">수정자명(ID)</th>
								<th class="w13">수정일시</th>
								<th class="w7">가용여부</th>
							</tr>
						</thead>
					</table>
				</div>
				<div class="h-scroll mCustomScrollbar">
					<table class='hovering'>
						<tbody class="at ac">
							<?php if (empty($list)) { ?>
								<tr>
									<td colspan="10">조회가능한 데이터가 없습니다.</td>
								</tr>								
							<?php } else { ?>
								<?php foreach ($list as $row): ?>
									<tr id="list_<?=$row->ul_uc;?>">
										<td class="w6"><?=$row->rownum;?></td>
										<td class="w7 Elli"><?=$row->dp_name;?></td>
										<td class="w6 Elli"><?=$row->gb_name;?></td>
										<td class="w7 tb_click Elli" onclick="get_user('<?=$row->ul_uc;?>', '<?=$row->dp_uc;?>', '<?=$row->sysyn?>')"><?=$row->ul_cd;?></td>
										<td class=" tb_click Elli" onclick="get_user('<?=$row->ul_uc;?>', '<?=$row->dp_uc;?>', '<?=$row->sysyn?>')" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
											<?=$row->ul_nm;?>(<?=$row->id;?>)
										</td>
										<td class="w13 Elli">
											<?=$this->common->get_column('z_plan.user_list', $row->reg_ikey, 'ul_nm');?>
											(<?=$this->common->get_column('z_plan.user_list', $row->reg_ikey, 'id'); ?>)
										</td>
										<td class="w13 Elli"><?=$row->reg_dt?></td>
										<td class="w13 Elli">
											<?php if ($row->mod_ikey != "") { ?>
												<?=$this->common->get_column('z_plan.user_list', $row->mod_ikey, 'ul_nm'); ?>
												(<?=$this->common->get_column('z_plan.user_list', $row->mod_ikey, 'id'); ?>)
											<?php } ?>
										</td>
										<td class="w13 Elli"><?=$row->mod_dt?></td>
										<td class="w7">
											<label class="switch" style="cursor: pointer;">
												<input type="checkbox" name="useyn" id="<?=$row->ul_uc;?>" data-list="Y" data-use="<?=$row->useyn;?>" <?=$row->useyn == "Y" ? "checked" : ""; ?> disabled>
												<span class="slider round"></span>
											</label>
										</td>
									</tr>
								<?php endforeach ?>
							<?php } ?>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

    <div class="total">
        <ul>
            <li class='T-right'>총 검색 : <strong><?php echo ($total_count) ? number_format($total_count):0; ?></strong><span>건</span></li>
        </ul>
    </div>
	<!-- <ul class="pagination">
		<li class="page-item"><?php echo $links;?></li>
	</ul> -->
</div>

<!--Loading image popup 2020/08/25 추가 김원명-->
<div id="loading" style="display:none;">
	<img id="loading-image" src="/public/img/loading.gif"/>
</div>
<script>
	$(function() {
		$('div.split-pane').splitPane();
		$(".custom-scroll").mCustomScrollbar({
			mouseWheel:{ scrollAmount: 100 }
		});
	});
</script>
<script>
	$('.set-table th.change').parent('tr').addClass('bb');

	$('.ati td').click(function(){
		$('.ati td').removeClass('chan');
		$(this).addClass('chan');
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