<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Endpoint;

use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;

/**
 * Class BinanceExchangeInfo
 * @package QuasarSource\Utils\RequestsHTTP\Binance\Endpoint
 */
class BinanceExchangeInfo extends BinancePublicEndpoint {
    use NoArgs;
    use ReturnResultAsIs;

    public function __construct() {
        parent::__construct('exchangeInfo');
    }

}
