<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\Orders;

use QuasarSource\Utils\HTTP\UtilsHTTP;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterOrderID;

/**
 * Class BinanceCancelOrder
 * @package QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\Orders
 */
class BinanceCancelOrder extends BinanceOrderAbstract {
    use ParameterOrderID;

    /**
     * BinanceCancelOrder constructor.
     * @param string $api_key
     * @param string $api_secret
     */
    public function __construct(string $api_key, string $api_secret) {
        parent::__construct($api_key, $api_secret, UtilsHTTP::REQUEST_TYPE_DELETE);
    }
}