<?php

namespace Content;

class Cart implements Content{

	private $output;
	private $titlelist;

	public function __construct($num){

		$cart=\Profildienst\DB::getUserData('cart');
		$ct=array();

		foreach ($cart as $c){
			array_push($ct, $c['id']);
		}

		$query = array('$and' => array(array('XX01' => $_SESSION["id"]), array('_id' => array('$in' => $ct))));

		$t = \Profildienst\DB::getTitleList($query, $num);

		$titles = $t -> getResult();

		$this -> output = new \Profildienst\Output($titles, !($num == 0) , $t -> more() , $num , '/pageloader/cart/page/' , true, false, false, false);
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