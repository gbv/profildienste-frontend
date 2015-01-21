<?php

namespace AJAX;

class WatchlistManager implements AJAX{
	
	private $err;
	private $resp;

	public function __construct($id, $type, $content, $auth){

		if($content == ''){
			$content = NULL;
		}

		$this -> resp = array('success' => false, 'type' => NULL, 'errormsg' => '', 'id' => NULL);

		if(($id == '' && $type != 'add-wl' && $type != 'change-order') || $type == ''){
			$this -> error('Unvollständige Daten');
			return;
		}

		$this -> resp['id'] = $id;
		$this -> resp['type'] = $type;

		$watchlists= \Profildienst\DB::getUserData('watchlist', $auth);
		$wl_def= \Profildienst\DB::getUserData('wl_default', $auth);
		$wl_order= \Profildienst\DB::getUserData('wl_order', $auth);

		if(!isset($watchlists[$id]) && !($type == 'add-wl' || $type == 'change-order')){
			$this -> error('Eine Merkliste unter der angegebenen ID konnte nicht gefunden werden!');
		}

		switch($type){
			case 'upd-name':
				if (is_null($content)){
					$this -> error('Unvollständige Informationen');
				}
				if(isset($watchlists[$id]['name'])){
					$watchlists[$id]['name']=$content;
				}else{
					$this -> error('Eine Merkliste unter der angegebenen ID konnte nicht gefunden werden!');
				}
			break;
			case 'add-wl':
				if (is_null($content)){
					$this -> error('Unvollständige Informationen');
				}
				$i=max(array_keys($watchlists))+1;
				$nl = array('id' => $i, 'default' => false, 'name' => $content, 'list' => array());
				$watchlists[$i]=$nl;
				array_push($wl_order, $i);
				$this->resp['id'] = $i;
			break;
			case 'def':
				$wl_def=$id;
			break;
			case 'remove':
				unset($watchlists[$id]);
				$occ = array_search($id, $wl_order);
				$f = array_slice($wl_order,0,$occ);
				$s = array_slice($wl_order,($occ+1),count($wl_order));
				$wl_order = array_merge($f, $s);
			break;
			case 'change-order':
				if (!is_null($content)){
					$order = json_decode($content);
				}else{
					$this -> error('Unvollständige Informationen');
				}
				$wl_order=$order;
			break;
		}


		\Profildienst\DB::upd(array('_id' => $auth->getID()),array('$set' => array('watchlist' => $watchlists, 'wl_default' => $wl_def, 'wl_order' => $wl_order)),'users');
		$this -> resp['success']=true;
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