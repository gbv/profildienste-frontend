<?php

namespace Special;

class Search{

	private $error;
	private $output;
	private $titlelist;

	public function __construct($q, $num){

		if($q === ''){
			$this -> error = 1;
			return;
		}

		preg_match('/^(.*?){3,4}\s(.*)$/', $q, $matches);

		if (sizeof($matches) != 3){
			$this -> error = 2;
			return;
		}

		$type=strtolower($matches[1]);
		$regexObj=new \MongoRegex("/.*$matches[2].*/i");

		switch ($type){
			case 'mak':
				$query = array('$and' => array( array( '002@' => $regexObj), array('XX01' => $_SESSION["id"])));		
			break;
			case 'dbn':
				$query = array('$and' => array( array( '_id' => $regexObj), array('XX01' => $_SESSION["id"])));	
			break;
			case 'isb':
				$query = array('$and' => array( array( '$or' => array( array('004A.0' => $regexObj) , array('004A.A' => $regexObj) )), array('XX01' => $_SESSION["id"])));	
			break;
			case 'wvn':
				$query = array('$and' => array( array( '006U' => $regexObj), array('XX01' => $_SESSION["id"])));		
			break;
			case 'erj':
				$query = array('$and' => array( array( '011@.a' => $regexObj), array('XX01' => $_SESSION["id"])));		
			break;
			case 'sgr':
				$query = array('$and' => array( array( '045G.a' => $regexObj), array('XX01' => $_SESSION["id"])));		
			break;
			case 'ref':
				$query = array('$and' => array( array( '$or' => array( array('XX00.e' => $regexObj) , array('XX01' => $regexObj) )), array('XX01' => $_SESSION["id"])));	
			break;
			case 'per':
				$query = array('$and' => array( array( '$or' => array( array('028C.d' => $regexObj) , array('028C.a' => $regexObj), array('021A.h' => $regexObj), array('021B.h' => $regexObj) )), array('XX01' => $_SESSION["id"])));	
			break;
			default:
			case 'tit':
				$query = array('$and' => array( array('$or' => array (array('021A.a' => $regexObj), array('021B.a' => $regexObj),array('021A.d' => $regexObj), array('021B.d' => $regexObj), array('021A.l' => $regexObj), array('021B.l' => $regexObj) )), array('XX01' => $_SESSION["id"])));				
			break;
		}

		$t = \Profildienst\DB::getTitleList($query, $num);

		$results = $t -> getResult();

		$this -> output = new \Profildienst\Output($results, !($num == 0) , $t -> more() , $num , '/pageloader/search/'.$q.'/page/' , false, false);
		$this -> titlelist = $t;
		$this -> error = 0;
	}

	public function getCount(){
		return (is_null($this -> titlelist)) ? 0 : $this -> titlelist -> getCount();
	}

	public function getOutput(){
		return (is_null($this -> output)) ? NULL : $this -> output;
	}

	public function getError(){
		return $this -> error;
	}
}


?>