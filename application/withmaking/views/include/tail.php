<!-- 화면 별 헤더 타이틀 처리 -->
<input type="hidden" id="title" value="<?php echo $title ?>">
<script>
$(function() {
	var title = $("#title").val();
	document.title = title+' : 위드메이킹'; 
});
</script>