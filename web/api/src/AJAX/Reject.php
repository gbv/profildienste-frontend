<?php

namespace AJAX;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Rejects one or multiple titles.
 *
 * Class Reject
 * @package AJAX
 */
class Reject extends AJAXResponse {

    /**
     * Rejects the titles with the given IDs.
     *
     * @param array $ids The IDs
     * @param AuthToken $auth Token
     */
    public function __construct($ids, AuthToken $auth) {

        $this->resp['id'] = array();

        if ($ids == '') {
            $this->error('Unvollständige Daten');
            return;
        }

        $this->resp['id'] = $ids;

        $c = DB::getUserData('rejected', $auth);
        $cart = DB::getUserData('cart', $auth);
        $wls = DB::getUserData('watchlist', $auth);

        if (is_null($c) || is_null($cart) || is_null($wls)) {
            $this->error('Keine entsprechende Liste gefunden');
        }

        foreach ($ids as $id) {

            if ($this->in_cart($id, $cart) || $this->in_wl($id, $wls)) {
                $this->error('Sie können keinen Titel ausblenden, der sich in einer Merkliste oder im Warenkorb befindet!');
            } else {
                array_push($c, $id);
            }
        }

        DB::upd(array('_id' => $auth->getID()), array('$set' => array('rejected' => $c)), 'users');
        $this->resp['success'] = true;
    }

    /**
     * Checks if the title with the given id is in the cart.
     *
     * @param $id string ID
     * @param $cart array Cart
     * @return bool true if the item is in the cart
     */
    private function in_cart($id, $cart) {
        foreach ($cart as $c) {
            if ($c['id'] === $id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if the title with the given id is in any watchlist.
     *
     * @param $id string ID
     * @param $watchlists array Watchlists
     * @return bool true if the item is in a watchlist
     */
    private function in_wl($id, $watchlists) {
        foreach ($watchlists as $watchlist) {
            if (in_array($id, $watchlist['list'])) {
                return true;
            }
        }
        return false;
    }
}

?>
