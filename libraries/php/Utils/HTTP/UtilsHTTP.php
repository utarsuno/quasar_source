<?php declare(strict_types=1);

namespace QuasarSource\Utils\HTTP;

/**
 * Class UtilsHTTP
 * @package QuasarSource\Utils\HTTP
 */
abstract class UtilsHTTP {

    public const NEW_LINE            = "\r\n";
    public const HEADER_DEFAULT      = 'User-Agent: Mozilla/4.0 (compatible; PHP API)';
    public const REQUEST_TYPE_GET    = 'GET';
    public const REQUEST_TYPE_POST   = 'POST';
    public const REQUEST_TYPE_DELETE = 'DELETE';

    /**
     * Executes a HTTP request.
     *
     * @param string $url
     * @param array  $stream_context_settings
     * @return string
     */
    public static function execute(string $url, array $stream_context_settings): string {
        return file_get_contents($url, false, stream_context_create($stream_context_settings));
    }

    /**
     * @param array|string $lines
     * @return string
     */
    public static function get_header_text($lines): string {
        if (is_string($lines)) {
            return $lines . self::NEW_LINE;
        }
        $header = '';
        foreach ($lines as $line) {
            $header .= $line . self::NEW_LINE;
        }
        return $header;
    }

}
