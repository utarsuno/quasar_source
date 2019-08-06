<?php declare(strict_types=1);

namespace QuasarSource\Utils\DataType;

use function is_string;
use RuntimeException;
use function strlen;
use QuasarSource\Utils\InterfaceDivisible;

/**
 * Class UtilsString
 * @package QuasarSource\Utils\DataType
 */
abstract class UtilsString implements InterfaceDivisible {

    /**
     * @param  string $str
     * @param  string $match
     * @return bool
     */
    public static function has_only_one(string $str, string $match): bool {
        return substr_count($str, $match) === 1;
    }

    /**
     * @param  string $val
     * @return bool
     */
    public static function to_bool(string $val): bool {
        if ($val === '') {
            return false;
        }
        $lower = self::to_lower($val);
        if ($lower === 'true' || $lower === 'yes' || $lower === 'y') {
            return true;
        }
        return false;
    }

    public static function to_associative(string $raw): array {
        return json_decode($raw, true);
    }

    /**
     * @param  string $str
     * @return string
     */
    public static function to_lower(string $str): string {
        return strtolower($str);
    }

    /**
     * @param  string $str
     * @return void
     */
    public static function ref_to_lower(string & $str): void {
        $str = strtolower($str);
    }

    public static function indexed(string $str, int $start, int $end=-1): string {
        // TODO: Error checks on bad sizes given.
        if ($end === -1) {
            $end = strlen($str) - 1;
        }
        return substr($str, $start, $end);
    }

    /**
     * @param  string $str
     * @param  array  $matches
     * @return string
     */
    public static function replace_many(string $str, array $matches): string {
        foreach ($matches as $find => $replace_as) {
            $str = str_replace($find, $replace_as, $str);
        }
        return $str;
    }

    /**
     * @param  string $str
     * @param  array  $matches
     * @return void
     */
    public static function ref_replace_many(string & $str, array $matches): void {
        foreach ($matches as $find => $replace_as) {
            $str = str_replace($find, $replace_as, $str);
        }
    }

    /**
     * Returns the provided string with any matches replaced.
     *
     * @param  string $str         {string to return a modified version of}
     * @param  string $match       {text instance to find and replace     }
     * @param  string $replacement {content for replaced text instances   }
     * @return string
     */
    public static function replace(string $str, string $match, string $replacement): string {
        return str_replace($match, $replacement, $str);
    }

    /**
     * @param  string $str
     * @param  string $match
     * @param  string $replacement
     * @return void
     */
    public static function ref_replace(string & $str, string $match, string $replacement): void {
        $str = str_replace($match, $replacement, $str);
    }

    /*       __   ___  __  ___  __
     | |\ | /__` |__  |__)  |  /__`
     | | \| .__/ |___ |  \  |  .__/ */

    /**
     * @param  string $str
     * @param  string $insert
     * @param  string $after
     * @return string
     */
    public static function insert_before(string $str, string $insert, string $after): string {
        return substr_replace($str, $insert, self::position_of($str, $after, false), 0);
    }

    /**
     * @param  string $str
     * @param  string $insert
     * @param  string $after
     * @return string
     */
    public static function insert_after(string $str, string $insert, string $after): string {
        return substr_replace($str, $insert, self::position_of($str, $after, false) + 1, 0);
    }

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */

    /**
     * @param  string $str
     * @return array
     */
    public static function get_words(string $str): array {
        return preg_split('/\s+/', $str);
    }

    /**
     * @param  string $str
     * @param  string $char_start
     * @param  string $char_end
     * @return string
     */
    public static function get_text_inbetween_chars(string $str, string $char_start, string $char_end): string {
        $text       = '';
        $len        = strlen($str);
        $in_pattern = false;
        for ($c = 0; $c < $len; $c++) {
            $char = $str[$c];
            if (!$in_pattern && $char === $char_start) {
                $in_pattern = true;
            } else if ($in_pattern) {
                if ($char === $char_end) {
                    return $text;
                }
                $text .= $char;
            }
        }
        return $text;
    }

