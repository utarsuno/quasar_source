<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 17:43
 */

namespace QuasarSource\Utilities;


class StringUtilities {

    /**
     * Returns a string having the contents of the base string with any occurrences of secondary string provided removed.
     *
     * @param string $base  < The string to base contents off of. >
     * @param string $match < The string to find occurrences of.  >
     * @return string       < A new string.                       >
     */
    public static function get_matches_removed(string $base, string $match) : string {
        return str_replace($match, '', $base);
    }

    /**
     * Returns a string having the contents of the base string with any occurrences of any found string, provided from array, removed.
     *
     * @param string $base             < The string to base contents off of.                                 >
     * @param array $matches_to_remove < A list of matches to remove from the base string (a copy returned). >
     * @return string                  < A new string.                                                       >
     */
    public static function get_list_of_matches_removed(string $base, array $matches_to_remove) : string {
        $b = $base;
        foreach ($matches_to_remove as $match) {
            $b = str_replace($match, '', $b);
        }
        return $b;
    }

    /**
     * Returns an array with the provided string split based of the pattern to match.
     *
     * @param string $base      < The string to base contents off of. >
     * @param string $delimiter < The string to match and split by.   >
     * @return array            < An array of string segments.        >
     */
    public static function split(string $base, string $delimiter) : array {
        return explode($delimiter, $base, PHP_INT_MAX);
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

    /**
     * Ensures the provided string starts with the provided sequence.
     *
     * @param string $base   < The string to potentially modify.                          >
     * @param string $prefix < The string sequence to ensure the base string starts with. >
     */
    public static function ensure_starts_with(string & $base, string $prefix) : void {
        if (!self::starts_with($base, $prefix)) {
            $base = $prefix . $base;
        }
    }

    /**
     * Checks if the provided string starts with the prefix to match.
     *
     * @param string $base   < The string to search.     >
     * @param string $prefix < The prefix to search for. >
     * @return bool          < True if prefix matched.   >
     */
    public static function starts_with(string $base, string $prefix) : bool {
        if ($prefix === '') {
            return false;
        }
        return strpos($base, $prefix) === 0;
    }

    /**
     * Checks if the provided string ends with the suffix to match.
     *
     * @param string $base   < The string to search.     >
     * @param string $suffix < The suffix to search for. >
     * @return bool          < True if suffix matched.   >
     */
    public static function ends_with(string $base, string $suffix) : bool {
        if ($suffix === '') {
            return false;
        }
        return substr($base, -strlen($suffix)) === $suffix;
    }

    /**
     * Returns the provided number as a string with a set number of decimal places.
     *
     * @param float $number           < The number to format convert.                           >
     * @param int $number_of_decimals < The number of decimal places to display, defaults to 3. >
     * @return string                 < A string format representation of the number provided.  >
     */
    public static function formatted_number(float $number, int $number_of_decimals=3) : string {
        return number_format($number, $number_of_decimals, '.', '');
    }

}
