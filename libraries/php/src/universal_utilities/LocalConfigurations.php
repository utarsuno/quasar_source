<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-20
 * Time: 01:34
 */

namespace QuasarSource\Utilities;
use QuasarSource\CodeAbstractions\FileManager;


class LocalConfigurations {

    protected const EXTENSION_YAML = '.yml';
    protected const PATH_BASE      = 'documentation_and_settings/';

    private $configs;
    private $services;

    function __construct() {
        $this->configs  = FileManager::get_file_contents(self::PATH_BASE . 'quasar_source' . self::EXTENSION_YAML);
        $this->services = FileManager::get_file_contents(self::PATH_BASE . 'services'      . self::EXTENSION_YAML);
    }

    public function get_secret(string $secret) : array {
        return $this->configs['secrets'][$secret];
    }

}

