<?php // 공지사항 상세 페이지 ?>
<input type="hidden" id="site_url" value="<?=$site_url ?>">
<input type="hidden" id="tag" class="tag" name="tag" value="v">
<input type="hidden" id="ikey" class="ikey" name="ikey" value="<?=$ikey ?>">
<link rel="stylesheet" href="/public/css/food/cs.css?<?=time()?>">
<?php
    /** foreach에서 배열로 돌리면 대기시간이 길어 변수로 선언 - 권한 변수 */
    $m = Authori::get_list()['data']->modify; // 쓰기 권한
?>
<div class="notice_v content">
    <div class="section">
        <h4>공지사항 상세
            <button type="button" id="btn_del" class="delete">삭제</button>
        </h4>
        <div class="top_table">
            <table>
                <tr>
                    <th>구분</th>
                    <td class="T-left" id="category"></td>
                    <th>등록일자</th>
                    <td class="T-left" id="reg_dt"></td>
                </tr>
                <tr>
                    <th>제목</th>
                    <td class="T-left" id="title"></td>
                    <th>등록자명</th>
                    <td class="T-left" id="reg_nm">
                        
                    </td>
                </tr>
            </table>
        </div>
        <div class="main_table">
            <table>
                <tr>
                    <th>내용</th>
                    <td class="T-left">
                        <div id="content" class="inner">
                            <!-- <textarea name="content" id="content" cols="30" rows="10" readonly></textarea> -->
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
<!--     <div class="section">
        <div class="last_table">
            <table>
                <tr>
                    <th>이전 글</th>
                    <td class="T-left tb_click">1</td>
                </tr>
                <tr>
                    <th>다음 글</th>
                    <td class="T-left tb_click">2</td>
                </tr>
            </table>
        </div>
    </div> -->
    <div class="btn_wrap">
        <button type="button" class="gray" onclick="location.href='/cs/notice'">목록</button>
        <?php if($m == "Y") { ?>
            <button type="button" id="btn_move_u" class="blue">수정</button>
        <?php } else{ ?>
            <button type="button" id="d_enroll" class="disable" onclick="alert('권한이 없습니다.');">수정</button>
        <?php } ?>
    </div>
</div>

<script src="/public/js/food/notice_in.js?<?=time();?>"></script>