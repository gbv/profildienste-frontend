<?php

namespace AJAX;

/**
 * Deletes all rejected titles from the view or the database.
 *
 * Class Delete
 * @package AJAX
 */
class Delete extends AJAXResponse {

    /**
     * Deletes all rejected titles
     */
    public function __construct() {

        $this->resp = array('success' => false, 'id' => NULL, 'errormsg' => '');

        $this->error('Diese Funktion steht noch nicht zur Verfügung!');

        /*Idee: 1) Abfragen der zugeordneten Referenten
        2) Löschen der eigenen Zuordnung
        -> wenn dann leer: löschen
        -> ansonsten update
        */

        //Vorlage: Ausblenden
    }
}

?>
