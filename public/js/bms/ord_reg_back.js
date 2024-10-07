/*================================================================================
 * @name: 황호진 - ord_reg.js	신규주문등록 화면
 * @version: 1.0.0, @date: 2021-11-09
 ================================================================================*/

$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	out_date();
	//================================================================================

	//이벤트 연동
	//================================================================================
	/**
	 * @description select2 라이브러리
	 * @author 황호진  @version 1.0, @last update 2021/11/09
	 */
	$("#cust").select2();
	$("#cust").on('change' , function () {
		var cust_cd = $(this).val();
		get_cust_info(cust_cd);
	});

	/**
	 * @description select2 라이브러리를 통해 선택된 값 change 이벤트로 연결
	 * @author 황호진  @version 1.0, @last update 2021/11/09
	 */
	$("#addr_list").on('change' , function () {
		var cust_cd = $("#cust_cd").val();
		var seq = $(this).val();
		get_detail_addr(cust_cd , seq);
	});

	/**
	 * @description 다음주소API
	 * @author 황호진  @version 1.0, @last update 2021/11/10
	 */
	$("#search_addr").on('click' , function () {
		search_addr();
	});

	/**
	 * @description 우편번호,주소,상세주소 초기화
	 * @author 황호진  @version 1.0, @last update 2021/11/10
	 */
	$("#addr_reset").on('click' , function () {
		var con = confirm('주소를 초기화하시겠습니까?');
		if(con){
			addr_reset();
		}
	});

	/**
	 * @description 신규주문접수하기 버튼 클릭 이벤트
	 * @author 황호진  @version 1.0, @last update 2021/11/23
	 */
	$("#new_ord_rec_btn").on('click' , function () {
		var ord_no = $("#ord_no").val();
		var cust_cd = $("#cust_cd").val();
		if(ord_no !== '') {
			var con = confirm('주문접수하시겠습니까?');
			if (con) {
				ord_rec_complete(ord_no , cust_cd);
			}
		}
	});

	/**
	 * @description 목록으로 버튼 클릭 이벤트(등록된 주문내역 여부 확인)
	 * @author 황호진  @version 1.0, @last update 2021/11/23
	 */
	$("#location_list").on('click' , function () {
		var ord_no = $("#ord_no").val();
		var cust_cd = $("#cust_cd").val();
		if(ord_no !== ''){
			var con = confirm('등록하신 주문내역은 저장되지 않습니다. 목록으로 이동하시겠습니까?');
			if(con){
				ord_rec_all_delete(ord_no , cust_cd);
			}
		}else{
			location.href='/ord/ord_list';
		}
	});

	$(".gurae").off().hover(function () {
		$(".gurae_not_select").show();
	} , function () {
		$(".gurae_not_select").hide();
	});
	//================================================================================
});

/**
 * @description selectbox에 선택된 거래처의 값을 기반으로 정보 가져오기
 * @author 황호진  @version 1.0, @last update 2021/11/09
 */
function get_cust_info(cust_cd) {
	var addr_str = '<option value="">직접입력</option>';

	if(cust_cd !== ""){
		var url = '/ord/ord_reg/get_cust_info';
		var type = 'GET';
		var data = {
			cust_cd : cust_cd,
			ord_no : $("#ord_no").val()
		};
		fnc_ajax(url , type , data)
			.done(function (res) {
				var info = res.data.info;
				var addr = res.data.addr;

				$("#cust_cd").val(cust_cd);
				$("#cust_nm").val(info.biz_nm);

				//배송구분
				$("#dlv_gb").val(info.dlv_gb);

				//배송주소
				$.each(addr, function(i, list){
					addr_str += '<option value="'+list.ba_seq+'">'+list.ba_nm+'</option>';
				});
				$("#addr_list").html(addr_str);

				//부가세
				if(info.vat === 'Y'){
					$("#vat_y").prop('checked' , true)
				}else{
					$("#vat_n").prop('checked' , true)
				}

				//주문번호 초기화
				$("#ord_no").val('');
				//주문리스트 초기화
				$("#ord_list").html('<tr class="cov"><td>제품 추가 선택 시 주문 등록 가능합니다.</td></tr>');
				//총 주문금액 초기화
				$("#ord_total_amt").html(0);
				//건수 초기화
				$('#ord_cnt').html(0);

				//거래처 상세정보 설정
				var cust_detail = res.data.cust_detail;
				var cust_grade = res.data.cust_grade;
				var grade = cust_detail.cust_grade !== 'amt0' ? cust_grade[cust_detail.cust_grade] : '없음';
				$(".detail_pay_gb").html(cust_detail.pay_gb);
				$(".detail_cust_grade").html(grade);
				$(".detail_cust_nm").html(cust_detail.cust_nm);
				$(".detail_biz_num").html(cust_detail.biz_num);
				$(".detail_ceo_nm").html(cust_detail.ceo_nm);
				$(".detail_ceo_tel").html(cust_detail.ceo_tel);
				$(".detail_tel").html(cust_detail.tel);
				$(".detail_fax").html(cust_detail.fax);
				$(".detail_person").html(cust_detail.person);
				$(".detail_person_tel").html(cust_detail.person_tel);
				$(".detail_dlv_gb").html(cust_detail.dlv_gb);
				$(".detail_sales_person").html(cust_detail.sales_person);
				$(".detail_acc_amt").html(commas(Number(cust_detail.acc_amt))+"원");
				$(".detail_limit_amt").html(commas(Number(cust_detail.limit_amt))+"원");
				$(".detail_ord_dt").html(cust_detail.ord_dt);
				$(".detail_dlv_dt").html(cust_detail.dlv_dt);
				$(".detail_acc_dt").html(cust_detail.acc_dt);
				$(".detail_b_amt").html(commas(Number(cust_detail.b_amt))+"원");

				//거래정보 이벤트 추가
				$(".gurae").off().hover(function () {
					$(".gurae_info").show();
				} , function () {
					$(".gurae_info").hide();
				});

			}).fail(fnc_ajax_fail);
	}else{	//거래처가 빈값으로 선택되었을때...
		var ord_no = $("#ord_no").val();
		if(ord_no !== ''){	//주문번호가 빈값이 아닐때...
			var url = '/ord/ord_reg/ord_reset';
			var type = 'POST';
			var data = {
				ord_no : ord_no
			};
			fnc_ajax(url , type , data)
				.done(function (res) {
					//주문번호 초기화
					$("#ord_no").val('');
					//주문리스트 초기화
					$("#ord_list").html('<tr class="cov"><td>제품 추가 선택 시 주문 등록 가능합니다.</td></tr>');
					//총 주문금액 초기화
					$("#ord_total_amt").html(0);
					//건수 초기화
					$('#ord_cnt').html(0);
				}).fail(fnc_ajax_fail);
		}

		$("#cust_cd").val('');
		$("#cust_nm").val('');
		$("#addr_list").html(addr_str); //배송지 초기화

		//거래정보 이벤트
		$(".gurae").off().hover(function () {
			$(".gurae_not_select").show();
		} , function () {
			$(".gurae_not_select").hide();
		});
	}
}

