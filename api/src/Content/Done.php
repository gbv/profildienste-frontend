<?php

namespace Content;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Loads titles which are marked as done.
 *
 * Class Done
 * @package Content
 */
class Done extends Content {


    /**
     * Loads titles which are marked as done.
     *
     * @param $num int Page Number
     * @param AuthToken $auth Token
     */
    public function __construct($num, AuthToken $auth) {

        $done = DB::getUserData('done', $auth);

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

