<?php

namespace AJAX;

class ChangeSetting implements AJAX{
	
	private $err;
	private $resp;

	public function __construct($type, $value){

		$this -> resp = array('success' => false, 'errormsg' => '');

		if($type == '' || $value == ''){
			$this -> error('Unvollständige Daten');
			return;
		}

		if (!$c = \Profildienst\DB::get(array('_id' => $_SESSION['id']),'users',array('settings' => 1, '_id' => 0),true)){
			$this -> error('Kein Benutzer unter der ID gefunden.');
		}

		$settings=$c['settings'];

		if (!in_array($type, array_keys($settings))){
			$this -> error('Diese Einstellung existiert nicht!');
		}else{
			$settings[$type]=$value;
			\Profildienst\DB::upd(array('_id' => $_SESSION['id']),array('$set' => array('settings' => $settings)),'users');
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