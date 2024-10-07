/**
 * @description 주문 공통 라이브러리 시스템 클래스
 * @author 황호진, @version 1.0, @last date 2022/03/10
 */


/**
 * @description 주문 계산식 (단위: EA, BOX)
 * @author 황호진, @version 1.0, @last date 2022/03/17
 * */
function ex_calculation(data) {
	var result = {};

	//제품금액 계산식 => 판매단가 * 수량
	var indi_prd_amt = Number(data['amt']);	//제품 개별금액(1개당)
	var indi_prd_tax = vat_calculation(data['vat'] , indi_prd_amt);					//제품 개별세액(1개당)
	var prd_amt = indi_prd_amt * Number(data['qty']);

	//옵션1의 금액 초기 설정 0원
	var op1_amt = 0;
	var indi_op1_amt = 0;	// 개별 옵션1금액(1개당)
	var indi_op1_tax = 0;	// 개별 옵션1세액(1개당)

	//옵션2의 금액 초기 설정 0원
	var op2_amt = 0;
	var indi_op2_amt = 0;	// 개별 옵션2금액(1개당)
	var indi_op2_tax = 0;	// 개별 옵션2세액(1개당)

	//옵션1에 관한 계산
	if(data['option1'] !== ''){		//선택된 옵션이 없을 경우 '' 값으로 넘어옴! ''가 아니라는건 선택되었다는 의미
		indi_op1_amt = Number(data['option1']['amt']);				//옵션1 개별금액(1개당)
		indi_op1_tax = vat_calculation(data['vat'] , indi_op1_amt);	//옵션1 개별세액(1개당)
		op1_amt += indi_op1_amt * Number(data['qty']);
	}

	//옵션2에 관한 계산
	if(data['option2'] !== ''){		//선택된 옵션이 없을 경우 '' 값으로 넘어옴! ''가 아니라는건 선택되었다는 의미
		indi_op2_amt = Number(data['option2']['amt']);				//옵션2 개별금액(1개당)
		indi_op2_tax = vat_calculation(data['vat'] , indi_op2_amt);	//옵션2 개별세액(1개당)
		op2_amt += indi_op2_amt * Number(data['qty']);
	}

	result['prd_amt'] = prd_amt;	//제품 가격
	result['op1_amt'] = op1_amt;	//옵션1에 관한 값
	result['op2_amt'] = op2_amt;	//옵션2에 관한 값

	result['indi_prd_amt'] = indi_prd_amt;	//개별 제품금액
	result['indi_prd_tax'] = indi_prd_tax;	//개별 제품세액
	result['indi_op1_amt'] = indi_op1_amt;	//개별 옵션1금액
	result['indi_op1_tax'] = indi_op1_tax;	//개별 옵션1세액
	result['indi_op2_amt'] = indi_op2_amt;	//개별 옵션2금액
	result['indi_op2_tax'] = indi_op2_tax;	//개별 옵션2세액

	//합계금액 => 제품금액 + 형상금액 + 옵션1금액 + 옵션2금액
	var sum = prd_amt + op1_amt + op2_amt;

	//총 금액
	var ord_amt = 0;
	if(data['update_unit'] !== ""){			//금액조정 단위가 ""가 아니라는 건 제대로된 단위가 설정되었음을 의미
		if(data['update_unit'] === '%'){			//금액조정단위 %
			result['update_unit'] = '-';
			//금액조정단위가 %임으로 백분율 계산하여 할인금액이 얼마인지 계산
			result['update_amt'] = (sum / 100) * Number(data['update_amt']);
			//총 금액 계산식 => 제품금액 - 금액조정
			ord_amt = sum - result['update_amt'];
		}else{
			result['update_amt'] = Number(data['update_amt']);
			if(data['update_unit'] === '-'){		//금액조정단위 -
				result['update_unit'] = '-';
				//총 금액 계산식 => 제품금액 - 금액조정
				ord_amt = sum - Number(data['update_amt']);
			}else if(data['update_unit'] === '+'){	//금액조정단위 +
				result['update_unit'] = '+';
				//총 금액 계산식 => 제품금액 + 금액조정
				ord_amt = sum + Number(data['update_amt']);
			}
		}
	}else{									//금액조정 단위가 할인 없음이 선택된 경우
		result['update_unit'] = '';			//금액조정단위 없음
		result['update_amt'] = 0;
		//총 금액 계산식 => 제품금액
		ord_amt = sum;
	}
	result['ord_amt'] = ord_amt;
	//세액 계산(총금액의 10%)
	result['tax_amt'] = vat_calculation(data['vat'] , ord_amt);	//세액
	//수량
	result['qty'] = Number(data['qty']);

	return result;
}

