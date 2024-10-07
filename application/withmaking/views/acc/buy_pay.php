<?php // 매입/지급 관리 페이지 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/loading.css">
<link rel="stylesheet" href="/public/css/food/acc.css?<?=time()?>">
<style>
    .sp_title {
        color: red;
        font-weight: bold;
    }
    .hint {
        text-align: center;
        color: blue;
        font-weight: bold;
    }
</style>
<script>
    $(function() {
        // 기본날짜 세팅
        $("#start_dt").datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false                               // 년선택 selectbox 표시 (기본은 false)
        }).datepicker("setDate", get_date("시작일"));      // start date setting
        $("#end_dt").datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png',    // 달력 아이콘 이미지 경로
            buttonImageOnly: true,                          //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false,                             // 월선택 select box 표시 (기본은 false)
            changeYear: false                               // 년선택 selectbox 표시 (기본은 false)
        }).datepicker("setDate", get_date("말일"));           // end date setting
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
    $w = Authori::get_list()['data']->write;    // 등록 권한
?>
<div class="content ord_pay buy_pay">
    <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
        <div class="search_zone section01 section">
            <dl>
				<dt>
					<span>검색</span>
				</dt>
				<dd>
					<div class="input_line w8">
                        <select name="" id="">
                            <option value="">거래처(별칭)명</option>
                        </select>
					</div>
                    <div class="input_line w17">
                        <input type="hidden" class="cust_cd" name="cust_cd" value="">
                        <select id="biz_list" onchange="change_item(this.id);">
                            <?php // js ?>
                        </select>
                    </div>
					<div class="input_line" style="width:80px;">
						<select id="" name="">
							<option value="">거래일</option>
						</select>
					</div>
                    <div class="date_line w120p">
                        <input type="text" id="start_dt" class="w80 readonly datepick" name="start_dt" value="" onclick="javascript:call_date(this);">
					</div>
                    &nbsp;&nbsp;~&nbsp;&nbsp;
                    
                    <div class="date_line w120p">
                        <input type="text" id="end_dt" class="w80 readonly datepick" name="end_dt" value="" onclick="javascript:call_date(this);">
					</div>
					&nbsp;&nbsp;&nbsp;
                    <button type="button" id="btn_search">검색</button>
				</dd>
			</dl>
        </div>
    </form>

    <div class="bottom">
        <div class="list_zone section">
            <h2>매입/지급 리스트</h2>
            <div class="btns" style="display: none;">
                <?php if($w == "Y") { ?>
                    <button type="button" class="add_buy_pay blue">지급 등록</button>
                <?php } else{ ?>
                    <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">지급 등록</button>
                <?php } ?>
            </div>
            <div class="list_wrap">
                <div class="n-scroll">
                    <table id="" class="hovering at ac">
                        <thead>
                            <tr>
                                <th class="w5">순번</th>
                                <th class="w6">거래일자</th>
                                <th class="w6">거래구분</th>
                                <th class="w7">전표번호</th>
                                <th class="w5">결제방식</th>
                                <th class="w15">은행정보</th>
                                <th class="w7">금액</th>
                                <th class="w7">세액</th>
                                <th class="w7">미지급액</th>
                                <th class="">비고</th>
                                <th class="w8">등록자명(ID)</th>
                                <th class="w8">등록일시</th>
                            </tr>
                        </thead>
                        <?php // js ?>
                        <tbody id="data-container">
                            <tr>
                                <td colspan="12">거래처 검색 후 데이터 조회 가능합니다.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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
            <li class='T-right'>총 검색 : <strong id="list_cnt">0</strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/food/common_select2.js?<?=time();?>"></script>
<script src="/public/js/food/buy_pay.js?<?=time();?>"></script>
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