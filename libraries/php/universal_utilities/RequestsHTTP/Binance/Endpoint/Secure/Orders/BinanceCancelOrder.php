<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure\Orders;
use QuasarSource\Utilities\RequestsHTTP\AbstractRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterOrderID;


class BinanceCancelOrder extends BinanceOrderAbstract {
    use ParameterOrderId;

    public function __construct(string $api_key, string $api_secret) {
        parent::__construct($api_key, $api_secret, AbstractRequest::REQUEST_TYPE_DELETE);
    }
}