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

}
