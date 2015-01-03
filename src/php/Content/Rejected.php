<?php

namespace Content;

class Rejected implements Content{

	private $titlelist;

	public function __construct($num){

		$rj=\Profildienst\DB::getUserData('rejected');

		$query = array('$and' => array(array('XX01' => $_SESSION["id"]), array('_id' => array('$in' => $rj))));

		$this -> titlelist = \Profildienst\DB::getTitleList($query, $num);

	}

	public function getTitles(){
		return $this -> titlelist;
	}

	public function getCount(){
		return $this -> titlelist -> getCount();
	}
}


?>