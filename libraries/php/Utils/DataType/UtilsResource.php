<?php declare(strict_types=1);

namespace QuasarSource\Utils\DataType;

/**
 * Class UtilsResource
 * @package QuasarSource\Utils\DataType
 */
abstract class UtilsResource {

    public const RESOURCE_TYPE_UNKNOWN = 'Unknown';
    public const RESOURCE_TYPE_FTP     = 'FTP Buffer';

    /**
     * @param  mixed  $variable
     * @param  string $resource_type
     * @return bool
     */
    public static function is_type($variable, string $resource_type): bool {
        return is_resource($variable) && get_resource_type($variable) === $resource_type;
    }

    /**
     * @param  $variable
     * @return bool
     */
    public static function is_unknown($variable): bool {
        return self::is_type($variable, self::RESOURCE_TYPE_UNKNOWN);
    }

}
