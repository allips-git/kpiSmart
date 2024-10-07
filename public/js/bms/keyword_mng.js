/*================================================================================
 * @description BMS 통합제품 키워드관리JS
 * @author 황호진, @version 1.0, @last date 2022/05/16
 ================================================================================*/
//item_lv_arr 클래스를 가진 태그에 data-num 설정용
var common_num = 0;
$(function () {
	/**
	 * @description 키워드 관리 눌렀을때 팝업 호출
	 * @author 황호진  @version 1.0, @last update 2022/05/16
	 */
	$('.keyword_mng').on('click' , function () {
		get_keyword($('#lv_pd_cd').val() , open_lv_pop);
	});

	/**
	 * @description 소속제품군 변경시 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/05/16
	 */
	$('#lv_pd_cd').on('change' , function () {
		get_keyword($(this).val());
	});


	//input 태그에서 enter 이벤트 감지
	$(document).on('keypress', '.item_lv_arr' , function (e) {
		var target = $(this);
		if(e.keyCode === 13 && target.val() !== ""){
			save_item_lv(target);
		}
	});

	//저장버튼의 클릭 이벤트
	$(document).on('click' , '.lv_save_btn' , function () {
		var target = $(this).prev().prev().prev();
		if(target.val() !== ""){
			save_item_lv(target);
		}
	});

	//수정버튼 감지
	$(document).on('click' , '.lv_unlock_btn' , function () {
		//수정버튼 비활성화
		$(this).hide();
		//삭제아이콘 활성화
		//$(this).prev().show();
		$(this).prev().hide();
		//입력창 제한 풀기 및 포커싱
		$(this).prev().prev().prop('readonly' , false).focus();
		//큰 묶음의 div에 클래스 제거
		$(this).parent().removeClass('disab');
		//저장버튼 활성화
		$(this).next().show();
	});

	//추가버튼 감지
	$('#lv_add_btn').on('click' , function () {
		common_num++;
		var str = '';
		str += '<div class="input_box">';
		str += '<input type="text" class="item_lv_arr" id="keyword'+ common_num +'" data-num="'+ common_num +'" data-ikey="new" placeholder="카테고리 명 입력 (예 : 린넨커튼)">';
		str += '<img src="/public/img/app/del_gray.png" class="lv_del" alt="" style="display: none;">';
		str += '<button type="button" class="gray lv_unlock_btn" style="display: none;">수정</button>';
		str += '<button type="button" class="gray lv_save_btn">저장</button>';
		str += '</div>';
		$('.lv_stand').append(str);
		$('#keyword'+common_num).focus();
	});

	//삭제아이콘 클릭
	$(document).on('click', '.lv_del' , function () {
		var target = $(this).prev();
		if(target.attr('data-ikey') !== 'new'){
			del_item_lv(target);
		}
	});
	
	//확인버튼을 눌러서 팝업 닫기
	$('#lv_close_btn').on('click' , function () {
		$(".keyword_mng_pop").bPopup().close();
	});
});

/**
 * @description 소속제품군에 해당하는 키워드 조회
 * @return keyword list
 * @author 황호진  @version 1.0, @last update 2022/05/16
 * 			팝업이 열렸을때 , 소속제품군을 바꿨을때
 */
