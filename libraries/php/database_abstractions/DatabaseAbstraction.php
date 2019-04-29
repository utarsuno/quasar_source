<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 13:20
 */

// -------------------------------------------- //
namespace QuasarSource\DatabaseAbstractions;    //
// -------------------------------------------- //
use QuasarSource\Utilities\LocalConfigurations; //
// -------------------------------------------- //

abstract class DatabaseAbstraction implements DatabaseConnection {

    protected $db_host;
    protected $db_name;
    protected $db_username;
    protected $db_password;
    protected $db_connection;

    public function __construct(string $config_secret_key) {
        $configs            = new LocalConfigurations();
        $connection_configs = $configs->get_secret($config_secret_key);
        $this->db_host      = $connection_configs['host'];
        $this->db_name      = $connection_configs['database'];
        $this->db_username  = $connection_configs['username'];
        $this->db_password  = $connection_configs['password'];
    }

    /**
     * Connect to the database, raise exception on failed connection.
     *
     * @return void
     */
    public function connect() : void {
        $this->db_connection = $this->get_connection();
    }

    /**
     * Terminate the connection to the database.
     *
     * @return void
     */
    public function terminate() : void {
    }

    abstract protected function get_connection();

}
