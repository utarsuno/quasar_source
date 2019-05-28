<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params;


trait ParameterOrderType {

    public function param_set_order_type(string $type): void {
        $this->param_set('type', $type);
    }

}
