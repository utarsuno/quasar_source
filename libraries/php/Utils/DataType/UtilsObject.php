<?php declare(strict_types=1);

namespace QuasarSource\Utils\DataType\Object;

use InvalidArgumentException;
use QuasarSource\Utils\DataType\UtilsTextLines as TEXT_LINES;

/**
 * Class UtilsObject
 * @package QuasarSource\Utils
 */
abstract class UtilsObject {

    /**
     * @param  string|object $object
     * @param  string|null   $optional_start_string
     * @return array
     */
    public static function get_functions($object, string $optional_start_string=null): array {
        if (is_object($object)) {
            $object = get_class($object);
        } else if (!is_string($object)) {
            throw new InvalidArgumentException('get_function_of requires an object or string provided!');
        }
        if ($optional_start_string === null) {
            return get_class_methods($object);
        }
        return TEXT_LINES::get_lines_starting_with(get_class_methods($object), $optional_start_string);
    }

}
