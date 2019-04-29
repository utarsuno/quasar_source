<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-20
 * Time: 01:26
 */

namespace QuasarSource\DatabaseAbstractions;

interface DatabaseConnection {

    /**
     * Connect to the database, raise exception on failed connection.
     *
     * @return void
     */
    public function connect() : void;

    /**
     * Terminate the connection to the database.
     *
     * @return void
     */
    public function terminate() : void;

}
