<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utils\RequestsHTTP\Binance\BinanceHTTPRequest;

/**
 * Class BinancePublicEndpoint
 * @package QuasarSource\Utils\RequestsHTTP\Binance\Endpoint
 */
abstract class BinancePublicEndpoint extends BinanceHTTPRequest {

    /**
     * BinancePublicEndpoint constructor.
     * @param string $endpoint
     * @param string $api_version
     */
    public function __construct(string $endpoint, string $api_version=self::API_V1) {
        parent::__construct($api_version . $endpoint);
    }

}