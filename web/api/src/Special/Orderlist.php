<?php

namespace Special;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Creates a list with basic information of all orders.
 *
 * Class Orderlist
 * @package Special
 */
class Orderlist {

    /**
     * @var array List of all orders
     */
    private $orderlist = array();

    /**
     * Creates a new Orderlist.
     *
     * @param $auth
     * @throws \Exception
     */
    public function __construct(AuthToken $auth) {

        $cart = DB::getUserData('cart', $auth);

        if (sizeof($cart) == 0) {
            throw new \Exception('Keine Titel im Warenkorb.');
        }


        $ct = array();
        $ci = array();

        foreach ($cart as $c) {
            array_push($ct, $c['id']);
            $ci[$c['id']] = $c;
        }


        $query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$in' => $ct))));

        $t = DB::getTitleList($query, NULL, $auth);
        $titlelist = $t['titlelist'];

        foreach ($titlelist->getTitles() as $tit) {
            $this->orderlist[] = array(
                'lieft' => $ci[$tit->getDirectly('_id')]['lieft'],
                'budget' => $ci[$tit->getDirectly('_id')]['budget'],
                'ssgnr' => $ci[$tit->getDirectly('_id')]['ssgnr'],
                'selcode' => $ci[$tit->getDirectly('_id')]['selcode'],
                'comment' => $ci[$tit->getDirectly('_id')]['comment'],
                'titel' => $tit->get('titel'),
                'gvkt' => $tit->get('gvkt_mak')
            );
        }
    }

    /**
     * Getter for the Orderlist
     *
     * @return array
     */
    public function getOrderlist() {
        return $this->orderlist;
    }
}

?>
