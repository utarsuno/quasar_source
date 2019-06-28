<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\BooleanResponse;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;


class BinancePing extends BinancePublicEndpoint {
    use NoArgs;
    use BooleanResponse;

    public function __construct() {
        parent::__construct('ping');
    }
}
