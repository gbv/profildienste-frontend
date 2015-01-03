<?php

namespace Content;

class Cart implements Content{

	private $titlelist;

	public function __construct($num){

		$cart=\Profildienst\DB::getUserData('cart');
		$ct=array();

		foreach ($cart as $c){
			array_push($ct, $c['id']);
		}

		$query = array('$and' => array(array('XX01' => $_SESSION['id']), array('_id' => array('$in' => $ct))));
		$this->titlelist = \Profildienst\DB::getTitleList($query, $num);
	}

	public function getTitles(){
		return $this->titlelist;
	}

	public function getCount(){
		return $this -> titlelist -> getCount();
	}
}


?>