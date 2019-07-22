<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\Orders;

use QuasarSource\Finance\Binance\Enum\BinanceEnumOrderSide   as ORDER_SIDE;
use QuasarSource\Finance\Binance\Enum\BinanceEnumTimeInForce as TIME_IN_FORCE;
use QuasarSource\Finance\Binance\Enum\BinanceEnumOrderTypes  as ORDER_TYPES;
use QuasarSource\Utils\HTTP\UtilsHTTP;
use QuasarSource\Utils\RequestsHTTP\Binance\BinanceSecureRequest;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterOrderPrice;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterOrderSide;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterOrderTimeInForce;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterOrderType;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterOrderQuantity;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;

/**
 * Class BinanceOrderAbstract
 * @package QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\Orders
 */
class BinanceOrderAbstract extends BinanceSecureRequest {
    use ReturnResultAsIs;
    use ParameterSymbol;
    use ParameterOrderSide;
    use ParameterOrderType;
    use ParameterOrderQuantity;
    use ParameterOrderPrice;
    use ParameterOrderTimeInForce;
    // No processing of args needed.
    use NoArgs;

    /**
     * BinanceOrderAbstract constructor.
     * @param string $api_key
     * @param string $api_secret
     * @param string $request_type
     */
    public function __construct(string $api_key, string $api_secret, string $request_type=UtilsHTTP::REQUEST_TYPE_POST) {
        parent::__construct('order', $api_key, $api_secret, $request_type);
        $this->param_set_order_time_in_force(TIME_IN_FORCE::GOOD_TILL_CANCELLED);
        $this->param_set_order_type(ORDER_TYPES::LIMIT);
    }

    public function set_order_side_to_buy(): void {
        $this->param_set_order_side(ORDER_SIDE::BUY);
    }

    public function set_order_side_to_sell(): void {
        $this->param_set_order_side(ORDER_SIDE::SELL);
    }
}