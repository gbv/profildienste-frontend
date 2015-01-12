<?php

namespace Content;

class Cart implements Content{

  private $titlelist;
  private $total;

  public function __construct($num, $auth){

    $cart=\Profildienst\DB::getUserData('cart', $auth);
    $ct=array();

    foreach ($cart as $c){
      array_push($ct, $c['id']);
    }

    $query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$in' => $ct))));

    $t = \Profildienst\DB::getTitleList($query, $num, $auth);
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