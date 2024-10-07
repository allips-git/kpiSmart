<?php // 공정라우터 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/router.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">
<script>
	$(function() {
        // 주문일, 출고일 기본날짜 세팅
        $(".datepicker").datepicker({
        	dateFormat: 'yy-mm-dd',
        	showOn: 'button',
            buttonImage: '/public/img/calender_img.png', // 달력 아이콘 이미지 경로
            buttonImageOnly: true, //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false, // 월선택 select box 표시 (기본은 false)
            changeYear: false // 년선택 selectbox 표시 (기본은 false)
        }).datepicker(); // today setting
    });
</script>
<?php
    $w = Authori::get_list()['data']->write; 	// 등록 권한
    $m = Authori::get_list()['data']->modify; 	// 수정 권한
    $d = Authori::get_list()['data']->delete; 	// 삭제 권한
?>
<div class="content router">
	<?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
		<div class="section search_zone">
			<dl>
				<dt>
					<span>검색</span>
				</dt>
				<dd>
					<div class="input_line w8">
						<select id="keyword" name="keyword">
							<option value="m.pc_nm">라우팅명</option>
							<option value="m.pc_cd">라우팅코드</option>
						</select>
					</div>
					<div class="input_line w20">
						<input type="text" id="content" name="content" placeholder="검색어를 입력하세요." autocomplete="off">
					</div>
					<div class="input_line w8">
						<select id="useyn" name="useyn">
							<option value="">가용여부_전체</option>
							<option value="Y" selected>사용가능</option>
							<option value="N">사용불가</option>
						</select>
					</div>
				</dd>
			</dl>
		</div>
	</form>
	
	<div class="bottom">
		<div class="list_zone section list_zone01 w100">
			<h4>라우팅 목록</h4>
			<div class="btns">
				<?php if($w == "Y") { ?>
					<button type="button" class="blue add_router">라우팅 등록</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">품목 추가</button>
                <?php } ?>
			</div>
			<div class="n-scroll">
				<table class="hovering">
					<thead>
						<tr>
							<th class="w4">순번</th>
                            <th class="w7">라우팅 코드</th>
                            <th>라우팅 명</th>
                            <th class="w6">공정(수)</th>
                            <th>비고</th>
                            <th class="w6">가용여부</th>
                            <th class="w30"></th>
						</tr>
					</thead>
                </table>
            </div>
            <div class="h-scroll">
                <table class="at">
					<tbody id="data-container">
						<?php // js ?>
					</tbody>
				</table>
			</div>
		</div>
        <div class="list_zone list_zone02 section w100">
			<h4>공정 리스트</h4>
			<div class="btns" id="div_mod" style="display: none;">
				<?php if($d == "Y") { ?>
            		<button type="button" class="red btn_del">라우팅 삭제</button>
		        <?php } else{ ?>
		            <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">라우팅 삭제</button>
		        <?php } ?>
		        &nbsp;&nbsp;
		        <?php if($m == "Y") { ?>
            		<button type="button" class="blue mod_router">라우팅 수정</button>
		        <?php } else{ ?>
		            <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">라우팅 수정</button>
		        <?php } ?>
			</div>
            <div class="n-scroll">
				<table class="hovering">
					<thead>
						<tr>
							<th class="w4">순번</th>
                            <th class="w5">공정 코드</th>
                            <th class="w6">공정 유형</th>
                            <th>공정명</th>
                            <th class="w6">작업 순서</th>
                            <th class="w8">실적 등록</th>
                            <th>비고</th>
                            <th class="w8">등록자명(ID)</th>
                            <th class="w8">등록일시</th>
                            <th class="w8">수정자명(ID)</th>
                            <th class="w8">수정일시</th>
                            <th class="w5">가용여부</th>
						</tr>
					</thead>
                </table>
            </div>
            <div class="h-scroll">
                <table>
					<tbody id="sub-container">
						<tr>
		                	<td colspan="11">라우팅 목록 선택 후 조회 가능합니다.</td>
		                </tr>
					</tbody>
				</table>
			</div>
        </div>
	</div>
    <div class="total">
        <ul>
            <li class='T-right'>총 검색 : <strong id="list_cnt">2</strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/food/routing.js?<?=time();?>"></script>
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
