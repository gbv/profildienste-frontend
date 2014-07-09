<?php

	/*
		Global configuration file
	*/

namespace Config;

class Config {

	// Prevent direct instantiation and cloning
	private function __construct() { }
	private function __clone() { }

	/* --------------------------------------------
	Login-Configuration
	----------------------------------------------*/

	public static $cbs_url='cbs-4.gbv.de';
	public static $cbs_port=3790;

	/* --------------------------------------------
	Main Config
	----------------------------------------------*/

	public static $no_cover_path = 'assets/img/no-cover.png';

	// Path to the export directory
	public static $export_dir='export';

	public static $rain_config = array(
		'tpl_dir'		=> '/home/luka/Profildienst/template/',
		'cache_dir'		=> '/home/luka/Profildienst/cache/',
		'base_dir'		=> NULL,
		'auto_escape'	=> false,
		'debug'			=> true
	);

	public static $av_psizes = array(5,10,20,50,100);

	public static $av_order = array('desc', 'asc');
	public static $order_name = array('desc' => 'Absteigend' ,'asc' => 'Aufsteigend');

	public static $av_sortby = array('erj','wvn', 'tit', 'sgr', 'dbn', 'per');
	public static $sortby_name = array('erj' => 'Erscheinungsjahr' ,'wvn' => 'WV-Nummer', 'tit' => 'Titel', 'sgr' => 'Sachgruppe', 'dbn' => 'DNB-Nummer', 'per' => 'Person');

	public static $bibliotheken = array(
		'DE-01'	=> array('name' => 'Staatsbibliothek zu Berlin', 'dbsid' => '15.3', 'opac' => 'http://stabikat.staatsbibliothek-berlin.de/DB=1/LNG=DU/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=%s'),
		'DE-18'	=> array('name' => 'SUB Hamburg', 'dbsid' => '15.1', 'opac' => 'https://kataloge.uni-hamburg.de/DB=1/SET=5/TTL=1/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=%s'),
		'DE-35'	=> array('name' => 'GWLB Hannover', 'dbsid' => '15.5', 'opac' => 'http://opac.tib.uni-hannover.de/DB=3/LNG=DU/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=%s'),
		'DE-601'	=> array('name' => 'VZG Göttingen', 'dbsid' => '15.1', 'opac' => NULL),
		'DE-830'	=> array('name' => 'UB TU Hamburg-Harburg', 'dbsid' => '15.6', 'opac' => 'https://katalog.b.tu-harburg.de/DB=1/FKT=1016/FRM=/IMPLAND=Y/LNG=DU/SRT=YOP/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=%s'),
		'DE-84'	=> array('name' => 'UB TU Braunschweig', 'dbsid' => '16.1', 'opac' => 'https://opac.lbs-braunschweig.gbv.de/DB=1/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=%s'),
		'DE-89'	=> array('name' => 'TIB Hannover', 'dbsid' => '15.7', 'opac' => 'http://opac.tib.uni-hannover.de/DB=1/LNG=DU/CHARSET=utf-8/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=%s'),
		'DE-960'	=> array('name' => 'Bibliothek FH Hannover', 'dbsid' => '15.4', 'opac' => 'http://opac.tib.uni-hannover.de/DB=4/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=%s'),
		'DE-Wim2'	=> array('name' => 'UB BU Weimar', 'dbsid' => '15.9', 'opac' => 'http://opac.ub.uni-weimar.de/DB=1/LNG=DU/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=%s')
);

}


?>
