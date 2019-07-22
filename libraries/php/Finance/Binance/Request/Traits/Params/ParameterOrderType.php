<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params;

trait ParameterOrderType {

    public function param_set_order_type(string $type): void {
        $this->param_set('type', $type);
    }

}
