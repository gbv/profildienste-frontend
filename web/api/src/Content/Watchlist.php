<?php

namespace Content;

use Middleware\AuthToken;
use Profildienst\DB;

/**
 * Loads titles in a watchlist.
 *
 * Class Watchlist
 * @package Content
 */
class Watchlist extends Content {

    /**
     * Loads titles in a watchlist.
     *
     * @param $num int page number
     * @param $id int watchlist ID
     * @param AuthToken $auth Token
     */
    public function __construct($num, $id, AuthToken $auth) {

        $data = DB::get(array('_id' => $auth->getID()), 'users', array(), true);

        $watchlists = $data['watchlist'];

        if (isset($watchlists[$id])) {

            $list = $watchlists[$id]['list'];
            $query = array('$and' => array(array('XX01' => $auth->getID()), array('_id' => array('$in' => $list))));
            $t = DB::getTitleList($query, $num, $auth);
            $this->titlelist = $t['titlelist'];
            $this->total = $t['total'];

        }
    }

}

?>