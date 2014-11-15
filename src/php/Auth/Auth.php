<?php

/*
	Perform a basic authentication using the CBS-Database.
*/

namespace Auth;

class Auth{

	private $name = '';
	private $bib = '';
	private $isil = NULL;
	private $logged_in = false;

	public function auth_user($user, $pwd){

		if ($user == '' || $pwd == ''){
			return true;
		} 

		$fp = fsockopen(\Config\Config::$cbs_url, \Config\Config::$cbs_port, $errno, $errstr, 30);
		if (!$fp) {
			return false;
		}

		$out = sprintf("GET /XML/PAR?P3C=US&P3Command=LOG+%s+%s HTTP/1.0\r\n",$user,$pwd);
		$out .= "Connection: Close\r\n\r\n";
		fwrite($fp, $out);
		while (!feof($fp)) {

			$line = fgets($fp, 1024);

			// Check for a failed login
			if (preg_match('/^<PICA:P3K ID=\"\/V\">REJECT<\/PICA:P3K>$/', $line)){
				return true;
			}
			// Check for a successfull login
			if (preg_match('/^<PICA:P3K ID=\"(LS|UB)\">(.*?) <([^>]+)><\/PICA:P3K>$/', $line,$matches)){
				$this -> logged_in=true;
				$this -> bib=$matches[2];
				$this -> isil=$matches[3];
			}

			if (preg_match('/^<PICA:P3K ID=\"UM\">(.*?)<\/PICA:P3K>$/', $line,$matches)){
				$this -> logged_in=true;
				$this -> name=$matches[0];
			}
		}

		fclose($fp);
		return true;
	}

	public function logged_in(){
		return $this -> logged_in;
	}


	public function get_name(){
		return $this -> name;
	}

	public function get_bib(){
		return $this -> bib;
	}

	public function get_isil(){
		return $this -> isil;
	}
}

?>