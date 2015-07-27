<?php

namespace Content;

class Rejected implements Content{

	private $output;
	private $titlelist;

	public function __construct($num){

		$rj=\Profildienst\DB::getUserData('rejected');

		$query = array('$and' => array(array('XX01' => $_SESSION["id"]), array('_id' => array('$in' => $rj))));

		$t = \Profildienst\DB::getTitleList($query, $num);

		$titles = $t -> getResult();

		$this -> output = new \Profildienst\Output($titles, !($num == 0) , $t -> more() , $num , '/pageloader/rejected/page/' , true, false, false, false, false);
		$this -> titlelist = $t;

	}

	public function getOutput(){
		return $this -> output;
	}

	public function getCount(){
		return $this -> titlelist -> getCount();
	}
}


?>