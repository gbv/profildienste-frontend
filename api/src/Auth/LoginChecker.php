<?php

namespace Auth;

class LoginChecker{
	
	public static function check($id){

		$data = \Profildienst\DB::get(array('_id' => $id),'users', array('_id' => 1) ,true);

		return !is_null($data);
	}
}

?>