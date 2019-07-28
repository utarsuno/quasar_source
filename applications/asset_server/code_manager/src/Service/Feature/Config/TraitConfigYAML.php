<?php declare(strict_types=1);

namespace CodeManager\Service\Feature\Config;

use function is_array;
use function is_string;
use QuasarSource\Utils\Exception\ParameterException;
use QuasarSource\Utils\File\Discrete\UtilsYAML as YAML;
use QuasarSource\Utils\DataType\UtilsArray     as ARY;

/**
 * Trait TraitConfigYAML
 * @package QuasarSource\Service\Feature\Config
 */
trait TraitConfigYAML {

    /** @var array */
    protected $config_yaml;

    public function destruct_trait_config_yaml(): void {
        unset($this->config_yaml);
    }

    /**
     * @param  array $keys
     * @param  string $path
     * @return TraitConfigYAML
     */
    protected function config_yaml_load(array $keys, string $path): self {
        return $this->config_yaml_set_data($keys, YAML::get($path));
    }

    /**
     * @param  array $keys
     * @param  array $config
     * @return TraitConfigYAML
     */
    protected function config_yaml_set_data(array $keys, array $config): self {
        foreach ($keys as $k => $v) {
            if (ARY::has_key($config, $k)) {
                $this->config_yaml[$k] = $config[$k];
            } else {
                throw ParameterException::missing_config_parameter($k);
            }
            if (is_array($v)) {
                $this->config_verify_sub_layer($v, $config[$k]);
            }
        }
        return $this;
    }

    /**
     * @param array $keys
     * @param array $layer
     * @throws ParameterException
     */
    private function config_verify_sub_layer(array $keys, array $layer): void {
        foreach ($keys as $k => $v) {
            if (ARY::is_key_missing($layer, $k)) {
                throw ParameterException::missing_config_parameter($k);
            }
            if (is_array($v)) {
                $this->config_verify_sub_layer($v, $layer[$k]);
            }
        }
    }

    /**
     * @return array
     */
    public function config_yaml_get_all(): array {
        return $this->config_yaml;
    }

    /**
     * @param  string|array $keys
     * @return mixed
     */
    public function config_yaml_get($keys) {
        if (is_string($keys)) {
            return $this->config_yaml[$keys];
        }
        #$current = $this->config_yaml;
        #foreach ($keys as $k) {
        #    $current = $current[$k];
        #}
        #return $this->config_yaml[$key];
        return array_values($this->config_yaml);
    }

}
