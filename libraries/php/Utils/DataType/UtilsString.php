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
     * @param  string|array $lines
     * @param  string       $align_on
     * @return array
     */
    public static function column_aligned($lines, string $align_on): array {
        $depths = [];
        if (is_string($lines)) {
            $lines = self::split_clean($lines);
        }
        foreach ($lines as $line) {
            $depths[] = self::position_of($line, $align_on, false);
        }
        $num_lines = count($lines);
        $max_depth = UtilsArray::max($depths);
        for ($i = 0; $i < $num_lines; $i++) {
            $lines[$i] = self::insert_before($lines[$i], str_repeat(' ', $max_depth - $depths[$i]), $align_on);
        }
        return $lines;
    }

    /**
     * @param  string $text
     * @param  string $match
     * @return bool
     */
    public static function has_only_one(string $text, string $match): bool {
        return substr_count($text, $match) === 1;
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
     * @param  string $base
     * @return string
     */
    public static function to_lower(string $base): string {
        return strtolower($base);
    }

    /**
     * @param  string $base
     * @return void
     */
    public static function ref_to_lower(string & $base): void {
        $base = strtolower($base);
    }

    public static function indexed(string $base, int $start, int $end=-1): string {
        // TODO: Error checks on bad sizes given.
        if ($end === -1) {
            $end = strlen($base) - 1;
        }
        return substr($base, $start, $end);
    }

    /**
     * @param  string $base
     * @param  array  $matches
     * @return string
     */
    public static function replace_many(string $base, array $matches): string {
        foreach ($matches as $find => $replace_as) {
            $base = str_replace($find, $replace_as, $base);
        }
        return $base;
    }

    /**
     * @param  string $base
     * @param  array  $matches
     * @return void
     */
    public static function ref_replace_many(string & $base, array $matches): void {
        foreach ($matches as $find => $replace_as) {
            $base = str_replace($find, $replace_as, $base);
        }
    }

    /**
     * Returns the provided string with any matches replaced.
     *
     * @param  string $base        [The string to return a modified version of.]
     * @param  string $match       [Text instance to find and replace.         ]
     * @param  string $replacement [Content for replaced text instances.       ]
     * @return string
     */
    public static function replace(string $base, string $match, string $replacement): string {
        return str_replace($match, $replacement, $base);
    }

    /**
     * @param  string $base
     * @param  string $match
     * @param  string $replacement
     * @return void
     */
    public static function ref_replace(string & $base, string $match, string $replacement): void {
        $base = str_replace($match, $replacement, $base);
    }

    /*       __   ___  __  ___  __
     | |\ | /__` |__  |__)  |  /__`
     | | \| .__/ |___ |  \  |  .__/ */

    /**
     * @param  string $text
     * @param  string $insert
     * @param  string $after
     * @return string
     */
    public static function insert_before(string $text, string $insert, string $after): string {
        return substr_replace($text, $insert, self::position_of($text, $after, false), 0);
    }

    /**
     * @param  string $text
     * @param  string $insert
     * @param  string $after
     * @return string
     */
    public static function insert_after(string $text, string $insert, string $after): string {
        return substr_replace($text, $insert, self::position_of($text, $after, false) + 1, 0);
    }

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */

    /**
     * @param  string $base
     * @param  string $char_start
     * @param  string $char_end
     * @return string
     */
    public static function get_text_inbetween_chars(string $base, string $char_start, string $char_end): string {
        $text       = '';
        $len        = strlen($base);
        $in_pattern = false;
        for ($c = 0; $c < $len; $c++) {
            $char = $base[$c];
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
     * @param  string $base         [The text to search through                  ]
     * @param  array  $text_matches [The text matches (sub-strings) to find/match]
     * @return int                  [-1 is returned if no match was found        ]
     */
    public static function get_starts_with_index(string $base, array $text_matches): int {
        $index = 0;
        foreach ($text_matches as $text) {
            if (self::starts_with($base, $text)) {
                return $index;
            }
            ++$index;
        }
        return -1;
    }

    /**
     * @param  string $base         [The text to search through                  ]
     * @param  array  $text_matches [The text matches (sub-strings) to find/match]
     * @return string               [the found match or null '' if no match found]
     */
    public static function get_starts_with_match(string $base, array $text_matches): string {
        foreach ($text_matches as $text) {
            if (self::starts_with($base, $text)) {
                return $text;
            }
        }
        return '';
    }

    /**
     * @param  string $base         [The text to search through                  ]
     * @param  array  $text_matches [The text matches (sub-strings) to find/match]
     * @return int                  [-1 is returned if no match was found        ]
     */
    public static function get_match_index(string $base, array $text_matches): int {
        $index = 0;
        foreach ($text_matches as $text) {
            if (self::has($base, $text)) {
                return $index;
            }
            ++$index;
        }
        return -1;
    }

    /**
     * @param  string $base
     * @param  string $match
     * @param  bool   $first_match [If false, the position of the last match will be returned.]
     * @return int
     */
    public static function position_of(string $base, string $match, bool $first_match=true): int {
        if ($first_match) {
            return strpos($base, $match);
        }
        return strrpos($base, $match);
    }

    /**
     * @param  string $base
     * @return bool
     */
    public static function has_content(string $base): bool {
        return $base && trim($base);
    }

    /**
     * Checks if provided string has any occurrences of the secondary string provided.
     *
     * @param  string $base
     * @param  string $match
     * @param  bool   $case_sensitive
     * @return bool
     */
    public static function has(string $base, string $match, bool $case_sensitive=true): bool {
        if ($match === '' || $base === '') {
            return false;
        }
        if ($case_sensitive) {
            return strpos($base, $match) !== false;
        }
        return stripos($base, $match) !== false;
    }

    /**
     * @param  string $base
     * @param  string $match
     * @return bool
     */
    public static function does_not_have(string $base, string $match): bool {
        return !self::has($base, $match);
    }

    /**
     * @param  string $base
     * @return bool
     */
    public static function has_underscore(string $base): bool {
        return self::has($base, '_');
    }

    /**
     * Checks if the provided string starts with the prefix to match.
     *
     * @param  string $base   [The string to search.    ]
     * @param  string $prefix [The prefix to search for.]
     * @return bool           [True if prefix matched.  ]
     */
    public static function starts_with(string $base, string $prefix): bool {
        if ($prefix === '') {
            return false;
        }
        return strpos($base, $prefix) === 0;
    }

    /**
     * Checks if the provided string ends with the suffix to match.
     *
     * @param  string $base   [The string to search.    ]
     * @param  string $suffix [The suffix to search for.]
     * @return bool           [True if suffix matched.  ]
     */
    public static function ends_with(string $base, string $suffix): bool {
        if ($suffix === '') {
            return false;
        }
        return substr($base, -strlen($suffix)) === $suffix;
    }

    /*__   __         ___  __
     /__` |__) |    |  |  /__`
     .__/ |    |___ |  |  .__/ */

    /**
     * Returns an array with the provided string split based of the pattern to match.
     *
     * @param  string $base           {string to base contents off of            }
     * @param  string $delimiter      {string to match and split by              }
     * @param  bool   $keep_delimiter {if true, prepend delimiter to each segment}
     * @return array                  {array of string segments                  }
     */
    public static function split(string $base, string $delimiter=PHP_EOL, bool $keep_delimiter=false): array {
        if ($keep_delimiter) {
            $segments                = explode($delimiter, $base, PHP_INT_MAX);
            $segments_with_delimiter = [];
            foreach ($segments as $segment) {
                $segments_with_delimiter[] = $delimiter . $segment;
            }
            return $segments_with_delimiter;
        }
        return explode($delimiter, $base, PHP_INT_MAX);
    }

    /**
     * @param  string $base
     * @param  string $delimiter
     * @return array
     */
    public static function split_clean(string $base, string $delimiter=PHP_EOL): array {
        $lines   = self::split($base, $delimiter);
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
     * @param  string $base
     * @param  string $char
     * @return array
     * @throws RuntimeException
     */
    public static function remove_char_and_split(string $base, string $char): array {
        $start = '';
        $c     = 0;
        $len   = strlen($base);
        while ($c < $len) {
            $_c = $base[$c];
            if ($_c === $char) {
                return [$start, self::indexed($base, $c + 1)];
            }
            $start .= $_c;
            ++$c;
        }
        throw new RuntimeException('The string{' . $base . '} did not contain the character{' . $char . '}');
    }

    /**
     * Returns a string having the contents of the base string with any occurrences of secondary string provided removed.
     *
     * @param  string       $base  [The string to base contents off of.                     ]
     * @param  string|array $match [The string (or array of strings) to find occurrences of.]
     * @return string              [A new string.                                           ]
     */
    public static function remove(string $base, $match): string {
        if (is_string($match)) {
            return str_replace($match, '', $base);
        }
        foreach ($match as $m) {
            $base = str_replace($m, '', $base);
        }
        return $base;
    }

    /**
     * @param  string       $base
     * @param  string|array $patterns0
     * @param  string|array $patterns1
     * @return string
     */
    public static function remove_twice(string $base, $patterns0, $patterns1): string {
        return self::remove(self::remove($base, $patterns0), $patterns1);
    }

    /**
     * @param string $base
     * @param $match
     */
    public static function ref_remove(string & $base, $match): void {
        $base = self::remove($base, $match);
    }

    /**
     * @param  string $base
     * @param  string $match
     * @param  bool   $first_match
     * @return string
     */
    public static function remove_after(string $base, string $match, bool $first_match=false): string {
        return self::indexed($base, 0, self::position_of($base, $match, $first_match) + strlen($match));
    }

    /**
     * @param  string $base
     * @param  string $match
     * @return string
     */
    public static function keep_all_before(string $base, string $match): string {
        return self::indexed($base, 0, self::position_of($base, $match));
    }

    /**
     * @param  string $base
     * @param  string $match
     * @return string
     */
    public static function remove_up_to_last_match_inclusive(string $base, string $match): string {
        return self::indexed($base, self::position_of($base, $match, false) + strlen($match), strlen($base) - 1);
    }

    /**
     * @param  string $base
     * @param  string $match
     * @return void
     */
    public static function ref_remove_up_to_last_match_inclusive(string & $base, string $match): void {
        $base = self::indexed($base, self::position_of($base, $match, false) + strlen($match), strlen($base) - 1);
    }

    /**
     * @param  string $text
     * @return string
     */
    public static function remove_last_character(string $text): string {
        return self::remove_last_n($text, 1);
    }

    /**
     * @param  string $text
     * @return string
     */
    public static function remove_first_character(string $text): string {
        return self::remove_first_n($text, 1);
    }

    /**
     * @param  string $text
     * @param  int    $num_digits
     * @return string
     */
    public static function remove_first_n($text, int $num_digits): string {
        return substr($text, $num_digits);
    }

    /**
     * @param  string $text
     * @param  int    $num_digits
     * @return void
     */
    public static function ref_remove_first_n(& $text, int $num_digits): void {
        $text = substr($text, $num_digits);
    }

    /**
     * @param  string $text
     * @param  int    $num_digits
     * @return string
     */
    public static function remove_last_n(string $text, int $num_digits): string {
        return substr($text, 0, strlen($text) - 1 - $num_digits);
    }

    /**
     * @param  string $base
     * @return string
     */
    public static function remove_newline(string $base): string {
        return self::replace($base, PHP_EOL, '');
    }

    /*     __        __   __   ___  __
     |  | |__)  /\  |__) |__) |__  |  \    | |\ |
     |/\| |  \ /~~\ |    |    |___ |__/    | | \| */

    /**
     * @param  string $base
     * @param  bool   $single_quotes
     * @param  bool   $replace_incorrect_quotes
     * @return string
     */
    public static function in_quotes(string $base, bool $single_quotes=true, bool $replace_incorrect_quotes=true): string {
        $quote = $single_quotes ? "'" : '"';
        if ($replace_incorrect_quotes) {
            $wrong_quote = $single_quotes ? '"' : "'";
            if (self::starts_with($base, $wrong_quote)) {
                $base = self::remove_first_character($base);
            }
            if (self::ends_with($base, $wrong_quote)) {
                $base = self::remove_last_character($base);
            }
        }
        return self::ensure_wrapped_in($base, $quote, $quote);
    }

    /**
     * @param  string $text
     * @param  $value
     * @return string
     */
    public static function parentheses(string $text, $value): string {
        return $text . self::ensure_wrapped_in($value, '(', ')');
    }

    /**
     * @param  string $text
     * @param  $value
     * @return string
     */
    public static function brackets(string $text, $value): string {
        return $text . self::ensure_wrapped_in($value, '{', '}');
    }

    /**
     * @param  string $text
     * @param  string $start_with
     * @param  string $end_with
     * @return string
     */
    public static function ensure_wrapped_in(string $text, string $start_with, string $end_with): string {
        return self::ensure_ending(self::ensure_start($text, $start_with), $end_with);
    }

    /*___       __        __   ___
     |__  |\ | /__` |  | |__) |__
     |___ | \| .__/ \__/ |  \ |___ */

    /**
     * @param  string $base
     * @param  string $match
     * @return string
     */
    public static function ensure_start_is_not(string $base, string $match): string {
        if (self::starts_with($base, $match)) {
            return self::remove_first_n($base, strlen($match));
        }
        return $base;
    }

    /**
     * @param  string $base
     * @param  string $match
     * @return string
     */
    public static function ensure_ending_is_not(string $base, string $match): string {
        if (self::ends_with($base, $match)) {
            return self::remove_last_n($base, strlen($match));
        }
        return $base;
    }

    /**
     * @param  string $text
     * @param  string $start_with
     * @return string
     */
    public static function ensure_start(string $text, string $start_with): string {
        if (!self::starts_with($text, $start_with)) {
            return $start_with . $text;
        }
        return $text;
    }

    /**
     * @param  string $text
     * @param  string $ends_with
     * @return string
     */
    public static function ensure_ending(string $text, string $ends_with): string {
        if (!self::ends_with($text, $ends_with)) {
            return $text . $ends_with;
        }
        return $text;
    }
}
