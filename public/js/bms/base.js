/*================================================================================
 * @description 공장 제품코드 등록 JS
 * @author 김민주, @version 2.0, @last date 2021/12/07
 ================================================================================*/

// 문의 텍스트
function up_confirm() {
	var con = confirm('수정하시겠습니까?');
	return con;
}
// edit 활성화
function dclick(table) {
	$('#'+ table + " .tr_01").hide();
	$('#'+ table + " .tr_02").show();
}
// edit 비활성화
function btn_click(table) {
	$('#'+ table + " .tr_02").hide();
	$('#'+ table + " .tr_01").show();
}

// ajax data
function base_code(idx, ikey, table, tclass, key_level) {

	try {

		// design active
		$('.'+tclass+' tr').removeClass('active');
		$(idx).addClass('active');

		var ikey = ikey;
		var sub_table = '';
		var variable = '';
		var div = '';
		var local_cd = '';

		$('#idx').val(idx);
		$('#ikey').val(ikey);
		$('#table').val(table);
		$('#tclass').val(tclass);
		local_cd = $('.local_cd').val();

		// sub table
		if(table == 'tb_large') { div = 'div_large'; sub_table = 'tb_middle'; tclass = 'ac'; variable = '대분류 입력가능'; }
		else if(table == 'tb_middle') { div = 'div_middle'; sub_table = 'tb_small'; tclass = 'ac02'; variable = '중분류 입력가능'; }
		else if(table == 'tb_small') { div = 'div_small'; sub_table = 'tb_sash'; tclass = 'ac03'; variable = '소분류 입력가능'; }
		else if(table == 'tb_sash') { div = 'div_sash'; sub_table = 'tb_sash'; tclass = 'ac04'; variable = '입력불가 상태. 다시선택하세요.'; }

		$('#result').text(variable);

		if ( ikey != '0' ) { // 대분류 추가 아닐경우
			$.ajax({
				url: '/base/item_in/base_code',
				type: 'GET',
				data: {
					ikey: ikey,
					key_level: key_level
				},
				dataType: "json",
				success: function(data) {
					var str = "";
					if (data.result.length > 0) {
						$.each(data.result, function(i, item) {
							var del = "/base/item_in/d?ikey="+item.ikey;
							str += '<form action="/base/item_in/v" method="post" accept-charset="utf-8">';
							str += '<table id="' + table + '" class="code '+tclass+'" ondblclick="dclick(this.id);">'
							str += '<tr class="tr_01" onclick=javascript:base_code(this,"'+item.ikey+'","'+sub_table+'","'+tclass+'","'+item.key_level+'")>'
							str += '<input type="hidden" name="ikey" value="' + item.ikey + '">' // 2021/11/05 김원명 추가
							str += '<td class="td-input0">' + item.key_name + '</td></tr>'
							if(item.sysyn == 'Y') { // 매출제품등록 완료시 수정,삭제 불가
								str += '<tr class="tr_02" style="display:none;">'
								str += '<td class="T-left">'+item.key_name+'</td>'
								str += '<td class="red T-right">사용중'
								str += '</td>'
								str += '</tr>'
								str += '</table>'
								str += '</form>'
							} else {
								str += '<tr class="tr_02" style="display:none;">'
								str += '<td class="td-input"><input type="hidden" name="p" value="up">'
								str += '<input type="hidden" name="ikey" value="' + item.ikey + '">'
								str += '<input type="hidden" name="table" value="' + sub_table + '">' // 추가 - 김민주 2021/12/07
								str += '<input type="hidden" name="key_level" value="' + item.key_level + '">'
								str += '<input type="hidden" name="local_cd" value="' + local_cd + '">'
								str += '<input type="text" name="key_name" value="' + item.key_name + '"></td>'
								str += '<td class="td-btn">'
								str += '<button type="button" onclick="if(up_confirm() == true){ form.submit(); }"><i class="fa fa-floppy-o" aria-hidden="true">&nbsp;수정</i></button>'
								str += '<button type="button" onclick=javascript:del("'+del+'");><i class="fa fa-trash" aria-hidden="true">&nbsp;삭제</i></button>'
								str += '</td>'
								str += '</tr>'
								str += '</table>'
								str += '</form>'
							} // end sysyn check

						}); // end each data.result

					} // end data.result.length check

					$("#" + div).html(str);
					// 제품 선택시 색상 테이블 데이터 초기화
					if(table == 'tb_middle') { $("#div_small").html(''); }

					// 2021/11/05 김원명 추가
					if(idx == ""){
						var tr = $("input:hidden[name='ikey']:input[value='"+ikey+"']").parents('tr');
						tr.addClass('active');
						// idx 없을때는 추가 입력 비활성화
						$(".btn_reg").css('display', 'none');
						$(".btn_fail").css('display', 'inline');
					} else {
						$(".btn_reg").css('display', 'inline');
						$(".btn_fail").css('display', 'none');
					}
				}, // end success
				error: function(e) {
					$.toast('실패', { sticky: false,type: 'info' });
				}, // end error
			}); // end ajax

		} else {
			// 제품추가 선택시 원단/색상 테이블 데이터 초기화
			$("#div_middle").html('');
			$("#div_small").html('');
		} // end ikey zero check

	} catch (e) {
		console.log('{base_code} 시스템 에러. 지속될 경우 사이트 관리자에게 문의 바랍니다.'+e.message);
	}
}

