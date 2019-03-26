<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-20
 * Time: 01:58
 */

namespace QuasarSource\DatabaseAbstractions\Postgres;

require_once '/quasar_source/libraries/php/autoload.php';

use QuasarSource\DatabaseAbstractions\DatabaseAbstraction;


class PostgreSQLConnection extends DatabaseAbstraction {

    protected function get_connection() {
        $connection = pg_connect("host={$this->db_host} dbname={$this->db_name} user={$this->db_username} password={$this->db_password}");
        if (!$this->db_connection) {
            die('Could not connect: ' . pg_last_error());
        }
        return $connection;
    }

}
