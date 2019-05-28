<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params;


trait ParameterOrderID {

    public function param_set_order_id(string $order_id): void {
        $this->param_set('orderId', $order_id);
    }

}
