<!-- <link rel="stylesheet"  href="/public/css/account.css?<?=time()?>">-->
<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<link rel="stylesheet" href="/public/css/food/acc.css?<?=time()?>">
<script src="/public/js/lib/jquery-ui.js"></script>

<input type="hidden" id="title" value="<?php echo $title; ?>">
<input type="hidden" name="site_url" id="site_url" value="<?php echo $site_url ?>">
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
<div class="content account">
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
                            <option>거래일자</option>
                        </select>
                    </div>		
                    <div class="date_line w120p">
                        <input type="text" class="datepicker w80 " name="startdt" readonly="readonly" value="<?php if(isset($params['startdt'])){ echo $params['startdt']; } ?>">
                    </div>
                    &nbsp; ~ &nbsp;
                    <div class="date_line w120p">
                        <input type="text" class="datepicker w80" name="enddt"  readonly="readonly" value="<?php if(isset($params['enddt'])){ echo $params['enddt']; } ?>">
                    </div>	<button type="submit" class="search-btn" style="margin-left:10px">검색</button>
                    <?php echo form_close(); ?>
                </dd>
            </dl>
        </div>
    </form>
    <div class="bottom">
		<div class="list_zone section">
            <h4>입출금 내역 리스트</h4>
            <div class="n-scroll">
                <table>
                    <thead>
                        <tr>
                            <th class="w4">구분</th>
                            <!--<th><input type="checkbox" id="chk" name=""><label for="chk"></label></th>-->
                            <!--<th>계좌별칭</th>-->
                            <th>거래일자</th>						
                            <!--<th>금융기관코드</th>-->
                            <th>계좌번호</th>
                            <th>은행명</th>						
                            <th>내용</th>
                            <th>사용용도</th>
                            <th>입금금액</th>						
                            <th>출금금액</th>
                            <th>거래후잔액</th>						
                            <th>메모</th>						
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
                            <td class="w4">
                                <?php if($row['RCV_AMT'] == "0"){ ?>
                                    <span class="sp-gubun_3">출금</span>
                                <?php }else{ ?>
                                    <span class="sp-gubun_2">입금</span>
                                <?php } ?>
                            </td>
                            <!--<td><input type="checkbox" id="chk1" name=""><label for="chk1"></label></td>-->						
                            <!--<td><?=$row['NICK_NM'];?></td>-->
                            <td><?=$this->common->format_number(substr($row['TRSC_DTM'],0,8), 4);?></td>						
                            <!--<td><?=$row['BANK_CD'];?></td>-->
                            <td><?=$row['ACCT_NO'];?></td>
                            <td><?=$row['BANK_NM'];?></td>						
                            <td class="T-left"><?=$row['RMRK'];?></td>
                            <td><?=$row['USE_USAG_NM'];?></td>
                            <td class="T-right"><?=number_format($row['RCV_AMT'])."원";?></td>						
                            <td class="T-right"><?=number_format($row['WDRW_AMT'])."원";?></td>
                            <td class="T-right"><?=number_format($row['BAL'])."원";?></td>						
                            <td class="T-left"><?=$row['MEMO'];?></td>						
                        </tr>
                        <?php endforeach ?>				
                    <?php } else { ?>
                        <tr>
                            <td colspan="11">데이터가 없습니다.</td>
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
    <div class="total">
        <ul>
            <li class='T-right'>총 검색 : <strong id="page_count">1</strong><span>건</span></li>
        </ul>
    </div>
</div>


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

