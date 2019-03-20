<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-20
 * Time: 01:34
 */

namespace universal_utilities;

use Symfony\Component\Yaml\Yaml;

require_once '/quasar_source/libraries/php/vendor/autoload.php';


class LocalConfigurations {

    const EXTENSION_YAML = '.yml';
    const PATH_BASE      = '/quasar_source/documentation_and_settings/';
    const PATH_CONFIGS   = self::PATH_BASE . 'quasar_source' . self::EXTENSION_YAML;
    const PATH_SERVICES  = self::PATH_BASE . 'services'      . self::EXTENSION_YAML;

    private $configs;
    private $services;

    function __construct() {
        $this->configs  = $this->get_yaml_contents(self::PATH_CONFIGS);
        $this->services = $this->get_yaml_contents(self::PATH_SERVICES);
    }

    private function get_yaml_contents(string $file_path) : array {
        return Yaml::parseFile($file_path);
    }

    public function get_secret(string $secret) : array {
        return $this->configs['secrets'][$secret];
    }

}


