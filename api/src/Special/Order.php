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

        $cart = DB::getUserData('cart', $auth);

        if (count($cart) == 0) {
            return;
        }

        $ct = array();
        $ci = array();

        foreach ($cart as $c) {
            array_push($ct, $c['id']);
            $ci[$c['id']] = $c;
        }


        $query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$in' => $ct))));

        $t = DB::getTitleList($query, NULL, $auth);

        $titles = $t['titlelist']->getTitles();

        $output_titles = array();
        foreach ($titles as $tit) {

            $a = array(
                'lieft' => $ci[$tit->getDirectly('_id')]['lieft'],
                'budget' => $ci[$tit->getDirectly('_id')]['budget'],
                'ssgnr' => $ci[$tit->getDirectly('_id')]['ssgnr'],
                'selcode' => $ci[$tit->getDirectly('_id')]['selcode'],
                'comment' => $ci[$tit->getDirectly('_id')]['comment'],
                'titel' => $tit->export());

            array_push($output_titles, $a);
        }

        $isil = DB::getUserData('isil', $auth);

        $output = array(
            'bib' => Config::$bibliotheken[$isil],
            'best_name' => $auth->getName(),
            'best_id' => $auth->getID(),
            'isil' => $isil,
            'datum' => time(),
            'titel' => $output_titles
        );

        $path = Config::$export_dir . '/' . $isil . '/';
        $filename = time() . '_' . $auth->getID() . '.json';

        if (!is_dir($path)) {
            try {
                mkdir($path);
            } catch (\Exception $e) {
                $this->resp['success'] = false;
                $this->resp['errormsg'] = 'Verzeichnis konnte nicht angelegt werden.';
                return;
            }

        }

        $h = NULL;
        try {
            $h = fopen($path . $filename, 'w+');
        } catch (\Exception $e) {
            $this->resp['success'] = false;
            $this->resp['errormsg'] = 'Datei konnte nicht angelegt werden.';
            return;
        }

        if($this->resp['success'])
        // Hier JSON_PRETTY_PRINT falls nötig
        if ( fwrite($h, json_encode($output)) === NULL) {
            $this->resp['success'] = false;
        }

        if ($this->resp['success']) {

            $p = DB::getUserData('price', $auth);

            $p['price'] = 0;
            $p['est'] = 0;
            $p['known'] = 0;

            DB::upd(array('_id' => $auth->getID()), array('$set' => array('price' => $p)), 'users');

            $d = DB::getUserData('pending', $auth);
            $d = array_merge($d, $cart);

            DB::upd(array('_id' => $auth->getID()), array('$set' => array('cart' => array(), 'pending' => $d)), 'users');

            $watchlists = DB::getUserData('watchlist', $auth);

            foreach ($titles as $tit) {
                $id = $tit->getDirectly('_id');
                $wl_id = $this->in_wl($id, $watchlists);
                if ($wl_id === NULL) {
                    continue;
                }
                $wl = $watchlists[$wl_id]['list'];
                $occ = array_search($id, $wl);
                $f = array_slice($wl, 0, $occ);
                $s = array_slice($wl, ($occ + 1), count($wl));
                $watchlists[$wl_id]['list'] = array_merge($f, $s);
            }

            DB::upd(array('_id' => $auth->getID()), array('$set' => array('watchlist' => $watchlists)), 'users');

            //include new cart, new price and new watchlist status in the response
            $this->resp['cart'] = 0;
            $this->resp['price'] = $p;

            // get watchlists
            $d = DB::get(array('_id' => $auth->getID()),'users',array(), true);

            $wl_order = DB::getUserData('wl_order', $auth);

            $wl = array();
            foreach($wl_order as $index){
                $watchlists[$index]['count'] = count($watchlists[$index]['list']);
                $wl[] = array('id' => $watchlists[$index]['id'], 'name' => $watchlists[$index]['name'], 'count' => count($watchlists[$index]['list']));
            }

            $data = array(
                'watchlists' => $wl,
                'def_wl' => $d['wl_default']
            );

            $this->resp['watchlists'] = $data;

        }
    }

    /**
     * Checks if the title with the id is in a watchlist.
     *
     * @param $id string ID
     * @param $watchlists array Watchlists
     * @return int|null If the title is in a watchlist this function returns the id of the watchlist.
     */
    private function in_wl($id, $watchlists) {
        foreach ($watchlists as $watchlist) {
            if (in_array($id, $watchlist['list'])) {
                return $watchlist['id'];
            }
        }
        return NULL;
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