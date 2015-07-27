<?php

namespace Profildienst;

use Middleware\AuthToken;

/**
 * Class TitleList
 * @package Profildienst
 */
class TitleList {

    /**
     * @var array Titles
     */
    private $titles;

    /**
     * @param array $titles Array of titles
     * @param AuthToken $auth Token
     */
    public function __construct(array $titles, AuthToken $auth) {

        $this->titles = $titles;

        $data = DB::get(array('_id' => $auth->getID()), 'users', array(), true);
        $watchlists = $data['watchlist'];
        $this->watchlists = $data['watchlist'];
        $cart = $data['cart'];
        $done = $data['done'];
        $defaults = $data['defaults'];
        $rejected = $data['rejected'];
        $pending = $data['pending'];

        $this->settings = $data['settings'];

        $this->def_lft = $defaults['lieft'];
        $this->def_bdg = $defaults['budget'];
        $this->def_selcode = $defaults['selcode'];
        $this->def_ssgnr = $defaults['ssgnr'];

        $this->bdgs = $data['budgets'];

        foreach ($watchlists as $watchlist) {
            foreach ($watchlist['list'] as $wl) {
                if (isset($this->titles[$wl])) {
                    $this->titles[$wl]->inWatchlist();
                    $this->titles[$wl]->setWlID($watchlist['id']);
                    $this->titles[$wl]->setWlName($watchlist['name']);
                }
            }
        }

        foreach ($cart as $c) {
            if (isset($this->titles[$c['id']])) {
                $this->titles[$c['id']]->inCart();
                $this->titles[$c['id']]->setLft($c['lieft']);
                $this->titles[$c['id']]->setBdg($c['budget']);
                $this->titles[$c['id']]->setSSGNr($c['ssgnr']);
                $this->titles[$c['id']]->setSelcode($c['selcode']);
                $this->titles[$c['id']]->setComment($c['comment']);
            }
        }


        foreach ($done as $d) {
            if (isset($this->titles[$d['id']])) {
                $this->titles[$d['id']]->setDone();
                $this->titles[$d['id']]->setLft($d['lieft']);
                $this->titles[$d['id']]->setBdg($d['budget']);
                $this->titles[$d['id']]->setSSGNr($d['ssgnr']);
                $this->titles[$d['id']]->setSelcode($d['selcode']);
                $this->titles[$d['id']]->setComment($d['comment']);
            }
        }

        foreach ($pending as $p) {
            if (isset($this->titles[$p['id']])) {
                $this->titles[$p['id']]->setDone();
                $this->titles[$p['id']]->setLft($p['lieft']);
                $this->titles[$p['id']]->setBdg($p['budget']);
                $this->titles[$p['id']]->setSSGNr($p['ssgnr']);
                $this->titles[$p['id']]->setSelcode($p['selcode']);
                $this->titles[$p['id']]->setComment($p['comment']);
            }
        }

        foreach ($rejected as $rj) {
            if (isset($this->titles[$rj])) {
                $this->titles[$rj]->setRejected();
            }
        }
    }

    /**
     * Getter for the titles
     *
     * @return Title[] Titles
     */
    public function getTitles() {
        return $this->titles;
    }

    /**
     * Number of titles in the list
     *
     * @return int number of titles
     */
    public function getCount() {
        return count($this->titles);
    }
}
?>
