<?php
/**
 * Created by PhpStorm.
 * User: luca
 * Date: 13.10.15
 * Time: 23:28
 */

namespace AJAX\Changers;


use Profildienst\DB;
use Profildienst\TitleList;

class CollectionStatusChanger{

    public static function changeStatusOfCollection(array $ids, $to, $auth){

        $query = array(
            '$and' => array(
                array('user' => $auth->getID()),
                array('_id' => array('$in' => $ids))
            )
        );

        $set =  array(
            '$set' => array(
                'status' => $to,
                'lastStatusChange' => new \MongoDate()
            )
        );

        DB::upd($query, $set, 'titles', array('multiple' => true));
    }

    public static function changeStatusOfView($from, $to, $auth){

        $query = array(
            '$and' => array(
                array('user' => $auth->getID()),
                array('status' => $from)
            )
        );

        $set =  array(
            '$set' => array(
                'status' => $to,
                'lastStatusChange' => new \MongoDate()
            )
        );

        DB::upd($query, $set, 'titles', array('multiple' => true));

    }


}