<?php

namespace AJAX;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Adds a title to the cart.
 * @package AJAX
 */
class Cart extends AJAXResponse {

    /**
     * Puts a title in the cart
     *
     * @param $id string ID of the title
     * @param $lft string Lieferant
     * @param $bdg string Budget
     * @param $selcode string Selektionscode
     * @param $ssgnr string SSG-Nr.
     * @param $comment string Kommentar
     * @param AuthToken $auth Token
     */
    public function __construct($id, $lft, $bdg, $selcode, $ssgnr, $comment, AuthToken $auth) {

        $this->resp['content'] = NULL;
        $this->resp['id'] = NULL;
        $this->resp['price'] = array();
        $this->resp['order'] = array();

        // check if we got all the data we need
        if ($id === '' || $lft === '' || $bdg === '') {
            $this->error('Unvollständige Daten');
            return;
        }

        // insert defaults if needed
        $defaults = DB::getUserData('defaults', $auth);

        if ($selcode === '') {
            $selcode = $defaults['selcode'];
        }

        if ($ssgnr === '') {
            $ssgnr = $defaults['ssgnr'];
        }

        // prepare part of response
        $this->resp['id'] = $id;

        $this->resp['order'] = array(
            'lft' => $lft,
            'budget' => $bdg,
            'ssgnr' => $ssgnr,
            'selcode' => $selcode,
            'comment' => $comment
        );

        //insert title into cart
        $c = DB::getUserData('cart', $auth);

        if (is_null($c)) {
            $this->error('Kein Warenkorb für diesen Nutzer gefunden');
            return;
        }

        $ni = array('id' => $id, 'budget' => $bdg, 'lieft' => $lft, 'selcode' => $selcode, 'ssgnr' => $ssgnr, 'comment' => $comment);

        if ($this->in_cart($ni, $c)) {
            $this->error('Dieser Titel befindet sich bereits im Warenkorb!');
            return;
        } else {

            $p = DB::getUserData('price', $auth);

            $tit = DB::getTitleByID($id);

            $pr = $tit->getEURPrice();


            if (is_null($pr)) {
                // price is unknown
                $p['est'] = $p['est'] + 1;

                $mean = DB::get(array('_id' => 'mean'), 'data', array(), true);
                $pr = $mean['value'];

            } else {
                // we know the price
                $p['known'] = $p['known'] + 1;
            }

            $p['price'] = $p['price'] + $pr;

            //update the total price for the whole cart
            DB::upd(array('_id' => $auth->getID()), array('$set' => array('price' => $p)), 'users');

            // insert updated price into response
            $p['price'] = number_format($p['price'], 2, '.', '');
            $this->resp['price'] = $p;

            // update the cart
            array_push($c, $ni);
            DB::upd(array('_id' => $auth->getID()), array('$set' => array('cart' => $c)), 'users');

            $this->resp['content'] = sizeof($c);
            $this->resp['success'] = true;
        }
    }

    /**
     * Checks if the item is in the cart
     *
     * @param $item string Item
     * @param $cart array Cart
     * @return bool true if the item is in the cart
     */
    private function in_cart($item, $cart) {
        foreach ($cart as $c) {
            if ($c['id'] == $item['id']) {
                return true;
            }
        }
        return false;
    }

}

?>
