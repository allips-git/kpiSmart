<?php // 온라인 주문 리스트 팝업 페이지 ?>
<link rel="stylesheet" href="/public/css/food/biz_li_pop.css?<?=time()?>">
<script>
    $(function () {
        var date = new Date();
        $(".pop_datepicker")
        .datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png', // 달력 아이콘 이미지 경로
            buttonImageOnly: true, //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false, // 월선택 select box 표시 (기본은 false)
            changeYear: false, // 년선택 selectbox 표시 (기본은 false)
        }).datepicker("setDate", get_date("시작일")); // start date setting
        $(".pop_datepicker2")
        .datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: 'button',
            buttonImage: '/public/img/calender_img.png', // 달력 아이콘 이미지 경로
            buttonImageOnly: true, //  inputbox 뒤에 달력 아이콘만 표시
            changeMonth: false, // 월선택 select box 표시 (기본은 false)
            changeYear: false, // 년선택 selectbox 표시 (기본은 false)
        }).datepicker("setDate", get_date("말일")); // end date setting
    });
</script>
<div class="popup ord_li_pop">
    <div class="title">수주 목록
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <?php // 검색 ?>
        <form class="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
            <div class="search_wrap">
                <div class="input_line w12">
                    <select class="keyword" name="keyword">
                        <option value="m.cust_nm">고객(별칭)명</option>
                        <option value="m.biz_nm">사업장(고객)명</option>
                        <option value="d.client_nm">고객명</option>
                        <option value="m.cust_cd">고객 코드</option>
                        <option value="m.ord_no">주문번호</option>
                        <option value="d.lot">주문지시번호</option>
                        <option value="m.memo">비고</option>
                    </select>
                </div>
                <div class="input_line w20">
                    <input type="text" class="content" name="content" placeholder="검색어를 입력하세요." autocomplete="off">
                </div>
                <div class="input_line w8">
                    <select>
                        <option value="">주문일</option>
                    </select>
                </div>
                <div class="date_line w120p">
                    <input type="text" class="start_dt pop_datepicker datepick w80 readonly" name="start_dt" value="" onclick="javascript:call_date(this);" autocomplete="off">
                </div>&nbsp; ~ &nbsp;
                <div class="date_line w120p">
                    <input type="text" class="end_dt pop_datepicker2 datepick w80 readonly" name="end_dt" value="" onclick="javascript:call_date(this);" autocomplete="off">
                </div>
                <button type="button" class="btn_search" style="margin-left:10px">검색</button>
            </div>
        </form>

        <div class="list_wrap">
            <div class="table_wrap h-scroll">
                <table>
                    <thead>
                        <tr>
                            <th class="w4">순번</th>
                            <th class="w8">주문일</th>
                            <th class="w10 tablet">주문번호</th>
                            <th class="w12">거래처(별칭)명</th>
                            <th>제품명</th>
                            <th class="w12">규격(단위)</th>
                            <th class="w7">금액</th>
                            <th class="w7">세액</th>
                            <th class="w5">주문수량</th>
                            <th class="w5">출고수량</th>
                            <th class="w5">잔여수량</th>
                        </tr>
                    </thead>
                    <tbody id="ord-container">
                        <?php // js ?>
                    </tbody>
                </table>
            </div>
            <?php // pagination ?>
            <div id="ord_pagination" class="pagination"></div>
            <div class="view_count">
                <select class="page_size">
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
            <li class="T-right">총 검색 : <strong class="list_cnt">0</strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/food/ord_li.js?<?=time();?>"></script>
<script>
    $('.btn_ord_li').click (function() {

        // 온라인 주문 내역 조회
        get_ord_li($(".frm_search").serializeObject());

        $('.ord_li_pop').bPopup({
            modalClose: true
          , opacity: 0.8
          , positionStyle: 'absolute' 
          , speed: 300
          , transition: 'fadeIn'
          , transitionClose: 'fadeOut'
          , zIndex : 99997
            //, modalColor:'transparent' 
        }); 
    });  
</script>