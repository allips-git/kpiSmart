/*================================================================================
 * @name: 황호진 - buying.js	매입거래처등록 화면
 * @version: 1.0.0, @date: 2022-04-01
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	get_list({ s : null });
	//================================================================================


	//이벤트 연동
	//================================================================================
	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2022/04/04
	 */
	$("#cust_sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data);
		}
	});

	/**
	 * @description 검색란의 selectbox change 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022/04/04
	 */
	$("#cust_op_1").on('change' , function () {
		$("input[name='s']").val('t');				//검색하기 때문에 't' 라는 값이 주어짐
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
	});

	/**
	 * @description 간편검색 box
	 * @author 황호진  @version 1.0, @last update 2022/04/04
	 */
	$("div[name=box_search]").on('click' , function () {
		var type = $(this).attr('data-text');
		get_easy_search_list({type : type});
	});


	/**
	 * @description 업체신규등록 버튼 눌렀을때 팝업 호출
	 * @author 황호진  @version 1.0, @last update 2022/04/04
	 */
	$('.new_btn').click(function () {
		//거래처삭제버튼 숨김처리
		$("#del_cust_btn").hide();

		//팝업 폼 리셋
		$("#buying_frm")[0].reset();

		//등록폼
		$("#popup_type").val('in');
		$(".buying_pop_state").html('등록');

		//거래처코드 초기화
		$("#cust_cd").val('');

		//파일 초기화
		$(".del_img").click();

		$('.buying_pop').bPopup({
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
	 * @author 황호진  @version 1.0, @last update 2022/04/04
	 */
	$('#ceo_tel , #person_tel , #tel , #fax , #bl_num , #biz_num').on('input' , function () {
		$(this).val( $(this).val().replace(/[^0-9-]/gi,"") );
	});

	/**
	 * @description input[type=file] 이벤트 걸기
	 * @author 황호진  @version 1.0, @last update 2022/04/04
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
	 * @author 황호진  @version 1.0, @last update 2022/04/04
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
	 * @author 황호진  @version 1.0, @last update 2022/04/04
	 */
	$('#search_addr').on('click' , function () {
		daum_postcode('biz_zip', 'address', 'addr_detail');
	});

	/**
	 * @description 등록,수정완료 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/04/05
	 */
	$('#save_btn').on('click' , function () {
		if(input_check()){
			var popup_type = $('#popup_type').val();
			var str = popup_type === 'in' ? '등록' : '수정';

			var con = custom_fire('확인창' , str+'완료하시겠습니까?' , '취소' , '확인');
			con.then((result) => {
				if(result.isConfirmed){
					var formdata = new FormData($('#buying_frm')[0]);
					formdata.append('black' , $("#black").is(":checked") ? "Y" : "N");	//checkbox

					$.ajax({
						url: '/biz/buying/comp',
						type: 'POST',
						enctype: 'multipart/form-data',
						data: formdata,
						dataType: "json",
						processData: false,
						contentType: false,
						success: function(res) {
							if(res.result){
								toast(res.msg, false, 'info');

								//매입거래처리스트 재조회
								var search_data = $("#frm").serialize();	//form 데이터
								get_list(search_data);
								//cnt 재설정
								setting_cnt(res.cnt);
								$('.buying_pop').bPopup().close();
							}else{
								toast(res.msg, true, 'danger');
							}
						},
						error: function(request,status,error) {
							console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
							//$.toast('실패', {sticky: true, type: 'danger'});
						},
					});		//ajax end
				}	//if end
			});	//fuction result end
		}	//if end
	});	//event end

	/**
	 * @description 거래처삭제
	 * @author 황호진  @version 1.0, @last update 2022/04/05
	 */
	$('#del_cust_btn').on('click' , function () {
		var con = custom_fire('확인창' , '삭제하시겠습니까?' , '취소' , '확인');
		con.then((result) => {
			if(result.isConfirmed){
				var url = '/biz/buying/del_cust';
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
							$('.buying_pop').bPopup().close();
						}else{
							toast(res.msg, true, 'danger');
						}
					}).fail(fnc_ajax_fail);
			}
		});
	});

	//================================================================================


	/**
	 * @description 매입처 키워드 관리 팝업 호출
	 * @author 황호진  @version 1.0, @last update 2022/04/04
	 */
	// $('.keyword_btn').click(function () {
	// 	$('.buy_key_pop').bPopup({
	// 		modalClose: true,
	// 		opacity: 0.8,
	// 		positionStyle: 'absolute',
	// 		speed: 300,
	// 		escClose: false,
	// 		transition: 'fadeIn',
	// 		transitionClose: 'fadeOut',
	// 		zIndex: 99990
	// 		//, modalColor:'transparent'
	// 	});
	// });
});

/**
 * @description get_list 리스트 조회
 * @author 황호진  @version 1.0, @last update 2022/04/04
 */
