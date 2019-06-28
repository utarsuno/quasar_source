<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utilities\RequestsHTTP\AbstractRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\BinanceRequest;


abstract class BinancePublicEndpoint extends BinanceRequest {

    public function __construct(string $endpoint, string $api_version='v1/') {
        parent::__construct($api_version . $endpoint, AbstractRequest::REQUEST_TYPE_GET);
    }

}