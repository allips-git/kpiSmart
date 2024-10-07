<?php // 온라인 주문 수정 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/online.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">
<style>
    .btn_add {
        font-size: 15px !important;
    }
    .inp_gray {
        background-color: #f5f5f8 !important;
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
<div class="content online_put online_reg online_mod">
    <?php $attributes = array("id" => "frm_mod", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
    <?php echo form_open($site_url."/v", $attributes); ?>
    <input type="hidden" id="p" name="p" value="up">
    <input type="hidden" id="ikey" name="ikey" value="" required>
    <input type="hidden" id="cust_cd" name="cust_cd" value="" required>
    <input type="hidden" class="total_amt" name="total_amt" value="" required>
    <input type="hidden" class="total_tax" name="total_tax" value="" required>
    <div class="top">
        <div class="section search_zone section01">
            <h4 class="w100">수주 기본 정보</h4>
            <div class="btn_wrp">
                <?php if($ord->finyn == "N") { ?>
                    <?php if($m == "Y") { ?>
                        <button type="button" class="online_magam">전표 마감</button>
                    <?php } else{ ?>
                        <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">전표 마감</button>
                    <?php } ?>
                <?php } ?>
            </div>
            <dl class="w25">
                <dt class="impt">주문일</dt>
                <dd>
                    <div class="date_line w120p">
                        <input type="text" id="ord_dt" class="datepicker w80 readonly" name="ord_dt" onclick="javascript:call_date(this);" Auto required>
                    </div>
                </dd>
            </dl>
            <dl class="w25">
                <dt>주문번호</dt>
                <dd>
                    <div class="input_line w60">
                        <input type="text" id="ord_no" class="gray readonly" name="ord_no" value="" Auto>
                    </div>
                </dd>
            </dl>
            <dl class="w25">
                <dt class="impt">처리상태</dt>
                <dd>
                    <div class="input_line w40">
                        <select id="state" name="state">
                            <option value="001">접수</option>
                            <option value="002">대기</option>
                        </select>
                    </div>
                </dd>
            </dl>
            <dl class="w25">
                <dt class="impt">부가세</dt>
                <dd>
                    <div class="input_line w40">
                        <select id="vat" name="vat">
                            <option value="N">과세</option>
                            <option value="Y">면세</option>
                            <option value="S">영세</option>
                        </select>
                    </div>
                </dd>
            </dl>
            <dl class="w25">
                <dt class="impt">고객명</dt>
                <dd>
                    <div class="input_line w80">
                        <select id="biz_list" onchange="change_biz_list(this.id);">
                            <?php // js ?>
                        </select>
                    </div>
                </dd>
            </dl>
            <dl class="w25">
                <dt>대표자명</dt>
                <dd>
                    <div class="input_line w50">
                        <input type="text" id="ceo_nm" class="gray readonly" value="" Auto>
                    </div>
                </dd>
            </dl>
            <dl class="w25">
                <dt>대표자 연락처</dt>
                <dd>
                    <div class="input_line w50">
                        <input type="text" id="ceo_tel" class="gray readonly" value="" Auto>
                    </div>
                </dd>
            </dl>
            <dl class="w25">
                <dt>전화번호</dt>
                <dd>
                    <div class="input_line w50">
                        <input type="text" id="tel" class="gray readonly" name="tel" value="" Auto>
                    </div>
                </dd>
            </dl>
            <dl class="w25">
                <dt>업체구분</dt>
                <dd>
                    <div class="input_line w40">
                        <select id="cust_gb" class="gray" disabled>
                            <option value=""></option>
                            <option value="001">매출처</option>
                            <option value="002">매입처</option>
                            <option value="003">통합</option>
                        </select>
                    </div>
                </dd>
            </dl>
            <dl class="w75">
                <dt>비고</dt>
                <dd>
                    <div class="input_line w100">
                        <input type="text" id="memo" name="memo" Auto>
                    </div>
                </dd>
            </dl>
        </div>
        <div class="section right">
            <h4 class="w100">회계 정보</h4>
            <div class="flex">
                <p>총 주문액(원)</p>
                <p class="price02"><?php echo !empty($ac->in_amt) ? number_format($ac->in_amt) : 0; ?></p>
            </div>
            <div class="flex">
                <p>미수잔액(원)</p>
                <p class="price"><?php echo !empty($ac->in_amt) ? number_format($ac->in_amt-$ac->out_amt) : 0; ?></p>
            </div>
            <div class="print">
                <p>거래명세서 출력</p>
                <a class="btn_gurae">
                    <img src="/public/img/print.png" alt="">
                </a>
            </div>
        </div>
    </div>

    <div class="bottom section">
      <div class="list_zone">
         <h4>온라인 주문 리스트</h4>
         <div class="btns">
            <?php if($w == "Y") { ?>
                <button type="button" id="btn_add" class="blue btn_add">제품 추가</button>
            <?php } else{ ?>
                <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">제품 추가</button>
            <?php } ?>
        </div>
        <div class="n-scroll custom-scroll">
            <table>
                <colgroup>
                    <col width="3%">
                    <col width="12%">
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col" rowspan="2">순번</th>
                        <th scope="col" rowspan="2">쇼핑몰명</th>
                        <th class="impt w26" colspan="3">제품명</th>
                        <th class="w11">제품코드</th>
                        <th class="w11">규격(단위)</th>
                        <th class="w8">판매단가(원)</th>
                        <th class="w8 impt">주문수량</th>
                        <th class="w8">금액(원)</th>
                        <th class="w8">세액(원)</th>
                        <th class="w5" rowspan="2">삭제</th>
                    </tr>
                    <tr class="tr_bottom">
                        <th scope="col">고객명</th>
                        <th scope="col">전화번호</th>
                        <th scope="col">배송구분</th>
                        <th class="ad_th" colspan="2">
                            <div class="ad_num">우편번호</div>    
                            <div class="address">배송지주소</div>    
                        </th>
                        <th colspan="2">상세주소</th>
                        <th colspan="2" class="bgo">배송요청사항</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="x-scroll">
            <table id="tb_list">
                <tbody id="list-container">
                    <?php // js ?>
                </tbody>
            </table>
        </div>
        <div class="total">
            <ul>
                <li class="T-right blue">합 계 : <strong id="total_amt">0</strong><span>원</span></li>
                <li class="T-right">총 제품수: <strong id="list_count">1</strong><span>개</span></li>
            </ul>
        </div>
    </div>
</div>
<div class="content_after"></div>
<div class="btn_wrap div_mod">
    <button type="button" class="gray" onclick="location.href='/ord/ord_list'">목록</button>
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
    <button type="button" class="gray" onclick="location.href='/ord/ord_list'">목록</button>
</div>
<?php echo form_close(); ?>
</div>

<?php // 거래명세서 출력용 FORM ?>
<form id="frm" name="frm" method="post">
    <input type="hidden" id="p_gb" name="p_gb">
    <input type="hidden" id="p_ord_no" name="p_ord_no">
</form>
<script src="/public/js/food/common_select2.js?<?=time();?>"></script>
<script src="/public/js/food/common_ord.js?<?=time();?>"></script>
<script src="/public/js/food/common_print.js?<?=time();?>"></script>
<script src="/public/js/food/ord_mod.js?<?=time();?>"></script>
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