<?php

namespace Content;

class Pending implements Content{

	private $output;
	private $titlelist;

	public function __construct($num){

		$done = \Profildienst\DB::getUserData('pending');

		$dn=array();
		
		foreach ($done as $d){
			array_push($dn, $d['id']);
		}


		$query = array('$and' => array(array('XX01' => $_SESSION["id"]), array('_id' => array('$in' => $dn))));

		$t = \Profildienst\DB::getTitleList($query, $num);

		$titles = $t -> getResult();

		$this -> output = new \Profildienst\Output($titles, !($num == 0) , $t -> more() , $num , '/pageloader/pending/page/' , false, true, false, false);
		$this -> titlelist = $t;

	}

	public function getTitles(){
		return $this -> titlelist -> getResult();
	}

	public function getCount(){
		return $this -> titlelist -> getCount();
	}
}


?>