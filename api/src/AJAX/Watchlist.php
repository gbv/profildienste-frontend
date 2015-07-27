<?php

namespace AJAX;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Adds a title to a watchlist
 *
 * Class Watchlist
 * @package AJAX
 */
class Watchlist extends AJAXResponse {

    /**
     * Adds a title to a watchlist
     *
     * @param $id string ID of the title
     * @param $wl_id int ID of the watchlist
     * @param AuthToken $auth Token
     */
    public function __construct($id, $wl_id, AuthToken $auth) {

        $this->resp['content'] = NULL;
        $this->resp['id'] = NULL;
        $this->resp['wl'] = NULL;

        if ($id === '' || $wl_id === '') {
            $this->error('Unvollständige Daten');
            return;
        }

        $this->resp['id'] = $id;
        $this->resp['wl'] = $wl_id;

        $watchlists = DB::getUserData('watchlist', $auth);

        if (is_null($watchlists)) {
            $this->error('Es konnten keine Merklisten für einen Benutzer mit dieser ID gefunden werden.');
            return;
        }

        $wl = $watchlists[$wl_id]['list'];

        if (is_null($wl)) {
            $this->error('Keine Merkliste mit dieser ID gefunden.');
            return;
        }

        if (!in_array($id, $wl)) {
            array_push($wl, $id);
            $watchlists[$wl_id]['list'] = $wl;
            DB::upd(array('_id' => $auth->getID()), array('$set' => array('watchlist' => $watchlists)), 'users');
            $this->resp['content'] = count($wl);
            $this->resp['success'] = true;
        } else {
            $this->error('Dieser Titel befindet sich bereits in der Merkliste');
        }
    }
}

?>
