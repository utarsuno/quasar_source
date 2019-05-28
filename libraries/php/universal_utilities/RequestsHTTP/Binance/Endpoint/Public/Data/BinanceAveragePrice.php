<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utilities\RequestsHTTP\Binance\BinanceRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;


class BinanceAveragePrice extends BinanceRequest {
    use ParameterSymbol;
    use ReturnResultAsIs;
    // No processing of args needed.
    use NoArgs;

    public function __construct() {
        parent::__construct(self::API_V3 . 'avgPrice');
    }
}
