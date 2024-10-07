/*================================================================================
 * @name: 황호진 - biz_wait_pop.js	거래처 승인 팝업
 * @version: 1.0.0, @date: 2022-05-19
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	$("#factory_cust_cd").val('').select2();
	//================================================================================

	/**
	 * @description select2에서 선택된 거래처코드를 기반으로 조회
	 * @author 황호진  @version 1.0, @last update 2022/05/19
	 */
	$('#factory_cust_cd').on('change' , function () {
		var cust_cd = $(this).val();
		if(cust_cd !== ''){
			get_cust_info(cust_cd)
		}else {
			$("#factory_cust_cd").val('');
			$('#factory_ceo_nm').val($('#center_ceo_nm').val());				//매칭대표자명
			$('#factory_tel').val(num_format($('#center_tel').val(),1));	//매칭대표자번호
			$('#factory_biz_gb').val($('#center_biz_gb').val());				//매칭사업자유형
			$('#factory_biz_num').val($('#center_biz_num').val());				//매칭사업자번호
		}
	});

	/**
	 * @description 승인 취소
	 * @author 황호진  @version 1.0, @last update 2022/05/19
	 */
	$('#appr_cancle_btn').on('click' , function () {
		appr_cancle();
	});

	/**
	 * @description 승인 완료 / 수정 완료
	 * @author 황호진  @version 1.0, @last update 2022/05/19
	 */
	$('#appr_comp_btn').on('click' , function () {
		if($('#factory_cust_cd').val() === '' && $('#pop_bizyn').val() === 'Y'){

		}else{
			appr_comp();
		}
	});
});

/**
 * @description 거래처 찾기 팝업에서 선택 눌렀을때 실행하는 함수
 * @author 황호진  @version 1.0, @last update 2022/05/19
 */
function cust_close(arg) {
	arg = JSON.parse(decodeURIComponent(arg)); // 필수
	$('#factory_cust_cd').val(arg['cust_cd']).prop('selected',true).select2(); // 기타 화면별 사용법 참고
	get_cust_info(arg['cust_cd']); // 기타 화면별 사용법 참고
	$('.biz-li-pop').bPopup().close();	//필수
}

/**
 * @description 승인팝업에서 거래처가 선택되었을때 상세정보 조회
 * @author 황호진  @version 1.0, @last update 2022/05/19
 */
function get_cust_info(cust_cd) {
	var url = '/cen/biz_wait/get_cust_info';
	var type = 'GET';
	var data = {
		cust_cd	: cust_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			//매칭대표자명
			$('#factory_ceo_nm').val(res.data.ceo_nm);
			//매칭대표자번호
			$('#factory_tel').val(num_format(res.data.ceo_tel,1));
			//매칭사업자유형
			$('#factory_biz_gb').val(res.data.biz_gb);
			//매칭사업자번호
			$('#factory_biz_num').val(res.data.biz_num);
		}).fail(fnc_ajax_fail);
}

/**
 * @description 승인취소 함수
 * @author 황호진  @version 1.0, @last update 2022/05/19
 */
function appr_cancle() {
	var url = '/cen/biz_wait/appr_cancle';
	var type = 'POST';
	var data = {
		ik		: $('#pop_ik').val(),
		rec_gb	: $('#pop_rec_gb').val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				var search_data = $("#frm").serialize();	//form 데이터
				// public/js/bms/biz_wait.js 의 get_list 호출
				get_list(search_data);
				//팝업 닫기
				$('.biz_wait_pop').bPopup().close();
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 승인완료 / 수정완료 함수
 * @author 황호진  @version 1.0, @last update 2022/05/19
 */
function appr_comp() {
	var url = '/cen/biz_wait/appr_comp';
	var type = 'POST';
	var data = {
		ik		: $('#pop_ik').val(),
		bizyn	: $('#pop_bizyn').val(),
		rec_gb	: $('#pop_rec_gb').val(),
		cust_cd	: $('#factory_cust_cd').val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				var search_data = $("#frm").serialize();	//form 데이터
				// public/js/bms/biz_wait.js 의 get_list 호출
				get_list(search_data);
				//팝업 닫기
				$('.biz_wait_pop').bPopup().close();

				console.log(res.cust_list);
				//cust_list 최신화
				var str = '<option value="">신규_등록</option>';
				$.each(res.cust_list , function (i , list) {
					str += '<option value="'+ list.cust_cd +'">'+ list.cust_nm +'</option>';
				});
				$('#factory_cust_cd').html(str).val('').select2();
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
