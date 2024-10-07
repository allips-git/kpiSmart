<?php // 설비 등록 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/loading.css">
<link rel="stylesheet" href="/public/css/food/whouse.css?<?=time()?>">

<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write; // 쓰기 권한
    $m = Authori::get_list()['data']->modify; // 수정 권한
    $d = Authori::get_list()['data']->delete; // 삭제 권한
?>

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
    
<div class="whouse machine content">
    <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
        <div class="search_zone section01 section">
            <dl>
                <dt>검색</dt>
                <dd>
                    <div class="input_line w10">
                        <select id="keyword" name="keyword">
                            <option value="w.mc_nm">설비명</option>
                            <option value="w.mc_cd">설비코드</option>
                        </select>
                    </div>
                    <div class="input_line w20">
                        <input type="text" id="content" name="content" autocomplete="off" placeholder="검색어를 입력하세요.">
                    </div>
                    <div class="input_line w10">
                        <?php if(count($mc_gb) > 0) { ?>
                                <select id="mc_gb" name="mc_gb">
                                    <option value="">설비유형_전체</option>
                                    <?php foreach($mc_gb as $row) :?>
                                        <option value="<?= $row->code_sub ?>"><?= $row->code_nm ?></option>
                                    <?php endforeach ?>
                                </select>
                            <?php } ?>
                    </div>
                    <div class="input_line w10">
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
        <?php $attributes = array("id" => "frm_reg", "method" => "post", "enctype" => "multipart/form-data", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
        <?php echo form_open_multipart($site_url.'/v', $attributes); ?>
        <input type="hidden" id="p" class="p" name="p" value="in">
        <input type="hidden" id="ikey" class="ikey" name="ikey" value="">
        <input type="hidden" id="page" name="page" value="">
        <div class="input_zone section">
            <div class="input_wrap">
            <h4>설비 정보 입력
                <button type="button" class="F-right btn_reset"><i class="btn_re_icon" aria-hidden="true"></i></button>
            </h4>
                <dl>
                    <dt class="impt">가용여부</dt>
                    <dd>
                        <input type="radio" id="chk01" class="useyn" name="useyn" value="Y" checked="checked">
                        <label for="chk01">사용가능</label>
                        <input type="radio" id="chk02" class="useyn" name="useyn" value="N">
                        <label for="chk02">사용불가</label>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">설비유형</dt>
                    <dd>
                        <div class="input_line w55">
                            <?php if(count($mc_gb) > 0) { ?>
                                <select id="mc_gb" class="mc_gb" name="mc_gb">
                                    <?php foreach($mc_gb as $row) :?>
                                        <option value="<?= $row->code_sub ?>"><?= $row->code_nm ?></option>
                                    <?php endforeach ?>
                                </select>
                            <?php } ?>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">설비명</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="mc_nm input" name="mc_nm" autocomplete="off" required>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>제조사</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="maker input" name="maker" autocomplete="off">
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>모델명</dt>
                    <dd>
                        <div class="input_line ">
                            <input type="text" class="model_nm input" name="model_nm" autocomplete="off">
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>시리얼번호</dt>
                    <dd>
                        <div class="input_line ">
                            <input type="text" class="serial_no input" name="serial_no" autocomplete="off">
                        </div>
                    </dd>
                </dl>
                <dl class="half">
                    <dt>규격</dt>
                    <dd>
                        <div class="input_line ">
                            <input type="text" class="spec input" name="spec" autocomplete="off">
                        </div>
                    </dd>
                    <dt>구매처</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="buy_corp input" name="buy_corp" autocomplete="off">
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>구매일자</dt>
                    <dd>
                        <div class="date_line w50">
                            <input type="text" class="datepicker readonly w80 buy_dt" id="buy_dt" name="buy_dt" autocomplete="off" value="<?php if (isset($set_value['buy_dt'])) { echo $set_value['buy_dt']; }?>" title="구매일자 선택" onclick="call_date(this)">
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>구매금액</dt>
                    <dd>
                        <div class="input_line w55">
                            <input type="text" class="T-right amt input" name="amt" autocomplete="off" numberOnly>
                        </div>&nbsp; 원
                    </dd>
                </dl>
                <dl class="bgo">
                    <dt>비고</dt>
                    <dd>
                        <div class="input_line">
                            <textarea class="memo input" name="memo" cols="30" rows="10"></textarea>
                        </div>
                    </dd>
                </dl>
                <!-- 개발 일정 부족으로 미구현 주석. 김민주 2022/09/07 -->
                <!-- <dl class="div_reg">
                    <dt>첨부파일</dt>
                    <dd>
                        <input type="file" id="file1" class="w100" name="file1">
                    </dd>
                </dl>
                <dl class="file_name div_mod" style="display:none;">
                    <dt>등록된 파일</dt>
                    <dd>
                        <div class="input_line">
                            <a href="#" id="file_nm1"></a>
                        </div>
                    </dd>
                </dl> -->
                <p class='imptp'><span>*</span> 은 필수 입력 항목입니다.</p>
            </div>
            <div class="btn_wrap div_reg">
                <?php if($w == "Y") { ?>
                    <button type="button" class="btn_reg">등록</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">등록</button>
                <?php } ?>
            </div>
            <div class="btn_wrap div_mod" style="display: none;">
                <?php if($d == "Y") { ?>
                    <button type="button" class="btn_del gray">삭제</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable gray" onclick="alert('권한이 없습니다.');">삭제</button>
                <?php } ?>
                <?php if($m == "Y") { ?>
                    <button type="button" class="btn_mod">수정</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">수정</button>
                <?php } ?>
            </div>
            <?php echo form_close(); ?>
        </div>
        <div class="list_zone section">
            <h2>설비 리스트</h2>
            <div class="list_wrap">
                <div class="n-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th class="w6">순번</th>
                                <th class="w6">설비코드</th>
                                <th class="w8">설비유형</th>
                                <th>설비명</th>
                                <th class="w12">등록자명(ID)</th>
                                <th class="w12">등록일시</th>
                                <th class="w12">수정자명(ID)</th>
                                <th class="w12">수정일시</th>
                                <th class="w8">가용여부</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div id="table-height" class="h-scroll">
                    <table id="" class="hovering at ac">
                        <tbody id="data-container" class="">
                            <?php // js ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- pagination -->
            <div id="pagination" class="pagination"></div>
            <div class="view_count">
                <select id="page_size">
                    <option value="15">페이지 보기 15</option>
                    <option value="30">페이지 보기 30</option>
                    <option value="50" selected>페이지 보기 50</option>
                    <option value="100">페이지 보기 100</option>
                </select>
            </div>
        </div>
    </div>
    <div class="total">
        <ul>
            <li class='T-right'>총 검색 : <strong id="page_count">0</strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/food/machine.js?<?=time();?>"></script>
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