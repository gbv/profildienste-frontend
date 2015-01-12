<?php

namespace Content;

class Main implements Content{

  private $titlelist;
  private $total;

  public function __construct($num, $auth){

    $cart = \Profildienst\DB::getUserData('cart', $auth);
    $ct=array();
    foreach ($cart as $c){
      array_push($ct, $c['id']);
    }

    $done= \Profildienst\DB::getUserData('done', $auth);
    $dn=array();
    foreach ($done as $d){
      array_push($dn, $d['id']);
    }

    $pending = \Profildienst\DB::getUserData('pending', $auth);
    $pn=array();
    foreach ($pending as $p){
      array_push($pn, $p['id']);
    }

    $rj = \Profildienst\DB::getUserData('rejected', $auth);

    $query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$nin' => $ct)), array('_id' => array('$nin' => $dn)), array('_id' => array('$nin' => $rj)),array('_id' => array('$nin' => $pn)) ));


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