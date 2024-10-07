<!DOCTYPE html>
<html>
<head>
    <title>Barcode Print</title>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
</head>
<body>
    <canvas id="barcode"></canvas> <!-- div 대신 canvas 사용 -->
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            var params = new URLSearchParams(window.location.search);
            var data = JSON.parse(decodeURIComponent(params.get("data")));
            var barcodeData = data.ikey[0].orderNo;

            console.log(barcodeData);

            // 바코드 데이터 유효성 확인
            if (barcodeData) {
                JsBarcode("#barcode", barcodeData, {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 2,
                    height: 30,
                    displayValue: true
                });
            } else {
                console.error("Invalid barcode data");
            }
        });
    </script>
</body>
</html>