function get_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/biz/buying/get_list';
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
 * @author 황호진  @version 1.0, @last update 2022/04/04
 */
function get_easy_search_list(data) {
	var container = $('#pagination');	//pagination
	var url = '/biz/buying/get_easy_search_list';
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
 * @author 황호진  @version 1.0, @last update 2022/04/04
 */
function draw_list(data) {
	var len = data.length;
	var str = '';
	if(len > 0){
		$.each(data , function (i , list) {
			str += '<tr onclick=get_detail("'+ list.cust_cd +'")>';
			str += '<td class="w6">'+ list.row_no +'</td>';
			str += '<td class="blue Elli">'+ list.cust_nm +'</td>';
			str += '<td>'+ list.biz_num +'</td>';
			str += '<td>'+ list.ceo_nm +'</td>';
			str += '<td>'+ list.ceo_tel +'</td>';
			str += '<td>'+ list.person_tel +'</td>';
			str += '<td>';
			if(list.black === 'Y'){
				str += '<span class="red">블랙리스트</span>';
			}else{
				str += '<span class="">일반</span>';
			}
			str += '</td>';
			str += '<td>'+ list.reg_dt+' '+ list.reg_ikey +'</td>';
			str += '<td>'+ list.mod_dt+' '+ list.mod_ikey +'</td>';
			str += '<td>'+ commas(Number(list.unpaid_amt)) +'</td>';
			str += '<td class="w8" onclick="event.stopPropagation()">';
			str += '<button type="button">매입 제품설정</button>';
			str += '</td>';
			str += '</tr>';
		});
		$("#biz-container").html(str); // ajax data output
	}else{
		str += "<tr>";
		str += "<td colspan='11'>조회 가능한 데이터가 없습니다.</td>";
		str += "</tr>";
		$("#biz-container").html(str); // ajax data output
	}
}

/**
 * @description 완료 누르기전 필수값이 입력되어있는지 검사하기
 * @author 황호진  @version 1.0, @last update 2022/04/05
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
 * @description 등록 및 수정했을때 cnt 수치가 변경됨에 따라 최신화 필요
 * @author 황호진  @version 1.0, @last update 2022/04/05
 */
function setting_cnt(data) {
	$('#all_biz_cnt').html(data['all_biz_cnt']);		//전체거래처
	$('#new_mon_cnt').html(data['new_mon_cnt']);		//월간신규등록
	$('#no_ord_cnt').html(data['out_prd_cnt']);			//주문불가등록
	$('#black_biz_cnt').html(data['black_biz_cnt']);	//블랙리스트등록
}

/**
 * @description get_detail 거래처코드 기반으로 상세정보 조회
 * @author 황호진  @version 1.0, @last update 2022/04/05
 */
function get_detail(cust_cd) {
	var url = '/biz/buying/get_detail';
	var type = 'GET';
	var data = {
		cust_cd : cust_cd
	};
	fnc_ajax(url , type ,data)
		.done(function (res) {

			//거래처삭제버튼 활성화처리
			$("#del_cust_btn").show();

			//등록폼
			$("#popup_type").val('up');
			$(".buying_pop_state").html('수정');

			var arr = ['cust_cd', 'cust_nm', 'ceo_nm', 'ceo_tel', 'person', 'person_tel',
				'tel', 'fax', 'biz_zip', 'address', 'addr_detail', 'memo', 'holder_nm', 'bl_nm',
				'bl_num', 'biz_nm', 'biz_num', 'biz_class', 'biz_type', 'email'];

			for(var i = 0; i < arr.length; i++){
				$('#'+arr[i]).val(res.data[arr[i]]);
			}

			//블랙리스트(check box)
			if(res.data.black === 'Y') $('#black').prop('checked', true);
			else if(res.data.black === 'N') $('#black').prop('checked', false);

			//부가세 설정(radio box)
			if(res.data.vat === 'Y') $('#vat_y').prop('checked', true);
			else if(res.data.black === 'N') $('#vat_n').prop('checked', true);

			//이미지설정
			$('.del_img').click();
			var labels = $('label');		//label 목록
			var target , str;
			if(res.data.file_orig1 !== ''){
				target = labels.filter((i , list) => { return 'img1' === list.htmlFor });
				target.find('p').hide();
				str = '<img src="'+ res.data.file_path1 +'/'+ res.data.file_nm1 +'" alt="">';
				str += '<div class="del del_img"><img src="/public/img/app/close.png" alt=""></div>';
				target.after(str);
			}

			if(res.data.file_orig2 !== ''){
				target = labels.filter((i , list) => { return 'img2' === list.htmlFor });
				target.find('p').hide();
				str = '<img src="'+ res.data.file_path2 +'/'+ res.data.file_nm2 +'" alt="">';
				str += '<div class="del del_img"><img src="/public/img/app/close.png" alt=""></div>';
				target.after(str);
			}

			$('.buying_pop').bPopup({
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
