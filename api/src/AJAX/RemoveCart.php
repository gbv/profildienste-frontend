<?php

namespace AJAX;

class RemoveCart implements AJAX{
	
	private $err;
	private $resp;

	public function __construct($id, $auth){

		$this -> resp = array('success' => false, 'content' => NULL , 'id' => NULL ,'errormsg' => '', 'price' => array());

		if($id == ''){
			$this -> error('Unvollständige Daten');
			return;
		}
		
		$this -> resp['id'] = $id;

		$cart=\Profildienst\DB::getUserData('cart', $auth);

		$ct=array();
		foreach ($cart as $c){
			array_push($ct, $c['id']);
		}

		if (!in_array($id, $ct)){
			$this -> error('Dieser Titel befindet sich nicht im Warenkorb');
		}else{

			$p = \Profildienst\DB::getUserData('price', $auth);

			$tit = \Profildienst\DB::getTitleByID($id);
			$pr = $tit -> getEURPrice();

			if(is_null($pr)){
				// Preis war nicht bekannt
				$p['est'] = $p['est']-1;

				$mean = \Profildienst\DB::get(array('_id' => 'mean'), 'data', array(), true);
				$pr = $mean['value'];

			}else{
				// Preis war bekannt
				$p['known'] = $p['known']-1;
			}

			$p['price'] = $p['price'] - $pr;

			\Profildienst\DB::upd(array('_id' => $auth->getID()),array('$set' => array('price' => $p)),'users');

			$this -> resp['price'] = $p;

			$occ = array_search($id, $ct);
			if ($occ === NULL){
				$this -> error('Der Titel konnte nicht entfernt werden');
			}

			$g = array();
			foreach($cart as $c){
				if($c['id'] != $id){
					array_push($g, $c);
				}
			}

			\Profildienst\DB::upd(array('_id' => $auth->getID()),array('$set' => array('cart' => $g)),'users');
			$this -> resp['content'] = count($g);
			$this -> resp['success'] = true;
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