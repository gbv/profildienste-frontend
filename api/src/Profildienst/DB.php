<?php

namespace Profildienst;
use Config\Config;
use Middleware\AuthToken;

/**
 * Connection to the Database (Singleton)
 *
 * Class DB
 * @package Profildienst
 */
class DB {

    // save the instance
    private static $m;
    private static $db;
    private static $opt = array(
        'safe' => true,
        'fsync' => true,
        'timeout' => 10000
    );

    // prevent direct instantiation
    private function __construct() {
    }

    // prevent cloning
    private function __clone() {
    }

    private static function init_db() {
        // create a new instance if we can't use a previous one
        if (!isset(self::$m)) {
            self::$m = new \MongoClient();
            self::$db = self::$m->selectDB('pd');
            if (!isset(self::$m)) {
                throw new \Exception('Connection failed');
            }
        }
    }

    public static function getUserData($v, AuthToken $auth) {
        if (!$c = DB::get(array('_id' => $auth->getID()), 'users', array($v => 1), true)) {
            die('Kein Benutzer unter der ID gefunden.');
        }
        return isset($c[$v]) ? $c[$v] : NULL;
    }

    public static function getTitleList($query, $skip, AuthToken $auth) {
        self::init_db();
        $collection = new \MongoCollection(self::$db, 'titles');
        $r = array();
        $cursor = $collection->find($query);
        $cnt = $cursor->count();
        $settings = self::getUserData('settings', $auth);
        if ($settings['order'] == 'asc') {
            $o = 1;
        } else {
            $o = -1;
        }
        $sortby = array('erj' => '011@.a', 'wvn' => '006U.0', 'tit' => '021A.a', 'sgr' => '045G.a', 'dbn' => '006L.0', 'per' => '028A.a');

        if (!is_null($skip)) {
            $lm = Config::$pagesize;
            $cursor = $cursor->skip($lm * $skip);
            $cursor = $cursor->limit($lm);
        }

        $cursor = $cursor->sort(array($sortby[$settings['sortby']] => $o));
        foreach ($cursor as $doc) {
            $t = new Title($doc);
            $id = $t->getDirectly('_id');
            $r[$id] = $t;
        }

        $ret = array('titlelist' => NULL, 'total' => $cnt);

        if (count($r) > 0) {
            $ret['titlelist'] = new TitleList($r, $auth);
        }

        return $ret;
    }

    public static function getTitle($query) {
        self::init_db();
        $collection = new \MongoCollection(self::$db, 'titles');
        $c = $collection->findOne($query);
        return $c ? new Title($c) : $c;
    }

    public static function getTitleByID($id) {
        self::init_db();
        $collection = new \MongoCollection(self::$db, 'titles');
        $query = array('_id' => $id);
        $c = $collection->findOne($query);
        return $c ? new Title($c) : $c;
    }

    public static function exists($query, $coll) {
        self::init_db();
        $collection = new \MongoCollection(self::$db, $coll);
        $c = $collection->findOne($query);
        return $c ? true : false;
    }

    public static function ins($data, $coll) {
        self::init_db();
        $collection = new \MongoCollection(self::$db, $coll);
        try {
            $collection->insert($data, self::$opt);
        } catch (\MongoCursorException $mce) {
            die('Error: ' . $mce);
        }
    }

    public static function get($query, $coll, $fields = array(), $findone = false) {
        self::init_db();
        $collection = new \MongoCollection(self::$db, $coll);
        if ($findone) {
            $c = $collection->findOne($query, $fields);
            return $c;
        } else {
            $c = $collection->find($query, $fields);
            $r = array();
            foreach ($c as $doc) {
                array_push($r, $doc);
            }
            return $r;
        }
    }

    public static function upd($cond, $data, $coll) {
        self::init_db();
        $collection = new \MongoCollection(self::$db, $coll);
        try {
            $collection->update($cond, $data, self::$opt);
        } catch (\MongoCursorException $mce) {
            die('Error: ' . $mce);
        }
    }
}

?>