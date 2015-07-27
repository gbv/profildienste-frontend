<?php

namespace AJAX;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Removes a title from a watchlist.
 *
 * Class RemoveWatchlist
 * @package AJAX
 */
class RemoveWatchlist extends AJAXResponse {

    /**
     * Removes a title from a watchlist.
     *
     * @param $id string ID of the title
     * @param $wl_id int ID of the watchlist
     * @param AuthToken $auth Token
     */
    public function __construct($id, $wl_id, AuthToken $auth) {

        $this->resp['content'] = NULL;
        $this->resp['id'] = NULL;
        $this->resp['wl'] = NULL;

        if ($id == '' || $wl_id == '') {
            $this->error('Unvollständige Daten');
            return;
        }

        $this->resp['id'] = $id;
        $this->resp['wl'] = $wl_id;

        $watchlists = DB::getUserData('watchlist', $auth);
        if ($watchlists === NULL) {
            $this->error('Es konnten keine Merklisten für einen Benutzer mit dieser ID gefunden werden.');
            return;
        }

        $wl = $watchlists[$wl_id]['list'];

        if ($wl === NULL) {
            $this->error('Keine Merkliste mit dieser ID gefunden.');
            return;
        }

        if (!in_array($id, $wl)) {
            $this->error('Dieser Titel befindet sich nicht in der Merkliste!');
        } else {
            // remove from the array
            $occ = array_search($id, $wl);
            if (is_null($occ)) {
                $this->error('Der Titel konnte nicht entfernt werden!');
            }
            $f = array_slice($wl, 0, $occ);
            $s = array_slice($wl, ($occ + 1), count($wl));
            $g = array_merge($f, $s);

            $watchlists[$wl_id]['list'] = $g;

            DB::upd(array('_id' => $auth->getID()), array('$set' => array('watchlist' => $watchlists)), 'users');
            $this->resp['content'] = count($g);
            $this->resp['success'] = true;
        }

    }
}

?>