/**
 * @description 가로,세로 길이에 따른 회배 계산
 * @author 황호진, @version 1.0, @last date 2022/03/10
 * @data = array(
 *    	'width'			=>	'가로길이',
 *    	'height'		=>	'세로길이',
 * 		'size'			=>	'규격',
 * )
 * @return 계산된 회배 값
 * */
function indi_hebe(data) {
	var hebe = (data['width'] * 0.01) * (data['height'] * 0.01);
	if(hebe > Number(data['size'])){
		return Math.ceil(hebe * 10) / 10;
	}else{
		return Math.ceil(Number(data['size']) * 10) / 10;
	}
}

/**
 * @description 주문 계산식 (단위: 회배, ㎡)
 * @author 황호진, @version 1.0, @last date 2022/03/10
 * @data = array(
 *    	'amt'			=>	'판매단가',
 *    	'hebe'			=>	'회배 (분할이 아닌 경우는 가로세로의 회배값이며! 분할되어 있는 경우는 계산되어 나온 회배의 합계)',
 * 		'qty'			=>	'수량',										//분할없을때 가로수량 + 세로수량 , 분할있을때 수량
 * 		'option1'		=>	array('amt' => '가격' , 'unit' => '단위'),	//값이 있을때
 * 		'option2'		=>	'',											//값이 없을때
 * 		'vat'			=>	'부가세 여부',
 * 		'division'		=>	'분할수량',									//1 : 분할없음 , 2 ~ 10 : 분할있음
 * 		'update_unit'	=>	'금액조정단위',
 * 		'update_amt'	=>	'금액'		//없을시 0으로 보내주세요.
 * )
 * @return = array(
 * 		'prd_amt'		=>	'제품금액',	//계산식 => 판매단가 * (계산된 회배 * 수량)
 * 		'op1_amt'		=>	'옵션1금액',	//값이 존재할때만 계산하며 계산식 => '+' 일때는 옵션 설정금액만 , '*' 일때는 옵션 설정금액 * 수량
 * 		'op2_amt'		=>	'옵션2금액',	//값이 존재할때만 계산하며 계산식 => '+' 일때는 옵션 설정금액만 , '*' 일때는 옵션 설정금액 * 수량
 * 		'ord_amt'		=>	'총금액',	//계산식 => 제품금액 + 옵션금액 + 할인금액
 * 		'tax_amt'		=>	'세액'		//부가세 'Y'은 포함으로 0원 'N'은 별도로 총금액의 10%
 * 		'ord_hebe'		=>	'회배'
 * 		'update_unit'	=>	'금액조정 단위'	// '%' , '-' , '+' 의 값들이 넘어오며 단위가 상징하는 의미 그대로임
 * 		'update_amt'	=>	'금액조정 금액'	// 단위에 따라 금액부분이 백분율의 의미를 가지기도 하며 단순한 덧셈뺄셈의 숫자 의미를 가지기도 함
 * )
 * */
