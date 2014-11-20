<?php

namespace AJAX;

class Watchlist implements AJAX{
	
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


		$watchlists=\Profildienst\DB::getUserData('watchlist');

		if($watchlists === NULL){
			$this -> error('Es konnten keine Merklisten für einen Benutzer mit dieser ID gefunden werden.');
		}

		$wl=$watchlists[$wl_id]['list'];

		if($wl === NULL){
			$this -> error('Keine Merkliste mit dieser ID gefunden.');
		}

		if (!in_array($id, $wl)){
			
			array_push($wl,$id);
			$watchlists[$wl_id]['list']=$wl;
			$ui = new \Profildienst\UI();
			\Profildienst\DB::upd(array('_id' => $_SESSION['id']),array('$set' => array('watchlist' => $watchlists)),'users');
			$this -> resp['content']=sizeof($wl);
			$this -> resp['btn']=$ui -> wl_button(true, $watchlists[$wl_id]['name'], $rm, $id, $wl_id);
			$this -> resp['success']=true;

		}else{
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