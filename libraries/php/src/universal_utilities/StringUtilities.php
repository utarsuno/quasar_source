<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 17:43
 */

namespace QuasarSource\Utilities;
require_once '/quasar_source/libraries/php/autoload.php';


class StringUtilities {

    public static function contains(string $base, string $match) : bool {
        if ($match === '') {
            return false;
        }
        return strpos($base, $match) !== false;
    }

    public static function starts_with(string $base, string $start) : bool {
        if ($start === '') {
            return false;
        }
        return strpos($base, $start) === 0;
    }

    public static function ends_with(string $base, string $end) : bool {
        if ($end === '') {
            return false;
        }
        return substr($base, -strlen($end)) === $end;
    }

    public static function get_matches_removed(string $base, string $match) : string {
        return str_replace($match, '', $base);
    }

    public static function get_enclosed_in(string $base, string $enclosing_character) : string {
        $string = $base;
        if (!self::starts_with($string, $enclosing_character)) {
            $string = $enclosing_character . $string;
        }
        if (!self::ends_with($string, $enclosing_character)) {
            $string .= $enclosing_character;
        }
        return $string;
    }

}
