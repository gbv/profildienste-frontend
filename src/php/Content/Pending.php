<?php

namespace Content;

class Pending implements Content{

  private $titlelist;
  private $total;

  public function __construct($num){

    $done = \Profildienst\DB::getUserData('pending');

    $dn=array();
    
    foreach ($done as $d){
      array_push($dn, $d['id']);
    }


    $query = array('$and' => array(array('XX01' => $_SESSION['id']), array('_id' => array('$in' => $dn))));

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