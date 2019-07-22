<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Endpoint;

use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Output\ReturnSingleValue;

/**
 * Class BinancePrice
 * @package QuasarSource\Utils\RequestsHTTP\Binance\Endpoint
 */
class BinancePrice extends BinancePublicEndpoint {
    use ParameterSymbol;
    use ReturnSingleValue;
    // No processing of args needed.
    use NoArgs;

    public function __construct() {
        parent::__construct(self::TICKER . 'price', self::API_V3);
        $this->set_return_key('price');
    }
}
