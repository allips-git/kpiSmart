<?php // 제조 오더 수정 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/pr.css?<?=time()?>">
<style>
    .job_mod tr th.impt::after{
        content: '*';
        color: #dc0000;
        margin-left: 0.5rem;
    }
</style>
<script>
    $(function() {
        // 주문일, 출고일 기본날짜 세팅
        $(".datepicker").datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false,                              // 년선택 selectbox 표시 (기본은 false)
        }).datepicker("setDate", new Date());               // today setting
    });
</script>
<?php
    $w = Authori::get_list()['data']->write;    // 등록 권한
    $m = Authori::get_list()['data']->modify;   // 수정 권한
    $d = Authori::get_list()['data']->delete;   // 삭제 권한
?>
<div class="content job_ord job_reg job_mod">
    <?php $attributes = array("id" => "frm_mod", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
    <?php echo form_open($site_url."/v", $attributes); ?>
    <input type="hidden" id="p" name="p" value="up">
    <input type="hidden" id="ikey" name="ikey" value="">
    <input type="hidden" id="item_cd" name="item_cd" value="">
    <input type="hidden" id="unit_amt" name="unit_amt" value="">
    <div class="section search_zone">
        <h4 class="w100">제조 오더 수정</h4>
        <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
        <dl class="w25">
            <dt class="impt">지시일자</dt>
            <dd>
                <div class="date_line w120p">
                    <input type="text" id="job_dt" class="datepicker w80 readonly" name="job_dt" onclick="javascript:call_date(this);" Auto required>
                </div>
            </dd>
        </dl>
        <dl class="w37">
            <dt class = "impt">제조 오더 번호</dt>
            <dd>
                <div class="input_line w40">
                    <input type="text" id="job_no" class="gray readonly" name="job_no" value="" Auto>
                </div>
            </dd>
        </dl>
        <dl class="w37">
            <dt>상태</dt>
            <dd>
                <div class="input_line w20">
                    <select id="state" name="state">
                        <option value="001">접수</option>
                        <option value="002">대기</option>
                    </select>
                </div>
            </dd>
        </dl>
        <dl class="w25">
            <dt class="impt">제품명</dt>
            <dd>
                <div class="input_line w80">
                    <input type="text" id="item_nm" class="gray readonly" name="item_nm" value="" Auto>
                </div>
            </dd>
        </dl>
     <!-- <dl class="w37">
            <dt class="impt">작업장</dt>
            <dd>
                <div class="input_line w40">
                    <select id="wokr_place" name="wp_uc">
                    <?php if(count($wp_uc) > 0) { ?>
                            <?php foreach($wp_uc as $row) :?>
                                <option value="<?= $row->wp_uc ?>"><?= $row->wp_nm ?></option>
                            <?php endforeach ?>
                        <?php } else { ?>
                            <option value="" disabled>작업장 등록 후 사용가능</option>
                        <?php } ?>
                    </select>
                </div>
            </dd>
        </dl> -->
        <input type ="hidden" name="wp_uc" value ="KR13-WP-01"/>
        <dl class="w37">
            <dt class="impt">지시 수량</dt>
            <dd>
                <div class="input_line w20">
                    <input type="text" id="job_qty" class="T-right" name="job_qty" value="" Auto oninput="calculation();" numberOnly>
                </div>
            </dd>
        </dl>
        <dl class="w25">
            <dt>규격/단위</dt>
            <dd>
                <div class="input_line w50">
                    <input type="text" id="unit" class="gray readonly" placeholder="" Auto>
                </div>
            </dd>
        </dl>
        <dl class="w25">
            <dt>공장지시</dt>
            <dd>
                <div class="input_line w50">
                    <input type="text" id="fac_text" name="fac_text" value="" Auto>
                </div>
            </dd>
        </dl>
        <dl class="w37">
            <dt>비고</dt>
            <dd>
                <div class="input_line w50">
                    <input type="text" id="memo" class="w100" name="memo" value="" Auto>
                </div>
            </dd>
        </dl>

        <dl class="w30">
            <dt>아이디</dt>
            <dd>
                <div class="input_line w40">
                    <input type="text" id="id"  name="id" value="" Auto>
                </div>
            </dd>
        </dl>

        <dl class="w25">
            <dt>비밀번호</dt>
            <dd>
                <div class="input_line w40">
                    <input type="text" id="pw"  name="pw" value="" Auto>
                </div>
            </dd>
        </dl>

        <dl class="w37">
            <dt>조종기 관리번호</dt>
            <dd>
                <div class="input_line w40">
                    <input type="input" id="con_nm"  name="con_nm" value="" Auto>
                </div>
            </dd>
        </dl>
        
	</div>
	
	<div class="bottom">
		<div class="list_zone section">
            <input type="radio" id="tab01" name="tab" checked>
            <label for="tab01" class="tab01">공정리스트</label>
            <input type="radio" id="tab02" name="tab">
            <label for="tab02" class="tab02">BOM리스트</label>
            <div class="tabbox01 tabbox">
                <!-- <div class="btns">
                    <button type="button" id="btn_add" class="blue btn_add">품목 추가</button>
                </div> -->
                <div class="n-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th class="w4">순번</th>
                                <th class="w4">공정#</th>
                                <th class="w6">공정 코드</th>
                                <th class="w6">공정 유형</th>
                                <th class="w17">공정명</th>
                                <th class="w7">실적 등록</th>
                                <th class="impt w7">목표 실적</th>
                                <th class="impt w8">담당자</th>
                                <th class="impt w7">일 작업시간</th>
                                <th class="impt w7">투입인원</th>
                                <th class="">비고</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="h-scroll">
                    <table id="tb_list">
                        <tbody id="data-container">
                            <tr>
                                <td colspan="11">제품 선택 후 조회 가능합니다.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="tabbox02 tabbox">
                <!-- <div class="btns">
                    <button type="button" id="btn_add" class="blue btn_add">품목 추가</button>
                </div> -->
                <div class="n-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th class="w4">순번</th>
                                <th class="w4">공정#</th>
                                <th class="w12">투입공정명</th>
                                <th class="w7">품목코드</th>
                                <th>품목명</th>
                                <th class="w8">품목 유형</th>
                                <th class="w8">규격(단위)</th>
                                <th class="w7">기본 소요량</th>
                                <th class="w7">매입 단가(원)</th>
                                <th class="w7">소요량 예측</th>
                                <th class="w7">1EA 소요원가(원)</th>
                                <th class="w10">기본 창고</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="h-scroll">
                    <table id="sub_table">
                        <tbody id="sub-container">
                            <tr>
                                <td colspan="10">제품 선택 후 조회 가능합니다.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
		</div>
	</div>
    <div class="total">
        <ul>
            <li class="T-right">총 공정 : <strong id="list_count">0</strong><span>라인</span></li>
        </ul>
    </div>
    <div class="btn_wrap div_mod">
        <button type="button" id="btn_list" class="gray">목록</button>
        <?php if($d == "Y") { ?>
            <button type="button" class="red btn_del">삭제하기</button>
        <?php } else{ ?>
            <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">삭제하기</button>
        <?php } ?>
        &nbsp;&nbsp;
        <?php if($m == "Y") { ?>
            <button type="button" class="blue btn_mod">수정하기</button>
        <?php } else{ ?>
            <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">수정하기</button>
        <?php } ?>
    </div>
    <div class="btn_wrap div_close" style="display: none;">
        <button type="button" class="btn_list gray" onclick="window.location.href='/pr/job_ord'">목록</button>
    </div>
    <?php echo form_close(); ?>
</div>

<script src="/public/js/food/common_select2.js?<?=time();?>"></script>
<script src="/public/js/food/common_job.js?<?=time();?>"></script>
<script src="/public/js/food/job_mod.js?<?=time();?>"></script>
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
