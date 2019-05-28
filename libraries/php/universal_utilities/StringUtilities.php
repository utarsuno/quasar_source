<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 17:43
 */

namespace QuasarSource\Utilities;


abstract class StringUtilities {

    public static function to_associative(string $raw): array {
        return json_decode($raw, true);
    }

    public static function url_GET_params(array $params): string {
        return http_build_query($params, '', '&');
    }

    public static function wrapped_in_quotes(string $base, bool $single_quotes=true, bool $replace_incorrect_quotes=true): string {
        $quote = $single_quotes ? "'" : '"';
        $text  = $base;
        if ($replace_incorrect_quotes) {
            $wrong_quote = $single_quotes ? '"' : "'";
            if (self::starts_with($base, $wrong_quote)) {
                $text = self::indexed($base, 1);
            }
            if (self::ends_with($base, $wrong_quote)) {
                $text = self::indexed($base, 0, strlen($text) - 2);
            }
        }
        if (!self::starts_with($base, $quote)) {
            $text = $quote . $text;
        }
        if (!self::ends_with($base, $quote)) {
            $text .= $quote;
        }
        return $text;
    }

    /**
     * Returns a string having the contents of the base string with any occurrences of secondary string provided removed.
     *
     * @param string       $base  < The string to base contents off of.                      >
     * @param string|array $match < The string (or array of strings) to find occurrences of. >
     * @return string             < A new string.                                            >
     */
    public static function get_matches_removed(string $base, $match): string {
        if (is_string($match)) {
            return str_replace($match, '', $base);
        }
        foreach ($match as $m) {
            $base = str_replace($m, '', $base);
        }
        return $base;
    }

    /**
     * Returns an array with the provided string split based of the pattern to match.
     *
     * @param string $base      < The string to base contents off of. >
     * @param string $delimiter < The string to match and split by.   >
     * @return array            < An array of string segments.        >
     */
    public static function split(string $base, string $delimiter=PHP_EOL): array {
        return explode($delimiter, $base, PHP_INT_MAX);
    }

    public static function split_into_non_empty_lines(string $base): array {
        $lines = [];
        foreach (self::split($base) as $line) {
            if ($line !== '') {
                $lines[] = $line;
            }
        }
        return $lines;
    }

    /**
     * Checks if provided string has any occurrences of the secondary string provided.
     *
     * @param string $base  < The string to search.     >
     * @param string $match < The string to search for. >
     * @return bool         < True if contained.        >
     */
    public static function contains(string $base, string $match): bool {
        if ($match === '') {
            return false;
        }
        return strpos($base, $match) !== false;
    }

    public static function remove_newline(string $base): string {
        return self::replace($base, PHP_EOL, '');
    }

    public static function position_of_last_match(string $base, string $match): int {
        $pos = strrpos($base, $match);
        if ($pos === false) {
            var_dump('POSITION NOT FOUND!');
        }
        return $pos;
    }

    public static function indexed_inclusive_to_last_match(string $base, string $match): string {
        return self::indexed($base, 0, self::position_of_last_match($base, $match) + strlen($match));
    }

    public static function indexed(string $base, int $start, int $end=-1): string {
        // TODO: Error checks on bad sizes given.
        if ($end === -1) {
            $end = strlen($base) - 1;
        }
        return substr($base, $start, $end);
    }

    /**
     * Ensures the provided string starts with the provided sequence.
     *
     * @param string $base   < The string to potentially modify.                          >
     * @param string $prefix < The string sequence to ensure the base string starts with. >
     */
    public static function ensure_starts_with(string & $base, string $prefix): void {
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
    public static function formatted_number(float $number, int $number_of_decimals=3): string {
        return number_format($number, $number_of_decimals, '.', '');
    }

    /**
     * Returns the provided string with any matches replaced.
     *
     * @param string $base        < The string to return a modified version of. >
     * @param string $match       < Text instance to find and replace.          >
     * @param string $replacement < Content for replaced text instances.        >
     * @return string
     */
    public static function replace(string $base, string $match, string $replacement): string {
        return str_replace($match, $replacement, $base);
    }

}
