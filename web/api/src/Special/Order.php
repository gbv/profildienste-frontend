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

        // nothing to do if there are no titles in the cart
        if (DB::getCartSize($auth) == 0) {
            return;
        }

        // get the titles from the db
        $query = array('$and' => array(array('user' => $auth->getID()), array('status' => 'cart')));
        $t = DB::getTitleList($query, NULL, $auth);
        $titles = $t['titlelist']->getTitles();

        $isil = DB::getUserData('isil', $auth);
        $config = Config::$bibliotheken[$isil];

        $d = DB::get(array('_id' => $auth->getID()),'users',array(), true);
        $defaults = $d['defaults'];

        if($config['advancedExport']){

          $iln = $config['ILN'];

          $base = $this->tempdir().'/';

          $reihen = array();

          foreach ($titles as $title){
            $reihe = $title->get('reihe');
            if(!isset($reihen[$reihe])){
              $reihen[$reihe] = $this->tempdir($base).'/';
            }
            $dir = $reihen[$reihe];

            $ppn = $title->get('ppn');

            $output = array(
              'ppn' => $ppn,
              'budget' => is_null($title->getBdg()) ? $defaults['budget'] : $title->getBdg(),
              'lieft' => is_null($title->getLft()) ? $defaults['lieft'] : $title->getLft(),
              'selcode' => is_null($title->getSelcode()) ? $defaults['selcode'] : $title->getSelcode(),
              'ssgnr' => is_null($title->getSSGNr()) ? $defaults['ssgnr'] : $title->getSSGNr(),
              'comment' => is_null($title->getComment()) ? '' : $title->getComment()
            );

            file_put_contents($dir.$ppn.'.json', json_encode($output, JSON_PRETTY_PRINT));
          }

          //upload
          foreach ($reihen as $reihe => $dir){
            $rdir = Config::$remote['basedir'].$iln.$reihe.'/return/';
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

          foreach ($titles as $title){
            $ppn = $title->get('ppn');

            $output = array(
                'ppn' => $ppn,
                'budget' => is_null($title->getBdg()) ? $defaults['budget'] : $title->getBdg(),
                'lieft' => is_null($title->getLft()) ? $defaults['lieft'] : $title->getLft(),
                'selcode' => is_null($title->getSelcode()) ? $defaults['selcode'] : $title->getSelcode(),
                'ssgnr' => is_null($title->getSSGNr()) ? $defaults['ssgnr'] : $title->getSSGNr(),
                'comment' => is_null($title->getComment()) ? '' : $title->getComment()
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

        foreach ($titles as $title) {
            $id = $title->getDirectly('_id');
            DB::upd(array('_id' => $id), array('$set' => array('status' => 'pending')), 'titles');
        }

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
