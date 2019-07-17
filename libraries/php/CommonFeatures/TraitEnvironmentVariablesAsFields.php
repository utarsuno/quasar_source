<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:21
 */

namespace QuasarSource\CommonFeatures;

use QuasarSource\Utilities\DataType\UtilsString as STR;
use QuasarSource\Utilities\SystemOS\UtilsSystem as SYS;

/**
 * Trait TraitAliveOrDead
 * @package QuasarSource\CommonFeatures
 */
trait TraitEnvironmentVariablesAsFields {

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

    public function trait_destruct_env_vars_as_fields(): void {
        #unset($this->environments_variables);
    }
}
