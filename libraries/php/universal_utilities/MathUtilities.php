<?php


namespace QuasarSource\Utilities;
use QuasarSource\Utilities\StringUtilities as STR;


abstract class MathUtilities {

    /**
     * Utility function to get either a numerical or string representation on the % decreases from $base to $new.
     *
     * @param float $base           < The starting number.              >
     * @param float $new            < The ending number.                >
     * @param bool  $get_as_string  < If true, output will be a string. >
     * @return float|string
     */
    public static function get_percentage_decreased(float $base, float $new, bool $get_as_string) {
        $percentage = ($base - $new) / $base;
        if ($get_as_string) {
            return STR::formatted_number(100.0 * $percentage) . '%';
        }
        return $percentage;
    }

}
