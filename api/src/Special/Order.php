<?php

namespace Special;

class Order{
	
	private $titlelist;

	public function __construct($auth){

		$cart=\Profildienst\DB::getUserData('cart', $auth);

		if(sizeof($cart) == 0){
			return;
		}

		$ct=array();
		$ci=array();

		foreach ($cart as $c){
			array_push($ct, $c['id']);
			$ci[$c['id']]=$c;
		}


		$query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$in' => $ct))));

		$t = \Profildienst\DB::getTitleList($query, NULL, false);

		$titles = $t -> getResult();

		$this -> titlelist = $t;

		$output_titles=array();
		foreach ($titles as $tit){

			$a = array(
				'lieft' => $ci[$tit->getDirectly('_id')]['lieft'],
				'budget' => $ci[$tit->getDirectly('_id')]['budget'],
				'ssgnr' => $ci[$tit->getDirectly('_id')]['ssgnr'],
				'selcode' => $ci[$tit->getDirectly('_id')]['selcode'],
				'comment' => $ci[$tit->getDirectly('_id')]['comment'],
				'titel' => $tit -> export());

			array_push($output_titles,$a);
		}

		$isil=\Profildienst\DB::getUserData('isil', $auth);
		
		$output=array(
			'bib' => \Config\Config::$bibliotheken[$isil],
			'best_name' => $auth->getName(),
			'best_id' => $auth->getID(),
			'isil' => $isil,
			'datum' => time(),
			'titel' => $output_titles
		);

		$path=\Config\Config::$export_dir.'/'.$isil.'/';
		$filename=time().'_'.$auth->getID().'.json';

		if(!is_dir($path)){
			mkdir($path);
		}

		$success=true;

		do{

			$h=fopen($path.$filename, 'w');

			if($h === NULL){
				$success=false;
				continue;
			}

			// Hier JSON_PRETTY_PRINT falls nötig 
			if(fwrite($h, json_encode($output)) === NULL){
				$success=false;
				continue;	
			}

			fclose($h);

		}while(false);

		if($success){

			$p = \Profildienst\DB::getUserData('price', $auth);

			$p['price'] = 0;
			$p['est'] = 0;
			$p['known'] = 0;
			
			\Profildienst\DB::upd(array('_id' => $auth->getID()),array('$set' => array('price' => $p)),'users');

			$d=\Profildienst\DB::getUserData('pending', $auth);
			$d = array_merge($d,$cart);

			\Profildienst\DB::upd(array('_id' => $auth->getID()),array('$set' => array('cart' => array(), 'pending' => $d)),'users');

			$watchlists=\Profildienst\DB::getUserData('watchlist', $auth);

			foreach($titles as $tit){
				$id=$tit -> getDirectly('_id');
				$wl_id = $this -> in_wl($id, $watchlists);
				if ($wl_id === NULL){
					continue;
				}
				$wl=$watchlists[$wl_id]['list'];
				$occ= array_search($id, $wl);
				$f = array_slice($wl,0,$occ);
				$s = array_slice($wl,($occ+1),count($wl));
				$watchlists[$wl_id]['list'] = array_merge($f, $s);
			}

			\Profildienst\DB::upd(array('_id' => $auth->getID()),array('$set' => array('watchlist' => $watchlists)),'users');


		}

		$this -> success = $success;

	}

	private function in_wl($id, $watchlists){
		foreach ($watchlists as $watchlist){
			if (in_array($id, $watchlist['list'])){
				return $watchlist['id'];
			}
		}
		return NULL;
	}

	public function getCount(){
		return is_null($this -> titlelist) ? 0 : $this -> titlelist -> getCount();
	}

	public function getViewData(){

		$titles = array();

		if(!is_null($this -> titlelist)){
			foreach($this -> titlelist -> getResult() as $tit){
				array_push($titles, $tit -> get('titel'));
			}
		}

		return array('success' => $this -> success, 'titles' => $titles);
	}
}


?>