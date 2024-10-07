<?php // 제품 재고 리스트 페이지 ?>
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
<div class="popup prod_st_pop">
    <div class="title">제품 재고 목록
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <div class="list_wrap">
            <div class="table_wrap h-scroll">
                <table>
                    <thead>
                        <tr>
                            <th class="w4">순번</th>
                            <th class="w8">제품코드</th>
                            <th class="w12">바코드번호</th>
                            <th>제품명</th>
                            <th class="w12">규격(단위)</th>
                            <th class="w12">창고위치</th>
                            <th class="w8">유통기한</th>
                            <th class="w8">입고단가</th>
                            <th class="w8">안전재고</th>
                            <th class="w8">현재고</th>
                        </tr>
                    </thead>
                    <tbody id="stock-container">
                        <?php // js ?>
                    </tbody>
                </table>
            </div>
            <?php // pagination ?>
            <div id="stock_pagination" class="pagination"></div>
            <div class="view_count">
                <select class="stock_page_size">
                    <option value="15">페이지 보기 15</option>
                    <option value="30">페이지 보기 30</option>
                    <option value="50" selected>페이지 보기 50</option>
                    <option value="100">페이지 보기 100</option>
                </select>
            </div>
        </div>
    </div>
    <div class="total">
        <ul>
            <li class="T-right">총 검색 : <strong class="stock_cnt">0</strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/food/prod_st_pop.js?<?=time();?>"></script>
<script>
    $('.btn_prod_st').click (function() {

        // 제품 재고 내역 조회
        var item_cd = $(".item_cd").val();
        if(item_cd != '')
        {
            get_stock_list({'item_cd':item_cd});
            $('.prod_st_pop').bPopup({
              modalClose: true
              , opacity: 0.8
              , positionStyle: 'absolute' 
              , speed: 300
              , transition: 'fadeIn'
              , transitionClose: 'fadeOut'
              , zIndex : 99997
                //, modalColor:'transparent' 
            }); 
        }
        else
        {
            alert('주문 선택 후 제품 선택 가능합니다.');
        }
    });  
</script>