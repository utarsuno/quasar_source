<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;

/**
 * Class BinanceExchangeInfo
 * @package QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint
 */
class BinanceExchangeInfo extends BinancePublicEndpoint {
    use NoArgs;
    use ReturnResultAsIs;

    public function __construct() {
        parent::__construct('exchangeInfo');
    }

}
