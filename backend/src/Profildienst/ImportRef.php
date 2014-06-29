<?php

namespace Profildienst;

class ImportRef extends \Profildienst\Backend{

	private $quiet;

	public function __construct($quiet){
		parent::__construct(\Config\Config::$import_ref_dir, \Config\Config::$opt);
		$this -> quiet = $quiet;
	}

	private function out($msg){
		if(!$this -> quiet){
			echo $msg;
		}
	}
	
	public function run(){

		$users = new \MongoCollection($this -> db, 'users');

		if ($handle = opendir($this -> dir)) {

			while (false !== ($file = readdir($handle))) {
				if ($file != '.' && $file != '..' && pathinfo($this -> dir.$file, PATHINFO_EXTENSION) == 'json'){

					if ($content = file_get_contents($this -> dir.$file)){

						$d = json_decode($content, true);

						$id=$d['ID'][0];
						$isil=$d['ISIL'][0];

						$c = $users->findOne(array('_id' => $id));

						if($c){

							$upd=array('$set' => array('budgets' => $d['BUDGETS'], 'isil' => $isil, 'defaults' => $d['DEFAULTS']));

							try {
									$res = $users->update(array('_id' => $id), $upd , $this -> opt);
									$this -> out($file." erfolgreich aktualisiert.\n");
									unlink($this -> dir.$file);
									$this -> succ_count++;
							}
							catch (\MongoCursorException $mce) {
									die('Error: '.$mce);
							}
							catch (\MongoCursorTimeoutException $mcte) {
									die('Timeout-Error: '.$mcte);
							}

						}else{

							$dataset= array(
								'_id' => $id,
								'budgets' => $d['BUDGETS'],
								'cart' => array(),
								'price' => array('price' => 0, 'est' => 0, 'known' => 0),
								'rejected' => array() ,
								'wl_default' => '1' ,
								'wl_order' => array('1'),
								'watchlist' => array( '1' => array('id' => 1, 'name' => 'Meine Merkliste', 'list' => array())),
								'done' => array(),
								'isil' => $isil,
								'defaults' => $d['DEFAULTS'],
								'settings' => array('sortby' => 'erj', 'order' => 'desc' ,'pagesize' => 10),
								'pending' => array()
							);

							try {
									$res = $users->insert($dataset, $this -> opt);
									$this -> out($file." erfolgreich eingetragen.\n");
									$this -> succ_count++;
							}
							catch (\MongoCursorException $mce) {
									die('Error: '.$mce);
							}
							catch (\MongoCursorTimeoutException $mcte) {
									die('Timeout-Error: '.$mcte);
							}

						}			

					}
				}
			}
			$this -> out("\n\nErgebnis:\n============================================================\n");
			$this -> out("Erfolgreich: ".($this -> succ_count)."\n");
			$this -> out("============================================================\n");

			closedir($handle);
		}

	}
}

?>