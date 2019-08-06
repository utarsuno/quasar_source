<?php declare(strict_types=1);

namespace QuasarSource\CommonFeatures;

use QuasarSource\Utils\DataType\UtilsString as STR;
use QuasarSource\Utils\SystemOS\UtilsSystem as SYS;

/**
 * Trait TraitEnvVarsAsFields
 * @package QuasarSource\CommonFeatures
 */
trait TraitEnvVarsAsFields {

    /**
     * @param  string $field_name
     * @return mixed
     */
    public function env_get_by_field(string $field_name) {
        /** @noinspection PhpVariableVariableInspection */
        return $this->$field_name;
    }

    /**
     * @param  array $fields
     * @return void
     */
    public function envs_set_as_str(array $fields): void {
        foreach ($fields as $env_key => $field_key) {
            $this->env_set_as_str($env_key, $field_key);
        }
    }

    /**
     * @param  array $fields
     * @return void
     */
    public function envs_set_as_bool(array $fields): void {
        foreach ($fields as $env_key => $field_key) {
            $this->env_set_as_bool($env_key, $field_key);
        }
    }

    /**
     * @param  string $env_key
     * @param  string $field_key
     * @return void
     */
    public function env_set_as_str(string $env_key, string $field_key): void {
        /** @noinspection PhpVariableVariableInspection */
        $this->$field_key = SYS::get_env($env_key);
    }

    /**
     * @param  string $env_key
     * @param  string $field_key
     * @return void
     */
    public function env_set_as_bool(string $env_key, string $field_key): void {
        /** @noinspection PhpVariableVariableInspection */
        $this->$field_key = STR::to_bool(SYS::get_env($env_key));
    }

}
