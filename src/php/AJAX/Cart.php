<?php

namespace AJAX;

class Cart implements AJAX{
	
	private $err;
	private $resp;

	public function __construct($id, $lft, $bdg, $selcode, $ssgnr, $comment){

		$this -> resp = array('success' => false, 'content' => NULL , 'id' => NULL,'errormsg' => '', 'price' => NULL, 'known' => NULL, 'est' => NULL);

		if($id == '' || $rm == '' || $lft == '' || $bdg == '' || $selcode == '' || $ssgnr == ''){
			$this -> error('Unvollständige Daten');
			return;
		}

		$this -> resp['id'] = $id;
		$this -> resp['rm'] = $rm;

		$c = \Profildienst\DB::getUserData('cart');

		if($c === NULL){
			$this -> error('Kein Warenkorb für diesen Nutzer gefunden');
			return;
		}

		$ni=array('id' => $id, 'budget' => $bdg, 'lieft' => $lft, 'selcode' => $selcode, 'ssgnr' => $ssgnr, 'comment' => $comment);

		if ($this -> in_cart($ni, $c)){
			$this -> error('Dieser Titel befindet sich bereits im Warenkorb!');
			return;
		}else{

			$p = \Profildienst\DB::getUserData('price');

			
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

			\Profildienst\DB::upd(array('_id' => $_SESSION['id']),array('$set' => array('price' => $p)),'users');

			$this -> resp['price'] = number_format($p['price'], 2, '.', '');
			$this -> resp['est'] = $p['est'];
			$this -> resp['known'] = $p['known'];


			$ui = new \Profildienst\UI();

			array_push($c,$ni);
			\Profildienst\DB::upd(array('_id' => $_SESSION['id']),array('$set' => array('cart' => $c)),'users');

			$this -> resp['content']=sizeof($c);
			$this -> resp['btn']= $ui -> ct_button(true,$rm,$id);
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