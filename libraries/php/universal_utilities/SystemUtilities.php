<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:29
 */

namespace QuasarSource\Utilities;
use http\Exception\RuntimeException;
use QuasarSource\Utilities\StringUtilities as STR;

/**
 * Class SystemUtilities
 * @package QuasarSource\Utilities
 */
final class SystemUtilities {

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
        throw new RuntimeException();
    }

    #public static function get_ini_val(string $ini_key) {
    #}

}
