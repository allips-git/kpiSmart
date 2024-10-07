<?php // 구매 발주 등록 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/ord.css?<?=time()?>">
<style>
    .btn_add {
        font-size: 15px !important;
    }
    .inp_gray {
        background-color: #f5f5f8 !important;
    }
    .ord_reg tr th.impt::after{
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
    // 등록 기능만 있는 페이지이므로 등록 권한만 제한함
    // 리스트 삭제는 자기가 등록한 데이터 삭제용으로 삭제 권한 제한에 해당 안됨.
    $w = Authori::get_list()['data']->write; // 등록 권한
?>
<div class="content ord_put ord_reg">
    <?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
    <?php echo form_open($site_url."/v", $attributes); ?>
    <input type="hidden" id="p" name="p" value="in">
    <input type="hidden" id="cust_cd" name="cust_cd" value="" required>
    <input type="hidden" class="total_amt" name="total_amt" value="" required>
    <input type="hidden" class="total_tax" name="total_tax" value="" required>
	<div class="section search_zone">
        <h4 class="w100">구매 발주 기본 정보</h4>
        <p class="imptp"><span>*</span> 은 필수 입력 항목입니다.</p>
        <dl class="w27">
            <dt class="impt">발주일</dt>
            <dd>
                <div class="date_line w120p">
                    <input type="text" id="ord_dt" class="datepicker w80 readonly" name="ord_dt" onclick="javascript:call_date(this);" autocomplete="off" required>
                </div>
            </dd>
        </dl>
        <dl class="w27">
            <dt>발주번호</dt>
            <dd>
                <div class="input_line w60">
                    <input type="text" class="gray readonly" name="ord_no" autocomplete="off">
                </div>
            </dd>
        </dl>
        <dl class="w27">
            <dt>처리상태</dt>
            <dd>
                <div class="input_line w30">
                    <select id="state" class="readonly" name="state">
                        <option value="001">접수</option>
                        <option value="002">대기</option>
                    </select>
                </div>
            </dd>
        </dl>
        <dl class="w27">
            <dt class="impt">거래처</dt>
            <dd>
                <div class="input_line w60">
                    <select id="biz_list" style="width: 200px;"> 
                        <?php // js ?>
                        <option value="fixed_value">거래처</option>
                    </select>
                </div>
                <!-- <button type="button">검색</button> -->
            </dd>
        </dl>
        <dl class="w27">
            <dt>전화번호</dt>
            <dd>
                <div class="input_line w60">
                    <input type="text" id="tel" class="gray readonly" name="tel" value="" autocomplete="off">
                </div>
            </dd>
        </dl>
        <dl class="w27">
            <dt>업체구분</dt>
            <dd>
                <div class="input_line w60">
                    <select id="cust_gb" class="readonly">
                        <option value="002">매입처</option>
                    </select>
                </div>
            </dd>
        </dl>
        <dl class="w27">
            <dt>대표자명</dt>
            <dd>
                <div class="input_line w60">
                    <input type="text" id="ceo_nm" class="gray readonly" value="" autocomplete="off">
                </div>
            </dd>
        </dl>
        <dl class="w27">
            <dt>대표자 연락처</dt>
            <dd>
                <div class="input_line w60">
                    <input type="text" id="ceo_tel" class="gray readonly" value="" autocomplete="off">
                </div>
            </dd>
        </dl>
        <dl class="w27">
            <dt>부가세</dt>
            <dd>
                <div class="input_line w60">
                    <select id="vat" name="vat">
                        <option value="N">과세</option>
                        <option value="Y">면세</option>
                        <option value="S">영세</option>
                    </select>
                </div>
            </dd>
        </dl>
        <dl class="w100">
            <dt>비고</dt>
            <dd>
                <div class="input_line w50">
                    <input type="text" id="memo" name="memo" autocomplete="off">
                </div>
            </dd>
        </dl>
	</div>
	
	<div class="bottom section">
		<div class="list_zone">
			<h4>구매 발주 리스트</h4>
			<div class="btns">
                <?php if($w == "Y") { ?>
                    <button type="button" id="btn_add" class="blue btn_add">품목 추가</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">품목 추가</button>
                <?php } ?>
			</div>
			<div class="n-scroll">
				<table>
					<thead>
						<tr>
                            <th class="impt">품목명</th>
                            <th class="w8">품목코드</th>
                            <th class="w8">규격(단위)</th>
                            <th class="w8">매입단가(원)</th>
                            <th class="impt w7">발주수량</th>
                            <th class="w8">금액(원)</th>
                            <th class="w8">세액(원)</th>
                            <th>비고</th>
                            <th class="w5">삭제</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="h-scroll">
				<table id="tb_list" class="">
					<tbody id="list-container">
                         <tr id="tr_1">
                            <input type="hidden" class="item_cd_1" name="item_cd" value="" required>
                            <input type="hidden" class="item_nm_1" name="item_nm" value="" required>
                            <input type="hidden" class="unit_1" name="unit" value="" required>
                            <input type="hidden" class="size_1" name="size" value="" required>
                            <input type="hidden" class="unit_amt_1" name="unit_amt" value="" required>
                            <td>
                                <select id="item_list_1" onchange="change_item(1);"> 
                                    <?php // js ?>
                                </select>
                            </td>
                            <td id="item_cd_1" class="w8"></td>
                            <td id="unit_1" class="w8"></td>
                            <td id="unit_amt_1" class="T-right w8"></td>
                            <td class="w7 spindd">
                                <div class="spin">
                                    <span class="spinner">
                                        <span class="sub" onclick="num_minus(1);">-</span>
                                            <input type="number" id="qty_1" name="ord_qty" value="1" oninput="calculation(1);" Auto>
                                        <span class="add" onclick="num_plus(1);">+</span>
                                    </span>
                                </div>
                            </td>
                            <td class="w8">
                                <input type="text" id="ord_amt_1" class="T-right amt gray readonly" name="ord_amt" value="0">
                            </td>
                            <td class="w8">
                                <input type="text" id="tax_amt_1" class="T-right tax gray readonly" name="tax_amt" value="0">
                            </td>
                            <td>
                                <input type="text" id="memo_1" class="w100 T-left" name="ord_memo" autocomplete="off">
                            </td>
                            <td class="w5">
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
            <li class="T-right">총 품목수 : <strong id="list_count">1</strong><span>개</span></li>
        </ul>
    </div>
    <div class="btn_wrap">
        <button type="button" class="btn_list gray">목록</button>
        <?php if($w == "Y") { ?>
            <button type="button" class="btn_reg">등록하기</button>
        <?php } else{ ?>
            <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">등록하기</button>
        <?php } ?>
    </div>
    <?php echo form_close(); ?>
</div>

<script src="/public/js/food/common_select2.js?<?=time();?>"></script>
<script src="/public/js/food/common_buy.js?<?=time();?>"></script>
<script src="/public/js/food/buy_reg.js?<?=time();?>"></script>
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
