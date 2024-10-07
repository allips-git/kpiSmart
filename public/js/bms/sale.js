/*================================================================================
 * @name: 황호진 - sale.js	거래처등록 화면
 * @version: 1.0.0, @date: 2022-03-29
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	get_list({ s : null });
	//================================================================================

	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2022/03/29
	 */
	$("#cust_sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data);
		}
	});

	/**
	 * @description 검색란의 selectbox change 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022/03/29
	 */
	$("#cust_op_1 , #cust_op_2 , #cust_op_3").on('change' , function () {
		$("input[name='s']").val('t');				//검색하기 때문에 't' 라는 값이 주어짐
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
	});

	/**
	 * @description 간편검색 box
	 * @author 황호진  @version 1.0, @last update 2022/03/29
	 */
	$("div[name=box_search]").on('click' , function () {
		var type = $(this).attr('data-text');
		get_easy_search_list({type : type});
	});
	
	//================================================================================
	
	//================================================================================
	//업체 신규 등록 팝업 이벤트

	/**
	 * @description 업체신규등록 버튼 눌렀을때 팝업 호출
	 * @author 황호진  @version 1.0, @last update 2022/03/29
	 */
	$('.new_btn').click(function () {

		//거래처삭제버튼 숨김처리
		$("#del_cust_btn").hide();
		
		//팝업 폼 리셋
		$("#sale_frm")[0].reset();

		//등록폼
		$("#popup_type").val('in');
		$(".sale_pop_state").html('등록');
		
		//비활성화처리
		$('#dlv_cd').html('<option value="">설정해주세요!</option>').prop('disabled' , true);
		$('#addr_btn').prop('disabled' , true);

		//거래처코드 초기화
		$("#cust_cd").val('');

		//파일 초기화
		$(".del_img").click();
		
		$('.sale_pop').bPopup({
			modalClose: true,
			opacity: 0.8,
			positionStyle: 'absolute',
			speed: 300,
			escClose: false,
			transition: 'fadeIn',
			transitionClose: 'fadeOut',
			zIndex: 99990
			//, modalColor:'transparent'
		});
	});

	/**
	 * @description 입력제한! 숫자만 입력(전화번호 , 계좌번호, 등록번호 등등)
	 * @author 황호진  @version 1.0, @last update 2022/03/30
	 */
	$('#ceo_tel , #person_tel , #tel , #fax , #bl_num , #biz_num').on('input' , function () {
		var id = $(this).attr('id');
		var v;
		if(id === 'ceo_tel' || id === 'person_tel' || id === 'tel' || id === 'fax'){
			v = num_format($(this).val(),1)
		}else{
			v = num_format($(this).val(),3);
		}
		$(this).val(v);
	});

	/**
	 * @description 입력제한! 숫자만 입력(금액 , 할인율)
	 * @author 황호진  @version 1.0, @last update 2022/03/30
	 */
	$('#discount , #limit_amt').on('input' , function () {
		var num = $(this).val().replace(/[^0-9]/gi,"");
		var id = $(this).attr('id');
		if(id === 'discount'){	//할인율 경우! 100%이상의 할인 설정은 불가능!
			if(num > 100){
				num = 100;
			}
			$(this).val(num);
		}else{	//금액부분은 3자리 기준으로 ,작업
			$(this).val(num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
		}	//if end
	});	//event end

	/**
	 * @description 거래처명 , 대표자명 , 대표자휴대폰 값이 입력되고 focusout할 경우 popuptype이 in일경우 cust_cd 생성
	 * @author 황호진  @version 1.0, @last update 2022/03/30
	 */
	$('#cust_nm , #ceo_nm , #ceo_tel').on('focusout' , function () {
		var popup_type = $('#popup_type').val();
		if(popup_type === 'in' && $('#cust_cd').val() === ''){
			var arr = ['cust_nm' , 'ceo_nm' , 'ceo_tel'];
			var flag = true;
			for(var i = 0; i < arr.length; i++){
				if($('#'+arr[i]).val() === ''){
					flag = false;
				}
			}	//for end

			if(flag){
				var formdata = new FormData($('#sale_frm')[0]);
				formdata.append('black' , $("#black").is(":checked") ? "Y" : "N");	//checkbox
				formdata.append('vat', $("#vat").is(":checked") ? "Y" : "N");	//checkbox
				formdata.append('limit_amt', $("#limit_amt").val().replaceAll(',',''));

				$.ajax({
					url: '/biz/sale/create_cust_cd',
					type: 'POST',
					enctype: 'multipart/form-data',
					data: formdata,
					dataType: "json",
					processData: false,
					contentType: false,
					success: function(res) {
						//거래처코드 설정
						$('#cust_cd').val(res.cust_cd);
						//거래처리스트 재조회
						var search_data = $("#frm").serialize();	//form 데이터
						get_list(search_data);
						//배송지관리 활성화
						$('#dlv_cd').prop('disabled' , false);
						$('#addr_btn').prop('disabled' , false);
						//cnt 재설정
						setting_cnt(res.cnt);
					},
					error: function(request,status,error) {
						console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
						//$.toast('실패', {sticky: true, type: 'danger'});
					},
				});
			}	//if end
		}	//if end
	});	//event end

	/**
	 * @description input[type=file] 이벤트 걸기
	 * @author 황호진  @version 1.0, @last update 2022/03/30
	 */
	$('#img1 , #img2').on('change' , function () {
		var id = $(this).attr('id');	//img1 , img2
		var labels = $('label');		//label 목록
		//filter 작업으로 해당하는 id만 추출
		var target = labels.filter((i , list) => { return id === list.htmlFor });
		var reader = new FileReader();
		reader.onload = function(e) {
			target.find('p').hide();
			var str = '<img src="'+e.target.result+'" alt="">';
			str += '<div class="del del_img"><img src="/public/img/app/close.png" alt=""></div>';
			target.after(str);
		};
		reader.readAsDataURL(this.files[0]);
	});	//event end

	/**
	 * @description img1 , img2 제거 작업
	 * @author 황호진  @version 1.0, @last update 2022/03/30
	 */
	$(document).on('click' , '.del_img' , function () {
		var target = $(this).prev().prev().attr('for');
		$(this).prev().prev().find('p').show();		//+ 활성화
		$(this).prev().remove();					//img 태그 삭제
		$(this).remove();							//(한번 더 클릭 삭제) 부분 삭제
		$("#"+target).val("");	//input file 초기화
	});

	/**
	 * @description 다음주소 API 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022/03/30
	 */
	$('#search_addr').on('click' , function () {
		daum_postcode('biz_zip', 'address', 'addr_detail');
	});

	/**
	 * @description 등록,수정완료 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/03/31
	 */
	$('#save_btn').on('click' , function () {
		if(input_check()){
			var popup_type = $('#popup_type').val();
			var str = popup_type === 'in' ? '등록' : '수정';

			var con = custom_fire('확인창' , str+'완료하시겠습니까?' , '취소' , '확인');
			con.then((result) => {
				if(result.isConfirmed){
					var formdata = new FormData($('#sale_frm')[0]);
					formdata.append('ceo_tel', $("#ceo_tel").val().replaceAll('-',''));
					formdata.append('person_tel', $("#person_tel").val().replaceAll('-',''));
					formdata.append('tel', $("#tel").val().replaceAll('-',''));
					formdata.append('fax', $("#fax").val().replaceAll('-',''));
					formdata.append('black' , $("#black").is(":checked") ? "Y" : "N");	//checkbox
					formdata.append('vat', $("#vat").is(":checked") ? "Y" : "N");	//checkbox
					formdata.append('limit_amt', $("#limit_amt").val().replaceAll(',',''));

					$.ajax({
						url: '/biz/sale/comp',
						type: 'POST',
						enctype: 'multipart/form-data',
						data: formdata,
						dataType: "json",
						processData: false,
						contentType: false,
						success: function(res) {
							if(res.result){
								toast(res.msg, false, 'info');

								//거래처리스트 재조회
								var search_data = $("#frm").serialize();	//form 데이터
								get_list(search_data);
								//cnt 재설정
								setting_cnt(res.cnt);
								$('.sale_pop').bPopup().close();
							}else{
								toast(res.msg, true, 'danger');
							}
						},
						error: function(request,status,error) {
							console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
							//$.toast('실패', {sticky: true, type: 'danger'});
						},
					});
				}
			});
		}
	});

	/**
	 * @description dlv_cd에 값에 따라 주소, 상세주소 설정
	 * @author 황호진  @version 1.0, @last update 2022/03/31
	 */
	$('#dlv_cd').on('change' , function () {
		var v = $(this).val();
		if(v !== ''){
			var ba_gb = $('#dlv_cd option:selected').data();	//배송구분값
			var url = '/biz/sale/get_dlv_cd';
			var type = 'get';
			var data = {
				ik		: v
			};
			fnc_ajax(url , type , data)
				.done(function (res) {
					if(ba_gb.gb === '001'){	//화물일경우
						$('#ref_addr').val(res.data.ba_addr).hide();
					}else{					//화물이 아닌 경우
						$('#ref_addr').val(res.data.ba_addr).show();
					}
					$('#ref_detail').val(res.data.ba_detail);
				}).fail(fnc_ajax_fail);
		}else{
			$('#ref_addr').val('');
			$('#ref_detail').val('');
		}
	});

	/**
	 * @description 거래처삭제
	 * @author 황호진  @version 1.0, @last update 2022/03/31
	 */
	$('#del_cust_btn').on('click' , function () {
		var con = custom_fire('확인창' , '삭제하시겠습니까?' , '취소' , '확인');
		con.then((result) => {
			if(result.isConfirmed){
				var url = '/biz/sale/del_cust';
				var type = 'POST';
				var data = {
					cust_cd : $('#cust_cd').val()
				};
				fnc_ajax(url , type , data)
					.done(function (res) {
						if(res.result){
							toast(res.msg, false, 'info');

							//거래처리스트 재조회
							var search_data = $("#frm").serialize();	//form 데이터
							get_list(search_data);
							//cnt 재설정
							setting_cnt(res.cnt);
							$('.sale_pop').bPopup().close();
						}else{
							toast(res.msg, true, 'danger');
						}
					}).fail(fnc_ajax_fail);
			}
		});
	});

	//================================================================================

	/**
	 * @description 배송지관리 팝업 여는 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/03/31
	 */
	$('.addr_btn').click(function () {
		//거래처코드
		var cust_cd = $('#cust_cd').val();
		if(cust_cd !== ''){
			get_addr_list(cust_cd , 'Y');
		}
	});

	/**
	 * @description 다음주소 API 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022/03/31
	 */
	$('#ba_addr').on('click' , function () {
		daum_postcode('ba_zip', 'ba_addr', 'ba_detail');
	});

	/**
	 * @description 배송지관리 팝업 배송구분 이벤트걸기
	 * @author 황호진  @version 1.0, @last update 2022/03/31
	 */
	$('#ba_gb').on('change' , function () {
		$('#ba_zip').val('');
		$('#ba_addr').val('');
		$('#ba_detail').val('');
		var v = $(this).val();
		if(v === '001'){
			$('.addr_hs').hide();
		}else{
			$('.addr_hs').show();
		}
	});

	/**
	 * @description 배송지관리 등록 버튼 눌렀을때 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/03/31
	 */
	$('#addr_comp_btn').on('click' , function () {
		var cust_cd = $('#cust_cd').val();
		var con = custom_fire('확인창' , '등록하시겠습니까?' , '취소' , '확인');
		con.then((result) => {
			if(result.isConfirmed){
				addr_comp(cust_cd);
			}
		});
	});
});

