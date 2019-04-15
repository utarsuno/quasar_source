#!/usr/bin/env php
<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-14
 * Time: 15:04
 */

require_once '/quasar_source/libraries/php/autoload.php';

use Symfony\Component\Console\Application;
use QuasarSource\Command\MinifyCSSCommand;
use QuasarSource\Command\GZIPCommand;


$application = new Application();
$application->add(new MinifyCSSCommand());
$application->add(new GZIPCommand());
$application->run();

