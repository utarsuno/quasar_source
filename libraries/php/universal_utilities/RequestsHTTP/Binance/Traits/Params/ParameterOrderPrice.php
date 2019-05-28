<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params;


trait ParameterOrderPrice {

    public function param_set_order_price(string $price): void {
        $this->param_set('price', $price);
    }

}
