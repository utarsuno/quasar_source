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

    /**
     * Returns a string having the contents of the first string with any occurrences of secondary string provided removed.
     *
     * @param string $base  < The string to base contents off of. >
     * @param string $match < The string to find occurrences of.  >
     * @return string       < A new string.                       >
     */
    public static function get_matches_removed(string $base, string $match) : string {
        return str_replace($match, '', $base);
    }

    /**
     * Checks if provided string has any occurrences of the secondary string provided.
     *
     * @param string $base  < The string to search.     >
     * @param string $match < The string to search for. >
     * @return bool         < True if contained.        >
     */
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

}
