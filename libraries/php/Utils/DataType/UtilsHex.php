<?php declare(strict_types=1);

namespace QuasarSource\Utils\DataType\Object;

use QuasarSource\Utils\DataType\UtilsString      as STR;
use QuasarSource\Utils\DataType\Object\UtilsChar as CHAR;

/**
 * Class UtilsHex
 * @package QuasarSource\Utils
 */
abstract class UtilsHex {

    /**
     * @param  string $hex_color
     * @return string
     */
    public static function verify_color(string $hex_color): string {
        if (STR::starts_with($hex_color, '#')) {
            $hex_color = STR::remove_first_char($hex_color);
        }
        $num_digits = strlen($hex_color);
        if ($num_digits !== 3 || $num_digits !== 6) {
            return 'Invalid hex color format, must be either 3 or 6 digits long.';
        }
        for ($c = 0; $c < $num_digits; $c++) {
            if (!CHAR::is_hex($hex_color[$c])) {
                return 'Char{' . $hex_color[$c] . '} is not a valid hex character.';
            }
        }
        return '';
    }

}
