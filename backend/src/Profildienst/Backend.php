<?php

namespace Profildienst;

abstract class Backend{

	protected $exectime;

	protected $fail_count;
	protected $succ_count;

	protected $errs;
	protected $failed;

	protected $db;
	protected $dir;

	protected $opt;

	public function __construct($dir, $opt){

		$this -> dir = $dir;
		$this -> opt = $opt;

		$this -> exectime = explode(' ',microtime());  
		$this -> exectime = $this -> exectime[1] + $this -> exectime[0];
		
		$this -> fail_count = 0;
		$this -> succ_count = 0;

		$this -> errs = array();
		$this -> failed = array();

		try{
			$m = new \MongoClient();
			$this -> db = $m->selectDB('pd');
		}catch(Exception $e){
			$e -> getMessage();
		}
	}

	abstract public function run();

}
?>