/**
 * @description 배송주소에 selectbox에 이벤트 연동
 * @author 황호진  @version 1.0, @last update 2021/11/09
 */
function get_detail_addr(cust_cd , seq) {
	if(seq !== ''){
		var url = '/ord/ord_reg/get_detail_addr';
		var type = 'GET';
		var data = {
			cust_cd : cust_cd,
			seq : seq
		};
		fnc_ajax(url , type , data)
			.done(function (res) {
				$("#ord_zip").val(res.data.ba_zip);
				$("#address").val(res.data.ba_addr);
				$("#addr_detail").val(res.data.ba_detail);
			}).fail(fnc_ajax_fail);
	}else{
		$("#ord_zip").val('');
		$("#address").val('');
		$("#addr_detail").val('');
	}
}

/**
 * @description 다음주소API
 * @author 황호진  @version 1.0, @last update 2021/11/10
 */
function search_addr() {
	daum_postcode('ord_zip', 'address', 'addr_detail' , select_change);
}

/**
 * @description 다음주소API callback 함수
 * @author 황호진  @version 1.0, @last update 2021/11/10
 */
function select_change() {
	$("#addr_list").val('');
}

/**
 * @description 우편번호,주소,상세주소 초기화
 * @author 황호진  @version 1.0, @last update 2021/11/10
 */
function addr_reset() {
	$("#ord_zip").val('');
	$("#address").val('');
	$("#addr_detail").val('');
}

/**
 * @description 거래처 찾기 팝업에서 선택 눌렀을때 실행하는 함수
 * @author 황호진  @version 1.0, @last update 2021/11/10
 */
function cust_close(arg) {
	arg = JSON.parse(decodeURIComponent(arg)); // 필수
	console.log(arg);
	$('#cust').val(arg['cust_cd']).prop('selected',true); // 기타 화면별 사용법 참고
	$("#select2-cust-container").html(arg['biz_nm']); // 기타 화면별 사용법 참고
	get_cust_info(arg['cust_cd']); // 기타 화면별 사용법 참고
	$('.biz-li-pop').bPopup().close();	//필수
}

/**
 * @description 신규주문접수완료
 * @author 황호진  @version 1.0, @last update 2021/11/23
 */
function ord_rec_complete(ord_no , cust_cd) {
	var url = '/ord/ord_reg/ord_rec_complete';
	var type = 'POST';
	//master 테이블에 저장할 값들은 들고가야함
	var data = {
		'ord_no'		: ord_no,
		'cust_cd'		: cust_cd,
		'cust_nm'		: $("#cust_nm").val(),
		'ord_dt'		: $("#ord_dt").val(),
		'dlv_dt'		: $("#dlv_dt").val(),
		'ord_gb'		: $("input[name=ord_gb]:checked").val(),
		'dlv_gb'		: $("#dlv_gb").val(),
		'ord_prop'		: $("#ord_prop").val(),
		'vat'			: $("input[name=vat]:checked").val(),
		'ord_zip'		: $("#ord_zip").val(),
		'address'		: $("#address").val(),
		'addr_detail'	: $("#addr_detail").val(),
		'addr_text'		: $("#addr_text").val(),
		'fac_text'		: $("#fac_text").val(),
		'memo'			: $("#memo").val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			location.href = '/ord/ord_list';
		}).fail(fnc_ajax_fail)
}

/**
 * @description 목록으로 버튼 클릭 이벤트(등록된 주문내역 여부 확인)
 * @author 황호진  @version 1.0, @last update 2021/11/23
 */
function ord_rec_all_delete(ord_no , cust_cd) {
	var url = '/ord/ord_reg/ord_rec_all_delete';
	var type = 'POST';
	var data = {
		ord_no : ord_no,
		cust_cd : cust_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			location.href = '/ord/ord_list';
		}).fail(fnc_ajax_fail)
}
