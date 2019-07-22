<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params;

trait ParameterOrderPrice {

    public function param_set_order_price(string $price): void {
        $this->param_set('price', $price);
    }

}
