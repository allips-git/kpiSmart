<?php // 거래처 팝업창 페이지 ?>
<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/food/biz_li_pop.css?<?=time()?>">
<link rel="stylesheet" href="/public/css/food/popup.css?<?=time()?>">

<div class="popup biz_pop">
    <div class="title">거래처 검색
        <span class="b-close">&times;</span>
    </div>
    <div class="inner">
        <div class="search_wrap">
            <div class="input_line w10">
                <select id="" name="">
                    <option value="">거래처명(별칭)</option>
                </select>
            </div>
            <div class="input_line w20">
                <input type="text" id="" name="" autocomplete="off" placeholder="검색어를 입력하세요.">
            </div>
            <div class="input_line w12">
                <select id="" name="">
                    <option value="">거래처등급_전체</option>
                </select>
            </div>
            <div class="input_line w12">
                <select id="" name="">
                    <option value="">결제조건_전체</option>
                </select>
            </div>
            <button type="button">검색</button>
        </div>

        <div class="list_wrap">
            <div class="n-scroll">
                <table>
                    <thead>
                        <tr>
                            <th class="w9">구분</th>
                            <th>거래처명</th>
                            <th class="w13">사업자/주민번호</th>
                            <th class="w12">대표자명</th>
                            <th class="w12">영업담당자</th>
                            <th class="w12">한도금액</th>
                            <th class="w12">미수잔액</th>
                            <th class="w10">거래처선택</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="h-scroll">
                <table class="hovering at ac">
                    <tbody>
                        <!-- 리스트 10줄 가능 -->
                        <tr>
                            <td class="w9">매출</td>
                            <td class="T-left Elli">거래처명</td>
                            <td class="w13">182-00-00260</td>
                            <td class="w12">홍길동</td>
                            <td class="w12">홍길동</td>
                            <td class="w12 T-right">1,000,000원</td>
                            <td class="w12 T-right">1,000,000원</td>
                            <td class="w10">
                                <button type="button">선택</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="pagination" class="pagination">
                <div class="paginationjs paginationjs-theme-blue paginationjs-small">
                    <div class="paginationjs-pages">
                        <ul>
                            <li class="paginationjs-prev disabled "><a>«</a></li>
                            <li class="paginationjs-page J-paginationjs-page active" data-num="1"><a>1</a></li>
                            <li class="paginationjs-page J-paginationjs-page " data-num="2"><a>2</a></li>
                            <li class="paginationjs-page J-paginationjs-page " data-num="3"><a>3</a></li>
                            <li class="paginationjs-next"><a>»</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="total">
        <ul>
            <li class="T-right">총 검색 : <strong id="page_count">1</strong><span>건</span></li>
        </ul>
    </div>
    
</div>
<script>
    $('.biz_btn').click (function(){
        $('.biz_pop').bPopup({
          modalClose: false
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