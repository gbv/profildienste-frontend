<?php

namespace AJAX;

class Reject implements AJAX{
	
	private $err;
	private $resp;

	public function __construct($ids){

		$this -> resp = array('success' => false, 'id' => array() ,'errormsg' => '');

		if($ids == ''){
			$this -> error('Unvollständige Daten');
			return;
		}

		$this -> resp['id'] = $ids;

		$c = \Profildienst\DB::getUserData("rejected");
		$cart = \Profildienst\DB::getUserData('cart');
		$wls = \Profildienst\DB::getUserData('watchlist');

		if($c === NULL || $cart === NULL ||  $wls === NULL){
			$this -> error('Keine entsprechende Liste gefunden');
		}

		foreach ($ids as $id){

			if ($this -> in_cart($id, $cart) || $this -> in_wl($id, $wls)){
				$this -> error('Sie können keinen Titel ausblenden, der sich in einer Merkliste oder im Warenkorb befindet!');
			}else{
				array_push($c,$id);
			}
		}

		\Profildienst\DB::upd(array('_id' => $_SESSION['id']),array('$set' => array('rejected' => $c)),'users');
		$this ->resp['success']=true;
	}

	private function in_cart($id, $cart){
		foreach($cart as $c){
			if ($c['id'] == $id){
				return true;
			}
		}
		return false;
	}

	private function in_wl($id, $watchlists){
		foreach ($watchlists as $watchlist){
			if (in_array($id, $watchlist['list'])){
				return true;
			}
		}
		return false;
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