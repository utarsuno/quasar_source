<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Endpoint;

use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterOptionalLimit;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;

/**
 * Class BinanceOrderBook
 * @package QuasarSource\Utils\RequestsHTTP\Binance\Endpoint
 */
class BinanceOrderBook extends BinancePublicEndpoint {
    use ParameterSymbol;
    use ParameterOptionalLimit;
    use ReturnResultAsIs;
    // No processing of args needed.
    use NoArgs;

    # Caution: setting limit=0 can return a lot of data.

    public function __construct() {
        parent::__construct('depth');
        $this->allowed_parameter_limit_values = [5, 10, 20, 50, 100, 500, 1000];
    }
}
