/*================================================================================
 * @name: 황호진 - deli_order.js	출고지시 화면
 * @version: 1.0.0, @date: 2022-07-25
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================
	var search_data = {
		's' 	: null
	};
	get_list(search_data);
	//================================================================================


	/**
	 * @description 소계기준으로 체크박스를 눌렀을때 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/07/26
	 */
	$(document).on('change' , 'input[name=sub_chk]' , function () {
		var v = $(this).val();
		if($(this).is(':checked')){
			$('.sub_total'+v).prop('checked' , true).parent().parent().addClass('active');
		}else{
			$('.sub_total'+v).prop('checked' , false).parent().parent().removeClass('active');
		}
	});

	/**
	 * @description 체크박스를 눌렀을때 css 처리
	 * @author 황호진  @version 1.0, @last update 2022/07/26
	 */
	$(document).on('change' , 'input[name=chk]' , function () {
		if($(this).is(':checked')){
			$(this).prop('checked' , true).parent().parent().addClass('active');
		}else{
			$(this).prop('checked' , false).parent().parent().removeClass('active');
		}
	});

	/**
	 * @description 출고 작업 출력 버튼 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/07/26
	 */
	$('#deli_print').on('click' , function () {
		var deli_arr = [];

		//선택된 출고 담는 작업
		$(".deli").each(function () {
			if($(this).is(":checked") == true){
				deli_arr.push($(this).val());
			}
		});

		if(deli_arr.length > 0){
			deli_order_pop(deli_arr);
		}else{	//선택되어있는 출고 데이터가 없다면!
			toast('출력할 출고 데이터가 선택되어 있지 않습니다! 선택 후 다시 시도해주세요!', true, 'danger');
		}
	});

	/**
	 * @description 날짜 조건 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/08/26
	 */
	$('#dt').on('change' , function () {
		var search_data = $("#frm").serialize();	//form 데이터
		//변경되자마자 즉시 검색 들어갈것
		get_list(search_data);
	});
});
/**
 * @description get_list
 * @author 황호진  @version 1.0, @last update 2022/07/25
 */
function get_list(data) {
	var url = '/work/deli_order/get_list';
	var type = 'GET';
	fnc_ajax(url , type , data)
		.done(function (res) {
			var len = res.data.length;
			var str = '';

			if(len > 0)
			{
				var dlv_gb_name = '';	//화물 , 직배 , 택배 등등
				var dlv_gb_num = 0;		//건수
				var num 	= 0;		//소계기준 카운터
				$.each(res.data , function (i , list) {
					if(dlv_gb_name === '')
					{
						dlv_gb_name = list.dlv_gb_nm;
						dlv_gb_num = list.box_cnt;
					}
					else if(dlv_gb_name !== list.dlv_gb_nm)
					{
						str += '<tr class="total_tr">';
						str += '<td colspan="15">'+ dlv_gb_name +' 합계 '+ dlv_gb_num +'건</td>';
						str += '<td>';
						str += '<input type="checkbox" class="sub_total'+num+'" id="sub_chk'+ num +'" name="sub_chk" value="'+ num +'">';
						str += '<label for="sub_chk'+ num +'"></label>';
						str += '</td>';
						str += '</tr>';

						dlv_gb_name = list.dlv_gb_nm;
						dlv_gb_num = list.box_cnt;
						num++;
					}

					str += '<tr>';
					str += '<td class="w4">'+ list.row_no +'</td>';
					str += '<td class="w4">'+ list.dlv_gb_nm +'</td>';
					str += '<td class="w12 T-left">'+ list.cust_nm +'</td>';
					str += '<td class="w12 T-left">'+ list.item_nm +'</td>';
					str += '<td class="w4">'+ list.width +'</td>';
					str += '<td class="w4">'+ list.height +'</td>';
					str += '<td class="w4">'+ list.left_qty +'</td>';
					str += '<td class="w4">'+ list.right_qty +'</td>';
					str += '<td class="w4">'+ list.qty +'</td>';
					str += '<td class="w5">'+ list.unit_nm +'</td>';
					str += '<td class="T-left Elli">'+ list.address +' '+ list.addr_detail +'</td>';
					str += '<td class="w6">'+ list.deli_person +'</td>';
					str += '<td class="w5">'+ list.print_cnt +'</td>';
					str += '<td class="w5">'+ list.finyn_nm +'</td>';
					str += '<td class="w9">'+ list.deli_dt +'</td>';
					str += '<td class="w4">';
					str += '<input type="checkbox" class="deli sub_total'+num+'" id="chk'+ i +'" name="chk" value="'+ list.ikey +'">';
					str += '<label for="chk'+ i +'"></label>';
					str += '</td>';
					str += '</tr>';
				});

				str += '<tr class="total_tr">';
				str += '<td colspan="15">'+ dlv_gb_name +' 합계 '+ dlv_gb_num +'건</td>';
				str += '<td>';
				str += '<input type="checkbox" class="sub_total'+num+'" id="sub_chk'+ num +'" name="sub_chk" value="'+ num +'">';
				str += '<label for="sub_chk'+ num +'"></label>';
				str += '</td>';
				str += '</tr>';

				$('#do_list').html(str);
			}
			else
			{
				str += '<tr>';
				str += '<td colspan="16">조회 가능한 데이터가 없습니다.</td>';
				str += '</tr>';
				$("#do_list").html(str); // ajax data output
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 출고지시 출력물 팝업 열기
 * @author 황호진  @version 1.0, @last update 2022/07/26
 */
function deli_order_pop(arr) {
	$('#arr').val(arr);

	var pop_width = 600;
	var pop_height = 720;

	var popup_x = (window.screen.width / 2) - (pop_width / 2);
	var popup_y = (window.screen.height / 2) - (pop_height / 2) - 50;

	var pop_title = "출고지시 팝업" ;

	window.open("", pop_title , 'status=no, resizable=0, height=' + pop_height  + ', width=' + pop_width  + ', left='+ popup_x + ', top='+ popup_y) ;

	var frmData = document.send_frm ;
	frmData.target = pop_title ;
	frmData.action = "/work/deli_order_pop" ;

	frmData.submit() ;
}

/**
 * @description 출력완료 처리 함수
 * @author 황호진  @version 1.0, @last update 2022/07/28
 */
function deli_comp(arr) {
	let con = custom_fire('출고처리' , '출고처리하시겠습니까?' , '취소' , '확인');
	con.then((result) => {
		if(result.isConfirmed){
			let url = '/work/deli_order/deli_comp';
			let type = 'POST';
			let data = {
				arr : arr
			};
			fnc_ajax(url , type , data)
				.done(function (res) {
					if(res.result){
						toast(res.msg, false, 'info');
						var search_data = $("#frm").serialize();	//form 데이터
						get_list(search_data);
					}else{
						toast(res.msg, true, 'danger');
					}
				}).fail(fnc_ajax_fail);
		}
	});
}
