<?php // 메인 페이지 ?>
<input type="hidden" id="site_url" value="<?=$site_url ?>">
<link rel="stylesheet" href="/public/css/food/main.css?<?=time()?>">
<!-- <script src="/public/js/lib/Chart.min.js?<?=time()?>"></script> -->
<script src="/public/js/lib/waypoints.min.js"></script>
<script src="/public/js/lib/jquery.counterup.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.3.0/snap.svg-min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/waypoints/2.0.3/waypoints.min.js"></script>
<style>
	.img_cursor {cursor: pointer !important;}
	.aside{transition:none}
	.container.open{transition: none;}
	.container{margin-left:0 !important}
	.cursor{cursor: pointer}
</style>
<div class="main">
	<div class="inner">
		<div class="left">
			<div class="box box01">
				<h4>빠른 메뉴 바로가기</h4>
				<div class="icon_wrap">
					<div class="icon icon01" style="cursor: auto;">
						<div class="img img01 img_cursor" onclick="location.href='/ord/ord_list'"></div>
						<p class="img_cursor" onclick="location.href='/ord/ord_list'">수주 관리</p>
					</div>
					<div class="icon icon03" style="cursor: auto;">
						<div class="img img03 img_cursor" onclick="location.href='/stock/prod_out'"></div>
						<p class="img_cursor" onclick="location.href='/stock/prod_out'">제품 출고</p>
					</div>
					<div class="icon icon05" style="cursor: auto;">
						<div class="img img05 img_cursor" onclick="location.href='/stock/inout_li'"></div>
						<p class="img_cursor" onclick="location.href=''">입출고 이력</p>
					</div>
					<div class="icon icon02" style="cursor: auto;">
						<div class="img img02 img_cursor" onclick="location.href='/base/item_list'"></div>
						<p class="img_cursor" onclick="location.href='/base/item_list'">품목 관리</p>
					</div>
					<div class="icon icon06" style="cursor: auto;">
						<div class="img img06 img_cursor" onclick="location.href='/biz/client'"></div>
						<p class="img_cursor" onclick="location.href='/biz/client'">고객 등록</p>
					</div>
					<div class="icon icon04" style="cursor: auto;">
						<div class="img img04 img_cursor" onclick="location.href='/base/user'"></div>
						<p class="img_cursor" onclick="location.href='/base/user'">사원 등록</p>
					</div>
				</div>
			</div>
			<div class="box box02">
				<h4>현재 접속중</h4>
				<div class="now">
					<ul>
						<li>관리자 (admin)</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="right">
			<!-- <div class="wrap wrap01">
				<div class="box box01">
					<h4>당일 접수 현황</h4>
					<p class=' counter'>4</p> -->
					<!-- <div class="charts-container ">
						<div class="chart" id="graph-1-container">
							<div class="chart-svg">
								<svg class="chart-line" id="chart-1" viewBox="0 0 80 40"></svg>
							</div>
						</div>
					</div> -->
				<!-- </div>
				<div class="box box02">
					<h4>당일 구매 현황</h4>
					<p class=' counter'>8</p>
				</div>
				<div class="box box03">
					<h4>한달 접수 현황</h4>
					<p class=' counter'>1</p>
				</div>
				<div class="box box04">
					<h4>당일 입출고 현황</h4>
					<p class="counter">3</p>
				</div>
			</div> -->
			<div class="wrap wrap02">
				<div class="date"><?= date("Y년 m월 d일"); ?></div>
				<div class="first">
					<div class="box box09">
						<ul>
							<li class="li01">
								<b>수주</b>
								<p class="cursor" onclick='location.href="/ord/ord_list"'>
									<span class="counter"><?= !empty($stock->ord_amt) ? number_format($stock->ord_amt) : 0; ?></span> 원
								</p>
							</li>
						</ul>
					</div>
					<div class="box box09">
						<ul>
							<li class="li04">
								<b>제품 출고</b>
								<p class="cursor" onclick='location.href="/stock/prod_out"'>
									<span class="counter"><?= !empty($stock->out_qty) ? number_format($stock->out_qty) : 0; ?></span> 건
								</p>
							</li>
						</ul>
					</div>
					<div class="box box9">
						<ul>
							<li class="li02">
								<b>구매 발주</b>
								<p class="cursor" onclick='location.href="/ord/ord_buy"'>
									<span class="counter"><?= !empty($stock->buy_qty) ? number_format($stock->buy_qty) : 0; ?></span> 건
								</p>
							</li>
						</ul>
					</div>
					<div class="box box10">
						<ul>
							<li class="li03">
								<b>구매 입고</b>
								<p class="cursor" onclick='location.href="/stock/prod_put"'>
									<span class="counter"><?= !empty($stock->in_qty) ? number_format($stock->in_qty) : 0; ?></span> 건
								</p>
							</li>
						</ul>
					</div>
				</div>
				<!-- <div class="box box11">
					<h4>정산 계좌 정보</h4>
					<p>한국은행 <span>11100000000</span></p>
				</div> -->
			</div>
			<div class="wrap wrap03">
				<div class="box box12">
					<div class="noti">
						<h4>공지사항
							<a href="/cs/notice">더보기 <i class="fa fa-angle-right" aria-hidden="true"></i></a>
						</h4>
						<div class="table_wrap">
                            <div class="n-scroll">
                                <table class='hovering'>
                                    <thead>
                                        <tr>
                                            <th class='w10'>구분</th>
                                            <th>제목</th>
                                            <th class='w12'>등록자명(ID)</th>
                                            <th class='w15'>날짜</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="h-scroll">
                                <table>
                                    <tbody>
                                        <?php if(count($notice) > 0) { ?>
                                            <?php foreach($notice as $row) :?>
                                                <tr onclick="location.href='/cs/notice/detail?ikey=<?= $row->ikey ?>'" style="cursor:pointer;">
                                                    <?php if ($row->category === 'N') { ?>
                                                        <td class='w10'><span>일반</span></td>
                                                    <?php } else { ?>
                                                        <td class='w10'><span class='impt'>긴급</span></td>
                                                    <?php } ?>
                                                    <td class='T-left Elli'><?= $row->title ?></td>
                                                    <td class='Elli w12'><?= $row->reg_nm ?></td>
                                                    <td class='Elli w12'><?= $row->reg_dt ?></td>
                                                </tr>
                                            <?php endforeach ?>
                                        <?php } else { ?>
                                            <tr>
                                                <td class='Elli colspan="4"'>조회 가능한 데이터가 없습니다.</td>
                                            </tr>
                                        <?php } ?>
                                    </tbody>
                                </table>
                            </div>
						</div>
					</div>
				</div>
				<!-- <div class="box box13">
					<div class="noti">
						<h4>시스템 문의</h4>
						<div class="table_wrap">
							<table class='hovering'>
								<thead>
									<tr>
										<th class='w15'>구분</th>
										<th>제목</th>
										<th class='w17'>등록자</th>
										<th class='w18'>날짜</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><span>사용</span></td>
										<td class='T-left Elli'>시스템 문의 제목입니다.</td>
										<td class='Elli'>관리자</td>
										<td class='Elli'>2022-04-04</td>
									</tr>
									<tr>
										<td><span>사용</span></td>
										<td class='T-left Elli'>시스템 문의 제목입니다.</td>
										<td class='Elli'>관리자</td>
										<td class='Elli'>2022-04-04</td>
									</tr>
									<tr>
										<td><span>사용</span></td>
										<td class='T-left Elli'>시스템 문의 제목입니다.</td>
										<td class='Elli'>관리자</td>
										<td class='Elli'>2022-04-04</td>
									</tr>
									<tr>
										<td><span>사용</span></td>
										<td class='T-left Elli'>시스템 문의 제목입니다.</td>
										<td class='Elli'>관리자</td>
										<td class='Elli'>2022-04-04</td>
									</tr>
									<tr>
										<td><span>사용</span></td>
										<td class='T-left Elli'>시스템 문의 제목입니다.</td>
										<td class='Elli'>관리자</td>
										<td class='Elli'>2022-04-04</td>
									</tr>
									<tr>
										<td><span>사용</span></td>
										<td class='T-left Elli'>시스템 문의 제목입니다.</td>
										<td class='Elli'>관리자</td>
										<td class='Elli'>2022-04-04</td>
									</tr>
									<tr>
										<td><span>사용</span></td>
										<td class='T-left Elli'>시스템 문의 제목입니다.</td>
										<td class='Elli'>관리자</td>
										<td class='Elli'>2022-04-04</td>
									</tr>
									<tr>
										<td><span>사용</span></td>
										<td class='T-left Elli'>시스템 문의 제목입니다.</td>
										<td>관리자</td>
										<td class='Elli'>2022-04-04</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div> -->
			</div>
		</div>
	</div>
</div>
<script>
	$('.aside').hide();
	$('.container').addClass('open');
	$('.header .toggle_btn').hide();

</script> 
<script>
	jQuery(document).ready(function($) {
		$('.counter').counterUp({
			delay: 10,
			time: 1000
		});
	});
</script> 

<!-- <script src="/public/js/food/graph_chart.js?<?=time()?>"></script> -->

<!-- <script>
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
</script>