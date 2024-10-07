<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @description 주문 공통 라이브러리 시스템 클래스
 * @author 김민주, @version 1.0, @date 2021/11/15
 * @author 황호진, @version 1.1, @last date 2021/12/03
 */
class CI_Order {

    /**
     * Reference to the CodeIgniter instance
     *
     * @var object
     */
    /*
    private $CI;

    function __construct()
    {
        // Assign the CodeIgniter super-object
        $this->CI =& get_instance();
    }
    */

    /**
     * @description 주문 계산식 (단위: EX, BOX)
	 * @author 황호진, @version 1.1, @last date 2021/12/03
	 * @data = array(
	 *    	'sell_price'	=>	'판매단가',
	 * 		'size'			=>	'판매규격',
	 * 		'op1'			=>	'옵션1 값',									//op1 , op2 , op3 , coupon 설명
	 * 		'op2'			=>	array('amt' => '가격' , 'unit' => '단위'),	//값이 있을때
	 * 		'op3'			=>	'',											//값이 없을때
	 * 		'coupon'		=>	'쿠폰 값',
	 * 		'vat'			=>	'부가세 여부',
	 * 		'qty'			=>	'수량',
	 * 		'update_unit'	=>	'금액조정단위',
	 * 		'update_amt'	=>	'금액'		//없을시 0으로 보내주세요.
	 * )
     * @return = array(
	 * 		'prd_amt'	=>	'제품금액',	//계산식 => 판매단가 * (판매규격 * 수량)
	 * 		'op_amt'	=>	'옵션금액',	//값이 존재할때만 계산하며 계산식 => '+' 일때는 옵션 설정금액만 , '*' 일때는 옵션 설정금액 * 수량
	 * 		'discount'	=>	'할인금액',	//값이 존재할때만 계산하며 계산식 => (제품금액 + 옵션금액)의 할인금액 계산
	 * 		'ord_amt'	=>	'총금액',	//계산식 => 제품금액 + 옵션금액 + 할인금액
	 * 		'tax_amt'	=>	'세액'		//부가세 'Y'은 포함으로 0원 'N'은 별도로 총금액의 10%
	 * )
     */
    public static function ex_calculation($data) {
    	//return 값
		$result = array();
		//제품 금액 계산
		$prd_amt = $data['sell_price'] * ($data['size'] * $data['qty']);	//판매단가 * (판매규격 * 수량)
		//default 값 0원으로 설정
		$op_amt = 0;
		//옵션 금액 계산
		$str = array('op1' , 'op2' , 'op3');
		for($i = 0; $i < count($str); $i++){
			if($data[$str[$i]] !== ''){	//option의 ikey가 있을때만 계산
				$data_op_amt = $data[$str[$i]]['amt'];
				$data_op_unit = $data[$str[$i]]['unit'];
				if($data_op_unit === '+'){	// + 일때
					$op_amt += $data_op_amt;	//옵션 설정 금액
				}else{	// * 일때
					$op_amt += ($data_op_amt * $data['qty']);	//옵션 설정 금액 * 수량
				}
			}
		}
		//default 값 0원으로 설정
		$discount = 0;
		//할인 금액 계산
		if($data['coupon'] !== ''){ //coupon의 선택된 값이 있을때만 계산
			if($data['coupon']['unit'] === '%'){ // % 일때
				$discount = round((($prd_amt + $op_amt) / 100) * $data['coupon']['amt']); //백분율로 계산하여 할인금액 계산
			}else{
				$discount = $data['coupon']['amt']; //이외에는 할인 금액만 보면 됨
			}
		}
		$result['prd_amt'] = $prd_amt;							//제품금액
		$result['op_amt'] = $op_amt;							//옵션금액
		$result['discount'] = $discount;						//할인금액

		//금액조정전의 계산 금액
		$ord_amt = $prd_amt + $op_amt - $discount;
		if($data['update_unit'] === '+'){	//금액조정단위가 +일때
			$ord_amt += $data['update_amt'];
		}else{								//금액조정단위가 -일때
			$ord_amt -= $data['update_amt'];
		}
		$result['ord_amt'] = $ord_amt;	//총 금액 계산
		if($data['vat'] === 'Y'){	//부가세 포함
			$result['tax_amt'] = 0;
		}else{						//부가세 별도
			$result['tax_amt'] = round($result['ord_amt'] / 10);
		}
		return $result;
    }

