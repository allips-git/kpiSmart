<?php // 수도계량 등록 ?>
<input type="hidden" id="title" value="<?php echo $title ?>">
<input type="hidden" id="site_url" value="<?php echo $site_url ?>">

<link rel="stylesheet" href="/public/css/lib/jquery-ui.css">
<script src="/public/js/lib/jquery-ui.js"></script>
<link rel="stylesheet" href="/public/css/loading.css">
<link rel="stylesheet" href="/public/css/food/work.css?<?=time()?>">
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
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $w = Authori::get_list()['data']->write; // 쓰기 권한
    $m = Authori::get_list()['data']->modify; // 쓰기 권한
    $d = Authori::get_list()['data']->delete; // 삭제 권한
?>
<div class="content water">
    <?php // 검색 ?>
    <form id="frm_search" name="frm_search" method="post" accept-charset="utf-8" onsubmit="return false;">
        <div class="search_zone section01 section">
            <dl>
                <dt>검색</dt>
                <dd>
                    <div class="input_line w10">
                        <select id="keyword" name="keyword">
                            <option value="w.volume">사용량</option>
                            <option value="w.memo">비고</option>
                        </select>
                    </div>
                    <div class="input_line w20">
                        <input type="text" id="content" name="content" autocomplete="off" placeholder="검색어를 입력하세요.">
                    </div>
                    <div class="input_line w10">
                        <select id="wg_gb" name="wg_gb">
                            <option value="">단위_전체</option>
                            <option value="015">㎥</option>
                            <option value="016">ℓ</option>
                            <option value="017">㎖</option>
                            <option value="018">g</option>
                            <option value="019">kg</option>
                            <option value="020">톤</option>
                            <option value="021">TON</option>
                        </select>
                    </div>
                </dd>
            </dl>
        </div>
    </form>

    <div class="bottom">
        <?php $attributes = array("id" => "frm_reg", "method" => "post", "accept-charset" => "utf-8", "onsubmit" => "return frm_chk();"); ?>
        <?php echo form_open($site_url."/v", $attributes); ?>
            <input type="hidden" id="p" class="p" name="p" value="in">
            <input type="hidden" id="ikey" class="ikey" name="ikey" value="">
            <input type="hidden" id="page" name="page" value="">
            <div class="input_zone section">
                <div class="input_wrap">
                    <h4>수도 계량 정보 입력
                        <button type="button" class="F-right btn_reset"><i class="btn_re_icon" aria-hidden="true"></i></button>
                    </h4>
                    <dl>
                        <dt class="impt">기준일</dt>
                        <dd>
                            <div class="date_line w120p">
                                <input type="text" id="base_dt" class="datepicker w80 base_dt" name="base_dt" autocomplete="off" readonly onclick="call_date(this)">
                            </div>
                        </dd>
                    </dl>
                    <dl class="half">
                        <dt class="impt">사용량</dt>
                        <dd>
                            <div class="input_line">
                                <input type="text" id="volume" class="volume" name="volume" autocomplete="off" required>
                            </div>
                        </dd>
                        <dt class="impt">단위</dt>
                        <dd>
                            <div class="input_line">
                                <select class="unit" name="unit" id="unit">
                                    <option value="015">㎥</option>
                                    <option value="016">ℓ</option>
                                    <option value="017">㎖</option>
                                    <option value="018">g</option>
                                    <option value="019">kg</option>
                                    <option value="020">톤</option>
                                    <option value="021">TON</option>
                                </select>
                            </div>
                        </dd>
                    </dl>
                    <dl class="bgo">
                        <dt>비고</dt>
                        <dd>
                            <div class="input_line">
                                <textarea id="memo" class="memo" name="memo" cols="30" rows="10"></textarea>
                            </div>
                        </dd>
                    </dl>
                    <p class='imptp'><span>*</span> 은 필수 입력 항목입니다.</p>
                </div>
                <div class="btn_wrap div_reg">
                    <?php if($w == "Y") { ?>
                        <button type="button" class="btn_reg">등록</button>
                    <?php } else{ ?>
                        <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">등록</button>
                    <?php } ?>
                </div>
                <div class="btn_wrap div_mod" style="display: none;">
                    <?php if($d == "Y") { ?>
                        <button type="button" class="btn_del gray">삭제</button>
                    <?php } else{ ?>
                        <button type="button" id="d_enroll" class="disable gray" onclick="alert('권한이 없습니다.');">삭제</button>
                    <?php } ?>
                    <?php if($m == "Y") { ?>
                        <button type="button" class="btn_mod">수정</button>
                    <?php } else{ ?>
                        <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">수정</button>
                    <?php } ?>
                </div>
            </div>
        <?php echo form_close(); ?>
        <div class="list_zone section">
            <h2>수도 계량 리스트</h2>
            <div class="list_wrap">
                <div class="n-scroll">
                    <table id="myTable" class="hovering at ac">
                        <thead>
                            <tr>
                                <th class="fixedHeader w6">순번</th>
                                <th class="fixedHeader w10">기준일</th>
                                <th class="fixedHeader w12">사용량(단위)</th>
                                <th class="sorter-false">비고</th>
                                <th class="sorter-false w12">등록자명(ID)</th>
                                <th class="sorter-false w12">등록일시</th>
                                <th class="sorter-false w12">수정자명(ID)</th>
                                <th class="sorter-false w12">수정일시</th>
                            </tr>
                        </thead>
                        <tbody id="data-container">
                            <?php // js ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <?php // pagination ?>
            <div id="pagination" class="pagination">
                    <div class="view_count">
                        <select id="page_size">
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
                    <li class='T-right'>총 검색 : <strong id="list_cnt">0</strong><span>건</span></li>
                </ul>
            </div>
        </div>
    
    <script src="/public/js/food/water_gauge.js?<?=time();?>"></script>
    <script>
    // sort plugin
    $(function() {
        $("#myTable").tablesorter({
            theme : 'blue',
            headers: {
                // disable sorting of the first & second column - before we would have to had made two entries
                // note that "first-name" is a class on the span INSIDE the first column th cell
                '.sorter-false' : {
                    // disable it by setting the property sorter to false
                    sorter: false
                }
            }
        });
    });
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