    /**
     * @param  string $str          {text to search through                  }
     * @param  array  $text_matches {text matches (sub-strings) to find/match}
     * @return int                  {-1 is returned if no match was found    }
     */
    public static function get_starts_with_index(string $str, array $text_matches): int {
        $index = 0;
        foreach ($text_matches as $text) {
            if (self::starts_with($str, $text)) {
                return $index;
            }
            ++$index;
        }
        return -1;
    }

    /**
     * @param  string $str          {text to search through                      }
     * @param  array  $text_matches {text matches (sub-strings) to find/match    }
     * @return string               {the found match or null '' if no match found}
     */
    public static function get_starts_with_match(string $str, array $text_matches): string {
        foreach ($text_matches as $text) {
            if (self::starts_with($str, $text)) {
                return $text;
            }
        }
        return '';
    }

    /**
     * @param  string $str          {text to search through                  }
     * @param  array  $text_matches {text matches (sub-strings) to find/match}
     * @return int                  {-1 is returned if no match was found    }
     */
    public static function get_match_index(string $str, array $text_matches): int {
        $index = 0;
        foreach ($text_matches as $text) {
            if (self::has($str, $text)) {
                return $index;
            }
            ++$index;
        }
        return -1;
    }

    /**
     * @param  string $str
     * @param  string $match
     * @param  bool   $first_match {if false, the position of the last match will be returned}
     * @return int
     */
    public static function position_of(string $str, string $match, bool $first_match=true): int {
        if ($first_match) {
            return strpos($str, $match);
        }
        return strrpos($str, $match);
    }

    /**
     * @param  string $str
     * @return bool
     */
    public static function has_content(string $str): bool {
        return $str && trim($str);
    }

    /**
     * Checks if provided string has any occurrences of the secondary string provided.
     *
     * @param  string $str
     * @param  string $match
     * @param  bool   $case_sensitive
     * @return bool
     */
    public static function has(string $str, string $match, bool $case_sensitive=true): bool {
        if ($match === '' || $str === '') {
            return false;
        }
        if ($case_sensitive) {
            return strpos($str, $match) !== false;
        }
        return stripos($str, $match) !== false;
    }

