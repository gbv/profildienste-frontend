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

        foreach ($ids as $id) {

            $title = DB::getTitleByID($id);

            if($title->getUser() !== $auth->getID()){
                $this->error('Sie haben keine Berechtigung diesen Titel zu bearbeiten.');
                return;
            }

            if ($title->getStatus() !== 'normal' || $title->isInWatchlist()) {
                $this->error('Sie können keinen Titel ausblenden, der sich in einer Merkliste oder im Warenkorb befindet!');
                return;
            }

            DB::upd(array('_id' => $id), array('$set' => array('status' => 'rejected')), 'titles');
        }

        $this->resp['success'] = true;
    }
}

?>
