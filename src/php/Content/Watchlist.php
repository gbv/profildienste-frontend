<?php

namespace Content;

class Watchlist implements Content{

	private $output;
	private $titlelist;
	private $name;

	public function __construct($num, $id){

		$data = \Profildienst\DB::get(array('_id' => $_SESSION['id']),'users', array() ,true);

		$watchlists=$data['watchlist'];

		if(isset($watchlists[$id])){

			$list=$watchlists[$id]['list'];
			$query = array('$and' => array(array('XX01' => $_SESSION['id']), array('_id' => array('$in' => $list))));
			$t = \Profildienst\DB::getTitleList($query, $num);
			$titles = $t -> getResult();

		}else{
			return NULL;
		}

		$this -> output = new \Profildienst\Output($titles, !($num == 0) , $t -> more() , $num , '/pageloader/watchlist/'.$id.'/page/' , false, true, false);
		$this -> titlelist = $t;
		$this -> name = $watchlists[$id]['name'];
	}

	public function getOutput(){
		return is_null($this -> output)? NULL : $this -> output;
	}

	public function getCount(){
		return is_null($this -> titlelist)? 0 : $this -> titlelist -> getCount();
	}

	public function getName(){
		return $this -> name;
	}
}


?>