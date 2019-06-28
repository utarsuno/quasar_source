<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure\Orders;


class BinanceBuy extends BinanceOrderAbstract {

    public function __construct(string $api_key, string $api_secret) {
        parent::__construct($api_key, $api_secret);
        $this->set_order_side_to_buy();
    }
}