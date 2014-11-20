<?php

namespace Profildienst;

class TitleList{
	
	private $res;
	private $count;
	private $more;

	public function __construct($r, $c, $m){
		$this -> res = $r;
		$this -> count = $c;
		$this -> more = $m;
	}

	public function getResult(){
		return $this -> res;
	}

	public function getCount(){
		return $this -> count;
	}

	public function more(){
		return $this -> more;
	}

}

?>