<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params;


trait ParameterStartOrderID {

    public function param_set_start_order_id(int $order_id): void {
        $this->param_set('orderId', $order_id);
    }

}
