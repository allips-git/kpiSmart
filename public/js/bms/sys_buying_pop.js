/*================================================================================
 * @name: 황호진 - sys_buying_pop.js	시스템 매입거래처 팝업 JS
 * @version: 1.0.0, @date: 2022-06-09
 ================================================================================*/
$(function () {
	//화면이 맨처음 로드 될때!
	//================================================================================

	//================================================================================


	//이벤트
	//================================================================================
	/**
	 * @description img위에 마우스를 올렸을때 삭제버튼 보이기
	 * @author 황호진  @version 1.0, @last update 2022/06/09
	 */
	$(document).on('mouseover' , '.photo_box img' , function () {
		$(this).next().show();
	});
	/**
	 * @description 삭제버튼 위에 올렸을때 현상유지
	 * @author 황호진  @version 1.0, @last update 2022/06/09
	 */
	$(document).on('mouseover' , '.photo_box .del' , function () {
		$(this).show();
	});

	/**
	 * @description img위에 마우스가 나왔을때 삭제버튼 보이지않게
	 * @author 황호진  @version 1.0, @last update 2022/06/09
	 */
	$(document).on('mouseleave' , '.photo_box img' , function () {
		$(this).next().hide();
	});

	/**
	 * @description input[type=file] 이벤트 걸기
	 * @author 황호진  @version 1.0, @last update 2022/06/09
	 */
	$('#img1 , #img2').on('change' , function () {
		var id = $(this).attr('id');	//img1 , img2
		var labels = $('label');		//label 목록
		//filter 작업으로 해당하는 id만 추출
		var target = labels.filter((i , list) => { return id === list.htmlFor });
		var reader = new FileReader();
		reader.onload = function(e) {
			target.find('.div_img').hide();
			var str = '<img src="'+e.target.result+'" alt="">';
			str += '<span class="del">삭제</span>';
			target.after(str);
		};
		reader.readAsDataURL(this.files[0]);
	});	//event end

	/**
	 * @description img1 , img2 제거 작업
	 * @author 황호진  @version 1.0, @last update 2022/06/09
	 */
	$(document).on('click' , '.del' , function () {
		var target = $(this).prev().prev().attr('for');
		$(this).prev().prev().find('.div_img').show();		//+ 활성화
		$(this).prev().remove();					//img 태그 삭제
		$(this).remove();							//(한번 더 클릭 삭제) 부분 삭제
		$("#"+target).val("");	//input file 초기화
	});

	/**
	 * @description 공장코드번호를 입력 후 검색을 눌렀을때의 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/06/09
	 */
	$('#search_btn').on('click' , function () {
		var pop_type = $('#pop_type').val();
		var fa_cd = $('#fa_cd').val();
		if(pop_type === 'in'){
			if(fa_cd !== ''){
				search_factory_info(fa_cd);
			}else{
				toast('공장코드가 빈값입니다.', true, 'danger');
			}
		}
	});

	/**
	 * @description 공장코드번호를 입력 후 엔터를 눌렀을때 이벤트
	 * @author 황호진  @version 1.0, @last update 2022/06/09
	 */
	$('#fa_cd').off().keyup(function (e) {
		var pop_type = $('#pop_type').val();
		if(pop_type === 'in'){
			if(e.keyCode == 13){
				var v = $(this).val();
				if(v !== ''){
					search_factory_info(v);
				}else{
					toast('공장코드가 빈값입니다.', true, 'danger');
				}
			}
		}
	});

	/**
	 * @description 시스템 연동 신청 버튼을 눌렀을때
	 * @author 황호진  @version 1.0, @last update 2022/06/09
	 */
	$('#sys_link_prop_btn').on('click' , function () {
		if(input_check()){
			var con = custom_fire('확인창' , '시스템 연동 신청하시겠습니까?' , '취소' , '확인');
			con.then((result) => {
				if (result.isConfirmed) {
					comp();
				}
			});
		}
	});

	/**
	 * @description 수정완료 버튼을 눌렀을때
	 * @author 황호진  @version 1.0, @last update 2022/06/10
	 */
	$('#mod_btn').on('click' , function () {
		if(input_check()){
			var con = custom_fire('확인창' , '수정하시겠습니까?' , '취소' , '확인');
			con.then((result) => {
				if (result.isConfirmed) {
					comp();
				}
			});
		}
	});

	/**
	 * @description 주소 검색
	 * @author 황호진  @version 1.0, @last update 2022/06/13
	 */
	$('#search_addr_btn').on('click' , function () {
		daum_postcode('biz_zip', 'address', 'addr_detail');
	});
	//================================================================================
});

/**
 * @description 시스템 업체 등록 팝업 여는 함수
 * @author 황호진  @version 1.0, @last update 2022/06/09
 */
