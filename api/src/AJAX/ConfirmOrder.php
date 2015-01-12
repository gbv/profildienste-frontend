<?php

namespace AJAX;

class ConfirmOrder implements AJAX{
	
	private $err;
	private $resp;

	public function __construct($auth){

		$this -> resp = array('success' => false, 'content' => NULL ,'errormsg' => '');

		$cart = \Profildienst\DB::getUserData('cart', $auth);

		$ct=array();
		$ci=array();
		foreach ($cart as $c){
			array_push($ct, $c['id']);
			$ci[$c['id']]=$c;
		}


		$query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$in' => $ct))));

		$t = \Profildienst\DB::getTitleList($query,0, false);

		$titles = $t -> getResult();

		if(count($titles) == 0){
			$this -> error('Ihr Warenkorb ist leer!');
			return;
		}

		$ui = new \Profildienst\UI();

		$this -> resp['content']=$ui -> ordertable($titles, $ci);
		$this -> resp['success']=true;

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