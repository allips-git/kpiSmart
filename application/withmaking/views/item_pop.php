<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Item Details</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .table th, .table td {
            vertical-align: middle;
        }
        .table th {
            width: 20%;
            text-align: right;
        }
        .table td {
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <h1 class="mb-4">Item Details</h1>
        <table class="table table-bordered">
            <tbody>
                <?php
                $keysToDisplay = [
                    'item_nm' => '제품명',
                    'size' => '규격',
                    'mfr' => '제조사',
                    'taking_weight' => '이륙 중량',
                    'self_weight' => '자체 중량',
                    'maximum_filght' => '최대 비행 시간',
                    'maximum_speed' => '최대속도',
                    'Battery' => '배터리'
                ];

                foreach ($keysToDisplay as $key => $label): 
                    if(isset($item->$key)): ?>
                        <tr>
                            <th scope="row"><?php echo $label; ?></th>
                            <td><?php echo htmlspecialchars($item->$key); ?></td>
                        </tr>
                    <?php endif; 
                endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>