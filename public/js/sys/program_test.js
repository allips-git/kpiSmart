/*================================================================================
 * @name: 김원명 - prod_process.js
 * @version: 1.0.0, @date: 2020-09-21
 ================================================================================*/

$.toast.config.align = 'right';
$.toast.config.width = 400; 

var list_seq = new Array();
var list_pgm = new Array();

var p;
var k;
 
/** url로 메뉴 구분 */
var gubun;

switch(window.location.pathname){
    case '/bms/program': case '/bms/pro_li':
        gubun = "bms";
    break;
    case '/center/program': case '/center/pro_li':
        gubun = "center";
    break;
    case '/app/program': case '/app/pro_li':
        gubun = "app";
    break;
    case '/aps/program': case '/aps/pro_li':
        gubun = "aps";
    break;
    case '/test/program': case '/test/pro_li':
        gubun = "test";
    break;
}
 
 $(function(){
     $('#head').off().change(function(){ // 첫번째 메뉴명 select box 선택 시
         get_program($(this).val(), 'S');
     });
 
     $('#shead').off().change(function(){ // 두번째 메뉴명 selecte box 선택 시
         $('#before').hide();
         $('#after').show();
         get_program($(this).val(), 'N');
     });
 
     $('#add, #modify').off().click(function(){
         if(check_val()){
             send();
         }
     });
 
     $('#reset').off().click(function(){
         reset();
     });
 
     $("#after").sortable({ // jquery-ui 이용하여 메뉴 목록 드래그 앤 드롭 이용
         update : function(e, ui){ // 리스트를 드래그하여 순서 변경 시 적용됨.
             var data = $('#after').children('tr');
             
             $.each(data, function(index, item){ // 드래그 후 리스트 정렬 순서 ikey를 list_key에 배열로 값 저장
                list_pgm.push(item.dataset['pgm_id']);
             });
 
             /**
              * 저장된 배열에 따라 순서를 재정렬
              */
             $.ajax({
                 url: '/'+gubun+'/program/menu_ord_update',
                 type: 'GET',
                 data: {
                     pgm_id  : list_pgm,
                     seq     : list_seq
                 },
                 dataType: "json",
                 success: function(result) {
                     if(result.msg == "success"){
                         $.toast('메뉴 리스트 순서가 변경되었습니다.', {sticky: false, type: 'info'});
                         get_program(p, k);
                     }else{
                         $.toast('메뉴 변경 중에 문제가 발생했습니다. 계속될 경우 관리자에게 문의바랍니다.', {sticky: true, type: 'danger'});                        
                     }
                 },
                 error: function(request,status,error) {
                     alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                     $.toast('실패', {sticky: true, type: 'danger'});
                 },
             });            
         }
     });
 });
 
 /**
  * 
  * @param {program_list 테이블 code id} pgm_id 
  * @param {대, 소메뉴 구분 함수} cm_gb 
  */
 function get_program(pgm_id, cm_gb){
     reset();
     var s_list;
 
     $.ajax({ 
         url: '/'+gubun+'/program/get_program',
         type: 'GET',
         data: {
            pgm_id  : pgm_id,
            cm_gb   : cm_gb
         },
         dataType: "json",
         success: function(result) {
             switch(result.gubun){
                 case 'S': // 첫번째 선택 시 두번째 메뉴 list view
                     $('#shead').html('<option value="">:: 선택하세요</option>');
                     
                     $.each(result.data, function(index, item){
                         $('#shead').append('<option value='+item.pgm_id+'>'+item.cm_nm+'</option>');
                     });
                 break;
                 case 'N': // 두번째 메뉴 선택 시 메뉴 목록에 list view
                     p = pgm_id;
                     k = cm_gb;
 
                     list_seq = [];
                     list_pgm = [];
 
                     if(result.data.length == 0){
                         $('#after').html('<tr><td colspan="6">메뉴가 없습니다. 메뉴를 추가해주세요.</td></tr>');
                     }else{
                         $.each(result.data, function(index, item){
                             list_seq.push(item.cm_seq); // 불러온 리스트 순서를 배열에 저장
                             var num = index + 1;
     
                             s_list += '<tr data-seq="'+item.cm_seq+'" data-pgm_id="'+item.pgm_id+'">';
                             s_list += '<td class="w5">'+num+'</td>';
                             s_list += '<td class="T-left tb_click" onclick="javascript:get_edit_data(\''+item.pgm_id+'\', \''+item.cm_nm+'\', \''+item.cm_url+'\', \''+item.pop_gb+'\', \''+item.useyn+'\')">'+item.cm_nm+'</td>';
                             s_list += '<td class="T-left">'+item.cm_url+'</td>';
                             if(item.useyn == "Y"){
                                s_list += '<td class="w10">활성</td>';
                             }else{
                                s_list += '<td class="w10">비활성</td>';
                             }
                             s_list += '<td class="w10">'+item.pop_gb+'</td>';
                             if(item.sysyn == "Y"){
                                s_list += '<td class="w10 red">삭제불가</td>';
                             }else{
                                s_list += '<td class="w10"><button type="button" onclick="go_del(\''+item.pgm_id+'\')">삭제</button></td>';
                             }
                             s_list += '</tr>';
                         });
     
                         $('#after').html(s_list);
                     }
                 break;
             }
         },
         error: function(request,status,error) {
             alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
             $.toast('실패', {sticky: true, type: 'danger'});
         },
     });
 }
 
 /**
  * 검증 후 데이터 insert OR update
  */
 function send(){
     var con;
     if($('#p').val() == "in"){
         con = confirm('입력하시겠습니까?');
     }else{
         con = confirm('수정하시겠습니까?');
     }
     if(con){
         $.ajax({ 
             url: '/'+gubun+'/program/v',
             type: 'POST',
             data: {
                 p              : $('#p').val(),
                 parent_id      : $('#shead').val(),
                 cm_nm          : $('#cm_nm').val(),
                 cm_url         : $('#cm_url').val(),
                 //platform_gb    : $("input[name=kind]:checked").val(),
                 pop_gb         : $("input[name=pop_gb]:checked").val(),
                 useyn          : $("input[name=useyn]:checked").val(),
                 pgm_id         : $('#i').val()
             },
             dataType: "json",
             success: function(result) {
                 switch(result.msg){
                     case 'success':
                         get_program($('#shead').val(), 'N');
                         $('#cm_nm, #cm_url').val('');
                         $.toast('정상 처리되었습니다.', {sticky: false, type: 'info'});
                     break;
                     case 'error':
                         $.toast('에러가 발생했습니다. 잠시 후 다시 시도해주세요.', {sticky: true, type: 'danger'});
                     break;
                     case 'fail':
                         $.toast('입력 값이 잘못되었습니다.', {sticky: true, type: 'danger'});
                     break;
                 }
             },
             error: function(request,status,error) {
                 alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                 $.toast('실패', {sticky: true, type: 'danger'});
             },
         });
     }
 }
 
 /**
  * 해당 목록 확정버튼 클릭 시 확정 처리(사용X)
  */
 function conf(pgmid){
     var con = confirm('확정 처리하시겠습니까?');
     if(con){
         $.ajax({
             url: '/'+gubun+'/pro_li/conf',
             type: 'GET',
             data: {
                 pgmid : pgmid
             },
             dataType: "json",
             success: function(result) {
                 switch(result.msg){
                     case 'success':
                         get_program($('#shead').val(), 'N');
                         $('#program, #url').val('');
                         $.toast('확정 처리되었습니다.', {sticky: false, type: 'info'});
                     break;
                     case 'error':
                         $.toast('에러가 발생했습니다. 잠시 후 다시 시도해주세요.', {sticky: true, type: 'danger'});
                     break;
                 }
             },
             error: function(request,status,error) {
                 alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                 $.toast('실패', {sticky: true, type: 'danger'});
             },                
         });
     }
 }
 
 /**
  * 해당 목록 삭제 버튼 클릭 시 삭제 ( table data 삭제됨 )
  */
 function go_del(pgm_id){
     var con = confirm('해당 메뉴를 삭제하시겠습니까? 삭제 시 복구 할 수 없습니다.');
     if(con){
         $.ajax({
             url: '/'+gubun+'/program/go_del',
             type: 'GET',
             data: {
                pgm_id : pgm_id
             },
             dataType: "json",
             success: function(result) {
                 switch(result.msg){
                     case 'success':
                         get_program($('#shead').val(), 'N');
                         $('#cm_nm, #cm_url').val('');
                         $.toast('삭제되었습니다.', {sticky: false, type: 'info'});
                     break;
                     case 'error':
                         $.toast('에러가 발생했습니다. 잠시 후 다시 시도해주세요.', {sticky: true, type: 'danger'});
                     break;
                 }
             },
             error: function(request,status,error) {
                 alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                 $.toast('실패', {sticky: true, type: 'danger'});
             },                
         });
     }    
 }
 
 /**
  * 메뉴 목록에서 해당 메뉴 클릭 시 수정 모드로 변경
  */
 function get_edit_data(pgm_id, cm_nm, cm_url, pop_gb, useyn){
     $('#i').val(pgm_id);
     $('#cm_nm').val(cm_nm);
     $('#cm_url').val(cm_url);
     $('#p').val('up');
     switch(pop_gb){
         case 'Y':
             $("input:radio[name='pop_gb']:radio[value='Y']").prop("checked",true);
         break;
         case 'N':
             $("input:radio[name='pop_gb']:radio[value='N']").prop("checked",true);
         break;
     }
 
     switch(useyn){
         case 'Y':
             $("input:radio[name='useyn']:radio[value='Y']").prop("checked",true);
         break;
         case 'N':
             $("input:radio[name='useyn']:radio[value='N']").prop("checked",true);
         break;
      }    
 
     $('#add').hide();
     $('#modify').show();
 }
 
 /**
  * 값 추가, 수정 시 공백값 체크
  */
 function check_val(){
     if($('#head').val() == "" || $('#shead').val() == ""){
         $.toast('메뉴를 선택하세요.', {sticky: true, type: 'danger'});
         return false;
     }
     if($('#cm_nm').val() == ""){
         $.toast('메뉴 명칭을 입력하세요.', {sticky: true, type: 'danger'});
         $('#cm_nm').focus();
         return false;
     }
     if($('#cm_url').val() == ""){
         $.toast('경로(url)을 입력해주세요.', {sticky: true, type: 'danger'});
         $('#cm_url').focus();
         return false;
     }
     if($('#cm_url').val().substr(0,1) != "/"){
         $.toast('경로(url)을 정확히 입력해주세요.', {sticky: true, type: 'danger'});
         $('#cm_url').focus();
         return false;
     }
     return true;
 }
 
 /**
  * reset
  */
 function reset(){
     $('#cm_nm, #cm_url').val('');
 
     $('#add').show();
     $('#modify').hide();
     $('#p').val('in');
     $("input:radio[name='pop_gb']:radio[value='N']").prop("checked",true);
     $("input:radio[name='useyn']:radio[value='Y']").prop("checked",true);
 }