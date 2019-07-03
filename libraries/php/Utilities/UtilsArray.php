<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 17:43
 */

namespace QuasarSource\Utilities;

/**
 * Class UtilsArray
 * @package QuasarSource\Utilities
 */
abstract class UtilsArray {

    /**
     * @param $arg
     * @return array
     */
    public static function parse($arg): array {
        if (is_scalar($arg) || is_object($arg) || is_resource($arg) || $arg === null) {
            return [$arg];
        }
        if (is_array($arg)) {
            return $arg;
        }
        return null;
    }

    /**
     * @param array $nums
     * @return int|float
     */
    public static function max(array $nums) {
        $max = 0;
        foreach ($nums as $num) {
            if ($num > $max) {
                $max = $num;
            }
        }
        return $max;
    }

    /**
     * Remove the first n elements from the provided array.
     *
     * @param array $array             [The array to remove elements from.                               ]
     * @param int   $number_to_remove  [The number of elements to be removed from the start of the array.]
     */
    public static function remove_first_n(array & $array, int $number_to_remove): void {
        if ($number_to_remove <= 0 || !isset($array)) {
            return;
        }
        if ($number_to_remove >= count($array)) {
            $array = [];
        }
        $array = array_slice($array, $number_to_remove);
    }

    /**
     * Returns a boolean indicating if two arrays comprised of strings have the same elements (but not necessarily in the same order).
     *
     * @param array $a0 [The first array to compare to.                                  ]
     * @param array $a1 [The second array to compare to.                                 ]
     * @return bool     [True if both arrays have the same values, order does not matter.]
     */
    public static function string_arrays_have_same_values(array $a0, array $a1): bool {
        /** @noinspection TypeUnsafeComparisonInspection */
        return array_count_values($a0) == array_count_values($a1);
    }

    /**
     * @param array $array
     * @param $element
     * @return bool
     */
    public static function is_missing(array $array, $element): bool {
        return !in_array($element, $array, false);
        //return array_key_exists($element, $array);
    }

    /**
     * @param array $array
     * @param $element
     * @return bool
     */
    public static function contains(array $array, $element): bool {
        return in_array($element, $array, false);
        //return array_key_exists($element, $array);
    }

    public static function has_all_keys_in(array $base, array $all_keys_to_match): bool {
        foreach ($all_keys_to_match as $key) {
            if (!array_key_exists($key, $base)) {
                return false;
            }
        }
        return true;
    }

    public static function get_missing_keys_relative_to(array $base, array $all_keys_to_match): array {
        $missing_keys = [];
        foreach ($all_keys_to_match as $key) {
            if (!array_key_exists($key, $base)) {
                $missing_keys[] = $key;
            }
        }
        return $missing_keys;
    }

}
