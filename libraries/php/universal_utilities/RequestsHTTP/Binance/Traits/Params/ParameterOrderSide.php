<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params;


trait ParameterOrderSide {

    public function param_set_order_side(string $side): void {
        $this->param_set('side', $side);
    }

}
