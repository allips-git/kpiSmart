<?php // 공지사항 관리 페이지 ?>
<input type="hidden" id="site_url" value="<?=$site_url ?>">
<input type="hidden" id="tag" class="tag" name="tag" value="l">
<!-- <link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script> -->

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<link rel="stylesheet" href="/public/css/food/cs.css?<?=time()?>">

<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write; // 쓰기 권한
    $m = Authori::get_list()['data']->modify; // 쓰기 권한
?>
 <!-- 드론월드 -->
<input type="hidden" id="modify" value="<?=$m ?>">
<div class="notice content">
    <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
        <div class="search_zone section01 section">
            <dl>
                <dt>검색</dt>
                <dd>
                    <div class="input_line w10">
                        <select id="keyword" name="keyword">
                            <option value="title" selected>제목</option>
                            <option value="content">내용</option>
                        </select>
                    </div>
                    <div class="input_line w20">
                        <input type="text" id="content" name="content" autocomplete="off" placeholder="검색어를 입력하세요.">
                    </div>
                    <div class="input_line w10">
                        <select id="category" name="category">
                            <option value="" selected>구분_전체</option>
                            <option value="N">일반</option>
                            <option value="S">중요</option>
                        </select>
                    </div>
                    <div class="input_line w10">
                        <select id="useyn" name="useyn">
                            <option value="">가용여부_전체</option>
                            <option value="Y" selected>사용가능</option>
                            <option value="N">사용불가</option>
                        </select>
                    </div>
                </dd>
            </dl>
        </div>
    </form>
    
	<div class="bottom">
		<div class="list_zone section">
			<h4>KPI 관리</h4>
     

			<div class="h-scroll mCustomScrollbar">
      <canvas id="myChart" style="margin-left:2%; height:500px;"></canvas>
				<table class="hovering at">
					<tbody id="data-container" class="">

         
                            <?php // js ?>
               </tbody>
				</table>
			</div>
			<!-- pagination -->
			<div id="pagination" class="pagination"></div>
            <div class="view_count">
                <select id="page_size">
                    <option value="15">페이지 보기 15</option>
                    <option value="30">페이지 보기 30</option>
                    <option value="50" selected>페이지 보기 50</option>
                    <option value="100">페이지 보기 100</option>
                </select>
            </div>
            <span id = "aver" style = "margin: 20px;">123123</span>
		</div>
	</div>

    <div class="total">
        <ul>
            <li class='T-right'>총 검색 : <strong id="list_cnt">0</strong><span>건</span></li>
        </ul>
    </div>
</div>

<script src="/public/js/food/kpi.js?<?=time();?>"></script>
