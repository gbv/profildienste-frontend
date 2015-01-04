<?php

/*
	Connection to the Database (Singleton)
*/

namespace Profildienst;

class DB{

	// Speichern der Instanz
	private static $m; 
	private static $db;
	private static $opt = array(
		'safe'    => true,
		'fsync'   => true,
		'timeout' => 10000
	);
 
	// Direktes Instanzieren und Clonen verhindern
	private function __construct() { } 
	private function __clone() { }
 
	private static function init_db() {
		// Wenn keine Instanz existiert eine neue erstellen
		if(!isset(self::$m)) {
			self::$m = new \MongoClient();
			self::$db = self::$m->selectDB('pd');
			if(!isset(self::$m)) {
				throw new \Exception('Connection failed: ' . self::$instance->connect_error);
			}
		}
	}

	public static function getUserData($v){
		if (!$c = DB::get(array('_id' => $_SESSION['id']),'users',array($v => 1),true)){
			die('Kein Benutzer unter der ID gefunden.');
		}
		return isset($c[$v]) ? $c[$v] : NULL;
	}

	public static function getTitleList($query, $skip = 0, $pages = true){
		self::init_db();
		$collection = new \MongoCollection(self::$db, 'titles');
		$r=array();
		$cursor = $collection->find($query);
		$cnt=$cursor -> count();
		$settings=self::getUserData('settings');
		if($settings['order'] == 'asc'){
			$o=1;
		}else{
			$o=-1;
		}
		$sortby=array('erj' => '011@.a' ,'wvn' => '006U.0', 'tit' => '021A.a', 'sgr' => '045G.a', 'dbn' => '006L.0', 'per' => '028A.a');

		if($pages){
			$lm=\Config\Config::$pagesize;
			$cursor = $cursor->skip($lm*$skip);
			$cursor = $cursor->limit($lm);
			if ($collection -> count($query, $lm+1 ,$lm*$skip) == $lm+1){
				$next=true;
			}else{
				$next=false;
			}
		}else{
			$next=false;
		}
		$cursor = $cursor->sort(array($sortby[$settings['sortby']] => $o));
		foreach ($cursor as $doc) {
		  $t = new Title($doc);
		  $id = $t -> getDirectly('_id');
		  $r[$id]=$t;
		}

		$ret = array('titlelist' => NULL, 'total' => $cnt);

		if(count($r) > 0){
			$ret['titlelist'] = new TitleList($r);
		}

		return $ret;
	}

	public static function getTitle($query){
		self::init_db();
		$collection = new \MongoCollection(self::$db, 'titles');
		$c = $collection->findOne($query);
		return $c ? new Title($c) : $c;
	}

	public static function getTitleByID($id){
		self::init_db();
		$collection = new \MongoCollection(self::$db, 'titles');
		$query=array('_id' => $id);
		$c = $collection->findOne($query);
		return $c ? new Title($c) : $c;
	}

	public static function exists($query, $coll){
		self::init_db();
		$collection = new \MongoCollection(self::$db, $coll);
		$c = $collection->findOne($query);
		return $c ? true : false;
	}

	public static function ins($data, $coll){
		self::init_db();
		$collection = new \MongoCollection(self::$db, $coll);
		try {
				$res = $collection->insert($data, self::$opt);
		}
		catch (\MongoCursorException $mce) {
				die('Error: '.$mce);
		}
		catch (\MongoCursorTimeoutException $mcte) {
				die('Timeout-Error: '.$mcte);
		}
	}

	public static function get($query, $coll, $fields = array(), $findone = false){
		self::init_db();
		$collection = new \MongoCollection(self::$db, $coll);
		if ($findone){
			$c = $collection->findOne($query,$fields);
			return $c;
		}else{
			$c = $collection->find($query,$fields);
			$r=array();
			foreach ($c as $doc){
				array_push($r,$doc);
			}
			return $r;
		}
	}

	public static function upd($cond,$data,$coll){
		self::init_db();
		$collection = new \MongoCollection(self::$db, $coll);
		try {
				$res = $collection->update($cond, $data ,self::$opt);
		}
		catch (\MongoCursorException $mce) {
				die('Error: '.$mce);
		}
		catch (\MongoCursorTimeoutException $mcte) {
				die('Timeout-Error: '.$mcte);
		}
	}	
}
?>