function m2_calculation(data) {
	var result = {};

	//제품금액 계산식 => 판매단가 * (계산된 회배 * 수량)
	var indi_prd_amt = [];
	var indi_prd_tax = [];
	var prd_amt = 0;

	//옵션1의 금액 초기 설정 0원
	var indi_op1_amt = [];
	var indi_op1_tax = [];
	var op1_amt = 0;
	//옵션2의 금액 초기 설정 0원
	var indi_op2_amt = [];
	var indi_op2_tax = [];
	var op2_amt = 0;

	//옵션에 관한 변수명
	var data_op_amt,data_op_unit;

	//총 회배 계산하기 위한 값
	var ord_hebe = 0;
	var hebe = 0;
	for(var i = 0 , j = 0; i < Number(data['division']) * Number(data['qty']); i++ , j++){
		//j 변수는 분할수랑 같아지면 0으로 초기화
		if(j === Number(data['division'])){
			j = 0;
		}
		hebe = Math.round(Number(data['hebe'][j]) * 10) / 10;

		indi_prd_amt[i] = Math.round(hebe * Number(data['amt']));
		indi_prd_tax[i] = vat_calculation(data['vat'] , indi_prd_amt[i]);	//세액
		prd_amt += indi_prd_amt[i];

		indi_op1_amt[i] = 0;	//옵션1 초기 0원 설정
		indi_op1_tax[i] = 0;	//옵션1 세액 초기 0원 설정
		indi_op2_amt[i] = 0;	//옵션2 초기 0원 설정
		indi_op2_tax[i] = 0;	//옵션2 세액 초기 0원 설정

		//옵션1에 관한 계산
		if(data['option1'] !== ''){		//선택된 옵션이 없을 경우 '' 값으로 넘어옴! ''가 아니라는건 선택되었다는 의미
			data_op_amt = Number(data['option1']['amt']);	//옵션1의 단가
			data_op_unit = data['option1']['unit'];			//옵션1의 단위
			if(data_op_unit === '+'){	// + 일때
				//옵션1의 단위가 + 일 경우 옵션금액 * 개당
				op1_amt += data_op_amt;
				indi_op1_amt[i] = data_op_amt;										//옵션1 개별금액(1개당)
				indi_op1_tax[i] = vat_calculation(data['vat'] , indi_op1_amt[i]);	//옵션1 개별세액(1개당)
			}else{	// * 일때
				//옵션1의 단위가 * 일 경우 옵션금액 * 회배 * 개당
				op1_amt += (data_op_amt * hebe);
				indi_op1_amt[i] = data_op_amt * hebe;								//옵션1 개별금액(1개당)
				indi_op1_tax[i] = vat_calculation(data['vat'] , indi_op1_amt[i]);	//옵션1 개별세액(1개당)
			}
		}

		//옵션2에 관한 계산
		if(data['option2'] !== ''){		//선택된 옵션이 없을 경우 '' 값으로 넘어옴! ''가 아니라는건 선택되었다는 의미
			data_op_amt = Number(data['option2']['amt']);	//옵션2의 단가
			data_op_unit = data['option2']['unit'];			//옵션2의 단위
			if(data_op_unit === '+'){	// + 일때
				//옵션2의 단위가 + 일 경우 옵션금액 * 개당
				op2_amt += data_op_amt;
				indi_op2_amt[i] = data_op_amt;										//옵션2 개별금액(1개당)
				indi_op2_tax[i] = vat_calculation(data['vat'] , indi_op2_amt[i]);	//옵션2 개별세액(1개당)
			}else{	// * 일때
				//옵션2의 단위가 * 일 경우 옵션금액 * 회배 * 개당
				op2_amt += (data_op_amt * hebe);
				indi_op2_amt[i] = data_op_amt * hebe;								//옵션2 개별금액(1개당)
				indi_op2_tax[i] = vat_calculation(data['vat'] , indi_op2_amt[i]);	//옵션2 개별세액(1개당)
			}
		}

		//회배 계산
		ord_hebe = Number((ord_hebe + hebe).toFixed(1));
	}


	result['prd_amt'] = prd_amt;	//제품 가격
	result['op1_amt'] = op1_amt;	//옵션1에 관한 값
	result['op2_amt'] = op2_amt;	//옵션2에 관한 값

	result['indi_prd_amt'] = indi_prd_amt;	//개별 제품금액(1개당)
	result['indi_prd_tax'] = indi_prd_tax;	//개별 제품세액(1개당)
	result['indi_op1_amt'] = indi_op1_amt;	//개별 옵션1금액(1개당)
	result['indi_op1_tax'] = indi_op1_tax;	//개별 옵션1세액(1개당)
	result['indi_op2_amt'] = indi_op2_amt;	//개별 옵션2금액(1개당)
	result['indi_op2_tax'] = indi_op2_tax;	//개별 옵션2세액(1개당)

	//합계 금액 => 제품금액 + 옵션1금액 + 옵션2금액
	var sum = prd_amt + op1_amt + op2_amt;

	//총 금액
	var ord_amt = 0;
	if(data['update_unit'] !== ""){			//금액조정 단위가 ""가 아니라는 건 제대로된 단위가 설정되었음을 의미
		if(data['update_unit'] === '%'){			//금액조정단위 %
			result['update_unit'] = '-';
			//금액조정단위가 %임으로 백분율 계산하여 할인금액이 얼마인지 계산
			result['update_amt'] = (sum / 100) * Number(data['update_amt']);
			//총 금액 계산식 => 합계 금액 - 금액조정
			ord_amt = sum - result['update_amt'];
		}else{
			result['update_amt'] = Number(data['update_amt']);
			if(data['update_unit'] === '-'){		//금액조정단위 -
				result['update_unit'] = '-';
				//총 금액 계산식 => 합계 금액 - 금액조정
				ord_amt = sum - Number(data['update_amt']);
			}else if(data['update_unit'] === '+'){	//금액조정단위 +
				result['update_unit'] = '+';
				//총 금액 계산식 => 합계 금액 + 금액조정
				ord_amt = sum + Number(data['update_amt']);
			}
		}
	}else{									//금액조정 단위가 할인 없음이 선택된 경우
		result['update_unit'] = '';				//금액조정단위 없음
		result['update_amt'] = 0;
		//총 금액 계산식 => 합계 금액
		ord_amt = sum;
	}
	result['ord_amt'] = ord_amt;
	//세액 계산(총금액의 10%)
	result['tax_amt'] = vat_calculation(data['vat'] , ord_amt);	//세액
	//총 회베 계산
	result['ord_hebe'] = ord_hebe;
	return result;
}

