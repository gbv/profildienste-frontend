<?php

namespace Content;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Loads titles from the cart
 *
 * Class Cart
 * @package Content
 */
class Cart extends Content {


    /**
     * Loads titles from the cart
     *
     * @param $num int Page number
     * @param $auth AuthToken Token
     */
    public function __construct($num, AuthToken $auth) {

        $cart = \Profildienst\DB::getUserData('cart', $auth);
        $ct = array();

        foreach ($cart as $c) {
            array_push($ct, $c['id']);
        }

        $query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$in' => $ct))));

        $t = DB::getTitleList($query, $num, $auth);
        $this->titlelist = $t['titlelist'];
        $this->total = $t['total'];
    }
}


?>