<?php

namespace AJAX;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Removes a title from the cart.
 *
 * Class RemoveCart
 * @package AJAX
 */
class RemoveCart extends AJAXResponse {

    /**
     * Removes a title from the cart.
     *
     * @param $id
     * @param AuthToken $auth Token
     */
    public function __construct($id, AuthToken $auth) {


        $this->resp['content'] = NULL;
        $this->resp['id'] = NULL;
        $this->resp['price'] = array();

        if ($id === '') {
            $this->error('Unvollständige Daten');
            return;
        }

        $this->resp['id'] = $id;

        $cart = DB::getUserData('cart', $auth);

        $ct = array();
        foreach ($cart as $c) {
            array_push($ct, $c['id']);
        }

        if (!in_array($id, $ct)) {
            $this->error('Dieser Titel befindet sich nicht im Warenkorb');
        } else {

            $p = DB::getUserData('price', $auth);

            $tit = DB::getTitleByID($id);
            $pr = $tit->getEURPrice();

            if (is_null($pr)) {
                // price was unknown
                $p['est'] = $p['est'] - 1;

                $mean = DB::get(array('_id' => 'mean'), 'data', array(), true);
                $pr = $mean['value'];

            } else {
                // price was known
                $p['known'] = $p['known'] - 1;
            }

            $p['price'] = $p['price'] - $pr;

            DB::upd(array('_id' => $auth->getID()), array('$set' => array('price' => $p)), 'users');

            $this->resp['price'] = $p;

            $occ = array_search($id, $ct);
            if (is_null($occ)) {
                $this->error('Der Titel konnte nicht entfernt werden');
            }

            $g = array();
            foreach ($cart as $c) {
                if ($c['id'] != $id) {
                    array_push($g, $c);
                }
            }

            DB::upd(array('_id' => $auth->getID()), array('$set' => array('cart' => $g)), 'users');
            $this->resp['content'] = count($g);
            $this->resp['success'] = true;
        }
    }
}

?>
