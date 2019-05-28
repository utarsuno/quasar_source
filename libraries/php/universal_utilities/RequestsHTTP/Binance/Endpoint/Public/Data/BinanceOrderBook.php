<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utilities\RequestsHTTP\Binance\BinanceRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterOptionalLimit;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;


class BinanceOrderBook extends BinanceRequest {
    use ParameterSymbol;
    use ParameterOptionalLimit;
    use ReturnResultAsIs;
    // No processing of args needed.
    use NoArgs;

    # Caution: setting limit=0 can return a lot of data.

    public function __construct() {
        parent::__construct(self::API_V1 . 'depth');
        $this->allowed_parameter_limit_values = [5, 10, 20, 50, 100, 500, 1000];
    }
}
