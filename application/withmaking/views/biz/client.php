<?php // 거래처 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/loading.css">
<link rel="stylesheet" href="/public/css/food/client.css?<?=time()?>">
<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write; // 쓰기 권한
    $m = Authori::get_list()['data']->modify; // 쓰기 권한
    $d = Authori::get_list()['data']->delete; // 삭제 권한
?>
<div class="client content">
    <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
        <div class="search_zone section01 section">
            <dl>
                <dt>검색</dt>
                <dd>
                    <div class="input_line w10">
                        <select id="keyword" name="keyword">
                            <option value="b.cust_nm">고객(별칭)명</option>
                            <option value="b.biz_nm">사업장(고객)명</option>
                            <option value="b.cust_cd">고객코드</option>
                            <option value="b.memo">비고</option>
                        </select>
                    </div>
                    <div class="input_line w20">
                        <input type="text" id="content" name="content" placeholder="검색어를 입력하세요." autocomplete="off">
                    </div>
                    <div class="input_line w10">
                        <select id="cust_gb" name="cust_gb">
                            <option value="">업체구분_전체</option>
                            <?php if(count($cust_gb) > 0) { ?>
                                <?php foreach($cust_gb as $row) :?>
                                    <option value="<?= $row->code_sub ?>"><?= $row->code_nm ?></option>
                                <?php endforeach ?>
                            <?php } ?>
                        </select>
                    </div>
                    <!-- <div class="input_line w10">
                        <select id="cust_grade" name="cust_grade">
                            <option value="">등급_전체</option>
                            <option value="amt1"><?= $cust_grade->amt1 ?></option>
                            <option value="amt2"><?= $cust_grade->amt2 ?></option>
                            <option value="amt3"><?= $cust_grade->amt3 ?></option>
                            <option value="amt4"><?= $cust_grade->amt4 ?></option>
                            <option value="amt5"><?= $cust_grade->amt5 ?></option>
                        </select>
                    </div> -->
                    <div class="input_line w10">
                        <select id="sales_person" name="sales_person">
                            <option value="">영업담당자_전체</option>
                            <?php if(count($sales) > 0) { ?>
                                <?php foreach($sales as $row) :?>
                                    <option value="<?= $row->ikey ?>"><?= $row->ul_nm ?>(<?= $row->id ?>)</option>
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
        <div class="input_zone section">
            <input type="hidden" id="p" class="p" name="p" value="in">
            <input type="hidden" id="ikey" class="ikey" name="ikey" value="">
            <input type="hidden" id="page" name="page" value="">
            <div class="input_wrap">
                <h4>고객 정보 입력
                    <button type="button" class="F-right btn_reset"><i class="btn_re_icon" aria-hidden="true"></i></button>
                </h4>
                <div class="left">
                    <dl>
                        <dt class="impt">가용여부</dt>
                        <dd>
                            <input type="radio" id="chk01" class="useyn" name="useyn" value="Y" checked="checked">
                            <label for="chk01">사용가능</label>
                            <input type="radio" id="chk02" class="useyn" name="useyn" value="N">
                            <label for="chk02">사용불가</label>
                        </dd>
                    </dl>
                    <dl class="">
                        <dt class="impt">고객(별칭)명</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="cust_nm input" name="cust_nm" autocomplete="off" required>
                            </div>
                        </dd>
                    </dl>
                    <dl class="half">
                        <dt class="impt">사업장(고객)명</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="biz_nm input" name="biz_nm" autocomplete="off" required>
                            </div>
                        </dd>
                        <dt class="impt">업체구분</dt>
                        <dd>
                            <div class="input_line">
                                <?php if(count($cust_gb) > 0) { ?>
                                    <select class="cust_gb" name="cust_gb">
                                        <?php foreach($cust_gb as $row) :?>
                                            <option value="<?= $row->code_sub ?>"><?= $row->code_nm ?></option>
                                        <?php endforeach ?>
                                    </select>
                                <?php } ?>
                            </div>
                        </dd>
                    </dl>
                    <dl class="half">
                        <dt class="">사업자 등록번호</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="biz_num input num_type" name="biz_num" autocomplete="off" placeholder="예: 100-00-12345">
                            </div>
                        </dd>
                        <dt class="">주민번호</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="cust_num input num_type" name="cust_num" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                    <dl class="half">
                        <dt class="">대표자</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="ceo_nm input" name="ceo_nm" autocomplete="off">
                            </div>
                        </dd>
                        <dt class="">대표자 연락처</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="ceo_tel input num_type" name="ceo_tel" placeholder="예: 010-0000-0000" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                    <dl class="half">
                        <!-- <dt class="">등급</dt>
                        <dd>
                            <div class="input_line">
                                <select class="cust_grade" name="cust_grade">
                                    <option value="">거래처등급_선택</option>
                                    <option value="amt1"><?= $cust_grade->amt1 ?></option>
                                    <option value="amt2"><?= $cust_grade->amt2 ?></option>
                                    <option value="amt3"><?= $cust_grade->amt3 ?></option>
                                    <option value="amt4"><?= $cust_grade->amt4 ?></option>
                                    <option value="amt5"><?= $cust_grade->amt5 ?></option>
                                </select>
                            </div>
                        </dd> -->
                        <dt class="">배송구분</dt>
                        <dd>
                            <div class="input_line">
                                <select class="dlv_gb" name="dlv_gb">
                                    <option value="001">화물</option>
                                    <option value="002" selected>택배</option>
                                    <option value="003">직배</option>
                                    <option value="005">납품</option>
                                    <option value="007">기타</option>
                                </select>
                            </div>
                        </dd>
                    </dl>
                    <dl class="half">
                        <dt class="">미수금액(원)</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="ord_amt T-right input gray readonly" autocomplete="off">
                            </div>
                        </dd>
                        <dt class="">미지급액(원)</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="buy_amt T-right input gray readonly" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                    <dl class="half">
                        <dt class="">업태</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="biz_class input" name="biz_class" autocomplete="off">
                            </div>
                        </dd>
                        <dt class="">종목</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="biz_type input" name="biz_type" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                    <dl class="half">
                        <dt class="">전화번호</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="tel input num_type" name="tel" placeholder="예: 02-000-0000"  autocomplete="off">
                            </div>
                        </dd>
                        <dt class="">FAX</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="fax input num_type" name="fax" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                    <dl>
                        <dt class="">이메일주소</dt>
                        <dd>
                            <div class="input_line">
                                <input type="email" class="email input" name="email" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                    <dl class="">
                        <dt class="">주소</dt>
                        <dd class="mb8">
                            <div class="input_line w50">
                                <input type="hidden" id="sample6_postcode" class="input">
                                <input type="hidden" id="sample6_extraAddress" class="input">
                                <input type="text" id="biz_zip" class="biz_zip input gray readonly" name="biz_zip" autocomplete="off"
                                onclick="javascript:daum_postcode('biz_zip', 'address', 'addr_detail');">
                            </div>
                            <button type="button" onclick="javascript:daum_postcode('biz_zip', 'address', 'addr_detail');">검색</button>
                        </dd>
                        <dd class="mb8">
                            <div class="input_line">
                                <input type="text" id="address" class="address input gray readonly" name="address" autocomplete="off">
                            </div>
                        </dd>
                        <dd class="mb8">
                            <div class="input_line">
                                <input type="text" id="addr_detail" class="addr_detail input" name="addr_detail" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                    <dl class="half">
                        <dt class="">담당자</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="person input" name="person" autocomplete="off">
                            </div>
                        </dd>
                        <dt class="">담당자 연락처</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="person_tel input num_type" name="person_tel" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                    <dl class="half">
                        <dt class="">예금주</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="holder_nm input" name="holder_nm" autocomplete="off">
                            </div>
                        </dd>
                        <dt class="">은행</dt>
                        <dd>
                            <div class="input_line">
                                <select class="bl_nm" name="bl_nm">
                                    <option value="">거래은행_선택</option>
                                    <?php if(count($bl_nm) > 0) { ?>
                                        <?php foreach($bl_nm as $row) :?>
                                            <option value="<?= $row->code_sub ?>"><?= $row->code_nm ?></option>
                                        <?php endforeach ?>
                                    <?php } ?>
                                </select>
                            </div>
                        </dd>
                    </dl>
                    <dl>
                        <dt class="">계좌번호</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" class="bl_num input num_type" name="bl_num" placeholder="예: 110-000-000000" autocomplete="off">
                            </div>
                        </dd>
                    </dl>
                    <dl class="half">
                        <dt class="">영업담당자</dt>
                        <dd>
                            <div class="input_line">
                                <select class="sales_person" name="sales_person">
                                    <option value="">영업담당자_선택</option>
                                    <?php if(count($sales) > 0) { ?>
                                        <?php foreach($sales as $row) :?>
                                            <option value="<?= $row->ikey ?>"><?= $row->ul_nm ?>(<?= $row->id ?>)</option>
                                        <?php endforeach ?>
                                    <?php } ?>
                                </select>
                            </div>
                        </dd>
                        <dt class="">부가세여부</dt>
                        <dd>
                            <div class="input_line ">
                                <select class="vat" name="vat">
                                    <option value="N">과세</option>
                                    <option value="Y">면세</option>
                                    <option value="S">영세</option>
                                </select>
                            </div>
                        </dd>
                    </dl>
                    <dl class="">
                        <dt class="">배송지 주소</dt>
                        <dd class="mb8">
                            <div class="input_line w50">
                                <input type="hidden" id="sample6_postcode" class="input">
                                <input type="hidden" id="sample6_extraAddress" class="input">
                                <input type="text" id="dlv_zip" class="dlv_zip input gray readonly" name="dlv_zip" autocomplete="off"
                                onclick="javascript:daum_postcode('dlv_zip', 'dlv_addr', 'dlv_detail');">
                            </div>
                            <button type="button" onclick="javascript:daum_postcode('dlv_zip', 'dlv_addr', 'dlv_detail');">검색</button>
                        </dd>
                        <dd class="mb8">
                            <div class="input_line">
                                <input type="text" id="dlv_addr" class="dlv_addr input gray" name="dlv_addr" autocomplete="off">
                            </div>
                        </dd>
                        <dd>
                            <div class="input_line">
                                <input type="text" id="dlv_detail" class="dlv_detail input" name="dlv_detail" autocomplete="off">
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
                </div>
                <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
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
        </div>
        <?php echo form_close(); ?>
        <div class="list_zone section">
            <h2>거래처 리스트</h2>
            <div class="list_wrap">
                <table id="myTable" class="tablesorter hovering at ac">
                    <thead>
                        <tr>
                            <th class="fixedHeader w5">순번</th>
                            <th class="sorter-false w6">구분</th>
                            <th class="sorter-false w9">고객코드</th>
                            <th class="fixedHeader">고객명</th>
                            <th class="sorter-false w11">등록자명(ID)</th>
                            <th class="sorter-false w12">등록일시</th>
                            <th class="sorter-false w11">수정자명(ID)</th>
                            <th class="sorter-false w12">수정일시</th>
                            <th class="sorter-false w7">가용여부</th>
                        </tr>
                    </thead>
                    <tbody id="data-container">
                        <?php // js ?>
                    </tbody>
                </table>
            </div>
            <?php // pagination ?>
            <div id="pagination" class="pagination"></div>
            <div class="view_count">
                <select id="page_size">
                    <option value="15">페이지 보기 15</option>
                    <option value="30">페이지 보기 30</option>
                    <option value="50">페이지 보기 50</option>
                    <option value="100" selected>페이지 보기 100</option>
                </select>
            </div>
        </div>
    </div>
    <div class="total">
        <ul>
            <li class="T-right">총 검색 : <strong id="page_count">0</strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/dev/reg_exp.js?<?=time()?>"></script>
<script src="/public/js/food/client.js?<?=time();?>"></script>
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