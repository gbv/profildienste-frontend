<?php

namespace Profildienst;

class Title{

	private $j;

	private $in_watchlist=false;
	private $wl_id=NULL;
	private $wl_name;

	private $in_cart=false;	
	private $lft=NULL;
	private $bdg=NULL;
	private $ssgnr=NULL;
	private $selcode=NULL;
	private $comment=NULL;

	private $done=false;
	private $rj=false;

	private $cover;
	private $mak;
	private $ilns;

	private $lookup = array(
		'ersterfassung'	=> array('001A','0'),
		'letze_aenderung_datum'	=> array('001B','0'),
		'letze_aenderung_uhrzeit'=> array('001B','t'),
		'statusaenderung_datum'	=> array('001D','0'),
		'gattung'	=> array('002@','0'),
		'isbn10'	=> array('004A','0'),
		'isbn13'	=> array('004A','A'),
		'lieferbedingungen_preis'=> array('004A','f'),
		'kommentar_lieferbedingungen_preis'	=> array('004A','m'),
		'kommentar_isbn'	=> array('004A','c'),
		'ean'	=> array('004L','0'),
		'dnb_nummer'=> array('006L','0'),
		'verbund_id_num'				=> array('006L','0'),
		'verbund_id_num_vortext'=> array('006L','c'),
		'wv_dnb'		=> array('006U','0'),
		'id_ersterfasser_vortext'=> array('007G','c'),
		'id_ersterfasser'	=> array('007G','0'),
		'addr_erg_ang_url'	=> array('009Q','a'),
		'addr_erg_ang_mime'	=> array('009Q','q'),
		'addr_erg_ang_bezw'	=> array('009Q','3'),
		'sprachcode'=> array('010@','a'),
		'erscheinungsjahr'	=> array('011@','a'),
		'code_erscheinungsland'	=> array('019@','a'),
		'titel'	=> array('mult' => true, 'values' => array( array('021A','a'), array('021B','a'))),
		'untertitel'=>	array('mult' => true, 'values' => array( array('021A','d'), array('021B','d'),array('021A','l'),array('021B','l'))),
		'verfasser'	=>	array('mult' => true, 'values' => array( array('021A','h'), array('021B','h'))),
		'verfasser_vorname'	=> array('028A','d'),
		'verfasser_nachname'	=> array('028A','a'),
		'ort'	=> array('033A','p'),
		'verlag'	=> array('033A','n'),
		'umfang'	=> array('034D','a'),
		'format'	=> array('mult' => true, 'values' => array(array('033I','a'), array('034I','a'))),
		'illustrations_angabe'	=> array('034M','a'),
		'fortlaufendes_sammelwerk_titel'	=> array('036E/00','a'),
		'zaehlung_hauptreihe'	=> array('036E/00','l'),
		'voraus_ersch_termin'	=> array('mult' => true, 'values' => array( array('037D','a'), array('011@','a'))),
		'sachgruppe_quelle'	=> array('045G','A'),
		'sachgruppe_ddc'	=> array('045G','e'),
		'sachgruppe'=>	array('045G','a'),
		'preis'	=> array('091O/28','a'),
		'ppn'	=> array('003@','0'),
		'gvkt_mak'	=> array('091O/99','y'),
		'gvkt_ppn'	=> array('091O/99','a')
	);

	public function __construct($json) {
		$this -> j = $json;

		if(is_null($json['XX02']) || !$json['XX02']){
			$this->cover = NULL;
		}else{
			$this->cover = $json['XX02'];
		}

		if(preg_match('/^(.*?),\sIlns=(.*)/', $this->get('gvkt_mak'), $m)){
			$this->mak=$m[1];
			$this->ilns=$m[2];
		}else{
			$this->mak=$this->get('gvkt_mak');
			$this->ilns=NULL;
		}

	} 

	public function get($v){
		$fields= isset($this -> lookup[$v])? $this -> lookup[$v] : NULL;
		if ($fields){ // Es existiert ein Eintrag in der Lookup-Tabelle
			if (isset($fields['mult'])){ // Ist der Eintrag mehrdeutig?
				$possible=$fields['values'];
				foreach ($possible as $p){
					$r = $this -> getKV($p);
					if ($r !== NULL){
						return $r;
					}
				}
				return NULL;
			}else{
				return $this -> getKV($fields);
			}
		} else{
			return NULL;
		}
	}

