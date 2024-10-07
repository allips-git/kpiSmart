<!--카드매입 내역 조회 페이지-->
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

<div class="content account card_purchase">
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
                            <option>승인일자</option>
                        </select>		
                    </div>
                    <div class="date_line w120p">		
                        <input type="text" class="datepicker w80" name="startdt" readonly="readonly" value="<?php if(isset($params['startdt'])){ echo $params['startdt']; } ?>">
                    </div>
                        &nbsp; ~ &nbsp;
                    <div class="date_line w120p">		
                        <input type="text" class="datepicker w80" name="enddt" readonly="readonly" value="<?php if(isset($params['enddt'])){ echo $params['enddt']; } ?>">
                    </div>
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
            <h4>카드 매입 리스트</h4>
            <div class="n-scroll mCustomScrollbar">
                <table class="hovering ac">
                    <thead>
                        <tr>
                            <!--<th><input type="checkbox" id="chk" name=""><label for="chk"></label></th>-->
                            <th>카드사명</th>
                            <th>카드번호</th>
                            <th>승인일자</th>
                            <th>승인취소여부</th>
                            <th>승인취소일자</th>
                            <th>결제예정일</th>
                            <th>승인금액</th>
                            <th>공급가액</th>
                            <th>부가세</th>
                            <th>가맹점명</th>
                            <th>가맹점대표자명</th>
                            <th>가맹점전화번호</th>
                            <th>매입여부</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="h-scroll">
                <table>
                    <tbody>
                        <?php if(empty($list)){?>
                            <tr>
                                <td colspan="13">데이터가 없습니다.</td>
                            </tr>				
                        <?php }else{ ?>
                            <?php foreach ($list as $row) :?>
                            <tr>
                                <!--<td><input type="checkbox" id="chk1" name=""><label for="chk1"></label></td>-->
                                <td><?=$row['BANK_NM'];?></td>
                                <td><?=$row['CARD_NO'];?></td>
                                <td><?=$this->common->format_number(substr($row['APV_DT'],0,8), 4);?></td>
                                <td><?=$row['APV_CAN_YN'];?></td>
                                <td><?=$row['APV_CAN_DT'];?></td>
                                <td><?=$row['SETL_SCHE_DT'];?></td>
                                <td><?=number_format($row['APV_AMT'])."원";?></td>
                                <td><?=number_format($row['SPLY_AMT'])."원";?></td>
                                <td><?=number_format($row['VAT_AMT'])."원";?></td>
                                <td><?=$row['MEST_NM'];?></td>
                                <td><?=$row['MEST_REPR_NM'];?></td>
                                <td><?=$row['MEST_TEL_NO'];?></td>
                                <td><?=$row['BUY_YN'];?></td>
                            </tr>
                            <?php endforeach ?>				
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

