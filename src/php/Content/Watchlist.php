<?php

namespace Content;

class Watchlist implements Content{

	private $titlelist;
	private $name;

	public function __construct($num, $id){

		$data = \Profildienst\DB::get(array('_id' => $_SESSION['id']),'users', array() ,true);

		$watchlists=$data['watchlist'];

		if(isset($watchlists[$id])){

			$list=$watchlists[$id]['list'];
			$query = array('$and' => array(array('XX01' => $_SESSION['id']), array('_id' => array('$in' => $list))));
			$this -> titlelist = \Profildienst\DB::getTitleList($query, $num);
			$this -> name = $watchlists[$id]['name'];

		}else{
			return NULL;
		}

		
	}

	public function getTitles(){
		return $this -> titlelist;
	}

	public function getCount(){
		return $this -> titlelist -> getCount();
	}

	public function getName(){
		return $this -> name;
	}
}


?>