// select option value change event
/**
 * use url : sale_in.php
 */
function option_value(table, id, ikey) {

	$.ajax({
		url: '/base/sale_in/base_code',
		type: 'GET',
		data: {
			table: table,
			ikey: ikey
		},
		dataType: "json",
		success: function(data) {

			var str = "";
			if (data.result.length > 0) {
				$.each(data.result, function(i, item) {
					if(i == 0) {
						$("#lv3_value").val(item.ikey);
					}
					str += '<option value="' + item.ikey + '">' + item.key_name + '</option>';
				});

			} else {
				str += '<option value="">분류없음</option>';
			}

			$("#" + id).html(str);

			var lv3_value = $("#lv3_value").val();
			if(id != 'item_lv4') {
				$.ajax({
					url: '/base/sale_in/base_code',
					type: 'GET',
					data: {
						table: table,
						ikey: lv3_value
					},
					dataType: "json",
					success: function(data) {

						var str = "";
						if (data.result.length > 0) {
							$.each(data.result, function(i, item) {
								if(i == 0) {
									$("#lv3_value").val(item.ikey);
								}
								str += '<option value="' + item.ikey + '">' + item.key_name + '</option>';
							});

						} else {
							str += '<option value="">분류없음</option>';
						}

						$("#item_lv4").html(str);

					},
					error: function(request,status,error) {
						$.toast("실패. code = "
							+ request.status + " message = "
							+ request.responseText + " error = "
							+ error, { sticky: false,type: 'info' });
					},
				});
			}

		},
		error: function(request,status,error) {
			$.toast("실패. code = "
				+ request.status + " message = "
				+ request.responseText + " error = "
				+ error, { sticky: false,type: 'info' });
		},
	});

}

/**
 * @description submit confim message
 */
function base_chk() { // id type

	var txt = send_gb($('#p').val()); // type : in, up. del
	var min_size = $("input[name=min_size]").val();
	var unit_amt = $("input[name=unit_amt]").val();
	var sale_amt = $("input[name=sale_amt]").val();

	// 최소주문사이즈 검증
	if(min_size <= 0) {
		toast('사이즈는 1이상 입력 가능합니다.', true, 'danger');
		$("input[name=min_size]").focus();
		return false;
	} else if(unit_amt <= 0) {
		toast('매입단가는 0원이상 입력 가능합니다.', true, 'danger');
		$("input[name=unit_amt]").focus();
		return false;
	} else if(sale_amt <= 0) {
		toast('판매단가는 0원이상 입력 가능합니다.', true, 'danger');
		$("input[name=sale_amt]").focus();
		return false;
	} else {
		if(!confirm(txt+' 하시겠습니까?')) {
			return false;
		}
	}

}

function up_submit(frm) {

	var min_size = $("#min_size").val();
	var unit_amt = $("#unit_amt").val();
	var sale_amt = $("#sale_amt").val();

	// 최소주문사이즈 검증
	if(min_size <= 0) {
		toast('사이즈는 1이상 입력 가능합니다.', true, 'danger');
		$("#min_size").focus();
		return false;
	} else if(unit_amt <= 0) {
		toast('매입단가는 0원이상 입력 가능합니다.', true, 'danger');
		$("#unit_amt").focus();
		return false;
	} else if(sale_amt <= 0) {
		toast('판매단가는 0원이상 입력 가능합니다.', true, 'danger');
		$("#sale_amt").focus();
		return false;
	} else {
		var result = confirm('수정하시겠습니까?');
		if(result) {
			$("#item_lv22").removeAttr("disabled");
			$("#item_lv33").removeAttr("disabled");
			$("#item_lv44").removeAttr("disabled");
			$("#"+frm).submit();
		}
	}

}
