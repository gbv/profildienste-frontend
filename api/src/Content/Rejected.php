<?php

namespace Content;

class Rejected implements Content{

  private $titlelist;
  private $total;

  public function __construct($num){

    $rj=\Profildienst\DB::getUserData('rejected');

    $query = array('$and' => array(array('XX01' => $_SESSION["id"]), array('_id' => array('$in' => $rj))));

    $t = \Profildienst\DB::getTitleList($query, $num);
    $this->titlelist = $t['titlelist'];
    $this->total = $t['total'];
  }

  public function getTitles(){
    return $this -> titlelist;
  }

  public function getTotalCount(){
    return $this->total;
  }
}
?>