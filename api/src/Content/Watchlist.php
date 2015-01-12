<?php

namespace Content;

class Watchlist implements Content{

  private $titlelist;
  private $total;

  public function __construct($num, $id, $auth){

    $data = \Profildienst\DB::get(array('_id' => $auth->getID()),'users', array() ,true);

    $watchlists=$data['watchlist'];

    if(isset($watchlists[$id])){
      
      $list=$watchlists[$id]['list'];
      $query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$in' => $list))));
      $t = \Profildienst\DB::getTitleList($query, $num, $auth);
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