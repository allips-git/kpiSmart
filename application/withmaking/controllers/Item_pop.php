<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Item_pop extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

    }

    public function index()
    {
        $itemCd = $this->input->get('item_cd'); // URL에서 item_cd 파라미터 가져오기
        $item = $this->Common_m->get_row('item_list', array('item_cd' => $itemCd));
        $data['item'] = $item;

     
        $this->load->view('item_pop', $data); // 데이터와 함께 뷰 로드
    }

}