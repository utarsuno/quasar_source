<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utilities\RequestsHTTP\Binance\BinanceRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnSingleValue;


class BinancePrice extends BinanceRequest {
    use ParameterSymbol;
    use ReturnSingleValue;
    // No processing of args needed.
    use NoArgs;

    public function __construct() {
        parent::__construct(self::API_V3 . self::TICKER . 'price');
        $this->set_return_key('price');
    }
}
