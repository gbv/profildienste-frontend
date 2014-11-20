<?php

namespace AJAX;

class RemoveWatchlist implements AJAX{
	
	private $err;
	private $resp;

	public function __construct($id, $rm, $wl_id){

		$this -> resp = array('success' => false, 'content' => NULL , 'id' => NULL , 'btn' => NULL, 'rm' => false, 'wl' => NULL , 'errormsg' => '');

		if($id == '' || $rm == '' || $wl_id == ''){
			$this -> error('Unvollständige Daten');
			return;
		}

		$this -> resp['id'] = $id;
		$this -> resp['rm'] = filter_var($rm, FILTER_VALIDATE_BOOLEAN);
		$this -> resp['wl'] = $wl_id;


		$watchlists = \Profildienst\DB::getUserData('watchlist');
		if($watchlists === NULL){
			$this -> error('Es konnten keine Merklisten für einen Benutzer mit dieser ID gefunden werden.');
		}

		$wl=$watchlists[$wl_id]['list'];

		if($wl === NULL){
			$this -> error('Keine Merkliste mit dieser ID gefunden.');
		}

		if (!in_array($id, $wl)){
			$this -> error('Dieser Titel befindet sich nicht in der Merkliste!');
		}else{
			// Entfernen aus dem Array
			$occ = array_search($id, $wl);
			if ($occ === NULL){
				$this -> error('Der Titel konnte nicht entfernt werden!');
			}
			$f = array_slice($wl,0,$occ);
			$s = array_slice($wl,($occ+1),count($wl));
			$g = array_merge($f, $s);

			$watchlists[$wl_id]['list']=$g;
			$ui = new \Profildienst\UI();

			\Profildienst\DB::upd(array('_id' => $_SESSION['id']),array('$set' => array('watchlist' => $watchlists)),'users');
			$this -> resp['content']=count($g);
			$this -> resp['btn']=$ui -> wl_button(false, $watchlists[$wl_id]['name'], $rm, $id, $wl_id);
			$this -> resp['success']=true;
		}

	}

	private function error($msg){
		$this -> resp['success']=false;
		$this -> resp['errormsg']=$msg;
	}

	public function getResponse(){
		return $this -> resp;
	}
	
}

?>