<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utilities\RequestsHTTP\Binance\BinanceRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;


class BinanceExchangeInfo extends BinanceRequest {
    use NoArgs;
    use ReturnResultAsIs;

    public function __construct() {
        parent::__construct(self::API_V1 . 'exchangeInfo');
    }

}
