<?php // 자사정보 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/food/biz_info.css?<?=time()?>">


<?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
<?php echo form_open($site_url."/v", $attributes); ?>
<input type="hidden" id="ikey" class="ikey" name="ikey" value="">
<div class="content info">
    <div class="left">
        <div class="">
            <h1>로고 등록</h1>
            <div class="img-box">
                <img src="/public/img/no_img.jpg" id="pic" title="이미지 파일만 가능하며, 최대 용량은 2MB입니다.">
            </div>
            <div style="margin:10px 0 0 5px">
                <button type="button">
                    <label for="img" style="cursor:pointer">파일선택</label>
                </button>&nbsp;
                <button type="button" id="file_del">파일삭제</button>
            </div>
            <span><strong>* </strong> 권장 로고 사이즈 64px*64px</span>
        </div>
        <dd style="display:none;">
            <input type="file" name="img" id="img" accept="image/png, image/jpeg">
        </dd>
    </div>
    <div class="right">
        <h1>자사 정보</h1>
        <div class="input-zone">
            <dl>
                <dt>공장코드</dt>
                <dd class="half01">
                    <span id="local_cd" name="local_cd"></span>
                </dd>
                <dt>공장유형</dt>
                <dd class="half02">
                    <div class="input_line w25">
                        <select id="" name="">
                            <option value="">일반공장</option>
                        </select>
                    </div>
                </dd>
            </dl>
            <dl>
                <dt class="impt">사업자 명</dt>
                <dd class="half01">
                    <div class="input_line w35">
                        <input type="text" autocomplete="off" name="biz_nm" id="biz_nm" value="" data-text='사업자 명' maxlength="25" title="사업자명 입력. 필수 입력 항목입니다.">
                    </div>
                </dd>
                <dt class="impt">사업자 유형</dt>
                <dd class="half02">
                    <input type="radio" class="biz_gb" name="biz_gb" id="biz" value="001" >
                    <label for="biz" class="biz">&nbsp;법인사업자</label>&nbsp;&nbsp;
                    <input type="radio" class="biz_gb" name="biz_gb" id="per" value="002">
                    <label for="per" class="per">&nbsp;개인사업자</label>
                </dd>
            </dl>
            <dl>
                <dt class="impt">사업자 등록번호</dt>
                <dd>
                    <div class="input_line" style="width: 16.7% !important;">
                        <input type="text" autocomplete="off" class="num_type" name="biz_cd" id="biz_cd" value="" data-text='사업자 등록번호' maxlength="20" title="사업자 등록번호 입력. 필수 입력 항목입니다.">
                    </div>
                </dd>
            </dl>
            <dl>
                <dt>업태</dt>
                <dd class="half01">
                    <div class="input_line w50">
                        <input type="text" autocomplete="off" name="biz_class" id="biz_class" value="" maxlength="25" title="사업장 업태 입력">
                    </div>
                </dd>
                <dt class="bb">종목</dt>
                <dd class="half02">
                    <div class="input_line w35">
                        <input type="text" autocomplete="off" name="biz_type" id="biz_type" value="" maxlength="25" title="사업장 종목 입력">
                    </div>
                </dd>
            </dl>
            <dl>
                <dt class="impt">전화번호</dt>
                <dd class="half01">
                    <div class="input_line w50">
                        <input type="text" autocomplete="off" class="num_type" name="tel" id="tel" value="" data-text="전화번호" maxlength="15" title="전화번호 입력. 필수 입력 항목입니다.">
                    </div>
                </dd>
                <dt>팩스번호</dt>
                <dd class="half02">
                    <div class="input_line w35">
                        <input type="text" autocomplete="off" name="fax" class="num_type" id="fax" value="" maxlength="15" title="팩스 번호 입력">
                    </div>
                </dd>
            </dl>
            <dl>
                <dt>이메일 주소</dt>
                <dd>
                    <div class="input_line w25">
                        <input type="text" autocomplete="off" name="email" id="email" value="" maxlength="25" title="이메일 입력">
                    </div>
                </dd>
            </dl>
            <dl class="add">
                <dt class="">사업장소재지</dt>
                <dd>
                    <div class="dd_inner" style="display:flex">
                        <div class="input_line w11 gray">
                            <input type="hidden" id="sample6_postcode" class="input">
                            <input type="hidden" id="sample6_extraAddress" class="input">
                            <input type="text" id="biz_zip" class="biz_zip input  readonly" name="biz_zip" autocomplete="off"
                            onclick="javascript:daum_postcode('biz_zip', 'address', 'addr_detail');">
                            <!-- <input type="text" autocomplete="off" name="biz_zip" id="biz_zip" value="" data-text='주소' title="우편번호 입력. 필수 입력 항목입니다. 검색 버튼을 활용하여 입력하세요." readonly> -->
                        </div>
                        <button type="button" onclick="javascript:daum_postcode('biz_zip', 'address', 'addr_detail');">검색</button>
                    </div>
                    <div class="input_line w25 gray">
                        <input type="text" autocomplete="off" class="add01" name="address" id="address" value="" title="주소 입력. 필수 입력 항목입니다. 검색 버튼을 활용하여 입력하세요." readonly>
                    </div>
                    <div class="input_line w25">
                        <input type="text" autocomplete="off" name="addr_detail" id="addr_detail" value="" maxlength="25" title="상세주소 입력">
                    </div>
                </dd>
            </dl>
        </div>
        <h1>대표자 정보</h1>
        <div class="input-zone">
            <dl>
                <dt class="impt">대표자명</dt>
                <dd class="half01">
                    <div class="input_line w50">
                        <input type="text" autocomplete="off" name="ceo_nm" id="ceo_nm" value="" data-text="대표자명" maxlength="25" title="대표자명 입력. 필수 입력 항목입니다.">
                    </div>
                </dd>
                <dt class="impt">대표자 연락처</dt>
                <dd class="half02">
                    <div class="input_line w35">
                        <input type="text" autocomplete="off" class="num_type" name="ceo_tel" id="ceo_tel" value="" maxlength="15" onKeyup="" title="대표자연락처 입력">
                    </div>
                </dd>
            </dl>
            <dl class="bgo">
                <dt>비고</dt>
                <dd>
                    <div class="input_line">
                        <textarea name="memo" id="memo" cols="30" rows="10"  autocomplete="off" title="비고 입력"></textarea>
                    </div>
                </dd>
            </dl>
            <p class="imptp"><span>* </span> 는 필수입력입니다.</p>
        </div>
        <h1>이용현황</h1>
        <div class="input-zone">
            <dl>
                <dt class="use w100 date">
                    <p><strong>DroneWorld ERP System 시스템&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;</strong>&nbsp;&nbsp;version 1.0</p>
                    <span></span>
                    <!-- <span>2022년 05월 16일 현재 시스템 정상 가동중 입니다.</span> -->
                </dt>
            </dl>
        </div>
    </div>
    <div class="btn_box">
        <button type="button" class="gray" id="btn_list">목록</button>
        <button type="button" class="blue" id="btn_save">저장하기</button>
    </div>
</div>
<?php echo form_close(); ?>
<script src="/public/js/food/info.js?<?=time();?>"></script>







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