/**
 * @description 가로길이에 따른 야드 계산
 * @author 황호진, @version 1.0, @last date 2022/03/15
 * @data = array(
 *    	'width'			=>	'가로길이',
 *    	'usage'			=>	'원단사용량',
 *    	'size'			=>	'판매규격',
 *    	'los'			=>	'로스(원단추가)',
 * )
 * @return 계산된 야드 값
 * */
function indi_yard(data) {
	var yard = Math.round(((Number(data['width']) * Number(data['usage']) + Number(data['los'])) / 90) * 10) / 10;
	var size = Number(data['size']);
	if(yard > size){
		return yard;
	}else{
		return size;
	}
}

/**
 * @description 주문 계산식 (단위: Yard)
 * @author 황호진, @version 1.0, @last date 2022/03/15
 * @data = array(
 *    	'amt'			=>	'판매단가',
 *    	'yard'			=>	'야드 [  ((가로길이 * 원단사용량) + 로스) / 90  ]',
 * 		'qty'			=>	'수량',
 * 		'option1'		=>	array('amt' => '가격' , 'unit' => '단위'),	//값이 있을때
 * 		'option2'		=>	'',											//값이 없을때
 * 		'vat'			=>	'부가세 여부',
 * 		'base_amt'		=>	'형상금액',		//통합제품등록시 입력되는 형상금액
 * 		'base_st'		=>	'형상선택',		//기본형상 : Y   ,  형상없음 : N
 * 		'update_unit'	=>	'금액조정단위',
 * 		'update_amt'	=>	'금액'		//없을시 0으로 보내주세요.
 * )
 * @return = array(
 * 		'prd_amt'		=>	'제품금액',	//계산식 => 판매단가 * (계산된 야드 * 수량)
 * 		'base_amt'		=>	'형상금액'	//계산식 => 형상금액 * (계산된 야드 * 수량)
 * 		'op1_amt'		=>	'옵션1금액',	//값이 존재할때만 계산하며 계산식 => '+' 일때는 옵션 설정금액만 , '*' 일때는 옵션 설정금액 * 수량
 * 		'op2_amt'		=>	'옵션2금액',	//값이 존재할때만 계산하며 계산식 => '+' 일때는 옵션 설정금액만 , '*' 일때는 옵션 설정금액 * 수량
 * 		'indi_amt'		=>	'개당 개별금액',		//1개당 계산된 금액
 * 		'ord_amt'		=>	'총금액',	//계산식 => 제품금액 + 옵션금액 + 할인금액
 * 		'tax_amt'		=>	'세액'		//부가세 'Y'은 포함으로 0원 'N'은 별도로 총금액의 10%
 * 		'ord_yard'		=>	'야드'
 * 		'update_unit'	=>	'금액조정 단위'	// '%' , '-' , '+' 의 값들이 넘어오며 단위가 상징하는 의미 그대로임
 * 		'update_amt'	=>	'금액조정 금액'	// 단위에 따라 금액부분이 백분율의 의미를 가지기도 하며 단순한 덧셈뺄셈의 숫자 의미를 가지기도 함
 * )
 * */
