<?php declare(strict_types=1);

namespace QuasarSource\Utils\SystemOS;

use QuasarSource\Utils\DataType\UtilsString as STR;

/**
 * Class UtilsSystem
 * @package QuasarSource\Utils\SystemOS
 */
abstract class UtilsSystem {

    #var_dump(opcache_get_status());
    #var_dump(opcache_get_configuration());

    public static function ask_for_garbage_collection(): void {
        gc_collect_cycles();
    }

    /**
     * @return string
     */
    public static function get_php_version(): string {
        # TODO: find something closer to running the command: {php -v}
        return PHP_VERSION; # zend_version()
    }

    /**
     * @param string $env_key
     * @return int
     */
    public static function get_env_as_int(string $env_key): int {
        /** @noinspection ReturnFalseInspection */
        $value = getenv($env_key);
        if (is_string($value)) {
            return (int) $value;
        }
        if (is_array($value)) {
            return (int) $value[0];
        }
        throw new \RuntimeException();
    }

    /**
     * @param string $env_key
     * @return bool
     */
    public static function env_exists(string $env_key): bool {
        return getenv($env_key) !== false;
    }

    /**
     * @param string $env_key
     * @return array|false|string
     */
    public static function get_env(string $env_key) {
        /** @noinspection ReturnFalseInspection */
        $value = getenv($env_key);
        if (is_string($value) || is_array($value)) {
            return $value;
        }
        throw new \RuntimeException();
    }

    /**
     * @param string $env_key
     * @param $value
     */
    public static function put_env(string $env_key, $value): void {
        if (is_string($value)) {
            putenv($env_key . '=' . STR::in_quotes($value));
        }
        putenv($env_key . '=' . $value);
    }

    /**
     * @param array $env_keys
     * @return array|false|string
     */
    public static function get_envs(array $env_keys): array {
        $values = [];
        foreach ($env_keys as $key) {
            $values[] = self::get_env($key);
        }
        return $values;
    }

    #public static function get_ini_val(string $ini_key) {
    #}

}
