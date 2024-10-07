/*================================================================================
 * @name: 황호진 - sys_buying.js	시스템 매입거래처 JS
 * @version: 1.0.0, @date: 2022-06-08
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var search_data = {
		s	: null
	};
	get_list(search_data);
	//================================================================================

	//이벤트
	//================================================================================

	/**
	 * @description 시스템 업체 등록 버튼을 눌러 팝업 열기
	 * @author 황호진  @version 1.0, @last update 2022/06/08
	 */
	$('.sys_buying_add_btn').on('click' , function () {
		//public/js/bms/sys_buying_pop.js 의 sys_buying_pop_open 함수
		sys_buying_pop_open();
	});


	/**
	 * @description 검색란에 Enter 칠때 검색 연동
	 * @author 황호진  @version 1.0, @last update 2022/06/09
	 */
	$("#sc").off().keyup(function (e) {
		if(e.keyCode == 13){
			var search_data = $("#frm").serialize();	//form 데이터
			get_list(search_data);
		}
	});

	/**
	 * @description 검색란의 selectbox change 이벤트 연동
	 * @author 황호진  @version 1.0, @last update 2022/06/09
	 */
	$("#op_1").on('change' , function () {
		$("input[name='s']").val('t');				//검색하기 때문에 't' 라는 값이 주어짐
		var search_data = $("#frm").serialize();	//form 데이터
		get_list(search_data);
	});
	//================================================================================
});

/**
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2022-06-08
 */
function get_list(data) {
	var container = $('#pagination');
	var url = '/biz/sys_buying/get_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			console.log(res);
			container.pagination({
				// pagination setting
				dataSource: res.data, // ajax data list
				className: 'paginationjs-theme-blue paginationjs-small', // pagination css
				pageSize: 20,	//page 갯수 리스트가 20개 간격으로 페이징한다는 의미
				autoHidePrevious: false,	// 더이상 앞의 페이지가 없을때 << 비활성화
				autoHideNext: false,		// 더이상 뒤의 페이지가 없을때 >> 비활성화
				callback: function (res, pagination) {	//res.data의 데이터를 가지고 callback에서 작동
					var len = res.length;
					var str = '';
					if(len > 0){	//조회한 데이터가 존재할 때
						var arr = [];
						$.each(res , function (i , list) {
							//public/js/bms/sys_buying_pop.js 의 get_detail 함수
							str += '<tr onclick=get_detail("'+ list.cust_cd +'")>';
							str += '<td class="w5">'+ list.row_no +'</td>';
							str += '<td class="w7">';
							if(list.bizyn === 'Y'){			//승인완료
								str += '<span class="blue">'+ list.bizyn_nm +'</span>';
							}else if(list.bizyn === 'N'){	//승인대기
								str += '<span class="green">'+ list.bizyn_nm +'</span>';
							}else if(list.bizyn === 'C'){	//승인거절
								str += '<span class="red">'+ list.bizyn_nm +'</span>';
							}
							str += '</td>';
							str += '<td class="T-left blue">'+ list.cust_nm +'</td>';
							str += '<td class="w7">'+ list.ceo_nm +'</td>';
							str += '<td class="w8">'+ num_format(list.ceo_tel,1) +'</td>';
							str += '<td class="w7">'+ num_format(list.tel,1) +'</td>';
							str += '<td class="w7">'+ list.person +'</td>';
							str += '<td class="w8">'+ num_format(list.person_tel,1) +'</td>';
							str += '<td class="w7">'+ list.reg_ikey +'</td>';
							str += '<td class="w7">'+ list.reg_dt +'</td>';
							str += '<td class="w7 T-right">'+ commas(Number(list.unpaid_amt)) +'</td>';
							str += '<td class="w7" onclick="event.stopPropagation()">';
							if(list.bizyn === 'Y'){	//승인완료건에 한해서만 보일것
								str += '<button type="button" class="gray">매입처 원장</button>';
							}
							str += '</td>';
							str += '<td class="w7" onclick="event.stopPropagation()">';
							if(list.bizyn === 'Y'){	//승인완료건에 한해서만 보일것
								str += '<label class="switch" id="switch" data-useyn="" style="cursor: pointer;" onclick=useyn_change("'+ list.cust_cd +'")>';
								str += '<input type="checkbox" id="useyn_'+ list.cust_cd +'" disabled>';
								str += '<span class="slider round"></span>';
								str += '</label>';
							}
							str += '</td>';
							str += '</tr>';
							//추후 주문가능여부를 체크하도록 만들기 위해 담는 작업
							if(list.useyn === 'Y'){
								arr.push('useyn_'+list.cust_cd);
							}
						});
						$("#sys-biz-container").html(str);

						for(var i = 0; i < arr.length; i++){
							$('#'+arr[i]).prop('checked', true);
						}

					}else{
						str += '<tr>';
						str += '<td colspan="13">조회 가능한 데이터가 없습니다.</td>';
						str += '</tr>';
						$("#sys-biz-container").html(str);
					}
				}
			}) // page end
		}).fail(fnc_ajax_fail);
}

/**
 * @description 사용여부 변경 함수
 * @author 황호진  @version 1.0, @last update 2022-06-10
 */
function useyn_change(cust_cd) {
	var url = '/biz/sys_buying/useyn_change';
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
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