function yard_calculation(data) {
	var result = {};
	//제품금액 계산식 => 판매단가 * (계산된 야드 * 수량)
	var indi_prd_amt = Math.round(Number(data['yard']) * Number(data['amt']));	//제품 개별금액(1개당)
	var indi_prd_tax = vat_calculation(data['vat'] , indi_prd_amt);					//제품 개별세액(1개당)
	var prd_amt = Math.round(indi_prd_amt * Number(data['qty']));

	//형상금액 초기 설정 0원
	var indi_base_amt = 0;
	var indi_base_tax = 0;
	var base_amt = 0;
	if(data['base_st'] === 'Y'){	//형상선택이 기본형상일때!! [기본형상 : 'Y' , 형상없음 : 'N']
		//형상금액 계산식 => 형상금액 * (계산된 야드 * 수량)
		indi_base_amt = Number(data['yard']) * Number(data['base_amt']);	//형상 개별금액(1개당)
		indi_base_tax = vat_calculation(data['vat'] , indi_base_amt);		//형상 개별세액(1개당)
		base_amt = Number(indi_base_amt) * Number(data['qty']);
	}


	//옵션1의 금액 초기 설정 0원
	var op1_amt = 0;
	var indi_op1_amt = 0;	// 개별 옵션1금액(1개당)
	var indi_op1_tax = 0;	// 개별 옵션1세액(1개당)
	//옵션2의 금액 초기 설정 0원
	var op2_amt = 0;
	var indi_op2_amt = 0;	// 개별 옵션2금액(1개당)
	var indi_op2_tax = 0;	// 개별 옵션2세액(1개당)

	//옵션에 관한 변수명
	var data_op_amt,data_op_unit;

	//옵션1에 관한 계산
	if(data['option1'] !== ''){		//선택된 옵션이 없을 경우 '' 값으로 넘어옴! ''가 아니라는건 선택되었다는 의미
		data_op_amt = Number(data['option1']['amt']);	//옵션1의 단가
		data_op_unit = data['option1']['unit'];			//옵션1의 단위
		if(data_op_unit === '+'){	// + 일때
			//옵션1의 단위가 +일 경우 옵션금액 * 개당
			op1_amt += data_op_amt * Number(data['qty']);
			indi_op1_amt = data_op_amt;										//옵션1 개별금액(1개당)
			indi_op1_tax = vat_calculation(data['vat'] , indi_op1_amt);		//옵션1 개별세액(1개당)
		}else{	// * 일때
			//옵션1의 단위가 * 일경우 계산식 => 옵션 금액 * 계산된 야드 * 수량
			op1_amt += (data_op_amt * (Number(data['yard']) * Number(data['qty'])));
			indi_op1_amt += (data_op_amt * (Number(data['yard'])));			//옵션1 개별금액(1개당)
			indi_op1_tax = vat_calculation(data['vat'] , indi_op1_amt);		//옵션1 개별세액(1개당)
		}
	}

	//옵션2에 관한 계산
	if(data['option2'] !== ''){		//선택된 옵션이 없을 경우 '' 값으로 넘어옴! ''가 아니라는건 선택되었다는 의미
		data_op_amt = Number(data['option2']['amt']);	//옵션2의 단가
		data_op_unit = data['option2']['unit'];			//옵션2의 단위
		if(data_op_unit === '+'){	// + 일때
			//옵션2의 단위가 +일 경우 옵션금액 * 개당
			op2_amt += data_op_amt * Number(data['qty']);
			indi_op2_amt = data_op_amt;										//옵션2 개별금액(1개당)
			indi_op2_tax = vat_calculation(data['vat'] , indi_op2_amt);		//옵션2 개별세액(1개당)
		}else{	// * 일때
			//옵션2의 단위가 * 일경우 계산식 => 옵션 금액 * 계산된 야드 * 수량
			op2_amt += (data_op_amt * (Number(data['yard']) * Number(data['qty'])));
			indi_op2_amt += (data_op_amt * (Number(data['yard'])));			//옵션2 개별금액(1개당)
			indi_op2_tax = vat_calculation(data['vat'] , indi_op2_amt);		//옵션2 개별세액(1개당)
		}
	}

	result['prd_amt'] = prd_amt;	//제품 가격
	result['base_amt'] = base_amt;	//형상금액
	result['op1_amt'] = op1_amt;	//옵션1에 관한 값
	result['op2_amt'] = op2_amt;	//옵션2에 관한 값

	result['indi_prd_amt'] = indi_prd_amt;	//개별 제품금액
	result['indi_prd_tax'] = indi_prd_tax;	//개별 제품세액
	result['indi_base_amt'] = indi_base_amt;//개별 형상금액
	result['indi_base_tax'] = indi_base_tax;//개별 형상세액
	result['indi_op1_amt'] = indi_op1_amt;	//개별 옵션1금액
	result['indi_op1_tax'] = indi_op1_tax;	//개별 옵션1세액
	result['indi_op2_amt'] = indi_op2_amt;	//개별 옵션2금액
	result['indi_op2_tax'] = indi_op2_tax;	//개별 옵션2세액

	//합계금액 => 제품금액 + 형상금액 + 옵션1금액 + 옵션2금액
	var sum = prd_amt + base_amt + op1_amt + op2_amt;

	//총 금액
	var ord_amt = 0;
	if(data['update_unit'] !== ""){		//금액조정 단위가 ""가 아니라는 건 제대로된 단위가 설정되었음을 의미
		if(data['update_unit'] === '%'){			//금액조정단위 %
			result['update_unit'] = '-';
			//금액조정단위가 %임으로 백분율 계산하여 할인금액이 얼마인지 계산
			result['update_amt'] = (sum / 100) * Number(data['update_amt']);
			//총 금액 계산식 => 합계금액 - 금액조정
			ord_amt = sum - result['update_amt'];
		}else{
			result['update_amt'] = Number(data['update_amt']);
			if(data['update_unit'] === '-'){		//금액조정단위 -
				result['update_unit'] = '-';
				//총 금액 계산식 => 합계금액 - 금액조정
				ord_amt = sum - Number(data['update_amt']);
			}else if(data['update_unit'] === '+'){	//금액조정단위 +
				result['update_unit'] = '+';
				//총 금액 계산식 => 합계금액 + 금액조정
				ord_amt = sum + Number(data['update_amt']);
			}
		}
	}else{								//금액조정 단위가 할인 없음이 선택된 경우
		result['update_unit'] = '';				//금액조정단위 없음
		result['update_amt'] = 0;
		//총 금액 계산식 => 합계금액
		ord_amt = sum;
	}
	result['ord_amt'] = ord_amt;
	//세액 계산(총금액의 10%)
	result['tax_amt'] = vat_calculation(data['vat'] , ord_amt);	//세액
	//총 야드 계산
	result['ord_yard'] = Math.round(Number(data['yard']) * Number(data['qty']) * 10) / 10;

	return result;
}

