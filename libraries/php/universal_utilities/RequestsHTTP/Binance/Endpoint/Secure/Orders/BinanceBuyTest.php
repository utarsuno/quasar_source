<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure\Orders;
use QuasarSource\Finance\Binance\Enum\BinanceEnumOrderSide as ORDER_SIDE;
use QuasarSource\Utilities\RequestsHTTP\AbstractRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\BinanceSecureRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\BooleanResponse;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterOrderPrice;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterOrderSide;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterOrderTimeInForce;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterOrderType;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterOrderQuantity;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;


class BinanceBuyTest extends BinanceSecureRequest {
    use BooleanResponse;
    use ParameterSymbol;
    use ParameterOrderSide;
    use ParameterOrderType;
    use ParameterOrderQuantity;
    use ParameterOrderPrice;
    use ParameterOrderTimeInForce;
    // No processing of args needed.
    use NoArgs;

    public function __construct(string $api_key, string $api_secret) {
        parent::__construct(self::API_V3 . 'order/test', $api_key, $api_secret, AbstractRequest::REQUEST_TYPE_POST);
        $this->param_set_order_side(ORDER_SIDE::BUY);
    }
}