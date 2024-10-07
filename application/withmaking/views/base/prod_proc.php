<?php // 공정 등록 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/loading.css">
<link rel="stylesheet" href="/public/css/food/proc.css?<?=time()?>">

<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write; // 쓰기 권한
    $m = Authori::get_list()['data']->modify; // 수정 권한
    $d = Authori::get_list()['data']->delete; // 삭제 권한
?>
<div class="proc content">
    <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
        <div class="search_zone section01 section">
            <dl>
                <dt>검색</dt>
                <dd>
                    <div class="input_line w10">
                        <select class="keyword" name="keyword">
                            <option value="p.pp_nm">공정명</option>
                            <option value="p.pp_cd">공정코드</option>
                            <option value="p.memo">비고</option>
                        </select>
                    </div>
                    <div class="input_line w20">
                        <input type="text" id="content" class="content" name="content" autocomplete="off" placeholder="검색어를 입력하세요.">
                    </div>
                    <div class="input_line w10">
                        <?php if(count($pp_gb) > 0) { ?>
                            <select class="pp_gb" name="pp_gb">
                                <option value="">공정_선택</option>
                                <?php foreach($pp_gb as $row) :?>
                                    <option value="<?= $row->code_sub ?>"><?= iconv_substr($row->code_nm,0,2) ?></option>
                                <?php endforeach ?>
                            </select>
                        <?php } ?>
                    </div>
                    <div class="input_line w10">
                        <select class="useyn" name="useyn">
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
        <?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
        <?php echo form_open($site_url."/v", $attributes); ?>
        <input type="hidden" id="p" class="p" name="p" value="in">
        <input type="hidden" id="ikey" class="ikey" name="ikey" value="">
        <input type="hidden" id="page" name="page" value="">
        <div class="input_zone section">
            <div class="input_wrap">
            <h4>공정 정보 입력
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
                <dl class="w60">
                    <dt class="impt">공정유형</dt>
                    <dd>
                        <div class="input_line">
                            <?php if(count($pp_gb) > 0) { ?>
                                <select id="pp_gb" name="pp_gb">
                                    <?php foreach($pp_gb as $row) :?>
                                        <option value="<?= $row->code_sub ?>"><?= $row->code_nm ?></option>
                                    <?php endforeach ?>
                                </select>
                            <?php } ?>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">공정명</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" id="pp_nm" name="pp_nm" autocomplete="off" required>
                        </div>
                    </dd>
                </dl>
                <dl class="w60">
                    <!-- 검사 전체 진행으로 선택항목 삭제. 김민주 - 2022/07/01
                    <dt class="impt">품질검사</dt>
                    <dd>
                        <div class="input_line">
                            <select id="pp_qa" name="pp_qa">
                                <option value="Y">사용</option>
                                <option value="N" selected>미사용</option>
                            </select>
                        </div>
                    </dd> -->
                    <dt class="impt">실적등록</dt>
                    <dd>
                        <div class="input_line">
                            <select id="pp_hisyn" name="pp_hisyn">
                                <option value="Y">사용</option>
                                <option value="N">미사용</option>
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl class="bgo">
                    <dt>비고</dt>
                    <dd>
                        <div class="input_line">
                            <textarea id="memo" name="memo" cols="30" rows="10"></textarea>
                        </div>
                    </dd>
                </dl>
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
            <h2>공정 리스트</h2>
            <div class="btns">
                <button type="button" class="blue notused_btn">비가동 유형 등록</button>
                <button type="button" class="blue flaw_btn">불량 유형 등록</button>
            </div>
            <div class="list_wrap">
                <div class="n-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th class="w6">순번</th>
                                <th class="w8">공정코드</th>
                                <th class="w8">공정유형</th>
                                <th>공정명</th>
                                <th class="w8">실적등록</th>
                                <th class="w30">비고</th>
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

<script src="/public/js/food/prod_proc.js?<?=time();?>"></script>
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