<?php

namespace Profildienst;

class ImportCover extends \Profildienst\Backend{
	
	private $quiet;
	private $AWSAccessKeyId;
	private $SecretAccessKey;

	private $titles;

	public function __construct($quiet){
		parent::__construct(NULL, \Config\BackendConfig::$opt);
		$this -> quiet = $quiet;
		$this -> AWSAccessKeyId = \Config\BackendConfig::$aws_access;
		$this -> SecretAccessKey = \Config\BackendConfig::$aws_secret;
	}

	private function out($msg){
		if(!$this -> quiet){
			echo $msg;
		}
	}

	public function run(){

		$this -> titles = new \MongoCollection($this -> db, 'titles');

		$cursor = $this -> titles -> find(array('XX02' => NULL));

		while($cursor -> count()){

			$cursor = $cursor -> limit(1000);

			foreach ($cursor as $d) {

				$isbn=isset($d['004A']['A'])? $d['004A']['A'] : NULL;
				if(is_null($isbn)){
					$isbn=isset($d['004A']['0'])? $d['004A']['0'] : NULL;
				}

				$cover=NULL;

				$this -> out('ISBN: '.$isbn.' ');

				if (!is_null($isbn)){
					$isc = new \Profildienst\ISBNtest();
					$isc -> set_isbn($isbn);
					$this -> out($isc -> get_isbn10().' ');
					$cover = $this -> getImg($isc -> get_isbn10());
				}

				if (!is_null($cover)){
					$this -> upd($d['_id'], $cover);
				}else{
					$this -> upd($d['_id'], false);
				}

				usleep(1000000); // Eine Sekunde

			}

			$cursor = $this -> titles -> find(array('XX02' => NULL));

		}

		send_mail('[Cover Script] '.$succ.' Datensätze bearbeitet', '');

	}

	private function upd($id, $val){
		try {
			$res = $this -> titles->update(array('_id' => $id), array('$set' => array('XX02' => $val)), $this -> opt);
			$this ->out($id." ok\n");
			$this -> succ_count++;
		}
		catch (\MongoCursorException $mce) {
			die('Error: '.$mce);
		}
		catch (\MongoCursorTimeoutException $mcte) {
			die('Timeout-Error: '.$mcte);
		}
	}


	private function send_mail($subj, $msg){
		mail('keidel@gbv.de', $subj, $msg);
	}

	private function getImg($asin){

		$AWSAccessKeyId = 'AKIAJ7PKU5XHAWG65IRQ';
		$SecretAccessKey = '6oXtL+bpB1jZY/uUf2aM8JJN36xibv8C2b9kUkEl';
		 
		$ItemId = $asin; // ASIN
		$Timestamp = gmdate('Y-m-d\TH:i:s\Z');
		$Timestamp = str_replace(':', '%3A', $Timestamp);
		$ResponseGroup = 'Images';
		$ResponseGroup = str_replace(',', '%2C', $ResponseGroup);
		 
$String = "AWSAccessKeyId=$AWSAccessKeyId&
AssociateTag=PutYourAssociateTagHere&
IdType=ASIN&
ItemId=$ItemId&
Operation=ItemLookup&
ResponseGroup=$ResponseGroup&
Service=AWSECommerceService&
Timestamp=$Timestamp&
Version=2011-08-01";
		 
		$String = str_replace("\n", '', $String);
		 
		$Prepend = "GET\necs.amazonaws.de\n/onca/xml\n";
		$PrependString = $Prepend . $String;
		 
		$Signature = base64_encode(hash_hmac('sha256', $PrependString, $SecretAccessKey, True));  
		$Signature = str_replace('+', '%2B', $Signature);
		$Signature = str_replace('=', '%3D', $Signature);
		 
		$BaseUrl = 'http://ecs.amazonaws.de/onca/xml?';
		$SignedRequest = $BaseUrl . $String . "&Signature=" . $Signature;
		 
		$XML = @simplexml_load_file($SignedRequest);

		if(isset($XML-> Items -> Item -> MediumImage -> URL[0]) && isset($XML-> Items -> Item ->LargeImage -> URL[0])){
			return array('md' => strval($XML-> Items -> Item -> MediumImage -> URL[0]), 'lg' => strval($XML-> Items -> Item -> LargeImage -> URL[0]));
		}else{
			return NULL;
		}
	}
}

?>