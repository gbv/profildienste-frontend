<?php

namespace Special;

class ManageWatchlists{

	private $wls;
	private $count;
	private $wl_def;

	public function __construct($auth){

		$watchlists=\Profildienst\DB::getUserData('watchlist', $auth);
		$wl_def=\Profildienst\DB::getUserData('wl_default', $auth);
		$wl_order=\Profildienst\DB::getUserData('wl_order', $auth);

		$wls = array();

		foreach($wl_order as $wl_index){
			$wl=$watchlists[$wl_index];
			$name=$wl['name'];
			$id=$wl['id'];

			$open_act=json_encode(array('type' => 'open', 'id' => $id));
			$def_act=json_encode(array('type' => 'def', 'id' => $id));
			$remove_act=json_encode(array('type' => 'remove', 'id' => $id));

			$wl = array(
				'id' => $id,
				'name' => $name,
				'open_act' => $open_act,
				'def_act' => $def_act,
				'remove_act' => $remove_act
			);

			array_push($wls, $wl);
		}

		$this -> wls = $wls;
		$this -> count = count($wls);
		$this -> wl_def = $wl_def;

	}

	public function getCount(){
		return $this -> count;
	}

	public function getWatchlists(){
		return $this -> wls;
	}

	public function getDefWatchlist(){
		return $this -> wl_def;
	}
}


?>