/**
 * @description get_list 리스트 조회
 * @author 황호진  @version 1.0, @last update 2022/03/29
 */
function get_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/biz/sale/get_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: false,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: false,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					draw_list(res);
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description get_easy_search_list 간편검색
 * @author 황호진  @version 1.0, @last update 2022/03/29
 */
function get_easy_search_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/biz/sale/get_easy_search_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 12,	//page 갯수 리스트가 12개 간격으로 페이징한다는 의미
				autoHidePrevious: false,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: false,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data.list의 데이터를 가지고 callback에서 작동
					draw_list(res);
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description draw_list 리스트 그리는 함수
 * @author 황호진  @version 1.0, @last update 2022/03/29
 */
function draw_list(data) {
	var len = data.length;
	var str = '';

	if(len > 0){
		var arr = [];
		$.each(data , function (i , list) {
			str += '<tr onclick=get_detail("'+ list.cust_cd +'")>';
			str += '<td class="w6">'+ list.row_no +'</td>';
			str += '<td class="blue Elli">'+ list.cust_nm +'</td>';
			str += '<td>'+ list.ceo_nm +'</td>';
			str += '<td>'+ num_format(list.ceo_tel,1) +'</td>';
			str += '<td>'+ num_format(list.tel,1) +'</td>';
			str += '<td>'+ list.sales_person +'</td>';
			str += '<td>';
			if(list.black === 'Y'){
				str += '<span class="red">블랙리스트</span>';
			}else{
				str += list.score+'점';
			}
			str += '</td>';
			str += '<td>'+ list.reg_dt+' '+ list.reg_ikey +'</td>';
			str += '<td>'+ list.mod_dt+' '+ list.mod_ikey +'</td>';
			str += '<td>'+ commas(Number(list.rec_amt)) +'원</td>';
			str += '<td class="w7" onclick="event.stopPropagation()">발송</td>';
			str += '<td class="w7" onclick="event.stopPropagation()">';
			str += '<label class="switch" style="cursor: pointer;" onclick=useyn_change("'+ list.cust_cd +'")>';
			str += '<input type="checkbox" id="useyn_'+ list.cust_cd +'" disabled>';
			str += '<span class="slider round"></span>';
			str += '</label>';
			str += '</td>';
			str += '</tr>';
			//추후 주문가능여부를 체크하도록 만들기 위해 담는 작업
			if(list.useyn === 'Y'){
				arr.push('useyn_'+list.cust_cd);
			}
		});
		$("#biz-container").html(str); // ajax data output

		for(var i = 0; i < arr.length; i++){
			$('#'+arr[i]).prop('checked', true);
		}

	}else{
		str += "<tr>";
		str += "<td colspan='12'>조회 가능한 데이터가 없습니다.</td>";
		str += "</tr>";
		$("#biz-container").html(str); // ajax data output
	}
}

