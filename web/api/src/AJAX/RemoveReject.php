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

        $rejected = DB::getUserData('rejected', $auth);

        if ($rejected === NULL) {
            $this->error('Es konnten keine Liste für einen Benutzer mit dieser ID gefunden werden.');
        }

        if (!in_array($id, $rejected)) {
            $this->error('Dieser Titel wurde nicht abgelehnt');
        } else {
            // remove from the array
            $occ = array_search($id, $rejected);
            if (is_null($occ)) {
                $this->error('Der Titel konnte nicht entfernt werden!');
            }

            $f = array_slice($rejected, 0, $occ);
            $s = array_slice($rejected, ($occ + 1), count($rejected));
            $g = array_merge($f, $s);

            DB::upd(array('_id' => $auth->getID()), array('$set' => array('rejected' => $g)), 'users');
            $this->resp['success'] = true;
        }
    }
}

?>
