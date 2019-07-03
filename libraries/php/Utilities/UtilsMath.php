<?php declare(strict_types=1);

namespace QuasarSource\Utilities;

/**
 * Class UtilsMath
 * @package QuasarSource\Utilities
 */
abstract class UtilsMath {

    /**
     * Utility function to get either a numerical or string representation on the % decreases from $base to $new.
     *
     * @param float $base           [The starting number.             ]
     * @param float $new            [The ending number.               ]
     * @param bool  $get_as_string  [If true, output will be a string.]
     * @return float|string
     */
    public static function percentage_decreased(float $base, float $new, bool $get_as_string) {
        $percentage = ($base - $new) / $base;
        if ($get_as_string) {
            return self::formatted_percentage(100 * $percentage);
        }
        return $percentage;
    }

    /**
     * @param $number
     * @return string
     */
    public static function formatted_percentage($number): string {
        return self::formatted($number) . '%';
    }

    /**
     * Returns the provided number as a string with a set number of decimal places.
     *
     * @param float|string $number             [The number to format convert.                          ]
     * @param int          $number_of_decimals [The number of decimal places to display, defaults to 3.]
     * @return string                          [A string format representation of the number provided. ]
     */
    public static function formatted($number, int $number_of_decimals=3): string {
        if (is_string($number)) {
            $number = (float) $number;
        }
        return number_format($number, $number_of_decimals, '.', '');
    }

}
