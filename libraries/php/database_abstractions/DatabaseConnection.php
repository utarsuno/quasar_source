<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-20
 * Time: 01:26
 */

namespace database_abstractions;

interface DatabaseConnection {

    /**
     * Connect to the database, raise exception on failed connection.
     *
     * @return null
     */
    public function connect();

    /**
     * Terminate the connection to the database.
     *
     * @return null
     */
    public function terminate();

}
