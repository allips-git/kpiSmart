<!--세금계산서 매입세금계산서 내역 조회 페이지-->
<!--입출내역조회와 검색 기능 동일하게-->
<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<link rel="stylesheet" href="/public/css/food/acc.css?<?=time()?>">
<script src="/public/js/lib/jquery-ui.js"></script>

<input type="hidden" id="title" value="<?php echo $title; ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">
<script>
	$(function() {
		//$( ".datepicker" ).datepicker();
        $(".datepicker").datepicker({
        	dateFormat:'yy-mm-dd'
            , showOn: 'button' 
            , buttonImage: '/public/img/calender_img.png'  // 달력 아이콘 이미지 경로
            , buttonImageOnly: true //  inputbox 뒤에 달력 아이콘만 표시
            , changeMonth: false // 월선택 select box 표시 (기본은 false)
            ,changeYear: false  // 년선택 selectbox 표시 (기본은 false)
        });
	}); 
</script>



<div class="content account tax_bill">
    <form>
        <div class="section search_zone">
            <dl>
                <dt><span>검색</span></dt>
                <dd>
                <?php $attributes = array('method' => 'get', 'accept-charset' => 'utf-8'); ?>		
                <?php echo form_open($site_url, $attributes); ?>		
                    <input type="hidden" name="s" value="t">					
                    <div class="input_line w8">	
                        <select>
                            <option>발행일자</option>
                        </select>
                    </div>
                    <div class="date_line w120p">
                        <input type="text" class="datepicker w80" name="startdt" readonly="readonly" value="<?php if(isset($params['startdt'])){ echo $params['startdt']; } ?>">
                        </div>
                    &nbsp; ~ &nbsp;
                    <div class="date_line w120p">
                        <input type="text" class="datepicker w80" name="enddt" readonly="readonly" value="<?php if(isset($params['enddt'])){ echo $params['enddt']; } ?>"></span>
                    </div>
                        <!--<select name="pops">
                        <option value="" <?php if($params['pops'] == '') echo "selected"; ?>>전체</option>
                        <option value="10" <?php if($params['pops'] == '10') echo "selected"; ?>>매입</option>					
                        <option value="11" <?php if($params['pops'] == '11') echo "selected"; ?>>매출</option>					
                    </select>-->	
                    <!--<span>
                        <input type="radio" id="radio01" name="evdc" checked="checked" value=""><label for="radio01"> &nbsp;전체</label>
                        <input type="radio" id="radio02" name="evdc"><label for="radio02" value="10"> &nbsp;매입세금계산서만</label>
                        <input type="radio" id="radio03" name="evdc"><label for="radio03" value="11"> &nbsp;매출세금계산서만</label>
                    </span>-->
                    <button type="submit" class="search-btn" style="margin-left:10px">검색</button>
                <?php echo form_close(); ?>
                </dd>
            <dl>
        </div>
    </form>

    <div class="bottom">
        <div class="list_zone section">
            <?php if($this->session->userdata['local_cd'] == "KR04") { ?>	
                <div class="btns F-right">
                    <span>
                        <button class="w"><i class="btn_re_icon" aria-hidden="true"></i></button>
                        <button class="w"><i class="btn_bars_icon" aria-hidden="true"></i></button>
                        <button class="w"><i class="btn_excel_icon" aria-hidden="true"></i></button>
                        <button class="w"><i class="btn_print_icon" aria-hidden="true"></i></button>
                    </span>
                    <button><i class="btn_in_icon" aria-hidden="true"></i> 수기등록</button>
                </div>
            <?php } ?>
            <h4>매입세금계산서 리스트</h4>
            <div class="n-scroll">
                <table>
                    <thead>
                        <tr>
                            <th style="width:220px;">승인 번호</th>					
                            <th class="w4">구분</th> <!--청구, 영수-->
                            <th>상호</th>
                            <th class="w5">대표자명</th>
                            <th>업태</th>
                            <th>업종</th>					
                            <!--<th>증빙 구분</th>-->
                            <th class="w6">발행 일자</th>
                            <!--<th>세금 계산서 종류</th>--><!--일반 세금계산서, 영세율 세금계산서, 위수탁 세금계산서, 수입 세금계산서, 영세율 위수탁 세금계산서, 수정 일반 세금계산서, 수정 영세율 세금계산서, 수정 위수탁 세금계산서, 수정 수입 세금계산서, 수정 영세율 위수탁 세금계산서, 일반 계산서, 위수탁 계산서, 수입 계산서, 수정 일반 계산서, 수정 위수탁 계산서, 수정 수입 계산서, 종이 세금계산서, 종이 영세율 세금계산서, 종이 계산서-->
                            <!--<th>현금</th>
                            <th>외상 미수금</th>-->
                            <th>공급가액 합계</th>
                            <th>세액 합계</th>
                            <th>총금액</th>
                            <th>비고</th>					
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="h-scroll mCustomScrollbar">
                <table class="hovering ac">
                    <tbody>
                        <?php if ($list != '') { ?>
                            <?php foreach($list as $row) :?>
                            <tr>
                                <td style="width:220px;"><?=$row['ISSU_ID']?></td>					
                                <td class="w4">
                                    <?php if($row['POPS_CODE'] === "01") { ?>
                                        <span class="sp-gubun_1">청구</span>
                                    <?php } else { ?>
                                        <span class="sp-gubun_2">영수</span>						
                                    <?php } ?>
                                </td>
                                <td class="T-left"><?=$row['SELR_CORP_NM'];?></td>
                                <td class="w5"><?=$row['SELR_CEO_NM'];?></td>
                                <td class="T-left"><?=$row['SELR_BUSS_CONS'];?></td>
                                <td class="T-left"><?=$row['SELR_BUSS_TYPE'];?></td>
                                <!--<td><?=$row['EVDC_DV'] === "10" ? '매입세금계산서' : '매출세금계산서'; ?></td>-->
                                <td class="w6"><?=$this->common->format_number(substr($row['ISSU_DATE'],0,8), 4);?></td>
                                <!--<td><?=$this->common->tax_bill_type($row['TAX_TYPE']);?></td>
                                <td style="text-align:right"><?=number_format($row['CASH'])."원";?></td>
                                <td style="text-align:right"><?=number_format($row['CREDIT'])."원";?></td>-->
                                <td style="text-align:right"><?=number_format($row['CHRG_AMT'])."원";?></td>
                                <td style="text-align:right"><?=number_format($row['TAX_AMT'])."원";?></td>
                                <td style="text-align:right"><?=number_format($row['TOTL_AMT'])."원";?></td>
                                <td><?=$row['RMRK1'];?></td>
                            </tr>
                            <?php endforeach ?>
                        <?php } else { ?>
                            <tr>
                                <td colspan="12">데이터가 없습니다.</td>
                            </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
            <ul id="pagination" class="pagination">
                <?php echo $links;?>
                <!-- <div class="paginationjs paginationjs-theme-blue paginationjs-small">
                    <div class="paginationjs-pages">
                        <ul>
                            <li class="paginationjs-prev disabled "><a>«</a></li>
                            <li class="paginationjs-page J-paginationjs-page active" data-num="1"><a>1</a></li>
                            <li class="paginationjs-page J-paginationjs-page " data-num="2"><a>2</a></li>
                            <li class="paginationjs-page J-paginationjs-page " data-num="3"><a>3</a></li>
                            <li class="paginationjs-next"><a>»</a></li>
                        </ul>
                    </div>
                </div> -->
            </ul>
            <div class="view_count">
                <select id="page_size">
                    <option value="15">페이지 보기 15</option>
                    <option value="30">페이지 보기 30</option>
                    <option value="50">페이지 보기 50</option>
                    <option value="100">페이지 보기 100</option>
                </select>
            </div>
        </div>
    </div>
    <div class="total">
        <ul>
            <li class='T-right'>총 검색 : <strong id="page_count">1</strong><span>건</span></li>
        </ul>
    </div>
</div>

<!--팝업창 상세 view-->
<table style="display:none;">
    <tr>
        <td>일련번호</td>
        <td>거래일자</td>
        <td>품목명</td>
        <td>규격</td>                        
        <td>비고</td>        
        <td>수량</td>        
        <td>단가</td>        
        <td>공급가액</td>
        <td>세액</td>                
    </tr>
</table>

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

