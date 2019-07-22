<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Endpoint;

use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;

/**
 * Class BinanceStatistics
 * @package QuasarSource\Utils\RequestsHTTP\Binance\Endpoint
 */
class BinanceStatistics extends BinancePublicEndpoint {
    use ParameterSymbol;
    use ReturnResultAsIs;
    // No processing of args needed.
    use NoArgs;

    public function __construct() {
        parent::__construct(self::TICKER . '24hr');
    }
}
