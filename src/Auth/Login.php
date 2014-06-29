<?php

namespace Auth;

class Login{

	public $login=false;
	public $name='';
	public $bib='';
	public $isil='';

	public function doLogin ($user, $pwd){

		$a = new Auth();
		$a -> auth_user($user,$pwd);

		if ($a -> logged_in()){
			$this -> name = $a -> get_name();
			$this -> bib = $a -> get_bib();
			$this -> isil = $a -> get_isil();
			$this -> login = true;
		}
	}
}
?>