<?php declare(strict_types=1);

namespace QuasarSource\Utilities\FTP;

use QuasarSource\Utilities\DataType\UtilsResource;

/**
 * Class MathUtilities
 * @package QuasarSource\Utilities
 */
abstract class UtilsFTP {

    public const FTP_FUNC_PASV    = 'pasv';
    public const FTP_FUNC_CONNECT = 'connect';
    public const FTP_FUNC_LOGIN   = 'login';
    public const FTP_FUNC_CLOSE   = 'close';
    public const FTP_FUNC_QUIT    = 'close'; // Alias to close

    /**
     * @param  mixed $variable
     * @return bool
     */
    public static function is_resource_a_connected_ftp_stream($variable): bool {
        return UtilsResource::is_type($variable, UtilsResource::RESOURCE_TYPE_FTP);
    }

    /**
     * @param  mixed $variable
     * @return bool
     */
    public static function is_resource_a_disconnected_ftp_stream($variable): bool {
        return UtilsResource::is_unknown($variable);
    }

}
