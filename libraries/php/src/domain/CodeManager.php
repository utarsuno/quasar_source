<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-20
 * Time: 02:07
 */

namespace QuasarSource\Domain;

require_once '/quasar_source/libraries/php/autoload.php';

use QuasarSource\CodeAbstractions\File\Discrete\Docker\FileDockerCompose;
use QuasarSource\CodeAbstractions\FileManager;
use QuasarSource\DatabaseAbstractions\Postgres\PostgreSQLDoctrine;
use QuasarSource\Utilities\EchoUtilities as L;
use QuasarSource\Utilities\LocalConfigurations;

class CodeManager {

    private $configs;

    public function __construct() {
        $this->configs = new LocalConfigurations();

        $directory = FileManager::get_base_directory();

        $files = $directory->get_local_files_of_type(FileDockerCompose::class);

        foreach ($files as $file) {
            $file->clean();
            echo $file . PHP_EOL;
        }

    }

}

