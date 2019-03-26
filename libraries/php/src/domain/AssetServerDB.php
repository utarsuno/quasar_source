<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-20
 * Time: 02:07
 */

namespace QuasarSource\Domain;

require_once '/quasar_source/libraries/php/autoload.php';

use QuasarSource\DatabaseAbstractions\Postgres\PostgreSQLDoctrine;

class AssetServerDB {

    private $db;

    public function __construct() {
        $this->db = new PostgreSQLDoctrine('asset_server_db');
        $this->db->connect();
    }
}