/**
 * @description 주문여부 변경 함수
 * @author 황호진  @version 1.0, @last update 2022/03/29
 */
function useyn_change(cust_cd) {
	var url = '/biz/sale/useyn_change';
	var type = 'POST';
	var data = {
		cust_cd : cust_cd
	};

	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if($("#useyn_"+cust_cd).is(":checked") === true){
					$("#useyn_"+cust_cd).prop('checked', false);	//checked => false
				}else{
					$("#useyn_"+cust_cd).prop('checked', true);	//checked => true
				}
				//주문불가 카운트 조회하여 가져와서 설정
				$("#no_ord_cnt").html(res.no_ord_cnt);
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 등록 및 수정했을때 cnt 수치가 변경됨에 따라 최신화 필요
 * @author 황호진  @version 1.0, @last update 2022/03/30
 */
function setting_cnt(data) {
	$('#all_biz_cnt').html(data['all_biz_cnt']);		//전체거래처
	$('#new_mon_cnt').html(data['new_mon_cnt']);		//월간신규등록
	$('#no_ord_cnt').html(data['no_ord_cnt']);			//주문불가등록
	$('#black_biz_cnt').html(data['black_biz_cnt']);	//블랙리스트등록
}

/**
 * @description get_detail 거래처코드를 기반으로 상세정보 보기
 * @author 황호진  @version 1.0, @last update 2022/03/31
 */
function get_detail(cust_cd) {
	var url = '/biz/sale/get_detail';
	var type = 'GET';
	var data = {
		cust_cd : cust_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			console.log(res);

			var biz_detail = res.data.biz_detail;
			var biz_addr_list = res.data.biz_addr_list;

			//거래처삭제버튼 활성화
			$('#del_cust_btn').show();

			//팝업타입설정
			$('#popup_type').val('up');
			$('.sale_pop_state').html('수정');

			//배송지 활성화
			$('#dlv_cd').prop('disabled' , false);
			$('#addr_btn').prop('disabled' , false);

			var arr = ['cust_cd', 'cust_nm', 'ceo_nm', 'person',
				'biz_zip', 'address', 'addr_detail', 'memo', 'score', 'discount',
				'pay_gb', 'cust_grade', 'sales_person', 'holder_nm', 'bl_nm',
				'bl_num', 'biz_nm', 'biz_num', 'biz_class', 'biz_type', 'email'];

			for(var i = 0; i < arr.length; i++){
				$('#'+arr[i]).val(biz_detail[arr[i]]);
			}

			//전화번호 관련
			$('#ceo_tel').val(num_format(biz_detail.ceo_tel,1));
			$('#person_tel').val(num_format(biz_detail.person_tel,1));
			$('#tel').val(num_format(biz_detail.tel,1));
			$('#fax').val(num_format(biz_detail.fax,1));

			//미수금한도금액
			$('#limit_amt').val(commas(Number(biz_detail.limit_amt)));

			//블랙리스트
			if(biz_detail.black === 'Y') $('#black').prop('checked', true);
			else if(biz_detail.black === 'N') $('#black').prop('checked', false);

			//부가세
			if(biz_detail.vat === 'Y') $('#vat').prop('checked', true);
			else if(biz_detail.vat === 'N') $('#vat').prop('checked', false);

			//대표배송지설정
			var addr_str = '';
			$.each(biz_addr_list , function (i , list) {
				if(list.ikey === biz_detail.dlv_cd){
					addr_str += '<option value="'+ list.ikey +'" data-gb="'+ list.ba_gb +'" selected>'+ list.ba_gb_nm +'</option>';
				}else{
					addr_str += '<option value="'+ list.ikey +'" data-gb="'+ list.ba_gb +'">'+ list.ba_gb_nm +'</option>';
				}
			});
			if(addr_str === ''){
				addr_str = '<option value="">설정해주세요!</option>'
			}
			if(biz_detail.dlv_cd !== '') $('#dlv_cd').html(addr_str).val(biz_detail.dlv_cd).trigger('change');
			else $('#dlv_cd').html(addr_str).trigger('change');

			//이미지설정
			$('.del_img').click();
			var labels = $('label');		//label 목록
			var target , str;
			if(biz_detail.file_orig1 !== ''){
				target = labels.filter((i , list) => { return 'img1' === list.htmlFor });
				target.find('p').hide();
				str = '<img src="'+ biz_detail.file_path1 +'/'+ biz_detail.file_nm1 +'" alt="">';
				str += '<div class="del del_img"><img src="/public/img/app/close.png" alt=""></div>';
				target.after(str);
			}

			if(biz_detail.file_orig2 !== ''){
				target = labels.filter((i , list) => { return 'img2' === list.htmlFor });
				target.find('p').hide();
				str = '<img src="'+ biz_detail.file_path2 +'/'+ biz_detail.file_nm2 +'" alt="">';
				str += '<div class="del del_img"><img src="/public/img/app/close.png" alt=""></div>';
				target.after(str);
			}

			$('.sale_pop').bPopup({
				modalClose: true,
				opacity: 0.8,
				positionStyle: 'absolute',
				speed: 300,
				escClose: false,
				transition: 'fadeIn',
				transitionClose: 'fadeOut',
				zIndex: 99990
				//, modalColor:'transparent'
			});
		}).fail(fnc_ajax_fail);
}

