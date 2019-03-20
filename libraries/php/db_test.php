<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-16
 * Time: 00:00
 */

require_once 'vendor/autoload.php';

use domain\AssetServerDB;
use universal_utilities\LocalConfigurations;


$configs  = new LocalConfigurations();
$asset_db = new AssetServerDB($configs);





#$localIP = gethostbyname(trim(exec("hostname")));
#var_dump($localIP);




