<?php

require 'vendor/autoload.php';

$key = "example_key";
$token = array(
  'iss' => 'http://online-profildienst.gbv.de',
  'aud' => 'http://online-profildienst.gbv.de',
  'sub' => 'TESTUSER',
  'pd_id' => '6909',
  'pd_isil' => 'bla',
  'iat' => time(),
  'exp' => time() + (60*60)
);

$jwt = JWT::encode($token, $key);


echo $jwt;


$decoded = JWT::decode($jwt, $key);

print_r($decoded);

/*
 NOTE: This will now be an object instead of an associative array. To get
 an associative array, you will need to cast it as such:
*/

$decoded_array = (array) $decoded;

?>