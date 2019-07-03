<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnSingleValue;

/**
 * Class BinanceTime
 * @package QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint
 */
class BinanceTime extends BinancePublicEndpoint {
    use NoArgs;
    use ReturnSingleValue;

    public function __construct() {
        parent::__construct('time');
        $this->set_return_key('serverTime');
    }
}
