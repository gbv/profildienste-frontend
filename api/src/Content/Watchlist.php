<?php

namespace Content;

class Watchlist implements Content{

  private $titlelist;
  private $total;

  public function __construct($num, $id){

    $data = \Profildienst\DB::get(array('_id' => $_SESSION['id']),'users', array() ,true);

    $watchlists=$data['watchlist'];

    if(isset($watchlists[$id])){
      
      $list=$watchlists[$id]['list'];
      $query = array('$and' => array(array('XX01' => $_SESSION['id']), array('_id' => array('$in' => $list))));
      $t = \Profildienst\DB::getTitleList($query, $num);
      $this->titlelist = $t['titlelist'];
      $this->total = $t['total'];

    }
  }

  public function getTitles(){
    return $this -> titlelist;
  }

  public function getTotalCount(){
    return $this->total;
  }
}


?>