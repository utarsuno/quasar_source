<?php declare(strict_types=1);

namespace QuasarSource\Utils\DataType\Object;

/**
 * Class UtilsChar
 * @package QuasarSource\Utils
 */
abstract class UtilsChar {

    private const DIGITS_NUM = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    private const DIGITS_HEX = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F'];

    /**
     * @param  string $char
     * @return bool
     */
    public static function is_hex(string $char): bool {
        return in_array($char, self::DIGITS_HEX, true);
    }

    /**
     * @param  string $char
     * @return bool
     */
    public static function is_digit(string $char): bool {
        return in_array($char, self::DIGITS_NUM, true);
    }

}
