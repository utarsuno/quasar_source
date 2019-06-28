<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnSingleValue;


class BinancePrice extends BinancePublicEndpoint {
    use ParameterSymbol;
    use ReturnSingleValue;
    // No processing of args needed.
    use NoArgs;

    public function __construct() {
        parent::__construct(self::TICKER . 'price', 'v3/');
        $this->set_return_key('price');
    }
}
