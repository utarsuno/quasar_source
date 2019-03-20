<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-20
 * Time: 01:58
 */

namespace database_abstractions;

class PostgreSQLConnection implements DatabaseConnection {

    private $host;
    private $db_name;
    private $username;
    private $password;
    private $connection;

    public function __construct(string $host, string $db_name, string $username, string $password) {
        $this->host     = $host;
        $this->db_name  = $db_name;
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * Connect to the database, raise exception on failed connection.
     *
     * @return null
     */
    public function connect() {
        $this->connection = pg_connect("host={$this->host} dbname={$this->db_name} user={$this->db_name} password={$this->password}");

        var_dump($this->connection);

        #$dbconn = pg_connect("host=postgres_server dbname=postgres user=postgres password=password")
#    or die('Could not connect: ' . pg_last_error());

        return null;
    }

    /**
     * Terminate the connection to the database.
     *
     * @return null
     */
    public function terminate()
    {
        // TODO: Implement terminate() method.

        return null;
    }
}
