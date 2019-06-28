<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params;


trait ParameterOrderQuantity {

    public function param_set_order_quantity(int $quantity): void {
        $this->param_set('quantity', $quantity);
    }

}
