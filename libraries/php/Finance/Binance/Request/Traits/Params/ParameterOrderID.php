<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params;

trait ParameterOrderID {

    public function param_set_order_id(string $order_id): void {
        $this->param_set('orderId', $order_id);
    }

}
