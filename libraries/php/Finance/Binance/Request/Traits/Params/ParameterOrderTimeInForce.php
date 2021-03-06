<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params;

trait ParameterOrderTimeInForce {

    public function param_set_order_time_in_force(string $time_in_force): void {
        $this->param_set('timeInForce', $time_in_force);
    }

}
