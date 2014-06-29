<?php

$prices = 0;
$count = 0;

$m = new MongoClient();
$db = $m->selectDB('pd');

$collection = new MongoCollection($db, 'titles');

$c = $collection->find(array(),array('004A' => 1));
foreach ($c as $doc){

	if(isset($doc['004A']['f'])){
		$p = $doc['004A']['f'];

		preg_match_all('/EUR (\d+.{0,1}\d{0,2})/', $p, $m);
		if(count($m) == 2 && count($m[1]) == 1){

			$prices+= floatval($m[1][0]);
			$count++;

			echo $doc['_id']." ok\n";
		}
	}
}

$mean = round(($prices / $count),2);


$data = new MongoCollection($db, 'data');
$d = array('_id' => 'mean', 'value' => $mean);
$gp = array('_id' => 'gprice', 'value' => $prices);
$gc = array('_id' => 'gcount', 'value' => $count);

$opt = array(
	'safe'    => true,
	'fsync'   => true,
	'timeout' => 10000
);


$cursor_price = $data->findOne(array('_id' => 'gprice'));
$cursor_count = $data->findOne(array('_id' => 'gcount'));


if(!is_null($cursor_price) && !is_null($cursor_count)){
	
	$opr = $cursor_price['value'];
	$ocnt = $cursor_count['value'];

	$mean = round((($opr + $prices) / ($ocnt + $count)),2);


	try {
		$data->update(array('_id' => 'gprice'), array('$set' => array('value' => ($opr + $prices))) , $opt);
		$data->update(array('_id' => 'gcount'), array('$set' => array('value' => ($ocnt + $count))) , $opt);
		$data->update(array('_id' => 'mean'), array('$set' => array('value' => $mean)) , $opt);

	}
	catch (\MongoCursorException $mce) {
			die("Error: ".$mce);
	}
	catch (\MongoCursorTimeoutException $mcte) {
			die("Timeout-Error: ".$mcte);
	}
	catch(\Exception $e){
		die('Fehler');
	}

}else{

	try {
		$res = $data->insert($d, $opt);
		$res = $data->insert($gp, $opt);
		$res = $data->insert($gc, $opt);
	}
	catch (MongoCursorException $mce) {
		echo "Error: ".$mce;
	}
	catch (MongoCursorTimeoutException $mcte) {
		echo "Timeout-Error: ".$mcte;
	}

}

echo "-------------------------------\n";
echo "Anzahl insgesamt: $count\n";
echo "Gesamtpreis: $prices\n";
echo "Durchschnittspreis: $mean\n";

?>