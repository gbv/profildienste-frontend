<?php

namespace AJAX;

class Info implements AJAX{
	
	private $err;
	private $resp;

	public function __construct($id, $auth){

		$this -> resp = array('success' => false, 'type' => NULL , 'content' => NULL , 'id' => NULL ,'errormsg' => '');

		if($id == ''){
			$this -> error('Unvollständige Daten');
			return;
		}

		$this -> resp['id'] = $id;

		if (!$title = \Profildienst\DB::getTitleByID($id)){
			$this -> error('Kein Eintrag unter der ID gefunden');
		}

		$url = $title -> get('addr_erg_ang_url');
		$mime = $title -> get('addr_erg_ang_mime');
		 
		if ($mime == 'text/html'){

			$f=file_get_contents($url);
			preg_match('/<body>(.*?)<\/body>/si',$f,$matches);
			$this -> resp['content']=$matches[1];
			$this -> resp['type']='html';
			$this -> resp['success']=true;

		}else{
			$this -> resp['content']=$url;
			$this -> resp['type']='other';
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