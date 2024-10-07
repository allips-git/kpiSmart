/*================================================================================
 * @name: 황호진 - biz_wait.js	거래처 승인
 * @version: 1.0.0, @date: 2022-05-18
 ================================================================================*/
$(function(){
	//화면이 맨처음 로드 될때!
	//================================================================================
	get_list({s : null});
	//================================================================================

	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2022/05/19
	 */
	$('#sc').off().keyup(function (e) {
		if(e.keyCode == 13){
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data);
		}
	});

	/**
	 * @description 검색란의 selectbox change 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022/05/19
	 */
	$('#op_1 , #op_2').on('change' , function () {
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
	});
});

/**
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2022/05/18
 */
function get_list(data) {
	var container = $('#pagination');
	var url = '/cen/biz_wait/get_list';
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
				callback: function (res, pagination) {	//res.data의 데이터를 가지고 callback에서 작동
					var len = res.length;
					var str = '';
					if(len > 0){
						$.each(res , function (i , list) {
							var arg = encodeURIComponent(JSON.stringify(
								{
									'ikey' 		: list.ikey,
									'rec_gb' 	: list.rec_gb
								}
							));
							str += '<tr onclick=open_pop("'+ arg +'") style="cursor: pointer;">';
							str += '<td class="w7">'+ list.row_no +'</td>';
							str += '<td class="w7">'+ list.rec_gb_nm +'</td>';
							str += '<td class="blue">'+ list.cen_nm +'</td>';
							str += '<td class="blue">'+ list.cust_nm +'</td>';
							str += '<td class="w8">'+ list.ceo_nm +'</td>';
							str += '<td class="w10">'+ list.reg_dt +'</td>';
							str += '<td class="w10 bold">'+ list.admin_ikey +'</td>';
							str += '<td class="w10">'+ list.admin_dt +'</td>';
							if(list.bizyn === 'Y'){
								str += '<td class="w10 blue">'+ list.bizyn_nm +'</td>';
							}else if(list.bizyn === 'N'){
								str += '<td class="w10 gray">'+ list.bizyn_nm +'</td>';
							}else if(list.bizyn === 'C'){
								str += '<td class="w10 red">'+ list.bizyn_nm +'</td>';
							}
							str += '<td class="w7" onclick="event.stopPropagation()">';
							if(list.bizyn === 'Y'){
								str += '<label class="switch" style="cursor: pointer;" onclick=useyn_change("'+ arg +'")>';
								if(list.useyn === 'Y'){
									str += '<input type="checkbox" id="useyn'+ list.ikey +'" checked disabled>';
								}else{
									str += '<input type="checkbox" id="useyn'+ list.ikey +'" disabled>';
								}
								str += '<span class="slider round"></span>';
								str += '</label>'
							}
							str += '</td>';
							str += '</tr>';
						});
						$('#bw_list').html(str);
					}else{
						str += "<tr>";
						str += "<td colspan='9'>조회 가능한 데이터가 없습니다.</td>";
						str += "</tr>";
						$("#bw_list").html(str); // ajax data output
					}
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description open_pop
 * @author 황호진  @version 1.0, @last update 2022/05/19
 */
function open_pop(arg) {
	arg = JSON.parse(decodeURIComponent(arg)); // 필수
	var url = '/cen/biz_wait/pop_for_appr';		//popup for approval (승인을 위한 팝업)
	var type = 'GET';
	var data = {
		ik		: arg['ikey'],
		rec_gb	: arg['rec_gb']
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			$('#pop_ik').val(arg['ikey']);
			$('#pop_bizyn').val(res.data.bizyn);
			$('#pop_rec_gb').val(arg['rec_gb']);

			//============= 센터측 요청거래처 정보 ======================
			//요청거래처명
			$('#center_cust_nm').val(res.data.center_cen_nm);
			//요청대표자명
			$('#center_ceo_nm').val(res.data.center_ceo_nm);
			//요청대표자번호
			$('#center_ceo_tel').val(num_format(res.data.center_tel,1));
			//요청사업자유형
			$('#center_biz_gb').val(res.data.center_biz_gb);
			//요청사업자번호
			$('#center_biz_num').val(res.data.center_biz_num);
			//요청업태
			$('#center_biz_class').val(res.data.center_biz_class);
			//요청종목
			$('#center_biz_type').val(res.data.center_biz_type);
			//요청사업자소재지
			$('#center_address').val(res.data.center_address);
			$('#center_addr_detail').val(res.data.center_addr_detail);
			//요청이메일
			$('#center_email').val(res.data.center_email);
			//=========================================================
			
			//============== 공장측 거래처 정보 ========================
			//매칭거래처
			if(res.data.factory_cust_cd !== ""){
				$('#factory_cust_cd').val(res.data.factory_cust_cd).prop('selected',true).select2();
				$('#factory_ceo_nm').val(res.data.factory_ceo_nm);				//매칭대표자명
				$('#factory_tel').val(num_format(res.data.factory_tel,1));//매칭대표자번호
				$('#factory_biz_gb').val(res.data.factory_biz_gb);				//매칭사업자유형
				$('#factory_biz_num').val(res.data.factory_biz_num);			//매칭사업자번호
			}else{
				$("#factory_cust_cd").val('').select2();
				$('#factory_ceo_nm').val(res.data.center_ceo_nm);				//매칭대표자명
				$('#factory_tel').val(num_format(res.data.center_tel,1));	//매칭대표자번호
				$('#factory_biz_gb').val(res.data.center_biz_gb);				//매칭사업자유형
				$('#factory_biz_num').val(res.data.center_biz_num);				//매칭사업자번호
			}
			//=========================================================

			//승인 여부 상태에 따른 팝업 설정
			if(res.data.bizyn === 'Y'){
				$('#pop_state').addClass('blue').removeClass('red').html('승인완료');

				$('#appr_cancle_btn').hide();			//승인취소 비활성화
				$('#appr_comp_btn').html('수정 완료');	//승인완료일때만 수정완료로 설정
			}else if(res.data.bizyn === 'N'){
				$('#pop_state').addClass('red').removeClass('blue').html('승인대기');

				$('#appr_cancle_btn').show();	//승인취소 활성화
				$('#appr_comp_btn').html('승인 완료');
			}else if(res.data.bizyn === 'C'){
				$('#pop_state').addClass('red').removeClass('blue').html('승인취소');

				$('#appr_cancle_btn').hide();	//승인취소 비활성화
				$('#appr_comp_btn').html('승인 완료');
			}


			$('.biz_wait_pop').bPopup({
				modalClose: true,
				opacity: 0.8,
				positionStyle: 'absolute',
				speed: 300,
				transition: 'fadeIn',
				transitionClose: 'fadeOut',
				zIndex: 99997
				//, modalColor:'transparent'
			});
		}).fail(fnc_ajax_fail);
}

/**
 * @description 사용여부 변경 함수
 * @author 황호진  @version 1.0, @last update 2022/05/19
 */
function useyn_change(arg) {
	arg = JSON.parse(decodeURIComponent(arg)); // 필수
	var url = '/cen/biz_wait/useyn_change';
	var type = 'POST';
	var data = {
		ik 		: arg['ikey'],
		rec_gb	: arg['rec_gb']
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast(res.msg, false, 'info');
				if($("#useyn"+arg['ikey']).is(":checked") === true){
					$("#useyn"+arg['ikey']).prop('checked', false);	//checked => false
				}else{
					$("#useyn"+arg['ikey']).prop('checked', true);	//checked => true
				}
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
