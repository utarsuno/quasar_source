<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 17:43
 */

namespace QuasarSource\Utilities;


class ArrayUtilities {

    /**
     * Remove the first n elements from the provided array.
     *
     * @param array $array             < The array to remove elements from.                                >
     * @param int   $number_to_remove  < The number of elements to be removed from the start of the array. >
     */
    public static function remove_first_n(array & $array, int $number_to_remove) : void {
        if ($number_to_remove <= 0 || !isset($array)) {
            return;
        }
        if ($number_to_remove >= count($array)) {
            $array = [];
        }
        $array = array_slice($array, $number_to_remove);
    }

    public static function contains(array $array, $element) : bool {
        return in_array($element, $array);
        //return array_key_exists($element, $array);
    }

    public static function has_all_keys_in(array $base, array $all_keys_to_match) : bool {
        foreach ($all_keys_to_match as $key) {
            if (!array_key_exists($key, $base)) {
                return false;
            }
        }
        return true;
    }

    public static function get_all_missing_keys_relative_to(array $base, array $all_keys_to_match) : array {
        $missing_keys = [];
        foreach ($all_keys_to_match as $key) {
            if (!array_key_exists($key, $base)) {
                $missing_keys[] = $key;
            }
        }
        return $missing_keys;
    }

}
