<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-20
 * Time: 02:07
 */

namespace domain;

require_once '/quasar_source/libraries/php/vendor/autoload.php';

use database_abstractions\PostgreSQLConnection;
use universal_utilities\LocalConfigurations;

class AssetServerDB {

    private $db;

    public function __construct(LocalConfigurations $configs) {
        $connection_info = $configs->get_secret('asset_server_db');
        $this->db        = new PostgreSQLConnection(
            $connection_info['host'],
            $connection_info['database'],
            $connection_info['username'],
            $connection_info['password']
        );
        $this->db->connect();
    }
}