    /**
     * @param  string $str
     * @param  array  $matches
     * @param  bool   $case_sensitive
     * @return bool
     */
    public static function has_any(string $str, array $matches, bool $case_sensitive=true): bool {
        if ($str === '' || count($matches) === 0) {
            return false;
        }
        foreach ($matches as $match) {
            if (self::has($str, $match, $case_sensitive)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param  string $str
     * @param  string $match
     * @return bool
     */
    public static function does_not_have(string $str, string $match): bool {
        return !self::has($str, $match);
    }

    /**
     * @param  string $str
     * @return bool
     */
    public static function has_underscore(string $str): bool {
        return self::has($str, '_');
    }

    /**
     * Checks if the provided string starts with the prefix to match.
     *
     * @param  string $str    {string to search      }
     * @param  string $prefix {prefix to search for  }
     * @return bool           {true if prefix matched}
     */
    public static function starts_with(string $str, string $prefix): bool {
        if ($prefix === '') {
            return false;
        }
        return strpos($str, $prefix) === 0;
    }

    /**
     * Checks if the provided string ends with the suffix to match.
     *
     * @param  string $str          {string to search      }
     * @param  string $ending_match {suffix to search for  }
     * @return bool                 {true if suffix matched}
     */
    public static function ends_in(string $str, string $ending_match): bool {
        if ($ending_match === '') {
            return false;
        }
        return substr($str, -strlen($ending_match)) === $ending_match;
    }

    /**
     * @param  string $str
     * @param  array $ending_matches
     * @return bool
     */
    public static function ends_in_any_of(string $str, array $ending_matches): bool {
        foreach ($ending_matches as $ending) {
            if ($ending !== '' && substr($str, -strlen($ending)) === $ending) {
                return true;
            }
        }
        return false;
    }

    /*__   __         ___  __
     /__` |__) |    |  |  /__`
     .__/ |    |___ |  |  .__/ */

    /**
     * Returns an array with the provided string split based of the pattern to match.
     *
     * @param  string $str            {string to base contents off of            }
     * @param  string $delimiter      {string to match and split by              }
     * @param  bool   $keep_delimiter {if true, prepend delimiter to each segment}
     * @return array                  {array of string segments                  }
     */
    public static function split(string $str, string $delimiter=PHP_EOL, bool $keep_delimiter=false): array {
        if ($keep_delimiter) {
            $segments                = explode($delimiter, $str, PHP_INT_MAX);
            $segments_with_delimiter = [];
            foreach ($segments as $segment) {
                $segments_with_delimiter[] = $delimiter . $segment;
            }
            return $segments_with_delimiter;
        }
        return explode($delimiter, $str, PHP_INT_MAX);
    }

    /**
     * @param  string $str
     * @param  string $delimiter
     * @return array
     */
    public static function split_clean(string $str, string $delimiter=PHP_EOL): array {
        $lines   = self::split($str, $delimiter);
        $cleaned = [];
        foreach ($lines as $line) {
            if (self::has_content($line)) {
                $cleaned[] = $line;
            }
        }
        return $cleaned;
    }

    /*__   ___        __                  __
     |__) |__   |\/| /  \ \  /  /\  |    /__`
     |  \ |___  |  | \__/  \/  /~~\ |___ .__/ */

    /**
     * @param  string $str
     * @param  string $char
     * @return array
     * @throws RuntimeException
     */
    public static function remove_char_and_split(string $str, string $char): array {
        $start = '';
        $c     = 0;
        $len   = strlen($str);
        while ($c < $len) {
            $_c = $str[$c];
            if ($_c === $char) {
                return [$start, self::indexed($str, $c + 1)];
            }
            $start .= $_c;
            ++$c;
        }
        throw new RuntimeException('The string{' . $str . '} did not contain the character{' . $char . '}');
    }

    /**
     * Returns a string having the contents of the base string with any occurrences of secondary string provided removed.
     *
     * @param  string       $str   {string to base contents off of                     }
     * @param  string|array $match {string (or array of strings) to find occurrences of}
     * @return string              {a new string                                       }
     */
    public static function remove(string $str, $match): string {
        if (is_string($match)) {
            return str_replace($match, '', $str);
        }
        foreach ($match as $m) {
            $str = str_replace($m, '', $str);
        }
        return $str;
    }

    /**
     * @param  string       $str
     * @param  string|array $patterns0
     * @param  string|array $patterns1
     * @return string
     */
    public static function remove_twice(string $str, $patterns0, $patterns1): string {
        return self::remove(self::remove($str, $patterns0), $patterns1);
    }

    /**
     * @param string $str
     * @param $match
     */
    public static function ref_remove(string & $str, $match): void {
        $str = self::remove($str, $match);
    }

    /**
     * @param  string $str
     * @param  string $match
     * @param  bool   $first_match
     * @return string
     */
    public static function remove_after(string $str, string $match, bool $first_match=false): string {
        return self::indexed($str, 0, self::position_of($str, $match, $first_match) + strlen($match));
    }

    /**
     * @param  string $str
     * @param  string $match
     * @return string
     */
    public static function keep_all_before(string $str, string $match): string {
        return self::indexed($str, 0, self::position_of($str, $match));
    }

    /**
     * @param  string $str
     * @param  string $match
     * @return string
     */
    public static function remove_up_to_last_match_inclusive(string $str, string $match): string {
        return self::indexed($str, self::position_of($str, $match, false) + strlen($match), strlen($str) - 1);
    }

    /**
     * @param  string $str
     * @param  string $match
     * @return void
     */
    public static function ref_remove_up_to_last_match_inclusive(string & $str, string $match): void {
        $str = self::indexed($str, self::position_of($str, $match, false) + strlen($match), strlen($str) - 1);
    }

    /**
     * @param  string $str
     * @return string
     */
    public static function remove_last_char(string $str): string {
        return self::remove_last_n($str, 1);
    }

    /**
     * @param  string $str
     * @return void
     */
    public static function ref_remove_last_char(string & $str): void {
        $str = self::remove_last_n($str, 1);
    }

    /**
     * @param  string $str
     * @return string
     */
    public static function remove_first_char(string $str): string {
        return self::remove_first_n($str, 1);
    }

    /**
     * @param  string $str
     * @param  int    $num_digits
     * @return string
     */
    public static function remove_first_n($str, int $num_digits): string {
        return substr($str, $num_digits);
    }

    /**
     * @param  string $str
     * @param  int    $num_digits
     * @return void
     */
    public static function ref_remove_first_n(& $str, int $num_digits): void {
        $str = substr($str, $num_digits);
    }

    /**
     * @param  string $str
     * @param  int    $num_digits
     * @return string
     */
    public static function remove_last_n(string $str, int $num_digits): string {
        return substr($str, 0, strlen($str) - 1 - $num_digits);
    }

    /**
     * @param  string $str
     * @return string
     */
    public static function remove_newline(string $str): string {
        return self::replace($str, PHP_EOL, '');
    }

    /*     __        __   __   ___  __
     |  | |__)  /\  |__) |__) |__  |  \    | |\ |
     |/\| |  \ /~~\ |    |    |___ |__/    | | \| */

    /**
     * @param  string $str
     * @param  bool   $single_quotes
     * @param  bool   $replace_incorrect_quotes
     * @return string
     */
    public static function in_quotes(string $str, bool $single_quotes=true, bool $replace_incorrect_quotes=true): string {
        $quote = $single_quotes ? "'" : '"';
        if ($replace_incorrect_quotes) {
            $wrong_quote = $single_quotes ? '"' : "'";
            if (self::starts_with($str, $wrong_quote)) {
                $str = self::remove_first_char($str);
            }
            if (self::ends_in($str, $wrong_quote)) {
                $str = self::remove_last_char($str);
            }
        }
        return self::ensure_wrapped_in($str, $quote, $quote);
    }

    /**
     * @param  string $str
     * @param  $value
     * @return string
     */
    public static function parentheses(string $str, $value): string {
        return $str . self::ensure_wrapped_in($value, '(', ')');
    }

    /**
     * @param  string $str
     * @param  $value
     * @return string
     */
    public static function brackets(string $str, $value): string {
        return $str . self::ensure_wrapped_in($value, '{', '}');
    }

    /**
     * @param  string $str
     * @param  string $start_with
     * @param  string $end_with
     * @return string
     */
    public static function ensure_wrapped_in(string $str, string $start_with, string $end_with): string {
        return self::ensure_ending(self::ensure_start($str, $start_with), $end_with);
    }

    /*___       __        __   ___
     |__  |\ | /__` |  | |__) |__
     |___ | \| .__/ \__/ |  \ |___ */

    /**
     * @param  string $str
     * @param  string $match
     * @return string
     */
    public static function ensure_start_is_not(string $str, string $match): string {
        if (self::starts_with($str, $match)) {
            return self::remove_first_n($str, strlen($match));
        }
        return $str;
    }

    /**
     * @param  string $str
     * @param  string $match
     * @return string
     */
    public static function ensure_ending_is_not(string $str, string $match): string {
        if (self::ends_in($str, $match)) {
            return self::remove_last_n($str, strlen($match));
        }
        return $str;
    }

    /**
     * @param  string $str
     * @param  string $start_with
     * @return string
     */
    public static function ensure_start(string $str, string $start_with): string {
        if (!self::starts_with($str, $start_with)) {
            return $start_with . $str;
        }
        return $str;
    }

    /**
     * @param  string $str
     * @param  string $ends_with
     * @return string
     */
    public static function ensure_ending(string $str, string $ends_with): string {
        if (!self::ends_in($str, $ends_with)) {
            return $str . $ends_with;
        }
        return $str;
    }
}
