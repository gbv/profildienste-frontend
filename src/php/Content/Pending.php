<?php

namespace Content;

class Pending implements Content{

	private $titlelist;

	public function __construct($num){

		$done = \Profildienst\DB::getUserData('pending');

		$dn=array();
		
		foreach ($done as $d){
			array_push($dn, $d['id']);
		}


		$query = array('$and' => array(array('XX01' => $_SESSION['id']), array('_id' => array('$in' => $dn))));

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