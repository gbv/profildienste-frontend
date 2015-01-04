<?php

namespace Profildienst;

class UI{

	private $watchlists;
	private $wl_def;
	private $wl_order;
	private $rain;
	private $isil;

	public function __construct(){

		$this -> watchlists = DB::getUserData('watchlist');
		$this -> wl_def = DB::getUserData('wl_default');
		$this -> wl_order = DB::getUserData('wl_order');
		$this -> isil = DB::getUserData('isil');
		\Rain\Tpl::configure(\Config\Config::$rain_config);
		$this -> rain = new \Rain\Tpl();

	}

	public function wl_button($in_wl, $wl_name, $rm, $id, $wl_id){
		if (!$in_wl){

			$wls='';

			foreach($this -> wl_order as $wl_index){
				$wl=$this -> watchlists[$wl_index];
				$wls .= '<li><a href="#" class="add-watchlist" rel=\''.json_encode(array('rm' => $rm, 'id' => $id, 'wl' => $wl['id'])).'\'>'.$wl['name'].'</a></li>';
			}

			$rel=json_encode(array('rm' => $rm, 'id' => $id, 'wl' => $this -> wl_def));

$wl_btn= <<< BTN
<div class="btn-group pull-right" id="wl-btn-$id">
	<button type="button" class="btn btn-warning add-watchlist" rel='$rel'><i class="fa fa-star fa-lg"></i> Merkliste</button>
	<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown">
		<span class="caret"></span>
	</button>
	<ul class="dropdown-menu pull-right">
	$wls
	</ul>
</div>
BTN;

		}else{

			$rel=json_encode(array('rm' => $rm, 'id' => $id, 'wl' => $wl_id));

$wl_btn= <<< BTN
<div class="btn-group pull-right" id="wl-btn-$id">
	<button type="button" class="btn btn-warning add-watchlist disabled"><i class="fa fa-check"></i> In „ $wl_name “ </button>
	<button type="button" class="btn btn-default rm-watchlist" rel='$rel' id="wl-btn-rm-$id"><i class="fa fa-times"></i></button>
</div>
BTN;

		}

		return $wl_btn;
	}

	public function ct_button($in_ct, $rm, $id){

		$this -> rain -> assign('id', $id);
		$this -> rain -> assign('rm', $rm);
		if($rm){
			$this -> rain -> assign('rm', 'true');
		}else{
			$this -> rain -> assign('rm', 'false');
		}
		$this -> rain -> assign('in_ct', $in_ct);


		return $this -> rain -> draw('ui/ct_btn', true);
	}

	public function gvkt_line($gvkt_mak, $gvkt_ppn){

		if($gvkt_mak === NULL){
			$gvkt='';
		} else{

			if ($gvkt_ppn === NULL){
				$ppn=NULL;
			}else{
				$ppn=$gvkt_ppn;
			}

			if(preg_match('/^(.*?),\sIlns=(.*)/', $gvkt_mak, $m)){
				$mak=$m[1];
				$ilns=$m[2];
			}else{
				$mak=$gvkt_mak;
				$ilns=NULL;
			}

			$this -> rain -> assign( 'mak', $mak);
			$this -> rain -> assign( 'ilns', $ilns);
			$this -> rain -> assign( 'ppn', $ppn);

			return $this -> rain-> draw('ui/gvkt_line', true);
		}

		return $gvkt;

	}

	public function opac_btn($query){

		$opac_url=\Config\Config::$bibliotheken[$this -> isil]['opac'];

		if (!is_null($opac_url)){
			$url=sprintf($opac_url, $query);
			$this -> rain -> assign('url', $url);
			return $this -> rain -> draw('ui/opac_btn', true);
		}else{
			return NULL;
		}
	}

	public function rj_rm_btn($id){

		$this -> rain -> assign( 'id', $id);
		return $this -> rain -> draw('ui/rj_rm_btn', true);

	}

	public function ordertable($titles, $ci){

		$tit = array();
		foreach($titles as $t){
			$t = array(
				'titel' => $t->get('titel'),
				'lieft' => $ci[$t->getDirectly('_id')]['lieft'],
				'budget' => $ci[$t->getDirectly('_id')]['budget'],
				'selcode' => $ci[$t->getDirectly('_id')]['selcode'],
				'ssgnr' => $ci[$t->getDirectly('_id')]['ssgnr'],
				'gvkt' => $t->get('gvkt_mak'),
				'comment' => $ci[$t->getDirectly('_id')]['comment']
			);

			array_push($tit, $t);
		}

		$this -> rain -> assign('titles', $tit);
		return $this -> rain -> draw('ui/ordertable', true);

	}
}

?>