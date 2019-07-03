<?php declare(strict_types=1);

namespace QuasarSource\Utilities;

/**
 * Class UtilsResource
 * @package QuasarSource\Utilities
 */
abstract class UtilsResource {

    /**
     * @param $variable
     * @param string $resource_type
     * @return bool
     */
    public static function is_type($variable, string $resource_type): bool {
        return is_resource($variable) && get_resource_type($variable) === $resource_type;
    }

    /**
     * @param $variable
     * @return bool
     */
    public static function is_unknown($variable): bool {
        return self::is_type($variable, 'Unknown');
    }

}
