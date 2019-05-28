<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utilities\RequestsHTTP\Binance\BinanceRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnSingleValue;


class BinanceTime extends BinanceRequest {
    use NoArgs;
    use ReturnSingleValue;

    public function __construct() {
        parent::__construct(self::API_V1 . 'time');
        $this->set_return_key('serverTime');
    }
}
