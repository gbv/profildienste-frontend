<?php

namespace AJAX;

class Cart implements AJAX{
	
	private $err;
	private $resp;

	public function __construct($id, $lft, $bdg, $selcode, $ssgnr, $comment, $auth){

		$this -> resp = array('success' => false, 'content' => NULL , 'id' => NULL,'errormsg' => '', 'price' => array(), 'order' => array());

		if($id == '' || $lft == '' || $bdg == ''){
			$this -> error('Unvollständige Daten');
			return;
		}

		$defaults = \Profildienst\DB::getUserData('defaults', $auth);


		if($selcode == ''){
			$selcode = $defaults['selcode']; 
		}

		if($ssgnr == ''){
			$ssgnr = $defaults['ssgnr']; 
		}

		$this -> resp['id'] = $id;
		$this -> resp['rm'] = $rm;

		$this -> resp['order'] = array(
			'lft' =>  $lft,
			'budget' => $bdg,
			'ssgnr' => $ssgnr,
			'selcode' => $selcode,
			'comment' => $comment
		);

		$c = \Profildienst\DB::getUserData('cart', $auth);

		if($c === NULL){
			$this -> error('Kein Warenkorb für diesen Nutzer gefunden');
			return;
		}

		$ni=array('id' => $id, 'budget' => $bdg, 'lieft' => $lft, 'selcode' => $selcode, 'ssgnr' => $ssgnr, 'comment' => $comment);

		if ($this -> in_cart($ni, $c)){
			$this -> error('Dieser Titel befindet sich bereits im Warenkorb!');
			return;
		}else{

			$p = \Profildienst\DB::getUserData('price', $auth);

			
			$tit = \Profildienst\DB::getTitleByID($id);

			$pr = $tit -> getEURPrice();


			if(is_null($pr)){
				// Preis ist nicht bekannt
				$p['est'] = $p['est']+1;

				$mean = \Profildienst\DB::get(array('_id' => 'mean'), 'data', array(), true);
				$pr = $mean['value'];

			}else{
				// Preis ist bekannt
				$p['known'] = $p['known']+1;
			}

			$p['price'] = $p['price'] + $pr;

			\Profildienst\DB::upd(array('_id' => $auth->getID()),array('$set' => array('price' => $p)),'users');

			$p['price'] = number_format($p['price'], 2, '.', '');
			$this -> resp['price'] = $p;
			
			array_push($c,$ni);
			\Profildienst\DB::upd(array('_id' => $auth->getID()),array('$set' => array('cart' => $c)),'users');

			$this -> resp['content']=sizeof($c);
			$this -> resp['success']=true;
		}
	}

	private function in_cart($item, $cart){
		foreach($cart as $c){
			if ($c['id'] == $item['id']){
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