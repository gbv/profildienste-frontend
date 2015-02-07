<?php

namespace Profildienst;

class Import extends \Profildienst\Backend{

	private $quiet;

	public function __construct($quiet){
		parent::__construct(\Config\BackendConfig::$import_dir, \Config\BackendConfig::$opt);
		$this -> quiet = $quiet;
	}

	private function out($msg){
		if(!$this -> quiet){
			echo $msg;
		}
	}

	public function run(){

		$starttime = $this->exectime;

		$prices = 0;
		$count = 0;

		$titles = new \MongoCollection($this -> db, 'titles');

		if ($handle = opendir($this -> dir)) {

			while (false !== ($file = readdir($handle))) {
				if ($file != '.' && $file != '..' && pathinfo($this -> dir.$file, PATHINFO_EXTENSION) == 'json'){

					if ($content = file_get_contents($this -> dir.$file)){

						$d=json_decode($content, true);

						$d['_id']=isset($d['006G']['0'])? $d['006G']['0'] : NULL;
						if ($d['_id'] === NULL){
							array_push($this -> failed,$file);
							$this -> fail_count++;
							continue;
						}

						if(isset($d['004A']['f'])){
							preg_match_all('/EUR (\d+.{0,1}\d{0,2})/', $d['004A']['f'], $m);

							if(count($m) == 2 && count($m[1]) == 1){
								$prices+= floatval($m[1][0]);
								$count++;
							}
						}

						$d['XX02']=NULL;

						try {
								$res = $titles->insert($d, $this -> opt);
								unlink($this -> dir.$file);
								$this ->out($file." ok.\n");
								$this-> succ_count++;
						}
						catch (\MongoCursorException $mce) {
								$this -> errs[$file]='Error: '.$mce;
						}
						catch (\MongoCursorTimeoutException $mcte) {
								$this -> errs[$file]='Timeout-Error: '.$mcte;
						}


					}
				}
			}

			if($count > 0){
				$mean = round(($prices / $count),2);


				$data = new \MongoCollection($this -> db, 'data');
				$d = array('_id' => 'mean', 'value' => $mean);
				$gp = array('_id' => 'gprice', 'value' => $prices);
				$gc = array('_id' => 'gcount', 'value' => $count);


				$cursor_price = $data->findOne(array('_id' => 'gprice'));
				$cursor_count = $data->findOne(array('_id' => 'gcount'));


				if(!is_null($cursor_price) && !is_null($cursor_count)){

					$opr = $cursor_price['value'];
					$ocnt = $cursor_count['value'];

					$mean = round((($opr + $prices) / ($ocnt + $count)),2);

					try {
						$data->update(array('_id' => 'gprice'), array('$set' => array('value' => ($opr + $prices))) , $this -> opt);
						$data->update(array('_id' => 'gcount'), array('$set' => array('value' => ($ocnt + $count))) , $this -> opt);
						$data->update(array('_id' => 'mean'), array('$set' => array('value' => $mean)) , $this-> opt);

					}
					catch (\MongoCursorException $mce) {
							die('Error: '.$mce);
					}
					catch (\MongoCursorTimeoutException $mcte) {
							die('Timeout-Error: '.$mcte);
					}
					catch(\Exception $e){
						die('Fehler');
					}

				}else{

					try {
						$res = $data->insert($d, $this -> opt);
						$res = $data->insert($gp, $this -> opt);
						$res = $data->insert($gc, $this -> opt);
					}
					catch (MongoCursorException $mce) {
						die('Error: '.$mce);
					}
					catch (MongoCursorTimeoutException $mcte) {
						die('Timeout-Error: '.$mcte);
					}

				}

			}

			$this ->out("\n\nErgebnis:\n============================================================\n");
			$this ->out("Ingesamt bearbeitet: ".($this -> fail_count+$this -> succ_count)."\n");
			$this ->out("Erfolgreich: ".$this -> succ_count."\n");
			$this ->out("Fehlgeschlagen: ".$this -> fail_count."\n");
			$this ->out("\nNicht importierte Dateien:\n");
			foreach ($this -> failed as $f){
				$this ->out("\t ".$f."\n");
			}
			$this ->out("Aufgetretene Fehler:\n");
			foreach ($this -> errs as $e){
				$this ->out("\t ".$e."\n");
			}
			$this ->out("============================================================\n");
			closedir($handle);

			$endtime = explode(' ', microtime()); 
			$endtime = $endtime[1] + $endtime[0]; 
			$totaltime = ($endtime - $starttime); 
			$this ->out("Dauer: ".$totaltime." Sekunden\n");

		}
	}
	
}


?>