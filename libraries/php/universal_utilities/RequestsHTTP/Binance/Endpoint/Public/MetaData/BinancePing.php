<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utilities\RequestsHTTP\Binance\BinanceRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\BooleanResponse;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;


class BinancePing extends BinanceRequest {
    use NoArgs;
    use BooleanResponse;

    public function __construct() {
        parent::__construct(self::API_V1 . 'ping');
    }
}