	private function getKV($v){
		if (sizeof($v) == 2){
			return isset($this -> j[$v[0]][$v[1]]) ? $this -> prepare($this -> j[$v[0]][$v[1]]) : NULL;			
		}else{
			return isset($this -> j[$v[0]][0]) ? $this -> prepare($this -> j[$v[0]][0]) : NULL;	
		}
	}

	public function getDirectly($v){
		return isset($this -> j[$v]) ? $this -> j[$v] : NULL;
	}

	private function prepare($str){
		$str=preg_replace('/@/','',$str,1);
		if(preg_match('/^\d{6}$/', $str)){
			$months=array('Januar','Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember');
			$month=intval(substr($str, 4));
			return $months[($month-1)].' '.substr($str,0,4);
		}
		if(preg_match('/EUR (.*?),/', $str)){
			$p = explode(',', $str);
			$o='';
			foreach ($p as $price){
				$o.=$price.'<br>';
			}
			return $o;
	}
		return $str;
	}

	public function exists($v){
		$fields= isset($this -> lookup[$v])? $this -> lookup[$v] : NULL;
		if ($fields){
			return isset($this -> j[$fields[0]][$fields[1]]) ? true : false;
		} else{
			return false;
		}		
	}

	public function getEURPrice(){

		$pinf = $this -> getDirectly('004A');
		$pr = NULL;

		if(!is_null($pinf) && isset($pinf['f'])){
			preg_match_all('/EUR (\d+.{0,1}\d{0,2})(\s*\(DE\)){0,1}/', $pinf['f'], $m);

			if(count($m) >= 2 && count($m[1]) >= 1){
				$pr = floatval($m[1][0]);
			}
		}

		return $pr;
	}

	public function inCart(){
		$this -> in_cart = true;
	}

	public function inWatchlist(){
		$this -> in_watchlist = true;
	}

	public function isInCart(){
		return $this -> in_cart;
	}

	public function isInWatchlist(){
		return $this -> in_watchlist;
	}

	public function getWlID(){
		return $this -> wl_id;
	}

	public function setWlID($v){
		$this -> wl_id = $v;
	}

	public function getWlName(){
		return $this -> wl_name;
	}

	public function setWlName($name){
		$this -> wl_name = $name;
	}

	public function setLft($v){
		$this -> lft = $v;
	}

	public function getLft(){
		return $this -> lft;
	}

	public function setBdg($v){
		$this -> bdg = $v;
	}

	public function getBdg(){
		return $this -> bdg;
	}

	public function export(){
		return $this -> j;
	}

	public function setDone(){
		$this -> done = true;
	}

	public function isDone(){
		return $this -> done;
	}

	public function setRejected(){
		$this -> rj = true;
	}

	public function isRejected(){
		return $this -> rj;
	}

	public function setSSGNr($v){
		$this -> ssgnr = $v;
	}

	public function getSSGNr(){
		return $this -> ssgnr;
	}

	public function setSelcode($v){
		$this -> selcode = $v;
	}

	public function getSelcode(){
		return $this -> selcode;
	}

	public function setComment($v){
		$this -> comment = $v;
	}

	public function getComment(){
		return $this -> comment;
	}

	public function hasCover(){
		return $this->cover != null;
	}

	public function getMediumCover(){
		if(!is_null($this->cover)){
			return $this->cover['md'];
		}else{
			return NULL;
		}
	}

	public function getLargeCover(){
		if(!is_null($this->cover)){
			return $this->cover['lg'];
		}else{
			return NULL;
		}
	}

	public function getAssigned(){
		$refs = array();
		foreach($this->getDirectly('XX00') as $r){
			$k = isset($r['e']) ? $r['e'] : NULL;
			$refs[] = $k;
		}
		return $refs;
	}

	public function getILNS(){
		return $this->ilns;
	}

	public function getMAK(){
		return $this->mak;
	}
}

?>