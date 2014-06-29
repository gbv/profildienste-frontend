<?php

namespace Profildienst;

class Output{

	private $titles;
	private $show_prev;
	private $show_next;
	private $num;
	private $pageloader_url;
	private $act_ct_remove;
	private $act_wl_remove;
	private $def_lft;
	private $def_bdg;
	private $bdgs;
	private $ui;
	private $watchlists;
	private $xt_controls;
	private $allow_cmt;
	private $show_inputs;
	private $rain;
	private $settings;

	public function __construct($tit, $show_prev , $show_next, $num, $plurl ,$act_ct_remove=false, $act_wl_remove=false, $xt_controls = true, $allow_cmt = true, $show_inputs = true){

		$this -> titles = $tit;
		$this -> show_prev = $show_prev;
		$this -> show_next = $show_next;
		$this -> num = $num;
		$this -> pageloader_url = $plurl;
		$this -> act_ct_remove = $act_ct_remove;
		$this -> act_wl_remove = $act_wl_remove;
		$this -> xt_controls = $xt_controls;
		$this -> allow_cmt = $allow_cmt;
		$this -> show_inputs = $show_inputs;
		$this -> ui = new UI();
		\Rain\Tpl::configure(\Config\Config::$rain_config);
		$this -> rain = new \Rain\Tpl();

		$data=DB::get(array('_id' => $_SESSION['id']),'users',array(), true);
		$watchlists=$data['watchlist'];
		$this -> watchlists=$data['watchlist'];
		$cart=$data['cart'];	
		$done=$data['done'];
		$defaults=$data['defaults'];
		$rejected=$data['rejected'];
		$pending=$data['pending'];

		$this -> settings = $data['settings'];

		$this -> def_lft = $defaults['lieft'];
		$this -> def_bdg = $defaults['budget'];
		$this -> def_selcode = $defaults['selcode'];
		$this -> def_ssgnr = $defaults['ssgnr'];

		$this -> bdgs = $data['budgets'];

		foreach ($watchlists as $watchlist){
			foreach($watchlist['list'] as $wl){
				if(isset($this -> titles[$wl])){
					$this -> titles[$wl] -> inWatchlist();
					$this -> titles[$wl] -> setWlID($watchlist['id']);
				}
			}
		}

		foreach ($cart as $c){
			if(isset($this -> titles[$c['id']])){
				$this -> titles[$c['id']] -> inCart();
				$this -> titles[$c['id']] -> setLft($c['lieft']);
				$this -> titles[$c['id']] -> setBdg($c['budget']);
				$this -> titles[$c['id']] -> setSSGNr($c['ssgnr']);
				$this -> titles[$c['id']] -> setSelcode($c['selcode']);
				$this -> titles[$c['id']] -> setComment($c['comment']);
			}
		}


		foreach ($done as $d){
			if(isset($this -> titles[$d['id']])){
				$this -> titles[$d['id']] -> setDone();
				$this -> titles[$d['id']] -> setLft($d['lieft']);
				$this -> titles[$d['id']] -> setBdg($d['budget']);
				$this -> titles[$d['id']] -> setSSGNr($d['ssgnr']);
				$this -> titles[$d['id']] -> setSelcode($d['selcode']);
				$this -> titles[$d['id']] -> setComment($d['comment']);
			}
		}

		foreach ($pending as $p){
			if(isset($this -> titles[$p['id']])){
				$this -> titles[$p['id']] -> setDone();
				$this -> titles[$p['id']] -> setLft($p['lieft']);
				$this -> titles[$p['id']] -> setBdg($p['budget']);
				$this -> titles[$p['id']] -> setSSGNr($p['ssgnr']);
				$this -> titles[$p['id']] -> setSelcode($p['selcode']);
				$this -> titles[$p['id']] -> setComment($p['comment']);
			}
		}

		foreach ($rejected as $rj){
			if(isset($this -> titles[$rj])){
				$this -> titles[$rj] -> setRejected();
			}
		}
	}

