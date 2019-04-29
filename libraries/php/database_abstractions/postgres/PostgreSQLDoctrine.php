<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-20
 * Time: 01:58
 */

namespace QuasarSource\DatabaseAbstractions\Postgres;

use Doctrine\DBAL\DBALException;
use QuasarSource\DatabaseAbstractions\DatabaseAbstraction;
use \Doctrine\DBAL\DriverManager;
use \Doctrine\DBAL\Configuration;


class PostgreSQLDoctrine extends DatabaseAbstraction {

    protected function get_connection() {
        try {
            return DriverManager::getConnection(
                [
                    'dbname'   => $this->db_name,
                    'user'     => $this->db_username,
                    'password' => $this->db_password,
                    'host'     => $this->db_host,
                    'driver'   => 'pdo_pgsql'
                ],
                new Configuration()
            );
        } catch (DBALException $e) {
            return null;
        }
    }

}
