<?php

namespace AJAX;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Removes a title from the rejected list.
 *
 * Class RemoveReject
 * @package AJAX
 */
class RemoveReject extends AJAXResponse {

    /**
     * Removes a title from the rejected list.
     *
     * @param $id string ID of the title
     * @param AuthToken $auth Token
     */
    public function __construct($id, AuthToken $auth) {

        $this->resp['id'] = NULL;

        if ($id === '') {
            $this->error('Unvollständige Daten');
            return;
        }

        $this->resp['id'] = $id;

        $title = DB::getTitleByID($id);

        if($title->getUser() !== $auth->getID()){
            $this->error('Sie haben keine Berechtigung diesen Titel zu bearbeiten.');
            return;
        }

        if ($title->getStatus() !== 'rejected') {
            $this->error('Dieser Titel wurde nicht abgelehnt!');
            return;
        }

        DB::upd(array('_id' => $id), array('$set' => array('status' => 'normal')), 'titles');

        $this->resp['success'] = true;
    }
}

?>