function get_keyword(pd_cd , callback = undefined) {
	var url = '/base/item_list/get_keyword';
	var type = 'GET';
	var data = {
		pd_cd : pd_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var str = '';
			var len = res.data.length;
			if(len > 0){
				$.each(res.data , function (i , list) {
					str += '<div class="input_box disab">';
					str += '<input type="text" class="item_lv_arr" id="keyword'+ common_num +'" data-ikey="'+ list.ikey +'" placeholder="카테고리 명 입력 (예 : 린넨커튼)" value="'+ list.key_name +'" readonly>';
					str += '<img src="/public/img/app/del_gray.png" class="lv_del" alt="" style="display: none;">';
					str += '<button type="button" class="gray lv_unlock_btn">수정</button>';
					str += '<button type="button" class="gray lv_save_btn" style="display: none;">저장</button>';
					str += '</div>';
					common_num = (i + 1);	//맨마지막의 i에 더하기 1를 하기
				})
			}
			str += '<div class="input_box">';
			str += '<input type="text" class="item_lv_arr" id="keyword'+ common_num +'" data-num="'+ common_num +'" data-ikey="new" placeholder="카테고리 명 입력 (예 : 린넨커튼)">';
			str += '<img src="/public/img/app/del_gray.png" class="lv_del" alt="" style="display: none;">';
			str += '<button type="button" class="gray lv_unlock_btn" style="display: none;">수정</button>';
			str += '<button type="button" class="gray lv_save_btn">저장</button>';
			str += '</div>';

			$('.lv_stand').html(str);


			//callback이 있을때
			if(callback !== undefined){
				callback();
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 키워드 관리 팝업 열기
 * @author 황호진  @version 1.0, @last update 2022/05/16
 */
function open_lv_pop() {
	$(".keyword_mng_pop").bPopup({
		modalClose: true,
		opacity: 0.8,
		positionStyle: "absolute",
		speed: 300,
		transition: "fadeIn",
		transitionClose: "fadeOut",
		zIndex: 99997
		//, modalColor:"transparent"
	});
}

/**
 * @description 키워드 입력란 enter 및 저장버튼 눌렀을때 함수
 * @author 황호진  @version 1.0, @last update 2022/05/16
 */
function save_item_lv(target) {
	var url = '/base/item_list/save_item_lv';
	var type = 'POST';
	var data = {
		ikey		: target.attr('data-ikey'),		//고유값
		pd_cd		: $('#lv_pd_cd').val(),			//소속제품군
		key_name 	: target.val(),					//명칭
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast('키워드 저장 완료되었습니다.', false, 'info');
				//입력창 입력불가 제한 걸기
				target.prop('readonly' , true);
				//삭제아이콘 비활성화
				target.next().hide();
				//수정버튼 활성화
				target.next().next().show();
				//저장버튼 비활성화
				target.next().next().next().hide();
				//부모에 클래스 추가
				target.parent().addClass('disab');

				if(data['ikey'] === 'new'){
					var ikey = res.data.ikey;
					//data-ikey 변경
					target.attr('data-ikey',ikey);

					var targer_num = target.attr('data-num');
					var all_num = $('.'+target[0].className).length - 1;

					//수정한 input number 와 해당 클래스의 모든 길이의 값이 같을때 새로운 태그 추가
					if(targer_num == all_num){
						common_num++;
						var str = '';
						str += '<div class="input_box">';
						str += '<input type="text" class="item_lv_arr" id="keyword'+ common_num +'" data-num="'+ common_num +'" data-ikey="new" placeholder="카테고리 명 입력 (예 : 린넨커튼)">';
						str += '<img src="/public/img/app/del_gray.png" class="lv_del" alt="" style="display: none;">';
						str += '<button type="button" class="gray lv_unlock_btn" style="display: none;">수정</button>';
						str += '<button type="button" class="gray lv_save_btn">저장</button>';
						str += '</div>';
						$('.lv_stand').append(str);
						$('#keyword'+common_num).focus();
					}
				}

				//통합제품등록 검색조건에 제품분류 최신화
				var item_lv_str = '<option value="">제품분류 (대)_전체</option>';
				$.each(res.data.item_lv , function (i , list) {
					item_lv_str += '<option value="'+ list.ikey +'">'+ list.key_name +'</option>'
				});
				$('#item_lv').html(item_lv_str);
			}else{
				toast('키워드 저장 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 삭제아이콘을 눌렀을때 함수
 * @author 황호진  @version 1.0, @last update 2022/05/17
 */
function del_item_lv(target) {
	var url = '/base/item_list/del_item_lv';
	var type = 'POST';
	var data = {
		ikey		: target.attr('data-ikey')
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				toast('키워드 삭제 완료되었습니다.', false, 'info');
				get_keyword($('#lv_pd_cd').val());
				//통합제품등록 검색조건에 제품분류 최신화
				var item_lv_str = '<option value="">제품분류 (대)_전체</option>';
				$.each(res.data.item_lv , function (i , list) {
					item_lv_str += '<option value="'+ list.ikey +'">'+ list.key_name +'</option>'
				});
				$('#item_lv').html(item_lv_str);
			}else{
				toast('키워드 삭제 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}
