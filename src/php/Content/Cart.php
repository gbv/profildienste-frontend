<?php

namespace Content;

class Cart implements Content{

  private $titlelist;
  private $total;

  public function __construct($num){

    $cart=\Profildienst\DB::getUserData('cart');
    $ct=array();

    foreach ($cart as $c){
      array_push($ct, $c['id']);
    }

    $query = array('$and' => array(array('XX01' => $_SESSION['id']), array('_id' => array('$in' => $ct))));

    $t = \Profildienst\DB::getTitleList($query, $num);
    $this->titlelist = $t['titlelist'];
    $this->total = $t['total'];
  }

  public function getTitles(){
    return $this->titlelist;
  }

  public function getTotalCount(){
    return $this->total;
  }
}


?>