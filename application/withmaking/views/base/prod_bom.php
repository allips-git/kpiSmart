<?php // 제조 BOM관리 페이지 ?>
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
    $w = Authori::get_list()['data']->write;    // 등록 권한
    $m = Authori::get_list()['data']->modify;   // 수정 권한
    $d = Authori::get_list()['data']->delete;   // 삭제 권한
?>
<div class="content router bom">
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
    						<option value="i.item_nm">제품명</option>
    						<option value="m.item_cd">제품코드</option>
    						<option value="m.memo">비고</option>
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
			<h4>제품 리스트</h4>
			<div class="btns">
				<button type="button" class="blue bom_btn">BOM 등록</button>
			</div>
			<div class="n-scroll">
				<table>
					<thead>
						<tr>
							<th class="w4">순번</th>
                            <th class="w7">제품코드</th>
                            <th class="w7">제품유형</th>
                            <th>제품명</th>
                            <th class="w10">규격(단위)</th>
                            <th class="w6">공정(수)</th>
                            <th class="w6">BOM(수)</th>
                            <th>비고</th>
                            <th class="w6">가용여부</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="h-scroll mCustomScrollbar">
				<table id="" class="hovering ac">
					<tbody id="data-container">
                        <?php // js ?>
					</tbody>
				</table>
			</div>
		</div>
        <div class="list_zone list_zone02 section w100">
			<h4>BOM 리스트</h4>
            <div class="btns" id="div_mod" style="display: none;">
				<?php if($d == "Y") { ?>
            		<button type="button" class="red btn_del">BOM 삭제</button>
		        <?php } else{ ?>
		            <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">BOM 삭제</button>
		        <?php } ?>
		        &nbsp;&nbsp;
		        <?php if($m == "Y") { ?>
            		<button type="button" class="blue bom_mod">BOM 수정</button>
		        <?php } else{ ?>
		            <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">BOM 수정</button>
		        <?php } ?>
			</div>
            <div class="n-scroll">
				<table>
					<thead>
						<tr>
							<th class="w4">순번</th>
							<th class="w4">공정#</th>
                            <th class="w15">투입공정명</th>
                            <th class="w10">품목코드</th>
                            <th>품목명</th>
                            <th class="w8">품목유형</th>
                            <th class="w8">규격(단위)</th>
                            <th class="w7">소요량</th>
                            <th class="w7">매입 단가(원)</th>
                            <th class="w7">1EA 소요원가(원)</th>
                            <th class="w6">가용여부</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="h-scroll mCustomScrollbar">
				<table id="" class="hovering ">
					<tbody id="sub-container">
                        <tr>
                            <td colspan="11">제품 목록 선택 후 조회 가능합니다.</td>
                        </tr>
					</tbody>
				</table>
			</div>
        </div>
	</div>
    <div class="total">
        <ul>
            <li class='T-right'>총 제품: <strong id="list_cnt">0</strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/food/prod_bom.js?<?=time();?>"></script>
<script>
	$(function() {
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
