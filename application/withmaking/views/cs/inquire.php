<!-- 문의하기 화면 -->
<link rel="stylesheet" href="/public/css/food/cs.css?<?=time()?>">
<input type="hidden" id="site_url" value="<?=$site_url ?>">

<div class="notice content">
    <div class="search_zone section01 section">
        <dl>
            <dt>검색</dt>
            <?php $attributes = array('method' => 'get', 'accept-charset' => 'utf-8'); ?>
            <?php echo form_open($site_url, $attributes); ?>
            <dd> 
                <input type="hidden" name="s" value="t">
                <div class="input_line w8">
                    <select name="op">
                        <option value="title" <?=($op=="title" ? "selected" : "") ?>>제목</option>
                        <option value="name"  <?=($op=="name" ? "selected" : "") ?>>작성자</option>
                    </select>
                </div>
                <div class="input_line w20">
                    <input type="text" placeholder="검색명을 입력해주세요." name="n" autocomplete="off" value="<?php if(isset($params['val'])){ echo $params['val']; } ?>">
                </div>
                <button class="search-btn"><i class="fa fa-search" aria-hidden="true"></i></button>
            </dd>
            <?php echo form_close(); ?>
        </dl>
           
    </div>
	<div class="bottom">
		<div class="list_zone section">
			<h4>문의사항 리스트</h4>
			<div class="n-scroll">
                <table class="notice-table">
                    <colgroup>
                        <col width="100px">
                        <col>
                        <col width="100px">
                        <col width="150px">						
                        <col width="150px">
                        <col width="100px">
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">제목</th>
                            <th scope="col">확인유무</th>							
                            <th scope="col">작성자</th>
                            <th scope="col">작성일</th>
                            <th scope="col">삭제</th>
                        </tr>
                    </thead>
				</table>
			</div>
			<div class="h-scroll mCustomScrollbar">
                <table class="hovering at">
                    <colgroup>
                        <col width="100px">
                        <col>
                        <col width="100px">
                        <col width="150px">						
                        <col width="150px">
                        <col width="100px">
                    </colgroup>
                    <tbody>
                        <?php if(empty($list)){?>
                            <tr>
                                <td colspan="6"><p class="T-center" style="color:#999;">등록된 문의사항이 없습니다.</p></td>
                            </tr>
                        <?php } else { ?>					
                        <?php 
                            empty($page) ? $i=$total_count : $i=(int)$total_count-$page;
                            foreach($list as $row) : 
                        ?>
                        <tr>
                            <td><?=$i;?></td>
                            <td class="table-title T-left"><a href="/cs/inquire/v/<?=$row->ikey;?>"><?=$row->title; ?></a></td>
                            <td><?=$row->confirm === "Y" ? '확인완료' : '미확인';?>
                            </td>
                            <td><?=$row->name?></td>
                            <td><?=$this->common->my_date($row->reg_dt); ?></td>
                            <td><input type="button" class="cancle" onclick="del('/cs/inquire/d/<?=$row->ikey;?>')" value="삭제"></td>
                        </tr>
                        <?php 
                            $i--;
                            endforeach 
                        ?>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
            <!-- pagination -->
            <!-- <div id="pagination" class="pagination"></div>
            <div class="view_count">
                <select id="page_size">
                    <option value="15">페이지 보기 15</option>
                    <option value="30">페이지 보기 30</option>
                    <option value="50" selected>페이지 보기 50</option>
                    <option value="100">페이지 보기 100</option>
                </select>
            </div> -->
        </div>
        <ul id="pagination" class="pagination">
            <li class="page-item"><?php echo $links; ?></li>
        </ul>
    </div>
</div>