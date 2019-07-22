<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\Orders;

/**
 * Class BinanceBuy
 * @package QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\Orders
 */
class BinanceBuy extends BinanceOrderAbstract {

    /**
     * BinanceBuy constructor.
     * @param string $api_key
     * @param string $api_secret
     */
    public function __construct(string $api_key, string $api_secret) {
        parent::__construct($api_key, $api_secret);
        $this->set_order_side_to_buy();
    }
}