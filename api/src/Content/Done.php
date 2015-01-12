<?php

namespace Content;

class Done implements Content{

  private $titlelist;
  private $total;

  public function __construct($num, $auth){

    $done = \Profildienst\DB::getUserData('done', $auth);

    $dn=array();
    foreach ($done as $d){
      array_push($dn, $d['id']);
    }


    $query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$in' => $dn))));

    $t = \Profildienst\DB::getTitleList($query, $num, $auth);
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