	public function output(){
		$settings = $this -> settings;

		// Einstellungsleiste

		$this -> rain -> assign('sel_pos',$this -> xt_controls);

		// Seitengrößen
		$psizes = array();
		foreach(\Config\Config::$av_psizes as $ps){
			array_push($psizes, array(
				'size' => $ps,
				'rel' => json_encode(array('type' => 'pagesize', 'value' => $ps))
			));
		}

		$this -> rain -> assign(array('psize' => $settings['pagesize'], 'psizes' => $psizes));

		//Reihenfolge
		$order = array();
		foreach(\Config\Config::$av_order as $ord){
			array_push($order, array(
				'ordername' => \Config\Config::$order_name[$ord],
				'ord' => $ord,
				'rel' => json_encode(array('type' => 'order', 'value' => $ord))
			));
		}

		$this -> rain -> assign(array(
			'sel_ordername' => \Config\Config::$order_name[$settings['order']],
			'sel_order' => $settings['order'],
			'order' => $order
		));

		//Kriterium
		$sortby = array();
		foreach(\Config\Config::$av_sortby as $sort){
			array_push($sortby, array(
				'sortname' => \Config\Config::$sortby_name[$sort],
				'sort' => $sort,
				'rel' => json_encode(array('type' => 'sortby', 'value' => $sort))
			));
		}

		$this -> rain -> assign(array(
			'sel_sortbyname' => \Config\Config::$sortby_name[$settings['sortby']],
			'sel_sortby' => $settings['sortby'],
			'sortby' => $sortby
		));

		//Liste
		
		$list = array();
		foreach ($this -> titles as $t) {
			$tit=$t->get('titel');
			array_push($list,$this -> output_title($t));
		}

		$this -> rain -> assign('list', $list);

		$this -> rain -> assign('url', $this -> pageloader_url);

		return $this -> rain -> draw('view/output', true);
	}


	public function titleOutput(){

		$list = array();
		foreach ($this -> titles as $t) {
			$tit=$t->get('titel');
			array_push($list,$this -> output_title($t));
		}
		return $list;
	}

