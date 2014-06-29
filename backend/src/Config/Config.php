<?php

/*
	Global configuration file
*/

namespace Config;

class Config {

	public static $import_dir = './import/';
	public static $import_ref_dir = './import_ref/';

	public static $update_dir = './update/';

	public static $aws_access = 'AKIAJ7PKU5XHAWG65IRQ';
	public static $aws_secret = '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';

	public static $opt = array(
		'safe'    => true,
		'fsync'   => true,
		'timeout' => 10000
	);

}
?>