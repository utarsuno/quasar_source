<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:21
 */

namespace QuasarSource\Traits;

use QuasarSource\Utilities\Exceptions\ExceptionInvalidConfigurationFile;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;


trait TraitConfigParams {

    /** @var array */
    protected $config_data = [];

    /**
     * @param array $keys
     * @param array $config
     * @throws ExceptionInvalidConfigurationFile
     */
    public function config_initialize(array $keys, array $config): void {
        foreach ($keys as $k => $v) {
            if (array_key_exists($k, $config)) {
                $this->config_data[$k] = $config[$k];
            } else {
                DBG::throw_exception_config_file($k);
            }

            if (is_array($v)) {
                $this->config_verify_sub_layer($v, $config[$k]);
            }
        }
    }

    /**
     * @param array $keys
     * @param array $layer
     * @throws ExceptionInvalidConfigurationFile
     */
    public function config_verify_sub_layer(array $keys, array $layer): void {
        foreach ($keys as $k => $v) {
            if (!array_key_exists($k, $layer)) {
                DBG::throw_exception_config_file($k);
            }
            if (is_array($v)) {
                $this->config_verify_sub_layer($v, $layer[$k]);
            }
        }
    }

    /**
     * @param null $keys
     * @return mixed
     */
    public function config_get($keys=null) {
        if ($keys === null) {
            return $this->config_data;
        }
        if (is_string($keys)) {
            return $this->config_data[$keys];
        }
        $current = $this->config_data;
        foreach ($keys as $k) {
            $current = $current[$k];
        }
        return $current;
    }

    # TODO:
    #public function config_get_leaf(string $key) {
    #}

}
