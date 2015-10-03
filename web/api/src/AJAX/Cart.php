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
    public function __construct($id, AuthToken $auth) {

        $this->resp['content'] = NULL;
        $this->resp['id'] = NULL;
        $this->resp['price'] = array();
        $this->resp['order'] = array();

        // check if we got all the data we need
        if ($id === '') {
            $this->error('Unvollständige Daten');
            return;
        }

        /* needed later

        // insert defaults if needed
        $defaults = DB::getUserData('defaults', $auth);

        if ($selcode === '') {
            $selcode = $defaults['selcode'];
        }

        if ($ssgnr === '') {
            $ssgnr = $defaults['ssgnr'];
        }

        */

        // prepare part of response
        $this->resp['id'] = $id;

        $tit = DB::getTitleByID($id);

        if($tit->getUser() !== $auth->getID()){
            $this->error('Sie haben keine Berechtigung diesen Titel zu bearbeiten.');
            return;
        }

        if ($tit->getStatus() === 'cart') {
            $this->error('Dieser Titel befindet sich bereits im Warenkorb!');
            return;
        }

        $p = DB::getUserData('price', $auth);
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


        DB::upd(array('_id' => $id), array('$set' => array('status' => 'cart')), 'titles');

        $this->resp['content'] = DB::getCartSize($auth);
        $this->resp['success'] = true;

    }
}

?>