/**
 * @description 가로길이에 따른 폭 계산
 * @author 황호진, @version 1.0, @last date 2022/03/18
 * @data = array(
 *    	'width'			=>	'가로길이',
 *    	'usage'			=>	'원단사용량',
 *    	'size'			=>	'판매규격',
 *    	'los'			=>	'로스(원단추가)',
 *    	'width_len'		=>	'폭규격'
 * )
 * @return 계산된 폭 값
 * */
function indi_pok(data) {
	var yard = Math.round((Number(data['width']) * Number(data['usage']) + Number(data['los'])) / Number(data['width_len']));
	var size = Number(data['size']);
	if(yard > size){
		return yard;
	}else{
		return size;
	}
}


/**
 * @description 주문 계산식 (단위: 폭)
 * @author 황호진, @version 1.0, @last date 2022/03/18
 * @data = array(
 *    	'amt'			=>	'판매단가',
 *    	'pok'			=>	'폭 [  ((가로길이 * 원단사용량) + 로스) / 원단 폭 규격  ]',
 * 		'qty'			=>	'수량',
 * 		'option1'		=>	array('amt' => '가격' , 'unit' => '단위'),	//값이 있을때
 * 		'option2'		=>	'',											//값이 없을때
 * 		'vat'			=>	'부가세 여부',
 * 		'base_amt'		=>	'형상금액',		//통합제품등록시 입력되는 형상금액(필수값)
 * 		'base_st'		=>	'형상선택',		//기본형상 : Y   ,  형상없음 : N
 * 		'height'		=>	'세로길이'		//주문등록폼의 입력된 세로길이
 * 		'width_len'		=>	'원단 폭 규격',		//통합제품등록시 입력되는 원단 폭규격(필수값)
 * 		'height_len'	=>	'세로길이 제한',		//세로길이 제한
 * 		'height_unit'	=>	'세로길이 제한단위',	//TODO : 세로길이 제한단위( 2022-03-18 기준! cm밖에 확인 안됨! 추후 수정 가능성 있음)
 * 		'height_op1'	=>	'세로길이 cm당',		//ex)2.4cm당 혹은 2.5cm당
 * 		'height_op2'	=>	'세로길이 cm당%',	//2.4cm당 몇퍼인지?
 * 		'update_unit'	=>	'금액조정단위',
 * 		'update_amt'	=>	'금액'		//없을시 0으로 보내주세요.
 * )
 * @return = array(
 * 		'prd_amt'		=>	'제품금액',			//계산식 => 판매단가 * (계산된 폭 * 수량)
 * 		'base_amt'		=>	'형상금액'			//계산식 => 형상금액 * (계산된 폭 * 수량)
 * 		'height_amt'	=>	'세로길이 추가금액'	//계산식 => (판매단가 + 형상금액) 의 몇%인지
 * 		'op1_amt'		=>	'옵션1금액',			//값이 존재할때만 계산하며 계산식 => '+' 일때는 옵션 설정금액만 , '*' 일때는 옵션 설정금액 * 수량
 * 		'op2_amt'		=>	'옵션2금액',			//값이 존재할때만 계산하며 계산식 => '+' 일때는 옵션 설정금액만 , '*' 일때는 옵션 설정금액 * 수량
 * 		'indi_amt'		=>	'개당 개별금액',		//1개당 계산된 금액
 * 		'ord_amt'		=>	'총금액',			//계산식 => 제품금액 + 옵션금액 + 할인금액
 * 		'tax_amt'		=>	'세액'				//부가세 'Y'은 포함으로 0원 'N'은 별도로 총금액의 10%
 * 		'ord_pok'		=>	'폭'
 * 		'update_unit'	=>	'금액조정 단위'	// '%' , '-' , '+' 의 값들이 넘어오며 단위가 상징하는 의미 그대로임
 * 		'update_amt'	=>	'금액조정 금액'	// 단위에 따라 금액부분이 백분율의 의미를 가지기도 하며 단순한 덧셈뺄셈의 숫자 의미를 가지기도 함
 * )
 * */
