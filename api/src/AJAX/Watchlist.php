<?php

namespace AJAX;

class Watchlist implements AJAX{
	
	private $err;
	private $resp;

	public function __construct($id, $wl_id, $auth){

		$this -> resp = array('success' => false, 'content' => NULL , 'id' => NULL ,  'wl' => NULL , 'errormsg' => '');

		if($id == '' || $wl_id == ''){
			$this -> error('Unvollständige Daten');
			return;
		}

		$this -> resp['id'] = $id;
		$this -> resp['wl'] = $wl_id;


		$watchlists=\Profildienst\DB::getUserData('watchlist', $auth);

		if(is_null($watchlists)){
			$this -> error('Es konnten keine Merklisten für einen Benutzer mit dieser ID gefunden werden.');
			return;
		}

		$wl=$watchlists[$wl_id]['list'];

		if(is_null($wl)){
			$this -> error('Keine Merkliste mit dieser ID gefunden.');
			return;
		}

		if (!in_array($id, $wl)){
			array_push($wl,$id);
			$watchlists[$wl_id]['list']=$wl;
			$ui = new \Profildienst\UI();
			\Profildienst\DB::upd(array('_id' => $auth->getID()),array('$set' => array('watchlist' => $watchlists)),'users');
			$this -> resp['content']=sizeof($wl);
			$this -> resp['success']=true;
		}else{
			$this -> error('Dieser Titel befindet sich bereits in der Merkliste');
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