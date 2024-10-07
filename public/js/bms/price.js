/*================================================================================
 * @description 공장시스템 개별 단가 관리 JS
 * @author 김민주, @version 2.0, @last date 2021/11/19
 ================================================================================*/

 $(function () {

 	// 전체 조회
	get_price_list({'local_cd':$("#local_cd").val()}, "Y"); 
 	
 	// 검색, 검색 엔터 버튼 클릭 이벤트
	$("#btn_search").off().click(function () { 
		get_price_list($("#frm_search").serializeObject(), "Y"); // form 데이터. 검색
		// form, btn, list, page_num 초기화
		all_reset();
	});
	$("#content").off().keyup(function (e) {
        if(e.keyCode == 13){
            get_price_list($("#frm_search").serializeObject(), "Y"); // form 데이터. 검색
            // form, btn, list, page_num 초기화
			all_reset();
        }
    });

    // 등록 버튼 클릭 이벤트
    $(".btn_reg").off().click(function () { 
    	var con = confirm('등록 하시겠습니까?');
		if(con) {
			price_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
		}
	});

	// 수정 버튼 클릭 이벤트
    $(".btn_mod").off().click(function () { 
    	var con = confirm('수정 하시겠습니까?');
		if(con) {
			price_validation($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
		}
	});

	// 삭제 버튼 클릭 이벤트
    $(".btn_del").off().click(function () { 
    	var con = confirm('삭제 하시겠습니까?');
		if(con) {
			all_reset();
			$('#keyword').prop('selectedIndex', 0); // 검색 초기화
			$('#content').val('');
			price_delete($("#frm_reg").serializeObject()); // form 데이터 유효성 검사
		}
	});


	// 초기화 이벤트
	$("#btn_reset").off().click(function () {
		var con = confirm('입력값을 초기화하시겠습니까?');
		if(con) {
			// 초기화
			all_reset();
			get_price_list({'local_cd':$("#local_cd").val()});
		}
	});

 });

 /**
  * @description input form, btn, search, page_num 초기화 
  */
 function all_reset() {
	$('#frm_reg')[0].reset();
 	var field = { "btn_reg":"inline", "btn_mod":"none", "btn_del":"none" };
	process(field, "display2");
	$("li.paginationjs-page.J-paginationjs-page").val(1); 
 }

/**
 * @description 개별 단가 리스트 - ajax 페이지네이션
 * @document URL: https://pagination.js.org/docs/index.html, 예제: https://junho85.pe.kr/1440
*/
function get_price_list(obj, mode='') {

 	$("#myTable").tablesorter({theme : 'blue'});
 	const container = $('#pagination');
 	$.ajax({

 		url: '/base/price/list',
 		type: 'POST',
 		data: {
 			local_cd: obj.local_cd,
 			param: obj.param,
 			keyword: obj.keyword,
 			content: obj.content
 		},
 		dataType: "json",
 		success: function(data) { 

	 		container.pagination({ 

				// pagination setting
			    dataSource: data.result.list, // ajax data list
			    className: 'paginationjs-theme-blue paginationjs-small', // pagination css
			    pageSize: 3,
			    autoHidePrevious: true,
			    autoHideNext: true,
			    afterPaging: true,
				pageNumber: $("li.paginationjs-page.J-paginationjs-page").val(), // get selected page num
			    callback: function (result, pagination) { 

					var page = pagination.pageNumber;

					// set page parameter
					$("#page").val(page);
			    	if(mode == "Y") {
			    		$("li.paginationjs-page.J-paginationjs-page").val(1); // search mode
			    	}

			        // count,length
		        	var str = '';
		        	var count = data.result.count;
			        $("#count").html(count);

			        if(count > 0) {

			            $.each(result, function (i, list) {

			            	str += '<tr id="tr_'+list.ikey+'">';
			            	str += '<td class="no">' + list.rownum + '</td>';
			            	str += '<td class="w9 tb_click" onclick=get_price_detail("'+list.ikey+'")>' + list.cust_cd + '</td>';
			            	str += '<td class="w9 tb_click" onclick=get_price_detail("'+ list.ikey +'")>' + list.cust_nm + '</td>';
			            	str += '<td class="T-left gdname tb_click" onclick=get_price_detail("'+ list.ikey +'")>&nbsp;' + list.item_nm + '&nbsp;(' + list.item_cd + ')</td>';
			            	str += '<td class="T-right w8">' + list.unit_amt + '원</td>';
			            	str += '<td class="w10">' + list.reg_user + '</td>';
			            	str += '<td class="w10">' + list.reg_dt + '</td>';
			            	str += '<td class="w10">' + is_empty(list.mod_user) + '</td>';
			            	str += '<td class="w10">' + list.mod_dt + '</td>';
			            	str += '<td class="w7">' + (list.sysyn == 'N' ? '삭제가능' : '<span class="red">삭제불가</span>') + '</td>';
			            	str += '</tr>';

			            });

					} else {

						str += "<tr>";
				        str += "<td colspan='8'>조회 가능한 데이터가 없습니다.</td>";
				        str += "<td colspan='2'></td>";
				        str += "</tr>";

					}
					
					$("#data-container").html(str); // ajax data output
					// tablesorter 사용을 위해 update event trigger
					$("#myTable").trigger("update"); 

					// table selected row css
					if($("#p").val() == 'up'){	
						$("#tr_"+$("#ikey").val()).addClass('active');
					} 

		        } // callback end

		    }) // page end

		} // ajax end

	});
}


/**
 * @description 전송 값 유효성 검사
 */
function price_validation(obj) {

	$.ajax({

 		url: '/base/price/v',
 		type: 'POST',
 		data: {
 			p: obj.p,
 			cust_cd: obj.cust_cd,
 			item_cd: obj.item_cd,
 			unit_amt: obj.unit_amt
 		},
 		dataType: "json",
 		success: function (data) { 

 			// in, up, fail
 			if(data.code == '100') {
				price_register(obj);
			} else if(data.code == '200') {
				price_modify(obj);
			} else if(data.code == '999') {
				toast('입력값이 정확하지 않습니다. 확인 후 다시 이용바랍니다.', true, 'danger');
			}

 		}

	});

}

/**
 * @description 개별 단가 등록
 */
function price_register(obj) {

 	$.ajax({

 		url: '/base/price/i',
 		type: 'POST',
 		data: {
 			p: obj.p,
 			cust_cd: obj.cust_cd,
 			item_cd: obj.item_cd,
 			unit_amt: obj.unit_amt
 		},
 		dataType: "json",
 		success: function (data) {

 			// success, fail 
 			if(data.code == '100') {

				toast('등록이 완료되었습니다.', false, 'info');

				// data reset
				$("li.paginationjs-page.J-paginationjs-page").val(1); 
				get_price_list({'local_cd':$("#local_cd").val()}); 
				$("#unit_amt").val('');

			} else if(data.code == '999') {
				toast('등록실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
			}

 		}

	});

}

/**
 * @description 개별 단가 수정
 */
function price_modify(obj) {

 	$.ajax({

 		url: '/base/price/u',
 		type: 'POST',
 		data: {
 			p: obj.p,
 			cust_cd: obj.cust_cd,
 			item_cd: obj.item_cd,
 			unit_amt: obj.unit_amt
 		},
 		dataType: "json",
 		success: function (data) {

 			// success, fail 
 			if(data.code == '100') {
				toast('수정이 완료되었습니다.', false, 'info');
				get_price_list($("#frm_search").serializeObject());
				$("li.paginationjs-page.J-paginationjs-page").val($("#page").val()); // 페이지 유지
			} else if(data.code == '999') {
				toast('수정실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
			}

 		}

	});

}


/**
 * @description 개별 단가 삭제
 */
function price_delete(obj) {

 	$.ajax({

 		url: '/base/price/d',
 		type: 'POST',
 		data: {
 			ikey: obj.ikey
 		},
 		dataType: "json",
 		success: function (data) {

 			// success, fail 
 			if(data.code == '100') {
				toast('삭제가 완료되었습니다.', false, 'info');
			} else if(data.code == '999') {
				toast('삭제실패. 지속될 경우 사이트 관리자에게 문의 바랍니다.', true, 'danger');
			}

			// list restart
			get_price_list({'local_cd':$("#local_cd").val()}); 

 		}

	});

}

/**
 * @description 단가 상세 확인
 */
function get_price_detail(param) {

	// btn modify mode
    var field = { "btn_reg":"none", "btn_mod":"inline", "btn_del":"inline" };
	process(field, "display2");

    // list color
    $('.at tr').click(function(){
		$('.at tr').removeClass('active');
		$(this).addClass('active');
	});
	$('.at td').click(function(){
		$('.at td').removeClass('active');
		$(this).addClass('active');
	});

    $.ajax({

 		url: '/base/price/detail',
 		type: 'POST',
 		data: {
 			ikey: param
 		},
 		dataType: "json",
 		success: function (data) { 

 			// var setting
			var field = { "p":"up", "ikey":data.result.row.ikey, "cust_cd":data.result.row.cust_cd, "cust_nm":data.result.row.cust_nm
			, "item_cd":data.result.row.item_cd, "item_nm":data.result.row.item_nm, "unit_amt":data.result.row.unit_amt.replace(",","") };
			process(field, "val");

 		}

	});

}