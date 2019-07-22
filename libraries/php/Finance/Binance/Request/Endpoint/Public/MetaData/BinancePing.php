<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Endpoint;

use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Output\BooleanResponse;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\NoArgs;

/**
 * Class BinancePing
 * @package QuasarSource\Utils\RequestsHTTP\Binance\Endpoint
 */
class BinancePing extends BinancePublicEndpoint {
    use NoArgs;
    use BooleanResponse;

    public function __construct() {
        parent::__construct('ping');
    }
}