/**
 * @description 완료 누르기전 필수값이 입력되어있는지 검사하기
 * @author 황호진  @version 1.0, @last update 2022/03/31
 */
function input_check() {
	var arr = ['cust_nm' , 'ceo_nm' , 'ceo_tel'];
	var flag = true;
	for(var i=0; i < arr.length; i++){
		if($('#'+arr[i]).val() === ''){
			var nm = $('#'+arr[i]).attr('data-text');
			toast(nm+'을 입력해주세요.', true, 'danger');
			$('#'+arr[i]).focus();
			flag = false;
			break;
		}
	}
	return flag;
}

/**
 * @description 해당 거래처코드의 배송지리스트 조회
 * @author 황호진  @version 1.0, @last update 2022/03/31
 */
function get_addr_list(cust_cd , yn = 'N') {
	var url = '/biz/sale/get_addr_list';
	var type = 'GET';
	var data = {
		cust_cd : cust_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var addr_str = '';
			$.each(res.data , function (i , list) {
				var arg = encodeURIComponent(JSON.stringify({
					ikey : list.ikey ,
					cust_cd : list.cust_cd
				}));
				addr_str += '<tr onclick=get_addr_detail("'+ arg +'")>';
				addr_str += '<td class="w6">';
				if(list.dlv_cd === list.ikey){ //해당거래처의 대표배송지로 설정되어 있는 경우
					addr_str += '<input type="radio" id="radio'+ list.ikey +'" name="radio" checked  onclick="event.stopPropagation()">';
				}else{
					addr_str += '<input type="radio" id="radio'+ list.ikey +'" name="radio"  onclick="event.stopPropagation()">';
				}
				addr_str += '<label for="radio'+ list.ikey +'"></label>';
				addr_str += '</td>';
				addr_str += '<td class="Elli">'+ list.ba_gb_nm +'</td>';
				if(list.ba_gb === '001'){	//화물일 경우
					addr_str += '<td class="Elli">'+ list.ba_detail +'</td>';
					addr_str += '<td class="Elli"></td>';
				}else{	//직배 , 택배의 경우
					addr_str += '<td class="Elli">'+ list.ba_addr +'</td>';
					addr_str += '<td class="Elli">'+ list.ba_detail +'</td>';
				}
				addr_str += '<td class="w6 delete" onclick="event.stopPropagation()">';
				addr_str += '<p onclick=addr_del("'+ arg +'") style="cursor: pointer;">삭제</p>';
				addr_str += '</td>';
				addr_str += '</tr>';
			});

			$('#addr_list').html(addr_str);

			if(yn === 'Y'){
				//배송지관리 팝업 열기
				$('.addr_pop').bPopup({
					modalClose: true,
					opacity: 0.8,
					positionStyle: 'absolute',
					speed: 300,
					escClose: false,
					transition: 'fadeIn',
					transitionClose: 'fadeOut',
					zIndex: 99995
					//, modalColor:'transparent'
				});
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 선택한 배송지를 대표배송지로 설정하고 수정모드로 변경
 * @author 황호진  @version 1.0, @last update 2022/03/31
 */
function get_addr_detail(arg) {
	arg = JSON.parse(decodeURIComponent(arg));
	var url = '/biz/sale/get_addr_detail';
	var type = 'POST';
	var data = {
		ikey 	: arg['ikey'],
		cust_cd : arg['cust_cd']
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				//체크박스 연계
				$('#radio'+arg['ikey']).prop('checked' , true);
				//배송구분 값 설정 후 트리거 태우기
				$('#ba_gb').val(res.data.ba_gb).trigger('change');
				//우편번호 설정
				$('#ba_zip').val(res.data.ba_zip);
				//주소 설정
				$('#ba_addr').val(res.data.ba_addr);
				//상세주소 설정
				$('#ba_detail').val(res.data.ba_detail);
				//매출거래처 팝업의 대표배송지 변경 작업
				addr_update(arg['cust_cd']);
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 배송지관리 등록버튼 눌렀을때!
 * @author 황호진  @version 1.0, @last update 2022/03/31
 */
function addr_comp(cust_cd) {
	var ba_gb = $('#ba_gb').val();

	var url = '/biz/sale/addr_comp';
	var type = 'POST';
	var data = {
		'cust_cd' 	: cust_cd,
		'ba_gb'		: ba_gb,
		'ba_nm'		: '',
		'ba_zip'	: ba_gb === '001' ? '' : $('#ba_zip').val(),	//화물일때 입력값 없음
		'ba_addr'	: ba_gb === '001' ? '' : $('#ba_addr').val(),	//화물일때 입력값 없음
		'ba_detail'	: $('#ba_detail').val()
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				addr_update(cust_cd);
				get_addr_list(cust_cd , 'N');
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 주소 업데이트
 * @author 황호진  @version 1.0, @last update 2022/03/31
 */
function addr_update(cust_cd) {
	var url = '/biz/sale/addr_update';
	var type = 'GET';
	var data = {
		'cust_cd'	: cust_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var addr_list = res.data.addr_list;
			var dlv_cd = res.data.dlv_cd;
			var addr_str = '';
			$.each(addr_list , function (i , list) {
				if(list.ikey === dlv_cd){
					addr_str += '<option value="'+ list.ikey +'" data-gb="'+ list.ba_gb +'" selected>'+ list.ba_gb_nm +'</option>';
				}else{
					addr_str += '<option value="'+ list.ikey +'" data-gb="'+ list.ba_gb +'">'+ list.ba_gb_nm +'</option>';
				}
			});
			if(addr_str === ''){
				addr_str += '<option value="">설정해주세요!</option>';
			}
			$('#dlv_cd').html(addr_str).trigger('change');
		}).fail(fnc_ajax_fail);
}

/**
 * @description 배송지 주소 삭제
 * @author 황호진  @version 1.0, @last update 2022/04/01
 */
function addr_del(arg) {
	arg = JSON.parse(decodeURIComponent(arg));
	var url = '/biz/sale/addr_del';
	var type = 'POST';
	var data = {
		'cust_cd'	: arg['cust_cd'],
		'ikey'		: arg['ikey']
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				addr_update(arg['cust_cd']);
				get_addr_list(arg['cust_cd'] , 'N');
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