	private function output_title($t){

		$n=$t->getDirectly('_id');
	
		if(!$t -> is_Done() && !$t -> is_Rejected()){
			
			$wl_name = isset($this -> watchlists[$t -> getWlID()]['name']) ? $this -> watchlists[$t -> getWlID()]['name'] : NULL;
			$btn_2 = $this -> ui -> wl_button($t -> is_inWatchlist(), $wl_name , $this -> act_wl_remove, $n, $t -> getWlID());
			$btn_1=$this -> ui -> ct_button($t -> is_inCart(), $this -> act_wl_remove, $n);

		}

		if($t -> is_Rejected()){
			$btn_1  = '';
			$btn_2  = $this -> ui -> rj_rm_btn($n);
		}

		//Status
		$this -> rain -> assign( 'isDone', $t -> is_Done());
		$this -> rain -> assign( 'isRejected', $t -> is_Rejected());
		$this -> rain -> assign( 'allow_cmt', $this -> allow_cmt);
		
		// Allgemeine Informationen
		$this -> rain -> assign( 'id', $t->getDirectly('_id'));
		$this -> rain -> assign( 'titel', $t -> get('titel'));
		$this -> rain -> assign( 'untertitel', $t -> get('untertitel'));
		$this -> rain -> assign( 'verfasser', $t -> get('verfasser'));
		$this -> rain -> assign( 'verlag', $t -> get('verlag'));
		$this -> rain -> assign( 'ersch_termin', $t -> get('voraus_ersch_termin'));
		$this -> rain -> assign( 'ersch_jahr', $t -> get('erscheinungsjahr'));
		$this -> rain -> assign( 'gattung', $t -> get('gattung'));
		$this -> rain -> assign( 'dnb_nummer', $t -> get('dnb_nummer'));
		$this -> rain -> assign( 'wv_dnb', $t -> get('wv_dnb'));
		$this -> rain -> assign( 'sachgruppe', $t->get('sachgruppe'));
		
		// Bestimmung der ISBN
		if($t->get('isbn13') !== NULL){
			$isbn=$t->get('isbn13');
		}else{
			$isbn=$t->get('isbn10');
		}

		$this -> rain -> assign( 'isbn', $isbn);

		//Generierung der Liste der zugeordneten Referenten
		$refs='';
		$refs_arr=$t->getDirectly('XX00');
		foreach($refs_arr as $r){
			$k = isset($r['e']) ? $r['e'] : NULL;
			$refs.=' '.$k.',';
		}

		$refs=substr($refs, 0, strlen($refs)-1);
		$this -> rain -> assign( 'refs', $refs);

		//GVK-Treffer
		$gvkt=$this -> ui -> gvkt_line($t->get('gvkt_mak'), $t->get('gvkt_ppn'));
		$this -> rain -> assign( 'gvkt', $gvkt);

		// Cover
		if(is_null($t -> getDirectly('XX02')) || !$t -> getDirectly('XX02')){
			$has_cover = false;
		}else{
			$has_cover = true;
			$cover = $t -> getDirectly('XX02');
			
			$this -> rain -> assign( 'cover_md', $cover['md']);
			$this -> rain -> assign( 'cover_lg', $cover['lg']);
		}

		$this -> rain -> assign( 'has_cover', $has_cover);


		//Kontrolle der angezeigten Steuerelemente
		$this -> rain -> assign( 'inputs', $this -> show_inputs); // Lieferant, Budget, etc. anzeigen

		//Budgetinformationen
		$this -> rain -> assign( 'bdgs', $this -> bdgs); 
		$this -> rain -> assign( 'bdg', $t -> getBdg()); 
		$this -> rain -> assign( 'def_bdg', $this -> def_bdg); 
		// Lieferanteninformationen
		$this -> rain -> assign( 'lft', $t -> getLft()); 
		$this -> rain -> assign( 'def_lft', $this -> def_lft); 
		//Kommentar
		$this -> rain -> assign( 'comment', $t -> getComment()); 

		//SSG und Selcode
		$this -> rain -> assign( 'ssgnr', $t -> getSSGNr()); 
		$this -> rain -> assign( 'def_ssgnr', $this -> def_ssgnr); 

		$this -> rain -> assign( 'selcode', $t -> getSelcode()); 
		$this -> rain -> assign( 'def_selcode', $this -> def_selcode); 

		//Button für Zusätzliche Informationen
		$this -> rain -> assign( 'add_inf', $t->get('addr_erg_ang_url')); 
		$this -> rain -> assign( 'addr_erg_ang_mime', $t->get('addr_erg_ang_mime')); 

		//OPAC-Button
		$btn_opac = $this -> ui -> opac_btn($t -> get('titel').' '.$t -> get('verfasser_vorname').' '.$t -> get('verfasser_nachname'));
		$this -> rain -> assign( 'btn_opac', $btn_opac); 

		//Sollen Steuerelemente für Selektieren und Ablehnen angezeigt werden?
		$this -> rain -> assign( 'xt_controls', $this -> xt_controls); 
		
		// Allgemeine Buttons (Warenkorb, Merkliste, Ablehnen etc.)
		$this -> rain -> assign( 'btn_1', $btn_1); 
		$this -> rain -> assign( 'btn_2', $btn_2); 

		//Preis und Preiskommentar
		$this -> rain -> assign( 'price', $t->get('lieferbedingungen_preis'));
		$this -> rain -> assign( 'price_com', $t->get('kommentar_lieferbedingungen_preis'));
	
		return $this -> rain->draw('ui/dataset', true);
	}

}
?>