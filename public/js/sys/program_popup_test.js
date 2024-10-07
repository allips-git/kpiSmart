/*================================================================================
 * @name: 김원명 - prod_process.js
 * @version: 1.0.0, @date: 2020-09-23
 ================================================================================*/

 $.toast.config.align = 'right';
 $.toast.config.width = 400;
 
 var list_pgm = new Array();
 var list_seq = new Array();
 
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
     get_head_menu();
 
     $('#head').off().change(function(){
         if($(this).val() == ""){
             $('#cm_gb').val('H');
             get_menu('H');
         }else{
             $('#cm_gb').val('S');
             get_menu('S', $(this).val());
         }
     });
 
     $('#reset, #add, #modify').off().click(function(){
         switch($(this).attr('id')){
             case 'reset':
                 get_menu('H');
                 $('#head').val('').attr('selected', 'selected');
                 //location.reload();
             break;
             case 'add': case 'modify':
                 execution();
             break;
         }
     });
 
     ord_set();
 
     $("#list").sortable({ // jquery-ui 이용하여 메뉴 목록 드래그 앤 드롭 이용
         update : function(e, ui){ // 리스트를 드래그하여 순서 변경 시 적용됨.
             var data = $('#list').children('tr');
             list_pgm = [];
 
             $.each(data, function(index, item){
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
                     }else{
                         $.toast('메뉴 변경 중에 문제가 발생했습니다. 계속될 경우 관리자에게 문의바랍니다.', {sticky: true, type: 'danger'});                        
                     }
 
                     get_menu('H');
                     get_head_menu();
                 },
                 error: function(request,status,error) {
                     alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                     $.toast('실패', {sticky: true, type: 'danger'});
                 },
             });
         }
     });
 });
 
 function get_head_menu(){
     var head = '<option value="">:: 전체</option>'; 
 
     $.ajax({ 
         url: '/'+gubun+'/pro_li/get_menu',
         type: 'GET',
         dataType: "json",
         success: function(result) {
             $.each(result.data, function(index, item){
                 if(item.cm_gb == "H"){
                     head += '<option value='+item.pgm_id+'>'+item.cm_nm+'</option>';
                 }
             });
 
             $('#head').html(head);
             ord_set();
         },
         error: function(request,status,error) {
             alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
             $.toast('실패', {sticky: true, type: 'danger'});
         },
     });    
 }
 
 function get_edit_data(cm_nm, pgm_id){
     $('#add').hide();
     $('#modify').show();
 
     $('#cm_nm').val(cm_nm);
     $('#pgm_id').val(pgm_id);
     $('#p').val('up');
 }
 
 function get_menu(cm_gb, pgm_id){
     reset();
     
     var list = "";
 
     $.ajax({ 
         url: '/'+gubun+'/pro_li/get_menu',
         dataType: "json",
         success: function(result) {
             console.log(result);
             var i = 1;
             
             if(result.data.length == 0){
                 $('#list').html('<tr><td colspan="3">메뉴가 없습니다. 메뉴를 추가하세요.</td></tr>');
             }else{
                 $.each(result.data, function(index, item){
                     if(cm_gb == "H"){
                         if(item.cm_gb == "H"){
                             var num = i;
                             list += '<tr data-seq="'+item.cm_seq+'" data-pgm_id="'+item.pgm_id+'">';
                             list += '<td>'+num+'</td>';
                             list += '<td class="T-left tb_click" onclick="get_edit_data(\''+item.cm_nm+'\', \''+item.pgm_id+'\')">'+item.cm_nm+'</td>';
                             //list += '<td><button onclick="conf(\''+item.pgm_id+'\')">확정처리</button></td>';
                             if(item.sysyn == "Y"){
                                list += '<td class="red">삭제불가</td>';
                             }else{
                                list += '<td><button onclick="go_del(\''+item.pgm_id+'\')">삭제</button></td>';
                             }
                             list += '</tr>';
                             i++;
                         }
                     }else{
                         if(item.cm_gb == cm_gb && item.head_id == pgm_id){
                             var num = i;
                             list += '<tr data-seq="'+item.cm_seq+'" data-pgm_id="'+item.pgm_id+'">';
                             list += '<td>'+num+'</td>';
                             list += '<td class="T-left tb_click" onclick="get_edit_data(\''+item.cm_nm+'\', \''+item.pgm_id+'\')">'+item.cm_nm+'</td>';
                             //list += '<td><button onclick="conf(\''+item.pgm_id+'\')">확정처리</button></td>';
                             if(item.sysyn == "Y"){
                                list += '<td class="red">삭제불가</td>';
                             }else{
                                list += '<td><button onclick="go_del(\''+item.pgm_id+'\')">삭제</button></td>';
                             }
                             list += '</tr>';
                             i++;
                         }
                     }
                 });
                 
                 if(list == ""){
                     list = '<tr><td colspan="3">메뉴가 없습니다.</td></tr>';
                 }
     
                 $('#list').html(list);
                 ord_set();
             }
         },
         error: function(request,status,error) {
             alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
             $.toast('실패', {sticky: true, type: 'danger'});
         },
     });
 }
 
 function execution(){
     if(check_val()){
         var con;
         if($('#p').val() == "in"){
             con = confirm('입력하시겠습니까?');
         }else{
             con = confirm('수정하시겠습니까?');
         }
         if(con){
             $.ajax({
                 url: '/'+gubun+'/pro_li/execution',
                 type: 'GET',
                 data: {
                     pgm_id     : $('#pgm_id').val(),
                     head_id    : $('#head').val(),
                     kind       : $('#p').val(),
                     cm_gb      : $('#cm_gb').val(),
                     cm_nm      : $('#cm_nm').val()
                 },
                 dataType: "json",
                 success: function(result) {
                     switch(result.msg){
                         case 'success':
                             get_menu('H');
                             get_head_menu();
                             $('#head').val('').attr('selected', 'selected');
                             $('#cm_gb').val('H');
                             $.toast('정상 처리되었습니다.', {sticky: false, type: 'info'});
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
     };
 }
 
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
                         get_menu('H');
                         get_head_menu();
                         $('#head').val('').attr('selected', 'selected');
                         $('#m_kind').val('H');
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
 
 function go_del(pgm_id){
     var con = confirm('삭제하시겠습니까? 삭제 시 복구 불가능합니다.');
     if(con){
         $.ajax({
             url: '/'+gubun+'/pro_li/go_del',
             type: 'GET',
             data: {
                 pgm_id : pgm_id
             },
             dataType: "json",
             success: function(result) {
                 switch(result.msg){
                     case 'success':
                         get_menu('H');
                         get_head_menu();
                         $('#head').val('').attr('selected', 'selected');
                         $('#m_kind').val('H');
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
 
 function ord_set(){
     list_seq = [];
 
     var seq = $('#list').children('tr');
 
     $.each(seq, function(index, item){
         list_seq.push(item.dataset['seq']);
     });
 }
 
 function check_val(){
     if($('#cm_nm').val() == ""){
         $.toast('메뉴명을 입력하세요.', {sticky: true, type: 'danger'});
         return false;
     }
     return true;
 }
 
 function reset(){
     $('#add').show();
     $('#modify').hide();
     $('#cm_nm').val('');
     $('#pgm_id').val('');
     $('#p').val('in');
 }