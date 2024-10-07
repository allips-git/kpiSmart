/*================================================================================
 * @description BMS 통합제품 등록/수정 관리JS
 * @author 김민주, @version 2.0, @last date 2022/04/22
 ================================================================================*/

 $(function () {

    // 제품군별 ui, data 기본세팅
    base_item_setting($("#frm_reg").serializeObject()); 
    base_ui_setting($("#frm_reg").serializeObject());

    // 제품 추가 버튼 클릭 이벤트
    $("#btn_add").off().click(function () { 
        get_reset(); // form clear
        base_item_setting($("#frm_reg").serializeObject()); 
        base_ui_setting($("#frm_reg").serializeObject());
		item_lv_setting($(".pd_cd").val());
        open_pop();
    });

    // 제품 등록 이벤트
    $(".btn_reg").off().click(function () { 
        var con = confirm('통합제품을 등록 하시겠습니까?');
        if (con) 
        {
            $("#p").val("in");
            item_register(organize_parameter($("#frm_reg").serializeObject())); // form 데이터 유효성 검사
        }
    });

    // 제품 수정 이벤트
    $(".btn_mod").off().click(function () { 
        var con = confirm('통합제품을 수정 하시겠습니까?');
        if (con) 
        {
            $("#p").val("up");
			item_modify(organize_parameter($("#frm_reg").serializeObject()));
        }
    });

    // 제품 삭제 이벤트
    $(".btn_del").off().click(function () { 
        var con = confirm('통합제품을 삭제 하시겠습니까?');
        if (con) 
        {
            $("#p").val("del");
            item_delete($("#frm_reg").serializeObject());
        }
    });

    // 제품군 변경 이벤트
    $(".pd_cd").change(function() {
        base_item_setting($("#frm_reg").serializeObject()); 
        base_ui_setting($("#frm_reg").serializeObject());
		item_lv_setting($(this).val());
    });

    // 기본단위 UI 변경 이벤트 
    $("#unit").change(function() {
        base_ui_setting($("#frm_reg").serializeObject()); 
    });

	 // 단가에 한해서 숫자만 입력 허용
    $(".amt").on('input' , function () {
		var num = $(this).val().replace(/[^0-9]/gi,"");
		$(this).val(num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
	});

    // input type=number 숫자, 소수점(한자리)만 입력 허용
    $(".number").keyup(function() {

        if ($(this).val() != null && $(this).val() != '') 
        {
            var tmps = $(this).val().replace(/[^\.|^0(0)+|^0-9\.]/g, '');
            /* 소수점은 하나만 입력되도록*/
            var arr = tmps.split(".");
            if (arr.length > 2) 
            {
                tmps = arr[0] + '.' + arr[1];
            }
            $(this).val(tmps);
        }

    });

	 /**
	  * @description 세로길이 입력값에 따른 cm당 자동 설정
	  * @author 황호진  @version 1.0, @last update 2022/05/09
	  */
    $('#height_len').on('input' , function () {
		var v = $(this).val();
		var n = Number((v / 100).toFixed(1));
		if(n > 0){
			$('#height_op1').val(n);
		}
	});
});

/**
 * @description 넘길 데이터 정리
 */
function organize_parameter(obj)
{
	// 색상값 추출
	var sub_nm_01 = new Array();
	var sub_nm_02 = new Array();
	var sub_useyn = new Array();
	$("input[name=sub_nm_01]").each(function(index, item)
	{
		sub_nm_01.push($(item).val());
	});
	$("select[name=sub_nm_02]").each(function(index, item)
	{
		sub_nm_02.push($(item).val());
	});
	// useyn 체크="Y", 미체크="N"
	$("input[name=sub_useyn]").each(function(index, item)
	{
		(this.checked) ? sub_useyn.push("Y") : sub_useyn.push("N");
	});

	return {
		'csrf_token_ci':    obj.csrf_token_ci,
		'p':                obj.p,
		'local_cd':         obj.local_cd,
		'pd_cd':            obj.pd_cd,
		'work_gb':          obj.work_gb,
		'item_cd':          obj.item_cd,
		'trade_gb':         obj.trade_gb,
		'proc_gb':          obj.proc_gb,
		'prod_gb':          obj.prod_gb,
		'item_gb':          obj.item_gb,
		'item_lv':          obj.item_lv,
		'item_nm':          obj.item_nm,
		'sub_nm_01':        sub_nm_01,
		'sub_nm_02':        sub_nm_02,
		'sub_useyn':        sub_useyn,
		'size':             obj.size,
		'unit':             obj.unit,
		'max_width':        obj.max_width,
		'max_height':       obj.max_height,
		'min_width':        obj.min_width,
		'min_height':       obj.min_height,
		'purc_base_amt':    Number(obj.purc_base_amt.replaceAll(',','')),
		'base_amt':         Number(obj.base_amt.replaceAll(',','')),
		'max_width_02':     obj.max_width_02,
		'max_height_02':    obj.max_height_02,
		'width_len':        obj.width_len,
		'purc_base_amt_02': Number(obj.purc_base_amt_02.replaceAll(',','')),
		'base_amt_02':      Number(obj.base_amt_02.replaceAll(',','')),
		'height_len':       obj.height_len,
		'height_unit':      obj.height_unit,
		'height_op1':       obj.height_op1,
		'height_op2':       obj.height_op2,
		'max_width_03':     obj.max_width_03,
		'max_height_03':    obj.max_height_03,
		'work_way':         obj.work_way,
		'usage':            obj.usage,
		'div_gb':           obj.div_gb,
		'base_st':          obj.base_st,
		'min_qty':          obj.min_qty,
		'unit_amt':         Number(obj.unit_amt.replaceAll(',','')),
		'sale_amt':         Number(obj.sale_amt.replaceAll(',','')),
		'client_amt':       Number(obj.client_amt.replaceAll(',','')),
		'unit_amt_1':       Number(obj.unit_amt_1.replaceAll(',','')),
		'unit_amt_2':       Number(obj.unit_amt_2.replaceAll(',','')),
		'unit_amt_3':       Number(obj.unit_amt_3.replaceAll(',','')),
		'memo':             obj.memo,
		'useyn':            obj.useyn
	};
}

//  // switch => 가용 여부 on, off 이벤트
//  $(document).on('click', '.switch', function() {
//     let ikey = $(this).children('input').attr('data-use2');
//     let useyn = $(this).children('input').val();
// });

/**
 * @description 제품 색상라인 동적 UI추가
 */
let cnt = 0;
function item_color_add() 
{
    if (event.keyCode == 13) 
    {
        cnt += 1;
        var str = "";
        str += '<dl class="half dl_color_'+cnt+' sub_gb">';
        str += '<dt class="">제품명 세부 추가</dt>';
        str += '<dd class="">';
        str += '<div class="input_line">';
        str += '<input type="text" class="sub_nm_01" name="sub_nm_01" onkeyup="item_color_add(this)" placeholder="세부 추가품목을 입력해주세요." autocomplete="off">';
        str += '<span class="delete" onclick=item_color_del({class:"'+cnt+'"});>';
        str += '<img src="/public/img/app/del_gray.png" alt="">';
        str += '</span>';
        str += '</div>';
        str += '</dd>';
        str += '</dl>';
        str += '<dl class="half dl_color_'+cnt+' sub_gb">';
        str += '<dt>추가분류</dt>';
        str += '<dd>';
        str += '<div class="input_line w75">';
        str += '<select class="sub_nm_02" name="sub_nm_02">';
        str += '<option value="">추가분류_선택</option>';
        str += '<option value="B 아이보리(IVORY)">B 아이보리(IVORY)</option>';
        str += '<option value="C 그레이 (GREY)">C 그레이 (GREY)</option>';
        str += '<option value="C 그린 (GREEN)">C 그린 (GREEN)</option>';
        str += '<option value="C 베이지 (BEIGE)">C 베이지 (BEIGE)</option>';
        str += '<option value="C 브라운 (BROWN)">C 브라운 (BROWN)</option>';
        str += '<option value="C 블루 (BLUE)">C 블루 (BLUE)</option>';
        str += '<option value="C 아이보리 (IVORY)">C 아이보리 (IVORY)</option>';
        str += '<option value="C 핑크 (PINK)">C 핑크 (PINK)</option>';
        str += '<option value="D 그레이 (GREY)">D 그레이 (GREY)</option>';
        str += '<option value="D 브라운 (BROWN)">D 브라운 (BROWN)</option>';
        str += '<option value="D 아이보리(IVORY)">D 아이보리(IVORY)</option>';
        str += '<option value="J 아이보리">J 아이보리</option>';
        str += '<option value="R 그레이">R 그레이</option>';
        str += '<option value="R 베이지">R 베이지</option>';
        str += '<option value="R 브라운">R 브라운</option>';
        str += '<option value="R 아이보리">R 아이보리</option>';
        str += '<option value="R 화이트 (WHITE)">R 화이트 (WHITE)</option>';
        str += '<option value="T 그레이 (GREY)">T 그레이 (GREY)</option>';
        str += '<option value="T 베이지 (BEIGE)">T 베이지 (BEIGE)</option>';
        str += '<option value="T 브라운 (BROWN)">T 브라운 (BROWN)</option>';
        str += '<option value="T 아이보리 (IVORY)">T 아이보리 (IVORY)</option>';
        str += '</select>';
        str += '</div>';
        str += '<label id="switch" class="switch" data-useyn="">';
        str += '<input type="checkbox" id="chk_pop_'+cnt+'" data-use2="chk_pop_'+cnt+'" name="sub_useyn" value="Y" checked>';
        str += '<span class="slider round"></span>';
        str += '</label>';
        str += '</dd>';
        str += '</dl>';
        $("#color-container").append(str);
        $('#count').html(cnt);

        //2022-05-09 수정자 : 황호진
		//사장님 요청하에 포커스 이동이 있어야 한다고 해서 추가!
        $('.sub_nm_01').last().focus();
    }
}

/**
 * @description 제품 색상라인 동적 UI삭제
 */
function item_color_del(obj) 
{
    $(".dl_color_"+obj.class).remove();
}

/**
 * @description 제품군별 기본값 세팅
 */
function base_item_setting(obj) 
{
    $.ajax({

        url: '/base/item_list/setting',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {

            var str = "";
            // 제품군에 따른 기본단위 기본값 세팅 
            if (data.result.unit.length > 0) 
            {
                $.each (data.result.unit, function (i, list) 
                {
                    str += "<option value='"+ list.te_unit + "'>" + list.code_nm + "</option>";
                });
                $("#unit").html(str); // item unit
            }

            var str2 = "";
            // 제품군에 따른 작업구분 기본값 세팅
            if (data.result.item.length > 0) 
            {
                $.each (data.result.item, function (i, list) 
                {
                    str2 += "<option value='"+ list.code_sub + "'>" + list.code_nm + "</option>";
                });
                $(".work_gb").html(str2); // item work list
            } 
            else 
            {
                $(".etc").remove(); // disabled etc tag 
            }
            
        } // end success
        
    });

}

/**
 * @description 제품군, 기본단위별 제품등록 UI활성화/비활성화 세팅
 */
function base_ui_setting(obj) 
{
    var unit = $("#unit option:selected").val();
    if (obj.pd_cd == "AA01" && unit != "005") // 블라인드 제품군(EA 외)
    {
        process({ 
            "blind":"block", 
            "yard":"none", 
            "width":"none", 
            "curtain02":"none", 
            "ea":"none" }, "display2");
    } 
    else if (obj.pd_cd == "AA01" && unit == "005") // 블라인드 제품군(EA) 
    {
        process({ 
            "blind":"none", 
            "yard":"none", 
            "width":"none", 
            "curtain02":"none", 
            "ea":"block" }, "display2");
    } 
    else if (obj.pd_cd == "AA02" &&  unit == "006") // 커텐 제품군(야드)
    {
        process({ 
            "blind":"none", 
            "yard":"block", 
            "width":"none", 
            "curtain02":"block", 
            "ea":"none" }, "display2");
    } 
    else if (obj.pd_cd == "AA02" && unit == "007") // 커텐 제품군(폭) 
    {
        process({ 
            "blind":"none", 
            "yard":"none", 
            "width":"block", 
            "curtain02":"block", 
            "ea":"none" }, "display2");
    } 
    else if (obj.pd_cd == "AA02" && unit == "005") // 커텐 제품군(EA) 
    {
        process({ 
            "blind":"none", 
            "yard":"none", 
            "width":"none", 
            "curtain02":"none", 
            "ea":"block" }, "display2");
    } 
    else // 기타
    {
        process({ 
            "blind":"none", 
            "yard":"none", 
            "width":"none", 
            "curtain02":"none", 
            "ea":"block" }, "display2");
    }

}

/**
 * @description 제품 상세조회
*/
function get_item_detail(obj) 
{
    // form clear
    open_pop();
    get_reset();
    $("#p").val("up");
    $(".title").text("통합제품 수정");

    // css 활성화/비활성화
    process({ "div_reg":"none", "div_mod":"block" }, "display2");

    $.ajax({
        url: '/base/item_list/detail',
        type: 'POST',
        data: obj,
        dataType: "json",
        async: false,
        success: function (data) {
        	// 키워드 설정
			var keyword_str = '';
			if(data.result.keyword.length > 0){
				$.each(data.result.keyword , function (i , list) {
					keyword_str += '<option value="'+ list.ikey +'">'+ list.key_name +'</option>';
				});
			}else{
				keyword_str += '<option value="">키워드없음</option>';
			}
			$('#item_lv_pop').html(keyword_str);

            // 스팩 상세, 기본단위
            spec = JSON.parse(data.result.list[0].spec);
            unit = data.result.list[0].unit;

            var field = { "local_cd": data.result.list[0].local_cd, "item_cd": data.result.list[0].item_cd };
            process(field, "cval");
            
            var str = "";
            if (data.result.unit.length > 0) 
            {
                // 제품군에 따른 기본단위 값 세팅 
                $.each (data.result.unit, function (i, list) 
                {
                    str += "<option value='"+ list.te_unit + "'>" + list.code_nm + "</option>";
                });
                $("#unit").html(str); // item unit
            }
             
            var str2 = "";
            if (data.result.item.length > 0) 
            {
                // 제품군에 따른 작업구분 값 세팅
                $.each (data.result.item, function (i, list) 
                {
                    str2 += "<option value='"+ list.code_sub + "'>" + list.code_nm + "</option>";
                });
                $(".work_gb").html(str2); // item work list
            } 
            else 
            {
                $(".etc").remove(); // Disabled etc tag 
            }

            // item detail radio, select val
            $("input[name='useyn'][value='"+data.result.list[0].useyn+"']").prop("checked", true);
            $(".pd_cd").val(data.result.list[0].pd_cd).prop("selected", true);
            $(".work_gb").val(data.result.list[0].work_gb).prop("selected", true);
            $(".trade_gb").val(data.result.list[0].trade_gb).prop("selected", true);
            $(".proc_gb").val(data.result.list[0].proc_gb).prop("selected", true);
            $(".item_lv").val(data.result.list[0].item_lv).prop("selected", true);
            $("#unit").val(data.result.list[0].unit).prop("selected", true);
            base_ui_setting($("#frm_reg").serializeObject());

            // item detail input val
            var field = { 
                  "item_nm": data.result.list[0].item_nm, "size": data.result.list[0].size
                , "max_width": (spec['max_width'] > 0) ? parseFloat(spec['max_width']) : ''
                , "max_height": (spec['max_height'] > 0) ? parseFloat(spec['max_height']) : ''
                , "min_width": (spec['min_width'] > 0) ? parseFloat(spec['min_width']) : ''
                , "min_height": (spec['min_height'] > 0) ? parseFloat(spec['min_height']) : ''
                , "unit_amt": data.result.list[0].unit_amt, "sale_amt": data.result.list[0].sale_amt
                , "client_amt": (data.result.list[0].client_amt > 0) ? parseFloat(data.result.list[0].client_amt) : ''
                , "unit_amt_1": (data.result.list[0].unit_amt_1 > 0) ? parseFloat(data.result.list[0].unit_amt_1) : ''
                , "unit_amt_2": (data.result.list[0].unit_amt_2 > 0) ? parseFloat(data.result.list[0].unit_amt_2) : ''
                , "unit_amt_3": (data.result.list[0].unit_amt_3 > 0) ? parseFloat(data.result.list[0].unit_amt_3) : ''
                , "memo": data.result.list[0].memo
             };
            process(field, "cval");
             
            $(".height_op2").val((unit == "007") ? spec['height_op2'] : 1).prop("selected", true); // unit="폭"
            if(unit == "006" || unit == "007") // 커텐 폭, 야드 제품 상세
            {
                var spce = { 
                      "width_len": spec['width_len']
                    , "base_amt": (spec['base_amt'] > 0) ? parseFloat(spec['base_amt']) : ''
					, "purc_base_amt": (spec['purc_base_amt'] > 0) ? parseFloat(spec['purc_base_amt']) : ''
                    , "height_len": spec['height_len'], "height_op1": spec['height_op1']
                };
                process(spce, "cval");

                // 주문계산기 값 세팅
                $(".work_way").val(spec['work_way']).prop("selected", true);
                $(".usage").val(spec['usage']).prop("selected", true);
                $(".div_gb").val(spec['div_gb']).prop("selected", true);
                $(".base_st").val(spec['base_st']).prop("selected", true);                
            } 
            else // EA상세
            {
                var etc = { "min_qty": (spec['min_qty'] > 0) ? parseFloat(spec['min_qty']) : '' };
                process(etc, "cval");
            }

            var str3 = "";
            let key = new Object();
            if (data.result.sub_cnt > 0) // 색상 상세정보
            { 
                $.each (data.result.list, function (idx, list) 
                {
                    // 색상 인덱스, value 저장
                    if (list.sub_nm_02 != "") 
                    { 
                        key[idx] = list.sub_nm_02; 
                    }
                    str3 += (idx == 0) ? '<dl class="half dl_color_'+idx+'">' : '<dl class="half dl_color_'+idx+' sub_gb">'; // class name="sub_gb" display remove
                    str3 += '<dt class="impt">제품명 세부 추가</dt>';
                    str3 += '<dd class="">';
                    str3 += '<div class="input_line">';
                    str3 += '<input type="text" class="sub_nm_01" name="sub_nm_01" onkeyup="item_color_add(this)" placeholder="세부 추가품목을 입력해주세요." value="'+list.sub_nm_01+'" autocomplete="off">';
                    if (idx > 0) 
                    {
                        str3 += '<span class="delete" onclick=item_color_del({class:"'+idx+'"});>';
                        str3 += '<img src="/public/img/app/del_gray.png" alt="">';
                        str3 += '</span>';
                    }
                    str3 += '</div>';
                    str3 += '</dd>';
                    str3 += '</dl>';
                    str3 += (idx == 0) ? '<dl class="half dl_color_'+idx+'">' : '<dl class="half dl_color_'+idx+' sub_gb">';
                    str3 += '<dt>추가분류</dt>';
                    str3 += '<dd>';
                    str3 += '<div class="input_line w75">';
                    str3 += '<select class="sub_nm_02_'+idx+'" name="sub_nm_02">';
                    str3 += '<option value="">추가분류_선택</option>';
                    str3 += '<option value="B 아이보리(IVORY)">B 아이보리(IVORY)</option>';
                    str3 += '<option value="C 그레이 (GREY)">C 그레이 (GREY)</option>';
                    str3 += '<option value="C 그린 (GREEN)">C 그린 (GREEN)</option>';
                    str3 += '<option value="C 베이지 (BEIGE)">C 베이지 (BEIGE)</option>';
                    str3 += '<option value="C 브라운 (BROWN)">C 브라운 (BROWN)</option>';
                    str3 += '<option value="C 블루 (BLUE)">C 블루 (BLUE)</option>';
                    str3 += '<option value="C 아이보리 (IVORY)">C 아이보리 (IVORY)</option>';
                    str3 += '<option value="C 핑크 (PINK)">C 핑크 (PINK)</option>';
                    str3 += '<option value="D 그레이 (GREY)">D 그레이 (GREY)</option>';
                    str3 += '<option value="D 브라운 (BROWN)">D 브라운 (BROWN)</option>';
                    str3 += '<option value="D 아이보리(IVORY)">D 아이보리(IVORY)</option>';
                    str3 += '<option value="J 아이보리">J 아이보리</option>';
                    str3 += '<option value="R 그레이">R 그레이</option>';
                    str3 += '<option value="R 베이지">R 베이지</option>';
                    str3 += '<option value="R 브라운">R 브라운</option>';
                    str3 += '<option value="R 아이보리">R 아이보리</option>';
                    str3 += '<option value="R 화이트 (WHITE)">R 화이트 (WHITE)</option>';
                    str3 += '<option value="T 그레이 (GREY)">T 그레이 (GREY)</option>';
                    str3 += '<option value="T 베이지 (BEIGE)">T 베이지 (BEIGE)</option>';
                    str3 += '<option value="T 브라운 (BROWN)">T 브라운 (BROWN)</option>';
                    str3 += '<option value="T 아이보리 (IVORY)">T 아이보리 (IVORY)</option>';
                    str3 += '</select>';
                    str3 += '</div>';
                    str3 += '<label id="switch" class="switch" data-useyn="">';
                    if (list.sub_useyn == "Y")
                    {
                        str3 += '<input type="checkbox" id="sub_use_'+list.ikey+'" data-use2="sub_use_'+list.ikey+'" name="sub_useyn" value='+list.sub_useyn+' checked>';
                    }
                    else
                    {
                        str3 += '<input type="checkbox" id="sub_use_'+list.ikey+'" data-use2="sub_use_'+list.ikey+'" name="sub_useyn" value='+list.sub_useyn+'>';
                    }
                    str3 += '<span class="slider round"></span>';
                    str3 += '</label>';
                    str3 += '</dd>';
                    str3 += '</dl>';
                });
                $("#color-container").html(str3);

                // 추가분류 저장값 선택(추가분류 등록 시스템 미개발로 고정값 선택시스템 제공)
                $.each(key, function(index, item) 
                { 
                    $(".sub_nm_02_"+index).val(item).prop("selected", true);
                });

            } 

        }, // success end
        error: function(request, status, error) 
        {

            console.log("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리

        }, // err end

    }); // ajax end

} // function end

/**
 * @description 공장 제품등록
 * @return result code, comment
 */
function item_register(obj) 
{
    $.ajax({

        url: '/base/item_list/i',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success 
            {
                get_item_list($("#frm_search").serializeObject(), "Y"); 
                $('.item-pop').bPopup().close();
                toast('제품 등록이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '405') // fail 
            {
                toast('색상 중복. 확인 후 다시 이용 바랍니다.', true, 'danger');
            } 
            else if (data.code == '999') // fail 
            {
                if (data.item_cnt > 0 || data.result == false) // 중복 등록 및 등록 실패
                { 
                    toast('중복 등록. 확인 후 다시 이용 바랍니다.', true, 'danger');
                } 
                else 
                {
                    toast('등록 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
                }
            }
			else if (data.code == '9999') // fail
			{
				toast(data.msg , true, 'danger');
			} // end else if

        }
    });
}

/**
 * @description 공장 제품수정
 * @return result code, comment
 */
function item_modify(obj) 
{
    $.ajax({

        url: '/base/item_list/u',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {
            
            // result code
            if (data.code == '100') // success 
            {
                get_item_list($("#frm_search").serializeObject(), "Y");
				$('.item-pop').bPopup().close();
                toast('제품 수정이 완료되었습니다.', false, 'info');
            }
            else if (data.code == '405') // fail 
            {
                toast('색상 중복. 확인 후 다시 이용 바랍니다.', true, 'danger');
            }
            else if (data.code == '999') // fail 
            {
                toast('수정 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            }
            else if (data.code == '9999') // fail
			{
				toast(data.msg , true, 'danger');
			}

        }
    });
}

/**
 * @description 공장 제품삭제
 * @return result code, comment
 */
 function item_delete(obj) 
 {
    $.ajax({

        url: '/base/item_list/d',
        type: 'POST',
        data: obj,
        dataType: "json",
        success: function (data) {

            // result code
            if (data.code == '100') // success
            {
                get_item_list($("#frm_search").serializeObject(), "Y"); 
                $('.item-pop').bPopup().close();
                toast('제품정보 삭제 완료되었습니다.', false, 'info');
            } 
            else if (data.code == '404') // fail
            {
                get_item_list($("#frm_search").serializeObject(), "Y"); 
                $('.item-pop').bPopup().close();
                toast('제품정보 없음. 확인 후 다시 이용 바랍니다.', true, 'danger');
            } 
            else if (data.code == '999')  // fail
            {
                toast('삭제 실패. 지속될 경우 관리자에게 문의 바랍니다.', true, 'danger');
            }

        }
    });
}

/**
 * @description 초기화
 */
function get_reset()
{
    $('#frm_reg')[0].reset();
    $('input[type=text]').val("");
    $('input[name=sub_useyn]').attr('checked', 'checked');
    $(".title").text("통합제품 등록");
    $('select').find('option:first').attr('selected', 'selected');
    $("li.paginationjs-page.J-paginationjs-page").val(1);

    // css 활성화/비활성화
    process({ "div_reg":"block", "div_mod":"none" }, "display2");

    // 색상, 추가분류 동적UI 초기화
    $(".sub_gb").remove();
}

/**
 * @description 팝업창 호출
 */
function open_pop() 
{
    $(".item-pop").bPopup({
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

function item_lv_setting(pd_cd) {
	var url = '/base/item_list/set_item_lv';
	var type = 'GET';
	var data = {
		pd_cd	: pd_cd
	};
	fnc_ajax(url , type , data)
		.done(function (res) {
			var str = '';
			if(res.data.length > 0){
				$.each(res.data , function (i , list) {
					str += '<option value="'+ list.ikey +'">'+ list.key_name +'</option>';
				});
			}else{
				str += '<option value="">키워드없음</option>';
			}
			$('#item_lv_pop').html(str);
		}).fail(fnc_ajax_fail);
}
