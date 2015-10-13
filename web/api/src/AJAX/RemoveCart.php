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
class RemoveCart extends AJAXResponse
{

    /**
     * Removes a title from the cart.
     *
     * @param $id
     * @param AuthToken $auth Token
     */
    public function __construct($id, AuthToken $auth)
    {


        $this->resp['content'] = NULL;
        $this->resp['id'] = NULL;
        $this->resp['price'] = array();

        if ($id === '') {
            $this->error('Unvollständige Daten');
            return;
        }

        $this->resp['id'] = $id;

        $tit = DB::getTitleByID($id);

        if ($tit->getUser() !== $auth->getID()) {
            $this->error('Sie haben keine Berechtigung diesen Titel zu bearbeiten.');
            return;
        }

        if ($tit->getStatus() !== 'cart') {
            $this->error('Dieser Titel befindet sich nicht im Warenkorb!');
            return;
        }


        $p = DB::getUserData('price', $auth);
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

        DB::upd(array('_id' => $id), array('$set' => array('status' => 'normal', 'lastStatusChange' => new \MongoDate())), 'titles');
        $this->resp['content'] = DB::getCartSize($auth);
        $this->resp['success'] = true;

    }
}

?>
