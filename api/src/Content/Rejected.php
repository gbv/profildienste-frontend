<?php

namespace Content;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Loads rejected titles.
 *
 * Class Rejected
 * @package Content
 */
class Rejected extends Content {

    /**
     * Loads rejected titles.
     *
     * @param $num int page number
     * @param $auth AuthToken Token
     */
    public function __construct($num, AuthToken $auth) {

        $rj = DB::getUserData('rejected', $auth);

        $query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$in' => $rj))));

        $t = DB::getTitleList($query, $num, $auth);
        $this->titlelist = $t['titlelist'];
        $this->total = $t['total'];
    }

}

?>