<?php

namespace AJAX;

class RemoveReject implements AJAX{
	
	private $err;
	private $resp;

	public function __construct($id, $auth){

		$this -> resp = array('success' => false, 'id' => NULL ,'errormsg' => '');

		if($id == ''){
			$this -> error('Unvollständige Daten');
			return;
		}

		$this -> resp['id'] = $id;

		$rejected=\Profildienst\DB::getUserData('rejected', $auth);

		if($rejected === NULL){
			$this -> error('Es konnten keine Liste für einen Benutzer mit dieser ID gefunden werden.');
		}

		if (!in_array($id, $rejected)){
			$this -> error('Dieser Titel wurde nicht abgelehnt');
		}else{
			// Entfernen aus dem Array
			$occ = array_search($id, $rejected);
			if ($occ === NULL){
				$this -> error('Der Titel konnte nicht entfernt werden!');
			}

			$f = array_slice($rejected,0,$occ);
			$s = array_slice($rejected,($occ+1),count($rejected));
			$g = array_merge($f, $s);

			\Profildienst\DB::upd(array('_id' => $auth->getID()),array('$set' => array('rejected' => $g)),'users');
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