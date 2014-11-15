<?php

namespace AJAX;

class Delete implements AJAX{
	
	private $err;
	private $resp;

	public function __construct(){

		$this -> resp = array('success' => false, 'id' => NULL ,'errormsg' => '');

		$this -> error('Diese Funktion steht noch nicht zur Verfügung!');

		/*Idee: 1) Abfragen der zugeordneten Referenten
		2) Löschen der eigenen Zuordnung
		-> wenn dann leer: löschen
		-> ansonsten update
		*/
	
		//Vorlage: Ausblenden
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