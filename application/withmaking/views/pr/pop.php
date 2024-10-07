
<?php 
if (isset($_GET['data'])) {
    $data = json_decode(urldecode($_GET['data']), true);

    $orderNo = isset($data[0]['orderNo']) ? $data[0]['orderNo'] : '데이터 없음';
    $item_nm = isset($_GET['item_nm']) ? $_GET['item_nm'] : '';
    $size = isset($_GET['size']) ? $_GET['size'] : ''; 
    $date = isset($data[0]['date']) ? $data[0]['date'] : '데이터 없음'; 
    $item_cd = isset($_GET['item_cd']) ? $_GET['item_cd'] : '데이터 없음';

    $qrUrl = "https://www.drone-world.co.kr/item_pop?item_cd=" . urlencode($item_cd);

}   

?>

<table class="label">
        <tr>
            <th>지시일자</th>
            <td><?php echo $date?></td>
            <td rowspan="6">
                <div id="qr-code-container" style="text-align: center;"> <!-- 중앙 정렬을 위한 컨테이너 -->
                    <div id="qr-code"></div>
                </div>
            </td>
        </tr>
        <tr>
            <th>제조오더번호</th>
            <td id = "orderNo"><?php echo $orderNo?></td>
        </tr>
        <tr>
            <th>제품명</th>
            <td id="product-name"><?php echo $item_nm?></td>
        </tr>
        <tr>
            <th>규격 단위</th>
            <td id = "size"><?php echo $size?></td>
        </tr>
        <tr>
            <th>업체명</th>
            <td>(주) 드론월드</td>
        </tr>
        <tr>
            <th>전화번호</th>
            <td>01066642628</td>
        </tr>
    </table>



<style>

.label {
    width: 100mm;
    font-size: 10px;
    border-spacing: 0;
    border-collapse: collapse;
    table-layout: fixed;
    float:left;
}

.label tr th, .label tr td {
    padding: 1px; /* 패딩을 최소화합니다. */
    border: 1px solid black;
    line-height: 2.4; /* 라인 높이를 줄입니다. */
    height: auto; /* 셀의 높이를 내용에 맞게 자동으로 조정합니다. */
    
}

.label tr th {
    width: 30mm;
}

.label tr td {
    width: 70mm;
    text-align: center;
}

.label tr td[rowspan]{
    width: 25mm;
}

@media print {
  @page {
    margin: 0; /* 모든 마진 제거 */
  }
  body * {
    visibility: hidden; /* 페이지의 모든 요소를 숨깁니다. */
    margin: 0;
    padding: 0;
  }
  .label, .label * {
    visibility: visible; /* 인쇄할 테이블과 테이블 내 요소만 보이도록 설정합니다. */
    max-width: none; /* 최대 너비 제한을 해제 */
  }
  #qr-code-container {
    width: 80px; /* 인쇄 시 QR 코드 컨테이너 너비 조정 */
    margin-left: auto;
    margin-right: auto;
  }
  .label {
    position: absolute;
    left: 0.5%; /* 왼쪽에 마진 추가 */
    top: 0.5%;
    right: 0.5%; /* 오른쪽에 마진 추가 */
    width: 100%; /* 인쇄 시 테이블 너비 조정 */
  }
  .label tr th, .label tr td {
    page-break-inside: avoid; /* 테이블 내부에서 페이지 나눔을 방지합니다. */
  }
}
</style>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
<script>



// $.ajax({
//     url: '/pr/job_ord/item_list',
//     data: { itemCd: itemCd }, 
//     datatype: 'json',
//     type: 'POST',
//     success: function(res){
//         console.log(res);
//         $('#product-name').text(res.item_nm);
//         $('#size').text(res.size);
//     },
//     error: function(res1){
//         console.log(res1);
//     }
// });

    // QR 코드 생성
    new QRCode(document.getElementById("qr-code"), {
        text: "<?php echo $qrUrl ?>",
        width: 80, // QR 코드의 너비
        height: 80 // QR 코드의 높이
    });




</script>
