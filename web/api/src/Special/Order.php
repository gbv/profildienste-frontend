<?php

namespace Special;

use Middleware\AuthToken;
use Profildienst\DB;
use Config\Config;

/**
 * Writes an order to a JSON file
 *
 * Class Order
 * @package Special
 */
class Order {

    /**
     * @var array Response to the client
     */
    private $resp;

    /**
     * Writes the cart to a JSON file and resets the cart.
     *
     * @param AuthToken $auth
     */
    public function __construct(AuthToken $auth) {

        $this->resp = array('success' => true, 'price' => NULL, 'cart' => NULL, 'watchlist' => NULL, 'errormsg' => '');

        //get cart
        $cart = DB::getUserData('cart', $auth);

        // nothing to do if there are no titles in the cart
        if (count($cart) == 0) {
            return;
        }

        $ct = array();
        $ci = array();
        foreach ($cart as $c) {
            array_push($ct, $c['id']);
            $ci[$c['id']] = $c;
        }

        // get the titles from the db
        $query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$in' => $ct))));
        $t = DB::getTitleList($query, NULL, $auth);
        $titles = $t['titlelist']->getTitles();

        foreach ($titles as $title){
          $ci[$title->getDirectly('_id')]['title'] = $title;
        }

        $isil = DB::getUserData('isil', $auth);
        $config = Config::$bibliotheken[$isil];

        if($config['advancedExport']){

          $iln = $config['ILN'];

          $base = $this->tempdir().'/';

          $reihen = array();

          foreach ($ci as $id => $entry){
            $reihe = $entry['title']->get('sachgruppe');
            if(!isset($reihen[$reihe])){
              $reihen[$reihe] = $this->tempdir($base).'/';
            }
            $dir = $reihen[$reihe];

            $ppn = $entry['title']->get('ppn');

            $output = array(
              'ppn' => $ppn,
              'budget' => $entry['budget'],
              'lieft' => $entry['lieft'],
              'selcode' => $entry['selcode'],
              'ssgnr' => $entry['ssgnr'],
              'comment' => $entry['comment']
            );

            file_put_contents($dir.$ppn.'.json', json_encode($output, JSON_PRETTY_PRINT));
          }

          //upload
          foreach ($reihen as $reihe => $dir){
            $rdir = Config::$remote['basedir'].'/'.$iln.$reihe.'/return/';
            $host = Config::$remote['user'].'@'.Config::$remote['host'].':'.$rdir;

            exec('rsync -azPi '.$dir.' '.$host.' 2>&1', $output, $ret);

            if($ret != 0){
              $this->resp['success'] = false;
              $this->resp['errormsg'] = 'Fehler bei der Datenübertragung!';
              return;
            }

          }

        }else{

          $dir = $this->tempdir().'/';

          foreach ($ci as $id => $entry){
            $ppn = $entry['title']->get('ppn');

            $output = array(
              'ppn' => $ppn,
              'budget' => $entry['budget'],
              'lieft' => $entry['lieft'],
              'selcode' => $entry['selcode'],
              'ssgnr' => $entry['ssgnr'],
              'comment' => $entry['comment']
            );

            file_put_contents($dir.$ppn.'.json', json_encode($output, JSON_PRETTY_PRINT));
          }

          $rdir = Config::$remote['basedir'].$config['exportDir'].'/return/';
          $host = Config::$remote['user'].'@'.Config::$remote['host'].':'.$rdir;

          exec('rsync -azPi '.$dir.' '.$host.' 2>&1', $output, $ret);

          if($ret != 0){
            $this->resp['success'] = false;
            $this->resp['errormsg'] = 'Fehler bei der Datenübertragung!';
            return;
          }

        }


        //update the database
        $p = DB::getUserData('price', $auth);

        $p['price'] = 0;
        $p['est'] = 0;
        $p['known'] = 0;

        DB::upd(array('_id' => $auth->getID()), array('$set' => array('price' => $p)), 'users');

        $d = DB::getUserData('pending', $auth);
        $d = array_merge($d, $cart);

        DB::upd(array('_id' => $auth->getID()), array('$set' => array('cart' => array(), 'pending' => $d)), 'users');

        $this->resp['cart'] = 0;
        $this->resp['price'] = $p;


    }
    
    private function tempdir($dir=false) {
      if($dir !== false){
        $tempfile=tempnam($dir,'pd_');
      }else{
        $tempfile=tempnam(sys_get_temp_dir(),'pd_');
      }
      if (file_exists($tempfile)) {
        unlink($tempfile);
      }
      mkdir($tempfile);
      if (is_dir($tempfile)) {
         return $tempfile;
      }
    }

    /**
     * Getter for the response
     *
     * @return array Response
     */
    public function getResponse() {
        return $this->resp;
    }

}

?>
