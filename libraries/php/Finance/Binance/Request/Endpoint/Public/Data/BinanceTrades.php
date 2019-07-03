<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterOptionalLimit;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;

/**
 * Class BinanceTrades
 * @package QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint
 */
class BinanceTrades extends BinancePublicEndpoint {
    use ParameterSymbol;
    use ParameterOptionalLimit;
    use ReturnResultAsIs;
    // No processing of args needed.
    use NoArgs;

    public function __construct() {
        parent::__construct('trades');
    }
}
