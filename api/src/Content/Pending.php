<?php

namespace Content;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Loads titles for the pending view.
 *
 * Class Pending
 * @package Content
 */
class Pending extends Content {

    /**
     * Loads titles for the pending view.
     *
     * @param $num int Page number
     * @param AuthToken $auth Token
     */
    public function __construct($num, AuthToken $auth) {

        $done = DB::getUserData('pending', $auth);

        $dn = array();

        foreach ($done as $d) {
            array_push($dn, $d['id']);
        }


        $query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$in' => $dn))));

        $t = DB::getTitleList($query, $num, $auth);
        $this->titlelist = $t['titlelist'];
        $this->total = $t['total'];

    }

}

?>