    /**
     * @description 주문 계산식 (단위: 회배, ㎡)
	 * @author 황호진, @version 1.1, @last date 2021/12/03
	 * @data = array(
	 *    	'sell_price'	=>	'판매단가',
	 * 		'size'			=>	'판매규격',
	 * 		'op1'			=>	'옵션1 값',									//op1 , op2 , op3 , coupon 설명
	 * 		'op2'			=>	array('amt' => '가격' , 'unit' => '단위'),	//값이 있을때
	 * 		'op3'			=>	'',											//값이 없을때
	 * 		'coupon'		=>	'쿠폰 값',
	 * 		'vat'			=>	'부가세 여부',
	 * 		'qty'			=>	'수량',										//분할없을때 가로수량 + 세로수량 , 분할있을때 수량
	 * 		'division'		=>	'분할수량',									//1 : 분할없음 , 2 ~ 10 : 분할있음
	 * 		'ord_width'		=>	'주문 가로길이',								//가로길이
	 * 		'ord_height'	=>	'주문 세로길이',								//세로길이
	 * 		'div_width1'	=>	'분할1 가로길이',							//분할 있을때만 가져오는 가로값
	 * 		'div_width2'	=>	'분할2 가로길이',							//div_width1 ~ div_width10
	 * 		'div_height1'	=>	'분할1 세로길이'								//분할 있을때만 가져오는 세로값
	 * 		'div_height2'	=>	'분할2 세로길이'								//div_height1 ~ div_height10,
	 * 		'update_unit'	=>	'금액조정단위',
	 * 		'update_amt'	=>	'금액'		//없을시 0으로 보내주세요.
	 * )
	 * @return = array(
	 * 		'prd_amt'	=>	'제품금액',	//계산식 => 판매단가 * (계산된 회배 * 수량)
	 * 		'op_amt'	=>	'옵션금액',	//값이 존재할때만 계산하며 계산식 => '+' 일때는 옵션 설정금액만 , '*' 일때는 옵션 설정금액 * 수량
	 * 		'discount'	=>	'할인금액',	//값이 존재할때만 계산하며 계산식 => (제품금액 + 옵션금액)의 할인금액 계산
	 * 		'ord_amt'	=>	'총금액',	//계산식 => 제품금액 + 옵션금액 + 할인금액
	 * 		'tax_amt'	=>	'세액'		//부가세 'Y'은 포함으로 0원 'N'은 별도로 총금액의 10%
	 * 		'unit_num'	=>	'회배계산'
	 * )
	 * //회배계산 설명
	 * //※분할없음
	 * //(주문가로 * 주문세로) > 판매규격 일때 (주문가로 * 주문세로) 적용
	 * //(주문가로 * 주문세로) < 판매규격 일때 판매규격 적용
	 * //총 회배 = 적용된 회배값 * 수량
	 * //※분할있음
	 * //(분할가로 * 분할세로) > 판매규격 일때 해당 건은 (분할가로 * 분할세로) 적용
	 * //(분할가로 * 분할세로) < 판매규격 일때 해당 건은 판매규격 적용
	 * //합계 회배 += 분할 건별로 회배값
	 * //총 회배 = 합계회배 * 수량
     */
    public static function m2_calculation($data) {
    	if($data['division'] == 1){	//분할수량 1은 분할없다는 의미
    		//회배 = 주문가로 * 주문세로
			$hebe = $data['ord_width'] * $data['ord_height'];
			//회배 > 판매규격
			if($hebe > $data['size']){
				$ord_hebe = $hebe;	//회배 적용
			}else{
				$ord_hebe = $data['size'];	//판매 규격 적용
			}
			// 계산식 제품금액 = 판매단가 * (적용된 회배 * 수량)
			$prd_amt = $data['sell_price'] * ($ord_hebe * $data['qty']);
			// 계산식 총회배 = 적용된 회배 * 수량(가로수량 + 세로수량)
			$calc_hebe = round($ord_hebe * $data['qty'],2);
		}else{						//분할수량이 1이 아닌 경우는 분할 있다는 의미
    		//분할 합계 초기값 0으로 설정
    		$hebe_sum = 0;
    		//개별회배 생성해서 내보내기
			$div_hebe = array();
    		//분할된 수량만큼 반복문
			for($i = 1; $i <= $data['division']; $i++){
				//분할 건별 회배 = 분할가로 * 분할세로
				$hebe = $data['div_width'.$i] * $data['div_height'.$i];
				//분할 건별 회배 > 판매규격
				if($hebe > $data['size']){
					$ord_hebe = $hebe;	//분할 건별 회배 적용
				}else{
					$ord_hebe = $data['size'];	//판매규격 적용
				}
				$hebe_sum += $ord_hebe;	//분할 합계 회배 += 적용된 회배
				//개별회배 저장
				$div_hebe[$i - 1] = round($ord_hebe,2);
			}
			// 개별회배
			$result['div_hebe'] = $div_hebe;

			// 계산식 제품금액 = 판매단가 * (분할 합계 회배 * 수량)
			$prd_amt = $data['sell_price'] * ($hebe_sum * $data['qty']);
			// 계산식 총회배 = 분할 합계 회배 * 수량
			$calc_hebe = round($hebe_sum * $data['qty'],2);
		}
		//default 값 0원으로 설정
		$op_amt = 0;
		//옵션 금액 계산
		$str = array('op1' , 'op2' , 'op3');
		for($i = 0; $i < count($str); $i++){
			if($data[$str[$i]] !== ''){	//option의 ikey가 있을때만 계산
				$data_op_amt = $data[$str[$i]]['amt'];
				$data_op_unit = $data[$str[$i]]['unit'];
				if($data_op_unit === '+'){	// + 일때
					$op_amt += $data_op_amt;	//옵션 설정 금액
				}else{	// * 일때
					if($data['division'] == 1){	//분할이 아닐때
						$op_amt += ($data_op_amt * $data['qty']);						//옵션 설정 금액 * 수량
					}else{						//분할일때
						$op_amt += ($data_op_amt * ($data['division'] * $data['qty']));	//옵션 설정 금액 * (분할수량 * 수량)
					}
				}
			}
		}
		//할인 금액 계산
		$discount = 0;
		if($data['coupon'] !== ''){ //coupon의 선택된 값이 있을때만 계산
			if($data['coupon']['unit'] === '%'){ // % 일때
				$discount = round((($prd_amt + $op_amt) / 100) * $data['coupon']['amt']); //백분율로 계산하여 할인금액 계산
			}else{
				$discount = $data['coupon']['amt']; //이외에는 할인 금액만 보면 됨
			}
		}
		$result['prd_amt'] = round($prd_amt);	//제품금액
		$result['op_amt'] = $op_amt;			//옵션금액
		$result['discount'] = $discount;		//할인금액

		//금액조정전의 계산 금액 : 제품금액 + 옵션금액 - 할인금액
		$ord_amt = round($prd_amt + $op_amt - $discount);
		if($data['update_unit'] === '+'){	//금액조정단위가 +일때
			$ord_amt += $data['update_amt'];
		}else{								//금액조정단위가 -일때
			$ord_amt -= $data['update_amt'];
		}
		$result['ord_amt'] = $ord_amt;	//총 금액 계산

		if($data['vat'] === 'Y'){	//부가세 포함
			$result['tax_amt'] = 0;
		}else{						//부가세 별도
			$result['tax_amt'] = round($result['ord_amt'] / 10);
		}
		$result['unit_num'] = $calc_hebe;		//총회배
		return $result;
    }

    /**
     * @description 부가세 계산식(Y:포함, N:별도)
     * @param 부가세 구분, 금액
     */
    public static function vat_calculation($gb, $amt='') {

        if(!empty($gb)) {

            if($gb == 'Y') {

                $vat_amt = 0;

            } else if($gb == 'N') {

                $vat_amt = round($amt * 0.1); // VAT 반올림

            }

        } else {
            $vat_amt = 0;
        }

        return $vat_amt;
    }

}