function pok_calculation(data) {
	var result = {};
	//제품금액 계산식 => 판매단가 * (계산된 폭 * 수량)
	var indi_prd_amt = Math.round(Number(data['pok']) * Number(data['amt']));	//제품 개별금액
	var indi_prd_tax = vat_calculation(data['vat'] , indi_prd_amt);					//제품 개별세액
	var prd_amt = Math.round(indi_prd_amt * Number(data['qty']));

	//형상금액 초기 설정 0원
	var indi_base_amt = 0;
	var indi_base_tax = 0;
	var base_amt = 0;
	if(data['base_st'] === 'Y'){	//형상선택이 기본형상일때!! [기본형상 : 'Y' , 형상없음 : 'N']
		//형상금액 계산식 => 형상금액 * (계산된 폭 * 수량)
		indi_base_amt = Number(data['pok']) * Number(data['base_amt']);		//형상 개별금액
		indi_base_tax = vat_calculation(data['vat'] , indi_base_amt);		//형상 개별세액
		base_amt = Number(indi_base_amt) * Number(data['qty']);
	}

	//세로길이 개별금액(1개당)
	var indi_height_amt = 0;
	var indi_height_tax = 0;
	//세로길이 추가금액
	var height_amt = 0;

	//차이 선언
	var height_diff = 0;
	//퍼센트
	var percent = 0;

	//세로길이 제한단위가 '010' 일때! (cm)
	if(data['height_unit'] === '010'){
		//차이 계산식 => 세로길이 - 세로길이제한
		height_diff = Number(data['height']) - Number(data['height_len']);
		if(height_diff > 0){
			//퍼센트 계산식 => ((세로길이 - 세로길이제한) / 세로길이 cm당) * 세로길이 cm당%
			percent = Math.ceil(height_diff / Number(data['height_op1'])) * Number(data['height_op2']);
		}
	}

	//퍼센트 계산식을 통해 1% 이상 일 경우
	if(percent > 0){
		//세로길이 추가금액 계산식 => ((제품금액 + 형상금액) / 100) * 퍼센트
		indi_height_amt = Math.round(((indi_prd_amt + indi_base_amt) / 100) * percent);
		indi_height_tax = vat_calculation(data['vat'] , indi_height_amt);
		height_amt = indi_height_amt * Number(data['qty']);
	}

	//옵션1의 금액 초기 설정 0원
	var op1_amt = 0;
	var indi_op1_amt = 0;	// 개별 옵션1금액(1개당)
	var indi_op1_tax = 0;	// 개별 옵션1세액(1개당)
	//옵션2의 금액 초기 설정 0원
	var op2_amt = 0;
	var indi_op2_amt = 0;	// 개별 옵션2금액(1개당)
	var indi_op2_tax = 0;	// 개별 옵션2세액(1개당)

	//옵션에 관한 변수명
	var data_op_amt,data_op_unit;

	//옵션1에 관한 계산
	if(data['option1'] !== ''){		//선택된 옵션이 없을 경우 '' 값으로 넘어옴! ''가 아니라는건 선택되었다는 의미
		data_op_amt = Number(data['option1']['amt']);	//옵션1의 단가
		data_op_unit = data['option1']['unit'];			//옵션1의 단위
		if(data_op_unit === '+'){	// + 일때
			//옵션1의 단위가 +일 경우 옵션금액 * 개당
			op1_amt += data_op_amt * Number(data['qty']);
			indi_op1_amt = data_op_amt;										//옵션1 개별금액(1개당)
			indi_op1_tax = vat_calculation(data['vat'] , indi_op1_amt);		//옵션1 개별세액(1개당)
		}else{	// * 일때
			//옵션1의 단위가 * 일경우 계산식 => 옵션 금액 * 계산된 야드 * 수량
			op1_amt += (data_op_amt * (Number(data['pok']) * Number(data['qty'])));
			indi_op1_amt += (data_op_amt * (Number(data['pok'])));			//옵션1 개별금액(1개당)
			indi_op1_tax = vat_calculation(data['vat'] , indi_op1_amt);		//옵션1 개별세액(1개당)
		}
	}

	//옵션2에 관한 계산
	if(data['option2'] !== ''){		//선택된 옵션이 없을 경우 '' 값으로 넘어옴! ''가 아니라는건 선택되었다는 의미
		data_op_amt = Number(data['option2']['amt']);	//옵션2의 단가
		data_op_unit = data['option2']['unit'];			//옵션2의 단위
		if(data_op_unit === '+'){	// + 일때
			//옵션2의 단위가 +일 경우 옵션금액 * 개당
			op2_amt += data_op_amt * Number(data['qty']);
			indi_op2_amt = data_op_amt;										//옵션2 개별금액(1개당)
			indi_op2_tax = vat_calculation(data['vat'] , indi_op2_amt);		//옵션2 개별세액(1개당)
		}else{	// * 일때
			//옵션2의 단위가 * 일경우 계산식 => 옵션 금액 * 계산된 야드 * 수량
			op2_amt += (data_op_amt * (Number(data['pok']) * Number(data['qty'])));
			indi_op2_amt += (data_op_amt * (Number(data['pok'])));			//옵션2 개별금액(1개당)
			indi_op2_tax = vat_calculation(data['vat'] , indi_op2_amt);		//옵션2 개별세액(1개당)
		}
	}

	result['prd_amt'] = prd_amt;		//제품 가격
	result['base_amt'] = base_amt;		//형상금액
	result['height_amt'] = height_amt;	//세로길이 추가금액
	result['op1_amt'] = op1_amt;		//옵션1에 관한 값
	result['op2_amt'] = op2_amt;		//옵션2에 관한 값

	result['indi_prd_amt'] = indi_prd_amt;			//개별 제품금액
	result['indi_prd_tax'] = indi_prd_tax;			//개별 제품세액
	result['indi_base_amt'] = indi_base_amt;		//개별 형상금액
	result['indi_base_tax'] = indi_base_tax;		//개별 형상세액
	result['indi_height_amt'] = indi_height_amt;	//개별 세로길이추가금액
	result['indi_height_tax'] = indi_height_tax;	//개별 세로길이추가세액
	result['indi_op1_amt'] = indi_op1_amt;			//개별 옵션1금액
	result['indi_op1_tax'] = indi_op1_tax;			//개별 옵션1세액
	result['indi_op2_amt'] = indi_op2_amt;			//개별 옵션2금액
	result['indi_op2_tax'] = indi_op2_tax;			//개별 옵션2세액

	//합계 금액 => 제품금액 + 형상금액 + 세로길이 추가금액 + 옵션1금액 + 옵션2금액
	var sum = prd_amt + base_amt + height_amt + op1_amt + op2_amt;

	//총 금액
	var ord_amt = 0;
	if(data['update_unit'] !== ""){		//금액조정 단위가 ""가 아니라는 건 제대로된 단위가 설정되었음을 의미
		if(data['update_unit'] === '%'){			//금액조정단위 %
			result['update_unit'] = '-';
			//금액조정단위가 %임으로 백분율 계산하여 할인금액이 얼마인지 계산
			result['update_amt'] = (sum / 100) * Number(data['update_amt']);
			//총 금액 계산식 => 합계금액 - 금액조정
			ord_amt = sum - result['update_amt'];
		}else{
			result['update_amt'] = Number(data['update_amt']);
			if(data['update_unit'] === '-'){		//금액조정단위 -
				result['update_unit'] = '-';
				//총 금액 계산식 => 합계금액 - 금액조정
				ord_amt = sum - Number(data['update_amt']);
			}else if(data['update_unit'] === '+'){	//금액조정단위 +
				result['update_unit'] = '+';
				//총 금액 계산식 => 합계금액 + 금액조정
				ord_amt = sum + Number(data['update_amt']);
			}
		}
	}else{								//금액조정 단위가 할인 없음이 선택된 경우
		result['update_unit'] = '';				//금액조정단위 없음
		result['update_amt'] = 0;
		//총 금액 계산식 => 합계금액
		ord_amt = sum;
	}
	//총 금액
	result['ord_amt'] = ord_amt;
	//세액 계산(총금액의 10%)
	result['tax_amt'] = vat_calculation(data['vat'] , ord_amt);	//세액
	//총 폭 계산
	result['ord_pok'] = Number(data['pok']) * Number(data['qty']);

	return result;
}

/**
 * @description 부가세 계산식(Y:포함, N:미포함)
 * @author 황호진, @version 1.0, @last date 2022/03/10
 * @param 부가세 구분, 금액
 * @return 부가세 구분에 따른 값
 */
function vat_calculation(gb , amt) {
	if(gb === 'Y'){			//세액 계산
		return Math.round(amt * 0.1);
	}else if(gb === 'N'){	//세액 계산안함
		return 0;
	}
}
