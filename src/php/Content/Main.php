<?php

namespace Content;

class Main implements Content{

  private $titlelist;
  private $total;

  public function __construct($num){

    $cart = \Profildienst\DB::getUserData('cart');
    $ct=array();
    foreach ($cart as $c){
      array_push($ct, $c['id']);
    }

    $done= \Profildienst\DB::getUserData('done');
    $dn=array();
    foreach ($done as $d){
      array_push($dn, $d['id']);
    }

    $pending = \Profildienst\DB::getUserData('pending');
    $pn=array();
    foreach ($pending as $p){
      array_push($pn, $p['id']);
    }

    $rj = \Profildienst\DB::getUserData('rejected');

    $query = array('$and' => array(array('XX01' => $_SESSION['id']), array('_id' => array('$nin' => $ct)), array('_id' => array('$nin' => $dn)), array('_id' => array('$nin' => $rj)),array('_id' => array('$nin' => $pn)) ));


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