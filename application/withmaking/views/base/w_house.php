<?php // 창고 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">
<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/loading.css">
<link rel="stylesheet" href="/public/css/food/whouse.css?<?=time()?>">
<?php
    $w = Authori::get_list()['data']->write;    // 등록 권한
    $m = Authori::get_list()['data']->modify;   // 수정 권한
    $d = Authori::get_list()['data']->delete;   // 삭제 권한
?>
<div class="whouse content">
    <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
        <div class="search_zone section01 section">
            <dl>
                <dt>검색</dt>
                <dd>
                    <div class="input_line w10">
                        <select id="keyword" name="keyword">
                            <option value="w.wh_nm">창고명</option>
                            <option value="w.wh_cd">창고코드</option>
                        </select>
                    </div>
                    <div class="input_line w20">
                        <input type="text" id="content" name="content" autocomplete="off" placeholder="검색어를 입력하세요.">
                    </div>
                    <div class="input_line w10">
                        <select id="wh_gb" name="wh_gb">
                            <option value="">창고유형_전체</option>
                            <?php if(count($wh_gb) > 0) { ?>
                                <?php foreach($wh_gb as $row) :?>
                                    <option value="<?= $row->code_sub ?>"><?= $row->code_nm ?></option>
                                <?php endforeach ?>
                            <?php } ?>
                        </select>
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
        <?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
        <?php echo form_open($site_url."/v", $attributes); ?>
        <input type="hidden" id="p" class="p" name="p" value="in">
        <input type="hidden" id="ikey" class="ikey" name="ikey" value="">
        <input type="hidden" id="page" name="page" value="">
        <div class="input_zone section">
            <div class="input_wrap">
            <h4>창고 정보 입력
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
                    <dt class="impt">창고유형</dt>
                    <dd>
                        <div class="input_line">
                            <select class="wh_gb" name="wh_gb">
                                <?php if(count($wh_gb) > 0) { ?>
                                    <?php foreach($wh_gb as $row) :?>
                                        <option value="<?= $row->code_sub ?>"><?= $row->code_nm ?></option>
                                    <?php endforeach ?>
                                <?php } ?>
                            </select>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt class="impt">창고명</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="wh_nm input" name="wh_nm" autocomplete="off" required>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>담당자</dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="text" class="person input" name="person" autocomplete="off">
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>전화번호</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" class="tel input" name="tel" autocomplete="off">
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>우편번호</dt>
                    <dd>
                        <div class="input_line w50">
                            <input type="hidden" id="sample6_postcode" class="input">
                            <input type="hidden" id="sample6_extraAddress" class="input">
                            <input type="text" id="post_code" class="post_code input gray readonly" name="post_code" autocomplete="off"
                            onclick="javascript:daum_postcode('post_code', 'addr', 'addr_detail');">
                        </div>
                        <button type="button" onclick="javascript:daum_postcode('post_code', 'addr', 'addr_detail');">검색</button>
                    </dd>
                </dl>
                <dl>
                    <dt>주소</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" id="addr" class="addr input gray readonly" name="addr" autocomplete="off">
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>상세주소</dt>
                    <dd>
                        <div class="input_line">
                            <input type="text" id="addr_detail" class="addr_detail input" name="addr_detail" autocomplete="off">
                        </div>
                    </dd>
                </dl>
                <dl class="bgo">
                    <dt>비고</dt>
                    <dd>
                        <div class="input_line">
                            <textarea class="memo" name="memo" cols="30" rows="10"></textarea>
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
            <h2>창고리스트</h2>
            <div class="list_wrap">
                <div class="n-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th class="w6">순번</th>
                                <th class="w8">창고코드</th>
                                <th class="w8">창고유형</th>
                                <th>창고명</th>
                                <th class="w12">등록자명(ID)</th>
                                <th class="w12">등록일시</th>
                                <th class="w12">수정자명(ID)</th>
                                <th class="w12">수정일시</th>
                                <th class="w8">가용여부</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="h-scroll" id="table-height">
                    <table id="myTable" class="hovering at ac">
                        <tbody id="data-container">
                            <?php // js ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <?php // pagination ?>
            <div id="pagination" class="pagination"></div>
            <div class="view_count">
                <select id="page_size">
                    <option value="15">페이지 보기 15</option>
                    <option value="50">페이지 보기 50</option>
                    <option value="100">페이지 보기 100</option>
                </select>
            </div>
        </div>
    </div>
    <div class="total">
        <ul>
            <li class='T-right'>총 검색 : <strong id="page_count"></strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/food/w_house.js?<?=time();?>"></script>
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