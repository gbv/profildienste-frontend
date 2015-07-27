<?php

namespace Content;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Loads title from the Main view.
 *
 * Class Main
 * @package Content
 */
class Main extends Content {

    /**
     * Loads title from the Main view.
     *
     * @param $num int Page number
     * @param AuthToken $auth Token
     */
    public function __construct($num, AuthToken $auth) {

        $cart = DB::getUserData('cart', $auth);
        $ct = array();
        foreach ($cart as $c) {
            array_push($ct, $c['id']);
        }

        $done = DB::getUserData('done', $auth);
        $dn = array();
        foreach ($done as $d) {
            array_push($dn, $d['id']);
        }

        $pending = DB::getUserData('pending', $auth);
        $pn = array();
        foreach ($pending as $p) {
            array_push($pn, $p['id']);
        }

        $rj = DB::getUserData('rejected', $auth);

        $query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$nin' => $ct)), array('_id' => array('$nin' => $dn)), array('_id' => array('$nin' => $rj)), array('_id' => array('$nin' => $pn))));


        $t = DB::getTitleList($query, $num, $auth);
        $this->titlelist = $t['titlelist'];
        $this->total = $t['total'];
    }
}

?>
