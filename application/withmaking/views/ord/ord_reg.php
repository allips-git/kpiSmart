<?php // 온라인 주문 등록 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/online.css?<?=time()?>">
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
    // 등록 기능만 있는 페이지이므로 등록 권한만 제한함
    // 리스트 삭제는 자기가 등록한 데이터 삭제용으로 삭제 권한 제한에 해당 안됨.
    $w = Authori::get_list()['data']->write; // 등록 권한
?>
<div class="content online_put online_reg">
    <?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
    <?php echo form_open($site_url."/v", $attributes); ?>
    <input type="hidden" id="p" name="p" value="in">
    <input type="hidden" id="cust_cd" name="cust_cd" value="" required>
    <input type="hidden" class="total_amt" name="total_amt" value="" required>
    <input type="hidden" class="total_tax" name="total_tax" value="" required>
    <div class="top">
        <div class="section01 search_zone section">
            <h4 class="w100">수주 기본 정보</h4>
            
            <dl class="w25">
                <dt class="impt">주문일</dt>
                <dd>
                    <div class="date_line w120p">
                        <input type="text" id="ord_dt" class="datepicker w80  readonly" name="ord_dt" onclick="javascript:call_date(this);" Auto required>
                    </div>
                </dd>
            </dl>
            <dl class="w25">
                <dt>주문번호</dt>
                <dd>
                    <div class="input_line w60">
                        <input type="text" id="ord_no" class="gray readonly" Auto>
                    </div>
                </dd>
            </dl>
            <dl class="w25">
                <dt class="impt">처리상태</dt>
                <dd>
                    <div class="input_line w40">
                        <select id="state" class="readonly" name="state">
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
                <dt class="impt">고객</dt>
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
                        <input type="text" id="tel" class="gray readonly" value="" Auto>
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
            <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
        </div>
    </div>
	<div class="bottom section">
        <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
		<div class="list_zone">
			<h4>수주 리스트</h4>
			<div class="btns">
                <?php if($w == "Y") { ?>
                    <button type="button" id="btn_add" class="blue btn_add">제품 추가</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">제품 추가</button>
                <?php } ?>
			</div>
			<div class="x-scroll custom-scroll">
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
                <table id="tb_list">
                    <tbody id="list-container">
                        <tr class="tr_1">
                            <input type="hidden" class="item_cd_1" name="item_cd" value="" required>
                            <input type="hidden" class="item_nm_1" name="item_nm" value="" required>
                            <input type="hidden" class="unit_1" name="unit" value="" required>
                            <input type="hidden" class="size_1" name="size" value="" required>
                            <input type="hidden" class="sale_amt_1" name="sale_amt" value="0" required>
                            <td class="w3"></td>
                            <td id="" class="w12"></td>
                            <td colspan="3" class="w26">
                                <select id="item_list_1" onchange="change_item(1);"> 
                                    <?php // js ?>
                                </select>
                            </td>
                            <td id="item_cd_1" class="w11"></td>
                            <td id="unit_1" class="w11"></td>
                            <td id="sale_amt_1" class="T-right w8"></td>
                            <td class="w8 spindd">
                                <div class="spin">
                                    <span class="spinner">
                                        <span class="sub" onclick="num_minus(1);">-</span>
                                            <input type="number" id="qty_1" name="ord_qty" value="1" oninput="calculation(1);" Auto">
                                        <span class="add" onclick="num_plus(1);">+</span>
                                    </span>
                                </div>
                            </td>
                            <td class="w8">
                                <input type="text" id="ord_amt_1" class="T-right amt gray readonly" name="ord_amt" value="0" Auto>
                            </td>
                            <td class="w8">
                                <input type="text" id="tax_amt_1" class="T-right tax gray readonly" name="tax_amt" value="0" Auto>
                            </td>
                            <td class="number_td bottom_td" style="background-color:#fff !important;"></td>
                            <td class="abtd">1</td>
                            <td class="abtd2">
                                <input type="text" id="mall_nm_1" class="T-left gray02" name="mall_nm" value="" placeholder="쇼핑몰명 입력" Auto>
                            </td>
                            <td class="w9 bottom_td" style="margin-left:15.03%">
                                <input type="text" id="client_nm_1" name="client_nm" value="" placeholder="고객명 입력" Auto>
                            </td>
                            <td class="w11 bottom_td">
                                <input type="text" id="client_tel_1" class="num_type" name="client_tel" value="" placeholder="ex) 010-1234-5678" Auto>
                            </td>
                            <td  class="w6 bottom_td">
                                <select id="dlv_gb" name="dlv_gb">
                                <?php if(count($dlv_gb) > 0) { ?>
                                    <?php foreach($dlv_gb as $row) :?>
                                        <option value="<?= $row->code_sub ?>"><?= $row->code_nm ?></option>
                                    <?php endforeach ?>
                                <?php } ?>
                                </select>
                            </td>
                            <td class="w6 bottom_td" colspan="2">
                                <input type="text" id="dlv_zip_1" name="dlv_zip" value="" placeholder="우편번호 입력" Auto numOnly>
                            </td>
                            <td class="w16 bottom_td" colspan="2">
                                <input type="text" id="address_1" class="T-left" name="address" value="" placeholder="배송주소 입력" Auto>
                            </td>
                            <td class="w16 bottom_td" colspan="2">
                                <input type="text" id="addr_detail_1" class="T-left" name="addr_detail" value="" placeholder="상세주소 입력" Auto>
                            </td>
                            <td class="w16 bottom_td" colspan="2" class="bgo">
                                <input type="text" id="addr_text_1" class="T-left" name="addr_text" value="" placeholder="배송 요청사항 입력" Auto>
                            </td>
                            <td class="w5 del_td" rowspan="2" style="height:4.375rem !important">
                                <button type="button" class="del" onclick="item_del({class:'1'})">삭제</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
		</div>
	</div>
    <div class="total">
        <ul>
            <li class="T-right blue">합 계 : <strong id="total_amt">0</strong><span>원</span></li>
            <li class="T-right">총 제품수 : <strong id="list_count">1</strong><span>개</span></li>
        </ul>
    </div>
    <div class="content_after"></div>
    <div class="btn_wrap">
        <button type="button" id="btn_list" class="gray">목록</button>
        <?php if($w == "Y") { ?>
            <button type="button" id="btn_reg">등록하기</button>
        <?php } else{ ?>
            <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">등록하기</button>
        <?php } ?>
    </div>
    <?php echo form_close(); ?>
</div>
<script src="/public/js/food/common_select2.js?<?=time();?>"></script>
<script src="/public/js/food/common_ord.js?<?=time();?>"></script>
<script src="/public/js/food/ord_reg.js?<?=time();?>"></script>
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