function sys_buying_pop_open() {
	$('#sys_buying_frm')[0].reset();

	//등록 설정
	$('#pop_type').val('in');
	$('#fa_cd').prop('readonly' , false).removeClass('gray');

	//hidden tag 초기화
	$('#cust_cd').val('');
	$('#biz_zip').val('');

	//버튼
	$('#requesting_btn').hide();
	$('#sys_link_prop_btn').show();
	$('#mod_btn').hide();

	//popup open
	$('.sys_buying_pop').bPopup({
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
}

/**
 * @description 공장코드 입력 후 검색 버튼 눌렀을때 동작하는 함수
 * @author 황호진  @version 1.0, @last update 2022/06/09
 */
function search_factory_info(fa_cd) {
	var url = '/biz/sys_buying/search_factory_info';
	var type = 'GET';
	var data = {
		fa_cd : fa_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			if(res.result){
				var field = {
					cust_nm : res.data.cust_nm , ceo_nm : res.data.ceo_nm , ceo_tel : res.data.ceo_tel ,
					tel : res.data.tel , fax : res.data.fax , biz_zip : res.data.biz_zip ,
					address : res.data.address , addr_detail : res.data.addr_detail , memo : res.data.memo ,
					holder_nm : res.data.holder_nm , bl_nm : res.data.bl_nm , bl_num : res.data.bl_num ,
					biz_nm : res.data.biz_nm , biz_num : res.data.biz_num , biz_class : res.data.biz_class ,
					biz_type : res.data.biz_type , email : res.data.email
				};
				process(field , 'val');
			}else{
				toast(res.msg, true, 'danger');
			}
		}).fail(fnc_ajax_fail);
}

/**
 * @description 버튼 누르기전 필수값이 입력되어있는지 검사하기
 * @author 황호진  @version 1.0, @last update 2022/06/09
 */
function input_check() {
	var arr = ['fa_cd' , 'cust_nm' , 'ceo_nm' , 'ceo_tel'];
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
 * @description system_link_prop / update
 * @author 황호진  @version 1.0, @last update 2022/06/09
 */
function comp() {
	var formdata = new FormData($('#sys_buying_frm')[0]);
	formdata.append('useyn' , $("#useyn").is(":checked") ? "Y" : "N");	//checkbox

	$.ajax({
		url: '/biz/sys_buying/comp',
		type: 'POST',
		enctype: 'multipart/form-data',
		data: formdata,
		dataType: "json",
		processData: false,
		contentType: false,
		success: function(res) {
			if(res.result){
				toast(res.msg, false, 'info');

				//시스템매입거래처리스트 재조회
				var search_data = $("#frm").serialize();	//form 데이터
				get_list(search_data);
				//팝업닫기
				$('.sys_buying_pop').bPopup().close();
			}else{
				toast(res.msg, true, 'danger');
			}
		},
		error: function(request,status,error) {
			console.log("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			//$.toast('실패', {sticky: true, type: 'danger'});
		},
	});		//ajax end
}

/**
 * @description get_detail
 * @author 황호진  @version 1.0, @last update 2022/06/09
 */
function get_detail(cust_cd) {
	var url = '/biz/sys_buying/get_detail';
	var type = 'GET';
	var data = {
		cust_cd : cust_cd
	};
	fnc_ajax(url ,type , data)
		.done(function (res) {
			//update 폼
			$('#pop_type').val('up');
			$('#fa_cd').prop('readonly' , true).addClass('gray');

			//승인상태에 따른 버튼 설정
			if(res.data.bizyn === 'Y'){
				$('#requesting_btn').hide();
				$('#sys_link_prop_btn').hide();
				$('#mod_btn').show();
			}else if(res.data.bizyn === 'N'){
				$('#requesting_btn').show();
				$('#sys_link_prop_btn').hide();
				$('#mod_btn').hide();
			}else if(res.data.bizyn === 'C'){
				$('#requesting_btn').hide();
				$('#sys_link_prop_btn').show();
				$('#mod_btn').hide();
			}

			//가용여부 설정
			if(res.data.useyn === 'Y') $('#useyn').prop('checked' , true);
			else $('#useyn').prop('checked' , false);

			var field = {
				cust_cd : res.data.cust_cd,
				fa_cd : res.data.fa_cd,
				keyword : res.data.keyword,
				cust_nm : res.data.cust_nm,
				ceo_nm : res.data.ceo_nm,
				ceo_tel : res.data.ceo_tel,
				person : res.data.person,
				person_tel : res.data.person_tel,
				tel : res.data.tel,
				fax : res.data.fax,
				biz_zip : res.data.biz_zip,
				address : res.data.address,
				addr_detail : res.data.addr_detail,
				memo : res.data.memo,
				holder_nm : res.data.holder_nm,
				bl_nm : res.data.bl_nm,
				bl_num : res.data.bl_num,
				biz_nm : res.data.biz_nm,
				biz_num : res.data.biz_num,
				biz_class : res.data.biz_class,
				biz_type : res.data.biz_type,
				email : res.data.email
			};

			process(field , 'val');

			if(res.data.vat === 'Y') $('#vat_y').prop('checked', true);
			else if(res.data.black === 'N') $('#vat_n').prop('checked', true);

			//이미지설정
			$('.del').click();
			var labels = $('label');		//label 목록
			var target , str;
			if(res.data.file_orig1 !== ''){
				target = labels.filter((i , list) => { return 'img1' === list.htmlFor });
				target.find('div_img').hide();
				str = '<img src="'+ res.data.file_path1 +'/'+ res.data.file_nm1 +'" alt="">';
				str += '<span class="del">삭제</span>';
				target.after(str);
			}

			if(res.data.file_orig2 !== ''){
				target = labels.filter((i , list) => { return 'img2' === list.htmlFor });
				target.find('div_img').hide();
				str = '<img src="'+ res.data.file_path2 +'/'+ res.data.file_nm2 +'" alt="">';
				str += '<span class="del">삭제</span>';
				target.after(str);
			}

			//popup open
			$('.sys_buying_pop').bPopup({
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
